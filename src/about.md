---
title: About Me
description: Information about this website and its author.
layout: page.njk
templateEngineOverride: md,njk
eleventyExcludeFromCollections: true
---

I'm a software engineer with 10+ years of experience in both professional and freelance software development. My primary skill is front end development based on interest and past engagements, but I also have some solid back end experience from years of working with enterprise systems and workflow automation. Besides, I'm an advocate of free and open source software and a Linux user (Fedora, Manjaro).

I grew up with the internet, building my first websites around 2002 when frames and `marquee` tags were still state of the art and my code got hacked into text editors without syntax highlighting. We were taught some C, JavaScript and Pascal in school back then, which helped shape a solid understanding of ways to make computers do what I want them to do, long before higher education.

My professional career in IT started in 2008, and I worked for telecom and IT service providers, software development companies and freelance clients since then. As of 2021, I'm working as a software engineer at an agency that delivers custom solutions and tailors standard software to client needs.

When I'm not in front of a screen working, <a href="https://watch3r.app" target="_blank">watching movies</a> or [playing videogames](/games/), I enjoy spending time with my family, parenting a lovely Persian cat and being outside (cycling, gardening, hiking). I also like playing boardgames with friends and working on DIY projects. Oh, and I really love cooking - just head over to <a href="https://recept0r.com" target="_blank">recept0r</a> if you're curious.

{% contact %}
  {% include "about.contact.njk" %}
{% endcontact %}

<div class="hr shadow mt2 mb2"></div>

{% include "about.highlights.njk" %}

<div class="hr shadow mt2 mb2"></div>

## My PGP Key

Fingerprint: `A8BC EEE0 AF71 7E01 3D8A A2A7 0BC9 FFE9 639B AEC3`

- Key file: [publickey.ttntm@pm.me](/publickey.ttntm@pm.me-a8bceee0af717e013d8aa2a70bc9ffe9639baec3.asc)
- Mirror: <a href="https://keys.openpgp.org/vks/v1/by-fingerprint/A8BCEEE0AF717E013D8AA2A70BC9FFE9639BAEC3" rel="noopener" target="_blank">keys.openpgp.org</a>

<div id="license" class="hr shadow mt2 mb2"></div>

## License

All content on this site is licensed under the Attribution-NonCommercial-ShareAlike 4.0 International license. You can find the all details here: <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en" rel="noopener" target="_blank">CC-BY-NC-SA-4.0</a>

<div class="hr shadow mt2 mb2"></div>

## Colophon

There's a [Changelog](/changelog/) that contains all the major changes this website has gone through over the years.

The tech stack used for the current version is:

- Eleventy
- PostCSS
- Netlify

This website contains <s>no</s> only minimal JavaScript (theme persistence) and the total uncompressed size of it's landing page is less than 100KB.

This website is a proud member of:

{% include "about.stats.njk" %}
