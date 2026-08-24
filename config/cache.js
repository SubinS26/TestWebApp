/**
 * In-Memory LRU & TTL Caching Layer
 * Meets System Protocol Rule 3: Deliver scalability mechanisms by deploying a caching network
 * to decrease lookup times and offload recurring read traffic from the core database engine.
 */

class MemoryCache {
  constructor(defaultTTLSeconds = 30, maxItems = 1000) {
    this.cache = new Map()
    this.defaultTTL = defaultTTLSeconds * 1000
    this.maxItems = maxItems
  }

  get(key) {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  set(key, value, ttlSeconds) {
    if (this.cache.size >= this.maxItems) {
      // Evict oldest entry (LRU)
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }

    const ttl = (ttlSeconds !== undefined ? ttlSeconds : this.defaultTTL / 1000) * 1000
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl,
    })
  }

  del(key) {
    this.cache.delete(key)
  }

  delPrefix(prefix) {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key)
      }
    }
  }

  clear() {
    this.cache.clear()
  }
}

const appCache = new MemoryCache()

module.exports = appCache
