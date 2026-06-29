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
    const result = await this.sql(sql as unknown as TemplateStringsArray, ...(params ?? []));
    return result as T[];
  }

  async queryOne<T = Record<string, unknown>>(
    sql: string,
    params?: unknown[]
  ): Promise<T | null> {
    const rows = await this.query<T>(sql, params);
    return rows[0] ?? null;
  }

  async execute(sql: string, params?: unknown[]): Promise<number> {
    const result = await this.sql(sql as unknown as TemplateStringsArray, ...(params ?? []));
    return Array.isArray(result) ? result.length : 0;
  }
}
