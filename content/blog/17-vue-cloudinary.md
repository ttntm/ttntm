---
title: How to use Cloudinary with your Vue app
slug: how-to-use-cloudinary-with-vue-app
weight: -17
type: blog
date: 2020-08-05
description: A zero dependency approach for image management from within a Vue.js application.
tags:
    - Vue.js
    - Cloudinary
    - images
    - howto
images:
    - /img/blog/code.jpg
---

My Vue app needed user uploaded images; storing Base64 encoded images inside of FaunaDB was my first idea, but that proved both slow and resource heavy (which is probalby why Fauna's docs {{< link-ext "advise against" "docs.fauna.com/fauna/current/api/fql/documents#limits" >}} doing that...).

Taking into consideration that a recipe app's images will hardly ever change, an image CDN seemed more appropriate. I had already heard of Cloudinary somewhere, so I decided to try that service. They offer a generous free tier that can even be extended (permanently!) by inviting other people; here we go, just in case you'd like to check it out and do something nice for me at the same time (in case you end up signing up for an account there): {{< link-ext "Cloudinary invite" "cloudinary.com/invites/lpov9zyyucivvxsnalc5/hrdkuf3mpvpupvr4vdh9" >}}

## Getting Started

This guide assumes that you've got a Vue.js application configured and running. I won't cover much of the app's setup or architecture here, but you could head over to another article I wrote about [getting started with Vue.js](/blog/vuejs-getting-started-in-2020/) to get a better understanding of the app this approach is based on.

### The App and its Data

Let's talk about our starting point: we've got a CRUD application that stores data in a database. The data itself is an array of objects with properties; each one of them can be manipulated by the app's users. One such property is called `image` and should contain an URL to an image resource hosted on Cloudinary. In our app, the respective piece of content (i.e. a recipe) can then be presented with a nice looking image.

### Cloudinary Image Upload

There's multiple ways of uploading images to your Cloudinary account; I needed something that works with a serverless app and I didn't want to install any dependencies - I wanted my app to send a `POST` request to an URL and be done with it.

This approach is called *unsigned upload* and you can {{< link-ext "read all about it in their documentation" "cloudinary.com/documentation/upload_images#unsigned_upload" >}}. Yes, there could be security concerns obviously - you might want to take another approach here if you're working on something with public image upload for example. My semi private app has only got a few users, there's no public image upload and therefore no security concerns that would outweigh the benefits of using unsigned uploads.

Before taking a look at the implementation, you should take a moment to think about how you'd like to process your uploaded images. Users shouldn't really be expected to have image processing software available that could crop and compress whatever photo they took with their phone to some predefined limits. Our app needs optimized images though, and that's why I recommend using so called *Upload Manipulations* - Cloudinary doesn't just offer image storage, they also offer image processing - very convenient.

If you had a look at the linked documentation, you probably came across the term *upload preset* already - that's basically an ID that can has to be referenced when communicating with the API that tells Cloudinary what to do with your image, including these manipulations (see: {{< link-ext "Cloudinary docs" "cloudinary.com/documentation/upload_presets" >}}).

<img src="/img/blog/cloudinary-manipulations.png" class="img-fluid img-center mb2" alt="Upload Manipulations">

As you can see, I'm auto converting anything that comes in to `webp`. Images also get resized to `w_1280` and compressed with `q_auto:good` - the result is good looking images at reasonable file size (= faster page loads) and big enough dimensions.

## Implementation

Now that we know what we want and can do with Cloudinary, let's look at how this can be implemented in Vue.

The image upload component I built had to work for both creating and editing recipes in my app; that's 2 individual routes and also 2 separate SFCs ({{< link-ext "Single File Components" "vuejs.org/v2/guide/single-file-components.html" >}}) due to different layouts and functionality.

### Component Setup

This is how the initial setup of the component's `<script>` section looks like:

{{< highlight js >}}
export default {
  name: "recipe-image",
  props: {
    recipe: Object
  },
  data() {
    return {
      imageStatus: {
        type: "",
        body: ""
      },
      uPreset: process.env.VUE_APP_CDNRY_UPRESET
    };
  },
  computed: {
    isUploaded() {
      const checkImgSrc = RegExp(/^https:\/\//);
      return checkImgSrc.test(this.recipe.image);
    },
  },
  methods: {...}
};
{{< /highlight >}}

As you can see, the component inherits the `recipe` object from its respective parent (create or edit). It only has an object `imageStatus` and the upload preset `uPreset` necessary for Cloudinary in its own `data()` function, both of which are used inside the component itself exclusively. There's also a {{< link-ext "computed property" "https://vuejs.org/v2/api/#computed" >}} that checks whether or not a recipe's image was uploaded already.

We'll get into the actual functionality in a minute, let's first have a look at the HTML in the `<template>` section though:

{{< highlight html >}}
<template>
  <div id="edit-image">
    <div v-if="!recipe.image" class="...">
      <label class="...">
        <svg class="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
        </svg>
        <span class="...">Select Image</span>
        <input
          @change="addImage"
          class="hidden"
          type="file"
          accept="image/*"
        />
      </label>
    </div>
    <p
      v-if="imageStatus.type !== ''"
      v-html="imageStatus.body"
      class="text-sm ml-4 mb-4"
      :class="{
        'error': imageStatus.type === 'error',
        'text-blue-500': imageStatus.type === 'info',
      }"
    />
    <div class="...">
      <button @click="uploadImage" v-blur class="btn btn-green">Upload Image</button>
      <button v-if="recipe.image" @click="removeImage" v-blur class="btn btn-red">Remove Image</button>
    </div>
  </div>
</template>
{{< /highlight >}}

I've used Tailwind CSS for my app and the `<input type="file">` is based on this component I found online: {{< link-ext "tailwind-file-upload" "tailwindcomponents.com/component/tailwind-file-upload" >}}

The `<inpu>` is wrapped in a `<div>` and there's a `v-if="!recipe.image"` in there which makes sure that it is only shown when there's no image (=URL to an image) set for the respective recipe. This is also related to the "Remove Image" button in the bottom of the code snippet that is only shown when there is an image. The flow for the user could look like this:

1. Use the `<input>` to select an image
2. See the image now (inserted and displayed based on the code of the parent (create or edit) component); shown instead of the previously displayed `<input>` element
3. Decide whether to upload or change (=remove; `<input>` would come back) the image

In order to prevent errors and misunderstandings, there's also a conditional `<p>` that displays status messages to the user. The messages are coming from the component's methods `addImage`, `removeImage`, and `uploadImage` which we'll have a look at now.

### Component Methods

Our component is observing the file input for changes with `@change="addImage"` which in turn triggers the `addImage(e)` method:

{{< highlight js >}}
addImage(e) {
  const selectedImage = e.target.files[0]; //get the first file
  if (selectedImage) {
    const reader = new FileReader();
    reader.onload = e => {
      this.$emit("image:update", e.target.result);
      this.imageStatus.type = "info";
      this.imageStatus.body = 'Image received, please press "Upload Image" now.';
    };
    reader.readAsDataURL(selectedImage);
  } else {
    // cancel if there's no image or if the image is removed
    return;
  }
}
{{< /highlight >}}

This method uses the {{< link-ext "File Reader API" "developer.mozilla.org/en-US/docs/Web/API/FileReader" >}}, more specifically {{< link-ext "readAsDataURL()" "developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL" >}} which returns a `data:` URL representing the file's data. This image data is then emitted to the image uploader component's parent component with the line `this.$emit("image:update", e.target.result);` which means that the image can both be stored in the respective recipe object and displayed; we'll have a quick look at this part of the parent component's code later.

The lines referring to `this.imageStatus` are responsible for displaying the respective status messages to the user; in this case, the app's letting the user know that the image was received and is waiting for a click on the "Upload Image" button.

Then there's the `removeImage()` method, undoing what we just saw:

{{< highlight js >}}
removeImage() {
  if (this.recipe.image) {
    this.$emit("image:update", null);
    this.imageStatus.type = "info";
    this.imageStatus.body = "Image removed.";
  } else {
    this.imageStatus.type = "error";
    this.imageStatus.body = "Please select an image first";
  }
}
{{< /highlight >}}

This method is as simple as it looks, replacing the recipes' image with `null` and therefore making the image uploader component's `<input>` element to come back. The status messages are speaking for themselves, again notifiying the user of what's happening. The `else {}` path is in there just in case - it's more than unlikely to ever be reached due to the `v-if` on the "Remove Image" button (i.e. the button only being dsiplayed when there is an image).

Now that we know how to add and remove images locally, let's have a look at the `uploadImage()` method that actually handles the image upload to Cloudinary:

{{< highlight js >}}
uploadImage() {
  const vm = this;
  function postImage(data) {...}
  if (this.recipe.image && !this.isUploaded) {
    let spinner = require("@/assets/loading.svg");
    this.imageStatus.type = "info";
    this.imageStatus.body = `<img src="${spinner}" class="..."><span class="...">Uploading...</span>`;

    let uData = new FormData();
    uData.append("upload_preset", this.uPreset);
    uData.append("tags", this.recipe.id);
    uData.append("file", this.recipe.image);

    postImage(uData).then(response => {
      // check for the response first - otherwise the current data: image
      // would be cleared and set to an error response, forcing the user have to select it again
      if (response) {
        let temp = Object.assign({}, response);
        this.$emit("image:update", temp.secure_url);
      }
    });
  } else {
    if (this.isUploaded) {
      this.imageStatus.type = "error";
      this.imageStatus.body = "This image was uploaded already. Please remove it first if you want to change it.";
    } else {
      this.imageStatus.type = "error";
      this.imageStatus.body = "Please select an image first";
    }
  }
}
{{< /highlight >}}

We have got a method with a nested function here which is why that `const vm` is necessary - it passes down Vue's `this` into the function `postImage()`.

If we have an image for a recipe which has not been uploaded already (i.e. in case of editing existing recipes), we'll format the data for the Cloudinary API (yes, it needs `FormData()` which took me a minute to figure out...) and pass that into `postImage()`. We'll then take the `response` we get from the Cloudinary API, extract the `secure_url` to our image and `$emit` that URL to the parent just like we did in `addImage()` and `removeImage()` before.

Error handling is done in `else {}` here which displays 2 different messages based on the state of the recipe's image (missing vs. already uploaded). This is necessary because the same (already uploaded) image could be uploaded again and again otherwise.

While the image is uploading, we'll display a little animated SVG and "Uploading..." as the status message for the user; the success message will be triggered from within `postImage()` if communication with the API was successful:

{{< highlight js >}}
function postImage(data) {
  return fetch("https://api.cloudinary.com/v1_1/USERNAME/image/upload", {
    body: data,
    method: "POST"
  })
    .then(response => {
      vm.imageStatus.type = "info";
      vm.imageStatus.body = "Image successfully uploaded";
      return response.json();
    })
    .catch(error => {
      console.log("CDNRY API error", error);
      vm.imageStatus.type = "error";
      vm.imageStatus.body = "Error uploading image";
    });
}
{{< /highlight >}}

You can see the API path here - simply substitue your username and it should work. All other settings like the image manipulations mentioned earlier are defined in the upload preset you're using.

### Parent Components

Now we have a working image uploader component - let's see how the parent components handle the emitted data.

In the parent components, the image uploader can be used like this:

{{< highlight html >}}
<recipe-image :recipe="recipe" @image:update="imageUpdate" />
{{< /highlight >}}

The recipe object is passed into the component and the method `imageUpdate()` is attached to the `image:update` event that it emits from within multiple methods.

For the parent components, the `imageUpdate()` method looks like this:

{{< highlight js >}}
imageUpdate(url) {
  this.recipe.image = url;
}
{{< /highlight >}}

Pretty basic, huh?

There's basically only one thing you'll have to keep in mind here: if it's possible that your data's images are optional, adding them at a later point in time (editing previously existing data) can lead to problems with Vue's reactivity. To avoid this possibility, `imageUpdate()` looks a little different for my app's edit mode component:

{{< highlight js >}}
imageUpdate(url) {
  this.recipe = Object.assign({}, this.recipe, { image: url});
}
{{< /highlight >}}

This makes sure that reactivity works properly in case of a recipe being created without an image first and that image being added later on - unlikely, but just in case. For more details, please have a look at this resource: {{< link-ext "guide/reactivity" "vuejs.org/v2/guide/reactivity.html" >}}

Careful when sending your data off to your database: the parent component/s should check whether or not the image was actually uploaded (i.e. also use the RegEx used in the image uploader's computed `isUploaded` property) - otherwise you'll write the whole image `data:` returned by the File Reader API into your database.

## Conclusion

I tried to write some sort of "guide I wish I had" when I built this image uploader component. Cloudinary's documentation is alright and helpful enough, but if you don't want to use their packages you have to figure out your own implementation - or maybe I just didn't click on the right search results...

A note re: future improvements: my app's image URLs are now hard-locked to Cloudinary. If I ever (have) to change that configuration, it'll be a bit of work. There's good article I came across related to this (potential) issue for those using Netlify: {{< link-ext "Using Netlify Redirects to Proxy Images Hosted on a Third Party Image Provider" "markus.oberlehner.net/blog/using-netlify-redirects-to-proxy-images-hosted-on-a-third-party-image-provider-or-a-headless-cms" >}}