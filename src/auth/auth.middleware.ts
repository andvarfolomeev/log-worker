import { createMiddleware } from "hono/factory";

export const authMiddleware = createMiddleware(async (c, next) => {
  if (!c.req.header("Authorization")) {
    return c.json({ message: "Token is required" });
  }
  await next();
});
