---
title: Building a Data Viewer With Preact
slug: building-a-data-viewer-with-preact
type: blog
date: 2023-08-04
description: A data viewer with a nav tree, rendered from an array of objects (rows obtained from a DB).
tags:
    - Preact
    - tutorial
image: /img/blog/preact-data-viewer.png
---

I recently published a template/starter intended to showcase how I’m using Preact for SPAs in buildless environments. Making use of it for this article’s demo application should serve as a nice follow up 😎

So, let’s assume the following premise: 

You’ve got to show personal activity data to the end users of a mountain resort (= guests that stay there and move around on bike and foot). 

Data aggregation, storage etc. is being taken care of by various backend services and you can pull that data into a low code front end environment quite easily. But: you’re not dealing with any kind of infrastructure that’d allow the use of CI/CD, builds, pipelines etc. - your customer wants to keep things simple and efforts to a reasonable minimum, which means you’ll have to work with the systems they’ve got in place.

Let’s also assume that said customer wants to have something slick and good looking that’s also modern and responsive. Tables and lists are off the table, they absolutely want to have icons and a tree for navigation!

## Scope

We’ll focus on the front end in this article; data preparation/fetching and user identification are implied, but intentionally omitted. There’s sample data and an example of a data retrieval function in the demo’s codebase to hint at things that’d usually have to happen for the SPA to have the necessary context and data to display anything at all.

## Getting Started

All code mentioned and referenced in this article can be found in the demo repository over at GitHub: {% ext "preact-data-viewer-demo", "https://github.com/ttntm/preact-data-viewer-demo" %}. The demo repository is based on my buildless preact starter; context, motivation and considerations for code splitting etc. can be found in the detailed readme inlined in the announcement article: [My Buildless Preact Starter](/blog/buildless-preact-starter/)

The demo provides a working example that's also been published to this site: {% ext "/demos/pdv/", "https://ttntm.me/demos/pdv/" %}

<p>
  <img src="/img/blog/preact-data-viewer.png" class="img-fluid img-center" alt="Screenshot of a demo app">
</p>

Please note that the all code mentioned in this article should also show up explicitly (i.e. unprocessed, unminified) in your browser’s dev tools - it is buildless after all.
(*A little note on that can be found at the end of the article.*)

## Building the App

The following section will follow the data flow from the imagined back end (inside the large enterprise system) to the front end where the app’s going to be displayed to the end user.

### index.html

I doubt I could summarize it better than I did for a recent readme:

> [This file is] the shell of your SPA. [It] can be used for static elements (header/footer) and server side code (if your environment provides that).

Data fetching is explicitly implied here (see "Scope" above): working with the imaginary enterprise system, you’d have the possibility of running server side code in this file. You could use such code to pass raw stringified JSON data obtained from the back end into the JavaScript code that’s evaluated on the client side. For demo purposes, locally sourced sample data ({% ext "./db_rows.js", "https://github.com/ttntm/preact-data-viewer-demo/blob/main/db_rows.js" %}) and a data retrieval function (`serverSideDataRetrieval()`, {% ext "index.html#L38", "https://github.com/ttntm/preact-data-viewer-demo/blob/main/index.html#L38" %}) were added to the repository.

What gets things started is a `load` event listener that first builds a `config` object and then performs the call to start the application using `App(config)`:

```html
<script type="module">
  import App from './app.js'

  // more code...

  window.addEventListener('load', () => {
    const config = {
      rawStats: serverSideDataRetrieval()
    }

    App(config)
  })
</script>
```

### The App’s Data

We’re working with rows obtained from an imaginary database that look like this:

```tsx
{
  Id: string
  DistanceOnFoot: number
  DistanceOnBike: number
  MetersOfHeight: number
  DateOfCalculation: string
  DeviceId: string
}
```

- `Id` is a GUID assigned to each row - we’re not using that for anything, but it’d probably be present in real world data.
- `Distance…` and `Meters…` properties are the values that the data viewer is going to work with
- `DateOfCalculation` is a string representation of an SQL `datetime` value
- `DeviceId` is the id of the device that was used to collect the data; different `DeviceId` values can appear in records beloning to the same `DateOfCalculation`, but each `DeviceId` can only ever appear once per actual *day* of the year

