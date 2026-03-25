import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// ══════════════════════════════════════════════════════════════
// VOZ — Arquétipos de entrada
// ══════════════════════════════════════════════════════════════

const VOZ_META: Record<string, { nome: string; apoio: string; mensagem: string; icone: string }> = {
  therapist: {
    nome: 'Terapeuta',
    apoio: 'Guardiã do Campo',
    mensagem: 'Sua escuta é sua ferramenta mais poderosa. O campo se organiza ao redor da sua presença.',
    icone: '🌿',
  },
  mentor: {
    nome: 'Mentora',
    apoio: 'Tecelã de Caminhos',
    mensagem: 'Você não ensina — você ilumina o caminho que já existe dentro de quem te procura.',
    icone: '✨',
  },
  seeker: {
    nome: 'Buscadora',
    apoio: 'Exploradora do Invisível',
    mensagem: 'A busca é seu território sagrado. Cada pergunta abre uma porta que só você pode atravessar.',
    icone: '🔮',
  },
};

// ══════════════════════════════════════════════════════════════
// DISTRITOS — Meta simbólica
// ══════════════════════════════════════════════════════════════

const DISTRITOS_META: Record<string, { nome: string; icon: string; mensagem: string }> = {
  portao_chegada: { nome: 'Portão da Chegada', icon: '🚪', mensagem: 'Um novo ciclo se anuncia. Permita-se chegar.' },
  torres: { nome: 'Torres', icon: '🏛️', mensagem: 'Suas estruturas estão sendo revisitadas. O que protege também pode aprisionar.' },
  portas: { nome: 'Portas', icon: '🔑', mensagem: 'Emoções buscam passagem. Algo quer ser sentido.' },
  jardim_arquetipos: { nome: 'Jardim dos Arquétipos', icon: '🌿', mensagem: 'Forças antigas pedem reconhecimento. Quem habita você agora?' },
  praca_abalo: { nome: 'Praça do Abalo', icon: '⚡', mensagem: 'Algo foi movido. A instabilidade é parte da travessia.' },
  casa_sonhos: { nome: 'Casa dos Sonhos', icon: '🌙', mensagem: 'O inconsciente envia mensagens. Escute o que vem à noite.' },
  espelho_vinculos: { nome: 'Espelho dos Vínculos', icon: '🪞', mensagem: 'Os outros refletem o que ainda não vemos em nós.' },
  forja: { nome: 'Forja', icon: '🔥', mensagem: 'Transformação pede estrutura e presença. O fogo purifica.' },
  conselho_interior: { nome: 'Conselho Interior', icon: '👁️', mensagem: 'Suas vozes internas querem ser ouvidas. Qual delas lidera?' },
  labirinto: { nome: 'Labirinto', icon: '🌀', mensagem: 'Você está no centro do que precisa ser desvendado.' },
  praca_integracao: { nome: 'Praça da Integração', icon: '☀️', mensagem: 'O que foi fragmento agora busca reunião. Permita a síntese.' },
  portal_renascimento: { nome: 'Portal de Renascimento', icon: '🦋', mensagem: 'Algo morre para que algo novo possa nascer.' },
};

// ══════════════════════════════════════════════════════════════
// TIPOS
// ══════════════════════════════════════════════════════════════

export interface VozData {
  primaria: { nome: string; icone: string } | null;
  apoio: { nome: string } | null;
  mensagem: string | null;
  simbolo: string | null;
}

export interface MapaData {
  temCartografia: boolean;
  distritoCentral: { key: string; nome: string; icon: string; mensagem: string } | null;
  distritosAtivos: { key: string; nome: string; icon: string }[];
  distritoTensao: { key: string; nome: string; icon: string } | null;
  cor: string | null;
  corHex: string;
  simbolo: string | null;
  distritos: Record<string, any>;
}

export interface MomentoData {
  distritoAtivo: string | null;
  distritoTensao: string | null;
  direcaoSimbolica: string | null;
}

export interface ProximoPassoData {
  texto: string;
  rota: string;
  tipo: 'pratica' | 'ferramenta' | 'travessia';
}

export interface LeituraData {
  livroTitulo: string | null;
  livroAutor: string | null;
  livroCapa: string | null;
  cicloId: string | null;
  motivoSugestao: string | null;
}

export interface HomeData {
  voz: VozData;
  mapa: MapaData;
  momento: MomentoData;
  proximoPasso: ProximoPassoData;
  leitura: LeituraData;
  loading: boolean;
}

// ══════════════════════════════════════════════════════════════
// HOOK PRINCIPAL
// ══════════════════════════════════════════════════════════════

