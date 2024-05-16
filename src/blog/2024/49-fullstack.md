---
title: Growing Into Full Stack Development
slug: growing-into-full-stack-development
date: 2024-05-16
description: A note based on a recent email conversation about growing into full stack development.
tags:
  - learning
  - opinion
  - personal
image: /img/blog/content.jpg
---

This is a note based on a recent email conversation I had with Luke Harris in response to his recent article {% ext "Thinking about what's next", "https://www.lkhrs.com/blog/2024/whats-next/" %} from April 2024.

I transitioned to full stack / backend development (and workflow automation) a couple of years ago, after having done mostly web design / frontend work for about 10 years prior to that. I had some experience working on monolithic MVC applications and serverless (hobby-) stuff, but I didn't think I'd ever end up working as a full stack developer.

When I was looking for a job a while ago, after having spent 8 years at a small company, I got a job offer that I initially declined. I did that, because it looked like it was only about customizing standard software, which I didn't feel too comfortable with at the time, considering I'd spent those 8 years at an M$-partnered software maker. Thankfully, the HR person didn't like me declining that offer very much and sent back a couple of links that she got from my future team lead. Curiosity kicked in, I read through a couple of things, found it interesting and scheduled an interview. I got picked from a total of 11 applicants and became part of a team in a larger organization (100+ people in my country, 1000+ in EMEA).

It seems like it was the right decision for me at the time: years passed, and I'm still working at the intersection of full stack development and workflow automation.

So, here's a short list of things I found helpful when growing into full stack development.

## SQL

Regardless of what programming language you decide to focus on: learn and practice SQL, if you haven't already. It's truly invaluable, and you'll need it almost anywhere.

I can _really_ recommend clicking this link:
{% ext "SQL Crash Course", "https://sqlcrashcourse.com" %}

And Oracle also has a decent online SQL engine that is free (AFAIR, it's been a while):
{% ext "Live SQL", "https://livesql.oracle.com" %}

I'd recommend focusing on queries, aggregating, grouping and filtering data.

## Software Architecture

What helps one learn software architecture design patterns?
In my case? Getting dropped into freezing cold water...

Seriously: compound knowledge assembled from working on tenders (that often expect a target architecture), estimates for projects and technical "consulting" work for enterprise clients at a former job.

No formal training, aside from bits and pieces at university, just reading and learning from others (thank you, elder colleagues!).

A few pointers:

- O'Reilly Books
  - "Designing Distributed Systems"
  - "Reactive Microservices Architecture"
- "Distributed Systems" by M. van Steen and A.S. Tanenbaum
  {% ext "distributed-systems.net", "https://www.distributed-systems.net" %}
- Martin Fowler's {% ext "Software Architecture Guide", "https://martinfowler.com/architecture/" %}
- {% ext "The C4 model for visualising software architecture", "https://c4model.com" %}
- Khalil Stemmler's articles about {% ext "Architecture", "https://khalilstemmler.com/articles/tags/architecture/" %}

## Documentation

Any kind of "hard" documentation skills (i.e. BPMN, UML) are valuable.

Some examples:

- {% ext "demo.bpmn.io", "https://demo.bpmn.io" %} (Drawing charts)
  - +{% ext "bpmn.org", "https://www.bpmn.org" %} (Quick Guide, Examples)
- {% ext "PlantText", "https://www.planttext.com" %}
  - +{% ext "The Hitchhiker’s Guide to PlantUML", "https://crashedmind.github.io/PlantUMLHitchhikersGuide/" %}
- The C4 model listed above

## What else?

Miscellaneous things that might make you a better developer/person/etc.:

- Exercising patience
- Establishing, operating and optimizing processes that involve different (legacy) systems and interfaces, which leads to tons of glue code
- The willingness and courage to fix issues in production
- Writing clean, performant server-side code in ES3 JS that serves millions of requests per month
- Friday afternoon deployments, followed by Friday night ninja fixes and/or rollbacks
- Surviving big bang go-lives
