"use client";

import { createContext, useContext } from "react";
import type { Tenant, Branch } from "./types";

interface TenantContextValue {
  tenant: Tenant;
  branch: Branch | null;
}

const TenantContext = createContext<TenantContextValue | null>(null);

export function TenantProvider({
  tenant,
  branch,
  children,
}: {
  tenant: Tenant;
  branch: Branch | null;
  children: React.ReactNode;
}) {
  return (
    <TenantContext.Provider value={{ tenant, branch }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant(): TenantContextValue {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error("useTenant must be used within TenantProvider");
  return ctx;
}
