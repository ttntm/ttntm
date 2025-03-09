---
title: "Intro: BUKMARK.CLUB"
slug: bukmark-club-intro
date: 2024-02-21T10:30:00Z
description: "Introducing a new side project: I built a directory of websites that provide a curated collection of bookmarks and/or links to other websites."
tags:
  - eleventy
  - news
image: /img/blog/bukmark-club.png
toot: https://fosstodon.org/@ttntm/111968991400429515
---

I recently wrote about [adding bookmarks to my website](/blog/bookmarks-are-back/). While planning and doing that, a slightly larger idea came to my mind: building a directory of websites that provide a curated collection of bookmarks and/or links to other websites.

As far as I know, there's no such directory.

A quick question I posted on Mastodon didn't surface one either:

<img src="/static/img/blog/111891597461871340.png" class="img-fluid img-center" alt="Screenshot of one of Tom's mastodon posts from Feb. 7th 2024. It says: 'I know of nownownow, uses.tech and personalsit.es Do you know any index of sites with a bookmarks or links section? I don't, but I'm considering building one.'">

Original link to the post from Feb. 7th: {% ext "@ttntm/111891597461871340", "https://elk.zone/fosstodon.org/@ttntm/111891597461871340" %}

It took me another week to find a suitable (and cheap enough) TLD for the project and I eventually bought {% ext "BUKMARK.CLUB", "https://bukmark.club" %} on Feb. 17th.

I used a little spare time on the following weekend and built an MVP using Eleventy while my wife spent a little of her time on the logo:

<img src="/static/img/blog/bukmark-club.png" class="img-fluid img-center" alt="BUKMARK.CLUB logo">

## Building the Website

There are 2 sections of code that might be worth highlighting:

### Generating the Directory Index

I've recycled the logic that builds this website's blog archive, a bit of code originally taken from a post by Darek Kay called {% ext "Group posts by year in Eleventy", "https://darekkay.com/blog/eleventy-group-posts-by-year/" %}, and made some changes:

```js
config.addCollection('directory', (collection) => {
  return _.chain(collection.getFilteredByGlob('./src/directory/*.md'))
    .sort((a, b) => a.data.title.localeCompare(b.data.title))
    .groupBy((item) => String(item.data.title).toUpperCase()[0])
    .toPairs()
    .value()
})
```

This collection sorts directory entries alphabetically and groups them based on the first letter of their respective title.

The function passed to `sort()` is using `String.prototype.localeCompare()` ({% ext "MDN", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare" %}), `groupBy()` takes the first letter of each site's name and uppercases it.

Rendering the directory uses two consecutive loops that process the collection:

```html
{% raw %}<h2>Index</h2>
<ul class="flex flex-wrap gap1 mb2">
  {% for letter, letterPages in collections.directory %}
    <li>
      <a href="#section-{{ letter }}">[{{ letter }}]</a>
    </li>
  {% endfor %}
</ul>
{% for letter, letterPages in collections.directory %}
  <article class="{% if not loop.last %}mb2{% endif %}">
    <div class="...">
      <h2 id="section-{{ letter }}" class="m0" style="border: 0;">
        [{{ letter }}]
      </h2>
      <a class="block" href="#top" title="Back to top">[^]</a>
    </div>
    <ul class="grid grid3 gap2 my1">
      {% for page in letterPages %}
        {% include "components/card.njk" %}
      {% endfor %}
    </ul>
  </article>
{% endfor %}
{% endraw %}
```

### Updating the Directory Stats

I'm using a Node.js script for this task. It was inspired by a post called {% reply "Find the Newest File in Directory Using NodeJS", "https://brianchildress.co/find-latest-file-in-directory-in-nodejs/" %}.

```js
const fs = require('fs')
const path = require('path')

function getMostRecentFile(dir) {
  const files = orderRecentFiles(dir)
  return files.length
    ? {
      total: files.length-1,
      result: files[0]
    }
    : undefined
}

function orderRecentFiles(dir) {
  return fs.readdirSync(dir)
    .filter((file) => fs.lstatSync(path.join(dir, file)).isFile())
    .map((file) => ({
      file,
      btime: fs.lstatSync(path.join(dir, file)).birthtime
    }))
    .sort((a, b) => b.btime.getTime() - a.btime.getTime())
}

function main() {
  const {
    total,
    result
  } = getMostRecentFile('./src/directory/')

  fs.writeFileSync('./src/_data/info.json', JSON.stringify({
    directorySize: total,
    mostRecentUpdate: result.btime
  }))
}

main()
```

The script checks a folder (`./src/directory/`) and orders the files based on the time they were created (`birthtime`). It then proceeds to write an `info.json` data file into Eleventy's `_data` folder. Both `directorySize` and `mostRecentUpdate` can be used in templates without any further configuration. The only thing I had to do, was to define a custom `formatDate` filter.

In case you noticed: the lack of error handling is not just lazy - it should alert contributors of the fact that something's wrong _before_ committing changes that would otherwise lead to missing data.

--

Right now, the BUKMARK.CLUB is a 0 JS, sub 100 kB website that uses less than 500 lines of CSS.

Directory content is stored in Markdown files that Eleventy currently processes in less than 1 second. Thanks to Eleventy, it "just works", which is great for a small side project like that.
