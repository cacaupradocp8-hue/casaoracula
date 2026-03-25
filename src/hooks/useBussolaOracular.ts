import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// ── Metadata ──

const VOZ_META: Record<string, { nome: string; apoio: string; mensagem: string; icone: string }> = {
  therapist: {
    nome: 'Terapeuta',
    apoio: 'Guardiã do Campo',
    mensagem: 'Sua escuta é sua ferramenta mais poderosa.',
    icone: '🌿',
  },
  mentor: {
    nome: 'Mentora',
    apoio: 'Tecelã de Caminhos',
    mensagem: 'Você ilumina o caminho que já existe dentro de quem te procura.',
    icone: '✨',
  },
  seeker: {
    nome: 'Buscadora',
    apoio: 'Exploradora do Invisível',
    mensagem: 'Cada pergunta abre uma porta que só você pode atravessar.',
    icone: '🔮',
  },
};

const DISTRITOS_META: Record<string, { nome: string; icon: string; mensagem: string }> = {
  portao_chegada: { nome: 'Portão da Chegada', icon: '🚪', mensagem: 'Um novo ciclo se anuncia. Permita-se chegar.' },
  torres: { nome: 'Torres', icon: '🏛️', mensagem: 'Suas estruturas estão sendo revisitadas.' },
  portas: { nome: 'Portas', icon: '🔑', mensagem: 'Emoções buscam passagem. Algo quer ser sentido.' },
  jardim_arquetipos: { nome: 'Jardim dos Arquétipos', icon: '🌿', mensagem: 'Forças antigas pedem reconhecimento.' },
  praca_abalo: { nome: 'Praça do Abalo', icon: '⚡', mensagem: 'Algo foi movido. A instabilidade é parte da travessia.' },
  casa_sonhos: { nome: 'Casa dos Sonhos', icon: '🌙', mensagem: 'O inconsciente envia mensagens.' },
  espelho_vinculos: { nome: 'Espelho dos Vínculos', icon: '🪞', mensagem: 'Os outros refletem o que ainda não vemos.' },
  forja: { nome: 'Forja', icon: '🔥', mensagem: 'Transformação pede estrutura e presença.' },
  conselho_interior: { nome: 'Conselho Interior', icon: '👁️', mensagem: 'Suas vozes internas querem ser ouvidas.' },
  labirinto: { nome: 'Labirinto', icon: '🌀', mensagem: 'Você está no centro do que precisa ser desvendado.' },
  praca_integracao: { nome: 'Praça da Integração', icon: '☀️', mensagem: 'O que foi fragmento agora busca reunião.' },
  portal_renascimento: { nome: 'Portal de Renascimento', icon: '🦋', mensagem: 'Algo morre para que algo novo possa nascer.' },
};

// ── Types ──

export interface VozResumo {
  nome: string;
  icone: string;
  apoio: string;
  fraseSintese: string;
}

export interface DistritoResumo {
  key: string;
  nome: string;
  icon: string;
  estado: 'ativo' | 'tensao' | 'integrado' | 'nao_explorado' | 'central';
}

export interface RecomendacaoAcao {
  texto: string;
  rota: string;
  tipo: 'pratica' | 'ferramenta' | 'travessia' | 'leitura';
}

export interface LeituraRecomendada {
  titulo: string | null;
  autor: string | null;
  capa: string | null;
  cicloId: string | null;
  motivo: string | null;
}

export interface AlertaClinico {
  mensagem: string;
  tipo: 'atencao' | 'observacao';
}

export interface BussolaData {
  // estado geral
  loading: boolean;
  temCartografia: boolean;

  // voz
  voz: VozResumo | null;
  welcomeName: string;

  // cidadela
  distritoDominante: DistritoResumo | null;
  distritosAtivos: DistritoResumo[];
  distritoTensao: DistritoResumo | null;
  nivelIntegracao: 'inicio' | 'travessia' | 'integracao';
  corHex: string;

  // momento / leitura
  leituraMomento: string | null;
  leitura: LeituraRecomendada;

  // ações
  acaoPrincipal: RecomendacaoAcao;
  acoesSecundarias: RecomendacaoAcao[];

  // práticas filtradas
  praticasSugeridas: { icon: string; label: string; path: string }[];

  // alertas
  alertas: AlertaClinico[];
}

// ── Helpers ──

function buildDistrito(key: string, val: any): DistritoResumo {
  const meta = DISTRITOS_META[key];
  const estado = val?.estado || 'nao_explorado';
  return {
    key,
    nome: val?.nome || meta?.nome || key,
    icon: val?.icon || meta?.icon || '🏛️',
    estado: estado as DistritoResumo['estado'],
  };
}

