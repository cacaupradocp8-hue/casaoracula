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

      {/* ── BLOCO 4: APRESENTAÇÃO DO CLUBE ── */}
      <motion.section {...fade(0.3)}>
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-gold/60 mb-3">
            O próximo passo natural
          </p>
          <h2 className="font-display text-2xl md:text-3xl text-gold">
            Clube de Leitura Oracular
          </h2>
        </div>

        <Card className="border-gold/20 bg-card/80 backdrop-blur">
          <CardContent className="pt-8 pb-8 space-y-6">
            <p className="text-foreground/85 leading-relaxed text-center max-w-2xl mx-auto">
              O Clube é o espaço onde a jornada que começou aqui ganha corpo.
              Cada ciclo de leitura é uma travessia guiada — com escuta, reflexão
              e aplicação prática para quem deseja habitar a linguagem simbólica
              com profundidade.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              {[
                { icon: BookOpen, text: 'Leituras simbólicas guiadas' },
                { icon: Sparkles, text: 'Reflexões semanais' },
                { icon: Heart, text: 'Carta da semana' },
                { icon: Compass, text: 'Aplicação prática' },
                { icon: Users, text: 'Comunidade de mulheres em travessia' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-3 text-foreground/80">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-gold" />
                  </div>
                  <span className="text-sm">{text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* ── BLOCO 5: PARA QUEM É ── */}
      <motion.section {...fade(0.35)}>
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl text-foreground">
            Para quem é
          </h2>
        </div>

        <Card className="border-border/20 bg-card/60 backdrop-blur">
          <CardContent className="py-8 px-6">
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'Mulheres em autoconhecimento',
                'Terapeutas',
                'Psicólogas',
                'Mentoras do feminino',
                'Facilitadoras',
              ].map((perfil, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-full border border-gold/20 bg-gold/5 text-foreground/80 text-sm font-medium"
                >
                  {perfil}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* ── BLOCO 6: PLANOS ── */}
      <motion.section {...fade(0.4)}>
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl text-foreground">
            Escolha seu ritmo
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-lg mx-auto">
          {/* Mensal */}
          <Card className="border-border/30 bg-card/80 backdrop-blur text-center">
            <CardContent className="pt-8 pb-8 space-y-3">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Plano Mensal</p>
              <p className="font-display text-3xl text-foreground">
                R$59<span className="text-lg text-muted-foreground">,97</span>
              </p>
              <p className="text-sm text-muted-foreground">/mês</p>
              <Button
                variant="outline"
                className="mt-4 w-full border-gold/30 hover:bg-gold/10 hover:border-gold/50"
                onClick={() => navigate('/planos')}
              >
                Começar agora
              </Button>
            </CardContent>
          </Card>

          {/* Anual */}
          <Card className="border-gold/30 bg-gradient-to-br from-gold/[0.06] to-card backdrop-blur text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 bg-gold/20 py-1">
              <p className="text-[10px] uppercase tracking-widest text-gold font-semibold flex items-center justify-center gap-1">
                <Crown className="w-3 h-3" /> Melhor valor
              </p>
            </div>
            <CardContent className="pt-10 pb-8 space-y-3">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Plano Anual</p>
              <p className="font-display text-3xl text-gold">
                R$599<span className="text-lg text-gold/70">,97</span>
              </p>
              <p className="text-sm text-muted-foreground">/ano</p>
              <Button
                variant="gold"
                className="mt-4 w-full"
                onClick={() => navigate('/planos')}
              >
                Escolher anual
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* ── BLOCO 7: CTA FINAL ── */}
      <motion.section {...fade(0.5)}>
        <Card className="border-gold/20 bg-gradient-to-br from-gold/[0.05] to-card backdrop-blur overflow-hidden">
          <CardContent className="py-12 px-6 md:px-10 space-y-8 text-center">
            <Sparkles className="w-8 h-8 text-gold mx-auto" />
            <div className="space-y-3 max-w-lg mx-auto">
              <p className="font-display text-xl md:text-2xl text-foreground leading-relaxed">
                A Casa Orácula não é apenas um espaço de estudo.
              </p>
              <p className="font-display text-xl md:text-2xl text-gold leading-relaxed">
                É um lugar de travessia simbólica.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button
                variant="gold"
                size="lg"
                onClick={() => navigate('/planos')}
                className="gap-2"
              >
                Habitar a Casa Orácula
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/clube-leitura')}
                className="gap-2 border-gold/30 hover:bg-gold/10"
              >
                <BookOpen className="w-4 h-4" />
                Conhecer o Clube
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
}
