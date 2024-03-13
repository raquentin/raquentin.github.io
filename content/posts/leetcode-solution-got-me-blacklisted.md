---
title: A LeetCode Solution So Bad It Got Me Blacklisted from the Company
tags:
  - algos
  - cs
---

Coming to Georgia Tech as a freshman last year, I was laughably bad at data structures and algorithms. So bad, in fact, my $O(cn^2)$ solution to a $O(n)$ LeetCode easy got me pseudo-blacklisted from the company I was interviewing for.

## The Position
The monstrocity occured during my in-person technical interview for the Web Technology Student Assistant at the Georgia Tech Research Institute (GTRI). This was the second and final interview in the process, the first being a phone interview sanity-check where I talked about my elementary personal projects. Not exactly sure what I had on there, but probably just a trivial webapp not too much better than your classic React To-Do app and some other longshot proj that's conveniently a "work in progress".

## Systems Design

This interview was actually two parts: a systems design question and then a LeetCode problem. I only say "systems design" in hindsight, I didn't even know what that meant until [[fumbling-the-bag-at-netflix|I flopped my Netflix interview]] a year later. I ended up talking about the frontend design of the system for like 80% of the time. Got asked how I'd implement testing and if I had any experience with tests. Of course I did, I confidently said

> *yeah, I've used TypeScript[^1] a little bit. It's pretty cool and I like the type-safety compared to JavaScript*

Unsurprisingly, they eventually insisted we move to the algorithms question. I mustered up some fake confidence and agreed. It couldn't be that bad right? Right?! Oh n-

## The Question

The question was [Valid Anagram](https://leetcode.com/problems/valid-anagram/), a LeetCode easy. Honestly just calling it a LeetCode easy is giving this question a lot of credit; this genuinely might be the easiest question on the site.

Here's the top-ranked solution on LeetCode. Thanks to lazy bots who boot up LeetCode and spam up-vote the simplest solution they see, it's a trivial and relatively slow solution.

```python
def is_anagram(s: str, t: str) -> bool:
    return sorted(s) == sorted(t)
```

Type of solution to make a guy say "okay, and?". I'm genuinely surprised at how many people are reposting and up-voting these trivial solutions. I'll look at the solutions for a LeetCode hard and the top result is a Python one-liner that runs in $O(n^{68})$ time with $O(n!)$ space and barely even solves the problem.

Yet, my huge skill issue + some first-interview nervousness led me to frantically write an even worse solution; a solution so bad that it got me blacklisted from the company:
```python
def is_anagram(s: str, t: str) -> bool:
    s_list = list(s)
    t_list = list(t)

    try:
        for c in list(s):
            s_list.remove(c)
            t_list.remove(c)
    except:
        return False

    if s_list: return False
    if t_list: return False
```
Even calling this $O(n^2)$ is generous. I probably thought I was so smart whipping out the `list()` and `try/catch` too. Got the vague naked `except` and the nested `.remove()`, it was actually -10x engineer activities in the interview room. It's a miracle they even gave me the respect of a rejection email after this. If it were me, I would've ghosted myself just to force some level of self-reflection on how bad this solution was. A solution so terrible, if I luckboxed and got the job by some black magic I'd deserve imposter syndrome.

Just to set the record, here's the solution I wrote in during my 24-hour LeetCode stream a few months ago:
```python
  def isAnagram(self, s: str, t: str) -> bool:
      if len(s) != len(t): return False

      dS, dT = {}, {}
      for i in range(len(s)):
          if not s[i] in dS: dS[s[i]] = 1
          else: dS[s[i]] += 1
          if not t[i] in dT: dT[t[i]] = 1
          else: dT[t[i]] += 1
      return dS == dT
```
A pretty easy $O(n)$ solution to an embarassingly easy problem. 

## Getting Blacklisted

Perhaps I've been a bit clickbaity here, but since applying and getting an interview last year, I've applied to 11 similar GTRI positions and gotten rejected from all of them without an interview. Is this likely copium? Yes, but considering how much I've improved since this blunder, I'd expect to get at least something the second time around.

But yeah, looking like (being) an idiot is just part of the game I guess. Having purple Among Us characters painted into my hair didn't help that idiot image either to be fair. Theoretically, being trash at cs is mostly behind me. Sadly, that theory is false, the dragon compilers book is Dunning-Krugering me into the lower mantle right now. 

[^1]: Perhaps this planted the seed that's recently grown into my hatred for the ~~VS Code extension~~ "programming language" TypeScript.
