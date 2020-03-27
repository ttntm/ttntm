---
title: Building a responsive menu with Tailwind CSS
slug: tailwind-responsive-menu
weight: -5
type: blog
date: 2018-09-20
description: This article shows how to build a responsive menu/navigation with Tailwind CSS and also includes a CodePen example. Updated 03/2020.
tags:
    - css
    - howto
    - tailwind
images:
    - /img/blog/default.jpg
---

## Tailwind CSS

> Last updated: 03/2020

According to their docs, "**Tailwind is a utility-first CSS framework for rapidly building custom user interfaces.**"

Being used to Bootstrap and/or other component based frameworks, this is quite a different approach.

Using Tailwind, basically everything you know from these frameworks is possible, but the way to get there is a little different. There's no `navbar`, `card` or `modal` - instead, all of Tailwind's classes can be used to actually build those components. Basically, that's lots of freedom (*which is great!*), but it also requires some more knowledge of HTML and especially CSS in order to achieve the same result as using finished components would.

Oh, one more thing: Tailwind is a pure CSS framework and ships without any front-end JavaScript - that means that if you'd like to have a sticky header once the page scrolls or a collapsed navbar that expands when clicking a button, you need to build it.

### Let's Build a Menu

Navigation is certainly one of the essentials when it comes to building a website, so let's get right into that.

1. We're going to build a classic old fashioned page header with a larger logo placed on top and a horizontal menu below that.

2. When the page scrolls down, the menu should become sticky so that the navigation options persist for increased accessibility on long pages like blog posts.

3. When browsing our example page on mobile devices, the whole page header should collapse, turning into a fixed navbar on top of the page that expands upward when a button is clicked.

All of that should be achieved with the same header/menu and some JavaScript to check the scroll position and to provide expand/collapse functionality.

### The Header and the Menu

We're going to keep the custom CSS at a bare minimum, using Tailwind's classes as far as that's possible.

That's what our header is going to look like:

{{< highlight html >}}

    <header id="top" class="w-full flex flex-col fixed sm:relative bg-white pin-t pin-r pin-l">
    <nav id="site-menu" class="flex flex-col sm:flex-row w-full justify-between items-center px-4 sm:px-6 py-1 bg-white shadow sm:shadow-none border-t-4 border-red-900">
        <div class="w-full sm:w-auto self-start sm:self-center flex flex-row sm:flex-none flex-no-wrap justify-between items-center">
            <a href="#" class="no-underline py-1">
                <h1 class="font-bold text-lg tracking-widest">LOGO</h1>
            </a>
            <button id="menuBtn" class="hamburger block sm:hidden focus:outline-none" type="button" onclick="navToggle();">
                <span class="hamburger__top-bun"></span>
                <span class="hamburger__bottom-bun"></span>
            </button>
        </div>
        <div id="menu" class="w-full sm:w-auto self-end sm:self-center sm:flex flex-col sm:flex-row items-center h-full py-1 pb-4 sm:py-0 sm:pb-0 hidden">
            <a class="text-dark font-bold hover:text-red text-lg w-full no-underline sm:w-auto sm:pr-4 py-2 sm:py-1 sm:pt-2" href="https://ttntm.me/blog/tailwind-responsive-menu/" target="_blank">About</a>
            <a class="text-dark font-bold hover:text-red text-lg w-full no-underline sm:w-auto sm:px-4 py-2 sm:py-1 sm:pt-2" href="#bottom">Features</a>
        </div>
    </nav>
    </header>

{{< /highlight >}}

There are 2 `div` elements here, first the navigation bar and then the menu with `id="menu"`. The menu button `menuBtn` has an `onclick` attribute that runs a function called `navToggle()`. This function will make sure that the menu can expand/collapse when the button is pressed.

Tailwind is "mobile first", so its responsive utilities like `sm:hidden` work in a way that can be described as "valid *from* the specified breakpoint". So, `sm:hidden` translates to "hidden on screens larger than the defined `sm`-breakpoint" (default: 576px).

### The JavaScript

We need JavaScript to enable 2 functions of our menu, the first one is the expand/collapse functionality for mobile devices, the second one's the sticky navigation when scrolling down.

#### Expand and Collapse the Menu

In order to achieve the proper functionality for our mobile menu, we've already placed a call to the `navToggle()` function in our menu.

The function itself is rather simple and looks like this:

{{< highlight js >}}

    function navToggle() {
        var btn = document.getElementById('menuBtn');
        var nav = document.getElementById('menu');

        btn.classList.toggle('open');
        nav.classList.toggle('flex');
        nav.classList.toggle('hidden');
    }

{{< /highlight >}}

As shown in the larger code snippet above, the `nav` HTML-element is set to `hidden` by default. `navToggle()` adds/removes the `flex` class, thus expanding/collapsing the menu.

#### Sticky Menu

Scrolling down far enough should make our `nav` stick to the top of the screen on any screen larger than 576px, providing persistent navigation to the users of the site.

To implement this functionality, we need to grab the `scroll` event and use it to add a class to the `nav` HTML-element to make it stick. This could be done as shown here:

{{< highlight js >}}

    var nav = document.getElementById('site-menu');
    var header = document.getElementById('top');

    window.addEventListener('scroll', function() {
        if (window.scrollY >=400) { // adjust this value based on site structure and header image height
            nav.classList.add('nav-sticky');
            header.classList.add('pt-scroll');
        } else {
            nav.classList.remove('nav-sticky');
            header.classList.remove('pt-scroll');
        }
    });

{{< /highlight >}}

We don't just add `nav-sticky` though, there's a second class called `bod-pt-scroll` which adds `padding-top` to the `<body>`, thus making sure that the page content doesn't reflow when the `nav` gets stuck to the top of the page and taken out of the regular flow of the DOM elements.

### Custom CSS

In order to provide the necessary padding and the sticky-ness of the `nav`-element, we're using some custom, non-Tailwind CSS:

{{< highlight css >}}

    @media (max-width: 576px) {
        .content {
            padding-top: 51px;
        }
    }

    @media (min-width: 577px) {
        .pt-scroll {
            padding-top: 51px;
        }

        .nav-sticky {
            position: fixed!important;
            min-width: 100%;
            top: 0;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .1);
            transition: all .25s ease-in;
            z-index: 1;
        }
    }

{{< /highlight >}}

The padding for the `<body>` could of course have been done with Tailwind classes, but this example came out of a project where Tailwind's padding and margin utilities were not needed in their responsive variation, thus making the overall CSS bundle much smaller using just the 5 lines of custom CSS shown here.

### Conclusion

Tailwind CSS is a very versatile, powerful and extremely customizable framework. It's also quite fast once you've gotten into it, making it a joy to work with.

I hope this article is beneficial to someone out there. Here's a pen and a link to the an excellent Tailwind cheatsheet for your convenience:

- {{< link-ext CodePen "codepen.io/ttntm/full/dqaNPp" >}}
- {{< link-ext Cheatsheet "nerdcave.com/tailwind-cheat-sheet" >}}