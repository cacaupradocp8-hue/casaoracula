import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import heroPlanos from '@/assets/planos/hero-rotas.png';

function HeroParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 32 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${30 + Math.random() * 70}%`,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 4,
        duration: Math.random() * 3 + 3,
        opacity: Math.random() * 0.5 + 0.2,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gold"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [particle.opacity, particle.opacity * 2.5, particle.opacity],
            scale: [1, 1.6, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export function PlanosHero() {
  const scrollToPlanos = () => {
    const section = document.getElementById('secao-planos');
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToFuncionamento = () => {
    const section = document.getElementById('secao-funcionamento');
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden min-h-[85vh] md:min-h-[90vh] flex items-center pt-20">
      <img
        src={heroPlanos}
        alt="Rotas da Casa Orácula"
        className="absolute inset-0 h-full w-full object-cover object-[70%_15%] sm:object-[68%_top] md:object-right"
      />

      <div className="absolute inset-0 bg-background/40 sm:bg-background/10 z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background from-15% via-background/80 via-50% to-transparent sm:bg-gradient-to-r sm:from-background sm:via-background/78 sm:to-transparent z-[1]" />
      
      <HeroParticles />

      <div className="container mx-auto relative z-20 px-6">
        <div className="max-w-3xl sm:ml-[5%] md:ml-[8%]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-6 md:space-y-8"
          >
            <div className="space-y-2">
               <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gold/80 text-xs uppercase tracking-[0.3em] font-medium"
              >
                Rotas da Casa Orácula
              </motion.p>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] md:leading-[1.05]">
                Você não precisa de mais conteúdo solto. <br className="hidden md:block" />
                <span className="text-gold">Precisa de uma rota.</span>
              </h1>
            </div>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
              Leituras, contos, áudios e práticas simbólicas para transformar percepção em travessia.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Button 
                size="lg" 
                onClick={scrollToPlanos}
                className="w-full sm:w-auto bg-gold hover:bg-gold-light text-primary-foreground font-medium px-10 py-7 text-base rounded-full transition-all hover:scale-105"
              >
                Entrar nas Rotas
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={scrollToFuncionamento}
                className="w-full sm:w-auto border-gold/30 text-foreground hover:bg-gold/5 px-10 py-7 text-base rounded-full"
              >
                Ver como funciona
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
