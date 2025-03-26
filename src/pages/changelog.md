---
title: Changelog
description: A logbook of all the changes this website has gone through since it launched.
layout: page.njk
templateEngineOverride: md,njk
permalink: /changelog/index.html
showProgress: true
---

A logbook of all the changes this website has gone through since it launched in the summer of 2018.

This also includes the [Activity Timeline](#timeline), a visual representation of all commits in this website's git repository, which can be found at the bottom of this page.

**Last built and published**: {% buildDate %} - {% ext "View Source", "https://github.com/ttntm/ttntm" %}

<!-- DO NOT FORGET TO UPDATE THE SITE DATA FILE -->

## 3.26

<small>Released: 2025-03-26</small>

- Interesting: 3.26 released on March 26th
- Updated the homepage once again - "Recent Activity" now displays the 5 last entries from each collection
- Small CSS adjustments for the header - made the icon/logo rounded

## 3.25.4

- Added the [#project](/tags/project/) tag

## 3.25.3

- Added the feedback/share section to entries in the [/likes](/likes/) collection
- Added "Discuss on Mastodon" links to the feedback/share section at the end of blog posts/likes
- Rewrote the text on my [/about](/about/) page

## 3.25.2

- Added [/best-of](/best-of/), a list of my most popular content (based on [webmentions](#3-23))

## 3.25.1

- Move some things from [/about](/about/) to [/hello](/hello/) and added links for identity verification
- Footer: `mailto` link removed from the envelope icon, now navigates to [/hello](/hello/) instead
- Small fixes and adjustment after the recent font change

## 3.25

<small>Released: 2025-02-28</small>

- It's been 4 years since [3.0](#3-0), and after a lot of deliberation, I've decided to **use a new font** - _Space Mono_ - for the content on this website
- Added the "Tagged Content" section to the homepage
- Verified, added and updated entries on the [/bookmarks](/bookmarks/) page
- Various adjustments of spacing, wording, etc. across pages

## 3.24.2

- Webmention support for [/likes](/likes/) via {% ext "markdown-it-external-links", "https://github.com/rotorz/markdown-it-external-links" %}
- Support for outgoing webmentions via {% ext "webmention.app", "https://webmention.app" %}
- Added a slight gradient to the footer
- Added an architecture diagram to the [/appendix](/appendix/)

## 3.24.1

- Status badges for entries on the [/work](/work/) page
- Tuning of the external link icon position in hopes of better handling of edge cases re: line breaks

## 3.24

<small>Released: 2025-02-17</small>

- Added [/then](/then/), an archive of past [/now](/now/) page updates

## 3.23

<small>Released: 2025-02-13</small>

- Added support for webmentions
- Updated the background color of code blocks (light theme)

## 3.22.1

- Updated the placement of "Last update" dates across various pages

## 3.22

<small>Released: 2025-01-27</small>

- Refactored JS for better reusability and caching (less inlined code, created dedicated files instead)

## 3.21

<small>Released: 2025-01-17</small>

- Added the `eleventy-img` plugin

## 3.20.1

- Added copy buttons to code blocks (blog posts, notes)

## 3.20

<small>Released: 2025-01-10</small>

- Reviewed [/likes](/likes/) archive and added annual grouping similar to the blog
- Fix [/reading](/reading/) (data from <span>Raindrop.io</span>)
- Updated the styling of links used in content
  - Boldness is mostly gone, except for headings/titles
  - Link colors were updated (light theme)
- Improved some blur that could occur during scale transforms
  - Almost perfect in FF now, still a bit wonky in Chromiums
- Added a new section for web directories to my [/bookmarks](/bookmarks/) page

## 3.19.7

- Removed Omnivore integration (service shut down)

## 3.19.6

- Joined the {% ext "Static.Quest Webring", "https://static.quest" %}

## 3.19.5

- Joined the {% ext "Wayward Webring", "https://waywardweb.org" %}

## 3.19.4

- Added years to the "Explore" section of the blog

## 3.19.3

- Added descriptions for tags on pages listing tagged content
- Updated the icon before/after the year headings on the blog archive page

## 3.19.2

- Added a "Table of Contents" section to the blog post layout

## 3.19.1

- Fixes:
  - Content dates (assumed midnight in UTC)
  - RSS feed dates
  - Replaced deprecated `absoluteUrl` filter

## 3.19

<small>Released: 2024-06-16</small>

- Added an SVG wave to the footer
- Added a "back to index" anchor to individual entries in [/notes](/notes/)
- Implemented linkable headings for Markdown content
- Homepage:
  - Replaced "Recent Posts" with "Recent Activity"
  - Tweaked the layout for tablet-sized screens

## 3.18.3

- Updated the blog post footer and added a "Copy Link" button

## 3.18.2

- Added a layout toggle to [/albums](/albums/) that controls switching between grid and list mode

## 3.18.1

- Added [/albums](/albums/)
- Removed `target="_blank"` from wherever it was used; external links now display with an "external link" icon - check [this post](/blog/external-links-and-target-blank/) for reasons why

## 3.18

<small>Released: 2024-05-23</small>

- Upgraded to Eleventy 3.0.0-alpha.10
- Added a [/hello](/hello/) page

## 3.17.3

- Retired the "opinion" tag; it's succeeded by the [#thoughts](/tags/thoughts/) tag
- Added support for a "last update" date to blog posts
- Added all posts/tags button to the post layout's bottom section
- Added an [OPML blogroll](/blogroll.opml)

## 3.17.2

- Added the option of making the header sticky with persistence in `localStorage`

## 3.17.1

- Better images for [/likes](/likes/) and [/notes](/notes)
- Fixes
- Footer background color (light theme)
- Progress bar improvements (math, reusability)

## 3.17

<small>Released: 2024-05-15</small>

- Added [/likes](/likes/) to header/footer navigation, replacing [/work](/work/)
- Updated individual [/likes](/likes/) entry layout
- Updated the list of collections and pages

## 3.16.1

- Updated the buttons in the [/appendix](/appendix/)

## 3.16

<small>Released: 2024-05-09</small>

- Added an [/interests](/interests/) page
- Updated the list of collections and pages

## 3.15

<small>Released: 2024-05-07</small>

- Add:
  - [/blank](/blank/)
  - [/everything](/everything/) and a matching [feed](/everything.xml)
  - Sitemap icon in desktop navbar
- Update:
  - Buttons in [/appendix](/appendix/)
  - Cleanup of old front matter data (blog posts)
  - Icon colors (theme, feeds)
  - Refactored some old `list-inline` nodes into `flex` containers
- Fix:
  - Notes feed > item IDs
  - `h-feed` implementation

## 3.14.2

- Updated
  - [/appendix](/appendix/)
  - [/games](/games/)
  - [/ideas](/ideas/)

## 3.14.1

- Restored some old blog posts
- Updated the styling of highlighted text

## 3.14

<small>Released: 2024-04-25</small>

- Blog posts: added an indicator for reading progress
- Notes: put the table of contents into a scrollable box
- Increased the contrast of body text (light theme)

## 3.13.3

- Fixed an issue with the overflow `margin`/`padding` of code blocks

## 3.13.2

- Updated the text in [/about](/about/)
- Updated the intro of this changelog

## 3.13.1

- Updated the header of the [/bookmarks](/bookmarks/) page
- Updated the CSS cursor used to enlarge images in whisky listings

## 3.13

<small>Released: 2024-04-10</small>

- Added the [/appendix](/appendix/)
- Added dates to minor versions listed in this changelog
- The whisky wishlist is now sorted alphabetically

## 3.12.4

- Reduced the `letter-spacing` used for headings and links

## 3.12.3

- Added an expand/collapse all button to the Scotch Log in [/whisky](/whisky/)
- Added ABV percentages to whisky listings
- Fixed activity timeline input data aggregation

## 3.12.2

- Added an [Activity Timeline](#timeline) based on `git log` output to this changelog

## 3.12.1

- Added region-based filtering to the Whisky journal

## 3.12

<small>Released: 2024-03-25</small>

- Added a page listing the [/whisky](/whisky/) I drink

## 3.11.1

- Made the [/sitemap](/sitemap/) usable for humans and linked to it from the homepage and the footer
- Added version and build date to the footer

## 3.11

<small>Released: 2024-03-18</small>

- Added [/reading](/reading/) which renders entries from my Omnivore-based reading list
- Fix: contrast of `text-muted` for the light theme

## 3.10

<small>Released: 2024-03-14</small>

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

<small>Released: 2024-03-01</small>

- **New homepage layout**
- A little more animation for card `:hover` states
- Reviewed and rewrote a couple of things in [/about](/about/)
  - The illustration from the homepage moved here
  - Added the {% ext "BUKMARK.CLUB", "https://bukmark.club" %} badge
  - Changed grouping of sections, added "Memberships" and "Support"

## 3.8.1

- "All Tags" section added at the top of the [/blog](/blog/) archive page

## 3.8

<small>Released: 2024-02-15</small>

- Added [/bookmarks](/bookmarks/), my own directory of useful and interesting links

## 3.7.1

- Added reading time to blog content and previews
- Revised `blockquote` and code block styling/margins
- Added a tiled section of non-blog content to the homepage
- Fixed a lot of grammar and spelling (thank you, {% ext "LTeX", "https://marketplace.visualstudio.com/items?itemName=neo-ltex.ltex" %})

## 3.7

<small>Released: 2024-01-16</small>

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
- Added Codeberg to the social links

## 3.6.1

- Added a theme toggle button in the header and footer of the site
  - The selected theme is stored in / restored from `localStorage`
  - The theme defaults to the user's browser/OS choice
  - The toggle button overrides the browser/OS choice
  - There is also a `<noscript>` fallback in place: it loads a small CSS file that contains `:root {}` overrides based on `@media (prefers-color-scheme: dark) {}`

## 3.6

<small>Released: 2024-01-03</small>

- Added dark mode via `@media (prefers-color-scheme: dark) {}`
- Joined the {% ext "darktheme.club", "https://darktheme.club" %}
- Moved /archive back to [/blog](/blog/)

## 3.5

<small>Released: 2023-09-25</small>

- Added [/games](/games/) and [/links](/links/) to this site

## 3.4

<small>Released: 2023-06-21</small>

- Moved /archive to /articles
- Added "Recently Enjoyed" to [/about](/about/)

## 3.3

<small>Released: 2023-05-31</small>

- Added a "Reply with email" button to articles
- Changed the layout of [/likes](/likes/): it's now a grid of tiles instead of the list it used to be
- Updated, refined and rearranged [/about](/about/)

## 3.2

<small>Released: 2021-05-30</small>

- Added [/likes](/likes/) where I'll publish cool things I find on the internet
- Moved /TIL to [/notes](/notes/)
- Updated the site's icon

## 3.1.1

- Added a table of contents to [/notes](/notes/)
- Joined the {% ext "250kb.club", "https://250kb.club" %} and the {% ext "1MB.club", "https://1mb.club" %}

## 3.1

<small>Released: 2021-05-01</small>

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

<style>
  .epg__squares {
    grid-gap: 1px;
  }

  /*
    These bizarre rules hide some extra HTML tags which can lead to issues, i.e. a broken
    grid in Chrome due to an extra `<br>` tag at the very end of the list of `<div>` elements
    representing the days of the year.
  */
  .epg__months > :not(div),
  .epg__squares > :not(div),
  p:empty {
    display: none;
  }

  .epg:last-of-type,
  .epg__squares:last-of-type,
  p:empty {
    margin-bottom: 0;
  }
</style>
