export type Role = "super_admin" | "admin" | "registrar";

export interface SessionUser {
  id: string;
  tenantId: string;
  branchId: string;
  email: string;
  name: string;
  role: Role;
}

export interface SessionData {
  user?: SessionUser;
}
