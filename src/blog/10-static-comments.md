---
title: '"Static" Comments with Gulp, Hugo & Netlify'
slug: static-blog-comments-hugo
weight: -10
type: blog
date: 2019-12-15
description: Probably the easiest way of adding comments to your Hugo site.
tags:
    - gulp
    - tutorial
    - hugo
    - javascript
    - netlify
image: /img/blog/code.jpg
---

## "Static" Comments...?

Working for friends and family is always quite a bit of an extra challenge, as "no" generally doesn't count. That's probably how I ended up looking for what I'll call "'static' comments" for now. Sounds weird at first, but refers to comments (= dynamically added feedback/discussion) within the context and technical limitations of a static website.

There's a fair amount of "out of the box" 3rd party services you can use, an overview can be found in the {% ext "Hugo Docs", "https://gohugo.io/content-management/comments/" %}. That's not what I was after though - I wanted something lightweight and free that also conforms with the requirements the GDPR brought along in 2018.

After some extensive research and hours of studying various services' documentations, I came across an article called {% ext "JAMstack Comments", "https://css-tricks.com/jamstack-comments/" %} on css-tricks.com. Lucky for me, that was exactly what I was looking for, even more complex than needed.

So, the following article will describe what I'd summarize as "probably the easiest way of adding comments to your Hugo site". So, taking into consideration that this site also has a comment section now, please feel free to let me know your opinion. 😉

TL;DR - Netlify demo is live at {% ext "comments.ttntm.me" "https://comments.ttntm.me" %}

### Overview

As described in the linked article, this simple "comment engine" basically works based on 3 components:

1. Netlify forms
2. Gulp accessing Netlify via API
3. a static site generator (Hugo in this case)

Here's a compact flowchart detailing the process:

<img src="/img/blog/comment-flow.jpg" class="img-fluid img-center mb2" alt="Flowchart comment engine">

> A more detailed version of this workflow can be found here: {% ext "Static comments with Netlify", "https://bpm.wiki/diagram/Static-comments-with-Netlify-94" %}

### Hugo Configuration

First off, we'll need to add a form to our website in order to collect our comment submissions.

Hugo supports so called {% ext "Partial Templates", "https://gohugo.io/templates/partials/" %} that we're going to use here:

```html
{% raw %}<div class="row mt-3 mb-5">
  <div class="col-sm-12 mt-3">
    <h2>Comments</h2>
  </div>
  <div class="col-sm-12 col-lg-8 offset-lg-2">
    <form name="BlogComments" action="/comment-thanks" method="POST" netlify-honeypot="bot-field" netlify>
      <input name="path" type="hidden" value="{{ .RelPermalink }}">
      <input name="bot-field" type="hidden">
      <div class="form-group">
        <label for="inputName"><h4 class="mb-0">Name</h4></label>
        <input name="Name" type="name" class="form-control" id="inputName" placeholder="John Doe" required>
      </div>
      <div class="form-group">
        <label for="inputEmail"><h4 class="mb-0">Email address</h4></label>
        <input name="Email" type="email" class="form-control" id="inputEmail" placeholder="john.doe@example.com" required>
        <span class="small">Confidential, will not be shared with anyone or published here.</span>
      </div>
      <div class="form-group">
        <label for="inputComment"><h4 class="mb-0">Comment</h4></label>
        <textarea name="Comment" class="form-control" id="inputComment" placeholder="Your comment..." style="height: 150px; resize: none;" required></textarea>
      </div>
      <button type="submit" class="btn btn-primary px-3"><i class="fas fa-comment"></i>&nbsp;&nbsp;Submit Comment</button>
    </form>
  </div>
</div>{% endraw %}
```

_Excerpt of this site's `comments.html`_

The form is based on the requirements for Netlify's form processing found in their docs: {% ext "Forms setup", "https://docs.netlify.com/forms/setup/" %}

>Netlify requires the `action` to be a string starting with a slash - in case of Hugo sites, that means that you need to have `canonifyUrls = "false"` in Hugo's _config.toml_. Otherwise, Netlify won't recognize your form and you're stuck.

(Don't ask how much time went into finding this...)

Keep the `input` named `path` in mind, we'll need that later on. Also, don't forget to include your newly created partial in your respective page's template:

```html
{% raw %}<div class="container">
  <div class="row mt-3">
      <div class="col pt-3 mkd">
          {{ .Content }}
      </div>
  </div>
  {{ partial "blog/meta.html" . }}
  {{ partial "blog/nextprev.html" . }}
  {{ partial "blog/comments.html" . }}
  {{ partial "blog/related.html" . }}
</div>{% endraw %}
```

Once you've deployed your site including the form, Netlify should automatically recognise it and create an entry for it in your account at `app.netlify.com/sites/SiteName/forms`. It will be displayed there using the `<form>` element's `name` property.

Feel free to test it now, we'll need some submissions later on anyway.

There's more to do with Hugo later - we're still missing a section to display the comments. That's easier though, if we have some comments first.

### Netlify Configuration

Your form should now be showing up in Netlify, submissions should also end up there.

Next, head over to Settings -> Build & deploy (app.netlify.com/sites/SiteName/settings/deploys) and create a _Build hook_. You'll have to give it a name and select the branch for it to deploy your site from. Once created, it will provide a unique URL that you can send a POST request to in order to trigger a build.

In app.netlify.com/sites/SiteName/settings/forms you'll find a section called _Form notifications_ that you can use to have Netlify notify you via Email when a new submission arrives. You should also create an _Outgoing webhook_ here, which will send a POST request to your previously created _Build hook_. That means every comment will now lead to rebuild of your site, making sure it shows up where it was posted.

In the original css-tricks article, they also made use of Slack notifications approving/rejecting comments collected by Netlify. I decided not to go down that route and won't be covering that part here. If you'd like to make use of that, just add the respective bits of code where necessary.

By now, you should receive an email notification for new submissions and you should also be able to see your site being rebuilt after each submission.

We need two more things though:

- an API key
- the form ID

To get an API key, head over to app.netlify.com/user/applications and create a new _Personal access token_. Make sure to save that token properly, as it can't ever be displayed again afterwards.

The form ID can be found at app.netlify.com/sites/SiteName/forms. A click on the respective form's name will show its ID in your URL bar. You'll need that for the gulp configuration, so make sure you write it down.

### Gulp Configuration

I'm going to assume that your Hugo site is already working with gulp, as I won't be covering gulp's setup here.

Specific packages you'll need are:

- request
- dotenv

Based on that, `gulpfile.js` starts like this now:

```js
var gulp = require('gulp'),
  ...
  request = require('request'),
  fs = require('fs'),
  config = require('dotenv').config();
```

For `dotenv` to work, we'll need to work with the API key and the form ID from Netlify. Make sure you're in your project's root directory and create a file called `.env`. Don't forget to add it to your `.gitignore` file, as this is merely for local builds/testing and shouldn't be pushed to your (public) repository.

In `.env`, create a line each for your _Personal access token_ and your Netlify form ID.

Mine looks like this:

```bash
API_AUTH=a1b2c3...
COMMENT_FORM_ID=0123456789
```

Now, on to `gulpfile.js` - we'll first add `var buildSrc = "./";`, then proceed to a new gulp task called _get-comments_:

```js
var buildSrc = "./";

gulp.task("get-comments", function (done) {
  // set up the request with appropriate auth token and Form ID
  var url = `https://api.netlify.com/api/v1/forms/${process.env.COMMENT_FORM_ID}/submissions/?access_token=${process.env.API_AUTH}`;
  // get the data from Netlify's submissions API
  request(url, function(err, response, body){
    if(!err && response.statusCode === 200){
      console.log("Submissions found");
      var body = JSON.parse(body);
      var comments = {};
      // shape the data
      for(var item in body){
        var data = body[item].data;
        var comment = {
          name: data.Name,
          comment: data.Comment,
          path: data.path,
          date: body[item].created_at
        };
        // Add it to an existing array or create a new one
        if(comments[data.path]){
          comments[data.path].push(comment);
        } else {
          comments[data.path] = [comment];
        }
      }
      // write our data to a file where Hugo can get it.
      fs.writeFile(buildSrc + "data/comments.json", JSON.stringify(comments, null, 2), function(err) {
        if(err) {
          console.log(err);
          done();
        } else {
          console.log("Comments data saved.");
          done();
        }
      });
    } else {
        console.log("Couldn't get comments from Netlify");
        done();
    }
  });
});
```

`var url` is a template literal making use of our `.env` file and its respective content. Make sure to change that accordingly in case your files entries are named differently.

`fs.writeFile(buildSrc + "data/comments.json",` creates a new JSON file in Hugo's _data_ directory that we'll pull the comments from. If you want your JSON data file to be called differently, change it here. In terms of the GDPR, this file should probably _not_ be available in your (public) repository. It's sufficient to have this as a build-time resource only, i.e. not having a local and/or committed copy of it at all.

You can test this gulp task now - `gulp get-comments` should connect to Netlify successfully and then proceed to create a `comments.json` file in you _data_ directory.

### Displaying the Comments

As mentioned above, the display section for our comments is still missing.

In order to get that done, we're going to make Hugo access our JSON data file, pulling the comments for the respective post out of it and rendering them below the comment form.

```html
{% raw %}{{ $thisPost := .RelPermalink }}
{{ $comments := .Site.Data.comments }}
{{ $.Scratch.Set "counter" 0 }}
{{ range $comments }}
    {{ range . }}{{ if eq .path $thisPost }}{{ $.Scratch.Set "counter" (add ($.Scratch.Get "counter") 1) }}{{ end }}{{ end }}
{{ end }}
{{ if gt ($.Scratch.Get "counter") 0 }}{{/*  only show comment section if there are comments  */}}
  <div class="row mb-5">
  {{ range $comments }}
    {{ range . }}
      {{ if eq .path $thisPost }}
      <div class="col-sm-12 py-3">
        <div class="shadow-sm px-4 py-4">
          <i><span class="small">{{ .name }}</span><span class="small"> on {{ .date | dateFormat "Mon, 02 Jan. 2006, 15:04 MST" }}</span></i>
          <p class="px-3 mt-3 mb-0">{{ .comment }}</p>
        </div>
      </div>
      {{ end }}
    {{ end }}
  {{ end }}
  </div>
{{ end }}{% endraw %}
```

Note that we need `$thisPost` in order to compare the post's permalink to the `path` we stored when the comment was submitted.

Regardless of that, we're going to `range` through the comments twice, first to figure out if there are any and a second time to render them if there are.

The `range` within a `range` construction is necessary because of the array-within-array structure of the JSON file - i.e. an array of the posts and a second array of comments therein.

By now, you should have your posts displayed with a comment form and the respective comments pulled from Netlify based on the `comments.json` file created by gulp.

### Configuring Netlify to Include Gulp

I haven't mentioned it earlier, but we'll have to do one last thing in order to let Netlify know that we'd like to include our gulp task in the build process.

First, head over to your `gulpfile.js` again and create another task:

```js
gulp.task('build', gulp.series('your-other-stuff-if-any','get-comments'));
```

Then, open your `package.json` and make sure to include this task in the `scripts` section:

```js
"scripts": {
    ...
    "deploy": "gulp build && hugo --minify"
},
...
```

Finally, update (or create) your `netlify.toml`:

```yaml
[build]
  publish = "public"
  command = "npm run deploy"
```

Once committed and pushed to the branch your site deploys from, Netlify should process the comments based on your gulp configuration.

### Conclusion

As stated in the introduction, this implementation of a comment engine for a Hugo site is about as lightweight as it can possibly be. However, features like comment moderation etc. that are most likely required for larger sites are missing, as I chose that that's not required for the time being. As described in the css-tricks article though, this can easily be accomplished using Slack and Netlify functions together with the core functionality described here.

Overall, I'd say this is good enough for now and I'm happy to have found a "minimum viable solution".

-

PS: there's a repository in my GitHub account that you can clone and deploy to try all of that yourself: {% ext "GitHub Repo", "https://github.com/ttntm/hugo-comments" %}

The {% ext "demo site", "https://comments.ttntm.me" %} mentioned above is based on the code in that repository.