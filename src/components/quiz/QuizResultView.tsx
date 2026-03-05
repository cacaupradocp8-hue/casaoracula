import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, Star, Compass, DoorOpen, ArrowRight, 
  BookOpen, Users, Mic, Heart, Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

// ── Voice enrichment data (symbolic, not from DB) ──
const VOICE_ENRICHMENT: Record<string, {
  frase_impacto: string;
  formas_conducao: string[];
  dom_natural: string;
  qualidades_apoio: string[];
  porta_nome: string;
  porta_descricao: string;
  porta_convites: string[];
}> = {
  default: {
    frase_impacto: 'Uma força que habita em você e pede passagem.',
    formas_conducao: [
      'Escuta profunda do que ressoa internamente',
      'Presença atenta ao que se move no campo',
      'Tradução do simbólico em linguagem viva',
    ],
    dom_natural: 'A capacidade de ouvir o que ainda não foi dito.',
    qualidades_apoio: [
      'Sustentação do campo quando a voz principal precisa descansar',
      'Equilíbrio entre intensidade e suavidade',
      'Presença silenciosa que ancora a travessia',
    ],
    porta_nome: 'Porta da Beira',
    porta_descricao: 'Você está no limiar — entre o que já viveu e o que ainda não se revelou. A Beira é o lugar onde a escuta se aprofunda e o corpo começa a reconhecer o que a mente ainda não nomeou.',
    porta_convites: [
      'Observar sem pressa o que se move internamente',
      'Deixar a escuta guiar antes da interpretação',
      'Confiar no que ainda está se formando',
    ],
  },
};

