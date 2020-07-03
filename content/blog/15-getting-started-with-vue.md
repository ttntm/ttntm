---
draft: true
title: "Getting Started with Vue.js in 2020"
slug: vuejs-getting-started-in-2020
weight: -15
type: blog
date: 2020-07-03
description: "Lessons learned when getting started with Vue.js in 2020; not your typical Vue.js tutorial."
tags:
    - Vue.js
    - JavaScript
    - FaunaDB
    - Serverless
    - Netlify
images:
    - /img/blog/vuejs-screenshot.jpg #TAKE THIS IMAGE!!
---

This article is about {{< link-ext "Vue.js" "vuejs.org" >}}, but it is not going to be a Vue.js tutorial. There's enough good ones out there and I don't think I'll be able to compete with them. Instead, this is going to be a summary of my personal lessons learned when picking up Vue.js and starting to build something useful with it.

Now, what might be something useful? No offense to the ones advocating its teaching effect, but probably not the 10000st todo list app. After a bit of deliberation, I decided to go for a **recipes app** intended for real world use, i.e. collecting all the magazine clippings and grandma's notes in one place and making sure that it's also available as a PWA while standing in the kitchen and actually cooking.

**TL;DR** - I built a Vue.js based recipes app without ever having touched Vue before; you're going to read about the process of doing that (incl. all the helpful resources I came across!), the obstacles that came up and how I overcame them here. The app itself can be found over at {{< link-ext "recept0r.com" "recept0r.com" >}}.

## Initial Research and Decision Making

The decision for Vue.js was easy; some good reasons can be found here: {{< link-ext "michaelnthiessen.com/underdog-framework" "michaelnthiessen.com/underdog-framework" >}}

Other than that, there's always a long list of "technologies I'd like to work with"; for this side project, I ended up going for serverless (Netlify) functions and FaunaDB as the app's data store. Both seemed powerful (and free) enough to build a multi user CRUD app on top of.

Most other decisions for (and against) modules/libraries/etc. happened along the way, so you'll find them further below. The whole list of dependencies can be found in recept0r's `package.json` at {{< link-ext "GitHub" "github.com/ttntm/recept0r/blob/master/package.json" >}} in case you're curious.

## Let's Go!

{{< highlight js >}}

// some arbitrary code

.pipe(purgecss({
    content: ['./layouts/**/*.html','./content/**/*.md'],
    defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [], //save most things that should not be purged
    whitelist: [':hover',':focus', 'button', 'button:focus'] //preserve the rest
}))

{{< /highlight >}}