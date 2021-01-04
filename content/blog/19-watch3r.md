---
title: 'Introducing: WATCH3R'
slug: watch3r-movie-watchlist-journal-app
weight: -19
type: blog
date: 2020-10-31
description: Introducing WATCH3R, a free, open source movie watchlist and journal app.
tags:
    - news
    - Serverless
    - watch3r
images:
    - /img/blog/watch3r.jpg
---

Nothing fancy, just a small announcement for an app I recently built.

<img src="/img/blog/watch3r.jpg" class="img-fluid img-center" alt="WATCH3R logo splash screen">

WATCH3R is a free service that provides basic information about movies and tv shows. It allows you to create a dedicated watchlist and journal to collect your thoughts after watching something.

Both lists are capable of search and sorting, making sure you don't lose track of your listed titles. WATCH3R also includes recommendations based on titles in your journal (via TMDb's API).

More infos and screenshots can be found here: {{< link-ext "About WATCH3R" "watch3r.app/about" >}}

Once again, it's a free app, so you're welcome to {{< link-ext "request an invite" "watch3r.app/invite" >}} anytime 😎

## Technical Details

On top of watching the same movie twice within 3 years, making use of Vue 3 was the main reason I started working on this application. I'll publish a separate article on my developer experience soon; for the time being, here's a quick summary of the technical details:

- Front end: Vue 3 + Tailwind CSS
- State mgt.: Vuex 4 beta + plugins
- Content API: OMDb (title data) + TMDb (recommendations)
- Back end: serverless Netlify functions
- Identity: Netlify (GoTrue)
- Database: Fauna DB

I decided to stick to the approach that already worked well for my [recipes app](/blog/serverless-recipes-app-faunadb-vuejs/) earlier this year. It's a really powerful stack and as of writing this, I feel quite confident using it - Vue 3 (and its Composition API in particular) is a huge step forward and an absolute pleasure to work with.