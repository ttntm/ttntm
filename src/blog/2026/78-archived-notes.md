---
title: Archived Notes
slug: archived-notes
date: 2026-07-26T10:30:00Z
description: An archive of what used to be my /notes page.
tags:
  - learning
showToc: true
hideSharing: true
---

{{description}}

## Node.js: Buffer in Cloudflare Workers

Using things like `Buffer.from()` in a Cloudflare Worker will result in an `undefined` error.

To make it work, the `nodejs_compat` flag has to be enabled in the worker configuration file (in the `compatibility_flags` array). When that's done, `Buffer` can be used:

```js
import { Buffer } from 'node:buffer'

globalThis.Buffer = Buffer

// rest of the code
```

## Multiple SSH-keys for the same Git provider

Use an SSH config file.

In `~/.ssh/config`:

```bash
Host foo-azure
  HostName vs-ssh.visualstudio.com
  User git
  IdentityFile ~/.ssh/ado_foo
  IdentitiesOnly yes
```

Then, change the default remote URLs from `git@ssh.dev.azure.com:v3/customer/project/repo` to `git@foo-azure:v3/customer/project/repo`.

## Azure DevOps: deployment issues (Node.js)

When your pipeline succeeds, but your function/s simply won't appear, check the following:

- Deployment package must be _the whole project directory_, not just the `/dist` folder
- Manually syncing triggers might be necessary; include a quick bash script using `curl` (docs: {% ext "Trigger syncing", "https://learn.microsoft.com/en-us/azure/azure-functions/functions-deployment-technologies?tabs=linux#trigger-syncing" %})

## VS Code: RegEx replace and append

Use case: append time to date values

Search: `^updated: [0-9]{4}-[0-9]{2}-[0-9]{2}$`

Replace: `$0T10:30:00Z`

`$0` uses the string matched by the expression in the "Search" field and appends whatever value follows.

NB: the option "Use Regular Expression" must be enabled for the "Search" field.

## CSS: targeting external links

Use case: displaying an icon with external links.

```css
a[href^="https://"] {
  &::after {
    /* rule */
  }
}
```

## JavaScript: element visibility

Use case: run specific code for visible elements only, do not waste resources on event handlers attached to invisible elements.

```js
function isVisible(el) {
  return window.getComputedStyle(el)?.getPropertyValue('display') !== 'none'
}

window.addEventListener('scroll', () => {
  const targetEl = document.getElementById('xmpl')

  if (!isVisible(targetEl)) {
    // element not visible - abort
    return
  }

  // actual event handler logic
})
```

NB: using a function (`isVisible()`) and calling it from inside the event listener makes sure that visibility changes get noticed immediately. Determining element visibility outside the event listener will make a page refresh necessary to determine changes in visibility (i.e. due to changes in the viewport size when rotating a device).

More info (MDN): {% ext "Window: getComputedStyle() method", "https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle" %}

## 11ty: passing collections to shortcodes

Use case: building a custom filter based on arbitrary property of the items in the collection.

The syntax is a bit clunky, but this works:

```html
{% raw %}{% customFilter collections.whisky, "region", "status", "wanted" %}{% endraw %}
```

...and can be used in a shortcode to render something:

```js
customFilter: function(collection, filterKey, excludeKey = null, excludeValue = null) {
  const terms = collection.reduce((map, currentItem) => {
    // some reducing of a collection into a map-like object
  }, {})

  return Object.keys(terms)
    .sort()
    .map((t) => {
      return `<li>${t}</li>`
    })
    .join('')
```

The first code snippet above shows the input collection, the property to use for the filter (`region`) and another property (`status`) that's used to exclude collection items where `status == wanted`.

This works rather well so far - it was inspired by the comments in {% ext "eleventy/issues/813", "https://github.com/11ty/eleventy/issues/813" %} and {% ext "eleventy/issues/1818", "https://github.com/11ty/eleventy/issues/1818" %}.

