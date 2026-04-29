import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  BookOpen, 
  Sparkles, 
  Zap, 
  Crown, 
  LayoutDashboard, 
  Library, 
  Flower2, 
  Quote,
  Clock,
  Calendar,
  CheckCircle2,
  Lock,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// DESIGN SYSTEM CASA ORÁCULA - PREMIUM
// Primary Color: Deep Navy Blue (#020617)
// Accent: Refined Gold (#C9A96E)
// Style: Silent Luxury, High Contrast, European Boutique.

const PremiumCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`
    relative overflow-hidden
    bg-[#0A1229] 
    border border-white/[0.08] 
    rounded-[2.5rem] p-8 
    shadow-[0_40px_100px_rgba(0,0,0,0.6)]
    ${className}
  `}>
    {children}
  </div>
);

const ClubHero = ({ name, rank }: { name: string, rank: string }) => (
  <section className="relative pt-32 pb-16 px-6 text-center">
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6 relative z-10"
    >
      <div className="flex flex-col items-center gap-3">
        <Badge variant="outline" className="bg-gold/5 border-gold/20 text-gold/80 px-4 py-1 text-[10px] uppercase tracking-[0.3em] font-bold rounded-full">
          {rank}
        </Badge>
        <div className="h-px w-12 bg-gradient-to-r from-transparent via-white/20 to-transparent mt-2" />
      </div>
      
      <h1 className="text-4xl md:text-6xl font-serif text-white tracking-tight leading-tight">
        Seja bem-vinda, <span className="italic font-medium text-white">Claudia</span>.
      </h1>
      
      <p className="text-sm text-white/50 font-light tracking-wide max-w-sm mx-auto leading-relaxed">
        Seu santuário de autoconhecimento e profundidade psíquica.
      </p>
    </motion.div>
  </section>
);

const ResumeJourney = () => (
  <section className="px-6 mb-24 relative z-20">
    <div className="max-w-md mx-auto">
      <PremiumCard className="border-t-white/10 group">
        <div className="flex justify-between items-start mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-gold/60 uppercase">Onde você parou</span>
            </div>
            <h3 className="text-2xl font-serif text-white leading-tight">A Intuição como Bússola</h3>
            <p className="text-xs text-white/40 font-light italic">Livro: Mulheres que Correm com os Lobos</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white/30" />
          </div>
        </div>

        <div className="space-y-4 mb-10">
          <div className="flex justify-between items-center text-[11px] tracking-widest text-white/50 uppercase font-bold">
            <span>Sua Ascensão neste Ciclo</span>
            <span className="text-white/80">65%</span>
          </div>
          <div className="h-2 w-full bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.08]">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '65%' }}
              transition={{ duration: 1.8, ease: [0.34, 1.56, 0.64, 1] }}
              className="h-full bg-gradient-to-r from-gold/30 via-gold/60 to-gold/30 rounded-full shadow-[0_0_15px_rgba(201,169,110,0.2)]" 
            />
          </div>
        </div>

        <Button className="w-full bg-white text-[#020617] hover:bg-slate-100 h-16 rounded-2xl font-bold text-base tracking-tight shadow-lg transition-all active:scale-[0.98]">
          Retomar Jornada Agora
        </Button>
      </PremiumCard>
    </div>
  </section>
);

