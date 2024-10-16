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
