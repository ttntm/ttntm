---
title: "Boilerplate: Hugo, TailwindCSS and gulp"
slug: hugo-tailwind-boilerplate
type: blog
date: 2020-04-12
description: "I just published a very simple boilerplate for Hugo sites based on TailwindCSS."
tags:
  - hugo
  - tailwind
  - template
image: /img/blog/boilerplate.jpg
---

## Hugo + Tailwind

So far, I've used the combination of Hugo and {% ext "Tailwind CSS", "https://tailwindcss.com" %} for more than 5 different projects. It's an extremely versatile zero dependency toolkit that "just works" without the added bulk of unnecessary pre-made components, jQuery and many lines of (mostly) unused code.

In doing so, I've started using local template project folders that just needed an `npm install` command to be up and running. Turns out that might be useful for others too (duh), so I've created a boilerplate repository of this setup today.

### hugo-tailwind-boilerplate

So, here's the rundown.

Trusty old {% ext "gulp", "https://gulpjs.com" %} handles Tailwind builds via PostCSS with 2 gulp tasks called `dev-css` and `build-css`. I'm sticking to gulp as my "swiss army knife"; it's small, powerful and overall another one of those tools that "just work", no matter what you throw at them.

Then, there's 2 npm scripts defined in `package.json` that make use of these tasks:

1. `start`
2. `deploy`

`start` is meant for local development (and the whole power of Tailwind + autocomplete classes), `deploy` will build the site into `./public` (using `hugo --minify`), ready for deployment (i.e. drag and drop into Netlify).

This boilerplate also includes {% ext "purgecss", "https://purgecss.com" %} to remove any unused styles from the final stylesheet that gets written to `static/css` for deployment. I had to play around with the config a bit to make it work for me though - I'm a bit lazy, so I like using things like this:

```css
*:hover {
  transition: all .35s ease-in-out;
}
```

In order for this _not_ to get purged (as it's technically an unused selector), my `purgecss` config looks like this:

```js
.pipe(purgecss({
  content: ['./layouts/**/*.html','./content/**/*.md'],
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [], //save most things that should not be purged
  whitelist: [':hover',':focus', 'button', 'button:focus'] //preserve the rest
}))
```

For testing/troubleshooting etc., un-purged CSS can be built using `gulp dev-css` whereas purged CSS comes out of `gulp build-css`.

The Hugo setup is basic at best; should be enough to build upon though. See `layouts/_default/baseof.html` to get an idea what the default template looks like.

> Here's the {% ext "GitHub repository", "https://github.com/ttntm/hugo-tailwind-boilerplate" %}

### Usage

In order to work with this repository, only 2 things are required:

- Hugo
- node/npm

If that's set up, then all you need is to get the repository, run `npm install` and then `npm run start`. Go to `localhost:1313` and you should see a one-page demo site you can start working with in your browser.

PS: the CSS in `./static/css` has been purged, so you may want to run `gulp dev-css` in order to make all of Tailwind available for your project and/or customize it through `tailwind.config.js` (see {% ext "their docs", "https://tailwindcss.com/docs/configuration" %} for details).

#### Addendum

This setup (esp. the choice of using gulp) is older than {% ext "Hugo Pipes", "https://gohugo.io/hugo-pipes/" %}; but I'm also relying on gulp as the main actor for [processing comments](/blog/static-blog-comments-hugo/), so I'll stick with it for the foreseeable future.

If _you_ don't want to use gulp though, Hugo has PostCSS built in by now - more about that in the {% ext "Hugo Docs", "https://gohugo.io/hugo-pipes/postcss/" %}.