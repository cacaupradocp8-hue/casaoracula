import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ArrowUpRight, 
  Play, 
  Sparkles, 
  Crown,
  BookOpen,
  Flower2,
  Library,
  Quote,
  Zap,
  Star
} from 'lucide-react';

// DESIGN SYSTEM: CASA ORÁCULA - PRIVATE PORTAL EDITION
// Color Palette: Deepest Navy (#010309), Architectural Gold (#C9A96E), Ethereal Blue (#1A2A47)
// Typography: Editorial Serif (Playfair Display/Cormorant) + Minimalist Sans

export default function ClubeHomePremiumPreview() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div 
      className="min-h-screen bg-[#010309] text-white selection:bg-gold/20 font-sans overflow-x-hidden" 
      ref={containerRef}
    >
      {/* CINEMATIC ATMOSPHERE - NO CARDS, JUST LIGHT AND DEPTH */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#0A1229_0%,_#010309_70%)]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        
        {/* Subtle Light Leaks */}
        <div className="absolute top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-900/10 blur-[150px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-gold/[0.03] blur-[120px]" />
      </div>

      <main className="relative z-10">
        
        {/* 1. DRAMATIC ENTRANCE - THE "MUSEUM" HERO */}
        <section className="h-screen flex flex-col justify-center px-6 md:px-24 lg:px-32 relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.5 }}
            className="max-w-6xl"
          >
            <div className="space-y-6 mb-16">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 1.5 }}
                className="flex items-center gap-4"
              >
                <div className="h-px w-12 bg-gold/50" />
                <span className="text-[10px] uppercase font-bold tracking-[0.8em] text-gold/80">
                  PORTAL PRIVADO • CASA ORÁCULA
                </span>
              </motion.div>
              
              <h1 className="text-7xl md:text-[10rem] font-serif leading-[0.85] tracking-tighter">
                <motion.span 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                  className="block"
                >
                  A Jornada de
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 0.8, y: 0 }}
                  transition={{ delay: 0.4, duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                  className="block italic font-light ml-[0.1em] text-white/60"
                >
                  Claudia.
                </motion.span>
              </h1>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 2 }}
              className="max-w-md space-y-12"
            >
              <p className="text-lg text-white/30 leading-relaxed font-light tracking-wide italic border-l border-white/10 pl-8">
                "Onde a inteligência feminina encontra o seu lugar de poder e silêncio. Sua travessia recomeça aqui."
              </p>
              
              <div className="flex items-center gap-16">
                 <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-bold block">STATUS</span>
                    <span className="text-xl font-serif text-white/70">Buscadora Nível II</span>
                 </div>
                 <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-bold block">PROGRESSO</span>
                    <span className="text-xl font-serif text-white/70">72% Ativa</span>
                 </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Elegant Scroll Signifier */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-8 opacity-20">
            <div className="h-24 w-px bg-gradient-to-b from-transparent via-gold to-transparent" />
            <span className="text-[8px] uppercase tracking-[1em] font-bold vertical-text scale-y-[-1]">Entrar</span>
          </div>
        </section>

        {/* 2. DOMINANT CENTRAL JOURNEY - THE "ESTRADA" AS ART */}
        <section className="relative py-64 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto relative">
            
            <div className="mb-48 space-y-4">
               <span className="text-[10px] uppercase tracking-[0.6em] text-gold/40 font-bold">MANIFESTO</span>
               <h2 className="text-6xl md:text-8xl font-serif leading-[1.1] text-white/90">
                 A Estrada é uma <br />
                 <span className="italic font-light opacity-60">composição de alma.</span>
               </h2>
            </div>

            {/* THE PATH - ABSTRACT & MONUMENTAL */}
            <div className="relative">
              <div className="absolute left-[5%] md:left-1/2 top-0 bottom-0 w-px bg-white/[0.03]">
                <motion.div 
                  style={{ scaleY: smoothProgress, transformOrigin: "top" }}
                  className="absolute inset-0 bg-gradient-to-b from-gold via-gold/40 to-transparent shadow-[0_0_20px_rgba(201,169,110,0.3)]" 
                />
              </div>

              <div className="space-y-[60vh] relative z-10">
                {[
                  { id: 1, type: 'CAPÍTULO I', title: 'O Despertar da Voz', status: 'completed', align: 'right', desc: 'A primeira revelação do silêncio interior.' },
                  { id: 2, type: 'CAPÍTULO II', title: 'A Bússola da Intuição', status: 'current', align: 'left', active: true, desc: 'Navegando entre as sombras e as luzes do inconsciente.' },
                  { id: 3, type: 'CAPÍTULO III', title: 'O Labirinto do Self', status: 'locked', align: 'right', desc: 'Onde o ego se dissolve para a essência emergir.' },
                  { id: 4, type: 'CAPÍTULO IV', title: 'A Grande Integração', status: 'locked', align: 'left', desc: 'A união final das polaridades em um único ser.' },
                ].map((step, i) => (
                  <div key={step.id} className={`flex w-full items-start ${step.align === 'right' ? 'justify-end' : 'justify-start'}`}>
                    <motion.div 
                      initial={{ opacity: 0, y: 60 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-10%" }}
                      transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                      className={`w-full md:w-[45%] flex flex-col ${step.align === 'right' ? 'items-start pl-12 md:pl-0' : 'items-end pr-12 md:pr-0'}`}
                    >
                      <div className={`space-y-8 ${step.align === 'right' ? 'text-left' : 'text-right'}`}>
                        <div className="space-y-4">
                          <span className={`text-[10px] font-bold tracking-[0.5em] uppercase transition-colors duration-1000 ${step.status === 'current' ? 'text-gold' : 'text-white/20'}`}>
                            {step.type}
                          </span>
                          <h3 className={`text-5xl md:text-7xl font-serif tracking-tight leading-[1] ${step.status === 'locked' ? 'text-white/10' : 'text-white'}`}>
                            {step.title}
                          </h3>
                        </div>
                        
                        <p className={`text-base font-light leading-relaxed max-w-sm ${step.status === 'locked' ? 'text-white/5' : 'text-white/30'} ${step.align === 'right' ? '' : 'ml-auto'}`}>
                          {step.desc}
                        </p>
                        
                        {step.status === 'current' && (
                          <motion.button 
                            whileHover={{ x: step.align === 'right' ? 10 : -10 }}
                            className="text-gold font-bold tracking-[0.4em] text-[10px] uppercase flex items-center gap-6 group"
                          >
                            <span className="h-px w-12 bg-gold/30 group-hover:w-20 transition-all duration-700" />
                            RECOMEÇAR AGORA
                          </motion.button>
                        )}
                      </div>
                    </motion.div>

                    {/* Minimalist Marker Point */}
                    <div className="absolute left-[5%] md:left-1/2 -translate-x-1/2 mt-4">
                      <div className={`
                        relative transition-all duration-1000
                        ${step.status === 'current' ? 
                          'w-10 h-10 border border-gold/40 flex items-center justify-center rotate-45 backdrop-blur-sm' : 
                          'w-2 h-2 bg-white/10'}
                      `}>
                        {step.status === 'current' && (
                          <div className="w-2 h-2 bg-gold shadow-[0_0_15px_gold]" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. IRRESISTIBLE NEXT STEP - OVERLAY EXPERIENCE */}
        <section className="py-64 px-6 border-t border-white/[0.02] bg-[#000208]">
           <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-32">
              <div className="lg:w-1/2 space-y-24">
                 <div className="space-y-6">
                    <span className="text-[10px] uppercase tracking-[0.8em] text-white/20 font-bold">PRÓXIMA REVELAÇÃO</span>
                    <h2 className="text-6xl md:text-8xl font-serif leading-[1.1]">A Alquimia da <br /><span className="italic text-white/40">Solidão.</span></h2>
                 </div>
                 
                 <div className="space-y-12">
                    <p className="text-xl text-white/40 font-light leading-relaxed max-w-md italic">
                      "Para que a fênix renasça, ela deve primeiro abraçar o silêncio das cinzas."
                    </p>
                    <button className="h-20 px-16 bg-white text-black text-[11px] font-bold uppercase tracking-[0.5em] hover:bg-gold transition-colors duration-500 shadow-[0_20px_60px_rgba(255,255,255,0.05)]">
                       Retomar Travessia
                    </button>
                 </div>
              </div>

              {/* Sculptural Data Visual */}
              <div className="lg:w-1/2 relative aspect-[4/5] flex items-center justify-center">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#0A1229_0%,_transparent_70%)] opacity-40" />
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                   className="relative z-10 w-80 h-80 border border-gold/10 rounded-full flex items-center justify-center"
                 >
                    <div className="absolute inset-0 border border-gold/5 rounded-full scale-125" />
                    <Star className="w-16 h-16 text-gold/20" strokeWidth={0.5} />
                 </motion.div>
                 
                 <div className="absolute bottom-16 right-0 text-right space-y-4">
                    <span className="text-[9px] uppercase tracking-[0.6em] text-gold/40 font-bold">PROGRESSO ACUMULADO</span>
                    <h3 className="text-5xl font-serif text-white/90 tracking-tighter">72.4%</h3>
                 </div>
              </div>
           </div>
        </section>

        {/* 4. BIBLIOTECA VIVA - EDITORIAL ACERVO */}
        <section className="py-64 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-baseline gap-12 mb-48">
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[1em] text-white/20 font-bold block">ACERVO ORACULAR</span>
                <h2 className="text-7xl md:text-9xl font-serif leading-none italic">Biblioteca <span className="not-italic opacity-40">Viva</span></h2>
              </div>
              <button className="text-[11px] uppercase tracking-[0.4em] font-bold text-white/40 border-b border-white/10 pb-4 hover:text-gold hover:border-gold transition-all duration-700">
                Explorar Profundezas
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-32">
              {/* Feature 1 */}
              <div className="lg:col-span-7 group cursor-pointer relative overflow-hidden">
                <div className="relative aspect-[16/10] bg-[#050a18] border border-white/[0.03] overflow-hidden mb-12">
                   <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-transparent to-transparent z-10" />
                   <motion.div 
                     whileHover={{ scale: 1.05 }}
                     transition={{ duration: 1.5 }}
                     className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1518005020250-6759229547b8?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale" 
                   />
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Zap className="w-4 h-4 text-gold/60" />
                    <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-gold/60">ESTUDO CENTRAL</span>
                  </div>
                  <h4 className="text-5xl md:text-7xl font-serif leading-tight text-white/90">O Homem e seus Símbolos</h4>
                  <p className="text-lg text-white/30 font-light leading-relaxed max-w-xl">Uma análise profunda da psique humana e como o inconsciente se manifesta através da arte e dos sonhos.</p>
                </div>
              </div>

              {/* Small Grid */}
              <div className="lg:col-span-5 flex flex-col justify-center space-y-32">
                {[
                  { title: 'Ritual Prático', type: 'Prática', id: '01', desc: 'Protocolos de ativação emocional matutina.' },
                  { title: 'Cartas da Noite', type: 'Oráculo', id: '02', desc: 'Simbologia profunda para interpretação intuitiva.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-12 group cursor-pointer items-baseline">
                    <span className="text-5xl font-serif text-white/5 group-hover:text-gold/20 transition-colors duration-1000">{item.id}</span>
                    <div className="space-y-6 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/20">{item.type}</span>
                        <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-gold transition-all duration-700" />
                      </div>
                      <h4 className="text-3xl md:text-4xl font-serif text-white/80 group-hover:text-white transition-colors">{item.title}</h4>
                      <div className="h-px w-0 group-hover:w-full bg-gold/20 transition-all duration-1000" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5. PROGRESO ELEGANTE - CINEMATIC OUTRO */}
        <section className="py-[30vh] px-6 text-center">
           <motion.div
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             transition={{ duration: 3 }}
             className="max-w-4xl mx-auto space-y-24"
           >
             <Quote className="w-16 h-16 mx-auto text-gold/10" strokeWidth={0.5} />
             <p className="text-5xl md:text-8xl font-serif italic text-white/40 leading-[1.2] px-4 tracking-tighter">
               O mistério <br />
               não precisa ser <br />
               <span className="not-italic text-white/80 opacity-100">explicado.</span>
             </p>
             <div className="flex flex-col items-center gap-12">
               <div className="h-32 w-px bg-gradient-to-b from-gold/40 to-transparent" />
               <div className="space-y-4">
                 <span className="text-[10px] uppercase font-bold tracking-[1.2em] text-white/10 block">CASA ORÁCULA</span>
                 <span className="text-[9px] uppercase font-bold tracking-[0.5em] text-gold/40 block italic">Estabelecida na Profundidade</span>
               </div>
             </div>
           </motion.div>
        </section>
      </main>

      {/* 6. NAVEGAÇÃO INVISÍVEL E FLUIDA - MINIMALIST ARTIFACT */}
      <nav className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2, duration: 1.5 }}
          className="bg-black/20 backdrop-blur-3xl border border-white/[0.05] rounded-full px-12 py-6 flex items-center gap-12 md:gap-20 shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
        >
          {[
            { icon: Sparkles, active: true },
            { icon: BookOpen },
            { icon: Crown },
            { icon: Library },
          ].map((item, i) => (
            <button key={i} className="relative group p-2">
              <item.icon className={`w-5 h-5 transition-all duration-1000 ${item.active ? 'text-white' : 'text-white/20 group-hover:text-white/60'}`} strokeWidth={1} />
              {item.active && (
                <motion.div 
                  layoutId="activeNavPoint"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gold rounded-full shadow-[0_0_20px_gold]" 
                />
              )}
            </button>
          ))}
        </motion.div>
      </nav>
      
      {/* GLOBAL OVERLAYS */}
      <div className="fixed inset-0 pointer-events-none z-20">
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#010309] to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-96 bg-gradient-to-t from-[#010309] to-transparent" />
      </div>
    </div>
  );
}
