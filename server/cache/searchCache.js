const CACHE_TTL = 2*60*60*1000; //2 hours in milliseconds, hour * minute* second*miliseconds
const cache = new Map();
const MAX_CACHE_ENTRIES = 100;

export const getCacheKey = (title, location) => {
    return `${title.toLowerCase().trim()}|${(location || '').toLowerCase().trim()}`;
  };
  
  export const getCached = (key) => {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      cache.delete(key);
      return null;
    }
    return entry.results;
  };
  
  export const setCache = (key, results) => {
    // If already at capacity, remove  oldest entry before adding
    if (cache.size >= MAX_CACHE_ENTRIES) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
      console.log(`Cache full — evicted oldest entry: "${oldestKey}"`);
    }
    cache.set(key, { results, timestamp: Date.now() });
  };
  
  