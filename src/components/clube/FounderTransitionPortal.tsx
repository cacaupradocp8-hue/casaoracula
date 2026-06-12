import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, TreePine, Headphones, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ElectricWaves } from '@/components/visitor/ElectricWaves';

export function FounderTransitionPortal() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden flex flex-col items-center justify-center px-4 py-20">
      {/* Atmosfera de fundo */}
      <div className="absolute inset-0 pointer-events-none">
        <ElectricWaves />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-2xl w-full space-y-16 text-center">
        {/* Título e Texto Principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="space-y-8"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            >
              <TreePine className="w-12 h-12 text-gold/40" />
            </motion.div>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-serif text-white leading-tight uppercase tracking-widest">
            Você chegou à primeira <br />
            <span className="text-gold italic font-light lowercase">porta da floresta</span>.
          </h2>

          <div className="space-y-6 text-white/70 text-base md:text-lg font-serif italic leading-relaxed max-w-lg mx-auto">
            <p>A Clareira do Chamado foi apenas o início.</p>
            <p>Agora a trilha conduz para um território mais profundo.</p>
            <p className="text-white text-xl md:text-2xl not-italic uppercase tracking-[0.2em] font-black">A Casa da Boa Menina.</p>
            <p>
              Um lugar onde muitas mulheres aprenderam a desaparecer para continuar pertencendo.
              E onde começam a descobrir o custo dessa adaptação.
            </p>
          </div>
        </motion.div>

        {/* Prévia da Próxima Estação */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="relative group max-w-md mx-auto"
        >
          <div className="absolute -inset-4 bg-gold/5 blur-2xl rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0A0A0B]/60 backdrop-blur-xl p-1 shadow-2xl">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[30px]">
              <img 
                src="https://pvjiznbfwtjqmpeiqqzk.supabase.co/storage/v1/object/public/content-images/galeria/1781206890341.jpg" 
                alt="Casa da Boa Menina" 
                className="w-full h-full object-cover opacity-40 grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                  <Lock className="w-5 h-5 text-gold" />
                </div>
                <span className="text-[10px] font-bold tracking-[0.4em] text-gold uppercase drop-shadow-md">🔒 Casa da Boa Menina</span>
              </div>
            </div>

            <div className="p-8 space-y-6 text-left">
              <p className="text-sm text-gold/90 font-serif italic border-l border-gold/30 pl-4">
                "Onde a perfeição se torna uma prisão invisível."
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-white/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[9px] uppercase tracking-widest font-black">Ferramenta Bloqueada</span>
                </div>
                <div className="flex items-center gap-2 text-white/20">
                  <Headphones className="w-3.5 h-3.5" />
                  <span className="text-[9px] uppercase tracking-widest font-black">Áudio Bloqueado</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final e CTAs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="space-y-12"
        >
          <div className="space-y-2">
            <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-black italic">
              Você recebeu acesso de fundadora para conhecer a floresta.
            </p>
            <p className="text-gold/60 text-sm font-serif italic">
              Agora pode escolher permanecer.
            </p>
          </div>

          <div className="flex flex-col gap-6 max-w-xs mx-auto">
            <Button
              variant="gold"
              size="lg"
              onClick={() => navigate('/planos')}
              className="h-20 rounded-full bg-gold text-[#08090B] font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_0_40px_rgba(212,175,55,0.2)] group hover:scale-105 transition-all"
            >
              <span>Entrar na Casa da Boa Menina</span>
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => navigate('/sala-da-visitante')}
              className="text-white/30 hover:text-white text-[9px] uppercase tracking-[0.3em] font-black transition-colors"
            >
              Continuar explorando a Casa
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
