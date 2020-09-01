---
draft: true
title: How I built a serverless recipes app with FaunaDB and Vue.js
slug: serverless-recipes-app-faunadb-vuejs
weight: -18
type: blog
date: 2020-09-02
description: Building a CRUD web application that serves as a personal recipes collection.
tags:
    - Vue.js
    - FaunaDB
    - Serverless
    - Netlify
    - howto
images:
    - /img/blog/vuejs.jpg
---

## Introduction

I had already heard of {{< link-ext "client-serverless architecture" "fauna.com/client-serverless" >}} and read a bunch of articles about the subject when I came up with the idea of creating a {{< link-ext "personal use recipes app" "recept0r.com" >}} earlier this year - I hadn't done anything like that before though.

What I had in mind at this point was a minimal web application that would serve me and my wife as a recipes collection for food that we enjoy cooking. Convenient bonus features like PWA functionality (i.e. using the app on the phone or tablet when standing in the kitchen) and user authentication should be available too, making sure it's not just functional, but also enjoyable to use.

At first, I was tempted to go for a static site + headless CMS approach that worked really well for many other projects I did - it could be considered serverless, but it wouldn't have been a challenge, nor anything I hadn't done before; and that's precisely the reason I went looking for something else, eventually going for Vue.js + FaunaDB for this project.

### Why Fauna?

The first time I came across {{< link-ext "FaunaDB" "dashboard.fauna.com/accounts/register?utm_source=DevTo&utm_medium=referral&utm_campaign=WritewithFauna_ServerlessRecipes_TDoe" >}} was when I was looking for SQL alternatives for a project at work last year. We didn't go for it (PostgreSQL was chosen in the end), but I kept it in mind for the future. Back then, it may have sounded a little "too good to be true" for the majority of the decision makers involved, but marketing statements like "add a global datastore to your app in minutes" and "don't worry about database correctness, sharding, provisioning, latency, or scale" left me with an overall positive impression of their service.

So, when I had to pick a database for my recipes app, I found myself looking at FaunaDB's website again, checking out their {{< link-ext "pricing model" "dashboard.fauna.com/accounts/register?utm_source=DevTo&utm_medium=referral&utm_campaign=WritewithFauna_ServerlessRecipes_TDoe" >}} this time. The "Always Free" plan seemed generous enough to support a small personal use app, so I didn't hesitate much and signed up right away.

To be honest, I didn't really bother looking for alternatives too much - self hosted databases or things like AWS/Azure/Firebase were not quite what I had in mind.

## Basic App Functionality

The recipes app I built can be described as a basic CRUD (create-read-update-delete) application - there's no intense computing or sophisticated algorithms. The recipes are available in read-only mode to the public, whereas creating, editing and deleting them requires an authenticated user (i.e. the author). Other than that, there are smaller convenience features like search, filtering and a dedicated page to see your own recipes.

### Vue App Setup

Vue.js was on my list of “frameworks I’d like to work with” for a while, so the decision of going for it was a rather easy one. If you're looking for some good reasons in favor of using Vue in general, some of them can be found here: {{< link-ext "michaelnthiessen.com/underdog-framework" "michaelnthiessen.com/underdog-framework" >}}

What I ended up building can be described as a classic SPA with multiple routes (i.e. pages) for different functions. For anonymous users, it loads a page of recipe cards that can be searched and an "About" page. Each recipe card can be clicked, which opens its respective details page containing the actual cooking instructions and a nice image. There's a login button that can be used to both sign up and sign in - public signup is currently disabled though, as this is an invite only service at the moment.

Once logged in, registered users get 2 additional routes: "Create" and "My Recipes". As the respective title suggests, these pages can be used to either create additional recipes or to view a sortable list of the current user's recipes. Editing and deleting recipes is a part of each recipe's details page when logged in as the recipe's author.

Each of the app's individual routes=pages was implemented as its own Vue {{< link-ext "SFC" "vuejs.org/v2/guide/single-file-components.html" >}} file, shared functionality (i.e. navbar, toast messages, etc.) makes use of reusable components. To tie it all together, Vue extensions like `vue-router` and `vuex` were used to manage rounting and application state more efficiently - you're welcome to browse the full list of dependencies {{< link-ext "on GitHub" "github.com/ttntm/recept0r/blob/master/package.json" >}} if you're interested in what other packages I used.

### FaunaDB Setup

