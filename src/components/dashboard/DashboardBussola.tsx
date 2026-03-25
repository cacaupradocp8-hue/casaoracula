import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Compass, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DISTRITOS_META: Record<string, { nome: string; icon: string }> = {
  portao_chegada: { nome: 'Portão da Chegada', icon: '🚪' },
  torres: { nome: 'Torres', icon: '🏛️' },
  portas: { nome: 'Portas', icon: '🔑' },
  jardim_arquetipos: { nome: 'Jardim dos Arquétipos', icon: '🌿' },
  praca_abalo: { nome: 'Praça do Abalo', icon: '⚡' },
  casa_sonhos: { nome: 'Casa dos Sonhos', icon: '🌙' },
  espelho_vinculos: { nome: 'Espelho dos Vínculos', icon: '🪞' },
  forja: { nome: 'Forja', icon: '🔥' },
  conselho_interior: { nome: 'Conselho Interior', icon: '👁️' },
  labirinto: { nome: 'Labirinto', icon: '🌀' },
  praca_integracao: { nome: 'Praça da Integração', icon: '☀️' },
  portal_renascimento: { nome: 'Portal de Renascimento', icon: '🦋' },
};

interface BussolaData {
  distritoCentral: { key: string; nome: string; icon: string } | null;
  cor: string;
  corHex: string;
  simbolo: string | null;
}

export function DashboardBussola() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<BussolaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadBussola();
  }, [user]);

  const loadBussola = async () => {
    const [{ data: mapa }, { data: carto }] = await Promise.all([
      supabase.from('auto_mapeamento').select('distritos_json').eq('user_id', user!.id).maybeSingle() as any,
      supabase.from('cartografia_psiquica').select('cor_predominante, simbolo_pessoal, metadata_json').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(1) as any,
    ]);

    if (!mapa || !carto?.[0]) {
      setLoading(false);
      return;
    }

    const distritos = mapa.distritos_json || {};
    const centralEntry = Object.entries(distritos).find(([, v]: any) => v.estado === 'central');
    const c = carto[0];

    setData({
      distritoCentral: centralEntry
        ? { key: centralEntry[0], nome: (centralEntry[1] as any).nome, icon: (centralEntry[1] as any).icon }
        : null,
      cor: c.cor_predominante,
      corHex: c.metadata_json?.cor_hex || '#C9A24A',
      simbolo: c.simbolo_pessoal,
    });
    setLoading(false);
  };

  if (loading) return null;

  // Se não tem CidaDELA, mostrar convite
  if (!data) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-2xl border border-primary/10 bg-primary/5 p-5 mb-6"
      >
        <div className="flex items-start gap-3">
          <Compass className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div className="flex-1 space-y-2">
            <p className="text-sm font-medium text-foreground">Descubra sua CidaDELA Interior</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Faça a Cartografia Psíquica Orácula para gerar seu mapa simbólico e transformá-lo em bússola da sua jornada.
            </p>
            <Button
              size="sm"
              variant="gold"
              className="gap-1.5 mt-1"
              onClick={() => navigate('/ferramenta/cartografia-psiquica-oracula')}
            >
              Começar cartografia <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-2xl border border-border/10 p-5 mb-6 cursor-pointer hover:border-primary/20 transition-colors"
      style={{ background: `linear-gradient(135deg, ${data.corHex}08, transparent 60%)` }}
      onClick={() => navigate('/revelacao-cidadela')}
    >
      <div className="flex items-center gap-2 mb-3">
        <Compass className="w-4 h-4 text-primary/60" />
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">
          Sua bússola na Casa
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Distrito central */}
        <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
          style={{ background: `${data.corHex}15`, border: `1.5px solid ${data.corHex}30` }}>
          <span className="text-2xl">{data.distritoCentral?.icon || '🏛️'}</span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {data.distritoCentral?.nome || 'CidaDELA Interior'}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.corHex }} />
            <span className="text-xs text-muted-foreground">{data.cor}</span>
          </div>
        </div>

        <ArrowRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
      </div>
    </motion.div>
  );
}
