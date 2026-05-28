import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "../lib/env";
import * as schema from "../../db/schema";
import * as relations from "../../db/relations";

const fullSchema = { ...schema, ...relations };

let instance: any;

export function getDb() {
  if (!instance) {
    const url = env.databaseUrl;
    if (!url) {
      throw new Error("DATABASE_URL is not defined in environment variables.");
    }
    
    // TiDB Cloud Serverless requires explicit SSL configuration for most drivers
    const poolConnection = mysql.createPool({
      uri: url,
      ssl: {
        // This is necessary for TiDB Cloud Serverless to allow the connection
        rejectUnauthorized: true,
      },
      // Ensure the connection doesn't time out too quickly
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    instance = drizzle(poolConnection, {
      mode: "default",
      schema: fullSchema,
    });
  }
  return instance;
}
