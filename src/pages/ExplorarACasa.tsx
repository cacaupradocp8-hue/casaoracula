import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Compass, Users, BookOpen, Sparkles, ArrowRight, GraduationCap, Wrench } from 'lucide-react';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

const PARA_QUEM = [
  'Terapeutas que desejam conduzir processos simbólicos com profundidade',
  'Psicólogas buscando ferramentas complementares para a clínica',
  'Mentoras do feminino que querem um método estruturado',
  'Facilitadoras de grupos e círculos de mulheres',
];

const O_QUE_ENCONTRA = [
  { icon: GraduationCap, title: 'Formação Orácula', desc: 'Método completo de formação em psicologia simbólica aplicada.' },
  { icon: BookOpen, title: 'Clube do Livro Oracular', desc: 'Travessias semanais com aulas-álbum, práticas e reflexões coletivas.' },
  { icon: Wrench, title: 'Ferramentas Clínicas', desc: 'Cartografia Psíquica, Leitura Simbólica e instrumentos de escuta profunda.' },
  { icon: Sparkles, title: 'IA Simbólica', desc: 'Agentes inteligentes para apoio em sessão e leitura oracular.' },
];

const PASSOS = [
  { num: '01', title: 'Descubra seu eixo', desc: 'Faça a Cartografia Psíquica gratuita e entenda seu ponto de partida.' },
  { num: '02', title: 'Escolha seu caminho', desc: 'Clube do Livro para imersão cultural ou Formação para prática profissional.' },
  { num: '03', title: 'Pratique com método', desc: 'Use as ferramentas, participe da comunidade e evolua com acompanhamento.' },
];

export default function ExplorarACasa() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* HERO */}
        <section className="relative py-20 md:py-32">
          <ResponsiveContainer size="narrow" className="text-center">
            <motion.h1 {...fadeIn(0)} className="font-display text-3xl md:text-5xl font-light text-foreground leading-tight mb-6">
              Uma plataforma para terapeutas conduzirem transformação com método simbólico
            </motion.h1>
            <motion.p {...fadeIn(0.15)} className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
              A Casa Orácula reúne formação, ferramentas e comunidade para quem trabalha com o feminino e o simbólico de forma ética e profissional.
            </motion.p>
            <motion.div {...fadeIn(0.3)}>
              <Button
                variant="gold"
                size="lg"
                className="gap-2 text-base px-8"
                onClick={() => navigate('/sala-da-visitante')}
              >
                Descobrir meu caminho
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </ResponsiveContainer>
        </section>

        {/* PARA QUEM É */}
        <section className="py-16 border-t border-border/30">
          <ResponsiveContainer size="narrow">
            <motion.h2 {...fadeIn()} className="font-display text-2xl md:text-3xl text-foreground mb-8 text-center">
              Para quem é
            </motion.h2>
            <div className="grid gap-4">
              {PARA_QUEM.map((item, i) => (
                <motion.div key={i} {...fadeIn(i * 0.08)} className="flex items-start gap-3 p-4 rounded-xl bg-card/50 border border-border/20">
                  <Users className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-foreground/80 text-sm md:text-base">{item}</p>
                </motion.div>
              ))}
            </div>
          </ResponsiveContainer>
        </section>

        {/* O QUE VOCÊ ENCONTRA */}
        <section className="py-16 border-t border-border/30">
          <ResponsiveContainer size="default">
            <motion.h2 {...fadeIn()} className="font-display text-2xl md:text-3xl text-foreground mb-10 text-center">
              O que você encontra
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {O_QUE_ENCONTRA.map((item, i) => (
                <motion.div key={i} {...fadeIn(i * 0.1)} className="p-6 rounded-2xl bg-card/60 border border-border/20 space-y-3">
                  <item.icon className="w-6 h-6 text-primary" />
                  <h3 className="font-display text-lg font-medium text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </ResponsiveContainer>
        </section>

        {/* COMO FUNCIONA */}
        <section className="py-16 border-t border-border/30">
          <ResponsiveContainer size="narrow">
            <motion.h2 {...fadeIn()} className="font-display text-2xl md:text-3xl text-foreground mb-10 text-center">
              Como funciona
            </motion.h2>
            <div className="grid gap-6">
              {PASSOS.map((passo, i) => (
                <motion.div key={i} {...fadeIn(i * 0.1)} className="flex gap-5 items-start p-5 rounded-2xl bg-card/40 border border-border/15">
                  <span className="font-display text-3xl font-light text-primary/40">{passo.num}</span>
                  <div>
                    <h3 className="font-display text-lg font-medium text-foreground mb-1">{passo.title}</h3>
                    <p className="text-muted-foreground text-sm">{passo.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div {...fadeIn(0.4)} className="text-center mt-12">
              <Button
                variant="gold"
                size="lg"
                className="gap-2 text-base px-8"
                onClick={() => navigate('/sala-da-visitante')}
              >
                Descobrir meu caminho
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </ResponsiveContainer>
        </section>
      </div>
    </AppLayout>
  );
}
