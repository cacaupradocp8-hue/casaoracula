import { useState, useEffect } from 'react';
import { parseISO, isValid } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AccessExpirationInfo {
  daysUntilExpiration: number | null;
  isExpired: boolean;
  isExpiringSoon: boolean; // within 7 days
  accessExpiresAt: Date | null;
  subscriptionStatus: string;
  hasActiveSubscription: boolean;
  error: string | null;
}

const INITIAL_INFO: AccessExpirationInfo = {
  daysUntilExpiration: null,
  isExpired: false,
  isExpiringSoon: false,
  accessExpiresAt: null,
  subscriptionStatus: 'none',
  hasActiveSubscription: false,
  error: null,
};

export function useAccessExpiration(): AccessExpirationInfo {
  const { user } = useAuth();
  const [info, setInfo] = useState<AccessExpirationInfo>(INITIAL_INFO);
  const LOG_PREFIX = '[boot-debug][access-banner]';

  useEffect(() => {
    if (!user) {
      console.info(`${LOG_PREFIX} sem usuário autenticado, resetando estado`);
      setInfo(INITIAL_INFO);
      return;
    }

    const fetchExpirationInfo = async () => {
      try {
        console.info(`${LOG_PREFIX} carregamento de banner de expiração iniciado`, { userId: user.id });
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('access_expires_at, subscription_status, portal')
          .eq('id', user.id)
          .single();

        if (error || !profile) {
          throw error;
        }

        const subscriptionStatus = profile.subscription_status || 'none';
        const hasActiveSubscription = subscriptionStatus === 'active';

        if (hasActiveSubscription || !profile.access_expires_at) {
          console.info(`${LOG_PREFIX} sem expiração aplicável`, {
            userId: user.id,
            hasActiveSubscription,
            subscriptionStatus,
          });

          setInfo({
            daysUntilExpiration: null,
            isExpired: false,
            isExpiringSoon: false,
            accessExpiresAt: null,
            subscriptionStatus,
            hasActiveSubscription,
            error: null,
          });
          return;
        }

        console.info(`${LOG_PREFIX} parsing de datas iniciado`, {
          accessExpiresAtRaw: profile.access_expires_at,
        });

        const parsedDate = parseISO(profile.access_expires_at);
        if (!isValid(parsedDate)) {
          console.warn(`${LOG_PREFIX} parsing de datas inválido`, {
            accessExpiresAtRaw: profile.access_expires_at,
          });

          setInfo({
            ...INITIAL_INFO,
            subscriptionStatus,
            hasActiveSubscription,
            error: 'Não foi possível interpretar a data de expiração do acesso.',
          });
          return;
        }

        const now = new Date();
        const diffTime = parsedDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        setInfo({
          daysUntilExpiration: diffDays,
          isExpired: diffDays <= 0,
          isExpiringSoon: diffDays > 0 && diffDays <= 7,
          accessExpiresAt: parsedDate,
          subscriptionStatus,
          hasActiveSubscription,
          error: null,
        });
      } catch (fetchError) {
        console.error(`${LOG_PREFIX} falha ao carregar status de expiração`, fetchError);
        setInfo({
          ...INITIAL_INFO,
          error: 'Não foi possível carregar o status do seu acesso.',
        });
      }
    };

    void fetchExpirationInfo();
  }, [user]);

  return info;
}
