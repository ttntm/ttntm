---
title: "Using Tailwind CSS with Vue.js"
slug: tailwind-css-with-vuejs
type: blog
date: 2020-07-09
description: "Tailwind CSS is an incredibly powerful utility-first CSS framework. It's super easy to set up and makes you very flexible."
tags:
  - guide
  - tailwind
  - vue
image: /img/blog/code.jpg
---

> **This article was written a long time ago**. It applies to Vue 2 which has reached its end of life (EOL) on December 31st, 2023.

This article is based on first-hand experience of [getting started with Vue.js](/blog/vuejs-getting-started-in-2020).

## Prerequisites

You should have gone through your Vue app's setup procedure before setting up Tailwind CSS for the project. Make sure your new app's available at `localhost:8080` after running `npm run serve`.

## Installation

We're obviously going to need Tailwind CSS, so we're going to install it now:

`npm install tailwindcss`

If you started with a new project from `vue create projectName`, your `package.json` should look like this now:

```json
...
"dependencies": {
  "core-js": "^3.6.5",
  "tailwindcss": "^1.4.6",
  "vue": "^2.6.11"
},
...
```

Next, we're going to create a brand new {% ext "configuration file", "https://tailwindcss.com/docs/configuration/" %}:

`npx tailwindcss init --full`

The `--full` flag makes sure that we get the entire {% ext "default configuration file", "https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js" %} and not just a couple of placeholders.

## Configuration

In order to use of Tailwind CSS for our project, we're going to have to do a bit of configuration.

First, let's create `index.css` in `./src/assets/styles/` with the following content:

```css
@tailwind base;

@tailwind components;

@tailwind utilities;
```

This will import Tailwind's `base`, `components` and `utilities` styles into your new Vue app's main CSS.

This stylesheet then needs to be imported into the app; open `./src/main.js` and add this line:

`import('@/assets/styles/index.css');`

The whole file should then look like this:

```js
import Vue from 'vue'
import App from './App.vue'

import('@/assets/styles/index.css');

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
```

When running `npm run serve` now, you'll get an error; this is due to a missing `postcss.config.js`, so let's create that file in the app's root directory:

```js
// ./postcss.config.js
const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');

module.exports = {
  plugins: [
    tailwindcss,
    autoprefixer,
  ],
};
```

Pretty simple and now `npm run serve` will work again (because Tailwind CSS gets properly injected into `styles/index.css`).

## Using Tailwind CSS with Vue

If you haven't touched your Vue app yet, you'll notice the Vue logo has moved all the way to the left; it's not centered anymore due to Tailwind's reset styles.

Let's change that! Head over to your app's `App.vue` and change this line: `<img alt="Vue logo" src="./assets/logo.png">`

Simply adding Tailwind's `class="mx-auto"` will center the Vue logo and prove that the base configuration worked.

There are 2 likely use cases now:

1. creating global styles in `index.css`
2. creating local/scoped styles inside of Vue's components

Both of these use cases will make use of Tailwind's `@apply` directive (see: {% ext "docs", "https://tailwindcss.com/docs/functions-and-directives/#apply" %}).


```css
/* index.css */
@tailwind base;

@tailwind components;

hr {
  @apply border-gray-500 my-8;
}

@tailwind utilities;
```

Also helpful when defining styles **in components** (global or `scoped`):

```js
<style lang="postcss">
  .btn {
    @apply inline-block font-bold rounded-lg shadow-sm px-6 py-2;
  }
</style>
```

Please note `lang="postcss"` - that's necessary for `@apply` to work here (and also provides autocomplete for Tailwind's classes in VS Code).

## Cleaning up - PurgeCSS

As mentioned at the beginning of this article, Tailwind CSS offers built-in PurgeCSS now - very convenient and an absolute game changer IMO!

You may have noticed it already; in order to configure PurgeCSS, we'll need to get back to our `tailwind.config.js` - there's an empty array in there that will accept our desired configuration:

```js
// ./tailwind.config.js
module.exports = {
  purge: [],
  ...
```

Let's change that according to where our styling might be located in a Vue app:

```js
// ./tailwind.config.js
module.exports = {
  // purge: { //ENABLE TO TEST LOCALLY
  //   enabled: true,
  //   content: ['./public/**/*.html', './src/**/*.html', './src/**/*.vue',],
  // },
  purge: [
    './public/**/*.html',
    './src/**/*.html',
    './src/**/*.vue',
  ],
  ...
```

The {% ext "PurgeCSS configuration", "https://tailwindcss.com/docs/controlling-file-size/" %} only affects production builds which is why there are some commented lines - I like to use them to test manually before deployment (if necessary and/or curious).

## Recommended VS Code Extensions

Aside from {% ext "Vetur", "https://marketplace.visualstudio.com/items?itemName=octref.vetur" %}, which will make your life with Vue a lot easier, there are some extensions that make working with Tailwind CSS even more pleasant:

- {% ext "Tailwind CSS IntelliSense", "https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss" %}
- {% ext "IntelliSense for CSS class names", "https://marketplace.visualstudio.com/items?itemName=Zignd.html-css-class-completion" %}

## ...and that's it!

As of writing this article, setting up Tailwind CSS for use with Vue.js is a rather simple process. Considering that there's basically 0 configuration needed for PurgeCSS is an absolute convenience feature and one more reason to give Tailwind CSS a go for your next Vue.js project.