//Routing Function
export const Router = (root, routes) => {
  const getPathname = () => window.location.pathname;
  const registerRouter = () => {
    //Register to use router for all <a> elements with data-type attribute set to navigate
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

  //Routing Logic
  const handleRoutes = () => {
    const fullPath = getPathname();
    let matchedRoute = {
      path: getPathname(),
      param: {},
    };
    routes.some((route) => {
      const pathRegex = route.path.replace(/:\w+/g, "([^/]+)");
      const regex = new RegExp(`^${pathRegex}$`);
      const match = matchedRoute.path.match(regex);
      let paramName = null;
      let paramValue = null;

      if (match) {
        if (route.path.includes(":")) {
          paramName = route.path.match(/:(\w+)/)[1];
          paramValue = match[1];

          matchedRoute.param[paramName] = paramValue;
        }
        matchedRoute.title = route.title.replace(/{{(\w+)}}/g, (match, name) =>
          name === paramName ? paramValue : ""
        );

        matchedRoute.content = route.content.replace(
          /{{(\w+)}}/g,
          (match, name) => (name === paramName ? paramValue : "")
        );
      }
    });

    root.innerHTML =
      matchedRoute.content ||
      "404 Error - Oops!! requested page does not exist";
    document.title = matchedRoute?.title || "Page not found";

    //Re-attach events listener for dynamically loaded links
    registerRouter();
  };
  //Redefine pushstate logic for routing
  const originalPushState = history.pushState;
  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    handleRoutes(root, routes);
  };

  // Back/forward navigation
  window.addEventListener("popstate", () => {
    handleRoutes(root, routes);
  });

  registerRouter();
  handleRoutes();
};
