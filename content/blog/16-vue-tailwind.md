---
title: "Using Tailwind CSS with Vue.js"
slug: tailwind-css-with-vuejs
weight: -16
type: blog
date: 2020-07-09
description: "Tailwind CSS is an incredibly powerful utility-first CSS framework. It's super easy to set up and makes you very flexible."
tags:
    - Vue.js
    - Tailwind
    - CSS
    - howto
images:
    - /img/blog/code.jpg
---

This article is based on first hand experience of [getting started with Vue.js](/blog/vuejs-getting-started-in-2020).

> As of version 1.4 from April 29th 2020, Tailwind includes {{< link-ext "built-in PurgeCSS support" "tailwindcss.com/docs/controlling-file-size" >}} in it's own `tailwind.config.js`!

## Prerequisites

You should have gone through your Vue app's setup procedure before setting up Tailwind CSS for the project. Make sure your new app's available at `localhost:8080` after runnning `npm run serve`.

## Installation

We're obviously going to need Tailwind CSS, so we're going to install it now:

`npm install tailwindcss`

If you started with a new project from `vue create projectName`, your `package.json` should look like this now:

{{< highlight json >}}

...
"dependencies": {
  "core-js": "^3.6.5",
  "tailwindcss": "^1.4.6",
  "vue": "^2.6.11"
},
...

{{< /highlight >}}

Next, we're going to create a brand new {{< link-ext "configuration file" "tailwindcss.com/docs/configuration/" >}}:

`npx tailwindcss init --full`

The `--full` flag makes sure that we get the entire {{< link-ext "default configuration file" "github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js" >}} and not just a couple of placeholders.

## Configuration

In order to use of Tailwind CSS for our project, we're going to have to do a bit of configuration.

First, let's create `index.css` in `./src/assets/styles/` with the following content:

{{< highlight css >}}

@tailwind base;

@tailwind components;

@tailwind utilities;

{{< /highlight >}}

This will import Tailwind's `base`, `components` and `utilities` styles into your new Vue app's main CSS.

This stylesheet then needs to be imported into the app; open `./src/main.js` and add this line:

`import('@/assets/styles/index.css');`

The whole file should then look like this:

{{< highlight js >}}

import Vue from 'vue'
import App from './App.vue'

import('@/assets/styles/index.css');

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

{{< /highlight >}}

When running `npm run serve` now, you'll get an error; this is due to a missing `postcss.config.js`, so let's create that file in the app's root directory:

{{< highlight js >}}

// ./postcss.config.js

const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');

module.exports = {
  plugins: [
    tailwindcss,
    autoprefixer,
  ],
};

{{< /highlight >}}

Pretty simple and now `npm run serve` will work again (because Tailwind CSS gets properly injected into `styles/index.css`).

## Using Tailwind CSS with Vue

If you haven't touched your Vue app yet, you'll notice the Vue logo has moved all the way to the left; it's not centered anymore due to Tailwind's reset styles.

Let's change that! Head over to your app's `App.vue` and change this line: `<img alt="Vue logo" src="./assets/logo.png">`

Simply adding Tailwind's `class="mx-auto"` will center the Vue logo and prove that the base configuration worked.

There are 2 likely use cases now:

1. creating global styles in `index.css`
2. creating local/scoped styles inside of Vue's components

Both of these use cases will make use of Tailwind's `@apply` directive (see: {{< link-ext "docs" "tailwindcss.com/docs/functions-and-directives/#apply" >}}).

For **global styles** (place them after Tailwind's `components` and before `utilities`), you'll have to use _one_ `@apply` statement per line _and_ utility class in order not to get any errors from Vue:

{{< highlight css >}}

/* index.css */

@tailwind base;

@tailwind components;

hr {
  @apply border-gray-500;
  @apply my-8;
}

@tailwind utilities;

{{< /highlight >}}

When defining styles **in components** (global or `scoped`), you can use the `@apply` directive to apply multiple utility classes at the same time:

{{< highlight html >}}

<style lang="postcss">
  .btn {
    @apply inline-block font-bold rounded-lg shadow-sm px-6 py-2;
  }
</style>

{{< /highlight >}}

Please note `lang="postcss"` - that's necessary for `@apply` to work here (and also provides autocomplete for Tailwind's classes in VS Code).

## Cleaning up - PurgeCSS

As mentioned at the beginning of this article, Tailwind CSS offers built-in PurgeCSS now - very convenient and an absolute game changer IMO!

You may have noticed it already; in order to configure PurgeCSS, we'll need to get back to our `tailwind.config.js` - there's an empty array in there that will accept our desired configuration:

{{< highlight js >}}

// ./tailwind.config.js

module.exports = {
  purge: [],
  ...

{{< /highlight >}}

Let's change that according to where our styling might be located in a Vue app:

{{< highlight js >}}

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

{{< /highlight >}}

The {{< link-ext "PurgeCSS configuration" "tailwindcss.com/docs/controlling-file-size/" >}} only affects production builds which is why there are some commented lines - I like to use them to test manually before deployment (if necessary and/or curious).

## Recommended VS Code Extensions

Aside from {{< link-ext "Vetur" "marketplace.visualstudio.com/items?itemName=octref.vetur" >}}, which will make your life with Vue a lot easier, there are some extensions that make working with Tailwind CSS even more pleasant:

- {{< link-ext "Tailwind CSS IntelliSense" "marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss" >}}
- {{< link-ext "IntelliSense for CSS class names" "marketplace.visualstudio.com/items?itemName=Zignd.html-css-class-completion" >}}

## ...and that's it!

As of writing this article, setting up Tailwind CSS for use with Vue.js is a rather simple process. Considering that there's basically 0 configuration needed for PurgeCSS is an absolute convenience feature and one more reason to give Tailwind CSS a go for your next Vue.js project.