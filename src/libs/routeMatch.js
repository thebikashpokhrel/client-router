// Match the current path to the routes and extract any URL params

export const registerTags = (routes, routeTags) => {
  routes.forEach((route) => {
    if (route.config?.tag) {
      routeTags[route.path] = route.config.tag;
    }
  });
};

export const matchRoute = (routes, fullPath) => {
  let matchedRoute = null;
  let regexMatch = null;

  routes.some((route) => {
    const pathRegex = route.path.replace(/:\w+/g, "([^/]+)");
    const regex = new RegExp(`^${pathRegex}$`);
    const match = fullPath.match(regex);

    if (match) {
      matchedRoute = route;
      regexMatch = match;
      return true; // Exit the loop when match is found
    }
    return false; // Continue searching
  });

  return { route: matchedRoute, regexMatch };
};

// Extract parameters from the matched route
export const extractParams = (path, regexMatch) => {
  const paramNames = [...path.matchAll(/:(\w+)/g)].map((m) => m[1]);
  const params = {};
  paramNames.forEach((paramName, index) => {
    params[paramName] = regexMatch[index + 1];
  });
  return params;
};
