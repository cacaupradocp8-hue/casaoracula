import { motion } from 'framer-motion';
import { BookOpen, Sparkles, ArrowRight, Star, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layout/AppLayout';

export function ClubeOferta() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative px-4 py-20 md:py-28 text-center max-w-2xl mx-auto"
        >
          <div className="space-y-6">
            <Sparkles className="w-8 h-8 text-primary mx-auto opacity-60" />

            <h1 className="font-display text-3xl md:text-4xl text-primary tracking-wide leading-tight">
              CLUBE DO LIVRO ORACULAR
            </h1>

            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Laboratório de prática simbólica
            </p>

            <div className="max-w-md mx-auto pt-4 space-y-4">
              <p className="text-foreground/90 leading-relaxed italic font-display text-lg">
                "Você não está lendo um livro.
                <br />
                Está treinando sua leitura de campo."
              </p>

              <p className="text-muted-foreground text-sm leading-relaxed">
                O Clube do Livro Oracular é um espaço de prática simbólica estruturada
                — onde cada livro se torna ferramenta de travessia interior.
              </p>
            </div>
          </div>
        </motion.section>

        {/* O que é */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="px-4 py-12 max-w-xl mx-auto space-y-8"
        >
          <div className="grid gap-6">
            {[
              {
                icon: <BookOpen className="w-5 h-5 text-primary" />,
                title: 'Ciclos de leitura guiada',
                desc: 'Cada ciclo é uma jornada simbólica com livro, escutas e encontros ao vivo.',
              },
              {
                icon: <Compass className="w-5 h-5 text-primary" />,
                title: 'Cartografia simbólica',
                desc: 'Registre seus movimentos internos ao longo da leitura.',
              },
              {
                icon: <Star className="w-5 h-5 text-primary" />,
                title: 'Encontros mensais',
                desc: 'Momentos de partilha e aprofundamento com a comunidade.',
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start p-4 rounded-lg border border-border/50 bg-card/60">
                <div className="mt-0.5">{item.icon}</div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="px-4 py-16 text-center max-w-md mx-auto space-y-6"
        >
          <p className="text-muted-foreground text-sm">
            O Clube está disponível para assinantes e alunas da Formação Orácula.
          </p>

          <div className="grid gap-3">
            <Button
              variant="gold"
              size="lg"
              className="gap-2 w-full"
              onClick={() => navigate('/planos')}
            >
              <BookOpen className="w-4 h-4" />
              Assinar o Clube
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="gap-2 w-full"
              onClick={() => navigate('/oracula')}
            >
              <Sparkles className="w-4 h-4" />
              Conhecer a Formação Orácula
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-xs text-muted-foreground/60 pt-4">
            Ou{' '}
            <button
              type="button"
              onClick={() => navigate('/vitrine')}
              className="text-primary/70 hover:text-primary underline underline-offset-2 transition-colors"
            >
              explore a Vitrine
            </button>{' '}
            para conhecer tudo que a Casa oferece.
          </p>
        </motion.section>
      </div>
    </AppLayout>
  );
}
