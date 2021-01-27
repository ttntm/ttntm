---
title: Lessons Learned Building WATCH3R
slug: lessons-learned-building-watch3r
weight: -20
type: blog
date: 2020-12-18
description: Some thoughts on what I learned building WATCH3R.
tags:
    - Vue.js
    - FaunaDB
    - Serverless
    - Netlify
    - learning
    - watch3r
images:
    - /img/blog/watch3r.jpg
---

When Vue 3 was released in September, I started brainstorming for something new and useful I could build with it - in my opinion, real life use cases are often the best approach for getting acquainted with shiny new toys.

Around the same time, me and my wife accidentally re-watched a movie we'd already seen 2 or 3 years ago. Based on its title and the 5 word Netflix summary, we couldn't quite remember that we'd already seen it. Not too bad an accident though, because that's basically where the idea for building a movie watchlist and journal app came from.

I formally announced the project on this site some weeks ago (see: [Introducing: WATCH3R](/blog/watch3r-movie-watchlist-journal-app)), but didn't really go into the details there. This article will take care of that, providing a collection of things I learned building and working on that application.

## Application Architecture

Much like the recipes app I built earlier this year, WATCH3R follows a similar client-serverless pattern. Vue takes care of all front end matters and a bunch of serverless functions act as a lightweight back end.

User accounts and user authentication are handled by Netlify Identity, which I consider exceptionally convenient for a small project like this - even more so, when it comes to user metadata (like preferences or user IDs) - more on that below.

Based on my exceptionally positive experience with Fauna DB so far, I stuck with their service for data storage. It's reliable, fast and also offers great scaling options to handle future needs if and when necessary.

Last but not least important, WATCH3R makes use of 2 different (free) APIs that are queried for necessary title data, poster images, ratings and recommendations.

### Handling Application State

Even though it might be overkill for such a small application, I'm using Vuex as centralized state management. Vue 3 and it's Composition API offer a lot of possibilities to handle global application state (see {{< link-ext "this article" "dev.to/blacksonic/you-might-not-need-vuex-with-vue-3-52e4" >}} for example), but I got quite used to the way Vuex handles things when building recept0r, which made this a somewhat biased decision.

I'll talk about it some more later on, but I believe I've managed to use it quite well this time around. That means using Vuex to provide a true separation of concerns and making sure that individual views and components *do not* directly interact with global application state without having to go through Vuex actions.

## Lessons Learned

Getting into the details now, I'd like to mention that WATCH3R is not just free, it's also {{< link-ext "open source" "github.com/ttntm/watch3r" >}}. Having said that, it might be interesting to have a look at the source code while reading the rest of this article - I'll also link to the respective code where appropriate.

Aside from that, you're more than welcome to have a look at the live application at {{< link-ext "watch3r.app" "watch3r.app" >}}.

### Composition API is a Game Changer

I didn't use Vue 2 for a very long time - I've only built 2 or 3 demo applications and 2 real applications with it, so I wouldn't call myself an expert on that matter at all. However, I immediately noticed how much cleaner using the Composition API and its `setup()` function felt. You import what you need and `return{}` what's necessary. Inside of `setup()`, things are allowed to follow the flow you deem appropriate and that makes them feel a lot less convoluted than they felt using `data()`, `methods()`, etc. in Vue 2.

This {{< link-ext "list view" "github.com/ttntm/watch3r/blob/master/src/views/List.vue" >}} could be considered WATCH3R's "heart". It's pretty easy to understand what it does, even though it's complex in its functionality (providing both the watchlist and the journal view) and also pieces together a ton of other components.

Getting to the state of things you can see in the linked code took a while though. At first, I had separate components for each list mode (one for the watchlist, one for the journal) but that felt like an anti-pattern quickly. The "key" to making a shared list view component work properly though, was adding a `:key` property to the router view in order for Vue to completely re-render the shared component when navigating between list views. There was also a lot of logic concerning the modals in the component which I eventually extracted and put into Vuex (more on that below).

As you can see it now, it's immediately evident that there are dependencies to both `route` and `store` in this view - none of this is hidden behind abstractions (i.e. what `mapGetters` etc. used to do) and looking at the `return{}` statement, it's also quite obvious which data and/or functions are relevant for the view and which ones are "just" used internally in `setup()` (i.e. `getListData()`).

