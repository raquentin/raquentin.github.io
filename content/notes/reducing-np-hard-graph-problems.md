---
title: Reducing NP-Hard Graph Problems
date: 2024-04-03
tags:
  - cs
  - dsa
  - complexity
---
## Independent Set
Given as input a graph $G = (V, E)$ and an integer goal $g$, output whether there exists a subset of the vertices $S$ such that $|S| \geq g$ and that $\forall (v_a, v_b)$ pairs $\in V, \nexists (v_a, v_b) \in E$.

Independent Set is in $\mathsf{NP}$, since we can check that $|S| \geq g$ and iterate through the edges in $G$ and confirm that the source and destination of the edge are both not $S$ in $O(|V| + |E|)$ time.

Now let's reduce [[satisfiability#3SAT|3SAT]] to Independent Set to show that it is NP-hard. Given as input a set of clauses $C_1 .. C_m$ to 3SAT, build a graph $G$ as follows:
1. Represent each literal in the function as a vertex in $G$.
2. For each clause $C_i$, add edges between each pair of literals in the clause, forming triangles.
3. Add edges between each literal and its negation, if it exists in the function.

We take this graph as input into Independent Set, with goal $g = m$. Our function $f$ converts input $I$ of 3SAT into the graph $f(I)$ for Independent Set. This takes $O(3m) = O(m)$ time because we have at most three literals per clause to include as vertices into our graph. Our function is polynomial relative to $I$. 

Next, let's show that $x \in A \implies f(x) \in B$. A valid assignment of 3SAT implies that at least one literal evaluates to True in each clause. Therefore, in our graph $f(I)$, there must be at least one vertex from each clause that is not connected to the others. This is why we assign $g = m$; there must be at least $m$ independent literals that evaluate to True.

Now let's show $x \notin A \implies f(x) \notin B$. If $I$ is not a valid 3SAT assignment, then there exists a clause of 3 False literals. This means that $|S| \leq g - 1$ because the triangle representing the clause $m_i$ is not contributing a vertex to $S$.

We've shown that Independent Set is in NP, and reduced its NP-hardness from 3SAT; Independent Set is [[np-completeness|NP-complete]].
## Clique
Given as input a graph $G = (V, E)$ and an integer goal $g$, output whether there exists a subset of the vertices $S$ such that $|S| \geq g$ and that $\forall (v_i, v_j) \in S, \exists (v_i, v_j) \in E$.

Clique is in $\mathsf{NP}$, since we can check that $|S| \geq g$ and iterate through $S$ to ensure that each $(v_i, v_j) \in E$ in $O(|V| + |E|)$ time.

Let's reduce [[#Independent Set|Independent Set]] to Clique to show that it is NP-hard. Given as input a graph $G$ and goal $g$ to Independent Set, convert this graph to $G' = (V, \bar{E})$ where $\bar{E} = \{(x,y)|(x,y) \notin E\}$. This function $f$ takes $O(|E|)$ time.

Let's show $x \in A \implies f(x) \in B$. If $S$ is a valid solution for $I$, then all $v \in S$ have no edges connecting them. By the definition of $G', g = f(I)$, each pair of those vertices must have edges connecting them. Therefore, this subset must be a valid solution of Clique with goal $g$.

