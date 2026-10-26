# Changelog

## 3.0.0

### Fixed

- Coalesce concurrent `CachedVariable.getAsync()` calls onto one shared in-flight update.
- Allow retries after synchronous or asynchronous update failures without leaving the cache permanently updating.
- Prevent updates started before invalidation from repopulating the cache or being returned by waiting getters.
- Prevent obsolete expiration timers from deleting newer values.
- Handle errors from timer-triggered disposal events without unhandled promise rejections.
- Continue non-lazy periodic scheduling after a failed update.
- Preserve cached `undefined` values through the new concurrency path.
- Apply the same concurrency guarantees to values managed by `CachedMap`.

### Breaking changes

- `CachedMap.clearCache()` now returns `Promise<void>` and awaits disposal of entries from the old map. The map replacement itself still happens synchronously.
- `CachedMap.clearCacheForKey()` now returns `Promise<void>` so callers can await disposal completion.
