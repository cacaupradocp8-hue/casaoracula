import { useState } from 'react';
import { supabase } from '@/lib/dal/dbClient';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface CirculoSagrado {
  id: string;
  facilitadora_id: string;
  nome_circulo: string;
  ritual_base: string;
  data_hora: string;
  local_link: string | null;
  participantes_ids: string[];
  distritos_ativados: string[];
  status_circulo: string;
  created_at: string;
  updated_at: string;
}

export function useCirculosSagrados() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const fetchCirculos = async (): Promise<CirculoSagrado[]> => {
    if (!user?.id) return [];
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('circulos_sagrados')
        .select('*')
        .eq('facilitadora_id', user.id)
        .order('data_hora', { ascending: false });

      if (error) throw error;
      return (data || []) as CirculoSagrado[];
    } catch (error) {
      console.error('Error fetching circulos:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createCirculo = async (nome: string, ritual_base: string, data_hora: string): Promise<CirculoSagrado | null> => {
    if (!user?.id) return null;
    try {
      const { data, error } = await supabase
        .from('circulos_sagrados')
        .insert({
          facilitadora_id: user.id,
          nome_circulo: nome,
          ritual_base,
          data_hora,
        })
        .select()
        .single();

      if (error) throw error;
      toast({ title: 'Círculo criado', description: `"${nome}" foi criado.` });
      return data as CirculoSagrado;
    } catch (error) {
      console.error('Error creating circulo:', error);
      toast({ title: 'Erro ao criar círculo', variant: 'destructive' });
      return null;
    }
  };

  return { loading, fetchCirculos, createCirculo };
}
