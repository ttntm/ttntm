---
title: "Website Evolution: Q2 2024"
slug: website-evolution-q2-2024
date: 2024-07-12T10:30:00Z
description: A summary of updates and enhancements of this website in Q2 2024.
tags:
  - evolution
  - series
  - website
image: /img/blog/___TODO___
---

The second post in the "Website Evolution" series.

There weren't quite as many changes in Q2 2024 as there were in Q1, but I managed to do lots of cool things nevertheless.

Once again, a quick remark before we get started: this post will try to add context to the changes, updates and enhancements. An uncommented chronology of changes can always be found in the [Changelog](/changelog/).

## Content and Pages

This section provides an overview of content and pages with details on what was added, changed and/or (re)moved.

## Albums

URL: [/albums](/albums/)

## Everything

URL: [/everything](/everything/)

Also, a matching [feed](/everything.xml)

## Hello

URL: [/hello](/hello/)

## Interests

URL: [/interests](/interests/)

## Other Changes

- Added an [OPML blogroll](/blogroll.opml) and joined the {% ext "Blogroll Network Map", "https://alexsci.com/rss-blogroll-network/" %}
- Created a [/blank](/blank/) page - it's mostly blank, so don't expect too much from it
- Restored some old blog posts that I'd unpublished a long time ago - there's nothing wrong with them, and I can't remember why I hid them, so they're back

## Features and Functionality

Additional features and changes enhancing the website's functionality.

### Blog Posts

- Added a "Table of Contents" section to the blog post layout
- Updated the blog post footer and added a "Copy Link" button
- Added all posts/tags button to the post layout's bottom section

### Links & Navigation

- Added the option of making the header sticky with persistence in `localStorage`
- Added a "back to index" anchor to individual entries in /notes
- Implemented linkable headings for Markdown content
- Removed `target="_blank"` from wherever it was used; external links now display with an "external link" icon

### Reading Progress

- Added an indicator for reading progress

## Look and Feel

- Notes: put the table of contents into a scrollable box
- Sitemap icon in desktop navbar
- Added /likes to header/footer navigation, replacing /work
- Added an SVG wave to the footer
- Updated individual /likes entry layout

## Setup and Other Technical Stuff

- Added support for a "last update" date to blog posts
- Upgraded to Eleventy 3.0.0-alpha.*
- Restructured the `_includes` folder + using RegEx replace in VS Code
