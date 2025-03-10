---
title: "Website Evolution: Q1 2024"
slug: website-evolution-q1-2024
date: 2024-04-12T10:30:00Z
description: A summary of updates and enhancements in Q1 2024, also the first post in the "Website Evolution" series.
tags:
  - evolution
  - series
  - website
image: /img/blog/website-evolution-q1-24.jpg
toot: https://fosstodon.org/@ttntm/112257686809705858
---

2024 has been a very productive year so far. I'd planned to write more, and I feel like that's going quite well at the moment. I've also managed to launch [a new side project](/blog/bukmark-club-intro/) in February, and shipped a ton of updates and enhancements for this website.

Some of these updates were announced in [previous blog posts](/tags/website/), others evolved into longer deep dive articles. However, I've added, changed and updated many more things recently, which lead to the idea of a new "Website Evolution" series taking shape. Right now, you're reading the first post in this new series, and I'm planning to add more posts to it occasionally.

A quick remark before we get started: this post will try to add context to the changes, updates and enhancements. An uncommented chronology of changes can always be found in the [Changelog](/changelog/). This post covers versions [3.6](/changelog/#3-6) to [3.13](/changelog/#3-13).

## Content and Pages

This section provides an overview of content and pages with details on what was added, changed and/or (re)moved.

### Appendix

URL: [/appendix](/appendix/)

I wanted to split "about me" and "about this website" for a while, because the combined page felt a little too long and the hierarchy of the headings didn't really make sense anymore.

This "Appendix" is what I ended up with.

It's a new page, with an URL inspired by {% ext "Katherine's website", "https://kayserifserif.place/appendix/" %}, that contains the "About this Website" section and also a completely new section dedicated to "Intentions and To-Dos" regarding this website.

### Bookmarks

URL: [/bookmarks](/bookmarks/)

This is my personal collection of bookmarks that I like to think of as some kind of _treasure map_. I wanted to add such a personal directory to my website since finishing "Halt and Catch Fire" in late November '23, and I'm very happy with the result.

The initial version of the page used Markdown files in a dedicated collection, which I described in the post [Update: Bookmarks Are Back](/blog/bookmarks-are-back/). But in the meantime, I've moved the collection into a JSON data file, which makes maintaining it a little easier.

### Ideas

URL: [/ideas](/ideas/)

I came across {% ext "aboutideasnow.com", "https://aboutideasnow.com" %} not long ago, looked at some other people's websites, liked a lot of what I saw and decided to add an /ideas page to my own website. It's a nice idea to share ideas publicly, and I also like that it helps keep /now clean in terms of "doing something now" vs. "thinking about something" in general.

### Reading

URL: [/reading](/reading/)

Adding a public reading list to my website was something I wanted to do for a really long time, it must've been on my list of website to-dos for at least 2 years.

Good that I procrastinated for so long though: discovering Omnivore earlier this year almost made this too easy. I'm really satisfied with the result and I had a lot of fun building this integration. So much actually, that the [article describing the integration](/blog/creating-a-reading-list-with-eleventy-and-omnivore/) almost wrote itself.

### Sitemap

URL: [/sitemap](/sitemap/)

Remember the old days, when websites offered sitemaps for humans instead of just providing invisible XML ones for search engines?

I missed that and decided to add one to this website. It's flat and simple, but it should provide a sufficient overview of all the pages this website consists of. Also, using Eleventy's `collections.all` iterable made it super easy to build this sitemap. So, there's really no reason not to have one.

### Whisky

URL: [/whisky](/whisky/)

This one's a rather personal one: I finally gave my "Scotch Log" a home on this website. So far, I tracked my whisky drinking in a Notion table, which worked well enough, but didn't feel quite right. Putting it out there publicly, as a part of this personal website, feels much more satisfying already.

Building the page was fun too: I'm using a regular Eleventy collection that consists of Markdown files for each whisky bottle. The page template renders each collection item as a `details/summary` element and also includes some region-based filters. These filters are rendered by a shortcode, `customFilter`, that works as described in [notes#33](/notes/#33).

I really like the resulting "list+" UI that the `details/summary` element offers, and I'm already looking forward to maintaining this page long term.

### Work

URL: [/work](/work/)

This page was overdue for an update - I don't think I was ever really satisfied with how it looked like and how the information was presented there. But all of that's changed now, and I quite like the result.

I got rid of the card-based layout and made the page a proper list with different sections. I've also added a _lot_ more content to the list, so there are no more "read more on another website..." links that used to be there, and I've also included links to articles that I wrote about specific projects. Project listings also include links to both the source code and the project's demo site (wherever applicable) now, instead of just one of them.

## Features and Functionality

Mostly additional features, some of them enhancing this website's functionality in hopes of providing better user experience.

### Activity Timeline

I always liked the way most GIT-based SCM systems offer a visual timeline of a user's commit activity. A little while ago, I got the idea of providing such an activity timeline scoped to this website's changes along with the [Changelog](/changelog/).

After a bit of research, I discovered the {% ext "Eleventy Post Graph", "https://postgraph.rknight.me" %} plugin, that offers exactly what I was looking for. By default, it works a little different than what I had in mind: it processes Eleventy's content (collections) and doesn't consider the `git log` of the underlying repository.

I wanted to have some a kind of "visualized changelog", so that wasn't enough. However, there's also the option to use the plugin with custom data, so I went looking for a way to convert `git log` output to JSON, which I could then use in a data file rather easily.

Eventually, I found an article about {% reply "easily converting git log output to JSON", "https://blog.kellybrazil.com/2022/05/17/easily-convert-git-log-output-to-json/" %} and got to work. The `git log` JSON output gets processed by a small Node.js script that does a lot of date stuff (extraction, formatting) and eventually makes use of `reduce()` to build an object as expected by the postgraph plugin requires it.

A solution that works nicely and produces the [desired result](/changelog/#timeline). However, I encountered a little UI issue that I eventually found a CSS-based workaround for: {% ext "Strange Behaviour: Extra HTML Tags", "https://github.com/rknightuk/eleventy-plugin-post-graph/issues/9" %}

### Dark Mode

Functionality that was overdue for a _long_ time.

Initially, I stuck with this website's long-lasting no-JS approach and implemented theming purely based on a media query. However, some feedback I received from readers/users changed my mind, and I added a button to switch between themes.

The code currently uses auto-detection based on a media query (`window.matchMedia()`) and persists the user's choice in `localStorage`. There's also a `<noscript>` fallback that removes the theme switch button from the UI, making theme selection use `prefers-color-scheme` only. I don't know how common it is to do that, which would be rather interesting actually, but displaying a non-functional button for `<noscript>` users on an otherwise completely functional website just felt wrong.

### Feeds

This website has offered a feed of articles and blog posts since 2019. However, my [Likes](/likes/) and [Notes](/notes/) collections did not offer a feed, despite the fact that they're also collections of content that are updated regularly.

Feeds for both collections were added, together with matching icons in the respective headings, and a [Feeds](/feeds/) page that lists all the available feeds.

### Old Content Note

I don't really know how to call this feature, or if there even is a proper name for it, so I ended up with this weird heading.

It's essentially just the name of a shortcode, `oldContentNote`, that checks each post's publication date and displays a note if a post is older than 2 years. The resulting note clearly states that the following content is a little older, and that "circumstances may have changes since publication".

### Tags

Sometime, we mess with things, only to realize that they were fine in the first place. And that's pretty much what happened to blog post tags on this website. I talked about this functionality in a previous post, [Update: Tags Are Back](/blog/restoring-tags/), that also provides some details explaining how to handle tags in Eleventy.

My current guidelines for using tags on this website are:

- Tags are used for blog posts only
- Tags should be limited to one word
- Min. 1 / max. 3 tags per post

A list of all tags can be found here: [Tags](/tags/)

## Look and Feel

The only major change in terms of my website's UI is the redesigned homepage layout. I retired the centered 1-column layout and created a 2-column grid. There's a new "Collections & Pages" section, and I also added links to the sitemap and all the available RSS feeds. The intro and the most recent posts were already there in the past, so they only moved to different spots in the new layout.

Other than that, these are the minor style changes:

- Added a background texture and a gradient on top of it to achieve a slight "noisy vignette" effect
- Revised blockquotes and code blocks
    - Both have a slight left/right margin when viewed on larger screens
    - Blockquotes are displayed with quotation marks in `::before` now
- A bit of added whimsy
    - Found some cool GIFs of a white Persian cat and added that to some pages
- Reduced `letter-spacing` for headings and links
    - Felt a little too much, looks better now

## Setup and Other Technical Stuff

Changes of how the source code is organized:

- Added folders to collection root folders to organize them based on years
- Added a `pages` folder to keep content pages and templates in one place
- Added `humans.txt`
- Extended and updated `robots.txt` (see: {% ext "tkb/user-agents", "https://kb.ttntm.me/development/webdev/user-agents.html" %})
- Updated the Eleventy config: `html-min` now runs for productive builds only

## Closing Thoughts

Thanks for reading this post! I felt that this period of high activity might be worth remembering, and I'm already curious to see this new series grow over time.
