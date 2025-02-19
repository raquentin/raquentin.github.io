---
title: "On garbage closed-source HTTP clients"
date: 2024-08-19
tags:
  - cpp
---

Much of the greatest software ever written is the product of earlier closed-source alternatives being trash. We have:

  - GIMP, because Adobe is paid closed-source corpoware
  - Audacity, for the same reason
  - LibreOffice, because Microsoft
  - Git, because the BitKeeper guy nuked its free version
  - Postgres, because why are you using a proprietary db, especially one from Oracle
  - ..

Fast forward 20 years, I'm running my work's internal K8s tool on local and need to ping an endpoint to test a new feature. The payload is a bit big to type after `curl`, so I'll just download Postman and run the request there. Seems easy enough, right?

## Wrong

![[postman-ad.jpeg]]

Why do you need to:
  - download a large desktop app,
  - connect to the internet,
  - make an Postman account,
  - get and delete spam emails,
  - join the team org,
  - and watch a 2 minute ad

just to send an HTTP request that's calling into `libcurl` anyways?

## You don't

I got home and started building [[https://github.com/raquentin/raquest|raquest]], a minimal HTTP client that runs requests from `.raq` files. The goal is to provide an experience similar to storing `curl` commands in bash files, but with better errors, json support, and other features. No need for a UI, account, or internet connection. Learn the `.raq` syntax in a few minutes, write your request, `git add` it and go on with your day.

## Conclusion

I wrote this post less to shill my project and more to acknowledge an annoying reality of how we consume b2b software. Our industry's cognitive dissonance to build half our infra on unsponsored open-source libraries while paying premiums for closed-source trashware is embarrassing; we have a habit of paying millions for corpoware that adds little to the open-source libraries its built on.

My favorite thing about programming is that anyone with a CPU and a NIC can contribute to the masses of packages that power everything we do on computers. None of this exists without a u64-overflowing amount of abstractions developed over decades by our best programmers, often for free. It is sad to see phenomena like Windows/MacOS reliance, unhesitated glazing of a closed-source company called OpenAI, and dependence on Postman-esque devtools verify a velocity towards corporatization and away from the principles that paved the way for modern software.
