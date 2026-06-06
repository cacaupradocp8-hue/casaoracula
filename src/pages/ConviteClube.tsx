import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sprout, Briefcase, Users, Radio } from 'lucide-react';

/* ── animation helpers ── */
const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.9, delay, ease: [0.25, 0.1, 0.25, 1] as const },
});

const EXPERIENCIAS = [
  {
    icon: Sprout,
    titulo: 'Jardim da Psique',
    subtitulo: 'registro pessoal',
    descricao: 'Um espaço silencioso para anotar o que se move em você a cada leitura — sem julgamento, sem pressa.',
  },
  {
    icon: Briefcase,
    titulo: 'Jardim do Ofício',
    subtitulo: 'uso profissional',
    descricao: 'Onde a leitura se transforma em ferramenta clínica. Um lugar para traduzir os símbolos em prática viva.',
  },
  {
    icon: Users,
    titulo: 'Canteiro',
    subtitulo: 'compartilhamento',
    descricao: 'O solo comum do Clube. Aqui sua reflexão encontra outras vozes — sem exposição, com escuta.',
  },
  {
    icon: Radio,
    titulo: 'Encontros ao Vivo',
    subtitulo: 'presença coletiva',
    descricao: 'Momentos de travessia partilhada. Não são aulas — são campos que se abrem quando estamos juntas.',
  },
];

