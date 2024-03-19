---
title: Creating a Reading List with Eleventy and Omnivore
slug: creating-a-reading-list-with-eleventy-and-omnivore
date: 2024-03-20
description: This website includes my personal reading list now. It was built using Eleventy and Omnivore, an approach described in this article.
tags:
  - eleventy
  - guide
  - website
image: /img/reading.png
---

It's been a productive year so far - I've managed to add a couple of cool new things to this website, which is something I'd been planning to do for a while. This article is about the most recent addition, my [personal reading list](/reading/) powered by Omnivore, a free, open source, read-it-later app.

Before we start: you're welcome to check out all posts with the [#website](/tags/website/) tag and the [changelog](/changelog/) if you're curious about other recent changes.

<img src="/img/reading.png" class="img-fluid img-center" alt="An illustration, taken from undraw.co, showing a female person reading a book while sitting in a chair">

## Prerequisites

- A website; following this guide will be a little easier if it's built with Eleventy
- An {% ext "Omnivore", "https://omnivore.app" %} account
- Optional: some kind of CI/CD that supports deployments triggered by webhooks

## 1, Get an API Key

The first thing we'll have to take care of is getting an Omnivore API key.

It only takes a couple of clicks and the whole procedure is well documented: {% ext "Getting an API token", "https://docs.omnivore.app/integrations/api.html#getting-an-api-token" %}

You'll end up with an API key that looks like this: `FFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF`

### Test Your API Key

This step is optional, but I recommend doing it.

I find it helpful to know what kind of response data to expect and it's easier to notice if something's wrong _before_ wrapping the API call with additional code.

Using `curl` is perfectly fine (example in the docs linked above), but GraphQL in the terminal can get a little confusing. I usually recommend API clients like {% ext "Insomnium", "https://github.com/ArchGPT/insomnium" %}, which can help make things a little easier.

First, you'll need a matching GraphQL query, no matter which tool you decide to use. I checked the docs, only found the {% ext "schema", "https://github.com/omnivore-app/omnivore/blob/main/packages/api/src/schema.ts" %}, and eventually ended up getting a suitable query from the developer tool's network panel:

<img src="/img/blog/ov_network_panel.jpg" class="img-center" alt="A screenshot from the network panel of the browser developer tools that shows a GraphQL query of the Omnivore app">

Next, I extracted the fields I felt were necessary and ran a test:

<img src="/img/blog/ov_api_test.jpg" class="img-center img-fluid" alt="A screenshot of 2 panes in Insomnium that shows a GraphQL query (left pane) that was executed against the Omnivore API and its results (right pane)">

NB: please excuse the squiggly lines, they're caused by a bug in the application GUI.

The query variables are used to limit the results we get:

- `"first": 10` results in the 10 most recently saved items
- `"query": "no:subscription"` filters for items that were saved intentionally, i.e. excludes feeds and newsletters that can end up in your Omnivore account automatically (a _great_ feature actually, just not what we want here)

More information about search, filters and queries can be found here: {% ext "Find all your saved items with Omnivore's new advanced search", "https://blog.omnivore.app/p/find-all-your-saved-items-with-omnivores" %}

## 2, Data Fetching with Eleventy

Based on the successful test described above, we can proceed and set up the code that pulls the data into Eleventy.

I'm using the {% ext "eleventy-fetch plugin", "https://www.11ty.dev/docs/plugins/fetch/" %} to `POST` the GraphQL query to Omnivore's API. The code is rather simple and stored in `./src/_data/reading.js`, a {% ext "Global Data File", "https://www.11ty.dev/docs/data-global/" %}:

