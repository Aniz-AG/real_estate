# Builder Storefront: Caching Strategy

## Why this needed caching

The builder storefront page (`/builders/[id]`) is the kind of endpoint that gets
hammered unevenly: a handful of **premium builders** linked from the homepage
carousel, property cards, and every one of their own listings' detail pages
will receive the large majority of traffic. Under a burst of concurrent
visitors (the brief mentioned ~1000 simultaneous users), naively hitting
MongoDB on every single request for the same builder's profile + property list
is wasted, repeated work — the underlying data changes rarely (an admin edits
a builder or adds a listing occasionally), so serving a few seconds of
staleness in exchange for avoiding redundant DB round-trips is the right
tradeoff.

## What was implemented

### 1. In-process TTL cache (`lib/cache.js`)

A minimal `Map`-based cache with:
- `cached(key, ttlMs, produce)` — cache-aside helper: return the cached value
  if fresh, otherwise call `produce()`, store the result, and return it.
- `cacheDeleteByPrefix(prefix)` — used for invalidation (see below).

The storefront API (`pages/api/builders/[id].js`) wraps its expensive work
(look up the builder, fetch a page of their properties, count the total) in
`cached()` with a **60-second TTL**, keyed per builder *and* per page number
(`builder:<id>:page:<n>`), so pagination doesn't collide.

```js
const payload = await cached(`builder:${id}:page:${pageNumber}`, 60_000, async () => {
  // builder lookup + Property.find(...) + Property.countDocuments(...)
});
```

Effect measured locally: a cold request (cache miss, hits MongoDB) took
~330ms; the next request for the same builder/page (cache hit, no DB round
trip) took ~130ms — and every subsequent request within the TTL window stays
at that ~130ms floor regardless of how many concurrent requests arrive,
because only the *first* one after expiry pays the DB cost.

### 2. HTTP `Cache-Control` header

The same route also sets:

```
Cache-Control: public, s-maxage=60, stale-while-revalidate=300
```

This is what actually matters most at real scale: if this app ever sits
behind a CDN or reverse proxy (Vercel's edge network, Cloudflare, nginx with
proxy caching, etc.), that layer can serve the cached response **without ever
reaching the Node process** — the in-memory cache above only helps requests
that do reach this server; the HTTP header helps requests that don't have to.
`stale-while-revalidate=300` means that even right after the 60s freshness
window lapses, a CDN can keep serving the slightly-stale copy to users while
it revalidates in the background, so nobody is ever blocked behind a slow
origin fetch.

### 3. Active invalidation, not just TTL expiry

A flat 60s TTL alone would mean an admin's edit could take up to a minute to
show up publicly. Instead, every mutation that can affect a builder's public
page proactively busts that builder's cache entries immediately:

| Mutation | File | What gets invalidated |
|---|---|---|
| Update a builder (name, logo, premium flag, etc.) | `pages/api/admin/builders/[id].js` (PUT) | `builder:<id>:*` |
| Delete a builder | `pages/api/admin/builders/[id].js` (DELETE) | `builder:<id>:*` |
| Create a property assigned to a builder | `pages/api/property/create.js` | `builder:<builderId>:*` |
| Edit a property (including reassigning its builder) | `pages/api/admin/properties.js` (PUT) | old builder's `*` and new builder's `*` if changed |
| Delete a property | `pages/api/admin/properties.js` (DELETE) | that property's builder `*` |
| Toggle featured/top-project/premium on a property | `pages/api/admin/properties/toggle-feature.js` | that property's builder `*` (affects sort order shown) |

So in practice: admins see their changes reflected on the next request (cache
miss → fresh data → cache repopulated), while anonymous visitors hitting an
*unchanged* builder page keep getting the fast cached path.

### 4. Query efficiency

The properties lookup is scoped with `.select(...)` to only the fields the
storefront card actually renders (title, address, photos, price fields,
bhk/type, possession status) rather than the full property document — smaller
payloads, less serialization work, less memory churn per request. It also
relies on the existing `propertySchema.index({ builder: 1 })` index (added
earlier alongside the `builder` reference field) so the `Property.find({
builder: id, status: "available" })` query is an index lookup, not a
collection scan, even as the properties collection grows into the thousands.

## Known limitation, stated plainly

This in-process cache lives in one Node process's memory. That's exactly
right for the way this app currently runs (`next dev` / `next start` as a
single long-lived server process) — the cache is shared across every request
that process handles. It would **not** automatically share state across
multiple server instances (e.g. several serverless function invocations, or
several horizontally-scaled containers behind a load balancer) — each
instance would keep its own independent copy. If this app is later deployed
in a multi-instance/serverless topology, the HTTP `Cache-Control` header
above is what carries the real weight (a CDN in front of N stateless origins
caches once, regardless of which origin instance would have served it), and a
shared external cache (Redis) would be the natural upgrade for the in-process
layer if origin-level cache hits still need to be shared across instances.
