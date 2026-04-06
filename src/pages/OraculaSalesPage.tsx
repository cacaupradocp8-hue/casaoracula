import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

const slowFade = {
  ...fade,
  transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as const },
};

export default function OraculaSalesPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.7], [1, 0.97]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden selection:bg-[#C6A96B]/20">

      {/* ══════════════════════════════════════
          1. HERO — Presença absoluta
      ══════════════════════════════════════ */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex flex-col items-center justify-center px-6"
      >
        {/* Orbe de fundo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="w-[600px] h-[600px] rounded-full bg-[#C6A96B]/[0.04] blur-[120px]"
            animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-center max-w-4xl"
        >
          <p className="text-[#C6A96B]/40 text-[10px] md:text-xs uppercase tracking-[0.6em] mb-12 font-medium">
            Formação Orácula
          </p>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-wide mb-8">
            Existe uma mulher
            <br />
            que já entendeu tudo.
          </h1>

          <p className="text-white/30 text-lg md:text-xl max-w-md mx-auto mb-20 leading-relaxed">
            E ainda não conseguiu mudar.
          </p>

          <Button
            size="lg"
            onClick={() => navigate('/planos')}
            className="bg-transparent border border-[#C6A96B]/30 text-white/80 hover:bg-[#C6A96B]/8 hover:border-[#C6A96B]/50 px-12 py-7 text-sm font-display tracking-[0.2em] uppercase transition-all duration-700"
          >
            Entrar na Formação
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-[#C6A96B]/30 to-transparent" />
        </motion.div>
      </motion.section>

      {/* ══════════════════════════════════════
          2. FRASES DE IMPACTO — Ritmo vertical
      ══════════════════════════════════════ */}
      <section className="py-32 md:py-48 px-6">
        <div className="max-w-2xl mx-auto space-y-20 md:space-y-28">
          {[
            "Ela já leu. Já chorou. Já fez terapia.",
            "Mas ninguém leu o campo em que ela está.",
            "Sem mapa, toda escuta vira intuição solta.",
            "E toda intuição solta vira risco.",
          ].map((frase, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: 0.05 }}
              className={`font-display text-xl md:text-2xl lg:text-3xl text-center leading-[1.4] ${
                i === 3 ? "text-[#C6A96B]/70" : "text-white/40"
              }`}
            >
              {frase}
            </motion.p>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          3. TENSÃO — Ponto cego
      ══════════════════════════════════════ */}
      <section className="relative py-32 md:py-44 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0F1114] to-[#0A0A0A]" />

        <motion.div
          {...slowFade}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <div className="w-12 h-px bg-[#C6A96B]/20 mx-auto mb-16" />

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-[1.15] tracking-wide">
            Você está conduzindo
            <br />
            <span className="text-[#C6A96B]">sem saber em que história
            <br />
            essa mulher está.</span>
          </h2>

          <div className="w-12 h-px bg-[#C6A96B]/20 mx-auto mt-16" />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════
          4. VIRADA — Frase única
      ══════════════════════════════════════ */}
      <section className="py-28 md:py-40 px-6">
        <motion.div
          {...slowFade}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-[#C6A96B]/30 text-[10px] uppercase tracking-[0.5em] mb-10">
            O método
          </p>
          <p className="font-display text-2xl md:text-3xl lg:text-4xl text-white/60 leading-[1.35] italic">
            "A pergunta nunca é <em className="text-white/80 not-italic">quem você é</em>.
            <br />
            A pergunta é: <em className="text-[#C6A96B] not-italic">em que campo você está agora.</em>"
          </p>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════
          5. MÉTODO — Portas / Campos / Torres
      ══════════════════════════════════════ */}
      <section className="py-28 md:py-40 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fade} transition={{ duration: 0.8 }} className="text-center mb-24">
            <p className="text-[#C6A96B]/30 text-[10px] uppercase tracking-[0.5em] mb-6">
              Método da CidaDELA
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white tracking-wide">
              Um mapa. Não um conjunto de técnicas.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-px bg-white/[0.04] rounded-2xl overflow-hidden">
            {[
              {
                title: "Portas Psíquicas",
                sub: "Onde ela está agora",
                detail: "Não descrevem quem a mulher é — mas em que limiar ela se encontra.",
              },
              {
                title: "Campos Psíquicos",
                sub: "O clima que atravessa a Porta",
                detail: "Informam a postura: o que sustentar, o que não acelerar, o que não tocar.",
              },
              {
                title: "Torres de Sobrevivência",
                sub: "O que a manteve de pé",
                detail: "Estruturas erguidas quando não havia chão. Reconhecidas, nunca arrancadas.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                className="bg-[#0A0A0A] p-8 md:p-10 lg:p-12 flex flex-col"
              >
                <span className="text-[#C6A96B]/25 text-[10px] uppercase tracking-[0.4em] mb-6 font-medium">
                  0{i + 1}
                </span>
                <h3 className="font-display text-xl md:text-2xl text-white mb-2">{item.title}</h3>
                <p className="text-[#C6A96B]/50 text-sm italic mb-5">{item.sub}</p>
                <p className="text-white/30 text-sm leading-relaxed mt-auto">{item.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          6. POSICIONAMENTO
      ══════════════════════════════════════ */}
      <section className="py-32 md:py-44 px-6">
        <motion.div
          {...slowFade}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-[1.15] tracking-wide">
            A Casa Orácula
            <br />
            não forma terapeutas.
          </h2>
          <p className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#C6A96B] leading-[1.15] tracking-wide mt-4">
            Forma leitoras de campo.
          </p>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════
          7. DECISÃO — Comparação implícita
      ══════════════════════════════════════ */}
      <section className="py-24 md:py-36 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-px bg-white/[0.04] rounded-2xl overflow-hidden">
            {/* Sem formação */}
            <motion.div
              {...fade}
              transition={{ duration: 0.8 }}
              className="bg-[#0A0A0A] p-10 md:p-14"
            >
              <p className="text-white/15 text-[10px] uppercase tracking-[0.4em] mb-8">Sem o método</p>
              <div className="space-y-5">
                {[
                  "Escuta baseada em intuição",
                  "Técnicas soltas sem mapa",
                  "Risco de projeção não percebido",
                  "Intervenções sem campo",
                ].map((item) => (
                  <p key={item} className="text-white/20 text-sm flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-white/10 shrink-0" />
                    {item}
                  </p>
                ))}
              </div>
            </motion.div>

            {/* Com formação */}
            <motion.div
              {...fade}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="bg-[#0A0A0A] p-10 md:p-14 border-l border-[#C6A96B]/10"
            >
              <p className="text-[#C6A96B]/40 text-[10px] uppercase tracking-[0.4em] mb-8">Com a Formação</p>
              <div className="space-y-5">
                {[
                  "Leitura de campo estruturada",
                  "Mapa da CidaDELA como guia",
                  "Narroterapia como condução",
                  "Clube Oracular como prática viva",
                ].map((item) => (
                  <p key={item} className="text-white/50 text-sm flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C6A96B]/40 shrink-0" />
                    {item}
                  </p>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          8. ESTRUTURA — Mínima
      ══════════════════════════════════════ */}
      <section className="py-24 md:py-36 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fade} transition={{ duration: 0.8 }}>
            <p className="text-[#C6A96B]/30 text-[10px] uppercase tracking-[0.5em] mb-12">
              Estrutura
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-16">
              {[
                { value: "1 ano", label: "Travessia" },
                { value: "Mentoria", label: "Contínua" },
                { value: "Prática", label: "Supervisionada" },
                { value: "App", label: "Integrado" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <p className="font-display text-2xl md:text-3xl text-white mb-1">{item.value}</p>
                  <p className="text-white/25 text-xs uppercase tracking-widest">{item.label}</p>
                </motion.div>
              ))}
            </div>

            <p className="text-white/20 text-sm max-w-md mx-auto leading-relaxed">
              Indicado para quem deseja atuar conduzindo outras mulheres com estrutura, mapa e acompanhamento real.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          9. INVESTIMENTO
      ══════════════════════════════════════ */}
      <section className="py-24 md:py-36 px-6">
        <motion.div {...fade} transition={{ duration: 0.8 }} className="max-w-xl mx-auto text-center">
          <p className="text-[#C6A96B]/30 text-[10px] uppercase tracking-[0.5em] mb-10">
            Investimento
          </p>

          <p className="font-display text-5xl md:text-6xl text-[#C6A96B] mb-3">
            12x de R$ 297
          </p>
          <p className="text-white/20 text-sm mb-8">ou R$ 2.997 à vista</p>

          <p className="text-white/15 text-xs leading-relaxed max-w-sm mx-auto">
            Turma com vagas limitadas por ciclo. Sem countdown fake. As vagas são reais.
          </p>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════
          10. CTA FINAL
      ══════════════════════════════════════ */}
      <section className="relative py-40 md:py-56 px-6">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="w-[500px] h-[500px] rounded-full bg-[#C6A96B]/[0.03] blur-[100px]"
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.45, 0.2] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.div
          {...slowFade}
          className="relative z-10 max-w-2xl mx-auto text-center"
        >
          <p className="font-display text-xl md:text-2xl text-white/40 italic leading-relaxed mb-16">
            Você não entra para aprender sobre o feminino.
            <br />
            Você entra para aprender a sustentá-lo.
          </p>

          <Button
            size="lg"
            onClick={() => navigate('/planos')}
            className="bg-[#C6A96B] text-[#0A0A0A] hover:bg-[#C6A96B]/90 hover:scale-[1.02] transition-all duration-500 shadow-[0_0_80px_-15px_rgba(198,169,107,0.35)] hover:shadow-[0_0_100px_-15px_rgba(198,169,107,0.5)] px-16 py-8 text-base font-display tracking-[0.2em] uppercase font-semibold"
          >
            Entrar na Formação
            <ArrowRight className="w-5 h-5 ml-3" />
          </Button>

          <p className="text-white/12 text-xs mt-14 tracking-widest uppercase">
            Vagas limitadas por ciclo
          </p>
        </motion.div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="py-16 px-6 border-t border-white/[0.04]">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] text-white/15 leading-relaxed tracking-wider">
            A Casa Orácula não substitui terapia, acompanhamento psicológico ou tratamento clínico quando necessário.
          </p>
        </div>
      </footer>
    </div>
  );
}
