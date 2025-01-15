import * as z from "zod";

export const LogCreateRequestSchema = z.object({
  data: z.union([z.object({}), z.string({})]),
});

export const LogCreateResponseSchema = z.object({
  message: z.string(),
});

export type LogCreateRequest = z.infer<typeof LogCreateRequestSchema>;

export const LogGetListRequestSchema = z.object({
  start: z.coerce.date(),
  end: z.coerce.date(),
});

export const LogGetListResponseSchema = z.object({
  items: z.object({
    id: z.number(),
    createdAt: z.string(),
    content: z.object({}),
  }),
});
