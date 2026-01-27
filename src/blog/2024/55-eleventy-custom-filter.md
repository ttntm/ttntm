---
title: Building a Custom Filter for Eleventy Collections
slug: building-a-custom-filter-for-eleventy-collections
date: 2024-07-01T18:50:00Z
description: Lists are wonderful, and filters make them better. This article is about building a custom filter for Eleventy collections.
tags:
  - eleventy
  - guide
  - website
image: /img/blog/building-a-custom-filter-for-eleventy-collections.jpg
toot: https://fosstodon.org/@ttntm/112712507191120915
---

Collections and lists are a wonderful thing, and filters simply make them better.

On this website, the first use case for a filterable collection was my whisky collection, and I've also added a filter to my [/albums](/albums/) page in the meantime. Both lists are filterable by different criteria, but use the same code for it.

So, let's have a look at how one could build such a composable filter for Eleventy collections.

## Prerequisites

There's only one actual prerequisite: an Eleventy collection that you want to filter.

It doesn't matter if the collection is based on JSON from the `_data` directory, or Markdown from `config.addCollection()`, both should work. In my case, the "albums" collection is a JSON file, and the "whisky" collection consists of many Markdown files.

### Collection Rendering

There are 2 things to keep in mind when rendering a collection that should become filterable:

First, there should be a wrapper `ul` for the filter controls (`li` elements wrapping a `button`). I've kept that `ul` in the parent component (template), so there's full control on how to layout it without any need to interfere with the shortcode that produces the filter UI.

Next, when rendering the list items, some additional information should be included in the HTML:

1. A specific class all list items have in common, i.e. `album-listing`
  This class shouldn't be used for other elements (on the same page at least)
2. A `data-*` attribute that is named after, and contains, the data attribute to filter by
  Sticking to the albums collection, that'd be the respective list item's "genre", rendered as `data-genre="{{ item.genre | slugify }}"`

Example (albums collection):

```html
{% raw %}<ul id="albums" class="list-reset post">
  {% for item in albums %}
    <li class="album-listing" data-genre="{{ item.genre | slugify }}">
      {% set released = ["Released: ", item.release] | join %}
      {% set titleText = [item.title, " (", item.release, ")"] | join %}
      {% imageHeader item.cover, imageHeaderSize, "h3", titleText, released %}
    </li>
  {% endfor %}
</ul>{% endraw %}
```

## The Filter UI

