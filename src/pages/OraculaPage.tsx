import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import FormacaoVivaPage from './FormacaoVivaPage';

/**
 * OraculaPage - Public sales page with conditional portal access
 * 
 * Route: /oracula
 * 
 * Access Logic:
 * - Visitors (not logged in or no matrícula) → See FormacaoVivaPage (sales page)
 * - Enrolled students (with active matrícula) → Redirected to /portal-oracula (internal portal)
 */
export default function OraculaPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAccessAndRedirect();
  }, [user]);

  const checkAccessAndRedirect = async () => {
    // Not logged in = visitor, show sales page
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // Admin has full access, redirect to internal portal
      if (user.portal === 'admin') {
        navigate('/portal-oracula', { replace: true });
        return;
      }

      // Check if user has mentoria/formação matrícula
      const { data: matriculas } = await supabase
        .from('matriculas')
        .select('*')
        .eq('user_id', user.id)
        .eq('ativa', true)
        .in('curso_id', ['mentoria_oracula', 'mentoria', 'formacao_oracula']);

      const hasMatricula = (matriculas?.length ?? 0) > 0;
      
      if (hasMatricula) {
        // User has access - redirect to internal portal
        navigate('/portal-oracula', { replace: true });
        return;
      }

      // No matrícula = show sales page
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking access:', error);
      toast({
        title: 'Erro ao verificar acesso',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  // Show loading state while checking
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-gold font-display text-xl">Carregando...</div>
      </div>
    );
  }

  // Sales page for visitors and non-enrolled users
  return <FormacaoVivaPage />;
}
