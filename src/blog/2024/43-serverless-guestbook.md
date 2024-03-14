---
title: How to Build a Serverless Guestbook
slug: how-to-build-a-serverless-guestbook
date: 2024-03-04
description: An article about building a serverless guestbook for a static website.
tags:
  - eleventy
  - guide
  - serverless
image: /img/blog/guestbook.png
---

I recently started working on a new side project, BUKMARK.CLUB, which I introduced in the [previous article](/blog/bukmark-club-intro/) published here on this website. The MVP launched with a couple of open feature requests, and one of them was adding a guestbook, which I already implemented in the meantime.

So, this article is going to guide you through the process of building a serverless guestbook for a static website.

<img src="/img/blog/guestbook.png" class="img-fluid img-center" alt="A guestbook illustration taken from undraw.co">

## Definitions

Let's start with some definitions:

- _build_ - the process of converting source code into a static website
- _guestbook_ - a way for visitors to leave a little "I was here" comment and/or feedback about a website
- _persistence_ - a means to store data reliably, usually a database
- _serverless_ - means "not running on your own web server" in this article's context
- _static website_ - a web page that is delivered to a web browser exactly as stored, i.e. not a web application, no islands or hydration

### Data Flow

On a high level, the data flow that fills our guestbook looks like this:

1. A user enters their data into a form with the intention of leaving their comment in the guestbook
2. The form is posted to a backend service that handles the submitted data
3. The submission gets reviewed and approved, or handled in another way (i.e. deleted, ignored)
4. When approved: the submission gets published in the guestbook

## Functionality

Our static website will have to provide the necessary functionality to support the data flow outlined above. This example is based on Eleventy, but other SSGs (static site generators) should offer similar functionality.

Some years ago, I also wrote an article about comparable functionality using Hugo: ["Static" Comments with Hugo](/blog/static-blog-comments-hugo/). It's been a while, but I think that most of it is still applicable today, so it might offer an idea of where to start.

### Submissions

We need a way to collect submissions - a `<form>` it is:

```html
<form action="/my-site/success" method="POST" name="my-guestbook" netlify>
  <input type="hidden" name="form-name" value="my-guestbook">
  <input type="hidden" name="subject" value="New Guestbook Entry (%{submissionId})">
  <div>
    <label for="sa">Name</label>
    <input id="sa" name="name" type="text" required>
  </div>
  <div>
    <label for="eml">Email Address</label>
    <input id="eml" name="email" type="email">
  </div>
  <div>
    <label for="ws">Website</label>
    <input id="ws" name="website" type="url">
  </div>
  <div>
    <label for="msg">Message</label>
    <textarea id="msg" name="message" required></textarea>
  </div>
  <button type="submit">Send Message</button>
</form>
```

In this example, the attributes `class`, `placeholder`, etc. were removed, and what remains is a bare minimum of functional HTML. The full version of the code that the above snippet was taken from can be found at GitHub: {% ext "bukmark.club/src/join.njk", "https://github.com/ttntm/bukmark.club/blob/main/src/join.njk" %}.

Functionally, the form is nothing special: there are two required fields, `name` and `message`, and the other two fields are optional. We manually review and approve each submission, so offering submissions to people who might not want to share their email address is perfectly acceptable.

The attribute `method="POST"` means that the submitted data is posted directly to the site that the form is displayed on. The next section will provide details about what's happening with this data.

### Form Handler

In the first line of the form above, we see a `netlify` attribute on the `<form>` tag. {% ext "Netlify forms", "https://docs.netlify.com/forms/setup/" %} allows managing forms without extra API calls or additional JavaScript, which is very convenient for our use case. Other services might offer similar features, i.e. Cloudflare's {% ext "handling form submissions with Pages Functions", "https://developers.cloudflare.com/pages/tutorials/forms/" %}, and putting together your own form handler in any language / at any service you want to use is also a perfectly viable approach.

I'm using Netlify Forms for convenience reasons: it doesn't just handle the submissions, it also offers persistence (i.e. storage), so we don't have to take care of that ourselves. Email notifications are also part of the provided functionality.

If you take an(other) look at the form above, you'll see an `<input>` with `name="subject"`. It's set to `type="hidden"` and its value is used to define the email notification's subject line. I'm using the auto-generated `%{submissionId}` variable to get a unique numerical value for every submission, which is eventually going to be used for a whitelist.

**A word reg. Netlify**: it's definitely not an undisputed choice these days, and I'd advise that you do your research, but I've never had any issues with their service (free tier since 2018). My choice for an alternative to what they're offering would be a serverless function (AWS, CF, Azure etc.) that writes submissions into a database (i.e. Fauna) and uses some email API service (i.e. Mailgun, SendGrid) to notify me.

### Obtaining the Data

Our site has a form for submissions now and we should be receiving them successfully, followed by an email notification. That leaves us with one last to do: rendering the guestbook entries for everyone to see! 🤖

Netlify offers {% ext "an API", "https://docs.netlify.com/api/get-started/#forms" %} for that at `GET /api/v1/forms/{form_id}/submissions`. We need a personal access token to use the API though. See {% ext "Authentication", "https://docs.netlify.com/api/get-started/#authentication" %} for all necessary details.

