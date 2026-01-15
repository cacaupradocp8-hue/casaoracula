import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AccessExpirationInfo {
  daysUntilExpiration: number | null;
  isExpired: boolean;
  isExpiringSoon: boolean; // within 7 days
  accessExpiresAt: Date | null;
  subscriptionStatus: string;
  hasActiveSubscription: boolean;
}

export function useAccessExpiration(): AccessExpirationInfo {
  const { user } = useAuth();
  const [info, setInfo] = useState<AccessExpirationInfo>({
    daysUntilExpiration: null,
    isExpired: false,
    isExpiringSoon: false,
    accessExpiresAt: null,
    subscriptionStatus: 'none',
    hasActiveSubscription: false,
  });

  useEffect(() => {
    if (!user) return;

    const fetchExpirationInfo = async () => {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('access_expires_at, subscription_status, portal')
        .eq('id', user.id)
        .single();

      if (error || !profile) {
        console.error('Error fetching profile:', error);
        return;
      }

      const subscriptionStatus = profile.subscription_status || 'none';
      const hasActiveSubscription = subscriptionStatus === 'active';
      
      if (hasActiveSubscription || !profile.access_expires_at) {
        setInfo({
          daysUntilExpiration: null,
          isExpired: false,
          isExpiringSoon: false,
          accessExpiresAt: null,
          subscriptionStatus,
          hasActiveSubscription,
        });
        return;
      }

      const expiresAt = new Date(profile.access_expires_at);
      const now = new Date();
      const diffTime = expiresAt.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setInfo({
        daysUntilExpiration: diffDays,
        isExpired: diffDays <= 0,
        isExpiringSoon: diffDays > 0 && diffDays <= 7,
        accessExpiresAt: expiresAt,
        subscriptionStatus,
        hasActiveSubscription,
      });
    };

    fetchExpirationInfo();
  }, [user]);

  return info;
}
