---
title: Migrating from Fauna to Supabase
slug: migrating-from-fauna-to-supabase
date: 2025-04-10T15:15:00Z
description: Fauna is shutting down, and I needed a reliable alternative to keep 2 web applications alive.
tags:
  - fauna
  - projects
  - supabase
image: /img/blog/TBD.jpg
toot: https://fosstodon.org/@ttntm/TBD
---

The announcement that Fauna made the decision to sunset their service hit me by surprise. The main reason for this decision seems to be money - as they've put it: "it is not possible to raise the capital needed" (see {% ext "The Future of Fauna", "https://fauna.com/blog/the-future-of-fauna" %}).

That's not exactly great news, but I'm in no position to complain about that anyway, considering that I was only using their free tier for 2 of my side projects. Over time, those 2 projects became rather important to me (see [Making Your Own Tools](/blog/making-your-own-tools/)), so letting them die with their database service wasn't ever an option.

I quickly started looking for alternatives to the service Fauna used to offer and even considered self-hosting a database server. Eventually, I found myself exploring Supabase and dug into their documentation. It looked just like what I needed, and a couple of days later, they published their own guide about {% ext "migrating from Fauna to Supabase", "https://supabase.com/blog/migrating-from-fauna-to-supabase" %}.

Switching to a relational database is definitely not an insignificant change, but I'm using them a lot at work. Also, the Supabase service offers convenience features, like "automatically generating REST APIs for each table, allowing effortless querying from your application" via their SDKs.

## Supabase Setup

Account creation and project setup was straightforward, no surprises there. The only thing to keep in mind, is that "free projects are paused after 1 week of inactivity" and that there's a "limit of 2 active projects" (see {% ext "Pricing", "https://supabase.com/pricing" %}) - both things that I'm ok with at the moment.

I proceeded to set up the data model (tables), which was easy too, thanks to good documentation I wrote many years ago. For watch3r, the resulting database schema looks like this:

<img src="/static/img/blog/db_schema_watch3r.jpg" class="img-fluid img-center auto-invert" alt="A screenshot of a database schema">

Finally, there's {% ext "RLS", "https://supabase.com/docs/guides/database/postgres/row-level-security" %} and policies. That stuff cost me a bit more time than expected, and I ended up with a _very_ permissive setup, while keeping RLS on, because I'm only ever accessing the database with a backend service user.

A policy hint if you should struggle with errors when performing `delete`, `insert`, or `update` operations:

```sql
--this code creates a permissive `insert` policy for a given table
create policy "Allow insert"
on "public"."watchlist"
for insert
to public
with check ( true );
```

And for code {% ext "performing tasks on the server side", "https://supabase.com/docs/guides/troubleshooting/performing-administration-tasks-on-the-server-side-with-the-servicerole-secret-BYM4Fa" %}:

```js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(supabaseUrl, serviceRoleSecret, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
})
```

## Data Migration

scripted all in + sql

vs

scripted data prep in js (easier)

migration project link

## Updating Web Applications

ui implications, bad naming sins from the past

typescript vastly superior, less confusion

## Backups

describe storage buckets, plus automation to avoid inactivity
