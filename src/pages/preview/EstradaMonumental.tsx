import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Lock, 
  Clock, 
  ArrowRight, 
  ChevronRight,
  Sparkles,
  Trophy,
  History
} from 'lucide-react';

const EstradaMonumental = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const nodes = [
    {
      id: 1,
      title: "O Chamado do Destino",
      description: "A semente da sua travessia foi plantada.",
      status: "concluido",
      time: "15 min",
      type: "Portal"
    },
    {
      id: 2,
      title: "Deserto do Silêncio",
      description: "Onde as vozes externas se calam para o interno falar.",
      status: "concluido",
      time: "22 min",
      type: "Ritual"
    },
    {
      id: 3,
      title: "A Travessia do Abismo",
      description: "Enfrentando as sombras que guardam seu próximo portal.",
      status: "ativo",
      time: "8 min restantes",
      type: "Desafio"
    },
    {
      id: 4,
      title: "O Vale das Máscaras",
      description: "Despedindo-se de quem você não é mais.",
      status: "proximo",
      time: "12 min",
      type: "Encontro"
    },
    {
      id: 5,
      title: "O Alvorecer da Essência",
      description: "A integração final da jornada atual.",
      status: "proximo",
      time: "30 min",
      type: "Celebração"
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Hero Simples */}
      <section className="relative h-[40vh] flex flex-col items-center justify-center text-center px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-blue-400 font-medium">Progresso de Hoje</span>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white/90 font-serif italic">
            Sua jornada continua
          </h1>
          <div className="h-px w-12 bg-blue-500/30 mx-auto mt-6" />
        </motion.div>
      </section>

      {/* Estrada Monumental Container */}
      <section className="relative max-w-5xl mx-auto px-6 pb-40">
        {/* Background Depth Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white/[0.02] -translate-x-1/2" />
        
        {/* Animated Road Path - More Monumental */}
        <motion.div 
          style={{ scaleY }}
          className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 via-blue-400 to-transparent -translate-x-1/2 origin-top shadow-[0_0_30px_rgba(59,130,246,0.6)] z-0"
        />

        <div className="relative z-10 space-y-48 md:space-y-64 py-20">
          {nodes.map((node, index) => (
            <NodeItem key={node.id} node={node} index={index} />
          ))}
        </div>

        {/* Lateral Card - Faltam 8 minutos */}
        <div className="fixed right-8 bottom-10 md:top-1/2 md:-translate-y-1/2 z-50 pointer-events-none md:pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[#020617]/80 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl w-72 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
            
            <div className="flex items-center gap-3 text-blue-400">
              <div className="relative">
                <Clock className="w-5 h-5" />
                <motion.div 
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-blue-400/30 blur-sm rounded-full"
                />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Agora no Portal</span>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-medium">Tempo restante</p>
              <div className="flex items-baseline gap-1">
                <h3 className="text-4xl font-light tracking-tighter text-white">08</h3>
                <span className="text-xl font-light text-white/40">min</span>
              </div>
            </div>

            <p className="text-xs text-white/40 leading-relaxed font-light italic">
              "A travessia do abismo exige coragem, mas a recompensa é a sua própria luz."
            </p>

            <button className="w-full bg-white text-black text-[10px] font-bold py-4 rounded-xl transition-all duration-500 hover:bg-blue-50 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] uppercase tracking-[0.2em] flex items-center justify-center gap-3 group pointer-events-auto">
              Retomar Travessia
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Final da Estrada */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6 border-t border-white/5 bg-gradient-to-b from-transparent to-blue-950/20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="text-center space-y-12 max-w-2xl"
        >
          <div className="space-y-4">
            <Trophy className="w-12 h-12 text-blue-500/50 mx-auto mb-8 stroke-1" />
            <h2 className="text-3xl md:text-5xl font-light font-serif">Seu rastro de luz</h2>
            <p className="text-white/40 text-sm md:text-base leading-relaxed tracking-wide">
              Cada passo dado é uma marca eterna na Casa Orácula. <br />
              Seu progresso acumulado revela a mestre que está despertando.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 md:gap-16">
            <StatItem label="Portais" value="12" />
            <StatItem label="Rituais" value="48" />
            <StatItem label="Nível" value="24" />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-5 bg-white text-black text-xs font-bold uppercase tracking-[0.3em] rounded-full transition-all hover:bg-blue-50 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            Ver Mapa Completo
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};

const NodeItem = ({ node, index }: { node: any, index: number }) => {
  const isLeft = index % 2 === 0;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex items-center gap-8 md:gap-16 ${isLeft ? 'flex-row' : 'flex-row-reverse'} w-full`}
    >
      {/* Content */}
      <div className={`flex-1 ${isLeft ? 'text-right' : 'text-left'} space-y-4`}>
        <div className="space-y-2">
          <span className="text-[9px] uppercase tracking-[0.3em] text-blue-400/70 font-bold">
            {node.type} • {node.time}
          </span>
          <h3 className={`text-xl md:text-3xl font-light tracking-tight text-white/90 ${node.status === 'proximo' ? 'opacity-40' : ''}`}>
            {node.title}
          </h3>
          <p className="text-xs md:text-sm text-white/40 max-w-xs inline-block">
            {node.description}
          </p>
        </div>
        
        {node.status === 'ativo' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-white/80 text-[10px] font-bold uppercase tracking-widest mt-6"
          >
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            Você está aqui
          </motion.div>
        )}
      </div>

      {/* Node Circle */}
      <div className="relative z-20 flex-shrink-0 group">
        <motion.div 
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`
            w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center border-2 transition-all duration-700
            ${node.status === 'concluido' ? 'bg-blue-600/10 border-blue-500/50 shadow-[0_0_40px_rgba(59,130,246,0.2)]' : 
              node.status === 'ativo' ? 'bg-[#020617] border-white shadow-[0_0_50px_rgba(255,255,255,0.3)] scale-110' : 
              'bg-black/60 border-white/10 opacity-50'}
          `}
        >
          {node.status === 'concluido' ? (
            <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-blue-400 stroke-[1.5]" />
          ) : node.status === 'ativo' ? (
            <div className="relative">
              <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-white stroke-[1.5] relative z-10" />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-10px] border border-dashed border-white/30 rounded-full"
              />
            </div>
          ) : (
            <Lock className="w-6 h-6 md:w-8 md:h-8 text-white/20 stroke-1" />
          )}
        </motion.div>
        
        {/* Glow effect for active node */}
        {node.status === 'ativo' && (
          <>
            <div className="absolute inset-0 rounded-full bg-blue-500/30 blur-[40px] animate-pulse -z-10" />
            <div className="absolute inset-[-40px] rounded-full bg-white/5 blur-[20px] -z-20" />
          </>
        )}
      </div>

      {/* Empty space for balance */}
      <div className="flex-1 hidden md:block" />
    </motion.div>
  );
};

const StatItem = ({ label, value }: { label: string, value: string }) => (
  <div className="space-y-1">
    <div className="text-2xl md:text-4xl font-light text-white font-serif">{value}</div>
    <div className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold">{label}</div>
  </div>
);

export default EstradaMonumental;
