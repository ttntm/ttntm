---
title: A Simple Astro Landing Page Template
slug: astro-tailwind-landing-page-template
date: 2023-08-23T10:30:00Z
description: I recently published a new version of my landing page template built with Astro and Tailwind CSS.
tags:
  - astro
  - template
image: /img/blog/astro-landing-page.png
---

Earlier this week, I ported my "simple landing page" template to {% ext "Astro", "https://astro.build" %}.

I initially published it for Hugo in July 2020, followed by an 11ty version in March 2021.

<img src="/static/img/blog/astro-landing-page.png" class="img-fluid img-center" alt="3 screenshot of a landing page on a blue background">

Working with Astro was quite pleasant; I'd used it before (late summer/autumn 2022), but I had to consult the documentation for some things that changed in the meantime and also for a couple of other things that I simply forgot.

## Good Things

- Excellent {% ext "documentation", "https://docs.astro.build/en/getting-started/" %}
- Easy use of existing data files (i.e. JSON)
- Great {% ext "Tailwind CSS integration", "https://docs.astro.build/en/guides/integrations-guide/tailwind/#overview" %} that worked OOTB
- {% ext "TypeScript support", "https://docs.astro.build/en/install/manual/#6-add-typescript-support" %} (i.e. component props)

## Other Things

- The (JSX-like) template language; probably just takes time to get used to…
- Some weirdness with the syntax highlighting in *.astro files (using the official VS Code "Language support for Astro" extension)

<img src="/static/img/blog/astro-landing-page-browser.jpg" class="img-fluid img-center" alt="Screenshot of a landing page in a browser window">

## Links

Astro Template:

- {% ext "ttntm/astro-landing-page", "https://github.com/ttntm/astro-landing-page" %}
- {% ext "Live Demo", "https://awesomestro.ttntm.me" %}

Other versions:

- {% ext "ttntm/11ty-landing-page", "https://github.com/ttntm/11ty-landing-page" %}
- {% ext "ttntm/hugo-landing-page", "https://github.com/ttntm/hugo-landing-page" %}
