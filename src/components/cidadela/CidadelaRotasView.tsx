import React from 'react';
import { motion } from 'framer-motion';
import { Compass, RefreshCw, ArrowRight } from 'lucide-react';
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
      <header className="text-center space-y-6 pt-8 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-16 h-16 bg-gold/5 rounded-full flex items-center justify-center mx-auto border border-gold/20 shadow-premium-glow"
        >
          <Compass className="w-8 h-8 text-gold/80" />
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-display text-foreground tracking-tight">
          Sua <span className="text-gold italic">CidadELA</span>
        </h1>
      </header>

      {/* MANDALA */}
      <section className="relative">
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

      {/* SÍNTESE CURTA + CTA */}
      <section className="px-4 max-w-xl mx-auto text-center space-y-8">
        <p className="text-lg md:text-xl text-white/70 font-serif italic leading-relaxed">
          {sinteseCurta}
        </p>
        <div className="flex flex-col items-center gap-4">
          <Button
            variant="gold"
            size="xl"
            onClick={() => navigate('/clube/rotas/rota-dos-lobos')}
            className="group px-12 h-16 text-lg shadow-premium-glow rounded-full"
          >
            Continuar Travessia
            <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/ferramenta/cartografia-psiquica-oracula')}
            className="text-muted-foreground/50 hover:text-gold gap-2 uppercase tracking-widest text-[10px]"
          >
            <RefreshCw className="w-3 h-3" />
            Refazer Cartografia
          </Button>
        </div>
      </section>
    </div>
  );
}
