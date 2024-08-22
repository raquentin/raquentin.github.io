---
title: The Well-Ordering Property
date: 2024-08-22
tags:
  - math
  - numbertheory
---

The Well-Ordering Property asserts that every nonempty set of positive integers has a least element. This is obvious, but still has high util in proving theorems.

## Mathematical Induction

We can prove the principle of mathematical induction, that a set of positive integers containing the number 1 and the number $n + 1$ whenever it contains $n$ must be the set of all positive integers, using the well-ordering property.

*Proof*: Let $S$ be a set of positive integers containing the number $1$ and the number $n + 1$ whenever it contains $n$. First, assume that $S$ is not the set of all positive integers; $\exists n \in \mathbb{Z}^+ (n \notin S$). By the well-ordering property there is a least positive integer $n$ which is not in $S$. Since $n > 1$, the integer $n - 1$ is a positive integer smaller than $n$, and hence must be in $S$. But since $S$ contains $n - 1$, it must also contain $n - 1 + 1 = n$, which is a contradiction.

To prove theorems using induction, we must show that:
- the statement we are trying to prove is true for the smallest positive integer (1)
- the statement is true for the integer $n + 1$ if it is positive for the integer $n$

Let's use this strat to establish a formula for the sum of the terms of a geometric progression.

*Def*: Given real numbers $a, r$, the real numbers $a, ar, ar^2, ar^3, ..$ are said to form a geometric progression. $a$ is the initial term, $r$ is the common ratio.

*Ex*: The numbers $5, -15, 45, -135, ..$ form a geometric progression with $a = 5, r = -3$.

## Summation Notation

Summation notation is a common way to denote sums. The following notation represents the sum of the real numbers $a_1, a_2, .., a_n$:


$$
\begin{equation}
\sum_{i=1}^{n} a_i = a_1 + a_2 + .. + a_n
\end{equation}
$$

You can use the same notation to express geometric progressions:

$$
\begin{equation}
\sum_{i=0}^{n} ar^i = a + ar + ar^2 + .. + ar^n
\end{equation}
$$

*Notable theorem*: If $a, r$ are real numbers, then the sum of the terms of a geometric progression is given by:

$$
\begin{equation}
\sum_{i=0}^{n} ar^i = \frac{ar^{n+1} - a}{r - 1}
\end{equation}
$$

*Proof*: To prove this formula valid, we'll first show that it holds for $n = 1$. Then, we'll prove that if the formula is valid for a pos int $n$, it's valid for $n + 1$.

Let $n = 1$. The left side of $(3)$ is $a + ar$, and the right side is:
$$
\begin{equation}
\frac{ar^2 - a}{r - 1} = \frac{a(r^2 - 1)}{r - 1} = \frac{a(r+1)(r-1)}{r-1} = a(r + 1) = a + ar
\end{equation}
$$

Our formula is valid for $n = 1$, now we assume it's valid for a pos int $n$:
$$
\begin{equation}
a + ar + ar^2 + .. + ar^n = \frac{ar^{n+1}-a}{r-1}
\end{equation}
$$

We must show that it holds for $n + 1$, that:
$$
\begin{equation}
a + ar + ar^2 + .. + ar^n + ar^{n+1} = \frac{ar^{n+2}-a}{r-1}
\end{equation}
$$

To show that (6) is valid, we add $ar^{n+1}$ to both sides of (5), obtaining:
$$
\begin{equation}
a + ar + ar^2 + .. + ar^n + ar^{n+1} = \frac{ar^{n+1}-a}{r-1} + ar^{n+1}
\end{equation}
$$

The left side of (7) is equivalent to the left side of (6). To show the right sides are equal:
$$
\begin{align*}
\frac{ar^{n+1}-a}{r-1} + ar^{n+1} &= \frac{ar^{n+1}-a}{r-1} + \frac{ar^{n+1}(r-1)}{r-1} \\
 &= \frac{ar^{n+1} - a + ar^{n+2} - ar^{n+1}}{r-1} \\
 &= \frac{ar^{n+2}-a}{r-1}
\end{align*}
$$

Since we've shown that (5) implies (6), we can conclude that (4) holds for all positive integers $n$.

A common computer science example of this is that the sum of consecutive nonnegative powers of two is one less than the next power of two; that $\sum_{i=0}^{n} 2^{n} = 2^{n+1} - 1$.
