import React from 'react';
import { motion } from 'framer-motion';
import { Compass, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CamadaCidadela } from '@/components/cartografia-unificada/CamadaCidadela';
import type { BussolaData } from '@/hooks/useBussolaOracular';

interface CidadelaRotasViewProps {
  bussola: BussolaData;
}

export function CidadelaRotasView({ bussola }: CidadelaRotasViewProps) {
  const navigate = useNavigate();

  const camadaData = {
    distrito_dominante: bussola.distritoDominante?.nome || '',
    distrito_dominante_descricao: bussola.leituraSimbolica || '',
    distritos_ativos: bussola.distritosAtivos.map(d => d.nome),
    distritos_tensao: bussola.distritoTensao ? [bussola.distritoTensao.nome] : [],
    territorio_crescimento: '',
    territorio_crescimento_descricao: '',
    leitura_integrada: bussola.leituraSimbolica || '',
    tensao_simbolica: bussola.alertas[0]?.mensagem || '',
    direcao_travessia: bussola.acaoPrincipal.texto || '',
  };

  const sinteseCurta = bussola.distritoDominante?.nome
    ? `Seu território dominante: ${bussola.distritoDominante.nome}.`
    : 'Seu mapa simbólico foi revelado.';

  return (
    <div className="space-y-12 pb-16">
      {/* HERO — MÍNIMO */}
      <header className="text-center space-y-6 pt-8 max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-16 h-16 bg-gold/5 rounded-full flex items-center justify-center mx-auto border border-gold/20 shadow-premium-glow"
        >
          <Compass className="w-8 h-8 text-gold/80" />
        </motion.div>
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-display text-foreground tracking-tight">
            Sua <span className="text-gold italic">CidadELA</span>
          </h1>
          <p className="text-gold/60 text-xs uppercase tracking-[0.3em] font-medium">Cartografia Revelada</p>
        </div>
      </header>

      {/* MANDALA */}
      <section className="relative px-4">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
          <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-gold/5 blur-[120px] animate-pulse" />
        </div>
        <CamadaCidadela
          data={camadaData as any}
          cor="CidadELA"
          corHex={bussola.corHex || '#C9A24A'}
          atmosfera={[]}
          simbolo=""
          simboloIcon=""
          territorios={bussola.distritosAtivos.map(d => d.key)}
          pontoPartida={bussola.distritoDominante?.key || ''}
          hideTechnical
        />
      </section>

      {/* SÍNTESE CURTA + CTA PROTAGONISTA */}
      <section className="px-6 max-w-xl mx-auto text-center space-y-10">
        <div className="space-y-4">
          <p className="text-lg md:text-xl text-white/70 font-serif italic leading-relaxed">
            {sinteseCurta}
          </p>
          <p className="text-white/40 text-sm font-serif">A Floresta aguarda seu primeiro passo.</p>
        </div>
        
        <div className="flex flex-col items-center gap-6">
          <Button
            variant="gold"
            size="xl"
            onClick={() => navigate('/clube/rotas/rota-dos-lobos')}
            className="group px-12 h-16 text-lg shadow-premium-glow rounded-full w-full md:w-auto"
          >
            Entrar na Floresta
            <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>
    </div>
  );
}

