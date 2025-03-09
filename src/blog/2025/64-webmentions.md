---
title: Implementing Webmentions
slug: implementing-webmentions
date: 2025-02-13T17:05:00Z
description: Some notes about implementing webmentions for my website.
tags:
  - eleventy
  - guide
  - website
image: /img/blog/backend.png
toot: https://fosstodon.org/@ttntm/113997528405160813
---

I wanted to add webmentions to this website for a very long time, and I finally got it done today. The reason for this task rotting on my list for such a long time (years...) was that thought it'd be a lot more complicated. I was wrong.

{% ext "webmention.io", "https://webmention.io" %} makes things very easy - it's a wonderful service for lazy people like me, and it can be added to a website in a matter of minutes. Just don't forget to include the HTTP header in addition to the HTML tags - for this site:

```yaml
/*
  ...other stuff
  Link: <https://webmention.io/ttntm.me/webmention>; rel="webmention"
```

Once that's take care of, collecting mentions for existing content can also be done in easy mode using {% ext "brid.gy", "https://brid.gy" %}. That's a service that "connects your website to social media" and sends likes, replies and shares as webmentions over to your website (which is already configured to receive them).

Next step: fetching webmentions and displaying them.

My website's built using Eleventy, and I've already got some other "fetch external data" code running. There's a site-specific endpoint in <span>webmention.io</span> that can be used to obtain the data:

```js
import dotenv from 'dotenv'
import eleventyFetch from '@11ty/eleventy-fetch'

dotenv.config()

export default async function() {
  const wmMap = new Map()
  const wmURL = `https://webmention.io/api/mentions.jf2?domain=ttntm.me&token=${process.env.WM_TOKEN}&per-page=1000`

  try {
    const response = await eleventyFetch(wmURL, {
      directory: '.cache',
      duration: '1d',
      type: 'json',
      fetchOptions: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }
    })

    if (response && response.children && response.children.length > 0) {
      response.children.forEach((entry) => {
        const {
          'wm-property': type,
          'wm-target': target
        } = entry

        const existing = wmMap.get(target)

        if (existing) {
          wmMap.set(target, {
            ...existing,
            [type]: (existing[type] ?? 0) + 1
          })
        } else {
          wmMap.set(target, {
            [type]: 1
          })
        }
      })
    }
  } catch (ex) {
    console.log(ex.message || ex)
  } finally {
    return wmMap
  }
}
```

There are many implementation guides out there that use code which runs the same sequential array `filter()` functions _for every page/post_ - that's not very efficient, and also not necessary...

As an alternative, I wrote the code that you can see above - with the data from the API, my code is building a {% ext "Map", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map" %} of all content with mentions. The code in the data file runs _once_ (at build time), using post URLs (`wm-target`) as unique keys, and the result looks like this (via `Object.fromEntries()`):

```js
{
  'https://ttntm.me/blog/building-a-custom-filter-for-eleventy-collections/': {
    'repost-of': 3,
    'like-of': 10,
    'in-reply-to': 3
  },
  'https://ttntm.me/blog/making-your-own-tools/': {
    'repost-of': 5,
    'like-of': 4,
    'in-reply-to': 6
  },
  // etc
}
```

That's data we can work with easily, and it's available globally. So, finally, it's time for some template adjustments.

Posts need to get their mentions from the `Map`, which makes a tiny Nunjucks filter necessary:

```js
getPostMentions: function(mentions, url) {
  const data = mentions.get(`https://ttntm.me${url}`)
  return Boolean(data) ? data : undefined
}
```

In the template, this filter is used with the global data:

```html
{% raw %}{%- set postMentions = webmentions | getPostMentions(page.url) -%}
{% if postMentions %}
  <ul>
    <li>
      <svg ... ></svg>
      <span>{{ postMentions['like-of'] or '-' }}</span>
    </li>
    <!-- more code to render replies/shares -->
  </ul>
{% endif %}{% endraw %}
```

That's pretty simple template code - it gets the job done and displays an icon and a number for each kind of mention. That's more than enough information for me, but there are many other guides out there for people that want to display more, i.e. actual webmention content, like comments.

A final detail: I don't want to have forms on my website, so I've decided to add a link to my <span>webmention.io</span> endpoint that can be used by website visitors to create a new webmention manually.

In conclusion, adding webmentions wasn't even remotely as complicated as I thought it'd be - I'm glad I finally did it.
