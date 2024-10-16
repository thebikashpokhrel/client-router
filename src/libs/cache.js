const Cache = {
  LOADER: new Map(),
  CONTENT: new Map(),
};
const getFromCache = (path, type) => {
  return Cache[type].get(path) || null;
};

const addToCache = ({ path, entry }, type) => {
  Cache[type].set(path, entry); // Cache Data(entry) is stored with path as the key
};

const checkForCache = (path, type) => {
  return Cache[type].has(path); // Check if path exists in the cache
};

const invalidateCache = (path, type) => {
  Cache[type].delete(path); // Remove the cache entry by path
};

export default {
  store: Cache,
  get: getFromCache,
  add: addToCache,
  check: checkForCache,
  invalidate: invalidateCache,
};
