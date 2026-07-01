# Tenant Management — Pending Implementation

This document covers two related areas that are not yet implemented and should be revisited once the business model and operational approach are clearer.

---

## 1. Church Onboarding (Tenant Registration)

### Current State
There is no self-service or automated onboarding flow. New churches (tenants) are currently provisioned manually by inserting directly into the database using the seed SQL file. This is only practical during development.

### Options to Consider

**Option A — Platform-admin provisioning**
The system operator creates new tenants on behalf of churches through a private internal admin panel (separate from the church's own super admin). Churches contact the operator to get set up.

- Pros: Full control over who gets access, easy to vet churches before onboarding
- Cons: Does not scale without dedicated staff; operator becomes a bottleneck

**Option B — Self-service signup**
A public-facing registration page at the root domain (e.g. `churchsystem.com/signup`) allows a church representative to create their own tenant — choosing their subdomain slug, church name, and setting up the first super admin account.

- Pros: Scales without operator involvement; churches can onboard immediately
- Cons: Requires email verification, subdomain availability checks, and potentially a payment/subscription gate before granting access

**Option C — Hybrid (invite-based)**
The operator generates a one-time invite link for a church. The church representative follows the link to complete their own setup (name, slug, super admin credentials). No unsolicited signups.

- Pros: Controlled access without full manual provisioning; churches still self-configure
- Cons: Requires building an invite/token system

### What Needs to Be Built (whichever option)
- Tenant creation API route (POST `/api/tenants`) — creates tenant, default branch, and super admin user in one transaction
- Subdomain/slug uniqueness validation
- If self-service: public signup page, email verification, and duplicate prevention
- If invite-based: invite token generation, expiry, and redemption flow

---

## 2. Tenant Settings (Church Rename & Configuration)

### Current State
The tenant settings API (`/api/admin/settings/tenant`) only supports `GET` — it reads the church name, slug, custom domain, and logo URL but provides no way to update them. Renaming a church or changing its subdomain currently requires a direct database change.

### What Needs to Be Built
- `PATCH /api/admin/settings/tenant` — allow the super admin to update:
  - **Church name** — straightforward, no side effects
  - **Slug (subdomain)** — high impact: changes the URL for all users; requires updating middleware resolution, notifying users, and potentially updating any hardcoded references
  - **Custom domain** — requires DNS verification step before activating
- A settings UI section in the super admin panel for these fields, separate from theme/logo settings

### Considerations
- Slug changes should be treated as a destructive operation — old subdomain stops working immediately unless a redirect is set up
- Custom domain activation should only happen after a DNS check confirms the domain points to the system
- Church name changes are safe and can be applied immediately

---

## Priority Recommendation
Church rename (name only, not slug) is low-risk and high-value — implement it as a quick win when returning to this area. Full onboarding flow should wait until the operational model is decided.
