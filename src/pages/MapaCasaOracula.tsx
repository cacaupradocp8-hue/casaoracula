import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import {
  DoorOpen, BookOpen, GraduationCap, Wrench, Cog, Users,
  ArrowRight, ChevronRight, Compass, Map,
} from 'lucide-react';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

/* ── DADOS DOS CAMINHOS ─────────────────────────────────────────── */
const caminhos = [
  {
    titulo: 'Sala de Visitas',
    descricao: 'Porta de entrada para visitantes. Inclui vídeo de boas-vindas, quiz da voz e travessia inicial.',
    icon: DoorOpen,
    cta: 'Explorar',
    rota: '/experiencia-gratuita',
  },
  {
    titulo: 'Clube de Leitura Oracular',
    descricao: 'Espaço de leitura simbólica, reflexão e comunidade.',
    icon: BookOpen,
    cta: 'Entrar no Clube',
    rota: '/clube-livro',
  },
  {
    titulo: 'Formação no Método Orácula',
    descricao: 'Formação profissional para terapeutas e facilitadoras.',
    icon: GraduationCap,
    cta: 'Conhecer a Formação',
    rota: '/cursos',
  },
  {
    titulo: 'Sala de Treinamento',
    descricao: 'Ambiente de prática das ferramentas do método.',
    icon: Wrench,
    cta: 'Acessar Treinamento',
    rota: '/sala-treinamento',
  },
  {
    titulo: 'Casa das Máquinas',
    descricao: 'SaaS profissional para terapeutas acompanharem clientes e conduzirem sessões.',
    icon: Cog,
    cta: 'Acessar o SaaS',
    rota: '/casa-das-maquinas',
  },
  {
    titulo: 'Comunidade',
    descricao: 'Espaço de partilha, trocas e aprofundamento coletivo.',
    icon: Users,
    cta: 'Entrar na Comunidade',
    rota: '/comunidade',
  },
];

const estagios = [
  'Visitante',
  'Buscadora',
  'Habitante da Casa',
  'Aluna em Formação',
  'Facilitadora',
  'Terapeuta na Casa das Máquinas',
];

const camadas = [
  {
    numero: 1,
    titulo: 'Exploração',
    descricao: 'Sala de Visitas e Travessia 00',
    cor: 'from-emerald-900/30 to-emerald-800/10',
    borda: 'border-emerald-700/30',
  },
  {
    numero: 2,
    titulo: 'Estudo e Pertencimento',
    descricao: 'Clube, Formação, Comunidade',
    cor: 'from-blue-900/30 to-blue-800/10',
    borda: 'border-blue-700/30',
  },
  {
    numero: 3,
    titulo: 'Prática Profissional',
    descricao: 'Sala de Treinamento e Casa das Máquinas',
    cor: 'from-amber-900/30 to-amber-800/10',
    borda: 'border-amber-700/30',
  },
];

