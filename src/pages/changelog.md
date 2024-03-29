---
title: Changelog
description: A logbook of all the changes this website has gone through since it launched in 2018.
layout: page.njk
templateEngineOverride: md,njk
permalink: /changelog/index.html
---

A logbook of all the changes this website has gone through since it launched in 2018. A visual representation of the activity in this website's git repository can be found at the bottom of this page: [Activity Timeline](#timeline)

**Last built and published**: {% buildDate %} - {% ext "View Source", "https://github.com/ttntm/ttntm" %}

<!-- DO NOT FORGET TO UPDATE THE SITE DATA FILE -->

## 3.12.2

- Added an [Activity Timeline](#timeline) based on `git log` output to this changelog

## 3.12.1

- Added region-based filtering to the Whisky journal

## 3.12

- Added a page listing the [/whisky](/whisky/) I drink

## 3.11.1

- Made the [/sitemap](/sitemap/) usable for humans and linked to it from the homepage and the footer
- Added version and build date to the footer

## 3.11

- Added [/reading](/reading/) which renders the top 10 entries from my Omnivore-based reading list
- Fix: contrast of `text-muted` for the light theme

## 3.10

- Completely rewrote [/work](/work/)
- Added [/ideas](/ideas/)
- Updated most images used for blog posts
- Re-arranged [/about](/about/) some more
- Added an "old content" notice for all posts older than 365 days

## 3.9.2

- Removed most product links from [/uses](/uses/)
- Pledged to {% ext "never monetize", "https://www.nevermonetize.com" %} this website's visitors and users

## 3.9.1

- Added more RSS feeds, see [/feeds](/feeds/)
- Added RSS icons to list pages of content that offers a feed
- Removed redundant icons from the homepage
- Minor structural improvements in the HTML

## 3.9

- **New homepage layout**
- A little more animation for card `:hover` states
- Reviewed and rewrote a couple of things in [/about](/about/)
  - The illustration from the homepage moved here
  - Added the {% ext "BUKMARK.CLUB", "https://bukmark.club" %} badge
  - Changed grouping of sections, added "Memberships" and "Support"

## 3.8.1

- "All Tags" section added at the top of the [/blog](/blog/) archive page

## 3.8

- Added [/bookmarks](/bookmarks/), my own directory of useful and interesting links

## 3.7.1

- Added reading time to blog content and previews
- Revised `blockquote` and code block styling/margins
- Added a tiled section of non-blog content to the homepage
- Fixed a lot of grammar and spelling (thank you, {% ext "LTeX", "https://marketplace.visualstudio.com/items?itemName=neo-ltex.ltex" %})

## 3.7

- Added tags to the blog: [/tags](/tags/)
  - They were removed in v3.0 back in 2021 because I thought they were redundant - I was wrong
- Added a "View all Tags" button to the homepage
- Updated the "View all Posts" button on the homepage
- Reviewed and updated my older post's tags
- Refactored a bunch of `<div>` containers into `<ul>` elements

## 3.6.2

- Theme toggle button:
  - The icon on the `<button>` now changes based on current theme (via JS)
- `<noscript>`: The button used to switch themes gets hidden (via CSS)

## 3.6.2

- Added Codeberg to the social links

## 3.6.1

- Added a theme toggle button in the header and footer of the site
  - The selected theme is stored in / restored from `localStorage`
  - The theme defaults to the user's browser/OS choice
  - The toggle button overrides the browser/OS choice
  - There is also a `<noscript>` fallback in place: it loads a small CSS file that contains `:root {}` overrides based on `@media (prefers-color-scheme: dark) {}`

## 3.6

- Added dark mode via `@media (prefers-color-scheme: dark) {}`
- Joined the {% ext "darktheme.club", "https://darktheme.club" %}
- Moved /archive back to [/blog](/blog/)

## 3.5

- Added [/games](/games/) and [/links](/links/) to this site

## 3.4

- Moved /archive to /articles
- Added "Recently Enjoyed" to [/about](/about/)

## 3.3

- Added a "Reply with email" button to articles
- Changed the layout of [/likes](/likes/): it's now a grid of tiles instead of the list it used to be
- Updated, refined and rearranged [/about](/about/)

## 3.2

- Added [/likes](/likes/) where I'll publish cool things I find on the internet
- Moved /TIL to /notes
- Updated the site's icon

## 3.1.1

- Added a table of contents to [/notes](/notes/)
- Joined the {% ext "250kb.club", "https://250kb.club" %} and the {% ext "1MB.club", "https://1mb.club" %}

## 3.1

- Added [/now](/now/) and [/uses](/uses/) to this site
- Adjusted the width of the content columns
- Joined the {% ext "512kb.club", "https://512kb.club" %}

## 3.0.2

- Updated the styling for links inside the content of this site
- Changed the old pixelsorted portrait I used to an illustration my wife made for me

## 3.0.1

- Added the changelog you're currently reading

## 3.0

**Active since 03/2021.**

- Switched from Hugo to Eleventy
- Removed comments and tag-based list pages
- Ditched Gulp in favor of 11ty-native PostCSS
- Slight visual Cleanup
- Switched to "Titillium Web" as the site's font

## 2.0

Active from 03/2020 to 03/2021.

- Re-wrote the whole site's HTML and CSS from scratch _without using any JavaScript_
- Ditched Bootstrap but kept a few display and flexbox utility classes
- Simplified the "Projects" section and called it "Work"
- Added an RSS feed
- Added the "Today I learned..." page
- Switched to "Ubuntu" as the site's font

## 1.1

Active from 11/2018 to 03/2020.

- Cut down Bootstrap to the essentials
- Implemented comments
- Added Gulp for CSS processing and fetching comments at build time (via Netlify API)
- Added a portfolio section called "Projects"
- Switched to "Nunito" as the site's font

## 1.0

Active from 08/2018 to 11/2018.

- Launched as a Hugo site deployed via Netlify
- Visually based on Bootstrap 4
- Included all the BS4 bloat despite not making much use of it

<div class="hr shadow mt2 mb2"></div>

<h2 id="timeline" class="tight">Activity Timeline</h2>

{% postGraph null, { "data": stats } %}
