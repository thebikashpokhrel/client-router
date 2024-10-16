# Client-Side-Router

A lightweight client-side router for single-page applications (SPA) that enables dynamic navigation between pages without reloading the browser.

## Features

- **Dynamic Routing**: Supports routes with parameters (e.g., `/article/:id`).
- **Loader Functions**: Loader functions to fetch data asynchronously before the content is rendered
- **Template Rendering**: Support for HTML strings, template literals and HandleBars templates for route content
- **Caching**: Built-in caching mechanism for both data and content, with tag-based cache invalidation.
- **Browser History Support**: Uses the browser's history API for back and forward navigation.

## Setup

1. Create a new Vite project:

   ```bash
   npm create vite@latest my-router-app -- --template vanilla
   cd my-router-app
   ```

2. Install dependencies:
   ```bash
   npm install client-router-js handlebars
   ```

## Usage

### 1. Import the Router

In your main JavaScript file (e.g., `src/main.js`), import the router:

```javascript
import { Router } from "client-router-js";

// Define your routes
const routes = [
  {
    path: "/",
    title: "Home",
    content: "Welcome to the homepage!",
  },
  {
    path: "/about",
    title: "About",
    content: "This is the about page.",
  },
];

// Initialize the router
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("app");
  const router = Router(root, routes);
});
```

### 2. Set up HTML

Update your `index.html` to include a root element and navigation:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Router App</title>
  </head>
  <body>
    <nav>
      <a href="/" data-type="navigate">Home</a>
      <a href="/about" data-type="navigate">About</a>
    </nav>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

### 3. Using Handlebars Templates (Optional)

If you want to use Handlebars templates:

1. Create a `templates` folder in your `src` directory.
2. Create template files (e.g., `src/templates/Home.hbs`, `src/templates/About.hbs`).
3. Update your routes to use templates:

```javascript
import HomeTemplate from "./templates/Home.hbs";
import AboutTemplate from "./templates/About.hbs";

const routes = [
  {
    path: "/",
    title: "Home",
    content: HomeTemplate,
    config: { template: true },
  },
  {
    path: "/about",
    title: "About",
    content: AboutTemplate,
    config: { template: true },
  },
];
```

### 4. Run Your App

Start your Vite development server:

```bash
npm run dev
```

Now you can navigate to `http://localhost:5173` (or the port Vite assigns) to see your client-side router in action.

## Routing Logic

The router intercepts clicks on links with the attribute `data-type="navigate"` and updates the browser's history without refreshing the page. The logic handles route matching and renders the appropriate content based on the current path.

## Passing Parameters in Routes

The router supports dynamic parameters in the URL, allowing you to pass and capture multiple parameters in the route. These parameters are accessible inside the route configuration as part of the `params` object. You can use this feature to dynamically render content based on the URL.

### Example with Multiple Parameters

In the example below, the route `/user/:userId/post/:postId` has two parameters: `userId` and `postId`.

```js
{
  path: '/user/:userId/post/:postId',
  title: ({params}) => `Post ${params.postId} by User ${params.userId}`,
  content: ({params, data}) => `
    <h1>${data.postTitle}</h1>
    <p>By: ${data.userName} (User ID: ${params.userId})</p>
    <div>${data.postContent}</div>
  `,
  loader: async ({params}) => {
    const postData = await fetchPostData(params.userId, params.postId);
    return postData;
  },
  config: {
    loader_cache: true,
    content_cache: true,
    tag: 'post'
  }
}
```

## Route Object Options

Each route in the router is defined as an object with the following properties:

- **`path`**: (string) The URL path for the route.
- **`title`**: (string | function) The page title. This can either be a string or a function.
- **`content`**: (string | function | template) The content to be rendered. It can be a string with dynamic placeholders, a JavaScript template literal, or a Handlebars template.
- **`loader`**: (function) Asynchronous function to load data.
- **`config`**: (object) Configuration options for the route.

### Example:

```javascript
const route = {
  path: '/user/:id',
  title: ({params, data}) => `User Profile: ${params.id}`, // Access dynamic route params in title
  content: ({params, data}) => `<h1>${data.name}'s Profile</h1>`, // Render content with loader data
  loader: async ({params}) => {} //Loader function that returns data object
  config: { loader_cache: true }
};
```

## Routing Content Options

### 1. String Content with Dynamic Parameters

You can include simple dynamic parameters in string content using double curly braces {{ }}.

```js
{
  path: '/user/:id',
  title: 'User Profile',
  content: '<h1>{{name}} {{lastName}}</h1><p>User ID: {{id}}</p>' // Dynamic content placeholders
  loader: async () =>{
    return {
      firstName:"Hello",
      lastName:"World"
    }
  }
}
```

### 2. JavaScript Template Literal

Use JavaScript template literals (enclosed in backticks) for more complex dynamic content. `data` object is passed through loader function.

```js
{
  path: '/user/:id',
  title: ({ params }) => `User ${params.id}`,
  content: ({ data, params }) => `
    <h1>${data.name}'s Profile</h1>
    <p>User ID: ${params.id}</p>
    <p>Email: ${data.email}</p>
  `,
  loader: async () =>{
    return {
      name:"John",
      email:"john@gmail.com"
    }
  }
}
```

### 3. Handlebars Template

For more structured and reusable templates, you can use Handlebars.

```js
import Country from "./src/templates/Country.hbs";
```

```js
{
  path: '/country/:code',
  title: 'Country Info',
  content: Country, // Reference the Handlebars template
  loader: async () =>{
    //Fetch country details through api
    return {
      country
    }
  }
  config: { template: true } // Indicate it's a Handlebars template
}
```

In your Handlebars template file (Country.hbs):

```hbs
<h1>{{data.country.name.common}}</h1>
<p>Population: {{data.country.population}}</p>
<p>Region: {{data.country.region}}</p>
<p>Code: {{params.code}} </p>
```

## Loader Functions

Loader functions are asynchronous functions that fetch data for a route. They receive an object with the `params` of the route.

```js
const fetchUserData = async ({ params }) => {
  const response = await fetch(`/api/users/${params.id}`);
  return response.json();
};

{
  path: '/user/:id',
  loader: fetchUserData,
  // ...
}
```

The object returned by the loader function is available in the `data` object when rendering the content.

## Caching

The router supports caching for both loader data and rendered content, which improves performance by avoiding redundant data fetching or content re-rendering.

- ### Loader Caching

  To enable loader caching, use the loader_cache option in the config object. This will cache the result of the loader function.

  ```js
  {
    //other options
    config: {
      loader_cache: true;
    }
  }
  ```

- ### Content Caching
  Similarly, content caching can be enabled using the content_cache option. The content will be cached after the first render, preventing re-renders for the same route.
  ```js
  {
    //other options
    config: {
      content_cache: true;
    }
  }
  ```

## Cache Invalidation

The router allows cache invalidation based on the tags specified in the route's configuration. You can use tags to selectively clear the cached data for specific routes, either for the loader or the content.

```js
{
  path: '/user/:id',
  title: ({data}) => `${data.name}'s Profile`,
  content: UserProfileTemplate,
  loader: fetchUserData,
  config: {
    loader_cache: true,
    content_cache: true,
    template: true,
    tag: 'user-profile'
  }
}

router.invalidateCache('user-profile', 'LOADER'); //Invalidate loader's cache
```

## Config Options

The `config` object in a route can include:

- `loader_cache`: (boolean) Enable caching for loader results.
- `content_cache`: (boolean) Enable caching for rendered content.
- `template`: (boolean) Indicate that the content is a Handlebars template.
- `tag`: (string) A tag for cache invalidation.

## Future Updates

I will be actively working on adding new features to enhance the router's functionality.

## Contributing🤝

Contributions are welcome! Feel free to submit a pull request or open an issue to discuss new features or bugs.