This section expands on a note I wrote back in March: [11ty: passing collections to shortcodes](/notes/#33).

I'm using a shortcode to create the filter UI, which is essentially a list (`ul`) that contains a couple of `button` elements:

```js
customFilter: function(collection, filterKey, excludeKey = null, excludeValue = null) {
  let displayLength = 0
  const terms = collection.reduce((map, currentItem) => {
    const data = currentItem.data ?? currentItem

    if (
      data
      && data.hasOwnProperty(filterKey)
      && data[filterKey]?.length > 0
      && data[excludeKey] !== excludeValue
    ) {
      const filterTerm = data[filterKey]
      const filterKeyCount = (map[filterTerm] || 0) + 1

      displayLength++

      return {
        ...map,
        [filterTerm]: filterKeyCount
      }
    } else {
      return map
    }
  }, {})
  const resetBtn = `<li>
    <button class="filter-btn filter-btn__active shadow" data-reset="true" data-value="${filterKey}">
      All&nbsp;(${displayLength})
    </button>
  </li>`

  return [resetBtn]
    .concat(Object.keys(terms)
      .sort()
      .map((t) => {
        return `<li>
          <button class="filter-btn shadow" data-term="${filterKey}" data-value="${_.kebabCase(t)}">
            ${t}&nbsp;(${terms[t]})
          </button>
        </li>`
      }))
    .join('')
}
```

That's quite a chunk of code - let's have a look at it.

This shortcode is a function that accepts 4 parameters and returns HTML.
The parameters are:

1. `collection` (`object[]`): an Eleventy collection
2. `filterKey` (`string`): the front matter or JSON key the filter should be based on, i.e. "genre" for the albums collection
3. `excludeKey?` (`string | null`): used together with `excludeValue`; a way to exclude certain items in a collection from the filter
4. `excludeValue?` (`any | null`): used together with `excludeKey`

Both `excludeKey` and `excludeValue` are optional parameters that default to `null`. That's a deliberate choice, because `Boolean(o[null] !== null)` returns `true`, which means that the code won't break if/when either (or both) of them are omitted.

At its core, the shortcode uses `Array.prototype.reduce()` to flatten all `filterKey` values obtained from the collection into a map(-like) object that contains only unique `filterKey` values and their usage counts. The resulting array gets sorted and concatenated with a button that resets the filter (`resetBtn`), and eventually ends up in the page template as one long string of HTML.

This is how I'm using the shortcode in my page templates:

Albums collection (JSON):

```html
{% raw %}<ul class="...">
  {% customFilter albums, "genre" %}
</ul>{% endraw %}
```

Whisky collection (Markdown):

```html
{% raw %}<ul class="...">
  {% customFilter collections.whisky, "region", "status", "wanted" %}
</ul>{% endraw %}
```

The above snippets show simple usage (albums), and also how to use the exclusion parameters (whisky).

## Composable Logic

Thanks to the shortcode from above, there's a UI for the filter. Now, it's time to make that UI interactive.

This is a high-level - collapsed - view of the `useCollectionFilter` composable:

```js
function useCollectionFilter(config) {
  function updateSearchParams(term, value) { }

  return (function() {
    const classActive = 'filter-btn__active'
    const classHidden = 'd-none'
    const filterBtns = document.querySelectorAll('.filter-btn')
    const filterParam = config.filterParam
    const listings = document.querySelectorAll(config.listingClass)
    const resetBtns = document.querySelectorAll('[data-reset="true"]')

    function applyFilter(term, value) { }

    function handleFilterBtnClick(event) { }

    function handleFilterInURL() { }

    function resetFilter(updateUrl = true) { }

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', handleFilterBtnClick)
    })

    resetBtns.forEach((btn) => {
      btn.addEventListener('click', resetFilter)
    })

    window.addEventListener('popstate', handleFilterInURL)
    window.addEventListener('pushState', handleFilterInURL)

    handleFilterInURL()
  })()
}
```

`useCollectionFilter` requires a `config` object that looks like this:

```js
{
  filterParam: string
  listingClass: string
}
```

The wrapper function returns an IIFE that first finds all needed DOM elements and eventually registers all required event listeners - the full code can be found {% ext "at GitHub", "https://github.com/ttntm/ttntm/blob/master/src/_includes/js/useCollectionFilter.js" %}.

`applyFilter(term, value)` loops through both filter buttons and list items, adding/removing classes to reflect the current filter selection.

`handleFilterBtnClick(event)` handles filter button clicks, manages their active state, and calls `applyFilter()` as well as `updateSearchParams()`.

`resetFilter(updateUrl = true)` used to reset the filter, pretty much reverts `applyFilter()` and also removes query arguments, using `updateSearchParams()`, when called via the UI (as opposed to automated processing of query arguments, see below).

The two functions `updateSearchParams()` and `handleFilterInURL()` are noteworthy for the additional functionality they provide: filter persistence using the History API and dedicated query arguments contained in the URL. That makes direct links to specific list views possible, i.e. [ttntm.me/albums/?genre=synthwave](/albums/?genre=synthwave).

`updateSearchParams()` is a simple and convenient function that manages the query arguments contained in the URL:

```js
function updateSearchParams(term, value) {
  const url = new URL(window.location.href)

  if (value) {
    url.searchParams.set(term, value)
  } else {
    url.searchParams.delete(term)
  }

  window.history.pushState({}, '', url.toString())
}
```

Further information can be found at MDN:

- {% ext "History API", "https://developer.mozilla.org/en-US/docs/Web/API/History_API" %}
- {% ext "URL: searchParams property", "https://developer.mozilla.org/en-US/docs/Web/API/URL/searchParams" %}

`handleFilterInURL()` is used by the `popstate` and `pushState` event listeners. It also gets called whenever `useCollectionFilter` is initialized (i.e. page load), extracting and processing the query arguments contained in the URL. The function eventually calls either `applyFilter()`, or `resetFilter()`, based on a simple IF-statement.

```js
function handleFilterInURL() {
  const paramName = filterParam
  const urlParams = new URLSearchParams(window.location.search)

  if (urlParams.has(paramName)) {
    const paramValue = String(urlParams.get(paramName))
    // Find the filter button that matches the URL param's value
    const paramValueBtn = document.querySelector(`[data-value="${paramValue}"]`)

    applyFilter(paramName, paramValue)

    if (paramValueBtn instanceof HTMLElement) {
      paramValueBtn.classList.add(classActive)
      paramValueBtn.disabled = true
    }
  } else {
    resetFilter(false)
  }
}
```

### Setup and Configuration

Using the composable filter should end up looking like this (after including the `useCollectionFilter` code somewhere before the code in this snippet):

```js
document.addEventListener('DOMContentLoaded', () => {
  const filterOptions = {
    filterParam: 'genre',
    listingClass: '.album-listing'
  }

  useCollectionFilter(filterOptions)

  // other code
})
```

The filter initialization has no other dependencies than the `config` object (`filterOptions` in the example above) and can be mixed with other code without causing issues.

My albums and whisky pages both have additional list view controls, and that's where I manage that code. You can refer to the following files for further context:

- {% ext "albums.js", "https://github.com/ttntm/ttntm/blob/master/src/_includes/js/albums.js" %}
- {% ext "whisky.js", "https://github.com/ttntm/ttntm/blob/master/_archive/whisky.js" %}

## Summary

I'm really happy with this implementation of a reusable custom filter and I will probably create/find additional list pages that I'm eventually going to use it for.

The code is clear and minimal (IMO), making use of vanilla JS and keeping dependencies to a bare minimum (the shortcode makes use of `lodash`, but that's just on the server side, and was already used elsewhere a long time ago).

At some point, I'd like to test if multiple instances of the filter on the same page would work. I wrote the code in anticipation of that, but I haven't gotten around to testing it yet. Using multiple filters might need some changes in the config, and how it is handled though, so keep that in mind if/when you're trying to do that.
