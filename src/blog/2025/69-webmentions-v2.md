---
title: Webmentions V2
slug: webmentions-v2
date: 2025-06-19T12:05:00Z
description: About a recent update of my webmentions integration.
tags:
  - database
  - guide
  - website
image: /img/blog/backend.png
toot: https://hachyderm.io/@ttntm/114709517072069076
---

Earlier this year, [I added webmentions to my website](/blog/implementing-webmentions/).

Back then, I relied on the API that <span>webmention.io</span> provides, and on fetching data from there as part of this website's build pipeline. I added caching, of course, but considering the frequency of both, new content, and new webmentions, my site's API usage felt a little excessive.

So, I started thinking about ways to persist my webmention data somewhere.

After a bit of research, I figured out that I could use {% ext "Cloudflare Workers KV", "https://developers.cloudflare.com/kv/" %} to persist my webmention data. This website's already hosted there, so adding Workers KV as a data storage felt like a really convenient option.

A high level overview of the revised implementation:

1. <span>webmention.io</span> collects webmentions
2. For each new mention: <span>webmention.io</span> sends an HTTP request to a Cloudflare Worker (via its webhooks feature)
3. The CF Worker updates the key-value storage using the incoming data
4. The CF Worker triggers a rebuild of the website
5. Webmentions are fetched from the key-value storage as part of the website build

## Worker Logic

I set up a Cloudflare Worker to handle incoming webhooks from <span>webmention.io</span>.

The code is pretty simple and can be found here: {% ext "ttntm/wm-svc-ttntm", "https://codeberg.org/ttntm/wm-svc-ttntm/src/branch/main/src/index.ts" %}

I've kept my previous approach of aggregating metrics only (i.e. counts of likes, replies and shares per post), and I'm storing that data in KV's {% ext "metadata", "https://developers.cloudflare.com/kv/api/write-key-value-pairs/#metadata" %}. There's a reason for doing that, and I'll elaborate on that in the next section.

After storing the data, the worker triggers a website build, to ensure that new and updated webmention data gets published as soon as possible.

## Website Build

As part of the build, webmention data gets fetched from the KV storage. I'm using the {% ext "TypeScript library for the Cloudflare API", "https://github.com/cloudflare/cloudflare-typescript" %}, which keeps things rather simple.

The code can be found here: {% ext "webmentions.js", "https://github.com/ttntm/ttntm/blob/master/src/_data/webmentions.js" %}

The `list()` method ({% ext "CF docs", "https://developers.cloudflare.com/kv/api/list-keys/#list-method" %}) is used to list all the keys in my KV namespace, and the keys are returned including their metadata. As mentioned above, that's the reason I'm storing the webmention data there - no need for an additional loop to obtain each key's value, leading to faster builds.

_NB: there are limits to data storage in metadata, 1024 bytes to be specific, but I'm not even close to that with the miniature objects I'm storing there._

## Conclusion

I'm happy to have come up with this v2 approach of my webmentions integration, and I'm also glad I got to try out something new. Cloudflare Workers KV is a pretty cool convenience feature when an actual database might be overkill, and I'll definitely keep that in mind for future projects.
