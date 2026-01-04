import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface ProfessionalConfirmation {
  id: string;
  user_id: string;
  tipo_atuacao: string;
  area_formacao: string | null;
  anos_experiencia: number | null;
  aceita_codigo_etico: boolean;
  confirmado_em: string;
}

export function useProfessionalStatus() {
  const { user } = useAuth();
  const [isProfessional, setIsProfessional] = useState<boolean | null>(null);
  const [confirmation, setConfirmation] = useState<ProfessionalConfirmation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsProfessional(null);
      setConfirmation(null);
      setIsLoading(false);
      return;
    }

    const fetchProfessionalStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('confirmacao_profissional')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (data && data.aceita_codigo_etico) {
          setIsProfessional(true);
          setConfirmation(data);
        } else {
          setIsProfessional(false);
          setConfirmation(null);
        }
      } catch (error) {
        console.error('Error fetching professional status:', error);
        setIsProfessional(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessionalStatus();
  }, [user]);

  const confirmProfessional = async (data: {
    tipo_atuacao: string;
    area_formacao?: string;
    anos_experiencia?: number;
  }) => {
    if (!user) return { success: false, error: 'Usuária não autenticada' };

    try {
      const { error } = await supabase
        .from('confirmacao_profissional')
        .insert({
          user_id: user.id,
          tipo_atuacao: data.tipo_atuacao,
          area_formacao: data.area_formacao || null,
          anos_experiencia: data.anos_experiencia || null,
          aceita_codigo_etico: true,
        });

      if (error) throw error;

      setIsProfessional(true);
      return { success: true };
    } catch (error: any) {
      console.error('Error confirming professional:', error);
      return { success: false, error: error.message };
    }
  };

  const joinWaitingList = async (interesse?: string) => {
    if (!user) return { success: false, error: 'Usuária não autenticada' };

    try {
      const { error } = await supabase
        .from('lista_espera')
        .insert({
          user_id: user.id,
          email: user.email,
          nome: user.name,
          interesse: interesse || 'Interesse geral',
        });

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Error joining waiting list:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    isProfessional,
    confirmation,
    isLoading,
    confirmProfessional,
    joinWaitingList,
  };
}
