import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import mandalaArte from '@/assets/mandala-instinto-soterrado.png';

export interface Territorio {
  id: string;
  nome: string;
  icon: string;
  narrativa: Record<'Aceso' | 'Oscilante' | 'Soterrado' | 'Exausto', string>;
  // Coordenadas em % (top, left) relativas ao container da imagem
  pos: { top: string; left: string };
}

export const TERRITORIOS: Territorio[] = [
  { 
    id: 'intuicao', 
    nome: 'Intuição', 
    icon: '🌙',
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
    icon: '🔥',
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
    icon: '🛡️',
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
    icon: '🤍',
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
    icon: '🌿',
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
    icon: '🐾',
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
    glow: 'rgba(212, 175, 55, 0.6)',
    label: 'ACESO',
    animation: {
      opacity: [0.4, 0.8, 0.4],
      scale: [1, 1.15, 1],
    },
    duration: 3
  },
  Oscilante: { 
    dot: 'bg-[#c5a059]',
    glow: 'rgba(197, 160, 89, 0.3)',
    label: 'OSCILANTE',
    animation: {
      opacity: [0.2, 0.5, 0.2],
      scale: [1, 1.05, 1],
    },
    duration: 5
  },
  Soterrado: { 
    dot: 'bg-white/30',
    glow: 'rgba(255, 255, 255, 0.05)',
    label: 'SOTERRADO',
    animation: {
      opacity: [0.1, 0.2, 0.1],
    },
    duration: 8
  },
  Exausto: { 
    dot: 'bg-white/10',
    glow: 'transparent',
    label: 'EXAUSTO',
    animation: {
      opacity: [0.05, 0.1, 0.05],
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
        
        {/* Camada de Holofotes (Atrás) */}
        <div 
          className="absolute inset-0 z-0 transition-all duration-1000 opacity-70"
          style={{ background: spotlightBackground }}
        />

        {/* Camada da Imagem Real e Oficial (Centro absoluto) */}
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

        {/* Camada de Elementos Interativos (Sincronizados com a Arte) */}
        <div className="absolute inset-0 z-30">
          {/* O Centro Dinâmico (Loba) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-40">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-gold/40 flex items-center justify-center bg-black/60 backdrop-blur-md shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              <span className="text-4xl md:text-5xl">🐺</span>
            </div>
            <h4 className="mt-2 text-[10px] md:text-xs text-gold/80 font-serif uppercase tracking-[0.4em] font-bold">A Loba</h4>
          </div>

          {/* Mapeamento dos Territórios */}
          {TERRITORIOS.map((t) => {
            const estado = estados[t.id] || 'Soterrado';
            const style = ESTADOS_STYLE[estado];
            
            return (
              <div 
                key={t.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-[20%] h-[20%]"
                style={{ top: t.pos.top, left: t.pos.left }}
              >
                {/* Hotspot de Interação */}
                <div className="relative flex flex-col items-center">
                  <button
                    onClick={() => setSelectedTerritorio(t)}
                    className="w-14 h-14 md:w-18 md:h-18 rounded-full z-50 cursor-pointer focus:outline-none relative group"
                    aria-label={t.nome}
                  >
                    {/* Círculo de Estado (Sutil para não cobrir a arte) */}
                    <div className={cn(
                      "absolute inset-0 rounded-full border-2 transition-all duration-500 flex items-center justify-center bg-black/20 backdrop-blur-[2px]",
                      estado === 'Aceso' ? "border-[#d4af37] shadow-[0_0_25px_#d4af37]" : 
                      estado === 'Oscilante' ? "border-[#c5a059] opacity-70" : 
                      "border-white/10 opacity-30 grayscale"
                    )}>
                      <span className="text-xl md:text-2xl transition-transform duration-300 group-hover:scale-110">
                        {t.icon}
                      </span>
                    </div>
                  </button>

                  {/* Legenda Flutuante */}
                  <div className="mt-2 text-center pointer-events-none z-30">
                    <h4 className={cn(
                      "text-[9px] md:text-[11px] font-serif uppercase tracking-[0.15em] transition-colors duration-500",
                      estado === 'Aceso' ? "text-[#d4af37] font-bold" : "text-white/40"
                    )}>
                      {t.nome}
                    </h4>
                    <div className="flex items-center justify-center gap-1">
                      <div className={cn("w-1 h-1 rounded-full", style.dot)} />
                      <span className="text-[7px] md:text-[8px] text-white/30 uppercase tracking-widest font-medium italic">
                        {estado}
                      </span>
                    </div>
                  </div>

                  {/* Aura de Luz (Apenas Aceso) */}
                  {estado === 'Aceso' && (
                    <motion.div
                      animate={style.animation}
                      transition={{ duration: style.duration, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-3 w-20 h-20 md:w-24 md:h-24 rounded-full pointer-events-none z-10"
                      style={{ 
                        backgroundColor: style.glow,
                        filter: 'blur(35px)',
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Narrativa */}
        <AnimatePresence>
          {selectedTerritorio && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute z-[100] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-[300px] bg-[#050505]/95 backdrop-blur-2xl border border-gold/40 p-5 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,1)]"
            >
              <div className="text-center space-y-4">
                <div className="space-y-1">
                  <h4 className="text-gold font-serif text-xl uppercase tracking-widest leading-none">
                    {selectedTerritorio.nome}
                  </h4>
                  <p className="text-[10px] text-white/50 tracking-[0.2em] font-bold uppercase">
                    Estado: {estados[selectedTerritorio.id] || 'Soterrado'}
                  </p>
                </div>
                
                <p className="text-white/90 font-serif italic text-sm leading-relaxed border-t border-white/5 pt-4">
                  "{selectedTerritorio.narrativa[estados[selectedTerritorio.id] || 'Soterrado']}"
                </p>

                <button 
                  onClick={() => setSelectedTerritorio(null)}
                  className="mt-4 py-2 px-6 text-[9px] text-gold/70 hover:text-gold uppercase tracking-[0.3em] transition-all border border-gold/20 rounded-full hover:bg-gold/5"
                >
                  Fechar rastro
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legenda de Referência */}
      <div className="mt-10 w-full max-w-[550px] px-6 py-3 rounded-full border border-white/5 bg-black/60 backdrop-blur-xl flex flex-wrap justify-center gap-5 md:gap-10 z-50">
        {Object.entries(ESTADOS_STYLE).map(([nome, config]) => (
          <div key={nome} className="flex items-center gap-2">
            <div className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
            <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-bold text-white/40">
              {config.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
