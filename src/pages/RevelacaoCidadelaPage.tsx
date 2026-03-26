import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, Sparkles } from 'lucide-react';
import CidadelaMapSVG, { type DistrictDisplayState } from '@/components/cidadela/CidadelaMapSVG';

const DISTRITOS_META: Record<string, { nome: string; icon: string; desc: string }> = {
  portao_chegada: { nome: 'Portão da Chegada', icon: '🚪', desc: 'Chegadas, inícios' },
  torres: { nome: 'Torres', icon: '🏛️', desc: 'Estruturas, proteção' },
  portas: { nome: 'Portas', icon: '🔑', desc: 'Emoções, acessos' },
  jardim_arquetipos: { nome: 'Jardim dos Arquétipos', icon: '🌿', desc: 'Forças profundas' },
  praca_abalo: { nome: 'Praça do Abalo', icon: '⚡', desc: 'Emoções intensas' },
  casa_sonhos: { nome: 'Casa dos Sonhos', icon: '🌙', desc: 'Inconsciente, imaginação' },
  espelho_vinculos: { nome: 'Espelho dos Vínculos', icon: '🪞', desc: 'Relacionamentos' },
  forja: { nome: 'Forja', icon: '🔥', desc: 'Transformação' },
  conselho_interior: { nome: 'Conselho Interior', icon: '👁️', desc: 'Sabedoria interna' },
  labirinto: { nome: 'Labirinto', icon: '🌀', desc: 'Confusão, ciclos' },
  praca_integracao: { nome: 'Praça da Integração', icon: '☀️', desc: 'Síntese' },
  portal_renascimento: { nome: 'Portal de Renascimento', icon: '🦋', desc: 'Transição' },
};

interface CidadelaData {
  distritos_json: Record<string, { nome: string; estado: string; icon: string }>;
  anotacoes: string | null;
}

interface CartografiaData {
  cor_predominante: string;
  atmosfera: string[];
  territorios_principais: string[];
  simbolo_pessoal: string | null;
  ponto_partida: string | null;
  metadata_json: any;
}

const anim = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
});

export default function RevelacaoCidadelaPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cidadela, setCidadela] = useState<CidadelaData | null>(null);
  const [cartografia, setCartografia] = useState<CartografiaData | null>(null);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    const [{ data: mapa }, { data: carto }] = await Promise.all([
      supabase.from('auto_mapeamento').select('*').eq('user_id', user!.id).maybeSingle() as any,
      supabase.from('cartografia_psiquica').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(1) as any,
    ]);
    setCidadela(mapa);
    setCartografia(carto?.[0] || null);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!cidadela || !cartografia) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Nenhuma cartografia encontrada.</p>
          <Button onClick={() => navigate('/ferramenta/cartografia-psiquica-oracula')}>
            Fazer minha cartografia
          </Button>
        </div>
      </div>
    );
  }

  const distritos = cidadela.distritos_json || {};
  const central = Object.entries(distritos).find(([, v]) => v.estado === 'central');
  const ativos = Object.entries(distritos).filter(([, v]) => v.estado === 'ativo');
  const corHex = cartografia.metadata_json?.cor_hex || '#C9A24A';

  // Build district states for CidadelaMapSVG
  const svgStates = useMemo(() => {
    const states: Record<string, DistrictDisplayState> = {};
    Object.entries(distritos).forEach(([, d]) => {
      const key = d.nome.toLowerCase();
      if (d.estado === 'central') states[key] = 'ativo';
      else if (d.estado === 'ativo') states[key] = 'ativo';
      else if (d.estado === 'tensao') states[key] = 'em_tensao';
      else if (d.estado === 'integrado') states[key] = 'integrado';
    });
    return states;
  }, [distritos]);

  // Generate symbolic reading
  const centralNome = central?.[1]?.nome || 'sua cidade interior';
  const ativosNomes = ativos.map(([, v]) => v.nome);
  const leitura = gerarLeituraSimbólica(centralNome, ativosNomes, cartografia.cor_predominante);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-5 py-12 space-y-10">

        {/* Header */}
        <motion.div {...anim(0)} className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
            style={{ background: `${corHex}20`, border: `2px solid ${corHex}40` }}>
            <MapPin className="w-10 h-10" style={{ color: corHex }} />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">
            Sua CidaDELA Interior
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
            Este mapa não é apenas um resultado.
            <br />
            Ele será sua bússola de travessia, estudo e prática dentro da Casa Orácula.
          </p>
        </motion.div>

        {/* Cor e atmosfera */}
        <motion.div {...anim(0.2)} className="flex items-center justify-center gap-3 flex-wrap">
          <div className="w-6 h-6 rounded-full shadow-md" style={{ backgroundColor: corHex }} />
          <span className="text-sm font-medium">{cartografia.cor_predominante}</span>
          <span className="text-xs text-muted-foreground">·</span>
          {cartografia.atmosfera?.slice(0, 3).map(a => (
            <span key={a} className="text-xs bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground">{a}</span>
          ))}
        </motion.div>

        {/* Mapa visual — Mandala CidaDELA */}
        <motion.div {...anim(0.3)}>
          <CidadelaMapSVG
            districtStates={svgStates}
            activeDistrict={central?.[1]?.nome || null}
            maxWidth={520}
          />
        </motion.div>

        {/* Leitura simbólica */}
        <motion.div {...anim(0.5)} className="text-center space-y-3">
          <Sparkles className="w-4 h-4 mx-auto text-primary/50" />
          <p className="text-sm text-foreground/80 italic leading-relaxed max-w-md mx-auto">
            "{leitura}"
          </p>
        </motion.div>

        {/* Distritos listados */}
        <motion.div {...anim(0.6)} className="space-y-2">
          <p className="text-xs text-muted-foreground/60 text-center mb-3">Territórios da sua CidaDELA</p>
          <div className="grid grid-cols-2 gap-2">
            {[...(central ? [central] : []), ...ativos].map(([key, d]) => (
              <div key={key} className="flex items-center gap-2 rounded-lg border border-border/10 p-2.5 bg-card/30">
                <span className="text-lg">{d.icon}</span>
                <div>
                  <p className="text-xs font-medium text-foreground">{d.nome}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{d.estado}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div {...anim(0.8)} className="text-center space-y-4 pt-4">
          <Button variant="gold" size="lg" className="gap-2 px-8" onClick={() => navigate('/dashboard-membro')}>
            <MapPin className="w-4 h-4" />
            Entrar na Casa com meu mapa
          </Button>
          <p className="text-[10px] text-muted-foreground/40">
            Sua CidaDELA agora orienta sua jornada dentro da Casa Orácula.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function gerarLeituraSimbólica(central: string, ativos: string[], cor: string): string {
  const ativosText = ativos.length > 0 ? ativos.slice(0, 2).join(' e ') : 'territórios em potencial';
  return `Seu mapa inicial mostra predominância em ${central}, com sinais de travessia em direção a ${ativosText}. A cor ${cor} revela o tom emocional deste momento da sua jornada.`;
}
