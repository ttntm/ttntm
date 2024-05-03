---
title: "Hugo's '.plain' Function Ignores Page Reources"
slug: hugo-plain-function-ignores-page-resources
date: 2020-03-30
description: "Lessons learned when building a JSON search index for Hugo sites using Page Reources."
tags:
  - hugo
  - learning
image: /img/blog/nothing.jpg
---

## Context

When {% ext "adding a search function to your Hugo site" "gist.github.com/eddiewebb/735feb48f50f0ddd65ae5606a1cb41ae" %}, one thing that's required is a JSON index of the respective site's content. If your site is also making use of {% ext "Page Resources" "gohugo.io/content-management/page-resources/" %}, there can be issues when creating this index. This short article is meant to document a possible workaround for such cases.

_This is/was an issue in Hugo 0.58; I assume it won't be different in newer releases, but that's not a 100% certain._

### Problem Description

According to the linked gist, the template for the JSON index `index.json` is really the opposite of spectacular:

```go
{% raw %}{{- $.Scratch.Add "index" slice -}}
{{- range .Site.RegularPages -}}
  {{- $.Scratch.Add "index" (dict "title" .Title "tags" .Params.tags "categories" .Params.categories "contents" .Plain "permalink" .Permalink) -}}
{{- end -}}
{{- $.Scratch.Get "index" | jsonify -}}{% endraw %}
```

The template sets up a `.Scratch` ({% ext "Hugo docs", "https://gohugo.io/functions/scratch" %}) and then ranges through all `RegularPages`, meaning every page that isn't a section, taxonomy list etc. - pages that are supposed to contain "real" content (see {% ext "Hugo docs", "https://gohugo.io/variables/site/#site-pages" %} for further details). It collects the `.Title`, tags, categories and the respective `.Permalink` of each page and it also makes sure that the actual content is added to the index via `.Plain`.

All of that information/content then gets added to `index.json` in the last line, thus providing enough "food" for the respective full text search functionality (Fuse.js in this case).

When it comes to `RegularPages` that consist of a mixture of pure Markdown content _and_ Page Resources though, `.Plain` fails (and so do other things like `.Content | plainify`) - the "content" key for those pages stays blank and/or contains only whatever Markdown was actually found, ignoring the content coming from the Page Resources.

### Why use Page Resources then?

Simply talking about that term might be enough for some, but let's just take a look at an example here: {% ext "a 'Services' page", "https://process4.biz/en/services/" %} rendered almost exclusively from Page Resources.

On the top, right underneath the header, there are 2 lines of "real" Markdown content. Then there's a grid of icons with short pieces of text and a larger section with the actual services on offer.

Each one of these pieces of content is its own *.md Page Resource, mostly due to an easy `range` based approach when creating the template and a high degree of extensibility in case something has to be added, changed or removed in either one of these blocks. Page Resources provide this flexibility here.

## Workaround

Coming back to the problem with the JSON search index, the Hugo community wasn't of any help unfortunately - here's the respective post from earlier this year: {% ext "discourse.gohugo.io", "https://discourse.gohugo.io/t/building-a-json-search-index-trouble-with-plain/" %}

After a while of messing around with the `index.json` template, I ended up with the following approach to get the Page Resources included in the index:

```go
{% raw %}{{- $.Scratch.Add "index" slice -}}
{{- range .Site.RegularPages -}}
  {{- if and eq .Layout "services" -}}
    {{- $md := .Resources.Match "**.md" -}}
    {{- $sc := newScratch -}}
      {{- $sc.Add "ct" .Description | markdownify -}}
      {{- $sc.Add "ct" ", " -}}
      {{- with $.Params.intro -}}
        {{- $sc.Add "ct" .Params.intro | markdownify -}}
        {{- $sc.Add "ct" ", " -}}
      {{- end -}}
      {{- range $md -}}
        {{- $sc.Add "ct" .Title | markdownify -}}
        {{- $sc.Add "ct" ", " -}}
        {{- $sc.Add "ct" .Content -}}
    {{- end -}}
    {{- $content := $sc.Get "ct" | plainify -}}
    {{- $.Scratch.Add "index" (dict "title" .Title "tags" .Params.tags "content" $content "permalink" .Permalink) -}}
  {{- else -}}
    {{- $.Scratch.Add "index" (dict "title" .Title "tags" .Params.tags "content" .Plain "permalink" .Permalink) -}}
  {{- end -}}
{{- end -}}
{{- $.Scratch.Get "index" | jsonify -}}{% endraw %}
```

This is a simplified version of the deployed code; the most important bit to highlight here is the part starting with `range $md`. That's where we leave the page context and instead range through all the Page Resources (see line 4; `$md := .Resources.Match "**.md"`) in order to get their `.Title` and `.Content` added to the index. All that happens inside the context of the key of the "services" page, so that all search queries finding a match lead to the correct page.

## Lessons Learned

Hugo is a very powerful tool, but every once in a while there's something that hasn't been thought of yet. Aside from some headache and some trial and error based on the community support, this hasn't been a major issue though. The above code may not be the best or prettiest solution to this issue, but it works - you can test it yourself in the real world example site linked above.
