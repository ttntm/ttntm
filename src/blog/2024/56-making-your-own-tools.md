---
title: Making Your Own Tools
slug: making-your-own-tools
date: 2024-07-04T13:30:00Z
description: Thoughts about tools, and (the joy of) making your own tools.
tags:
  - personal
  - thoughts
image: /img/blog/content.jpg
showToc: false
---

Growing up with computers and the internet, my idea of a _tool_ became equivalent to software at a rather early age. Actual tools, in terms of hammers, power tools or screwdrivers, certainly existed in our household and were also interesting enough for me to learn how to use them at some point. However, none of that came quite close to how it felt to build my first website or to set up a brand-new wireless home network.

Many years later, the sentiment of "tool equals software" is still deeply embedded in my subconscious. I'm ok paying 100+€/year for a software subscription, but I'm somehow struggling to justify the purchase of a torque wrench (a ~120€ one-time payment) to myself. I'd only need that torque wrench maybe 5 times per year, but that's not really an excuse either, considering that it's probably a once-in-a-lifetime purchase.

Aside from making physical tool purchases a bit harder, my "tool equals software" mindset has contributed to the fact that I'd usually prefer to make my own tools whenever that made sense (sometimes also when it didn't, but that's another story). I'd also choose hand-coding websites into editors without syntax highlighting, while people across the room were cursing at Dreamweaver, and I built lightweight CMS systems from scratch, instead of installing another WordPress instance that'd get hacked at some point anyway.

Over time, most of the tools I built for myself, and others, eventually died or were replaced with other tools that did things better, but sometimes also worse. However, some of the tools I built stood the test of time, and even saw new features, updates and fixes. Let's talk about them now.

If we ignore this website (more on that later), my oldest actively maintained "make your own" tool is **recept0r**. It's a lightweight web application that me and my wife use to keep track of recipes we like to cook at home. The whole project is FOSS, the recipes are publicly accessible, but we're the only users.

My wife and I built the first version of recept0r in 2020, working on it together when the pandemic struck and confined us to our home. About a year later, during the late summer weeks of 2021, I re-wrote it from scratch and with a clear focus on long-term maintainability. I decided to do that, because the first year of usage proved that it's a very convenient tool that we wouldn't want to miss in our everyday life anymore. Now, almost 4 years after its initial release, we're preparing for a v3 with a couple of changes and new features.

A couple of weeks after I was done working on recept0r v1, I started building another tool and called it **watch3r**. The motivation for building it was accidentally re-watching a movie, and noticing lack of a simple tool to track movies and series. Netflix's horrible watchlist UX also contributed to the decision.

Working on watch3r was (and still is) fun, but it can also be quite a bit of a challenge. Contrary to recept0r, it's open for public signup, and it has about 50 users. Features and changes shouldn't break things and require a both careful planning and lots of testing. I haven't managed to break anything severely during the 3,5 years that watch3r's been operational so far, and I'm always a little surprised just how maintainable the project actually is, despite my questionable decision not to use Vue 3 with TypeScript.

When I changed jobs in early 2021, I moved from a product company to an agency. I found myself having to manage my time across many client projects, and I noticed that I was in need of a tool to keep track of what I was doing during the day. I could've just used a text file, or a spreadsheet, but instead, I sat down one Friday afternoon and started working on a time tracker.

Lucky for me, my wife had some spare design prototypes lying around, and by Sunday evening, I'd turned them into a simple task-based time tracker. We decided to call it **aitrack**, despite the lack of any "AI" in there, but the logo blob simply looked better that way (its original name was supposed to be _itrack_, without the "a").

There isn't too much to say about a time tracker, but it works reliably, and I use it pretty much every day. There are some ideas for future features, but I'm not exactly sure about them. The rather minimal base functionality just works, and at least I myself am not missing additional features that'd gradually move the application into the to-do list territory.

The last and also the newest tool I'd like to mention in this context is **TKB**, my personal knowledge base. I don't want to get into the details here, because I wrote [a whole article](/blog/personal-knowledge-base/) about it 2 months ago, but journaling/note taking/PKM apps simply didn't feel right to me anymore. Building my own personal knowledge base / wiki, on the other hand, felt (and still feels) like the - preliminary - end of a long process of finding out just what works best for me in terms of documenting and managing the many things I don't want to forget about.

As mentioned earlier, this website is actually my oldest actively maintained "make your own" tool. However, I'm not quite sure if I'd really call it tool, considering that it's turned into a multi-faceted creative outlet over the years. Either way, it's important to me and I love tinkering with it, sometimes even more so, than to use it to write and publish. But after all, it's a personal website, and there isn't any obligation to do anything at all. It only really matters how you (or me, in this case) feel about it - I love mine, and I'm really glad to have a tool like that at my disposal.

Feel free to explore the [Projects page](/work/) if you want to know more about the tools I mentioned.

&mdash;

This post was written as part of the {% reply "July 2024 IndieWeb blog carnival", "https://jamesg.blog/2024/07/01/indieweb-carnival-tools/" %}.
The carnival is hosted by {% ext "James", "https://jamesg.blog" %}, and this month's topic is "Tools".
