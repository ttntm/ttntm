---
draft: false
title: process4.biz
slug: process4biz-website
weight: -1
description: A project for process4.biz GmbH who needed a website designed and coded.
client: process4.biz GmbH
pDate: from 05/2018
showcase: true
scSubtitle: Design & Code
pUrl: https://process4.biz
resources:
- name: hero
  src: p4b-main.jpg
- name: task
  src: task.md
- name: audit
  src: lighthouse-audit.png
---

### Tools

In order to create a fast and responsive static website, the following tools/frameworks/services were used:

- hugo
- Bootstrap
- jQuery
- Font Awesome
- simplebox.js
- gulp
- Netlify

All details regarding the decision making process can be found here: {{< link-underline-ext "process4.biz Blog" "process4.biz/en/blog/the-new-p4b-website/" >}}

### Performance

An important success factor of the site's overhaul was achieving the best possible performance despite of a bit of an overhead due to loading jQuery and Font Awesome.

Most state-of-the-art methods and best practices have been taken into consideration though, and the result of Google's Lighthouse audit (via Chrome Dev Tools) is really satisfying:

{{< img audit>}}

Furthermore, various website speedtests performed for the DACH-region have consistently reported loading times of 1,5 seconds or less.

### Summary

Rewarding project, focused on the quick wins for the time being.

Lots more to do there in the long run, currently debating a complete re-write of the site's content in order to improve search engine traffic.

#### Notable enhancements as of Jan. 2020:

- "static search" based on a JSON index and {{< link-underline-ext "fuse.js" "fusejs.io" >}}
- revised "Features" section - {{< link-underline-ext "details" "process4.biz/en/product-features/" >}}
- revised "Services" section - {{< link-underline-ext "details" "process4.biz/en/services/" >}}