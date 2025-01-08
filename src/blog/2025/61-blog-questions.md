---
title: Blog Questions Challenge
slug: blog-questions-challenge
date: 2025-01-08T13:30:00Z
description: Why Am I Doing This? And How? Answers to questions about this website.
tags:
  - personal
  - website
---

I saw a couple of posts about a "blog questions challenge" pop up in my feed reader this week (written by {% ext "Leilukin", "https://leilukin.com/blog/posts/2025-01-07-blog-questions-challenge/" %}, {% ext "Hedy", "https://home.hedy.dev/posts/blog-questions-challenge/" %}, or {% ext "Luke", "https://www.lkhrs.com/blog/2025/blog-questions-challenge/" %}, for example) and decided to participate.

It's a collection of interesting questions, and I enjoyed reading what other people had to say so far.
Below you'll find my answers.

## Why Did You Start Blogging in the First Place?

I noticed that I'm very comfortable solving some my own problems with the help of other people's written instructions - anything from blogs and personal sites to various StackExchange communities - and I started thinking about sharing some of my experience and knowledge too. Over time, the content I published became a bit more personal, including thoughts, opinions and posts that weren't about anything technical at all.

## What Platform Are You Using to Manage Your Blog, and Why Did You Choose it?

I'm currently using using Eleventy, a static site generator, with content written in Markdown and stored in a git repository. Hosting, as well as builds and deployments, are handled by Cloudflare.

The site's architecture (JAMstack) is still the same that I created it with in 2018, but some components changed since then:

- **Hugo > Eleventy**: I switched to 11ty back in spring '21, because working with (and around...) Hugo wasn't much fun anymore. 11ty is native to the Node ecosystem, and offers significantly better authoring/developer experience (for my use cases). There's a dedicated [post about it](/blog/migrating-from-hugo-to-eleventy/), if you want to read more about the migration.
- **Netlify > Cloudflare**: a recent choice (spring '24), but a good one. CF's free tier is vastly superior to Netlify's offering, and a certain degree of [diversification](/blog/about-diversification/), in terms of hosting provider/platform choices is definitely not a bad thing until (if ever...) I decide to self-host everything.

## Have You Blogged on Other Platforms Before?

Most of it wasn't "blogging", but I've published my own written content on websites I've operated since the early 2000s.

Somewhat chronologically, that'd have been on the following platforms:

- hard-coded HTML
- Blogger
- WordPress
- TYPO3
- Public Wikis (i.e. Confluence, MediaWiki)
- GitHub/GitLab Pages
- <span>Dev.to</span>
- Hugo

## How Do You Write Your Posts?

I almost exclusively write in my code editor (VS Code) these days. Having the whole site context, shortcodes and snippets available while writing is a huge benefit compared to writing in other tools. I often used Notion in the past, and that made it necessary to edit almost every post before publishing - not really something that felt like time well spent.

## When Do You Feel Most Inspired to Write?

It varies.

For documentation, guides, or technical articles: usually while doing, or after having done the thing I'd like to write about, i.e. after building a demo/finishing a project, or after/while solving a problem. The further away the "done" milestone moves, the harder it becomes to pick up the respective topic again. I sometimes do, but unfortunately, most of my "write about something you did too long ago..." ideas rot in the `drafts` folder, and get discarded eventually.

For other kinds of writing, I often struggle with getting started. But once started, inspiration isn't really a factor anymore, and I usually wrap it up within a week or so, depending on the subject.

## Do You Publish Immediately After Writing, or Do You Let it Simmer a Bit as a Draft?

I have a dedicated folder for drafts and ideas that I'd like to come back to at some point. Most posts are written and published immediately though. I prefer them to be properly edited and readable right away, mostly free of typos (thanks to LTeX) and decently formatted - 11ty's local preview is a huge help there, of course.

## What's Your Favorite Post on Your Blog?

That's a hard question.

For a long time, it's probably been [this one](/blog/serverless-recipes-app-faunadb-vuejs/). It got a ton of exposure back in the day, was featured in various newsletters, and was one of the more "successful" articles - in terms of backlinks, clicks, engagement, etc. - I published on this website.

Considering recent times, my favorite posts are the ones I wrote for the (unfinished...) [#albums](/tags/albums/) series. Digging through my record collection and picking favorites for each decade was a fun experience, full of memories and nostalgia. It also started a couple of email conversations with people who shared their memories and thoughts related to what I wrote, a wonderful example of the internet still working as a medium to connect people.

## Any Future Plans for Your Blog?

A couple of things, yes.

Something I'd like to take care of rather soon, is adding a copy button to code blocks. That'd be a convenient feature for everyone, myself included.

An archive of past versions of the [/now](/now/) page would also be nice.

And finally, adding search functionality to this website has been on my list for a while. I've done it a couple of times for other static sites, but I haven't felt it's needed here. But: the amount of content published on this website is growing steadily, so it'd definitely be nice to make it searchable at some point.

NB: I usually keep track of these things in the [Appendix](/appendix/#intentions-and-to-dos)

## Why do you write? Other Than Your Blog, Do You Write Long-Form Content Elsewhere?

An interesting question. Many reasons, I think.

I often write things down to remember them at later point in time, and writing also helps me with structured thinking, planning, as well as systematically approaching any kind of problem. Communication is also an important aspect, especially today, considering that 99% of the phone calls I used to make 10 years ago have turned into (asynchronous) written communication.

In terms of writing _and publishing it on this website_, the answer's pretty much the same thing I wrote [above](#why-did-you-start-blogging-in-the-first-place). When it comes to the more personal content though, it's hard to tell - there are tons of thoughts, opinions etc. that might be interesting, but will never end up here. I guess it also depends on whether I'd think that someone else might be interested in reading it, even though that should probably matter a lot less.

Writing elsewhere?
Sometimes.

I used to publish some of my articles on <span>Dev.to</span> (in addition to being published here), but left that platform a while ago. I also had an article published in the {% ext "Ctrl-ZINE", "https://ctrl-c.club/~loghead/ctrl-zine.html" %} recently, and might do that again at some point. Not much else otherwise.

## It's Your Turn Now

I'll follow Leilukin's example and refrain from encouraging anyone in particular to participate in this challenge.

Instead, I'd like to encourage participation by everyone who's interested in answering (some of) these questions - regardless of whether you consider your website a blog, or simply publish written content somewhere outside social media.