The imaginary back end takes care of handling these constraints and provides the data as shown in `db_rows.js`. It’s safe to rely on this data coming in just like that: the automated processes handling data preparation are protected well from unintended changes (they never *really* are, but we’ve got to live with that).

### app.js

This file is our SPA’s shell. There’s an `export default function App(config)` in {% ext "app.js#L68", "https://github.com/ttntm/preact-data-viewer-demo/blob/main/app.js#L68" %} that’s called from `index.html` which is used to pass the data described in the previous section to the application.

The code immediately runs the (destructured) `rawStats` variable through a reverse sorting function (`objectSort()`, {% ext "app.js#L51", "https://github.com/ttntm/preact-data-viewer-demo/blob/main/app.js#L51" %}) based on the `DateOfCalculation`. The rows obtained from our database are now sorted from newest to oldest record. 

What follows is the definition of the app’s `Main()` component: first, we utilize the `useState()` {% ext "hook", "https://preactjs.com/guide/v10/hooks" %} and define the `statMap` object, then we proceed to a `useEffect()` call that basically mimics the `componentDidMount()` method which would have been used if this were a Class Component. Together with the `firstTimeRender` flag, we make sure that this `useEffect()` call only ever runs once, when the component gets mounted to the DOM:

```jsx
useEffect(() => {
  if (firstTimeRender) {
    setStatMap(current => {
      return sortedStats && sortedStats.length > 0
        ? createStatMap(sortedStats)
        : null
    })

    setFirstTimeRender(false)
  }
}, [])
```

NB: a `useEffect()` call with an empty dependencies array would run for each and every re-render if it wasn’t for the `firstTimeRender` flag - be careful with that and only ever do this intentionally to avoid unnecessary re-renders, performance degradation and a waste of client CPU resources.

What’s essential to mention here is the call to the `createStatMap()` function ({% ext "app.js#L8", "https://github.com/ttntm/preact-data-viewer-demo/blob/main/app.js#L8" %}). This function is the key piece of logic that transforms our flat data rows into a map(like) object with keys representing each day we have data for:

```jsx
function createStatMap(input) {
  return input.reduce((dateMap, currentRow) => {
    const {
      DateOfCalculation,
      DeviceId,
      DistanceOnBike,
      DistanceOnFoot,
      MetersOfHeight
    } = currentRow
    const dateKey = formatDateTime(DateOfCalculation)
    const currentDate = dateMap[dateKey] ?? []
    const currentDayCount = Number(currentDate.length <= 0)
    const currentTotals = dateMap._totals ?? {}

    const data = {
      AssetName: DeviceId,
      DistanceOnBike: DistanceOnBike,
      DistanceOnFoot: DistanceOnFoot,
      MetersOfHeight: MetersOfHeight
    }

    const newTotals = {
      DistanceOnBike: (currentTotals.DistanceOnBike || 0) + DistanceOnBike,
      DistanceOnFoot: (currentTotals.DistanceOnFoot || 0) + DistanceOnFoot,
      MetersOfHeight: (currentTotals.MetersOfHeight || 0) + MetersOfHeight,
      NumberOfDays: (currentTotals.NumberOfDays || 0) + currentDayCount
    }

    return {
      ...dateMap,
      [dateKey]: currentDate.concat([data]),
      _totals: newTotals
    }
  }, {})
}
```

