import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import OraculaSalesPage from './OraculaSalesPage';

/**
 * OraculaPage — Gate de Acesso à Formação Orácula
 * 
 * Rota: /oracula
 * 
 * Lógica de Acesso:
 * - Visitantes (não logados ou sem matrícula) → Exibe OraculaSalesPage (página de vendas)
 * - Alunas matriculadas (com matrícula ativa) → Redireciona para /portal-oracula
 * - Admins → Redireciona para /portal-oracula
 * 
 * NOVO COMPONENTE - Sem herança de componentes anteriores.
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
    // Não logado = visitante, exibe página de vendas
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // Admin tem acesso total, redireciona para portal interno
      if (user.portal === 'admin') {
        navigate('/portal-oracula', { replace: true });
        return;
      }

      // Verifica se usuário tem matrícula na formação
      const { data: matriculas } = await supabase
        .from('matriculas')
        .select('*')
        .eq('user_id', user.id)
        .eq('ativa', true)
        .in('curso_id', ['mentoria_oracula', 'mentoria', 'formacao_oracula']);

      const hasMatricula = (matriculas?.length ?? 0) > 0;
      
      if (hasMatricula) {
        // Usuário tem acesso - redireciona para portal interno
        navigate('/portal-oracula', { replace: true });
        return;
      }

      // Sem matrícula = exibe página de vendas
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao verificar acesso:', error);
      toast({
        title: 'Erro ao verificar acesso',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  // Exibe loading enquanto verifica
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-gold font-display text-xl">Carregando...</div>
      </div>
    );
  }

  // Página de vendas para visitantes e usuários não matriculados
  return <OraculaSalesPage />;
}