export function useHomeInteligente(): HomeData {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [voz, setVoz] = useState<VozData>({ primaria: null, apoio: null, mensagem: null, simbolo: null });
  const [mapa, setMapa] = useState<MapaData>({
    temCartografia: false, distritoCentral: null, distritosAtivos: [], distritoTensao: null,
    cor: null, corHex: '#C9A24A', simbolo: null, distritos: {},
  });
  const [momento, setMomento] = useState<MomentoData>({ distritoAtivo: null, distritoTensao: null, direcaoSimbolica: null });
  const [proximoPasso, setProximoPasso] = useState<ProximoPassoData>({ texto: 'Iniciar sua Cartografia', rota: '/ferramenta/cartografia-psiquica-oracula', tipo: 'ferramenta' });
  const [leitura, setLeitura] = useState<LeituraData>({ livroTitulo: null, livroAutor: null, livroCapa: null, cicloId: null, motivoSugestao: null });

  useEffect(() => {
    if (!user?.id) return;
    loadAll();
  }, [user?.id]);

  const loadAll = async () => {
    try {
      const [profileRes, mapaRes, cartoRes, cicloRes, jardimRes] = await Promise.all([
        supabase.from('profiles').select('entry_archetype, entry_symbol').eq('id', user!.id).single(),
        supabase.from('auto_mapeamento').select('distritos_json, anotacoes').eq('user_id', user!.id).maybeSingle() as any,
        supabase.from('cartografia_psiquica').select('cor_predominante, simbolo_pessoal, territorios_principais, metadata_json, resumo_narrativo, conflitos_tensoes, sugestao_proximo_passo').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(1) as any,
        supabase.from('cycles').select('id, book_id').eq('status', 'active').limit(1) as any,
        supabase.from('jardim_psique_registros').select('id').eq('user_id', user!.id).limit(3) as any,
      ]);

      // ── VOZ ──
      const archetype = profileRes.data?.entry_archetype;
      const symbol = profileRes.data?.entry_symbol;
      if (archetype && VOZ_META[archetype]) {
        const v = VOZ_META[archetype];
        setVoz({
          primaria: { nome: v.nome, icone: v.icone },
          apoio: { nome: v.apoio },
          mensagem: v.mensagem,
          simbolo: symbol || null,
        });
      }

      // ── MAPA / CIDADELA ──
      const carto = cartoRes?.data?.[0];
      const mapaData = mapaRes?.data;
      const distritos = mapaData?.distritos_json || {};
      const temCartografia = !!carto;

      if (temCartografia) {
        const centralEntry = Object.entries(distritos).find(([, v]: any) => v.estado === 'central');
        const ativosEntries = Object.entries(distritos).filter(([, v]: any) => v.estado === 'ativo');
        const tensaoEntry = Object.entries(distritos).find(([, v]: any) => v.estado === 'tensao');

        const buildDistrict = (entry: [string, any] | undefined) => {
          if (!entry) return null;
          const [key, val] = entry;
          const meta = DISTRITOS_META[key];
          return { key, nome: val.nome || meta?.nome || key, icon: val.icon || meta?.icon || '🏛️', mensagem: meta?.mensagem || '' };
        };

        const central = buildDistrict(centralEntry);
        const tensao = buildDistrict(tensaoEntry);

        setMapa({
          temCartografia: true,
          distritoCentral: central,
          distritosAtivos: ativosEntries.map(e => {
            const meta = DISTRITOS_META[e[0]];
            return { key: e[0], nome: (e[1] as any).nome || meta?.nome || e[0], icon: (e[1] as any).icon || meta?.icon || '🏛️' };
          }),
          distritoTensao: tensao ? { key: tensao.key, nome: tensao.nome, icon: tensao.icon } : null,
          cor: carto.cor_predominante,
          corHex: carto.metadata_json?.cor_hex || '#C9A24A',
          simbolo: carto.simbolo_pessoal,
          distritos,
        });

        // ── MOMENTO ──
        setMomento({
          distritoAtivo: central?.nome || null,
          distritoTensao: tensao?.nome || null,
          direcaoSimbolica: central?.mensagem || carto.resumo_narrativo || null,
        });

        // ── PRÓXIMO PASSO ──
        if (carto.sugestao_proximo_passo) {
          setProximoPasso({ texto: carto.sugestao_proximo_passo, rota: '/ferramentas', tipo: 'ferramenta' });
        } else if (!(jardimRes?.data?.length)) {
          setProximoPasso({ texto: 'Escrever no Jardim da Psique', rota: '/jardim-da-psique', tipo: 'pratica' });
        } else {
          setProximoPasso({ texto: 'Explorar suas ferramentas', rota: '/ferramentas', tipo: 'ferramenta' });
        }

        // ── LEITURA baseada em voz + distrito ──
        if (cicloRes?.data?.[0]) {
          const ciclo = cicloRes.data[0];
          const { data: bookData } = await supabase.from('books').select('title, author, cover_url').eq('id', ciclo.book_id).single();
          if (bookData) {
            const motivoBase = central
              ? `Recomendado para quem está no território d${central.nome.startsWith('A') || central.nome.startsWith('E') ? 'a' : 'o'} ${central.nome}.`
              : archetype ? `Selecionado para a Voz ${VOZ_META[archetype]?.nome || 'Interior'}.` : 'Leitura ativa do ciclo atual.';
            setLeitura({
              livroTitulo: bookData.title,
              livroAutor: bookData.author,
              livroCapa: bookData.cover_url,
              cicloId: ciclo.id,
              motivoSugestao: motivoBase,
            });
          }
        }
      } else {
        // Sem cartografia
        setProximoPasso({ texto: 'Revelar minha CidaDELA', rota: '/ferramenta/cartografia-psiquica-oracula', tipo: 'ferramenta' });

        if (cicloRes?.data?.[0]) {
          const ciclo = cicloRes.data[0];
          const { data: bookData } = await supabase.from('books').select('title, author, cover_url').eq('id', ciclo.book_id).single();
          if (bookData) {
            setLeitura({
              livroTitulo: bookData.title,
              livroAutor: bookData.author,
              livroCapa: bookData.cover_url,
              cicloId: ciclo.id,
              motivoSugestao: archetype ? `Sugestão para a Voz ${VOZ_META[archetype]?.nome || 'Interior'}.` : 'Leitura do ciclo ativo.',
            });
          }
        }
      }
    } catch (err) {
      console.error('Erro ao carregar home inteligente:', err);
    } finally {
      setLoading(false);
    }
  };

  return { voz, mapa, momento, proximoPasso, leitura, loading };
}
