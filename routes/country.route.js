import Country from "../templates/Country.hbs";

export const CountryRoute = {
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
};
