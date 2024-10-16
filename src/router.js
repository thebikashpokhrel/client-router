import cache from "./libs/cache";
import {
  getPathname,
  registerRouter,
  resolveDynamicString,
} from "./libs/utils";
import { matchRoute, extractParams } from "./libs/routeMatch";
import { execAsyncLoader } from "./libs/execAsyncLoader";

// Main Router Function
export const Router = (root, routes) => {
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
      matchedRoute.params = extractParams(route.path, regexMatch);

      const fnArgs = { params: matchedRoute.params };

      // Load data via the loader function
      await execAsyncLoader(route, matchedRoute, fnArgs, cache);
      fnArgs.data = matchedRoute.data;

      // Handle title and content
      if (typeof route.title == "string") {
        matchedRoute.title = resolveDynamicString(route.title, fnArgs);
      } else if (typeof route.title == "function") {
        matchedRoute.title = route.title(fnArgs);
      }

      if (typeof route.content == "string") {
        matchedRoute.content = resolveDynamicString(route.content, fnArgs);
      } else if (typeof route.content == "function") {
        matchedRoute.content = route.content(fnArgs);
      }
    }
    // Update DOM content and title
    root.innerHTML = matchedRoute.content || "404 Error - Page not found";
    document.title = matchedRoute.title || "Page not found";

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
    invalidateCache: cache.invalidate,
  };
};
