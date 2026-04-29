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
import { Button } from '@/components/ui/button';

// DESIGN SYSTEM CASA ORÁCULA - CINEMATIC EXCLUSIVE
// Primary: Deepest Navy (#020617)
// Accent: Architectural Gold (#C9A96E)
// Font: Editorial Serif & Minimal Sans

export default function ClubeHomePremiumPreview() {
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll();
  
  // Parallax for road elements
  const roadY = useTransform(scrollYProgress, [0, 1], [0, -150]);

  return (
    <div className="min-h-screen bg-[#02040a] text-white selection:bg-gold/20 font-sans overflow-x-hidden selection:text-white" ref={containerRef}>
      {/* Cinematic Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-radial-gradient from-[#0A1229] via-[#020617] to-[#010208]" />
        {/* Architectural subtle grain */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* Subtle Lens Flare effect - very low opacity */}
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gold/5 blur-[120px]" />
      </div>

      <main className="relative z-10">
        {/* 1. IMPACTFUL ENTRANCE - EDITORIAL HERO */}
        <section className="min-h-screen flex flex-col justify-center px-8 md:px-24 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            className="max-w-4xl space-y-12"
          >
            <div className="space-y-4">
              <motion.span 
                initial={{ opacity: 0, letterSpacing: "0.1em" }}
                animate={{ opacity: 0.4, letterSpacing: "0.5em" }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-[10px] uppercase font-bold text-gold/80"
              >
                CASA ORÁCULA • MEMBRO EXCLUSIVO
              </motion.span>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif leading-[0.9] tracking-tighter">
                A Jornada de <br />
                <span className="italic font-medium text-white/90">Claudia</span>
              </h1>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-end gap-12">
              <div className="max-w-xs space-y-6">
                <p className="text-sm text-white/40 leading-relaxed font-light">
                  Seu progresso é uma composição de silêncio e ação. Continue de onde a alma parou.
                </p>
                <div className="h-px w-12 bg-gold/30" />
              </div>
              
              {/* 2. IRRESISTIBLE NEXT STEP - FLOATING CTA */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute -inset-4 bg-gold/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <button className="relative flex items-center gap-6 bg-white py-6 px-10 rounded-full text-black font-bold tracking-tight overflow-hidden transition-all group-hover:pr-14">
                  <span className="text-lg">Retomar: A Intuição Selvagem</span>
                  <div className="absolute right-6 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                    <ArrowUpRight className="w-6 h-6" />
                  </div>
                </button>
              </motion.div>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-20"
          >
            <span className="text-[9px] uppercase tracking-[0.4em] font-bold">Explorar Estrada</span>
            <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
          </motion.div>
        </section>

        {/* 3. MONUMENTAL ROAD - THE CENTRAL MASTERPIECE */}
        <section className="relative py-48 px-6">
          <div className="flex flex-col items-center mb-40 text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif italic text-white/90">A Cartografia da Alma</h2>
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/30 font-bold">O Caminho que você está construindo</p>
          </div>

          <div className="max-w-5xl mx-auto relative">
            {/* The "Elevated" Road Design */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px]">
              <div className="absolute inset-0 bg-gradient-to-b from-gold/40 via-white/5 to-transparent" />
              <motion.div 
                style={{ scaleY: scrollYProgress, transformOrigin: "top" }}
                className="absolute inset-0 bg-gradient-to-b from-gold via-gold/50 to-transparent" 
              />
            </div>

            <motion.div style={{ y: roadY }} className="space-y-[40vh] relative">
              {[
                { id: 1, type: 'Portal', title: 'O Chamado Selvagem', status: 'completed', side: 'left', date: '12 Abr' },
                { id: 2, type: 'Imersão', title: 'A Bússola Interna', status: 'current', side: 'right', active: true },
                { id: 3, type: 'Enigma', title: 'O Labirinto das Sombras', status: 'locked', side: 'left' },
                { id: 4, type: 'Ritual', title: 'Integração de Luz', status: 'locked', side: 'right' },
              ].map((step, i) => (
                <div key={step.id} className={`flex w-full items-center ${step.side === 'left' ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Content Panel */}
                  <motion.div 
                    initial={{ opacity: 0, x: step.side === 'left' ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="w-1/2 flex flex-col px-12 md:px-20"
                    style={{ alignItems: step.side === 'left' ? 'flex-end' : 'flex-start' }}
                  >
                    <div className={`group relative ${step.side === 'left' ? 'text-right' : 'text-left'}`}>
                      {step.active && (
                        <div className="absolute -inset-10 bg-gold/5 blur-3xl rounded-full" />
                      )}
                      
                      <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-gold/60 mb-3 block">
                        {step.type} • {step.status === 'completed' ? 'Concluído' : step.status === 'current' ? 'Agora' : 'Em breve'}
                      </span>
                      <h3 className={`text-3xl md:text-5xl font-serif mb-6 leading-tight ${step.status === 'locked' ? 'text-white/20' : 'text-white'}`}>
                        {step.title}
                      </h3>
                      
                      {step.status === 'current' && (
                        <Button variant="link" className="text-gold p-0 h-auto font-bold tracking-widest text-[10px] uppercase flex items-center gap-2 group">
                          Iniciar Atravessia <ArrowUpRight className="w-3 h-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Button>
                      )}
                      
                      {step.date && <span className="text-[10px] text-white/20 font-mono mt-4 block">{step.date}</span>}
                    </div>
                  </motion.div>

                  {/* Marker */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-16 h-16 flex items-center justify-center">
                    <div className={`
                      relative rounded-full transition-all duration-1000
                      ${step.status === 'current' ? 
                        'w-4 h-4 bg-gold ring-8 ring-gold/10' : 
                        step.status === 'completed' ? 
                        'w-2 h-2 bg-gold/40' : 
                        'w-1.5 h-1.5 bg-white/10'}
                    `}>
                      {step.status === 'current' && (
                        <div className="absolute inset-0 animate-ping bg-gold/30 rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 4. NOBLE PROGRESS - MINIMALIST STATS */}
        <section className="py-48 px-8 border-t border-white/[0.03] bg-gradient-to-b from-transparent to-[#010206]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <h2 className="text-4xl font-serif leading-tight">Sua Ascensão <br /><span className="text-white/40">na Casa Orácula</span></h2>
              <div className="space-y-8">
                {[
                  { label: "Maturidade Psíquica", value: "72%" },
                  { label: "Portais Atravessados", value: "12/40" },
                  { label: "Rituais Ativos", value: "05" }
                ].map((stat, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">
                      <span>{stat.label}</span>
                      <span className="text-white/60">{stat.value}</span>
                    </div>
                    <div className="h-px w-full bg-white/5 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: stat.value.includes('%') ? stat.value : '40%' }}
                        transition={{ duration: 2, delay: i * 0.2 }}
                        className="h-full bg-white/40"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative aspect-square md:aspect-[4/5] overflow-hidden rounded-sm bg-[#0A1229] border border-white/[0.05]">
              {/* Reward/Badge Card Style Cinematic */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-white/[0.05]" />
              <div className="absolute inset-0 flex flex-col justify-between p-12">
                <Crown className="w-12 h-12 text-gold/40" strokeWidth={1} />
                <div className="space-y-4">
                  <span className="text-[10px] font-bold tracking-[0.5em] text-gold/60 uppercase">Próxima Patente</span>
                  <h3 className="text-4xl font-serif">Sacerdotisa da Noite</h3>
                  <p className="text-sm text-white/30 font-light leading-relaxed">Faltam 3 passos para o Ritual de Iniciação exclusivo.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. LIVING LIBRARY - CURATED COMPOSITION */}
        <section className="py-48 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-24">
              <div className="space-y-4">
                <span className="text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase">Acervo Oracular</span>
                <h2 className="text-5xl font-serif">Biblioteca Viva</h2>
              </div>
              <Button variant="link" className="text-white/40 text-[11px] uppercase tracking-[0.2em] font-bold hover:text-white transition-colors">
                Ver Acervo Completo <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[800px] md:h-[600px]">
              {/* Feature Item */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="md:col-span-8 group relative overflow-hidden rounded-sm cursor-pointer"
              >
                <div className="absolute inset-0 bg-[#0A1229] border border-white/[0.08]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-12 left-12 right-12 space-y-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-gold" />
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold">Destaque da Semana</span>
                  </div>
                  <h4 className="text-4xl font-serif">Mulheres que Correm com os Lobos</h4>
                  <p className="text-sm text-white/40 max-w-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    O resgate da psique feminina instintiva através dos contos clássicos e interpretação psicológica profunda.
                  </p>
                </div>
              </motion.div>

              {/* Grid Items */}
              <div className="md:col-span-4 grid grid-rows-2 gap-6">
                {[
                  { title: 'Ritual Prático', type: 'Prática', icon: Sparkles },
                  { title: 'Cartas da Noite', type: 'Oráculo', icon: Flower2 }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 0.98 }}
                    className="relative group overflow-hidden rounded-sm bg-[#080d1a] border border-white/[0.05] p-10 flex flex-col justify-end cursor-pointer"
                  >
                    <div className="absolute top-8 right-8 text-white/10 group-hover:text-gold/20 transition-colors">
                      <item.icon className="w-12 h-12" strokeWidth={1} />
                    </div>
                    <div className="space-y-2">
                      <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/30">{item.type}</span>
                      <h4 className="text-xl font-serif text-white/80 group-hover:text-white transition-colors">{item.title}</h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Closing Quote - Cinematic */}
        <section className="py-64 px-8 text-center bg-[#010206]">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="max-w-2xl mx-auto space-y-16"
          >
            <Quote className="w-12 h-12 mx-auto text-gold/20" strokeWidth={1} />
            <p className="text-3xl md:text-4xl font-serif italic text-white/60 leading-relaxed px-4">
              "A verdadeira inteligência reside na capacidade de ver o invisível e sentir o que ainda não foi nomeado."
            </p>
            <div className="flex flex-col items-center gap-8">
              <div className="h-px w-24 bg-gold/30" />
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-[0.6em] text-white/20 block">Casa Orácula</span>
                <span className="text-[9px] uppercase font-bold tracking-[0.3em] text-gold/40 block">Est. 2024</span>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* 6. MINIMALIST EXCLUSIVE NAVIGATION */}
      <nav className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-black/60 backdrop-blur-2xl border border-white/5 rounded-full px-12 py-6 flex items-center gap-16 shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
          {[
            { icon: LayoutDashboard, active: true },
            { icon: BookOpen },
            { icon: Sparkles },
            { icon: Flower2 },
            { icon: Library },
          ].map((item, i) => (
            <button key={i} className={`relative group`}>
              <item.icon className={`w-6 h-6 transition-all duration-500 ${item.active ? 'text-white' : 'text-white/20 group-hover:text-white/60'}`} strokeWidth={1.5} />
              {item.active && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-1 bg-gold rounded-full shadow-[0_0_10px_gold]" 
                />
              )}
            </button>
          ))}
        </div>
      </nav>
      
      {/* Decorative Gradient Overlays */}
      <div className="fixed top-0 inset-x-0 h-64 bg-gradient-to-b from-[#02040a] to-transparent pointer-events-none z-20" />
      <div className="fixed bottom-0 inset-x-0 h-64 bg-gradient-to-t from-[#02040a] to-transparent pointer-events-none z-20" />
    </div>
  );
}
