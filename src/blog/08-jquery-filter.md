---
title: jQuery Multiselect Filter
slug: jquery-multiselect-filter
type: blog
date: 2018-12-12
description: An article about building a portfolio filter capable of multiselect with jQuery. Also includes a working CodePen example.
tags:
  - guide
  - hugo
  - jquery
image: /img/blog/code.jpg
---

## Filter Requirements

I spent quite some time working on a friend's portfolio website recently. She wanted to get rid of some sort of hosted service, moving to her own website.

Showcasing her work was clearly the focus of the site, so it also needed to provide some decent filtering of the portfolio items.

The site itself was supposed to be built with Hugo that already provides a ton of functionality in terms of taxonomy and content metadata. That toolset could have worked for someone else, but in this case, multiselect was another requirement for the filters and all those extra list pages for the respective metadata items were unwanted.

So, I ended up building them myself, based on content metadata (Hugo: front matter) and jQuery.

_All CSS is going to be missing here, but it's included in the CodePen example._

### Content Setup

In order to make the portfolio manageable, the site was set up using Hugo's so called "Page Bundles" ({% ext "Hugo Docs", "https://gohugo.io/content-management/page-bundles/" %}), lots of shortcodes and customized metadata in each portfolio item's front matter:

```yaml
title: Example Case
client: Example Corp.
team: Homer Simpson (art director), Peter Griffin (designer), Burt Reynolds (badass)
works:
- work: branding
- work: identity
resources:
- name: hero
    src: hero.png
- name: overview
    src: overview.png
- name: detail
    src: detail.png
- name: intro
    src: intro.md
- name: description1
    src: description1.md
- name: description2
    src: description2.md
```

As shown above, each portfolio item gets categorized with `work` elements. This categorization will serve as the backbone for the filter. Due to the requirement of the filter providing multiselect functionality, the front matter section "works" also has to provide an array that can hold multiple values (= portfolio item categories).

Due to the portfolio items being page bundles, the front matter above also shows a section `resources`. This list basically contains all the relevant bits of content the page shall have access to. For our filter, the image resource called `hero` will also be necessary as the list page of all portfolio items will be displayed as an image grid.

### Portfolio Layout

In order to display our portfolio items, we're going to let Hugo create a list page of all the relevant posts, displaying them as an image grid with the filters on top.

The page template starts with the filters below the standard page header:

```html
<div class="row">
  <div class="col">
    <div id="filters" class="d-flex flex-row flex-wrap justify-content-between mb-5">
      <span class="works-filter flex-grow-1 w-sm-100 my-2" data-filter="catA">Category A</span>
      <span class="works-filter flex-grow-1 w-sm-100 my-2" data-filter="catB">Category B</span>
      <span class="works-filter flex-grow-1 w-sm-100 my-2" data-filter="catC">Category C</span>
      <span class="text-right works-filter flex-grow-1 w-sm-100 my-2 showAll" data-filter="all">All Projects</span>
    </div>
  </div>
</div>
```

All filters are equipped with an HTML data-* attribute, `data-filter`, that will provide the filtering criteria to our jQuery functions.

The actual portfolio items are displayed below the filters as a 2-column grid:

```html
{% raw %}<div class="row">
  {{ range .Pages }}
    <div class="col-sm-12 col-md-6 gap-y workItem show-workItem {{range .Params.works }}{{ .work | urlize }} {{ end }}">
      {{ partial "img+overlay.html" . }}
    </div>
  {{ end }}
</div>{% endraw %}
```

Before having a look at the process of obtaining the `hero` resource mentioned above, it's important to mention that `range .Params.works` pulls all `work` elements, essentially providing their value as an additional class of each portfolio item's parent `div`. Our filter is going to access this class list to determine which elements to show.

The images, each portfolio item's respective `hero` resource, are rendered by the following bit of code:

```html
{% raw %}{{ $scImg := .Resources.GetMatch "hero" }}
<div class="img-container m-0 p-0">
  <img src="/img/loading.svg" data-src="{{ $scImg.RelPermalink }}" class="img-lazy img-center img-fluid img-showcase">
  <div class="overlay d-flex flex-column align-items-center justify-content-center">
    <h2 class=""><a class="link-overlay" href="{{ .Permalink }}" title="{{ .Title }}">{{ .Title }}</a></h2>
    <p class="d-block small">
      {{range $index, $tag := .Params.works }}
        {{- if eq $index 0 -}}
          {{ .work }}
        {{- else -}}
          , {{ .work }}
        {{- end -}}
      {{ end }}
    </p>
  </div>
</div>{% endraw %}
```

It's a rather simple procedure, `.Resources.GetMatch "hero"` obtains each item's `hero` resource and `$scImg.RelPermalink` makes sure the `img` element's `src` tag is filled with its path correctly.

