export interface Tenant {
  id: string;
  name: string;
  slug: string;
  customDomain: string | null;
  logoUrl: string | null;
  isActive: boolean;
}

export interface Branch {
  id: string;
  tenantId: string;
  name: string;
  location: string | null;
  countryCode: string;
  isMain: boolean;
  isActive: boolean;
}
