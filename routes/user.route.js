import User from "../templates/User.hbs";

export const UserRoute = {
  path: "/user/:name",
  title: "User - {{name}}",
  loader: async () => {
    return {
      nums: ["Apple", "Ball"],
    };
  },
  callback: ({ router }) => {
    const events = {
      handleClick: (arr) => {
        console.log(arr);
      },
    };
    router.registerEvents(events);
  },
  content: User,
  config: {
    template: true,
    content_cache: true,
    tag: "user",
  },
};
