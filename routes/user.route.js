import User from "../templates/User.hbs";

export const UserRoute = {
  path: "/user/:name",
  title: "User - {{name}}",
  content: User,
  config: {
    template: true,
    content_cache: true,
  },
};
