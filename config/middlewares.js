module.exports = [
  {
    name: "strapi::cors",
    config: {
      enabled: true,
      headers: "*",
      origin: [
        "http://localhost:1337",
        "http://127.0.0.1:1337",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://10.100.100.10:1337",
        "http://10.100.100.10:3000",
      ],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
      keepHeaderOnError: true,
    },
  },
  "strapi::errors",
  "strapi::security",
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
