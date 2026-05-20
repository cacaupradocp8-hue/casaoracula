import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Route, BookOpen, Map, Lock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessFeature } from '@/types/portal';

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

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay },
});

export function QuizResultView({ primaryResult, secondaryResult }: QuizResultViewProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const handleNextStep = () => {
    const targetPath = '/travessia/travessia-zero-o-limiar-da-casa';
    if (!isAuthenticated) {
      navigate(`/auth?redirect=${targetPath}`);
    } else {
      navigate(targetPath);
    }
  };

  return (
    <div className="space-y-12">
      {/* ══ BLOCO 1: REVELAÇÃO ══ */}
      <motion.section {...fade(0)} className="space-y-8">
        <div className="text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-gold/60">
            Sua Voz foi revelada
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground tracking-tight">
            {primaryResult.titulo_simbolico}
          </h2>
          {primaryResult.categoria && (
            <div className="inline-block px-4 py-1 rounded-full bg-gold/10 border border-gold/20 text-xs text-gold/80">
              {primaryResult.categoria}
            </div>
          )}
        </div>

        {primaryResult.imagem_url && (
          <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 max-w-2xl mx-auto">
            <img 
              src={primaryResult.imagem_url} 
              alt={primaryResult.titulo_simbolico}
              className="w-full h-auto object-cover aspect-[16/9]"
            />
          </div>
        )}

        <div className="max-w-2xl mx-auto">
          <div 
            className="prose prose-invert prose-gold max-w-none text-foreground/90 leading-relaxed text-lg italic text-center"
            dangerouslySetInnerHTML={{ __html: primaryResult.texto_interpretativo }}
          />
        </div>
      </motion.section>

      {/* ══ BLOCO 2: VOZ COMPLEMENTAR (SE EXISTIR) ══ */}
      {secondaryResult && (
        <motion.section {...fade(0.2)} className="max-w-xl mx-auto">
          <div className="relative p-6 rounded-xl border border-gold/20 bg-gold/[0.03] overflow-hidden">
             <div className="absolute -top-4 -right-4 opacity-5">
               <Sparkles className="w-24 h-24" />
             </div>
             <div className="space-y-3 relative z-10">
               <span className="text-[10px] uppercase tracking-[0.2em] text-gold/50 font-medium">Voz de Apoio</span>
               <h4 className="font-display text-xl text-foreground/80">{secondaryResult.titulo_simbolico}</h4>
               <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 italic">
                 {secondaryResult.texto_interpretativo.replace(/<[^>]*>?/gm, '')}
               </p>
             </div>
          </div>
        </motion.section>
      )}

      {/* ══ BLOCO 3: CONTEÚDO CONFIGURADO (TRAZIDO PELO PAI) ══ */}
      {/* Aqui o QuizPage renderiza DirectMediaContent e ModularPageRenderer */}

      {/* ══ BLOCO 4: PRÓXIMO PASSO ══ */}
      <motion.section {...fade(0.4)} className="pt-8 border-t border-gold/10">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h3 className="font-display text-2xl text-foreground">Sua Voz apareceu.</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Agora ela precisa de uma travessia para ganhar corpo. Inicie o Limiar da Casa.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              variant="gold"
              size="xl"
              onClick={handleNextStep}
              className="gap-3 h-16 px-12 text-lg shadow-gold-lg group w-full sm:w-auto"
            >
              Guardar minha Voz e iniciar a Travessia 00
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <p className="text-xs text-muted-foreground/60 italic">
              {isAuthenticated 
                ? 'Você já está logada. Seu progresso será salvo.' 
                : 'Você criará uma conta gratuita para guardar seu resultado.'}
            </p>
          </div>

      </motion.section>

      {/* ══ RODAPÉ SIMBÓLICO ══ */}
      <motion.section {...fade(0.6)} className="text-center opacity-40 py-8">
        <div className="w-12 h-px bg-gold/30 mx-auto mb-6" />
        <p className="font-display text-sm tracking-[0.2em]">
          A Voz chama. A Travessia começa.
        </p>
      </motion.section>
    </div>
  );
}
