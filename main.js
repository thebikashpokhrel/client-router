import { Router } from "./router";

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
    content: `
        <h1>This is about route</h1>
        `,
  },
  {
    path: "/contact-us",
    title: "Contact Us",
    content: `
          <h1>This is contact us route</h1>
          `,
  },
  {
    path: "/article/:id",
    title: "Article {{id}}",
    content: `
      <h1>Article {{id}} </h1>
    `,
  },
  {
    path: "/user/:name",
    title: "User Page",
    content: `
    <h1>Hello {{name}}</h1>
    `,
  },
];

Router(rootElement, routes);