export default function ConviteClube() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const nome = user?.name?.split(' ')[0] || '';

  return (
    <AppLayout>
      <div className="relative overflow-hidden">

        {/* ═══════════════════════════════════════════
            HERO — IMERSIVO
        ═══════════════════════════════════════════ */}
        <section className="relative min-h-[85vh] flex items-center justify-center px-5 py-24">
          {/* Background glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="w-[32rem] h-[32rem] rounded-full bg-gradient-to-br from-gold/6 via-mystic/4 to-transparent blur-3xl"
            />
          </div>

          {/* Mandala breathing */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.04, 1], opacity: [0.08, 0.15, 0.08], rotate: [0, 180] }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="w-[26rem] h-[26rem] rounded-full border border-gold/10"
            />
            <motion.div
              animate={{ scale: [1, 1.06, 1], opacity: [0.05, 0.1, 0.05], rotate: [0, -120] }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[20rem] h-[20rem] rounded-full border border-gold/8"
            />
          </div>

          <div className="relative z-10 max-w-lg w-full text-center space-y-10">
            {/* Breathing dot */}
            <motion.div {...fade(0)} className="flex justify-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="w-14 h-14 rounded-full border border-gold/15 flex items-center justify-center"
              >
                <div className="w-3 h-3 rounded-full bg-gold/25" />
              </motion.div>
            </motion.div>

            <motion.div {...fade(0.1)} className="space-y-6">
              <h1 className="font-display text-3xl md:text-[2.6rem] text-foreground leading-[1.15] tracking-wide">
                {nome ? `${nome}, a` : 'A'} sua jornada começou.
              </h1>
              <p className="text-foreground/70 text-lg md:text-xl leading-relaxed font-display tracking-wide">
                Agora existe um espaço<br />onde ela pode continuar.
              </p>
            </motion.div>

            <motion.p {...fade(0.25)} className="text-muted-foreground/50 text-sm leading-relaxed max-w-xs mx-auto">
              Um caminho de leitura, escuta e travessia interior.
            </motion.p>

            <motion.div {...fade(0.35)}>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => navigate('/planos')}
                className="px-10 py-5 rounded-full font-display text-sm tracking-wider bg-gold/10 border border-gold/20 text-gold hover:bg-gold/15 hover:border-gold/30 transition-all group"
              >
                Entrar no Clube
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </motion.div>

            {/* Scroll hint */}
            <motion.div {...fade(0.5)}>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-5 h-9 mx-auto rounded-full border border-gold/12 flex items-start justify-center pt-2"
              >
                <div className="w-1 h-2 rounded-full bg-gold/25" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            O QUE É O CLUBE
        ═══════════════════════════════════════════ */}
        <section className="relative px-5 py-24 max-w-2xl mx-auto">
          <motion.div {...fade(0)} className="text-center space-y-8">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold/35">
              O que é o Clube
            </p>

            <div className="space-y-5 max-w-md mx-auto">
              <p className="text-foreground/80 text-[15px] leading-[1.8]">
                No Clube de Leitura Oracular, cada leitura se transforma em <span className="text-gold/80 italic">experiência</span>.
              </p>
              <p className="text-foreground/80 text-[15px] leading-[1.8]">
                Cada símbolo se transforma em <span className="text-gold/80 italic">direção</span>.
              </p>
              <p className="text-foreground/80 text-[15px] leading-[1.8]">
                Cada encontro se transforma em <span className="text-gold/80 italic">movimento interno</span>.
              </p>
            </div>

            <div className="pt-4">
              <p className="text-muted-foreground/40 text-xs leading-relaxed max-w-sm mx-auto">
                Não é só leitura. É travessia guiada. É prática viva.<br />
                Um campo que se abre toda vez que você entra.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Separador */}
        <Separator />

        {/* ═══════════════════════════════════════════
            EXPERIÊNCIA DENTRO DO CLUBE
        ═══════════════════════════════════════════ */}
        <section className="relative px-5 py-24 max-w-3xl mx-auto">
          <motion.div {...fade(0)} className="text-center mb-14 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold/35">
              O que te espera dentro
            </p>
            <h2 className="font-display text-xl md:text-2xl text-foreground tracking-wide">
              Continuidade da jornada que já começou
            </h2>
            <p className="text-muted-foreground/40 text-xs max-w-sm mx-auto">
              Cada espaço é uma extensão do caminho que você já está percorrendo.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {EXPERIENCIAS.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  {...fade(0.08 * i)}
                  className="group relative p-6 rounded-2xl border border-border/30 bg-card/20 hover:border-gold/15 hover:bg-card/40 transition-all duration-700"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gold/5 border border-gold/10 flex items-center justify-center shrink-0 group-hover:border-gold/25 transition-colors duration-500">
                        <Icon className="w-4.5 h-4.5 text-gold/50 group-hover:text-gold/70 transition-colors" />
                      </div>
                      <div>
                        <h3 className="font-display text-sm text-foreground tracking-wide">
                          {item.titulo}
                        </h3>
                        <p className="text-[10px] text-gold/40 tracking-wider uppercase">
                          {item.subtitulo}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground/55 leading-[1.7] pl-[3.25rem]">
                      {item.descricao}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Separador */}
        <Separator />

        {/* ═══════════════════════════════════════════
            CONEXÃO COM A VOZ
        ═══════════════════════════════════════════ */}
        <section className="relative px-5 py-28 max-w-lg mx-auto text-center">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <div className="w-60 h-60 rounded-full bg-gradient-to-br from-gold/4 via-transparent to-mystic/3 blur-3xl opacity-50" />
          </div>

          <motion.div {...fade(0)} className="relative z-10 space-y-8">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold/35">
              Sobre a sua Voz
            </p>

            <div className="space-y-6">
              <p className="text-foreground/80 text-lg md:text-xl leading-[1.6] font-display tracking-wide">
                A sua Voz não é um resultado.
              </p>
              <p className="text-gold/70 text-lg md:text-xl leading-[1.6] font-display tracking-wide italic">
                Ela é um caminho.
              </p>
            </div>

            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-px h-12 mx-auto bg-gradient-to-b from-transparent via-gold/20 to-transparent"
            />

            <p className="text-muted-foreground/50 text-sm leading-relaxed">
              O Clube organiza esse caminho.<br />
              Cada semana, um passo. Cada leitura, uma direção.
            </p>
          </motion.div>
        </section>

        {/* Separador */}
        <Separator />

        {/* ═══════════════════════════════════════════
            CTA FINAL
        ═══════════════════════════════════════════ */}
        <section className="relative px-5 py-28 pb-32">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="w-80 h-80 rounded-full bg-gradient-to-br from-gold/5 via-mystic/3 to-transparent blur-3xl"
            />
          </div>

          <motion.div
            {...fade(0)}
            className="relative z-10 max-w-sm mx-auto text-center space-y-8"
          >
            <div className="space-y-4">
              <p className="text-muted-foreground/50 text-sm italic leading-relaxed">
                Se algo em você reconhece este chamado...
              </p>
              <h2 className="font-display text-2xl text-foreground tracking-wide">
                A porta está aberta.
              </h2>
            </div>

            {/* CTA Principal */}
            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigate('/planos')}
              className="px-10 py-5 rounded-full font-display text-sm tracking-wider bg-gold/10 border border-gold/20 text-gold hover:bg-gold/15 hover:border-gold/30 transition-all group"
            >
              Entrar no Clube de Leitura Oracular
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>

            {/* CTA Secundário */}
            <div>
              <button
                onClick={() => navigate('/planos')}
                className="text-muted-foreground/35 text-[11px] tracking-wider hover:text-gold/50 transition-colors duration-500 cursor-pointer"
              >
                Quero continuar minha travessia →
              </button>
            </div>
          </motion.div>
        </section>

        {/* Sticky mobile CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden p-4 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => navigate('/planos')}
            className="w-full py-4 rounded-full font-display text-sm tracking-wider bg-gold/10 border border-gold/20 text-gold hover:bg-gold/15 pointer-events-auto"
          >
            Entrar no Clube
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

/* ── Separador simbólico ── */
function Separator() {
  return (
    <div className="flex justify-center py-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-px bg-gold/8" />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-1.5 h-1.5 rounded-full bg-gold/20"
        />
        <div className="w-10 h-px bg-gold/8" />
      </div>
    </div>
  );
}