function calcNivelIntegracao(distritos: Record<string, any>): 'inicio' | 'travessia' | 'integracao' {
  const entries = Object.values(distritos);
  if (entries.length === 0) return 'inicio';
  const integrados = entries.filter((v: any) => v.estado === 'integrado').length;
  const ratio = integrados / entries.length;
  if (ratio >= 0.5) return 'integracao';
  if (entries.some((v: any) => v.estado === 'ativo' || v.estado === 'tensao')) return 'travessia';
  return 'inicio';
}

function gerarAlertasClinicosFromEstado(
  tensao: DistritoResumo | null,
  distritos: Record<string, any>,
): AlertaClinico[] {
  const alertas: AlertaClinico[] = [];

  if (tensao) {
    const meta = DISTRITOS_META[tensao.key];
    if (meta) {
      alertas.push({
        mensagem: meta.mensagem,
        tipo: 'atencao',
      });
    }
  }

  // Detectar loops (muitos distritos em tensão)
  const tensoes = Object.entries(distritos).filter(([, v]: any) => (v as any).estado === 'tensao');
  if (tensoes.length >= 3) {
    alertas.push({
      mensagem: 'Vários territórios em tensão simultânea. Considere uma prática de regulação antes de avançar.',
      tipo: 'atencao',
    });
  }

  return alertas;
}

function gerarPraticasFiltradas(
  nivelIntegracao: 'inicio' | 'travessia' | 'integracao',
  temTensao: boolean,
): { icon: string; label: string; path: string }[] {
  if (temTensao) {
    return [
      { icon: '🌙', label: 'Registrar sonho', path: '/jardim-da-psique' },
      { icon: '✨', label: 'Tirar uma carta', path: '/oraculos' },
    ];
  }
  if (nivelIntegracao === 'inicio') {
    return [
      { icon: '✨', label: 'Tirar uma carta', path: '/oraculos' },
      { icon: '🌿', label: 'Jardim da Psique', path: '/jardim-da-psique' },
      { icon: '▶️', label: 'Iniciar sessão', path: '/casa-das-maquinas/sessoes' },
    ];
  }
  if (nivelIntegracao === 'integracao') {
    return [
      { icon: '🌿', label: 'Jardim da Psique', path: '/jardim-da-psique' },
      { icon: '▶️', label: 'Iniciar sessão', path: '/casa-das-maquinas/sessoes' },
    ];
  }
  // travessia
  return [
    { icon: '✨', label: 'Tirar uma carta', path: '/oraculos' },
    { icon: '🌙', label: 'Registrar sonho', path: '/jardim-da-psique' },
    { icon: '▶️', label: 'Iniciar sessão', path: '/casa-das-maquinas/sessoes' },
  ];
}

// ── Hook ──

