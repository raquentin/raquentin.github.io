---
title: The disservice of java-based computer science curricula
date: 05-08-2024
draft: true
tags:
  - cs
  - pl
---

Java hate [transcends decades](https://www.joelonsoftware.com/2005/12/29/the-perils-of-javaschools-2/). I actually enjoy object-oriented programming on occasion. The problem is never knowing functions outside of association with a data type.

> “Kernels of good ideas have been taken to holistic extremes in a way that has been disasterous to the industry and certainly to programming education.” \
> \- Brian Will

## Problems

### Learning OOP out of the context

We don't learn that oop is a tactic to control the state of otherwise procedural programs. A divide and conquer approach to handling application state

We aren't learning OOP as a programming paradigm relative to software design. We leave CS 1331 (Introduction to OOP) and CS 1332 (Data Structures and Algorithms) knowing OOP as the way we do things. Even in Objects and Design, the only required software design course, we build an OOP Android Studio frogger game because that's the project we're given, and we dont consider the rationale as to why OOP is a good or bad pattern to build the game with.

### Missed opporunities in threads because of Java inertia

comp audio in java? 

### Misaligned with clubs, open-source, and research

Clubs don't use Java, open-source doesn't, research doesn't.

## Solutions

### A basis in assembly language and lambda calculus

#### CS 2110 - Computer Organization & Programming

Some may critique that first-year students are not ready for the difficulty of manual memory management or assembly programming. This is incorrect, as the current It is laughable that CS 1331 (Introduction to OOP) is a prerequisite for a course on basic computer hardware, assembly language, and C programming. Perhaps we'll never know how Dennis Ritchie managed to make C without it.

#### Haskell, C, Verilog, Tensorflow

george hotz reference. we learn each principle to really understand the most about programming

### A language and project-agnostic software design course

we need this bc we only learn oop. we have no theoretical nor practical functional programming courses.

#### CS 2340 - Objects and Design

android studio game dev project w/ a focus on using UML diagrams to plan out object-oriented software. Also has lectures and tests on software project management methodoligies. Students should develop skills and resume projects in niches that are useful and enjoyable. Making a frogger game for android is not that. Second year CS should not be AP computer science principles. If we're not going to facilitate students to build things they are interested in in class, we should not distract them with busy work that prevents them from doing so on their owns.

### Relevant software engineering courses

realistically, most people are going to pursue software engineering. I agree this is a degree in computer science, and hence only a minority of the degree should be related to software engineering. Tech gets old, required and broad courses should be language-agnostic where applicable.

#### CS 4590 - Computational Audio

ignore the fact this class is about using libraries and nothing about dsp
Comp audio. Why are we using anything but C++ (perhaps with JUCE), this is the standard both industry and research. Java with Processing is not preparing students to be useful in this domain.
sasdf

### More rigor in math and computer science

Less calculus, history, and free electives. More algebra, combinatorics, and automata. The best foundation to be great is technical knowledge from a physics side of electricity and from a math side of algebra. Combining the physics that allow computers to exist and the math that proves why programming langauges work.

## Conclusion

But seriously, why can't we just go back to reading the Structue and Interpretation of Computer Programs?
