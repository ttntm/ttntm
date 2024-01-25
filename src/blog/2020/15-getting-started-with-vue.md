---
title: "Getting Started with Vue.js in 2020"
slug: vuejs-getting-started-in-2020
type: blog
date: 2020-07-04
description: "Lessons learned when building my first apps with Vue.js in 2020; not a typical Vue.js tutorial."
tags:
  - guide
  - learning
  - vue
image: /img/blog/vuejs.jpg
---

This article is about {% ext "Vue.js", "https://vuejs.org" %}, but it is not going to be a Vue.js tutorial. There's enough good ones out there and I don't think I'll be able to compete with them. Instead, this is going to be a summary of my personal lessons learned when picking up Vue.js and starting to build something useful with it.

Now, what might be something useful? No offense to the ones advocating its teaching effect, but probably not the 10000st todo list app. After a bit of deliberation, I decided to go for a **recipes app** intended for real world use, i.e. collecting all the magazine clippings and grandma's notes in one place and making sure that it's also available as a PWA while standing in the kitchen and actually cooking.

**TL;DR** - I built a Vue.js based recipes app without ever having touched Vue before; you're going to read about the process of doing that (incl. all the helpful resources I came across!), the obstacles that came up and how I overcame them here.

The app can be found over at {% ext "recept0r.com", "https://recept0r.com" %}.

## Preface

My motivation for writing this article is to share my experience with others and to make their journey into Vue a little more convenient. As such, the following article represents a somewhat chronological (thought) process. There's no affiliation to any of the linked resources and I don't stand to gain anything from recommending or even mentioning them.

Please note that this article is based on Vue.js 2.9.6 / June 2020.

### 1. Initial Research and Decision Making

The decision for Vue.js was easy; some good reasons can be found here: {% ext "michaelnthiessen.com/underdog-framework", "https://michaelnthiessen.com/underdog-framework" %}

Other than that, there's always a long list of "technologies I'd like to work with"; for this project, I ended up going for {% ext "serverless functions", "https://functions.netlify.com" %} (Netlify) and {% ext "Fauna", "https://fauna.com" %} as the app's data store. Both seemed powerful (and free) enough to build a multiuser CRUD app on top of while offering good documentation and development experience.

Most other decisions for (and against) modules/libraries/etc. happened along the way and we'll get to that; the whole list of dependencies can be found in recept0r's `package.json` at {% ext "Codeberg", "https://codeberg.org/ttntm/recept0r/src/branch/main/package.json" %} though, just in case you're curious already.

### 2. Learning by Doing

I had heard of Vue.js before and I knew I wanted to use it for this project. I hadn't actually *used* it before though, so I thought it would be a good idea to start with some sort of tutorial to get my head around the basics before going for my actual project.

After a bit of research, I came across this one here: {% ext "taniarascia.com/getting-started-with-vue", "https://www.taniarascia.com/getting-started-with-vue" %}

This tutorial provided a very good "code along" kind of introduction from basic project setup (Vue CLI) to accessing external APIs - I stopped before the API part though, as I felt comfortable enough already, eager to dive into my own project. Overall a decent and well written tutorial.

There were one or two things in the tutorial app that needed a bit of tinkering/thinking for yourself to make it work as intended, nothing serious though if you're into JavaScript far enough to be dealing with Vue.

### 3. Start Small

Building on top of what I had learned in both the tutorial mentioned above and the (inevitable) trial and error cycles, I set out to build a first prototype of what would later become *recept0r*.

I decided to limit myself to the essential CRUD functionality only using local data at first, meaning I consciously decided in favor of later refactoring, which in turn lead to the benefit of first architecting/understanding my own app and going for the (serverless) backend and database after that.

What do I mean with "local data"? Instead of querying an API/database, the Vue app will be initialized with an array of predefined data, recipes in my case:

```js
// App.vue
data()
  return {
    recipes: [
      {
        id: 001,
        title: "First Recipe",
        ingredients: [
          "one",
          "two",
          "three"
        ],
        body: "Preliminary recipe body text..."
      },
      {...},
      {...}
      // more recipe objects if needed
    ]
  }
```

This array of recipes (objects) provided enough flexibility to develop the necessary components (incl. styling) and their methods (the core CRUD functionality) before ever having to deal with the more delicate matters like user authentication, database queries and serverless functions.

*This step is entirely optional of course*; not needed at all if you're already comfortable with the necessary backend functionality or have done it before. As this was my first time doing anything like this (and there was no limit in terms of time/budget), I opted for this slower approach.

