const loaderCache = new Map();

const getFromLoaderCache = (path) => {
  return loaderCache.get(path) || null;
};

const addToLoaderCache = ({ path, data }) => {
  loaderCache.set(path, data); // Cache Data is stored with path as the key
};

const checkForLoaderCache = (path) => {
  return loaderCache.has(path); // Check if path exists in the cache
};

const invalidateLoaderCache = (path) => {
  loaderCache.delete(path); // Remove the cache entry by path
};

export default {
  store: loaderCache,
  get: getFromLoaderCache,
  add: addToLoaderCache,
  check: checkForLoaderCache,
  invalidate: invalidateLoaderCache,
};
