import React, { useState, useRef, useEffect } from 'react';
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
  Target,
  User,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";

export default function CasaOraculaExperienciaEvoluida() {
  const [isOpened, setIsOpened] = useState(false);
  const { user } = useAuth();

  // 1. Hero contextual inteligente e Stats
  const { data: stats } = useQuery({
    queryKey: ['user-journey-stats', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_journey_stats')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || {
        current_portal_name: "Barba Azul",
        mastery_level: 1,
        rituals_completed: 0,
        portals_crossed: 0
      };
    },
    enabled: !!user
  });

  // 2. Estrada personalizada por usuária
  const { data: nodes } = useQuery({
    queryKey: ['user-road-nodes', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_road_nodes')
        .select('*')
        .eq('user_id', user?.id)
        .order('position_order', { ascending: true });
      if (error) throw error;
      return data && data.length > 0 ? data : [
        { id: '1', title: "O Chamado do Destino", description: "A semente da sua travessia foi plantada.", status: "concluido", node_type: "Portal", estimated_minutes: 15, position_order: 1 },
        { id: '2', title: "Deserto do Silêncio", description: "Vozes externas se calam para o interno falar.", status: "concluido", node_type: "Ritual", estimated_minutes: 22, position_order: 2 },
        { id: '3', title: `A Travessia do ${stats?.current_portal_name || 'Barba Azul'}`, description: "Enfrentando as sombras que guardam seu portal.", status: "ativo", node_type: "Desafio", remaining_minutes: 8, position_order: 3 },
        { id: '4', title: "O Vale das Máscaras", description: "Despedindo-se de quem você não é mais.", status: "proximo", node_type: "Encontro", estimated_minutes: 12, position_order: 4 },
        { id: '5', title: "O Alvorecer da Essência", description: "A integração final da jornada atual.", status: "proximo", node_type: "Celebração", estimated_minutes: 30, position_order: 5 }
      ];
    },
    enabled: !!user
  });

  // 3. Recompensas simbólicas desbloqueáveis
  const { data: rewards } = useQuery({
    queryKey: ['user-rewards', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_unlocked_rewards')
        .select('*, reward:symbolic_rewards(*)')
        .eq('user_id', user?.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  return (
    <div className="min-h-screen bg-[#000814] text-white selection:bg-blue-900/30 font-sans overflow-x-hidden">
      <AnimatePresence mode="wait">
        {!isOpened ? (
          <Abertura key="abertura" onEnter={() => setIsOpened(true)} />
        ) : (
          <Home key="home" stats={stats} nodes={nodes} rewards={rewards} />
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
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-900/10 blur-[120px]" />
        <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.15, 0.1] }} transition={{ duration: 12, repeat: Infinity }} className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-950/10 blur-[120px]" />
      </div>
      <div className="relative z-10 text-center space-y-12">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-serif tracking-[0.2em] uppercase font-light">Casa Orácula</h1>
          <p className="text-sm md:text-base font-light tracking-[0.5em] text-white/40 uppercase">Sua travessia continua aberta</p>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.8 }}>
          <button onClick={onEnter} className="group relative px-16 py-6 overflow-hidden rounded-full border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:bg-white hover:text-black duration-700">
            <span className="relative z-10 text-[11px] font-bold uppercase tracking-[0.4em]">Entrar</span>
            <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── HOME SCREEN ──────────────────────────────────────────────

function Home({ stats, nodes, rewards }: any) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.main ref={containerRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} className="relative z-10">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#000814]" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      </div>

      <div className="relative z-10">
        {/* HERO PREMIUM CONTEXTUAL */}
        <section className="relative h-screen flex flex-col justify-center items-center px-6 text-center">
          <div className="absolute inset-0 z-[-1] overflow-hidden">
            <motion.div initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 0.2 }} transition={{ duration: 3 }} className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale brightness-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#000814] via-[#000814]/40 to-transparent" />
          </div>

          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.2, delay: 0.5 }} className="max-w-4xl space-y-8">
            <div className="space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-[0.5em] text-blue-400/80">Continue no Portal</span>
              <h2 className="text-6xl md:text-8xl lg:text-9xl font-serif font-light leading-none italic text-slate-100 tracking-tighter">
                {stats?.current_portal_name || "Barba Azul"}
              </h2>
            </div>
            <p className="text-lg md:text-xl text-white/40 font-light max-w-xl mx-auto italic">"Onde a verdade encontra o mistério, sua alma encontra o caminho."</p>
            <div className="flex justify-center pt-8">
              <Button size="lg" className="h-16 px-12 rounded-full bg-white text-black hover:bg-blue-50 transition-all duration-700 text-[11px] font-bold uppercase tracking-[0.4em] flex items-center gap-4">
                <Play className="w-4 h-4 fill-current" /> Retomar Travessia
              </Button>
            </div>
          </motion.div>
        </section>

        {/* ESTRADA DINÂMICA */}
        <section className="relative max-w-6xl mx-auto px-6 py-40">
           <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-white/[0.03] -translate-x-1/2" />
           <motion.div style={{ scaleY }} className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-600 via-blue-400 to-transparent -translate-x-1/2 origin-top shadow-[0_0_30px_rgba(59,130,246,0.3)] z-0" />

           {/* CARDS DINÂMICOS LATERAIS */}
           <div className="hidden lg:block">
              <SideFloatingCard top="35%" left="10%" icon={Target} label="Sua Próxima Meta" title="O Segredo do Fogo" sub="Aula 07 • Pendente" />
              <SideFloatingCard top="55%" right="10%" icon={Crown} label="Ranking de Maestria" title={`Nível ${stats?.mastery_level || 1}`} sub="Top 5% das Alquimistas" variant="gold" />
           </div>

           <div className="relative z-10 space-y-80 py-40">
              {nodes?.map((node: any, index: number) => (
                <NodeItem key={node.id} node={node} index={index} />
              ))}
           </div>
        </section>

        {/* RECOMPENSAS SIMBÓLICAS E PROGRESSO */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 border-t border-white/5 bg-gradient-to-b from-transparent to-blue-950/20 py-40">
          <div className="text-center space-y-16 max-w-4xl">
            <div className="space-y-8">
              <h2 className="text-5xl md:text-7xl font-light font-serif italic text-white/95 tracking-tighter">Progresso Acumulado</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <StatItem label="Portais" value={String(stats?.portals_crossed || 0).padStart(2, '0')} />
                <StatItem label="Rituais" value={String(stats?.rituals_completed || 0).padStart(2, '0')} />
                <StatItem label="Maestria" value={String(stats?.mastery_level || 1).padStart(2, '0')} />
                <StatItem label="Horas" value={String(Math.floor((stats?.total_minutes_invested || 0) / 60)).padStart(2, '0')} />
              </div>
            </div>

            {/* Symbolic Rewards Grid */}
            <div className="space-y-8 pt-20">
               <h3 className="text-xl font-serif italic text-white/40 uppercase tracking-[0.3em]">Artefatos da Travessia</h3>
               <div className="flex flex-wrap justify-center gap-10">
                  {rewards?.map((r: any) => (
                    <RewardItem key={r.id} reward={r.reward} />
                  )) || <p className="text-white/10 italic">Nenhum artefato desbloqueado ainda.</p>}
               </div>
            </div>
          </div>
        </section>
      </div>
    </motion.main>
  );
}

