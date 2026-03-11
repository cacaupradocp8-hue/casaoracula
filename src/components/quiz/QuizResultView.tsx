import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, Heart, DoorOpen, 
  Compass, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div className="space-y-14">

      {/* ── BLOCO 1: RESULTADO PRINCIPAL ── */}
      <motion.section {...fade(0)}>
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-gold/60 mb-3">
            Seu resultado simbólico
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-gold leading-tight">
            Sua Voz Primária
          </h2>
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
            {/* Voz Primária */}
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

            {/* Voz de Apoio */}
            {secondaryResult && (
              <>
                <div className="w-16 h-px bg-gold/20 mx-auto" />
                <div className="text-center">
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

            {/* Frase de impacto + integração */}
            <div className="bg-gold/5 border border-gold/10 rounded-xl p-5 text-center">
              <p className="text-foreground/90 leading-relaxed italic font-display">
                {secondaryResult
                  ? `Quando ${primaryResult.titulo_simbolico} e ${secondaryResult.titulo_simbolico} atuam juntas, sua escuta ganha profundidade e amplitude. A voz primária conduz enquanto a voz de apoio sustenta — juntas, criam um campo onde o simbólico se revela sem pressa.`
                  : `Sua voz carrega uma potência que se desdobra em múltiplas camadas. À medida que você habita esse território, outras vozes internas se revelam e complementam sua forma de escutar e conduzir.`}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* ── BLOCO 2: MOMENTO ATUAL — A PORTA ── */}
      <motion.section {...fade(0.1)}>
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl md:text-3xl text-foreground">
            A Porta em que você está
          </h2>
        </div>

        <Card className="border-gold/15 bg-gradient-to-br from-card to-gold/[0.03] backdrop-blur">
          <CardContent className="pt-8 pb-8 space-y-4 text-center">
            <div className="inline-flex items-center gap-2 mb-2">
              <DoorOpen className="w-5 h-5 text-gold" />
              <span className="font-display text-xl text-gold font-semibold">
                Porta da Beira
              </span>
            </div>
            <p className="text-foreground/80 leading-relaxed max-w-xl mx-auto">
              Você está no limiar — entre o que já viveu e o que ainda não se revelou.
              A Beira é o lugar onde a escuta se aprofunda e o corpo começa a reconhecer
              o que a mente ainda não nomeou.
            </p>
            <p className="text-muted-foreground text-sm italic max-w-md mx-auto pt-2">
              Esse é o momento de habitar a passagem, não de apressá-la.
            </p>
          </CardContent>
        </Card>
      </motion.section>

      {/* ── BLOCO 3: LEITURA DE CONTEXTO ── */}
      <motion.section {...fade(0.2)}>
        <Card className="border-border/20 bg-card/60 backdrop-blur">
          <CardContent className="py-10 px-6 md:px-10 text-center space-y-4">
            <Compass className="w-7 h-7 text-gold mx-auto" />
            <p className="text-foreground/90 leading-relaxed max-w-2xl mx-auto text-lg font-display">
              Seu resultado indica um modo de condução e um momento de travessia
              que pedem aprofundamento — não apenas informação.
            </p>
            <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Reconhecer sua voz é o primeiro passo. O segundo é encontrar o campo
              certo para que ela se desenvolva com profundidade, ética e presença.
            </p>
          </CardContent>
        </Card>
      </motion.section>

      {/* ── CTA: HABITAR A CASA ── */}
      <motion.section {...fade(0.3)}>
        <div className="text-center space-y-3">
          <Button
            variant="gold"
            size="lg"
            onClick={() => navigate('/planos-clube')}
            className="gap-2 px-8 py-6 text-base"
          >
            Habitar a Casa Orácula
            <ArrowRight className="w-4 h-4" />
          </Button>
          <p className="text-muted-foreground text-sm">
            Continue sua jornada com acesso ao Clube de Leitura Oracular
          </p>
        </div>
      </motion.section>
    </div>
  );
}
