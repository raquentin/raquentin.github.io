---
title: Max flow
date: 2025-09-17
tags:
  - algorithms
  - graph
---

Consider a directed graph $G$ with arbitrary vertices $s$ and $t$. Thinking of the weight of each edge as a capacity, max flow asks for the maximum amount we can push from $s$ (the source) to $t$ (the sink). The "liquid in pipes" metaphor is pretty useless, but there are many seemingly difficult problems that are made obvious via a mapping to max-flow.

In later definitions you'll find references to the "amount" or "how much" of something we can push from $s$ to $t$. A natural question asks what exactly is being counted and pushed. The genericness of the capacity and thus the flow is inherited from the unitless nature of edge weights. Our edge weights are unitless integers, so the max flow from $s$ to $t$ is as well.

## Defining flow networks
Along with a directed graph $G = (V, E)$, we have a capacity for each edge $c(u v) \ge 0$, and two vertices $s$ and $t$.

A **flow** $f(uv)$ for any edge in $G$ satisfies:
- the capacity constraint, that $0 \le f(u v) \le c(u v)$.
- conservation, that for nodes besides $s$ and $t$, $\sum_x f(x v) = \sum_y f(v y)$. In other words, the sum of all flows with directed edges to any $v$ is equal to that of edges from $v$.
- the amount leaving $s$ is equal to the amount entering $t$, that $|f| = \sum_y f(s, y) = \sum_x f(x, t)$.

The goal of max flow is to maximize flow.

## Residual capacities, augmenting paths
Given a flow $f$, define the **residual capacity c_f$:
- Forward room is $c_f(u v) = c(u v) - f(u v)$. It's how much beyond the flow our capacity would let us push.
- Backward room is $c_f(v u) = f(u v)$. It's how much we could send backwards in the network for use in a more optimal subpath.
All edges with positive $c_f$ form the residual graph $G_f$, an augmenting path is any $s,t$-path in $G_f$.

Let $\Delta$ be the minimum residual capacity along an augmenting path. If we add $\Delta$ to every forward edge and subtract it from every backward edge, we increase the flow of the network by $Delta$. In essence, the residual path uses the flow at immediate edges to instruct the $s,t$-path that maximizes $f$.

## Algorithms

### Ford-Fulkerson

As long as there's a way to increase flow (there's some augmenting path in $G_f$), push as much as you safely can onto it. The amount being pushed is inherently $\Delta$. Update the residual capacities and continue. When no augmenting path exists, we've reached maximum flow.

### Edmonds-Karp

Edmonds-Karp combines Ford-Fulkerson with BFS. FF shows us that there if we build a residual graph, find a augmenting path, increase the network flow by $\Delta$, and repeat until there is no augmenting path, then we've reached max flow. EK constructs the residual graph like FF but intelligently chooses the augmenting path with the fewest edges via BFS. Augmenting along this path by $\Delta$ and recomputing until no augmenting path exists gives a polynomial bound to the max flow problem.
