---
title: Building an Editable List with Drag and Drop Sorting in Vue3
slug: building-an-editable-list-with-drag-and-drop-sorting-in-vue3
date: 2022-12-28T10:30:00Z
description: An article (incl. demo) about building an editable list that supports drag'n'drop in Vue3.
tags:
  - guide
  - vue
image: /img/blog/recept0r-edit-recipe.png
---

The feature request that got me looking into the use case mentioned in the title popped up as a "convenience feature" when re-writing my {% ext "family recipes app" "https://recept0r.com" %} last year. I didn't tackle it immediately within the re-write's initial scope (i.e. migrating the app from Vue2 to Vue3 + TypeScript), but got it done a couple of months later nevertheless. Here's a link to the merged pull request if you're curious: {% ext "add: drag & drop for ingredients" "https://codeberg.org/ttntm/recept0r/pulls/18" %}.

There's been a couple of fixes and refactoring efforts since then, most notably {% ext "RecipeIngredients >> WritableComputedRef()" "https://codeberg.org/ttntm/recept0r/commit/7ab9d99d567d017d05df55025db093cfc21bb48b" %} which I took care of when preparing this article's demo repository. It's essentially based on what's been elaborated in detail for another article, [Vue's Computed Properties - The Most Important Feature?](/blog/vue-computed-properties-the-most-important-feature/), which I wrote earlier this year.

Anyway, the use case is pretty simple: we needed an editable list (i.e. ingredients required to prepare a meal) that should not only be convenient to use, but also offer sorting. Sorting based on pre-defined criteria and tiny buttons somewhere in the UI did not sound very appropriate, so I looked into drag and drop sorting and immediately liked how it felt elsewhere.

Here's a screenshot of how it looks in the app:

<img src="/static/img/blog/recept0r-edit-recipe.png" class="img-fluid img-center" alt="Screenshot of recept0r.com">

Initial research into "building drag and drop from scratch" was soon deemed pointless (i.e. would take me too much time; feel free to call me lazy) when I remembered {% ext "SortableJS' vuedraggable" "https://github.com/SortableJS/vue.draggable.next" %} which I ended up using to implement this feature.

## Getting Started

Let's dig in - here are 2 links to get things started:

1. The demo's GitHub repo: {% ext "ttntm/vue-dnd-demo" "https://github.com/ttntm/vue-dnd-demo" %}
2. A live sandbox: {% ext "stackblitz.com/github/ttntm/vue-dnd-demo?file=src/App.vue" "https://stackblitz.com/github/ttntm/vue-dnd-demo?file=src/App.vue" %}

The setup is pretty straightforward: a parent component (`App.vue`) is passing the list down to a child component (`DndList.vue`) that takes care of editing and sorting it. The child emits events (`update:list`, see `defineEmits` in line 10) up to the parent whenever the list and/or the list items change.

I'm using a `WritableComputedRef()` (`listItems`, line 19) to leverage Vue's powerful computed getters/setters in my code as well as making them usable for the `draggable` component's `v-model`:

```js
const listItems: WritableComputedRef<SortableEl[]> = computed({
  get(): SortableEl[] {
    return objectify(props.input)
  },
  set(newVal: SortableEl[]): void {
    emit('update:list', valuefy(newVal))
  }
})
```

- `get()` is processing the incoming list (`props.input`) and passes it through the function `objectify()` (line 37) which makes sure that the incoming `string[]` gets converted to `SortableEl[]` required by vuedraggable.
- `set()` emits the `update:list` event after converting `SortableEl[]` back to `string[]` through the function `valuefy()` (line 43) which is then caught by the parent component.

## Focus Management

Autofocus of the next list item's input right after adding it through button use or pressing enter in the previous item's input is a necessary feature too. The implementation is based on the `ref()` `inputs` (line 29) and so-called "Function Refs" ({% ext "Vue docs" "https://vuejs.org/guide/essentials/template-refs.html#function-refs" %}, essentially "`ref` within `v-for`") managed for `<input>` elements from within the `draggable` component's `template` (from line 91 onward):

```js
<template #item="{ element, index }">
  <li :class="{ 'grabbing' : drag }" class="flex flex-row items-center border border-transparent px-1 py-2 mb-1">
    <span :class="{ 'text-gray-900' : drag }" class="handle mr-2" title="Move element">
      <GripVertical />
    </span>
    <input type="text"
      v-model.trim="element.name"
      :placeholder="`Ingredient ${index + 1}`"
      :ref="el => { if (el) inputs[index] = el }"
      class="inline-block form-control text-sm"
      @input="events.onChangeItem"
      @keydown.enter="events.onAddItem(index)"
    >
    <ButtonX size="20" class="rounded-full text-gray-700 hover:text-gray-900 focus:text-gray-900 ml-2" @click="events.onRemoveItem(index)" />
  </li>
</template>
```

What's important here is line 99: `:ref="el => { if (el) inputs[index] = el }"`

This is the backbone of focus management from inside `events.onAddItem()` (line 46):

```js
async onAddItem(index?: number) {
  let currentEl = null
  let inputEls = inputs.value
  let listEls = [...listItems.value]

  if (index !== undefined && index > -1) {
    listEls.splice(index + 1, 0, { id: index+1, name: '' })
    listItems.value = listEls
    await nextTick()
    currentEl = inputEls[index+1]
  } else {
    listItems.value = listEls.concat({ id: listEls.length, name: '' })
    await nextTick()
    currentEl = inputEls[inputEls.length-1]
  }

  if (currentEl) currentEl.focus()
}
```

We still have to make sure to use `await nextTick()`, but we're able to access specific `<input>` elements which allows focusing the next and/or most recently added list item programmatically (see line 62). As such, using the "Add List Item" button will always focus the added (last) item and using the enter key will automatically focus the item at `currentIndex+1` no matter which list item input is being used.

## Everything Else

Everything not mentioned specifically is pretty much "just" implementing vuedraggable - there's the `drag` flag in line 18, `dragOptions` in line 31 and the whole `draggable` component's setup starting from line 78. Their {% ext "documentation at GitHub" "https://github.com/SortableJS/vue.draggable.next" %} was very helpful and I can only recommend it if/when you end up using it in one of your projects.

I hope this article and the demo can provide some insight when working with simple editable lists and maybe offer some motivation to try drag and drop for convenient sorting. Feel free to fork the demo repository and play around with it. As always, feedback is encouraged and much appreciated.
