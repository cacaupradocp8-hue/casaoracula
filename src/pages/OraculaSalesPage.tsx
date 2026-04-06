import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";

import heroImg from "@/assets/isadora-01.png";
import isadora03 from "@/assets/isadora-03.png";
import isadora04 from "@/assets/isadora-04.png";
import casaMaquinas from "@/assets/casa-das-maquinas.png";
import mentoria from "@/assets/mentoria01.png";
import oraculaCurso from "@/assets/oracula-curso.png";
import isadoraPerfil from "@/assets/isadora-perfil.png";

const fade = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
};

export default function OraculaSalesPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden selection:bg-[#C6A96B]/30">

      {/* ═══ HERO — Full-bleed com imagem ═══ */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity }}
        className="relative min-h-screen flex items-end pb-16 md:pb-24"
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt=""
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/90 via-[#080808]/40 to-transparent" />
        </div>

        {/* Ghost text */}
        <div className="absolute top-1/2 -translate-y-1/2 right-0 pointer-events-none select-none overflow-hidden">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.03 }}
            transition={{ duration: 2 }}
            className="font-display text-[20vw] font-bold tracking-tighter text-white whitespace-nowrap"
          >
            ORÁCULA
          </motion.span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 px-8 md:px-16 lg:px-24 max-w-5xl"
        >
          <p className="text-[#C6A96B] text-xs md:text-sm uppercase tracking-[0.5em] mb-6 font-medium">
            Formação Orácula · Casa Orácula · Brasil
          </p>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-8">
            Do{" "}
            <span className="text-[#C6A96B]">silêncio</span>
            <br />
            à <span className="text-white">condução.</span>
          </h1>

          <p className="text-white/70 text-base md:text-lg max-w-md leading-relaxed mb-12">
            Formação profissional em leitura de campo e condução simbólica feminina. 
            Estrutura. Mapa. Prática real.
          </p>

          <div className="flex items-center gap-6 flex-wrap">
            <Button
              size="lg"
              onClick={() => navigate('/planos')}
              className="bg-[#C6A96B] text-black hover:bg-[#d4b87a] px-10 py-7 text-sm uppercase tracking-[0.2em] font-bold transition-all duration-300"
            >
              Entrar na Formação →
            </Button>
            <button
              onClick={() => {
                const el = document.getElementById('metodo');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-white/50 hover:text-white text-sm uppercase tracking-[0.15em] transition-colors duration-300 underline underline-offset-4 decoration-white/20 hover:decoration-[#C6A96B]/50"
            >
              Conhecer o Método
            </button>
          </div>
        </motion.div>
      </motion.section>

      {/* ═══ NÚMEROS ═══ */}
      <section className="py-20 md:py-28 px-8 md:px-16 lg:px-24 border-t border-white/5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-6xl">
          {[
            { num: "1 ano", label: "Travessia completa" },
            { num: "5", label: "Níveis de formação" },
            { num: "100%", label: "Prática supervisionada" },
            { num: "App", label: "Integrado + Ferramentas" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <p className="font-display text-4xl md:text-5xl font-bold text-[#C6A96B] mb-2">
                {item.num}
              </p>
              <p className="text-white/50 text-sm uppercase tracking-wider">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ BLOCO ISADORA — Imagem + texto lado a lado ═══ */}
      <section className="py-20 md:py-32 px-8 md:px-16 lg:px-24">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center max-w-7xl mx-auto">
          <motion.div {...fade}>
            <img
              src={isadora04}
              alt="Isadora Campos"
              className="w-full max-w-lg rounded-2xl object-cover aspect-[3/4]"
            />
          </motion.div>
          <motion.div {...fade} className="space-y-8">
            <p className="text-[#C6A96B] text-xs uppercase tracking-[0.4em]">
              A mulher por trás do método
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] text-white">
              Ela já leu.
              <br />
              Já chorou.
              <br />
              Já fez terapia.
            </h2>
            <p className="text-white/60 text-lg leading-relaxed max-w-md">
              Mas ninguém leu o campo em que ela está. Sem mapa, toda escuta vira intuição solta. 
              E toda intuição solta vira risco clínico.
            </p>
            <div className="w-16 h-px bg-[#C6A96B]/30" />
            <p className="text-white/40 text-base italic font-display leading-relaxed max-w-md">
              A Formação Orácula existe para quem quer parar de adivinhar 
              — e começar a ler.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ FRASE IMPACTO GRANDE ═══ */}
      <section className="py-28 md:py-44 px-8 md:px-16 lg:px-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-[#0c0c0c] to-[#080808]" />
        <motion.div {...fade} className="relative z-10 max-w-5xl">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-white">
            Você está conduzindo
            <br />
            <span className="text-[#C6A96B]">sem saber em que história</span>
            <br />
            <span className="text-[#C6A96B]">essa mulher está.</span>
          </h2>
        </motion.div>
      </section>

      {/* ═══ MÉTODO — com imagem de fundo ═══ */}
      <section id="metodo" className="py-20 md:py-32 px-8 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fade} className="mb-20">
            <p className="text-[#C6A96B] text-xs uppercase tracking-[0.4em] mb-4">
              Método da CidaDELA
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05]">
              Um mapa.
              <br />
              <span className="text-white/40">Não um conjunto de técnicas.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                title: "Portas Psíquicas",
                sub: "Onde ela está agora",
                detail: "Não descrevem quem a mulher é — mas em que limiar ela se encontra. A porta define a postura, não o diagnóstico.",
              },
              {
                num: "02",
                title: "Campos Psíquicos",
                sub: "O clima que atravessa",
                detail: "Informam a postura: o que sustentar, o que não acelerar, o que não tocar. O campo é atmosfera, não interpretação.",
              },
              {
                num: "03",
                title: "Torres de Sobrevivência",
                sub: "O que a manteve de pé",
                detail: "Estruturas erguidas quando não havia chão. Reconhecidas, nunca arrancadas. Torres são honra, não patologia.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 md:p-10 hover:border-[#C6A96B]/20 transition-all duration-500 group"
              >
                <span className="text-[#C6A96B] text-sm font-bold tracking-wider mb-6 block">
                  {item.num}
                </span>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-[#C6A96B] transition-colors duration-500">
                  {item.title}
                </h3>
                <p className="text-[#C6A96B]/60 text-sm italic mb-5">{item.sub}</p>
                <p className="text-white/50 text-sm leading-relaxed">{item.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CITAÇÃO VIRADA ═══ */}
      <section className="py-24 md:py-36 px-8 md:px-16 lg:px-24">
        <motion.div {...fade} className="max-w-4xl">
          <div className="w-12 h-1 bg-[#C6A96B] mb-10" />
          <p className="font-display text-3xl md:text-4xl lg:text-5xl text-white/80 leading-[1.2] italic">
            "A pergunta nunca é{" "}
            <em className="text-white not-italic font-bold">quem você é</em>.
            <br />
            A pergunta é:{" "}
            <em className="text-[#C6A96B] not-italic font-bold">em que campo você está agora.</em>"
          </p>
        </motion.div>
      </section>

      {/* ═══ CERTIFICAÇÃO — Imagem full-width ═══ */}
      <section className="relative py-20 md:py-32">
        <div className="absolute inset-0">
          <img src={mentoria} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#080808]/80" />
        </div>
        <motion.div {...fade} className="relative z-10 px-8 md:px-16 lg:px-24 max-w-5xl">
          <p className="text-[#C6A96B] text-xs uppercase tracking-[0.4em] mb-6">
            Certificação Profissional
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05] mb-8">
            A Casa Orácula
            <br />
            não forma terapeutas.
            <br />
            <span className="text-[#C6A96B]">Forma leitoras de campo.</span>
          </h2>
          <p className="text-white/60 text-lg max-w-lg leading-relaxed">
            Certificação em Leitura e Condução Simbólica Feminina. 
            Cinco níveis de maturidade. Prática real. Supervisão contínua.
          </p>
        </motion.div>
      </section>

      {/* ═══ ECOSSISTEMA — Casa das Máquinas + Clube ═══ */}
      <section className="py-20 md:py-32 px-8 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fade} className="mb-16">
            <p className="text-[#C6A96B] text-xs uppercase tracking-[0.4em] mb-4">
              O que você recebe
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
              Ecossistema completo.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Casa das Máquinas */}
            <motion.div
              {...fade}
              className="relative rounded-2xl overflow-hidden group cursor-pointer aspect-video"
            >
              <img src={casaMaquinas} alt="Casa das Máquinas" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 md:p-10">
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">Casa das Máquinas</h3>
                <p className="text-white/60 text-sm max-w-sm">
                  Ferramentas profissionais: Big5 Simbólico, Eneagrama Oracular, Atlas Arquetípico, 
                  Cartografia Psíquica e 30+ instrumentos clínicos integrados.
                </p>
              </div>
            </motion.div>

            {/* Clube Oracular */}
            <motion.div
              {...fade}
              className="relative rounded-2xl overflow-hidden group cursor-pointer aspect-video bg-[#0d0d0d] border border-white/[0.06]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#C6A96B]/5 to-transparent" />
              <div className="relative z-10 p-8 md:p-10 h-full flex flex-col justify-between">
                <div>
                  <p className="text-[#C6A96B] text-xs uppercase tracking-[0.3em] mb-4">Clube Oracular</p>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
                    Sistema de leitura como
                    <br />
                    <span className="text-[#C6A96B]">intervenção psíquica guiada.</span>
                  </h3>
                  <p className="text-white/50 text-sm max-w-sm leading-relaxed">
                    Cada livro aplicado à prática profissional. Travessias semanais. 
                    Não é grupo de leitura — é campo de formação contínua.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[#C6A96B]/70 text-xs uppercase tracking-wider mt-6">
                  <span>Incluído na formação</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ COMPARAÇÃO — Sem / Com formação ═══ */}
      <section className="py-20 md:py-32 px-8 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fade} className="mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
              Antes e depois
              <br />
              <span className="text-white/30">da estrutura.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              {...fade}
              className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 md:p-12"
            >
              <p className="text-white/30 text-xs uppercase tracking-[0.3em] mb-8 font-medium">Sem o método</p>
              <div className="space-y-6">
                {[
                  "Escuta baseada em intuição",
                  "Técnicas soltas sem mapa",
                  "Risco de projeção não percebido",
                  "Intervenções sem campo",
                  "Conteúdo sem prática real",
                ].map((item) => (
                  <p key={item} className="text-white/35 text-base flex items-start gap-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/15 shrink-0 mt-2" />
                    {item}
                  </p>
                ))}
              </div>
            </motion.div>

            <motion.div
              {...fade}
              className="bg-[#C6A96B]/[0.04] border border-[#C6A96B]/15 rounded-2xl p-8 md:p-12"
            >
              <p className="text-[#C6A96B] text-xs uppercase tracking-[0.3em] mb-8 font-medium">Com a Formação Orácula</p>
              <div className="space-y-6">
                {[
                  "Leitura de campo estruturada",
                  "Mapa da CidaDELA como guia clínico",
                  "Narroterapia como condução ética",
                  "Clube Oracular como prática viva",
                  "Supervisão e mentoria contínua",
                ].map((item) => (
                  <p key={item} className="text-white/80 text-base flex items-start gap-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C6A96B] shrink-0 mt-2" />
                    {item}
                  </p>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ NÍVEIS DA FORMAÇÃO ═══ */}
      <section className="py-20 md:py-32 px-8 md:px-16 lg:px-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fade} className="mb-16">
            <p className="text-[#C6A96B] text-xs uppercase tracking-[0.4em] mb-4">
              Jornada formativa
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
              Cinco níveis de maturidade.
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { nome: "Iniciada", desc: "Presença e contenção" },
              { nome: "Praticante", desc: "Estrutura e linguagem" },
              { nome: "Condutora", desc: "Decisão e travessia" },
              { nome: "Guia de Grupos", desc: "Campo coletivo" },
              { nome: "Formadora", desc: "Transmissão e linhagem" },
            ].map((nivel, i) => (
              <motion.div
                key={nivel.nome}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 text-center hover:border-[#C6A96B]/20 transition-all duration-500"
              >
                <span className="text-[#C6A96B] text-2xl font-display font-bold block mb-3">
                  0{i + 1}
                </span>
                <h3 className="font-display text-lg text-white font-semibold mb-1">{nivel.nome}</h3>
                <p className="text-white/40 text-xs">{nivel.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PARA QUEM É / NÃO É ═══ */}
      <section className="py-20 md:py-32 px-8 md:px-16 lg:px-24">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start max-w-7xl mx-auto">
          <motion.div {...fade}>
            <p className="text-[#C6A96B] text-xs uppercase tracking-[0.4em] mb-6">Para quem é</p>
            <div className="space-y-5">
              {[
                "Terapeutas que querem estrutura simbólica",
                "Psicólogas interessadas em linguagem arquetípica",
                "Mentoras do feminino com prática ativa",
                "Facilitadoras que querem supervisão real",
              ].map((item) => (
                <p key={item} className="text-white/70 text-base flex items-start gap-4">
                  <span className="text-[#C6A96B] text-lg leading-none">+</span>
                  {item}
                </p>
              ))}
            </div>
          </motion.div>

          <motion.div {...fade}>
            <p className="text-white/30 text-xs uppercase tracking-[0.4em] mb-6">Para quem não é</p>
            <div className="space-y-5">
              {[
                "Quem busca certificado rápido",
                "Quem quer respostas prontas",
                "Quem não pratica com pessoas reais",
                "Quem evita supervisão e revisão",
              ].map((item) => (
                <p key={item} className="text-white/30 text-base flex items-start gap-4">
                  <span className="text-white/15 text-lg leading-none">—</span>
                  {item}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ INVESTIMENTO ═══ */}
      <section className="py-24 md:py-36 px-8 md:px-16 lg:px-24 border-t border-white/5">
        <motion.div {...fade} className="max-w-3xl">
          <p className="text-[#C6A96B] text-xs uppercase tracking-[0.4em] mb-8">
            Investimento
          </p>

          <p className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3">
            12x de <span className="text-[#C6A96B]">R$ 297</span>
          </p>
          <p className="text-white/40 text-lg mb-10">ou R$ 2.997 à vista</p>

          <p className="text-white/30 text-sm max-w-md leading-relaxed">
            Turma com vagas limitadas por ciclo. Sem countdown fake. 
            As vagas são reais e se encerram quando preenchidas.
          </p>
        </motion.div>
      </section>

      {/* ═══ CTA FINAL — Com imagem de fundo ═══ */}
      <section className="relative py-32 md:py-48">
        <div className="absolute inset-0">
          <img src={oraculaCurso} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#080808]/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/90 to-transparent" />
        </div>

        {/* Pulsing aura */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="w-[500px] h-[500px] rounded-full bg-[#C6A96B]/[0.06] blur-[120px]"
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.div
          {...fade}
          className="relative z-10 px-8 md:px-16 lg:px-24 max-w-4xl"
        >
          <p className="font-display text-2xl md:text-3xl text-white/60 italic leading-relaxed mb-14">
            Você não entra para aprender sobre o feminino.
            <br />
            <span className="text-white">Você entra para aprender a sustentá-lo.</span>
          </p>

          <Button
            size="lg"
            onClick={() => navigate('/planos')}
            className="bg-[#C6A96B] text-black hover:bg-[#d4b87a] hover:scale-[1.02] transition-all duration-500 shadow-[0_0_80px_-15px_rgba(198,169,107,0.4)] hover:shadow-[0_0_120px_-15px_rgba(198,169,107,0.6)] px-16 py-8 text-base font-bold tracking-[0.2em] uppercase"
          >
            Entrar na Formação
            <ArrowRight className="w-5 h-5 ml-3" />
          </Button>

          <p className="text-white/25 text-xs mt-10 uppercase tracking-widest">
            Vagas limitadas por ciclo
          </p>
        </motion.div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-16 px-8 md:px-16 lg:px-24 border-t border-white/5">
        <div className="max-w-3xl">
          <p className="text-white/20 text-xs leading-relaxed">
            Casa Orácula © {new Date().getFullYear()} · A Casa Orácula não substitui terapia, 
            acompanhamento psicológico ou tratamento clínico quando necessário.
          </p>
        </div>
      </footer>
    </div>
  );
}
