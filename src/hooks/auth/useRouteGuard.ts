import { useAuth } from '@/contexts/AuthContext';
import { useAdminPreviewOptional } from '@/contexts/AdminPreviewContext';

import { useLocation } from 'react-router-dom';
import { PortalType, canAccessFeature } from '@/types/portal';

const LOG_PREFIX = '[DEBUG_UI][routes]';

function logRouteStep(stage: string, payload?: Record<string, unknown>, level: 'info' | 'warn' | 'error' = 'info') {
  const logger = level === 'error' ? console.error : level === 'warn' ? console.warn : console.info;
  logger(`${LOG_PREFIX} ${stage}`, payload ?? {});
}

export type RouteGuardResult =
  | { status: 'loading' }
  | { status: 'error'; errorMessage: string }
  | { status: 'redirect'; to: string }
  | { status: 'locked-visitor' }
  | { status: 'allowed' };

export function useRouteGuard(minPortal: PortalType = 'visitante'): RouteGuardResult {
  const { isLoading, isAuthenticated, user, isAuthReady, authError } = useAuth();
  const preview = useAdminPreviewOptional();
  const location = useLocation();

  
  const isPosCompraRoute = location.pathname === '/pos-compra';

  const isVisitorJourneyRoute =
    location.pathname === '/sala-da-visitante' ||
    location.pathname.startsWith('/quiz/') ||
    location.pathname === '/revelacao-cidadela' ||
    location.pathname === '/cidadela/revelacao' ||
    location.pathname === '/comece-aqui' ||
    location.pathname === '/experiencia-gratuita';


  const shouldSkipOnboarding = true;

  // Auth not ready
  if (!isAuthReady || isLoading) {
    console.info(`${LOG_PREFIX} boot auth pendente`, { path: location.pathname, isAuthReady, isLoading });
    return { status: 'loading' };
  }

  // Auth error
  if (authError) {
    logRouteStep('falha no boot de autenticação', { path: location.pathname, authError }, 'error');
    return { status: 'error', errorMessage: authError };
  }

  // Not authenticated
  if (!isAuthenticated) {
    logRouteStep('usuária não autenticada, redirecionando para /auth', { path: location.pathname }, 'warn');
    return { status: 'redirect', to: '/auth' };
  }


  // Portal access check
  const isAdminRoute = minPortal === 'admin';
  const effectivePortal = preview?.isPreviewMode && preview?.previewPortal && user?.portal === 'admin' && !isAdminRoute
    ? preview.previewPortal
    : user?.portal || 'visitante';

  const hasAccess = canAccessFeature(effectivePortal, minPortal);

  if (!hasAccess && !isPosCompraRoute) {
    console.warn(`${LOG_PREFIX} bloqueada por permissão — exibindo gating`, {
      path: location.pathname, effectivePortal, minPortal, userPortal: user?.portal
    });
    return { status: 'locked-visitor' };
  }

  return { status: 'allowed' };
}
