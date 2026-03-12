import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Compass, GraduationCap, BookOpen, Cog, Users,
  ChevronRight, ArrowRight,
} from 'lucide-react';
import { MandalaPessoal } from '@/components/cidadela/MandalaPessoal';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

const territorios = [
  {
    titulo: 'Jardins da Exploração',
    descricao: 'Espaço de autoconhecimento e exploração simbólica.',
    icon: Compass,
    cta: 'Explorar os Jardins',
    ctaPath: '/oraculos',
    links: [
      { label: 'Oráculos', path: '/oraculos' },
      { label: 'Jardim da Psique', path: '/jardim-da-psique' },
      { label: 'Quiz', path: '/quiz' },
      { label: 'Minha Jornada', path: '/minha-jornada' },
    ],
  },
  {
    titulo: 'Academia Orácula',
    descricao: 'Espaço de estudo e formação.',
    icon: GraduationCap,
    cta: 'Entrar na Academia',
    ctaPath: '/cursos',
    links: [
      { label: 'Cursos', path: '/cursos' },
      { label: 'Sala de Treinamento', path: '/sala-treinamento' },
      { label: 'Narroterapia', path: '/narroterapia' },
      { label: 'Portal Junguiano', path: '/portal-junguiano' },
    ],
  },
  {
    titulo: 'Clube do Livro Oracular',
    descricao: 'Travessias narrativas através da leitura simbólica.',
    icon: BookOpen,
    cta: 'Entrar no Clube',
    ctaPath: '/clube-livro',
    links: [
      { label: 'Clube do Livro', path: '/clube-livro' },
      { label: 'Mapa de Jornadas', path: '/clube-livro/mapa-jornadas' },
    ],
  },
  {
    titulo: 'Casa das Máquinas',
    descricao: 'Espaço profissional para terapeutas.',
    icon: Cog,
    cta: 'Abrir Casa das Máquinas',
    ctaPath: '/casa-das-maquinas',
    links: [
      { label: 'Visão Geral', path: '/casa-das-maquinas' },
      { label: 'Clientes', path: '/casa-das-maquinas/clientes' },
      { label: 'Sessões', path: '/casa-das-maquinas/sessoes' },
      { label: 'Biblioteca', path: '/casa-das-maquinas/biblioteca' },
      { label: 'Painel Clínico', path: '/casa-das-maquinas/painel-clinico' },
    ],
  },
  {
    titulo: 'Comunidade',
    descricao: 'Espaço de encontros e troca entre participantes.',
    icon: Users,
    cta: 'Ir para Comunidade',
    ctaPath: '/comunidade',
    links: [
      { label: 'Comunidade', path: '/comunidade' },
    ],
  },
];

export default function MapaCasaOracula() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-5xl px-4 py-12 space-y-12">
        {/* Header */}
        <motion.section className="text-center space-y-4" {...fade()}>
          <h1 className="font-display text-4xl md:text-5xl text-foreground leading-tight">
            Mapa da Casa Orácula
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Cada território da Casa sustenta um momento diferente da jornada.
            Escolha o caminho que deseja atravessar.
          </p>
        </motion.section>

        {/* Mandala Pessoal da CidaDELA */}
        <motion.section {...fade(0.1)}>
          <div className="mx-auto max-w-lg rounded-2xl border border-border/20 bg-card/40 backdrop-blur p-6">
            <MandalaPessoal />
          </div>
        </motion.section>

        {/* Territórios */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {territorios.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.div key={t.titulo} {...fade(i * 0.07)} className={i >= 3 ? 'sm:col-span-1' : ''}>
                <Card className="h-full border border-border/30 bg-card/60 backdrop-blur hover:border-primary/20 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 border border-primary/20">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="font-display text-lg text-foreground">{t.titulo}</h2>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                      {t.descricao}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {t.links.map((link) => (
                        <button
                          key={link.path}
                          onClick={() => navigate(link.path)}
                          className="text-xs px-2.5 py-1 rounded-full bg-primary/5 text-primary/80 hover:bg-primary/10 hover:text-primary transition-colors border border-primary/10"
                        >
                          {link.label}
                        </button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-1.5 border-primary/20 text-primary hover:bg-primary/5 mt-auto"
                      onClick={() => navigate(t.ctaPath)}
                    >
                      {t.cta} <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.section className="text-center pt-4 pb-8" {...fade()}>
          <Button variant="gold" size="lg" className="gap-2 px-8" onClick={() => navigate('/dashboard-membro')}>
            Voltar ao início
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.section>
      </div>
    </AppLayout>
  );
}
