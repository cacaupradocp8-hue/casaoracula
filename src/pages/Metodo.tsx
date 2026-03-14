import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCopy } from '@/hooks/useCopy';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Eye, Ear, Sparkles } from 'lucide-react';

const PILAR_ICONS = [Eye, Ear, Sparkles];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const RitualDivider = () => (
  <div className="flex items-center justify-center gap-4 my-16 md:my-24">
    <div className="h-px w-20 bg-gradient-to-r from-transparent to-gold/30" />
    <span className="text-gold/40 text-xs tracking-[0.3em]">✦</span>
    <div className="h-px w-20 bg-gradient-to-l from-transparent to-gold/30" />
  </div>
);

export default function Metodo() {
  const { getCopyByKey, isLoading } = useCopy();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  const pilares = [
    {
      titulo: getCopyByKey('casa_pilar_1_titulo', 'Leitura Simbólica'),
      texto: getCopyByKey('casa_pilar_1_texto', 'A arte de ler imagens e arquétipos como linguagem da alma.'),
      Icon: PILAR_ICONS[0]
    },
    {
      titulo: getCopyByKey('casa_pilar_2_titulo', 'Escuta Oracular'),
      texto: getCopyByKey('casa_pilar_2_texto', 'A presença que sustenta o processo de travessia.'),
      Icon: PILAR_ICONS[1]
    },
    {
      titulo: getCopyByKey('casa_pilar_3_titulo', 'Travessia Iniciática'),
      texto: getCopyByKey('casa_pilar_3_texto', 'A formação como passagem, não acúmulo.'),
      Icon: PILAR_ICONS[2]
    }
  ];

  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* Hero Section with breathing orb */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/90" />
          
          {/* Breathing orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-br from-gold/8 via-mystic/6 to-transparent blur-3xl animate-breathe pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-mystic/5 blur-2xl animate-breathe-subtle pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative z-10 text-center px-6 max-w-3xl mx-auto"
          >
            <p className="text-gold/50 uppercase tracking-[0.4em] text-xs mb-8 font-medium">
              Método Orácula
            </p>
            <h1 className="text-5xl md:text-7xl font-display font-semibold text-foreground mb-6 tracking-wide leading-[1.1]">
              {getCopyByKey('casa_titulo', 'Casa Orácula')}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-display italic leading-relaxed">
              {getCopyByKey('casa_subtitulo', 'Um espaço de formação simbólica para a psique feminina')}
            </p>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-5 h-8 rounded-full border border-muted-foreground/20 flex items-start justify-center p-1.5">
              <div className="w-1 h-1 rounded-full bg-gold/60" />
            </div>
          </motion.div>
        </section>

        <div className="container mx-auto px-6 max-w-4xl">
          <RitualDivider />

          {/* O que é */}
          <motion.section
            {...fadeInUp}
            transition={{ duration: 0.8 }}
            className="mb-0 py-12 md:py-16"
          >
            <h2 className="text-3xl md:text-4xl font-display text-gold/90 mb-8 text-center tracking-wide">
              O que é a Casa
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl leading-[1.9] text-center max-w-3xl mx-auto">
              {getCopyByKey('casa_oque_e', 'A Casa Orácula é um espaço de formação profunda, onde mulheres atravessam camadas de si mesmas através da linguagem simbólica.')}
            </p>
          </motion.section>

          {/* Para quem é */}
          <motion.section
            {...fadeInUp}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-0 py-12 md:py-16"
          >
            <h2 className="text-3xl md:text-4xl font-display text-gold/90 mb-8 text-center tracking-wide">
              Para quem é
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl leading-[1.9] text-center max-w-3xl mx-auto">
              {getCopyByKey('casa_para_quem', 'Para mulheres que sentem o chamado de mergulhar em si mesmas com profundidade.')}
            </p>
          </motion.section>

          <RitualDivider />

          {/* Fundamento */}
          <motion.section
            {...fadeInUp}
            transition={{ duration: 0.8 }}
            className="mb-0 py-12 md:py-16"
          >
            <h2 className="text-3xl md:text-4xl font-display text-gold/90 mb-10 text-center tracking-wide">
              Fundamento do Método
            </h2>
            <Card className="bg-card/40 backdrop-blur-md border-gold/10 hover:border-gold/20 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_40px_-10px_hsl(var(--gold)/0.12)]">
              <CardContent className="p-8 md:p-12">
                <p className="text-muted-foreground text-lg md:text-xl leading-[1.9] text-center font-display italic">
                  {getCopyByKey('casa_fundamento', 'Aqui o símbolo não é conceito. É porta. Cada arquétipo, cada carta, cada imagem que emerge no processo é tratado como linguagem viva da psique.')}
                </p>
              </CardContent>
            </Card>
          </motion.section>

          {/* Pilares */}
          <motion.section
            {...fadeInUp}
            transition={{ duration: 0.8 }}
            className="mb-0 py-16 md:py-24"
          >
            <h2 className="text-3xl md:text-4xl font-display text-gold/90 mb-12 text-center tracking-wide">
              Os Três Pilares
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {pilares.map((pilar, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                >
                  <Card className="bg-card/30 backdrop-blur-md border-gold/10 h-full hover:border-mystic/30 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_16px_50px_-12px_hsl(var(--mystic)/0.15)] group">
                    <CardContent className="p-8 text-center">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold/15 to-mystic/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                        <pilar.Icon className="w-6 h-6 text-gold" />
                      </div>
                      <h3 className="text-xl font-display text-gold mb-4 tracking-wide">{pilar.titulo}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{pilar.texto}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <RitualDivider />

          {/* CTA */}
          <motion.section
            {...fadeInUp}
            transition={{ duration: 0.8 }}
            className="text-center py-16 md:py-24 mb-8"
          >
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 font-display italic">
              {getCopyByKey('casa_cta_texto', 'Pronta para atravessar o limiar?')}
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/planos')}
              className="bg-gradient-to-r from-gold to-mystic text-background border border-gold/30 hover:scale-105 transition-all duration-300 text-lg px-10 py-6 shadow-[0_0_40px_-8px_hsl(var(--gold)/0.3)] hover:shadow-[0_0_60px_-8px_hsl(var(--gold)/0.4)]"
            >
              {getCopyByKey('casa_cta_botao', 'Explorar Caminhos')}
            </Button>
          </motion.section>
        </div>
      </div>
    </AppLayout>
  );
}
