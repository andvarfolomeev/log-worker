import { Hono } from "hono";
import { AppContext } from "../types";
import { describeRoute } from "hono-openapi";
import { resolver, validator } from "hono-openapi/zod";
import { authMiddleware } from "../auth/auth.middleware";
import {
  LogCreateRequest,
  LogCreateRequestSchema,
  LogCreateResponseSchema,
  LogGetListRequestSchema,
  LogGetListResponseSchema,
} from "./log.schemas";
import { NewLog } from "../database";

export const logRouter = new Hono<AppContext>();

logRouter.use(authMiddleware);

logRouter.post(
  "/",
  describeRoute({
    description: "Create log",
    responses: {
      200: {
        description: "Successful response",
        content: {
          "text/plain": { schema: resolver(LogCreateResponseSchema) },
        },
      },
    },
  }),
  validator("json", LogCreateRequestSchema),
  async (c) => {
    const json: LogCreateRequest = await c.req.json();
    const newLog: NewLog = {
      userUUID: c.req.header("Authorization") as string,
      createdAt: new Date().toISOString(),
      content: JSON.stringify(
        typeof json.data == "string" ? { data: JSON.parse(json.data) } : json,
      ),
    };
    await c
      .get("db")
      .insertInto("log")
      .values(newLog)
      .returningAll()
      .executeTakeFirstOrThrow();
    return c.json({ message: "Log created" });
  },
);

logRouter.get(
  "/",
  describeRoute({
    description: "Get logs",
    responses: {
      200: {
        description: "Successful response",
        content: {
          "text/plain": { schema: resolver(LogGetListResponseSchema) },
        },
      },
    },
  }),
  validator("query", LogGetListRequestSchema),
  async (c) => {
    const { start, end } = c.req.query();
    const items = await c
      .get("db")
      .selectFrom("log")
      .where("userUUID", "=", c.req.header("Authorization") as string)
      .where("createdAt", ">", start)
      .where("createdAt", "<", end)
      .selectAll()
      .execute()
      .then((items) =>
        items.map((item) => ({
          ...item,
          content: JSON.parse(item.content),
        })),
      );
    return c.json({ items });
  },
);
