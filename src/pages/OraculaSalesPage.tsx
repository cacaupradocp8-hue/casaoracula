import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, BookOpen, Users, Star, CheckCircle2 } from "lucide-react";

// Imagens
import mentoriaBanner from "@/assets/formacao/mentoria-banner-horizontal.png";
import eticaSustentacao from "@/assets/formacao/etica-sustentacao.png";
import finalPagina from "@/assets/formacao/final-pagina.png";
import fundoNarroterapia from "@/assets/formacao/fundo-narroterapia.png";
import fundoParaQuemE from "@/assets/formacao/fundo-para-quem-e.png";
import fundoRitual2 from "@/assets/formacao/fundo-ritual-2.png";
import fundoRetrato01 from "@/assets/formacao/fundo-retrato-01.png";
import retratoFinal from "@/assets/formacao/retrato-final.png";

/**
 * OraculaSalesPage — Página de Apresentação da Formação Orácula
 * Layout: Luxo ritualístico, cinematográfico, high-ticket
 */
export default function OraculaSalesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-foreground overflow-x-hidden selection:bg-gold/20">
      
      {/* ═══ HERO — BANNER IMAGEM ═══ */}
      <section className="relative w-full">
        <div className="relative w-full overflow-hidden">
          <img
            src={mentoriaBanner}
            alt="Casa Orácula — Formação Iniciática em Terapia Arquetípica"
            className="w-full h-auto block"
          />
          {/* Bottom fade — only covers the very bottom edge */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent" />
        </div>
      </section>

      {/* ═══ SEÇÃO DE VÍDEO ═══ */}
      <section className="py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-gold/15 shadow-[0_0_60px_-20px_hsl(var(--gold)/0.1)] bg-card/10">
            <iframe
              src=""
              title="Vídeo da Formação Orácula"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground/30">
              <p className="text-sm">Insira a URL do vídeo</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══ BLOCO 2 — TÍTULO + INTRODUÇÃO ═══ */}
      <section className="relative py-16 md:py-20 px-6">
        {/* Ambient mist */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] rounded-full bg-gold/[0.03] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] rounded-full bg-primary/[0.02] blur-[100px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <p className="text-gold/60 uppercase tracking-[0.4em] text-xs mb-8 font-medium">
            Casa Orácula apresenta
          </p>
          
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl text-foreground tracking-wide leading-[1.2] mb-8">
            Formação Iniciática em{" "}
            <span className="text-gold">Terapia Arquetípica</span>{" "}
            e Narroterapia Oracular
          </h1>
          
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto mb-8" />
          
          <p className="text-foreground/60 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Certificação em Condução Simbólica, Método e Ética do Feminino
          </p>
        </motion.div>
      </section>

      {/* ═══ BLOCO 2.1 — O PROBLEMA REAL ═══ */}
      <section className="relative py-16 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/30 to-transparent" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-2xl mx-auto"
        >
          {/* Glassmorphism card */}
          <div className="backdrop-blur-sm bg-card/40 border border-border/20 rounded-2xl p-10 md:p-14">
            <h2 className="font-display text-2xl md:text-4xl text-foreground mb-10 text-center leading-snug">
              Você não precisa de mais técnicas.<br />
              <span className="text-gold">Precisa de critério.</span>
            </h2>
            
            <p className="text-foreground/50 mb-6 text-center text-sm uppercase tracking-widest">
              Muitas mulheres conduzem outras mulheres com
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {["sensibilidade", "intuição", "símbolos", "histórias"].map((item) => (
                <span key={item} className="px-4 py-2 rounded-full border border-gold/20 text-foreground/70 text-sm bg-gold/[0.03]">
                  {item}
                </span>
              ))}
            </div>
            
            <p className="text-foreground/40 text-center mb-6 text-sm">
              Mas sem método, isso vira:
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {["confusão", "dependência", "excesso", "invasão silenciosa"].map((item) => (
                <span key={item} className="text-foreground/30 text-sm px-3 py-1 border border-border/10 rounded-full">
                  {item}
                </span>
              ))}
            </div>
            
            <div className="w-16 h-px bg-gold/30 mx-auto mb-8" />
            
            <p className="text-gold/80 italic text-lg text-center font-display">
              A Formação ORÁCULA nasce para organizar o campo.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ═══ BLOCO 3 — AVISO HONESTO (FILTRO) ═══ */}
      <section className="relative py-16 px-6 overflow-hidden">
        {/* Background image */}
        <img src={fundoRetrato01} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-[0.12]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-2xl mx-auto text-center"
        >
          <Shield className="w-8 h-8 text-gold/40 mx-auto mb-6" />
          
          <h2 className="font-display text-2xl md:text-3xl text-gold mb-10">
            Antes de entrar, um aviso claro.
          </h2>
          
          <p className="text-foreground/50 mb-8 text-sm uppercase tracking-widest">
            Se você procura:
          </p>
          
          <div className="space-y-3 mb-10">
            {["técnicas rápidas", "certificações vazias", "espiritualidade performática", "atalhos para 'atender mais'"].map((item) => (
              <p key={item} className="text-foreground/40 text-lg">{item}</p>
            ))}
          </div>
          
          <p className="text-gold/80 italic text-xl mb-10 font-display">
            esta formação não é para você.
          </p>
          
          <div className="w-16 h-px bg-gold/20 mx-auto mb-10" />
          
          <p className="text-foreground/60 leading-relaxed text-lg">
            A ORÁCULA forma mulheres que sustentam processos humanos<br />
            com leitura simbólica, presença e responsabilidade psíquica.
          </p>
        </motion.div>
      </section>

      {/* ═══ BLOCO 5 — O QUE É A FORMAÇÃO ═══ */}
      <section className="relative py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.02] to-transparent" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <div className="text-center mb-14">
            <Sparkles className="w-8 h-8 text-gold/40 mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-4xl text-gold mb-6">
              O que é a Formação ORÁCULA
            </h2>
            <p className="text-foreground/50 text-lg">
              A Formação ORÁCULA não é um curso rápido.
            </p>
          </div>
          
          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {[
              { label: "Um percurso de autorização progressiva", icon: "🌱" },
              { label: "Um método simbólico estruturado", icon: "🔮" },
              { label: "Uma formação ética para quem guia", icon: "🛡️" },
            ].map((item) => (
              <div
                key={item.label}
                className="backdrop-blur-sm bg-card/30 border border-border/20 rounded-xl p-8 text-center hover:border-gold/20 transition-colors duration-500"
              >
                <span className="text-3xl mb-4 block">{item.icon}</span>
                <p className="text-foreground/70 text-sm leading-relaxed">{item.label}</p>
              </div>
            ))}
          </div>

          <p className="text-gold/70 text-center mb-8 text-sm uppercase tracking-widest">Aqui, você aprende:</p>
          
          <div className="flex flex-wrap justify-center gap-6 text-foreground/60 mb-14">
            {["quando conduzir", "quando silenciar", "quando sustentar", "quando encerrar"].map((item, i) => (
              <span key={item} className="flex items-center gap-3">
                {i > 0 && <span className="w-1.5 h-1.5 rounded-full bg-gold/30" />}
                {item}
              </span>
            ))}
          </div>
          
          {/* Card principal */}
          <div className="backdrop-blur-sm bg-card/40 border border-gold/20 rounded-2xl p-10 md:p-14 shadow-[0_0_60px_-20px_hsl(var(--gold)/0.1)]">
            <h3 className="font-display text-2xl text-gold text-center mb-8">
              🏛️ FORMAÇÃO ORÁCULA
            </h3>
            
            <p className="text-foreground/50 text-center mb-10 max-w-lg mx-auto">
              Formação iniciática e profissional para mulheres que conduzem processos humanos com símbolos e narrativa
            </p>
            
            <div className="grid md:grid-cols-2 gap-x-10 gap-y-5 mb-10">
              {[
                "Metodologia própria ORÁCULA, estruturada em Portas, Torres e Travessias",
                "Leitura oracular e arquetípica com critérios éticos claros",
                "Travessias vividas antes do método — ninguém aplica o que não sustentou",
                "Mentoria contínua para direção de campo, ritmo e limite",
                "Ferramentas exclusivas integradas ao App",
                "Formação para atendimentos individuais e grupos",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="text-gold/50 mt-1 shrink-0">✦</span>
                  <span className="text-foreground/60 text-sm leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-8 border-t border-gold/10 text-center">
              <p className="text-gold/60 italic font-display text-lg">
                Não é um método para aplicar.<br />
                É um lugar para sustentar.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══ NÍVEIS DA FORMAÇÃO ═══ */}
      <section className="py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl text-gold mb-4">
              Os Níveis da Formação
            </h2>
            <p className="text-foreground/50">
              A Formação acontece por níveis, não por pressa.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: "🌱", name: "Iniciada", desc: "presença e contenção" },
              { icon: "🌒", name: "Praticante", desc: "estrutura e linguagem" },
              { icon: "🔥", name: "Condutora", desc: "decisão e travessia" },
              { icon: "🌌", name: "Guia de Grupos", desc: "campo coletivo" },
              { icon: "🧝🏽‍♀️", name: "Formadora", desc: "transmissão e linhagem" },
            ].map((level) => (
              <div
                key={level.name}
                className="backdrop-blur-sm bg-card/30 border border-border/20 rounded-xl p-6 text-center hover:border-gold/20 transition-all duration-500 group"
              >
                <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform duration-300">{level.icon}</span>
                <h3 className="font-display text-sm text-foreground mb-1">{level.name}</h3>
                <p className="text-foreground/40 text-xs">{level.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-foreground/40 text-sm mb-4">Cada nível exige:</p>
            <div className="flex justify-center gap-6 text-foreground/50 text-sm mb-6">
              <span>prática</span>
              <span>evidência</span>
              <span>revisão</span>
            </div>
            <p className="text-gold/60 italic font-display">
              Não se avança por tempo. Avança-se por maturidade.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ═══ COMO A FORMAÇÃO FUNCIONA ═══ */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/20 to-transparent" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-5xl mx-auto"
        >
          <div className="text-center mb-14">
            <BookOpen className="w-8 h-8 text-gold/40 mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-4xl text-gold mb-4">
              Como a Formação Funciona
            </h2>
            <p className="text-foreground/50">
              A ORÁCULA se estrutura em dois movimentos inseparáveis:
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Travessias */}
            <div className="backdrop-blur-sm bg-card/40 border border-gold/15 rounded-2xl p-10 hover:shadow-[0_0_40px_-15px_hsl(var(--gold)/0.1)] transition-shadow duration-700">
              <h3 className="font-display text-2xl text-gold mb-6">TRAVESSIAS</h3>
              <p className="text-foreground/50 italic mb-8 text-sm">
                O mergulho na própria psique da facilitadora.
              </p>
              <ul className="space-y-3 text-foreground/50 text-sm">
                <li className="flex items-start gap-3"><span className="text-gold/40">✦</span> atravessa o método em si mesma</li>
                <li className="flex items-start gap-3"><span className="text-gold/40">✦</span> constrói seu Mapa Vivo</li>
                <li className="flex items-start gap-3"><span className="text-gold/40">✦</span> reconhece limites, defesas e potências</li>
                <li className="flex items-start gap-3"><span className="text-gold/40">✦</span> integra corpo, símbolo e presença</li>
              </ul>
              <div className="mt-8 pt-6 border-t border-gold/10">
                <p className="text-gold/50 italic text-sm">Nada é aplicado sem antes ser vivido.</p>
              </div>
            </div>
            
            {/* Portais */}
            <div className="backdrop-blur-sm bg-card/40 border border-gold/15 rounded-2xl p-10 hover:shadow-[0_0_40px_-15px_hsl(var(--gold)/0.1)] transition-shadow duration-700">
              <h3 className="font-display text-2xl text-gold mb-6">PORTAIS</h3>
              <p className="text-foreground/50 italic mb-8 text-sm">
                O espaço do aprendizado estruturado.
              </p>
              <ul className="space-y-3 text-foreground/50 text-sm">
                <li className="flex items-start gap-3"><span className="text-gold/40">✦</span> fundamentos teóricos e simbólicos</li>
                <li className="flex items-start gap-3"><span className="text-gold/40">✦</span> aulas didáticas</li>
                <li className="flex items-start gap-3"><span className="text-gold/40">✦</span> registros orientados</li>
                <li className="flex items-start gap-3"><span className="text-gold/40">✦</span> exercícios de leitura e condução</li>
                <li className="flex items-start gap-3"><span className="text-gold/40">✦</span> integração ética do método</li>
              </ul>
              <div className="mt-8 pt-6 border-t border-gold/10">
                <p className="text-gold/50 italic text-sm">Aqui você aprende como sustentar outras mulheres<br />sem colapsar nem criar dependência.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══ AS TRAVESSIAS ═══ */}
      <section className="py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="font-display text-3xl md:text-4xl text-gold mb-14 text-center">
            As Travessias da Formação
          </h2>
          
          <div className="space-y-6">
            {[
              {
                num: "I",
                title: "A Jornada Ritual da Heroína",
                desc: "As 14 Portas da Psique Feminina. A base iniciática da formação e a criação do seu Mapa Pessoal.",
              },
              {
                num: "II",
                title: "Neuroplasticidade & Competências do Ego",
                desc: "O corpo que sustenta o símbolo. Aqui você aprende quando não conduzir.",
              },
              {
                num: "III",
                title: "Mito Pessoal & Linguagem Arquetípica",
                desc: "A história que te atravessa e posiciona. Sem romantização. Sem projeção.",
              },
              {
                num: "IV",
                title: "A Guardiã da Leitura",
                desc: "A passagem da vivência pessoal para a condução ética. A facilitadora nasce quando sabe não agir.",
              },
            ].map((t, i) => (
              <motion.div
                key={t.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex gap-6 items-start backdrop-blur-sm bg-card/20 border border-border/15 rounded-xl p-6 hover:border-gold/20 transition-colors duration-500"
              >
                <span className="font-display text-3xl text-gold/30 shrink-0 w-12 text-right">{t.num}</span>
                <div>
                  <h3 className="font-display text-lg text-foreground mb-2">
                    Travessia {t.num} — {t.title}
                  </h3>
                  <p className="text-foreground/50 text-sm leading-relaxed">{t.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══ NARROTERAPIA ═══ */}
      <section className="relative py-20 px-6 overflow-hidden">
        <img 
          src={fundoNarroterapia} 
          alt="" 
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.15]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <h2 className="font-display text-3xl md:text-4xl text-gold mb-10">
            Portal da Narroterapia Oracular
          </h2>
          
          <p className="text-foreground/60 leading-relaxed text-lg mb-12">
            A Narroterapia Oracular não é contar histórias.<br />
            <span className="text-gold/70">É ler a psique através delas.</span>
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-12">
            {[
              "escuta narrativa profunda",
              "uso terapêutico de contos e mitos",
              "condução simbólica sem sugestão",
              "criação de ritos narrativos seguros",
            ].map((item) => (
              <div key={item} className="backdrop-blur-sm bg-card/30 border border-border/15 rounded-lg p-4 text-foreground/50 text-sm">
                {item}
              </div>
            ))}
          </div>
          
          <p className="text-gold/60 italic font-display text-lg">
            Aqui a história deixa de ser metáfora<br />
            e se torna instrumento clínico simbólico.
          </p>
        </motion.div>
      </section>

      {/* ═══ FERRAMENTAS DA CASA ═══ */}
      <section className="py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-14">
            <Star className="w-8 h-8 text-gold/40 mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-4xl text-gold mb-4">
              As Ferramentas da Casa
            </h2>
            <p className="text-foreground/50">
              Ao entrar na Formação ORÁCULA, você acessa um App exclusivo com:
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "Mapa Vivo da Heroína",
              "Jardim da Psique",
              "Oráculo das Portas",
              "Biblioteca Narrativa",
              "Checklists de condução",
              "Prompts da Sibila por Portal",
            ].map((tool) => (
              <div
                key={tool}
                className="backdrop-blur-sm bg-card/30 border border-border/20 rounded-xl p-6 text-center hover:border-gold/20 transition-colors duration-500"
              >
                <p className="text-foreground/60 text-sm">{tool}</p>
              </div>
            ))}
          </div>
          
          <p className="text-gold/60 text-center italic mt-10 font-display">
            Tudo criado para não depender de improviso.
          </p>
        </motion.div>
      </section>

      {/* ═══ ÉTICA E SUSTENTAÇÃO ═══ */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Shield className="w-8 h-8 text-gold/40 mb-6" />
            <h2 className="font-display text-3xl md:text-4xl text-gold mb-8">
              Ética e Sustentação
            </h2>
            
            <p className="text-foreground/60 text-lg leading-relaxed mb-8">
              A ORÁCULA não certifica presença.<br />
              <span className="text-gold/70">Certifica integração.</span>
            </p>
            
            <ul className="space-y-3 text-foreground/50 mb-8">
              {[
                "critérios claros de passagem",
                "termos éticos desde o onboarding",
                "leitura humana do processo",
                "limite de atuação profissional",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                  {item}
                </li>
              ))}
            </ul>
            
            <p className="text-gold/60 italic font-display text-lg">
              Formar presença é coisa séria.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img 
              src={eticaSustentacao} 
              alt="Ética e Sustentação" 
              className="rounded-2xl shadow-[0_0_60px_-20px_hsl(var(--gold)/0.15)] w-full object-cover border border-border/10"
            />
          </motion.div>
        </div>
      </section>

      {/* ═══ PARA QUEM É / PARA QUEM NÃO É ═══ */}
      <section className="relative py-20 px-6 overflow-hidden">
        <img 
          src={fundoParaQuemE} 
          alt="" 
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.12]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-10">
            {/* Para quem é */}
            <div className="backdrop-blur-sm bg-card/40 border border-gold/15 rounded-2xl p-10">
              <Users className="w-7 h-7 text-gold/40 mb-4" />
              <h2 className="font-display text-2xl text-gold mb-8">Para quem é</h2>
              
              <ul className="space-y-3 text-foreground/60 mb-8">
                {["terapeutas", "psicólogas", "mentoras do feminino", "facilitadoras de grupos"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                    {item}
                  </li>
                ))}
              </ul>
              
              <p className="text-foreground/40 italic text-sm">
                que já estudaram muito<br />
                mas sentem que falta eixo, estrutura e autoridade interna.
              </p>
            </div>

            {/* Para quem não é */}
            <div className="backdrop-blur-sm bg-card/20 border border-border/15 rounded-2xl p-10">
              <h2 className="font-display text-2xl text-foreground/30 mb-8">Para quem não é</h2>
              
              <ul className="space-y-3 text-foreground/30">
                {[
                  "busca atalhos",
                  "copia métodos",
                  "confunde espiritualidade com ausência de limite",
                  "não deseja ser atravessada",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/15" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══ O QUE VOCÊ RECEBE ═══ */}
      <section className="py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-12">
            <CheckCircle2 className="w-8 h-8 text-gold/40 mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-4xl text-gold">
              O que você recebe
            </h2>
          </div>
          
          <div className="space-y-4">
            {[
              "acesso completo à formação",
              "travessias e aulas estruturadas",
              "checklists de autorização",
              "supervisão e revisão",
              "certificação por nível",
              "acesso integrado ao sistema Casa Orácula",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 backdrop-blur-sm bg-card/20 border border-border/15 rounded-xl px-6 py-4 hover:border-gold/20 transition-colors duration-300"
              >
                <CheckCircle2 className="w-5 h-5 text-gold/60 shrink-0" />
                <span className="text-foreground/70">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══ ENCERRAMENTO ═══ */}
      <section className="relative py-20 px-6 overflow-hidden">
        <img 
          src={fundoRetrato01} 
          alt="" 
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.15] object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-2xl mx-auto text-center"
        >
          <p className="text-foreground/60 leading-relaxed text-lg mb-8">
            A Casa Orácula não promete resultados rápidos.<br />
            Ela oferece lugar.
          </p>
          
          <p className="text-foreground/50 mb-10 text-lg">
            Lugar interno.<br />
            Lugar simbólico.<br />
            Lugar profissional.
          </p>
          
          <p className="text-gold italic text-xl font-display mb-14">
            Você não entra para aprender.<br />
            Você entra para atravessar.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline"
              size="lg"
              onClick={() => navigate('/auth')}
              className="border-border/30 hover:border-gold/30 text-foreground/70 hover:text-foreground"
            >
              Entrar
            </Button>
            <Button 
              size="lg"
              onClick={() => navigate('/planos')}
              className="bg-gold text-background hover:bg-gold/90 shadow-[0_0_30px_-8px_hsl(var(--gold)/0.3)]"
            >
              Ver Planos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ═══ IMAGEM FINAL ═══ */}
      <section className="w-full flex justify-center py-8">
        <img 
          src={retratoFinal} 
          alt="Casa Orácula" 
          className="w-full max-w-md md:max-w-lg object-contain opacity-80 grayscale"
        />
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-12 px-6 border-t border-border/10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs text-muted-foreground/40 leading-relaxed">
            🔒 A Casa Orácula não substitui terapia, acompanhamento psicológico 
            ou tratamento clínico quando necessário.
          </p>
        </div>
      </footer>
    </div>
  );
}
