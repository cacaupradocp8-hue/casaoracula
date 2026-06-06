import React from 'react';
import { motion } from 'framer-motion';
import { Compass, RefreshCw, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CamadaCidadela } from '@/components/cartografia-unificada/CamadaCidadela';
import { PortaInicialHero } from '@/components/cartografia/PortaInicialHero';
import type { BussolaData } from '@/hooks/useBussolaOracular';

interface CidadelaRotasViewProps {
  bussola: BussolaData;
}

export function CidadelaRotasView({ bussola }: CidadelaRotasViewProps) {
  const navigate = useNavigate();
  
  // Mapping district raw data to the format CamadaCidadela expects
  // Version for "Rotas da Casa" (Cleaned of technical terms)
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

  return (
    <div className="space-y-16 pb-20">
      {/* 1. HERO NARRATIVO */}
      <header className="text-center space-y-8 pt-8 max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-20 h-20 bg-gold/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/20 shadow-premium-glow"
        >
          <Compass className="w-10 h-10 text-gold/80" />
        </motion.div>
        <div className="space-y-4">
          <h1 className="text-4xl md:text-7xl font-display text-foreground tracking-tight">
            Leitura Estrutural Orácula™ <br/>
            <span className="text-gold italic">CidadELA Interior</span>
          </h1>
          <div className="space-y-6 pt-4">
            <p className="text-lg md:text-2xl text-muted-foreground leading-relaxed italic">
              A CidadELA não define quem você é. Ela mostra onde sua energia está habitando agora.
            </p>
            <p className="text-base text-muted-foreground/60 max-w-lg mx-auto leading-relaxed">
              Este mapa não é diagnóstico. É uma leitura simbólica do momento. Ao observar, escolha o movimento que mais se aproxima do que acontece em você.
            </p>
          </div>
        </div>
      </header>

      {/* 2. MANDALA CENTRAL */}
      <section className="relative py-8">
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

      {/* 3. PORTA INICIAL - TRANSIÇÃO NARRATIVA */}
      <section className="px-4 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-6">
          <p className="text-2xl md:text-3xl font-serif text-white/80 italic leading-relaxed">
            Sua CidadELA revelou onde sua energia está habitando agora. A Casa não vai dizer quem você é. Ela vai mostrar por onde sua travessia pode começar.
          </p>
          <div className="h-px w-24 bg-gold/30 mx-auto" />
          <p className="text-lg text-gold/60 font-serif italic">
            A primeira travessia recomendada para fundadoras é a Rota dos Lobos.
          </p>
        </div>
        
        <PortaInicialHero 
          portaNome={bussola.distritoDominante?.nome} 
          portaSlug="rota-dos-lobos" 
        />
      </section>

      {/* 4. AÇÕES COMPLEMENTARES */}
      <footer className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-12 border-t border-gold/5">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/ferramenta/cartografia-psiquica-oracula')}
          className="text-muted-foreground/60 hover:text-gold gap-2 uppercase tracking-widest text-[10px]"
        >
          <RefreshCw className="w-3 h-3" />
          Refazer Cartografia
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/clube/rotas')}
          className="text-muted-foreground/60 hover:text-gold gap-2 uppercase tracking-widest text-[10px]"
        >
          <Map className="w-3 h-3" />
          Explorar Rotas da Casa
        </Button>
      </footer>
    </div>
  );
}
