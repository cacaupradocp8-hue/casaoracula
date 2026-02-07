import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/hooks/useOnboarding';
import { supabase } from '@/integrations/supabase/client';
import { WelcomeCopyByProfile } from '@/components/welcome/WelcomeCopyByProfile';

export default function Welcome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { onboardingCompleted, isLoading: onboardingLoading } = useOnboarding();
  const [profileTag, setProfileTag] = useState<string | null>(null);
  const [isLoadingTag, setIsLoadingTag] = useState(true);

  const isAdmin = user?.portal === 'admin';

  // Fetch user's entry archetype (profile tag)
  useEffect(() => {
    const fetchProfileTag = async () => {
      if (!user?.id) {
        setIsLoadingTag(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('profiles')
          .select('entry_archetype')
          .eq('id', user.id)
          .single();

        setProfileTag(data?.entry_archetype || null);
      } catch (error) {
        console.error('Error fetching profile tag:', error);
      } finally {
        setIsLoadingTag(false);
      }
    };

    fetchProfileTag();
  }, [user?.id]);

  // Redirect logic
  useEffect(() => {
    if (!onboardingLoading && user) {
      // Non-completed onboarding users go to onboarding first
      if (!onboardingCompleted && !isAdmin) {
        navigate('/onboarding', { replace: true });
        return;
      }
    }
  }, [onboardingLoading, onboardingCompleted, user, isAdmin, navigate]);

  const handleContinue = () => {
    navigate('/jornada', { replace: true });
  };

  // Show loading while checking auth and profile
  if (!user || onboardingLoading || isLoadingTag) {
    return null;
  }

  // If onboarding not complete and not admin, don't render (redirect will happen)
  if (!onboardingCompleted && !isAdmin) {
    return null;
  }

  return (
    <WelcomeCopyByProfile
      profileTag={profileTag}
      userName={user.name}
      onContinue={handleContinue}
    />
  );
}
