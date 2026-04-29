import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  BookOpen, 
  Sparkles, 
  Zap, 
  Crown, 
  LayoutDashboard, 
  Library, 
  Flower2, 
  Quote,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';

export default function ClubeHomePremiumPreview() {
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll();
  
  return (
    <div className="min-h-screen bg-[#010309] text-white selection:bg-gold/20 font-sans overflow-x-hidden selection:text-white" ref={containerRef}>
      {/* Cinematic Background Atmosphere - Re-engineered for Depth */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#0A1229_0%,_#010309_70%)]" />
        {/* Fine Architectural Grain */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-soft-light bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* Subtle Light Leaks */}
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-gold/[0.03] blur-[150px]" />
        <div className="absolute top-[40%] -left-[20%] w-[60%] h-[60%] rounded-full bg-blue-900/[0.05] blur-[150px]" />
      </div>

      <main className="relative z-10">
        {/* 1. IMPACTFUL ENTRANCE - THE "MUSEUM" HERO */}
        <section className="min-h-[110vh] flex flex-col justify-center px-6 md:px-32 relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            <div className="lg:col-span-8 space-y-16">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 0.5, x: 0 }}
                  transition={{ delay: 0.8, duration: 1.5 }}
                  className="flex items-center gap-4"
                >
                  <div className="h-px w-8 bg-gold/50" />
                  <span className="text-[10px] uppercase font-bold tracking-[0.8em] text-gold/80">
                    EXCLUSIVIDADE ORÁCULAR
                  </span>
                </motion.div>
                
                <h1 className="text-7xl md:text-[10rem] font-serif leading-[0.85] tracking-tighter mix-blend-lighten">
                  <motion.span 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                    className="block"
                  >
                    Bem-vinda,
                  </motion.span>
                  <motion.span 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 0.8, y: 0 }}
                    transition={{ delay: 0.4, duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                    className="block italic font-light ml-[0.1em] text-white/60"
                  >
                    Claudia.
                  </motion.span>
                </h1>
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 2 }}
                className="max-w-sm space-y-10"
              >
                <p className="text-base text-white/40 leading-relaxed font-light tracking-wide italic">
                  "Onde o silêncio se encontra com a inteligência, a travessia se torna revelação."
                </p>
                
                <div className="group relative inline-block">
                  <div className="absolute -inset-8 bg-gold/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <button className="relative flex items-center gap-10 bg-transparent border-b border-white/20 pb-4 pr-12 text-white font-light tracking-[0.2em] uppercase text-xs transition-all hover:border-gold/50 group">
                    <span className="group-hover:text-gold transition-colors">Continuar Atravessia</span>
                    <ArrowUpRight className="w-4 h-4 absolute right-0 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform text-gold/60" />
                  </button>
                </div>
              </motion.div>
            </div>
            
            {/* Ambient Profile/Stat Cluster - Non-Card Style */}
            <div className="hidden lg:block lg:col-span-4 relative h-full">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 1, duration: 2 }}
                 className="absolute right-0 top-1/2 -translate-y-1/2 text-right space-y-24"
               >
                 <div className="space-y-2">
                    <span className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-bold block">Status Atual</span>
                    <span className="text-3xl font-serif text-white/60">Sacerdotisa Iniciante</span>
                 </div>
                 <div className="space-y-2">
                    <span className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-bold block">Conexão Vital</span>
                    <span className="text-3xl font-serif text-white/60">72% Ativa</span>
                 </div>
               </motion.div>
            </div>
          </motion.div>

          {/* Elegant Scroll Signifier */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6">
            <div className="h-24 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
            <span className="text-[8px] uppercase tracking-[0.8em] text-gold/40 font-bold [writing-mode:vertical-lr]">Explorar</span>
          </div>
        </section>

        {/* 2. THE MONUMENTAL ROAD - ABSTRACT INSTALLATION */}
        <section className="relative py-64 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="mb-64 flex flex-col items-start max-w-2xl">
              <span className="text-[9px] uppercase tracking-[0.6em] text-gold/40 font-bold mb-6">Manifesto Visual</span>
              <h2 className="text-5xl md:text-7xl font-serif leading-[1.1] text-white/90">
                A Estrada é uma <br />
                <span className="italic">obra inacabada.</span>
              </h2>
            </div>

            <div className="relative">
              {/* Artistic Path - Organic and Subtle */}
              <div className="absolute left-[5%] md:left-[50%] top-0 bottom-0 w-px bg-white/[0.03]">
                <motion.div 
                  style={{ scaleY: scrollYProgress, transformOrigin: "top" }}
                  className="absolute inset-0 bg-gradient-to-b from-gold/40 via-gold/20 to-transparent" 
                />
              </div>

              <div className="space-y-[60vh] relative z-10">
                {[
                  { id: 1, type: 'CAPÍTULO I', title: 'O Chamado Selvagem', status: 'completed', align: 'right', desc: 'O despertar da voz interior que clama por profundidade.' },
                  { id: 2, type: 'CAPÍTULO II', title: 'A Bússola Interna', status: 'current', align: 'left', active: true, desc: 'Navegando pelas águas da intuição feminina consciente.' },
                  { id: 3, type: 'CAPÍTULO III', title: 'O Labirinto das Sombras', status: 'locked', align: 'right', desc: 'Enfrentando o que se esconde sob a superfície do ego.' },
                  { id: 4, type: 'CAPÍTULO IV', title: 'A Grande Integração', status: 'locked', align: 'left', desc: 'A união entre a inteligência fria e o fogo passional.' },
                ].map((step, i) => (
                  <div key={step.id} className={`flex w-full items-start ${step.align === 'right' ? 'justify-end' : 'justify-start'}`}>
                    <motion.div 
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
                      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                      className={`w-full md:w-[45%] flex flex-col ${step.align === 'right' ? 'items-start pl-12 md:pl-0' : 'items-end pr-12 md:pr-0'}`}
                    >
                      <div className={`space-y-8 ${step.align === 'right' ? 'text-left' : 'text-right'}`}>
                        <div className="space-y-4">
                          <span className={`text-[10px] font-bold tracking-[0.5em] uppercase transition-colors duration-1000 ${step.status === 'current' ? 'text-gold' : 'text-white/20'}`}>
                            {step.type}
                          </span>
                          <h3 className={`text-4xl md:text-6xl font-serif tracking-tight leading-none ${step.status === 'locked' ? 'text-white/10' : 'text-white'}`}>
                            {step.title}
                          </h3>
                        </div>
                        
                        <p className={`text-sm font-light leading-relaxed max-w-xs ${step.status === 'locked' ? 'text-white/5' : 'text-white/30'} ${step.align === 'right' ? '' : 'ml-auto'}`}>
                          {step.desc}
                        </p>
                        
                        {step.status === 'current' && (
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            className="text-gold font-bold tracking-[0.4em] text-[10px] uppercase flex items-center gap-4 group"
                          >
                            <span className="h-px w-8 bg-gold/30 group-hover:w-12 transition-all" />
                            Iniciar agora
                          </motion.button>
                        )}
                      </div>
                    </motion.div>

                    {/* Minimalist Marker */}
                    <div className="absolute left-[5%] md:left-[50%] -translate-x-1/2 mt-4">
                      <div className={`
                        relative transition-all duration-1000
                        ${step.status === 'current' ? 
                          'w-6 h-6 border border-gold/40 flex items-center justify-center rotate-45' : 
                          'w-2 h-2 bg-white/10'}
                      `}>
                        {step.status === 'current' && (
                          <div className="w-1.5 h-1.5 bg-gold" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. NOBLE PROGRESS - EDITORIAL DATA */}
        <section className="py-64 px-6 border-t border-white/[0.02]">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-32">
            <div className="lg:w-1/2 space-y-24">
              <div className="space-y-6">
                <span className="text-[9px] uppercase tracking-[0.8em] text-white/20 font-bold">Consistência</span>
                <h2 className="text-5xl md:text-7xl font-serif leading-[1.1]">Sua mente em <br /><span className="italic text-white/40">expansão.</span></h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {[
                  { label: "Maturidade", value: "72%", sub: "Capacidade de processamento emocional" },
                  { label: "Domínio", value: "12/40", sub: "Arquétipos integrados na psique" }
                ].map((stat, i) => (
                  <div key={i} className="space-y-6 group">
                    <div className="flex flex-col gap-1">
                      <span className="text-5xl font-serif text-white/80 group-hover:text-gold transition-colors duration-700">{stat.value}</span>
                      <span className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold">{stat.label}</span>
                    </div>
                    <p className="text-xs text-white/30 font-light leading-relaxed max-w-[180px]">{stat.sub}</p>
                    <div className="h-px w-full bg-white/[0.05] relative overflow-hidden">
                      <motion.div 
                        initial={{ x: "-100%" }}
                        whileInView={{ x: "0%" }}
                        transition={{ duration: 2, delay: i * 0.3 }}
                        className="absolute inset-0 bg-gold/40"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 relative aspect-[4/5] flex items-center justify-center">
              {/* The "Artifact" - Abstract representation of reward */}
              <div className="absolute inset-0 bg-[#050a18] border border-white/[0.03] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#0A1229_0%,_transparent_70%)] opacity-50" />
                <div className="absolute inset-0 opacity-[0.1] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
              </div>
              
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="relative z-10 w-64 h-64 border border-gold/10 rounded-full flex items-center justify-center"
              >
                <div className="absolute inset-0 border border-gold/5 rounded-full scale-125" />
                <Crown className="w-12 h-12 text-gold/30" strokeWidth={0.5} />
              </motion.div>
              
              <div className="absolute bottom-16 left-16 right-16 space-y-4">
                <span className="text-[8px] uppercase tracking-[0.6em] text-gold/40 font-bold">Título Honorário</span>
                <h3 className="text-3xl font-serif text-white/90">Sacerdotisa da Noite</h3>
                <div className="h-px w-12 bg-gold/20" />
              </div>
            </div>
          </div>
        </section>

        {/* 4. LIVING LIBRARY - MAGAZINE STYLE */}
        <section className="py-64 px-6 bg-[#000105]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-baseline gap-12 mb-32">
              <div className="space-y-4">
                <span className="text-[9px] uppercase tracking-[1em] text-white/20 font-bold">ACERVO</span>
                <h2 className="text-6xl md:text-8xl font-serif leading-none italic">Biblioteca <span className="not-italic">Viva</span></h2>
              </div>
              <button className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/40 border-b border-white/10 pb-2 hover:text-gold hover:border-gold transition-all">
                Explorar Profundezas
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Featured Editorial Piece */}
              <div className="lg:col-span-7 group cursor-pointer">
                <div className="relative aspect-[16/10] bg-[#050a18] border border-white/[0.03] overflow-hidden mb-8">
                   <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-transparent z-10" />
                   <motion.div 
                     whileHover={{ scale: 1.05 }}
                     transition={{ duration: 1.5 }}
                     className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1518005020250-6759229547b8?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale" 
                   />
                   <div className="absolute bottom-12 left-12 z-20 space-y-4">
                      <div className="flex items-center gap-3">
                        <Zap className="w-4 h-4 text-gold/60" />
                        <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-gold/60">Destaque Editorial</span>
                      </div>
                      <h4 className="text-4xl md:text-5xl font-serif max-w-lg leading-tight">A Alquimia da Solidão Produtiva</h4>
                   </div>
                </div>
              </div>

              {/* Side Grid - Editorial Blocks */}
              <div className="lg:col-span-5 grid grid-cols-1 gap-12">
                {[
                  { title: 'Ritual Prático', type: 'Prática', label: '01', desc: 'Protocolos de ativação cognitiva e emocional matutina.' },
                  { title: 'Cartas da Noite', type: 'Oráculo', label: '02', desc: 'Simbologia profunda para interpretação de sonhos e intuição.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-10 group cursor-pointer">
                    <span className="text-3xl font-serif text-white/10 group-hover:text-gold/20 transition-colors">{item.label}</span>
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/30">{item.type}</span>
                        <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-gold transition-all" />
                      </div>
                      <h4 className="text-2xl font-serif text-white/80 group-hover:text-white transition-colors">{item.title}</h4>
                      <p className="text-xs text-white/30 font-light leading-relaxed">{item.desc}</p>
                      <div className="h-px w-full bg-white/[0.03] group-hover:bg-gold/20 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5. CINEMATIC OUTRO */}
        <section className="py-[30vh] px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="max-w-3xl mx-auto space-y-20"
          >
            <Quote className="w-12 h-12 mx-auto text-gold/10" strokeWidth={0.5} />
            <p className="text-4xl md:text-6xl font-serif italic text-white/50 leading-[1.2] px-4 tracking-tight">
              "A beleza é o esplendor da verdade, e a verdade é o silêncio da inteligência."
            </p>
            <div className="flex flex-col items-center gap-10">
              <div className="h-24 w-px bg-gradient-to-b from-gold/40 to-transparent" />
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-[1em] text-white/20 block">CASA ORÁCULA</span>
                <span className="text-[8px] uppercase font-bold tracking-[0.4em] text-gold/40 block italic">Para as raras e profundas</span>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* 6. MINIMALIST NAVIGATIONAL ARTIFACT */}
      <nav className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="bg-[#020617]/40 backdrop-blur-3xl border border-white/[0.05] rounded-full px-10 py-5 flex items-center gap-12 md:gap-16 shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
        >
          {[
            { icon: LayoutDashboard, active: true },
            { icon: BookOpen },
            { icon: Sparkles },
            { icon: Flower2 },
            { icon: Library },
          ].map((item, i) => (
            <button key={i} className="relative group p-2">
              <item.icon className={`w-5 h-5 transition-all duration-700 ${item.active ? 'text-white' : 'text-white/20 group-hover:text-white/60'}`} strokeWidth={1} />
              {item.active && (
                <motion.div 
                  layoutId="activeNavPoint"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-gold rounded-full shadow-[0_0_15px_gold]" 
                />
              )}
            </button>
          ))}
        </motion.div>
      </nav>
      
      {/* Cinematic Overlays */}
      <div className="fixed inset-0 pointer-events-none z-20">
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#010309] to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-[#010309] to-transparent" />
      </div>
    </div>
  );
}
