import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  BookOpen, 
  Sparkles, 
  Check, 
  Zap, 
  Crown, 
  LayoutDashboard, 
  Library, 
  Flower2, 
  GraduationCap,
  Quote,
  Clock,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// --- Premium Components for the Preview ---

const PremiumCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className={`bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

const ClubHero = ({ name }: { name: string }) => (
  <section className="relative pt-16 pb-12 px-6 text-center overflow-hidden">
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-3 relative z-10"
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="h-[1px] w-4 bg-gold/30" />
        <p className="text-[10px] uppercase tracking-[0.5em] text-gold/80 font-semibold">
          Exclusivo Membros
        </p>
        <div className="h-[1px] w-4 bg-gold/30" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight leading-tight">
        Bem-vinda de volta,<br />
        <span className="text-gold italic font-medium">{name}</span>.
      </h1>
      
      <p className="text-sm text-white/30 font-light tracking-[0.05em] max-w-xs mx-auto pt-2">
        A quietude da noite é o portal para sua evolução.
      </p>
    </motion.div>
  </section>
);

const JourneyRoad = () => {
  const steps = [
    { id: 1, name: 'Portal 1', title: 'O Chamado Selvagem', status: 'completed', side: 'left' },
    { id: 2, name: 'Aula Semanal', title: 'A Cartografia da Alma', status: 'current', side: 'right' },
    { id: 3, name: 'Laboratório 80/20', title: 'Prática de Integração', status: 'locked', side: 'left' },
    { id: 4, name: 'Diálogo Interior', title: 'Converse com o Livro', status: 'locked', side: 'right' },
    { id: 5, name: 'Círculo ao Vivo', title: 'Encontro de Sexta', status: 'locked', side: 'left' },
    { id: 6, name: 'Oásis Psíquico', title: 'Jardim da Heroína', status: 'locked', side: 'right' },
    { id: 7, name: 'Maestria Oracular', title: 'Aplicação na Vida', status: 'locked', side: 'left' },
  ];

  return (
    <section className="py-24 px-6 relative">
      <div className="flex flex-col items-center mb-20 space-y-2">
        <h2 className="text-[10px] uppercase tracking-[0.6em] text-white/20 font-bold">
          Jornada em Curso
        </h2>
        <div className="h-[2px] w-12 bg-gold/20" />
      </div>
      
      <div className="relative max-w-lg mx-auto">
        {/* Central Road - High Precision */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        
        <div className="space-y-24 relative">
          {steps.map((step, idx) => (
            <div key={step.id} className={`flex items-center w-full ${step.side === 'left' ? 'flex-row' : 'flex-row-reverse'}`}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="w-1/2 group"
                style={{ textAlign: step.side === 'left' ? 'right' : 'left', paddingLeft: step.side === 'right' ? '2.5rem' : '0', paddingRight: step.side === 'left' ? '2.5rem' : '0' }}
              >
                <div className={`
                  relative inline-block text-left p-5 rounded-[2rem] border transition-all duration-700
                  ${step.status === 'current' ? 
                    'bg-[#0a0f1d] border-gold/40 shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(201,169,110,0.1)] scale-105 z-10' : 
                    step.status === 'completed' ? 
                    'bg-white/[0.02] border-white/5 opacity-80' : 
                    'bg-transparent border-transparent opacity-20'}
                `}>
                  {step.status === 'current' && (
                    <div className="absolute -top-3 left-6">
                      <Badge className="bg-gold text-black hover:bg-gold border-none text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                        Agora
                      </Badge>
                    </div>
                  )}
                  
                  <p className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${step.status === 'current' ? 'text-gold' : 'text-white/40'}`}>
                    {step.name}
                  </p>
                  <h4 className="text-sm font-serif text-white/90 leading-snug mb-2">
                    {step.title}
                  </h4>
                  
                  <div className="flex items-center gap-2">
                    <div className={`w-1 h-1 rounded-full ${step.status === 'completed' ? 'bg-gold/40' : step.status === 'current' ? 'bg-gold' : 'bg-white/10'}`} />
                    <span className="text-[10px] text-white/30 font-medium tracking-wide">
                      {step.status === 'current' ? 'Seguir trilha' : step.status === 'completed' ? 'Integrado' : 'Aguardando'}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Node - Minimalist Apple Style */}
              <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center">
                <div className={`
                  relative z-10 w-2 h-2 rounded-full transition-all duration-1000
                  ${step.status === 'current' ? 'bg-gold scale-125' : 
                    step.status === 'completed' ? 'bg-gold/60' : 'bg-white/10'}
                `} />
                
                {step.status === 'current' && (
                  <>
                    <motion.div 
                      animate={{ scale: [1, 3], opacity: [0.3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                      className="absolute w-4 h-4 bg-gold/40 rounded-full"
                    />
                    <div className="absolute w-4 h-4 bg-gold/10 blur-md rounded-full" />
                  </>
                )}
              </div>

              <div className="w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WeeklyDive = () => (
  <section className="py-12 px-6">
    <div className="max-w-md mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-serif text-white tracking-tight">O que te espera esta semana</h2>
        <p className="text-xs text-white/30 font-light">Prepare-se para o mergulho profundo.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          { title: 'Aula-Álbum', icon: Crown, desc: 'A cartografia da psique selvagem.' },
          { title: 'Ritual Prático', icon: Sparkles, desc: 'Ativação corporal e simbólica.' },
          { title: 'Pergunta de Travessia', icon: Quote, desc: 'O enigma para seu oráculo pessoal.' },
        ].map((item, i) => (
          <PremiumCard key={i} className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20">
              <item.icon className="w-5 h-5 text-gold" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-medium text-white">{item.title}</h4>
              <p className="text-[11px] text-white/40 font-light">{item.desc}</p>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-white/10 ml-auto" />
          </PremiumCard>
        ))}
      </div>
    </div>
  </section>
);

