export const Country = (country) => {
  return `
    <h2>${country.name.common}</h2>
      <p>Capital: ${country.capital}</p>
      <p>Region: ${country.region}</p>
      <p>Population: ${country.population.toLocaleString()}</p>
      <img src="${country.flags.svg}" alt="Flag of ${
    country.name.common
  }" width="200">
    `;
};
