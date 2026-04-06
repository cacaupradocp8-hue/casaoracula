import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";

import heroImg from "@/assets/isadora-01.png";
import isadora04 from "@/assets/isadora-04.png";
import mentoria from "@/assets/mentoria01.png";

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as const },
};

export default function OraculaSalesPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const scrollToMetodo = () => {
    document.getElementById("metodo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden selection:bg-[#C6A96B]/30">

      {/* ═══ 1. HERO — Full screen, máximo respiro ═══ */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity }}
        className="relative h-screen flex items-center justify-center"
      >
        <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
          <img src={heroImg} alt="" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-[#0A0A0A]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/30" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="relative z-10 text-center px-6 max-w-4xl"
        >
          <p className="text-[#C6A96B]/70 text-[11px] uppercase tracking-[0.6em] mb-10">
            Casa Orácula
          </p>

          <h1 className="font-display text-[clamp(2.5rem,7vw,6rem)] font-light leading-[1.05] tracking-tight mb-8">
            Formação
            <br />
            <span className="font-bold text-[#C6A96B]">Orácula</span>
          </h1>

          <p className="text-white/40 text-lg md:text-xl font-light max-w-md mx-auto leading-relaxed mb-16">
            Leitura de campo. Condução simbólica.
            <br />
            Estrutura profissional real.
          </p>

          <Button
            size="lg"
            onClick={() => navigate("/planos")}
            className="bg-[#C6A96B] text-[#0A0A0A] hover:bg-[#d4b87a] px-12 py-7 text-xs uppercase tracking-[0.3em] font-semibold rounded-none transition-all duration-500"
          >
            Entrar na Formação
          </Button>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <div className="w-[1px] h-10 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </motion.section>

      {/* ═══ 2. FRASES — Uma por bloco, ritmo lento ═══ */}
      {[
        "Ela já leu tudo.",
        "Já fez terapia.\nJá chorou o que precisava.",
        "Mas ninguém leu o campo em que ela está.",
        "Sem mapa, toda escuta vira intuição solta.",
        "E toda intuição solta vira risco.",
      ].map((frase, i) => (
        <motion.section
          key={i}
          {...fade}
          transition={{ duration: 1.2, delay: 0.1 }}
          className="py-24 md:py-36 px-8 md:px-16 lg:px-24"
        >
          <p className="font-display text-2xl md:text-4xl lg:text-5xl font-light text-white/80 leading-[1.3] max-w-3xl whitespace-pre-line">
            {frase}
          </p>
        </motion.section>
      ))}

      {/* ═══ 3. VIRADA — Contraste leve ═══ */}
      <section className="py-32 md:py-48 px-8 md:px-16 lg:px-24 bg-[#0D0D0D]">
        <motion.div {...fade} className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-[1px] bg-[#C6A96B]/40 mx-auto mb-16" />
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-light leading-[1.15] text-white">
            Você está conduzindo
            <br />
            <span className="text-[#C6A96B] font-normal">sem saber em que história</span>
            <br />
            <span className="text-[#C6A96B] font-normal">essa mulher está.</span>
          </h2>
          <div className="w-16 h-[1px] bg-[#C6A96B]/40 mx-auto mt-16" />
        </motion.div>
      </section>

      {/* ═══ 4. MÉTODO — 3 colunas, mínimo ═══ */}
      <section id="metodo" className="py-28 md:py-40 px-8 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <motion.p {...fade} className="text-[#C6A96B]/60 text-[11px] uppercase tracking-[0.5em] mb-6">
            Método da CidaDELA
          </motion.p>
          <motion.h2 {...fade} className="font-display text-3xl md:text-5xl font-light text-white mb-20">
            Um mapa. <span className="text-white/25">Não técnicas.</span>
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-px bg-white/[0.04]">
            {[
              { num: "01", title: "Portas", desc: "Onde ela está agora. O limiar define a postura." },
              { num: "02", title: "Campos", desc: "O clima que atravessa. O que sustentar, o que não tocar." },
              { num: "03", title: "Torres", desc: "O que a manteve de pé. Honra, não patologia." },
            ].map((item, i) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                className="bg-[#0A0A0A] p-10 md:p-14"
              >
                <span className="text-[#C6A96B]/40 text-xs tracking-[0.3em] block mb-8">{item.num}</span>
                <h3 className="font-display text-2xl md:text-3xl text-white font-light mb-4">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. IMAGEM + POSICIONAMENTO ═══ */}
      <section className="relative py-28 md:py-40">
        <div className="absolute inset-0">
          <img src={mentoria} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0A0A0A]/80" />
        </div>
        <motion.div {...fade} className="relative z-10 px-8 md:px-16 lg:px-24 max-w-4xl">
          <p className="text-[#C6A96B]/60 text-[11px] uppercase tracking-[0.5em] mb-8">
            Posicionamento
          </p>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-light text-white leading-[1.1] mb-8">
            A Casa Orácula
            <br />
            não forma terapeutas.
          </h2>
          <p className="font-display text-3xl md:text-5xl lg:text-6xl font-light leading-[1.1]">
            <span className="text-[#C6A96B]">Forma leitoras de campo.</span>
          </p>
        </motion.div>
      </section>

      {/* ═══ 5.5. FORMAÇÃO — bloco mais detalhado ═══ */}
      <section className="py-28 md:py-40 px-8 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fade} className="mb-20">
            <p className="text-[#C6A96B]/60 text-[11px] uppercase tracking-[0.5em] mb-6">
              Jornada de 1 ano
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-light text-white mb-6">
              Cinco níveis. Progressão por maturidade.
            </h2>
            <p className="text-white/35 text-base max-w-xl leading-relaxed">
              Não se avança por tempo. Avança-se por prática, supervisão e evidência real.
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-4 mb-20">
            {["Iniciada", "Praticante", "Condutora", "Guia de Grupos", "Formadora"].map((n, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="border border-white/[0.08] px-6 py-4 text-center min-w-[140px]"
              >
                <span className="text-[#C6A96B]/50 text-[10px] tracking-[0.3em] block mb-1">0{i + 1}</span>
                <span className="text-white/80 text-sm font-display">{n}</span>
              </motion.div>
            ))}
          </div>

          {/* Inclui */}
          <motion.div {...fade} className="grid md:grid-cols-2 gap-16">
            <div>
              <p className="text-[#C6A96B]/60 text-[11px] uppercase tracking-[0.4em] mb-6">Inclui</p>
              <div className="space-y-4">
                {[
                  "Mentoria e supervisão contínua",
                  "App integrado com ferramentas clínicas",
                  "Clube Oracular — leitura como prática",
                  "Casa das Máquinas — 30+ instrumentos",
                  "Certificação em Leitura Simbólica",
                ].map((item) => (
                  <p key={item} className="text-white/50 text-sm flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-[#C6A96B]/50" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <div>
              <p className="text-white/20 text-[11px] uppercase tracking-[0.4em] mb-6">Não é para quem</p>
              <div className="space-y-4">
                {[
                  "Busca certificado rápido",
                  "Quer respostas prontas",
                  "Não pratica com pessoas reais",
                  "Evita supervisão e revisão",
                ].map((item) => (
                  <p key={item} className="text-white/25 text-sm flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-white/15" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ 6. OFERTA — Limpa ═══ */}
      <section className="py-28 md:py-40 px-8 md:px-16 lg:px-24 border-t border-white/[0.04]">
        <motion.div {...fade} className="max-w-3xl mx-auto text-center">
          <p className="text-[#C6A96B]/60 text-[11px] uppercase tracking-[0.5em] mb-10">
            Investimento
          </p>
          <p className="font-display text-5xl md:text-7xl font-light text-white mb-2">
            12x de <span className="text-[#C6A96B] font-normal">R$ 297</span>
          </p>
          <p className="text-white/25 text-base mb-6">ou R$ 2.997 à vista</p>
          <p className="text-white/20 text-xs max-w-sm mx-auto leading-relaxed">
            Turma com vagas limitadas por ciclo. As vagas são reais e se encerram quando preenchidas.
          </p>
        </motion.div>
      </section>

      {/* ═══ 7. CTA FINAL — Isolado, com aura ═══ */}
      <section className="relative py-40 md:py-56 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0D0D0D] to-[#0A0A0A]" />

        {/* Aura */}
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-[#C6A96B]/[0.04] blur-[140px] pointer-events-none"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div {...fade} className="relative z-10 text-center px-8">
          <p className="font-display text-xl md:text-2xl text-white/40 italic leading-relaxed mb-4 max-w-lg mx-auto">
            Você não entra para aprender sobre o feminino.
          </p>
          <p className="font-display text-xl md:text-2xl text-white leading-relaxed mb-16 max-w-lg mx-auto">
            Você entra para aprender a sustentá-lo.
          </p>

          <Button
            size="lg"
            onClick={() => navigate("/planos")}
            className="bg-[#C6A96B] text-[#0A0A0A] hover:bg-[#d4b87a] hover:scale-[1.01] transition-all duration-700 shadow-[0_0_100px_-20px_rgba(198,169,107,0.35)] hover:shadow-[0_0_140px_-20px_rgba(198,169,107,0.55)] px-16 py-8 text-xs font-semibold tracking-[0.3em] uppercase rounded-none"
          >
            Entrar na Formação
            <ArrowRight className="w-4 h-4 ml-3" />
          </Button>

          <p className="text-white/15 text-[10px] mt-12 uppercase tracking-[0.4em]">
            Vagas limitadas por ciclo
          </p>
        </motion.div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-16 px-8 md:px-16 lg:px-24 border-t border-white/[0.03]">
        <p className="text-white/15 text-[11px] leading-relaxed max-w-xl">
          Casa Orácula © {new Date().getFullYear()} · A Casa Orácula não substitui terapia,
          acompanhamento psicológico ou tratamento clínico quando necessário.
        </p>
      </footer>
    </div>
  );
}