### 4. RTFM

We've all been there - after some time spent looking up a solution to what seemed like a trivial task, the answer presents itself in the form of the official documentation for the respective tool/module/library/etc.

So, this isn't necessarily a "lesson learned", maybe more of a reminder to actually go and *read the manual*.

One such case was {% ext "vue-router", "https://router.vuejs.org" %}, an essential building block in any vue application that has more than a single route the user can navigate to. It took me a while to set it up the way I had intended, including the so-called *Navigation Guards* as well as *Programmatic Navigation*.

You'll notice an issue with routing immediately when your app keeps acting as if there was a page refresh (i.e. resetting your local data) after clicking on a simple link. In my case, I had all the links in my navigation defined as regular `<a href="...">` elements when I should actually have used `<router-link :to="...">` instead.

Another such case was **configuring Webpack**. Things work differently when using {% ext "Vue CLI", "https://cli.vuejs.org" %} - Webpack needs to be configured inside of `vue.config.js` and sooner or later you'll have to deal with it (i.e. {% ext "PWA", "https://cli.vuejs.org/core-plugins/pwa.html" %}, code splitting). It would have saved me quite some time and some install/uninstall procedures if I had read and understood that in the first place. Don't make the same mistake and read up on what Vue CLI does and how you can configure it to do what you want it to do.

### 5. Make Your Tools Work for You

I had some issues when it came to setting up **Netlify functions** to run locally; research I based my choice of node modules and configuration on seemingly outdated information and my functions returned errors instead of data...

Eventually, I stumbled upon this article recommending `netlify-cli`: {% ext "Solve CORS once and for all with Netlify Dev", "https://alligator.io/nodejs/solve-cors-once-and-for-all-netlify-dev" %}

If you're going the Netlify route, this is as good as it gets basically - simple configuration and immediate success. Just memorize `localhost:8888`, as you terminal output will still direct you to 8080 instead where none of the success is visible.

Another case that belongs in this category was **toast messages**. Yes, there are a lot (!) of modules out there that can handle every imaginable notification use case including respective customization. I won't recommend any of them, because I didn't use any - I opted against adding yet another dependency to my app just for the sake of an occasional notification and decided to build it from scratch.

I came across {% ext "this article", "https://laravel-news.com/building-a-flash-message-component-with-vue-js-and-tailwind-css" %} that quickly provided a working solution that was rather easy to follow without adding any more dependencies to my app.

### 6. Refactoring is Good, Keep Doing it

I started building *recept0r* based on Bootstrap. I don't know why exactly, it just happened - probably 70% of why Bootstrap is used, haha. This added jQuery and some more JS bloat which adds nothing to a Vue app. It made the app look decent from the start though and especially forms/inputs and their flavor of `normalize.css` were convenient.

It all ended up becoming unnecessarily heavy and I found myself working around it too much (overwriting CDN CSS in components). I then discovered that there is {% ext "BootstrapVue", "https://bootstrap-vue.org" %}, a seemingly convenient way to make better use of Bootstrap together with Vue. I didn't go for that after some deliberation, but instead spent my time on switching to {% ext "TailwindCSS", "https://tailwindcss.com" %}.

I've used TaiwlindCSS for 5 or more projects in the last 2 years, so this ended up making me faster and more flexible than I could ever have imagined. Using Tailwind with Vue is surprisingly easy in 2020, you can read all about it in [another blog post I wrote about that](/blog/tailwind-css-with-vuejs/).

Remember the **toast notifications** mentioned earlier? I ended up refactoring them eventually...

The *Event Bus* based approach linked above worked well and did its job, but my app was already using {% ext "vuex", "https://vuex.vuejs.org" %} for global state management anyway (mostly due to user authentication, but also for filtering and general global state mgt.). Following the principles of unified state management, it clearly made more sense to use vuex compared to having a separate Vue instance (named *Event Bus*) initialized just for the toast notifications.

### 7. The Devil is in the Detail

Between setting up FaunaDB and getting the `focus()` right on procedurally added `input` elements, what do you think took me more time?

Yes, `focus()`. To be honest though, I'm rather sure that the answer is *not* going to surprise anyone that has ever worked in software development. I guess this is not a real "lesson learned" then, sorry for that.

What was it all about, anyway? Recipes have ingredients and *recept0r* stores them as strings in an array. When creating a new recipe or editing an existing one, there's obviously the possibility of adding/removing ingredients. Adding them should work in two ways:

