---
title: Building a responsive menu with Tailwind CSS
slug: tailwind-responsive-menu
weight: -5
type: blog
date: 2018-09-20
description: This article shows how to build a responsive menu/navigation with Tailwind CSS and also includes a CodePen example.
tags:
    - css
    - howto
    - tailwind
images:
    - /img/blog/default.jpg
---

## Tailwind CSS

According to their docs:

> Tailwind is a utility-first CSS framework for rapidly building custom user interfaces.

Being used to Bootstrap and/or other component based frameworks, this is quite a different approach.

Using Tailwind, basically everything you know from these frameworks is possible, but the way to get there is a little different. There's no `navbar`, `card` or `modal` - instead, all of Tailwind's classes can be used to actually build those components. Basically, that's lots of freedom (*which is great!*), but it also requires some more knowledge of HTML and especially CSS in order to achieve the same result as using finished components would.

Oh, one more thing: Tailwind is a pure CSS framework and ships without any front-end JavaScript - that means that if you'd like to have a sticky header once the page scrolls or a collapsed navbar that expands when clicking a button, you need to build it.

### Let's Build a Menu

Navigation is certainly one of the essentials when it comes to building a website, so let's get right into that.

1. We're going to build a classic old fashioned page header with a larger logo placed on top and a horizontal menu below that.

2. When the page scrolls down, the menu should become sticky so that the navigation options persist for increased accessibility on long pages like blog posts.

3. When browsing our example page on mobile devices, the whole page header should collapse, turning into a fixed navbar on top of the page that expands upward when a button is clicked.

All of that should be achieved with the same header/menu and some JavaScript to check the scroll position and to provide expand/collapse functionality.

### The Header

We're going to keep the custom CSS at a bare minimum, using Tailwind's classes as far as that's possible.

That's what our header is going to look like:

{{< highlight html >}}

        <header id="top" class="w-full flex flex-col pt-3 fixed sm:relative bg-white pin-t pin-r pin-l">
            <div class="flex-row justify-center">
                <!-- image here -->
            </div>
            <nav id="site-menu" class="hidden sm:flex flex-row flex-wrap sm:flex-no-wrap w-full justify-center self-center text-xl bg-transparent tracking-wide">
                <a href="#home" class="w-full sm:w-auto text-center text-teal-dark hover:text-teal no-underline hover:bg-grey-lighter py-3 px-5">Home</a>
                <!-- other menu items -->
                <div class="w-full h-px bg-grey-light sm:hidden my-3">
            </nav>
            <div class="flex flex-row justify-between">
                <!-- image here, goes to the left of the flex-row -->
                <button class="sm:hidden self-end text-teal-dark hover:text-teal border border-teal-dark hover:border-teal px-3 py-2 mx-3" onclick="navToggle();">
                    <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <title>Menu</title>
                        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
                    </svg>
                </button>
            </div>
            <div class="w-full sm:w-2/3 h-px bg-grey-light mx-auto mt-3"></div>
        </header>

{{< /highlight >}}

As you can see, there's the image, followed by the menu between the `nav` tags. Then there's another `flex-row` containing a smaller logo and a button to expand the collapsed menu on mobile devices.

The menu button has an `onclick` attribute that runs a function called `navToggle()`. This function will make sure that the menu can expand/collapse when the button is pressed. The menu is placed above the button, so it should expand upward.

Tailwind is "mobile first", so its responsive utilities like `sm:hidden` work in a way that can be described as "valid *from* the specified breakpoint". So, `sm:hidden` translates to "hidden on screens larger than the defined `sm`-breakpoint" (default: 576px).

### The JavaScript

We need JavaScript to enable 2 functions of our menu, the first one is the expand/collapse functionality for mobile devices, the second one's the sticky navigation when scrolling down.

#### Expand and Collapse the Menu

In order to achieve the proper functionality for our mobile menu, we've already placed a call to the `navToggle()` function in our menu.

The function itself is rather simple and looks like this:

{{< highlight js >}}

        function navToggle() {
            nav.classList.toggle('flex');
        }

{{< /highlight >}}

As shown in the larger code snippet above, the `nav` HTML-element is set to `hidden` by default. `navToggle()` adds/removes the `flex` class, thus expanding/collapsing the menu.

#### Sticky Menu

Scrolling down should make our `nav` stick to the top of the screen, providing persistent navigation to the users of the site.

To implement this functionality, we need to grab the `scroll` event and use it to add a class to the `nav` HTML-element to make it stick. This could be done as shown here:

{{< highlight js >}}

        var nav = document.getElementById('site-menu'); // this variable is also used for the navToggle() function
        var bod = document.getElementsByTagName('body')[0];

        window.addEventListener('scroll', function() {
        if (window.scrollY >=250) { // adjust this value based on your project
            bod.classList.add('bod-pt-scroll');
            nav.classList.add('nav-sticky');
        } else {
            bod.classList.remove('bod-pt-scroll');
            nav.classList.remove('nav-sticky');
        }
        });

{{< /highlight >}}

We don't just add `nav-sticky` though, there's a second class called `bod-pt-scroll` which adds `padding-top` to the `<body>`, thus making sure that the page content doesn't reflow when the `nav` gets stuck to the top of the page and taken out of the regular flow of the DOM elements.

### Custom CSS

In order to provide the necessary padding and the sticky-ness of the `nav`-element, we're using some custom, non-Tailwind CSS:

{{< highlight css >}}

        @media (max-width: 576px) {
            body {
                padding-top: 75px;
            }
        }

        @media (min-width: 576px) {
            .bod-pt-scroll {
                padding-top: 50px;
            }
            .nav-sticky {
                position: fixed;
                min-width: 100%;
                max-height: 50px;
                top: 0;
                background-color: #3d4852!important;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .1);
                transition: all .25s ease-in;
            }
        }

{{< /highlight >}}

The padding for the `<body>` could of course have been done with Tailwind classes, but this example came out of a project where Tailwind's padding and margin utilities were not needed in their responsive variation, thus making the overall CSS bundle much smaller using just the 5 lines of custom CSS shown here.

### Conclusion

Tailwind CSS is a very versatile, powerful and extremely customizable framework. It's also quite fast once you've gotten into it, making it a joy to work with.

I hope this article is beneficial to someone out there. Here's a pen and a link to the an excellent Tailwind cheatsheet for your convenience:

- {{< link-ext Cheatsheet "nerdcave.com/tailwind-cheat-sheet" >}}
- {{< link-ext CodePen "codepen.io/ttntm/pen/dqaNPp" >}}