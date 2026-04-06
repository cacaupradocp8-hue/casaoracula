import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { ParticleField } from '@/components/sales/ParticleField';
import { SalesHeader } from '@/components/sales/SalesHeader';

import heroImg from '@/assets/formacao/imagem01.png';
import casaMaquinasImg from '@/assets/formacao/casa-maquinas.png';

/* ── Shared animation preset ── */
const fade = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as const },
};

const fadeSlow = {
  ...fade,
  transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] as const },
};

/* ── Scroll-triggered phrase component ── */
function Phrase({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.p>
  );
}

/* ── Divider ── */
function Divider() {
  return <div className="w-12 h-px bg-[#E0B36A]/40 mx-auto" />;
}

export default function OraculaSalesPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const heroOp = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const ctaClick = () => navigate('/planos');

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F3EFE7] overflow-x-hidden selection:bg-[#E0B36A]/30">
      <ParticleField density={30} color="216,255,62" />
      <SalesHeader />

      {/* ═══════════════════════════════════════════
          SEÇÃO 1 — HERO (100vh)
      ═══════════════════════════════════════════ */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOp }}
        className="relative h-screen flex flex-col items-center justify-center"
      >
        <motion.div className="absolute inset-0 z-0" style={{ scale: heroScale }}>
          <img src={heroImg} alt="" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-[#0B0B0F]/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/30 to-[#0B0B0F]/50" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8, delay: 0.4 }}
          className="relative z-10 text-center px-6 max-w-4xl"
        >
          <p className="text-[#E0B36A]/60 text-[10px] uppercase tracking-[0.7em] mb-14">
            Casa Orácula · Formação
          </p>

          <h1 className="font-display text-[clamp(2.2rem,6vw,5rem)] font-light leading-[1.15] tracking-tight mb-10 text-white">
            Você não precisa de mais técnica.
            <br />
            <span className="text-[#E0B36A]">Precisa parar de conduzir no escuro.</span>
          </h1>

          <p className="text-[#CFCFCF] text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-16 font-light">
            A Formação Orácula ensina terapeutas a ler o campo com precisão, antes de intervir.
          </p>

          <button
            onClick={ctaClick}
            className="group bg-[#E0B36A] text-[#0B0B0F] px-14 py-5 text-[12px] uppercase tracking-[0.3em] font-bold hover:bg-[#ebc57e] transition-all duration-500 inline-flex items-center gap-3 shadow-[0_0_80px_-15px_rgba(224,179,106,0.4)]"
          >
            Entrar na Formação Orácula
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-[#CFCFCF]/50 text-[11px] mt-10 tracking-wide">
            Turmas fechadas · Ciclo completo de 1 ano
          </p>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </motion.section>

      {/* ═══════════════════════════════════════════
          SEÇÃO 2 — DESCONFORTO
      ═══════════════════════════════════════════ */}
      <section className="relative py-32 md:py-48 px-6 md:px-16">
        <div className="absolute inset-0 bg-[#0B0B0F]/80 backdrop-blur-sm" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-20 md:space-y-28">
          {[
            'Você já estudou.',
            'Já atendeu.',
            'Já ajudou.',
            'E mesmo assim…\nalgo não sustenta.',
            'As mulheres entendem…\nmas não atravessam.',
            'Elas acessam consciência…\nmas voltam.',
          ].map((frase, i) => (
            <Phrase key={i} delay={0.05 * i} className="font-display text-2xl md:text-4xl lg:text-5xl font-light text-white/80 leading-[1.3] whitespace-pre-line">
              {frase}
            </Phrase>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SEÇÃO 3 — PERGUNTA CENTRAL
      ═══════════════════════════════════════════ */}
      <section className="relative py-36 md:py-52 px-6 bg-[#111117]">
        <div className="absolute inset-0 bg-[#111117]/90" />
        <div className="absolute left-6 md:left-16 top-1/2 -translate-y-1/2 w-px h-32 bg-gradient-to-b from-transparent via-[#E0B36A]/25 to-transparent" />
        <div className="absolute right-6 md:right-16 top-1/2 -translate-y-1/2 w-px h-32 bg-gradient-to-b from-transparent via-[#E0B36A]/25 to-transparent" />

        <motion.div {...fadeSlow} className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light leading-[1.1] mb-12 text-white">
            O que você ainda não está vendo?
          </h2>
          <Divider />
          <p className="text-[#CFCFCF] text-lg md:text-xl font-light mt-12 leading-relaxed max-w-lg mx-auto">
            A verdade desconfortável:<br />
            não é falta de ferramenta.<br />
            <span className="text-[#E0B36A] font-medium">É falta de leitura.</span>
          </p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          SEÇÃO 4 — O ERRO INVISÍVEL
      ═══════════════════════════════════════════ */}
      <section className="relative py-32 md:py-48 px-6 md:px-16">
        <div className="absolute inset-0 bg-[#0B0B0F]/80 backdrop-blur-sm" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-16 md:space-y-24">
          {[
            'Durante anos, o mercado ensinou você a conduzir.',
            'A intervir.',
            'A interpretar.',
            'A levar a cliente até algum lugar.',
            'Mas ninguém ensinou a parar…\ne ler o campo antes de agir.',
            'E quando você não lê…',
            'Você interfere no tempo errado.',
            { text: 'E toda intervenção fora de tempo…\nvira invasão simbólica.', accent: true },
          ].map((item, i) => {
            const text = typeof item === 'string' ? item : item.text;
            const accent = typeof item === 'object' && item.accent;
            return (
              <Phrase
                key={i}
                className={`font-display text-xl md:text-3xl lg:text-4xl font-light leading-[1.35] whitespace-pre-line ${
                  accent ? 'text-[#E0B36A]' : 'text-white/75'
                }`}
              >
                {text}
              </Phrase>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SEÇÃO 5 — NASCIMENTO DA CASA ORÁCULA
      ═══════════════════════════════════════════ */}
      <section className="relative py-36 md:py-52 px-6 md:px-16">
        <div className="absolute inset-0 bg-[#0B0B0F]/70" />
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-10">
          <Phrase className="font-display text-3xl md:text-5xl lg:text-6xl font-light text-white">
            A Casa Orácula nasce desse ponto.
          </Phrase>
          <Phrase delay={0.1} className="font-display text-xl md:text-3xl font-light text-[#CFCFCF]">
            Não como método de intervenção.
          </Phrase>
          <Phrase delay={0.2} className="font-display text-xl md:text-3xl font-light text-[#E0B36A]">
            Mas como método de leitura.
          </Phrase>
          <motion.div {...fade} className="pt-12 max-w-lg mx-auto">
            <p className="text-[#CFCFCF]/80 text-sm md:text-base leading-[1.8] font-light">
              Um sistema estruturado para identificar:<br />
              em que limiar a psique está,<br />
              qual campo está ativo,<br />
              e qual estrutura sustentou aquela mulher até aqui.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SEÇÃO 6 — O MÉTODO
      ═══════════════════════════════════════════ */}
      <section id="metodo" className="relative py-32 md:py-44 px-6 md:px-16 bg-[#111117]">
        <div className="absolute inset-0 bg-[#111117]/95" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.p {...fade} className="text-[#E0B36A]/50 text-[10px] uppercase tracking-[0.6em] text-center mb-20">
            Método da CidaDELA
          </motion.p>

          <div className="grid md:grid-cols-3 gap-px">
            {[
              { title: 'Portas', desc: 'Em que limiar a psique está.' },
              { title: 'Campos', desc: 'O clima simbólico que pede leitura.' },
              { title: 'Torres', desc: 'O que sustentou essa mulher até aqui.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.12 }}
                className="border border-white/[0.08] bg-[#0B0B0F]/60 backdrop-blur-sm p-12 md:p-16 text-center"
              >
                <h3 className="font-display text-2xl md:text-3xl text-white font-light mb-5 tracking-wide">
                  {item.title}
                </h3>
                <p className="text-[#CFCFCF]/70 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fade} className="mt-20 text-center">
            <p className="font-display text-lg md:text-2xl font-light text-[#CFCFCF] leading-relaxed max-w-lg mx-auto">
              Quando isso é visto,<br />
              a condução deixa de ser tentativa.<br />
              <span className="text-[#E0B36A]">E passa a ser precisão.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SEÇÃO 7 — NARRÔTERAPIA
      ═══════════════════════════════════════════ */}
      <section className="relative py-32 md:py-48 px-6 md:px-16">
        <div className="absolute inset-0 bg-[#0B0B0F]/85 backdrop-blur-sm" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-16 md:space-y-24">
          {[
            { text: 'A Narrôterapia não corrige comportamento.', accent: false },
            { text: 'Ela revela narrativa.', accent: true },
            { text: 'Porque toda repetição tem uma história por trás.', accent: false },
            { text: 'E toda história não vista…\nse repete.', accent: false },
            { text: 'Quando a narrativa é reconhecida,\na psique se reorganiza.', accent: false },
            { text: 'Não por esforço.\nMas por coerência interna.', accent: true },
          ].map((item, i) => (
            <Phrase
              key={i}
              className={`font-display text-xl md:text-3xl lg:text-4xl font-light leading-[1.35] whitespace-pre-line ${
                item.accent ? 'text-[#E0B36A]' : 'text-white/75'
              }`}
            >
              {item.text}
            </Phrase>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SEÇÃO 8 — O QUE A FORMAÇÃO ENTREGA
      ═══════════════════════════════════════════ */}
      <section id="formacao" className="relative py-32 md:py-44 px-6 md:px-16 bg-[#111117]">
        <div className="absolute inset-0 bg-[#111117]/95" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.p {...fade} className="text-[#E0B36A]/50 text-[10px] uppercase tracking-[0.6em] text-center mb-20">
            O que a formação entrega
          </motion.p>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Leitura simbólica', desc: 'Você aprende a ler Portas, Campos e Torres antes de intervir.' },
              { title: 'Certificação em Narrôterapia', desc: 'Recebe certificação para trabalhar narrativa como eixo clínico simbólico.' },
              { title: 'Mentorias quinzenais', desc: 'Tem prática supervisionada e mentorias ao vivo a cada 15 dias.' },
              { title: 'App clínico integrado', desc: 'Opera dentro de um mapa vivo da sua prática, sem depender de intuição solta.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="border border-white/[0.08] bg-[#0B0B0F]/50 backdrop-blur-sm p-10 md:p-12 hover:border-[#E0B36A]/25 transition-colors duration-500 group"
              >
                <h3 className="font-display text-lg md:text-xl text-white mb-4 group-hover:text-[#E0B36A] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[#CFCFCF]/70 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SEÇÃO 9 — O APP COMO DIFERENCIAL
      ═══════════════════════════════════════════ */}
      <section id="app" className="relative py-32 md:py-44 px-6 md:px-16">
        <div className="absolute inset-0 bg-[#0B0B0F]/85 backdrop-blur-sm" />
        <div className="relative z-10 max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div {...fade}>
            <Phrase className="font-display text-2xl md:text-4xl font-light text-white mb-3">
              O app da Casa Orácula não é bônus.
            </Phrase>
            <Phrase delay={0.1} className="font-display text-2xl md:text-4xl font-light text-[#E0B36A] mb-12">
              É extensão da sua mente clínica.
            </Phrase>

            <div className="space-y-5 mb-12">
              {[
                'Mapa vivo da prática',
                'Registro de Portas',
                'Acompanhamento de narrativas',
                'Observação de movimentos de campo',
              ].map((item) => (
                <p key={item} className="text-[#CFCFCF] text-sm flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E0B36A]/60" />
                  {item}
                </p>
              ))}
            </div>

            <p className="text-[#CFCFCF]/80 text-sm leading-relaxed font-light">
              Você deixa de depender de intuição solta.<br />
              <span className="text-[#E0B36A]">E passa a operar com estrutura.</span>
            </p>
          </motion.div>

          <motion.div {...fade} className="relative">
            <div className="relative rounded-xl overflow-hidden border border-white/[0.08]">
              <img src={casaMaquinasImg} alt="App Casa Orácula" className="w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-transparent to-transparent opacity-50" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SEÇÃO 10 — FORMAÇÃO DE IDENTIDADE
      ═══════════════════════════════════════════ */}
      <section className="relative py-36 md:py-52 px-6 md:px-16 bg-[#111117]">
        <div className="absolute inset-0 bg-[#111117]/95" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-16 md:space-y-24 text-center">
          <Phrase className="font-display text-3xl md:text-5xl font-light text-white">
            Isso não é um curso.
          </Phrase>
          <Phrase className="font-display text-3xl md:text-5xl font-light text-[#E0B36A]">
            É uma formação de identidade profissional.
          </Phrase>
          <Phrase className="font-display text-xl md:text-2xl font-light text-[#CFCFCF]">
            Porque não se reorganiza uma psique em um final de semana.
          </Phrase>
          <Phrase className="font-display text-xl md:text-2xl font-light text-[#CFCFCF]">
            E não se forma uma facilitadora em três meses.
          </Phrase>
          <Phrase className="font-display text-xl md:text-3xl font-light text-white/90">
            Um ano é o tempo de atravessar.<br />
            Integrar.<br />
            E se posicionar.
          </Phrase>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SEÇÃO 11 — OFERTA
      ═══════════════════════════════════════════ */}
      <section id="oferta" className="relative py-36 md:py-52 px-6">
        <div className="absolute inset-0 bg-[#0B0B0F]" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/[0.06]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/[0.06]" />

        <motion.div {...fadeSlow} className="relative z-10 max-w-2xl mx-auto text-center">
          <p className="text-[#E0B36A]/50 text-[10px] uppercase tracking-[0.6em] mb-14">
            Investimento
          </p>

          <h2 className="font-display text-3xl md:text-4xl font-light text-white mb-5">
            Formação Oracular da Casa Orácula
          </h2>
          <p className="text-[#CFCFCF]/60 text-sm mb-12">Ciclo completo de 1 ano</p>

          <p className="font-display text-6xl md:text-8xl font-light text-white mb-4">
            R$ <span className="text-[#E0B36A]">5.597</span>
          </p>
          <p className="text-[#CFCFCF]/50 text-sm mb-5">Turmas fechadas</p>
          <p className="text-[#CFCFCF]/40 text-xs max-w-xs mx-auto leading-relaxed mb-16">
            Quando iniciamos, não existe próxima data anunciada.
          </p>

          <button
            onClick={ctaClick}
            className="group bg-[#E0B36A] text-[#0B0B0F] px-16 py-6 text-[12px] uppercase tracking-[0.3em] font-bold hover:bg-[#ebc57e] transition-all duration-500 inline-flex items-center gap-3 shadow-[0_0_100px_-20px_rgba(224,179,106,0.5)]"
          >
            Entrar na Formação
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-[#CFCFCF]/40 text-xs mt-12 max-w-xs mx-auto leading-relaxed italic">
            A decisão não é sobre valor.<br />
            É sobre responsabilidade.
          </p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          SEÇÃO 12 — FECHAMENTO
      ═══════════════════════════════════════════ */}
      <section className="relative py-40 md:py-60 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0F] via-[#0E0E13] to-[#0B0B0F]" />

        {/* Aura */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#E0B36A]/[0.04] blur-[180px] pointer-events-none"
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.35, 0.1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 max-w-2xl mx-auto space-y-14 md:space-y-18 text-center">
          <Phrase className="font-display text-xl md:text-3xl font-light text-white/70 italic">
            Depois que você aprende a ler…<br />
            não consegue mais fingir que não vê.
          </Phrase>
          <Phrase className="font-display text-lg md:text-xl font-light text-[#CFCFCF]">
            Se você sente que já não quer apenas conduzir mulheres…
          </Phrase>
          <Phrase className="font-display text-lg md:text-xl font-light text-[#CFCFCF]">
            Mas compreender o que sustenta cada história…
          </Phrase>
          <Phrase className="font-display text-lg md:text-2xl font-light text-white/80">
            Talvez você não esteja buscando mais uma técnica.
          </Phrase>
          <Phrase className="font-display text-xl md:text-3xl font-light text-[#E0B36A]">
            Talvez esteja buscando uma casa.
          </Phrase>
          <Phrase className="font-display text-3xl md:text-4xl font-light text-white">
            E a Casa…<br />já existe.
          </Phrase>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="pt-10"
          >
            <button
              onClick={ctaClick}
              className="group bg-[#E0B36A] text-[#0B0B0F] px-18 py-7 text-[12px] uppercase tracking-[0.3em] font-bold hover:bg-[#ebc57e] transition-all duration-700 shadow-[0_0_140px_-20px_rgba(224,179,106,0.45)] hover:shadow-[0_0_180px_-20px_rgba(224,179,106,0.6)] inline-flex items-center gap-3"
            >
              Entrar na Formação Orácula
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-16 px-6 md:px-16 border-t border-white/[0.04]">
        <p className="text-[#CFCFCF]/30 text-[11px] leading-relaxed max-w-xl">
          Casa Orácula © {new Date().getFullYear()} · A Casa Orácula não substitui terapia,
          acompanhamento psicológico ou tratamento clínico quando necessário.
        </p>
      </footer>
    </div>
  );
}
