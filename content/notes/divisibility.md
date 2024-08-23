---
title: Divisibility
date: 2024-08-22
tags:
  - math
  - numbertheory
---

When an integer is divided by a second integer, the quotient may or may not be an integer.

*Def*: If $a$ and $b$ are integers, $a$ divides $b$ if there exists an integer $c$ such that $b = ac$. This makes $a$ a factor of $b$.

If $a$ divides $b$, we write $a \mid b$. Otherwise, $a \nmid b$.

*Proposition 1*: If $a, b, c$ are integers with $a \mid b$ and $b \mid c$, then $a \mid c$.

*Proof*: Since $a \mid b$ and $b \mid c$, there exist integers $e, f$ with $ae = b$ and $bf = c$. Hence, $bf = (ae)f = a(ef) = c$, and $a \mid c$.

*Proposition 2*: If $a, b, m, n$ are integers, and if $c \mid a$ and $c \mid b$, then $c \mid (ma+nb)$.

*Proof*: Since $c \mid a$ and $c \mid b$, there are integers $e, f$ such that $a = ce$ and $b = cf$. Hence, $ma + nb = mce + ncf = c(me + nf)$. Consequently, $c \mid (ma + nb)$.

*Ex*: Since $3 \mid 21$ and $3 \mid 33$, Proposition 2 asserts that:
$$
\begin{equation}
3 \mid (5 * 21 - 3 * 33) = 105 - 99 = 6
\end{equation}
$$

## The Division Theorem

If $a, b$ are integers such that $b > 0$, then there are unique integers $q, r$ such that $a = bq + r$, with $0 <= r < b$.

To prove this, let's define a new function.

*Def*: Let $x$ be a real number. The greatest integer in $x$, denoted by $[x]$, is the largest integer less than or equal to $x$.

*Ex*: $[2.2] = 2, [3] = 3, [-1.5] = -2$

*Proposition 3*: If $x$ is a real number, then $x-1 < [x] <= x$.

We can now prove the division algorithm. We give explicit formulae for the quotient and remainder in terms of the greatest integer function.

*Proof*: Let $q = [a/b]$ and $r = a - b[a/b]$. Clearly, $a = bq + r$. To show that the remainder $r$ satisfies the appropriate inequality, note Proposition 3:
$$
\begin{equation}
(a/b)-1 < [a/b] <= a/b
\end{equation}
$$

Multiply all sides by $b$.
$$
\begin{equation}
a - b < b[a/b] <= a
\end{equation}
$$

Multiply all sides by $-1$.
$$
\begin{equation}
-a + b > -b[a/b] >= -a
\end{equation}
$$

Add $a$.
$$
\begin{equation}
b > -b[a/b] + a >= 0
\end{equation}
$$

To show that $q$ and $r$ are relatively unique, assume that we have two equations: $a = bq_1 + r_1$ and $a = bq_2 + r_2$, with $0 <= r_1, r_2 < b$. By subtracting the second of these from the first, we find:
$$
\begin{equation}
0 = b(q_1 - q_2) + (r_1 - r_2)
\end{equation}
$$

Hence:
$$
\begin{equation}
r_2 - r_1 = b(q_1 - q_2)
\end{equation}
$$

This tells us that $b$ divides $r_2 - r_1$. Since $0 <= r_1, r_2 < b$, $-b < r_2 - r_1 < b$. This shows that $b$ can divide $r_2 - r_1$ only if $r_2 - r_1 = 0$, so if $r_1 = r_2$. $bq_1 + r_1 = bq_2 + r_2 \therefore q_1 = q_2$. This shows that $q$ and $r$ are unique.

*Ex*: Let $a = 1028, b = 34$. Then $a = bq + r$ with $0 <= r < b$, where $q = [1028/34] = 30$ and $r = 1028 - [-380/75] * 34 = 1028 - 30*34 = 8$.
