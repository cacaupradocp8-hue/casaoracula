import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, GraduationCap, Route, Map } from 'lucide-react';
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
  const { user } = useAuth();
  const hasClubAccess = user ? canAccessFeature(user.portal, 'assinante') : false;
  const hasAlunaAccess = user ? canAccessFeature(user.portal, 'aluna') : false;

  return (
    <div className="space-y-10">

      {/* ══ BLOCO DE ABERTURA ══ */}
      <motion.section {...fade(0)}>
        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Com base nas suas respostas, este é o seu ponto de partida na Casa.
          </p>
          <h2 className="font-display text-2xl md:text-3xl text-foreground tracking-wide">
            Seu próximo passo recomendado:
          </h2>
        </div>
      </motion.section>

      {/* ══ TRILHAS DE DECISÃO ══ */}
      <motion.section {...fade(0.15)} className="space-y-4">

        {/* ── TRILHA 1: Clube do Livro — DESTAQUE PRINCIPAL ── */}
        {!hasClubAccess ? (
          <Card className="border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent shadow-lg ring-1 ring-gold/10">
            <CardContent className="py-8 px-6">
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="w-14 h-14 rounded-full bg-gold/15 border-2 border-gold/30 flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-gold" />
                </div>
                <div className="flex-1 min-w-0 space-y-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gold/70 block mb-1.5">Caminho recomendado</span>
                    <h3 className="font-display text-xl font-semibold text-foreground">Clube do Livro Oracular</h3>
                    <p className="text-sm text-foreground/80 leading-relaxed mt-2 whitespace-pre-line">
                      Você não precisa começar sozinha.{'\n'}Aqui você entra em uma jornada guiada, onde cada leitura é usada como intervenção psíquica.
                    </p>
                  </div>
                  <Button
                    variant="gold"
                    size="lg"
                    onClick={() => navigate('/planos')}
                    className="gap-2 w-full sm:w-auto"
                  >
                    Entrar no Clube
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <p className="text-xs text-gold/50 italic">
                    É por aqui que a maioria começa.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-gold/20 bg-gold/[0.03] shadow-md">
            <CardContent className="py-8 px-6">
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="w-14 h-14 rounded-full bg-gold/15 border-2 border-gold/30 flex items-center justify-center shrink-0">
                  <Map className="w-6 h-6 text-gold" />
                </div>
                <div className="flex-1 min-w-0 space-y-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gold/70 block mb-1.5">Seu próximo passo no Clube</span>
                    <h3 className="font-display text-xl font-semibold text-foreground">Cartografia da Cidadela</h3>
                    <p className="text-sm text-foreground/80 leading-relaxed mt-2">
                      Revele o mapa completo da sua estrutura interna — seu GPS simbólico.
                    </p>
                  </div>
                  <Button
                    variant="gold"
                    size="lg"
                    onClick={() => navigate('/ferramentas/cartografia-psiquica-oracula')}
                    className="gap-2 w-full sm:w-auto"
                  >
                    Criar minha Cartografia
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── TRILHA 2: Travessia 00 — Secundária ── */}
        <Card className="border-primary/20 bg-primary/[0.03]">
          <CardContent className="py-6 px-6">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <Route className="w-5 h-5 text-primary/70" />
              </div>
              <div className="flex-1 min-w-0 space-y-3">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-primary/50 block mb-1">Gratuito</span>
                  <h4 className="font-display text-lg font-semibold text-foreground">Travessia 00</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                    Se preferir começar no seu tempo, essa travessia te guia pelos primeiros passos dentro da Casa.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/travessia/travessia-zero-o-limiar-da-casa')}
                  className="gap-2 border-primary/20 text-primary hover:bg-primary/5"
                >
                  Começar pela Travessia
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <p className="text-xs text-muted-foreground/50 italic">
                  Sem acompanhamento estruturado.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── TRILHA 3: Formação Orácula — Avançada ── */}
        {!hasAlunaAccess && (
          <Card className="border-border/20 bg-card/50">
            <CardContent className="py-6 px-6">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-secondary/50 border border-border/20 flex items-center justify-center shrink-0 mt-0.5">
                  <GraduationCap className="w-5 h-5 text-foreground/50" />
                </div>
                <div className="flex-1 min-w-0 space-y-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 block mb-1">Caminho avançado</span>
                    <h4 className="font-display text-lg font-semibold text-foreground">Formação Orácula</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                      Se você já sabe que quer conduzir outras mulheres com método, pode entrar direto na formação.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/oracula')}
                    className="gap-2"
                  >
                    Entrar na Formação
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <p className="text-xs text-muted-foreground/50 italic">
                    Indicado para quem quer atuar como terapeuta.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.section>

      {/* ══ BLOCO FINAL ══ */}
      <motion.section {...fade(0.3)}>
        <div className="text-center py-6">
          <div className="w-12 h-px bg-gold/20 mx-auto mb-6" />
          <p className="font-display text-lg text-foreground/80 leading-relaxed max-w-md mx-auto">
            Você não precisa decidir tudo agora.
            <br />
            <span className="text-gold">Só precisa dar o próximo passo.</span>
          </p>
        </div>
      </motion.section>
    </div>
  );
}