Setting up a database in FaunaDB is surprisingly easy - log in to your account, create a database and finally create a collection for your data (i.e. recipes). Their {{< link-ext "documentation" "docs.fauna.com/fauna/current/start/cloud" >}} regarding "getting started" is quite good and there's also an interactive tutorial that provides a practical introduction once you signed up.

As FaunaDB is schema-less and close to zero-config, the structure of my app's data organically grew from its needs. An example can probably help to clarify what I mean here: initially, I didn't really think much about where to store the images for the recipes. FaunaDB is technically able to store Base64 encoded images inside the recipe objects, so I went for that approach initially. As images tend to be large though, this inflated my database, added a lot of bandwidth consumption and crippled loading times on top of that - I can assure you that it's not a good idea (also {{< link-ext "not recommended" "docs.fauna.com/fauna/current/api/fql/documents#limits" >}} by FaunaDB themselves).

That's not the point though - my app wrote the Base64 images into the database without any specific configuration and later [replaced them with links to the actual images](/blog/how-to-use-cloudinary-with-vue-app/) just like that as well. FaunaDB simply adjusts to the data you provide, even if not all data inside a collection has the same set of properties (i.e. some recipes with picture, others without).

**To sum it up**: as far as my rather simple application is concerned, FaunaDB was quick and easy to set up and configure, no matter what data I provided or how I ended up transforming and manipulating it.

## Serverless Functionality

It would have been possible to implement the necessary database operations directly in the Vue app (see {{< link-ext "Fauna's JS driver" "docs.fauna.com/fauna/current/drivers/javascript.html" >}}, but that would have been a severe security concern. I decided to add a 3rd layer here, forcing database operations to go through Netlify functions. These serverless functions provide a clear separation of concerns and added security for the database access token.

But what are Netlify functions?

Here's an explanatory paragraph from {{< link-ext "their website" "functions.netlify.com" >}}:

> Functions are scripts that you write and deploy with Netlify. The function’s code is hidden from the public, but you can interact with it just like any other API service.

For my app, I am using a couple of these functions for what would otherwise have to be backend or server-side functionality - more specifically for all database operations and user identity management (via {{< link-ext "Netlify Identity" "docs.netlify.com/visitor-access/identity" >}}).

### Local Development Configuration

It was my first time using Netlify functions and as such, I based my choice of Node modules and configuration on seemingly outdated information; my functions returned errors instead of data…

After some hours of less successful trial and error cycles, I stumbled upon this article recommending the `netlify-cli` module: {{< link-ext "Solve CORS once and for all with Netlify Dev" "alligator.io/nodejs/solve-cors-once-and-for-all-netlify-dev" >}}

So, if you’re going to use Netlify functions, this is as good as it gets - really simple configuration and immediate success. Just keep in mind or bookmark `localhost:8888` - your terminal output (based on Vue CLI and Webpack) will continue to direct you to port 8080 instead where functions don't work and none of the success is visible.

### User Authentication

The user signup and login procedures I used for my app are based on a library called {{< link-ext "gotrue-js" "github.com/netlify/gotrue-js" >}} that in itself "is a client library for the {{< link-ext "GoTrue" "github.com/netlify/gotrue" >}} API" (both by Netlify).

> GoTrue is a small open-source API written in golang, that can act as a self-standing API service for handling user registration and authentication for JAM projects.

On top of that, large parts of the code I used for my app's user authentication process are based on {{< link-ext "this repository" "github.com/chiubaca/vue-netlify-fauna-starter-kit" >}} where `gotrue-js` was successfully implemented for a Vue.js based application. A truly helpful resource indeed.

### Functions

With both the Vue app and the FaunaDB instance up and running, the following serverless functions can be considered the app's backbone. To make them work, FaunaDB's JavaScript Driver, the client secret and {{< link-ext "Fauna Query Language" "docs.fauna.com/fauna/current/api/fql/" >}} are used.

#### Read Recipes from the Database

Recipes are stored in the database as an array of JSON data. In order to display those recipes to the app's users, they have to be obtained from the database when one of these things happens:

1. User navigates to the app's front page
2. User navigates to an individual recipe's details page
3. User navigates to the "My Recipes" page

These cases are implemented as a separate Netlify function each. First, we'll have a look at the function called `all-recipes.js`:

{{< highlight js >}}
const faunadb = require('faunadb');

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
})

