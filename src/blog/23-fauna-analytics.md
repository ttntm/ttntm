---
title: How to Track Fauna Metrics in Google Sheets
slug: track-fauna-metrics-google-sheets
weight: -23
type: blog
date: 2021-05-10
description: Using Google Sheets and serverless functions to build an automated database reporting service.
tags:
    - Fauna
    - Serverless
image: /img/blog/reporting.png
---

It's been about 6 months since I built and launched {% ext "WATCH3R, an open source movie journal", "https://watch3r.app" %} that's using {% ext "Fauna", "https://dashboard.fauna.com/accounts/register" %} as its database. I kept (and am keeping it) small, so the amount of users and the overall database size is rather manageable. However, the user base is slowly growing and I've become interested in observing the corresponding growth of the application's data over time.

Focusing my development efforts primarily on adding features and functionality, I took care of the data growth observation manually so far (if and when I had the time to think about that). I had nowhere to track my findings either, so what I ended up doing was mostly just looking at my app's data curiously, thinking things like "aah nice, ..." whenever I discovered at a bunch of new rows in a collection (= database table).

Eventually, the idea of tracking these observations somewhere consistently matured and I quickly decided that Google Sheets would be a suitable tool to collect the data. I also thought that it'd be nice to automate this data collection process somehow, so I don't have to take care of it manually.

I proceeded with some research and finished building an automated reporting service 2 evenings later. This service now queries the application's database for metrics and writes them into Google Sheets for tracking and analysis. It's scheduled to run automatically once a week, so I can't forget about it; in fact, I *can* actually forget about it and it still does its job.

But let's get started on the details now: this article is going to provide a high level overview first, followed by implementation details offering code snippets, explanations and links to resources I found helpful.

## Service Overview

Let's start with a flowchart:

<img src="/img/blog/ServiceArchitecture.jpg" class="img-fluid img-center mb1" alt="Flowchart showing the service architecture">

Based on a schedule, automated `POST` requests to the URL the service runs at happens. These requests contain an `action` that determines what logic (database queries, etc.) the service will execute. Finally, the queried information gets transformed and written into a spreadsheet for tracking and further analysis.

From an architectural point of view, the service itself is making use of multiple (micro-) services to get things done. That's not exactly keeping things simple, but it's an approach that's powerful, modular and flexible enough for future growth.

The tools I used to automate the reporting process are:

1. {% ext "IFTTT", "https://ifttt.com" %} for scheduling and making the `POST` requests
2. {% ext "Netlify Functions", "https://functions.netlify.com/playground/" %} as host and runtime environment
3. A Google Spreadsheet as target to collect the reporting data in

The following sections will provide details regarding the setup of each one of these services. The finished code for the reporting service can be found in step 5, but I'm linking it here as well - just in case you'd want to have a look at it right away and/or keep it open while reading on: {% ext "get-app-stats.js@GitHub", "https://codeberg.org/ttntm/watch3r/src/branch/master/functions/get-app-stats.js" %}

## Step 1: Serverless. What Else?

My application's back end functionality was already using Netlify's functions and their identity management service, so deploying the reporting service as a(nother) serverless function was both easy and convenient at the same time; especially considering that the service should be a part of the existing codebase and that it also makes use of some of the existing environment variables.

It may not be obvious immediately, but a serverless function can be used like any other API endpoint once deployed to an URL like `https://app.io/my-function`. That means that your functions = endpoints can respond to any incoming HTTP requests (like `POST`), but it also implies that you should probably take good care of securing them (see {% ext "this tutorial", "https://github.com/DavidWells/netlify-functions-workshop/tree/master/lessons-code-complete/core-concepts/5-authenication" %} for example).

The serverless function I set up as the service's shell looks like this:

```js
exports.handler = async (event, context, callback) => {
	const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET });
  const data = JSON.parse(event.body); // get data from request payload
  const q = faunadb.query;

  if (event.httpMethod !== 'POST') {
    return callback(null, { statusCode: 405, body: 'Method Not Allowed' })
  } else if (!data.action || data.grant !== process.env.GRANT) {
    return callback(null, { statusCode: 400, body: 'Bad Request' })
  } else {
    // actual service logic here
  }
}
```

It's accepting `POST` requests exclusively, responding with a 405 error otherwise. That's explicitly intended; I'm going to make use of `POST` requests to the reporting service's URL when taking care of automating it in step 5 of this article.

The function also checks for `data.action` and `data.grant`, both values that should be coming in as the request's payload. `action` is required to tell the service what to do while `grant` is a security measure that makes sure that only authenticated requests make it through to the service's actual functionality.

## Step 2: Query the Metrics out of Fauna

The data you're going to use for your own reporting service will depend on your database configuration and the respective use case/s - I went for the following two metrics:

1. Collection growth over time
2. Collection growth per user account

