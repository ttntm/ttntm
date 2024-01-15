---
title: Changelog
description: A history of the changes this website has gone through since it launched in 2018.
layout: page.njk
---

A history of the changes this website has gone through since it launched in 2018.

Last built and published: {% buildDate %} - {% ext "View Source", "https://github.com/ttntm/ttntm" %}

## Version 3.7

- Added tags to the blog: [/tags](/tags/)
  - They were removed in v3.0 back in 2021 because I thougth they were redundant - I was wrong
- Reviewed and updated my older post's tags

## Version 3.6.2

- Theme toggle button:
  - The icon on the `<button>` now changes based on current theme (via JS)
- `<noscript>`: The button used to switch themes gets hidden (via CSS)

## Version 3.6.2

- Added Codeberg to the social links

## Version 3.6.1

- Added a theme toggle button in the header and footer of the site
  - The selected theme is stored in / restored from `localStorage`
  - The theme defaults to the user's browser/OS choice
  - The toggle button overrides the browser/OS choice
  - There is also a `<noscript>` fallback in place: it loads a small CSS fille that contains `:root {}` overrides based on `@media (prefers-color-scheme: dark) {}`

## Version 3.6

- Added dark mode via `@media (prefers-color-scheme: dark) {}`
- Joined the {% ext "darktheme.club" "https://darktheme.club" %}
- Moved /archive back to [/blog](/blog/)

## Version 3.5

- Added [/games](/games/) and [/links](/links/) to this site

## Version 3.4

- Moved /archive to /articles
- Added "Recently Enjoyed" to [/about](/about/)

## Version 3.3

- Added a "Reply with email" button to articles
- Changed the layout of [/likes](/likes/): it's now a grid of tiles instead of the list it used to be
- Updated, refined and rearranged [/about](/about/)

## Version 3.2

- Added [/likes](/likes/) where I'll publish cool things I find on the internet
- Moved /TIL to /notes
- Updated the site's icon

## Version 3.1.1

- Added a table of contents to [/notes](/notes/)
- Joined the {% ext "250kb.club", "https://250kb.club" %} and the {% ext "1MB.club", "https://1mb.club" %}

## Version 3.1

- Added [/now](/now/) and [/uses](/uses/) to this site
- Adjusted the width of the content columns
- Joined the {% ext "512kb.club", "https://512kb.club" %}

## Version 3.0.2

- Updated the styling for links inside the content of this site
- Changed the old pixelsorted portrait I used to an illustration my wife made for me

## Version 3.0.1

- Added the Changelog you're currently reading

## Version 3.0

**Active since 03/2021.**

- Switched from Hugo to Eleventy
- Removed comments and tag-based list pages
- Ditched Gulp in favor of 11ty-native PostCSS
- Slight visual Cleanup
- Switched to "Titillium Web" as the site's font

## Version 2.0

Active from 03/2020 to 03/2021.

- Re-wrote the whole site's HTML and CSS from scratch _without using any JavaScript_
- Ditched Bootstrap but kept a few display and flexbox utility classes
- Simplified the "Projects" section and called it "Work"
- Added an RSS feed
- Added the "Today I learned..." page
- Switched to "Ubuntu" as the site's font

## Version 1.1

Active from 11/2018 to 03/2020.

- Cut down Bootstrap to the essentials
- Implemented comments
- Added Gulp for CSS processing and fetching comments at build time (via Netlify API)
- Added a portfolio section called "Projects"
- Switched to "Nunito" as the site's font

## Version 1.0

Active from 08/2018 to 11/2018.

- Launched as a Hugo site deployed via Netlify
- Visually based on Bootstrap 4
- Included all the BS4 bloat despite not making much use of it
