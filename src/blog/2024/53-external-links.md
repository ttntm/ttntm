---
title: 'External Links and target="_blank"'
slug: external-links-and-target-blank
date: 2024-05-26T10:30:00Z
description: 'Re-evaluating external links, target="_blank", and their styling.'
tags:
  - css
  - thoughts
  - website
image: /img/blog/content.jpg
---

External links are everywhere, and I'm using tons of them on this rather small website. They're often used as sources of quoted text and for references scattered across articles, but I'm also maintaining lists of bookmarks, projects and even random things I find on the internet.

All of these external links have one thing in common: you leave this website when you click on them (duh).

That's all pretty basic stuff, yes. But what I used to do, was making sure that all of these links would open in a new browser tab. It's something that `target="_blank"` makes pretty easy, and web developers don't even have to worry about the `window.opener` property anymore these days. Thankfully, browsers are taking care of that for us now, so things like adding `rel="noreferrer"` to your external links, which you might remember doing at some point in the past, are obsolete now.

A thing that didn't change, however, is the fact that `target="_blank"` does not in fact spawn a new tab, it spawns a new window:

> You cannot, as a developer, force links to open in a new tab. You always and only tell the browser to open a new window. That's a big difference, even though browsers (with or without addons) allow you to define how to handle those cases, e.g. open a new tab.
>
> <small>Ref. [[1]](#refs)</small>

Once again, it's the browsers that do the work for us, using a configuration setting that's often called "Open links in tabs instead of new windows". Nevertheless, _opening a new window_ is what we're actually doing when we're using `target="_blank"`, and there's no way for our code to determine what it is the browser's actually going to do. In addition to that, there's no way for a user to override this behavior, i.e. to force `target="_blank"` links to open in the current window.

There are many reasons why that can be an issue for a user, but it really all boils down to one thing: _it should be the user's choice where a link target opens_. And there's really just one way to achieve that: avoiding `target="_blank"`.

## Styling External Links

Having realized the error of my ways, I wondered what I could do to achieve the desired effect of creating a distinction between internal and external links that would also benefit the user (in terms of awareness of the link target).

I remembered doing something similar for links in my personal wiki, but it wasn't a good solution - just some JS that distinguishes internal/external links and modifies them. It does the job, but it's a waste of resources, considering that CSS-only solutions are perfectly viable.

So, I first re-wrote an old shortcode from

```js
ext: function(displayText, link) {
  return `<a href="${link}" target="_blank">${displayText}</a>`
}
```

to

```js
ext: function(displayText, link) {
  return `<a class="ext" href="${link}">${displayText}</a>`
}
```

and then proceeded to add some new rules to my CSS:

```css
a[href^="https://"].ext,
:is(.like) a[href^="https://"] {
  display: inline-block;

  &::after {
    --size: .875em;

    display: inline-block;
    content: "";
    color: var(--text);
    background-image: url("data:image/svg+xml,...");
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    margin-left: 2px;
    line-height: var(--size);
    width: var(--size);
    height: var(--size);
  }
}
```

NB: I read about the `[href^="https://"]` rule in an article (ref. [[2]](#refs)) and found it very useful.

## Conclusion

I learned a thing or two about not making decisions for others.

I also updated my website, making external link targets much more transparent, and added a bunch of similar update operations for some of my other projects to my to-do list.

<h2 id="refs">References</h2>

1. {% ext "fabian-mcfly, Apr 1, 2022", "https://stackoverflow.com/questions/4198788/is-it-alright-to-use-target-blank-in-html5" %}
2. {% ext "Styling External Links with an Icon in CSS", "https://christianoliff.com/blog/styling-external-links-with-an-icon-in-css/" %}
