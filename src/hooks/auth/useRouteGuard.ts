import { useAuth } from '@/contexts/AuthContext';
import { useAdminPreviewOptional } from '@/contexts/AdminPreviewContext';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useLocation } from 'react-router-dom';
import { PortalType, canAccessFeature } from '@/types/portal';

const LOG_PREFIX = '[boot-debug][routes]';

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

  const isOnboardingRoute = location.pathname === '/onboarding';
  const isPosCompraRoute = location.pathname === '/pos-compra';

  const isVisitorJourneyRoute =
    location.pathname === '/sala-da-visitante' ||
    location.pathname.startsWith('/quiz/') ||
    location.pathname === '/ferramenta/cartografia-psiquica-oracula' ||
    location.pathname === '/ferramentas/cartografia-psiquica-oracula' ||
    location.pathname === '/revelacao-cidadela' ||
    location.pathname === '/cidadela/revelacao' ||
    location.pathname === '/comece-aqui' ||
    location.pathname === '/experiencia-gratuita' ||
    location.pathname.startsWith('/travessia/');

  const isAdmin = user?.portal === 'admin';
  const isVisitor = user?.portal === 'visitante';
  const shouldSkipOnboarding = isAdmin || isVisitorJourneyRoute;

  const { onboardingCompleted, isLoading: onboardingLoading, error: onboardingError } = useOnboarding({
    enabled: !shouldSkipOnboarding,
  });

  // Auth not ready
  if (!isAuthReady || isLoading) {
    logRouteStep('boot auth pendente', { path: location.pathname, isAuthReady, isLoading });
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

  // Onboarding loading
  if (!shouldSkipOnboarding && onboardingLoading) {
    logRouteStep('onboarding pendente', { path: location.pathname, userId: user?.id ?? null });
    return { status: 'loading' };
  }

  // Onboarding error: fail-open
  if (onboardingError && location.pathname !== '/onboarding') {
    logRouteStep('falha no onboarding, fail-open para dashboard', { path: location.pathname, onboardingError }, 'warn');
  }

  // Redirect to onboarding if not completed
  if (!onboardingCompleted && !onboardingError && !isOnboardingRoute && !isAdmin && !isVisitorJourneyRoute) {
    logRouteStep('definição da rota pós-login: /onboarding', {
      from: location.pathname, userId: user?.id ?? null, onboardingCompleted,
    }, 'warn');
    return { status: 'redirect', to: '/onboarding' };
  }

  // Portal access check
  const isAdminRoute = minPortal === 'admin';
  const effectivePortal = preview?.isPreviewMode && preview?.previewPortal && user?.portal === 'admin' && !isAdminRoute
    ? preview.previewPortal
    : user?.portal || 'visitante';

  const hasAccess = canAccessFeature(effectivePortal, minPortal);

  if (!hasAccess && !isPosCompraRoute) {
    logRouteStep('bloqueada por permissão — exibindo gating', {
      path: location.pathname, effectivePortal, minPortal,
    }, 'warn');
    return { status: 'locked-visitor' };
  }

  return { status: 'allowed' };
}
