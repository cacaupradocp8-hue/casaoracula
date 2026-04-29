import React from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { 
  ChevronRight, 
  ArrowUpRight, 
  Play, 
  CheckCircle2, 
  Lock, 
  LayoutDashboard, 
  BookOpen, 
  Sparkles, 
  Flower2, 
  Library,
  Trophy,
  Zap,
  Crown,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ClubeHomePremiumPreview() {
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // LUXURY SETTINGS
  const ROAD_COLOR = "#C9A96E"; // Architectural Gold
  const DEEP_NAVY = "#030712";

  // ROAD DATA
  const roadSteps = [
    { 
      id: 1, 
      title: 'O Despertar da Voz Interior', 
      status: 'completed', 
      duration: '45 min', 
      type: 'Portal',
      identity: 'Iniciada'
    },
    { 
      id: 2, 
      title: 'A Bússola da Intuição', 
      status: 'current', 
      duration: '1h 20min', 
      type: 'Imersão', 
      description: 'Onde o silêncio se encontra com a inteligência.',
      microVictory: 'Descobrir seu arquétipo regente',
      nextReward: 'Ritual das Sombras (Desbloqueia em 2 aulas)',
      identity: 'Buscadora'
    },
    { 
      id: 3, 
      title: 'O Labirinto das Sombras', 
      status: 'locked', 
      duration: '50 min', 
      type: 'Enigma' 
    },
    { 
      id: 4, 
      title: 'Integração de Luz', 
      status: 'locked', 
      duration: '1h 10min', 
      type: 'Ritual' 
    },
    { 
      id: 5, 
      title: 'A Grande Obra', 
      status: 'locked', 
      duration: '2h', 
      type: 'Masterclass',
      finalReward: 'Título de Sacerdotisa da Noite'
    },
  ];

  return (
    <div className={`min-h-screen bg-[${DEEP_NAVY}] text-white selection:bg-gold/20 font-sans overflow-x-hidden`} ref={containerRef}>
      {/* MILLIONAIRE BACKGROUND LAYER */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#0A1229_0%,_#030712_70%)]" />
        <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        
        {/* Architectural Subtle Glows */}
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-blue-900/10 blur-[160px]" />
        <div className="absolute bottom-[5%] left-[-15%] w-[50%] h-[50%] rounded-full bg-gold/[0.03] blur-[120px]" />
      </div>

      {/* DISCRETE PROGRESS BAR */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-gold/40 origin-left z-50"
        style={{ scaleX }}
      />

      <main className="relative z-10 px-6 md:px-12 lg:px-24 pt-16 pb-40 max-w-7xl mx-auto">
        
        {/* 1. IDENTITY & GREETING */}
        <section className="mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <span className="h-px w-8 bg-gold/50" />
              <span className="text-[10px] uppercase font-bold tracking-[0.6em] text-gold/80">CASA ORÁCULA • MEMBRO EXCLUSIVO</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-serif tracking-tight">
              A Travessia de <br />
              <span className="italic font-light text-white/90">Claudia</span>
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-2">
              <span className="text-[9px] uppercase font-bold text-white/30 tracking-[0.3em] block">IDENTIDADE</span>
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-gold/60" strokeWidth={1.5} />
                <span className="text-xl font-serif">Buscadora</span>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-[9px] uppercase font-bold text-white/30 tracking-[0.3em] block">PROGRESSO</span>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-serif text-white/90">72%</span>
                <div className="h-1 w-12 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gold/60 w-[72%]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. IRRESISTIBLE CURRENT STEP CARD (Where I stopped) */}
        <section className="mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative overflow-hidden rounded-sm bg-[#ffffff] text-[#030712] p-10 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row justify-between items-center gap-12"
          >
            {/* Ambient Background Detail */}
            <div className="absolute -right-20 -top-20 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-1000">
              <Star className="w-96 h-96 rotate-12" fill="currentColor" />
            </div>

            <div className="relative z-10 space-y-8 max-w-2xl text-center lg:text-left">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-black/40">RETOMAR AGORA</span>
                <h2 className="text-4xl md:text-6xl font-serif leading-[0.9] tracking-tighter">A Bússola da Intuição</h2>
              </div>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-8 py-4 border-y border-black/10">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-black/30 uppercase tracking-widest block">PRÓXIMA MICROVITÓRIA</span>
                  <p className="text-sm font-bold flex items-center gap-2">
                    <Zap className="w-3 h-3 text-blue-600 fill-blue-600" /> Descobrir seu arquétipo
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-black/30 uppercase tracking-widest block">EM SEGUIDA</span>
                  <p className="text-sm font-bold flex items-center gap-2">
                    <Trophy className="w-3 h-3 text-gold" /> Ritual das Sombras
                  </p>
                </div>
              </div>

              <p className="text-base text-black/60 font-light leading-relaxed max-w-lg italic">
                "Onde o silêncio se encontra com a inteligência, a travessia se torna revelação."
              </p>
            </div>

            <div className="relative z-10">
              <Button size="lg" className="h-20 px-16 rounded-sm bg-[#030712] text-white hover:bg-black/90 text-xs font-bold uppercase tracking-[0.4em] group-hover:scale-105 transition-all duration-500 shadow-2xl flex items-center gap-4">
                Entrar na Aula
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </section>

        {/* 3. THE LUXURIOUS ROAD (The core experience) */}
        <section className="mb-40 relative">
          <div className="flex items-center gap-8 mb-24">
            <h2 className="text-4xl font-serif">A Estrada</h2>
            <div className="h-px flex-1 bg-white/[0.08]" />
            <span className="text-[10px] uppercase font-bold tracking-[0.5em] text-white/30">CARTOGRAFIA DA ALMA</span>
          </div>

          <div className="relative max-w-5xl mx-auto px-4 md:px-0">
            {/* The Vertical Path Line - Animated & Glowing */}
            <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[1px] bg-white/[0.05] overflow-hidden">
               <motion.div 
                 style={{ scaleY: scrollYProgress, transformOrigin: 'top' }}
                 className="absolute inset-0 bg-gradient-to-b from-gold via-gold/50 to-transparent shadow-[0_0_20px_rgba(201,169,110,0.5)]"
               />
            </div>

            <div className="space-y-24 md:space-y-32">
              {roadSteps.map((step, i) => (
                <div key={step.id} className={`flex flex-col md:flex-row items-start md:items-center ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} relative`}>
                  
                  {/* LUXURY NODE (Marker) */}
                  <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 z-10 mt-1 md:mt-0">
                    <motion.div 
                      whileHover={{ scale: 1.2 }}
                      className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all duration-1000 shadow-2xl backdrop-blur-md
                        ${step.status === 'completed' ? 'bg-gold/90 border-gold shadow-[0_0_15px_rgba(201,169,110,0.3)]' : 
                          step.status === 'current' ? 'bg-white ring-[12px] ring-white/5 scale-110' : 
                          'bg-[#0a1229] opacity-40'}
                      `}
                    >
                      {step.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-[#030712]" strokeWidth={2.5} />}
                      {step.status === 'current' && <Play className="w-4 h-4 text-[#030712] ml-0.5" fill="currentColor" />}
                      {step.status === 'locked' && <Lock className="w-3 h-3 text-white/20" />}
                    </motion.div>
                  </div>

                  {/* STEP CONTENT PANEL */}
                  <motion.div 
                    initial={{ opacity: 0, x: i % 2 === 0 ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className={`ml-16 md:ml-0 md:w-[42%] group relative`}
                  >
                    <div className={`p-8 md:p-12 rounded-sm border transition-all duration-1000 
                      ${step.status === 'current' ? 'bg-white/[0.04] border-gold/40 shadow-[0_30px_60px_rgba(0,0,0,0.4)]' : 
                        'bg-transparent border-white/[0.03] opacity-50 group-hover:opacity-80 group-hover:border-white/10'}
                    `}>
                      <div className="flex justify-between items-start mb-6">
                        <span className={`text-[10px] font-bold uppercase tracking-[0.3em] ${step.status === 'current' ? 'text-gold' : 'text-white/30'}`}>
                          {step.type} • {step.duration}
                        </span>
                        {step.status === 'completed' && <span className="text-[10px] text-gold/60 font-bold tracking-widest uppercase">Integrado</span>}
                      </div>

                      <h3 className={`text-2xl md:text-3xl font-serif mb-6 leading-tight ${step.status === 'locked' ? 'text-white/20' : 'text-white/90'}`}>
                        {step.title}
                      </h3>

                      {step.description && (
                        <p className="text-sm text-white/40 leading-relaxed font-light mb-8 italic">"{step.description}"</p>
                      )}

                      {/* Micro-Victory & Reward Integration */}
                      {step.status === 'current' && (
                        <div className="space-y-6 pt-6 border-t border-white/[0.05]">
                          <div className="flex items-center gap-4">
                            <Zap className="w-4 h-4 text-gold/50" />
                            <div className="flex flex-col">
                              <span className="text-[8px] uppercase font-bold text-white/20 tracking-widest">MICROVITÓRIA</span>
                              <span className="text-xs font-medium text-white/70">{step.microVictory}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Trophy className="w-4 h-4 text-blue-400/50" />
                            <div className="flex flex-col">
                              <span className="text-[8px] uppercase font-bold text-white/20 tracking-widest">PRÓXIMA RECOMPENSA</span>
                              <span className="text-xs font-medium text-white/70">{step.nextReward}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {step.finalReward && (
                        <div className="mt-8 flex items-center gap-4 bg-gold/[0.03] border border-gold/10 p-4 rounded-sm">
                           <Crown className="w-5 h-5 text-gold/40" />
                           <span className="text-[10px] font-bold uppercase tracking-widest text-gold/60">{step.finalReward}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. REFINED ACCUMULATED PROGRESS */}
        <section className="mb-40 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Maturidade Psíquica', value: '72%', sub: 'Evolução acumulada', icon: Star },
            { label: 'Rituais Ativos', value: '12', sub: 'Práticas integradas', icon: Sparkles },
            { label: 'Identidade Atual', value: 'Buscadora', sub: 'Nível de iniciação', icon: Crown },
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white/[0.02] border border-white/[0.05] p-10 rounded-sm space-y-6 group transition-all duration-700 hover:bg-white/[0.04] hover:border-gold/20"
            >
              <item.icon className="w-6 h-6 text-gold/30 group-hover:text-gold/60 transition-colors duration-700" strokeWidth={1} />
              <div className="space-y-1">
                <span className="text-4xl font-serif text-white/90">{item.value}</span>
                <div className="flex flex-col">
                   <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40">{item.label}</span>
                   <span className="text-[9px] font-light text-white/20 italic">{item.sub}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* 5. LIBRARY / LIVING COLLECTION */}
        <section className="mb-20">
          <div className="flex justify-between items-end mb-16 px-2">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-white/20 block">ACERVO ORÁCULO</span>
              <h2 className="text-4xl font-serif italic">Biblioteca Viva</h2>
            </div>
            <Button variant="link" className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] hover:text-white transition-all">Ver Acervo Completo</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Mulheres que Correm com Lobos', category: 'Clássico', icon: BookOpen },
              { title: 'Ritual de Proteção Diária', category: 'Prática', icon: Sparkles },
              { title: 'O Labirinto do Self', category: 'Estudo', icon: Library }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white/[0.02] border border-white/[0.05] rounded-sm p-10 flex flex-col justify-between aspect-[4/5] group cursor-pointer hover:border-gold/20 transition-all duration-1000 relative overflow-hidden"
              >
                <div className="absolute -right-8 -top-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-1000">
                  <item.icon className="w-48 h-48" strokeWidth={0.5} />
                </div>
                
                <item.icon className="w-12 h-12 text-white/10 group-hover:text-gold/40 transition-all duration-700" strokeWidth={1} />
                
                <div className="space-y-4 relative z-10">
                  <span className="text-[9px] uppercase font-bold text-gold/40 tracking-[0.4em]">{item.category}</span>
                  <h4 className="text-2xl font-serif text-white/70 group-hover:text-white transition-colors duration-700 leading-tight">{item.title}</h4>
                  <div className="h-px w-0 group-hover:w-12 bg-gold/40 transition-all duration-1000" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 6. CINEMATIC FOOTER */}
        <section className="py-40 text-center border-t border-white/[0.03]">
           <div className="max-w-3xl mx-auto space-y-16">
              <Star className="w-12 h-12 mx-auto text-gold/10" strokeWidth={0.5} />
              <p className="text-3xl md:text-5xl font-serif italic text-white/20 leading-[1.3] tracking-tight">
                "A inteligência é o <br /> esplendor da verdade <br /> no silêncio da alma."
              </p>
              <div className="space-y-4 pt-12">
                <span className="text-[10px] uppercase font-bold tracking-[1em] text-white/10 block">CASA ORÁCULA</span>
                <span className="text-[8px] uppercase font-bold tracking-[0.4em] text-gold/20 block italic">Estabelecida na Profundidade</span>
              </div>
           </div>
        </section>
      </main>

      {/* 7. MILLIONAIRE MOBILE NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 md:pb-12 pointer-events-none">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="max-w-md mx-auto bg-[#030712]/60 backdrop-blur-3xl border border-white/5 rounded-full px-10 py-6 flex justify-between items-center pointer-events-auto shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
        >
          {[
            { icon: LayoutDashboard, active: true },
            { icon: BookOpen },
            { icon: Sparkles },
            { icon: Flower2 },
            { icon: Library },
          ].map((item, i) => (
            <button key={i} className={`relative group transition-transform active:scale-90`}>
              <item.icon className={`w-6 h-6 transition-all duration-700 ${item.active ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'text-white/20 group-hover:text-white/60'}`} strokeWidth={1} />
              {item.active && (
                <motion.div 
                  layoutId="activeNavPoint"
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-gold rounded-full shadow-[0_0_15px_gold]" 
                />
              )}
            </button>
          ))}
        </motion.div>
      </nav>
    </div>
  );
}
