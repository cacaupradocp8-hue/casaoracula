import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  CheckCircle2, 
  Lock, 
  Clock, 
  ArrowRight, 
  Sparkles,
  Trophy
} from 'lucide-react';

export default function EstradaMonumental() {
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
      <section className="relative h-[60vh] flex flex-col items-center justify-center text-center px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6"
        >
          <span className="text-[10px] uppercase tracking-[0.5em] text-blue-400 font-bold">Iniciada em 12 de Abril</span>
          <h1 className="text-5xl md:text-8xl font-light tracking-tighter text-white/95 font-serif italic leading-none">
            Sua jornada continua
          </h1>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mx-auto mt-8" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-medium">Explore a Estrada</span>
          <motion.div 
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-px h-16 bg-gradient-to-b from-blue-500/40 to-transparent" 
          />
        </motion.div>
      </section>

      {/* Estrada Monumental Container */}
      <section className="relative max-w-5xl mx-auto px-6 pb-60">
        {/* Background Depth Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-blue-900/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px]" />
        </div>

        {/* Foundation Path */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white/[0.03] -translate-x-1/2" />
        
        {/* Animated Road Path */}
        <motion.div 
          style={{ scaleY }}
          className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 via-blue-400 to-transparent -translate-x-1/2 origin-top shadow-[0_0_40px_rgba(59,130,246,0.4)] z-0"
        />

        <div className="relative z-10 space-y-64 md:space-y-80 py-40">
          {nodes.map((node, index) => (
            <NodeItem key={node.id} node={node} index={index} />
          ))}
        </div>

        {/* Lateral Card - Faltam 8 minutos */}
        <div className="fixed right-8 bottom-10 md:top-1/2 md:-translate-y-1/2 z-50 pointer-events-none md:pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[#020617]/90 backdrop-blur-3xl border border-white/10 p-8 rounded-3xl w-72 shadow-[0_30px_60px_rgba(0,0,0,0.6)] space-y-6 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" />
            
            <div className="flex items-center gap-3 text-blue-400">
              <div className="relative">
                <Clock className="w-5 h-5" />
                <motion.div 
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-blue-400/40 blur-sm rounded-full"
                />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Agora no Portal</span>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Tempo restante</p>
              <div className="flex items-baseline gap-1">
                <h3 className="text-5xl font-light tracking-tighter text-white">08</h3>
                <span className="text-xl font-light text-white/30">min</span>
              </div>
            </div>

            <p className="text-xs text-white/50 leading-relaxed font-light italic">
              "A travessia do abismo exige coragem, mas a recompensa é a sua própria luz."
            </p>

            <button className="w-full bg-white text-black text-[11px] font-bold py-4 rounded-xl transition-all duration-500 hover:bg-blue-50 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] uppercase tracking-[0.3em] flex items-center justify-center gap-3 group pointer-events-auto">
              Retomar
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Final da Estrada */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 border-t border-white/5 bg-gradient-to-b from-transparent to-blue-950/20 py-40">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2 }}
          className="text-center space-y-16 max-w-2xl"
        >
          <div className="space-y-6">
            <Trophy className="w-16 h-16 text-blue-500/40 mx-auto mb-12 stroke-1" />
            <h2 className="text-4xl md:text-6xl font-light font-serif italic text-white/90 leading-tight">Seu rastro de luz</h2>
            <p className="text-white/40 text-sm md:text-lg leading-relaxed tracking-wide font-light max-w-lg mx-auto">
              Cada passo dado é uma marca eterna na Casa Orácula. <br className="hidden md:block" />
              Seu progresso acumulado revela a mestre que está despertando.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 md:gap-20">
            <StatItem label="Portais" value="12" />
            <StatItem label="Rituais" value="48" />
            <StatItem label="Nível" value="24" />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-6 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-full transition-all hover:bg-blue-500 shadow-[0_10px_40px_rgba(37,99,235,0.3)]"
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
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex items-center gap-8 md:gap-20 ${isLeft ? 'flex-row' : 'flex-row-reverse'} w-full`}
    >
      {/* Content */}
      <div className={`flex-1 ${isLeft ? 'text-right' : 'text-left'} space-y-6`}>
        <div className="space-y-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-blue-400/80 font-bold">
            {node.type} • {node.time}
          </span>
          <h3 className={`text-2xl md:text-5xl font-light tracking-tighter text-white/95 leading-tight ${node.status === 'proximo' ? 'opacity-30' : ''}`}>
            {node.title}
          </h3>
          <p className="text-xs md:text-base text-white/40 max-w-xs inline-block leading-relaxed font-light">
            {node.description}
          </p>
        </div>
        
        {node.status === 'ativo' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 text-white/80 text-[11px] font-bold uppercase tracking-[0.2em] mt-8"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
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
            w-20 h-20 md:w-32 md:h-32 rounded-full flex items-center justify-center border-2 transition-all duration-700
            ${node.status === 'concluido' ? 'bg-blue-600/10 border-blue-500/50 shadow-[0_0_40px_rgba(59,130,246,0.2)]' : 
              node.status === 'ativo' ? 'bg-[#020617] border-white shadow-[0_0_60px_rgba(255,255,255,0.3)] scale-110' : 
              'bg-black/60 border-white/10 opacity-50'}
          `}
        >
          {node.status === 'concluido' ? (
            <CheckCircle2 className="w-8 h-8 md:w-12 md:h-12 text-blue-400 stroke-[1.5]" />
          ) : node.status === 'ativo' ? (
            <div className="relative flex items-center justify-center">
              <Sparkles className="w-10 h-10 md:w-14 md:h-14 text-white stroke-[1.5] relative z-10" />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-20px] border border-dashed border-white/30 rounded-full"
              />
              <motion.div 
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-[-10px] bg-white/5 rounded-full blur-lg"
              />
            </div>
          ) : (
            <Lock className="w-6 h-6 md:w-10 md:h-10 text-white/20 stroke-1" />
          )}
        </motion.div>
        
        {/* Glow effect for active node */}
        {node.status === 'ativo' && (
          <>
            <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-[60px] animate-pulse -z-10" />
            <div className="absolute inset-[-60px] rounded-full bg-white/5 blur-[30px] -z-20" />
          </>
        )}
      </div>

      {/* Empty space for balance on desktop */}
      <div className="flex-1 hidden md:block" />
    </motion.div>
  );
};

const StatItem = ({ label, value }: { label: string, value: string }) => (
  <div className="space-y-3">
    <div className="text-4xl md:text-7xl font-light text-white font-serif italic tracking-tighter">{value}</div>
    <div className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold">{label}</div>
  </div>
);

export default EstradaMonumental;
