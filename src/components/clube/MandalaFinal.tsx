import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

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
    pos: { top: '10.5%', left: '50%' },
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
    pos: { top: '27.5%', left: '81%' },
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
    pos: { top: '61.5%', left: '81%' },
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
    pos: { top: '78.5%', left: '50%' },
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
    pos: { top: '61.5%', left: '19%' },
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
    pos: { top: '27.5%', left: '19%' },
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

  return (
    <div className="flex flex-col items-center w-full justify-center py-4 relative">
      
      {/* Container da Arte Oficial */}
      <div className="relative w-full aspect-square max-w-[320px] sm:max-w-[500px] md:max-w-[800px] mx-auto group">
        
        {/* Imagem de Fundo (A Mandala Oficial) */}
        <img 
          src="https://lovable-uploads.s3.us-west-2.amazonaws.com/9de110b3-d024-4145-bfef-20701699f967.png" 
          alt="Mandala do Instinto Soterrado" 
          className="w-full h-full object-contain pointer-events-none select-none opacity-100"
          onLoad={() => console.log('Mandala Image Loaded')}
          onError={(e) => console.error('Mandala Image Load Error', e)}
        />

        {/* Hotspots e Efeitos Visuais sobre a Arte */}
        {TERRITORIOS.map((t) => {
          const estado = estados[t.id] || 'Soterrado';
          const style = ESTADOS_STYLE[estado];
          
          return (
            <div 
              key={t.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
              style={{ top: t.pos.top, left: t.pos.left }}
            >
              {/* Hotspot de Interação (Invisível mas clicável) */}
              <button
                onClick={() => setSelectedTerritorio(t)}
                className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full z-50 cursor-pointer focus:outline-none"
                aria-label={t.nome}
              />

              {/* Efeito de Brilho/Pulsar sobre o Território */}
              <motion.div
                animate={style.animation}
                transition={{ duration: style.duration, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-12 h-12 sm:w-20 sm:h-20 md:w-28 md:h-28 rounded-full pointer-events-none z-10"
                style={{ 
                  backgroundColor: style.glow,
                  filter: 'blur(20px)',
                  boxShadow: estado === 'Aceso' ? `0 0 30px ${style.glow}` : 'none'
                }}
              />
              
              {/* Partículas sutis para estado Aceso */}
              {estado === 'Aceso' && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-gold rounded-full"
                      animate={{ 
                        y: [-20, -60],
                        x: [(i - 2) * 10, (i - 2) * 15],
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
              className="absolute z-[100] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-[300px] bg-black/80 backdrop-blur-xl border border-gold/30 p-6 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)]"
            >
              <div className="text-center space-y-4">
                <div className="space-y-1">
                  <h4 className="text-gold font-serif text-2xl uppercase tracking-widest">{selectedTerritorio.nome}</h4>
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
                  className="mt-4 text-[10px] text-gold/40 hover:text-gold uppercase tracking-widest transition-colors"
                >
                  Fechar rastro
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legenda de Estados - Fiel à Referência */}
      <div className="mt-8 md:mt-12 w-full max-w-[600px] px-4 py-3 rounded-full border border-white/5 bg-black/40 backdrop-blur-xl flex flex-wrap justify-center gap-6 md:gap-12">
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
