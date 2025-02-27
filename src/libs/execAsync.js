import { resolveDynamicString, resolveTemplate } from "./utils";
import Handlebars from "handlebars";
// Execute route loader and handle caching
export const execAsyncLoader = async (matchedRoute, fnArgs, cache) => {
  let cachedData = null;
  let cacheResult = false;
  // Caching logic
  if (matchedRoute.config?.loader_cache) {
    cachedData = cache.get(matchedRoute.path, "LOADER");

    if (!cachedData) cacheResult = true;
  }

  if (cachedData) {
    matchedRoute.data = cachedData;
    return;
  } else {
    if (typeof matchedRoute.loader === "function") {
      matchedRoute.data = await matchedRoute.loader(fnArgs);
      if (cacheResult) {
        cache.add(
          {
            path: matchedRoute.path,
            entry: matchedRoute.data,
          },
          "LOADER"
        );
      }
    }
  }
};

const stringToHtmlNode = (htmlString) => {
  const template = document.createElement("template"); // Create a template element
  template.innerHTML = htmlString.trim(); // Set the HTML string and trim any unnecessary spaces
  return template.content.firstChild; // Return the first child of the template's content
};

// Execute template loading and handle caching
export const execAsyncContent = async (matchedRoute, fnArgs, cache, states) => {
  let cachedContent = null; //Cache data
  let cacheResult = false; //Whether to cache new data or not
  let compiledTemplate = null;
  // Caching logic
  if (matchedRoute.config?.content_cache) {
    cachedContent = cache.get(matchedRoute.path, "CONTENT");
    if (!cachedContent) {
      cacheResult = true;
    }
  }

  if (cachedContent) {
    states.retrievedFromCache = true;
    if (matchedRoute.config?.template) {
      matchedRoute.content = stringToHtmlNode(
        cachedContent({
          data: fnArgs.data,
          params: fnArgs.params,
        })
      );
    } else {
      matchedRoute.content = cachedContent;
    }
    return;
  } else {
    if (
      typeof matchedRoute.content == "string" &&
      !matchedRoute.config?.template
    ) {
      matchedRoute.content = resolveDynamicString(matchedRoute.content, fnArgs);
      matchedRoute.content = stringToHtmlNode(
        `<RouteContent>${matchedRoute.content}</RouteContent>`
      );
    } else if (typeof matchedRoute.content == "function") {
      matchedRoute.content = matchedRoute.content(fnArgs);
      matchedRoute.content = stringToHtmlNode(
        `<RouteContent>${matchedRoute.content}</RouteContent>`
      );
    } else if (matchedRoute.config?.template) {
      compiledTemplate = await resolveTemplate(matchedRoute.content, fnArgs);

      matchedRoute.content = stringToHtmlNode(
        compiledTemplate({
          data: fnArgs.data,
          params: fnArgs.params,
        })
      );
    }
    if (cacheResult) {
      cache.add(
        {
          path: matchedRoute.path,
          entry: compiledTemplate || matchedRoute.content,
        },
        "CONTENT"
      );
    }
  }
};
