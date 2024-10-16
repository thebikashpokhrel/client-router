import { Router } from "./src/router";
import { Country } from "./components/country";

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
    content: ({ params, data: { country } }) => {
      return Country(country);
    },
    config: {
      loader_cache: true,
    },
  },
];

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");
  Router(root, routes);
});
