import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// Imagens fornecidas pelo usuário
import heroTopo from "@/assets/formacao/hero-topo.png";
import eticaSustentacao from "@/assets/formacao/etica-sustentacao.png";
import finalPagina from "@/assets/formacao/final-pagina.png";
import fundoRitual1 from "@/assets/formacao/fundo-ritual-1.png";
import fundoRitual2 from "@/assets/formacao/fundo-ritual-2.png";

// Imagens geradas (arquetípicas)
import travessiasSection from "@/assets/formacao/travessias-section.jpg";
import ferramentasSection from "@/assets/formacao/ferramentas-section.jpg";
import metodologiaSection from "@/assets/formacao/metodologia-section.jpg";

/**
 * OraculaSalesPage — Página de Apresentação da Formação Orácula
 * Layout: Imagens limpas (sem texto sobreposto), texto bem distribuído
 */
export default function OraculaSalesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[hsl(220,20%,4%)] text-foreground overflow-x-hidden selection:bg-gold/20">
      
      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 1 — IMAGEM HERO (TOPO COM SOMBRA SUAVE)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full">
        <img 
          src={heroTopo} 
          alt="Formação Orácula" 
          className="w-full h-auto object-cover"
        />
        {/* Sombra suave na borda inferior para suavizar a dobra */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[hsl(220,20%,4%)] to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 2 — TÍTULO E INTRODUÇÃO
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-gold/70 uppercase tracking-[0.3em] text-sm mb-6">
            Casa Orácula
          </p>
          
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground tracking-wide leading-tight mb-8">
            Formação Iniciática em Terapia Arquetípica
          </h1>
          
          <p className="text-lg text-foreground/70 leading-relaxed">
            Não é um curso.<br />
            É um território de formação simbólica, ética e estruturada<br />
            para mulheres que não podem mais improvisar profundidade.
          </p>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="flex items-center justify-center py-6">
        <div className="w-16 h-px bg-gold/20" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 3 — AVISO HONESTO
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="font-display text-2xl text-gold mb-10 text-center">
            Antes de entrar, um aviso claro.
          </h2>
          
          <p className="text-foreground/60 text-center mb-6">
            Se você procura:
          </p>
          
          <ul className="space-y-2 text-center text-foreground/50 mb-8">
            <li>técnicas rápidas</li>
            <li>certificações vazias</li>
            <li>espiritualidade performática</li>
            <li>atalhos para "atender mais"</li>
          </ul>
          
          <p className="text-gold/80 text-center italic mb-8">
            esta formação não é para você.
          </p>
          
          <p className="text-foreground/70 text-center leading-relaxed">
            A ORÁCULA forma mulheres que sustentam processos humanos<br />
            com leitura simbólica, presença e responsabilidade psíquica.
          </p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 4 — IMAGEM METODOLOGIA (FUNDO SUTIL)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full h-48 md:h-64 overflow-hidden">
        <img 
          src={metodologiaSection} 
          alt="" 
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.12] grayscale-[50%] brightness-50 blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,20%,4%)] via-transparent to-[hsl(220,20%,4%)]" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 5 — O QUE É A FORMAÇÃO ORÁCULA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="font-display text-2xl md:text-3xl text-gold mb-8 text-center">
            O que é a Formação ORÁCULA
          </h2>
          
          <p className="text-foreground/70 text-center leading-relaxed mb-10">
            A Formação ORÁCULA é uma metodologia viva<br />
            para terapeutas, psicólogas e mentoras do feminino<br />
            que desejam atuar com profundidade sem ferir, invadir ou improvisar.
          </p>
          
          <p className="text-foreground/60 text-center mb-6">Ela integra:</p>
          
          <div className="grid md:grid-cols-2 gap-4 max-w-xl mx-auto mb-10">
            <div className="text-foreground/60 space-y-2">
              <p>• psique feminina e Jornada da Heroína</p>
              <p>• linguagem arquetípica</p>
              <p>• leitura simbólica</p>
            </div>
            <div className="text-foreground/60 space-y-2">
              <p>• narroterapia oracular</p>
              <p>• neuroplasticidade e competências do ego</p>
              <p>• ética de condução e limite terapêutico</p>
            </div>
          </div>
          
          <p className="text-gold/70 text-center italic">
            Tudo organizado em Portais de Aprendizado<br />
            e Travessias de Vivência.
          </p>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="flex items-center justify-center py-6">
        <div className="w-16 h-px bg-gold/20" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 6 — COMO A FORMAÇÃO FUNCIONA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="font-display text-2xl md:text-3xl text-gold mb-12 text-center">
            Como a Formação Funciona
          </h2>
          
          <p className="text-foreground/60 text-center mb-12">
            A ORÁCULA se estrutura em dois movimentos inseparáveis:
          </p>
          
          <div className="grid md:grid-cols-2 gap-10">
            {/* Travessias */}
            <div className="border border-gold/20 rounded-lg p-8 bg-card/5">
              <h3 className="font-display text-xl text-gold mb-4">
                TRAVESSIAS
              </h3>
              <p className="text-foreground/60 italic mb-6">
                O mergulho na própria psique da facilitadora.
              </p>
              <ul className="space-y-2 text-foreground/50 text-sm">
                <li>• atravessa o método em si mesma</li>
                <li>• constrói seu Mapa Vivo</li>
                <li>• reconhece limites, defesas e potências</li>
                <li>• integra corpo, símbolo e presença</li>
              </ul>
              <p className="text-gold/60 italic mt-6 text-sm">
                Nada é aplicado sem antes ser vivido.
              </p>
            </div>
            
            {/* Portais */}
            <div className="border border-gold/20 rounded-lg p-8 bg-card/5">
              <h3 className="font-display text-xl text-gold mb-4">
                PORTAIS
              </h3>
              <p className="text-foreground/60 italic mb-6">
                O espaço do aprendizado estruturado.
              </p>
              <ul className="space-y-2 text-foreground/50 text-sm">
                <li>• fundamentos teóricos e simbólicos</li>
                <li>• aulas didáticas</li>
                <li>• registros orientados</li>
                <li>• exercícios de leitura e condução</li>
                <li>• integração ética do método</li>
              </ul>
              <p className="text-gold/60 italic mt-6 text-sm">
                Aqui você aprende como sustentar outras mulheres<br />
                sem colapsar nem criar dependência.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 7 — IMAGEM TRAVESSIAS (FUNDO SUTIL)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full h-40 md:h-56 overflow-hidden">
        <img 
          src={travessiasSection} 
          alt="" 
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.15] grayscale-[45%] brightness-[0.4] blur-[0.5px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,20%,4%)] via-transparent to-[hsl(220,20%,4%)]" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 8 — AS TRAVESSIAS DA FORMAÇÃO
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="font-display text-2xl md:text-3xl text-gold mb-12 text-center">
            As Travessias da Formação
          </h2>
          
          <div className="space-y-8">
            <div className="border-l-2 border-gold/30 pl-6">
              <h3 className="font-display text-lg text-foreground mb-2">
                Travessia I — A Jornada Ritual da Heroína
              </h3>
              <p className="text-foreground/50">
                As 14 Portas da Psique Feminina.<br />
                A base iniciática da formação e a criação do seu Mapa Pessoal.
              </p>
            </div>
            
            <div className="border-l-2 border-gold/30 pl-6">
              <h3 className="font-display text-lg text-foreground mb-2">
                Travessia II — Neuroplasticidade & Competências do Ego
              </h3>
              <p className="text-foreground/50">
                O corpo que sustenta o símbolo.<br />
                Aqui você aprende quando não conduzir.
              </p>
            </div>
            
            <div className="border-l-2 border-gold/30 pl-6">
              <h3 className="font-display text-lg text-foreground mb-2">
                Travessia III — Mito Pessoal & Linguagem Arquetípica
              </h3>
              <p className="text-foreground/50">
                A história que te atravessa e posiciona.<br />
                Sem romantização. Sem projeção.
              </p>
            </div>
            
            <div className="border-l-2 border-gold/30 pl-6">
              <h3 className="font-display text-lg text-foreground mb-2">
                Travessia IV — A Guardiã da Leitura
              </h3>
              <p className="text-foreground/50">
                A passagem da vivência pessoal para a condução ética.<br />
                A facilitadora nasce quando sabe não agir.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="flex items-center justify-center py-6">
        <div className="w-16 h-px bg-gold/20" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 9 — PORTAL DA NARROTERAPIA ORACULAR
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="font-display text-2xl md:text-3xl text-gold mb-8 text-center">
            Portal da Narroterapia Oracular
          </h2>
          
          <p className="text-foreground/70 text-center leading-relaxed mb-10">
            A Narroterapia Oracular não é contar histórias.<br />
            É ler a psique através delas.
          </p>
          
          <p className="text-foreground/60 text-center mb-6">Neste Portal você aprende:</p>
          
          <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto mb-10">
            <p className="text-foreground/50">• escuta narrativa profunda</p>
            <p className="text-foreground/50">• uso terapêutico de contos e mitos</p>
            <p className="text-foreground/50">• condução simbólica sem sugestão</p>
            <p className="text-foreground/50">• criação de ritos narrativos seguros</p>
          </div>
          
          <p className="text-gold/70 text-center italic">
            Aqui a história deixa de ser metáfora<br />
            e se torna instrumento clínico simbólico.
          </p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 10 — IMAGEM FERRAMENTAS (FUNDO SUTIL)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full h-40 md:h-52 overflow-hidden">
        <img 
          src={ferramentasSection} 
          alt="" 
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.10] grayscale-[55%] brightness-[0.35] blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,20%,4%)] via-transparent to-[hsl(220,20%,4%)]" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 11 — AS FERRAMENTAS DA CASA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="font-display text-2xl md:text-3xl text-gold mb-8 text-center">
            As Ferramentas da Casa
          </h2>
          
          <p className="text-foreground/60 text-center mb-10">
            Ao entrar na Formação ORÁCULA, você acessa um App exclusivo com:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 max-w-xl mx-auto mb-10">
            <div className="text-foreground/50 space-y-2">
              <p>• Mapa Vivo da Heroína</p>
              <p>• Jardim da Psique</p>
              <p>• Oráculo das Portas</p>
              <p>• Biblioteca Narrativa</p>
            </div>
            <div className="text-foreground/50 space-y-2">
              <p>• Checklists de condução</p>
              <p>• Prompts da Sibila por Portal</p>
              <p>• Avaliação automática e avaliação humana</p>
            </div>
          </div>
          
          <p className="text-gold/70 text-center italic">
            Tudo criado para não depender de improviso.
          </p>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="flex items-center justify-center py-6">
        <div className="w-16 h-px bg-gold/20" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 12 — ÉTICA E SUSTENTAÇÃO (COM IMAGEM LATERAL)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-2xl md:text-3xl text-gold mb-8">
              Ética e Sustentação
            </h2>
            
            <p className="text-foreground/70 leading-relaxed mb-8">
              A ORÁCULA não certifica presença.<br />
              Certifica integração.
            </p>
            
            <p className="text-foreground/60 mb-4">Aqui existem:</p>
            
            <ul className="space-y-2 text-foreground/50 mb-8">
              <li>• critérios claros de passagem</li>
              <li>• termos éticos desde o onboarding</li>
              <li>• leitura humana do processo</li>
              <li>• limite de atuação profissional</li>
            </ul>
            
            <p className="text-gold/70 italic">
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
              className="rounded-lg shadow-2xl w-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="flex items-center justify-center py-6">
        <div className="w-16 h-px bg-gold/20" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 13 — PARA QUEM É / PARA QUEM NÃO É (COM FUNDO RITUAL 1)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Imagem de fundo sutil */}
        <img 
          src={fundoRitual1} 
          alt="" 
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.08] grayscale-[40%] brightness-[0.6]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,20%,4%)] via-transparent to-[hsl(220,20%,4%)]" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-12">
            {/* Para quem é */}
            <div>
              <h2 className="font-display text-2xl text-gold mb-6">
                Para quem é
              </h2>
              
              <ul className="space-y-2 text-foreground/60 mb-6">
                <li>• terapeutas</li>
                <li>• psicólogas</li>
                <li>• mentoras do feminino</li>
                <li>• facilitadoras de grupos</li>
              </ul>
              
              <p className="text-foreground/50 italic text-sm">
                que já estudaram muito<br />
                mas sentem que falta eixo, estrutura e autoridade interna.
              </p>
            </div>

            {/* Para quem não é */}
            <div>
              <h2 className="font-display text-2xl text-foreground/40 mb-6">
                Para quem não é
              </h2>
              
              <ul className="space-y-2 text-foreground/40">
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
      <div className="flex items-center justify-center py-6">
        <div className="w-16 h-px bg-gold/20" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 14 — ENCERRAMENTO
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Imagem de fundo sutil */}
        <img 
          src={fundoRitual2} 
          alt="" 
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.10] grayscale-[35%] brightness-[0.5]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,20%,4%)] via-transparent to-[hsl(220,20%,4%)]" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-2xl mx-auto text-center"
        >
          <p className="text-foreground/70 leading-relaxed mb-8">
            A Casa Orácula não promete resultados rápidos.<br />
            Ela oferece lugar.
          </p>
          
          <p className="text-foreground/60 mb-8">
            Lugar interno.<br />
            Lugar simbólico.<br />
            Lugar profissional.
          </p>
          
          <p className="text-gold italic text-lg">
            Você não entra para aprender.<br />
            Você entra para atravessar.
          </p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 15 — IMAGEM FINAL (FUNDO SUTIL COM TRANSPARÊNCIA)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full h-80 md:h-[450px] overflow-hidden">
        <img 
          src={finalPagina} 
          alt="" 
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain opacity-[0.15] grayscale-[30%] brightness-[0.6]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,20%,4%)] via-transparent to-[hsl(220,20%,4%)]" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 16 — CHAMADO FINAL
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-foreground/70 text-lg mb-6">
            Se você sentiu o chamado, a Casa está aberta.
          </p>
          
          <p className="text-foreground/50 mb-10">
            Entre quando estiver pronta.<br />
            A ORÁCULA não tem pressa.<br />
            Mas não espera para sempre.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline"
              onClick={() => navigate('/auth')}
              className="border-border/40 hover:border-gold/30"
            >
              Entrar
            </Button>
            <Button 
              onClick={() => navigate('/planos')}
              className="bg-gold text-background hover:bg-gold/90"
            >
              Ver Planos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER — Disclaimer Ético
      ═══════════════════════════════════════════════════════════════════ */}
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
