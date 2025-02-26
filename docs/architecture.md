# Architecture

- Cloudflare Pages
- Eleventy
- Git
- PostCSS

## CI/CD

Builds and deployments via Cloudflare Pages

### Triggers

1. GIT
2. make.com (Raindrop watcher)
3. webmention.io (webhook for new mentions)
4. manual HTTP requests

## External Data

- Raindrop.io (reading list)
- webmention.io (webmentions)

## Interfaces

### In

Mastodon via brid.gy >> webmention.io >> CF build hook

### Out

Blog posts/likes: RSS via EchoFeed >> webmention.app
