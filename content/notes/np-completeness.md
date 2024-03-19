---
title: NP-Completeness
tags:
  - algo
  - cs
---

Given a problem, there may exist any number of upper and lower bounds for solving it. The lower bounds can involve deep mathematical cross-problem relationships.

## An Introduction

Given an unsorted list of integers, return the list of indices as if it were sorted.

A potential solution: We have an obvious upper bound on sorting. In $O(nlogn)$ time, we can sort the array, keep track of the indicies and return them. But can we do faster? Is there some $o(nlogn)$ algorithm?

Suppose there exists an $o(nlogn)$ algorithm, $O(n)$ perhaps. Since you can sort the array based on the indices in linear time, this implies an $o(nlogn) + O(n) = o(nlogn)$ sorting algorithm, a *contradiction*. Hence, the complexity of this problem is $\Omega(nlogn)$. This way of solving problems is called reduction, and reasonably very popular in complexity theory.

## Background

A decision problem is a problem which can be phrased as a yes or no quesiton.

Define $P$ to be the class of decision problems decidable in polynomial time. If $A \in P, \exists$ an algorithm on input $x$, to correctly say yes if $x \in A$ and no otherwise, $\exists$ some $k > 0$ such that this algorithm runs in $O(n^k)$ time.

### Why?

**Reason 1:** The class $P$ captures an intuitive notion of what it means for an algorithm to be "efficient". If there exists a polynomial time algorithm for a problem, either the problem is trivial or we have a mathematical characterization of the problem. Most problems have terrible brute force time complexities.

**Reason 2:** $P$ is closed under operations which do not violate our intuition about efficiency. The sum, product, and composition of polynomials are all polynomials. If $f, g$ are polynomial time algorithms, they are "efficient". An algorithm involving running $f$, then $g$, should maintatin this intuition with it's polynomail $f + g$ runtime.

**Reason 3:** By the time hierarchy theorems, problems of $\Omega(n^{99})$ do exist, though apparently useless. 

## Completeness

NP-complete problems are the hardest problems in $NP$.

Prove a problem is NP-complete by defining a polynomial time reduction for two problems $A, B$ such that $A \leq_{p} B$[^1]. $A$ is poly time reducible to $B$ if there exists $f$ which is computable in polynomail time such that $x \in A \iff f(x) \in B$.

In short, to prove a problem $B$ is NP-complete, show $B \in NP$ and $B$ is NP-hard, usually by virtue of $A$ being NP-complete and $A \leq_p B$.


[^1]: Think of ($A \leq_{p} B$) as $B$ being as hard or harder than $A$. $B$ is an upper bound for $A$; $A$ is a lower bound for $B$.
