import { Insertable } from "kysely";
import { Generated, Kysely, Selectable } from "kysely";
import { D1Dialect } from "kysely-d1";

export const createDatabaseConnection = (database: D1Database) => {
  return new Kysely<Database>({ dialect: new D1Dialect({ database }) });
};

export interface Database {
  log: LogTable;
}

export interface LogTable {
  id: Generated<number>;
  userUUID: string;
  createdAt: string;
  content: string;
}

export type Log = Selectable<LogTable>;
export type NewLog = Insertable<LogTable>;
