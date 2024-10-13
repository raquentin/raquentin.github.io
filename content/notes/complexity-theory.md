---
title: Complexity theory
date: 2024-04-03
tags:
  - math
  - dsa
  - complexity
---
Complexity theory reiterates on concepts from [[satisfiability|satisfiability]] and [[np-completeness|NP-completeness]].
## NP
We define a **decision problem** as a problem where given an input $I$, we output either True or False depending on if there exists a solution matching the problem's requirements.

Suppose that we have a witness $W$ — some entity that can observe the decision problem running and see a solution that the decision problem uses to output True. With this, we can divide decision problems into two classes:

Verifiable decision problems. We can verify the solution given from $W$ in polynomial time relative to $I$.

Hard verifiable decision problems: There is no known polynomial time verification to the solution from $W$; our current understanding tells us that we need exponential time for verification.

We denote $\mathsf{NP}$ as the class of all verifiable decision problems. We could also define $\mathsf{NP}$ as the set of all search problems, where a search problem meets these conditions: (1) for an input $I$, its algorithm outputs a solution $S$ or specifies that there is no solution, and (2) for a candidate solution $S$, it is possible to verify its correctness in polynomial time relative to the size of $I$.
### MST Decision Problem
Given input $I : G(V, E), r$, output whether there exists a spanning tree of $G$ with weight $\leq r$. 
2. Verify that $\sum_{e \in s} w(e) \leq r$, where $w(e)$ is the weight of edge $e$.

Summing all the runtimes, we get $O(|V| + |E|)$, which is polynomial time. MST is in $\mathsf{NP}$.
### K-coloring
Given input $I: G(V, E)$ and $k \in \mathbb{N}$, output whether there exists a $k$-coloring of $G$. A $k$-coloring is an assignment $\sigma$ for all $v \in V$ such that $\forall e = (u,v) \in E, \sigma(u) \neq \sigma(v)$.

Suppose we find a candidate assignment $S$. Then, we could iterate through each edge $(u, v)$ in $G$ and check that $\sigma(u) \neq \sigma(v)$. This takes $O(|E|)$ time, so $k$-coloring is in $\mathsf{NP}$.
### 0/1 Knapsack
Given input $I$, a set of items ${1 .. n}$ with corresponding values $v_1..v_n$ and weights $w_1 .. w_n$, and a capacity $B$, output whether there exists a collection of items that maximizes the total value and keeps total weight $\leq B$. 

Suppose we find a candidate collection $S$. We can easily show that the total weight $\leq B$, but we will need to run Knapsack-search to find if the total value is maximized. However, Knapsack-search runs in pseudo-polynomial time, which is really exponential time. The runtime of Knapsack-search is $O(nB)$, but since it takes $log_2(B)$ bits as the input size to represent $B$, the runtime is $O(n2^{log_2B})$, which is exponential with respect to $I$. We hence cannot conclude that 0/1 Knapsack is in $\mathsf{NP}$.
### SAT
Given a function $f: {x_1 .. x_2} \rightarrow {0, 1}$ in conjunctive normal form (CNF), output whether there exists an assignment ${x_1 .. x_n}$ such that $f = 1$. 

Suppose we have a function $f$ in CNF:
$$(x1 ∨ x2 ∨ x3 ∨ x4) ∧ (\bar{x}1 ∨ \bar{x}4 ∨ x5 ∨ x6) ∧ (x3 ∨ \bar{x}5 ∨ x7)$$
and a candidate assignment $S: {x1 .. x7}$. To verify $S$, we just have to plug $S$ into $f$. This takes $O(nm)$ time, where $n$ is the number of literals and $m$ is the number of clauses.

The subset of $\mathsf{NP}$ problems where we know of a solution that *solves* the problem in polynomial time is $\mathsf{P}$. We have that $\mathsf{P} \subseteq \mathsf{NP}$. For example, MST is in $\mathsf{P}$ because of Kruskal's and Prim's.
## Reductions
A reduction from problem $A$ to problem $B$ shows that $B$ is at least as hard of a problem to solve as $A$. We take an input, or instance $I$ in problem $A$ and convert it to an input $I'$ of problem $B$ using a polynomial time function $f$. Then, we retrieve a solution $S'$ by running any algorithm for $B$, and then convert it back to a solution $S$ of $A$ using a polynomial time algorithm $h$.

![[reducing-problems-complexity-theory.png]]

To complete the reduction, we must show that there is a solution to input $I$ for $A$ iff there is a solution to input $I'$ for $B$. We show that $A$ is just a special case of $B$, therefore $B$ must be at least as hard as $A$. This process involves three steps:
1. Describe the function $f$, which is the transformation of the instance $I$ for problem $A$ to instance $f(I) = I'$ for problem $B$, and show that it runs in polynomial time.
2. Describe the function $h$, which converts the solution to instance $I'$ from $B$ back into a solution for instance $I$ in $A$.
3. Show that there is a solution for $I$ in $A$ iff there is a solution for $I'$ in $B$. To prove that $a \leftrightarrow b$, you must show that $a \rightarrow b$ and $b \rightarrow a$. It is often easier to use the contrapositive and  show that $a \rightarrow b$ and $\neg a \rightarrow \neg b$. It doesn't need to be a rigorous formal proof, just show correspondence in both directions.

A problem $C$ is NP-hard if there exists a reduction $A \leq_p C$ from all problems $A \in \mathsf{NP}$. Therefore, $C$ is at least as hard as all problems in $\mathsf{NP}$. Therefore, you can prove a problem $D$ is NP-hard by finding a reduction $H \leq_p D$ for some known NP-hard problem $H$.

A problem $C$ is NP-complete if it is in $\mathsf{NP}$ and NP-hard. NP-complete problems are the hardest known problems in $\mathsf{NP}$, as all other $\mathsf{NP}$ problems reduce to it.
