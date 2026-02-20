import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { VideoCard } from "@/components/sales/VideoCard";

// Imagens fornecidas pelo usuário
import mentoriaBanner from "@/assets/formacao/mentoria-banner-horizontal.png";
import eticaSustentacao from "@/assets/formacao/etica-sustentacao.png";
import finalPagina from "@/assets/formacao/final-pagina.png";
import fundoRitual2 from "@/assets/formacao/fundo-ritual-2.png";
import fundoNarroterapia from "@/assets/formacao/fundo-narroterapia.png";
import fundoParaQuemE from "@/assets/formacao/fundo-para-quem-e.png";

// Imagens geradas (arquetípicas)
import travessiasSection from "@/assets/formacao/travessias-section.jpg";
import ferramentasSection from "@/assets/formacao/ferramentas-section.jpg";

/**
 * OraculaSalesPage — Página de Apresentação da Formação Orácula
 * Layout: alto padrão, luxuoso, cinematográfico
 * 
 * ESTRUTURA COM 3 VÍDEO-CARDS OBRIGATÓRIOS:
 * 1. Hero → Vídeo 1 → Filtro → Vídeo 2 → Ferramentas → Vídeo 3 → Fechamento
 */
export default function OraculaSalesPage() {
  const navigate = useNavigate();

  const VIDEO_1_URL = "https://www.youtube.com/watch?v=PLACEHOLDER_1";
  const VIDEO_2_URL = "https://www.youtube.com/watch?v=PLACEHOLDER_2";
  const VIDEO_3_URL = "https://www.youtube.com/watch?v=PLACEHOLDER_3";

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20">
      
      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 1 — HERO IMAGE BANNER (APRESENTAÇÃO DA FORMAÇÃO)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden">
        <div className="relative w-full">
          <img
            src={mentoriaBanner}
            alt="Casa Orácula — Formação Iniciática em Terapia Arquetípica"
            className="w-full h-auto block"
          />
          {/* Fade inferior suave para integrar com a página */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 2 — TÍTULO E INTRODUÇÃO
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-primary/70 uppercase tracking-[0.3em] text-sm mb-8">
            Casa Orácula
          </p>
          
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground tracking-wide leading-tight mb-8">
            Formação Iniciática em Terapia Arquetípica e Narroterapia Oracular
          </h1>
          
          <p className="text-primary/80 text-lg md:text-xl">
            Certificação em Condução Simbólica, Método e Ética do Feminino
          </p>
        </motion.div>
      </section>

      {/* Divider elegante */}
      <div className="flex items-center justify-center py-4">
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 2.1 — O PROBLEMA REAL
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-10 leading-relaxed">
            Você não precisa de mais técnicas.<br />
            <span className="text-primary">Precisa de critério.</span>
          </h2>
          
          <p className="text-muted-foreground mb-8">
            Muitas mulheres conduzem outras mulheres com:
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-10 text-foreground/80">
            <span>sensibilidade</span>
            <span className="text-primary/40">•</span>
            <span>intuição</span>
            <span className="text-primary/40">•</span>
            <span>símbolos</span>
            <span className="text-primary/40">•</span>
            <span>histórias</span>
          </div>
          
          <p className="text-muted-foreground mb-8">
            Mas sem método, isso vira:
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12 text-foreground/50">
            <span>confusão</span>
            <span className="text-foreground/30">•</span>
            <span>dependência</span>
            <span className="text-foreground/30">•</span>
            <span>excesso</span>
            <span className="text-foreground/30">•</span>
            <span>ou invasão silenciosa</span>
          </div>
          
          <p className="text-primary italic text-lg md:text-xl font-display">
            A Formação ORÁCULA nasce para organizar o campo.
          </p>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="flex items-center justify-center py-4">
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      {/* 🎥 VÍDEO-CARD 1 — A Voz da Orácula */}
      <VideoCard 
        title="A Voz da Orácula"
        videoUrl={VIDEO_1_URL}
      />

      {/* Divider */}
      <div className="flex items-center justify-center py-4">
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 3 — AVISO HONESTO (FILTRO)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="font-display text-2xl md:text-3xl text-primary mb-12 text-center">
            Antes de entrar, um aviso claro.
          </h2>
          
          <p className="text-muted-foreground text-center mb-8">
            Se você procura:
          </p>
          
          <ul className="space-y-3 text-center text-foreground/50 mb-10">
            <li>técnicas rápidas</li>
            <li>certificações vazias</li>
            <li>espiritualidade performática</li>
            <li>atalhos para "atender mais"</li>
          </ul>
          
          <p className="text-primary/80 text-center italic text-lg mb-10">
            esta formação não é para você.
          </p>
          
          <p className="text-foreground/70 text-center leading-relaxed">
            A ORÁCULA forma mulheres que sustentam processos humanos<br />
            com leitura simbólica, presença e responsabilidade psíquica.
          </p>
        </motion.div>
      </section>

      {/* 🎥 VÍDEO-CARD 2 — Não é para todas */}
      <VideoCard 
        title="Não é para todas"
        videoUrl={VIDEO_2_URL}
        microcopy="Pertencimento não se explica. Se reconhece — ou não."
      />

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 4 — TRANSIÇÃO VISUAL SUTIL
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full h-32 md:h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/10 to-background" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 5 — O QUE É A FORMAÇÃO ORÁCULA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="font-display text-2xl md:text-3xl text-primary mb-10 text-center">
            O que é a Formação ORÁCULA
          </h2>
          
          <p className="text-muted-foreground text-center mb-12">
            A Formação ORÁCULA não é um curso rápido.
          </p>
          
          <p className="text-foreground/70 text-center leading-relaxed mb-10">
            Ela é:
          </p>
          
          <ul className="space-y-4 text-center text-foreground/70 mb-14">
            <li>um percurso de autorização progressiva</li>
            <li>um método simbólico estruturado</li>
            <li>uma formação ética para quem guia outras mulheres</li>
          </ul>
          
          <p className="text-primary/80 text-center mb-8 text-lg">Aqui, você aprende:</p>
          
          <div className="flex flex-wrap justify-center gap-5 text-foreground/70 mb-14">
            <span>quando conduzir</span>
            <span className="text-primary/30">•</span>
            <span>quando silenciar</span>
            <span className="text-primary/30">•</span>
            <span>quando sustentar</span>
            <span className="text-primary/30">•</span>
            <span>quando encerrar</span>
          </div>
          
          {/* Card Formação ORÁCULA */}
          <div className="border border-primary/20 rounded-2xl p-8 md:p-12 bg-card/10 backdrop-blur-sm space-y-6">
            <h3 className="font-display text-xl text-primary text-center mb-8">
              🏛️ FORMAÇÃO ORÁCULA
            </h3>
            
            <p className="text-muted-foreground text-center text-sm mb-8">
              Formação iniciática e profissional para mulheres que conduzem processos humanos com símbolos e narrativa
            </p>
            
            <ul className="space-y-5 text-foreground/60 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-primary/60 mt-0.5">•</span>
                <span>Metodologia própria ORÁCULA, estruturada em Portas, Torres e Travessias <span className="text-foreground/40 italic">(não modular, não linear)</span></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary/60 mt-0.5">•</span>
                <span>Leitura oracular e arquetípica com critérios éticos claros — <span className="text-foreground/40 italic">símbolo como diagnóstico, não espetáculo</span></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary/60 mt-0.5">•</span>
                <span>Travessias vividas antes do método: <span className="text-foreground/40 italic">ninguém aplica o que não sustentou</span></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary/60 mt-0.5">•</span>
                <span>Mentoria contínua para direção de campo, ritmo e limite <span className="text-foreground/40 italic">(não motivacional)</span></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary/60 mt-0.5">•</span>
                <span>Ferramentas exclusivas integradas ao App</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary/60 mt-0.5">•</span>
                <span>Formação para atendimentos individuais e grupos, com abertura e fechamento de campo</span>
              </li>
            </ul>
            
            <div className="pt-8 border-t border-primary/10">
              <p className="text-primary/60 text-center italic text-sm">
                Não é um método para aplicar.<br />
                É um lugar para sustentar.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 5.1 — OS NÍVEIS DA FORMAÇÃO
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="font-display text-2xl md:text-3xl text-primary mb-10 text-center">
            Os Níveis da Formação
          </h2>
          
          <p className="text-muted-foreground text-center mb-12">
            A Formação acontece por níveis, não por pressa.
          </p>
          
          <div className="space-y-8">
            {[
              { icon: '🌱', title: 'Iniciada', desc: 'presença e contenção' },
              { icon: '🌒', title: 'Praticante', desc: 'estrutura e linguagem' },
              { icon: '🔥', title: 'Condutora', desc: 'decisão e travessia' },
              { icon: '🌌', title: 'Guia de Grupos', desc: 'campo coletivo' },
              { icon: '🧝🏽‍♀️', title: 'Formadora', desc: 'transmissão e linhagem' },
            ].map((nivel, i) => (
              <motion.div 
                key={nivel.title}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-center gap-5 py-3"
              >
                <span className="text-2xl w-10 text-center flex-shrink-0">{nivel.icon}</span>
                <div>
                  <h3 className="font-display text-lg text-foreground">{nivel.title}</h3>
                  <p className="text-muted-foreground text-sm">{nivel.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 pt-8 border-t border-primary/10 text-center">
            <p className="text-muted-foreground mb-4">Cada nível exige:</p>
            <div className="flex flex-col items-center gap-1 text-foreground/70 mb-6">
              <span>prática</span>
              <span>evidência</span>
              <span>revisão</span>
            </div>
            <p className="text-primary/70 italic font-display">
              Não se avança por tempo.<br />
              Avança-se por maturidade.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="flex items-center justify-center py-4">
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 6 — COMO A FORMAÇÃO FUNCIONA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="font-display text-2xl md:text-3xl text-primary mb-14 text-center">
            Como a Formação Funciona
          </h2>
          
          <p className="text-muted-foreground text-center mb-14">
            A ORÁCULA se estrutura em dois movimentos inseparáveis:
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Travessias */}
            <div className="border border-primary/15 rounded-2xl p-8 md:p-10 bg-card/10 backdrop-blur-sm">
              <h3 className="font-display text-xl text-primary mb-5">
                TRAVESSIAS
              </h3>
              <p className="text-foreground/60 italic mb-6">
                O mergulho na própria psique da facilitadora.
              </p>
              <ul className="space-y-3 text-foreground/60 text-sm">
                <li>• atravessa o método em si mesma</li>
                <li>• constrói seu Mapa Vivo</li>
                <li>• reconhece limites, defesas e potências</li>
                <li>• integra corpo, símbolo e presença</li>
              </ul>
              <p className="text-primary/60 italic mt-8 text-sm">
                Nada é aplicado sem antes ser vivido.
              </p>
            </div>
            
            {/* Portais */}
            <div className="border border-primary/15 rounded-2xl p-8 md:p-10 bg-card/10 backdrop-blur-sm">
              <h3 className="font-display text-xl text-primary mb-5">
                PORTAIS
              </h3>
              <p className="text-foreground/60 italic mb-6">
                O espaço do aprendizado estruturado.
              </p>
              <ul className="space-y-3 text-foreground/60 text-sm">
                <li>• fundamentos teóricos e simbólicos</li>
                <li>• aulas didáticas</li>
                <li>• registros orientados</li>
                <li>• exercícios de leitura e condução</li>
                <li>• integração ética do método</li>
              </ul>
              <p className="text-primary/60 italic mt-8 text-sm">
                Aqui você aprende como sustentar outras mulheres<br />
                sem colapsar nem criar dependência.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 7 — FUNDO SUTIL TRAVESSIAS
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full h-32 md:h-44 overflow-hidden">
        <img 
          src={travessiasSection} 
          alt="" 
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.12] grayscale-[50%] brightness-[0.4]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 8 — AS TRAVESSIAS DA FORMAÇÃO
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="font-display text-2xl md:text-3xl text-primary mb-14 text-center">
            As Travessias da Formação
          </h2>
          
          <div className="space-y-10">
            {[
              { title: 'Travessia I — A Jornada Ritual da Heroína', desc: 'As 14 Portas da Psique Feminina.\nA base iniciática da formação e a criação do seu Mapa Pessoal.' },
              { title: 'Travessia II — Neuroplasticidade & Competências do Ego', desc: 'O corpo que sustenta o símbolo.\nAqui você aprende quando não conduzir.' },
              { title: 'Travessia III — Mito Pessoal & Linguagem Arquetípica', desc: 'A história que te atravessa e posiciona.\nSem romantização. Sem projeção.' },
              { title: 'Travessia IV — A Guardiã da Leitura', desc: 'A passagem da vivência pessoal para a condução ética.\nA facilitadora nasce quando sabe não agir.' },
            ].map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="border-l-2 border-primary/30 pl-6 md:pl-8"
              >
                <h3 className="font-display text-lg text-foreground mb-3">
                  {t.title}
                </h3>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {t.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="flex items-center justify-center py-4">
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 9 — PORTAL DA NARROTERAPIA ORACULAR
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 px-6 overflow-hidden">
        <img 
          src={fundoNarroterapia} 
          alt="" 
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.15]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background/80" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <h2 className="font-display text-2xl md:text-3xl text-primary mb-10 text-center">
            Portal da Narroterapia Oracular
          </h2>
          
          <p className="text-foreground/70 text-center leading-relaxed mb-12 text-lg">
            A Narroterapia Oracular não é contar histórias.<br />
            É ler a psique através delas.
          </p>
          
          <p className="text-muted-foreground text-center mb-8">Neste Portal você aprende:</p>
          
          <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto mb-12">
            <p className="text-foreground/60">• escuta narrativa profunda</p>
            <p className="text-foreground/60">• uso terapêutico de contos e mitos</p>
            <p className="text-foreground/60">• condução simbólica sem sugestão</p>
            <p className="text-foreground/60">• criação de ritos narrativos seguros</p>
          </div>
          
          <p className="text-primary/70 text-center italic text-lg font-display">
            Aqui a história deixa de ser metáfora<br />
            e se torna instrumento clínico simbólico.
          </p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 10 — FUNDO SUTIL FERRAMENTAS
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full h-32 md:h-44 overflow-hidden">
        <img 
          src={ferramentasSection} 
          alt="" 
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.10] grayscale-[50%] brightness-[0.35]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 11 — AS FERRAMENTAS DA CASA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="font-display text-2xl md:text-3xl text-primary mb-10 text-center">
            As Ferramentas da Casa
          </h2>
          
          <p className="text-muted-foreground text-center mb-12">
            Ao entrar na Formação ORÁCULA, você acessa um App exclusivo com:
          </p>
          
          <div className="grid md:grid-cols-2 gap-5 max-w-xl mx-auto mb-12">
            <div className="text-foreground/60 space-y-3">
              <p>• Mapa Vivo da Heroína</p>
              <p>• Jardim da Psique</p>
              <p>• Oráculo das Portas</p>
              <p>• Biblioteca Narrativa</p>
            </div>
            <div className="text-foreground/60 space-y-3">
              <p>• Checklists de condução</p>
              <p>• Prompts da Sibila por Portal</p>
              <p>• Avaliação automática e avaliação humana</p>
            </div>
          </div>
          
          <p className="text-primary/70 text-center italic font-display text-lg">
            Tudo criado para não depender de improviso.
          </p>
        </motion.div>
      </section>

      {/* 🎥 VÍDEO-CARD 3 — O Convite */}
      <VideoCard 
        title="O Convite"
        videoUrl={VIDEO_3_URL}
        microcopy="Entrar não é comprar. É assumir um lugar."
      />

      {/* Divider */}
      <div className="flex items-center justify-center py-4">
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 12 — ÉTICA E SUSTENTAÇÃO
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-2xl md:text-3xl text-primary mb-10">
              Ética e Sustentação
            </h2>
            
            <p className="text-foreground/70 leading-relaxed mb-10 text-lg">
              A ORÁCULA não certifica presença.<br />
              Certifica integração.
            </p>
            
            <p className="text-muted-foreground mb-5">Aqui existem:</p>
            
            <ul className="space-y-3 text-foreground/60 mb-10">
              <li>• critérios claros de passagem</li>
              <li>• termos éticos desde o onboarding</li>
              <li>• leitura humana do processo</li>
              <li>• limite de atuação profissional</li>
            </ul>
            
            <p className="text-primary/70 italic font-display text-lg">
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
              className="rounded-2xl shadow-[0_20px_60px_-12px_hsl(var(--gold)/0.15)] w-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="flex items-center justify-center py-4">
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 13 — PARA QUEM É / PARA QUEM NÃO É
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 px-6 overflow-hidden">
        <img 
          src={fundoParaQuemE} 
          alt="" 
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.15]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background/80" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-14">
            <div>
              <h2 className="font-display text-2xl text-primary mb-8">
                Para quem é
              </h2>
              <ul className="space-y-3 text-foreground/70 mb-8">
                <li>• terapeutas</li>
                <li>• psicólogas</li>
                <li>• mentoras do feminino</li>
                <li>• facilitadoras de grupos</li>
              </ul>
              <p className="text-muted-foreground italic text-sm">
                que já estudaram muito<br />
                mas sentem que falta eixo, estrutura e autoridade interna.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl text-foreground/40 mb-8">
                Para quem não é
              </h2>
              <ul className="space-y-3 text-foreground/40">
                <li>• busca atalhos</li>
                <li>• copia métodos</li>
                <li>• confunde espiritualidade com ausência de limite</li>
                <li>• não deseja ser atravessada</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="flex items-center justify-center py-4">
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 14 — O QUE VOCÊ RECEBE
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="font-display text-2xl md:text-3xl text-primary mb-12 text-center">
            O que você recebe
          </h2>
          
          <ul className="space-y-5 text-foreground/70">
            {[
              'acesso completo à formação',
              'travessias e aulas estruturadas',
              'checklists de autorização',
              'supervisão e revisão',
              'certificação por nível',
              'acesso integrado ao sistema Casa Orácula',
            ].map((item) => (
              <li key={item} className="flex items-start gap-4">
                <span className="text-primary mt-0.5">✔</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="flex items-center justify-center py-4">
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 14.1 — INVESTIMENTO
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="font-display text-2xl md:text-3xl text-primary mb-12 text-center">
            Investimento
          </h2>
          
          <div className="space-y-8">
            <div className="border border-primary/15 rounded-2xl p-8 md:p-10 bg-card/10 backdrop-blur-sm text-center">
              <h3 className="font-display text-lg text-foreground mb-3">
                Formação ORÁCULA — Certificação Completa
              </h3>
              <p className="text-2xl text-primary font-semibold mb-2">
                💰 R$ 4.997 a R$ 7.997
              </p>
              <p className="text-muted-foreground text-sm">(parcelável)</p>
            </div>
            
            <div className="border border-primary/25 rounded-2xl p-8 md:p-10 bg-primary/5 backdrop-blur-sm text-center">
              <h3 className="font-display text-lg text-foreground mb-3">
                Opção Premium <span className="text-primary/70">(com mentoria)</span>
              </h3>
              <p className="text-2xl text-primary font-semibold">
                💰 R$ 9.997 a R$ 14.997
              </p>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-primary/10 text-center">
            <p className="text-foreground/60 mb-2">
              O acesso à formação é seu.
            </p>
            <p className="text-muted-foreground text-sm italic">
              O plano mensal é opcional e contratado à parte.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 15 — ENCERRAMENTO
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 px-6 overflow-hidden">
        <img 
          src={fundoRitual2} 
          alt="" 
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.08] grayscale-[35%] brightness-[0.5]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-2xl mx-auto text-center"
        >
          <p className="text-foreground/70 leading-relaxed mb-10 text-lg">
            A Casa Orácula não promete resultados rápidos.<br />
            Ela oferece lugar.
          </p>
          
          <p className="text-muted-foreground mb-10 leading-relaxed">
            Lugar interno.<br />
            Lugar simbólico.<br />
            Lugar profissional.
          </p>
          
          <p className="text-primary italic text-xl font-display">
            Você não entra para aprender.<br />
            Você entra para atravessar.
          </p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 16 — IMAGEM FINAL
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="w-full py-8">
        <img 
          src={finalPagina} 
          alt="Casa Orácula" 
          className="w-full max-h-[600px] object-contain opacity-20"
        />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 17 — CHAMADO FINAL
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="font-display text-xl md:text-2xl text-primary mb-10 leading-relaxed">
            Aqui não se forma facilitadoras.<br />
            <span className="text-foreground">Forma-se quem sabe sustentar campo.</span>
          </p>
          
          <p className="text-muted-foreground mb-12 leading-relaxed">
            A ORÁCULA não tem pressa.<br />
            Mas, não espera para sempre.<br />
            Entre quando estiver pronta.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline"
              size="lg"
              onClick={() => navigate('/auth')}
              className="border-border/40 hover:border-primary/30"
            >
              Entrar
            </Button>
            <Button 
              variant="gold"
              size="lg"
              onClick={() => navigate('/planos')}
            >
              Ver Planos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* FOOTER — Disclaimer Ético */}
      <footer className="py-12 px-6 border-t border-border/10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs text-muted-foreground/50 leading-relaxed">
            🔒 A Casa Orácula não substitui terapia, acompanhamento psicológico 
            ou tratamento clínico quando necessário.
          </p>
        </div>
      </footer>
    </div>
  );
}
