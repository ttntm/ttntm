---
title: Building a Filterable Portfolio with Astro and Vue
slug: building-portfolio-with-astro-and-vue
date: 2024-02-13T10:30:00Z
description: I published a new Astro starter this week and this article offers an in-depth look at how it's built.
tags:
  - astro
  - template
  - vue
image: /img/blog/astro-portfolio.jpg
toot: https://fosstodon.org/@ttntm/111923810984584500
---

A couple of months ago, I started working on a re-build of my wife's website. This wasn't the first time I did that, but it's been the most successful attempt so far, considering that we're almost done with it. I knew that I was going to stick with Astro, which I'd already used for a previous attempt in late 2022, but I decided to use Contentful over StoryBlok as a headless CMS.

Contentful has been a great choice so far, both in terms of developer experience and end user features. And on top of that, their free tier is _really_ generous if you know what you're doing (mostly in terms of the data model). I think I got a little side-tracked here, might get back to that topic at some point...

Anyway, we're here to talk about building a filterable portfolio with Astro and Vue.

First, let's have a look at a brief summary of the core requirements:

- Content (i.e. projects) should be rendered as a list
- Individual projects should be rendered as pages
- project should have tags (1 or more)
- The list of projects should be filterable based on a selected tag (single choice)
- There should be a way to link to filtered list views
- The list view should feel "alive" somehow (i.e. transitions/animations)

I suppose the title gave it away already: we're going to use Astro as our SSG and we're including a Vue {% ext "island", "https://docs.astro.build/en/concepts/islands/" %} for the list view incl. transitions and filtering.

The result is going to look like this:

<img src="/static/img/blog/astro-portfolio.jpg" class="img-fluid img-center" alt="Screenshot of a portfolio website">

...and has already been published as a {% ext "template repository at GitHub", "https://github.com/ttntm/astro-potfolio-starter/" %}.

There's also a {% ext "live demo", "https://codesandbox.io/p/github/ttntm/astro-potfolio-starter/main" %} in a CodeSandbox that should help when following the rest of this article.

## Portfolio Content

We're working with standalone content here, so our portfolio is a {% ext "collection", "https://docs.astro.build/en/guides/content-collections/" %} that's defined in `./src/content/config.ts`.

The collection pages' front matter properties have to follow this type definition:

```ts
type PortfolioItemData = {
  title: string
  slug: string
  cover: string
  description?: string
  tags: string[]
  referenceUrl?: string,
  itemData: CollectionEntry<'portfolio'>
}
```

A little note regarding `itemData`: this prop stores the whole collection item. We'll be using it in a page template to render the markdown content.

### Images

Images used as `cover` are stored in `./public/img/` and are _not_ being processed by any image optimization.

NB: This is probably not ideal, but `getImage()` from `astro:image` ({% ext "docs", "https://docs.astro.build/en/guides/images/" %}) can only be used on the server side, meaning that conditional rendering based on filtered data will make it break (yes, I tried).

## Rendering

Collection pages (in `./src/content/portfolio/`) are processed in alphabetical order by the `[...path].astro` page template in `./src/pages/`. Its `getStaticPaths()` function processes the whole collection and generates both the index/list page (via `path: undefined` + `props.isListPage`) and the individual project pages (via `path: page.slug` + `props.isSinglePage`).

I first used an "all in one" `getStaticPaths()` function based on {% ext "rest parameters", "https://docs.astro.build/en/guides/routing/#rest-parameters" %} when rendering collections of pages based on Contentful's API responses. Querying the complete collection, and using the data to render both index and individual pages, offered a significant performance boost (in terms of build times), helped save on API requests and reduced repeated boilerplate code.

The index page gets rendered by the `PortfolioList.vue` component which can be found in `./src/components/interactive/`; the single page template rendering the individual project pages - `PortfolioLayoutSingle.astro` - can be found in `./src/layouts/`. This template makes use of the `itemData` prop to render content to HTML ({% ext "docs", "https://docs.astro.build/en/guides/content-collections/#rendering-content-to-html" %}):

```js
const { pageData } = Astro.props
const {
  // ...
  itemData
} = pageData
const { Content } = await itemData.render()
```

