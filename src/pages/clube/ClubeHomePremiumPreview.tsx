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
  Quote,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// DESIGN SYSTEM: CASA ORÁCULA - NETFLIX PREMIUM EDITION
// Color Palette: Deepest Navy (#010816), Gold (#C9A96E), Slate-200
// Typography: Editorial Serif + Minimalist Sans

export default function ClubeHomePremiumPreview() {
  const containerRef = useRef(null);

  return (
    <div className="min-h-screen bg-[#010816] text-white selection:bg-gold/20 font-sans overflow-x-hidden pb-32" ref={containerRef}>
      
      {/* CINEMATIC ATMOSPHERE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020D24] via-[#010816] to-[#010610]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-soft-light" />
      </div>

      <main className="relative z-10">
        
        {/* 1. CINEMATIC HERO - THE CURRENT JOURNEY */}
        <section className="relative h-[85vh] md:h-[90vh] flex flex-col justify-end px-6 md:px-12 lg:px-20 pb-20 md:pb-32">
          {/* Background Image / Gradient for Hero */}
          <div className="absolute inset-0 z-[-1] overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-t from-[#010816] via-transparent to-transparent z-10" />
             <div className="absolute inset-0 bg-gradient-to-r from-[#010816] via-[#010816]/40 to-transparent z-10" />
             <motion.div 
               initial={{ scale: 1.1, opacity: 0 }}
               animate={{ scale: 1, opacity: 0.5 }}
               transition={{ duration: 2 }}
               className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518005020250-6759229547b8?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale" 
             />
          </div>

          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="max-w-3xl space-y-6 md:space-y-8"
          >
            <div className="flex items-center gap-4">
              <span className="bg-gold/20 text-gold text-[10px] font-bold px-3 py-1 rounded-sm border border-gold/30 tracking-[0.2em] uppercase">
                Em progresso
              </span>
              <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-white/40">
                CAPÍTULO II • IMERSÃO
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-serif leading-[0.85] tracking-tighter">
              A Bússola da <br />
              <span className="italic font-light text-slate-300">Intuição.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed max-w-xl italic">
              "Onde o silêncio se encontra com a inteligência, a travessia se torna revelação."
            </p>

            <div className="flex flex-wrap gap-4 pt-6">
              <Button size="lg" className="h-16 px-12 rounded-sm bg-white text-black hover:bg-gold transition-all duration-500 text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-3">
                <Play className="w-4 h-4 fill-current" />
                Retomar agora
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 rounded-sm border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-[0.3em]">
                Detalhes da Jornada
              </Button>
            </div>
          </motion.div>
        </section>

        {/* 2. HORIZONTAL SECTIONS (Netflix Rows) */}
        <div className="space-y-16 md:space-y-24 px-6 md:px-12 lg:px-20 -mt-12">
          
          {/* CONTINUE DE ONDE PAROU */}
          <HorizontalRow title="Continue de onde parou">
            {[
              { title: 'O Silêncio Revelador', sub: 'Aula 04 • 12min restantes', progress: 72, img: 'https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&q=80' },
              { title: 'Ritual de Limpeza', sub: 'Prática • 5min restantes', progress: 40, img: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80' },
              { title: 'Arquétipos Regentes', sub: 'Aula 02 • Finalizada', progress: 100, img: 'https://images.unsplash.com/photo-1518005020250-6759229547b8?auto=format&fit=crop&q=80' },
            ].map((item, i) => (
              <NetflixCard key={i} item={item} showProgress />
            ))}
          </HorizontalRow>

          {/* PRÓXIMOS PORTAIS */}
          <HorizontalRow title="Próximos Portais">
            {[
              { title: 'O Labirinto das Sombras', sub: 'Capítulo III • 50 min', locked: true, img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80' },
              { title: 'Integração de Luz', sub: 'Capítulo IV • 1h 10min', locked: true, img: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80' },
              { title: 'A Grande Obra', sub: 'Masterclass • 2h', locked: true, img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80' },
              { title: 'Alquimia Mental', sub: 'Módulo Bônus', locked: true, img: 'https://images.unsplash.com/photo-1501854140801-50d01674aa3e?auto=format&fit=crop&q=80' },
            ].map((item, i) => (
              <NetflixCard key={i} item={item} aspect="video" />
            ))}
          </HorizontalRow>

          {/* FERRAMENTAS DESBLOQUEADAS */}
          <HorizontalRow title="Ferramentas desbloqueadas">
            {[
              { title: 'Oráculo da Noite', icon: Flower2, sub: 'Consulta Diária' },
              { title: 'Ritual de Foco', icon: Sparkles, sub: 'Prática Ativa' },
              { title: 'Biblioteca de Som', icon: Library, sub: 'Frequências' },
              { title: 'Mapa da Alma', icon: LayoutDashboard, sub: 'Seu Progresso' },
            ].map((item, i) => (
              <ToolCard key={i} item={item} />
            ))}
          </HorizontalRow>

          {/* AO VIVO ESTA SEMANA */}
          <HorizontalRow title="Ao vivo esta semana">
            {[
              { title: 'Mentoria Coletiva', date: 'Quinta, às 20h', type: 'Exclusivo Live', img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80' },
              { title: 'Ritual da Lua Nova', date: 'Sexta, às 22h', type: 'Prática Ao Vivo', img: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&q=80' },
            ].map((item, i) => (
              <LiveCard key={i} item={item} />
            ))}
          </HorizontalRow>

          {/* BIBLIOTECA VIVA */}
          <HorizontalRow title="Biblioteca viva">
            {[
              { title: 'Mulheres que Correm com Lobos', category: 'Clássico', author: 'Clarissa Pinkola Estés' },
              { title: 'A Alquimia da Solidão', category: 'Estudo', author: 'Casa Orácula' },
              { title: 'O Labirinto do Self', category: 'Jung', author: 'C.G. Jung' },
              { title: 'Símbolos Universais', category: 'Acervo', author: 'Joseph Campbell' },
            ].map((item, i) => (
              <BookCard key={i} item={item} />
            ))}
          </HorizontalRow>

        </div>

        {/* 3. CINEMATIC FOOTER */}
        <section className="py-40 text-center px-6 border-t border-white/5 mt-32">
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

      {/* 4. NAVIGATION - CLEAN & FUNCTIONAL */}
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
    </div>
  );
}

// COMPONENT: Horizontal Row
function HorizontalRow({ title, children }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-serif italic text-white/90">{title}</h2>
        <Button variant="link" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white">Ver tudo</Button>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 mask-fade-right">
        {children}
      </div>
    </div>
  );
}

// COMPONENT: Netflix Style Card
function NetflixCard({ item, aspect = "aspect-[16/10]", showProgress = false }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative ${aspect} min-w-[280px] md:min-w-[320px] bg-[#0A1229] rounded-sm overflow-hidden group cursor-pointer border border-white/5 hover:border-gold/30`}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
      <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 grayscale transition-all duration-700" />
      
      {item.locked && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40 backdrop-blur-[2px]">
           <Lock className="w-6 h-6 text-white/40" />
        </div>
      )}

      <div className="absolute bottom-6 left-6 right-6 z-20 space-y-2">
        <span className="text-[9px] uppercase font-bold tracking-widest text-gold/60">{item.sub}</span>
        <h4 className="text-lg font-serif text-white/90 group-hover:text-white transition-colors">{item.title}</h4>
        
        {showProgress && (
          <div className="pt-2">
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-gold" style={{ width: `${item.progress}%` }} />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// COMPONENT: Tool Card
function ToolCard({ item }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="min-w-[200px] md:min-w-[240px] aspect-square bg-white/[0.02] border border-white/5 rounded-sm p-8 flex flex-col justify-between group cursor-pointer hover:bg-white/[0.04] hover:border-gold/20 transition-all duration-700"
    >
      <item.icon className="w-10 h-10 text-white/10 group-hover:text-gold/60 transition-colors duration-700" strokeWidth={1} />
      <div className="space-y-1">
        <span className="text-[9px] uppercase font-bold tracking-widest text-white/30">{item.sub}</span>
        <h4 className="text-xl font-serif text-white/80 group-hover:text-white transition-colors">{item.title}</h4>
      </div>
    </motion.div>
  );
}

// COMPONENT: Live Card
function LiveCard({ item }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="relative aspect-[16/9] min-w-[350px] md:min-w-[450px] bg-[#0A1229] rounded-sm overflow-hidden group cursor-pointer border border-white/5 shadow-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
      <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000" />
      
      <div className="absolute inset-y-0 left-0 w-2/3 p-10 z-20 flex flex-col justify-center space-y-4">
        <div className="flex items-center gap-3">
           <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
           <span className="text-[10px] uppercase font-bold tracking-widest text-white/60">{item.type}</span>
        </div>
        <h4 className="text-3xl font-serif text-white leading-tight">{item.title}</h4>
        <div className="flex items-center gap-2 text-gold font-bold text-[10px] uppercase tracking-widest">
           <Calendar className="w-3 h-3" />
           {item.date}
        </div>
      </div>
    </motion.div>
  );
}

// COMPONENT: Book Card
function BookCard({ item }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="min-w-[200px] md:min-w-[240px] aspect-[3/4] bg-white/[0.03] border border-white/5 rounded-sm p-8 flex flex-col justify-end group cursor-pointer hover:border-gold/30 transition-all duration-1000"
    >
      <div className="space-y-4">
        <span className="text-[9px] uppercase font-bold text-gold/40 tracking-widest">{item.category}</span>
        <div className="space-y-1">
          <h4 className="text-xl font-serif text-white/70 group-hover:text-white transition-colors leading-tight">{item.title}</h4>
          <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">{item.author}</p>
        </div>
        <div className="h-px w-0 group-hover:w-12 bg-gold/40 transition-all duration-1000" />
      </div>
    </motion.div>
  );
}
