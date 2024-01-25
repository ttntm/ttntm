---
title: Hacking <hr> into vue-quill
slug: hacking-hr-into-vue-quill
type: blog
date: 2023-12-28
description: A hacky workaround making <hr> usable in vue-quill.
tags:
  - guide
  - vue
image: /img/blog/code.jpg
---

A long time ago, I decided to use {% ext "vue-quill" "https://github.com/vueup/vue-quill" %} for recept0r, my personal recipes app.

Not long after that, the missing `<hr>` tag was noticed, which led to a feature request {% ext "Feature: add `<hr>` tag to editor" "https://codeberg.org/ttntm/recept0r/issues/15" %} that I ended up ignoring for almost 2 years.

I'm not quite sure what it was exactly that got me thinking about it again back in September, but I ended up with a rather simple workaround: using a regular expression based on the - escaped - string `vue-quill` produces when a literal `<hr>` is used. 

The workaround has 2 stages:

1. Displaying an escaped string as a placeholder when editing content (= accepting the literal string `<hr>` as user input)
2. Replacing the placeholder with valid HTML before saving content to the database

The regular expression used for this workaround looks like this: `/\<p\>\&lt\;hr\&gt\;\<\/p\>/gi`

When editing content, the code uses `String.prototype.replaceAll()` (see: {% ext "MDN" "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll" %}) to replace the actual HTML with the placeholder:

```js
const updateEditMode = (input: Recipe) => { 
  Object.keys(input).map(key => events.onUpdateRecipe(key, input[key]))
  editor.value.setHTML(recipe.body)
  // We've got to add in a marker for <hr> elements that will actually get rendered by Quill
  // `onSaveRecipe()` converts it back to valid HTML
  editor.value.setHTML(recipe.body.replaceAll('<hr>', '<p>&lt;hr&gt;</p>'))
}
```

Eventually, when saving edited content, the placeholder is converted back to valid HTML using the same regular expression:

```js
async onSaveRecipe() {
  //...
  if (editorHrPattern.test(recipe.body)) {
    // Replace <hr> marker with valid HTML
    recipe.body = recipe.body.replaceAll(editorHrPattern, '<hr>')
  }
  //...
}
```

If you're very curious: check out the {% ext "source code" "https://codeberg.org/ttntm/recept0r/commit/2e96503ce09c54418e0efc60405316ff016a127a#diff-3905b2b27985605800a686b8f8000d0762b6d685" %} at Codeberg.

I'm fully aware that this is a very hacky workaround, but I also think of it as a "quick win" when considering the amount of time I would have had to spend on properly extending the editor's functionality (see links in the feature request linked above). So, it's probably best _not_ to follow this approach in any kind of real world scenario.
