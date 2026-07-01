# Kiosk / PIN Lock Mode

## Overview

The registration flow (`/register`) is intentionally minimal — no links to the admin panel are shown to the person being registered. However, a determined user who knows the URL can still navigate to `/admin` if a staff member is logged in on that device.

For higher-security environments (e.g. a tablet left unattended at the entrance), a kiosk mode can be implemented to lock the device into registration-only access until a staff member unlocks it with a PIN.

---

## Recommended Implementation

### 1. Database — add a kiosk PIN to the session

Add a `kioskLocked` boolean and optional `kioskPin` to the session data in `frontend/src/lib/auth/types.ts`:

```ts
export interface SessionData {
  user?: SessionUser;
  kioskLocked?: boolean;
}
```

Store the PIN separately — never in the session. A bcrypt hash of the PIN should be stored per-user in the `users` table:

```sql
ALTER TABLE users ADD COLUMN kiosk_pin_hash TEXT;
```

---

### 2. API Routes

**Set kiosk mode** — `POST /api/auth/kiosk/lock`

The staff member enables kiosk mode before handing the device over. Sets `kioskLocked = true` in the session.

```ts
session.kioskLocked = true;
await session.save();
```

**Unlock kiosk mode** — `POST /api/auth/kiosk/unlock`

Accepts `{ pin }` in the request body, verifies it against the stored `kiosk_pin_hash` for the session user, then sets `kioskLocked = false`.

```ts
const valid = await bcrypt.compare(pin, user.kiosk_pin_hash);
if (!valid) return 401;
session.kioskLocked = false;
await session.save();
```

**Set PIN** — `POST /api/admin/users/kiosk-pin`

Allows a staff member to set their kiosk PIN from the admin settings page. Hashes the PIN with bcrypt before storing.

---

### 3. Middleware — enforce kiosk lock

In `frontend/middleware.ts`, check the `kioskLocked` session flag on admin routes:

```ts
// If session is kiosk-locked, block access to /admin and /super-admin
if (kioskLocked && (pathname.startsWith('/admin') || pathname.startsWith('/super-admin'))) {
  return NextResponse.redirect(new URL('/register', request.url));
}
```

Note: middleware cannot read iron-session directly (it runs on the Edge runtime). Instead, set a separate lightweight cookie `kiosk-locked=1` alongside the iron-session when locking, and clear it on unlock. Middleware reads this plain cookie; iron-session remains the authoritative source.

---

### 4. UI

**Lock button** — shown in the registration layout header for admin/super_admin roles:

```tsx
<button onClick={handleLock}>
  Lock to Registration
</button>
```

Clicking it calls `POST /api/auth/kiosk/lock`, then the page reloads in locked state.

**Unlock overlay** — when `kioskLocked` is true and a user tries to reach `/admin`, show a PIN entry overlay instead of redirecting away:

```tsx
// A full-screen overlay with a numeric PIN pad
// On correct PIN: calls /api/auth/kiosk/unlock, then navigates to /admin
// On incorrect PIN: shows error, increments attempt counter
```

**PIN setup** — a field in Admin → Settings → Your Account where staff set their 4–6 digit kiosk PIN.

---

### 5. Security Notes

- Rate-limit the unlock endpoint — maximum 5 attempts before a 30-second cooldown.
- The PIN should be 4–6 digits minimum. Do not accept empty PINs.
- Never log or expose the PIN in API responses.
- The kiosk lock does not log the member out — it only restricts navigation. The staff member's session remains active so registrations continue to be attributed to them.
- On sign out, always clear the kiosk lock state.
- Consider auto-locking after a period of inactivity using a client-side idle timer that calls the lock endpoint automatically.

---

### 6. Files to Create or Modify

| File | Change |
|---|---|
| `database/migrations/011_kiosk_pin.sql` | Add `kiosk_pin_hash` column to `users` |
| `frontend/src/lib/auth/types.ts` | Add `kioskLocked` to `SessionData` |
| `frontend/middleware.ts` | Read `kiosk-locked` cookie, redirect admin routes |
| `frontend/src/app/api/auth/kiosk/lock/route.ts` | New — sets lock |
| `frontend/src/app/api/auth/kiosk/unlock/route.ts` | New — verifies PIN, clears lock |
| `frontend/src/app/api/admin/users/kiosk-pin/route.ts` | New — sets PIN hash |
| `frontend/src/app/(registration)/layout.tsx` | Add lock button for admin/super_admin |
| `frontend/src/components/ui/kiosk-unlock-overlay.tsx` | New — PIN pad overlay |
| `frontend/src/app/admin/settings/page.tsx` | Add PIN setup field |
