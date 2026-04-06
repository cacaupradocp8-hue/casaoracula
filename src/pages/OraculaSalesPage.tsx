import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { ParticleField } from '@/components/sales/ParticleField';
import { SalesHeader } from '@/components/sales/SalesHeader';

import heroImg from '@/assets/formacao/imagem01.png';
import casaMaquinasImg from '@/assets/formacao/casa-maquinas.png';
import narroterapiaImg from '@/assets/formacao/narroterapia.png';
import certificacaoImg from '@/assets/formacao/certificacao.png';
import casaTecalasImg from '@/assets/formacao/casa-tecelas.png';
import circuloLeituraImg from '@/assets/formacao/circulo-leitura.png';
import isadoraLivroImg from '@/assets/formacao/isadora-livro.png';
import isadoraPbImg from '@/assets/formacao/isadora-pb.png';

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
  return <div className="w-12 h-px bg-[#C6A96B]/30 mx-auto" />;
}

export default function OraculaSalesPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const heroOp = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const ctaClick = () => navigate('/planos');

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F3EFE7] overflow-x-hidden selection:bg-[#C6A96B]/30">
      <ParticleField density={80} color="216,255,62" />
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
          <div className="absolute inset-0 bg-[#0B0B0F]/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-transparent to-[#0B0B0F]/40" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8, delay: 0.4 }}
          className="relative z-10 text-center px-6 max-w-4xl"
        >
          <p className="text-[#C6A96B]/70 text-[11px] uppercase tracking-[0.7em] mb-12">
            Casa Orácula · Formação
          </p>

          <h1 className="font-display text-[clamp(2rem,6vw,4.8rem)] font-light leading-[1.15] tracking-tight mb-8 text-white">
            Você não precisa de mais técnica.
            <br />
            <span className="text-[#C6A96B]">Precisa parar de conduzir no escuro.</span>
          </h1>

          <p className="text-[#F3EFE7]/60 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-14 font-light">
            A Formação Orácula ensina terapeutas a ler o campo com precisão, antes de intervir.
          </p>

          <button
            onClick={ctaClick}
            className="group bg-[#C6A96B] text-[#0B0B0F] px-12 py-5 text-[11px] uppercase tracking-[0.35em] font-semibold hover:bg-[#d4b87a] transition-all duration-500 inline-flex items-center gap-3"
          >
            Entrar na Formação Orácula
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-[#F3EFE7]/40 text-[11px] mt-8 tracking-wide">
            Turmas fechadas · Ciclo completo de 1 ano
          </p>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <div className="w-px h-10 bg-gradient-to-b from-[#F3EFE7]/20 to-transparent" />
        </motion.div>
      </motion.section>

      {/* ═══════════════════════════════════════════
          SEÇÃO — VSL (Vídeo de Vendas)
      ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-32 px-6 md:px-16 bg-[#0E0E13]">
        <motion.div {...fadeSlow} className="max-w-4xl mx-auto text-center">
          <p className="text-[#C6A96B]/60 text-[10px] uppercase tracking-[0.6em] mb-10">
            Assista antes de decidir
          </p>

          <div className="relative aspect-video rounded-lg overflow-hidden border border-[#C6A96B]/15 shadow-[0_0_80px_-20px_rgba(198,169,107,0.2)]">
            {/* Placeholder — substituir src pelo embed do vídeo real */}
            <div className="absolute inset-0 bg-[#0B0B0F] flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full border-2 border-[#C6A96B]/40 flex items-center justify-center mx-auto cursor-pointer hover:border-[#C6A96B] hover:bg-[#C6A96B]/10 transition-all duration-500 group">
                  <svg className="w-8 h-8 text-[#C6A96B] ml-1 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-[#F3EFE7]/30 text-xs tracking-wide">Clique para assistir</p>
              </div>
            </div>
            {/* Para usar um vídeo real, descomente e substitua a URL:
            <iframe
              src="https://www.youtube.com/embed/SEU_VIDEO_ID"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="VSL Formação Orácula"
            />
            */}
          </div>

          <p className="text-[#F3EFE7]/30 text-xs mt-6 font-light">
            6 minutos que podem mudar a forma como você conduz.
          </p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          SEÇÃO 2 — DESCONFORTO
      ═══════════════════════════════════════════ */}
      <section className="py-28 md:py-44 px-6 md:px-16 max-w-3xl mx-auto space-y-20 md:space-y-28">
        {[
          'Você já estudou.',
          'Já atendeu.',
          'Já ajudou.',
          'E mesmo assim…\nalgo não sustenta.',
          'As mulheres entendem…\nmas não atravessam.',
          'Elas acessam consciência…\nmas voltam.',
        ].map((frase, i) => (
          <Phrase key={i} delay={0.05 * i} className="font-display text-xl md:text-3xl lg:text-4xl font-light text-[#F3EFE7]/85 leading-[1.4] whitespace-pre-line">
            {frase}
          </Phrase>
        ))}
      </section>

      {/* ═══════════════════════════════════════════
          SEÇÃO — ISADORA (foto P&B + texto)
      ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-32 px-6 md:px-16 bg-[#0E0E13]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div {...fade} className="relative">
            <div className="relative overflow-hidden rounded-sm">
              <img src={isadoraPbImg} alt="Isadora" className="w-full max-w-sm mx-auto md:max-w-none grayscale" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E13] via-transparent to-transparent opacity-70" />
            </div>
          </motion.div>
          <motion.div {...fadeSlow} className="space-y-6">
            <Phrase className="font-display text-2xl md:text-4xl font-light text-[#F3EFE7]/90 leading-[1.25]">
              A Casa Orácula não forma terapeutas.
            </Phrase>
            <Phrase delay={0.1} className="font-display text-2xl md:text-4xl font-light text-[#C6A96B]/80 leading-[1.25]">
              Forma leitoras de campo.
            </Phrase>
            <Phrase delay={0.2} className="text-[#F3EFE7]/30 text-sm md:text-base leading-relaxed font-light max-w-md">
              Um método estruturado para quem quer parar de conduzir no escuro e começar a ler antes de intervir.
            </Phrase>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SEÇÃO 3 — PERGUNTA CENTRAL
      ═══════════════════════════════════════════ */}
      <section className="py-32 md:py-48 px-6 bg-[#111117] relative">
        <div className="absolute left-6 md:left-16 top-1/2 -translate-y-1/2 w-px h-32 bg-gradient-to-b from-transparent via-[#C6A96B]/20 to-transparent" />
        <div className="absolute right-6 md:right-16 top-1/2 -translate-y-1/2 w-px h-32 bg-gradient-to-b from-transparent via-[#C6A96B]/20 to-transparent" />

        <motion.div {...fadeSlow} className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-light leading-[1.15] mb-10">
            O que você ainda não está vendo?
          </h2>
          <Divider />
          <p className="text-[#F3EFE7]/40 text-lg md:text-xl font-light mt-10 leading-relaxed max-w-lg mx-auto">
            A verdade desconfortável:<br />
            não é falta de ferramenta.<br />
            <span className="text-[#C6A96B]/80">É falta de leitura.</span>
          </p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          SEÇÃO 4 — O ERRO INVISÍVEL
      ═══════════════════════════════════════════ */}
      <section className="py-28 md:py-44 px-6 md:px-16 max-w-3xl mx-auto space-y-16 md:space-y-24">
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
              className={`font-display text-xl md:text-3xl font-light leading-[1.4] whitespace-pre-line ${
                accent ? 'text-[#C6A96B]' : 'text-[#F3EFE7]/80'
              }`}
            >
              {text}
            </Phrase>
          );
        })}
      </section>

      {/* ═══════════════════════════════════════════
          SEÇÃO — ISADORA COM LIVRO (virada)
      ═══════════════════════════════════════════ */}
      <section className="relative py-20 md:py-32 px-6 md:px-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div {...fadeSlow} className="order-2 md:order-1 space-y-6">
            <Phrase className="font-display text-2xl md:text-4xl lg:text-5xl font-light text-[#F3EFE7]/90">
              A Casa Orácula nasce desse ponto.
            </Phrase>
            <Phrase delay={0.1} className="font-display text-xl md:text-2xl font-light text-[#F3EFE7]/40">
              Não como método de intervenção.
            </Phrase>
            <Phrase delay={0.2} className="font-display text-xl md:text-2xl font-light text-[#C6A96B]/70">
              Mas como método de leitura.
            </Phrase>
            <motion.div {...fade} className="pt-4">
              <p className="text-[#F3EFE7]/30 text-sm md:text-base leading-relaxed font-light">
                Um sistema estruturado para identificar:<br />
                em que limiar a psique está,<br />
                qual campo está ativo,<br />
                e qual estrutura sustentou aquela mulher até aqui.
              </p>
            </motion.div>
          </motion.div>
          <motion.div {...fade} className="order-1 md:order-2 relative">
            <div className="relative overflow-hidden rounded-sm">
              <img src={isadoraLivroImg} alt="Isadora segurando livro" className="w-full max-w-sm mx-auto md:max-w-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-transparent to-transparent opacity-50" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SEÇÃO 6 — O MÉTODO
      ═══════════════════════════════════════════ */}
      <section id="metodo" className="py-28 md:py-40 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <motion.p {...fade} className="text-[#C6A96B]/40 text-[10px] uppercase tracking-[0.6em] text-center mb-16">
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
                className="border border-[#F3EFE7]/[0.06] p-10 md:p-14 text-center"
              >
                <h3 className="font-display text-2xl md:text-3xl text-[#F3EFE7] font-light mb-4 tracking-wide">
                  {item.title}
                </h3>
                <p className="text-[#F3EFE7]/55 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fade} className="mt-20 text-center">
            <p className="font-display text-lg md:text-2xl font-light text-[#F3EFE7]/50 leading-relaxed max-w-lg mx-auto">
              Quando isso é visto,<br />
              a condução deixa de ser tentativa.<br />
              <span className="text-[#C6A96B]/70">E passa a ser precisão.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SEÇÃO 7 — NARRÔTERAPIA (com imagem)
      ═══════════════════════════════════════════ */}
      <section className="py-28 md:py-44 px-6 md:px-16 bg-[#0E0E13] relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img src={narroterapiaImg} alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-[#0E0E13]/85" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-16 md:space-y-24">
          <motion.p {...fade} className="text-[#C6A96B]/40 text-[10px] uppercase tracking-[0.6em] text-center">
            Narrôterapia Oracular
          </motion.p>

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
              className={`font-display text-xl md:text-3xl font-light leading-[1.4] whitespace-pre-line ${
                item.accent ? 'text-[#C6A96B]/80' : 'text-[#F3EFE7]/55'
              }`}
            >
              {item.text}
            </Phrase>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SEÇÃO 8 — O QUE A FORMAÇÃO ENTREGA (com imagens)
      ═══════════════════════════════════════════ */}
      <section id="formacao" className="py-28 md:py-40 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <motion.p {...fade} className="text-[#C6A96B]/40 text-[10px] uppercase tracking-[0.6em] text-center mb-16">
            O que a formação entrega
          </motion.p>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Leitura simbólica', desc: 'Você aprende a ler Portas, Campos e Torres antes de intervir.', img: circuloLeituraImg },
              { title: 'Certificação em Narrôterapia', desc: 'Recebe certificação para trabalhar narrativa como eixo clínico simbólico.', img: certificacaoImg },
              { title: 'Casa das Tecelãs', desc: 'Comunidade de prática supervisionada e mentorias ao vivo a cada 15 dias.', img: casaTecalasImg },
              { title: 'App clínico integrado', desc: 'Opera dentro de um mapa vivo da sua prática, sem depender de intuição solta.', img: casaMaquinasImg },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="border border-[#F3EFE7]/[0.06] overflow-hidden hover:border-[#C6A96B]/20 transition-colors duration-500 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/40 to-transparent" />
                </div>
                <div className="p-8 md:p-10">
                  <h3 className="font-display text-lg md:text-xl text-[#F3EFE7]/90 mb-3 group-hover:text-[#C6A96B]/80 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[#F3EFE7]/30 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SEÇÃO 9 — O APP COMO DIFERENCIAL
      ═══════════════════════════════════════════ */}
      <section id="app" className="py-28 md:py-40 px-6 md:px-16 bg-[#111117]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div {...fade}>
            <Phrase className="font-display text-2xl md:text-3xl font-light text-[#F3EFE7]/90 mb-2">
              O app da Casa Orácula não é bônus.
            </Phrase>
            <Phrase delay={0.1} className="font-display text-2xl md:text-3xl font-light text-[#C6A96B]/70 mb-10">
              É extensão da sua mente clínica.
            </Phrase>

            <div className="space-y-4 mb-10">
              {[
                'Mapa vivo da prática',
                'Registro de Portas',
                'Acompanhamento de narrativas',
                'Observação de movimentos de campo',
              ].map((item) => (
                <p key={item} className="text-[#F3EFE7]/35 text-sm flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-[#D8FF3E]/50" />
                  {item}
                </p>
              ))}
            </div>

            <p className="text-[#F3EFE7]/40 text-sm leading-relaxed font-light">
              Você deixa de depender de intuição solta.<br />
              <span className="text-[#C6A96B]/60">E passa a operar com estrutura.</span>
            </p>
          </motion.div>

          <motion.div {...fade} className="relative">
            <div className="relative rounded-xl overflow-hidden border border-[#F3EFE7]/[0.06]">
              <img src={casaMaquinasImg} alt="App Casa Orácula" className="w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111117] via-transparent to-transparent opacity-60" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SEÇÃO 10 — FORMAÇÃO DE IDENTIDADE
      ═══════════════════════════════════════════ */}
      <section className="py-32 md:py-48 px-6 md:px-16">
        <div className="max-w-3xl mx-auto space-y-16 md:space-y-24 text-center">
          <Phrase className="font-display text-2xl md:text-4xl font-light text-[#F3EFE7]/80">
            Isso não é um curso.
          </Phrase>
          <Phrase className="font-display text-2xl md:text-4xl font-light text-[#C6A96B]/80">
            É uma formação de identidade profissional.
          </Phrase>
          <Phrase className="font-display text-xl md:text-2xl font-light text-[#F3EFE7]/40">
            Porque não se reorganiza uma psique em um final de semana.
          </Phrase>
          <Phrase className="font-display text-xl md:text-2xl font-light text-[#F3EFE7]/40">
            E não se forma uma facilitadora em três meses.
          </Phrase>
          <Phrase className="font-display text-xl md:text-2xl font-light text-[#F3EFE7]/50">
            Um ano é o tempo de atravessar.<br />
            Integrar.<br />
            E se posicionar.
          </Phrase>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SEÇÃO 11 — OFERTA
      ═══════════════════════════════════════════ */}
      <section id="oferta" className="py-32 md:py-48 px-6 border-t border-[#F3EFE7]/[0.04] border-b border-b-[#F3EFE7]/[0.04]">
        <motion.div {...fadeSlow} className="max-w-2xl mx-auto text-center">
          <p className="text-[#C6A96B]/40 text-[10px] uppercase tracking-[0.6em] mb-12">
            Investimento
          </p>

          <h2 className="font-display text-2xl md:text-3xl font-light text-[#F3EFE7]/80 mb-4">
            Formação Oracular da Casa Orácula
          </h2>
          <p className="text-[#F3EFE7]/30 text-sm mb-10">Ciclo completo de 1 ano</p>

          <p className="font-display text-5xl md:text-7xl font-light text-[#F3EFE7] mb-2">
            R$ <span className="text-[#C6A96B]">3.597</span>
          </p>
          <p className="text-[#F3EFE7]/50 text-sm mb-2">ou até <span className="text-[#C6A96B]/90 font-medium">12x de R$ 349,58</span></p>
          <p className="text-[#F3EFE7]/30 text-sm mb-4">Turmas fechadas</p>
          <p className="text-[#F3EFE7]/30 text-xs max-w-xs mx-auto leading-relaxed mb-14">
            Quando iniciamos, não existe próxima data anunciada.
          </p>

          <button
            onClick={ctaClick}
            className="group bg-[#C6A96B] text-[#0B0B0F] px-14 py-5 text-[11px] uppercase tracking-[0.35em] font-semibold hover:bg-[#d4b87a] transition-all duration-500 inline-flex items-center gap-3"
          >
            Entrar na Formação
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-[#F3EFE7]/20 text-xs mt-10 max-w-xs mx-auto leading-relaxed italic">
            A decisão não é sobre valor.<br />
            É sobre responsabilidade.
          </p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          SEÇÃO 12 — FECHAMENTO
      ═══════════════════════════════════════════ */}
      <section className="relative py-36 md:py-56 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0F] via-[#0E0E13] to-[#0B0B0F]" />

        {/* Aura */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#C6A96B]/[0.03] blur-[160px] pointer-events-none"
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 max-w-2xl mx-auto space-y-12 md:space-y-16 text-center">
          <Phrase className="font-display text-xl md:text-2xl font-light text-[#F3EFE7]/50 italic">
            Depois que você aprende a ler…<br />
            não consegue mais fingir que não vê.
          </Phrase>
          <Phrase className="font-display text-lg md:text-xl font-light text-[#F3EFE7]/35">
            Se você sente que já não quer apenas conduzir mulheres…
          </Phrase>
          <Phrase className="font-display text-lg md:text-xl font-light text-[#F3EFE7]/35">
            Mas compreender o que sustenta cada história…
          </Phrase>
          <Phrase className="font-display text-lg md:text-xl font-light text-[#F3EFE7]/45">
            Talvez você não esteja buscando mais uma técnica.
          </Phrase>
          <Phrase className="font-display text-xl md:text-2xl font-light text-[#C6A96B]/70">
            Talvez esteja buscando uma casa.
          </Phrase>
          <Phrase className="font-display text-2xl md:text-3xl font-light text-[#F3EFE7]/80">
            E a Casa…<br />já existe.
          </Phrase>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="pt-8"
          >
            <button
              onClick={ctaClick}
              className="group bg-[#C6A96B] text-[#0B0B0F] px-16 py-6 text-[11px] uppercase tracking-[0.35em] font-semibold hover:bg-[#d4b87a] transition-all duration-700 shadow-[0_0_120px_-20px_rgba(198,169,107,0.3)] hover:shadow-[0_0_160px_-20px_rgba(198,169,107,0.5)] inline-flex items-center gap-3"
            >
              Entrar na Formação Orácula
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-16 px-6 md:px-16 border-t border-[#F3EFE7]/[0.03]">
        <p className="text-[#F3EFE7]/15 text-[11px] leading-relaxed max-w-xl">
          Casa Orácula © {new Date().getFullYear()} · A Casa Orácula não substitui terapia,
          acompanhamento psicológico ou tratamento clínico quando necessário.
        </p>
      </footer>
    </div>
  );
}
