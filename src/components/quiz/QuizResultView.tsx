import { motion, Variants } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, GraduationCap, Route, Map, Sparkles, MessageCircle } from 'lucide-react';
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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.21, 0.45, 0.32, 0.9] }
  }
};

export function QuizResultView({ primaryResult, secondaryResult }: QuizResultViewProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const hasClubAccess = user ? canAccessFeature(user.portal, 'assinante') : false;
  const hasAlunaAccess = user ? canAccessFeature(user.portal, 'aluna') : false;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-16 md:space-y-24"
    >
      {/* ══ BLOCO DE IDENTIDADE SIMBÓLICA (HERO) ══ */}
      <motion.section variants={itemVariants} className="relative pt-8 pb-12 overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 text-center space-y-8">
          <div className="space-y-3">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] uppercase tracking-[0.3em] font-medium backdrop-blur-sm"
            >
              <Sparkles className="w-3 h-3" />
              Sua Identidade Revelada
            </motion.div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground font-bold tracking-tighter leading-[0.9]">
              {primaryResult.titulo_simbolico.split(' ').map((word, i) => (
                <span key={i} className={i === 0 ? "block" : "block text-gold/90"}>
                  {word}
                </span>
              ))}
            </h1>
          </div>
          
          <div className="max-w-3xl mx-auto px-4">
            <p className="text-xl md:text-2xl text-muted-foreground/90 leading-relaxed font-serif italic font-light">
              "{primaryResult.texto_interpretativo}"
            </p>
          </div>

          <div className="flex justify-center items-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/20" />
            <div className="w-2 h-2 rounded-full bg-gold/30" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/20" />
          </div>
        </div>
      </motion.section>

      {/* ══ PRÓXIMOS PASSOS (BENTO GRID) ══ */}
      <motion.section variants={itemVariants} className="space-y-10">
        <div className="text-center space-y-3">
          <h2 className="font-display text-3xl md:text-4xl text-foreground tracking-tight font-semibold">
            Sua Jornada Começa Agora
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-balance">
            Com base na sua essência, traçamos os caminhos mais potentes para sua expansão na Casa Orácula.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 max-w-6xl mx-auto">
          {/* ── CARD PRINCIPAL: Clube do Livro (Span 4) ── */}
          {!hasClubAccess ? (
            <Card className="md:col-span-4 group relative overflow-hidden border-gold/30 bg-black/40 backdrop-blur-md shadow-2xl transition-all duration-500 hover:border-gold/60 hover:shadow-gold/10">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent opacity-50 group-hover:opacity-80 transition-opacity" />
              <CardContent className="relative z-10 p-8 h-full flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <BookOpen className="w-8 h-8 text-gold" />
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-gold/70 font-semibold">Ponto de Partida Ideal</span>
                      <h3 className="font-display text-3xl font-bold text-foreground">Clube do Livro Oracular</h3>
                    </div>
                    <p className="text-lg text-foreground/70 leading-relaxed max-w-lg">
                      Uma jornada guiada onde cada leitura é uma ferramenta de intervenção psíquica. Onde a maioria começa sua transformação.
                    </p>
                  </div>
                </div>
                <div className="mt-12 flex items-center gap-6">
                  <Button
                    variant="gold"
                    size="xl"
                    onClick={() => navigate('/planos')}
                    className="gap-3 px-8 text-lg font-medium shadow-lg shadow-gold/20 hover:shadow-gold/40"
                  >
                    Entrar no Clube
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                  <span className="hidden sm:inline-block text-sm text-gold/50 font-serif italic border-l border-gold/20 pl-6">
                    Acompanhamento estruturado<br/>e comunidade ativa.
                  </span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="md:col-span-4 group relative overflow-hidden border-gold/20 bg-card/40 backdrop-blur-md shadow-xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent" />
              <CardContent className="relative z-10 p-8 flex flex-col justify-between h-full">
                <div className="space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <Map className="w-7 h-7 text-gold" />
                  </div>
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gold/70 font-semibold">Para Assinantes</span>
                    <h3 className="font-display text-3xl font-bold text-foreground">Cartografia da Cidadela</h3>
                    <p className="text-lg text-foreground/70 leading-relaxed">
                      Materialize o mapa da sua estrutura interna. Seu GPS simbólico para navegar na própria alma.
                    </p>
                  </div>
                </div>
                <Button
                  variant="gold"
                  size="xl"
                  onClick={() => navigate('/ferramenta/cartografia-psiquica-oracula')}
                  className="mt-10 gap-2 w-full sm:w-auto"
                >
                  Criar minha Cartografia
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* ── CARD SECUNDÁRIO: Travessia 00 (Span 2) ── */}
          <Card className="md:col-span-2 group border-primary/20 bg-primary/5 backdrop-blur-sm transition-all duration-500 hover:bg-primary/10">
            <CardContent className="p-8 h-full flex flex-col justify-between">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Route className="w-6 h-6 text-primary/70" />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-primary/60 font-medium">Auto-guiado</span>
                  <h4 className="font-display text-xl font-bold text-foreground">Travessia 00</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Primeiros passos no seu ritmo. Uma introdução silenciosa aos mistérios da Casa.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/travessia/travessia-zero-o-limiar-da-casa')}
                className="mt-8 gap-2 border-primary/30 text-primary group-hover:bg-primary/10 transition-colors"
              >
                Iniciar Agora
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          {/* ── CARD TERCIÁRIO: Formação (Span 3) ── */}
          {!hasAlunaAccess && (
            <Card className="md:col-span-3 group border-border/10 bg-card/20 transition-all duration-500 hover:border-border/30">
              <CardContent className="p-8 h-full flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 border border-border/10 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-foreground/50" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-medium">Nível Profissional</span>
                    <h4 className="font-display text-xl font-bold text-foreground">Formação Orácula</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Aprenda o método para conduzir outras mulheres. De habitante a guia.
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/oracula')}
                  className="mt-8 gap-2 border-border/20 group-hover:bg-foreground group-hover:text-background transition-all"
                >
                  Saiba mais
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* ── CARD QUARTÁRIO: Syntheia (Span 3) ── */}
          <Card className="md:col-span-3 group border-gold/10 bg-gradient-to-br from-gold/5 to-transparent transition-all duration-500 hover:from-gold/10">
            <CardContent className="p-8 h-full flex flex-col justify-between">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-xl bg-gold/5 border border-gold/10 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-gold/60" />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gold/50 font-medium">Interação com IA</span>
                  <h4 className="font-display text-xl font-bold text-foreground">Diálogo Arcano</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Aprofunde seu entendimento sobre seu arquétipo conversando com Syntheia.
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="lg"
                className="mt-8 gap-2 text-gold/80 hover:text-gold hover:bg-gold/5"
                onClick={() => {
                  const chatBtn = document.querySelector('[data-syntheia-trigger="true"]') as HTMLButtonElement;
                  if (chatBtn) chatBtn.click();
                }}
              >
                Falar com Syntheia
                <Sparkles className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* ══ MENSAGEM FINAL ══ */}
      <motion.section variants={itemVariants} className="text-center pb-12">
        <div className="inline-block relative">
          <div className="absolute inset-0 bg-gold/20 blur-2xl rounded-full opacity-30" />
          <p className="relative z-10 font-display text-2xl md:text-3xl text-foreground/60 leading-tight font-light italic">
            "Sua jornada não é sobre o destino,<br/>
            <span className="text-gold font-normal opacity-100">mas sobre quem você se torna ao caminhar."</span>
          </p>
        </div>
      </motion.section>
    </motion.div>
  );
}

