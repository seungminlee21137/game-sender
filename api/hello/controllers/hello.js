module.exports = {
  async index(ctx, next) {
    // called by GET /hello

    console.log("asdasdas");
    console.log("asdasdas");
    console.log("asdasdas");
    console.log("asdasdas");

    ctx.body = "Hello World!"; // we could also send a JSON

    return { dd: "dd" };
  },
};