## SQL: applying DISTINCT to a single column

Use case: customers that bought items from a range of products in one or more orders in the last 90 days.

Example data:

```bash
OrderId | Email | ProductId
123 | bob@xmpl.com | A1
123 | bob@xmpl.com | B4
456 | bob@xmpl.com | E1
```

We want the email address `bob@xmpl.com` to appear only once in our query results. All other data is irrelevant, because we already know that every row in the source table qualifies for the above criteria based on a previous query.

```sql
SELECT *
FROM (
  SELECT
    Email
    , ROW_NUMBER() OVER(PARTITION BY Email ORDER BY OrderId DESC) rn
  FROM xmpl
) AS tmp
WHERE tmp.rn = 1
```

## SQL: join 2 tables that have nothing in common

Use case example: table A contains customers, table B contains coupon codes that haven't been assigned to customers yet.

```sql
SELECT
  CU.Id
  , CU.EmailAddress
  , CC.Code AS CouponCode
FROM (
  SELECT
    Id
    , EmailAddress
    , ROW_NUMBER() OVER (ORDER BY Id) AS Rn
  FROM Customers
) AS CU
INNER JOIN
(
  SELECT
    Code
    , ROW_NUMBER() OVER (ORDER BY Code) AS Rn
  FROM CouponCode
  WHERE CustomerId IS NULL
    OR CustomerId = ''
) AS CC
ON CU.Rn = CC.Rn
```

## JavaScript: unique IDs

```js
let uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);
```

For RFC compatible version 4 GUIDs:

```js
let u = Date.now().toString(16) + Math.random().toString(16) + '0'.repeat(16);
let guid = [u.substr(0,8), u.substr(8,4), '4000-8' + u.substr(13,3), u.substr(16,12)].join('-');
```

If IDs are generated more than 1 millisecond apart, they are 100% unique.

_NB: alread mentioned in [/likes/2021-w21](/likes/2021-w21), but I keep coming back to it._

## Recursively download a directory with wget

```bash
wget --no-verbose --no-parent --recursive \
--no-host-directories --no-clobber --continue \
--reject "index.html*" "https://example.com/cool_stuff/"
```

Works well, see {% ext "explainshell", "https://explainshell.com/explain?cmd=wget+--no-verbose+--no-parent+--recursive+%5C+--no-host-directories+--no-clobber+--continue+%5C+--reject+%22index.html*%22+%22https%3A%2F%2Fexample.com%2Fcool-stuff%2F%22" %} for details about the flags.

## Batch-replace a string in many folders and update GIT

Needed to replace Skypack with another CDN across many projects.

This script automates the taks and should serve as a starting point for many similar use cases:

```bash
#!/bin/bash

for D in *; do
  if [ -d "${D}" ]; then
    cd ${D}

    echo "processing ${D}..."

    ( shopt -s globstar dotglob
      sed -i -- 's/cdn[.]skypack[.]dev/esm.sh/g' **/*.js
      sed -i -- 's/cdn[.]skypack[.]dev/esm.sh/g' **/*.html
    )

    echo "updating git..."

    git add --all
    git commit -a -m "replace skypack"
    git push

    echo "${D} processed!"

    cd ..
  fi
done
```

## Vite: HTTPS on localhost (basic SSL)

Had to look this up today, here's how to do it.

First install a Vite plugin:

`npm install -D @vitejs/plugin-basic-ssl`

Then use it in `vite.config.ts`:

```ts
import basicSsl from '@vitejs/plugin-basic-ssl'

export default {
  plugins: [
    basicSsl()
  ]
}
```

_NB: works with Astro too, simply create the Vite config file in case it's not there yet._

## SSH: no matching host key type found. Their offer: ssh-rsa

Got this error when trying to use `sftp` in a Linux terminal.

Resolution:

Edit `/etc/ssh/ssh_config`, add those lines:

