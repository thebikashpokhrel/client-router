import { Router } from "./src/router";
import Country from "./templates/Country.hbs";
import Users from "./templates/Users.hbs";

const getUsers = async () => {
  const url = `https://api.freeapi.app/api/v1/public/randomusers?page=${Math.floor(
    Math.random() * 10
  )}&limit=4`;
  const options = { method: "GET", headers: { accept: "application/json" } };

  try {
    const response = await fetch(url, options);
    const json = await response.json();
    return {
      users: json.data.data,
    };
  } catch (error) {
    console.error(error);
  }
};

const routes = [
  {
    path: "/",
    title: "Home",
    content:
      "Welcome to the Country Info App. Click on a country to get details!",
  },
  {
    path: "/country/:code",
    title: ({ params }) => `Country Info - ${params.code}`,

    loader: async ({ params }) => {
      const url = `https://restcountries.com/v3.1/alpha/${params.code}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        const country = data[0];
        return {
          country,
        };
      } catch (error) {
        return {
          error: "Failed to fetch data",
        };
      }
    },
    content: Country,
    config: {
      loader_cache: true,
      content_cache: true,
      template: true,
      tag: "country",
    },
  },
  {
    path: "/users",
    title: "Random Users",
    loader: getUsers,
    content: Users,
    config: {
      template: true,
      content_cache: true,
      loader_cache: true,
    },
  },
];

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");
  const router = Router(root, routes);
});
