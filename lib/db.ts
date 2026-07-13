import { neon } from "@neondatabase/serverless";

/**
 * Cliente de Postgres (Neon), inyectado por la integración de
 * Vercel Marketplace vía la variable DATABASE_URL. Se usa con
 * template strings: sql`select * from tabla where id = ${id}`.
 * Neon arma la consulta parametrizada automáticamente (sin riesgo
 * de SQL injection).
 */
export const sql = neon(
  process.env.DATABASE_URL ?? process.env.POSTGRES_URL!
);