Next, let's do $x \in B \implies f(x) \in A$. By the same logic as above, if $G'$ is a valid clique, and we perform $h(G') = G$, the inverse of $f(x)$, $\nexists (v_i, v_j) \in V \ni (v_i, v_j) \in E$.

We've shown that Clique is in NP, and reduced its NP-hardness from Independent Set; Clique is NP-complete.
## Vertex Cover
Given a graph $G = (V, E)$ and a goal $g$, output whether $\exists S \subseteq V \ni |S| \leq g$ and all $v \notin S$ are accessible by one edge from a $v \in S$.  

Vertex Cover is in $\mathsf{NP}$ since we can confirm that $|S| \leq g$ in $O(|V|)$ time and then iterate through $E$ and ensure that each edge has $\geq 1$ endpoint in $S$ in $O(|V||E|)$ time. 

Let's reduce Independent Set to Vertex cover to show that it is NP-hard. Given as input a graph $G$ and goal $g$ to Independent Set, $f(I) = (G, |V| - g)$. Given a solution $S$ for Independent Set, we can return $S' = V \setminus S$.

Let's show $x \in A \implies f(x) \in B$. By the definition of Independent Set, our intermediate result $S$ is a set of $g$ vertices for which there exists no edge connecting them. This implies that $V \setminus S$ contains $|V| - g$ vertices that must share edges that connect the $g$ vertices in $S$. This is the definition of a Vertex Cover.

Next, let's do $f(x) \in B \implies x \in A$. If there are $|V| - g$ vertices which cover all other vertices, then the $g$ vertices not in $S$ must not be connected to each other by an edge, as it is required that all edges in $E$ have at least one endpoint in $S$. There must be an Independent Set of size $g$.

We've shown that Vertex Cover is in $\mathsf{NP}$, and reduced its NP-hardness from Independent Set; Vertex Cover is NP-complete.
## Subset Sum
Given a set $S$ of integers and a target $t$, output whether there exists a subset $S' \subseteq S$ such that the sum of the elements of $S'$ is exactly $t$.

Subset Sum is in $\mathsf{NP}$ since we can easily verify whether the sum of the elements of $S' = t$ in polynomial time.

Let's reduce 3SAT to Subset Sum to show that it is NP-hard. Given as input a boolean expression of $n$ variables and $m$ clauses to 3SAT, we will construct a set $S$ of $2(m + n)$ elements where each variable and clause will have two elements in the set $S$; $S = \{v_1, \neg v_1, .., \neg v_n, z_1, \neg z_1, .., \neg z_m\}$. For the reduction, if $x_i$ is true, we include $v_1$ in the sum, and never $v'_1$, and vice versa. We can set each of the values for the elements as $n+m$ digit numbers. We're essentially coding the evaluation of 3SAT variables and clauses within a derived $t$. This $t$ will take a form similar to 111333. In the first $n$ columns, we assign 1 to both $v_n$ and $v'_n$. In the last $m$ columns, we assign 1 to the literals in $C_m$. We also have $m$ buffer variables, $z_1 .. z_m$. If the possible sum can be less than 3, we add 1s in these buffer positions such that we reach 3. Our $t$ often takes the form 111333 because we must choose either $v_i$ or $v'_i$ in each of the $i$ 1s and then the $m$ 3s ensure that the clauses are satisfied because if it is not possible to make the sum exactly 3, then it's not possible to satisfy the original boolean expression.
## 3-Coloring
Given a graph $G(V, E)$, can we color the graph such that no two adjacent vertices share the same color?

3-Coloring is in $\mathsf{NP}$ since we can verify that a coloring assignment $C$ is valid if $C$ contains 3 colors total and that each vertex's neighboring vertices share a different color in $O(|V|^2)$ time.

Let's reduce 3SAT to 3-Coloring to show that it is NP-hard. Consider the 3SAT input of $n$ variables and $m$ clauses. We construct a graph $G = f(I)$ as follows:
1. Create a triangle of nodes from each $C_i$.
2. For each variable $x_i$, construct nodes labeled $x_i$ and $\bar{x}_i$ connected in a triangle with the node Base. When $G$ is three-colored, either $x_i$ or $\bar{x}_i$ will get a True coloring, which determines the assignment.
3. For each $C_i = (x_i \lor x_j \lor x_k) \in I$, add an OR-gadget graph with input nodes $x_i, x_j, x_k$ and connect the output node of this gadget to the False node and Base. This ensures that if $x_i, x_j, x_k$ are False, then the output node of the OR-gadget has to be False, and that if at least one of the inputs is True, then the OR-gadget is True.

Let's show that $x \in A \implies f(x) \in B$. If $x_i$ is True, then we can color $x_i$ True and $\bar{x}_i$ False in $G$, and for each $C_i$, at least one of the nodes $x_i, x_j, x_k$ will be True. The OR-gadget for $C_i$ can be 3-colored such that the output is True based on the other properties of the things it connects to.

Let's do the inverse, that $f(x) \in B \implies x \in A$. We can determine the truth assignments of $x_i$ and $\bar{x}_i$ from the colorings because it cannot be that any OR-gadget has all inputs False. Assume the contrary that all inputs in the OR-gadget are false, then the output of the gadget would be False, but since it's connected to both the False and Base nodes, this would disallow a three-coloring.

We've shown that 3-Coloring is in NP, and reduced its NP-hardness from 3SAT; 3-Coloring is NP-complete.
