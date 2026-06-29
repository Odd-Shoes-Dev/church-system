export interface QueryResult<T = Record<string, unknown>> {
  rows: T[];
  rowCount: number;
}