```bash
HostKeyAlgorithms ssh-rsa,ssh-dss
PubkeyAcceptedKeyTypes ssh-rsa,ssh-dss
```

_NB: might break some other stuff (GitLab in my case), so be careful and remember you added those lines._

## Vue: Array.push() used in Vuex mutation not triggering watch()

I was doing this in Vuex:

```js
ADD_RECIPE_USER(state, value) {
  state.userRecipes.push(value)
}
```

It was working fine, but a `watch()` effect used in a Vue component didn't catch the update while going back and forth between routes made the updated data appear as if it was always there.

After adding a bunch of cheap `console.log()` 'breakpoints', I eventually got to the bottom of it and changed my code to this:

```js
ADD_RECIPE_USER(state, value) {
  state.userRecipes = [...state.userRecipes, value]
}
```

Conclusion: `watch()` paired with Vuex getters seems to require the `state.key = newValue` assignment.

Seems a bit weird, but might have been mentioned in the docs somewhere.

## Netlify: secure HTTP headers

Sensible default config that returns an A+ in Mozilla Observatory:

```yaml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; img-src *; frame-ancestors 'none'"
    Referrer-Policy = "same-origin"
    Strict-Transport-Security = "max-age=63072000; includeSubdomains; preload"
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

_NB: adjust CSP as necessary when working on sites that actually load scripts._

## Vue: limiting the number of array items inside 'v-for'

Didn't know that this could work, but it does:

```js
<Component v-for="(item, index) in list.slice(0, 20)" ... />
```

Use case: getting the first 20 items of an array.

If the array is shorter, all items will be displayed.

## JavaScript: native Date formatting

I needed to format a date from `new Date()` recently and using any libs (like _date-fns_ or _moment.js_) and was not an option; doing that would have been overkill for the small project I was working on.

After a bit of research, I came across the `Date.prototype.toLocaleDateString` method and implemented it like this:

```js
const getDate = () => {
  let date = new Date();

  let dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  return date.toLocaleDateString('en-US', dateOptions);
}
```

**Result**: _Tuesday, April 13, 2021_

## GIT: SSH with multiple identities for the same host

Had some issues working with 2 different accounts at GitHub recently.

Initial `git clone` with the desired identity (specified explicitly) sets up the repository correctly:

```bash
git clone -c core.sshCommand="/usr/bin/ssh -i /home/me/.ssh/id_rsa_foo" git@git-provider.com:me/repo.git
```

GIT `config` should then contain this automatically:

```bash
[core]
  ...
  sshcommand = /usr/bin/ssh -i /home/me/.ssh/id_rsa_foo
```

## Vue3: handle page refresh (F5) in your application

I recently noticed that there was an issue with cross device data in WATCH3R. Adding/removing list items on one device would not update the app's (cached) state on another device. Logging out and back in would resolve this issue, but refreshing the page wouldn't.

After a bit of research, I found out that there wasn't really a "best practice" on how to handle page refresh in Vue, so I simply tried some things that seemed promising.

What I ended up with is the following:

```js
const updateList = () => {
  if (mode.value) { // double check 'mode' here, just in case
    store.dispatch('list/readList', mode.value);
  }
}

onMounted(() => {
  setTimeout(updateList, 250) // timeout is required here; otherwise 'route.meta.mode' is undefined
})
```

I placed this code directly in `App.vue`, which is the entrypoint of my application and gets re-loaded on page refresh. `route.meta.mode` controls which list's data to load - I decided against re-loading all list data, as that wouldn't be in line with the app's caching strategy.

**12/2021** - Refer to the following commits on how to _block_ page refresh when handling unsaved changes:

- {% ext "ttntm/itrack@9b85052" "https://codeberg.org/ttntm/itrack/commit/9b85052bd19ab97b45dc755047ab67a612b1b167" %}
- {% ext "ttntm/recept0r@810360e" "https://codeberg.org/ttntm/recept0r/commit/810360eb7d2960f239b55037bfd4ba53fab52094" %}

## Vue3: select default value

Cost me more time than I anticipated, esp. due to the fact that _it only happened for production builds_.

So, in order for a `<select>` (with an Object-based `v-model`) to properly display its default value in Vue 3 (3.0.2), this had to be done:

```html
<select ... v-model.lazy="selected" @change="update(selected)">
  <option disabled :value="{}" :selected="selected === {}">Select Something...</option>
  <option v-for="(item, index) in list" :key="index" :value="item">{{ item.title }}</option>