export default function MapaCasaOracula() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-5xl px-4 py-12 space-y-24">

        {/* ══════════ BLOCO 1 — ABERTURA ══════════ */}
        <motion.section className="text-center space-y-6" {...fade()}>
          <div className="inline-flex items-center gap-2 text-gold/60 text-xs uppercase tracking-[0.3em]">
            <Map className="w-4 h-4" />
            Cartografia do Ecossistema
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-foreground leading-tight">
            Mapa da Casa Orácula
          </h1>

          <p className="text-foreground/80 text-lg max-w-2xl mx-auto leading-relaxed">
            A Casa Orácula é um ecossistema de travessia, estudo e prática terapêutica.
            <br />
            Cada espaço da Casa sustenta um momento diferente da jornada.
          </p>

          <div className="pt-4 space-y-1">
            <p className="text-gold/70 italic font-display text-base">Algumas chegam para escutar.</p>
            <p className="text-gold/70 italic font-display text-base">Outras chegam para aprender.</p>
            <p className="text-gold/70 italic font-display text-base">Outras chegam para conduzir travessias.</p>
          </div>
        </motion.section>

        {/* ══════════ BLOCO 2 — MAPA DOS CAMINHOS ══════════ */}
        <section className="space-y-8">
          <motion.h2 className="font-display text-2xl md:text-3xl text-center text-foreground" {...fade()}>
            Os Caminhos da Casa
          </motion.h2>

          {/* Linha central vertical (decorativa) */}
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/0 via-gold/20 to-gold/0 hidden md:block" />

            <div className="space-y-6 md:space-y-10">
              {caminhos.map((c, i) => {
                const Icon = c.icon;
                const isLeft = i % 2 === 0;

                return (
                  <motion.div
                    key={c.titulo}
                    {...fade(i * 0.08)}
                    className={`relative flex flex-col md:flex-row items-center gap-4 md:gap-8 ${
                      isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Card */}
                    <div
                      className={`flex-1 rounded-2xl border border-gold/10 bg-card/60 backdrop-blur p-6 hover:border-gold/25 transition-colors ${
                        isLeft ? 'md:text-right' : 'md:text-left'
                      }`}
                    >
                      <div className={`flex items-center gap-3 mb-3 ${isLeft ? 'md:justify-end' : ''}`}>
                        <Icon className="w-5 h-5 text-gold shrink-0" />
                        <h3 className="font-display text-xl text-foreground">{c.titulo}</h3>
                      </div>
                      <p className="text-foreground/70 text-sm leading-relaxed mb-4">{c.descricao}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 border-gold/20 text-gold hover:bg-gold/10"
                        onClick={() => navigate(c.rota)}
                      >
                        {c.cta}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    {/* Node na linha central */}
                    <div className="hidden md:flex w-10 h-10 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-background z-10">
                      <span className="text-gold font-display text-sm">{i + 1}</span>
                    </div>

                    {/* Spacer para o outro lado */}
                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════ BLOCO 3 — JORNADA DA USUÁRIA ══════════ */}
        <motion.section className="space-y-8" {...fade()}>
          <h2 className="font-display text-2xl md:text-3xl text-center text-foreground">
            A Jornada da Usuária
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0 flex-wrap">
            {estagios.map((e, i) => (
              <div key={e} className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-gold/15 bg-card/50">
                  <Compass className="w-3.5 h-3.5 text-gold/60" />
                  <span className="text-foreground/90 text-sm font-medium whitespace-nowrap">{e}</span>
                </div>
                {i < estagios.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-gold/30 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* ══════════ BLOCO 4 — COMO A CASA SE ORGANIZA ══════════ */}
        <section className="space-y-8">
          <motion.h2 className="font-display text-2xl md:text-3xl text-center text-foreground" {...fade()}>
            Como a Casa se Organiza
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-5">
            {camadas.map((c, i) => (
              <motion.div
                key={c.numero}
                {...fade(i * 0.1)}
                className={`rounded-2xl border ${c.borda} bg-gradient-to-br ${c.cor} p-6 text-center space-y-3`}
              >
                <span className="text-gold/50 text-xs uppercase tracking-widest">
                  Camada {c.numero}
                </span>
                <h3 className="font-display text-lg text-foreground">{c.titulo}</h3>
                <p className="text-foreground/60 text-sm">{c.descricao}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ══════════ BLOCO FINAL — CTA ══════════ */}
        <motion.section className="text-center space-y-6 pb-8" {...fade()}>
          <p className="text-foreground/80 italic font-display text-lg max-w-xl mx-auto leading-relaxed">
            A Casa Orácula não é apenas um curso ou um software.
            <br />
            É uma travessia organizada em espaços vivos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="gold"
              size="lg"
              className="gap-2 px-8"
              onClick={() => navigate('/dashboard')}
            >
              Continuar minha jornada
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-gold/20 text-gold hover:bg-gold/10"
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
