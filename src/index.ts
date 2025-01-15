import { Hono } from "hono";
import { AppContext } from "./types";
import { createDatabaseConnection } from "./database";
import { authRouter } from "./auth/auth.router";
import { apiReference } from "@scalar/hono-api-reference";
import { openAPISpecs } from "hono-openapi";
import { logRouter } from "./log/log.router";

const app = new Hono<AppContext>();

app.use(async (c, next) => {
  c.set("db", createDatabaseConnection(c.env.DB));
  await next();
});

app.route("/auth", authRouter);
app.route("/log", logRouter);

app.get(
  "/openapi",
  openAPISpecs(app, {
    documentation: {
      components: {
        securitySchemes: {
          token: {
            type: "apiKey",
            in: "header",
            name: "Authorization",
          },
        },
      },
      security: [{ token: [] }],
      info: {
        title: "Log worker",
        version: "1.0.0",
        description:
          "Simple REST API to log something via http in Cloudflare Workers",
      },
    },
  }),
);

app.get("/docs", apiReference({ theme: "saturn", spec: { url: "/openapi" } }));

export default app;
