---
title: "Update: Dark Mode"
slug: dark-mode
date: 2024-01-03
description: This website supports dark mode now 🌙.
tags:
    - Personal
    - Review
image: /img/blog/empty.jpg
---

**This website supports dark mode now** 🌙.

Adding styles for dark mode has been on my list for a while and I'm glad I finally found enough time and motivation to take care of it.

I'm only using a CSS media query (`@media (prefers-color-scheme: dark) {}`) at the moment, so the theme switches based on the user's browser/OS settings.

I might offer a dedicated dark/light mode toggle in the near future, but I stil haven't decided whether or not that's a feature I'd retire this site's current 0 JS policy for. Maybe let me know if you think that a theme toggle would be a good idea and/or if you think that there are issues with `prefers-color-scheme` being the only option.

And just in case I broke something: I'd really appreciate it if you could let me know when you find something that looks broken (or could be better) in dark mode - thanks!
