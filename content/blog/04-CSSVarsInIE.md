---
title: Using CSS Variables in Internet Explorer
slug: using-css-variables-internet-explorer
weight: -4
type: blog
date: 2018-09-03
description: An article about using CSS variables in Internet Explorer which doesn't natively support them.
tags:
    - css
    - howto
    - javascript
images:
    - /img/blog/default.jpg
---

## Using CSS Variables

CSS variables (see: <a href="https://github.com/sindresorhus/ponyfill" rel="noopener" target="_blank">w3schools.com&nbsp;<i class="fas fa-external-link-alt fa-xs"></i></a>) make working with stylesheets easier, no doubt about that. Defining a color, a breakpoint or even a font-family globally, makes changes easier and almost completely eliminates the copy/paste and the find/replace cycle when it comes to updates in your CSS.

Now, having to support Internet Explorer 11 and below with your CSS makes this a little less exciting, as it simply doesn't support CSS variables at all.

But: not supporting IE 11 and below is not really an option yet. Even more so, if many of your site's potential visitors are likely to be corporate users who may not even have another choice and who haven't upgraded to Windows 10/Edge yet.

### Supporting Internet Explorer

In order to support IE, one could use CSS variables in development but provide production CSS without them in it, running it through Sass/CSS processing at build time.

If you're working on a smaller project or if you don't want to use any Sass/CSS processing in your site's build process, there's still another option that will be explained here: leaving the variables in your CSS and making sure IE will understand them.

In order to achieve that, we're going to do the following:

1. check whether or not IE is being used to view our site
2. add a ponyfill to process the CSS variables in case that's true

That way, we're not generating another HTTP request for the rest of our potential visitors using other browsers.

#### Check for IE

In order to check for IE, we're going to add the following JavaScript to our site's `<head>`:

{{< highlight js >}}

    var MSLegacy = checkForIE();

    if (MSLegacy !== false) {
        var insert = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.setAttribute('src', '/js/css-vars-ponyfill.min.js');
        insert.appendChild(script);
        console.log('IE found, adding ponyfill.')
    } else {
        console.log('This is not the IE you are looking for...')
    }

    function checkForIE() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }
        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }
        // all the other browsers
        return false;
    }

{{< /highlight >}}

The function `checkForIE()` shown above, makes sure we don't miss any Internet Explorer 11 and below.

Depending on the outcome of that function, a ponyfill that provides CSS variable support gets added to the DOM.

Most of the code above is based on this helpful resource found on CodePen: <a href="https://github.com/sindresorhus/ponyfill" rel="noopener" target="_blank">codepen.io/gapcode/pen/vEJNZN&nbsp;<i class="fas fa-external-link-alt fa-xs"></i></a>

#### The Ponyfill

According to <a href="https://github.com/sindresorhus/ponyfill" rel="noopener" target="_blank">this&nbsp;<i class="fas fa-external-link-alt fa-xs"></i></a>, a so called "Ponyfill" "doesn't monkey patch anything, but instead exports the functionality as a normal module, so you can use it locally without affecting other code".

The one used here is called "css-vars-ponyfill" and comes from this repository on GitHub: <a href="https://github.com/jhildenbiddle/css-vars-ponyfill" rel="noopener" target="_blank">github.com/jhildenbiddle/css-vars-ponyfill&nbsp;<i class="fas fa-external-link-alt fa-xs"></i></a>

Simply adding the ponyfill to a page won't do the trick, it also has to be executed via `cssVars()`. The site this example came from is also using jQuery, so this call has been placed in `document.ready()`, which looks like that:

{{< highlight js>}}

    $(document).ready(function(){
        //some code...

        if (MSLegacy !== false) {cssVars();};

        //some more code...
    });

{{< /highlight >}}

### Conclusion

Overall, this seems to be a rather convenient solution when it's necessary to make CSS variables work in legacy IE browsers.

In the end though, I don't think any of the above is relevant if you're using Sass and/or CSS processing in your build setup. I just haven't gotten around to digging into that yet, so it's a definitive advantage over the copy/paste and the find/replace cycle respectively.

--------------------

#### Update 10.09.2018

For some reason, `$(document).ready()` didn't fire consistently enough - it could happen, that `cssVars()` never got executed and the site rendered without resolving the variable values.

Putting `cssVars()` into an _EventListener_ instead helped here:

{{< highlight js>}}

    window.addEventListener('load', function() {
        if (MSLegacy !== false) {
            cssVars();
        }
    });

{{< /highlight >}}