The rendered content can be placed anywhere in the template using the built-in `<Content />` component Astro provides.

## Interactivity

As mentioned earlier, our portfolio list page is a Vue island with 3 components:

- `PortfolioList.vue`: the outer wrapper and common parent of the other 2 components; manages data and handles events
- `PortfolioListItem.vue`: just a display component
- `PortfolioListNav.vue`: lists all tags and emits an `update:filter` event when a filter gets selected or removed

Let's have a closer look at the `script setup` sction of our `PortfolioList.vue` component now.

First, our component receives the whole portfolio collection from the `[...path].astro` page template and proceeds to create a list of unique tags using the `getUniqueTags()` utility function. You're welcome to check it out, but that function's essentially just using `new Set()` to deduplicate an array of arrays of tags obtained from the portfolio pages.

These unique tags are then passed to the `PortfolioListNav.vue` component that renders the filter/sub-navigation.

Next, `PortfolioList.vue` makes use of a `workItemsDisplay` array which utilizes the `currentFilter` `ref` to compute the list of items to show based on the current filter selection (or the lack thereof). We also define event listeners for `popstate` and `pushState` events:

```js
onMounted(() => {
  applyFilterFromURL()
  window.addEventListener('popstate', applyFilterFromURL)
  window.addEventListener('pushState', applyFilterFromURL)
})

onBeforeUnmount(() => {
  window.removeEventListener('popstate', applyFilterFromURL)
  window.removeEventListener('pushState', applyFilterFromURL)
})
```

We do this, because we're going to use query parameters to store the currently selected filter (as per the requirements above); both event listeners use the `applyFilterFromURL()` method.

Finally, we define 2 methods that provide the main functionality of our component: applying and updating the filter.

`applyFilterFromURL()`: a method that checks the query parameters in the URL for a parameter called `filter` and updates the `currentFilter` variable accordingly. This in turn triggers the - computed - `workItemsDisplay` array and updates the view.

```js
function applyFilterFromURL() {
  const paramName = 'filter'
  let urlParams = new URLSearchParams(window.location.search)

  if (urlParams.has(paramName)) {
    currentFilter.value = String(urlParams.get(paramName))
  } else {
    currentFilter.value = ''
  }
}
```

`updateFilter()`: an event handler for the filter selection that is used exclusively by the `PortfolioListNav.vue` component. It handles incoming values and sets or clears the `currentFilter` variable. Updating the `currentFilter` variable right after calling `window.history.pushState()` is necessary, because this programmatic update of `window.history` _does not_ trigger the `pushState` event handler.

```js
function updateFilter(newVal: string) {
  const url = new URL(window.location.href)

  if (newVal) {
    url.searchParams.set('filter', newVal)
  } else {
    url.searchParams.delete('filter')
  }

  window.history.pushState({}, '', url.toString())
  currentFilter.value = newVal
}
```

### List Transitions and Animation

We're using a `<transition-group>` wrapper ({% ext "Vue Docs: TransitionGroup", "https://vuejs.org/guide/built-ins/transition-group.html" %}) around the list of portfolio items. This enables list transitions via CSS, based on the transition group's `name="list"` property:

```css
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all .75s;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.list-leave-active {
  position: absolute;
}
```

## Conclusion

I was rather happy with the result when I built this feature for the first time. Refactoring it into the {% ext "astro-potfolio-starter", "https://github.com/ttntm/astro-potfolio-starter/" %} for this article was a nice follow-up and might be of help to someone else out there that's trying to do something similar.

Using query parameters to provide direct links to filtered lists is a pattern that I don't see very often anymore. It feels like it was used much more ~10 years ago, but has since moved into various state management patterns and other less transparent abstractions. I think it's a good choice for a "link to filtered list" requirement, especially considering how simple it is to implement nowadays.

A final note on <s>bloat</s> bundle size: using Vue for such a limited use case might seem like overkill to some, which I can fully understand. It was a deliberate choice though, because it's also used for other islands of interactivity, and it comes with built-in components for list transitions (= no additional animation library + dependencies required).
