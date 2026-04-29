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
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Identidade visual Casa Orácula: Luxo silencioso, tipografia refinada e contraste ajustado.
// Estilo: Apple + Linear + Hotel Boutique Europeu.
// Foco: Azul Profundo, Noite, Inteligência Feminina.

const ClubHero = ({ name }: { name: string }) => (
  <section className="relative pt-28 pb-20 px-6 text-center">
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
      className="space-y-5 relative z-10"
    >
      <div className="flex items-center justify-center gap-3">
        <div className="h-[1px] w-8 bg-gold/40" />
        <p className="text-[11px] uppercase tracking-[0.4em] text-white/70 font-semibold">
          Ecossistema Oracular
        </p>
        <div className="h-[1px] w-8 bg-gold/40" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight leading-tight">
        Bem-vinda, <span className="text-gold italic font-medium">{name}</span>.
      </h1>
      
      <p className="text-sm text-white/40 font-light tracking-[0.05em] max-w-sm mx-auto pt-4 leading-relaxed">
        A quietude da noite é o portal para sua evolução. No silêncio, a alma fala com clareza.
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
    <section className="py-32 px-6 relative">
      <div className="flex flex-col items-center mb-28 space-y-4">
        <h2 className="text-[11px] uppercase tracking-[0.6em] text-white/40 font-bold">
          Estrada de Travessia
        </h2>
        <div className="h-[1px] w-16 bg-white/20" />
      </div>
      
      <div className="relative max-w-lg mx-auto">
        {/* Central Road */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-white/10" />
        
        <div className="space-y-32 relative">
          {steps.map((step) => (
            <div key={step.id} className={`flex items-center w-full ${step.side === 'left' ? 'flex-row' : 'flex-row-reverse'}`}>
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="w-1/2 group"
                style={{ textAlign: step.side === 'left' ? 'right' : 'left', paddingLeft: step.side === 'right' ? '2.5rem' : '0', paddingRight: step.side === 'left' ? '2.5rem' : '0' }}
              >
                <div className={`
                  relative inline-block text-left p-7 rounded-[2.5rem] border transition-all duration-700
                  ${step.status === 'current' ? 
                    'bg-white/[0.03] border-gold/30 shadow-[0_15px_40px_rgba(0,0,0,0.4)]' : 
                    step.status === 'completed' ? 
                    'bg-white/[0.02] border-white/10' : 
                    'bg-transparent border-white/5 opacity-40'}
                `}>
                  <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ${step.status === 'current' ? 'text-gold' : 'text-white/60'}`}>
                    {step.name}
                  </p>
                  <h4 className="text-base font-serif text-white/90 leading-snug">
                    {step.title}
                  </h4>
                </div>
              </motion.div>

              <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center">
                <div className={`w-2.5 h-2.5 rounded-full ${step.status === 'current' ? 'bg-gold scale-150 shadow-[0_0_15px_rgba(201,169,110,0.3)]' : step.status === 'completed' ? 'bg-gold/40' : 'bg-white/20'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WeeklyDive = () => (
  <section className="py-32 px-6">
    <div className="max-w-md mx-auto space-y-10">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-serif text-white/90 tracking-tight">O que te espera</h2>
        <p className="text-[11px] uppercase tracking-[0.4em] text-white/40 font-medium">Mergulho profundo desta semana</p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {[
          { title: 'Aula-Álbum', desc: 'A cartografia da psique selvagem.' },
          { title: 'Ritual Prático', desc: 'Ativação corporal e simbólica.' },
          { title: 'Pergunta Oracular', desc: 'O enigma para seu oráculo pessoal.' },
        ].map((item, i) => (
          <div key={i} className="p-7 bg-white/[0.02] border border-white/5 rounded-[2rem] flex justify-between items-center group hover:bg-white/[0.04] transition-all cursor-pointer">
            <div className="text-left space-y-1.5">
              <h4 className="text-base font-medium text-white/90">{item.title}</h4>
              <p className="text-xs text-white/40 font-light leading-relaxed">{item.desc}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-gold transition-colors" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

const EvolutionStats = () => (
  <section className="py-32 px-6 border-y border-white/5">
    <div className="max-w-md mx-auto">
       <h3 className="text-[11px] uppercase tracking-[0.5em] text-white/30 font-bold text-center mb-12">Sua Evolução</h3>
       <div className="grid grid-cols-2 gap-8">
        {[
          { label: 'Portais', value: '03' },
          { label: 'Presença', value: '12 dias' },
          { label: 'Livro Atual', value: 'Clarissa' },
          { label: 'Próxima', value: 'Qui, 20h' },
        ].map((stat, i) => (
          <div key={i} className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-2">
            <p className="text-3xl font-serif text-white/95">{stat.value}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default function ClubeHomePremiumPreview() {
  const [userName] = React.useState("Claudia");

  return (
    <div className="min-h-screen bg-[#02040a] text-white selection:bg-gold/20 selection:text-white font-sans overflow-x-hidden">
      {/* Night Atmosphere - Clean & Deep */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#02040a]" />
        {/* Luxury Linear Glow */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
        {/* Depth Vignette */}
        <div className="absolute bottom-0 left-0 right-0 h-[50vh] bg-gradient-to-t from-[#02040a] via-[#02040a]/80 to-transparent" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto pb-48">
        <ClubHero name={userName} />
        
        {/* Retomar Jornada - Apple/Hotel Boutique Style */}
        <section className="px-6 -mt-12 mb-32 relative z-20">
          <div className="max-w-md mx-auto p-[1px] rounded-[3rem] bg-gradient-to-b from-white/10 to-transparent shadow-[0_50px_100px_rgba(0,0,0,0.6)]">
            <div className="bg-[#050810]/98 backdrop-blur-3xl rounded-[2.95rem] p-10">
              <div className="flex justify-between items-start mb-16">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold tracking-[0.3em] text-gold/50 uppercase">Continuar agora</span>
                  <h3 className="text-2xl font-serif text-white/95 leading-tight">A Intuição como Bússola</h3>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-inner">
                  <BookOpen className="w-7 h-7 text-gold/40" />
                </div>
              </div>

              <div className="space-y-4 mb-10">
                <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[65%] bg-gold/30 rounded-full" />
                </div>
                <div className="flex justify-between items-center text-[10px] tracking-widest text-white/30 uppercase font-bold">
                  <span>Progresso Real</span>
                  <span>65%</span>
                </div>
              </div>

              <Button className="w-full bg-white text-black hover:bg-white/90 h-16 rounded-[1.5rem] font-bold text-base tracking-tight shadow-xl active:scale-[0.98] transition-transform">
                Retomar Travessia
              </Button>
            </div>
          </div>
        </section>
        
        <JourneyRoad />
        
        <WeeklyDive />
        
        <EvolutionStats />

        {/* Closing sophisticated quote */}
        <section className="py-32 px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="w-10 h-10 mx-auto opacity-20">
              <Quote className="w-full h-full text-gold" />
            </div>
            <p className="text-2xl font-serif text-white/80 italic leading-relaxed max-w-lg mx-auto">
              "A inteligência feminina reside no saber que cada ciclo tem sua própria luz."
            </p>
            <div className="flex items-center justify-center gap-6 pt-4">
              <div className="w-12 h-[1px] bg-white/5" />
              <span className="text-[10px] uppercase tracking-[0.5em] text-white/20 font-bold">Casa Orácula</span>
              <div className="w-12 h-[1px] bg-white/5" />
            </div>
          </motion.div>
        </section>
      </main>

      {/* Simplified Premium Bottom Nav */}
      <nav className="fixed bottom-10 left-6 right-6 z-50 md:hidden">
        <div className="max-w-md mx-auto bg-[#050810]/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] h-20 flex items-center justify-around px-6 shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
          {[
            { icon: LayoutDashboard, active: true },
            { icon: BookOpen },
            { icon: Sparkles },
            { icon: Flower2 },
            { icon: Library },
          ].map((item, i) => (
            <button key={i} className={`p-3 transition-all duration-500 ${item.active ? 'text-gold scale-110' : 'text-white/20 hover:text-white/40'}`}>
              <item.icon className={`w-6 h-6 ${item.active ? 'stroke-[2px]' : 'stroke-[1.5px]'}`} />
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
