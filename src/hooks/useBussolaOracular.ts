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

const DISTRITOS_META: Record<string, { nome: string; icon: string; tensaoMsg: string; ativoMsg: string }> = {
  portao_chegada: { nome: 'Portão da Chegada', icon: '🚪', tensaoMsg: 'Dificuldade de iniciar ou recomeçar. Possível resistência ao novo.', ativoMsg: 'Momento de abertura e início.' },
  torres: { nome: 'Torres', icon: '🏛️', tensaoMsg: 'Estruturas rígidas. Tendência a controle excessivo ou medo de perder a forma.', ativoMsg: 'Fortalecendo suas bases e limites.' },
  portas: { nome: 'Portas', icon: '🔑', tensaoMsg: 'Emoções represadas buscando passagem. Risco de evitação ou explosão.', ativoMsg: 'Abrindo-se para o que precisa ser sentido.' },
  jardim_arquetipos: { nome: 'Jardim dos Arquétipos', icon: '🌿', tensaoMsg: 'Confusão de identidades internas. Risco de se fixar num papel.', ativoMsg: 'Reconhecendo forças arquetípicas em movimento.' },
  praca_abalo: { nome: 'Praça do Abalo', icon: '⚡', tensaoMsg: 'Instabilidade emocional intensa. Priorize regulação antes de avançar.', ativoMsg: 'Algo foi movido. Use a instabilidade como motor.' },
  casa_sonhos: { nome: 'Casa dos Sonhos', icon: '🌙', tensaoMsg: 'O inconsciente está ativo. Atenção a sonhos recorrentes e ansiedade noturna.', ativoMsg: 'O inconsciente envia mensagens claras.' },
  espelho_vinculos: { nome: 'Espelho dos Vínculos', icon: '🪞', tensaoMsg: 'Projeções nos relacionamentos. Risco de confundir o outro com partes internas.', ativoMsg: 'Olhando para o que os vínculos revelam.' },
  forja: { nome: 'Forja', icon: '🔥', tensaoMsg: 'Processo de transformação intenso. Cuidado com queimar etapas.', ativoMsg: 'Transformação em curso. Presença é essencial.' },
  conselho_interior: { nome: 'Conselho Interior', icon: '👁️', tensaoMsg: 'Vozes internas em conflito. Necessário dar espaço para cada parte.', ativoMsg: 'Suas vozes internas buscam integração.' },
  labirinto: { nome: 'Labirinto', icon: '🌀', tensaoMsg: 'Sensação de circularidade. Atenção a padrões repetitivos.', ativoMsg: 'No centro do que precisa ser desvendado.' },
  praca_integracao: { nome: 'Praça da Integração', icon: '☀️', tensaoMsg: 'Dificuldade de unir fragmentos. Integração prematura pode reforçar defesas.', ativoMsg: 'Fragmentos buscam reunião. Momento fértil.' },
  portal_renascimento: { nome: 'Portal de Renascimento', icon: '🦋', tensaoMsg: 'Luto por algo que precisa terminar. Não apresse a passagem.', ativoMsg: 'Transição em andamento. Algo novo se anuncia.' },
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
  tipo: 'pratica' | 'ferramenta' | 'travessia' | 'leitura' | 'escuta';
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
  loading: boolean;
  temCartografia: boolean;
  voz: VozResumo | null;
  welcomeName: string;
  distritoDominante: DistritoResumo | null;
  distritosAtivos: DistritoResumo[];
  distritoTensao: DistritoResumo | null;
  nivelIntegracao: 'inicio' | 'travessia' | 'integracao';
  corHex: string;
  leituraMomento: string | null;
  leitura: LeituraRecomendada;
  acaoPrincipal: RecomendacaoAcao;
  acoesSecundarias: RecomendacaoAcao[];
  praticasSugeridas: { icon: string; label: string; path: string }[];
  alertas: AlertaClinico[];
  // Dados brutos para CidadelaMapSVG
  distritosRaw: Record<string, any>;
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

function gerarLeituraClinica(
  dominante: DistritoResumo | null,
  tensao: DistritoResumo | null,
  nivel: 'inicio' | 'travessia' | 'integracao',
  carto: any,
): string | null {
  if (!dominante) {
    if (carto?.resumo_narrativo) return carto.resumo_narrativo;
    return null;
  }

  const metaDom = DISTRITOS_META[dominante.key];
  const parts: string[] = [];

  // Parte 1: Onde está
  parts.push(`Você está no território d${dominante.nome.match(/^[AEIOUaeiou]/) ? 'a' : 'o'} ${dominante.nome}.`);

  // Parte 2: O que significa (direto)
  if (tensao) {
    const metaTensao = DISTRITOS_META[tensao.key];
    parts.push(metaTensao?.tensaoMsg || `Tensão ativa n${tensao.nome.match(/^[AEIOUaeiou]/) ? 'a' : 'o'} ${tensao.nome}.`);
  } else if (metaDom) {
    parts.push(metaDom.ativoMsg);
  }

  // Parte 3: Direção
  if (nivel === 'inicio') {
    parts.push('O movimento mais seguro agora é explorar sem pressa.');
  } else if (nivel === 'integracao') {
    parts.push('Momento de consolidar o que foi atravessado.');
  } else if (tensao) {
    parts.push('Priorize regulação antes de avançar para novas travessias.');
  }

  return parts.join(' ');
}

function gerarAlertasClinicosFromEstado(
  tensao: DistritoResumo | null,
  distritos: Record<string, any>,
): AlertaClinico[] {
  const alertas: AlertaClinico[] = [];

  if (tensao) {
    const meta = DISTRITOS_META[tensao.key];
    if (meta) {
      alertas.push({ mensagem: meta.tensaoMsg, tipo: 'atencao' });
    }
  }

  const tensoes = Object.entries(distritos).filter(([, v]: any) => (v as any).estado === 'tensao');
  if (tensoes.length >= 3) {
    alertas.push({
      mensagem: 'Vários territórios em tensão simultânea. Reduza estímulos e priorize uma prática de regulação.',
      tipo: 'atencao',
    });
  }

  // Detectar estagnação (todos não explorados)
  const total = Object.keys(distritos).length;
  const explorados = Object.values(distritos).filter((v: any) => v.estado !== 'nao_explorado' && v.estado !== 'potencial').length;
  if (total > 0 && explorados === 0) {
    alertas.push({
      mensagem: 'Nenhum território explorado ainda. A cartografia é o primeiro passo.',
      tipo: 'observacao',
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
      { icon: '🎧', label: 'Escuta contemplativa', path: '/templo-de-escuta' },
      { icon: '🌙', label: 'Registrar sonho', path: '/jardim-da-psique' },
      { icon: '✨', label: 'Tirar uma carta', path: '/oraculos' },
    ];
  }
  if (nivelIntegracao === 'inicio') {
    return [
      { icon: '✨', label: 'Tirar uma carta', path: '/oraculos' },
      { icon: '🌿', label: 'Jardim da Psique', path: '/jardim-da-psique' },
    ];
  }
  if (nivelIntegracao === 'integracao') {
    return [
      { icon: '🌿', label: 'Jardim da Psique', path: '/jardim-da-psique' },
      { icon: '🎧', label: 'Escuta contemplativa', path: '/templo-de-escuta' },
    ];
  }
  // travessia
  return [
    { icon: '✨', label: 'Tirar uma carta', path: '/oraculos' },
    { icon: '🌙', label: 'Registrar sonho', path: '/jardim-da-psique' },
    { icon: '🎧', label: 'Escuta contemplativa', path: '/templo-de-escuta' },
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
        const [profileRes, mapaRes, cartoRes, estacaoRes, jardimRes] = await Promise.all([
          supabase.from('profiles').select('entry_archetype, entry_symbol').eq('id', user.id).single(),
          supabase.from('auto_mapeamento').select('distritos_json').eq('user_id', user.id).maybeSingle() as any,
          supabase.from('cartografia_psiquica').select('cor_predominante, simbolo_pessoal, metadata_json, resumo_narrativo, conflitos_tensoes, sugestao_proximo_passo').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1) as any,
          supabase.from('clube_estacoes').select('id, livro_titulo, livro_autor, livro_capa_url').eq('ativa', true).eq('publicada', true).maybeSingle(),
          supabase.from('jardim_psique_registros').select('id').eq('user_id', user.id).limit(1) as any,
        ]);

        let book = null;
        const estacao = estacaoRes?.data || null;

        if (estacao) {
          book = {
            title: estacao.livro_titulo,
            author: estacao.livro_autor,
            cover_url: estacao.livro_capa_url
          };
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
    const { archetype, distritos, carto, ciclo, book, jardimCount } = raw;
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

    // LEITURA DO MOMENTO — Clínica e direta
    const leituraMomento = temCartografia
      ? gerarLeituraClinica(distritoDominante, distritoTensao, nivelIntegracao, carto)
      : null;

    // AÇÃO PRINCIPAL + SECUNDÁRIAS
    let acaoPrincipal: RecomendacaoAcao;
    const acoesSecundarias: RecomendacaoAcao[] = [];

    if (!temCartografia) {
      acaoPrincipal = { texto: 'Revelar minha CidaDELA', rota: '/ferramenta/cartografia-psiquica-oracula', tipo: 'ferramenta' };
      acoesSecundarias.push({ texto: 'Tirar uma carta', rota: '/oraculos', tipo: 'pratica' });
    } else if (distritoTensao) {
      // Se tem tensão, priorizar regulação
      acaoPrincipal = { texto: 'Prática de regulação', rota: '/templo-de-escuta', tipo: 'escuta' };
      acoesSecundarias.push({ texto: 'Registrar no Jardim', rota: '/jardim-da-psique', tipo: 'pratica' });
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
        motivo = `Para o seu momento atual, essa leitura ativa o território d${distritoDominante.nome.match(/^[AEIOUaeiou]/) ? 'a' : 'o'} ${distritoDominante.nome}.`;
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
      distritosRaw: distritos,
    };
  }, [raw, loading, user]);
}
