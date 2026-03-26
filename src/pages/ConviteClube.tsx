import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Map, Compass, Ear } from 'lucide-react';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] },
});

const JORNADAS = [
  {
    icon: Map,
    titulo: 'Cartografia Psíquica',
    descricao: 'Revelar o mapa do seu campo interno — distritos, territórios e caminhos que já existem dentro de você.',
  },
  {
    icon: Compass,
    titulo: 'CidaDELA Viva',
    descricao: 'Um GPS simbólico que evolui junto com a sua prática, iluminando o que precisa de atenção.',
  },
  {
    icon: BookOpen,
    titulo: 'Clube de Leitura Simbólica',
    descricao: 'Jornadas guiadas por obras que atravessam — não para resumir, mas para habitar.',
  },
  {
    icon: Ear,
    titulo: 'Práticas & Ferramentas',
    descricao: 'Escuta ativa, diário de sonhos, oráculo interior e rituais simbólicos para o cotidiano.',
  },
];

const DEPOIMENTOS = [
  {
    texto: 'Encontrei aqui o que nenhuma supervisão me deu: um espelho simbólico para a minha prática.',
    assinatura: 'Terapeuta, 8 anos de clínica',
  },
  {
    texto: 'Não é um curso. É um campo que se abre toda vez que eu entro.',
    assinatura: 'Psicóloga clínica',
  },
  {
    texto: 'A Cartografia me mostrou padrões que eu vivia há anos sem nome.',
    assinatura: 'Facilitadora de grupos',
  },
];

export default function ConviteClube() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const nome = user?.name?.split(' ')[0] || '';

  return (
    <AppLayout>
      <div className="relative overflow-hidden">

        {/* ═══ HERO ═══ */}
        <section className="relative min-h-[70vh] flex items-center justify-center px-5 py-20">
          {/* Background orb */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <div className="w-[28rem] h-[28rem] rounded-full bg-gradient-to-br from-gold/6 via-mystic/4 to-transparent blur-3xl opacity-60" />
          </div>

          <div className="relative z-10 max-w-xl w-full text-center space-y-8">
            <motion.div {...fade(0)} className="space-y-5">
              {/* Breathing dot */}
              <div className="flex justify-center mb-4">
                <motion.div
                  animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-12 h-12 rounded-full border border-gold/15 flex items-center justify-center"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-gold/25" />
                </motion.div>
              </div>

              <p className="text-[10px] uppercase tracking-[0.35em] text-gold/40">
                Um convite
              </p>

              <h1 className="font-display text-3xl md:text-4xl text-foreground leading-[1.2] tracking-wide">
                {nome ? `${nome}, a` : 'A'} Casa está aberta.
              </h1>
            </motion.div>

            <motion.div {...fade(0.15)} className="space-y-4 max-w-md mx-auto">
              <p className="text-foreground/75 leading-relaxed text-[15px]">
                Você descobriu sua Voz. Atravessou o limiar.
              </p>
              <p className="text-muted-foreground/70 leading-relaxed text-sm">
                Agora existe um território esperando para ser revelado —
                um espaço onde a jornada não termina, mas se aprofunda.
              </p>
            </motion.div>

            {/* Scroll hint */}
            <motion.div
              {...fade(0.4)}
              className="pt-4"
            >
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-5 h-8 mx-auto rounded-full border border-gold/15 flex items-start justify-center pt-1.5"
              >
                <div className="w-1 h-1.5 rounded-full bg-gold/30" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ═══ O QUE VAI VIVER ═══ */}
        <section className="relative px-5 py-20 max-w-3xl mx-auto">
          <motion.div {...fade(0)} className="text-center mb-12 space-y-2">
            <p className="text-[10px] uppercase tracking-[0.35em] text-gold/35">
              O que te espera dentro
            </p>
            <h2 className="font-display text-xl md:text-2xl text-foreground tracking-wide">
              Uma jornada, não um produto.
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {JORNADAS.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  {...fade(0.08 * i)}
                  className="group p-5 rounded-xl border border-border/40 bg-card/30 hover:border-gold/15 transition-colors duration-500"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-gold/5 border border-gold/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-gold/20 transition-colors">
                      <Icon className="w-4 h-4 text-gold/50" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-display text-sm text-foreground tracking-wide">
                        {item.titulo}
                      </h3>
                      <p className="text-xs text-muted-foreground/60 leading-relaxed">
                        {item.descricao}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ═══ DEPOIMENTOS SIMBÓLICOS ═══ */}
        <section className="relative px-5 py-20">
          <div className="max-w-2xl mx-auto">
            <motion.div {...fade(0)} className="text-center mb-10">
              <p className="text-[10px] uppercase tracking-[0.35em] text-gold/35">
                Vozes do campo
              </p>
            </motion.div>

            <div className="space-y-6">
              {DEPOIMENTOS.map((dep, i) => (
                <motion.blockquote
                  key={i}
                  {...fade(0.1 * i)}
                  className="relative pl-5 border-l border-gold/10"
                >
                  <p className="text-foreground/70 text-sm leading-relaxed italic">
                    "{dep.texto}"
                  </p>
                  <footer className="mt-2 text-[11px] text-muted-foreground/40 tracking-wide">
                    — {dep.assinatura}
                  </footer>
                </motion.blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SEPARADOR SIMBÓLICO ═══ */}
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-gold/10" />
            <div className="w-1.5 h-1.5 rounded-full bg-gold/20" />
            <div className="w-8 h-px bg-gold/10" />
          </div>
        </div>

        {/* ═══ CTA FINAL ═══ */}
        <section className="relative px-5 py-20 pb-28">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <div className="w-72 h-72 rounded-full bg-gradient-to-br from-gold/5 via-mystic/3 to-transparent blur-3xl opacity-50" />
          </div>

          <motion.div
            {...fade(0)}
            className="relative z-10 max-w-sm mx-auto text-center space-y-6"
          >
            <div className="space-y-3">
              <p className="text-muted-foreground/60 text-sm italic leading-relaxed">
                Se algo em você reconhece este chamado...
              </p>
              <h2 className="font-display text-xl text-foreground tracking-wide">
                A porta está aberta.
              </h2>
            </div>

            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigate('/planos-clube')}
              className="px-10 py-5 rounded-full font-display text-sm tracking-wider bg-gold/10 border border-gold/20 text-gold hover:bg-gold/15 hover:border-gold/30 transition-all group"
            >
              Entrar no Clube
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>

            <p className="text-muted-foreground/30 text-[11px] tracking-wide">
              Escolha o plano que faz sentido para a sua jornada
            </p>
          </motion.div>
        </section>
      </div>
    </AppLayout>
  );
}