What I mentioned here is nice for sure, but it's still mostly component internals and formatting sugar. When it comes to reusable code though, Vue's Composition API is quite capable of some more.

Take {{< link-ext "this modal" "github.com/ttntm/watch3r/blob/master/src/components/list/ListAddModal.vue" >}} for example: it takes care of querying a serverless function and it also displays the resulting data. Which function it queries depends on the context though - searching for a specific title (`doSearch()`) or processing recommendations (`processRecommendation()`). Both cases result in a `searchResult` and a `searchStatus` which are then used to display the data. In order to keep the component clean (and independent of the API calls), the code that populates those 2 pieces of reactive state was extracted into a Vue 3 composable (see {{< link-ext "get-omdb.js" "github.com/ttntm/watch3r/blob/master/src/helpers/get-omdb.js" >}}).

There's tons of other things you can do with this composable pattern (i.e. the "build your own Vuex" article linked above) and I would probably have used it more if I hadn't committed to Vuex in the first place.

### Vue Hooks

If you've ever used Vue 2, you've probably come across Vue hooks like `onCreated()` that were used to execute functions (i.e. load data) at a certain point in Vue's {{< link-ext "instance lifecycle" "vuejs.org/v2/guide/instance.html#Lifecycle-Diagram" >}} (the linked diagram refers to Vue 2).

Using Vue 3 with the Composition API, `setup()` takes care of most of that already - any code that would have been placed in `onCreated()` gets put in there, executed and ends up working the same way.

