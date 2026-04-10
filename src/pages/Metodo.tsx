import { AppLayout } from '@/components/layout/AppLayout';
import { useCopy } from '@/hooks/useCopy';
import { Loader2 } from 'lucide-react';
import { MetodoHero } from '@/components/metodo/MetodoHero';
import { MetodoPilares } from '@/components/metodo/MetodoPilares';
import { MetodoClubeLeitura } from '@/components/metodo/MetodoClubeLeitura';
import { MetodoCasaMaquinas } from '@/components/metodo/MetodoCasaMaquinas';
import { MetodoFormacao } from '@/components/metodo/MetodoFormacao';
import { MetodoPlanos } from '@/components/metodo/MetodoPlanos';
import { MetodoDepoimentos } from '@/components/metodo/MetodoDepoimentos';
import { MetodoFAQ } from '@/components/metodo/MetodoFAQ';
import { MetodoCTA } from '@/components/metodo/MetodoCTA';
import { MetodoFooter } from '@/components/metodo/MetodoFooter';
import { MetodoOraculaSection } from '@/components/sales/metodologia/MetodoOraculaSection';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const RitualDivider = () => (
  <div className="flex items-center justify-center gap-4 my-12 md:my-16">
    <div className="h-px w-20 bg-gradient-to-r from-transparent to-gold/20" />
    <span className="text-gold/50 text-xs tracking-[0.3em]">✦</span>
    <div className="h-px w-20 bg-gradient-to-l from-transparent to-gold/20" />
  </div>
);

export default function Metodo() {
  const { getCopyByKey, isLoading } = useCopy();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* 1. Hero — único lugar com breathing orb */}
        <MetodoHero />

        <div className="container mx-auto px-6 max-w-4xl">
          <RitualDivider />

          {/* 2. O que é + Para quem é */}
          <motion.section {...fadeInUp} transition={{ duration: 0.8 }} className="py-12 md:py-16">
            <h2 className="text-3xl md:text-4xl font-display text-gold mb-8 text-center tracking-wide">
              O que é a Casa
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl leading-[1.9] text-center max-w-3xl mx-auto mb-12">
              {getCopyByKey('casa_oque_e', 'A Casa Orácula é um espaço de formação profunda, onde mulheres atravessam camadas de si mesmas através da linguagem simbólica.')}
            </p>
            <h2 className="text-3xl md:text-4xl font-display text-gold mb-8 text-center tracking-wide">
              Para quem é
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl leading-[1.9] text-center max-w-3xl mx-auto">
              {getCopyByKey('casa_para_quem', 'Para mulheres que sentem o chamado de mergulhar em si mesmas com profundidade.')}
            </p>
          </motion.section>

          <RitualDivider />

          {/* 3. Fundamento */}
          <motion.section {...fadeInUp} transition={{ duration: 0.8 }} className="py-12 md:py-16">
            <h2 className="text-3xl md:text-4xl font-display text-gold mb-10 text-center tracking-wide">
              Fundamento do Método
            </h2>
            <Card className="bg-card/30 backdrop-blur-sm border-gold/10">
              <CardContent className="p-8 md:p-12">
                <p className="text-muted-foreground text-lg md:text-xl leading-[1.9] text-center font-display italic">
                  {getCopyByKey('casa_fundamento', 'Aqui o símbolo não é conceito. É porta. Cada arquétipo, cada carta, cada imagem que emerge no processo é tratado como linguagem viva da psique.')}
                </p>
              </CardContent>
            </Card>
          </motion.section>
        </div>

        {/* 4. Método ORÁCULA (Mapa, Espelho, Travessia) */}
        <MetodoOraculaSection />

        <div className="container mx-auto px-6 max-w-4xl">
          <RitualDivider />

          {/* 5. Pilares */}
          <MetodoPilares />

          <RitualDivider />

          {/* 6. Clube de Leitura */}
          <MetodoClubeLeitura />

          <RitualDivider />

          {/* 7. Casa das Máquinas */}
          <MetodoCasaMaquinas />

          <RitualDivider />

          {/* 8. Formação */}
          <MetodoFormacao />

          <RitualDivider />

          {/* 9. Planos */}
          <MetodoPlanos />

          <RitualDivider />

          {/* 10. Depoimentos */}
          <MetodoDepoimentos />

          <RitualDivider />

          {/* 11. FAQ */}
          <MetodoFAQ />

          <RitualDivider />

          {/* 12. CTA final */}
          <MetodoCTA />
        </div>

        {/* 13. Footer */}
        <MetodoFooter />
      </div>
    </AppLayout>
  );
}
