import React from 'react';
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
  Zap
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

  // ROAD DATA
  const roadSteps = [
    { id: 1, title: 'O Despertar da Voz Interior', status: 'completed', duration: '45 min', type: 'Portal' },
    { id: 2, title: 'A Bússola da Intuição', status: 'current', duration: '1h 20min', type: 'Imersão', description: 'Onde o silêncio se encontra com a inteligência.' },
    { id: 3, title: 'O Labirinto das Sombras', status: 'locked', duration: '50 min', type: 'Enigma' },
    { id: 4, title: 'Integração de Luz', status: 'locked', duration: '1h 10min', type: 'Ritual' },
    { id: 5, title: 'A Grande Obra', status: 'locked', duration: '2h', type: 'Masterclass' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-gold/20 font-sans" ref={containerRef}>
      {/* Premium Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1229] via-[#020617] to-[#010208]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        {/* Subtle Ambient Glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gold/5 blur-[100px]" />
      </div>

      {/* Header / Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gold/40 origin-left z-50"
        style={{ scaleX }}
      />

      <main className="relative z-10 px-6 md:px-12 lg:px-24 pt-12 pb-32 max-w-7xl mx-auto">
        
        {/* UPPER SECTION: CARDS & GREETING */}
        <section className="mb-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-gold/80">CASA ORÁCULA • PREMIUM</span>
              <h1 className="text-4xl md:text-5xl font-serif">Bem-vinda, <span className="italic">Claudia</span></h1>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/5 border border-white/10 rounded-sm px-6 py-3 flex items-center gap-3">
                <Trophy className="w-4 h-4 text-gold" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-bold text-white/40 tracking-widest">Nível</span>
                  <span className="text-sm font-bold leading-none">Sacerdotisa Iniciante</span>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-sm px-6 py-3 flex items-center gap-3">
                <Zap className="w-4 h-4 text-blue-400" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-bold text-white/40 tracking-widest">Atividade</span>
                  <span className="text-sm font-bold leading-none">12 dias seguidos</span>
                </div>
              </div>
            </div>
          </div>

          {/* NEXT STEP HIGHLIGHT CARD (Strong CTA) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative overflow-hidden rounded-sm bg-white text-black p-8 md:p-12 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Play className="w-64 h-64" fill="currentColor" />
            </div>
            <div className="relative z-10 space-y-4 max-w-xl text-center md:text-left">
              <span className="text-[10px] uppercase font-bold tracking-widest text-black/40">Continuar de onde parou</span>
              <h2 className="text-3xl md:text-5xl font-serif leading-tight">A Bússola da Intuição</h2>
              <p className="text-sm md:text-base text-black/60 font-medium">Você concluiu 72% do Capítulo I. Inicie agora a aula "O Silêncio Revelador".</p>
            </div>
            <div className="relative z-10">
              <Button size="lg" className="h-16 px-12 rounded-sm bg-black text-white hover:bg-black/90 text-sm font-bold uppercase tracking-widest group-hover:scale-105 transition-transform shadow-xl">
                Retomar agora
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </section>

        {/* THE ROAD SECTION (Core Foundation) */}
        <section className="mb-32 relative">
          <div className="flex items-center gap-6 mb-16">
            <h2 className="text-3xl font-serif">Sua Estrada</h2>
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-white/30">O Caminho da Alma</span>
          </div>

          <div className="relative">
            {/* The Vertical Path Line */}
            <div className="absolute left-[30px] md:left-1/2 top-0 bottom-0 w-px bg-white/10 overflow-hidden">
               <motion.div 
                 style={{ scaleY: scrollYProgress, transformOrigin: 'top' }}
                 className="absolute inset-0 bg-gold"
               />
            </div>

            <div className="space-y-12">
              {roadSteps.map((step, i) => (
                <div key={step.id} className={`flex items-start md:items-center ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} relative`}>
                  
                  {/* Marker */}
                  <div className="absolute left-[30px] md:left-1/2 -translate-x-1/2 z-10 mt-1 md:mt-0">
                    <div className={`w-8 h-8 rounded-full border-4 border-[#020617] flex items-center justify-center transition-all duration-500 shadow-xl
                      ${step.status === 'completed' ? 'bg-gold' : step.status === 'current' ? 'bg-white ring-8 ring-white/10 scale-125' : 'bg-[#1A1D2D]'}`}
                    >
                      {step.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-[#020617]" />}
                      {step.status === 'current' && <Play className="w-3 h-3 text-[#020617] ml-0.5" fill="currentColor" />}
                      {step.status === 'locked' && <Lock className="w-3 h-3 text-white/20" />}
                    </div>
                  </div>

                  {/* Step Card */}
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -2 }}
                    className={`ml-16 md:ml-0 md:w-[45%] bg-white/[0.03] border border-white/5 rounded-sm p-6 md:p-10 transition-all hover:bg-white/[0.05] hover:border-white/10 shadow-lg
                      ${step.status === 'current' ? 'border-gold/30 bg-white/[0.05]' : 'opacity-60'}
                    `}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${step.status === 'current' ? 'text-gold' : 'text-white/40'}`}>
                        {step.type} • {step.duration}
                      </span>
                      {step.status === 'completed' && <span className="text-[10px] text-gold/60 font-bold uppercase">Concluído</span>}
                    </div>
                    <h3 className={`text-xl md:text-2xl font-serif mb-4 ${step.status === 'locked' ? 'text-white/30' : 'text-white'}`}>
                      {step.title}
                    </h3>
                    {step.description && (
                      <p className="text-sm text-white/40 leading-relaxed font-light mb-6">{step.description}</p>
                    )}
                    {step.status === 'current' && (
                      <Button variant="link" className="p-0 h-auto text-gold text-[10px] font-bold uppercase tracking-[0.2em] hover:text-gold/80 flex items-center gap-2">
                        Iniciar Atravessia <ArrowUpRight className="w-3 h-3" />
                      </Button>
                    )}
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LIBRARY / CURATED CONTENT (Functional Grid) */}
        <section className="mb-20">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-serif italic">Biblioteca Viva</h2>
            <Button variant="ghost" className="text-white/40 text-[10px] font-bold uppercase tracking-widest hover:text-white">Ver Acervo</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Mulheres que Correm com Lobos', category: 'Clássico', icon: BookOpen },
              { title: 'Ritual de Proteção Diária', category: 'Prática', icon: Sparkles },
              { title: 'O Labirinto do Self', category: 'Estudo', icon: Library }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white/[0.03] border border-white/5 rounded-sm p-8 flex flex-col justify-between aspect-[4/3] group cursor-pointer hover:border-gold/30 transition-all"
              >
                <item.icon className="w-10 h-10 text-white/20 group-hover:text-gold transition-colors" strokeWidth={1} />
                <div className="space-y-2">
                  <span className="text-[9px] uppercase font-bold text-gold/60 tracking-widest">{item.category}</span>
                  <h4 className="text-xl font-serif text-white/80 group-hover:text-white transition-colors">{item.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FOOTER QUOTE */}
        <section className="py-24 text-center border-t border-white/5">
           <QuoteIcon className="w-12 h-12 mx-auto mb-10 text-white/10" />
           <p className="text-2xl md:text-3xl font-serif italic text-white/40 leading-relaxed max-w-2xl mx-auto">
             "Sua travessia não é sobre chegar, mas sobre tornar-se."
           </p>
        </section>
      </main>

      {/* MOBILE BOTTOM NAVIGATION (Modern & Clean) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 md:pb-10 pointer-events-none">
        <div className="max-w-md mx-auto bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full px-8 py-4 flex justify-between items-center pointer-events-auto shadow-2xl">
          {[
            { icon: LayoutDashboard, active: true },
            { icon: BookOpen },
            { icon: Sparkles },
            { icon: Flower2 },
            { icon: Library },
          ].map((item, i) => (
            <button key={i} className={`relative p-2 group`}>
              <item.icon className={`w-6 h-6 transition-all duration-300 ${item.active ? 'text-white' : 'text-white/20 group-hover:text-white/60'}`} strokeWidth={1.5} />
              {item.active && (
                <motion.div 
                  layoutId="activeNavPoint"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-gold rounded-full shadow-[0_0_10px_gold]" 
                />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

function QuoteIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
    </svg>
  );
}