We are using the powerful `Array.prototype.reduce()` method here, which "executes a user-supplied "reducer" callback function on each element of the array, in order, passing in the return value from the calculation on the preceding element" ({% ext "MDN", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce" %}).

Let’s start right at the top: looking at `input.reduce((dateMap, currentRow) => { ... }`, `dateMap` is our *accumulator* that first contains the (optional) *initialValue* (an empty object literal `{}`) and then carries the value of each previous call of the callback function, i.e. what’s wrapped by the `return { ... }` statement in the code snippet above. 

The callback function does the following:

1. It assigns a new `dateKey` to each database row it processes
2. It creates a `data` object containing the day’s records for a specific `DeviceId` (re-mapped to the key `AssetName`)
3. It updates the incoming `currentTotals` using a `newTotals` object
4. It returns a compound object containing
    1. All previous data
    2. New or additional data for the current `dateKey`
    3. Updated data for the `_totals` key

The resulting object looks like this:

```jsx
{
  _totals: {
    DistanceOnBike: 304830.64999999997,
    DistanceOnFoot: 155892.08000000002,
    MetersOfHeight: 41611.490000000005,
    NumberOfDays: 7
  },
  '06/01/2023': [
    {
      AssetName: '1-218-0815',
      DistanceOnBike: 7305.09,
      DistanceOnFoot: 4314.43,
      MetersOfHeight: 802.8
    },
    {
      AssetName: '1-218-2001',
      DistanceOnBike: 75643.9,
      DistanceOnFoot: 41343.67,
      MetersOfHeight: 6704.38
    }
  ],
  // More data...
}
```

With the data preparation taken care of, we now proceed to mount the app’s core component `Stats` ({% ext "app.js#L94", "https://github.com/ttntm/preact-data-viewer-demo/blob/main/app.js#L94" %}) which consumes the newly created `statMap` as its one and only prop:

`<${Stats} statMap="${statMap}" />`

Considering that `Stats` was imported from the components file ({% ext "app.js#L4", "https://github.com/ttntm/preact-data-viewer-demo/blob/main/app.js#L4" %} and {% ext "app.js#L65", "https://github.com/ttntm/preact-data-viewer-demo/blob/main/app.js#L65" %}), we’ll proceed to have a closer look at that one now.

### components.js

I prefer keeping components in a separate file. It keeps things clean(er) and helps (me) reduce side effects to a minimum required to make things work. It also makes it easier to find the source of errors that will happen sooner or later. As a quick real world example: 

An application like this one might end up having multiple views and a form somewhere eventually. Considering that forms are (hopefully…) standardized in some way and most likely used elsewhere already, there’s probably an existing `formComponents.js` file you can reuse without having to duplicate some/all of these components into the code of this particular application, creating redundancy and, as a consequence, a maintenance nightmare. On the other hand, putting your components into separate files may make small(er) apps more complicated than they’d have to be, so it’s really just an "as needed" suggestion.

Anyway, back to our app’s components:

#### Stats

Component definition: {% ext "components.js#L187", "https://github.com/ttntm/preact-data-viewer-demo/blob/main/components.js#L187" %}

This is our data viewer’s wrapper component which makes use of a tree (`StatsTree`) and a view (`StatsView`) sub-component. The main responsibility of this component is to handle the navigation events (via the tree) and to manage the state and data for the view using the `displayData` object. It also calculates the averages ({% ext "components.js#L197", "https://github.com/ttntm/preact-data-viewer-demo/blob/main/components.js#L197" %} > {% ext "components.js#L18", "https://github.com/ttntm/preact-data-viewer-demo/blob/main/components.js#L18" %}) for the "Stats Overview".

Props:

- `statMap`: an object produced by the `createStatMap()` reducer (an example of the data can be found above where the function is explained in detail)

#### StatsTree

Component definition: {% ext "components.js#L41", "https://github.com/ttntm/preact-data-viewer-demo/blob/main/components.js#L41" %}

A nav tree component that renders nodes based on the date-keyed entries of the `statMap` object.

Props:

- `activeNode`: a string value containing the id of the active tree node; intentionally left blank for when the overview should be shown
- `treeData`: the `statMap` object
- `onTreeNodeClick`: a method defined in the parent component (`Stats`, {% ext "components.js#L209", "https://github.com/ttntm/preact-data-viewer-demo/blob/main/components.js#L209" %}) that handles the clicks onto the tree nodes

At its core, the tree component renders an `<ul>` with a `<li>` for each one of the date keys in the `statMap` object (which itself is an array with 1 or more records). It then loops through the value of these keys and renders a `<li>` for each one of them into a nested `<ul>` inside the respective main node. The 2 nested loops make use of the `activeNode` prop to determine which one of the main nodes and which one of its children is currently active and should be highlighted (via CSS classes). 

Each node has an unique id built from `key` and `AssetName` that looks like this: `07/01/2023_1-218-0815`. These ids are used by the `onTreeNodeClick` method which handles the navigation:

```jsx
const onTreeNodeClick = useCallback((evt) => {
  const nodeId = evt.target.id
  const showOverview = nodeId === 'overview'

  setActiveNode(showOverview ? '' : nodeId)

  if (showOverview) {
    setDisplayData({
      averages: avgData,
      content: statMap._totals
    })
  } else {
    const nodePath = nodeId.split('_')
    setDisplayData({
      date: nodePath[0],
      device: nodePath[1],
      content: statMap[nodePath[0]].find(o => o.AssetName == nodePath[1])
    })
  }
}, [avgData, statMap])
```

As you can see, the wrapper component first grabs the `nodeId` from the vDOM event to determine what kind of view to show (overview vs. day view) and then proceeds to update the `displayData` accordingly.

The function is wrapped with a `useCallback()` hook which helps avoid unnecessary re-renders of child components that depend on it. It uses both `avgData` and `statMap` as dependencies to make sure the app’s properly initialized on the first render (both are only ever set once when the `Stats` component mounts and don’t get any updates).

NB: you can go ahead and try removing `avgData` from the dependencies and see what happens…
Hint: `useCallback()` runs before `setAvgData()` is completed, so `avgData` will stay at its initial `null` value.

#### StatsView

Component definition: {% ext "components.js#L86", "https://github.com/ttntm/preact-data-viewer-demo/blob/main/components.js#L86" %}

This is the main view component which controls the rendering if the icon tiles. It’s a rather simple component that does not use any complex logic. It does, however, control whether or not to display multiple instances of the `StatsViewTiles` component (overview = summary + averages), or just one (day view). This decision is based on the respective current value of the (local) `averages` and `showOverview` flags.

Props:

- `displayData`: the data for the current view as determined by the `Stats` wrapper component

#### StatsViewTiles

Component definition: {% ext "components.js#L121", "https://github.com/ttntm/preact-data-viewer-demo/blob/main/components.js#L121" %}

A component that renders a grid of icons for the provided data based on a fixed set of (locally defined) `tiles`. Objects in the `tiles` array can have a `transform` property that determines if and how the respective value should be transformed and formatted.

Props:

- `containerClass`: determined by the `StatsView` component; controls which CSS class to assign to the `div` containing the tiles
- `data`: the current `displayData` for the component instance
- `formatAll`: a boolean flag that controls whether or not values should be processed by the `formatNumber()` function if the respective tile lacks the `transform` property

### Assets & Styles

Just like the starter this demo is based on, the styles used here were originally based on {% ext "water.css", "https://github.com/kognise/water.css" %} but they got modified quite extensively. I neither minified nor purged them, so there’s a bunch of stuff in there that’s not being used at all (i.e. all the form related styles).

Assets (i.e. icons) are stored in their own folder and were sourced from TablerIcons.

## Production Deployment

As mentioned in the beginning of the article, the code is running in your browser just like it’s displayed in your editor. Considering production use in customer environments, this might not be ideal. But we’re still constrained to a buildless approach…

A tool that could help in this situation is {% ext "esbuild", "https://esbuild.github.io/" %}. It allows creating one (or more) mini/uglyfied *.js files that can be pasted into our enterprise system. This way, we avoid using unminified code there which some curious user might end up playing around with. 

Once installed, esbuild can be used with Preact like this:

```json
"scripts": {
    "build:prod": "npx esbuild ./src/app.js '--define:process.env.NODE_ENV=\"production\"' --jsx-factory=preact.h --jsx-fragment=preact.Fragment --minify --outfile=./dist/app.min.js",
}
```

## Conclusion

If you were following along and/or playing around with a demo app of your own, you should have arrived at a working SPA by now. It’s built on a solid foundation and you shouldn’t have any issues extending the functionality with additional views and/or logic.

This is just one example of buildless Preact; I’ve built many cool things with it in recent years of working in and around enterprise systems like the one imagined for this article. Some of the resulting SPAs are similar to the one built for this article, others are providing web access to custom functionality, some were form generators or (limited) landing page builders. 

I wouldn’t call it something I really love doing, but it’s definitely far ahead of having to deliver similar functionality using 1000s of lines of static HTML with tons of jQuery on top of it for example. And yes, that’s definitely still happening out there, no matter how much you’d like to believe that it’s not - esp. when considering that it’s 2023 at the time of writing this article...
