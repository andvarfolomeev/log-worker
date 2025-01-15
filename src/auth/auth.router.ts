import { Hono } from "hono";
import { AppContext } from "../types";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import { AuthCreateSchema } from "./auth.schemas";

export const authRouter = new Hono<AppContext>();

authRouter.post(
  "/",
  describeRoute({
    description: "Create user",
    responses: {
      200: {
        description: "Successful response",
        content: {
          "text/plain": { schema: resolver(AuthCreateSchema) },
        },
      },
    },
  }),
  async (c) => {
    const token = crypto.randomUUID();
    return c.json({ token });
  },
);
