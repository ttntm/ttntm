---
title: "Website Evolution: Q1 2025"
slug: website-evolution-q1-2025
date: 2025-04-02T15:15:00Z
description: A summary of updates and enhancements of this website in Q1 2025.
tags:
  - evolution
  - series
  - website
image: /img/blog/website-evolution-q1-2025.jpg
toot: https://fosstodon.org/@ttntm/114268640478479349
---

As the first quarter of 2025 comes to an end, it's time for another entry in the website [#evolution](/tags/evolution/) series.

This post covers versions [3.20](/changelog/#3-20) to [3.26](/changelog/#3-26).

## Content and Pages

This section provides an overview of content and pages with details on what was added, changed and/or (re)moved.

### Best Of

URL: [/best-of](/best-of/)

A new page, and essentially a list of my most popular content.

I'm using [webmention data](#webmentions) and a custom filter to transform the raw data into a list of my top 16 blog posts based on a "popularity score" (i.e. a sum of likes, reposts and replies). That data doesn't include any page properties (i.e. title, publication date), so I had to figure out a way to access properties of the `page` object using `slug` values.

It took a minute, but I eventually remembered that 11ty collections can be passed to shortcodes (see [/notes/#33](/notes/#33)). Using that approach, getting specific `page` properties is simple and reusable by default (code: [shortcodes.js#L106](https://github.com/ttntm/ttntm/blob/master/utils/shortcodes.js#L106)).

### Homepage

The homepage looks different, just in case you haven't noticed.

"Recent Activity" was turned into a list of the 5 most recent entries grouped by collection (i.e. blog, likes, notes), which should offer a more hub-like experience than the previous version (4 most recent items from all collections). The layout also changed slightly to accommodate the extra content.

At the bottom of the page, there's a new "Tagged Content" section, providing quick access to posts about specific topics.

### Then

URL: [/then](/then/)

An archive of past /now page updates.

Nothing fancy: I started archiving older versions of my [/now](/now/) page, which is something I wanted to do for a long time. I'm glad I finally added it to this website, and I'm looking forward to seeing it grow over time.

### Other Content Changes

- Added a [new section for web directories](/bookmarks/#web-directories) to my /bookmarks page
- Added an architecture diagram to the [/appendix](/appendix/)
- Added status badges for entries on the [/work](/work/) page
- Added the [#project](/tags/project/) tag
- Added annual grouping to the [/likes](/likes/) page
- Rewrote the text on the [/about](/about/) page

## Features and Functionality

Additional features and changes enhancing the website's functionality.

### Copy Buttons for Code Blocks

Over the years, I published a ton of code snippets on this website, but adding copy functionality wasn't a priority.

I finally added copy buttons for code blocks - it only took ~60 lines of JavaScript, and implementing it was much less effort than I anticipated.

All details can be found in this post: [Adding a Copy Button to Code Blocks](/blog/adding-a-copy-button-to-code-blocks)

### Webmentions

Another things I wanted to add to this website for a _very_ long time. Also, something that I thought would be a lot more complicated, but that was a wrong assumption.

Nowadays, there are a couple of wonderful services that make things rather easy, and it doesn't take a lot of time - or effort - until real data comes in, making that whole IndieWeb thing feel very much alive.

I also figured out an alternative approach compared to seemingly inefficient code (i.e. the same sequential functions for _every_ page/post) that's prevalent in _a lot_ of guides out there, which is always a good thing.

On this website, webmentions are displayed as rather minimal "vanity metrics" in the header at the moment:

<img src="/static/img/blog/postHeader_wm.jpg" class="img-fluid img-center auto-invert" alt="screenshot of a post header showing title, published date, tags, and webmentions as icons (i.e. likes, comments) with numbers">

I personally like it that way, and I've also got some positive feedback from readers about it.

All details can be found in this post: [Implementing Webmentions](/blog/implementing-webmentions)

### Other Functional Changes

- Added "Discuss on Mastodon" links to the feedback/share section at the end of blog posts/likes
- Added the feedback/share section to entries in the [/likes](/likes/) collection

## Look and Feel

The website got a fresh coat of ~~paint~~ font. It's been 4 years since [3.0](/changelog/#3-0), and after a lot of deliberation, I've decided to use a new font - "Space Mono" - for the content on this website. Headings, buttons, and a couple of other non-content elements are still using "Titillium Web", which is a good match with the new content font.

Other than that:

- Added a slight gradient to the footer
- Improved some blur that could occur during scale transforms
  - Almost perfect in FF now, still a bit wonky in Chromium-based browsers
- Tuned the external link icon position in hopes of better handling of edge cases (i.e. line breaks)
- Updated the background color of code blocks (light theme)
- Updated the placement of "Last update" dates across various pages
- Updated the styling of links used in content
  - Boldness is mostly gone, except for headings/titles
  - Link colors were updated (light theme)

## Setup and Other Technical Stuff

Until [3.6](/changelog/#3-6), this website wasn't using any JavaScript. I gradually added JS, and recently noticed that it's all been inlined, which I felt should be changed. There are a couple of dedicated JS files now, containing code that's been bundled/split with reusability and caching in mind.

A couple of months ago, Omnivore, a read-it-later app that used to provide the data for my [reading list](/reading/), shut down and left me in need of an alternative. I eventually decided to use <span>Raindrop.io</span>, transferred my data there, and recently wrote an article about the update: [Reading List Redux](/blog/reading-list-redux)

### Plugins

My plugin configuration changed, and I'm - finally! - using {% ext "eleventy-img", "https://github.com/11ty/eleventy-img" %}.

Other than that, I also added {% ext "markdown-it-external-links", "https://github.com/rotorz/markdown-it-external-links" %} to support outgoing webmentions for [/likes](/likes/).
