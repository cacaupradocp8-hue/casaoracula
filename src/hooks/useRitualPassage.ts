import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ReflexaoField {
  label: string;
  required?: boolean;
  minLength?: number;
}

interface RitualDefinition {
  id: string;
  nome: string;
  tipo: 'abertura' | 'transicao' | 'consagracao';
  texto_ritual: string;
  pergunta_compromisso?: string;
  campos_reflexao: ReflexaoField[];
  microcopy?: string;
  autoriza_acesso: boolean;
}

interface RitualPassage {
  id: string;
  ritual_id: string;
  status: 'pending' | 'completed' | 'skipped_by_admin';
  context_type?: string;
  context_id?: string;
  respostas: Record<string, string>;
  completed_at?: string;
}

interface UseRitualPassageOptions {
  triggerEvent: string;
  contextType?: string;
  contextId?: string;
}

export function useRitualPassage(options: UseRitualPassageOptions) {
  const { user } = useAuth();
  const [ritual, setRitual] = useState<RitualDefinition | null>(null);
  const [passage, setPassage] = useState<RitualPassage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRitual, setShowRitual] = useState(false);

  const { triggerEvent, contextType, contextId } = options;

  // Check for pending ritual on mount
  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    checkForRitual();
  }, [user?.id, triggerEvent, contextType, contextId]);

  const checkForRitual = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);

      // Find matching ritual definition
      const { data: ritualDef, error: ritualError } = await supabase
        .from('ritual_definitions')
        .select('*')
        .eq('trigger_event', triggerEvent)
        .eq('ativo', true)
        .or(
          contextType && contextId
            ? `trigger_context_type.eq.${contextType},trigger_context_id.eq.${contextId},trigger_context_id.is.null`
            : 'trigger_context_id.is.null'
        )
        .order('ordem', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (ritualError) {
        console.error('Error fetching ritual definition:', ritualError);
        return;
      }

      if (!ritualDef) {
        // No ritual defined for this trigger
        return;
      }

      // Check if user already has a passage for this ritual
      const { data: existingPassage, error: passageError } = await supabase
        .from('ritual_passages')
        .select('*')
        .eq('user_id', user.id)
        .eq('ritual_id', ritualDef.id)
        .eq('context_id', contextId || ritualDef.id) // Use ritual_id as fallback context
        .maybeSingle();

      if (passageError && passageError.code !== 'PGRST116') {
        console.error('Error fetching ritual passage:', passageError);
        return;
      }

      // Parse campos_reflexao safely
      let camposReflexao: ReflexaoField[] = [];
      if (ritualDef.campos_reflexao && Array.isArray(ritualDef.campos_reflexao)) {
        camposReflexao = (ritualDef.campos_reflexao as unknown[]).map((item) => {
          const obj = item as Record<string, unknown>;
          return {
            label: String(obj.label || ''),
            required: Boolean(obj.required),
            minLength: typeof obj.minLength === 'number' ? obj.minLength : undefined,
          };
        });
      }

      setRitual({
        id: ritualDef.id,
        nome: ritualDef.nome,
        tipo: ritualDef.tipo,
        texto_ritual: ritualDef.texto_ritual,
        pergunta_compromisso: ritualDef.pergunta_compromisso ?? undefined,
        campos_reflexao: camposReflexao,
        microcopy: ritualDef.microcopy ?? undefined,
        autoriza_acesso: ritualDef.autoriza_acesso,
      });

      if (existingPassage) {
        setPassage({
          id: existingPassage.id,
          ritual_id: existingPassage.ritual_id,
          status: existingPassage.status,
          context_type: existingPassage.context_type ?? undefined,
          context_id: existingPassage.context_id ?? undefined,
          respostas: (existingPassage.respostas as Record<string, string>) || {},
          completed_at: existingPassage.completed_at ?? undefined,
        });

        // Show ritual if pending
        if (existingPassage.status === 'pending') {
          setShowRitual(true);
        }
      } else {
        // Create new pending passage
        const { data: newPassage, error: createError } = await supabase
          .from('ritual_passages')
          .insert({
            user_id: user.id,
            ritual_id: ritualDef.id,
            context_type: contextType,
            context_id: contextId || ritualDef.id,
            status: 'pending',
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating ritual passage:', createError);
          return;
        }

        setPassage({
          id: newPassage.id,
          ritual_id: newPassage.ritual_id,
          status: 'pending',
          context_type: newPassage.context_type ?? undefined,
          context_id: newPassage.context_id ?? undefined,
          respostas: {},
        });

        setShowRitual(true);
      }
    } catch (error) {
      console.error('Error in checkForRitual:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, triggerEvent, contextType, contextId]);

  const completeRitual = useCallback(
    async (respostas: Record<string, string>) => {
      if (!user?.id || !passage || !ritual) return;

      try {
        setIsSubmitting(true);

        const { error } = await supabase
          .from('ritual_passages')
          .update({
            status: 'completed',
            respostas,
            completed_at: new Date().toISOString(),
          })
          .eq('id', passage.id);

        if (error) {
          console.error('Error completing ritual:', error);
          return;
        }

        setPassage((prev) =>
          prev
            ? {
                ...prev,
                status: 'completed',
                respostas,
                completed_at: new Date().toISOString(),
              }
            : null
        );

        setShowRitual(false);
      } catch (error) {
        console.error('Error in completeRitual:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [user?.id, passage, ritual]
  );

  const isRitualCompleted = passage?.status === 'completed' || passage?.status === 'skipped_by_admin';
  const isRitualPending = passage?.status === 'pending';
  const authorizesAccess = ritual?.autoriza_acesso ?? false;

  return {
    ritual,
    passage,
    isLoading,
    isSubmitting,
    showRitual,
    isRitualCompleted,
    isRitualPending,
    authorizesAccess,
    completeRitual,
    checkForRitual,
  };
}
