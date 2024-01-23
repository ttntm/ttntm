---
title: Vue's Computed Properties - The Most Important Feature?
slug: vue-computed-properties-the-most-important-feature
type: blog
date: 2022-01-25
description: A quick example of Vue's computed properties which might be the framework's most important feature.
tags:
  - opinion
  - vue
image: /img/blog/code.jpg
---

Coincidences sometimes happen, and last night was one such occasion. I was casually checking my inbox and read Michael Thiessen's newsletter, one of my favorites when it comes to Vue. This particular issue dealt with Vue's "most important feature", computed properties - a statement that I tend to agree with and also one that made me write better code when working on version 2 of {% ext "aitrack.work" "https://aitrack.work" %}, my FOSS time tracking companion app.

I was implementing drag and drop sorting for the tasks the app uses to track time and I chose {% ext "vue.draggable.next" "https://github.com/SortableJS/vue.draggable.next" %} for that based on a positive experience I had using it for another project. Getting it to work as intended wasn't too much trouble, but the resulting code felt a little off somehow. Best to have a look yourself though:

```js
<script setup>
  import { ref, watch } from 'vue'
  
  const localList = ref([])
  
  // ...  

  watch(tasklist, () => localList.value = tasklist.value)

  const events = {
    onDragChange() {
      const ordered = (arr) => arr.map((el, index) => {
        el.order = index
        return el
      })

      setState('tasklist', ordered(localList.value), false)
    },

	// ...
  }

  localList.value = tasklist.value
</script>
```

As you can see, there are 3 different parts of code that all take care of setting/updating the `localList` `ref()` that's used by the drag and drop component. It's based on an array called `tasklist` that's obtained (read-only) from the app's centralized (composition API) store. That works, but it's prone to errors when making further changes due to the code being spread all over the place. I'm talking about the {% ext "'TaskList' component" "https://codeberg.org/ttntm/itrack/src/branch/main/src/components/TaskList.vue" %} here and that's basically the centerpiece of the whole application. As such, changes are very likely to occur in the future and the code should be kept as clean and maintainable as possible - one more reason the code shown above felt a little off to me.

Anyway, I left it like that for the day until I read the newsletter mentioned earlier. That got me thinking about the code again and I remembered Vue's {% ext "'Computed Setters'" "https://v3.vuejs.org/guide/computed.html#computed-setter" %} - something that wasn't even mentioned in the newsletter, but also something I'd occasionally used in the past. With that in mind, the new drag and drop feature was quickly up for refactoring, even before it ever made it to production...

Eventually, this is what I ended up with:

```js
<script setup>
  import { computed } from 'vue'
  
  const localList = computed({
    get: () => [...tasklist.value],
    set: (val) => {      
      const ordered = (arr) => arr.map((el, index) => {
        el.order = index
        return el
      })

      setState('tasklist', ordered(val), false)
    }
  })
  
  // ...
</script>
```

Now there's a single `computed()` call that defines everything that should happen to `localList` which itself is referenced once in the drag and drop component's `v-model` directive. Messing up the code is definitely less likely this way and we're also making better use of Vue's internals, i.e. {% ext "'Computed Caching'" "https://v3.vuejs.org/guide/computed.html#computed-caching-vs-methods" %} instead of manually taking care of setting and updating the component's state with `watch()` when that's not really necessary. On top of that, it's less code that's also much easier to understand compared to the initial version without using `computed()`.

I'll end this with the quote from Michael's newsletter that I shamelessly paraphrased into this little article's title:

> Computed properties are the most important feature of Vue.
> <small>Michael Thiessen</small>

And please don't get me wrong: I'm not trying to promote someone else and/or their newsletter here, but I think it's a really helpful resource for people working with Vue, even just to get you to remember about things you might not have considered initially (i.e. computed setters in my case).
