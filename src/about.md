---
title: Who is Tom?
description: Information about this website and its author.
layout: page.njk
templateEngineOverride: md,njk
---

I'm a web developer with 10+ years of experience in both professional and freelance software development and I'm currently developing for, in and around CRM systems (Salesforce, MSCRM). My primary skill is front end development based on interest and past engagements, but I also have some solid back end experience. I'm an advocate of free and open source software and a Linux user (Fedora, Manjaro).

I grew up with the internet, doing my first websites around 2002 when frames and `marquee` tags were still state of the art and my code got hacked into text editors without syntax highlighting. We were taught some C, JavaScript and Pascal in school back then which helped shape a solid understanding of ways to make computers do what I want them to do long before higher education.
My professional career in IT started in 2008 and I worked for telecom and IT service providers, software development companies and freelance clients since then. As of 2021, I'm working as a Software Engineer at a digital agency.

When I'm not in front of a screen coding, <a href="https://watch3r.app" target="_blank">watching movies</a> or <a href="https://www.grouvee.com/user/ttntm/" target="_blank" rel="noopener">playing videogames</a>, I enjoy spending time with my family, parenting a lovely Persian cat and being outside (cycling, gardening, hiking). I also like playing boardgames with friends and working on DIY projects. Oh, and I really love cooking - just head over to <a href="https://recept0r.com" target="_blank">recept0r</a> if you're curious 🧑🏻‍🍳

{% include "about.highlights.njk" %}

{% contact %}
  {% include "about.contact.njk" %}
{% endcontact %}

## Colophon

There's a [Changelog](/changelog) that contains all the major changes this website has gone through over the years.

The tech stack used for the current version is:

- Eleventy
- PostCSS
- Netlify

This website doesn't contain any JavaScript and the total uncompressed size of it's landing page is less than 100KB.

{% include "about.stats.njk" %}
