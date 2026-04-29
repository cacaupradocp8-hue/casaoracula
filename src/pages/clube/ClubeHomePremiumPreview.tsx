import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  ChevronRight,
  ArrowUpRight,
  Crown,
  BookOpen,
  Sparkles,
  Zap,
  Flower2,
  Library,
  LayoutDashboard
} from 'lucide-react';

export default function ClubeHomePremiumPreview() {
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Scale and opacity for hero elements on scroll
  const heroOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(smoothProgress, [0, 0.2], [1, 0.95]);

  return (
    <div className="min-h-screen bg-[#02050a] text-white selection:bg-gold/20 font-sans overflow-x-hidden selection:text-white" ref={containerRef}>
      {/* Cinematic Deep Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#0A1229_0%,_#02050a_100%)] opacity-40" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <main className="relative z-10">
        {/* 1. HERO - MINIMALISMO EXTREMO (APPLE KEYNOTE) */}
        <section className="h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
          <motion.div
            style={{ opacity: heroOpacity, scale: heroScale }}
            className="text-center space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <span className="text-[10px] uppercase tracking-[0.8em] text-gold/60 font-medium block">CASA ORÁCULA</span>
              <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif leading-none tracking-tight">
                Sua jornada <br />
                <span className="italic font-light opacity-80">continua</span>
              </h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 1.5, duration: 2 }}
              className="max-w-xs mx-auto pt-12"
            >
              <p className="text-sm font-light leading-relaxed tracking-wide italic">
                "Quem olha para fora sonha; quem olha para dentro acorda."
              </p>
            </motion.div>
          </motion.div>

          {/* Interaction Trigger - Tactile Feel */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-8"
          >
            <div className="w-px h-24 bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
            <span className="text-[8px] uppercase tracking-[1em] text-gold/30 font-bold vertical-text rotate-180">Explorar</span>
          </motion.div>
        </section>

        {/* 2. ESTRADA ESCULTÓRICA CENTRAL (JUNG) */}
        <section className="relative py-[40vh] px-6">
          <div className="max-w-4xl mx-auto relative">
            {/* The Sculptural Path Line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-white/[0.03]">
              <motion.div 
                style={{ scaleY: smoothProgress, transformOrigin: "top" }}
                className="absolute inset-0 bg-gradient-to-b from-gold/60 via-gold/20 to-transparent" 
              />
            </div>

            <div className="space-y-[80vh] relative">
              {[
                { id: 1, step: 'O CHAMADO', title: 'O Despertar da Intuição', desc: 'A primeira voz que ecoa no silêncio da alma.', active: true },
                { id: 2, step: 'A TRAVESSIA', title: 'A Bússola Interna', desc: 'Navegando entre as sombras e as luzes do inconsciente.', active: false },
                { id: 3, step: 'O ENCONTRO', title: 'O Labirinto do Self', desc: 'Onde o ego se dissolve para que a essência emerja.', active: false },
                { id: 4, step: 'A INTEGRAÇÃO', title: 'A Grande Obra', desc: 'A união final das polaridades em um único ser.', active: false },
              ].map((node, i) => (
                <div key={node.id} className="flex flex-col items-center text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false, margin: "-20%" }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative mb-24"
                  >
                    {/* Abstract Sculptural Node */}
                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border border-white/[0.05] flex items-center justify-center relative group">
                      <div className="absolute inset-0 rounded-full border border-gold/10 scale-125 opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                      <div className="w-2 h-2 rounded-full bg-gold/40 group-hover:bg-gold transition-colors duration-500" />
                      
                      {/* Interaction Layer */}
                      <button className="absolute inset-0 z-10 opacity-0 cursor-pointer">Tocar</button>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-20%" }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                    className="space-y-6 max-w-sm"
                  >
                    <span className="text-[10px] uppercase tracking-[0.6em] text-gold/50 font-medium">{node.step}</span>
                    <h2 className="text-3xl md:text-5xl font-serif leading-tight text-white/90">{node.title}</h2>
                    <p className="text-xs md:text-sm text-white/30 font-light leading-relaxed tracking-wide italic px-8">
                      {node.desc}
                    </p>
                    
                    {i === 0 && (
                      <div className="pt-8">
                        <button className="group flex items-center gap-8 mx-auto text-[10px] uppercase font-bold tracking-[0.4em] text-white/40 hover:text-white transition-all">
                          Continuar <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. FRASE PROFUNDA INTERMEDIÁRIA (IMPACTO SILENCIOSO) */}
        <section className="h-[60vh] flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 3 }}
            className="max-w-4xl text-center"
          >
            <p className="text-3xl md:text-5xl font-serif italic text-white/40 leading-relaxed tracking-tight">
              "Sua visão se tornará clara somente quando você puder olhar para o seu próprio coração."
            </p>
          </motion.div>
        </section>

        {/* 4. PROGRESSO NOBRE DISCRETO */}
        <section className="py-64 px-6 border-t border-white/[0.02]">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-baseline justify-between gap-24">
            <div className="space-y-12">
              <h3 className="text-4xl font-serif text-white/90">O Estado da <br /><span className="text-white/30 italic font-light">Transformação</span></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="space-y-4">
                  <span className="text-5xl md:text-7xl font-serif text-white/80">72%</span>
                  <div className="h-px w-full bg-white/[0.05] relative overflow-hidden">
                    <motion.div 
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 0.72 }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      className="absolute inset-0 bg-gold/40 origin-left"
                    />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold block">Maturação Psíquica</span>
                </div>
                <div className="space-y-4">
                  <span className="text-5xl md:text-7xl font-serif text-white/80">12</span>
                  <div className="h-px w-full bg-white/[0.05] relative overflow-hidden">
                    <motion.div 
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 0.3 }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      className="absolute inset-0 bg-gold/40 origin-left"
                    />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold block">Símbolos Integrados</span>
                </div>
              </div>
            </div>

            <div className="relative group cursor-pointer">
              <div className="absolute -inset-12 bg-gold/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative space-y-4">
                <Crown className="w-12 h-12 text-gold/20" strokeWidth={1} />
                <h4 className="text-2xl font-serif text-white/80">Sacerdotisa Iniciante</h4>
                <p className="text-[9px] uppercase tracking-[0.5em] text-gold/40 font-bold">Patente Atual</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. BIBLIOTECA CINEMATOGRÁFICA (EDITORIAL) */}
        <section className="py-64 px-6 bg-[#010206]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-baseline gap-12 mb-32 px-4">
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[1em] text-white/20 font-bold block">ACERVO</span>
                <h2 className="text-6xl md:text-9xl font-serif leading-none italic text-white/90">Biblioteca <span className="not-italic">Viva</span></h2>
              </div>
              <button className="text-[11px] uppercase tracking-[0.5em] font-bold text-white/40 border-b border-white/10 pb-2 hover:text-gold hover:border-gold transition-all">
                Ver Tudo
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
              <div className="lg:col-span-8 group cursor-pointer overflow-hidden">
                <div className="relative aspect-[16/10] bg-[#0A1229] border border-white/[0.03] overflow-hidden rounded-sm transition-transform duration-1000 group-hover:scale-[1.02]">
                   <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-transparent z-10" />
                   <motion.div 
                     whileHover={{ scale: 1.05 }}
                     transition={{ duration: 1.5 }}
                     className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1518005020250-6759229547b8?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale" 
                   />
                   <div className="absolute bottom-16 left-16 z-20 space-y-6">
                      <div className="flex items-center gap-4">
                        <Zap className="w-4 h-4 text-gold/60" />
                        <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-gold/60">ESTUDO CENTRAL</span>
                      </div>
                      <h4 className="text-4xl md:text-6xl font-serif max-w-xl leading-tight text-white/90">O Homem e seus Símbolos</h4>
                   </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col justify-center space-y-24">
                {[
                  { title: 'Arquétipos Universais', type: 'Prática', label: '01' },
                  { title: 'O Livro Vermelho', type: 'Meditação', label: '02' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-12 group cursor-pointer items-baseline">
                    <span className="text-4xl font-serif text-white/10 group-hover:text-gold/20 transition-colors duration-700">{item.label}</span>
                    <div className="space-y-4">
                      <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/30">{item.type}</span>
                      <h4 className="text-2xl md:text-3xl font-serif text-white/80 group-hover:text-white transition-colors">{item.title}</h4>
                      <div className="h-px w-0 group-hover:w-full bg-gold/20 transition-all duration-1000" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 6. FECHAMENTO TRANSFORMADOR (SILÊNCIO) */}
        <section className="py-[40vh] px-6 text-center relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 3 }}
            className="max-w-4xl mx-auto space-y-24"
          >
            <div className="w-px h-32 bg-gradient-to-b from-gold/40 to-transparent mx-auto" />
            <h5 className="text-5xl md:text-8xl font-serif italic text-white/50 leading-tight tracking-tight">
              O mistério <br />
              não precisa ser <br />
              <span className="not-italic text-white/80">explicado.</span>
            </h5>
            <div className="pt-24 space-y-6">
              <span className="text-[10px] uppercase font-bold tracking-[1em] text-white/10 block">CASA ORÁCULA</span>
              <p className="text-[8px] uppercase font-bold tracking-[0.5em] text-gold/40 italic">Inicie sua próxima travessia no silêncio.</p>
            </div>
          </motion.div>
        </section>
      </main>

      {/* MINIMALIST NAVIGATIONAL ARTIFACT */}
      <nav className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="bg-black/40 backdrop-blur-3xl border border-white/[0.05] rounded-full px-10 py-5 flex items-center gap-12 md:gap-16 shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
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
    </div>
  );
}
