import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Compass, Layers, Shield } from "lucide-react";

import mentoriaBanner from "@/assets/formacao/mentoria-banner-horizontal.png";
import fundoRetrato01 from "@/assets/formacao/fundo-retrato-01.png";
import fundoParaQuemE from "@/assets/formacao/fundo-para-quem-e.png";
import retratoFinal from "@/assets/formacao/retrato-final.png";

const fade = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const Divider = () => (
  <div className="w-full flex justify-center py-6">
    <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#C6A96B]/25 to-transparent" />
  </div>
);

export default function OraculaSalesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white overflow-x-hidden selection:bg-[#C6A96B]/20">

      {/* ═══════════════════════════════════════════
          1. HERO — Headline + VSL + CTA
      ═══════════════════════════════════════════ */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden">
        <img
          src={mentoriaBanner}
          alt="Formação Orácula"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/75 to-[#0D0D0D]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-center max-w-3xl"
        >
          <p className="text-[#C6A96B]/50 text-[10px] md:text-xs uppercase tracking-[0.5em] mb-10 font-medium">
            Formação Orácula
          </p>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-[1.2] tracking-wide mb-8">
            Existe uma mulher que já entendeu tudo…
            <br />
            <span className="text-[#C6A96B]">e ainda não conseguiu mudar.</span>
          </h1>

          <p className="text-white/40 text-lg md:text-xl max-w-xl mx-auto mb-14 font-display italic leading-relaxed">
            Ela já leu, já chorou, já fez terapia.
            <br />
            Mas ninguém leu o campo em que ela está.
          </p>

          <Button
            size="lg"
            onClick={() => navigate('/planos')}
            className="bg-transparent border-2 border-[#C6A96B]/40 text-white hover:bg-[#C6A96B]/10 hover:border-[#C6A96B]/70 px-10 py-7 text-base font-display tracking-wider transition-all duration-500"
          >
            Entrar na Formação
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </section>

      {/* VSL */}
      <section className="py-16 md:py-20 px-6">
        <motion.div {...fade} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto">
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#C6A96B]/15 bg-white/[0.02]">
            <iframe
              src=""
              title="Vídeo da Formação Orácula"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
            <div className="absolute inset-0 flex items-center justify-center text-white/20">
              <p className="text-sm font-display tracking-widest">Insira a URL do vídeo</p>
            </div>
          </div>
        </motion.div>
      </section>

      <Divider />

      {/* ═══════════════════════════════════════════
          2. BLOCO ISADORA — KI + SHO
          Narrativa progressiva, frases curtas, leitura vertical
      ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-2xl mx-auto space-y-10">
          {[
            { text: "Ela chegou no consultório com um sorriso cuidado.", delay: 0 },
            { text: "Disse que estava bem. Que já tinha superado.", delay: 0.1 },
            { text: "Mas o corpo tremia.", delay: 0.2 },
            { text: "E a história que ela contava sobre si mesma já não sustentava mais o peso do que vivia.", delay: 0.35 },
          ].map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: line.delay }}
              className={`font-display text-lg md:text-xl leading-relaxed ${
                i < 3 ? 'text-white/50' : 'text-white/70'
              }`}
            >
              {line.text}
            </motion.p>
          ))}

          <motion.div {...fade} transition={{ duration: 0.6, delay: 0.5 }} className="pt-6">
            <p className="text-white/30 text-sm leading-relaxed">
              Você ouviu com atenção. Ofereceu presença. Talvez tenha sugerido um exercício, um conto, uma reflexão.
            </p>
          </motion.div>

          <motion.div {...fade} transition={{ duration: 0.6, delay: 0.6 }} className="pt-4">
            <p className="text-white/30 text-sm leading-relaxed">
              Mas quando ela saiu, ficou a pergunta:
            </p>
          </motion.div>

          <motion.p
            {...fade}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="font-display text-xl md:text-2xl text-[#C6A96B]/80 italic pt-4"
          >
            "Eu estava sustentando… ou apenas acompanhando?"
          </motion.p>
        </div>
      </section>

      <Divider />

      {/* ═══════════════════════════════════════════
          3. BLOCO VIRADA — TEN
          Fundo diferenciado, frase de impacto
      ═══════════════════════════════════════════ */}
      <section className="relative py-24 md:py-36 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D] via-[#111518] to-[#0D0D0D]" />

        <motion.div
          {...fade}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <p className="text-[#C6A96B]/40 text-xs uppercase tracking-[0.4em] mb-12">
            O ponto cego
          </p>

          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-[1.25] tracking-wide mb-10">
            Você está conduzindo
            <br />
            <span className="text-[#C6A96B]">sem saber em que história essa mulher está.</span>
          </h2>

          <div className="w-16 h-px bg-[#C6A96B]/20 mx-auto mb-10" />

          <p className="text-white/40 text-lg leading-relaxed max-w-xl mx-auto font-display">
            Sem mapa, toda escuta vira intuição solta.
            <br />
            E toda intuição solta vira risco.
          </p>
        </motion.div>
      </section>

      <Divider />

      {/* ═══════════════════════════════════════════
          4. BLOCO MÉTODO — KETSU
          Portas, Campos, Torres — sem cards genéricos
      ═══════════════════════════════════════════ */}
      <section className="py-24 md:py-36 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fade} transition={{ duration: 0.8 }} className="text-center mb-20">
            <p className="text-[#C6A96B]/40 text-xs uppercase tracking-[0.4em] mb-6">
              O Método da CidaDELA
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-white tracking-wide mb-6">
              Um mapa da psique feminina.
              <br />
              <span className="text-[#C6A96B]">Não um conjunto de técnicas.</span>
            </h2>
            <p className="text-white/35 max-w-lg mx-auto leading-relaxed">
              O Método Oracular opera em três planos distintos. Cada um revela uma camada do campo psíquico — e exige uma postura diferente da facilitadora.
            </p>
          </motion.div>

          <div className="space-y-16">
            {[
              {
                icon: Compass,
                title: "Portas Psíquicas",
                subtitle: "Onde a psique está agora",
                body: "Não descrevem quem a mulher é — mas em que limiar ela se encontra. Cada Porta exige uma leitura específica. Entrar na Porta errada é violência simbólica.",
              },
              {
                icon: Layers,
                title: "Campos Psíquicos",
                subtitle: "O clima que atravessa a Porta",
                body: "Informam a postura da facilitadora: o que sustentar, o que não acelerar, o que não tocar. O Campo é o que diferencia leitura de projeção.",
              },
              {
                icon: Shield,
                title: "Torres de Sobrevivência",
                subtitle: "O que manteve a psique de pé",
                body: "Estruturas erguidas quando não havia chão. Não são defeitos. São reconhecidas — e eventualmente renegociadas. Nunca arrancadas.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-start"
              >
                <div className="w-12 h-12 rounded-xl bg-[#C6A96B]/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-[#C6A96B]/60" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-display text-xl text-white mb-1">{item.title}</h3>
                  <p className="text-[#C6A96B]/50 text-sm mb-3 italic">{item.subtitle}</p>
                  <p className="text-white/40 leading-relaxed">{item.body}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            {...fade}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 border border-[#C6A96B]/15 rounded-2xl p-8 md:p-10 bg-white/[0.02] text-center"
          >
            <p className="text-white/50 text-lg font-display leading-relaxed">
              No Método Oracular, a pergunta nunca é <em className="text-white/70">"Quem você é?"</em>
            </p>
            <p className="text-[#C6A96B] text-lg font-display mt-2">
              A pergunta é: "Em que campo você está agora?"
            </p>
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* ═══════════════════════════════════════════
          5. BLOCO POSICIONAMENTO
      ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6">
        <motion.div
          {...fade}
          transition={{ duration: 1 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-white leading-[1.3] tracking-wide mb-8">
            A Casa Orácula não forma terapeutas.
            <br />
            <span className="text-[#C6A96B]">Forma leitoras de campo.</span>
          </h2>

          <p className="text-white/35 text-lg leading-relaxed max-w-xl mx-auto">
            Mulheres que sabem quando falar, quando silenciar, quando sustentar — e quando retirar a própria mão.
          </p>
        </motion.div>
      </section>

      <Divider />

      {/* ═══════════════════════════════════════════
          6. BLOCO ESTRUTURA
          Duração, mentoria, prática, app
      ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fade} transition={{ duration: 0.8 }} className="text-center mb-14">
            <p className="text-[#C6A96B]/40 text-xs uppercase tracking-[0.4em] mb-4">
              O que acontece dentro
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-white tracking-wide">
              Estrutura da Formação
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { label: "Duração", value: "1 ano de travessia" },
              { label: "Mentoria", value: "Direção de campo contínua" },
              { label: "Prática", value: "Aplicação supervisionada" },
              { label: "App integrado", value: "Ferramentas, mapas e registros" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="border border-white/8 rounded-xl p-6 bg-white/[0.015]"
              >
                <p className="text-[#C6A96B]/60 text-xs uppercase tracking-widest mb-2">{item.label}</p>
                <p className="text-white/60 font-display text-lg">{item.value}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fade} transition={{ duration: 0.6, delay: 0.4 }} className="mt-12 text-center">
            <p className="text-white/30 text-sm leading-relaxed max-w-lg mx-auto">
              Travessias pessoais + portais de estudo + narroterapia oracular + clube oracular como sistema de leitura como intervenção psíquica guiada.
            </p>
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* ═══════════════════════════════════════════
          7. BLOCO FILTRO — Para quem é / não é
      ═══════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 px-6 overflow-hidden">
        <img src={fundoParaQuemE} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-[0.1]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D] via-[#0D0D0D]/80 to-[#0D0D0D]" />

        <motion.div {...fade} transition={{ duration: 0.8 }} className="relative z-10 max-w-3xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-[#C6A96B]/15 rounded-2xl p-8 md:p-10 bg-white/[0.02]">
              <h3 className="font-display text-xl text-[#C6A96B] mb-6">Para quem é</h3>
              <ul className="space-y-4 text-white/55 text-sm">
                {["Terapeutas", "Psicólogas", "Mentoras do feminino", "Mulheres em transição para atuação profissional"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C6A96B]/50" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-[#C6A96B]/40 italic text-xs mt-6 font-display">
                Indicado para quem deseja conduzir outras mulheres com método.
              </p>
            </div>

            <div className="border border-white/8 rounded-2xl p-8 md:p-10 bg-white/[0.01]">
              <h3 className="font-display text-xl text-white/25 mb-6">Para quem não é</h3>
              <ul className="space-y-4 text-white/25 text-sm">
                {[
                  "Busca atalhos e certificações rápidas",
                  "Confunde espiritualidade com ausência de limite",
                  "Não deseja ser atravessada antes de conduzir",
                  "Quer aplicar técnicas sem sustentar campo",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      <Divider />

      {/* ═══════════════════════════════════════════
          8. BLOCO OFERTA
          Valor + escassez real
      ═══════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-6">
        <motion.div {...fade} transition={{ duration: 0.8 }} className="max-w-2xl mx-auto text-center">
          <p className="text-[#C6A96B]/40 text-xs uppercase tracking-[0.4em] mb-6">
            Investimento
          </p>

          <h2 className="font-display text-3xl md:text-4xl text-white tracking-wide mb-8">
            Formação Orácula
          </h2>

          <div className="border border-[#C6A96B]/20 rounded-2xl p-8 md:p-12 bg-white/[0.02] mb-10">
            <p className="text-white/40 text-sm mb-4">Turma com vagas limitadas por ciclo.</p>
            <p className="font-display text-4xl md:text-5xl text-[#C6A96B] mb-4">
              12x de R$ 297
            </p>
            <p className="text-white/30 text-sm">ou R$ 2.997 à vista</p>
          </div>

          <p className="text-white/30 text-sm leading-relaxed max-w-md mx-auto">
            As vagas são reais. Cada turma tem limite de alunas para garantir acompanhamento individual e qualidade de campo.
          </p>
        </motion.div>
      </section>

      <Divider />

      {/* ═══════════════════════════════════════════
          9. CTA FINAL GRANDE
      ═══════════════════════════════════════════ */}
      <section className="relative py-32 md:py-44 px-6 overflow-hidden">
        <img src={fundoRetrato01} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-[0.12] object-top" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D] via-[#0D0D0D]/70 to-[#0D0D0D]" />

        <motion.div
          {...fade}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-2xl mx-auto text-center"
        >
          <p className="text-[#C6A96B] italic text-2xl md:text-3xl font-display leading-[1.4] mb-16">
            Você não entra para aprender sobre o feminino.
            <br />
            Você entra para aprender a sustentá-lo.
          </p>

          <div className="relative inline-block">
            <motion.div
              className="absolute inset-0 rounded-xl bg-[#C6A96B]/15 blur-2xl -z-10"
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <Button
              size="lg"
              onClick={() => navigate('/planos')}
              className="relative bg-gradient-to-r from-[#C6A96B] to-[#A68B4B] text-[#0D0D0D] border border-[#C6A96B]/30 hover:scale-105 transition-all duration-500 shadow-[0_0_60px_-10px_rgba(198,169,107,0.4)] hover:shadow-[0_0_80px_-10px_rgba(198,169,107,0.5)] px-14 py-8 text-lg font-display tracking-wider font-semibold"
            >
              Entrar na Formação
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <p className="text-white/20 text-sm mt-12">
            Vagas limitadas por ciclo.
          </p>
        </motion.div>
      </section>

      {/* ═══ IMAGEM FINAL ═══ */}
      <section className="w-full flex justify-center py-8">
        <img src={retratoFinal} alt="Casa Orácula" className="w-full max-w-md md:max-w-lg object-contain opacity-30 grayscale" />
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-14 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs text-white/20 leading-relaxed">
            A Casa Orácula não substitui terapia, acompanhamento psicológico ou tratamento clínico quando necessário.
          </p>
        </div>
      </footer>
    </div>
  );
}
