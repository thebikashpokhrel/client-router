import cache from "./libs/cache";
import {
  getPathname,
  registerRouter,
  resolveDynamicString,
  resolveTemplate,
} from "./libs/utils";
import { matchRoute, extractParams, registerTags } from "./libs/routeMatch";
import { execAsyncContent, execAsyncLoader } from "./libs/execAsync";

// Main Router Function
export const Router = (root, routes) => {
  const routeTags = {};

  registerTags(routes, routeTags); //Register route Tags used for cache invalidation logic

  const invalidateCache = (tagName, type) =>
    cache.invalidate(routeTags[tagName], type);

  // Handle route changes
  const handleRoutes = async () => {
    const fullPath = getPathname();
    const matchedRoute = {
      path: fullPath,
      params: {},
      data: {},
      config: {},
    };

    const { route, regexMatch } = matchRoute(routes, fullPath);

    // If a route is matched
    if (route) {
      matchedRoute.config = route.config || {};
      matchedRoute.loader = route.loader || undefined;
      matchedRoute.title = route.title || undefined;
      matchedRoute.content = route.content || undefined;

      matchedRoute.params = extractParams(route.path, regexMatch);

      const fnArgs = { params: matchedRoute.params };

      // Load data via the loader function
      await execAsyncLoader(matchedRoute, fnArgs, cache);
      fnArgs.data = matchedRoute.data;

      // Handle title and content
      if (typeof route.title == "string") {
        matchedRoute.title = resolveDynamicString(route.title, fnArgs);
      } else if (typeof route.title == "function") {
        matchedRoute.title = route.title(fnArgs);
      }

      // Load the content
      await execAsyncContent(matchedRoute, fnArgs, cache);

      // Update DOM content and title
      root.innerHTML = matchedRoute.content;
      document.title = matchedRoute.title;
    } else {
      // Update DOM content and title
      root.innerHTML = "404 Error - Page not found";
      document.title = "Page not found";
    }
    // Re-attach event listeners for links
    registerRouter();
  };

  // Override history.pushState for SPA behavior
  const originalPushState = history.pushState;
  history.pushState = async function (...args) {
    originalPushState.apply(this, args);
    await handleRoutes();
  };

  // Listen for popstate (back/forward navigation)
  window.addEventListener("popstate", handleRoutes);

  // Initialize the router
  registerRouter();
  handleRoutes(); // Call once on load

  return {
    currentRoute: getPathname(),
    invalidateCache,
  };
};
