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
      <header className="text-center space-y-4 pt-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-16 h-16 bg-gold/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/20 shadow-premium-glow"
        >
          <Compass className="w-8 h-8 text-gold/80" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-display text-foreground tracking-tight">Sua CidadELA</h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto italic">
          O mapa do modo como você habita a Casa Orácula agora.
        </p>
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

      {/* 3. PORTA INICIAL */}
      <section className="px-4">
        <PortaInicialHero 
          portaNome={bussola.distritoDominante?.nome} 
          portaSlug={bussola.acaoPrincipal.rota?.split('/').pop()} 
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