Once that's been taken care of, you should be able to use your favorite API client (or good old `curl`) to get submissions from the API. An example of the response can be found in the docs at {% ext "", "https://docs.netlify.com/api/get-started/#get-verified-submissions" %}, but here's one of mine for your convenience:

```json
[
  {
    "number": 1,
    "title": "Tom",
    "email": "redacted",
    "name": "Tom",
    "first_name": "Tom",
    "last_name": null,
    "company": null,
    "summary": "<strong>Tom</strong> First. Have fun signing the Guestbuk everyone :)",
    "body": "First. Have fun signing the Guestbuk everyone :)",
    "data": {
      "subject": "New Guestbuk Entry (%{submissionId})",
      "name": "Tom",
      "website": "https://ttntm.me",
      "email": "ttntm@pm.me",
      "message": "First. Have fun signing the Guestbuk everyone :)",
      "ip": "redacted",
      "user_agent": "redacted",
      "referrer": "https://bukmark.club/guestbuk/"
    },
    "created_at": "2024-02-25T16:55:15.677Z",
    "human_fields": {...},
    "ordered_human_fields": [...],
    "id": "65db70f3ab...",
    "form_id": "65db6f29df98...",
    "site_url": "https://bukmark.club",
    "site_name": "bukmarkclub",
    "form_name": "guestbuk"
  }
]
```

We really only care for the `data` key, so I've collapsed some duplicated values in `human_fields` and `ordered_human_fields` respectively.

Next, we're going to use the handy {% ext "eleventy-fetch plugin", "https://www.11ty.dev/docs/plugins/fetch/" %} to make the form submissions returned by the API available through a {% ext "Global Data File", "https://www.11ty.dev/docs/data-global/" %}:

```js
const config = require('dotenv').config()
const eleventyFetch = require('@11ty/eleventy-fetch')

const whitelist = []

module.exports = async function() {
  let reqUrl = `https://api.netlify.com/api/v1/forms/${process.env.NTL_GUESTBUK}/submissions`
  let response = await eleventyFetch(reqUrl, {
    directory: '.cache',
    duration: '1d',
    type: 'json',
    fetchOptions: {
      headers: {
        Authorization: `Bearer ${process.env.NTL_TOKEN}`
      }
    }
  })

  if (response && response?.length > 0) {
    const data = response
      .filter((entry) => whitelist.includes(entry.number))
      .map((entry) => {
        return {
          ...entry.data,
          created: entry.created_at
        }
      })

    return data.length > 0
      ? data
      : []
  } else {
    return []
  }
}
```

This code is stored in `./src/_data/guestbook.js` and is pretty much as "by the <s>book</s> docs" as it can be.

All private configuration is pulled in from environment variables. They should be stored in an _untracked_ local `.env` file and configured in the Netlify UI for your builds. See {% ext "Environment variables overview", "https://docs.netlify.com/environment-variables/overview/" %} for all necessary details.

There's a `const whitelist = []` at the beginning of the code that determines which guestbook entries should be published. It allows us to add individual `%{submissionId}` values which correspond to the `number` keys in the API response. A `filter()` then takes care of applying the whitelist, followed by a `map()` call that extracts only the necessary data from the submissions returned by the API.

Implementing a whitelist like that offers the 0 config benefit of automatic rebuilds whenever you push whitelist changes to your deployment branch. It's the most intuitive approach for a manual review and approval of guestbook submissions that I could come up with, simply because it's the exact same workflow you're using for all other website maintenance.

### Rendering

With that taken care of, we can proceed and render our guestbook entries:

```html
{% raw %}
{% if guestbook | length %}
  <h2>Guestbook Entries</h2>
  <section>
    {% for item in guestbook %}
      <article>
        <div>
          <p>
            {% if item.website %}
              <a href="{{ item.website }}" rel="noreferrer" target="_blank">
                {{ item.name }}
              </a>
            {% else %}
              {{ item.name }}
            {% endif %}
          </p>
          <p>
            <time>{{ item.created | formatDate }}</time>
          </p>
        </div>
        <p>
          {{ item.message }}
        </p>
      </article>
    {% endfor %}
  </section>
{% endif %}
{% endraw %}
```

It's a pretty simple loop that renders the guestbook entries contained in the `guestbook.js` data file. `if guestbook | length` makes sure that the whole "Guestbook Entries" section gets hidden when there's nothing to show. We also have to check for `item.website` explicitly, because it's an optional field in the guestbook form and we'd be risking broken links otherwise.

## The Result

If everything works out as described, you should have a brand new guestbook on your static website after a couple of hours. It definitely helps though, if you're familiar with serverless architecture and the individual bits and pieces working together here.

I haven't added a guestbook to this website, and I'm not sure I ever will. However, there's a guestbook over at the {% ext "BUKMARK.CLUB", "https://bukmark.club" %} that you're welcome to leave a comment at. That's also where the code samples used in this article were taken from. Feel free to explore the source code over at GitHub: {% ext "ttntm/bukmark.club", "https://github.com/ttntm/bukmark.club" %}.
