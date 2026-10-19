'use client';

import { createContext, useContext, useState, useEffect, ReactNode, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface FilterState {
  height: number;
  pregnancySafe: boolean;
  wheelchairAccessible: boolean;
  calmExperience: boolean;
  selectedParks: string[];
}

interface FiltersContextType {
  filters: FilterState;
  setHeight: (height: number) => void;
  setPregnancySafe: (value: boolean) => void;
  setWheelchairAccessible: (value: boolean) => void;
  setCalmExperience: (value: boolean) => void;
  setSelectedParks: (parks: string[]) => void;
  clearFilters: () => void;
}

const defaultFilters: FilterState = {
  height: 0,
  pregnancySafe: false,
  wheelchairAccessible: false,
  calmExperience: false,
  selectedParks: [],
};

/**
 * Normalize park query values so shareable URLs match ride.park + FilterSidebar.
 * Historical presets used "Universal Studios"; Sanity rides use "Universal Studios Florida".
 */
const PARK_QUERY_ALIASES: Record<string, string> = {
  "Universal Studios": "Universal Studios Florida",
  "Universal Studios Florida": "Universal Studios Florida",
  "USF": "Universal Studios Florida",
  "IOA": "Islands of Adventure",
  "MK": "Magic Kingdom",
  "HS": "Hollywood Studios",
  "AK": "Animal Kingdom",
  "SeaWorld": "SeaWorld Orlando",
  "LEGOLAND": "LEGOLAND Florida",
};

function normalizeParkQueryNames(parks: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of parks) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const canonical = PARK_QUERY_ALIASES[trimmed] || trimmed;
    if (seen.has(canonical)) continue;
    seen.add(canonical);
    out.push(canonical);
  }
  return out;
}

const FiltersContext = createContext<FiltersContextType>({
  filters: defaultFilters,
  setHeight: () => {},
  setPregnancySafe: () => {},
  setWheelchairAccessible: () => {},
  setCalmExperience: () => {},
  setSelectedParks: () => {},
  clearFilters: () => {},
});

/** Serialize filters to the shareable query string used across the site. */
export function filtersToQuery(filters: FilterState): string {
  const params = new URLSearchParams();
  if (filters.height > 0) params.set('height', filters.height.toString());
  if (filters.pregnancySafe) params.set('pregnancySafe', 'true');
  if (filters.wheelchairAccessible) params.set('wheelchair', 'true');
  if (filters.calmExperience) params.set('calm', 'true');
  if (filters.selectedParks.length > 0) params.set('parks', filters.selectedParks.join(','));
  return params.toString();
}

/**
 * Reads URL params and syncs filters <-> URL. Isolated in its own <Suspense>
 * (renders nothing) so useSearchParams() doesn't force the whole layout —
 * and every page body — into client-side rendering during static export.
 */
function FiltersUrlSync({
  filters,
  setFilters,
}: {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [initialized, setInitialized] = useState(false);

  // Initialize filters from URL params
  useEffect(() => {
    const height = parseInt(searchParams.get('height') || '0', 10);
    const pregnancySafe = searchParams.get('pregnancySafe') === 'true';
    const wheelchairAccessible = searchParams.get('wheelchair') === 'true';
    const calmExperience = searchParams.get('calm') === 'true';
    const parksParam = searchParams.get('parks');
    const selectedParks = parksParam
      ? normalizeParkQueryNames(parksParam.split(','))
      : [];

    setFilters({
      height: isNaN(height) ? 0 : height,
      pregnancySafe,
      wheelchairAccessible,
      calmExperience,
      selectedParks,
    });
    setInitialized(true);
  }, [searchParams, setFilters]);

  // Update URL when filters change
  useEffect(() => {
    if (!initialized) return;
    const queryString = filtersToQuery(filters);
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [filters, initialized, pathname, router]);

  return null;
}

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const setHeight = (height: number) => {
    setFilters(prev => ({ ...prev, height }));
  };

  const setPregnancySafe = (value: boolean) => {
    setFilters(prev => ({ ...prev, pregnancySafe: value }));
  };

  const setWheelchairAccessible = (value: boolean) => {
    setFilters(prev => ({ ...prev, wheelchairAccessible: value }));
  };

  const setCalmExperience = (value: boolean) => {
    setFilters(prev => ({ ...prev, calmExperience: value }));
  };

  const setSelectedParks = (parks: string[]) => {
    setFilters(prev => ({ ...prev, selectedParks: parks }));
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <FiltersContext.Provider value={{
      filters,
      setHeight,
      setPregnancySafe,
      setWheelchairAccessible,
      setCalmExperience,
      setSelectedParks,
      clearFilters,
    }}>
      <Suspense fallback={null}>
        <FiltersUrlSync filters={filters} setFilters={setFilters} />
      </Suspense>
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  return useContext(FiltersContext);
}