I recommend developing and testing your queries in Fauna's web shell, at least until you're satisfied with the result. That makes it much easier to debug the code compared to running it inside a serverless function right away.

{% ext "Collections", "https://docs.fauna.com/fauna/current/api/fql/collections" %} are Fauna's equivalent of tables, essentially containers that store your application's data. Observing their size provides sufficient information for my rather simple use case that you could sum up as: "I'd like to watch my application grow over time".

Getting the collection sizes is not very complicated; there's only 2 lists (= collections with user created content) in the application and there's a handy {% ext "Count", "https://docs.fauna.com/fauna/current/api/fql/functions/count" %} function. I'm using that function to get the amount of items in each collection with the help of an {% ext "index", "https://docs.fauna.com/fauna/current/api/fql/indexes" %}:

```js
const getIndexItemCount = async (indexName) => {
  const req = client.query(q.Count(q.Match(q.Index(`${indexName}`))));
  let response = await req;
  return response;
}
```

The reporting service receives a number from this function which will then be used to create a new row in the Google Spreadsheet.

Querying the collection growth per user is a little more complex - it requires iterating over a list of active user accounts and performing a `Count()` like above for each one of the respective account's lists.

I experimented with a bunch of different approaches (based on {% ext "SQL operations", "https://docs.fauna.com/fauna/current/start/fql_for_sql_users" %}...) but I couldn't really get it to work properly until I came across this discussion: {% ext "SQL group by, having counterpart in Fauna", "https://forums.fauna.com/t/sql-group-by-having-counterpart-in-faunadb/434" %}. It turned out to be an extremely helpful resource that made me get a better understanding of how to approach a query like this in FQL. This is the function I put together based on the linked discussion:

```js
const getUserListSizes = async () => {
  const req = client.query(
    q.Map(
      q.Paginate(q.Match(q.Index('allUsersById'))),
      q.Lambda(
        ['userId'],
        q.Let(
          {
            tracklistCount: q.Count(q.Match(q.Index('tracklist_user'), q.Var('userId'))),
            watchlistCount: q.Count(q.Match(q.Index('watchlist_user'), q.Var('userId')))
          },
          {
            User: q.Var('userId'),
            Tracklist: q.Var('tracklistCount'),
            Watchlist: q.Var('watchlistCount')
          }
        )
      )
    )
  );
  let response = await req; // returns a response like this: '{ data: Object[] }'
  return response.data;
}
```

The query works similar to JavaScript's {% ext "map()", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map" %} Array method: it's based on the index `allUsersById` that contains all active user accounts. It then runs a {% ext "Lambda", "https://docs.fauna.com/fauna/current/api/fql/functions/lambda" %} (= an anonymous function that executes custom code) on each item = user ID in the index and finally returns an array of objects. Inside the Lambda, {% ext "Let", "https://docs.fauna.com/fauna/current/api/fql/functions/let" %} takes care of binding multiple `Count()` statements to a single response object. Doing this makes sure that the query returns one distinct object = table row per user ID and that this row contains the correct count = size for both lists.

## Step 3: Hello Google Sheets API

Access to Google Sheets from within the reporting service is based on this API wrapper for JavaScript: {% ext "github/theoephraim/node-google-spreadsheet", "https://github.com/theoephraim/node-google-spreadsheet" %}. I've also found a lot of useful information on this topic in an article called {% ext "Google Sheets v4 API with Netlify Dev", "https://www.swyx.io/netlify-google-sheets/" %} that's also based on this API wrapper.

Authentication is the first thing to rake care of. I've used the recommended approach of {% ext "connecting to the Google Sheets API as a service account", "https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication?id=service-account" %} and it worked right away.

Make sure you take good care of your service account's credentials and don't forget to add them to the Netlify UI (in case you're using that). Contrary to Shawn's linked article, I dind't use a separate `.env` file in the function's directory - I've added the necessary values for authentication to my application's existing (local) `.env` file instead.

Let's have a look at the service's code now:

```js
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);
// authenticate as Service Account
await doc.useServiceAccountAuth({
  client_email: process.env.GOOGLE_SERVICE_ACCOUNT,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
});
await doc.loadInfo(); // loads document properties and worksheets; required.
```

These lines take care of initializing and authenticating the API connection with the service account's credentials. The `private_key` is matched against a RegEx to process the line breaks; that's taken 1:1 from Shawn's article and might have contributed to things working properly right away (I didn't test for different outcomes when removing it).

With the API set up, the reporting service's code proceeds into a `switch()` statement based on the incoming request's `action`:

