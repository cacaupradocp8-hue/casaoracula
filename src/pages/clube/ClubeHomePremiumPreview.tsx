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
  
  // DESIGN SYSTEM CASA ORÁCULA - REFINED PREMIUM
  // Primary: Pure Deep Navy (#0A192F) - Clearly blue, high visibility
  // Text: High Contrast White/Slate-200
  // Accent: Muted Architectural Gold (#C9A96E)
  
  return (
    <div className="min-h-screen bg-[#0A192F] text-white selection:bg-gold/20 font-sans overflow-x-hidden" ref={containerRef}>
      {/* Background Atmosphere - More visible blue depth */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1F3D] via-[#0A192F] to-[#071324]" />
        {/* Subtle texture for luxury feel */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* Ambient light to define space */}
        <div className="absolute top-0 right-0 w-[80%] h-[80%] rounded-full bg-blue-500/[0.03] blur-[150px]" />
      </div>

      <main className="relative z-10">
        {/* 1. REFINED HERO - HIGH CONTRAST & READABLE */}
        <section className="min-h-[90vh] flex flex-col justify-center px-6 md:px-24 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px w-8 bg-gold" />
                <span className="text-[11px] uppercase font-bold tracking-[0.4em] text-gold">
                  Casa Orácula • Clube VIP
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.1] tracking-tight text-white">
                A Travessia de <br />
                <span className="italic text-slate-200 font-light">Claudia</span>
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
              <div className="space-y-8 max-w-md">
                <p className="text-lg text-slate-300 leading-relaxed font-light italic border-l-2 border-gold/30 pl-6">
                  "Onde a inteligência feminina encontra o seu lugar de poder e silêncio."
                </p>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex items-center gap-6 bg-white py-4 px-8 rounded-sm text-[#0A192F] font-bold tracking-widest uppercase text-[11px] shadow-2xl hover:bg-gold transition-colors"
                >
                  Continuar Agora
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </motion.button>
              </div>

              {/* Status Indicator - Integrated and Visible */}
              <div className="flex justify-start md:justify-end gap-16">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">Progresso Vital</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-serif text-white">72%</span>
                    <span className="text-xs text-gold font-bold">Iniciada</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">Nível Atual</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-serif text-white">08</span>
                    <span className="text-xs text-gold font-bold">Rituais</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 2. THE ROAD - CLEAR & STRUCTURED JOURNEY */}
        <section className="py-32 px-6 bg-[#0D1F3D]/30 border-y border-white/[0.05]">
          <div className="max-w-6xl mx-auto">
            <div className="mb-24 space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif text-white">Sua Estrada Viva</h2>
              <p className="text-slate-400 max-w-md text-sm leading-relaxed">O caminho percorrido e o próximo passo para sua evolução na Casa Orácula.</p>
            </div>

            <div className="relative space-y-12">
              {/* Path Line */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-700 md:left-1/2 md:-translate-x-1/2" />

              {[
                { id: 1, title: 'O Despertar da Intuição', type: 'Concluído', date: 'Ontem', active: false, done: true },
                { id: 2, title: 'A Bússola da Alma', type: 'Em progresso', active: true, done: false },
                { id: 3, title: 'O Labirinto das Sombras', type: 'Próximo Passo', active: false, done: false },
                { id: 4, title: 'Ritual de Integração', type: 'Bloqueado', active: false, done: false }
              ].map((item, i) => (
                <div key={i} className={`relative flex items-center md:justify-between ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Point */}
                  <div className={`absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-[#0A192F] z-10 transition-colors duration-500
                    ${item.active ? 'bg-gold ring-8 ring-gold/20 scale-125' : item.done ? 'bg-gold/40' : 'bg-slate-700'}`} 
                  />

                  {/* Content */}
                  <div className="ml-20 md:ml-0 md:w-[42%]">
                    <motion.div 
                      whileHover={{ y: -5 }}
                      className={`p-8 rounded-sm border transition-all duration-500
                        ${item.active ? 'bg-white/5 border-gold shadow-[0_20px_40px_rgba(0,0,0,0.3)]' : 'bg-[#0D1F3D]/50 border-white/5 opacity-60'}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${item.active ? 'text-gold' : 'text-slate-400'}`}>
                          {item.type}
                        </span>
                        {item.date && <span className="text-[10px] text-slate-500">{item.date}</span>}
                      </div>
                      <h3 className={`text-xl md:text-2xl font-serif mb-6 ${item.active ? 'text-white' : 'text-slate-300'}`}>
                        {item.title}
                      </h3>
                      {item.active && (
                        <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold flex items-center gap-2 hover:gap-4 transition-all">
                          Retomar agora <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. NOBLE PROGRESS - HIGH CONTRAST DATA */}
        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <h2 className="text-4xl md:text-5xl font-serif leading-tight">Métricas de <br /><span className="text-slate-400">Transformação</span></h2>
              <div className="space-y-10">
                {[
                  { label: "Maturidade Psíquica", value: "72%" },
                  { label: "Portais Atravessados", value: "12/40" },
                  { label: "Nível de Consciência", value: "Nível 4" }
                ].map((stat, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex justify-between text-[11px] font-bold tracking-widest text-slate-300 uppercase">
                      <span>{stat.label}</span>
                      <span className="text-gold">{stat.value}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: stat.value.includes('%') ? stat.value : '30%' }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-gold/50 to-gold rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative p-12 bg-white/5 border border-white/10 rounded-sm overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                <Crown className="w-24 h-24 text-gold" strokeWidth={1} />
              </div>
              <div className="relative z-10 space-y-6">
                <span className="text-[10px] font-bold tracking-[0.5em] text-gold uppercase">Próximo Título</span>
                <h3 className="text-4xl font-serif text-white">Sacerdotisa da Noite</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                  Sua consistência está moldando uma nova realidade. Faltam 4 experiências para a iniciação.
                </p>
                <div className="h-px w-12 bg-gold/50" />
              </div>
            </div>
          </div>
        </section>

        {/* 4. LIBRARY - CLEAN EDITORIAL GRID */}
        <section className="py-32 px-6 bg-[#071324]">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
              <div className="space-y-4">
                <span className="text-[10px] font-bold tracking-[0.4em] text-gold uppercase">Acervo Exclusivo</span>
                <h2 className="text-4xl md:text-5xl font-serif text-white">Biblioteca Viva</h2>
              </div>
              <button className="text-[11px] uppercase tracking-widest font-bold text-slate-400 hover:text-white border-b border-slate-700 pb-2 transition-all">
                Ver Tudo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <motion.div 
                whileHover={{ y: -5 }}
                className="md:col-span-8 relative aspect-video md:aspect-auto overflow-hidden rounded-sm cursor-pointer group"
              >
                <div className="absolute inset-0 bg-[#0D1F3D] border border-white/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-8 left-8 right-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-gold" />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-gold">Destaque</span>
                  </div>
                  <h4 className="text-3xl md:text-4xl font-serif text-white">A Alquimia da Solidão</h4>
                  <p className="text-sm text-slate-400 max-w-md line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    Descubra como transformar o silêncio em sua ferramenta mais poderosa de criação e inteligência.
                  </p>
                </div>
              </motion.div>

              <div className="md:col-span-4 grid grid-cols-1 gap-8">
                {[
                  { title: 'Ritual Prático', type: 'Prática', icon: Sparkles },
                  { title: 'Cartas da Noite', type: 'Oráculo', icon: Flower2 }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 0.98 }}
                    className="p-10 bg-[#0D1F3D] border border-white/5 rounded-sm flex flex-col justify-end min-h-[220px] relative group cursor-pointer"
                  >
                    <item.icon className="absolute top-10 right-10 w-12 h-12 text-slate-800 group-hover:text-gold/20 transition-colors" strokeWidth={1} />
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">{item.type}</span>
                      <h4 className="text-2xl font-serif text-slate-200 group-hover:text-white transition-colors">{item.title}</h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5. QUOTE - CINEMATIC BUT READABLE */}
        <section className="py-48 px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="max-w-3xl mx-auto space-y-12"
          >
            <Quote className="w-10 h-10 mx-auto text-gold/30" strokeWidth={1} />
            <p className="text-3xl md:text-5xl font-serif italic text-slate-200 leading-tight">
              "A verdadeira inteligência é a luz que brilha no silêncio da alma."
            </p>
            <div className="flex flex-col items-center gap-8">
              <div className="h-px w-24 bg-gold/50" />
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-[0.5em] text-slate-500 block">Casa Orácula</span>
                <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-gold/60 block">Exclusividade Feminina</span>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* 6. NAVIGATION - CLEAN & FUNCTIONAL */}
      <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-[#0A192F]/80 backdrop-blur-xl border border-white/10 rounded-full px-8 py-4 flex items-center gap-10 md:gap-14 shadow-2xl">
          {[
            { icon: LayoutDashboard, active: true },
            { icon: BookOpen },
            { icon: Sparkles },
            { icon: Flower2 },
            { icon: Library },
          ].map((item, i) => (
            <button key={i} className="relative group p-2">
              <item.icon className={`w-6 h-6 transition-all ${item.active ? 'text-white' : 'text-slate-500 group-hover:text-slate-200'}`} strokeWidth={1.5} />
              {item.active && (
                <motion.div 
                  layoutId="activeNavPoint"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gold rounded-full shadow-[0_0_10px_gold]" 
                />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
