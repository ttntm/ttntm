---
title: Building an Autocomplete Input with Preact
slug: building-an-autocomplete-input-with-preact
type: blog
date: 2023-02-17
description: An article (incl. demo) about building an autocomplete input with Preact.
tags:
    - Preact
    - tutorial
image: /img/blog/autocomplete.png
---

"Building something with Preact…" is probably going to sound like an unusual topic if you look at my other articles, but let me explain: I consider it a very powerful yet lightweight tool for building stateful/interactive experiences when {% ext "going buildless" "https://modern-web.dev/guides/going-buildless/getting-started/" %} (together with {% ext "developit's htm" "https://github.com/developit/htm#example" %}). I mostly use it for stuff I do at work (forms, data display, mini-SPAs etc.) and I've come to appreciate it quite a bit. So, this article is probably not going to be the last one about building stuff with Preact… 🤓

With that out of the way, the topic at hand is an `<input>` that can support auto-complete/suggestions. I built it as an alternative to a `<select>` which would have been too restricitve - users should be able to use a list of pre-configured values while retaining the option of entering another value not contained in the list.

<p>
  <img src="/img/blog/autocomplete.png" class="img-fluid img-center" alt="Screenshot of a demo app">
</p>

**Demo**: [ttntm.me/demos/pas/](http://ttntm.me/demos/pas/)

*Hint: type the letter "o" into the* `<input>` *to see all available values. Not really intended, but works in this case.*

## Setup, Configuration & Usage

Decidedly simple, as per the "buildless" remark above:

- An HTML file ({% ext "index.html" "https://github.com/ttntm/ttntm/blob/master/src/static/demos/pas/index.html" %}) containing a `<script type="module">` tag
- A stylesheet ({% ext "page.css" "https://github.com/ttntm/ttntm/blob/master/src/static/demos/pas/page.css" %})
- A Preact module ({% ext "app.js" "https://github.com/ttntm/ttntm/blob/master/src/static/demos/pas/app.js" %})

We're going to focus on `app.js` for this article.

First things first: import all necessary dependencies - Preact, its hooks package and `htm`.

Options available as suggestions are defined right at the start:

```jsx
const AutoSuggestList = [
  'Systems Administrator',
  'Front End Developer',
  'Back End Developer',
  'Solution Architect',
  'Consultant',
  'Other'
]
```

The component wrapper for the `<input>` and the list of suggestions is called `FormInputSuggest`. This is its rendering function:

```jsx
return html`<div class="form-group w-100" style="position: relative;">
  <label class="text-muted" for="${htmlAttrs.id}" style="margin-bottom: 0.25rem;">${label}</label>
  <input onInput="${onInput}" onChange="${onChange}" ...${htmlAttrs} />
  ${hasTargetVal && suggestions.length > 0 && showSuggestions ? (
    html`<ul class="list-suggest">
      ${suggestions.map((item, index) => {
        return html`<li key="${index}" class="item-suggest" data-name="${name}" onClick="${onSuggestionClick}">
          ${item}
        </li>`
      })}
    </ul>`
  ) : null }
</div>`
```

It includes a bunch of props; the most important ones for the functionality are:

- `name`: maps to a key on the `formData` state object
- `showSuggestions`: a boolean flag that gets passed down from the parent component and controls whether or not suggestions should be shown for the respective component instance
- `suggestionList`: the list of suggestion values; see `const AutoSuggestList` above
- `target`: specifies the target state object for read/write operations, `formData` in this case
- The event handlers:
    - `onChange`: makes sure that suggestions are hidden when the associated `<input>` loses focus
    - `onInput`: handles writes into the `formData` state object
    - `onSuggestionClick`: writes into `formData` and hides the suggestion list after processing the click event

The remaining props are used to control how the `<input>` renders by setting the text for the label, class names, the `required` flag etc.

The handlers for `change` and `click` events both make use of `setTimeout()`. This was necessary due to some unpredictable/glitchy behavior: the suggestion list seemed to disappear before the click event was completed, leading to the selected value getting lost. There were also some differences in the click event timings between mouse and touchpad that the timeout smoothed out.

The component handles filtering the available suggestions internally, using a simple `Array.prototype.filter()` based on its internal `hasTargetVal` flag:

```jsx
let suggestions = hasTargetVal
    ? suggestionList.filter(item => item.toLowerCase().indexOf(target[name].toLowerCase()) > -1)
    : suggestionList
```

This check prevents errors that could happen when using the component to add/change `formData` keys without initializing them first. Something that could happen when adding fields=keys to an object obtained from outside the scope of the app (i.e. from a database), i.e. `setFormData({ ...objectFromDB })` on initial render.

Component usage in a form is rather simple:

```jsx
<${FormInputSuggest}
  name="role"
  isRequired="${true}"
  min="5"
  label="Job or Role"
  placeholder="Job/role"
  showSuggestions="${activeControl === 'role'}"
  suggestionList="${AutoSuggestList}"
  target="${formData}"
  type="text"
  onChange="${onChangeInputSuggest}"
  onInput="${handleFormInput}"
  onSuggestionClick="${onClickInputSuggest}"
/>
```

The combination of `name`, `showSuggestions` , `suggestionList` and `target` make sure that multiple instances of the component can be used from within the same parent (here: `const Form()` ) without any detrimental side effects; for example, when using the component in a form rendered from a JSON config file containing the field definitions.

The (mocked) handling of form submissions and the `FormStatus` component are essentially just a gimmick because they don't really add anything to the demo. However, they do complete the picture, so I left them in the code.

Feel free to {% ext "fork the demo repository" "https://github.com/ttntm/preact-auto-suggest-demo" %} and play around with it. As always, feedback is encouraged and much appreciated - even more so, considering that this is my first article about Preact.