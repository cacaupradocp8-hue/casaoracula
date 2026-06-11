import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import mandalaArte from '@/assets/mandala-instinto-soterrado.png';

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
      Exausto: "O rastro da intuição está quase invisível sob o peso da exaustão mental."
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

  // Calcula se há algum território aceso para efeitos globais
  const hasAceso = Object.values(estados).some(e => e === 'Aceso');

  // Gera o background de "holofotes" para territórios acesos
  const spotlightBackground = useMemo(() => {
    const spotlights = TERRITORIOS.map(t => {
      const estado = estados[t.id];
      if (estado === 'Aceso') {
        return `radial-gradient(circle at ${t.pos.left} ${t.pos.top}, rgba(212, 175, 55, 0.3) 0%, transparent 25%)`;
      }
      return null;
    }).filter(Boolean);
    
    return spotlights.length > 0 ? spotlights.join(', ') : 'none';
  }, [estados]);

  return (
    <div className="flex flex-col items-center w-full justify-center py-4 relative min-h-[500px]">
      
      {/* Container da Arte Oficial */}
      <div className="relative w-full max-w-[800px] aspect-square mx-auto group bg-[#050505] rounded-full shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* Camada de Holofotes Dinâmicos (Atrás da Imagem) */}
        <div 
          className="absolute inset-0 z-0 transition-all duration-1000 opacity-60"
          style={{ background: spotlightBackground }}
        />

        {/* Imagem de Fundo (A Mandala Oficial) */}
        <div className="relative w-full h-full z-10">
          <img 
            src={mandalaArte} 
            alt="Mandala do Instinto Soterrado" 
            width={1024}
            height={1024}
            loading="lazy"
            className={cn(
              "w-full h-full object-contain pointer-events-none select-none transition-all duration-1000",
              hasAceso ? "brightness-105 contrast-105" : "brightness-50 contrast-75 grayscale-[0.3]"
            )}
          />
          
          {/* Overlay Escuro para territórios não acesos (Sobre a imagem) */}
          <div 
            className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-50"
            style={{ 
              background: `radial-gradient(circle, transparent 20%, #000 70%), ${spotlightBackground.replace(/0.3/g, '0.0')}` 
            }}
          />
        </div>

        {/* Hotspots e Efeitos Visuais sobre a Arte */}
        {TERRITORIOS.map((t) => {
          const estado = estados[t.id] || 'Soterrado';
          const style = ESTADOS_STYLE[estado];
          
          return (
            <div 
              key={t.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-[18%] h-[18%]"
              style={{ top: t.pos.top, left: t.pos.left }}
            >
              {/* Hotspot de Interação (Invisível mas clicável) */}
              <button
                onClick={() => setSelectedTerritorio(t)}
                className="w-full h-full rounded-full z-50 cursor-pointer focus:outline-none"
                aria-label={t.nome}
              />

              {/* Efeito de Brilho/Pulsar sobre o Território (Aceso) */}
              {estado === 'Aceso' && (
                <motion.div
                  animate={style.animation}
                  transition={{ duration: style.duration, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute w-[120%] h-[120%] rounded-full pointer-events-none z-20"
                  style={{ 
                    backgroundColor: style.glow,
                    filter: 'blur(30px)',
                    boxShadow: `0 0 50px ${style.glow}`
                  }}
                />
              )}

              {/* Efeito de "Apagado" (Soterrado/Exausto) */}
              {(estado === 'Soterrado' || estado === 'Exausto') && (
                <div 
                  className="absolute w-[110%] h-[110%] rounded-full pointer-events-none z-20 bg-black/40 backdrop-grayscale-[0.5]"
                  style={{ filter: 'blur(15px)' }}
                />
              )}
              
              {/* Partículas sutis para estado Aceso */}
              {estado === 'Aceso' && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-gold rounded-full"
                      animate={{ 
                        y: [-10, -30],
                        x: [(i - 2) * 5, (i - 2) * 8],
                        opacity: [0, 0.8, 0],
                        scale: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        duration: 2 + Math.random(), 
                        repeat: Infinity, 
                        delay: i * 0.5 
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Painel Flutuante Narrativo */}
        <AnimatePresence>
          {selectedTerritorio && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute z-[100] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[320px] bg-[#0A0A0B]/95 backdrop-blur-xl border border-gold/30 p-6 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)]"
            >
              <div className="text-center space-y-4">
                <div className="space-y-1">
                  <h4 className="text-gold font-serif text-2xl uppercase tracking-widest leading-none">{selectedTerritorio.nome}</h4>
                  <div className="flex items-center justify-center gap-2">
                    <div className={cn("w-1.5 h-1.5 rounded-full", ESTADOS_STYLE[estados[selectedTerritorio.id] || 'Soterrado'].dot)} />
                    <span className="text-[10px] text-white/50 tracking-[0.2em] font-bold uppercase">
                      Estado: {estados[selectedTerritorio.id] || 'Soterrado'}
                    </span>
                  </div>
                </div>
                
                <p className="text-white/80 font-serif italic text-sm leading-relaxed">
                  "{selectedTerritorio.narrativa[estados[selectedTerritorio.id] || 'Soterrado']}"
                </p>

                <button 
                  onClick={() => setSelectedTerritorio(null)}
                  className="mt-2 py-2 px-4 text-[10px] text-gold/60 hover:text-gold uppercase tracking-[0.3em] transition-all border border-gold/10 rounded-full hover:bg-gold/5"
                >
                  Fechar rastro
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legenda de Estados - Fiel à Referência */}
      <div className="mt-12 w-full max-w-[600px] px-6 py-4 rounded-full border border-white/5 bg-black/40 backdrop-blur-xl flex flex-wrap justify-center gap-6 md:gap-12">
        {Object.entries(ESTADOS_STYLE).map(([nome, config]) => (
          <div key={nome} className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", config.dot)} />
            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-white/50">
              {config.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