```js
const config = require('dotenv').config()
const eleventyFetch = require('@11ty/eleventy-fetch')

const ovURL = 'https://api-prod.omnivore.app/api/graphql'
const queryData = {
  // see below
}

module.exports = async function() {
  try {
    const response = await eleventyFetch(ovURL, {
      directory: '.cache',
      duration: '1d',
      type: 'json',
      fetchOptions: {
        method: 'POST',
        headers: {
          Authorization: `${process.env.OV_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(queryData)
      }
    })

    if (response && response?.data?.search?.edges?.length > 0) {
      return response.data.search.edges.map((item) => item.node)
    } else {
      return []
    }
  } catch (ex) {
    console.log(ex.message || ex)
    return []
  }
}
```

The Omnivore API key is stored in an _untracked_ local `.env` file and is made available using the `dotenv` package. Don't forget that the API key should also be configured in whatever CI/CD service you're using to deploy your website.

Other than that, the code is pretty straightforward: we either get a response, that we then process with a `map()` function, or we don't, which leads to an empty array being returned by the data file. That, and the outer try/catch, should make sure that potentials errors, timeouts etc. don't break the build.

I decided to omit the `queryData` object in the code snippet above to make it a little more concise. It's absolutely necessary though, considering that this is where you define the shape of the data returned by the API:

```js
const queryData = {
  query: `
    query Search($after: String, $first: Int, $query: String) {
      search(first: $first, after: $after, query: $query) {
        ... on SearchSuccess {
          edges {
            node {
              id
              title
              description
              siteName
              url
              publishedAt
              savedAt
            }
          }
          pageInfo {
            hasNextPage
            endCursor
            totalCount
          }
        }
        ... on SearchError {
          errorCodes
        }
      }
    }
  `,
  variables: {
    after: '0',
    first: 10,
    query: 'no:subscription'
  }
}
```

`query Search()` defines a couple of variables that are used in the next line (`search()`). The actual values for the variables are supplied by the included `variables` object. That means, that you shouldn't have to touch the GraphQL query, unless you want more (or less) fields included in the response.

NB: there's an official {% ext "API Client Library for Node.js", "https://github.com/omnivore-app/omnivore-api" %}, but the eleventy-fetch plugin offers caching, so I decided to use that instead. Otherwise, I could end up hammering the Omnivore API with requests during local development, which is something I'd rather not risk.

## 3, Rendering the Reading List

It's nothing special, but this is how I'm rendering my reading list:

```html
{% raw %}
{% if reading | length %}
  <ul>
    {% for item in reading %}
      <li>
        <h2>{{ item.title }}</h2>
        <ul>
          <li>
            {% if item.publishedAt %}
              Published: <time datetime="{{ item.publishedAt | date('YYYY-MM-DD') }}">{{ item.publishedAt | date('MMMM DD, YYYY') }}</time> at {{ item.siteName }}
            {% else %}
              Published at {{ item.siteName }}
            {% endif %}
          </li>
          <li>
            Saved: <time datetime="{{ item.savedAt | date('YYYY-MM-DD') }}">{{ item.savedAt | date('MMMM DD, YYYY') }}</time>
          </li>
        </ul>
        <p>{{ item.description }}</p>
        <p>
          <a href="{{ item.url }}" rel="noreferrer" target="_blank">Read Now</a>
        </p>
      </li>
    {% endfor %}
  </ul>
{% else %}
  <p>No data :(</p>
{% endif %}
{% endraw %}
```

There's a check for the availability of the list data (`if reading | length`) that makes sure we don't run into any rendering errors. Dates are formatted by a `date()` filter and wrapped in `<time>` tags. `publishedAt` is an optional - it's wrapped in an IF-statement to avoid 1970 fallback dates.

## 4, Updating the List

If you've followed this guide so far, you should be in this situation:

- Local build use the `.cache` folder managed by the eleventy-fetch plugin
- Remote builds should fetch fresh data every time
- Saving items to Omnivore does not have any effect on your site

That's probably fine for many folks out there, some might even have automated builds and deployments in place already, which takes care of fetching new Omnivore data too. And if that applies to you, then you can certainly leave it at that, enjoy your new reading list and move on to other matters.

Otherwise, keep reading and set up automatic deployments using webhooks.

### Automating Deployments

> Omnivore allows you to send your reading data in realtime using webhooks. When a new page is saved or updated, a webhook can be triggered.
>
> <small>{% ext "Omnivore docs", "https://docs.omnivore.app/integrations/webhooks.html" %}</small>

Services and Platforms like Cloudflare Pages, Netlify etc. usually allow their users to set up dedicated endpoints to receive webhook data and use them to trigger deployments of the respective site.

So-called Deploy Hooks are available for websites built with and served by Cloudflare Pages, which is what I'm currently using for this website (a rather recent decision that you can read about in [a previous post](/blog/about-diversification/)).

Setting up automated deployments for a site like mine is really simple:

1. Create a Deploy Hook as described in the {% ext "CF Pages documentation", "https://developers.cloudflare.com/pages/configuration/deploy-hooks/" %}
2. Copy our hook's URL
3. Create a new webhook in Omnivore:
    - URL: paste your hook's URL
    - Event Type: `PAGE_CREATED`
    - Method: `POST` (default)
    - Content Type: `application/json` (default)

When this is done, new items saved to your Omnivore account should trigger a deployment of your site, resulting in an updated reading list.

## Summary

I got to know about Omnivore less than 6 months ago, but I'm already wondering how I lived without it for such a long time. About 10 years ago, I used Pocket for a while, but it didn't really "click" for me. So, I stopped looking into read-it-later solutions and kept links in my browsers, various text files and later also in Notion.

Right now, I'm really glad that I have a tool like Omnivore back at my disposal. In addition to its read-it-later functionality, subscribing to RSS feeds and email newsletters with the very same application is an absolute game changer for me - it decluttered my email inboxes significantly and made it easier to keep track of things I should actually be focusing on.

Having the possibility of adding a reading list to my personal website based on data that I'm already aggregating anyway is a great bonus and might help others discover articles, posts etc. that they might have missed otherwise. It's a really convenient solution that can be added to almost any kind of website in a matter of hours.
