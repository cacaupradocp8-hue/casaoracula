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
  <section className="relative pt-12 pb-8 px-6 text-center overflow-hidden">
    {/* Ambient Light */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
    
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-2 relative z-10"
    >
      <p className="text-[10px] uppercase tracking-[0.4em] text-gold/60 font-medium">
        Clube de Leitura Oracular
      </p>
      <h1 className="text-3xl md:text-4xl font-serif text-white tracking-tight">
        Boa noite, <span className="text-gold italic">{name}</span>.
      </h1>
      <p className="text-sm text-white/40 font-light tracking-wide">
        Sua jornada continua no silêncio da noite.
      </p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="mt-8 relative"
    >
      <PremiumCard className="max-w-md mx-auto border-gold/20 shadow-[0_0_50px_rgba(201,169,110,0.05)]">
        <div className="p-1">
          <div className="aspect-[16/7] w-full rounded-xl overflow-hidden relative">
            <div className="w-full h-full bg-gradient-to-br from-white/[0.05] to-transparent opacity-40" />

            <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-[#02040a]/20 to-transparent" />
            <div className="absolute bottom-4 left-4 text-left">
              <Badge className="bg-gold/20 text-gold border-gold/30 text-[8px] uppercase tracking-widest mb-2">
                Portal 1
              </Badge>
              <h3 className="text-xl font-serif text-white">O Chamado Selvagem</h3>
            </div>
          </div>
        </div>
        <div className="p-6 pt-2 text-left space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-1 h-1 rounded-full bg-gold animate-pulse" />
             <p className="text-xs text-white/60 font-light">Você parou no início da travessia.</p>
          </div>
          <Button variant="outline" className="w-full h-12 border-gold/30 bg-gold/5 hover:bg-gold/10 text-gold font-medium tracking-wide gap-2 group">
            Continuar Jornada
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </PremiumCard>
    </motion.div>
  </section>
);

const JourneyRoad = () => {
  const steps = [
    { id: 1, name: 'Portal 1', status: 'completed', side: 'left' },
    { id: 2, name: 'Aula da Semana', status: 'current', side: 'right' },
    { id: 3, name: 'Laboratório 80/20', status: 'locked', side: 'left' },
    { id: 4, name: 'Converse com o Livro', status: 'locked', side: 'right' },
    { id: 5, name: 'Encontro ao Vivo', status: 'locked', side: 'left' },
    { id: 6, name: 'Jardim da Psique', status: 'locked', side: 'right' },
    { id: 7, name: 'Aplicação Profissional', status: 'locked', side: 'left' },
  ];

  return (
    <section className="py-16 px-6 relative">
      <h2 className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-medium text-center mb-16">
        Estrada Oracular
      </h2>
      
      <div className="relative max-w-lg mx-auto">
        {/* Central Line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-white/10" />
        
        <div className="space-y-12 relative">
          {steps.map((step, idx) => (
            <div key={step.id} className={`flex items-center w-full ${step.side === 'left' ? 'flex-row' : 'flex-row-reverse'}`}>
              <motion.div 
                initial={{ opacity: 0, x: step.side === 'left' ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="w-1/2 pr-6 pl-0 sm:pr-10 text-right group"
                style={{ textAlign: step.side === 'left' ? 'right' : 'left', paddingLeft: step.side === 'right' ? '2.5rem' : '0', paddingRight: step.side === 'left' ? '2.5rem' : '0' }}
              >
                <div className={`
                  inline-block p-4 rounded-2xl border transition-all duration-500
                  ${step.status === 'current' ? 'bg-gold/10 border-gold/40 shadow-[0_0_30px_rgba(201,169,110,0.1)]' : 
                    step.status === 'completed' ? 'bg-white/5 border-white/10' : 'bg-transparent border-white/5 opacity-40'}
                `}>
                  <p className={`text-[10px] uppercase tracking-widest mb-1 ${step.status === 'current' ? 'text-gold' : 'text-white/40'}`}>
                    {step.name}
                  </p>
                  <p className="text-xs text-white/60 font-light">
                    {step.status === 'current' ? 'Em andamento' : step.status === 'completed' ? 'Atravessado' : 'Aguardando'}
                  </p>
                </div>
              </motion.div>

              {/* Node */}
              <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 flex items-center justify-center">
                <div className={`
                  w-2 h-2 rounded-full transition-all duration-700
                  ${step.status === 'current' ? 'bg-gold scale-150 shadow-[0_0_15px_#C9A96E]' : 
                    step.status === 'completed' ? 'bg-gold/60' : 'bg-white/20'}
                `} />
                {step.status === 'current' && (
                  <motion.div 
                    animate={{ scale: [1, 2.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-gold/30 rounded-full"
                  />
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
  <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 pt-2 md:hidden">
    <div className="max-w-md mx-auto bg-[#02040a]/80 backdrop-blur-2xl border border-white/10 rounded-3xl h-18 flex items-center justify-around px-2 shadow-2xl">
      {[
        { icon: LayoutDashboard, label: 'Início', active: true },
        { icon: BookOpen, label: 'Clube' },
        { icon: Sparkles, label: 'Ferramentas' },
        { icon: Flower2, label: 'Jardim' },
        { icon: GraduationCap, label: 'Formação' },
      ].map((item, i) => (
        <button key={i} className={`flex flex-col items-center gap-1.5 p-2 transition-all ${item.active ? 'text-gold' : 'text-white/30'}`}>
          <item.icon className={`w-5 h-5 ${item.active ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
          <span className="text-[8px] uppercase tracking-widest font-medium">{item.label}</span>
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
        <section className="px-6 -mt-4 mb-12 relative z-20">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-[1px] rounded-3xl bg-gradient-to-b from-white/10 to-transparent shadow-2xl overflow-hidden group"
            >
              <div className="bg-[#050810]/90 backdrop-blur-3xl rounded-[23px] p-6 relative overflow-hidden">
                {/* Subtle highlight effect */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold/5 blur-[60px] rounded-full group-hover:bg-gold/10 transition-colors duration-700" />
                
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-medium tracking-[0.2em] text-gold uppercase">Próximo Marco</span>
                    <h3 className="text-lg font-serif text-white/90 leading-tight">A Alquimia dos Símbolos</h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-gold" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '65%' }}
                      transition={{ duration: 1.5, ease: "circOut", delay: 1 }}
                      className="h-full bg-gradient-to-r from-gold/40 to-gold shadow-[0_0_10px_rgba(201,169,110,0.3)] rounded-full"
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] tracking-wider text-white/40 uppercase font-medium">
                    <span>Progresso Real</span>
                    <span className="text-gold">65% concluído</span>
                  </div>
                </div>

                <Button className="w-full mt-6 bg-white text-black hover:bg-white/90 h-12 rounded-2xl font-semibold tracking-tight transition-all active:scale-[0.98]">
                  Continuar Agora
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
