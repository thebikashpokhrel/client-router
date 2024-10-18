import { Router } from "./src/router";
import { HomeRoute } from "./routes/home.route";
import { UsersRoute } from "./routes/users.route";
import { UserRoute } from "./routes/user.route";
import { CountryRoute } from "./routes/country.route";

const routes = [HomeRoute, CountryRoute, UsersRoute, UserRoute];
const root = document.getElementById("root");
const router = Router(root, routes);
