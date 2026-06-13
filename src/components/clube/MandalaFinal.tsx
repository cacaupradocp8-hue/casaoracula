import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    pos: { top: '13%', left: '50%' },
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
    pos: { top: '28%', left: '78%' },
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
    pos: { top: '64%', left: '78%' },
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
    pos: { top: '79%', left: '50%' },
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
    pos: { top: '64%', left: '22%' },
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
    pos: { top: '28%', left: '22%' },
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
  const [mounted, setMounted] = useState(false);
  const [activeTerritorioId, setActiveTerritorioId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasAceso = Object.values(estados).some(e => e === 'Aceso');
  const activeTerritorio = activeTerritorioId ? TERRITORIOS.find(t => t.id === activeTerritorioId) : null;

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
      "flex flex-col items-center w-full justify-center py-4 relative transition-opacity duration-1000",
      mounted ? "opacity-100" : "opacity-0"
    )}>
      
      {/* Container Principal */}
      <div className="relative w-full max-w-[900px] aspect-[575/525] mx-auto bg-gradient-to-b from-[#1a1208]/60 via-[#2a1a08]/40 to-[#0d0904]/70 shadow-[0_0_120px_hsl(var(--gold)/0.35),0_0_240px_hsl(var(--gold)/0.15)] border border-gold/30 overflow-visible rounded-[2rem]">
        
        {/* 1. Camada de Fundo (Spotlights) */}
        <div 
          className="absolute inset-0 z-0 transition-all duration-1000 opacity-100"
          style={{
            background: spotlightBackground !== 'none'
              ? spotlightBackground
              : 'radial-gradient(circle at 50% 48%, hsl(var(--gold) / 0.32) 0%, transparent 55%)'
          }}
        />

        {/* 2. Camada da Imagem Real e Oficial (Centro absoluto) */}
        <div className="absolute inset-[5%] z-10 flex items-center justify-center pointer-events-none">
          <img 
            src={mandalaArte} 
            alt="Mandala do Instinto Soterrado" 
            className={cn(
              "w-full h-full object-contain transition-all duration-1000",
              hasAceso ? "brightness-[1.35] contrast-[1.15] saturate-[1.4]" : "brightness-[1.2] contrast-[1.08] saturate-[1.2]"
            )}
          />
          
          {/* Vinheta suave para foco, sem escurecer demais */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ 
              background: `radial-gradient(circle, transparent 78%, rgba(0,0,0,0.28) 100%)`
            }}
          />
        </div>

        {/* 3. Camada de Elementos Interativos (UI Invisível sobre a Arte) */}
        <div className="absolute inset-[5%] z-30">
          {TERRITORIOS.map((t) => {
            const estado = estados[t.id] || 'Soterrado';
            const style = ESTADOS_STYLE[estado];
            const isActive = activeTerritorioId === t.id;
            
            return (
              <div 
                key={t.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-[18%] h-[18%]"
                style={{ top: t.pos.top, left: t.pos.left }}
              >
                {/* Marcador discreto e interativo sobre a arte oficial, sem popup bloqueante */}
                <button
                  type="button"
                  onMouseEnter={() => setActiveTerritorioId(t.id)}
                  onFocus={() => setActiveTerritorioId(t.id)}
                  onClick={() => setActiveTerritorioId(prev => prev === t.id ? null : t.id)}
                  onMouseLeave={() => setActiveTerritorioId(prev => prev === t.id ? null : prev)}
                  className={cn(
                    "w-full h-full rounded-full z-50 relative cursor-pointer outline-none transition-all duration-500",
                    "border border-gold/0 hover:border-gold/30 focus-visible:border-gold/60",
                    isActive && "border-gold/45 shadow-[0_0_34px_hsl(var(--gold)/0.22)]"
                  )}
                  aria-label={t.nome}
                  title={t.nome}
                >
                  <span className={cn(
                    "absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/25 transition-all duration-500",
                    (estado === 'Aceso' || isActive) && "h-3 w-3 bg-gold/70 shadow-[0_0_18px_hsl(var(--gold)/0.55)]",
                    estado === 'Exausto' && !isActive && "bg-white/10"
                  )} />
                </button>

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

      {activeTerritorio && (
        <div className="mt-5 min-h-10 text-center z-50">
          <span className="text-gold/80 italic text-lg">{activeTerritorio.nome}</span>
          <span className="mx-3 text-white/15">—</span>
          <span className="text-white/40 text-[10px] uppercase tracking-[0.32em] font-bold">
            {ESTADOS_STYLE[estados[activeTerritorio.id] || 'Soterrado'].label}
          </span>
        </div>
      )}
    </div>
  );
}
