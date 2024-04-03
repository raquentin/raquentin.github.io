---
title: Complexity Theory
date: 2024-04-03
tags:
  - algo
  - cs
---
Complexity theory reiterates on concepts from [[satisfiability|Satisfiability]] and [[np-completeness|NP-Completeness]].
## NP
We define a **decision problem** as a problem where given an input $I$, we output either True or False depending on if there exists a solution matching the problem's requirements.

Suppose that we have a witness $W$ — some entity that can observe the decision problem running and see a solution that the decision problem uses to output True. With this, we can divide decision problems into two classes:

Verifiable decision problems. We can verify the solution given from $W$ in polynomial time relative to $I$.

Hard verifiable decision problems: