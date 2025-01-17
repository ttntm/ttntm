---
title: Using Netlify Functions as a Back End
slug: using-netlify-functions-as-a-backend
date: 2021-07-24T10:30:00Z
description: Notes on Using Netlify Functions as a Back End for a Web Application.
tags:
  - guide
  - serverless
image: /img/blog/backend.png
---

<img src="/static/img/blog/backend.png" class="img-fluid img-center" alt="Illustration of a back end">

Serverless functions are great - they provide instant superpowers to front end focused developers and they're also quite addictive once you've gotten into using them. There's also a ton of tutorials, proof of concept articles etc. that make it really easy to get started.

Many of these resources, including some of my own, are sometimes missing the aspect of security though. That's probably ok when building a quick demo or proof of concept site, but there's always a chance of that code ending up in production apps. And when considering that serverless functions work just like any other API's endpoints, responding to requests and doing CRUD operations with data, security should probably get mentioned a little more often.

For additional context: the following article is based on the notes and resources I collected when refactoring the serverless back end of one of my side projects. It probably won't end up being a complete tutorial, but it will hopefully provide some helpful information for those looking to secure their serverless functions.

## General Remarks

This article is based on a web application that's built into the Netlify ecosystem. As such, the findings and practices outlined here might end up being helpful in general, but might not apply 1:1 to other services.

Furthermore, I'd like to point out that a lot of excellent information on the topic of serverless functions can be found here: {% ext "github.com/DavidWells/netlify-functions-workshop" "https://github.com/DavidWells/netlify-functions-workshop" %}. It's the most complete resource on the topic I came across and I haven't seen it mentioned quite as much as I thought it deserves to be.

## Architecting a Serverless Back End

When I launched my application's first 'finished version' (side projects never really are...), I basically had a `./functions` folder full of individual files that did CRUD operations. It worked, but it was a bit of a mess to work with.

Adopting the {% ext "REST API pattern" "https://github.com/DavidWells/netlify-functions-workshop/tree/master/lessons-code-complete/use-cases/1-rest-api" %} from the functions workshop mentioned above, I ended up with a central {% ext "api.js function" "https://codeberg.org/ttntm/watch3r/src/branch/master/functions/api.js" %}. That's not just better looking, it also offers some additional benefits:

- Calls from the front end all hit the same endpoint, eliminating possible errors of sending requests to the wrong endpoint and/or having to keep track of all of them somewhere
- User authentication gets verified in one place for all API operations
- Unrecognized HTTP methods get rejected before hitting any 'real' functionality
- Actual functionality is split up into individual files that are much easier to maintain (see: {% ext "./functions/api-methods" "https://codeberg.org/ttntm/watch3r/src/branch/master/functions/api-methods" %}
- If you prefer tidier paths, you could even work with a redirect to change your API's path from `your.app/.netlify/functions/api` to `your.app/api` - see {% ext "this Tweet" "https://twitter.com/Netlify/status/1417937708203249665?s=19" %} for the 'official' recommendation

I'm probably missing some benefits, but that's probably already well worth the effort of refactoring - it was to me at least.

### Users and Authentication

I'm using Netlify Identity for my app's user accounts. Thanks to that, taking care of protecting my API endpoints is basically just making use of built-in functionality. I'm working with `context.clientContext.user` which contains the claims of the respective user. {% ext "Checking that in api.js" "https://codeberg.org/ttntm/watch3r/src/branch/master/functions/api.js#L11-L14" %} (and any other non-public function that's used by the app) makes sure that only authenticated users can use the application. See {% ext "Protecting Endpoints" "https://github.com/DavidWells/netlify-functions-workshop/tree/master/lessons-code-complete/core-concepts/5-authenication" %} for further details and explanations.

PS: you'll have to make sure that your application {% ext "takes care of refreshing user tokens" "https://codeberg.org/ttntm/watch3r/src/branch/master/src/store/modules/user.js#L167-L178" %} (if they're expired) and that it {% ext "sends them along with the requests" "https://codeberg.org/ttntm/watch3r/src/branch/master/src/helpers/shared.js#L12-L28" %} to your API.

### Headers

A good overview: {% ext "Security Headers for a web API" "https://security.stackexchange.com/a/147559" %}

Custom Netlify headers defined in `netlify.toml` (see: [Notes#18](/notes/#18)) will only apply to the HTML responses of requests to your site; functions need to return their own (secure) headers - see: {% ext "Is it possible to fetch a netlify function from another domain" "https://answers.netlify.com/t/is-it-possible-to-fetch-a-netlify-function-from-another-domain/26256/5" %}.

I've opted for adding the basic headers to my functions from a single file, so I can keep things DRY: used as an import from a file like {% ext "_shared/headers.js" "https://codeberg.org/ttntm/watch3r/src/branch/master/functions/_shared/headers.js" %}, it can be used easily in your functions:

```jsx
const fnHeaders = require('./_shared/headers.js');
...
return callback(null, {
	statusCode: 200,
	headers: { ...fnHeaders },
	body: JSON.stringify(apiData)
})
```

That's making sure that the base headers stay the same while there's still enough flexibility to add further headers to individual functions if necessary.

A note on Netlify's event triggered functions (i.e. user signup): they're secured via JSON web signature (JWS) by default: {% ext "docs.netlify.com/functions/trigger-on-events/" "https://docs.netlify.com/functions/trigger-on-events/" %}.

**Where to check Headers:**

- {% ext "observatory.mozilla.org" "https://observatory.mozilla.org/" %}
- {% ext "securityheaders.com" "https://securityheaders.com/" %}

## Conclusion

Working through these notes and transforming a list of bullet points (mostly URLs) into prose might not be up to the same standard as some of the other articles on this site. Nevertheless, I hope that these notes might be useful to someone else out there.

As far as I can tell, following the practices outlined above made my application a better and more secure one than it was before. The code became easier to maintain as well - there's less repetition (i.e. headers) now and also a reduced risk of errors related to endpoints and user authentication.

Please don't hesitate and contact me in case there's something wrong or missing in these notes. 😉
