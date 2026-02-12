import { useState, useEffect } from 'react';

export type RitualState = 'arrival' | 'neutral' | 'dense';

const SESSION_START_KEY = 'ritual_session_start';
const LAST_ACCESS_KEY = 'ritual_last_access';
const DEEP_ACCESS_KEY = 'ritual_deep_access';

/** Routes considered "deep tools" — symbolic/therapeutic depth */
const DEEP_ROUTE_PATTERNS = [
  '/big5', '/eneagrama', '/labirinto', '/oraculo',
  '/atlas', '/narroterapia', '/sessao', '/caso',
];

/**
 * Tracks session context and determines which visual state
 * the Ritual de Saída should display.
 *
 * - arrival: first login or >24h since last access
 * - dense: session >12min or accessed deep tools
 * - neutral: default
 */
export function useRitualState(): RitualState {
  const [state, setState] = useState<RitualState>('neutral');

  useEffect(() => {
    const now = Date.now();

    // --- Check arrival condition ---
    const lastAccess = localStorage.getItem(LAST_ACCESS_KEY);
    const isFirstLogin = !lastAccess;
    const hoursSinceLastAccess = lastAccess
      ? (now - parseInt(lastAccess, 10)) / (1000 * 60 * 60)
      : Infinity;
    const isArrival = isFirstLogin || hoursSinceLastAccess > 24;

    // --- Check dense condition ---
    const sessionStart = sessionStorage.getItem(SESSION_START_KEY);
    const sessionMinutes = sessionStart
      ? (now - parseInt(sessionStart, 10)) / (1000 * 60)
      : 0;
    const accessedDeep = sessionStorage.getItem(DEEP_ACCESS_KEY) === 'true';
    const isDense = sessionMinutes > 12 || accessedDeep;

    // Priority: arrival > dense > neutral
    if (isArrival) {
      setState('arrival');
    } else if (isDense) {
      setState('dense');
    } else {
      setState('neutral');
    }
  }, []);

  return state;
}

/** Call once on app mount to start session tracking */
export function initRitualSessionTracking() {
  if (!sessionStorage.getItem(SESSION_START_KEY)) {
    sessionStorage.setItem(SESSION_START_KEY, Date.now().toString());
  }
}

/** Call on route change to detect deep tool access */
export function trackRouteForRitual(pathname: string) {
  const isDeep = DEEP_ROUTE_PATTERNS.some((p) => pathname.includes(p));
  if (isDeep) {
    sessionStorage.setItem(DEEP_ACCESS_KEY, 'true');
  }
}

/** Call on logout to stamp last access time */
export function stampRitualLastAccess() {
  localStorage.setItem(LAST_ACCESS_KEY, Date.now().toString());
}
