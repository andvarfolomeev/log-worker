import { Kysely } from "kysely";
import { Database } from "./database";

export type Bindings = {
  DB: D1Database;
};

export type Variables = {
  db: Kysely<Database>;
};

export type AppContext = {
  Bindings: Bindings;
  Variables: Variables;
};
