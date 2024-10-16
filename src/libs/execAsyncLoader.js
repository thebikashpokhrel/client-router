// Execute route loader and handle caching
export const execAsyncLoader = async (route, matchedRoute, fnArgs, cache) => {
  // Check for caching logic
  if (route.config?.loader_cache) {
    console.log("hello world");
    if (cache.check(matchedRoute.path)) {
      matchedRoute.data = cache.get(matchedRoute.path);
    } else {
      if (typeof route.loader === "function") {
        matchedRoute.data = await route.loader(fnArgs);
        cache.add({
          path: matchedRoute.path,
          data: matchedRoute.data,
        });
      }
    }
  } else if (typeof route.loader === "function") {
    matchedRoute.data = await route.loader(fnArgs);
  }
};
