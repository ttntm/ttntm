---
title: "Website Evolution: Q2 2024"
slug: website-evolution-q2-2024
date: 2024-07-09T10:30:00Z
description: A summary of updates and enhancements of this website in Q2 2024.
tags:
  - evolution
  - series
  - website
image: /img/blog/website-evolution-q2-2024.jpg
---

There weren't quite as many changes in Q2 2024 as there were in Q1, but I managed to do lots of cool things nevertheless.

Part of the website [#evolution](/tags/albums/) series.

Just a short remark before we get started: this post will try to add context to changes, updates and enhancements. An uncommented chronology of changes can always be found in the [Changelog](/changelog/).

## Content and Pages

This section provides an overview of content and pages with details on what was added, changed and/or (re)moved.

### Albums

URL: [/albums](/albums/)

Creating this page was something that I wanted to do for a long time. Thinking about the music I love also lead to the posts in the [#albums](/tags/albums/) series, and I had a lot of fun writing them. Some of these posts also lead to interesting email conversations that I enjoyed very much.

Building the page turned into a second use case for my custom filter, and I [wrote about that](/blog/building-a-custom-filter-for-eleventy-collections/) in detail recently. I also added a "Layout" toggle to the page that currently supports both list and grid views.

### Everything

URL: [/everything](/everything/)

A list of every Blog Post, Like and Note published on this website.

The page itself is nothing special, just something I felt was missing. Oh, and there's also a matching [feed](/everything.xml).

### Hello

URL: [/hello](/hello/)

A new (kind of) "Contact" page, based on an idea that Alastair Johnson came up with in a post called {% ext "Introducing Hello pages", "https://alastairjohnston.com/introducing-hello-pages/" %}. It's a little more than the classic "Contact" page however, because it also explains _how_ one prefers to be contacted.

### Interests

URL: [/interests](/interests/)

Another new page that aims to shed some light on the person behind a (personal) website. Its creation was inspired by Chris Burnell's {% ext "/interests Directory", "https://chrisburnell.github.io/interests-directory/" %} that lists pages that have an /interests page, and his post titled {% ext "What are you interested in?", "https://chrisburnell.com/note/slash-interests/" %}.

### Other Changes

- Added an [OPML blogroll](/blogroll.opml) and joined the {% ext "Blogroll Network Map", "https://alexsci.com/rss-blogroll-network/" %}
- Created a [/blank](/blank/) page - it's mostly blank, so don't expect too much from it
- Restored some old blog posts that I'd unpublished a long time ago - there's nothing wrong with them, and I can't remember why I hid them, so they're back

## Features and Functionality

Additional features and changes enhancing the website's functionality.

### Blog Posts

I've added a new "Table of Contents" section to my blog posts which should help navigate the longer ones. It's a `details/summary` element that's collapsed by default. I'm using the `eleventy-plugin-toc` to create the ToC, and there's also a bit of modern CSS that hides it if it should ever be empty, which can happen for shorter posts:

```css
.toc-wrapper {
  &:not(:has(.toc)) {
    display: none;
  }
}
```

Implementing linkable headings for Markdown content was a prerequisite for that, and I'm happy I finally did that (using `markdown-it-anchor`) - it's been on my list of website improvements for a very long time. I've also added an override front matter key - `showToc` - to my `post` layout. It can be used to hide the ToC, even when it's not empty, because it'd be a bit silly to have one there (i.e. posts with only one heading).

Furthermore, my blog post template (and the RSS feed) now support a "last update" date. It gets displayed in the post header, right underneath the paragraph with the publication date and reading time.

In addition to that, blog posts are using the new [reading progress indicator](#reading-progress) now (see below for further details) and I added a couple of buttons to the post footer:

- "Copy Link", which can be found below "Reply With Email"
- "View All Posts/Tags" at the very end

### Navigation

Some cool stuff happened to my website's navigation.

I added the option of making the header sticky, using persistence in `localStorage`. It's a cool feature that leaves the decision of whether the header should be fixed to the top in the hands of the user.

In addition to that, the links in the main navigation were also updated:

- A sitemap icon was added to the header
- /likes was added to the header and footer navigation, replacing /work

There's also been a significant change of how (external) links are handled: I removed `target="_blank"` from wherever it was used, and decided that external links should display with a dedicated icon instead.
I also wrote a post called [external links and target="_blank"](/blog/external-links-and-target-blank/) about my recent insight regarding this topic.

### Reading Progress

Adding an indicator for reading progress to blog posts (and some other content) was another thing I wanted to do for a very long time. I finally found the time and motivation to do it, and I'm quite happy with the result.

The progress indicator is enabled for all blog posts, but it can also be used for any other page using a `showProgress` attribute in the front matter.

The code that manages this progress indicator can be found here: {% ext "useProgress.js", "https://github.com/ttntm/ttntm/blob/master/src/_includes/js/useProgress.js" %}

A nice detail: I'm using `window.getComputedStyle()` to determine the visibility of the progress indicator and only run the code if the element actually is visible. It's hidden on mobile devices, for example, and there's no need to waste resources on an event handler for a hidden element.
More information can be found in a recent note I wrote about it: [JavaScript: element visibility](/notes/#35)

## Look and Feel

Not too much happened here:

- An SVG wave background image was added to the footer, it's less boring now
- `position: sticky;` was used to put the ever-growing table of contents of the /notes page into a scrollable box
- The layout of individual /likes entries was updated
- Descriptions for tags were added to pages listing tagged content
- The icon before/after the year headings on the blog archive page was changed

## Setup and Other Technical Stuff

I upgraded to Eleventy 3.0.0-alpha.* and wrote about it: [Upgraded to Eleventy v3](/blog/upgraded-to-eleventy-v3/)

I also restructured my `_includes` folder because it was getting way too messy.
There are 3 subfolders now:

- `/components`
  All the various Nunjucks components
- `/css`
  CSS modules for `postcss`
- `/js`
  JS composables
- `/macros`
  Nunjucks macros

The new structure works better for me, but updating all my old `include` statements manually would've been a lot of pain. I'm happy I figured out how to use RegEx-based search and replace with append in VS Code, and I shared that as a note: [VS Code: RegEx replace and append](/notes/#37)
