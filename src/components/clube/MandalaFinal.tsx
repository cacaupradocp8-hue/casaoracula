import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import mandalaArte from '@/assets/mandala-instinto.png';

export interface Territorio {
  id: string;
  nome: string;
  narrativa: Record<'Aceso' | 'Oscilante' | 'Soterrado' | 'Exausto', string>;
  // Coordenadas em % (top, left) relativas ao container da imagem
  pos: { top: string; left: string };
}

export const TERRITORIOS: Territorio[] = [
  { 
    id: 'intuicao', 
    nome: 'Intuição', 
    pos: { top: '10.5%', left: '50.1%' },
    narrativa: {
      Aceso: "A loba continua a deixar sinais através dos pressentimentos que já não podem ser ignorados.",
      Oscilante: "Há um sussurro que oscila, esperando o silêncio necessário para se tornar clareza.",
      Soterrado: "A voz interna está abafada por camadas de certezas externas que precisam ser removidas.",
      Exausto: "O rastro da intuição está quase invisível sem o peso da exaustão mental."
    }
  },
  { 
    id: 'desejo', 
    nome: 'Desejo', 
    pos: { top: '27.4%', left: '81.2%' },
    narrativa: {
      Aceso: "O fogo sagrado do seu querer queima com nitidez, apontando o rumo da sua satisfação.",
      Oscilante: "Uma chama que vacila entre o que você realmente quer e o que acredita que deve querer.",
      Soterrado: "Seus desejos autênticos foram cobertos por cinzas de obrigações alheias.",
      Exausto: "A força do querer está desbotada, pedindo descanso para que a brasa volte a brilhar."
    }
  },
  { 
    id: 'limites', 
    nome: 'Limites', 
    pos: { top: '61.6%', left: '81.2%' },
    narrativa: {
      Aceso: "Seus contornos estão firmes e protegidos, permitindo que apenas o que é seu ocupe seu espaço.",
      Oscilante: "Suas fronteiras são porosas, por vezes firmes, por vezes cedendo ao peso do mundo.",
      Soterrado: "Seus limites foram soterrados por invasões que você ainda não aprendeu a nomear.",
      Exausto: "O escudo está caído, deixando seu território vulnerável ao que não lhe pertence."
    }
  },
  { 
    id: 'corpo', 
    nome: 'Corpo', 
    pos: { top: '78.5%', left: '50.1%' },
    narrativa: {
      Aceso: "Seu templo físico vibra com presença, sendo o mastro fiel que sustenta sua jornada.",
      Oscilante: "O corpo envia sinais intermitentes de cansaço e força, pedindo uma escuta mais atenta.",
      Soterrado: "A conexão com a matéria está silenciada, tratando o corpo apenas como um transporte.",
      Exausto: "O corpo grita através do silêncio ou da dor, implorando pela sua presença ritualística."
    }
  },
  { 
    id: 'criatividade', 
    nome: 'Criatividade', 
    pos: { top: '61.6%', left: '18.9%' },
    narrativa: {
      Aceso: "O fluxo da criação transborda, transformando o rastro da vida em novas formas e cores.",
      Oscilante: "Ideias surgem mas perdem o fôlego antes de ganharem corpo na realidade.",
      Soterrado: "A semente da criação está enterrada sob o solo árido da utilidade excessiva.",
      Exausto: "A fonte secou temporariamente, pedindo que a loba volte a brincar sem propósito."
    }
  },
  { 
    id: 'vitalidade', 
    nome: 'Vitalidade', 
    pos: { top: '27.4%', left: '18.9%' },
    narrativa: {
      Aceso: "A força vital pulsa com vigor, alimentando cada passo com o entusiasmo da loba.",
      Oscilante: "A energia sobe e desce, num ritmo que ainda não encontrou seu centro de repouso.",
      Soterrado: "O entusiasmo está oculto sob camadas de rotinas que drenam sua força essencial.",
      Exausto: "A energia está no limite, pedindo um recolhimento profundo para não se apagar."
    }
  },
];

interface Props {
  estados: Record<string, 'Aceso' | 'Oscilante' | 'Soterrado' | 'Exausto'>;
}

const ESTADOS_STYLE = {
  Aceso: { 
    dot: 'bg-[#d4af37]',
    glow: 'rgba(212, 175, 55, 0.5)',
    label: 'ACESO',
    animation: {
      opacity: [0.3, 0.6, 0.3],
      scale: [1, 1.1, 1],
    },
    duration: 3
  },
  Oscilante: { 
    dot: 'bg-[#c5a059]',
    glow: 'rgba(197, 160, 89, 0.2)',
    label: 'OSCILANTE',
    animation: {
      opacity: [0.1, 0.3, 0.1],
      scale: [1, 1.05, 1],
    },
    duration: 5
  },
  Soterrado: { 
    dot: 'bg-white/20',
    glow: 'rgba(255, 255, 255, 0.03)',
    label: 'SOTERRADO',
    animation: {
      opacity: [0.05, 0.1, 0.05],
    },
    duration: 8
  },
  Exausto: { 
    dot: 'bg-white/10',
    glow: 'transparent',
    label: 'EXAUSTO',
    animation: {
      opacity: [0.02, 0.05, 0.02],
    },
    duration: 10
  },
};

