import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart, ArrowRight, Layers, BookOpen, GraduationCap, Route, Map } from 'lucide-react';
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
    <div className="space-y-12">

      {/* ══ BLOCO 1: IDENTIDADE — CONFIRMAÇÃO ══ */}
      <motion.section {...fade(0)}>
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-gold/60 mb-3">
            Seu padrão foi identificado
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-gold leading-tight">
            Você conduz de um lugar específico
          </h2>
          <p className="text-sm text-muted-foreground/60 mt-2 max-w-md mx-auto">
            Toda pessoa que escuta, orienta ou facilita o outro opera a partir de um eixo interno dominante. O seu acabou de ser revelado.
          </p>
        </div>

        {primaryResult.imagem_url && (
          <div className="rounded-2xl overflow-hidden mb-8 max-h-[380px]">
            <img
              src={primaryResult.imagem_url}
              alt={primaryResult.titulo_simbolico}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <Card className="border-gold/20 bg-card/80 backdrop-blur">
          <CardContent className="pt-8 pb-8 space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gold/10 border border-gold/20 mb-4">
                <Sparkles className="w-4 h-4 text-gold" />
                <span className="font-display text-lg text-gold font-semibold">
                  {primaryResult.titulo_simbolico}
                </span>
              </div>
              <p className="text-foreground/90 leading-relaxed whitespace-pre-line max-w-2xl mx-auto">
                {primaryResult.texto_interpretativo}
              </p>
            </div>

            {secondaryResult && (
              <>
                <div className="w-16 h-px bg-gold/20 mx-auto" />
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 mb-2">Eixo complementar</p>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3">
                    <Heart className="w-4 h-4 text-primary" />
                    <span className="font-display text-base text-foreground font-semibold">
                      {secondaryResult.titulo_simbolico}
                    </span>
                  </div>
                  <p className="text-foreground/75 leading-relaxed max-w-xl mx-auto">
                    {secondaryResult.texto_interpretativo.length > 280
                      ? secondaryResult.texto_interpretativo.substring(0, 280) + '…'
                      : secondaryResult.texto_interpretativo}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.section>

      {/* ══ BLOCO 2: LIMITAÇÃO — ABRIR LOOP ══ */}
      <motion.section {...fade(0.1)}>
        <Card className="border-border/20 bg-gradient-to-br from-card to-gold/[0.02] backdrop-blur">
          <CardContent className="py-8 px-6 text-center space-y-5">
            <div className="w-10 h-10 mx-auto rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center">
              <Layers className="w-5 h-5 text-gold/50" />
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold/50">
              O que esse resultado não mostra
            </p>
            <div className="bg-gold/5 border border-gold/10 rounded-xl p-5">
              <p className="text-foreground/90 leading-relaxed italic font-display">
                Esse resultado identifica seu eixo principal — mas sua estrutura psíquica não se resume a um eixo. Ela é formada por territórios internos que interagem entre si: forças, tensões, padrões repetitivos e recursos que ainda não foram acessados.
              </p>
            </div>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              {secondaryResult
                ? `${primaryResult.titulo_simbolico} e ${secondaryResult.titulo_simbolico} são dois pontos de um mapa interno muito maior. Você viu a direção — mas ainda não viu o território completo.`
                : `Você identificou um padrão — mas ainda não sabe como ele se conecta com seus bloqueios, seus recursos e os pontos que você ainda não enxerga.`}
            </p>
          </CardContent>
        </Card>
      </motion.section>

      {/* ══ BLOCO 3: PONTO DE PARTIDA — CONDUÇÃO DE DECISÃO ══ */}
      <motion.section {...fade(0.2)}>
        <div className="text-center mb-2">
          <p className="text-sm text-muted-foreground">
            Com base nas suas respostas, este é o seu ponto de partida na Casa.
          </p>
        </div>
        <div className="text-center mb-8">
          <h3 className="font-display text-xl md:text-2xl text-foreground">
            Seu próximo passo recomendado:
          </h3>
        </div>

        <div className="space-y-4">

          {/* ── TRILHA 1: Clube do Livro — DESTAQUE PRINCIPAL ── */}
          {!hasClubAccess ? (
            <Card className="border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent hover:border-gold/50 transition-all shadow-lg ring-1 ring-gold/10">
              <CardContent className="py-8 px-6">
                <div className="flex flex-col sm:flex-row items-start gap-5">
                  <div className="w-14 h-14 rounded-full bg-gold/15 border-2 border-gold/30 flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-gold/70 block mb-1.5">Caminho recomendado</span>
                      <h4 className="font-display text-xl font-semibold text-foreground">Clube do Livro Oracular</h4>
                      <p className="text-sm text-foreground/80 leading-relaxed mt-2">
                        Você não precisa começar sozinha.{'\n'}
                        Aqui você entra em uma jornada guiada, onde cada leitura é usada como intervenção psíquica.
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
            /* Se já tem acesso ao Clube — mostrar Cartografia */
            <Card className="border-gold/20 bg-gold/[0.03] hover:border-gold/30 transition-all shadow-md">
              <CardContent className="py-8 px-6">
                <div className="flex flex-col sm:flex-row items-start gap-5">
                  <div className="w-14 h-14 rounded-full bg-gold/15 border-2 border-gold/30 flex items-center justify-center shrink-0">
                    <Map className="w-6 h-6 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-gold/70 block mb-1.5">Seu próximo passo no Clube</span>
                      <h4 className="font-display text-xl font-semibold text-foreground">Cartografia da Cidadela</h4>
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
          <Card className="border-primary/20 bg-primary/[0.03] hover:border-primary/30 transition-all">
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
            <Card className="border-border/20 bg-card/50 hover:border-border/30 transition-all">
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
        </div>
      </motion.section>

      {/* ══ BLOCO 4: CONTEXTO (só para quem não tem nenhum acesso) ══ */}
      {!hasClubAccess && !hasAlunaAccess && (
        <motion.section {...fade(0.35)}>
          <div className="text-center space-y-5">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/40">
              O que você acessa ao entrar
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto">
              {[
                { icon: '🗺️', title: 'Cartografia da Cidadela', desc: 'Mapeamento completo da sua organização interna' },
                { icon: '🏛️', title: 'CidaDELA Interior', desc: 'Seu mapa funcional com distritos, tensões e direções' },
                { icon: '🧭', title: 'Evolução guiada', desc: 'Ferramentas, travessias e acompanhamento contínuo' },
              ].map((item) => (
                <Card key={item.title} className="border-border/15 bg-card/50">
                  <CardContent className="p-4 text-center space-y-2">
                    <span className="text-2xl block">{item.icon}</span>
                    <p className="text-xs font-medium text-foreground/80">{item.title}</p>
                    <p className="text-[10px] text-muted-foreground/50 leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* ══ BLOCO FINAL: ENCORAJAMENTO ══ */}
      <motion.section {...fade(0.45)}>
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
