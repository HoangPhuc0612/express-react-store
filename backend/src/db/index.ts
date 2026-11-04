import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { ENV } from "../config/env";

if (!ENV.DATABASE_URL) {
  throw new Error("Database url is not set");
}
const pool = new Pool({ connectionString: ENV.DATABASE_URL });

pool.on("connect", async (client) => {
  console.log("Database connection successfully");
  const result = await client.query(`
    SELECT
      current_database() AS database,
      current_schema() AS schema,
      current_setting('search_path') AS search_path,
      inet_server_addr() AS server
  `);

  console.log("DATABASE INFO:", result.rows[0]);

  const columns = await client.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'users'
    ORDER BY ordinal_position
  `);

  console.log("USERS COLUMNS:", columns.rows);
});

pool.on("error", (error) => {
  console.error("Database connection error: ", error);
});

export const db = drizzle({ client: pool, schema });
