import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ColheitaPergunta {
  id: string;
  ordem: number;
  texto: string;
  obrigatoria?: boolean;
}

export interface ColheitaConfig {
  id: string;
  estacao_id: string;
  rota_id: string | null;
  titulo: string;
  texto_abertura: string;
  perguntas: ColheitaPergunta[];
  ativo: boolean;
  salvar_jardim_oficio: boolean;
}

const PERGUNTAS_PADRAO: ColheitaPergunta[] = [
  { id: 'p1', ordem: 1, texto: 'Qual imagem, frase ou símbolo continua com você após esta estação?' },
  { id: 'p2', ordem: 2, texto: 'O que esta travessia ajudou você a perceber que antes estava menos visível?' },
  { id: 'p3', ordem: 3, texto: 'Que pergunta continua ecoando dentro de você?' },
  { id: 'p4', ordem: 4, texto: 'O que desta estação você conseguiria utilizar na sua prática, trabalho ou forma de acompanhar pessoas?' },
  { id: 'p5', ordem: 5, texto: 'Se a Casa permanecesse mais tempo neste território, o que você gostaria de aprofundar?' },
  { id: 'p6', ordem: 6, texto: 'Se precisasse nomear esta experiência em uma palavra ou expressão, qual seria?' },
];

const TEXTO_ABERTURA_PADRAO = `Antes de encerrar esta travessia, a Casa convida você a recolher os rastros que ficaram pelo caminho.

Não há respostas certas.

Apenas aquilo que pediu escuta.`;

export function useColheitaConfig(estacaoId?: string) {
  return useQuery({
    queryKey: ['colheita-config', estacaoId],
    enabled: !!estacaoId,
    queryFn: async (): Promise<ColheitaConfig> => {
      const client = supabase as any;
      const { data } = await client
        .from('clube_colheita_rastros_config')
        .select('*')
        .eq('estacao_id', estacaoId)
        .maybeSingle();

      if (data) {
        return {
          ...data,
          perguntas: Array.isArray(data.perguntas) ? data.perguntas : PERGUNTAS_PADRAO,
        };
      }
      // Fallback (config ainda não criada)
      return {
        id: '',
        estacao_id: estacaoId!,
        rota_id: null,
        titulo: 'Colheita dos Rastros',
        texto_abertura: TEXTO_ABERTURA_PADRAO,
        perguntas: PERGUNTAS_PADRAO,
        ativo: true,
        salvar_jardim_oficio: true,
      };
    },
  });
}

export function useColheitaRegistro(estacaoId?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['colheita-registro', estacaoId, user?.id],
    enabled: !!estacaoId && !!user,
    queryFn: async () => {
      const client = supabase as any;
      const { data } = await client
        .from('clube_colheita_rastros_registros')
        .select('*')
        .eq('estacao_id', estacaoId)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
  });
}

export function useSubmitColheita() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      estacaoId: string;
      rotaId?: string | null;
      estacaoNome: string;
      respostas: Record<string, string>;
      perguntas: ColheitaPergunta[];
      salvarJardim: boolean;
    }) => {
      if (!user) throw new Error('Usuária não autenticada');
      const client = supabase as any;

      const { error: regError } = await client
        .from('clube_colheita_rastros_registros')
        .insert({
          user_id: user.id,
          estacao_id: input.estacaoId,
          rota_id: input.rotaId ?? null,
          respostas: input.respostas,
          concluido: true,
        });
      if (regError) throw regError;

      if (input.salvarJardim) {
        const sintese = input.perguntas
          .sort((a, b) => a.ordem - b.ordem)
          .map((p) => {
            const r = (input.respostas[p.id] || '').trim();
            return r ? `• ${p.texto}\n  → ${r}` : null;
          })
          .filter(Boolean)
          .join('\n\n');

        const reflexao = `Colheita dos Rastros — ${input.estacaoNome}\n\n${sintese || '(sem respostas registradas)'}`;

        await client.from('jardim_do_oficio').insert({
          user_id: user.id,
          reflexao_profissional: reflexao,
          contexto_origem: `colheita_dos_rastros:${input.estacaoId}`,
        });
      }
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['colheita-registro', vars.estacaoId] });
    },
  });
}

// Convite Fundadoras
export interface ConviteFundadoraConfig {
  id: string;
  estacao_id: string;
  rota_id: string | null;
  ativo: boolean;
  titulo: string;
  texto: string;
  link_whatsapp: string | null;
  texto_botao: string;
  data_aula_ao_vivo: string | null;
  descricao_aula: string | null;
}

export function useConviteFundadoraConfig(estacaoId?: string) {
  return useQuery({
    queryKey: ['convite-fundadora-config', estacaoId],
    enabled: !!estacaoId,
    queryFn: async (): Promise<ConviteFundadoraConfig | null> => {
      const client = supabase as any;
      const { data } = await client
        .from('clube_fundadoras_convite_config')
        .select('*')
        .eq('estacao_id', estacaoId)
        .maybeSingle();
      return data;
    },
  });
}

export function useRegisterConviteClick() {
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: { estacaoId: string; rotaId?: string | null }) => {
      if (!user) return;
      const client = supabase as any;
      await client.from('clube_fundadoras_convite_clicks').insert({
        user_id: user.id,
        estacao_id: input.estacaoId,
        rota_id: input.rotaId ?? null,
        clicou_grupo_whatsapp: true,
      });
    },
  });
}
