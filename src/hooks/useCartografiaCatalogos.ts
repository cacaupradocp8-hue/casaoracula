import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Catálogos para os selects da Fase 1 — Cartografia.
// Torres e Labirintos não possuem tabela canônica → listas curadas locais.
// Portas vêm de labirinto_portas; Arquétipos de labirinto_arquetipos.

const TORRES_CURADAS = [
  'Torre da Performance',
  'Torre do Controle',
  'Torre da Hipervigilância',
  'Torre da Invulnerabilidade',
  'Torre do Sacrifício',
  'Torre da Aprovação',
  'Torre da Excelência',
  'Torre da Autossuficiência',
  'Torre do Silêncio',
  'Torre da Ordem',
];

const LABIRINTOS_CURADOS = [
  'Repetição compulsiva do cuidado',
  'Fuga para a razão',
  'Auto-sabotagem na entrega',
  'Idealização do outro',
  'Retraimento após exposição',
  'Performance de força',
  'Adoecimento como linguagem',
  'Perda de voz no conflito',
  'Hiperprodutividade defensiva',
  'Espera silenciosa por reconhecimento',
];

export interface CartografiaCatalogos {
  torres: string[];
  portas: string[];
  labirintos: string[];
  arquetipos: string[];
  loading: boolean;
}

export function useCartografiaCatalogos(): CartografiaCatalogos {
  const [portas, setPortas] = useState<string[]>([]);
  const [arquetipos, setArquetipos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ativo = true;
    (async () => {
      const [portasRes, arqRes] = await Promise.all([
        supabase.from('labirinto_portas').select('nome').eq('ativa', true).order('ordem', { nullsFirst: false }),
        supabase.from('labirinto_arquetipos').select('nome').order('nome'),
      ]);
      if (!ativo) return;
      setPortas((portasRes.data || []).map((r: any) => r.nome).filter(Boolean));
      setArquetipos((arqRes.data || []).map((r: any) => r.nome).filter(Boolean));
      setLoading(false);
    })();
    return () => { ativo = false; };
  }, []);

  return { torres: TORRES_CURADAS, portas, labirintos: LABIRINTOS_CURADOS, arquetipos, loading };
}
