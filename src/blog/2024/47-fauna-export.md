---
title: How to Export Data from Fauna
slug: how-to-export-data-from-fauna
date: 2024-04-15T10:30:00Z
description: "A short guide about exporting data from Fauna, a serverless database. Example use case: a Node.js script for database backups."
tags:
  - fauna
  - guide
  - serverless
image: /img/blog/how-to-export-data-from-fauna.jpg
---

Just this morning, I had a brief online conversation that made me realize something: I'm using Fauna for two live web applications and I didn't even think about database backups for a second.

All my data has been just fine for the past few years, but today's realization of having no backups whatsoever wasn't something that I felt comfortable ignoring any longer. Even more so, considering that each application contains data that I definitely don't want to lose: one stores 65+ family recipes, and the other one is a movie/series journal with 200+ entries for my own user, and 1000s more belonging to other users.

So, I logged into my Fauna account, and clicked around. I don't know if it's any different for paid plans, but the free plan doesn't seem to offer any - obvious - functionality to export the data stored in collections (= tables). That's not really a showstopper for me, but I suppose it could be for others - it felt like a rather strange UX choice nevertheless.

I quickly remembered that I already wrote about [building an automated database reporting service](/blog/track-fauna-metrics-google-sheets) 3 years ago, and I figured that writing a backup script should not be too much trouble. An hour later, I'd finished writing the code and decided to share it here, hoping it might help out somebody else looking for the exact same thing.

## The Script

This is the code I'm using for watch3r's database backups (3 collections):

```js
const config = require('dotenv').config()
const faunadb = require('faunadb')
const fs = require('fs')
const q = faunadb.query

const client = new faunadb.Client({
  secret: process.env.FAUNA_SECRET,
  domain: 'db.us.fauna.com'
})

async function getData(indexName, size) {
  try {
    return client.query(
      q.Paginate(
        q.Match(
          q.Index(indexName)
        ),
        { size: size }
      )
    )
      .then(async (response) => {
        const listRefs = response.data

        console.log(`INFO | Index: ${indexName} | ${listRefs.length} entries found`)

        const getListDataQuery = listRefs.map(ref => q.Get(ref))
        const records = await client.query(getListDataQuery)
        return records
      })
      .catch((error) => {
        throw error
      })
  } catch (ex) {
    console.error(ex.message || ex)
  }
}

function getTimestamp() {
  const d = new Date()
  return d.toISOString().split('T')[0].replaceAll('-', '')
}

async function main() {
  const config = {
    indexList: [
      'tracklist_all',
      'watchlist_all',
      'users_all'
    ],
    size: 500
  }

  for (let i = 0; i < config.indexList.length; i++) {
    try {
      const currentIndex = config.indexList[i]

      const data = await getData(currentIndex, config.size)

      if (data) {
        const now = getTimestamp()
        const output = JSON.stringify(data, null, 2)

        await fs.promises.writeFile(`./backup/${now}-${currentIndex}.json`, output)
      }
    } catch (ex) {
      console.error(ex.message || ex)
    }
  }
}

main()
```

Source code: {% ext "backup-db.js@Codeberg", "https://codeberg.org/ttntm/watch3r/src/branch/master/backup/backup-db.js" %}

### Notes and Usage Instructions

`FAUNA_SECRET` is taken from an environment variable, i.e. stored in an `.env` file.

`getData()` takes 2 parameters:

- `indexName`: name of a Fauna index, should return an unfiltered collection for this use case
- `size`: Fauna query response size, increased (default: `64`), so we don't have to think about pagination when processing smaller collections

`getTimestamp()` returns a timestamp like `YYYYMMDD` used as a prefix for the JSON files written by this script.

`main()` ties it all together, using `config.IndexList[]` to provide an easy way to process multiple collections sequentially, writing a dedicated JSON backup file for each collection, i.e. `20240415-users_all.json`.

## The Bottom Line

Nothing fancy, just a script that works (for my projects) and gets the job done.

It might work for you too, or at least save you some time and serve as a base for something you're working on.