</select>
```

The `:selected="selected === {}"` was necessary, as the `<select>` would otherwise display as a blank box once the `v-for` rendered `<option>` elements came in.

Again, this only happened in _production_, local dev builds _did not_ behave that way which made it extremely frustrating to debug.

Probably worthy of further investigation and a report to the Vue team, but I don't have time to try and get a reproducible example done at the moment.

## Vue3: click outside directive

Directives are quite different in Vue 3 - see: {% ext "Vue 3 docs", "https://v3.vuejs.org/guide/migration/custom-directives.html#custom-directives" %}

Here's what I came up with for a simple "close an element (modal etc.) when a click outside of this element registers" directive. Clicks on elements within the target element and elements with the class `click-outside-ignore` will be ignored.

The function/method to close the element is registered as `binding.value`, so when using it on a component, it should look like this: `<Component v-click-outside="closeComponent" />`

```js
let handleOutsideClick = null;

app.directive('click-outside', {
  beforeMount(el, binding, vnode) {
    handleOutsideClick = (e) => {
      e.stopPropagation();
      if(!el.contains(e.target) && !e.target.classList.contains('click-outside-ignore')) {
        binding.value();
      }
    }
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
  },
  beforeUnmount() {
    document.removeEventListener('click', handleOutsideClick);
    document.removeEventListener('touchstart', handleOutsideClick);
  }
});
```

## Android: use ADB to uninstall bloatware

I recently got the Android 10 update and had to factory reset my phone thanks to the phone's language settings not sticking anymore. Factory reset unearthed all the bloatware again that I had gotten rid of years ago, so I also had to do that again.

Here's a quick reminder of how to do that:

1. Get ADB platform tools for your OS
2. On your phone: enable developer mode and USB debudding
3. Connect phone
4. Test if connected successfully and allow debugging (will be prompted): `adb devices`
5. `adb shell` to get into the phone
6. List packages with `pm list packages | grep 'pkg.name.etc'` or search for them like this: `pm list packages -f TESTPKG`
7. Uninstall bloatware like this: `pm uninstall -k --user 0 com.android.google.youtube`
8. See bloatware disappear 😁

Based on this guide at xda: {% ext "How to Uninstall Carrier/OEM Bloatware Without Root Access", "https://www.xda-developers.com/uninstall-carrier-oem-bloatware-without-root-access/" %}

## Shell Script: launch VS Code for a specific folder/repository

I wanted to have an easy way to launch VS Code for specific repositories and came across the `code PATH-TO-REPO` command.

This little shell script will open a specific folder/repository based on an argument given to it or based on a directory listing of the `/home/user/Repos` folder:

```bash
#!/bin/bash

# get param
repo=$1

if [ -z "$repo" ]
  then
    # check first
    ls /home/USER/Repos/

    # ask user for input
    echo -n "which repo: "
    read repo
  else
    echo "opening "$repo
fi

code /home/USER/Repos/$repo
```

I've also configured an alias for that script; simply typing `lcode REPO-NAME` now opens VS Code for that folder/repository.

## Vue2: handle component's click event in its parent

Use case: a component creates nothing but a `<button>` with a `slot` that handles its display state internally but hasn't got any actual functionality; the handler method is defined in the parent.

In this case, `@click.native` has to be used to call the method defined in the parent:

```html
// in parent component

<cButton @click.native="theMethod(praram)">Button Name</cButton>
```