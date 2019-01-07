---
title: Hello World
slug: hello-world
weight: -1
type: post
date: 2018-08-20
description: This site's opening post.
tags: 
    - firstpost
    - hugo
    - post
tw-image: https://ttntm.github.io/img/blog/default.jpg
---

## Let's do this

I've had a lot of websites over the years, ranging from more or less official business endeavours like a small record label to more private things like a website for my wedding a while ago. I've never had a website _just for me_ though, so this is something new.

Also, I've never been involved much with giving back to _the crowd_ - meaning all the people posting content like reviews or code snippets online. However, I undeniably profited from all of that helpful content in one way or another. 

So, I guess aside from tracking my thoughts and logging both achievements and failures, another aim for this site shall be giving back something to the online world.

### How it came to be

As mentioned in the [About section](/about), I'm working in IT for many years and I've always been very interested in web design. As such, I strongly supported the notion that a software development company like my current employer should be taking care of its own website instead of giving it to some overpaid agency using the same CMS template for each single one of their clients. I ended up with full responsibility for that project myself in the end.

After some rather quick reminder of why I wasn't a huge WordPress fan, I ended up stumbling over <a href="https://gohugo.io" rel="noopener" target="_blank">Hugo&nbsp;<i class="fas fa-external-link-alt fa-xs"></i></a> that somehow stuck out of the vast amount of static site generators. It seemed perfectly suited for what we had in mind for our company website, essentially a rather compact presentation of our products and services along with the integration of our mailchimp newsletter signup and a secure contact form. These requirements together with the performance and security benefits of a static site made it all seem like a perfect fit.

The process of setting up a website with Hugo was pretty straightforward to be honest, mostly thanks to their excellent documentation and the logical structure behind the whole thing. After about 6 weeks of part-time work during hotel nights and airport waiting times, a completely reworked website was ready, essentially based on a custom theme I ended up creating for our purposes. For those interested, the result can be seen here: <a href="https://process4.biz" rel="noopener" target="_blank">process4.biz website&nbsp;<i class="fas fa-external-link-alt fa-xs"></i></a>

Another key element helping in the successful re-design of our website was the discovery of <a href="https://netlify.com" rel="noopener" target="_blank">Netlify&nbsp;<i class="fas fa-external-link-alt fa-xs"></i></a>. Compared to a task like setting up, securing and maintaining your own web server to host an instance of WordPress, going live with our website there was basically a walk in the park. If you haven't heard of their service before, you should definitely go and check it out or even better, try it yourself as its free.

> Based on this very positive experience, the idea of a personal website grew and eventually turned into what's on the screen right now.

### Under the hood

To provide some insight, here's how this site is configured at the moment.

It started out as a trial for Bootstrap 4 with Hugo and quickly turned into a useful yet minimal blog/portfolio kind of site. BS4 is much more utility-based than BS3 was, so that's a really nice change of pace once you get into their thought pattern. The site started out with the default colors but I changed them along with some other details to make it look a little less 'common' and a little more individual. All the unused parts of BS4 have been removed for the time being, as it would be way too heavy otherwise.

Initially, I had thought of giant hero-sized images for every blog post, but I ditched that idea in favour of load times and time saved when it comes to image search (even though I could spend hours upon hours on Unsplash...). Instead, there's a header based on `particles.js` (<a href="https://github.com/VincentGarreau/particles.js" rel="noopener" target="_blank">Details&nbsp;<i class="fas fa-external-link-alt fa-xs"></i></a>) in place on some sites which makes for a nice atmosphere and also provides some interactivity. I remember seeing that on Netlify or somewhere else and it looked really nice.

In terms of the Hugo setup, there's 2 content sections here, the blog in `/post`, and a pre-built but still unused `/projects` section. The `/about` section is basically just a single markdown file to make editing it a little easier.

That's about it for now, a simple, functional yet minimal site for the time being. If you like what you see here, feel free to have a look at the site's repository over on GitHub: https://github.com/ttntm/ttntm