function getEnrichment(categoria: string | null) {
  if (categoria && VOICE_ENRICHMENT[categoria]) {
    return VOICE_ENRICHMENT[categoria];
  }
  return VOICE_ENRICHMENT.default;
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export function QuizResultView({ primaryResult, secondaryResult, allResults, quizTitle }: QuizResultViewProps) {
  const navigate = useNavigate();
  const enrichment = getEnrichment(primaryResult.categoria);

  // Derive integration text
  const integrationText = secondaryResult
    ? `Quando ${primaryResult.titulo_simbolico} e ${secondaryResult.titulo_simbolico} atuam juntas, sua escuta ganha profundidade e amplitude. A voz primária conduz, enquanto a voz de apoio sustenta o campo — juntas, elas criam um espaço de acolhimento onde o simbólico pode se revelar sem pressa.`
    : `Sua voz carrega uma potência que se desdobra em múltiplas camadas. À medida que você habita esse território, outras vozes internas se revelam e complementam sua forma de escutar e conduzir.`;

  const integrationPossibilities = secondaryResult
    ? [
        `Combinar a força de ${primaryResult.titulo_simbolico} com a sensibilidade de ${secondaryResult.titulo_simbolico} em sessão`,
        'Alternar entre condução ativa e presença silenciosa conforme o campo pede',
        'Criar espaços onde ambas as vozes possam se expressar sem competição',
      ]
    : [
        'Reconhecer diferentes tonalidades na sua forma de conduzir',
        'Permitir que a escuta se transforme conforme o momento da travessia',
        'Integrar força e suavidade como movimentos complementares',
      ];

  return (
    <div className="space-y-10">
      {/* ── SEÇÃO 1: RESULTADO PRINCIPAL ── */}
      <motion.section {...fadeUp}>
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-gold/70 mb-2">
            Seu resultado simbólico
          </p>
          <h2 className="font-display text-2xl md:text-3xl text-gold mb-1">
            Sua Voz Primária
          </h2>
        </div>

        {primaryResult.imagem_url && (
          <div className="rounded-xl overflow-hidden mb-6 max-h-[360px]">
            <img
              src={primaryResult.imagem_url}
              alt={primaryResult.titulo_simbolico}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <Card className="border-gold/20 bg-card/80 backdrop-blur">
          <CardContent className="pt-6 space-y-5">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 mb-4">
                <Sparkles className="w-4 h-4 text-gold" />
                <span className="font-display text-lg text-gold font-semibold">
                  {primaryResult.titulo_simbolico}
                </span>
              </div>
              <p className="text-foreground/80 italic text-lg leading-relaxed">
                {enrichment.frase_impacto}
              </p>
            </div>

            <Separator className="bg-border/30" />

            <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
              {primaryResult.texto_interpretativo}
            </p>

            <Separator className="bg-border/30" />

            <div>
              <h4 className="text-sm uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                <Compass className="w-4 h-4" />
                Formas de condução
              </h4>
              <ul className="space-y-2">
                {enrichment.formas_conducao.map((forma, i) => (
                  <li key={i} className="flex items-start gap-3 text-foreground/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/60 mt-2 shrink-0" />
                    {forma}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gold/5 border border-gold/10 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Dom natural</p>
              <p className="text-foreground/90 font-medium flex items-center gap-2">
                <Star className="w-4 h-4 text-gold" />
                {enrichment.dom_natural}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* ── SEÇÃO 2: VOZ DE APOIO ── */}
      {secondaryResult && (
        <motion.section {...fadeUp} transition={{ delay: 0.1, duration: 0.6 }}>
          <div className="text-center mb-6">
            <h2 className="font-display text-2xl text-foreground">
              Sua Voz de Apoio
            </h2>
          </div>

          <Card className="border-primary/15 bg-card/80 backdrop-blur">
            <CardContent className="pt-6 space-y-5">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3">
                  <Heart className="w-4 h-4 text-primary" />
                  <span className="font-display text-lg text-foreground font-semibold">
                    {secondaryResult.titulo_simbolico}
                  </span>
                </div>
                <p className="text-muted-foreground italic">
                  A voz que sustenta sua travessia quando a primária precisa descansar.
                </p>
              </div>

              <p className="text-foreground/80 leading-relaxed">
                {secondaryResult.texto_interpretativo.length > 300
                  ? secondaryResult.texto_interpretativo.substring(0, 300) + '...'
                  : secondaryResult.texto_interpretativo}
              </p>

              <div>
                <h4 className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
                  Qualidades desta voz
                </h4>
                <ul className="space-y-2">
                  {enrichment.qualidades_apoio.map((q, i) => (
                    <li key={i} className="flex items-start gap-3 text-foreground/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2 shrink-0" />
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      )}

      {/* ── SEÇÃO 3: INTEGRAÇÃO DAS VOZES ── */}
      <motion.section {...fadeUp} transition={{ delay: 0.2, duration: 0.6 }}>
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl text-foreground">
            Quando suas Vozes trabalham juntas
          </h2>
        </div>

        <Card className="border-border/30 bg-card/80 backdrop-blur">
          <CardContent className="pt-6 space-y-5">
            <p className="text-foreground/90 leading-relaxed text-center">
              {integrationText}
            </p>

            <Separator className="bg-border/30" />

            <div>
              <h4 className="text-sm uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Possibilidades de atuação integrada
              </h4>
              <ul className="space-y-2">
                {integrationPossibilities.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-foreground/80">
                    <span className="w-5 h-5 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-xs text-gold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* ── SEÇÃO 4: A PORTA ATUAL ── */}
      <motion.section {...fadeUp} transition={{ delay: 0.3, duration: 0.6 }}>
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl text-foreground">
            A Porta em que você está
          </h2>
        </div>

        <Card className="border-gold/15 bg-gradient-to-br from-card to-gold/[0.03] backdrop-blur">
          <CardContent className="pt-6 space-y-5">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 mb-3">
                <DoorOpen className="w-5 h-5 text-gold" />
                <span className="font-display text-xl text-gold font-semibold">
                  {enrichment.porta_nome}
                </span>
              </div>
              <p className="text-foreground/80 leading-relaxed">
                {enrichment.porta_descricao}
              </p>
            </div>

            <Separator className="bg-border/30" />

            <div>
              <h4 className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
                Convites desta Porta
              </h4>
              <ul className="space-y-2">
                {enrichment.porta_convites.map((c, i) => (
                  <li key={i} className="flex items-start gap-3 text-foreground/80">
                    <Eye className="w-4 h-4 text-gold/60 mt-0.5 shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* ── SEÇÃO 5: PRÓXIMO PASSO NATURAL ── */}
      <motion.section {...fadeUp} transition={{ delay: 0.4, duration: 0.6 }}>
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl text-foreground">
            Próximo passo natural
          </h2>
        </div>

        <Card className="border-border/30 bg-card/80 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                <Mic className="w-5 h-5 text-gold" />
              </div>
              <div className="space-y-3">
                <p className="text-foreground/90 leading-relaxed">
                  Agora que você reconheceu sua Voz, o próximo movimento é habitá-la. 
                  Isso significa transformar a escuta em atuação estruturada — não por técnica, 
                  mas por presença.
                </p>
                <p className="text-foreground/80 leading-relaxed">
                  Dentro da Casa Orácula, você encontrará ferramentas, travessias e práticas 
                  que sustentam o desenvolvimento da sua voz. Cada passo é guiado, 
                  cada ferramenta é simbólica, cada travessia é real.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* ── SEÇÃO 6: CONTINUAR A TRAVESSIA ── */}
      <motion.section {...fadeUp} transition={{ delay: 0.5, duration: 0.6 }}>
        <Card className="border-gold/20 bg-gradient-to-br from-gold/[0.05] to-card backdrop-blur overflow-hidden">
          <CardContent className="pt-8 pb-8 space-y-6">
            <div className="text-center space-y-4">
              <Sparkles className="w-8 h-8 text-gold mx-auto" />
              <h2 className="font-display text-2xl md:text-3xl text-gold">
                Continue a Travessia
              </h2>
              <p className="text-foreground/80 leading-relaxed max-w-lg mx-auto">
                Dentro da Casa Orácula você poderá:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto text-left">
                {[
                  'Integrar suas vozes',
                  'Desenvolver leitura simbólica',
                  'Participar do clube de leitura',
                  'Aprofundar o método',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-foreground/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button
                variant="gold"
                size="lg"
                onClick={() => navigate('/experiencia-gratuita')}
                className="gap-2"
              >
                Entrar na Casa Orácula
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/sobre')}
                className="gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Explorar o método
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
}
