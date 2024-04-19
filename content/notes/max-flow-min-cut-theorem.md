---
title: Max-Flow Min-Cut Theorem
date: 2024-04-14
tags:
  - dsa
---

## Max-Flow

A flow network $G = (V, E)$ is a subset of weighted graphs with a single source $s$ and a single sink $t$. Every edge in a flow network has a non-negative capacity $0 \leq c(u, v)$. We assume that if there is no edge from $u$ to $v$, then there is no edge from $v$ to $u$. We also assume that all vertices lie in a path between the source and the sink, $(s \rightarrow ..v \rightarrow t)$.

The maximum-flow problem has two constraints; each edge $u, v$ in a flow network has some flow $f(u, v) \ni 0 \leq f(u, v) \leq c(u, v)$, and the flow entering a node must be equal to the flow exiting a node. In this problem, we're trying to maximize the flow moving across the network given $G, s, t, c$.

## Min-Cut

An $s$-$t$ cut of a flow network $G = (V, E)$ is a set of vertices $L \subset V$ and $R = V - S$ such that $s \in L, t \in R$. The capacity of an $s$-$t$ cut $(L, R)$ is $c(L, R) = \sum_{u \in L, v \in R} c(u, v)$.

## Max-Flow Min-Cut Theorem

WIP
