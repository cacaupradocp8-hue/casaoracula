import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { RitualSimbolico } from './useBig5PortaMapping';

export interface RitualRegistro {
  id: string;
  user_id: string;
  big5_registro_id: string | null;
  ritual_id: string | null;
  porta_acessada: string | null;
  completado_em: string | null;
  acessou_narroterapia: boolean;
  created_at: string;
}

export function useRitualSymbolic() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [registro, setRegistro] = useState<RitualRegistro | null>(null);

  const saveRitualCompletion = async (
    big5RegistroId: string | null,
    ritualId: string | null,
    portaAcessada: string | null
  ): Promise<RitualRegistro | null> => {
    if (!user?.id) {
      toast.error('Você precisa estar logada para registrar');
      return null;
    }

    setSaving(true);

    try {
      const novoRegistro = {
        user_id: user.id,
        big5_registro_id: big5RegistroId,
        ritual_id: ritualId,
        porta_acessada: portaAcessada,
        completado_em: new Date().toISOString(),
        acessou_narroterapia: false,
      };

      const { data, error } = await supabase
        .from('big5_ritual_registros')
        .insert(novoRegistro)
        .select()
        .single();

      if (error) throw error;

      setRegistro(data as RitualRegistro);
      return data as RitualRegistro;
    } catch (err) {
      console.error('Erro ao salvar ritual:', err);
      toast.error('Erro ao salvar registro do ritual');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const markNarroterapiaAccess = async (registroId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('big5_ritual_registros')
        .update({ acessou_narroterapia: true })
        .eq('id', registroId);

      if (error) throw error;
      
      setRegistro(prev => prev ? { ...prev, acessou_narroterapia: true } : null);
      return true;
    } catch (err) {
      console.error('Erro ao marcar acesso narroterapia:', err);
      return false;
    }
  };

  // Check if user is certified (oracula or admin portal)
  const isCertified = user?.portal === 'oracula' || user?.portal === 'admin';

  return {
    saving,
    registro,
    saveRitualCompletion,
    markNarroterapiaAccess,
    isCertified,
  };
}
