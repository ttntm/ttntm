---
title: My Buildless Preact Starter
slug: buildless-preact-starter
type: blog
date: 2023-07-27
description: A template/starter intended to showcase how I'm using Preact for SPAs in buildless environments.
tags:
    - Preact
    - tutorial
image: /img/blog/buildless-preact.png
---

The opening paragraph of the last article published on this site already gave it away: I'm going to be writing about Preact a little more. In fact, the purpose of this article is really "just" an announcement: 

I've published a template/starter intended to showcase how I'm using Preact for SPAs in buildless environments.

It's probably going to seems a little lazy, but I'm going to publish the {% ext "project's readme", "https://github.com/ttntm/buildless-preact-starter/blob/main/README.md" %} here. Quite a bit of time went into writing this down properly (I hoto understand and use, so I feel like it's worth having a look at before heading over to GitHub to {% ext "browse the code", "https://github.com/ttntm/buildless-preact-starter/" %}.

There's also a demo which can be found here: [ttntm.me/demos/bps/](https://ttntm.me/demos/bps/)

<p>
  <img src="/img/blog/buildless-preact.png" class="img-fluid img-center" alt="Screenshot of a demo app">
</p>

## Preface

In the official docs, this approach is called the {% ext "No build tools route", "https://preactjs.com/guide/v10/getting-started#no-build-tools-route" %}; it leverages {% ext "HTM", "https://github.com/developit/htm" %}:

> HTM is a JSX-like syntax that works in standard JavaScript. Instead of requiring a build step, it uses JavaScript's own Tagged Templates syntax, which was added in 2015 and is supported in all modern browsers. This is an increasingly popular way to write Preact apps, since there are fewer moving parts to understand than a traditional front-end build tooling setup.

## Prerequisites

1. At least 1 HTML file
2. Browser support for `<script type="module">`
3. A server (or component in some low code system) that can execute and serve the code

## Project Structure

### index.html

Source code: {% ext "./index.html", "https://github.com/ttntm/buildless-preact-starter/blob/main/index.html" %}

The shell of your SPA. Can be used for static elements (header/footer) and server side code (if your environment provides that).

For the most minimal setup, this is where it ends: your Preact SPA is inlined in this file (please refer to the official docs linked above for an example).

`index.html` is also using some `<link rel="modulepreload">` statements in `<head>` to "significantly reduce the overall download and processing time" of the necessary dependencies listed below (see: {% ext "MDN", "https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/modulepreload" %}).

### app.js

Source code: {% ext "./app.js", "https://github.com/ttntm/buildless-preact-starter/blob/main/app.js" %}

Your SPA's entry point, kept in a separate file. Follow this approach if you can (i.e. if your environment supports it). 

The file uses a default export (`export default function App(config)`) that consumes a `config` object. A practical example: `config` could be used to pass data obtained from the server side to the SPA if the target system provides the functionality to run server side code in `index.html`.

### components.js

Source code: {% ext "./components.js", "https://github.com/ttntm/buildless-preact-starter/blob/main/components.js" %}

Uses a default export to provide reusable components. Use {% ext "Preact Hooks", "https://preactjs.com/guide/v10/hooks" %} if you want to make use of stateful components.

NB: using components in a separate file (or even _files_) is a nice way to follow the separation of concerns and to remove (reusable) component code from `app.js`. It is not required though - components can (also) be defined in `app.js` and/or inline (`<script type="module">`) without any issues - check out the `Heading` component in `app.js` for an example.

### config.js

Source code: {% ext "./config.js", "https://github.com/ttntm/buildless-preact-starter/blob/main/config.js" %}

Entirely optional. I'm often using such config files for translations, lists used to populate `<select>` elements etc.

Follows the same intention as `app.js` and `components.js` - use if your environment supports doing it and if your app has the complexity/size to justify doing it.

### styles.css

Source code: {% ext "./styles.css", "https://github.com/ttntm/buildless-preact-starter/blob/main/styles.css" %}

Not sure if this needs to be mentioned separately, but you probably want your site (and SPA) not to look like browser defaults.

The styles used for this project were originally based on {% ext "water.css", "https://github.com/kognise/water.css" %} but they got modified, extended and tinkered with over time.

## Using This Starter for Development

Fork, clone and start building your thing basically. Nothing to install, no `node_modules`, no dependencies for you to manage.

Well, that's not entirely true, but they're all loaded from {% ext "ESM CDN", "https://esm.sh/" %}:

- `esm.sh/preact@10.4.7`
- `esm.sh/preact@10.4.7/hooks`
- `esm.sh/htm@3.0.4`

I've included one recommendation for VS Code users in the `.vscode` folder though:

- {% ext "Live Preview", "https://open-vsx.org/extension/ms-vscode/live-server" %}

I've come to appreciate this extension for a variety of things, so go check it out if you haven't used it yet.
