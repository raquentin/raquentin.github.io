---
title: Dynamic Programming
tags:
  - dp
  - algorithms
---

Two ways:
- Top down, with recurrence and memorization.
-  Bottom up, with iteration.
	- In either case, we solve small subproblems and store them.
- This causes a space-time trade-off.
The difference between Divide and Conquer algorithms and Dynamic Programming algorithms is that the subproblems in DP overlap, so it's inefficient to recompute all of them.

## Fibonacci
The recursive algorithm below takes exponential time with respect to n. It can be made faster by storing intermediate results.

```python
def fib(n):
	if n <= 1 return 1
	return fib(n-2) + fib(n-1)
```

Consider using an array and using the former two elements to compute the current element.

```python
def fib2(n):
	if n = 0 return 0

	dp = arr[0; n+1]
	dp[0] = 0
	dp[1] = 1

	for i in 2..(n+1):
		dp[i] = dp[i-1] + dp[i-2]

	return dp[n]
```

Essentially every DP solution involves:
- memory structure
- base case
- filling memory structure using recurrence
	- $dp[i] = dp[i-1] + dp[i-2]$ in this example

## Staircase Problem
Suppose you have $n$ stair steps. You can leap one, two, or three steps at a time. What is the number of combinations that you could reach step $n$?

### Solution
- Create an array $T[0..n]$ where $T[i]$ represents the number of ways to reach step $i$. 
- Base cases are: $T[0] = 1, T[1] = 1$ and $T[2]=2$.
- To reach step $n$, there was some last step.
	- It was either 1, 2, or 3 steps away.
	- Hence, the number of ways to go from 0 to $n$ is the sum of the number of ways to go from 0 to $n-1$, 0 to $n-2$, and 0 to $n-3$.
	- This gives us a recurrence of $T[i] = T[i-1] + T[i-2] + T[i-3]$
### Pseudocode
```python
def numways(n):
	dp = [0; n+1]
	dp[0] = 0
	dp[1] = 1
	dp[2] = 2

	for i in 3..(n+1):
		dp[i] = dp[i-1] + dp[i-2] + dp[i-3]

	return dp[n]
```
## Add/Multiply Problem
### Problem
Suppose you had two operations: add one, and multiply by two. How many operations does it take to get from 0 to some $k$?
### Solution
- Base cases:
	- $dp[0] = 0$ because for 0, you need 0 operations.
	- $dp[1] = 1$ because for 1, you add 1 to 0.
- Now, we'll multiply by 2 as much as possible, then add 1 if the element is odd and multiply by 2 if it is even. This produces this recurrence:
$$
\begin{equation}
d(i) = 
\begin{cases}
    d(i-1) + 1 & \text{if } i \text{ is odd}\\
    d(i/2) + 1 & \text{if } i \text{ is even}\\
\end{cases}
\end{equation}
$$
### Pseudocode
```python
def minop(k):
	dp = [0; k+1]
	dp[0] = 0
	dp[1] = 1

	for i in 2..(k+1):
		dp[i] = dp[i-1] + 1
		if i is even:
			dp[i] = min(dp[i], dp[i/2] + 1)

	return dp[k]
```

## The House Robber Problem
House robber. Given an array of houses with values $H = [h_{1}..h_{n}]$, you want to rob them, but you can't rob two adjacent houses or alarms will go off. What is the maximum amount you can steal?

### Solution
- Define array $T[0..n]$ with $T[i]$ = max we can steal from houses $0..i$. The base cases are that $T[0] = H[0], T[1] = max(H[0], H[1])$.
- At the next house visited, we can choose to rob or not rob. We take the maximum of both scenarios. If we rob the house, then we could not have robbed the previous house. If we didn't rob the house, then we could have robbed the previous house. This gives us the recurrence:
$$T[i] = max(T[i-2] + H[i], T[i-1])$$

### Pseudocode
```python
def houserobber(H):
	dp = [0; n]
	dp[0] = H[0]
	dp[1] = max(H[0], H[1])

	for i in 2..n:
		dp[i] = max(dp[i-2] + H[i], dp[i-1])

	return dp[n-1]
```

## Counting Paths Problem
Given $n,m$, what is the number of paths through an $n \times m$ grid from (1,1) to ($n,m$) if you can only go down and right?

### Solution
- Define array $T[1..n][1..m]$ where $T[i][j]$ is the number of paths from (1,1) to ($i, j$).
- Base cases are that $T[1..n][1] \text{ and } T[1][1..m] = 1$. These are like the first row and column of the matrix.
- Now the recurrence:
	- For non-base case cells, the number of ways to reach ($i,j$) is the sum of the number of ways to reach the cell above it and the cell to its left. This is because you can only come to ($i,j$) via $(i-1, j)$ or $(i, j-1)$.
	- Hence, the relation is: $dp[i][j] = dp[i][j-1] + dp[i-1][j]$.
	- $dp[n][m]$ will give the number of paths from (1,1) to $(n,m)$.
### Pseudocode
```python
def count_paths(n, m):
	dp = [0; n+1][0; m+1]

	for i in 0..n:
		dp[i][0] = 1
	for j in 0..m:
		dp[0][j] = 1

	for i in 1..n:
		for j in 1..m:
			dp[i][j] = dp[i-1][j] + dp[i][j-1]

	return dp[n][m]
```

## Counting Paths, But Now With Bombs
Find the number of paths to reach cell (n, m). Additionally, the grid has bombs, denoted by $bombs[i][j] = True$. Find the number of paths from (0,0) to ($n, m$) such that no bombs are traversed.

### Solution
- Define array $T[1..n][1..m]$ where $T[i][j]$ is the number of paths from $(1,1)$ to $(i, j)$.
- Base cases:
	- If the starting cell (1,1) has a bomb, then there are 0 paths.
	- The first row and first column
	- Then the recurrence relation

$$\begin{equation}
	dp[1][1] =
	\begin{cases}
		0 & \text{if } bombs[1][1] \\
		1 & \text{otherwise}
	\end{cases}
\end{equation}$$

$$\begin{equation}
dp[i][1] =
\begin{cases}
	0 & \text{if } bombs[i][1] \\
	dp[i-1][1] & \text{otherwise}
\end{cases}
\end{equation}$$

$$\begin{equation}
dp[1][] =
\begin{cases}
	0 & \text{if } bombs[1][j] \\
	dp[1][j-1] & \text{otherwise}
\end{cases}
\end{equation}$$

- This means that if a cell has a bomb, no paths can go through it. Otherwise, the number of paths to a cell is the sum of the paths to the cell above it and to its left. The solution will be $dp[n][m]$.

### Pseudocode
```python
def count_with_bombs(n, m, bombs):
	dp = [0; n+1][0; m+1]

	if bombs[0][0]: return 0

	dp[0][0] = 1

	for i in 1..n:
		if not bombs[i][0]:
			dp[i][0] = dp[i-1][0]

	for j in 1..m:
		if not bombs[0][j]:
			dp[0][j] = dp[0][j-1]

	for i in 1..n:
		for j in 1..m:
			if not bombs[i][j]:
				dp[i][j] = dp[i-1][j] + dp[i][j-1]
```

The time complexity here is $O(n \times m)$ because we're visiting each cell of the grid exactly once.