1. "Add ingredient" button -> adds an input below all others, essentially `ingredients.push('')`
2. "Enter" pressed inside an existing ingredient's input -> adds an input below *the respective* element and *before* the next one (or at the end, in case it is the last one): `ingredients.splice(index + 1, 0, '')`

The whole method looked like this then:

```js
addIngredient(index) {
  let ing = this.recipe.ingredients;
  if(index > -1) {
    ing.splice(index + 1, 0, '');
  } else {
    ing.push('');
  }
}
```

Simple, huh?

Now what was the issue with `focus()`? I already had a {% ext "global directive", "https://vuejs.org/v2/guide/custom-directive.html" %} in my app that applied focus this way:

```js
Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})
```

That didn't help with case #2 though; instead, it always applied focus to the last input in my ingredients list. I already knew about {% ext "$refs", "https://vuejs.org/v2/api/#ref" %}, but I couldn't get them to work the way I wanted after generating them for my inputs:

```html
<input type="text"
  class="inline-block form-control text-sm mb-4"
  v-model.trim="recipe.ingredients[index]"
  v-focus
  @keydown.enter="addIngredient(index)"
  :placeholder="`Ingredient ${index+1}`"
  :ref="`input${index}`"
>
```

After hours of trial and error and the emerging "tunnel vision", I took a break. After the break, I randomly found this {% ext "Stack Overflow question", "https://stackoverflow.com/questions/54306581/this-refsp-index-focus-is-not-a-function" %}. 5 minutes later I had it working, the only thing different to my own previous approach being the added `[0]`:

```js
addIngredient(index) {
  let ing = this.recipe.ingredients;
  if(index > -1) {
    ing.splice(index + 1, 0, '');
    this.$nextTick(function() {
      // focus the spliced element instead of the last one as per directive
      // somehow vue returns a 1 element array here
      // see -> https://stackoverflow.com/questions/54306581/this-refsp-index-focus-is-not-a-function
      this.$refs[`input${index + 1}`][0].focus();
    });
  } else {
    ing.push('');
  }
}
```

I would have been able to get to the bottom of this myself eventually, carefully reading each line of the errors in my console; that's not the point though - tunnel vision can cost you a lot of time. Take a step back, do something else for a while and look at your problem again later once you've gained some distance; no matter how you get to the solution, it's all better than staring at your screen, obsessing over it and getting stuck.

## Final Remarks

This list could go on for a while, in varying degrees of detail. I tried to pick the larger/more important bits that people researching their own problems might stumble upon. I'll probably also end up writing a second part at some point and/or update it, comments and feedback are much appreciated.

## Additional Resources / Further Reading

All of these articles were helpful to me in one way or another:

- {% ext "Notes on Vue", "https://notes-on-vue.netlify.app" %} (notes based on first-hand personal learning experience, recommended!)
- {% ext "vuejs.org/v2/guide/reactivity.html", "https://vuejs.org/v2/guide/reactivity.html" %} (must read; the basics of reactivity in vue)
- {% ext "itnext.io/anyway-heres-how-to-create-a-multiple-layout-system-with-vue-and-vue-router-b379baa91a05", "https://itnext.io/anyway-heres-how-to-create-a-multiple-layout-system-with-vue-and-vue-router-b379baa91a05" %} (re: vue-router)
- {% ext "netlify.com/blog/2018/07/09/building-serverless-crud-apps-with-netlify-functions-faunadb/", "https://www.netlify.com/blog/2018/07/09/building-serverless-crud-apps-with-netlify-functions-faunadb/" %} (esp. useful for the detailed explanations re: serverless functions)
- {% ext "dev.to/chiubaca/build-a-serverless-crud-app-using-vue-js-netlify-and-faunadb-5dno", "https://dev.to/chiubaca/build-a-serverless-crud-app-using-vue-js-netlify-and-faunadb-5dno" %} (must read; user authentication with Netlify Identity/GoTrueJS)
- {% ext "alligator.io/vuejs/vue-lazy-load-images/", "https://alligator.io/vuejs/vue-lazy-load-images/" %} (convenient and recommended)
- {% ext "medium.com/@stephane.souron/making-a-large-scale-app-with-vue-js-part-1-modularize-your-store-bf9066436502", "https://medium.com/@stephane.souron/making-a-large-scale-app-with-vue-js-part-1-modularize-your-store-bf9066436502" %} (very well written and useful for a better understanding of how to properly use vuex)
