import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCasaMaquinasAccess } from '@/hooks/useCasaMaquinasAccess';
import { BootLoadingScreen } from '@/components/shared/BootLoadingScreen';
import { useAuth } from '@/contexts/AuthContext';

interface CasaMaquinasGuardProps {
  children: React.ReactNode;
}

export function CasaMaquinasGuard({ children }: CasaMaquinasGuardProps) {
  const { hasAccess, reason } = useCasaMaquinasAccess();
  const { isLoading, isAuthReady } = useAuth();

  if (!isAuthReady || isLoading) {
    return <BootLoadingScreen />;
  }

  if (!hasAccess) {
    console.info('[CasaMaquinasGuard] Access denied', { reason });
    return <Navigate to="/planos" replace />;
  }

  return <>{children}</>;
}
