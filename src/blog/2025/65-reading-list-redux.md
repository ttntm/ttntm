---
title: Reading List Redux
slug: reading-list-redux
date: 2025-02-20T14:30:00Z
description: "Omnivore is dead, long live Raindrop.io! Or: my reading list 2.0."
tags:
  - news
  - serverless
  - website
image: /img/reading.png
toot: https://fosstodon.org/@ttntm/114036667958255221
---

Discovering Omnivore about a year ago felt like an instant win. A free, open source, read-it-later app that could also handle all my newsletter subscriptions and RSS feeds - absolutely marvelous!

Less than a year later, {% reply "Omnivore shut down", "https://www.theverge.com/2024/10/29/24283055/one-of-my-favorite-read-later-apps-is-shutting-down" %} because they were acquired by a "software company that specializes in developing natural-sounding speech synthesis software using deep learning", as their Wikipedia page states. Shit happens, as we all know too well, and that also meant that [my reading list](/reading/) had no more data left to show.

I found myself doing some research and evaluated some alternatives at the end of 2024, during the holidays. {% ext "Wallabag", "https://www.wallabag.it/en" %} was the first application I evaluated:

- Omnivore import worked
- SaaS available at reasonable cost (still don't want to self-host), and with a 14-day free trial
- Features sufficient (no newsletters/RSS though)
- API available
- Mobile app available

The mobile and web app both behaved a bit sluggish, and the UI felt a little dated. Don't get me wrong: functionality-wise, everything was fine, and I really don't want this to come across negatively - cool project, but it just didn't feel right _for me_.

So, I kept looking for other alternatives and discovered {% ext "Raindrop.io", "https://raindrop.io" %}:

- Omnivore import worked well
- SaaS with a generous free tier
- Features sufficient (no newsletters/RSS either)
- API available
- Mobile app available

Importing my data was a breeze (and faster than expected), after which I tinkered with "collections" to categorize and group my bookmarks. After about an hour, I had things at an acceptable working state, and I also felt familiar with the UI. Setting up the mobile app (Android) wasn't much effort either, good experience.

I'm not interested in additional browser extensions, so I ended up with a bookmarklet to save things:

```js
javascript:(()=>{var i,o;window.open((i=window.location,o=document.title,`https://app.raindrop.io/add?link=${i}&title=${o}`))})();
```

After a couple of days of using Raindrop, I decided to stick with it. I'll miss the newsletter/RSS feed support Omnivore had, but I couldn't find any (FOSS) option out there that'd offer this whole package anyway.

## Website Integration

Coming back to the data needed for my reading list, updating the code wasn't a big deal at all.

Before: [View Code](/blog/creating-a-reading-list-with-eleventy-and-omnivore/#data-fetching-with-eleventy)

After: {% ext "View Code (GitHub)", "https://github.com/ttntm/ttntm/blob/master/src/_data/reading.js" %}

The current version is actually _less_ code, because there's no more GraphQL query.

If you're curious: the `-1` in the URL the data gets fetched from, references Raindrop's `Unsorted` collection, where bookmarked links go by default. That's a good place for me to store things that I haven't read yet, so it makes sense to use that collection for my reading list.

Happy to have my reading list back, I realized that there was one more thing I almost forgot to take care of: updates of the reading list data should trigger website builds, so the list stays up to date. That's another thing that Omnivore made easy - a few clicks to configure a webhook, and that's it. No webhooks in Raindrop, however, so I had to figure out another solution...

I checked their documentation on {% ext "integrations", "https://raindrop.io/integrations" %}, and remembered that I signed up for IFTTT a very long time ago. That wasn't very helpful - as it turned out, IFTTT doesn't allow using outgoing HTTP requests on their free plan. Too bad, but they won't get my money.

{% ext "Make's Raindrop.io integrations", "https://www.make.com/en/integrations/raindrop-io" %} came up as the next best thing, and their free tier seemed sufficient for my rather simple needs. My assumptions proved true, and soon after I'd signed up there, I ended up with a little scenario (workflow) that'd check my bookmarks once per day and trigger builds when necessary (via Cloudflare's {% ext "Deploy Hooks", "https://developers.cloudflare.com/pages/configuration/deploy-hooks/" %}):

<img src="/static/img/blog/make-scenario.jpg" class="img-fluid img-center" alt="A screenshot showing a scenario (workflow) from make.com">

That's a neat solution, and it works well enough to forget about it easily. Daily updates of my reading list are sufficient for me, but the interval can be shortened, should that ever become necessary.

## Newsletters and RSS?

I was very happy to have my reading list back, but I still hadn't found a replacement for Omnivore's newsletter subscriptions and RSS functionality.

Regarding RSS, my needs are very simple - I want to:

- add feeds
- read their entries
- do that across devices

With that in mind, I eventually found {% ext "Qi Reader", "https://www.qireader.com" %}, which describes itself as "a modern RSS reader for the web". It's a minimal application focused on its core functionality, uBlock doesn't complain about a single thing (Umami instead of GA), and it comes with the added bonus of not having to install anything anywhere - I really like it so far, and it offers exactly what I was looking for.

Newsletters... well, I actually didn't miss them at all. So, I decided to let my newsletter subscriptions die with Omnivore, and moved on.

It's the second half of February now, and I've been using this new setup for about 6 weeks now. It all works, my reading list is back, and I can only hope that the new tools I decided to use survive the year. Sarcasm aside, it's a solid setup, and I'm glad I found good alternatives to the all-in-one convenience that Omnivore used to provide - RIP, old friend.
