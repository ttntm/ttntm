---
title: About Diversification
slug: about-diversification
date: 2024-03-15
description: A few words about my cloud platforms and service provider choices.
tags:
  - personal
  - serverless
image: /img/blog/content.jpg
updated: 2024-05-28
---

Sometimes, all it takes to question our own choices is just a headline. Most recently, that headline was: "Netlify just sent me a $104K bill for a simple static site".

Someone posted this as a question to Reddit about 2 weeks ago (Feb. 27th, {% ext "source", "https://old.reddit.com/r/webdev/comments/1b14bty/netlify_just_sent_me_a_104k_bill_for_a_simple/" %}), and I rather quickly realized that I'd used Netlify for almost every personal project, demo and PoC I worked on since 2018. As such, not only a "bill shock" like that, but also many other things that can potentially happen to my account there could lead to extremely unpleasant situations.

I don't want this to come across the wrong way though, so let me just say that I personally never had any issues with Netlify's service at all. If anything, their (free) tier has been _too convenient_ for me, which made it feel even more natural to add projects and sites to my subscription. However, I never "struck gold" with anything I use their service for, so fees, limits etc. weren't something I paid much attention to.

Anyway, I ended up looking into alternatives for my projects and sites and started this spring-cleaning operation by having a look at what had accumulated in my account over time.

There were many demo/PoC sites that I created for articles, some personal sites (like this one) and a couple of web applications. Next, I made a list and identified projects that could easily be moved elsewhere:

- For demos and PoC sites:
    - Codeberg Pages
    - GitHub Pages
- Production sites and projects without Netlify features:
    - Cloudflare Pages

That list proved very helpful: of a total of 21 sites in my Netlify account, 6 were moved and 2 were archived and deleted.

Many sites I kept in there were frozen (i.e. disconnected from git), because they're pretty old; I didn't want to mess with them any more than necessary. Others were left untouched because they're using Netlify features like Forms, Functions or Identity.

Migrating TLDs and the respective sites into Cloudflare Pages was really easy though, and they even provide a dedicated article in their documentation: {% ext "Migrating from Netlify to Pages", "https://developers.cloudflare.com/pages/migrations/migrating-from-netlify/" %}. Also, putting a project's built files into a `/docs` folder in the same repository as the source code (GitHub), or into a `pages` branch (Codeberg), felt like a good idea; I'm actually surprised that I didn't make use of this feature earlier.

So far, I moved both {% ext "aitrack.work", "https://aitrack.work" %} and this website to Cloudflare Pages and it was an amazingly smooth process overall. I really like the additional configuration options (complete with matching documentation) and the insights that are offered there by default.

This is a screenshot of this website's "Overview" in the dashboard:

<img src="/img/blog/cfp_overview.jpg" class="img-fluid img-center" alt="A screenshot of this website's 'Overview' in the Cloudflare Pages dashboard">

I'm not used to that much information for my personal projects, so that's a rather pleasant surprise.

Overall, I think reviewing my cloud platform and service provider choices was long overdue. Distributing sites and projects across different platforms feels like a good decision and should help minimize risks - at least until I can commit to self-hosting everything.

## Updates

2024/05: Another side of CF - [Cloudflare took down our website after trying to force us to pay 120k$ within 24h](https://robindev.substack.com/p/cloudflare-took-down-our-website) incl. the linked stories from HN.