const EvolutionStats = () => (
  <section className="py-12 px-6 bg-gold/[0.02] border-y border-white/5">
    <div className="max-w-md mx-auto">
      <h2 className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-medium text-center mb-8">Sua Evolução</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Portais Atravessados', value: '03', icon: Crown },
          { label: 'Dias de Presença', value: '12', icon: Clock },
          { label: 'Livro Atual', value: 'Clarissa', icon: BookOpen },
          { label: 'Próxima Ativação', value: 'Qui, 20h', icon: Calendar },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <stat.icon className="w-3.5 h-3.5 text-gold/40 mb-2" />
            <p className="text-lg font-serif text-white">{stat.value}</p>
            <p className="text-[9px] uppercase tracking-widest text-white/30">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const PremiumBottomNav = () => (
  <nav className="fixed bottom-6 left-6 right-6 z-50 md:hidden">
    <div className="max-w-md mx-auto bg-[#050810]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] h-20 flex items-center justify-around px-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      {[
        { icon: LayoutDashboard, label: 'Início', active: true },
        { icon: BookOpen, label: 'Clube' },
        { icon: Sparkles, label: 'Oráculo' },
        { icon: Flower2, label: 'Jardim' },
        { icon: Library, label: 'Acervo' },
      ].map((item, i) => (
        <button key={i} className={`flex flex-col items-center gap-1.5 p-2 transition-all duration-300 ${item.active ? 'text-gold scale-110' : 'text-white/20 hover:text-white/40'}`}>
          <div className={`relative ${item.active ? 'after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-gold after:rounded-full' : ''}`}>
            <item.icon className={`w-6 h-6 ${item.active ? 'stroke-[2px]' : 'stroke-[1.5px]'}`} />
          </div>
          <span className="text-[7px] uppercase tracking-[0.2em] font-bold">{item.label}</span>
        </button>
      ))}
    </div>
  </nav>
);

// --- Main Preview Component ---

