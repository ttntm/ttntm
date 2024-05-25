---
title: My Personal Knowledge Base
slug: personal-knowledge-base
date: 2024-05-08
description: How and why I decided to build TKB, my personal knowledge base.
tags:
  - docs
  - personal
image: /img/blog/content.jpg
---

I started using Notion in 2018 when it was very new. I was very convenient and fast, which made using it a rather pleasant experience. Over time, I built small personal wiki in there, drafted articles with it and used lists of to-dos and tables to track lots of different things.

At some point last year, both the web application, and the 2 mobile apps (Android/iOS) I was using occasionally, got slower and slower. I suspected some (unwanted, auto-enabled) AI bloat as the cause and had it turned off for my account (via support case). But that didn't really change anything. On top of that, I felt increasingly uneasy about my data in their walled garden, and the lack of a properly working offline mode didn't do much good either.

Some hours of research later, I was convinced that tools like anytype, Logseq, Obsidian and many others all look great in their own way and would definitely be suitable for my rather ordinary use case. But they're all just another layer on top of plain text that I don't really need at the moment, so I decided against shopping for a new tool and in favor of writing plain text files (ref. [[1]](#refs)).

Exporting my data and pages from Notion was not a big deal, but I soon realized that it'd be nice to have a front end for my wiki. What I had in mind was pretty simply really: navigation, search and a clear focus on the content. Static output and at least a bit of customizability should also be possible.

I briefly considered building my own "wiki framework" using a cool new tool, but I really wanted to avoid that. Why? Because I knew that if I did, I'd certainly spend a disproportionate amount of time tinkering with the tech stack, instead of focusing on the content.

> Today's web stacks gravitate towards infinite complexity. It's all too natural to pick an "easy" heavy framework at the start, and then get yourself into npm's bog. Website is about content, and content has gravity. [...] Do carefully consider the choice of your web stack.
>
> <small>Ref. [[2]](#refs)</small>

Some more research was done, and I soon discovered *mdBook* (ref. [[3]](#refs)), which looked like a perfect fit for my use case. I gave it a try, customized it a little and had my wiki up and running rather quickly.

## Tom's Knowledge Base

Naming things is notoriously hard, but I didn't have any issues with that this time. The heading above already gave it away: I chose "knowledge base" over "wiki" and ended up with "TKB", a rather appealing abbreviation.

TKB's content is stored in a public Codeberg repository (ref. [[4]](#refs)) and gets published to Codeberg Pages using local builds. To get this done, I'm using a `.gitignore`'d subdirectory (`cdbrg-pages`) that a script copies the build artifacts into (ref. [[5]](#refs)). Running the script is a manual process and gives me full control over what and when to publish new versions. I might automate this process (ref. [[6]](#refs)) at some point, but I'm happy with it for the time being.

NB: I never really got into the more personal (diary) aspect of note-taking, so having TKB available in public is fine for me. Whatever really personal stuff I need to write down is not much usually and can easily be stored elsewhere.

## Did it work out?

I've been using, updating and growing TKB for about 5 months now, and I'd say yes, it worked out. I realized that I've collected a ton of links, notes and overall information over the years, and I'm happy to have found a suitable new home for all of it.

There's still some stuff left in Notion, but I hardly use it anymore. The value of outdated lists of to-dos is debatable, but I haven't decided what to do with it yet. I'm probably not going to delete my account, because my wife's using Notion a lot and there are many family things we edit collaboratively.

Overall, I'd say I'd recommend creating/maintaining a personal kb/wiki. It feels liberating and will probably turn into a valuable resource that you'll enjoy taking care of.

Oh, I almost forgot - here's a link, feel free to check it out: [TKB](/wiki/)

PS: Mark wrote a similar article that I can recommend.
{% ext "Goodbye Logseq, Obsidian, and Vimwiki. Hello, mdBook!", "https://www.markpitblado.me/blog/goodbye-logseq-obsidian-and-vimwiki-hello-mdbook/" %}

<h2 id="refs">References</h2>

1. {% ext 'Derek Sivers, "Write plain text files"', "https://sive.rs/plaintext" %}
2. {% ext 'Alex Kladov, "Basic Things"', "https://matklad.github.io/2024/03/22/basic-things.html" %}
3. {% ext "github/rust-lang/mdBook", "https://github.com/rust-lang/mdBook" %}
4. {% ext "Codeberg repository", "https://codeberg.org/ttntm/tkb/" %}
5. {% ext "tkb/deploy.sh", "https://codeberg.org/ttntm/tkb/src/branch/main/deploy.sh" %}
6. {% ext "Deploying mdbook to codeberg pages using woodpecker CI", "https://www.markpitblado.me/blog/deploying-mdbook-to-codeberg-pages-using-woodpecker-ci/" %}
