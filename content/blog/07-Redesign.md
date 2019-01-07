---
title: Site Redesign
slug: site-redesign
weight: -7
type: post
date: 2018-11-19
description: Short update summarizing the changes done to this site recently.
tags: 
    - design
    - post
    - personal
tw-image: https://ttntm.github.io/img/blog/default.jpg
---

## Redesign

When this site was put together initially, it was basically a prototype for some kind of blog/portfolio kind of thing.

Now, about 6 months later, there's been a slight redesign - the first of many I'm afraid...

Anyway, this post will probably just serve me as a personal tracker of what's changed, so here we go:

### Behind the scenes

1. Reduced Bootstrap 4 to the bare minimum of required components, thereby reducing the size of the CSS significantly. Currently using:
    - BS4 reboot
    - BS4 grid
    - BS4 navbar
    - BS4 utilities
    - 250 lines of additional CSS for the buttons etc.
2. Implemented CSS processing via `gulp` in conjunction with `postcss`, `concat-css` and `cssnano`
3. Started using a {{< link-underline-ext "Hugo Base Template" "gohugo.io/templates/base/" >}}, which is supposed to be making future changes easier to apply globally

### Visible changes

1. Switched to "Nunito" as the site's font face - {{< link-underline-ext Link "fonts.google.com/specimen/Nunito" >}}
2. Found a nice colour palette {{< link-underline-ext here "trendypalettes.com/palette/152" >}} and changed the site's color scheme based on that
3. Reworked the navbar, adding some fancy CSS to the main navigation items
4. Reworked the buttons, some more fancy CSS
5. Added a real "Contact" page, displaying contact options as a centered `flexbox` element
6. Applied some CSS to the scrollbar, making it look a little more individual