import cache from "./libs/cache";

// Routing Function
export const Router = (root, routes) => {
  const getPathname = () => window.location.pathname;
  const registerRouter = () => {
    const links = document.querySelectorAll("[data-type='navigate']");
    links.forEach((elem) => {
      elem.removeEventListener("click", handleLinkClick);
      elem.addEventListener("click", handleLinkClick);
    });
  };

  const handleLinkClick = (e) => {
    e.preventDefault();
    const stateObject = {};
    history.pushState(stateObject, "", e.target.pathname);
  };
  // Routing Logic
  const handleRoutes = async () => {
    const fullPath = getPathname();
    let route = null;
    let regexMatch = null;

    let matchedRoute = {
      path: fullPath,
      params: {},
      data: {},
      config: {},
    };

    const fnArgs = {};

    // Route matching logic
    routes.some((rt) => {
      const pathRegex = rt.path.replace(/:\w+/g, "([^/]+)");
      const regex = new RegExp(`^${pathRegex}$`);
      const match = matchedRoute.path.match(regex);

      if (match) {
        route = rt;
        regexMatch = match;
      }
    });

    // If matching route is found
    if (route) {
      //Config Options
      matchedRoute.config = route.config;
      if (route.path.includes(":")) {
        const paramNames = [...route.path.matchAll(/:(\w+)/g)].map((m) => m[1]);
        paramNames.forEach((paramName, index) => {
          matchedRoute.params[paramName] = regexMatch[index + 1];
        });
      }

      fnArgs.params = matchedRoute.params;

      // Load the loader data into data prop
      console.log(cache.store);
      const execAsyncLoader = async () => {
        if (
          cache.check(matchedRoute.path) &&
          matchedRoute.config.loader_cache
        ) {
          matchedRoute.data = cache.get(matchedRoute.path);
        } else {
          if (typeof route.loader == "function") {
            matchedRoute.data = await route.loader(fnArgs);
            if (matchedRoute.config.loader_cache) {
              cache.add({
                path: matchedRoute.path,
                data: matchedRoute.data,
              });
            }
          }
        }

        fnArgs.data = matchedRoute.data;

        //Add the loaded data to cache for further retrieval

        // Handle title and content
        if (typeof route.title == "string") {
          matchedRoute.title = route.title.replace(
            /{{(\w+)}}/g,
            (match, name) =>
              matchedRoute.params[name] || matchedRoute.data[name] || ""
          );
        } else if (typeof route.title == "function") {
          matchedRoute.title = route.title(fnArgs);
        }

        if (typeof route.content == "string") {
          matchedRoute.content = route.content.replace(
            /{{(\w+)}}/g,
            (match, name) =>
              matchedRoute.params[name] || matchedRoute.data[name] || ""
          );
        } else if (typeof route.content == "function") {
          matchedRoute.content = route.content(fnArgs);
        }
      };

      // Await the loader execution
      await execAsyncLoader();
    }

    // Update the root innerHTML and document title after async loading
    root.innerHTML =
      matchedRoute.content ||
      "404 Error - Oops!! requested page does not exist";
    document.title = matchedRoute.title || "Page not found";

    // Re-attach events listener for dynamically loaded links
    registerRouter();
  };

  // Redefine pushState logic for routing
  const originalPushState = history.pushState;
  history.pushState = async function (...args) {
    originalPushState.apply(this, args);
    await handleRoutes();
  };

  // Back/forward navigation
  window.addEventListener("popstate", async () => {
    await handleRoutes();
  });

  registerRouter();
  handleRoutes(); // Initial call to handleRoutes

  return {
    currentRoute: getPathname(),
    invalidateCache: cache.invalidate,
  };
};
