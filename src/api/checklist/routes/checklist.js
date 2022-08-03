"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/checklist/jcgf",
      handler: "checklist.deployWeb",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/checklist/happycode",
      handler: "checklist.deployApi",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
