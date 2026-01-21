import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCopy } from '@/hooks/useCopy';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Eye, Ear, Sparkles } from 'lucide-react';

const PILAR_ICONS = [Eye, Ear, Sparkles];

const RitualDivider = () => (
  <div className="flex items-center justify-center gap-4 my-12">
    <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/40" />
    <span className="text-gold/60 text-lg">✦</span>
    <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/40" />
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-serif text-gold mb-4">
            {getCopyByKey('casa_titulo', 'Casa Orácula')}
          </h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            {getCopyByKey('casa_subtitulo', 'Um espaço de formação simbólica para a psique feminina')}
          </p>
        </motion.div>

        <RitualDivider />

        {/* O que é */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-serif text-gold/90 mb-4 text-center">O que é a Casa</h2>
          <p className="text-foreground/70 text-lg leading-relaxed text-center max-w-3xl mx-auto">
            {getCopyByKey('casa_oque_e', 'A Casa Orácula é um espaço de formação profunda, onde mulheres atravessam camadas de si mesmas através da linguagem simbólica.')}
          </p>
        </motion.section>

        {/* Para quem é */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-serif text-gold/90 mb-4 text-center">Para quem é</h2>
          <p className="text-foreground/70 text-lg leading-relaxed text-center max-w-3xl mx-auto">
            {getCopyByKey('casa_para_quem', 'Para mulheres que sentem o chamado de mergulhar em si mesmas com profundidade.')}
          </p>
        </motion.section>

        <RitualDivider />

        {/* Fundamento */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-serif text-gold/90 mb-4 text-center">Fundamento do Método</h2>
          <Card className="glass border-gold/20">
            <CardContent className="p-6 md:p-8">
              <p className="text-foreground/70 text-lg leading-relaxed text-center">
                {getCopyByKey('casa_fundamento', 'Aqui o símbolo não é conceito. É porta. Cada arquétipo, cada carta, cada imagem que emerge no processo é tratado como linguagem viva da psique.')}
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* Pilares */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-serif text-gold/90 mb-8 text-center">Os Três Pilares</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {pilares.map((pilar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                <Card className="glass border-gold/20 h-full hover:border-gold/40 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                      <pilar.Icon className="w-6 h-6 text-gold" />
                    </div>
                    <h3 className="text-lg font-serif text-gold mb-3">{pilar.titulo}</h3>
                    <p className="text-sm text-foreground/60 leading-relaxed">{pilar.texto}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <RitualDivider />

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center py-8"
        >
          <p className="text-xl text-foreground/70 mb-6">
            {getCopyByKey('casa_cta_texto', 'Pronta para atravessar o limiar?')}
          </p>
          <Button 
            variant="gold" 
            size="lg"
            onClick={() => navigate('/planos')}
            className="text-lg px-8"
          >
            {getCopyByKey('casa_cta_botao', 'Explorar Caminhos')}
          </Button>
        </motion.section>
      </div>
    </AppLayout>
  );
}
