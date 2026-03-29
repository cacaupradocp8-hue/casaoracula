import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type JourneyStep = 'quiz' | 'travessia' | 'cartografia' | 'cidadela' | 'complete';

interface JourneyState {
  currentStep: JourneyStep;
  redirectTo: string | null;
  loading: boolean;
}

/**
 * Checks user journey progress and returns the next required step.
 * Flow: Quiz → Cartografia → CidaDELA (revelação) → Dashboard
 */
export function useJourneyGuard(): JourneyState {
  const { user } = useAuth();
  const [state, setState] = useState<JourneyState>({
    currentStep: 'complete',
    redirectTo: null,
    loading: true,
  });

  useEffect(() => {
    if (!user?.id) {
      setState({ currentStep: 'complete', redirectTo: null, loading: false });
      return;
    }

    // Admin bypasses journey
    if (user.portal === 'admin') {
      setState({ currentStep: 'complete', redirectTo: null, loading: false });
      return;
    }

    const check = async () => {
      try {
        const [quizRes, travessiaUnlocksRes, cartoRes, cidadelaRes] = await Promise.all([
          supabase
            .from('quiz_respostas_usuario')
            .select('id')
            .eq('user_id', user.id)
            .limit(1),
          supabase
            .from('travessia_day_unlocks')
            .select('aula_id')
            .eq('user_id', user.id),
          supabase
            .from('cartografia_psiquica')
            .select('id')
            .eq('user_id', user.id)
            .limit(1),
          supabase
            .from('auto_mapeamento')
            .select('id, distritos_json')
            .eq('user_id', user.id)
            .maybeSingle(),
        ]);

        const hasQuiz = (quizRes.data?.length ?? 0) > 0;
        const hasTravessia = (travessiaUnlocksRes.data?.length ?? 0) >= 3;
        const hasCartografia = (cartoRes.data?.length ?? 0) > 0;
        const hasCidadela = Boolean(
          cidadelaRes.data?.id
          && cidadelaRes.data.distritos_json
          && Object.keys((cidadelaRes.data.distritos_json as Record<string, unknown>) || {}).length > 0,
        );

        if (!hasQuiz) {
          setState({ currentStep: 'quiz', redirectTo: '/quiz/descubra-seu-eixo', loading: false });
        } else if (!hasTravessia) {
          setState({ currentStep: 'travessia', redirectTo: '/travessia/travessia-zero-o-limiar-da-casa', loading: false });
        } else if (!hasCartografia) {
          setState({ currentStep: 'cartografia', redirectTo: '/ferramentas/cartografia-psiquica-oracula', loading: false });
        } else if (!hasCidadela) {
          setState({ currentStep: 'cidadela', redirectTo: '/cidadela/revelacao', loading: false });
        } else {
          setState({ currentStep: 'complete', redirectTo: null, loading: false });
        }
      } catch (err) {
        console.error('[journey-guard] Error checking journey state:', err);
        // Fail-open: let user through
        setState({ currentStep: 'complete', redirectTo: null, loading: false });
      }
    };

    check();
  }, [user?.id, user?.portal]);

  return state;
}
