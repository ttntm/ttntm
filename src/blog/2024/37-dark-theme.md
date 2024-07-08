---
title: "Update: Dark Mode"
slug: dark-mode
date: 2024-01-03T10:30:00Z
description: This website supports dark mode now 🌙.
tags:
  - news
  - website
image: /img/blog/empty.jpg
showToc: false
---

**This website supports dark mode now** 🌙.

Adding styles for dark mode has been on my list for a while and I'm glad I finally found enough time and motivation to take care of it.

I'm only using a CSS media query (`@media (prefers-color-scheme: dark) {}`) at the moment, so the theme switches based on the user's browser/OS settings.

I might offer a dedicated dark/light mode toggle in the near future, but I still haven't decided whether that's a feature I'd retire this site's current 0 JS policy for. Maybe let me know if you think that a theme toggle would be a good idea and/or if you think that there are issues with `prefers-color-scheme` being the only option.

And just in case I broke something: I'd really appreciate it if you could let me know when you find something that looks broken (or could be better) in dark mode - thanks!

## Update: Jan. 5th 2024

I added a theme toggle button thanks to feedback I received: I did not know that using `privacy.resistFingerprinting` in FF's `about:config` forces light mode.

From the [Changelog](/changelog/) for the current version 3.6.1 of this website:

Added a theme toggle button in the header and footer of the site.

- The selected theme is stored in / restored from `localStorage`
- The theme defaults to the user's browser/OS choice
- The toggle button overrides the browser/OS choice
- There is also a `<noscript>` fallback in place: it loads a small CSS file that contains `:root {}` overrides based on `@media (prefers-color-scheme: dark) {}`
  - The button used to switch themes gets hidden (via CSS) in this case