In addition to that, the overlay displays each item's `.Title` and ranges through `.Params.works` once again, displaying the respective categories.

This code has been put into a `partial` called `img+overlay.html` for convenience reasons, as the same component is used for other page templates as well.

If you're following this example, then you should have a page displaying filters followed by all portfolio items in an image grid by now. Time to move on to some jQuery then.

### jQuery

A short remark before we get started: as shown in the CodePen example, this code will work regardless of how your portfolio page is built, as long as the portfolio items have classes assigned to them that correspond to what's set as `data-filter`. There's no Hugo functionality and/or dependencies in there.

We're going to store our filter functionality in jQuery's `$(document).ready(function(){`, defining the necessary variables first:

```js
$(document).ready(function(){
  var $filters = $('.works-filter'); // find the filters
  var $works = $('.workItem'); // find the portfolio items
  var showAll = $('.showAll'); // identify the "show all" button

  var cFilter, cFilterData; // declare a variable to store the filter and one for the data to filter by
  var filtersActive = []; // an array to store the active filters
```

The array called `filtersActive` is the key piece for providing multiselect functionality, storing the active filters until they're deselected again, `All Projects` gets clicked or the page gets reloaded.

Next, we're going to handle the `click` event for our filters:

```js
$filters.click(function(){ // if filters are clicked
  cFilter = $(this);
  cFilterData = cFilter.attr('data-filter'); // read filter value

  highlightFilter();
  applyFilter();
});
```

The `click` event checks for the value of our attribute `data-filter` and then proceeds to execute 2 functions, `highlightFilter();` and `applyFilter();`. These two handle the process of highlighting the active filter and displaying/hiding the portfolio items (via the class called `show-workItem`) respectively.

`highlightFilter();` looks like this:

```js
function highlightFilter () {
  var filterClass = 'works-filter-active';
  if (cFilter.hasClass(filterClass)) {
    cFilter.removeClass(filterClass);
    removeActiveFilter(cFilterData);
  } else if (cFilter.hasClass('showAll')) {
    $filters.removeClass(filterClass);
    filtersActive = []; // clear the array
    cFilter.addClass(filterClass);
  } else {
    showAll.removeClass(filterClass);
    cFilter.addClass(filterClass);
    filtersActive.push(cFilterData);
  }
}
```

This function controls/toggles the `works-filter-active` class and does the following:

1. check if the item that triggered the `click` event is an active filter: if yes, remove its active state both visually and via `removeActiveFilter();`
2. check if `All Projects` was clicked: if yes, clear the array of active filters and mark `All Projects` as active filter
3. if the item that triggered the `click` event is a new/additional filter, it will be marked as active and added to the `filtersActive` array

Now, having determined the state of our filters and most importantly the `filtersActive` array, our code proceeds to the function called `applyFilter();` that takes care of showing the right items based on the active filters:

```js
function applyFilter() {
  // go through all portfolio items and hide/show as necessary
  $works.each(function(){
    var i;
    var classes = $(this).attr('class').split(' ');
    if (cFilter.hasClass('showAll') || filtersActive.length == 0) { // makes sure we catch the array when its empty and revert to the default of showing all items
      $works.addClass('show-workItem'); //show them all
    } else {
      $(this).removeClass('show-workItem');
      for (i = 0; i < classes.length; i++) {
        if (filtersActive.indexOf(classes[i]) > -1) {
          $(this).addClass('show-workItem');
        }
      }
    }
  });
}
```

`applyFilter();` goes through `$works`, all elements that have the class `.workItem` assigned to them. It then loops through `classes` (all classes of each respective `workItem`), comparing them to what's currently stored inside the `filtersActive` array. This procedure is basically the "heart" of the filter.

When the array is empty or `All Projects` becomes the active filter, the function shows all portfolio items.

There's still another function that was mentioned above and that's called `removeActiveFilter();`. This one takes care of removing filters from the `filtersActive` array when they're deselected:

```js
function removeActiveFilter(item) {
  var index = filtersActive.indexOf(item);
  if (index > -1) {
    filtersActive.splice(index, 1);
  }
}
```

### Conclusion

Aside from ticking the box in front of a technical requirement on a list and making a friend happy, this filter was also an interesting challenge to myself. I couldn't find any useful instructions or out of the box solutions before starting doing it on my own which might have been due to wrong Google keywords or just bad luck. However, it taught me that despite of more than 10 years of ignoring jQuery and JavaScript, it's slowly coming back.

Anyway, I hope this can prove useful to someone looking for something similar. I created a CodePen Demo that can be found here: {% ext "CodePen", "https://codepen.io/ttntm/full/zyxGXe" %}
