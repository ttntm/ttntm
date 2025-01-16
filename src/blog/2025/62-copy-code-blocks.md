---
title: Adding a Copy Button to Code Blocks
slug: adding-a-copy-button-to-code-blocks
date: 2025-01-16T13:15:00Z
description: About 61 lines of JavaScript that progressively enhance user experience.
tags:
  - eleventy
  - guide
  - website
image: /img/blog/adding-a-copy-button-to-code-blocks.jpg
---

Copying code from code blocks, without having to manually select it all first, is very handy convenience feature. But despite having published a ton of code snippets on this website, adding copy functionality wasn't a top priority so far. A bit sad, considering that it can be done in less than an hour, using only 61 lines of vanilla JavaScript (and some CSS, of course).

The approach described here is using client-side JS to manipulate the DOM, adding copy buttons when a page with code blocks in its DOM gets displayed. It works without any 3rd party resources, won't interfere with existing functionality, and follows the strategy of {% ext "progressive enhancement", "https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement" %}. The solution described here isn't specific to my website either - it should only require minor adjustments to make it work on any other website using code blocks.

## The Code

```js
function createCopyBtn(blockIndex) {
  return `<div class="cc-wrapper d-none d-sm-block">
    <button class="cc-btn btn-muted shadow" title="Copy code" data-target="${blockIndex}">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="icon"><path stroke="none"d="M0 0h24v24H0z"fill="none"/><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"/><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"/></svg>
    </button>
  </div>`
}

async function copyCode(block) {
  const code = document.querySelector(`[data-block-id="${block}"]`)
  const doCopy = async() => await navigator.clipboard.writeText(code?.innerText ?? '')

  if (!navigator.userAgent.includes('Firefox')) {
    const result = await navigator.permissions.query({ name: 'clipboard-write' })

    if (result.state === 'granted' || result.state === 'prompt') {
      doCopy()
    }
  } else {
    doCopy()
  }
}

async function handleCopyBtnClick(event) {
  const btn = event?.target
  const btnTarget = btn?.getAttribute('data-target')

  if (btn && btnTarget) {
    const originalText = btn.innerHTML

    await copyCode(btnTarget)

    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="icon"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /><path d="M9 14l2 2l4 -4" /></svg>'

    setTimeout(() => {
      btn.innerHTML = originalText
    }, 1500)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const notAPhone = window.matchMedia('(min-width: 768px)')

  if (notAPhone.matches) {
    const allCodeBlocks = Array.from(document.querySelectorAll('pre[class^="language-"]'))

    allCodeBlocks.forEach((b, i) => {
      const code = b.childNodes[0]
      const codeBlockIndex = `cb-${i}`

      b.insertAdjacentHTML('beforebegin', createCopyBtn(codeBlockIndex))
      code.setAttribute('data-block-id', codeBlockIndex)
    })

    const allCopyBtns = Array.from(document.querySelectorAll('.cc-btn'))

    allCopyBtns.forEach((btn) => {
      btn.addEventListener('click', handleCopyBtnClick)
    })
  }
})
```

A basic outline of what the code does:

1. Wait for the DOM to be ready
2. Find all code blocks rendered on the page (based on CSS classes)
3. Assign a unique ID to each code block and store it in a data attribute (`data-block-id`)
4. Inject a copy button at the beginning of each code block
5. Register an event handler for each button that copies the matching block's `innerText` (via `data-target` and `data-block-id`)

The actual copy functionality (`copyCode()`) uses the {% ext "Clipboard API", "https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API" %}; it looks a little convoluted due to the fact that the matching `clipboard-read` and `clipboard-write` permissions are not supported by Firefox (see {% ext "navigator.clipboard.writeText in Firefox", "https://stackoverflow.com/a/79250919" %}).

As always, I used SVGs from {% ext "Tabler Icons", "https://tabler.io/icons" %}, and matching CSS to make them overlap the code blocks in the top right corner. My copy buttons will not render on mobile devices - a deliberate choice, due to design and space constraints, but also arguably because the functionality won't be of much use on a mobile device. Simply remove the `if` statement (`if (notAPhone.matches) {...}`) to change that.

## Alternatives

I briefly considered using a plugin (i.e. {% ext "eleventy-plugin-code-clipboard", "https://github.com/mamezou-tech/eleventy-plugin-code-clipboard" %}), but I didn't like the idea of adding a couple of external dependencies for functionality that's rather simple and widely supported by modern browsers.

I'm sure there are similar plugins for many other platforms, SSGs, etc. - it might be a good idea to have a proper look at them, and to evaluate what (if anything) they can offer compared to an approach like the one described above.
