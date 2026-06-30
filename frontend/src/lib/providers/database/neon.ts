import { neon } from "@neondatabase/serverless";
import type { DatabaseProvider } from "./index";

export class NeonProvider implements DatabaseProvider {
  private sql: ReturnType<typeof neon>;

  constructor(connectionString: string) {
    this.sql = neon(connectionString);
  }

  async query<T = Record<string, unknown>>(
    sql: string,
    params?: unknown[]
  ): Promise<T[]> {
    const result = await this.sql.query(sql, params ?? []);
    // sql.query returns either a FullQueryResults object or an array directly
    if (Array.isArray(result)) return result as T[];
    return (result.rows ?? []) as T[];
  }

  async queryOne<T = Record<string, unknown>>(
    sql: string,
    params?: unknown[]
  ): Promise<T | null> {
    const rows = await this.query<T>(sql, params);
    return rows[0] ?? null;
  }

  async execute(sql: string, params?: unknown[]): Promise<number> {
    const result = await this.sql.query(sql, params ?? []);
    return result.rowCount ?? 0;
  }
}
