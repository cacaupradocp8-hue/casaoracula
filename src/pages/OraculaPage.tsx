import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  GraduationCap, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  BookOpen,
  Users,
  Star
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import FormacaoVivaPage from './FormacaoVivaPage';

interface MentoriaPortal {
  id: string;
  titulo: string;
  descricao: string;
  ordem: number;
  portal_minimo: string;
  publicado: boolean;
  desbloqueado: boolean;
  progresso: number;
}

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
  const [hasAccess, setHasAccess] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAccessAndRedirect();
  }, [user]);

  const checkAccessAndRedirect = async () => {
    if (!user) {
      // No user = visitor, show sales page
      setHasAccess(false);
      setIsLoading(false);
      return;
    }

    try {
      // Check if user is admin (full access)
      if (user.portal === 'admin') {
        // Admin can choose - redirect to portal
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
      setHasAccess(false);
    } catch (error) {
      console.error('Error checking access:', error);
      toast({
        title: 'Erro ao verificar acesso',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  // Show loading state while checking
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[hsl(220,20%,6%)] flex items-center justify-center">
        <div className="animate-pulse text-gold font-display text-xl">Carregando...</div>
      </div>
    );
  }

  // Sales page for visitors and non-enrolled users
  return <FormacaoVivaPage />;
}
