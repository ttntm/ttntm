---
title: Migrating from Fauna to Supabase
slug: migrating-from-fauna-to-supabase
date: 2025-04-12T17:45:00Z
description: Fauna is shutting down, and I needed a reliable alternative to keep 2 web applications alive.
tags:
  - database
  - guide
  - project
image: /img/blog/backend.png
toot: https://fosstodon.org/@ttntm/114325795620214411
---

The announcement that Fauna made the decision to sunset their service hit me by surprise. The main reason for this decision seems to be money - as they've put it: "it is not possible to raise the capital needed" (see {% ext "The Future of Fauna", "https://fauna.com/blog/the-future-of-fauna" %}).

That's not exactly great news, but I'm in no position to complain about that anyway, considering that I was only using their free tier for 2 of my side projects. Over time, those 2 projects became rather important to me (see [Making Your Own Tools](/blog/making-your-own-tools/)), so letting them die with their database service wasn't ever an option.

I quickly started looking for alternatives to the service Fauna used to offer and even considered self-hosting a database server. Eventually, I found myself exploring Supabase and dug into their documentation. It looked just like what I needed, and a couple of days later, they published their own guide about migrating from Fauna to Supabase (linked [below](#data-migration)) - great timing!

Switching to a relational database is definitely not an insignificant change, but I'm using them a lot at work. Also, the Supabase service offers convenience features, like "automatically generating REST APIs for each table, allowing effortless querying from your application" via their SDKs.

## Supabase Setup

Account creation and project setup was straightforward, no surprises there. The only thing to keep in mind, is that "free projects are paused after 1 week of inactivity" and that there's a "limit of 2 active projects" (see {% ext "Pricing", "https://supabase.com/pricing" %}) - both things that I'm ok with at the moment.

I proceeded to set up the data model (tables), which was easy too, thanks to good documentation I wrote many years ago. For watch3r, the resulting database schema looks like this:

<img src="/static/img/blog/db_schema_watch3r.jpg" class="img-fluid img-center auto-invert" alt="A screenshot of a database schema that consists of 3 tables">

Finally, there's {% ext "RLS", "https://supabase.com/docs/guides/database/postgres/row-level-security" %} and policies. That stuff cost me a bit more time than expected, and I ended up with a _very_ permissive setup, while keeping RLS on, because I'm only ever accessing the database with a backend service user.

A policy hint if you should struggle with errors when performing `delete`, `insert`, or `update` operations:

```sql
--this code creates a permissive `insert` policy for the given table
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

For recept0r, I followed {% ext "Supabase's migration guide", "https://supabase.com/blog/migrating-from-fauna-to-supabase" %}. I worked with freshly exported data (see [How to Export Data from Fauna](/blog/how-to-export-data-from-fauna/) from last year), and there were no surprises - things just worked.

However, normalizing the data and making sure it ends up in multiple columns (compared to just one column with JSON in it) was a little trickier. Properly extracting arrays and timestamps from the JSON took me a moment, but I eventually figured out how to make my {% ext "SQL query", "https://codeberg.org/ttntm/spb_migrate/src/branch/main/scripts/recept0r/migrate_recept0r.sql" %} produce the correct result.

For watch3r, I chose a different approach: I skipped the temporary table filled with JSON, and inserted properly mapped data right away instead. I don't mind writing SQL queries, but skipping the extra step actually saved me some time. Time, that I immediately used to figure out a rather hacky way of preserving the chronological order of the database entries.

I'm not proud of it, and I'm sure there are many better ways to accomplish chronological order (i.e. working with a proper `created` date from the beginning...), but it worked - you can have a look at {% ext "the script", "https://codeberg.org/ttntm/spb_migrate/src/branch/main/scripts/watch3r/migrate.js#L26" %} if you're curious.

## Updating the Web Applications

recept0r is built using Vue 3 with TypeScript, thanks to a complete rewrite in 2021. Updating the back end functions led to matching changes in the front end code, mostly affecting Vuex actions. Changes to actual UI components were handled using search and replace, and TypeScript made errors visible immediately.

Supabase's RLS caused me quite a bit of pain when I started to working on `insert`/`update` operations, but - as mentioned above - I eventually figured out how to properly initialize the SDK and how to set up permissive policies for my tables.

watch3r is also built using Vue 3, but I didn't use TypeScript back in 2020. Updating the back end was rather easy, but the front end was a bit of a challenge. No TypeScript meant that I had to dig deep into the code to make sure I don't forget any dependencies. Also, past me was lazy and (ab)used IMDb IDs as primary keys, which really wasn't a good idea.

In addition to that, I noticed that a function, that's triggered automatically whenever a user signs up, somehow stopped working. I had to repair that, because I'm using user IDs as foreign keys in the data model (see above) now.

Both applications are functional again, with 0 actual downtime, and that leaves me with a positive experience regarding this migration. I'll definitely remember that it's a _lot_ easier to update TypeScript applications, however.

## Backups

As mentioned earlier, using Supabase's free tier means that "projects are paused after 1 week of inactivity". The free plan also doesn't include project backups.  That's not ideal, but I figured out an approach that can take care of both: using scheduled backups to cause the necessary "activity" to prevent your projects getting paused.

I'm using {% ext "Supabase Storage", "https://supabase.com/docs/guides/storage" %} to store JSON backups of all tables used in the respective project. These JSON backups are created by {% ext "a simple HTTP-triggered function", "https://codeberg.org/ttntm/watch3r/src/branch/master/functions/backup.js" %} that runs every 6 days based on a Make scenario (workflow).

## Conclusion

It's a bit sad that Fauna's going to disappear, but it's no use to complain about it. I handled 2 successful migrations to Supabase in less time than expected, learned a couple of things, and kept both applications alive - I'm glad things turned out that way, but I also hope I won't have to do it all again any time soon.
