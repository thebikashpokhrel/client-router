import Handlebars from "handlebars";

// Get the current pathname
export const getPathname = () => window.location.pathname;

// Attach event listeners to links for SPA navigation
export const registerRouter = () => {
  const links = document.querySelectorAll("[data-type='navigate']");
  links.forEach((elem) => {
    elem.removeEventListener("click", handleLinkClick);
    elem.addEventListener("click", handleLinkClick);
  });
};

// Handle click events for link navigation
const handleLinkClick = (e) => {
  e.preventDefault();
  const stateObject = {};
  history.pushState(stateObject, "", e.target.pathname);
};

// Replace placeholders (e.g., {{param}}) with dynamic values
export const resolveDynamicString = (template, args) => {
  return template.replace(/{{(\w+)}}/g, (match, name) => {
    return args.params[name] || args.data[name] || "";
  });
};

/// Resolve handlebar template
export const resolveTemplate = async (templatePath, args) => {
  Handlebars.registerHelper("formatPopulation", function (population) {
    // Check if population is a number
    if (typeof population === "number") {
      return population.toLocaleString();
    }
    return "N/A"; // Return a fallback value if population is not a number
  });

  try {
    // Fetch the template content from the provided file path (templatePath)
    const response = await fetch(templatePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch template: ${response.statusText}`);
    }
    const templateText = await response.text();

    // Compile the Handlebars template
    const compiledTemplate = Handlebars.compile(templateText);
    const renderedHtml = compiledTemplate({
      params: args.params,
      data: args.data,
    });

    return renderedHtml;
  } catch (error) {
    console.error(`Error resolving template: ${error}`);
    return `<p>Error loading template</p>`;
  }
};
