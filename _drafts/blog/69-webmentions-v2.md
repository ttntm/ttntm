Earlier this year, [I added webmentions to my website](/blog/implementing-webmentions/).

Back then, I relied on the API that <span>webmention.io</span> provides, and on fetching data from there as part of this website's build pipeline. I added caching, of course, but considering the frequency of both, new content, and new webmentions, my site's API usage felt a little excessive.

So, I started thinking about ways to persist my webmention data somewhere.

After a bit of research, I figured out that I could use {% ext "Cloudflare Workers KV", "https://developers.cloudflare.com/kv/" %} to persist my webmention data. This website's already hosted there, so adding Workers KV as a data storage felt like a really convenient option.

A high level overview of the revised implementation:

1. <span>webmention.io</span> collects webmentions
2. For each new mention: <span>webmention.io</span> sends a request to a Cloudflare Worker (via its webhooks feature)
3. The CF Worker updates the key-value storage using the incoming data
4. The CF Worker triggers a rebuild of the website
5. Webmentions are fetched from the key-value storage as part of the website build

## Worker Logic

I set up a Cloudflare Worker to handle incoming webhooks from <span>webmention.io</span>.

The code is pretty simple and can be found here: {% ext "ttntm/wm-svc-ttntm", "https://codeberg.org/ttntm/wm-svc-ttntm/src/branch/main/src/index.ts" %}

I've kept my previous approach of aggregating metrics only, meaning counts of likes, replies and shares per post, and I'm storing that data in KV's {% ext "metadata", "https://developers.cloudflare.com/kv/api/write-key-value-pairs/#metadata" %}. There's a reason for doing that, and I'll get to it in the next section.

After storing the data, the worker also triggers a build of the website, which ensures that new and updated webmention data is present on the live site as soon as possible.

## Website Build

https://developers.cloudflare.com/kv/api/list-keys/#list-method