export function MandalaFinal({ estados }: Props) {
  const [selectedTerritorio, setSelectedTerritorio] = useState<Territorio | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasAceso = Object.values(estados).some(e => e === 'Aceso');

  const spotlightBackground = useMemo(() => {
    const spotlights = TERRITORIOS.map(t => {
      const estado = estados[t.id];
      if (estado === 'Aceso') {
        return `radial-gradient(circle at ${t.pos.left} ${t.pos.top}, rgba(212, 175, 55, 0.4) 0%, transparent 25%)`;
      }
      return null;
    }).filter(Boolean);
    
    return spotlights.length > 0 ? spotlights.join(', ') : 'none';
  }, [estados]);

  return (
    <div className={cn(
      "flex flex-col items-center w-full justify-center py-8 relative min-h-[600px] transition-opacity duration-1000",
      mounted ? "opacity-100" : "opacity-0"
    )}>
      
      {/* Container Principal */}
      <div className="relative w-full max-w-[850px] aspect-square mx-auto bg-[#020202] rounded-full shadow-[0_0_120px_rgba(0,0,0,1)] border border-white/5 overflow-hidden">
        
        {/* 1. Camada de Fundo (Spotlights) */}
        <div 
          className="absolute inset-0 z-0 transition-all duration-1000 opacity-70"
          style={{ background: spotlightBackground }}
        />

        {/* 2. Camada da Imagem Real e Oficial (Centro absoluto) */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <img 
            src={mandalaArte} 
            alt="Mandala do Instinto Soterrado" 
            className={cn(
              "w-full h-full object-contain transition-all duration-1000",
              hasAceso ? "brightness-110 contrast-105" : "brightness-50 contrast-75 grayscale-[0.2]"
            )}
          />
          
          {/* Overlay de Sombra sobre a imagem para destacar os acesos */}
          <div 
            className="absolute inset-0 mix-blend-multiply opacity-60 rounded-full"
            style={{ 
              background: spotlightBackground !== 'none' 
                ? `radial-gradient(circle, transparent 40%, #000 90%), ${spotlightBackground.replace(/0.4/g, '0.0')}`
                : `radial-gradient(circle, transparent 40%, #000 90%)`
            }}
          />
        </div>

        {/* 3. Camada de Elementos Interativos (UI Invisível sobre a Arte) */}
        <div className="absolute inset-0 z-30">
          {TERRITORIOS.map((t) => {
            const estado = estados[t.id] || 'Soterrado';
            const style = ESTADOS_STYLE[estado];
            
            return (
              <div 
                key={t.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-[18%] h-[18%]"
                style={{ top: t.pos.top, left: t.pos.left }}
              >
                {/* Hotspot de Interação (Completamente Invisível) */}
                <button
                  onClick={() => setSelectedTerritorio(t)}
                  className="w-full h-full rounded-full z-50 cursor-pointer focus:outline-none relative group"
                  aria-label={t.nome}
                />

                {/* Aura de Luz Orgânica (Apenas Aceso ou Oscilante) */}
                {(estado === 'Aceso' || estado === 'Oscilante') && (
                  <motion.div
                    animate={style.animation}
                    transition={{ duration: style.duration, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-[-20%] rounded-full pointer-events-none z-10"
                    style={{ 
                      backgroundColor: style.glow,
                      filter: 'blur(35px)',
                    }}
                  />
                )}
                
                {/* Partículas de Ouro (Apenas Aceso) */}
                {estado === 'Aceso' && (
                  <div className="absolute inset-0 pointer-events-none overflow-visible">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute left-1/2 top-1/2 w-0.5 h-0.5 bg-[#d4af37] rounded-full"
                        animate={{ 
                          y: [-10, -40],
                          x: [(i - 3) * 8, (i - 3) * 12],
                          opacity: [0, 0.6, 0],
                          scale: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                          duration: 3 + Math.random(), 
                          repeat: Infinity, 
                          delay: i * 0.4 
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 4. Modal de Narrativa (High-End) */}
        <AnimatePresence>
          {selectedTerritorio && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute z-[100] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-[320px] bg-[#050505]/90 backdrop-blur-3xl border border-gold/30 p-8 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,1)] text-center"
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-gold font-serif text-3xl italic tracking-widest leading-none">
                    {selectedTerritorio.nome}
                  </h4>
                  <div className="flex items-center justify-center gap-2">
                    <div className={cn("w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]", ESTADOS_STYLE[estados[selectedTerritorio.id] || 'Soterrado'].dot.replace('bg-', 'text-'))} />
                    <span className="text-[10px] text-white/40 tracking-[0.3em] font-bold uppercase italic">
                      {estados[selectedTerritorio.id] || 'Soterrado'}
                    </span>
                  </div>
                </div>
                
                <div className="h-[1px] w-12 bg-gold/20 mx-auto" />

                <p className="text-white/80 font-serif italic text-lg leading-relaxed px-2">
                  "{selectedTerritorio.narrativa[estados[selectedTerritorio.id] || 'Soterrado']}"
                </p>

                <button 
                  onClick={() => setSelectedTerritorio(null)}
                  className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-serif italic text-gold/60 transition-all duration-300 rounded-full border border-gold/10 hover:border-gold/30 hover:text-gold"
                >
                  <span className="relative z-10 text-[10px] uppercase tracking-[0.4em]">Fechar rastro</span>
                  <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legenda de Estados (Minimalista) */}
      <div className="mt-12 w-full max-w-[600px] px-8 py-4 rounded-full border border-white/5 bg-black/40 backdrop-blur-xl flex flex-wrap justify-center gap-8 md:gap-12 z-50">
        {Object.entries(ESTADOS_STYLE).map(([nome, config]) => (
          <div key={nome} className="flex items-center gap-3">
            <div className={cn("w-1.5 h-1.5 rounded-full transition-all duration-1000", config.dot)} />
            <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-white/30">
              {config.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
