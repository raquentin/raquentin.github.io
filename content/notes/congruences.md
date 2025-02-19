---
title: Congruences
date: 2024-09-21
tags:
  - math
  - numbertheory
---

Two integers are related under congruence if their difference is evenly divisible by a third fixed positive integer.

## Definition of congruence

Let $a, b, m \in \mathbb{Z}$, with $m > 0$. $a$ is said to be congruent to $b$ modulo $m$, denoted $a \equiv b$ mod $m$, if $m \mid a - b$. In this form, $m$ is said to be the *modulus* of the congruence. Conversely, $a \not\equiv b$ mod $m$ denotes that $a$ is not congruent to $b$ modulo $m$.

## Congruence modulo $m$ is an equivalence relation on $\mathbb{Z}$

Let $a \in \mathbb{Z}$. Since any integer divides $0$, $m \mid 0$, therefore $m \mid a - a$ and $a \equiv a$ mod $m$. That makes congruence reflexive on $\mathbb{Z}$.

Let $a, b \in \mathbb{Z}$. Assume that $a \equiv b$ mod $m$. That's $m \mid a - b$, or equivalently $m \mid (-1)(a - b)$ Distribute the $(-1)$ for $m \mid (b - a)$. This shows that $a \equiv b$ mod $m$ \implies $b \equiv a$ mod $m$, so congruence is symmetric.

Let $a, b, c \in \mathbb{Z}$. Assume that $a \equiv b$ mod $m$ and that $b \equiv c$ mod $m$. Then $m \mid a - b$ and $m \mid b - c$. Therefore, $m \mid (a - b) + (b - c) \implies m \mid a + c$. Congruence mod $m$ is hence transitive.

Because congruence mod $m$ is reflexive, symmetric, and transitive, it's an equivalence relation on $\mathbb{Z}$. ${\blacksquare}$

## $\mathbb{Z}$ is partitioned into equivalence classes under congruence mod $m$

Denote $[x]$ as the equivalence class containing $x$.

Consider $\mathbb{Z}$ under congruence modulo $4$. We'll find $4$ equivalence classes:
- $[0] = \{x \in \mathbb{Z}: x \equiv 0$ mod $4 \}$
- $[1] = \{x \in \mathbb{Z}: x \equiv 1$ mod $4 \}$
- $[2] = \{x \in \mathbb{Z}: x \equiv 2$ mod $4 \}$
- $[3] = \{x \in \mathbb{Z}: x \equiv 3$ mod $4 \}$

We can express the equivalence class $[2]$, for example, as:
- $\{x \in \mathbb{Z}: x \equiv 1$ mod $4 \}$
- $\{x \in \mathbb{Z}: 4 \mid x - 2\}$
- $\{x: x - 2 = 4n$ for some $n \in \mathbb{Z}\}$
- $\{x: x = 4n + 2$ for some $n \in \mathbb{Z}\}$
- $\{..., -6, -2, 2, 6, 10, ...\}$

## Complete residue systems

A set of integers such that every integer is congruent modulo $m$ to exactly one integer of the set is said to be a *complete residue system mod $m$*.

### $\{0, 1, ..., m-1\}$ is a complete residue system mod $m$

We'll first show that every integer is congruent mod $m$ to at least one integer in $\{0, 1, .., m-1\}$. Let $a \in \mathbb{Z}$. By the division algorithm, there exist $q, r \in \mathbb{Z}$ such that $a = mq + r$, with $0 <= r < m$.

$a = mq + r \implies a - r = mq$, so $m \mid a - r$, or $a \equiv r$ mod $m$.

Furthermore, $0 <= r < m \implies r \in \{0, 1, ..., m-1\}$, so every integer is congruent mod $m$ to at least one in the set. To complete the proof, we need to show that it's equivalent to at most one.

Let $a \in \mathbb{Z}$ and let $r_1, r_2 \in \{0, 1, ..., m-1\}$. Assume that $a \equiv r_1$ mod $m$ and that $a \equiv r_2$ mod $m$. Then $r_1 \equiv r_2$ mod $m$, which implies $m \mid r_1 - r_2$.

Recall that $r_1, r_2 \in \{0, 1, ..., m-1\}$. This means that $-(m-1) <= r_1 - r_2 <= m - 1$. Since $m \mid r_1 - r_2$, we have that $r_1 - r_2 = 0$ or $r_1 = r_2$. So every integer is congruent modulo $m$ to at most one integer in $\{0, 1, ..., m-1\}$. $\blacksquare$

### The set of least nonnegative residues mod $m$

The set $\{0, 1, ..., m-1\}$ is said to be the *set of least nonnegative residues mod $m$*.

## Some arithmetic properties of the congruence relation

Let $a, b, c, d \in \mathbb{Z}$ such that $a \equiv b$ mod $m$ and $c \equiv d$ mod $m$. This implies:

$\textbf{(a)}$: $(a+c) \equiv (b+d)$ mod $m$ $\newline$
$\textbf{(b)}$: $ac \equiv bd$ mod $m$

Since $a \equiv b$ mod $m$ and $c \equiv d$ mod $m$, we have that $m \mid a - b$ and that $m \mid c - d$. This means that $m \mid (a-b) + (c-d)$, which is equivalent to $m \mid (a+c) - (b+d)$, implying $(a+c) \equiv (b+d)$ mod $m$.

For the second part, note that $m \mid a - b$ implies $m \mid c(a-b)$. Conversely, $m \mid c - d$ implies $m \mid b(c-d)$. So $m \mid c(a-b) + b(c-d)$, which is equivalent to $m \mid ac - bd$, from which $ac \equiv bd$ mod $m$. $\blacksquare$

In terms of equivalence classes,

$\textbf{(a')}$: $[a] + [c] = [a + c]\newline$
$\textbf{(b')}$: $[a][c] = [ac]$

One final note is that the cancellation law of multiplication does not hold in general for congruence modulo $m$. In other words, $6a \equiv 6b$ mod $3$ does not imply that $a \equiv b$ mod $3$.

Let $a, b, c \in \mathbb{Z}$. Then $ca \equiv cb$ mod $m$ iff $a \equiv b$ mod $(m/(c, m))$.

Assume that $ca \equiv cb$ mod $m$ and let $d$ = $(c, m)$. We have $m \mid ca-cb = c(a-b)$. Divide both sides by $d$ for $(m/d) \mid (c/d)(a-b)$. We have $(m/d, c/d) = 1$, so $m/d \mid a - b$ and $a \equiv b$ mod $m/d$.

For the *and only if* direction, let $d = (c, m)$ and assume $a \equiv b$ mod $m/d$. Then $m/d \mid a - b$ so $m \mid ad - bd$. So $m \mid (c/d)(ad-bd) = ca - cb$ and $ca \equiv cb$ mod $m$ as desired.
