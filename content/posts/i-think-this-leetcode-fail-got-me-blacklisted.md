---
title: I Think This LeetCode Fail Got Me Blacklisted
date: 2024-03-16
tags:
  - algo
  - cs
---

Coming to Georgia Tech as a freshman last year, I was pretty bad at data structures and algorithms. So bad, in fact, my $O(cn^2)$ solution to a $O(n)$  got me pseudo-blacklisted from the company I was interviewing for.

## The Position
I was a freshman spam-applying to internships and eventually luckboxed an interview for a Web Technology Student Assistant at the Georgia Tech Research Institute (GTRI). I passed the resume screen and phone interview, but choked when it mattered most.

## Systems What

This interview was actually two parts: a systems design question and a LeetCode problem. I only say "systems design" in hindsight, I didn't even know what that meant until I flopped my Netflix interview a year later. 

Anyways, I got asked to design a system where a hypothetical tech lead could aggregate GitHub repositories that the engineers on their team depend on. I ended up talking about the frontend design of a website for like 80% of the time, then drew like 2/9 of a UML diagram on the whiteboard for some reason. The interviewers gave me a chance to redeem myself by asking how I'd implement testing and if I had any experience with tests. My response:

> *yeah, I've used TypeScript a little bit.*

Unsurprisingly, they eventually begged me to shut up so we could move to the algorithms question. Let's do it, it couldn't be that bad right? Right?! Oh n-

## The Question

The question was [Valid Anagram](https://leetcode.com/problems/valid-anagram/); an intuitive LeetCode Easy.

Here's the top-ranked solution on LeetCode:

```python
def is_anagram(s: str, t: str) -> bool:
    return sorted(s) == sorted(t)
```

People love upvoting trivial python one-liners in the Leetcode solution discussions, even though the trivial $O(n^{38.2})$ solution would warrant a *"we don't believe this position is the best fit for your skillset"* email irl. Though, I really shouldn't be the one talking. As a previous holder of the largest skill issue in the history of computing, I managed to write an even worse solution; a solution so bad that it got me blacklisted from the company.
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
Yikes, even calling this $O(n^2)$ is generous.

> `.remove()` is $O(1)$ right guys?

It's a miracle they even gave me the respect of a rejection email after this. If it were me, I would've ghosted myself just to force some level of self-reflection on how bad this solution was.

Just to clear my name a bit, here's the solution I wrote in during my 24-hour LeetCode stream a few months ago:
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

## Blacklisted?

Since applying and getting an interview last year, I've applied to 11 similar GTRI positions and gotten rejected from all of them without an interview. Is this likely copium? Yes, but I'd expect to get at least something the second time around, especially since I probably got ~3x better at programming since then.

Looking like (being) an idiot is just part of the game I guess. I'd like to think skill issues are mostly behind me. But sadly, the dragon compilers book is Dunning-Krugering me into the lower mantle right now. 
