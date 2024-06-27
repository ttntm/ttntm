---
title: "Update: Tags Are Back"
slug: restoring-tags
date: 2024-01-16T10:30:00Z
description: This website used to have tags. They were gone for about 3 years, but they're back now.
tags:
  - eleventy
  - news
  - website
image: /img/blog/content_structure.jpg
---

This website used to have tags in the past.

They were gone for about 3 years, but they're back now!

<img src="/img/blog/content_structure.jpg" class="img-fluid img-center" alt="An illustration of content structure from Undraw">

I didn't think too much about to decision to remove them when I [switched from Hugo to Eleventy](/blog/migrating-from-hugo-to-eleventy/) back in the spring of 2021, I guess I thought they don't really add much value to the site and I was also following a very minimalist mindset.

My website kept growing though: I wrote 16 posts about various topics since then. Looking back at that amount of information now made me realize that it's becoming increasingly difficult to find content about a specific topic. And while I'm still not convinced that I should add a search function to the site, restoring tags seemed like a good idea.

## Using Tags in Eleventy

The following section is a brief "look under the hood" of how I added tags to this website.

Tags are relevant for different parts of the site:

**1, A reusable `include` for post previews**

This is a rather simple component, but getting the context (`currentPost`) right was a bit of a challenge. That's why I ended up using the Collections API for `getCollectionItem(page)`.

```html
{% raw %}{% if post %}
  {% set currentPost = post %}
{% else %}
  {% set currentPost = collections.blog | getCollectionItem(page) %}
{% endif %}

<ul class="list-reset list-inline flex align-items-center">
  <li class="list-inline-item sr-only">Tags:&nbsp;</li>
  {% for tag in currentPost.data.tags | sort %}
    <li class="tag list-inline-item">
      <a href="/tags/{{ tag | slugify }}">
        <span class="small">#</span>{{ tag }}
      </a>
    </li>
  {% endfor %}
</ul>{% endraw %}
```

**2, An "All Tags" list page**

Nothing too fancy here, I just followed the "grid of cards" structure of my [/likes](/likes/) page:

```html
{% raw %}<ul class="list-reset grid grid3 gap1 mt2">
  {% for tag in collections.blog | getCollectionTags | sort %}
    {% set tagUrl %}
      /tags/{{ tag | slugify }}/
    {% endset %}
    <li class="d-block">
      <a class="d-block ..." href="{{ tagUrl }}">
        <span>
          <span class="small">#</span>{{ tag }}
        </span>
      </a>
    </li>
  {% endfor %}
</ul>{% endraw %}
```

`getCollectionTags` is a custom filter I shamelessly stole from {% ext "eleventy-base-blog" "https://github.com/11ty/eleventy-base-blog/blob/main/eleventy.config.js#L69C56-L69C56" %}.

**3, Individual "Posts Tagged With 'tag'" pages**

This one was the only tricky bit.

The `filter` config was necessary to prevent duplicate permalink errors (due to draft content) and unintended content getting built into the `/tags/` folder.

Also, `data: collections.blog` kept giving me errors. I have no idea why, but I plan to get to a minimal reproducible example to report it if it turns out it isn't "just" some config that's specific to this site.

```yaml
{% raw %}---
pagination:
  data: collections
  size: 1
  alias: tag
  filter:
    - all
    - blog
    - likes
    - postsByYear
    - til
eleventyComputed:
  title: "Posts Tagged With '{{ tag }}'"
permalink: /tags/{{ tag | slugify }}/
---
<!-- omitted wrapper html -->
  {% for post in collections[ tag ] | reverse %}
    {% include "components/post.preview.njk" %}
  {% endfor %}
<!-- omitted wrapper html -->{% endraw %}
```

### 11ty Docs

Links that I found helpful were:

- {% ext "Zero Maintenance Tag Pages for your Blog" "https://www.11ty.dev/docs/quicktips/tag-pages/" %}
- {% ext "Pagination" "https://www.11ty.dev/docs/pagination/" %}
- {% ext "getCollectionItem()" "https://www.11ty.dev/docs/filters/collection-items/#getcollectionitem" %}

## Conclusion

Tags are back, enjoy!

Thanks for reading this update. As always, don't hesitate to get in touch if you should experience any issues with the new feature.
