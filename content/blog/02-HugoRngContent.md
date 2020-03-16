---
title: Random Content from Data in Hugo
slug: hugo-random-content-from-data
weight: -2
type: post
date: 2018-08-21
description: An article about pulling random records from a JSON data file in Hugo and using the same data file to build a page from it.
tags:
    - hugo
    - post
    - howto
tw-image: https://ttntm.github.io/img/blog/default.jpg
---

## Data in Hugo

Hugo comes with the possibility of storing structured content in a data file where it can be pulled from by the template placing it on the site. I've seen this used for things like pricing tables for example. There's quite a bunch of use cases for random content on a website though, from customer references on a company website to quotes of the day for a literary blog. This use case is going to be what the following article is about.

### The Setup

Let's assume we're creating a company or product marketing website. Wouldn't it be nice to display an assortment of customer testimonies, success stories or customer logos there? At best, that content should change over time, so that curious readers and repeat) visitors of your site will be encouraged to check out the hypothetical `/references` section of the site.

For this example, we'll stick to the customer logos, displaying them in a row across the whole page including a link to the `/references` page where we'll display the complete list as a grid.

### The Data

Our customers are going to be stored in a file called `references.json` which we're going to place in Hugo's `Data` folder.

The file's structure is going to look like that:

{{< highlight json >}}

        [
            {
                "custName": "Contoso AG",
                "custDesc": "Absolutely generic products and services.",
                "custLogo": "contosoag",
                "custLink": "https://contoso.com"
            },
            ...
        ]

{{< /highlight >}}

The customer logos are going to be stored in `static/img/cust/`, their file extension should be the same across the board (i.e. all PNG images) and their name should correspond to what's stored as `custLogo` in the JSON file.

If you are going to have many different file extensions, it may be best to store the file name including its extension in your JSON file.

### The Templates

We're going to use 2 kinds of templates, one _partial_ to display the random selection from our data file wherever we see fit and one full template for the `/references` page including all the customer details.

#### The Partial

Our partial's purpose shall be obtaining 6 random customer logos and displaying them in a row next to each other.

The code for this procedure could look like that:

{{< highlight html >}}

        {{- range $i, $content := $.Site.Data.references | shuffle | first 6 -}}
            <div class="col">
                <img class="customer-img" src="/img/cust/{{ $content.custLogo }}.png" alt="{{ $content.custName }}" title="{{ $content.custName }}">
            </div>
        {{ end }}

{{< /highlight >}}

The selection of the random items is going to be triggered by the website build and each new build will create another 6 logos.

A possible implementation of the whole selection, opening with a heading and followed by some button leading to the `/references` page could look like this then:

{{< highlight html >}}

        <div class="row">
                <div class="col text-center">
                    <h2>Customer References</h2>
                    <p>These are only some of our customers...</p>
                    <a href="/references" class="btn">Browse all Customer References</a>
                </div>
            </div>
        </div>
        <div class="row">
            {{- range $i, $content := $.Site.Data.references | shuffle | first 6 -}}
                <div class="col">
                    <img class="customer-img" src="/img/cust/{{ $content.custLogo }}.png" alt="{{ $content.custName }}" title="{{ $content.custName }}">
                </div>
            {{ end }}
        </div>

{{< /highlight >}}

In order to use this newly created partial, we'll store it as `rnd-customers.html` in `/themes/[theme-name]/layouts/partials/` of our Hugo site. After that, it's available wherever we would like to display it using the syntax `{{ partial "rnd-customers.html" . }}`.

#### The Template

Now that we have got our random content, let's see how to build a page from the JSON file as well.

In order to do that, we'll have to make sure that the `/references` page exists. We'll also have to specify a specific template for it in front matter. The markdown file could look like this:

{{< highlight toml >}}

        +++
        title = "References"
        layout = "reference"
        description = "Information regarding our references"
        +++

        ## Reference Customers
        ...

{{< /highlight >}}

The respective template `references.html` is stored in the `/layouts/` folder and looks like that:

{{< highlight html >}}

        {{ partial "head.html" . }}
        {{ partial "header.html" . }}
            <header class="header">
                <!-- Page Header Content -->
            </header>
            <div class="container">
                <!-- Main Content -->
                <div class="row">
                    {{- range $i, $content := $.Site.Data.references -}}
                        {{- $counter :=add $i 1 -}}
                        <div class="col-md-4">
                            <div class="refcard text-center">
                                <img class="img-center" src="/img/klg/{{ $content.custLogo }}.png" alt="{{ $content.custName }}" title="{{ $content.custName }}">
                                <h5>{{ $content.custName }}</h5>
                                <p>{{ $content.custDesc }}</p>
                                <p><a class="reflink" href="{{ $content.custLink }}" rel="noopener" target="_blank">Customer Website</a></p>
                            </div>
                        </div>
                        {{- if modBool $counter 3 -}}<div class="clearfix"></div>{{ end }}
                    {{ end }}
                </div>
            </div>
        {{ partial "contact.html" . }}
        {{ partial "footer.html" . }}

{{< /highlight >}}

In order to have rows of 3 items in a 12 column grid that are equally spaced, I have added the `$counter` that will make sure to add a `<div class="clearfix">` after every 3 items. Depending on the CSS you're using, this may not be necessary - I used Bootstrap 3 in my example above and it was necessary to have each row of 3 customers line up straight.

As you may have noticed, I removed most classes that were not essential for a basic understanding of the concept from the code examples above. So, if you're going to use them, please make sure to check carefully and add the necessary class definitions.

### Conclusion

Working with data in Hugo is a very convenient thing to do, as the examples above may have been able to demonstrate. I'm glad I was able to discover this approach just at the right time - the thought of doing the same thing with jQuery at runtime doesn't seem very appealing to me anymore honestly.