const JourneyRoad = () => {
  const steps = [
    { id: 1, name: 'Portal 1', title: 'O Chamado Selvagem', status: 'completed', side: 'left' },
    { id: 2, name: 'Aula Semanal', title: 'A Cartografia da Alma', status: 'current', side: 'right' },
    { id: 3, name: 'Laboratório', title: 'Prática de Integração', status: 'locked', side: 'left' },
    { id: 4, name: 'Diálogo', title: 'Converse com o Livro', status: 'locked', side: 'right' },
    { id: 5, name: 'Círculo Vivo', title: 'Encontro de Sexta', status: 'locked', side: 'left' },
  ];

  return (
    <section className="py-32 px-6 relative">
      <div className="flex flex-col items-center mb-28 space-y-4">
        <h2 className="text-[11px] uppercase tracking-[0.6em] text-white/50 font-bold">Estrada de Travessia</h2>
        <div className="h-px w-20 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>
      
      <div className="relative max-w-lg mx-auto">
        {/* Living Road Path */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/50 via-white/10 to-transparent shadow-[0_0_15px_rgba(201,169,110,0.1)]" />
        
        <div className="space-y-32 relative">
          {steps.map((step) => (
            <div key={step.id} className={`flex items-center w-full ${step.side === 'left' ? 'flex-row' : 'flex-row-reverse'}`}>
              <motion.div 
                initial={{ opacity: 0, x: step.side === 'left' ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="w-1/2"
                style={{ textAlign: step.side === 'left' ? 'right' : 'left', paddingLeft: step.side === 'right' ? '2.5rem' : '0', paddingRight: step.side === 'left' ? '2.5rem' : '0' }}
              >
                <div className={`
                  relative inline-block text-left p-8 rounded-[2.5rem] border transition-all duration-700
                  ${step.status === 'current' ? 
                    'bg-[#0F172A]/40 border-gold/40 shadow-[0_25px_60px_rgba(0,0,0,0.6)] ring-1 ring-gold/20' : 
                    step.status === 'completed' ? 
                    'bg-white/[0.03] border-white/10' : 
                    'bg-transparent border-white/[0.03] opacity-50'}
                `}>
                  <div className="flex items-center gap-2 mb-3">
                    {step.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-gold/60" />}
                    {step.status === 'locked' && <Lock className="w-3 h-3 text-white/30" />}
                    <p className={`text-[10px] font-bold uppercase tracking-[0.25em] ${step.status === 'current' ? 'text-gold' : 'text-white/40'}`}>
                      {step.name}
                    </p>
                  </div>
                  <h4 className={`text-lg font-serif leading-snug ${step.status === 'locked' ? 'text-white/40' : 'text-white/95'}`}>
                    {step.title}
                  </h4>
                </div>
              </motion.div>

              <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center">
                <div className={`
                  w-2.5 h-2.5 rounded-full transition-all duration-1000
                  ${step.status === 'current' ? 'bg-gold scale-[1.6] shadow-[0_0_25px_rgba(201,169,110,0.6)]' : 
                    step.status === 'completed' ? 'bg-gold/50' : 'bg-white/20'}
                `} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const NextReward = () => (
  <section className="py-24 px-6">
    <div className="max-w-md mx-auto">
      <PremiumCard className="bg-gradient-to-br from-[#0A1221] to-[#050810] border-gold/10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20">
            <Crown className="w-6 h-6 text-gold" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-gold/60 uppercase">Próxima Conquista</span>
            <h4 className="text-xl font-serif text-white">Sacerdotisa da Palavra</h4>
          </div>
        </div>
        <p className="text-sm text-white/40 font-light leading-relaxed mb-8">
          Faltam apenas 2 portais para desbloquear sua nova identidade oracular e o bônus de Escuta Imersiva.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
            <p className="text-xs text-white/30 uppercase tracking-widest font-bold mb-1">Status</p>
            <p className="text-sm text-white/80 font-serif">Em ascensão</p>
          </div>
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
            <p className="text-xs text-white/30 uppercase tracking-widest font-bold mb-1">Prêmio</p>
            <p className="text-sm text-white/80 font-serif">Ritual Secreto</p>
          </div>
        </div>
      </PremiumCard>
    </div>
  </section>
);

const WeeklyDive = () => (
  <section className="py-24 px-6">
    <div className="max-w-md mx-auto space-y-10">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-serif text-white tracking-tight">O que te espera</h2>
        <p className="text-[11px] uppercase tracking-[0.4em] text-white/40 font-medium">Mergulho profundo desta semana</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          { title: 'Aula-Álbum', desc: 'A cartografia da psique selvagem.', icon: Zap },
          { title: 'Ritual Prático', desc: 'Ativação corporal e simbólica.', icon: Sparkles },
          { title: 'Pergunta Oracular', desc: 'O enigma para seu oráculo pessoal.', icon: Quote },
        ].map((item, i) => (
          <div key={i} className="p-7 bg-[#080C18]/40 border border-white/5 rounded-[2rem] flex justify-between items-center group hover:bg-white/[0.04] transition-all cursor-pointer">
            <div className="flex items-center gap-5">
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:border-gold/30 transition-colors">
                <item.icon className="w-5 h-5 text-white/20 group-hover:text-gold/60" />
              </div>
              <div className="text-left space-y-1">
                <h4 className="text-base font-medium text-white/90">{item.title}</h4>
                <p className="text-xs text-white/40 font-light leading-relaxed">{item.desc}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-white/30 group-hover:translate-x-1 transition-all" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

const EvolutionStats = () => (
  <section className="py-24 px-6 border-y border-white/[0.05]">
    <div className="max-w-md mx-auto">
       <h3 className="text-[11px] uppercase tracking-[0.5em] text-white/30 font-bold text-center mb-12">Consistência Oracular</h3>
       <div className="grid grid-cols-2 gap-6">
        {[
          { label: 'Portais Atravessados', value: '03' },
          { label: 'Dias de Presença', value: '12' },
          { label: 'Obras Estudadas', value: '01' },
          { label: 'Próximo Encontro', value: 'Qui, 20h' },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-1">
            <p className="text-3xl font-serif text-white">{stat.value}</p>
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 font-semibold">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default function ClubeHomePremiumPreview() {
  return (
    <div className="min-h-screen bg-[#050B18] text-white selection:bg-gold/20 selection:text-white font-sans overflow-x-hidden">
      {/* Night Atmosphere - Clean & Deep */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Elegant Deep Blue Gradient Base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1221] via-[#050B18] to-[#030711]" />
        
        {/* Sophisticated Depth Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-900/[0.07] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-gold/[0.03] blur-[120px] rounded-full" />
        
        {/* Luxury Linear Glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto pb-48">
        <ClubHero name="Claudia" rank="Mentorada Diamante" />
        
        <ResumeJourney />
        
        <JourneyRoad />

        <NextReward />
        
        <WeeklyDive />
        
        <EvolutionStats />

        {/* Closing sophisticated quote */}
        <section className="py-32 px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div className="w-12 h-12 mx-auto opacity-10">
              <Quote className="w-full h-full text-gold" fill="currentColor" />
            </div>
            <p className="text-2xl md:text-3xl font-serif text-white/70 italic leading-relaxed max-w-xl mx-auto px-4">
              "A inteligência feminina reside no saber que cada ciclo tem sua própria luz e sua própria sombra."
            </p>
            <div className="flex flex-col items-center gap-4">
              <div className="h-px w-20 bg-white/10" />
              <span className="text-[10px] uppercase tracking-[0.6em] text-white/20 font-bold">Casa Orácula</span>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Premium Bottom Nav */}
      <nav className="fixed bottom-10 left-6 right-6 z-50">
        <div className="max-w-md mx-auto bg-[#080C18]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] h-20 flex items-center justify-around px-6 shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
          {[
            { icon: LayoutDashboard, active: true, label: 'Início' },
            { icon: BookOpen, label: 'Clube' },
            { icon: Sparkles, label: 'Ritual' },
            { icon: Flower2, label: 'Oásis' },
            { icon: Library, label: 'Acervo' },
          ].map((item, i) => (
            <button key={i} className={`flex flex-col items-center gap-1.5 transition-all duration-500 ${item.active ? 'text-gold' : 'text-white/20 hover:text-white/40'}`}>
              <item.icon className={`w-6 h-6 ${item.active ? 'stroke-[2px]' : 'stroke-[1.5px]'}`} />
              {item.active && <span className="text-[8px] uppercase tracking-widest font-bold">Início</span>}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}