```js
switch (data.action) {
  case 'indexSize':
    const listGrowthSheet = doc.sheetsByIndex[0];
    for (const listname of lists) {
      let addedRow = await listGrowthSheet.addRow({
        Date: dateVal,
        List: listname,
        ListItemCount: await getIndexItemCount(`${listname}_all`)
      });
      logger.push({ row: addedRow._rowNumber, data: addedRow._rawData });
    }
    return returnVal()

  case 'userListSize':
    const listSizeUserSheet = doc.sheetsByIndex[1];
    const userListSizes = await getUserListSizes();
		// calculate length in advance for slightly better performance
		//see: https://stackoverflow.com/a/17989524
    let len = userListSizes.length;
    for (let i = 0; i < len; i++) {
      userListSizes[i].Date = dateVal;
      let addedRow = await listSizeUserSheet.addRow(userListSizes[i]);
      logger.push({ row: addedRow._rowNumber, data: addedRow._rawData });
    }
    return returnVal()

  default:
    return callback(null, { statusCode: 400, body: "Unknown action, aborting." })
}
```

The database queries from step 2 get executed from inside the `for(listname of lists)` loop in case of the `indexSize` action or provide input for another `for`-loop in case of the `userListSize` action. The latter `for` is written using older syntax for the sake of slightly better performance (see: {% ext "Performance of for loops with JavaScript", "https://www.incredible-web.com/blog/performance-of-for-loops-with-javascript/" %}).

Both `listGrowthSheet` and `listSizeUserSheet` represent individual sheets in the spreadsheet accessed via their index ({% ext "other options", "https://theoephraim.github.io/node-google-spreadsheet/#/?id=the-basics" %}). The API method `addRow()` then uses these variables to write the data into a new row of the respective sheet.

`logger` and `returnVal()` are ordinary abstractions for code shared across the different `action` routes inside the `switch()` statement.

## Step 4: Testing the Service

The code snippets in the previous sections left out a bunch of things, so you best head over to {% ext "get-app-stats.js@GitHub", "https://codeberg.org/ttntm/watch3r/src/branch/master/functions/get-app-stats.js" %} to have a look at the complete code of the service - just in case you haven't done that already.

I definitely recommend testing the service locally before deploying it to your site - I'm using {% ext "netlify-cli", "https://github.com/netlify/cli" %} for most of my projects which makes functions run locally thanks to {% ext "Netlify Dev", "https://cli.netlify.com/netlify-dev" %}. It's a great tool that makes testing and debugging serverless functions much easier.

Once you've got a local development server running, you can use `cURL` to make `POST` requests to the new function like this:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"action": "test", "grant": "1234"}' http://localhost:8888/.netlify/functions/my-function
```

If you stuck with the verbosity of my code, you should see the values stored in the `logger` variable (or some error) showing up in your terminal window while the function execution gets logged by the running `netlify dev` process in another terminal window (i.e. the one in VS Code).

## Step 5: Automating Requests

There's many ways of sending automated `POST` requests to an endpoint using its URL. Some of the options I considered before making a decision were:

- GitHub actions; something like {% ext "this", "https://github.com/marketplace/actions/fetch-api-data" %} on an {% ext "event that triggers a workflow", "https://docs.github.com/en/actions/reference/events-that-trigger-workflows" %}
    - Not predicatable enough, in terms of a recurring schedule
- {% ext "IFTTT", "https://ifttt.com/" %}
    - Max. of 3 applets = automations for free accounts
- Netlify's {% ext "outgoing webhooks", "https://docs.netlify.com/site-deploys/notifications/#outgoing-webhooks" %}
    - Does *not* allow a custom paypload
- {% ext "Zapier", "https://zapier.com/" %}
    - Triggering webhooks is a premium feature

I chose IFTTT - their free features (max. 3 applets with max. 2 steps each) are enough to send 2 payloads (one for each `action` the service currently performs) to my service every week. I can also use my third free applet for another request in the future, which is cool too.

Working with IFTTT is pretty simple, so I'm not going to cover that in depth here. You basically chose a trigger (a schedule for example) for your applet = workflow and configure a webhook to make a `POST` request (incl. a payload like you did with `cURL`) to the service's URL.

## Summary and Findings

With the final step of automation taken care of, your reporting service should work just like mine now. It'll respond to incoming requests and contribute to filling up your Google spreadsheet with valuable information obtained from your database.

Building this little reporting service was fun and it made me realize once more how powerful serverless (micro-) service architectures can be. There were no mayor headaches and I managed to proceed from an idea to a working service rather quickly.

Using Netlify and its serverless functions is always a great choice that offers a lot of convenience that's far too easy to get used to. I have to admit though that I don't think that their competitors are any less capable of providing a similar experience - I have yet to give Vercel a try, but I already implemented similar architectures successfully with Azure.

Another thing I definitely have to keep in mind is how powerful Fauna's FQL can be. It'll take me a while to learn it properly (instead of bit by bit as I have until now), but I think it will be well worth it to get out of the SQL comfort zone a bit more in the future.

In conclusion, building this little reporting service based on a spontaneous "need" (if you can even call it that...) taught me a bit more about how different services can work together and will certainly set the bar higher for the next time I'll come across a mundane use case that could be automated somehow.