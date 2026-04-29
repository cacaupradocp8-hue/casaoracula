import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { 
  Play, 
  Sparkles, 
  Flower2, 
  Library,
  BookOpen,
  ArrowRight,
  Clock,
  CheckCircle2,
  Lock,
  Trophy,
  ArrowUpRight,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CasaOraculaExperiencia() {
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
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#000814] px-6"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-900/10 blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-950/10 blur-[120px]" 
        />
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
            Sua travessia continua aberta
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <button 
            onClick={onEnter}
            className="group relative px-16 py-6 overflow-hidden rounded-full border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:bg-white hover:text-black duration-700"
          >
            <span className="relative z-10 text-[11px] font-bold uppercase tracking-[0.4em]">
              Entrar
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
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const nodes = [
    {
      id: 1,
      title: "O Chamado do Destino",
      description: "A semente da sua travessia foi plantada.",
      status: "concluido",
      time: "15 min",
      type: "Portal"
    },
    {
      id: 2,
      title: "Deserto do Silêncio",
      description: "Onde as vozes externas se calam para o interno falar.",
      status: "concluido",
      time: "22 min",
      type: "Ritual"
    },
    {
      id: 3,
      title: "A Travessia do Barba Azul",
      description: "Enfrentando as sombras que guardam seu próximo portal.",
      status: "ativo",
      time: "8 min restantes",
      type: "Desafio"
    },
    {
      id: 4,
      title: "O Vale das Máscaras",
      description: "Despedindo-se de quem você não é mais.",
      status: "proximo",
      time: "12 min",
      type: "Encontro"
    },
    {
      id: 5,
      title: "O Alvorecer da Essência",
      description: "A integração final da jornada atual.",
      status: "proximo",
      time: "30 min",
      type: "Celebração"
    }
  ];

  return (
    <motion.main 
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="relative z-10"
    >
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#000814]" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      </div>

      <div className="relative z-10">
        {/* HERO PREMIUM */}
        <section className="relative h-screen flex flex-col justify-center items-center px-6 text-center">
          <div className="absolute inset-0 z-[-1] overflow-hidden">
            <motion.div 
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.2 }}
              transition={{ duration: 3 }}
              className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale brightness-50" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#000814] via-[#000814]/40 to-transparent" />
          </div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="max-w-4xl space-y-8"
          >
            <div className="space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-[0.5em] text-blue-400/80">
                Continue no Portal
              </span>
              <h2 className="text-6xl md:text-8xl lg:text-9xl font-serif font-light leading-none italic text-slate-100 tracking-tighter">
                Barba Azul
              </h2>
            </div>

            <p className="text-lg md:text-xl text-white/40 font-light leading-relaxed max-w-xl mx-auto italic">
              "A chave proibida é a que abre a porta da sua própria libertação."
            </p>

            <div className="flex justify-center pt-8">
              <Button size="lg" className="h-16 px-12 rounded-full bg-white text-black hover:bg-blue-50 transition-all duration-700 text-[11px] font-bold uppercase tracking-[0.4em] flex items-center gap-4 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                <Play className="w-4 h-4 fill-current" />
                Retomar Travessia
              </Button>
            </div>
          </motion.div>

          {/* SCROLL INDICATOR */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          >
            <span className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-medium italic">A Estrada Monumental</span>
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-px h-16 bg-gradient-to-b from-blue-500/40 to-transparent" 
            />
          </motion.div>
        </section>

        {/* ESTRADA MONUMENTAL SECTION */}
        <section className="relative max-w-6xl mx-auto px-6 py-40">
           {/* ESTRADA INFRASTRUCTURE */}
           <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-white/[0.03] -translate-x-1/2" />
           <motion.div 
              style={{ scaleY }}
              className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-600 via-blue-400 to-transparent -translate-x-1/2 origin-top shadow-[0_0_30px_rgba(59,130,246,0.3)] z-0"
           />

           {/* CARDS LATERAIS (Floating Context) */}
           <div className="hidden lg:block">
              {/* Próxima Aula */}
              <SideFloatingCard 
                top="35%" 
                left="10%" 
                icon={Target} 
                label="Próxima Aula" 
                title="O Quarto Proibido" 
                sub="Análise Junguiana"
              />
              {/* Recompensa */}
              <SideFloatingCard 
                top="55%" 
                right="10%" 
                icon={Trophy} 
                label="Recompensa" 
                title="A Chave de Prata" 
                sub="Artefato Desbloqueado"
                variant="gold"
              />
              {/* Ferramenta Nova */}
              <SideFloatingCard 
                top="75%" 
                left="12%" 
                icon={Sparkles} 
                label="Ferramenta Nova" 
                title="Espelho de Sombra" 
                sub="Psicometria Ativa"
              />
           </div>

           <div className="relative z-10 space-y-80 py-40">
              {nodes.map((node, index) => (
                <NodeItem key={node.id} node={node} index={index} />
              ))}
           </div>
        </section>

        {/* FOOTER - PROGRESSO ACUMULADO */}
        <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 border-t border-white/5 bg-gradient-to-b from-transparent to-blue-950/20 py-40">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2 }}
            className="text-center space-y-16 max-w-2xl"
          >
            <div className="space-y-8">
              <span className="text-[10px] uppercase font-bold tracking-[0.5em] text-white/20">Sua Maestria</span>
              <h2 className="text-5xl md:text-7xl font-light font-serif italic text-white/95 tracking-tighter">Progresso Acumulado</h2>
              <p className="text-white/40 text-sm md:text-lg leading-relaxed tracking-wide font-light max-w-lg mx-auto italic">
                Sua presença na Casa Orácula não é apenas tempo, é alquimia. <br className="hidden md:block" />
                Cada portal atravessado transmuta sua visão de mundo.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8 md:gap-24">
              <StatItem label="Portais" value="07" />
              <StatItem label="Rituais" value="32" />
              <StatItem label="Nível" value="18" />
            </div>

            <div className="pt-12">
               <button className="px-12 py-5 bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-full transition-all hover:bg-white hover:text-black duration-700">
                  Explorar Mapa Completo
               </button>
            </div>
          </motion.div>

          <div className="absolute bottom-20 text-center">
              <p className="text-[9px] uppercase font-bold tracking-[1em] text-white/5">Casa Orácula</p>
          </div>
        </section>
      </div>

      {/* FLOATING RETOMAR (Always present after hero) */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "-200px" }}
        className="fixed bottom-10 right-8 z-50 lg:hidden"
      >
        <button className="bg-blue-600 p-5 rounded-full shadow-2xl">
           <Play className="w-6 h-6 fill-white" />
        </button>
      </motion.div>
    </motion.main>
  );
}

