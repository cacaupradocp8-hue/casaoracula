import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart, ArrowRight, Lock, Layers, Map, Eye } from 'lucide-react';
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

      {/* ══ BLOCO 3: PROFUNDIDADE — ARQUITETURA DA MENTE ══ */}
      <motion.section {...fade(0.15)}>
        <div className="text-center space-y-6">
          <div className="w-10 h-10 mx-auto rounded-full bg-primary/5 border border-primary/15 flex items-center justify-center">
            <Map className="w-5 h-5 text-primary/50" />
          </div>
          <h3 className="font-display text-xl md:text-2xl text-foreground/90">
            Sua mente se organiza como uma cidade
          </h3>
          <p className="text-foreground/60 text-sm leading-relaxed max-w-lg mx-auto">
            A psicologia profunda demonstra que toda psique possui uma <span className="text-foreground/80 font-medium">arquitetura interna</span> — territórios que guardam seus recursos, seus padrões de repetição e os pontos onde você trava. Entender essa organização é o primeiro passo para mudar de verdade.
          </p>
          <p className="text-foreground/50 text-sm leading-relaxed max-w-md mx-auto">
            A CidaDELA Interior é o sistema que mapeia essa arquitetura. Ela transforma o que o quiz nomeou em um mapa funcional — com distritos, conflitos internos e direções claras de ação.
          </p>
        </div>
      </motion.section>

      {/* ══ BLOCO 4: TENSÃO + CTA ══ */}
      <motion.section {...fade(0.25)}>
        <Card className="border-gold/20 bg-gradient-to-b from-gold/[0.04] to-transparent backdrop-blur overflow-hidden">
          <CardContent className="py-10 px-6 text-center space-y-6">
            <div className="w-12 h-12 mx-auto rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
              <Eye className="w-6 h-6 text-gold/70" />
            </div>
            <h3 className="font-display text-xl md:text-2xl text-foreground">
              Sem o mapa, você repete o padrão
            </h3>
            <p className="text-foreground/60 text-sm leading-relaxed max-w-md mx-auto">
              Você sabe qual é seu eixo — mas ainda não sabe onde ele opera, o que o ameaça e o que ele precisa para evoluir. A CidaDELA revela esse mapa completo.
            </p>

            <div className="pt-2 space-y-3">
              {hasAlunaAccess ? (
                <Button
                  variant="gold"
                  size="lg"
                  onClick={() => navigate('/ferramentas/cartografia-psiquica-oracula')}
                  className="gap-2 px-8 py-6 text-base shadow-gold"
                >
                  Revelar minha CidaDELA
                  <ArrowRight className="w-5 h-5" />
                </Button>
              ) : (
                <Button
                  variant="gold"
                  size="lg"
                  onClick={() => navigate('/planos')}
                  className="gap-2 px-8 py-6 text-base shadow-gold"
                >
                  <Lock className="w-4 h-4" />
                  Desbloquear minha CidaDELA
                  <ArrowRight className="w-5 h-5" />
                </Button>
              )}

              {!hasAlunaAccess && (
                <p className="text-muted-foreground/50 text-xs max-w-sm mx-auto">
                  A CidaDELA é revelada dentro do Clube — o espaço de aprofundamento contínuo da Casa Orácula.
                </p>
              )}

              {hasAlunaAccess && (
                <p className="text-muted-foreground/40 text-xs max-w-sm mx-auto">
                  A Cartografia Psíquica gera o mapa completo da sua estrutura interna.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* ══ BLOCO 5: CONTEXTO DO CLUBE (só para quem não tem acesso) ══ */}
      {!hasAlunaAccess && (
        <motion.section {...fade(0.35)}>
          <div className="text-center space-y-5">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/40">
              O que você acessa ao entrar
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto">
              {[
                { icon: '🗺️', title: 'Cartografia Psíquica', desc: 'Mapeamento completo da sua organização interna' },
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/planos')}
              className="gap-1.5 text-gold border-gold/20 hover:bg-gold/5"
            >
              Ver planos do Clube <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </motion.section>
      )}
    </div>
  );
}
