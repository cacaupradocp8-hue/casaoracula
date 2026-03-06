import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Compass, Ear, Route, Radio, BookOpen, Users, Wrench, Sparkles } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useAppSettings } from '@/hooks/useAppSettings';
import mandalaHome from '@/assets/mandala-home.jpg';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
};

export function VisitorHomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getSetting } = useAppSettings();

  const precoMensal = getSetting('clube_preco_mensal', 'R$ 59,97');
  const precoAnual = getSetting('clube_preco_anual', 'R$ 599,97');

  return (
    <AppLayout>
      <div className="relative">

        {/* ═══ SEÇÃO 1 — PORTAL DA CASA ═══ */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          {/* Mandala background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.08, scale: 1 }}
              transition={{ duration: 2.5, ease: 'easeOut' }}
              className="w-[500px] h-[500px] md:w-[700px] md:h-[700px]"
            >
              <img src={mandalaHome} alt="" className="w-full h-full object-contain animate-ritual-breathe" />
            </motion.div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />

          <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl text-foreground mb-4 leading-tight"
            >
              Casa <span className="text-gold-gradient">Orácula</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-foreground/60 italic text-lg md:text-xl font-display max-w-lg mx-auto mb-4 leading-relaxed"
            >
              Um espaço para mulheres que escutam o invisível e transformam escuta em método.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-muted-foreground text-sm md:text-base max-w-md mx-auto mb-10 leading-relaxed"
            >
              Estudo, prática terapêutica e formação profissional — 
              para quem deseja conduzir processos humanos com consciência.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Button
                variant="gold"
                size="lg"
                onClick={() => navigate('/salas/big5')}
                className="gap-2 px-8"
              >
                Descobrir minha Voz
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => navigate('/comece-aqui')}
                className="gap-2 text-muted-foreground hover:text-gold"
              >
                <Compass className="w-4 h-4" />
                Explorar a Casa
              </Button>
            </motion.div>
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

        {/* ═══ SEÇÃO 2 — PILARES DA CASA ═══ */}
        <section className="px-4 py-20">
          <div className="max-w-3xl mx-auto">
            <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="text-center mb-12">
              <p className="text-xs text-gold/50 uppercase tracking-[0.2em] mb-3">Os três pilares</p>
              <div className="w-10 h-px bg-gold/20 mx-auto" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Ear,
                  title: 'Escutar',
                  desc: 'Ferramentas simbólicas para leitura da psique.',
                },
                {
                  icon: Route,
                  title: 'Conduzir',
                  desc: 'Métodos para sustentar processos terapêuticos.',
                },
                {
                  icon: Radio,
                  title: 'Transmitir',
                  desc: 'Formação contínua para terapeutas.',
                },
              ].map((pilar, i) => (
                <motion.div
                  key={pilar.title}
                  {...fadeUp}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                >
                  <div className="text-center space-y-4 p-6 rounded-2xl bg-card/30 border border-border/20 hover:border-gold/15 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/15 flex items-center justify-center mx-auto">
                      <pilar.icon className="w-5 h-5 text-gold/70" />
                    </div>
                    <h3 className="font-display text-xl text-foreground">{pilar.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{pilar.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

        {/* ═══ SEÇÃO 3 — TESTE DA VOZ ═══ */}
        <section className="px-4 py-20">
          <div className="max-w-xl mx-auto text-center">
            <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="space-y-6">
              <h2 className="font-display text-2xl md:text-3xl text-foreground leading-snug">
                Toda terapeuta conduz<br />de uma forma.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                O teste da Voz revela sua <span className="text-foreground/80">voz natural de condução</span>,
                sua <span className="text-foreground/80">força simbólica</span> e
                o <span className="text-foreground/80">momento da sua jornada</span>.
              </p>
              <p className="text-xs text-muted-foreground/50 uppercase tracking-widest">
                Leva menos de 3 minutos
              </p>
              <Button
                variant="gold"
                size="lg"
                onClick={() => navigate('/salas/big5')}
                className="gap-2 px-8"
              >
                Fazer o teste da Voz
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

        {/* ═══ SEÇÃO 4 — RESULTADO (Prévia) ═══ */}
        <section className="px-4 py-20">
          <div className="max-w-lg mx-auto">
            <motion.div {...fadeUp} transition={{ duration: 0.6 }}>
              <div className="rounded-2xl bg-card/40 backdrop-blur-xl border border-gold/10 p-8 md:p-10 text-center space-y-5">
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-gold/10 via-transparent to-transparent pointer-events-none" />
                <Sparkles className="w-5 h-5 text-gold/50 mx-auto" />
                <h3 className="font-display text-xl text-foreground">O que você vai descobrir</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {['Voz Primária', 'Voz de Apoio', 'Porta Atual', 'Descrição Simbólica'].map(item => (
                    <div key={item} className="rounded-xl bg-gold/5 border border-gold/10 p-3">
                      <p className="text-foreground/80">{item}</p>
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Ao finalizar o teste, você receberá um mapa simbólico pessoal
                  com um convite para continuar sua jornada.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

        {/* ═══ SEÇÃO 5 — TRAVESSIA 00 ═══ */}
        <section className="px-4 py-20">
          <div className="max-w-xl mx-auto text-center">
            <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="space-y-6">
              <p className="text-xs text-gold/50 uppercase tracking-[0.2em]">Travessia 00</p>
              <h2 className="font-display text-2xl md:text-3xl text-foreground">
                7 dias. 7 áudios.<br />Uma introdução ao método.
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
                Antes de avançar, a Casa oferece uma travessia inicial — 
                sete dias de escuta guiada para você habitar o espaço 
                antes de tentar transformá-lo.
              </p>
              <Button
                variant="gold"
                size="lg"
                onClick={() => navigate('/travessia/travessia-zero-o-limiar-da-casa')}
                className="gap-2 px-8"
              >
                Iniciar Travessia
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

        {/* ═══ SEÇÃO 6 — HABITAR A CASA ═══ */}
        <section className="px-4 py-20">
          <div className="max-w-2xl mx-auto">
            <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="text-center space-y-6 mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-foreground">
                Habitar a Casa
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">
                Dentro da Casa Orácula, você encontra o Clube de Leitura Oracular — 
                um espaço vivo de estudo e prática.
              </p>
            </motion.div>

            {/* O que inclui */}
            <motion.div {...fadeUp} transition={{ delay: 0.15, duration: 0.5 }}>
              <div className="grid grid-cols-2 gap-3 mb-10">
                {[
                  { icon: BookOpen, label: 'Clube de leitura simbólica' },
                  { icon: Sparkles, label: 'Práticas aplicadas' },
                  { icon: Users, label: 'Comunidade de terapeutas' },
                  { icon: Wrench, label: 'Ferramentas do método' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 p-4 rounded-xl bg-card/30 border border-border/20">
                    <item.icon className="w-4 h-4 text-gold/60 shrink-0" />
                    <span className="text-sm text-foreground/80">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Planos */}
            <motion.div {...fadeUp} transition={{ delay: 0.25, duration: 0.5 }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <Card className="border-border/30 hover:border-gold/20 transition-colors">
                  <CardContent className="p-6 text-center space-y-2">
                    <p className="text-xs text-muted-foreground/60 uppercase tracking-wider">Mensal</p>
                    <p className="font-display text-2xl text-foreground">{precoMensal}</p>
                    <p className="text-xs text-muted-foreground">/mês</p>
                  </CardContent>
                </Card>
                <Card className="border-gold/20 hover:border-gold/40 transition-colors bg-gold/5">
                  <CardContent className="p-6 text-center space-y-2">
                    <p className="text-xs text-gold/60 uppercase tracking-wider">Anual</p>
                    <p className="font-display text-2xl text-foreground">{precoAnual}</p>
                    <p className="text-xs text-muted-foreground">/ano</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.35, duration: 0.5 }} className="text-center">
              <Button
                variant="gold"
                size="lg"
                onClick={() => navigate('/planos')}
                className="gap-2 px-10"
              >
                Entrar na Casa Orácula
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ═══ FRASE DE ENCERRAMENTO ═══ */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 1 }}
          className="px-4 py-16 text-center"
        >
          <div className="w-8 h-px bg-gold/20 mx-auto mb-6" />
          <p className="text-xs text-muted-foreground/40 italic leading-relaxed max-w-sm mx-auto">
            A Casa Orácula não ensina apenas ferramentas.<br />
            Ela ensina como sustentar processos humanos com consciência.
          </p>
        </motion.section>
      </div>
    </AppLayout>
  );
}
