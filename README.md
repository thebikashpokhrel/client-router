# Client-Side-Router

A lightweight client-side router for single-page applications (SPA) that enables dynamic navigation between pages without reloading the browser.

## Features

- **Dynamic Routing**: Supports routes with parameters (e.g., `/article/:id`).
- **Easy Integration**: Minimal setup required to integrate with existing HTML.
- **Navigation Handling**: Intercepts clicks on `<a>` elements with a `data-type` attribute.
- **Browser History Support**: Uses the browser's history API for back and forward navigation.

## Usage

To use the client-side router, follow these steps:

### 1. Include the Router

Ensure that `router.js` is included in your HTML file.

### 2. Define Routes

Create an array of route objects. Each route should specify the path, title, and content.

### 3. Initialize the Router

Call the Router function, passing in the root element and the routes.

### Example Code

#### HTML

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Client-Side-Router Example</title>
    <script type="module" src="main.js" defer></script>
  </head>
  <body>
    <div id="root"></div>
    <script src="router.js" type="module"></script>
  </body>
</html>
```

#### JavaScript

```JS
import { Router } from "./router.js";

const rootElement = document.querySelector("#root");
const routes = [
  {
    path: "/",
    title: "Home",
    content: `
      <h1>This is home route</h1>
      <ul>
        <li><a href="/article/1" data-type="navigate">Article 1</a></li>
        <li><a href="/article/2" data-type="navigate">Article 2</a></li>
        <li><a href="/article/3" data-type="navigate">Article 3</a></li>
      </ul>
    `,
  },
  {
    path: "/about",
    title: "About",
    content: `<h1>This is about route</h1>`,
  },
  {
    path: "/contact-us",
    title: "Contact Us",
    content: `<h1>This is contact us route</h1>`,
  },
  {
    path: "/article/:id",
    title: "Article {{id}}",
    content: `<h1>Article {{id}}</h1>`,
  },
  {
    path: "/user/:name",
    title: "User Page",
    content: `<h1>Hello {{name}}</h1>`,
  },
];

Router(rootElement, routes);
```

## Routing Logic

The router intercepts clicks on links with the attribute `data-type="navigate"` and updates the browser's history without refreshing the page. The logic handles route matching and renders the appropriate content based on the current path.

## Examples

- **Accessing the Home Page**: When visiting the root URL (`/`), the home content is displayed.
- **Navigating to an Article**: Clicking on "Article 1" navigates to `/article/1`, and the content dynamically updates to reflect the article ID.
- **Dynamic Content**: The router can extract parameters like `id` or `name` from the URL and display relevant information accordingly.

## Future Updates

I will be actively working on adding new features to enhance the router's functionality.

## Contributing🤝

Contributions are welcome! Feel free to submit a pull request or open an issue to discuss new features or bugs.
