"use strict";

/**
 *  hello controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

// module.exports = createCoreController("api::hello.hello");

module.exports = {
  async testcode(ctx) {
    console.log("aaa");
    console.log("testcode>>>>");

    return { request: "/hello/v2/code", success: "200", message: "ok" };
  },
  async test() {
    console.log("test");
    console.log("test>>>>");

    return { request: "/hello/v2/test", success: "200", message: "ok" };
  },
};
