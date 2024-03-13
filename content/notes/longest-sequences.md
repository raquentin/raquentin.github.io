---
title: Longest Sequences
tags:
  - dp
  - algos
  - cs
  - linalg
---

These are a type of [[dynamic-programming|Dynamic Programming]] problem where we're looking for common sequences of subelements within two or more elements. Most commonly, chars within a string.

## Longest Common Substring
Given two strings $a_1$, $a_2$, return the largest substring present in both.

### Solution
We'll first solve the longest common suffix problem.
Let $a_1, a_2$ be any strings with $a_1y, a_2y$ having the longest common suffix $y$.
Now, what is the longest common substring of $a_1yb_1, a_2yb_2$?
- If $b_1 = b_2$, then $yb_1 = yb_2$ is the longest common suffix.
- Else, $y$ is the longest common substring, they have no common suffix.
Let's define the elements of our table.
- two-dimensional table $T$, $i$ is index of first string, $j$ index of second
$$
\begin{equation}
T[i,j] =
\begin{cases}
	T[i-1, j-1] + 1 & \text{if } x_i = y_j \\
	0, & \text{else} 
\end{cases}
\end{equation}
$$

### Pseudocode
```python
def lcsubstring(x, y):
	dp = [0; len(x) + 1][0; len(y) + 1]
	maximum = 0
	maxpos = (0, 0)

	for i in 1..(len(x) + 1):
		for j in 1..(len(y) + 1):
			if x[i-1] = y[j-1]:
				dp[i, j] = dp[i - 1, j - 1] + 1
			else
				dp[i, j] = 0
			if maximum < dp[i, j]:
				maximum = dp[i, j]
				maxpos = i, j
```

Considering the problem in terms of suffices is easier than in substrings. The table stores suffix lengths, and the longest suffix of a prefix is the longest substring.

## Longest Common Subsequence
Take the example $x =$ "abcbdab", $y$ = "bdcaba". Subsequences are not contiguous, so for the example, subsequences "bcba" and "bdab" are valid.
Let $X = x_1,..,x_m$, $Y = y_1, .., y_n$, $Z = z_1, .., z_k$ where $Z$ is the longest common subsequence of $X$ and $Y$. Then if $x_m = y_n$, $z_k = x_m = y_n$ and $z_1, .., z_{k-1}$ is the longest common subsequence. If $x_m \neq y_n$, then $Z_k \neq X_m$ or $Z_k \neq Y_n$ and $Z$ is still the longest common subsequence.

### Solution
Let's define our recurrence $T[i,j]$ as the longest common subsequence of $x_1,..,x_i$ and $y_1,..,y_j$. If either of $i$ or $j$ is zero, we want zero because there is no possible subsequence. If two letters are equal, we want to add that character so we take the LCS of both strings without that character and add one for that character. Otherwise, the LCS is the max of the LCSs with one less character.
$$
\begin{equation}
T[i,j] = 
\begin{cases}
	0 & \text{if } i = 0 \text{ or } j = 0 \\
	T[i-1, j-1] + 1 & \text{if } x_i = y_j \\
	max(T[i-1, j], T[i, j-1]) & if x_i \neq y_j
\end{cases}
\end{equation}
$$
We take the max since if both letters are different, it may increase a previous LS in one, but not both.

### Pseudocode
```python
def lcs(x, y):
	dp = [0; len(x)+1][0; len(y)+1]

	for i in 1..(len(x) + 1):
		for j in 1..(len(y) + 1):
			if x[i] = y[j]:
				dp[i, j] = dp[i-1, j-1] + 1
			else:
				dp[i, j] = dp[i, j-1]

```

The runtime here is $n \times m$ because of the table, where $n = |x|$ and $m = |y|$.
## Longest Palindromic Subsequence
Suppose you have as input one string $x = a_1, .., a_n$ and we want to find the longest palindromic subsequence. This is the same as $lcs(a, a.reverse())$.

### Solution
We can construct the dp array $dp[n][n]$ with $dp[i][j]$ = LPS from $a_i,..,a_j$. We have the base cases where empty strings and single chars are palindromic, so $\forall i \text{ } dp[i][i] = 1$.
If $a_i,..,a_j$ has the fact that $a_i = a_j$, then it could be the ends of a palindrome, depending on $a_i(a_{i+1}, .., a_{j-1})a_j$, so we obtain the recurrence:
$$
\begin{equation}
T[i,j] = 
\begin{cases}
	2 + T[i + 1, j - 1] & \text{if } x_i = x_j \\
	max(T[i+1, j], T[i, j-1]) & if x_i \neq x_j
\end{cases}
\end{equation}
$$
### Pseudocode
```python
def lps(x):
	dp = [0; |x|][0; |x|]

	for i in 1..|x|:
		dp[i][i] = 1

	for s in range 1..|x|:
		for i in range |x| - s:
			j = i+s
			if x[i] = x[j]:
				dp[i][j] = 2 + dp[i+1][j-1]
			else:
				dp[i][j] = max(dp[i+1][j], dp[i][j-1])
```

The runtime is $O(n^2)$ because it's a two-dimensional $n \times n$ table. 
