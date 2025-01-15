import * as z from "zod";

export const AuthCreateSchema = z.object({
  token: z.string(),
});
