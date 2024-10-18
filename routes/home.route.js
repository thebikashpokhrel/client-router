import Home from "../templates/Home.hbs";

export const HomeRoute = {
  path: "/",
  title: "Home",
  loader: async () => {
    return {
      nums: [1, 2, 3, 2, 3],
    };
  },
  callback: ({ router }) => {
    const events = {
      handleClick: (nums, obj) => {
        console.log(nums);
      },
    };
    router.registerEvents(events);
  },
  content: Home,
  config: {
    template: true,
    content_cache: true,
    tag: "home",
  },
};
