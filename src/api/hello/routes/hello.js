"use strict";

// const { createCoreRouter } = require("@strapi/strapi").factories;
// module.exports = createCoreRouter("api::hello.hello");

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/hello/v2/code",
      handler: "hello.testcode",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/hello/v2/test",
      handler: "hello.test",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
