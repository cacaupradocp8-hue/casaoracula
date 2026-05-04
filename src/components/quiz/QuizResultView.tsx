import { motion, Variants } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, GraduationCap, Route, Map, Sparkles, MessageCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessFeature } from '@/types/portal';
import { cn } from '@/lib/utils';

interface Resultado {
  id: string;
  titulo_simbolico: string;
  texto_interpretativo: string;
  categoria: string | null;
  imagem_url: string | null;
  video_url: string | null;
  audio_url: string | null;
  cta_texto: string | null;
  cta_rota: string | null;
}

interface QuizResultViewProps {
  primaryResult: Resultado;
  secondaryResult: Resultado | null;
  allResults: Resultado[];
  quizTitle: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
  }
};

export function QuizResultView({ primaryResult }: QuizResultViewProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const hasClubAccess = user ? canAccessFeature(user.portal, 'assinante') : false;
  const hasAlunaAccess = user ? canAccessFeature(user.portal, 'aluna') : false;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-24 md:space-y-32"
    >
      {/* ══ CINEMATIC HERO SECTION ══ */}
      <motion.section variants={itemVariants} className="relative min-h-[70vh] flex items-center overflow-hidden rounded-[3rem]">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          {primaryResult.imagem_url ? (
            <>
              <img 
                src={primaryResult.imagem_url} 
                alt="" 
                className="w-full h-full object-cover opacity-30 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
            </>
          ) : (
            <div className="absolute inset-0 bg-midnight">
              <div className="absolute top-1/2 right-0 w-[800px] h-[800px] bg-gold/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
            </div>
          )}
        </div>
        
        {/* Content Grid */}
        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 px-8 md:px-16 items-center">
          {/* Title Side */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] uppercase tracking-[0.5em] font-bold backdrop-blur-xl"
            >
              <Sparkles className="w-3 h-3" />
              Arquétipo Identificado
            </motion.div>
            
            <h1 className="font-display text-7xl md:text-9xl lg:text-[10rem] text-white font-black leading-[0.8] tracking-tighter">
              {primaryResult.titulo_simbolico.split(' ').map((word, i) => (
                <span key={i} className={cn("block", i % 2 !== 0 ? "text-gold translate-x-4 md:translate-x-8" : "opacity-90")}>
                  {word}
                </span>
              ))}
            </h1>
          </div>

          {/* Interpretation Side */}
          <div className="lg:col-span-5 lg:pt-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1.2 }}
              className="relative p-8 md:p-12 rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-2xl"
            >
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center border border-gold/30 backdrop-blur-xl">
                <Info className="w-5 h-5 text-gold" />
              </div>
              
              <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-serif italic font-light tracking-wide">
                "{primaryResult.texto_interpretativo}"
              </p>
              
              <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">Resonância Profunda</span>
                <div className="flex gap-1">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ══ EDITORIAL JOURNEY MAP (BENTO GRID REFINED) ══ */}
      <motion.section variants={itemVariants} className="space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.5em] text-gold/60 font-black">Next Steps</span>
            <h2 className="font-display text-4xl md:text-5xl text-white tracking-tight font-black uppercase">
              Cartografia de Ascensão
            </h2>
          </div>
          <p className="text-white/40 max-w-sm text-sm font-body leading-relaxed">
            Seu arquétipo exige um ambiente de cultivo específico. Estas são as portas abertas para você agora.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* MAIN GATE: CLUBE DO LIVRO (SPAN 8) */}
          <Card className={cn(
            "md:col-span-8 group relative overflow-hidden border-none bg-midnight/40 backdrop-blur-2xl shadow-none transition-all duration-700",
            !hasClubAccess ? "ring-1 ring-gold/30" : "ring-1 ring-white/10"
          )}>
            <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent opacity-30 group-hover:opacity-60 transition-opacity" />
            <CardContent className="relative z-10 p-10 md:p-14 h-full flex flex-col md:flex-row gap-10">
              <div className="flex-1 space-y-8">
                <div className="w-20 h-20 rounded-[2rem] bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-700 rotate-3">
                  <BookOpen className="w-10 h-10 text-gold" />
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-gold/70 font-black">Portal Principal</span>
                    <h3 className="font-display text-4xl font-black text-white uppercase tracking-tighter">Clube do Livro Oracular</h3>
                  </div>
                  <p className="text-lg text-white/50 leading-relaxed max-w-md">
                    Inicie a desdomesticação do seu instinto através da leitura oracular. Onde a teoria encontra a alma.
                  </p>
                </div>
              </div>
              
              <div className="md:w-64 flex flex-col justify-end gap-6">
                <Button
                  variant="gold"
                  size="xl"
                  onClick={() => navigate('/planos')}
                  className="w-full h-16 rounded-full text-base font-black tracking-[0.2em] uppercase shadow-2xl"
                >
                  {hasClubAccess ? 'Acessar Clube' : 'Garantir Acesso'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {['Comunidade', 'Mentorias', 'Cartografia'].map(tag => (
                    <span key={tag} className="text-[8px] uppercase tracking-widest text-white/30 border border-white/10 px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SECONDARY: TRAVESSIA 00 (SPAN 4) */}
          <Card className="md:col-span-4 group relative overflow-hidden border-none bg-white/[0.03] backdrop-blur-xl ring-1 ring-white/10 transition-all duration-500 hover:ring-gold/30">
            <CardContent className="p-10 h-full flex flex-col justify-between gap-12">
              <div className="space-y-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center -rotate-6 group-hover:rotate-0 transition-transform">
                  <Route className="w-7 h-7 text-primary/70" />
                </div>
                <div className="space-y-3">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold">Auto-conduzido</span>
                  <h4 className="font-display text-2xl font-black text-white uppercase leading-none">Travessia Zero</h4>
                  <p className="text-sm text-white/40 leading-relaxed">
                    O limiar do silêncio. Um percurso iniciático para quem busca o primeiro contato.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/travessia/travessia-zero-o-limiar-da-casa')}
                className="w-full h-14 rounded-full border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all font-bold tracking-widest text-[10px]"
              >
                COMEÇAR AGORA
              </Button>
            </CardContent>
          </Card>

          {/* LOWER GRID: DIÁLOGO & FORMAÇÃO */}
          <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="group relative overflow-hidden border-none bg-gradient-to-br from-gold/5 to-transparent ring-1 ring-gold/10 p-8 flex items-center gap-8">
               <div className="w-16 h-16 shrink-0 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                 <MessageCircle className="w-8 h-8 text-gold/60" />
               </div>
               <div className="flex-1 space-y-4">
                 <div>
                   <span className="text-[8px] uppercase tracking-[0.3em] text-gold/50 font-black">Interação Arcaica</span>
                   <h4 className="font-display text-xl font-black text-white uppercase">Syntheia: Diálogo com a Sombra</h4>
                 </div>
                 <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 text-gold/80 hover:text-gold hover:bg-gold/5 p-0 gap-2 font-bold tracking-widest text-[10px]"
                    onClick={() => (document.querySelector('[data-syntheia-trigger="true"]') as any)?.click()}
                  >
                    INICIAR CONVERSA <Sparkles className="w-3 h-3" />
                  </Button>
               </div>
             </Card>

             <Card className="group relative overflow-hidden border-none bg-white/[0.02] ring-1 ring-white/5 p-8 flex items-center gap-8">
               <div className="w-16 h-16 shrink-0 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                 <GraduationCap className="w-8 h-8 text-white/30" />
               </div>
               <div className="flex-1 space-y-4">
                 <div>
                   <span className="text-[8px] uppercase tracking-[0.3em] text-white/20 font-black">Nível de Guia</span>
                   <h4 className="font-display text-xl font-black text-white uppercase">Formação de Liderança Oracular</h4>
                 </div>
                 <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 text-white/40 hover:text-white hover:bg-white/5 p-0 gap-2 font-bold tracking-widest text-[10px]"
                    onClick={() => navigate('/oracula')}
                  >
                    CONHECER MÉTODO <ArrowRight className="w-3 h-3" />
                  </Button>
               </div>
             </Card>
          </div>
        </div>
      </motion.section>

      {/* ══ POETIC FOOTER ══ */}
      <motion.section variants={itemVariants} className="text-center pt-20 pb-12">
        <div className="relative inline-block px-12 py-8">
          <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-full" />
          <p className="relative z-10 font-display text-3xl md:text-4xl text-white/40 leading-tight font-light italic">
            "Sua jornada não é sobre o destino,<br/>
            <span className="text-gold font-normal not-italic opacity-100 uppercase tracking-[0.2em] text-xl md:text-2xl mt-4 block">mas sobre quem você se torna ao caminhar."</span>
          </p>
        </div>
      </motion.section>
    </motion.div>
  );
}