export function useBussolaOracular(): BussolaData {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [raw, setRaw] = useState<{
    archetype: string | null;
    symbol: string | null;
    distritos: Record<string, any>;
    carto: any;
    ciclo: any;
    book: any;
    jardimCount: number;
  }>({
    archetype: null,
    symbol: null,
    distritos: {},
    carto: null,
    ciclo: null,
    book: null,
    jardimCount: 0,
  });

  useEffect(() => {
    if (!user?.id) return;

    const load = async () => {
      try {
        const [profileRes, mapaRes, cartoRes, cicloRes, jardimRes] = await Promise.all([
          supabase.from('profiles').select('entry_archetype, entry_symbol').eq('id', user.id).single(),
          supabase.from('auto_mapeamento').select('distritos_json').eq('user_id', user.id).maybeSingle() as any,
          supabase.from('cartografia_psiquica').select('cor_predominante, simbolo_pessoal, metadata_json, resumo_narrativo, conflitos_tensoes, sugestao_proximo_passo').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1) as any,
          supabase.from('cycles').select('id, book_id').eq('status', 'active').limit(1) as any,
          supabase.from('jardim_psique_registros').select('id').eq('user_id', user.id).limit(1) as any,
        ]);

        let book = null;
        const ciclo = cicloRes?.data?.[0] || null;
        if (ciclo?.book_id) {
          const { data } = await supabase.from('books').select('title, author, cover_url').eq('id', ciclo.book_id).single();
          book = data;
        }

        setRaw({
          archetype: profileRes.data?.entry_archetype || null,
          symbol: profileRes.data?.entry_symbol || null,
          distritos: mapaRes?.data?.distritos_json || {},
          carto: cartoRes?.data?.[0] || null,
          ciclo,
          book,
          jardimCount: jardimRes?.data?.length || 0,
        });
      } catch (err) {
        console.error('Bússola load error:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.id]);

  return useMemo(() => {
    const { archetype, symbol, distritos, carto, ciclo, book, jardimCount } = raw;
    const temCartografia = !!carto;
    const welcomeName = user?.name?.split(' ')[0] || 'Habitante';

    // VOZ
    const vozMeta = archetype ? VOZ_META[archetype] : null;
    const voz: VozResumo | null = vozMeta
      ? { nome: vozMeta.nome, icone: vozMeta.icone, apoio: vozMeta.apoio, fraseSintese: vozMeta.mensagem }
      : null;

    // DISTRITOS
    const centralEntry = Object.entries(distritos).find(([, v]: any) => (v as any).estado === 'central');
    const ativosEntries = Object.entries(distritos).filter(([, v]: any) => {
      const e = (v as any).estado;
      return e === 'ativo' || e === 'central';
    });
    const tensaoEntry = Object.entries(distritos).find(([, v]: any) => (v as any).estado === 'tensao');

    const distritoDominante = centralEntry ? buildDistrito(centralEntry[0], centralEntry[1]) : null;
    const distritosAtivos = ativosEntries.map(([k, v]) => buildDistrito(k, v));
    const distritoTensao = tensaoEntry ? buildDistrito(tensaoEntry[0], tensaoEntry[1]) : null;
    const nivelIntegracao = calcNivelIntegracao(distritos);
    const corHex = carto?.metadata_json?.cor_hex || '#C9A24A';

    // LEITURA DO MOMENTO
    let leituraMomento: string | null = null;
    if (temCartografia && distritoDominante) {
      const tensaoTexto = distritoTensao
        ? ` Existe tensão no território d${distritoTensao.nome.startsWith('A') || distritoTensao.nome.startsWith('E') ? 'a' : 'o'} ${distritoTensao.nome}.`
        : '';
      const meta = DISTRITOS_META[distritoDominante.key];
      leituraMomento = `Você está no território d${distritoDominante.nome.startsWith('A') || distritoDominante.nome.startsWith('E') ? 'a' : 'o'} ${distritoDominante.nome}. ${meta?.mensagem || ''}${tensaoTexto}`;
    } else if (temCartografia) {
      leituraMomento = carto?.resumo_narrativo || null;
    }

    // AÇÃO PRINCIPAL + SECUNDÁRIAS
    let acaoPrincipal: RecomendacaoAcao;
    const acoesSecundarias: RecomendacaoAcao[] = [];

    if (!temCartografia) {
      acaoPrincipal = { texto: 'Revelar minha CidaDELA', rota: '/ferramenta/cartografia-psiquica-oracula', tipo: 'ferramenta' };
      acoesSecundarias.push({ texto: 'Tirar uma carta', rota: '/oraculos', tipo: 'pratica' });
    } else if (carto?.sugestao_proximo_passo) {
      acaoPrincipal = { texto: carto.sugestao_proximo_passo, rota: '/ferramentas', tipo: 'ferramenta' };
      if (jardimCount === 0) {
        acoesSecundarias.push({ texto: 'Escrever no Jardim da Psique', rota: '/jardim-da-psique', tipo: 'pratica' });
      }
    } else if (jardimCount === 0) {
      acaoPrincipal = { texto: 'Escrever no Jardim da Psique', rota: '/jardim-da-psique', tipo: 'pratica' };
      acoesSecundarias.push({ texto: 'Explorar ferramentas', rota: '/ferramentas', tipo: 'ferramenta' });
    } else {
      acaoPrincipal = { texto: 'Continuar sua travessia', rota: '/ferramentas', tipo: 'ferramenta' };
    }

    if (ciclo && book) {
      acoesSecundarias.push({ texto: 'Continuar leitura', rota: `/clube-livro/${ciclo.id}`, tipo: 'leitura' });
    }

    // LEITURA RECOMENDADA
    let motivo: string | null = null;
    if (book) {
      if (distritoDominante) {
        motivo = `Essa leitura ativa o território d${distritoDominante.nome.startsWith('A') || distritoDominante.nome.startsWith('E') ? 'a' : 'o'} ${distritoDominante.nome}.`;
      } else if (voz) {
        motivo = `Sugestão para a Voz ${voz.nome}.`;
      } else {
        motivo = 'Leitura do ciclo ativo.';
      }
    }
    const leitura: LeituraRecomendada = {
      titulo: book?.title || null,
      autor: book?.author || null,
      capa: book?.cover_url || null,
      cicloId: ciclo?.id || null,
      motivo,
    };

    // PRÁTICAS
    const praticasSugeridas = gerarPraticasFiltradas(nivelIntegracao, !!distritoTensao);

    // ALERTAS
    const alertas = temCartografia ? gerarAlertasClinicosFromEstado(distritoTensao, distritos) : [];

    return {
      loading,
      temCartografia,
      voz,
      welcomeName,
      distritoDominante,
      distritosAtivos,
      distritoTensao,
      nivelIntegracao,
      corHex,
      leituraMomento,
      leitura,
      acaoPrincipal,
      acoesSecundarias,
      praticasSugeridas,
      alertas,
    };
  }, [raw, loading, user]);
}
