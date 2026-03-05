import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, Star, DoorOpen, ArrowRight, 
  BookOpen, Heart, Mic
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

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export function QuizResultView({ primaryResult, secondaryResult }: QuizResultViewProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-10">
      {/* ── SEÇÃO 1: RESULTADO PRINCIPAL ── */}
      <motion.section {...fadeUp}>
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-gold/70 mb-2">
            Seu resultado simbólico
          </p>
          <h2 className="font-display text-2xl md:text-3xl text-gold">
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
            </div>

            <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
              {primaryResult.texto_interpretativo}
            </p>

            <div className="bg-gold/5 border border-gold/10 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Dom natural</p>
              <p className="text-foreground/90 font-medium flex items-center gap-2">
                <Star className="w-4 h-4 text-gold" />
                A capacidade de ouvir o que ainda não foi dito.
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
                  {[
                    'Sustentação do campo quando a voz principal precisa descansar',
                    'Equilíbrio entre intensidade e suavidade',
                    'Presença silenciosa que ancora a travessia',
                  ].map((q, i) => (
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
            Como essas Vozes atuam juntas
          </h2>
        </div>

        <Card className="border-border/30 bg-card/80 backdrop-blur">
          <CardContent className="pt-6">
            <p className="text-foreground/90 leading-relaxed text-center">
              {secondaryResult
                ? `Quando ${primaryResult.titulo_simbolico} e ${secondaryResult.titulo_simbolico} atuam juntas, sua escuta ganha profundidade e amplitude. A voz primária conduz, enquanto a voz de apoio sustenta o campo — juntas, elas criam um espaço de acolhimento onde o simbólico pode se revelar sem pressa.`
                : `Sua voz carrega uma potência que se desdobra em múltiplas camadas. À medida que você habita esse território, outras vozes internas se revelam e complementam sua forma de escutar e conduzir.`}
            </p>
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
          <CardContent className="pt-6 space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 mb-3">
                <DoorOpen className="w-5 h-5 text-gold" />
                <span className="font-display text-xl text-gold font-semibold">
                  Porta da Beira
                </span>
              </div>
              <p className="text-foreground/80 leading-relaxed">
                Você está no limiar — entre o que já viveu e o que ainda não se revelou. 
                A Beira é o lugar onde a escuta se aprofunda e o corpo começa a reconhecer 
                o que a mente ainda não nomeou.
              </p>
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
              <p className="text-foreground/90 leading-relaxed">
                Agora que você reconheceu sua Voz, o próximo movimento é habitá-la. 
                Isso significa transformar a escuta em atuação estruturada — não por técnica, 
                mas por presença. Dentro da Casa Orácula, você encontrará ferramentas, 
                travessias e práticas que sustentam o desenvolvimento da sua voz.
              </p>
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
                  'Aprofundar leitura simbólica',
                  'Participar do clube de leitura',
                  'Desenvolver atuação profissional',
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
