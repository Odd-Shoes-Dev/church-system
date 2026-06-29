export interface DatabaseProvider {
  query<T = Record<string, unknown>>(
    sql: string,
    params?: unknown[]
  ): Promise<T[]>;

  queryOne<T = Record<string, unknown>>(
    sql: string,
    params?: unknown[]
  ): Promise<T | null>;

  execute(sql: string, params?: unknown[]): Promise<number>;
}

let provider: DatabaseProvider | null = null;

export function getDatabase(): DatabaseProvider {
  if (!provider) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { NeonProvider } = require("./neon");
    provider = new NeonProvider(process.env.DATABASE_URL!);
  }
  return provider!;
}

export type { DatabaseProvider as DB };
