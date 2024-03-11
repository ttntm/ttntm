---
title: "Update: Bookmarks Are Back"
slug: bookmarks-are-back
date: 2024-02-15
description: This website has a bookmarks directory now.
tags:
  - eleventy
  - news
  - website
image: /img/blog/bookmarks.png
---

My website has a bookmarks directory now. 

This is something that I wanted to do since finishing "Halt and Catch Fire" in late November '23, but I was working on my personal wiki at that time. You're welcome to have a look at the new [bookmarks page](/bookmarks/) right now, but you could also stay here a little longer and read some more about it first.

A brief summary of where this is coming from:

Bookmark directories were one of my first touchpoints with the newish internet when I was a kid in the mid 90s. There were dedicated directory sites (like HCF's "Comet") built like phone books, and most regular websites also had a page/section where they would list other websites and link to them. And if you had a website, exchanging links with other sites was a thing that you'd do sooner or later. It was mostly centered around similar topics/interests, at least from what I experienced. You probably remember the wonderful (animated) banners/buttons that sites would provide, and they were also exchanged with others. It went on like this for a couple of years, but eventually, link farms and rampant search engine <s>optimization</s> manipulation needed to be regulated. Both directories and collections of bookmarks published on individual websites mostly disappeared.

I didn't really know I missed those days, but seeing it happen on TV made me think of it. What I still find most interesting about it, is the aspect of _curation_ behind directories and bookmarks pages. It offers the curator's unique view at what's important to them and restores a layer of personality that I feel has gotten a little lost amid search results and endless walls of infinitely scrolling social media drip feeds.

_So, bookmarks are back_.

Right now, I'm planning to create a directory of "sites with a bookmarks page" in the vein of {% ext "nownownow", "https://nownownow.com" %} and {% ext "uses.tech", "https://uses.tech" %}. Please let me know if something like that should already exist (couldn't find it) and send me your site if you have a dedicated bookmarks page. I'll create a dedicated repository for soon, but I'd like to collect a bunch of websites for an initial publication first.

## Building the Directory

Under the hood, my little bookmarks directory is "just" another {% ext "Eleventy collection", "https://www.11ty.dev/docs/collections/" %}:

```js
config.addCollection('bookmarks', async(collection) => {
  return collection.getFilteredByGlob('./src/bookmarks/**/*.md')
})
```

I'm using one dedicated `*.md` file for each category:

- **Blogroll**: blogs that I read regularly
- **Entertainment**: sites I visit for entertainment, unique finds I think others could find entertaining
- **Knowledge & Research**: resources I'd consult for specific knowledge and informative sites that might help others
- **Tools & Utilities**: tools I use regularly, OSS alternatives and recommendations
- **Website Inspiration**: websites I find inspiring

Inside those files, a {% ext "shortcode", "https://www.11ty.dev/docs/shortcodes/" %} makes sure they open in a new tab:

```js
function(displayText, link) {
  // shortcode to create external 'target=_blank' links
  return`<a href="${link}" target="_blank" rel="noreferrer">${displayText}</a>`
}
```

I wrote this shortcode as an alternative to a JavaScript-based solution (i.e. rewriting HTTP anchor tags using `querySelectorAll`) when I committed to a 0-JS website (before [dark mode](/blog/dark-mode/)).

The shortcode can be used like this: `{% raw %}{% ext "xmpl", "https://example.com" %}{% endraw %}`

It's nothing fancy, it works well, and I don't see any reason to change it for the time being.
