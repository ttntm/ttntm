---
title: Switching from Vue CLI to Vite
slug: switch-vue-cli-to-vite
type: blog
date: 2021-04-04
description: Some numbers and thoughts after moving a production app from Vue CLI to Vite.
tags:
  - guide
  - vue
image: /img/blog/boilerplate.jpg
---

I used Vite to build {% ext "aitrack.work", "http://aitrack.work" %} about 2 months ago and it left me with a really solid experience.  Since then, launching any Vue CLI dev server felt painfully slow; this feeling kept getting worse over time, leading to the idea of switching a bigger project over to Vite in order to get some comparable before/after data.

Considering that I wasn't using any Vue CLI specific (Webpack) features for a [movie journal app](/blog/watch3r-movie-watchlist-journal-app/) that I launched last year, the choice of using that project as a test case for the switch of tools was an easy one.

We'll start looking at the numbers before heading into the *how*; the following numbers are based on Netlify's deployment logs and present the same set of features and functionality (= same source code) with different build tooling.

### Vue CLI

- Build & deploy time (average of the last 5 builds): **51,4 seconds**
- Built files (CSS & JS): **42**
- Built files size: **460,65 KB**

### Vite

- Build & deploy time (average of the last 5 builds): **40,8 seconds**
- Built files (CSS & JS): **28**
- Built files size: **445,69 KB**

These numbers don't show a very drastic difference, but Vite builds the app about 10 seconds faster, produces less files and has better compression. Here's some additional details:

- As far as I could tell from the logs, the Vue CLI build *does not* include the app's locally sourced font files in the reported numbers while Vite's build log does
- Vue CLI uses *gzip* (71,8 KB → 25,76 KB = 35,87%) for compression, Vite uses *brotli* (188,71 KB → 53,6 KB  = 28,4%)
- Less files = less HTTP requests; both tools built a bunch of sub 5 KB files, but Vite just built less of them (might be due to CSS; details below)

These number based on rather small sample sizes certainly aren't worth much scientifically, but I found them interesting enough to share anyway. Enough about numbers though, let's have a look at what I did in order to switch from Vue CLI to Vite now.

## Installation and Configuration

There's 2 packages you'll have to install for a Vue project:

- `vite`
- `@vitejs/plugin-vue`

With that out of the way, you'll want to create a `vite.config.js` in your project root directory. See {% ext "Configuring Vite", "https://vitejs.dev/config/" %} for config options; my very minimal config file looks like this:

```jsx
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  build: {
    cssCodeSplit: false
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'vuex',
      // etc.
    ]
  },
  plugins: [
    vue()
  ]
});
```

You'll also have to move your `index.html` from `./public/` to the project root directory; see {% ext "vitejs.dev/guide", "https://vitejs.dev/guide/#index-html-and-project-root" %} for details on that.

Next thing to take care of: **environment variables**. See {% ext "vitejs.dev/guide/env-and-mode", "https://vitejs.dev/guide/env-and-mode.html" %} for details on that and change your code accordingly. Be careful when using search and replace - I'm using a bunch of environment variables in the app's serverless functions and there's no Vite there (duh) - make sure you don't update those accidentally.

In case you previously used Webpack-specific **component imports** from paths like `@/components/buttons/someButton.vue` they'll have to be changed - Vite will not be able to work with those and give you errors instead. You can also use this housekeeping activity to get rid of any `/* webpack... */` magic comments while you're at it.

If you're not using any other tools or specific configurations, then it's time to **update your scripts** in `package.json` now:

```json
"scripts": {
  "start": "vite",
  "build": "vite build"
}
```

And that's it - running your *start* script should serve the app at `localhost:3000`, probably before you can even finish saying "Wow that was really fast and I can't believe how long it takes Vue CLI to do the same thing". Oh, and if everything works, you can now remove all the Vue CLI stuff (config files, plugins, etc.) you no longer need.

### Resolving Issues

There were 2 small issues I ran into when switching to Vite.

If you're using {% ext "netlify-cli", "https://github.com/netlify/cli" %}: Vite does not (yet...) get auto-detected, so you'll have to update your `netlify.toml`:

```yaml
[dev]
  command = "npm run start"
  framework = "#custom"
  functions = "functions"
  publish = "dist"
  targetPort = 3000
```

`framework` and `targetPort` (set to Vite's dev server port) are key here. Also make sure that `npm run dev` is mapped to *netlify-cli*:

```json
"scripts": {
    "dev": "netlify dev",
    // etc.
}
```

Netlify Functions and Identity will properly work on `localhost:8888` that way; see {% ext "cli.netlify.com/netlify-dev", "https://cli.netlify.com/netlify-dev" %} for further details.

The second issue I had was a missing file in my production build. It took me a while to find it, but here's what seems to have happened:

- I imported `index.css` in my `main.js`
- Vite split the CSS as per it's `build.cssCodeSplit` config option (default = `true`)
- The built global `index.css` got referenced by the code but somehow wasn't there - Netlify returned a 404 for the URL
- The app wouldn't load due to a missing module

Workaround: set `cssCodeSplit: false` in your Vite config file. That'll bundle up all the CSS into one file; 36 KB in my case, so I'd argue that it actually makes sense to do that instead of having many small files around = more HTTP requests.

It felt a little painful and I still don't have a clue as to why that happened; will try to reproduce but haven't had the motivation to do that yet - will update this article accordingly.

## Summary

Moving a production app to Vite worked well for me and offers better DX than Vue CLI did so far. Builds are faster and the build size is a little lower than it was using Vue CLI. I didn't encounter any road blocks and the whole switch took me about 2-3 hours (incl. finding and working around the 2 small issues I ran into).
