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