// ─── HELPER COMPONENTS ────────────────────────────────────────

function SideFloatingCard({ top, left, right, icon: Icon, label, title, sub, variant = 'blue' }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: left ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ top, left, right }}
      className="fixed z-20 w-64 p-6 bg-[#000814]/40 backdrop-blur-3xl border border-white/5 rounded-2xl space-y-4"
    >
      <div className={`flex items-center gap-3 ${variant === 'gold' ? 'text-amber-400' : 'text-blue-400'}`}>
        <Icon className="w-4 h-4" strokeWidth={1.5} />
        <span className="text-[9px] font-bold uppercase tracking-[0.2em]">{label}</span>
      </div>
      <div className="space-y-1">
        <h4 className="text-lg font-serif italic text-white/90">{title}</h4>
        <p className="text-[10px] text-white/30 uppercase tracking-widest">{sub}</p>
      </div>
      <div className="pt-2">
         <button className="text-[9px] uppercase tracking-widest text-white/20 hover:text-white transition-colors flex items-center gap-2">
            Ver detalhes <ArrowUpRight className="w-3 h-3" />
         </button>
      </div>
    </motion.div>
  );
}

const NodeItem = ({ node, index }: { node: any, index: number }) => {
  const isLeft = index % 2 === 0;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex items-center gap-8 md:gap-24 ${isLeft ? 'flex-row' : 'flex-row-reverse'} w-full`}
    >
      {/* Content */}
      <div className={`flex-1 ${isLeft ? 'text-right' : 'text-left'} space-y-6`}>
        <div className="space-y-4">
          <span className="text-[10px] uppercase tracking-[0.4em] text-blue-400/60 font-bold">
            {node.type} • {node.time}
          </span>
          <h3 className={`text-3xl md:text-5xl lg:text-6xl font-serif font-light tracking-tighter text-white/95 leading-none italic ${node.status === 'proximo' ? 'opacity-20' : ''}`}>
            {node.title}
          </h3>
          <p className="text-sm md:text-lg text-white/30 max-w-sm inline-block leading-relaxed font-light italic">
            {node.description}
          </p>
        </div>
        
        {node.status === 'ativo' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 text-white/60 text-[10px] font-bold uppercase tracking-[0.3em] mt-8 justify-end"
          >
            <span className="italic">Ponto de travessia atual</span>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
          </motion.div>
        )}
      </div>

      {/* Node Circle */}
      <div className="relative z-20 flex-shrink-0 group">
        <motion.div 
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`
            w-24 h-24 md:w-36 md:h-36 rounded-full flex items-center justify-center border transition-all duration-700
            ${node.status === 'concluido' ? 'bg-blue-600/5 border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.1)]' : 
              node.status === 'ativo' ? 'bg-[#000814] border-white/40 shadow-[0_0_60px_rgba(255,255,255,0.2)] scale-110' : 
              'bg-black/60 border-white/5 opacity-40'}
          `}
        >
          {node.status === 'concluido' ? (
            <CheckCircle2 className="w-8 h-8 md:w-12 md:h-12 text-blue-400/60 stroke-[1]" />
          ) : node.status === 'ativo' ? (
            <div className="relative flex items-center justify-center">
              <Sparkles className="w-10 h-10 md:w-16 md:h-16 text-white stroke-[1] relative z-10" />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-25px] border border-dashed border-white/20 rounded-full"
              />
              <motion.div 
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-[-15px] bg-white/5 rounded-full blur-xl"
              />
            </div>
          ) : (
            <Lock className="w-6 h-6 md:w-10 md:h-10 text-white/10 stroke-[1]" />
          )}
        </motion.div>
        
        {/* Glow effect for active node */}
        {node.status === 'ativo' && (
          <>
            <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-[80px] animate-pulse -z-10" />
            <div className="absolute inset-[-60px] rounded-full bg-white/5 blur-[40px] -z-20" />
          </>
        )}
      </div>

      {/* Empty space for balance on desktop */}
      <div className="flex-1 hidden md:block" />
    </motion.div>
  );
};

const StatItem = ({ label, value }: { label: string, value: string }) => (
  <div className="space-y-4">
    <div className="text-5xl md:text-8xl font-light text-white font-serif italic tracking-tighter leading-none">{value}</div>
    <div className="text-[10px] uppercase tracking-[0.5em] text-white/20 font-bold">{label}</div>
  </div>
);
