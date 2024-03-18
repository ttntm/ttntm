---
title: About Me
description: Information about this website and its author.
layout: page.njk
templateEngineOverride: md,njk
permalink: /about/index.html
eleventyExcludeFromCollections: true
---

<div class="flex flex-row justify-content-between align-items-center flex-wrap mb1">
  <div class="w25 w75m p1 mx-auto">
    <img class="img-fluid circle shadow u-photo" src="/img/ttntm.webp" alt="An illustration showing Tom" title="Yup, that could be me." width="285" height="285">
  </div>
  <div class="w75 w100m indent-2-md">
    <h2 class="h3">
      Hi, I'm Tom.
    </h2>
    <p class="p-note m0">
      I'm <s>a software engineer</s> <em>not-a-fan-of-titles</em> with many years of experience in both professional and freelance software development. My expertise lies in web development, with a clear focus on the front end. However, years of working with enterprise systems and workflow automation have taught me <em>a lot</em> about backend development. Besides, I'm an advocate of free and open source software and a Linux user (Fedora, Manjaro).
    </p>
  </div>
</div>

I grew up with the internet, building my first websites around 2002 when frames and `marquee` tags were still state of the art and my code got hacked into text editors without syntax highlighting. We were taught some C, JavaScript and Pascal in school back then, which helped shape a solid understanding of ways to make computers do what I want them to do, long before higher education.

My professional career in IT started in 2008, and I worked for telecom and IT service providers, software development companies and freelance clients since then. As of 2021, I'm working as a software engineer at an agency that delivers custom solutions and tailors standard software to client needs. I'm also volunteering for {% ext "epicenter.works", "https://epicenter.works" %} whenever I can support their activities with my skillset.

When I'm not in front of a screen working, <a href="https://watch3r.app" target="_blank">watching movies</a> or [playing videogames](/games/), I enjoy spending time with my family, parenting a lovely [Persian cat](#cat) and being outside (cycling, gardening, hiking). I also like playing boardgames with friends and working on DIY projects. Oh, and I really love cooking - just head over to <a href="https://recept0r.com" target="_blank">recept0r</a> if you're curious.

...and if you want to know what I'm doing _right now_, check out my [/now page](/now/) 🚀

{% include "about.pgp.njk" %}

{% include "about.highlights.njk" %}

<div class="hr shadow mt2 mb2"></div>

{% contact %}
  {% include "about.contact.njk" %}
{% endcontact %}

<p id="cat" class="text-center mt2 mb0">
  <a href="https://pixelfed.social/alfithecat" rel="noreferrer" target="_blank" title="Meow!">
    <img class="m0 mx-auto" src="/img/walking_cat.gif">
  </a>
</p>
<div class="hr shadow mb2" style="margin-top: 0;"></div>

## About This Website

A bit of information about this website. Feel free to <a href="mailto:ttntm@pm.me?subject=About your website">email me</a> if you want to talk about it.

### Colophon

The tech stack used for the current version is:

- Cloudflare Pages
- Eleventy
- Git
- PostCSS

This website contains <s>no</s> _only minimal_ JavaScript ([theme persistence](/blog/dark-mode/)) and the total uncompressed size of it's landing page is less than 100 KB. There's absolutely no tracking and I will {% ext "never monetize", "https://www.nevermonetize.com" %} this website's visitors and users.

There's also a [Changelog](/changelog/) that contains all the major changes this website has gone through over the years.

#### Carbon Rating

This website achieves a carbon rating of **A+**.

This is _cleaner than 98 % of all web pages_ globally.
Only **0.01 g** of CO2 is produced every time someone visits this website.

A detailed report can be found here: {% ext "Website Carbon Calculator", "https://www.websitecarbon.com/website/ttntm-me/" %}

### License

<a id="license"></a>All content on this site is licensed under the Attribution-NonCommercial-ShareAlike 4.0 International license. You can find the all details here: <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en" rel="noreferrer" target="_blank">CC-BY-NC-SA-4.0</a>

### Memberships

This website is a proud member of:

{% include "about.stats.njk" %}

### Support

<a href="mailto:ttntm@pm.me">Kind words</a> are always welcome.

_THANK YOU &#9825;_
