---
title: Satisfiability
tags:
  - algo
  - cs
date: 2024-03-23
---

 Satisfiability continues a conversation on [[np-completeness|NP-completeness]]. To prove some problem B is NP-complete:
 1. Prove $B \in \text{NP}$ by showing that it is verifiable in polynomial time.
 2. Prove $B$ is NP-hard; $A \leq_{p} B$. For this, choose some known $A$ which is NP-complete, then give some reduction $f$ computable in polynomial time such that for every $x \in A$:
	- $x \in A(\text{is good}) \iff f(x) \in B(\text{is good})$
	- $x \notin A(\text{is bad}) \iff f(x) \notin B(\text{is bad})$

In order to prove that a problem :is NP-complete, another NP-complete problem must exist. However, Cook and Levin proved SAT is NP-complete without a predecessor; $\forall A \in \text{NP}, A \leq_{p} \text{SAT}$.

## SAT
A variable is one of $x_1, x_2, ..., x_n$. A literal is a variable or its negation; $x_i$ or $¬ x_i$. A clause is an OR of several literals. A formula in CNF form is an AND of several clauses.
For example, $(x_1) \land (\neg x_1)$ is unsatisfiable.

Definition: $\Phi \in \text{SAT}$ such that $\Phi$ is a formula in CNF form and is satisfiable.

Cook and Levin proved $L \in \text{NP} \implies L \leq_{p}$ SAT. So if $\text{SAT} \in \text{P} \implies \text{NP} \subseteq \text{P} \implies \text{P} = \text{NP}$. SAT is like an elected representative of the entire NP set. This is why we don't believe there exists a polynomial time algorithm for SAT.

## 3SAT
We prove that 3SAT is NP-complete by reduction. First, we show $\text{3SAT} \in \text{NP}$. Our witness is the assignment of variables for the problem instance solution. All of these computations can be done in polynomial time. For all $\Phi(C_1, ..., C_m)$, check if $\Phi(C_1,...,C_m) = 1$ or not.

Now we prove $\text{SAT} \leq_p \text{3SAT}$. For a general SAT formula, we convert it to a 3SAT instance such that $\Phi$ is satisfiable iff $F(\Phi)$ is satisfiable. An input $\Phi$ of every SAT formula has some max clause size $k$. If $k \leq 3$ then $\Phi$ is in both SAT and 3SAT. Now suppose $\Phi$ has a max clause size less than 3. We convert a clause size of $k > 3$ to a pair of clauses, one of size $k-1$ and the other of size $3$. We add a variable $z$ as follows:

$$(x1 ∨ x2 ∨ · · · ∨ xk−1 ∨ xk) \iff (x1 ∨ x2 ∨ · · · ∨ xk−1 ∨ z) ∧ (¬xk ∨ ¬z)$$

Note, if the $k$ clause is true, at least one of the literals is true, so there is a selection in $z$ to make the two clauses true. If $k$ is always false, the two clauses are false for any $z$. Repeat this process, adding dummy variables, until $\Phi$ only has clauses of size 3. This reduction occurs in polynomial time. $\text{SAT} \leq_p \text{3SAT}$, so $\text{3SAT}$ is NP-complete.

Cook and Levin showed that $\text{SAT} \in \text{NP}$. We found that $\text{3SAT} \in \text{NP}$. We could repeat this reduction for any SAT variant with $k \geq 3$.

## 2SAT
$\text{2SAT} \in \text{P}$, so if $\text{3SAT} \leq_p \text{2SAT}, \text{SAT} \in \text{P}$ and $\text{NP} = \text{P}$. This equivalence is intuitively false though; $(p \Rightarrow q) \iff (\neg p \lor q)$, so every clause of size two is an implication.

Create a graph with two vertices for each literal and two edges for each clause. If $(a \lor b)$ is a clause, add edge $\neg a \rightarrow b, \neg b \rightarrow a$. Implication is transitive, and a formula is unsatisfiable iff $\forall x, (x \Rightarrow \neg x) \lor (\neg x \Rightarrow x)$, so there exists a path in our graph from $x$ to $\neg x$ and vice versa.

## CircuitSAT
Let cSAT be defined as the set cSAT = { $C$ | $C$ is boolean circuit}. We prove that cSAT is NP-complete.

First, we show that cSAT $\in \text{NP}$. The verifier $V$ takes as input $C$ and a witness of $n$ bits, and runs $C$ on the inputs. The size of the input is intuitively polynomial (more depth, more gates).

Now we show that $\text{3SAT} \leq_p \text{cSAT}$. Let $\Phi$ be a $\text{3SAT}$ formula. We create a boolean circuit with variables $x_1,...,x_k$ and additional input wires for negated literals. We add one root gate on the next layer. For each clause, add a sub-circuit for the appropriate three. Then, add an AND gate to AND the clauses together.

If $\Phi \in \text{3SAT}$, this circuit $C = F(\Phi) \in \text{cSAT}$. If $\Phi \notin \text{3SAT}$, this circuit is also unsatisfiable. Construction of this circuit takes polynomial time. $\text{3SAT} \leq_p \text{cSAT}$ so $\text{cSAT}$ is NP-complete. 
