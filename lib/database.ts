import { neon } from "@neondatabase/serverless"

/**
 * Server-side Postgres client for Neon.
 * NOTE:  This file must be imported ONLY from server
 *        code (API routes, Server Actions, etc.).
 */
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL

if (!connectionString) {
  throw new Error(
    "❌  POSTGRES_URL (or DATABASE_URL) is not defined. " + "Add it to your project’s environment variables.",
  )
}

export const sql = neon(connectionString)
