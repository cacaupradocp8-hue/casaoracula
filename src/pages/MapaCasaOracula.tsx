import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useEffectivePortal } from '@/hooks/useEffectivePortal';
import {
  DoorOpen, BookOpen, GraduationCap, Wrench, Cog, Users,
  Sparkles, ChevronRight, MapPin, ArrowRight,
} from 'lucide-react';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

const espacos = [
  {
    titulo: 'Sala de Visitas',
    descricao: 'Primeiro contato com a Casa Orácula. Aqui acontecem o Quiz da Voz e as primeiras travessias simbólicas.',
    icon: DoorOpen,
    cta: 'Explorar',
    rota: '/experiencia-gratuita',
    portalMin: 'visitante' as const,
  },
  {
    titulo: 'Clube de Leitura Oracular',
    descricao: 'Espaço de estudo simbólico e reflexão junguiana aplicada.',
    icon: BookOpen,
    cta: 'Entrar no Clube',
    rota: '/clube-livro',
    portalMin: 'assinante' as const,
  },
  {
    titulo: 'Formação no Método',
    descricao: 'Programa de formação para terapeutas que desejam aprender o Método Orácula.',
    icon: GraduationCap,
    cta: 'Conhecer a Formação',
    rota: '/cursos',
    portalMin: 'aluna' as const,
  },
  {
    titulo: 'Sala de Treinamento',
    descricao: 'Ambiente seguro para praticar ferramentas e estudar casos.',
    icon: Wrench,
    cta: 'Acessar Treinamento',
    rota: '/sala-treinamento',
    portalMin: 'aluna' as const,
  },
  {
    titulo: 'Casa das Máquinas',
    descricao: 'SaaS profissional para condução de sessões e acompanhamento de clientes.',
    icon: Cog,
    cta: 'Acessar o SaaS',
    rota: '/casa-das-maquinas',
    portalMin: 'oracula' as const,
  },
  {
    titulo: 'Comunidade (Casa das Tecelãs)',
    descricao: 'Rede de facilitadoras e espaço de trocas profissionais.',
    icon: Users,
    cta: 'Entrar na Comunidade',
    rota: '/comunidade',
    portalMin: 'aluna' as const,
  },
  {
    titulo: 'Portais de Especialização',
    descricao: 'Caminhos avançados de aprofundamento dentro do método.',
    icon: Sparkles,
    cta: 'Explorar Portais',
    rota: '/portais-especializacao',
    portalMin: 'oracula' as const,
  },
];

function getUserStage(portal: string) {
  if (portal === 'admin' || portal === 'oracula' || portal === 'iniciada') return 'oracula';
  if (portal === 'aluna' || portal === 'aluna_formacao' || portal === 'pre_iniciada') return 'aluna';
  if (portal === 'assinante') return 'assinante';
  return 'visitante';
}

function getHighlightIndex(stage: string): number {
  if (stage === 'oracula') return 4; // Casa das Máquinas
  if (stage === 'aluna') return 2;   // Formação
  if (stage === 'assinante') return 1; // Clube
  return 0; // Sala de Visitas
}

export default function MapaCasaOracula() {
  const navigate = useNavigate();
  const { effectivePortal } = useEffectivePortal();
  const stage = getUserStage(effectivePortal);
  const highlightIdx = getHighlightIndex(stage);

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-5xl px-4 py-12 space-y-16">

        {/* ── ABERTURA ── */}
        <motion.section className="text-center space-y-5" {...fade()}>
          <h1 className="font-display text-4xl md:text-5xl text-foreground leading-tight">
            Mapa da Casa Orácula
          </h1>
          <p className="text-foreground/80 text-lg max-w-2xl mx-auto leading-relaxed">
            A Casa Orácula é um ecossistema de travessia, estudo e prática terapêutica.
            <br />
            Cada espaço sustenta um momento diferente da jornada.
          </p>
          <div className="pt-2 space-y-1">
            <p className="text-primary/70 italic font-display text-base">Algumas chegam para escutar.</p>
            <p className="text-primary/70 italic font-display text-base">Outras chegam para aprender.</p>
            <p className="text-primary/70 italic font-display text-base">Outras chegam para conduzir travessias.</p>
          </div>
        </motion.section>

        {/* ── MAPA DOS ESPAÇOS ── */}
        <section className="space-y-6">
          <motion.h2 className="font-display text-2xl md:text-3xl text-center text-foreground" {...fade()}>
            Os Espaços da Casa
          </motion.h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {espacos.map((e, i) => {
              const Icon = e.icon;
              const isHere = i === highlightIdx;

              return (
                <motion.div key={e.titulo} {...fade(i * 0.06)}>
                  <Card
                    className={`relative h-full border transition-all duration-300 bg-card/60 backdrop-blur hover:shadow-lg ${
                      isHere
                        ? 'border-primary/40 ring-1 ring-primary/20 shadow-md'
                        : 'border-border/30 hover:border-primary/20'
                    }`}
                  >
                    {isHere && (
                      <div className="absolute -top-3 left-4 flex items-center gap-1 rounded-full bg-primary/10 border border-primary/30 px-3 py-0.5 text-xs text-primary font-medium">
                        <MapPin className="w-3 h-3" />
                        Você está aqui
                      </div>
                    )}
                    <CardContent className="p-5 flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center border ${
                          isHere ? 'bg-primary/10 border-primary/30' : 'bg-primary/5 border-primary/10'
                        }`}>
                          <Icon className="w-4.5 h-4.5 text-primary" />
                        </div>
                        <h3 className="font-display text-lg text-foreground">{e.titulo}</h3>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-4">
                        {e.descricao}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 border-primary/20 text-primary hover:bg-primary/10 self-start"
                        onClick={() => navigate(e.rota)}
                      >
                        {e.cta}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <motion.section className="text-center space-y-5 pb-8" {...fade()}>
          <p className="text-foreground/80 italic font-display text-lg max-w-xl mx-auto leading-relaxed">
            A Casa Orácula não é apenas um curso ou um software.
            <br />
            É uma travessia organizada em espaços vivos.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="gold" size="lg" className="gap-2 px-8" onClick={() => navigate('/dashboard')}>
              Continuar minha jornada
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-primary/20 text-primary hover:bg-primary/10"
              onClick={() => navigate('/jornada')}
            >
              Ver meus próximos passos
            </Button>
          </div>
        </motion.section>
      </div>
    </AppLayout>
  );
}
