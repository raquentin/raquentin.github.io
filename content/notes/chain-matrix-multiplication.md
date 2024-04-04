---
title: Chain Matrix Multiplication
date: 2024-03-07
tags:
  - dp
  - dsa
---
Suppose we are given a sequence of matrix dimensions. We want to compute the product of the matrices. We are not given the matrices, just the dimensions. In which order should we multiply the matrices in order to minimize the number of operations?

Say we have:
- $A = (50 \times 20)$
- $B = (20 \times 1)$
- $C = (1 \times 10)$
- $D = (10 \times 100)$

We want to compute the product $ABCD$. Note that we can do this because the dimension of the rows of A is the dimension of the columns of B, etc. Matrix multiplication is associative, not commutative. $(AB)C = A(BC)$, but $AB \neq BA$.

Given two matrices of dimensions $(d_0  \times d_1)$ and $(d_1 \times d_2)$, we may ballpark the cost of multiplying these two matrices as $d_0d_1d_2$ fixed point operations. From the problem example, consider the following parantheticalizations:

- $(A((BC)D)) = 20 · 1 · 10 + 20 · 10 · 100 + 50 · 20 · 100 = 120200$
- $((A(BC))D) = 20 · 1 · 10 + 50 · 20 · 10 + 50 · 10 · 100 = 60200$
- $((AB)(CD)) = 50 · 20 · 1 + 1 · 10 · 100 + 50 · 1 · 100 = 7000$

This discrepancy allows us to optimize. The number of possible associations grows exponentially, making search non-trivial. The number of parantheticalizations follows the Catalan numbers, which grow $\Omega(4^{n}/n^{3/2})$. The greedy approach won't consistently yield the best answer, so we'll need [[dynamic-programming|Dynamic Programming]] for this one.

## Algorithm
We can trivially create trees for these associations where the children are the left and right terms, and the parent is the expression.
We cannot, however, choose one binary tree from an algorithm, we need to consider all binary trees. The dynamic programming approach to this problem relies on the fact that each binary tree is a sub-tree of the root expression, meaning that we can store these trees in a dp structure and compute as solution by combining its minimal subproblems.
We'll define the db table as $T[1..n][1..n]$ where $T[i, j] =$ the cost to multiply $A_i, A_{i+1}, .., A_j$. Our base case comes from $\forall i \text{ } T[i, i] = 0$.
At each level, we're going to have some partition of the overall series. We're going to find some midpoint to multiply two sub-matrices at, $(A_i..A_k)(A_k+1..A_j)$. The cost for the overall level is the cost for the two smaller two-multiplications $A_i..A_k$ and $A_{k+1}..A_j$, plus the cost for the current multiplication.
The very last step involves splitting the sequence of the matrices into two products to be computed and then combined. We're looking at the minimum for this problem, so we need to take the minimum $k$ over all costs, which we do with this table:
$$T[i, j] = \underset{i \leq k \leq j}{min} T[i, k] + T[k+1, j] + d_{i-1}d_kd_j$$
The $k$ for which this is the minimum corresponds to the costs to compute $(A_i..A_k), A_{k+1}..A_j)$, plus the cost to multiply them together.

## Pseudocode
We're going to end up ignoring half the table because the recurrence only fills up the top half ($i \leq j$).

```python
def chainmatrix(d_0, d_1, ..., d_n):
	dp = [0; n][0; n]
	for i in 1..n:
		dp[i, i] = 0

	for s in 1..n:
		for i in 1..n-s:
			j = i+s
			dp[i, j] = min_ { i <= k < j } { dp [i , k ] + dp [ k + 1 , j ] + d_ { i - 1} d_kd_j }
```

In this algorithm, we need to fill in $n^{2}/2$ cells, each taking $n$ time. This leads to $O(n^3)$ runtime.
