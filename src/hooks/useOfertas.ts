import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Oferta {
  id: string;
  nome: string;
  subtitulo: string | null;
  tipo: 'gratuito' | 'formacao' | 'assinatura';
  preco: string | null;
  gratuito: boolean;
  texto_botao: string;
  link_botao: string;
  badge: string | null;
  inclusoes: string[];
  simbolo: string;
  ordem: number;
  ativo: boolean;
  destaque: boolean;
}

export function useOfertas() {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const { data, error } = await supabase
          .from('ofertas')
          .select('*')
          .eq('ativo', true)
          .order('ordem');

        if (error) throw error;

        // Cast tipo to ensure correct type
        const typedData = (data || []).map(item => ({
          ...item,
          tipo: item.tipo as 'gratuito' | 'formacao' | 'assinatura'
        }));
        setOfertas(typedData);
      } catch (err) {
        console.error('Erro ao carregar ofertas:', err);
        setError('Erro ao carregar ofertas');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOfertas();
  }, []);

  return { ofertas, isLoading, error };
}
