import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
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
  Star,
  Quote
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// DESIGN SYSTEM: CASA ORÁCULA - MILLIONAIRE APP EDITION
// Color Palette: Pure Deep Navy (#010816), Architectural Gold (#C9A96E), Slate-200
// Typography: Editorial Serif + Minimalist Sans

export default function ClubeHomePremiumPreview() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const roadProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // ROAD DATA
  const roadSteps = [
    { id: 1, title: 'O Despertar da Voz Interior', status: 'completed', duration: '45 min', type: 'Portal', microVictory: 'Voz desbloqueada' },
    { id: 2, title: 'A Bússola da Intuição', status: 'current', duration: '1h 20min', type: 'Imersão', description: 'Navegando entre as águas da intuição feminina consciente.', microVictory: 'Arquétipo descoberto' },
    { id: 3, title: 'O Labirinto das Sombras', status: 'locked', duration: '50 min', type: 'Enigma' },
    { id: 4, title: 'Integração de Luz', status: 'locked', duration: '1h 10min', type: 'Ritual' },
    { id: 5, title: 'A Grande Obra', status: 'locked', duration: '2h', type: 'Masterclass' },
  ];

  return (
    <div className="min-h-screen bg-[#010816] text-white selection:bg-gold/20 font-sans overflow-x-hidden" ref={containerRef}>
      
      {/* PURE NAVY ATMOSPHERE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020D24] via-[#010816] to-[#010610]" />
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-soft-light" />
        
        {/* Discrete Deep Blue Glows (No Purple) */}
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/5 blur-[160px]" />
        <div className="absolute bottom-[10%] left-[-15%] w-[50%] h-[50%] rounded-full bg-gold/[0.02] blur-[120px]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-16 pb-40">
        
        {/* 1. REFINED GREETING & IDENTITY */}
        <section className="mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-4">
              <div className="h-px w-8 bg-gold" />
              <span className="text-[10px] uppercase font-bold tracking-[0.5em] text-gold">
                CASA ORÁCULA • MEMBRO EXCLUSIVO
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif leading-tight tracking-tight">
              Bem-vinda, <br />
              <span className="italic font-light text-slate-200">Claudia.</span>
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.2 }}
            className="grid grid-cols-2 gap-12"
          >
            <div className="space-y-2">
              <span className="text-[9px] uppercase font-bold text-white/30 tracking-widest block">IDENTIDADE</span>
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-gold/60" strokeWidth={1.5} />
                <span className="text-lg font-serif">Buscadora</span>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-[9px] uppercase font-bold text-white/30 tracking-widest block">PROGRESSO VITAL</span>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-serif text-white/90">72%</span>
                <div className="h-1 w-12 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gold/60 w-[72%]" />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 2. IRRESISTIBLE NEXT STEP (Where I stopped) */}
        <section className="mb-32">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative overflow-hidden rounded-sm bg-white text-[#010816] p-10 md:p-14 shadow-2xl flex flex-col lg:flex-row justify-between items-center gap-10"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-1000">
              <Star className="w-64 h-64 rotate-12" fill="currentColor" />
            </div>

            <div className="relative z-10 space-y-6 max-w-xl text-center lg:text-left">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-black/40">RETOMAR AGORA</span>
                <h2 className="text-4xl md:text-5xl font-serif leading-tight">A Bússola da Intuição</h2>
              </div>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-8 py-4 border-y border-black/5">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-blue-600" fill="currentColor" />
                  <div className="flex flex-col">
                    <span className="text-[8px] font-bold text-black/30 uppercase tracking-widest">MICROVITÓRIA</span>
                    <span className="text-xs font-bold italic">Arquétipo regente</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Trophy className="w-4 h-4 text-gold" />
                  <div className="flex flex-col">
                    <span className="text-[8px] font-bold text-black/30 uppercase tracking-widest">EM SEGUIDA</span>
                    <span className="text-xs font-bold italic">Ritual das Sombras</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <Button size="lg" className="h-16 px-12 rounded-sm bg-[#010816] text-white hover:bg-black/90 text-[10px] font-bold uppercase tracking-[0.3em] group-hover:scale-105 transition-all shadow-xl">
                Entrar na Aula
                <ArrowUpRight className="ml-3 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </section>

        {/* 3. THE LUXURIOUS ROAD (Foundation) */}
        <section className="mb-40 relative">
          <div className="flex items-center gap-8 mb-20">
            <h2 className="text-3xl font-serif">Sua Estrada</h2>
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-white/20">CARTOGRAFIA DA ALMA</span>
          </div>

          <div className="relative">
            {/* The Path Line - Pure Gold & Visible */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-white/[0.05] overflow-hidden">
               <motion.div 
                 style={{ scaleY: roadProgress, transformOrigin: 'top' }}
                 className="absolute inset-0 bg-gold shadow-[0_0_10px_gold]"
               />
            </div>

            <div className="space-y-16">
              {roadSteps.map((step, i) => (
                <div key={step.id} className={`flex items-start md:items-center ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} relative`}>
                  
                  {/* Elegant Node */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10 mt-1 md:mt-0">
                    <div className={`w-8 h-8 rounded-full border-4 border-[#010816] flex items-center justify-center transition-all duration-700 shadow-xl
                      ${step.status === 'completed' ? 'bg-gold' : 
                        step.status === 'current' ? 'bg-white ring-8 ring-white/5 scale-110' : 
                        'bg-[#1A1D2D]'}`}
                    >
                      {step.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-[#010816]" strokeWidth={3} />}
                      {step.status === 'current' && <Play className="w-3 h-3 text-[#010816] ml-0.5" fill="currentColor" />}
                      {step.status === 'locked' && <Lock className="w-3 h-3 text-white/20" />}
                    </div>
                  </div>

                  {/* Step Card - High Contrast & Clean */}
                  <motion.div 
                    whileHover={{ scale: 1.01, y: -2 }}
                    className={`ml-20 md:ml-0 md:w-[45%] bg-white/[0.02] border border-white/5 rounded-sm p-8 md:p-10 transition-all hover:bg-white/[0.04] hover:border-gold/20 shadow-lg
                      ${step.status === 'current' ? 'border-gold/30 bg-white/[0.03]' : 'opacity-50'}
                    `}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${step.status === 'current' ? 'text-gold' : 'text-white/40'}`}>
                        {step.type} • {step.duration}
                      </span>
                      {step.status === 'completed' && <span className="text-[10px] text-gold/60 font-bold uppercase tracking-widest">Integrado</span>}
                    </div>
                    <h3 className={`text-xl md:text-2xl font-serif mb-4 ${step.status === 'locked' ? 'text-white/20' : 'text-white'}`}>
                      {step.title}
                    </h3>
                    {step.description && (
                      <p className="text-sm text-white/40 leading-relaxed font-light mb-6 italic">"{step.description}"</p>
                    )}
                    {step.status === 'current' && (
                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <Zap className="w-4 h-4 text-gold/40" />
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{step.microVictory}</span>
                         </div>
                         <Button variant="link" className="p-0 h-auto text-gold text-[10px] font-bold uppercase tracking-[0.2em] hover:text-gold/80 flex items-center gap-2">
                           RECOMEÇAR <ArrowUpRight className="w-3 h-3" />
                         </Button>
                      </div>
                    )}
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. LIBRARY - EDITORIAL GRID (Reasonable Scaling) */}
        <section className="mb-32">
          <div className="flex justify-between items-end mb-16">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-white/20 block">ACERVO ORÁCULO</span>
              <h2 className="text-3xl md:text-4xl font-serif italic">Biblioteca Viva</h2>
            </div>
            <Button variant="ghost" className="text-white/40 text-[10px] font-bold uppercase tracking-widest hover:text-white border border-white/5 px-6">Ver Tudo</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Mulheres que Correm com Lobos', category: 'Clássico', icon: BookOpen },
              { title: 'Ritual de Proteção Diária', category: 'Prática', icon: Sparkles },
              { title: 'O Labirinto do Self', category: 'Estudo', icon: Library }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -8 }}
                className="bg-white/[0.02] border border-white/5 rounded-sm p-10 flex flex-col justify-between aspect-[4/5] group cursor-pointer hover:border-gold/30 transition-all duration-700"
              >
                <item.icon className="w-10 h-10 text-white/10 group-hover:text-gold/40 transition-colors duration-700" strokeWidth={1} />
                <div className="space-y-4">
                  <span className="text-[9px] uppercase font-bold text-gold/40 tracking-[0.4em]">{item.category}</span>
                  <h4 className="text-2xl font-serif text-white/80 group-hover:text-white transition-colors">{item.title}</h4>
                  <div className="h-px w-0 group-hover:w-12 bg-gold/40 transition-all duration-700" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 5. CINEMATIC OUTRO */}
        <section className="py-40 text-center border-t border-white/5">
           <Quote className="w-10 h-10 mx-auto mb-10 text-gold/20" strokeWidth={1} />
           <p className="text-2xl md:text-4xl font-serif italic text-white/30 leading-relaxed max-w-2xl mx-auto">
             "A beleza é o esplendor da verdade no silêncio da alma."
           </p>
           <div className="mt-16 space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-[1em] text-white/10 block">CASA ORÁCULA</span>
              <p className="text-[8px] uppercase font-bold tracking-[0.4em] text-gold/40 italic">Para as raras e profundas</p>
           </div>
        </section>
      </main>

      {/* 6. MOBILE NAVIGATION - CLEAN & FUNCTIONAL */}
      <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-[#010816]/60 backdrop-blur-3xl border border-white/5 rounded-full px-10 py-5 flex items-center gap-10 md:gap-14 shadow-2xl">
          {[
            { icon: LayoutDashboard, active: true },
            { icon: BookOpen },
            { icon: Sparkles },
            { icon: Flower2 },
            { icon: Library },
          ].map((item, i) => (
            <button key={i} className="relative group p-2 transition-transform active:scale-90">
              <item.icon className={`w-6 h-6 transition-all duration-500 ${item.active ? 'text-white shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'text-white/20 group-hover:text-white/60'}`} strokeWidth={1.2} />
              {item.active && (
                <motion.div 
                  layoutId="activeNavPoint"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-gold rounded-full shadow-[0_0_15px_gold]" 
                />
              )}
            </button>
          ))}
        </div>
      </nav>
      
      {/* GLOBAL OVERLAYS */}
      <div className="fixed inset-0 pointer-events-none z-20">
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#010816] to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-[#010816] to-transparent" />
      </div>
    </div>
  );
}
