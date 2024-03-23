---
title: Knapsack Problem
date: 2024-03-08
tags:
  - dp
  - cs
  - algo
---
Knapsack is a core problem to [[dynamic-programming|Dynamic Programming]]. It's easy to understand, but hard to solve.

Suppose you are given $n$ items $(v_i, w_i)$ where $v_i$ is the value of item $i$ and $w_i$ is the weight of item $i$. You have capacity $W$. Your goal is to maximize the value of items subject to having the sum of the weights be less than or equal to the capacity.

### Solution
Let's start with a two-dimensional solution. $T[i, j]$ needs to be an intermediary version of some capacity and some item, such that at the end we could index $T[W, n]$ for the maximum value. Let's define our table $T[i,j]$ where $T[i,j]$ is the maximum profit with a capacity $i$, and only using items $1..j$. In this variant, there is only one copy of an item. We can iteratively build up the smaller cells in the table to bigger items.
Let's consider the last possible step for our recurrence. Given one more item, if you don't pick the item, the solution is equivalent to the value with the same capacity except for the item $(T[W, n] = T[W, n-1])$. If you do pick the item, you capacity goes up by $w_n$, so you prior capacity should be $W - w_n$, hence your new value is $T[W, n] = T[W-w_n, n-1] + v_n$. This implies that your solution to the optimal value at some weight is either:
- the optimal solution at the capacity without the weight of some new item plus the value of that item, or
- the weight ignoring that item
$$
\begin{equation}
T[i, j] = 
\begin{cases}
	T[i, j-1] & \text{if } w_j \gt i \\
	max(T[i, j-1], T[i-w_j, j-1] + v_j) & \text{if } w_j \leq i
\end{cases}
\end{equation}
$$
In the [[chain-matrix-multiplication|Chain Matrix Multiplication]] problem, we have a minimum over some things. Here, we have a maximum over some things. We're not going to end up finding the items we've used using this table directly. Like in the chain matrix, all it requires is storing pointers to choices we made. This variant of the knapsack is the 0-1 Knapsack since you can choose either 0 or 1 amounts of any item.

### Pseudocode
```python
def knapsack(W, weights, values):
	n = len(weight)
	dp = [0; W+1][0; n+1]

	for j in 1..(n+1):
		for i in 1..(W+1):
			if weights(j-1) <= i:
				dp[i, j] = max(
					dp[i, j-1],
					dp[i-weights[j-1], j-1] + values[j-1]
				)
			else:
				dp[i, j] = dp[i, j-1]

	return dp[W, n]
```

The space of this is $O(nW)$. The runtime is $O(2^kn)$.