export default function ClubeHomePremiumPreview() {
  const [userName] = React.useState("Claudia");

  return (
    <div className="min-h-screen bg-[#02040a] text-white selection:bg-gold/30 selection:text-white font-sans overflow-x-hidden">
      {/* 
        Background Atmosphere: Deep Night Blue + Sophisticated Gradient
        Apple + Linear + Luxury European Aesthetic
      */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Base Layer: Absolute Depth */}
        <div className="absolute inset-0 bg-[#02040a]" />
        
        {/* Sophisticated Night Blue Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(10,25,50,0.4)_0%,_transparent_70%)]" />
        
        {/* Subtle Luxury Glow (Linear style) */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        
        {/* Soft Ambient Light (Apple-style subtle glow) */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(circle_at_50%_50%,_rgba(201,169,110,0.02)_0%,_transparent_65%)] blur-[100px]" />
        
        {/* Elegant Fine Grain Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* Bottom Vignette */}
        <div className="absolute bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t from-[#02040a] to-transparent" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto pb-32">
        {/* 1. Retomar jornada (Hero) */}
        <ClubHero name={userName} />
        
        {/* 2. Onde parei / Próxima recompensa (Enhanced with high-end UI) */}
        <section className="px-6 -mt-8 mb-16 relative z-20">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              className="p-[1px] rounded-[2.5rem] bg-gradient-to-b from-white/20 via-white/5 to-transparent shadow-[0_40px_80px_rgba(0,0,0,0.6)] overflow-hidden group"
            >
              <div className="bg-[#050810]/95 backdrop-blur-3xl rounded-[2.45rem] p-8 relative overflow-hidden">
                {/* Magnetic Glow Effect */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-gold/10 blur-[80px] rounded-full group-hover:bg-gold/15 transition-colors duration-1000" />
                
                <div className="flex justify-between items-start mb-8">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                      <span className="text-[10px] font-bold tracking-[0.3em] text-gold/80 uppercase">Retomar Agora</span>
                    </div>
                    <h3 className="text-2xl font-serif text-white tracking-tight leading-tight pt-1">Onde você parou...</h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-inner">
                    <BookOpen className="w-6 h-6 text-gold/60" />
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 mb-8">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-16 rounded-lg bg-gradient-to-br from-white/10 to-transparent flex-shrink-0 border border-white/10 overflow-hidden relative">
                         <div className="absolute inset-0 bg-gold/5" />
                         <div className="absolute bottom-1 left-1 right-1 h-0.5 bg-gold/40 rounded-full" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Capítulo III</p>
                        <p className="text-sm font-medium text-white/90">A Intuição como Bússola</p>
                      </div>
                   </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end text-[10px] tracking-[0.1em] text-white/30 uppercase font-bold">
                    <span>Sua evolução</span>
                    <span className="text-gold">65%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '65%' }}
                      transition={{ duration: 1.5, ease: "circOut", delay: 0.8 }}
                      className="h-full bg-gradient-to-r from-gold/60 to-gold shadow-[0_0_15px_rgba(201,169,110,0.4)] rounded-full"
                    />
                  </div>
                </div>

                <Button className="w-full mt-10 bg-white text-black hover:bg-white/90 h-14 rounded-2xl font-bold text-base tracking-tight transition-all active:scale-[0.97] shadow-xl">
                  Continuar Atravessando
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* 3. Estrada viva (The core road remains) */}
        <JourneyRoad />
        
        {/* 6. Biblioteca viva (The "Weekly Dive" rebranded) */}
        <WeeklyDive />
        
        {/* 4. Progresso real (Stats) */}
        <EvolutionStats />

        {/* Closing sophisticated quote */}
        <section className="py-24 px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="w-8 h-8 mx-auto relative">
              <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full" />
              <Quote className="w-full h-full text-gold/40 relative z-10" />
            </div>
            <p className="text-2xl font-serif text-white/70 italic leading-relaxed max-w-lg mx-auto">
              "A inteligência feminina reside no saber que cada ciclo tem sua própria luz."
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-8 h-[1px] bg-white/5" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/20">Casa Orácula</span>
              <div className="w-8 h-[1px] bg-white/5" />
            </div>
          </motion.div>
        </section>
      </main>

      {/* 5. Menu Premium (Bottom Nav) */}
      <PremiumBottomNav />
    </div>
  );
}
