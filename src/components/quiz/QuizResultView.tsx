import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart, ArrowRight } from 'lucide-react';
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

      {/* ── BLOCO 1: SUA VOZ ── */}
      <motion.section {...fade(0)}>
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-gold/60 mb-3">
            Sua voz foi escutada
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
          </CardContent>
        </Card>
      </motion.section>

      {/* ── BLOCO 2: SOMBRA & FORÇA ── */}
      <motion.section {...fade(0.1)}>
        <Card className="border-gold/15 bg-gradient-to-br from-card to-gold/[0.03] backdrop-blur">
          <CardContent className="py-8 px-6 text-center space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-gold/50 mb-2">
              O que sua voz revela
            </p>
            <div className="bg-gold/5 border border-gold/10 rounded-xl p-5 text-center">
              <p className="text-foreground/90 leading-relaxed italic font-display">
                {secondaryResult
                  ? `Quando ${primaryResult.titulo_simbolico} e ${secondaryResult.titulo_simbolico} atuam juntas, sua escuta ganha profundidade e amplitude. A voz primária conduz enquanto a voz de apoio sustenta.`
                  : `Sua voz carrega uma potência que se desdobra em múltiplas camadas. À medida que você habita esse território, outras vozes internas se revelam.`}
              </p>
            </div>
            <p className="text-muted-foreground text-sm max-w-md mx-auto pt-2">
              Mas essa é apenas a superfície. A travessia revela o que a voz ainda não consegue dizer.
            </p>
          </CardContent>
        </Card>
      </motion.section>

      {/* ── CTA: PRÓXIMO PASSO — CARTOGRAFIA ── */}
      <motion.section {...fade(0.2)}>
        <div className="text-center space-y-4">
          <Button
            variant="gold"
            size="lg"
            onClick={() => navigate('/ferramentas/cartografia-psiquica-oracula')}
            className="gap-2 px-8 py-6 text-base"
          >
            Revelar minha CidaDELA
            <ArrowRight className="w-4 h-4" />
          </Button>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            A próxima etapa é a Cartografia Psíquica Orácula — o mapa simbólico da sua psique.
          </p>
        </div>
      </motion.section>
    </div>
  );
}
