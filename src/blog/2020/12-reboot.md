---
title: "Reboot/Catharsis"
slug: reboot-catharsis
date: 2020-03-24
description: "Spring cleaning. Or how to ditch Bootstrap, all JavaScript, jQuery etc. and end up with a new, faster website."
tags:
  - css
  - news
  - website
image: /img/blog/empty.jpg
---

Why?

A one word question seems like a good way to start off this article. But before we go into further details, maybe a word or two to shed some light on what's actually happened here.

If you've been here before (much appreciated!), you'll notice that the site looks somehow different. You may also have noticed that it loads much faster, depending on your connection of course. And in case you're reading this with JavaScript disabled, that's also some news - there's none of that here anymore. **So, this is basically a new website you're looking at.**

Getting back to answering the initial question of _why_ now, the answer could be any of the following:

- Coronavirus quarantine
- Bootstrap overdose
- Nord theme
- Design exercise
- I felt like it
- Spring
- ...

There's a second part to _why_ though, but we'll get to that in a bit.

## What?

Now that we've questioned my motivation, let's have a look at what I've done here exactly.

Previously, this website loaded at least 1.1 MB of resources/assets in 17 requests. This was due to Bootstrap 4 and its dependencies (i.e. jQuery), that `particles.js` library (was fun!) and some vain images to show off what I worked on (nothing wrong with that).

The copy of Bootstrap I used was cut down to the "essentials" over time, heavily customized in terms of colors, button styles etc. and way too bulky for this nimble website. jQuery wasn't utilized at all, except for a bunch of smaller UI things and `particles.js` was basically just a gimmick I wanted to try back in the day when this site was originally created.

What did I do with it, you ask? `Shift` + `Del`

I proceeded to write my own CSS from scratch (based on Eric Meyer's CSS reset) and tried to run the site without any client-side JavaScript. To be honest though, there are 4 lines of JS in here:

```js
window.addEventListener('load', function() {
  console.log('JavaScript: 404')
  console.log('Check the repo here: https://github.com/ttntm/ttntm')
})
```

## Again: Why?

It's certainly nostalgic somehow, but writing my own CSS without any framework made it feel like 20 years ago. I wanted a rather simple website, reduced to the necessary functionality to present content while feeling "whole" in a way.

It's not like this wouldn't have been achievable with most CSS frameworks out there, but I doubt many of them could do it for less than the 10 KB this site's (minified) CSS now has. To be honest, I was tempted to pick up Tailwind once again, mostly because of its high degree of customizability and its "everything's possible" approach. I'm glad I didn't though, for the sake of my HTML `class` attributes and the beauty of clean code.

To sum it up, my CSS consists of the above-mentioned CSS reset, some custom styles for all "static" elements (i.e. `nav`, `footer`) and a bunch of "utilities" (i.e. `padding`, `margin`, shadows, etc.) now. It's still processed by trusty old `gulp`, which is the last JS bastion still standing here.

As mentioned above, all other JS was completely removed - it's simply not needed for a nimble site like this. Hugo and Netlify are an extremely powerful tool set and the one bit of JS I feel like I need (comments) is handled by `gulp` and Netlify's API - details [here](/blog/static-blog-comments-hugo/).

## Ok, Done

Thanks for reading this, might give you some ideas. I'm already curious how long this version will last.

I'll go looking for some speed test results now, curious how this site performs "out there" now.

Honorable mention: glad I came across Nord Theme, super sleek colors.