exports.handler = (event, context, callback) => {
  console.log("Function `all-recipes` invoked")
  return client.query(q.Paginate(q.Match(q.Ref("indexes/all_recipes"))))
  .then((response) => {
    const recipeRefs = response.data
    console.log("Recipe refs", recipeRefs)
    console.log(`${recipeRefs.length} recipes found`)
    const getAllRecipeDataQuery = recipeRefs.map((ref) => {
      return q.Get(ref)
    })
    return client.query(getAllRecipeDataQuery).then((ret) => {
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(ret)
      })
    })
  }).catch((error) => {...})
}
{{< /highlight >}}

Once a connection is established, the function queries for the `all_recipes` index (manually generated for the recipes collection when setting up the database) which returns a {{< link-ext "Page" "docs.fauna.com/fauna/current/api/fql/functions/paginate?lang=javascript" >}} of results. These results - essentially an array of recipe IDs - are then processed by the function `getAllRecipeDataQuery()` which eventually returns an array of all recipes complete which each one of their individual properties (name, description, image, etc.).

The Netlify function `recipe-get.js` queries the database for a single recipe and looks like this:

{{< highlight js >}}
const faunadb = require('faunadb');

function getId(urlPath) {
  return urlPath.match(/([^\/]*)\/*$/)[0]
}

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
})

exports.handler = (event, context, callback) => {
  const id = getId(event.path)
  console.log(`Function 'recipe-get' invoked. Read id: ${id}`)
  return client.query(q.Get(q.Ref(`collections/recipes/${id}`)))
  .then((response) => {
    console.log("success", response)
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(response)
    })
  }).catch((error) => {...})
}
{{< /highlight >}}

Loading a single recipe's details page depends on the respective recipe's ID. That's why there's the function `getId()` which essentially extracts the ID from the request URL. With that ID, the function then checks the recipes collection for the matching recipe data and returns that as JSON.

In order to save database read operations, I set up Vuex in a way that caches the recipes (in local storage) whenever `all-recipes.js` is executed. That means, that if a user visits the app's front page and then proceeds to view a certain recipe's details page, only one database query is necessary. The recipe's details get returned by Vuex from the data available in local storage.

If a user decides to view a list of their own recipes, `all-recipes-user.js` gets executed:

{{< highlight js >}}
const faunadb = require('faunadb');

function getUsr(urlPath) {
  return urlPath.match(/([^\/]*)\/*$/)[0]
}

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
})

exports.handler = (event, context, callback) => {
  const usr = getUsr(event.path)
  console.log("Function `all-recipes-user` invoked")
  return client.query(q.Paginate(q.Match(q.Index('recipes_by_owner'), `${usr}`)))
  .then((response) => {
    const recipeRefs = response.data
    console.log("Recipe refs", recipeRefs)
    console.log(`${recipeRefs.length} recipes found`)
    const getAllRecipeDataQuery = recipeRefs.map((ref) => {
      return q.Get(ref)
    })
    return client.query(getAllRecipeDataQuery).then((ret) => {
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(ret)
      })
    })
  }).catch((error) => {...})
}
{{< /highlight >}}

The correct (=current) user is included in the function call and then used as the variable for the index `recipes_by_owner`. FaunaDB uses indexes for the "retrieval of documents by attributes other than their References" (see: {{< link-ext "Indexes" "docs.fauna.com/fauna/current/api/fql/indexes?lang=javascript" >}}). That means that you can use them to implement search within the records stored in your collection (based on pre-defined parameters, i.e. the username).

In my FaunaDB dashboard, this specific index looks like this:

<img src="/img/blog/fauna-dashboard.png" class="img-fluid img-center mb2" alt="Upload Manipulations">

The rest of this Netlify function follows the same logic as `all-recipes.js` described above and eventually returns an array of recipes belonging to the current user that gets displayed on the "My Recipes" page of the app. If the user just came from the front page (and Vuex has a current local version of all recipes), the app saves bandwidth and displays the cached data instead of executing the function.

#### Write Recipes to the Database

This Netlify function called `recipe-create.js` handles database writes that happen when authenticated users create and save new recipes:

{{< highlight js >}}
const faunadb = require('faunadb');

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
})

exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body)
  console.log("Function `recipe-create` invoked", data)
  const newRecipe = {
    data: data
  }
  return client.query(q.Create(q.Ref("collections/recipes"), newRecipe))
  .then((response) => {
    console.log("success", response)
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(response)
    })
  }).catch((error) => {...})
}
{{< /highlight >}}

Adding new recipes is accomplished by `q.Create` (see {{< link-ext "Create" "docs.fauna.com/fauna/current/api/fql/functions/create?lang=javascript" >}}) and the recipe's data included in the function call. The response contains the newly created recipe's ID and the Vue app is using that to automatically navigate to the new recipe's details page (if the create operation was successful).

#### Update Existing Recipes

Whenever an authenticated user decides to edit one of their recipes, the data stored in the database has to be updated as well. The Netlify function called `recipe-edit.js` is responsible for doing exactly that:

{{< highlight js >}}
const faunadb = require('faunadb');

function getId(urlPath) {
  return urlPath.match(/([^\/]*)\/*$/)[0]
}

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
})

exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body)
  const id = getId(event.path)
  console.log(`Function 'recipe-edit' invoked. update id: ${id}`)
  return client.query(q.Update(q.Ref(`collections/recipes/${id}`), {data}))
  .then((response) => {
    console.log("success", response)
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(response)
    })
  }).catch((error) => {...})
}
{{< /highlight >}}

Much like `recipe-get.js`, this function works with the respective recipe's ID (based on its URL) in order to find the correct record to update. The data sent into the function is the complete updated recipe object, but keep in mind that in FaunaDB, "Updates are partial, and only modify values that are specified in the param_object" (see {{< link-ext "q.update" "docs.fauna.com/fauna/current/api/fql/functions/update?lang=javascript" >}}).

#### Delete Existing Recipes

Probably the least used Netlify function; `recipe-delete.js` does exactly what its name suggests - it permanently deletes existing recipes from the database:

{{< highlight js >}}
const faunadb = require('faunadb');

function getId(urlPath) {
  return urlPath.match(/([^\/]*)\/*$/)[0]
}

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
})

exports.handler = (event, context, callback) => {
  const id = getId(event.path)
  console.log(`Function 'recipe-delete' invoked. delete id: ${id}`)
  return client.query(q.Delete(q.Ref(`collections/recipes/${id}`)))
  .then((response) => {
    console.log("success", response)
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(response)
    })
  }).catch((error) => {...})
}
{{< /highlight >}}

Deleting recipes requires the recipe's ID (again...) and doesn't really do much else. Function failures result in the recipe not being deleted; the app displays a toast message in that case and stays on the respective recipe's details page. Otherwise (successful delete operation), it forcefully navigates the user to the front page.

#### That's it?

Indeed, the function to delete recipes concludes the serverless "backend" functionality. If we ignore user identity management, everything else like search, filters and sorting is done client-side only and doesn't involve the database (yet).

## Summary and Outlook

Considering that this was my first "real" application (not counting tutorial ToDo apps...) built with this tech stack, I'd like to mention that it was an overall pleasant and reassuring (learning) experience. Yes, there were a few times that exhaustion, frustration and tunnel vision occurred, but I guess that's just normal. None of these "little things" made me regret my choices and all of them were eventually resolved by reading the docs (again) or simply having some rest and having another go at it the next day.

The cloud services I used for this project (Cloudinary, FaunaDB and Netlify) all have a very generous free tier without any noticeable throttling or service restrictions. That means, that as of writing this, I haven't had to pay a single cent to keep my application online and functional. However, this may change if the app's ever going to be publicly accessible (i.e. anyone being able to sign up for an account). Right now, there's only a handful of users, basically no SEO and (probably) hardly any traffic (there's no analytics service running and I don't plan on adding one).

In terms of **future improvements**, I definitely see the amount of data (=recipes) as a key "risk" over time. If you read until here, you'll probably know that my app's currently loading *all* recipes whenever navigating to the front page. It's still really fast, but there's only 12 recipes at the moment. A growth in content over time will probably have me working on either infinite scroll or pagination, which in turn will require a "real" (database) search function (instead of the simple `filter()` I'm currently using. Other than that, there's probably going to be some sort of import/export of recipe data at some point and maybe also a larger refactoring effort when Vue 3.0 is officially released (announced as Q3 2020 as of writing this article).

A final remark: there are a lot of helpful resources out there that supported me when getting started with this project. I myself ended up [writing about my learning experience](/blog/vuejs-getting-started-in-2020/) too, which might offer some guidance to anyone out there doing something similar at the moment or trying to get started with (any of) the services and tools I used for this application.

**The tech stack the app's based on:**

- Cloudinary
- FaunaDB
- Netlify (Hosting, Functions & User Identity)
- Vue.js