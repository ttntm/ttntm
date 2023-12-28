---
title: Using a Serverless Function as a Sitemap
slug: using-a-serverless-function-as-a-sitemap
type: blog
date: 2023-01-15
description: How to use a serverless function as a sitemap for an app with dynamic user created content.
tags:
    - Functions
    - Netlify
    - Serverless
image: /img/blog/sitemap.png
---

<img src="/img/blog/sitemap.png" class="img-fluid img-center" alt="Illustration of a sitemap">

Having a sitemap might not be an immediate priority when working on a small side project. Even more so, if it’s an SPA with dynamic routes that display content from a database - there’s no SSR at all and no builds/deployments to hook into.

Thinking about the somewhat similar scenario of SSGs and user submitted content (i.e. comments), my first idea of how to tackle this feature was automating builds/deployments on a schedule which would create an opportunity for (re-)creating the sitemap as a part of the build process.

This approach didn’t feel right though, so I started thinking about how to generate the sitemap on demand, leveraging the app’s (serverless) back end.

I eventually came across an old {% ext "Netlify support topic" "https://answers.netlify.com/t/returning-content-type-xml-from-calling-a-function/1107" %} about returning XML from a serverless function - this looked and felt much better than the “automated rebuilds” approach mentioned above, so I gave it a try.

## Implementing the Sitemap

The app’s sitemap contains 2 static routes (`/home` and `/about`) and an ever changing amount of user generated content. 

The first thing the sitemap function has to take care of is initializing a new XML response with the hard coded static routes. The resulting sitemap template object is split into `start/mid/end` keys to allow adding further `<url>` elements before returning the final sitemap:

```js
  const initSitemap = () => {
    return {
      start: `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
      mid: `<url>
        <loc>${site}/</loc>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
      </url><url>
        <loc>${site}/about</loc>
        <changefreq>yearly</changefreq>
        <priority>0.7</priority>
      </url>`,
      end: `</urlset>`
    }
  }
```

Next, the function queries the database for all (published) content, using the same API endpoint that the app itself uses to get its front page content. If there’s a usable response, the function’s code loops through the response, adding the individual content page’s `<url>` objects to the sitemap:

```js
  const sitemap = initSitemap()

  const rRequest = await fetch(`${site}${readAll}`, { method: 'GET' })
  let rResponse = await rRequest.json()

  if (rResponse && rResponse.length > 0) {
    rResponse.forEach(el => {
      const itemURL = `${site}/recipe/${el.data.id}/${el.ref['@ref'].id}`
      
      sitemap.mid += `<url>
        <loc>${itemURL}</loc>
        <changefreq>yearly</changefreq>
        <priority>0.7</priority>
      </url>`
    })
  }
```

After that’s done, the final sitemap response gets concatenated from the `start/mid/end` keys of the sitemap template object (via `initSitemap()` above) and returned by the function:

```js
  const sitemapFinal = `${sitemap.start}${sitemap.mid}${sitemap.end}`
      
  return {
    statusCode: 200,
    headers: xmlHeaders,
    body: sitemapFinal
  }
```

Finally, don't forget to add a redirect to your app's config:

```toml
  /sitemap.xml /.netlify/functions/sitemap 200
```

That’s it basically; here’s some additional context:

- The merged PR: {% ext "feat #20: sitemap@GitHub" "https://codeberg.org/ttntm/recept0r/pulls/21/files" %}
- The final function: {% ext "sitemap.js" "https://codeberg.org/ttntm/recept0r/src/branch/main/functions/sitemap.js" %}

I’m pretty happy with the result and I have to say that using a(nother) serverless function here feels right to me, certainly much better than the idea of using some sort of automated rebuilds on a schedule just to create an XML file. It’s also in line with the rest of the app’s back end and it properly leverages existing functionality to keep things DRY.