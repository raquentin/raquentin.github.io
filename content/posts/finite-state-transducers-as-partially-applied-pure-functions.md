---
title: "Finite-state transducers as partially-applied pure functions"
date: 10-11-2024
tags:
  - haskell
  - automata
  - fpga
---

Software is great, but sometimes life is too short to write programs bound by pipelined processors, one-size-fits-all arithmetic units, and network cards.

High-frequency trading systems exemplify this. When counting latency in nanoseconds, every clock cycle matters. This is why trading applications like [punt-engine](https://github.com/raquentin/punt-engine) are implemented in hardware description languages (HDLs) that compile[^1] to configurations of registers and digital logic, unlike traditional programming languages that instruct pre-built processors.

This post is primarily a resource for new punt-engine contributors to see first-hand how we describe hardware using a functional (as in pure and declarative, not just "working") HDL. Others can find a quite beautiful application of a typed lambda calculus to map input wires to output wires in described circuits, producing faster applications than would be in C[^2] $\implies$ Haskell is faster than C (╯°□°)╯︵ ┻━┻.

## Finite state machines

Finite state machines (FSMs) model computation by defining a finite set of program states, an initial state, and a function deriving state transitions from inputs. Transducers are a class of state machines often used to control applications. There's two distinct types: Moore machines and Mealy machines.

### Introducing our example

To illustrate the differences between Moore and Mealy machines, we'll implement both using [Clash](https://clash-lang.org), a functional HDL implemented as a subset of Haskell. Our example will focus on detecting rising edges (transitions from 0 to 1) in a bitstream:
- Moore: Outputs 1 one clock cycle after detecting a rising edge.
- Mealy: Outputs 1 immediately upon detecting a rising edge.

We'll simulate both implementations to see how the different machines respond to the input.

### Boilerplate code

Before getting into the specifics of the implementations of the machines, let's set up some boilerplate. Since we're solving the same problem in two different ways, we'll be using the same language pragmas, test input, and simulation function. Below is some generic boilerplate I produced by removing the word "moore" or "mealy" in shared code between my two circuits and just replacing it with "fsm". Do the inverse to create runable code.

```haskell
{-# LANGUAGE DeriveAnyClass #-}
{-# LANGUAGE DeriveGeneric #-}
{-# LANGUAGE ImportQualifiedPost #-}
{-# LANGUAGE TypeApplications #-}
{-# LANGUAGE NoImplicitPrelude #-}

module FSM where

import Clash.Prelude
import Prelude qualified as P

-- <define machine state types here>

-- <define state transition & output function(s)>

-- define simulation function
-- why P.take 20? circuits hold values indefinetly
--     let's just consider the first 20 samples of our output
simulateFSM :: [Bit] -> [Bit]
simulateFSM inp = P.take 20 $ simulate (fsmMachine @System) (inp P.++ P.repeat 0)

-- top entity for synthesis
-- HiddenClockResetEnable abstracts handling with clock, reset, and wren into compiler magic
--    We define a clock domain `dom`. Our input and output wires hold Bits in this domain.
topEntity :: (HiddenClockResetEnable dom) => Signal dom Bit -> Signal dom Bit
topEntity = fsmMachine
```

With this out of the way, we've reduced the problem to implementing state machine types, a state transition function, and an output function.

### Moore machine

In a Moore machine, outputs are determined solely by the current state. Outputs only change when state changes, irrespective of the input. Consequently, there's a one-clock-cycle delay between an input change and the corresponding output change.

We can implement a Moore FSM to detect rising edges[^3]:

```haskell
data MooreState = Idle | RisingDetected
  deriving (Show, Eq, Generic, NFDataX)

mooreTransition :: MooreState -> Bit -> MooreState
mooreTransition s input =
  case s of
    Idle -> if input == 1 then RisingDetected else Idle
    RisingDetected -> Idle -- return to Idle on next cycle

-- output function based solely on the current state
mooreOutput :: MooreState -> Bit
mooreOutput s =
  case s of
    Idle -> 0
    RisingDetected -> 1

mooreMachine ::
  (HiddenClockResetEnable dom) =>
  Signal dom Bit ->
  Signal dom Bit
mooreMachine = moore mooreTransition mooreOutput Idle
```

We can use `clashi`, a Clash repl, to compile our file and call its members. Running the simulation gives us this output:
```haskell
ghci> :l MooreFSM
ghci> simulateMoore [0, 0, 1, 1, 0, 1, 0, 0] :: [Bit]
[0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0]
```
Recall that `simulateMoore` is a de-generalization of the boilerplate simulation function. You can see in the output that our circuit's detection of the rising edge is delayed by one clock cycle. Since the Moore machine's output is purely based on its state, we spend the first clock cycle updating the state based on the input, and the second one outputting it.

Let's consider a different design that does both of these steps at once.

### Mealy machine

In contrast with Moore machines, Mealy machines derive outputs from both the current state and the current inputs.

Consider the same circuit that uses a Mealy machine to react to a rising edge immediately based on the input, instead of updating the state on this cycle and the output on the next one like the Moore one did. You'll find that this circuit appears to be a clock cycle ahead:

```haskell
data MealyState = MIdle
  deriving (Show, Eq, Generic, NFDataX)

-- when we encounter a rising edge, immediately output 1; else 0.
-- the state here is simple; we can keep track of the previous input.
type MealyInternalState = (MealyState, Bit)

mealyTransitionOutput :: MealyInternalState -> Bit -> (MealyInternalState, Bit)
mealyTransitionOutput (s, prevInput) currentInput =
  let out = if prevInput == 0 && currentInput == 1 then 1 else 0
      nextState = (s, currentInput)
   in (nextState, out)

mealyMachine ::
  (HiddenClockResetEnable dom) =>
  Signal dom Bit ->
  Signal dom Bit
mealyMachine = mealy mealyTransitionOutput (MIdle, 0)
```

Run the simulation function:
```haskell
ghci> :l MealyFSM
ghci> simulateMealy [0, 0, 1, 1, 0, 1, 0, 0] :: [Bit]
[0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
```

Our Mealy machine outputs the rising edge in the input as soon as it is recieved.

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
- a state transition function. That's the point of a state machine, after all.
- an initial state. In our case, this is `(MIdle, 0)`. We start in the Idle state, and we want to output a rising edge if the input starts with 1.
- an input wire. Our function needs an input to produce outputs, or in other words, our circuit needs an input wire to assert an output wire.

With these three parameters, we produce one output: a wire holding the value of the accumulator after performing our operation. This is the last entry in the chain of `->` in our type signature: `Signal dom o`.

With the type signature understood, consider how we call `mealy` in our code:

```haskell
mealyMachine = mealy mealyTransitionOutput (MIdle, 0)
```

We've called `mealy` with two parameters, yet `mealy` expects three. By supplying just two parameters, we've performed [[partial-function-application|partial function application]] to construct `mealyMachine`, a function that takes in an input wire `Signal dom Bit` as input and outputs a different `Signal dom Bit`.

## Conclusion

We've compared finite-state transducers (Moore and Mealy machines) via their implementations of a trivial rising-edge-detector circuit in Haskell and Clash.

The punt-engine project uses this paradigm to synthesize various cores in our FPGA-accelerated trading engine. For more info on our project, see our [GitHub](https://github.com/raquentin/punt-engine).

[^1]: Clash transforms Haskell to VHDL, Verilog, or SystemVerilog; "transpile" is likely a better word here.
[^2]: Or perhaps, more specifically parallelized.
[^3]: This implementation has syntax likely foreign to imperative programmers. I try explaining most of it in the comments, but you can see Philipp Hagenlocher's playlist [Haskell for Imperative Programmers](https://www.youtube.com/playlist?list=PLe7Ei6viL6jGp1Rfu0dil1JH1SHk9bgDV) for a more comprehensive guide.

