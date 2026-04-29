import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Sparkles, 
  Flower2, 
  Library,
  Calendar,
  BookOpen,
  ArrowUpRight,
  ChevronRight,
  Lock,
  Quote
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PortalLuxo() {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <div className="min-h-screen bg-[#000814] text-white selection:bg-blue-900/30 font-sans overflow-x-hidden">
      <AnimatePresence mode="wait">
        {!isOpened ? (
          <Abertura key="abertura" onEnter={() => setIsOpened(true)} />
        ) : (
          <Home key="home" />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── ABERTURA SCREEN ──────────────────────────────────────────

function Abertura({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#000814] px-6"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-950/10 blur-[120px]" />
      </div>

      <div className="relative z-10 text-center space-y-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="space-y-4"
        >
          <h1 className="text-5xl md:text-7xl font-serif tracking-[0.2em] uppercase font-light">
            Casa Orácula
          </h1>
          <p className="text-sm md:text-base font-light tracking-[0.5em] text-white/40 uppercase">
            Sua travessia está aberta
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <button 
            onClick={onEnter}
            className="group relative px-12 py-5 overflow-hidden rounded-full border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:bg-white hover:text-black duration-700"
          >
            <span className="relative z-10 text-[10px] font-bold uppercase tracking-[0.3em]">
              Entrar no Portal
            </span>
            <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── HOME SCREEN ──────────────────────────────────────────────

function Home() {
  return (
    <motion.main 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.2 }}
      className="relative z-10 pb-32"
    >
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#000C24] via-[#000814] to-[#00050A]" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      </div>

      <div className="relative z-10">
        {/* HERO PREMIUM */}
        <section className="relative min-h-[70vh] flex flex-col justify-end px-6 md:px-12 lg:px-24 pb-20 pt-32">
          <div className="absolute inset-0 z-[-1] overflow-hidden">
            <motion.div 
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.3 }}
              transition={{ duration: 2.5 }}
              className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale brightness-50" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#000814] via-transparent to-transparent" />
          </div>

          <div className="max-w-4xl space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-white/30">
                Portal Atual
              </span>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light leading-[1.1] italic text-slate-200">
                A Jornada do Silêncio
              </h2>
            </div>

            <p className="text-lg md:text-xl text-white/50 font-light leading-relaxed max-w-xl italic">
              "Para ouvir a própria alma, é preciso primeiro silenciar o mundo."
            </p>

            <div className="flex flex-wrap gap-6 pt-4">
              <Button size="lg" className="h-14 px-10 rounded-none bg-white text-black hover:bg-blue-100 transition-all duration-500 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-3">
                <Play className="w-4 h-4 fill-current" />
                Continuar jornada
              </Button>
            </div>
          </div>
        </section>

        {/* CONTENT SECTIONS */}
        <div className="space-y-24 px-6 md:px-12 lg:px-24 mt-12">
          
          <HorizontalRow title="Seu próximo movimento">
            {[
              { title: 'O Vazio Fértil', sub: 'Aula 03 • Retomar', progress: 45, img: 'https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&q=80' },
              { title: 'Ritual de Presença', sub: 'Prática • 12min', progress: 10, img: 'https://images.unsplash.com/photo-1518005020250-6759229547b8?auto=format&fit=crop&q=80' },
              { title: 'O Labirinto Interno', sub: 'Estudo • Iniciar', progress: 0, img: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80' },
            ].map((item, i) => (
              <PortalCard key={i} item={item} />
            ))}
          </HorizontalRow>

          <HorizontalRow title="Ferramentas liberadas">
            {[
              { title: 'Oráculo Diário', icon: Sparkles, sub: 'Intuição' },
              { title: 'Templo de Escuta', icon: Library, sub: 'Frequências' },
              { title: 'Jardim da Psique', icon: Flower2, sub: 'Reflexão' },
              { title: 'Mapa Vivo', icon: BookOpen, sub: 'Direção' },
            ].map((item, i) => (
              <ToolCard key={i} item={item} />
            ))}
          </HorizontalRow>

          <HorizontalRow title="Biblioteca viva">
            {[
              { title: 'O Eu Profundo', cat: 'Essencial', author: 'Casa Orácula' },
              { title: 'Alquimia da Alma', cat: 'Estudo', author: 'C.G. Jung' },
              { title: 'Simbolismo Sagrado', cat: 'Módulo I', author: 'Joseph Campbell' },
              { title: 'O Despertar da Heroína', cat: 'Guia', author: 'Maureen Murdock' },
            ].map((item, i) => (
              <BookCard key={i} item={item} />
            ))}
          </HorizontalRow>

          <HorizontalRow title="Ao vivo essa semana">
            {[
              { title: 'Encontro de Integração', date: 'Quarta, 20:00', type: 'Live Mentoria', img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80' },
              { title: 'Ritual de Passagem', date: 'Sexta, 21:00', type: 'Prática Coletiva', img: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&q=80' },
            ].map((item, i) => (
              <LiveCard key={i} item={item} />
            ))}
          </HorizontalRow>

        </div>

        {/* FOOTER IMPACTO SILENCIOSO */}
        <section className="py-40 text-center px-6 border-t border-white/5 mt-32">
           <Quote className="w-10 h-10 mx-auto mb-10 text-white/10" strokeWidth={1} />
           <p className="text-2xl md:text-3xl font-serif italic text-white/30 leading-relaxed max-w-2xl mx-auto">
             "A verdadeira jornada não consiste em procurar novas paisagens, mas em ter novos olhos."
           </p>
           <div className="mt-20">
              <span className="text-[10px] uppercase font-bold tracking-[1.5em] text-white/5 block mb-4">Casa Orácula</span>
              <p className="text-[9px] uppercase font-bold tracking-[0.4em] text-white/20 italic">Portal de Luxo Privado</p>
           </div>
        </section>
      </div>

      {/* NAVIGATION INVISIBLE / FLUIDA */}
      <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-[#000814]/40 backdrop-blur-3xl border border-white/5 rounded-full px-8 py-4 flex items-center gap-10 shadow-2xl">
          {[Sparkles, BookOpen, Play, Library, Flower2].map((Icon, i) => (
            <button key={i} className="text-white/20 hover:text-white transition-all duration-500 hover:scale-110 active:scale-90">
              <Icon className="w-5 h-5" strokeWidth={1.5} />
            </button>
          ))}
        </div>
      </nav>
    </motion.main>
  );
}

// ─── HELPER COMPONENTS ────────────────────────────────────────

function HorizontalRow({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl md:text-2xl font-serif italic text-white/80">{title}</h3>
        <button className="text-[9px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors">
          Explorar
        </button>
      </div>
      <div className="flex gap-8 overflow-x-auto pb-6 no-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
        {children}
      </div>
    </div>
  );
}

function PortalCard({ item }: { item: any }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative aspect-video min-w-[300px] md:min-w-[380px] bg-white/[0.02] border border-white/5 overflow-hidden group cursor-pointer"
    >
      <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-50 transition-all duration-1000" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#000814] via-[#000814]/20 to-transparent" />
      
      <div className="absolute bottom-6 left-6 right-6 space-y-3">
        <span className="text-[9px] uppercase font-bold tracking-widest text-white/40">{item.sub}</span>
        <h4 className="text-lg font-serif text-white/90 group-hover:text-white transition-colors">{item.title}</h4>
        
        <div className="h-[2px] w-full bg-white/5 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${item.progress}%` }}
            transition={{ duration: 1.5, delay: 1 }}
            className="h-full bg-white/40" 
          />
        </div>
      </div>
    </motion.div>
  );
}

function ToolCard({ item }: { item: any }) {
  return (
    <motion.div 
      whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.05)' }}
      className="min-w-[200px] aspect-square border border-white/5 p-8 flex flex-col justify-between group cursor-pointer transition-all duration-500"
    >
      <item.icon className="w-8 h-8 text-white/20 group-hover:text-white/80 transition-colors" strokeWidth={1} />
      <div className="space-y-1">
        <span className="text-[9px] uppercase font-bold tracking-widest text-white/20">{item.sub}</span>
        <h4 className="text-lg font-serif text-white/70 group-hover:text-white transition-colors">{item.title}</h4>
      </div>
    </motion.div>
  );
}

function BookCard({ item }: { item: any }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="min-w-[180px] aspect-[3/4] bg-white/[0.02] border border-white/5 p-6 flex flex-col justify-end group cursor-pointer transition-all duration-1000"
    >
      <div className="space-y-4">
        <span className="text-[8px] uppercase font-bold text-white/20 tracking-widest">{item.cat}</span>
        <div className="space-y-1">
          <h4 className="text-lg font-serif text-white/60 group-hover:text-white transition-colors leading-tight">{item.title}</h4>
          <p className="text-[9px] text-white/10 uppercase tracking-widest font-bold">{item.author}</p>
        </div>
      </div>
    </motion.div>
  );
}

function LiveCard({ item }: { item: any }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="relative aspect-video min-w-[320px] md:min-w-[400px] border border-white/5 overflow-hidden group cursor-pointer"
    >
      <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale group-hover:opacity-40 transition-all duration-1000" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#000814] via-transparent to-transparent z-10" />
      
      <div className="absolute inset-y-0 left-0 w-3/4 p-8 z-20 flex flex-col justify-center space-y-4">
        <div className="flex items-center gap-3">
           <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
           <span className="text-[9px] uppercase font-bold tracking-widest text-white/40">{item.type}</span>
        </div>
        <h4 className="text-2xl font-serif text-white leading-tight italic">{item.title}</h4>
        <div className="flex items-center gap-2 text-white/30 font-bold text-[9px] uppercase tracking-widest">
           <Calendar className="w-3 h-3" />
           {item.date}
        </div>
      </div>
    </motion.div>
  );
}
