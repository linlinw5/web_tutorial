[← Back to Chapter Home](../../readme.md)

# Step 10: Performance Optimization — Tag Caching

Add an in-memory cache to the frequently called `getAllTags()` function to reduce database query pressure.

## Problem Analysis

`getAllTags()` is called by **nearly every web route** — because the navigation bar in `header.ejs` needs the tag list to render its links. As traffic grows, querying the database on every request creates unnecessary load.

Tag data is **essentially static**: this project does not even provide an API for adding or removing tags. This is an ideal scenario for introducing a cache.

## Cache Implementation (Module-Level Variable + TTL)

```typescript
// src/db/dbTag.ts

let tagsCache: Tag[] | null = null;    // cached data
let cacheTimestamp = 0;                // timestamp of the last query
const CACHE_TTL = 5 * 60 * 1000;      // cache lifetime: 5 minutes

export async function getAllTags(): Promise<Tag[]> {
    const now = Date.now();
    // Cache exists and has not expired — return immediately
    if (tagsCache && (now - cacheTimestamp < CACHE_TTL)) {
        return tagsCache;
    }
    // Cache expired or missing — query the database and update the cache
    tagsCache = await origin_getAllTags();
    cacheTimestamp = now;
    return tagsCache;
}

// For proactively invalidating the cache when tags are added or removed in the future
export function clearTagsCache() {
    tagsCache = null;
    cacheTimestamp = 0;
}
```

From every caller's perspective, the function signature is unchanged — this is the core advantage of this encapsulation approach: **callers require zero modifications**.

## Design Highlights

| Point | Explanation |
|---|---|
| Module-level variables | `tagsCache` and `cacheTimestamp` live for the module's lifetime and reset on server restart |
| TTL (Time To Live) | Forces a fresh database query after 5 minutes to prevent stale data |
| `clearTagsCache()` | If a tag add/remove API is implemented in the future, call this to immediately invalidate the cache |
| Original function unexported | `origin_getAllTags()` is private; external code can only access `getAllTags()` with caching |

## When to Use This Pattern

The "module-level variable cache" pattern is well-suited for:
- Data that changes infrequently
- Data that is read at very high frequency
- Small datasets that fit entirely in memory
