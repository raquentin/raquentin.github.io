---
title: Partial function application
date: 2024-12-12
tags:
  - haskell
  - fp
---
This is a quick tutorial on partial function application for those foreign to Haskell.

## Add

Consider a function that adds two numbers:

```haskell
add :: (Num a) => a -> a -> a
add x y = x + y
```

Let's break down this syntax piece-by-piece.

The first line is the type signature.
- `add` is its name.
- `::` separates the name from its type.
- `(Num a)` is a type constraint. It asserts that the 2 parameters and the 1 output of this function are all of the same type `a`, and that this type `a` must be an instance of the `Num` typeclass. We need this type constraint because the `(+)` function isn't defined for every combination of types as inputs; what happens if you add a `ApplicationState` and a `MinHeap`? You can use `:t (+)` in `ghci` (a Haskell repl) to see that addition is only defined for instances of `Num`. You can use `:i Num` to see that `Num` is a class containing types that make sense to add: `Integer`, `Double`, `Float`, etc. By saying `(Num a)`, we're defining a variable `a` that is a specific instance of the `Num` typeclass. Later in our function signature, when we use `a`, we're referring to either `Integer`, `Double`, `Float`, etc. Not a particular value of this type, but the type itself.
- `=>` separates the type constraint(s) from the type
- `a -> a -> a` is the real meat of the type. With `a` already defined, this means we're looking at a `Integer -> Integer -> Integer`, a `Double->Double->Double`, etc. This `->` syntax is Haskell's way of denoting functions. `Integer -> String` is a function that maps `Integer`s to `String`s. With multiple arrows (`Int->Int->Int`), we're writing a curried[^1] function. For now you can look at as a function taking in two `Int`s and returning one. Generalizing the `Int` type to the `a` we defined in our type constraint, we get a function taking in two `a`s and returning one `a`.

The second line it the implementation.
- `add` is the name we gave above. It's how we know what we're defining.
- `x y` binds these local identifiers `x` and `y` to the `a`s that a caller will supply our function.
- `=` separates these bindings on the left from our production of output on the right.
- `x + y` calls another function, `(+)`, with the two inputs we received. We're essentially dropshipping the `(+)` function and renaming it `add`.

That's it. We now have a function `add` that adds two numbers.

Use it like so:
```haskell
ghci> add 5 5
10
ghci> add 5 1
6
```

Nice.

## Add5

Adding two numbers is cool, but what if we want to write a program that takes in a number and adds it to 5? It would be kind of hard to expect callers to always supply our function `add x y` with `x=5`, so let's force it upon them.

```haskell
add5 :: (Num a) => a -> a
add5 y = add 5 y
```

Let's break this new function down piece-by-piece.

The first line is the type signature.
- `add5` is its name.
- `::` separates the name from the type.
- `(Num a)` asserts that `a` is a specific instance of `Num`.
- `a -> a` is a function mapping the domain of `a` to a domain in `a`.

The second line is the implementation.
- `add 5` is the name.
- `y` is a local identifier bound to whatever parameter the caller supplies `add5` with.
- `=` separates.
- `add 5 y` calls the `add` function we made above, forcing `x` to be `5`.

What we're doing with `add 5 y` is called partial function application. We have this function `add :: Num -> Num -> Num`, we supply the first of two arguments with a `Num`, and get out a function of type `Num -> Num`.

Let's use `add5`.

```haskell
ghci> add5 5
10
ghci> add5 1
6
```

Nice.

[^1]: Currying is the process of transforming a function that takes multiple arguments into a sequence of functions, each with a single argument. In Haskell, all functions are curried by default, meaning that a function with multiple parameters can be partially applied by supplying fewer arguments than it expects, resulting in a new function that takes the remaining arguments.