// ─── HELPER COMPONENTS ────────────────────────────────────────

function SideFloatingCard({ top, left, right, icon: Icon, label, title, sub, variant = 'blue' }: any) {
  return (
    <motion.div initial={{ opacity: 0, x: left ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1.5 }} style={{ top, left, right }} className="fixed z-20 w-64 p-6 bg-[#000814]/40 backdrop-blur-3xl border border-white/5 rounded-2xl space-y-4">
      <div className={`flex items-center gap-3 ${variant === 'gold' ? 'text-amber-400' : 'text-blue-400'}`}>
        <Icon className="w-4 h-4" strokeWidth={1.5} />
        <span className="text-[9px] font-bold uppercase tracking-[0.2em]">{label}</span>
      </div>
      <div className="space-y-1">
        <h4 className="text-lg font-serif italic text-white/90">{title}</h4>
        <p className="text-[10px] text-white/30 uppercase tracking-widest">{sub}</p>
      </div>
    </motion.div>
  );
}

function NodeItem({ node, index }: any) {
  const isLeft = index % 2 === 0;
  return (
    <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }} className={`relative flex items-center gap-8 md:gap-24 ${isLeft ? 'flex-row' : 'flex-row-reverse'} w-full`}>
      <div className={`flex-1 ${isLeft ? 'text-right' : 'text-left'} space-y-4`}>
        <span className="text-[10px] uppercase tracking-[0.4em] text-blue-400/60 font-bold">{node.node_type} • {node.status === 'ativo' ? `${node.remaining_minutes} min rest.` : `${node.estimated_minutes} min`}</span>
        <h3 className={`text-3xl md:text-5xl lg:text-6xl font-serif font-light tracking-tighter text-white/95 italic ${node.status === 'proximo' ? 'opacity-20' : ''}`}>{node.title}</h3>
        <p className="text-sm md:text-lg text-white/30 max-w-sm inline-block font-light italic">{node.description}</p>
      </div>
      <div className="relative z-20 flex-shrink-0">
        <div className={`w-24 h-24 md:w-36 md:h-36 rounded-full flex items-center justify-center border transition-all duration-700 ${node.status === 'concluido' ? 'bg-blue-600/5 border-blue-500/20' : node.status === 'ativo' ? 'bg-[#000814] border-white/40 scale-110 shadow-[0_0_50px_rgba(255,255,255,0.1)]' : 'bg-black/60 border-white/5 opacity-40'}`}>
          {node.status === 'concluido' ? <CheckCircle2 className="w-8 h-8 text-blue-400/60 stroke-[1]" /> : node.status === 'ativo' ? <Sparkles className="w-10 h-10 text-white stroke-[1]" /> : <Lock className="w-6 h-6 text-white/10 stroke-[1]" />}
        </div>
      </div>
      <div className="flex-1 hidden md:block" />
    </motion.div>
  );
}

function RewardItem({ reward }: any) {
  return (
    <motion.div whileHover={{ scale: 1.1, y: -10 }} className="flex flex-col items-center gap-4 group cursor-pointer">
      <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center bg-white/5 relative overflow-hidden transition-all duration-500 group-hover:border-blue-400/40 group-hover:bg-blue-900/10">
         <Trophy className="w-8 h-8 text-white/20 group-hover:text-blue-400 transition-colors" />
         <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/30 group-hover:text-white transition-colors">{reward.name}</span>
    </motion.div>
  );
}

function StatItem({ label, value }: any) {
  return (
    <div className="space-y-2">
      <div className="text-4xl md:text-6xl font-light text-white font-serif italic tracking-tighter">{value}</div>
      <div className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-bold">{label}</div>
    </div>
  );
}
