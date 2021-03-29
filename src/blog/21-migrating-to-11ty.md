---
title: Migrating from Hugo to Eleventy
slug: migrating-from-hugo-to-eleventy
weight: -21
type: blog
date: 2021-03-29
description: A short summary of this site's migration from Hugo to Eleventy
tags:
    - Eleventy
    - Hugo
    - SSG
    - news
image: /img/blog/11ty.jpg
---

<img src="/img/blog/11ty.jpg" class="img-fluid img-center mb1" alt="Eleventy logo splash screen">

## Why?

This site is live since 2018 and there's now been 3 major versions of it. So, I'm going to start this off with the same one word question that also started last year's [Reboot](/blog/reboot-catharsis/) post: "**why?**"

Last week I noticed another one of Hugo's more or less monthly releases and I soon started wondering whether or not it'd finally be time to update this site. For additional context: `ttntm.me` was running based on Hugo 0.58.0 while their current release is 0.82 as of writing this...

The idea of updating Hugo did not spark joy - mostly due to changes in their Markdown rendering engine dating back to 2019 or so that were one of the reasons I didn't install anything newer than 0.58 in the first place. After thinking about it some more, I was more or less certain that there'd be a bunch of other issues on top of that, so I quickly abandoned that idea.

On the other hand though, I kept wondering whether this wasn't just an opportunity in disguise...

I was aware of {% ext "Eleventy", "https://www.11ty.dev/" %} for quite a while, certainly since Google talked about having used it to build their _web.dev_ site, but I hadn't used it for any production sites so far. The idea of switching this site over to a JavaScript based SSG was certainly tempting; I slept on it and decided to give it shot on **Friday** (3 days ago).

> It's Monday now and you're reading this article on a site built by Eleventy 🕺

I've spent about 12 hours on this migration; that's probably more time than the Hugo update would have needed, but it's safe to assume that tinkering with this site (in addition to writing the occasional articles) sparks joy again.

## How?

Getting back to the point of writing an article like this: I'd like to give you a brief overview of how one could accomplish such a migration from Hugo to Eleventy.

I can recommend reading {% ext "this article", "https://www.smashingmagazine.com/2021/03/eleventy-static-site-generator/" %} for preparation; it's pretty detailed and you'll get a working mini-site out of it, but it's probably best suited for people that already have experience working with SSGs. I know that I had to scroll up and down a bit in order to collect all the necessary answers to questions that arose while doing things.

The {% ext "official 11ty docs", "https://www.11ty.dev/docs/" %} are also a great place to get acquainted with and having a look at some of the {% ext "starter projects", "https://www.11ty.dev/docs/starter/" %} won't hurt either - most universal one I came across was one called {% ext "eleventastic", "https://github.com/maxboeck/eleventastic" %}. I ended up re-building this site from scratch 'cause I feel that I'm generally doing better that way compared to having to deal with what other people might prefer in terms of configuration, folder structure etc.

The following notes are a slightly improved version of my working notes; I'm glad if they can help "as is" but I'd also appreciate questions via Email or Twitter in case there's too much I didn't explicitly write down.

### Project Setup

- `.eleventy.js` config file => configure `return {}` in terms of `dir` and `templateFormats`
- Contents of Hugo's `Data` directory => `src/_data/`
- Site data from Hugo's `config.toml` => `src/_data/site.json` as an Object with the respective keys; available via `{{ site.ParamName }}` in 11ty

### Collections and Content

- Single pages => `src` - check and cleanup for Markdown files, anything with Go template logic in it needs to be converted to the template language of your choice (I went with Nunjucks)
- Collections (i.e. Blog) => `src/CollectionName/` - Markdown files go in there, {% ext "directory based Front Matter", "https://www.11ty.dev/docs/data-template-dir/" %} can be defined for all of them via `CollectionName.json`
- Each collection that's not based on Front Matter `tags` needs to be defined in `.eleventy.js`; see {% ext "11ty.dev/docs/collections/", "https://www.11ty.dev/docs/collections/" %}
- Front Matter `permalink` sets/overrides the URL = build target for the respective piece of content; set `permalink: false` for content in individual files that should _not_ be rendered as individual pages (like my [/TIL page](/til))

### Migrate Templates

- Contents of Hugo's `layouts` directory => `src/_layouts/` (_except for partials and shortcodes_)
- Hugo partials => `src/_includes/`
- Don't forget about:
  - Sitemap
  - OG/Twitter/... Metadata
  - 404 page

### Migrate Static Content

```js
eleventyConfig.addPassthroughCopy({ './src/static/': '/' });
eleventyConfig.addPassthroughCopy({ './src/static/img/': '/img/' });
```
- Do the above to mimic Hugo's `static` folder and its functionality; see {% ext "11ty.dev/docs/copy/", "https://www.11ty.dev/docs/copy/" %}

#### Handling CSS

I've ditched Gulp, now using PostCSS directly. In order to do that, I had to get 11ty to process my CSS via `src/css/page.11ty.js`:

```js
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');

module.exports = class {
  async data() {
    const cssDir = path.join(__dirname, '..', '_includes', 'css');
    const rawFilepath = path.join(cssDir, '_page.css');

    return {
      permalink: `css/page.css`,
      rawFilepath,
      rawCss: fs.readFileSync(rawFilepath),
    };
  }

  async render({ rawCss, rawFilepath }) {
    return await postcss([
      require('postcss-import'),
      require('cssnano')
    ])
      .process(rawCss, { from: rawFilepath })
      .then((result) => result.css);
  }
};
```

- `src/_includes/css/` contains all the CSS files that get imported into `_page.css` which is the blueprint for PostCSS processing
- Needs `11ty.js` in `templateFormats: []` in the 11ty config file; otherwise 11ty will ignore this template = no CSS

Idea taken from: {% ext "florian.ec/blog/cache-busting-eleventy-postcss/", "https://florian.ec/blog/cache-busting-eleventy-postcss/" %}

### Plugins and Shortcodes

- Find and replace broken Hugo shortcodes; see {% ext "11ty.dev/docs/shortcodes/", "https://www.11ty.dev/docs/shortcodes/" %} for creating new shortcodes in 11ty
- Configure RSS output => {% ext "11ty.dev/docs/plugins/rss/", "https://www.11ty.dev/docs/plugins/rss/" %}
- Configure Syntax highlighting => {% ext "11ty.dev/docs/plugins/syntaxhighlight/", "https://www.11ty.dev/docs/plugins/syntaxhighlight/" %}

### Finishing Touches

- Minify HTML => {% ext "11ty.dev/docs/config/#transforms-example-minify-html-output", "https://www.11ty.dev/docs/config/#transforms-example-minify-html-output" %}

## Summary

Love how "light" the site feels now, probably due to the "new toy" effect if that's a thing.

I also removed some bloat like comments (didn't get that many anyway; might add it again at some point) and pages listing tags. I kept the display of tags though, 'cause it may be of help when quickly browsing the content.

Getting into 11ty was rather easy compared to when I got started with Hugo back in the day - but that may very well be due to years of experience working with SSGs and the JAMstack in general.

A last remark: Hugo is by no means a bad choice and I'm in no way "done with it" or anything like that. I just felt like I needed to try something new which seems to have been the right decision for the moment.

PS: loving the possibility of fetching API data via JavaScript files in `src/_data/`, gotta give that a shot some time!