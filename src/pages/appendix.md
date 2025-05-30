---
title: Appendix
description: About this website.
layout: page.njk
templateEngineOverride: md,njk
permalink: /appendix/index.html
---

Some information about this website.

The tech stack used for the current version [{{ site.version }}](/changelog/) is:

- Eleventy with
  - eleventy-fetch
  - eleventy-img
  - eleventy-plugin-post-graph
  - eleventy-plugin-reading-time
  - eleventy-plugin-rss
  - eleventy-plugin-syntaxhighlight
  - eleventy-plugin-toc
  - markdown-it-anchor
  - markdown-it-external-links
  - postcss
- Git
- Cloudflare Pages

An overview of this website's architecture, including interfaces:

<img src="/static/img/Architecture_ttntm.me.svg" class="img-center img-fluid auto-invert mb2" alt="Architectural diagram for ttntm.me">

More information about this setup and its continued evolution can be found in posts tagged [#website](/tags/website). You can also [contact me](/hello) to talk about the details.

<div class="hr shadow mt2 mb2"></div>

{% include "components/apx.buttons.njk" %}

## Carbon Rating

This website achieves a carbon rating of **A+**.

This is _cleaner than 98 % of all web pages_ globally.
Only **0.01 g** of CO2 is produced every time someone visits this website.

A detailed report can be found here: {% ext "Website Carbon Calculator", "https://www.websitecarbon.com/website/ttntm-me/" %}

## Intentions and To-Dos

**Things I intend to do with this website**:

- Feel like me and change with me
- Offer content about things that matter to me
- Never track and {% ext "never monetize", "https://www.nevermonetize.com" %} its visitors

**And things I'd like this website to do**:

- Be a journal, weblog and playground
- Update frequently
- Become searchable at some point
- Provide a home for {% ext "neko", "https://github.com/adryd325/oneko.js" %} ({% ext "+context", "https://github.com/eliot-akira/neko/" %})

Finally, **everything that was done already**, can be found in the [Changelog](/changelog/).

## License

All content on this site is licensed under the Attribution-NonCommercial-ShareAlike 4.0 International license.

You can find the all details here: <a class="ext" href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en">CC-BY-NC-SA-4.0</a>

## Memberships

This website is a proud member of:

{% include "components/apx.clubs.njk" %}

<div class="text-center mt2">
  <h3>Static.Quest Webring</h3>
  <div class="flex bold align-items-center justify-content-center gap1">
    <a href="https://static.quest/previous/?host=ttntm.me">&#8592;</a>
    <a href="https://static.quest/members">View Members</a>
    <a href="https://static.quest/next/?host=ttntm.me">&#8594;</a>
  </div>
  <a class="bold" href="https://static.quest/random">Feeling lucky?</a>
</div>
