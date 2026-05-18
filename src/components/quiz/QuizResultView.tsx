import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Route, BookOpen, Map, Lock } from 'lucide-react';
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
  const hasAssinanteAccess = user ? canAccessFeature(user.portal, 'assinante') : false;

  const handleNextStep = () => {
    const targetPath = '/travessia/travessia-zero-o-limiar-da-casa';
    if (!isAuthenticated) {
      navigate(`/auth?redirect=${targetPath}`);
    } else {
      navigate(targetPath);
    }
  };

  return (
    <div className="space-y-10">

      {/* ══ BLOCO DE ABERTURA ══ */}
      <motion.section {...fade(0)}>
        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sua Voz foi ouvida. Este é o seu ponto de partida na Casa.
          </p>
          <h2 className="font-display text-2xl md:text-3xl text-foreground tracking-wide">
            Seu próximo passo:
          </h2>
        </div>
      </motion.section>

      {/* ══ TRILHA PRINCIPAL: Travessia 00 ══ */}
      <motion.section {...fade(0.15)} className="space-y-6">
        <Card className="border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent shadow-lg ring-1 ring-gold/10 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-3 opacity-10">
             <Route className="w-24 h-24" />
          </div>
          <CardContent className="py-10 px-6 sm:px-10 relative z-10">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gold/15 border-2 border-gold/30 flex items-center justify-center shrink-0 shadow-premium-glow">
                <Route className="w-10 h-10 text-gold" />
              </div>
              
              <div className="space-y-4 max-w-md mx-auto">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-gold/70 block mb-2">Início da Jornada</span>
                  <h3 className="font-display text-2xl font-semibold text-foreground">Travessia 00: O Limiar da Casa</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed mt-4">
                    Agora que você descobriu sua Voz, precisa aprender a sustentá-la. 
                    A Travessia 00 é um percurso de 7 dias para sintonizar sua presença e escuta antes de habitar a Casa por completo.
                  </p>
                </div>

                <Button
                  variant="gold"
                  size="xl"
                  onClick={handleNextStep}
                  className="gap-3 w-full sm:w-auto h-16 px-10 text-base shadow-gold-lg group"
                >
                  Guardar minha Voz e iniciar a Travessia 00
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
                
                <p className="text-xs text-gold/50 italic pt-2">
                  {isAuthenticated ? 'Você já está logada. Comece agora.' : 'Você precisará criar uma conta gratuita para salvar seu progresso.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ══ BLOCO DE ASSINATURA ══ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
           {/* Rotas da Casa */}
           <Card 
            className="border-primary/10 bg-primary/[0.02] cursor-pointer hover:bg-primary/5 transition-colors group"
            onClick={() => navigate('/planos')}
          >
            <CardContent className="py-6 px-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="w-5 h-5 text-primary/60" />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <h4 className="font-display text-base font-semibold text-foreground/80">Rotas da Casa Orácula</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Acesso completo após concluir o Limiar da Casa.
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground/30 mt-1" />
              </div>
            </CardContent>
          </Card>

          {/* CidaDELA */}
          <Card 
            className="border-primary/10 bg-primary/[0.02] cursor-pointer hover:bg-primary/5 transition-colors group"
            onClick={() => navigate('/planos')}
          >
            <CardContent className="py-6 px-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Map className="w-5 h-5 text-primary/60" />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <h4 className="font-display text-base font-semibold text-foreground/80">Habitar minha CidaDELA</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Sua cartografia psíquica. Disponível via assinatura das Rotas.
                  </p>
                </div>
                <Lock className="w-3 h-3 text-muted-foreground/30 mt-1" />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* ══ BLOCO FINAL ══ */}
      <motion.section {...fade(0.3)}>
        <div className="text-center py-6">
          <div className="w-12 h-px bg-gold/20 mx-auto mb-6" />
          <p className="font-display text-base text-foreground/60 leading-relaxed max-w-xs mx-auto">
            A Voz é o começo.
            <br />
            A Travessia é o caminho.
          </p>
        </div>
      </motion.section>
    </div>
  );
}
