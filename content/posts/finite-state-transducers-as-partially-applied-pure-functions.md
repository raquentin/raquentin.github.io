---
title: "Finite-state transducers as partially-applied pure functions"
date: 10-11-2024
tags:
  - haskell
  - automata
  - fpga
  - hft
---

Software is great, but sometimes life is too short to write programs bound by pipelined processors, one-size-fits-all arithmetic units, and network cards.

High-frequency trading systems exemplify this. When counting latency in nanoseconds, every clock cycle matters. This is why trading applications like [punt-engine](https://github.com/raquentin/punt-engine) are implemented in hardware description languages (HDLs) that "compile" to configurations of registers and digital logic, unlike traditional programming languages that instruct pre-built processors.

This post is primarily a resource for new punt-engine contributors to see first-hand how we describe hardware using a functional (as in pure and declarative, not just "working") HDL. Others can find a quite beautiful application of a typed lambda calculus to map input wires to output wires in described circuits, producing faster applications than would be in C[^1]; $\implies$ Haskell is faster than C (╯°□°)╯︵ ┻━┻.

## Finite state machines

Finite state machines (FSMs) model computation by defining a finite set of program states, an initial state, and a function deriving state transitions from inputs. Transducers are a class of state machines often used to control applications. There's two distinct types: Moore machines and Mealy machines.

## Moore machine

In a Moore machine, outputs are determined solely by the current state. Outputs only change when state changes, irrespective of the input.

Consider a trivial traffic light controller with three states: red, green, and yellow. The output (the color displayed on the light) depends only on the state. Each clock cycle, the traffic light switches to the next state in a loop (Red -> Green -> Yellow -> Red ...).

We can implement this FSM in hardware using a semantic subset of Haskell via [Clash](https://clash-lang.org).

```haskell
-- enable some language pragmas (compiler options) that provide some convenience for using our types
{-# LANGUAGE DataKinds #-}
{-# LANGUAGE ScopedTypeVariables #-}

-- import Clash's fns and types for hardware synthesis
import Clash.Prelude

-- define the states: Red, Green, or Yellow
data TrafficState = Red | Green | Yellow deriving (Eq, Show, Enum)

-- define the output type
-- Signals are like wires, they represent values over time
type TrafficOutput = Signal System TrafficState

-- implement our Moore machine
-- H.C.R.E. dom abstracts away Clock, Reset, and Enable signals into a clock domain called "dom"
-- the trafficMoore function takes two parameters:
--    TrafficState, a current state
--    dom, which wraps Clock and Reset.
-- we return a TrafficOutput, defined as a Signal holding our TrafficState
trafficMoore :: HiddenClockResetEnable dom => TrafficState -> Signal dom () -> TrafficOutput
trafficMoore initial input = moore transition outputLogic initial input
  where
    -- transition function: cycles through Red -> Green -> Yellow -> Red ...
    transition :: TrafficState -> () -> TrafficState
    transition Red _    = Green
    transition Green _  = Yellow
    transition Yellow _ = Red

    -- output logic: output the current state
    outputLogic :: TrafficState -> TrafficState
    outputLogic state = state

-- define topEntity for synthesis, it's like main() in C
topEntity :: TrafficOutput
topEntity = trafficMoore Red (pure ())
```

This implementation has syntax likely foreign to imperative programmers. I try explaining most of it in the comments, but you can see Philipp Hagenlocher's playlist [Haskell for Imperative Programmers](https://www.youtube.com/playlist?list=PLe7Ei6viL6jGp1Rfu0dil1JH1SHk9bgDV) for a more comprehensive guide.

## Mealy machine

In contrast with Moore machines, Mealy machines derive outputs from both the current state and the current inputs.

Consider an accumulator FSM that performs the operation $\text{acc} = \text{acc} + x * y$.

![[acc-fsm.png]]

This FSM maintains an accumulator `acc` that sums the product of its input pair `(x, y)` each clock cycle.

Let's implement this machine in hardware using Clash as well:

```haskell
{-# LANGUAGE DataKinds #-}
{-# LANGUAGE TypeFamilies #-}
{-# LANGUAGE ScopedTypeVariables #-}

-- import Clash's functions and types for hardware synthesis
import Clash.Prelude

-- define the state type, our accumulator is an Int
type AccState = Int

-- define the output type
type AccOutput = Signal System Int

-- implement our Mealy machine
accumulatorMealy :: HiddenClockResetEnable dom => Signal dom (Int, Int) -> AccOutput
accumulatorMealy = mealy transition 0
  where
    -- Transition function: updates the accumulator with acc + x * y
    -- vars in Haskell are immutable, so we use acc'
    transition :: AccState -> (Int, Int) -> (AccState, Int)
    transition acc (x, y) = let acc' = acc + x * y
                            in (acc', acc')

-- define topEntity for synthesis
topEntity :: Clock System -> Reset System -> Enable System -> Signal System (Int, Int) -> Signal System Int
topEntity = exposeClockResetEnable accumulatorMealy
```

### :t mealy

Like most things in Haskell, `mealy` is a function. We use this function provided by the Clash prelude to describe a Mealy machine.

You can use `ghci` or [the Clash docs](https://hackage.haskell.org/package/clash-prelude-1.8.1/docs/Clash-Prelude-Mealy.html) to find that the `mealy` function has a type:

```haskell
mealy :: (HiddenClockResetEnable dom, NFDataX s)
  => (s -> i -> (s, o))
  -> s
  -> Signal dom i -> Signal dom o
```

This is a bit of a daunting type signature, but it makes sense when you consider the definition of a Mealy machine. Recall:

> In contrast with Moore machines, Mealy machines derive outputs from both the current state and the current inputs.

Running a Mealy machine requires three things:
- a state transition function. This function maps a current state and the machine's inputs to the next state and its outputs. In our example, this function is $f(\text{acc}, x, y) = \text{acc} + x * y = \text{acc'}$. This maps perfectly to the type signature `(s -> i -> (s, o))`. Our current state of type `s` is $\text{acc}$, our input of type `i` is a tuple $(x, y)$, and our output of `o` and our next state of `s` are both $\text{acc'}$.
- an initial state. We can't inductively say $\text{acc'} = \text{acc} + x * y$ if $\text{acc}$ is never initially defined. This is the second parameter to the `mealy` fn.
- an input wire. This wire holds the $(x, y)$ tuple, the input to our machine. It's the third and final parameter to `mealy`.

With these three parameters, we produce one output: a wire holding the value of the accumulator after performing our operation. This is the last entry in the chain of `->` in our type signature: `Signal dom o`.

With the type signature understood, consider how we call `mealy` in our code:

```haskell
accumulatorMealy = mealy transition 0
```

We've called `mealy` with two parameters, yet `mealy` expects three. By supplying just two parameters, we've performed [[partial-function-application|partial function application]] to construct `accumulatorMealy`, a function that takes in an input wire `Signal dom i` and returns `Signal dom o`.

With that, we can use the topEntity function to connect conceptual wires to our `accumulatorMealy` function to build a circuit:

```haskell
topEntity :: Clock System -> Reset System -> Enable System -> Signal System (Int, Int) -> Signal System Int
topEntity = exposeClockResetEnable accumulatorMealy
```

Clash compiles this to Verilog, and we can use synthesis software like AMD's Xilinx to program an FPGA with it.

## Conclusion

We've explored how finite-state transducers (Moore and Mealy machines) can be elegantly implemented in Haskell and Clash.

The punt-engine project uses this paradigm to synthesize various cores in our FPGA-accelerated trading engine. For more info on our project, see our [GitHub](https://github.com/raquentin/punt-engine).

[^1]: Or perhaps, more specifically parallelized.