Working with other hooks like `onMounted()` or `onUpdated()` is possible from inside of `setup()` (see: {{< link-ext "Vue 3 docs" "v3.vuejs.org/guide/composition-api-introduction.html#lifecycle-hook-registration-inside-setup" >}}) and can be very useful sometimes (i.e. [handling page refresh](/til/#10)). Other times though, it can end up causing you a massive headache...

A quick briefing on what I tried to achieve: new items added to a list should trigger a sorting function. Users are able to set their own sorting preference which means that adding and removing list items might require re-sorting the respective list.

At first, that seemed like a perfect use case for an `onBeforeUpdate()` or `onUpdated()` hook (see: {{< link-ext "Vue 3 docs" "v3.vuejs.org/guide/composition-api-lifecycle-hooks.html#lifecycle-hooks" >}} for details). It worked well and I didn't really think about it anymore until I noticed that there was a crazy amount of CPU activity whenever I used more than one tab (possible thanks to {{< link-ext "vuex-multi-tab-state" "github.com/gabrielmbmb/vuex-multi-tab-state" >}}). I immediately suspected that there was something going on with that Vuex module and even opened an {{< link-ext "issue" "github.com/gabrielmbmb/vuex-multi-tab-state/issues/23" >}} regarding my observations (CPU load, crippled browser)...

Long story short: thanks to in-browser debugging tools (like "stop on caught exceptions"), I was eventually able to understand what's happening. With multi-tab shared state and more than one tab open, a change of the respective list would trigger an infinite sorting loop - tab 1 being updated, `onUpdated()` calling the sorting function, tab 2 interpreting that as an update, calling the sorting function and so on.

I didn't really feel too good about this whole mess and it took me way too long to find and understand it. In the end, the solution was really simple though - removing the Vue hook from the list component and calling the sorting function right after getting the list data {{< link-ext "in the respective Vuex action" "github.com/ttntm/watch3r/blob/master/src/store/modules/list.js#L136" >}} instead.

Sometimes it seems like getting simple things (a list...) right should not be underestimated. Despite the fact that this infinite sorting loop cost me a day, I do think that I was able to improve my application and gain some valuable experience (esp. in-browser debugging tools) - both reasons this topic has found its way into this collection of lessons learned.

### Vuex is your Friend

When I started working on WATCH3R, I already had a basic understanding of working with Vuex based on a previous Vue 2 application. In terms of how things work, Vue 3 and Vuex 4 don't really change too much, so I got my store set up rather quickly.

Compared to working with Vuex in Vue 2 and frequently using things like `mapActions` and `mapGetters`, the way things are done using Vue 3 and its Composition API provide a lot more transparency. That's in line with {{< link-ext "this excellent article" "medium.com/@stephane.souron/making-a-large-scale-app-with-vue-js-part-1-modularize-your-store-bf9066436502" >}}, especially the section called "Avoid helper calls to the store" - something I'd now consider a better practice due to the clarity it provides.

Let me give you some details on that: working with Vuex inside of `setup()` requires something like `const store = useStore()`. As a result, every interaction with your Vuex store (like `store.dispatch('module/actionName')`) is immediately obvious, instead of being hidden behind obscured helper calls that can easily be confused with in-component methods and imported function calls. It may not seem like a real "wow effect", might even be obvious for many out there, but for me, it made writing and debugging my own code much easier.

Another Vuex win I'd like to point out here is related to modals. The way I used to implement them frequently resulted in a parent-child dependency, meaning that the respective modal's parent component (i.e. `App.vue` for a global application menu) was made responsible for toggling the modal's display. That's certainly fine if your application has one or 2 modals, but it becomes quite messy when there are 5 or more, resulting in modal related code being spread all over your application.

I already had all of this toggle modal code in Vuex due to the need of auto-closing open modals when navigating to another route and/or opening another modal. Having written this code step by step though, there was a separate action and separate state for each modal, resulting in a severe violation of the DRY pattern.

Once I noticed the mess I'd made, I came up with something like an ENUM - a {{< link-ext "piece of numerical state" "github.com/ttntm/watch3r/blob/master/src/store/modules/app.js#L22" >}} that would control which modal's currently being shown. I knew that this would work well because my application wasn't supposed to be showing more than one modal at the same time anyway. It's an approach that worked well for me, leaving me with only one global `action`, `getter` and `mutation` to handle all my app's modals. The code's also flexible enough to deal with any amount of further modals added in the future.

### Netlify Identity Provides Convenience

The first time I used {{< link-ext "Netlify Identity" "docs.netlify.com/visitor-access/identity" >}} was when I built recept0r earlier this year. It's a really cool service that's [free for up to a 1000 active users](https://www.netlify.com/pricing/#add-ons-identity) per month, so if you're already using Netlify for deployment/hosting, there's hardly a good reason to ignore it.

In its current state, WATCH3R isn't just using the service for user authentication - it's also storing the {{< link-ext "user preferences" "github.com/ttntm/watch3r/blob/master/src/store/modules/user.js#L10" >}} set by the app's users themselves. When a user logs in, the application receives a user object and updates the preferences in the Vuex store accordingly. I consider this extremely convenient as it results in all user related information coming from a single source.

Another convenience feature that Netlify Identity provides is user ids. I wasn't aware of that when using it the first time, but I wouldn't want to miss it anymore. It makes really easy to store and work with user specific content in your database without having to deal with this matter in your own code.

### APIs and Serverless Work Well Together

When dealing with APIs, related secrets and tokens, security should certainly be a major concern. Fortunately, going for a serverless back end provides an ideal opportunity of both working with the necessary API requests and keeping them safe at the same time, essentially separating the respective logic and all related secrets/tokens from the front end code running in the browser. If you've ever worked with serverless functions, that shouldn't be too much of a surprise though.

I've included this section for to a slightly different reason - interoperability between different APIs. Initially, I implemented WATCH3R based on the free {{< link-ext "OMDb API" "www.omdbapi.com" >}} which can be queried for all the data I wanted to have available in the application. I also made use of {{< link-ext "TMDb's API" "www.themoviedb.org/documentation/api" >}} when I added recommendations to the application, meaning that I now had to deal with 2 different APIs providing different data. After thinking about it for a bit, I tried {{< link-ext "a single serverless function" "github.com/ttntm/watch3r/blob/master/functions/tmdb-omdb-get.js" >}} that first queries API 1 to get an id that it then uses to query API 2 in order to get the final response data. It worked well and was surprisingly fast too, so I'll definitely keep that in mind for the future.

## Conclusion

Getting started with Vue 3 was a really good experience for me and I found everything was either working as it should already or at least well documented; {{< link-ext "except for one little bug I found" "github.com/vuejs/vue-next/issues/2325" >}}. I definitely prefer working with the Composition API to how things were done in Vue 2, just my personal preference though. Using the same stack I already used for another app this year certainly made things easier too, but it's hard to ignore the power and convenience it provides.

WATCH3R's already got the first bunch of users and will be actively maintained and improved for the foreseeable future. So, if you're interested to give it a shot, just head over to {{< link-ext "watch3r.app/invite" "watch3r.app/invite" >}} and try it yourself.
