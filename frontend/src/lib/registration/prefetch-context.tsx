"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

interface Service { id: string; name: string; }
interface EventOption { id: string; name: string; }
interface ReferralSource { id: string; name: string; }
interface MemberMatch {
  id: string;
  first_name: string;
  last_name: string;
  home_branch_name: string;
  last_visit: string | null;
}

interface PrefetchCache {
  services: Service[] | null;
  events: EventOption[] | null;
  referralSources: ReferralSource[] | null;
  // Tagged with the phone so stale results are never used
  memberLookup: { phone: string; members: MemberMatch[] } | null;
  loading: {
    services: boolean;
    events: boolean;
    referralSources: boolean;
    memberLookup: boolean;
  };
}

interface PrefetchContextValue {
  cache: PrefetchCache;
  prefetchMembers: (phone: string) => void;
}

const PrefetchContext = createContext<PrefetchContextValue | null>(null);

export function RegistrationPrefetchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cache, setCache] = useState<PrefetchCache>({
    services: null,
    events: null,
    referralSources: null,
    memberLookup: null,
    loading: {
      services: true,
      events: true,
      referralSources: true,
      memberLookup: false,
    },
  });

  // AbortController for the in-flight member lookup
  const lookupAbortRef = useRef<AbortController | null>(null);
  // Debounce timer
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch static data in parallel immediately on mount
  useEffect(() => {
    const ac = new AbortController();
    const { signal } = ac;

    Promise.all([
      fetch("/api/services", { signal })
        .then((r) => r.json())
        .then((d) => d.services ?? [])
        .catch(() => [] as Service[]),
      fetch("/api/events", { signal })
        .then((r) => r.json())
        .then((d) => d.events ?? [])
        .catch(() => [] as EventOption[]),
      fetch("/api/referral-sources", { signal })
        .then((r) => r.json())
        .then((d) => d.sources ?? [])
        .catch(() => [] as ReferralSource[]),
    ]).then(([services, events, referralSources]) => {
      setCache((prev) => ({
        ...prev,
        services,
        events,
        referralSources,
        loading: { ...prev.loading, services: false, events: false, referralSources: false },
      }));
    });

    return () => ac.abort();
  }, []);

  const prefetchMembers = useCallback((phone: string) => {
    // Clear any pending debounce
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Phone too short — clear stale lookup without fetching
    if (!phone || phone.replace(/\D/g, "").length < 7) {
      setCache((prev) => ({
        ...prev,
        memberLookup: null,
        loading: { ...prev.loading, memberLookup: false },
      }));
      return;
    }

    // Skip if we already have a fresh result for this exact phone
    setCache((prev) => {
      if (prev.memberLookup?.phone === phone) return prev;
      return { ...prev, loading: { ...prev.loading, memberLookup: true } };
    });

    debounceRef.current = setTimeout(() => {
      // Cancel any in-flight request for a previous phone value
      if (lookupAbortRef.current) lookupAbortRef.current.abort();
      lookupAbortRef.current = new AbortController();
      const { signal } = lookupAbortRef.current;

      fetch(`/api/members/lookup?phone=${encodeURIComponent(phone)}`, { signal })
        .then((r) => r.json())
        .then((d) => {
          setCache((prev) => ({
            ...prev,
            memberLookup: { phone, members: d.members ?? [] },
            loading: { ...prev.loading, memberLookup: false },
          }));
        })
        .catch((err) => {
          // AbortError = intentional cancellation, not a real error
          if (err.name !== "AbortError") {
            setCache((prev) => ({
              ...prev,
              loading: { ...prev.loading, memberLookup: false },
            }));
          }
        });
    }, 400);
  }, []);

  return (
    <PrefetchContext.Provider value={{ cache, prefetchMembers }}>
      {children}
    </PrefetchContext.Provider>
  );
}

export function usePrefetchCache() {
  const ctx = useContext(PrefetchContext);
  if (!ctx) throw new Error("usePrefetchCache must be used inside RegistrationPrefetchProvider");
  return ctx;
}
