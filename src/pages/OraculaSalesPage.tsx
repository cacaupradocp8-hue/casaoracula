import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// Imagens
import heroImage from "@/assets/formacao/hero-oracula-new.jpg";
import silencioImage from "@/assets/formacao/oracula-silencio-pb.jpg";
import atmosfera01 from "@/assets/formacao/atmosfera-ritual-01-new.jpg";
import atmosfera02 from "@/assets/formacao/atmosfera-ritual-02-new.jpg";
import autoridadeImage from "@/assets/formacao/autoridade-metodo-new.jpg";

/**
 * OraculaSalesPage — Página de Apresentação da Formação Orácula
 * 
 * Copy oficial aplicada sem alterações.
 */
export default function OraculaSalesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[hsl(220,20%,4%)] text-foreground overflow-x-hidden selection:bg-gold/20">
      
      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 1 — HERO (TOPO DA PÁGINA)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-black/60" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10 max-w-4xl mx-auto text-center px-6 py-24"
        >
          <p className="text-gold/80 uppercase tracking-[0.3em] text-sm mb-6">
            Casa Orácula
          </p>
          
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground tracking-wide leading-tight mb-8">
            Formação Iniciática em Terapia Arquetípica
          </h1>
          
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Não é um curso.<br />
            É um território de formação simbólica, ética e estruturada<br />
            para mulheres que não podem mais improvisar profundidade.
          </p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 2 — AVISO HONESTO
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${silencioImage})` }}
        />
        <div className="absolute inset-0 bg-[hsl(220,20%,4%)]/90" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <h2 className="font-display text-2xl md:text-3xl text-gold mb-10 text-center">
            Antes de entrar, um aviso claro.
          </h2>
          
          <p className="text-foreground/70 text-center mb-8">
            Se você procura:
          </p>
          
          <ul className="space-y-3 text-center text-foreground/60 mb-10">
            <li>técnicas rápidas</li>
            <li>certificações vazias</li>
            <li>espiritualidade performática</li>
            <li>atalhos para "atender mais"</li>
          </ul>
          
          <p className="text-gold/90 text-center text-lg italic mb-6">
            esta formação não é para você.
          </p>
          
          <p className="text-foreground/80 text-center leading-relaxed">
            A ORÁCULA forma mulheres que sustentam processos humanos<br />
            com leitura simbólica, presença e responsabilidade psíquica.
          </p>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="flex items-center justify-center py-8">
        <span className="text-gold/40 text-xl">🜂</span>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 3 — O QUE É A FORMAÇÃO ORÁCULA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${atmosfera01})` }}
        />
        <div className="absolute inset-0 bg-black/75" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <h2 className="font-display text-2xl md:text-3xl text-gold mb-8 text-center">
            O que é a Formação ORÁCULA
          </h2>
          
          <p className="text-foreground/80 text-center leading-relaxed mb-10">
            A Formação ORÁCULA é uma metodologia viva<br />
            para terapeutas, psicólogas e mentoras do feminino<br />
            que desejam atuar com profundidade sem ferir, invadir ou improvisar.
          </p>
          
          <p className="text-foreground/70 text-center mb-6">Ela integra:</p>
          
          <ul className="space-y-2 text-center text-foreground/70 mb-8">
            <li>psique feminina e Jornada da Heroína</li>
            <li>linguagem arquetípica</li>
            <li>leitura simbólica</li>
            <li>narroterapia oracular</li>
            <li>neuroplasticidade e competências do ego</li>
            <li>ética de condução e limite terapêutico</li>
          </ul>
          
          <p className="text-gold/80 text-center italic">
            Tudo organizado em Portais de Aprendizado<br />
            e Travessias de Vivência.
          </p>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="flex items-center justify-center py-8">
        <span className="text-gold/40 text-xl">🜃</span>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 4 — COMO A FORMAÇÃO FUNCIONA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
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
          
          <p className="text-foreground/70 text-center mb-12">
            A ORÁCULA se estrutura em dois movimentos inseparáveis:
          </p>
          
          <div className="grid md:grid-cols-2 gap-10">
            {/* Travessias */}
            <div className="border border-gold/20 rounded-lg p-8 bg-card/5">
              <h3 className="font-display text-xl text-gold mb-4 flex items-center gap-3">
                <span>🔮</span> TRAVESSIAS
              </h3>
              <p className="text-foreground/70 italic mb-6">
                O mergulho na própria psique da facilitadora.
              </p>
              <p className="text-foreground/60 mb-4">Aqui você:</p>
              <ul className="space-y-2 text-foreground/60 text-sm">
                <li>• atravessa o método em si mesma</li>
                <li>• constrói seu Mapa Vivo</li>
                <li>• reconhece limites, defesas e potências</li>
                <li>• integra corpo, símbolo e presença</li>
              </ul>
              <p className="text-gold/70 italic mt-6 text-sm">
                Nada é aplicado sem antes ser vivido.
              </p>
            </div>
            
            {/* Portais */}
            <div className="border border-gold/20 rounded-lg p-8 bg-card/5">
              <h3 className="font-display text-xl text-gold mb-4 flex items-center gap-3">
                <span>🗝️</span> PORTAIS
              </h3>
              <p className="text-foreground/70 italic mb-6">
                O espaço do aprendizado estruturado.
              </p>
              <p className="text-foreground/60 mb-4">Em cada Portal você encontra:</p>
              <ul className="space-y-2 text-foreground/60 text-sm">
                <li>• fundamentos teóricos e simbólicos</li>
                <li>• aulas didáticas</li>
                <li>• registros orientados</li>
                <li>• exercícios de leitura e condução</li>
                <li>• integração ética do método</li>
              </ul>
              <p className="text-gold/70 italic mt-6 text-sm">
                Aqui você aprende como sustentar outras mulheres<br />
                sem colapsar nem criar dependência.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="flex items-center justify-center py-8">
        <span className="text-gold/40 text-xl">🜂</span>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 5 — AS TRAVESSIAS DA FORMAÇÃO
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${atmosfera02})` }}
        />
        <div className="absolute inset-0 bg-black/80" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <h2 className="font-display text-2xl md:text-3xl text-gold mb-12 text-center">
            As Travessias da Formação
          </h2>
          
          <div className="space-y-8">
            <div className="border-l-2 border-gold/30 pl-6">
              <h3 className="font-display text-lg text-foreground mb-2">
                Travessia I — A Jornada Ritual da Heroína
              </h3>
              <p className="text-foreground/60">
                As 14 Portas da Psique Feminina.<br />
                A base iniciática da formação e a criação do seu Mapa Pessoal.
              </p>
            </div>
            
            <div className="border-l-2 border-gold/30 pl-6">
              <h3 className="font-display text-lg text-foreground mb-2">
                Travessia II — Neuroplasticidade & Competências do Ego
              </h3>
              <p className="text-foreground/60">
                O corpo que sustenta o símbolo.<br />
                Aqui você aprende quando não conduzir.
              </p>
            </div>
            
            <div className="border-l-2 border-gold/30 pl-6">
              <h3 className="font-display text-lg text-foreground mb-2">
                Travessia III — Mito Pessoal & Linguagem Arquetípica
              </h3>
              <p className="text-foreground/60">
                A história que te atravessa e posiciona.<br />
                Sem romantização. Sem projeção.
              </p>
            </div>
            
            <div className="border-l-2 border-gold/30 pl-6">
              <h3 className="font-display text-lg text-foreground mb-2">
                Travessia IV — A Guardiã da Leitura
              </h3>
              <p className="text-foreground/60">
                A passagem da vivência pessoal para a condução ética.<br />
                A facilitadora nasce quando sabe não agir.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="flex items-center justify-center py-8">
        <span className="text-gold/40 text-xl">🜁</span>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 6 — PORTAL DA NARROTERAPIA ORACULAR
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
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
          
          <p className="text-foreground/80 text-center leading-relaxed mb-10">
            A Narroterapia Oracular não é contar histórias.<br />
            É ler a psique através delas.
          </p>
          
          <p className="text-foreground/70 text-center mb-6">Neste Portal você aprende:</p>
          
          <ul className="space-y-2 text-center text-foreground/60 mb-10">
            <li>escuta narrativa profunda</li>
            <li>uso terapêutico de contos e mitos</li>
            <li>condução simbólica sem sugestão</li>
            <li>criação de ritos narrativos seguros</li>
          </ul>
          
          <p className="text-gold/80 text-center italic">
            Aqui a história deixa de ser metáfora<br />
            e se torna instrumento clínico simbólico.
          </p>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="flex items-center justify-center py-8">
        <span className="text-gold/40 text-xl">🛠️</span>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 7 — AS FERRAMENTAS DA CASA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
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
          
          <p className="text-foreground/70 text-center mb-10">
            Ao entrar na Formação ORÁCULA, você acessa um App exclusivo com:
          </p>
          
          <ul className="space-y-3 text-center text-foreground/60 mb-10">
            <li>Mapa Vivo da Heroína</li>
            <li>Jardim da Psique</li>
            <li>Oráculo das Portas</li>
            <li>Biblioteca Narrativa</li>
            <li>Checklists de condução</li>
            <li>Prompts da Sibila por Portal</li>
            <li>Avaliação automática e avaliação humana</li>
          </ul>
          
          <p className="text-gold/80 text-center italic">
            Tudo criado para não depender de improviso.
          </p>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="flex items-center justify-center py-8">
        <span className="text-gold/40 text-xl">🛡️</span>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 8 — ÉTICA E SUSTENTAÇÃO
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-2xl md:text-3xl text-gold mb-8">
              Ética e Sustentação
            </h2>
            
            <p className="text-foreground/80 leading-relaxed mb-8">
              A ORÁCULA não certifica presença.<br />
              Certifica integração.
            </p>
            
            <p className="text-foreground/70 mb-4">Aqui existem:</p>
            
            <ul className="space-y-2 text-foreground/60 mb-8">
              <li>• critérios claros de passagem</li>
              <li>• termos éticos desde o onboarding</li>
              <li>• leitura humana do processo</li>
              <li>• limite de atuação profissional</li>
            </ul>
            
            <p className="text-gold/80 italic">
              Formar presença é coisa séria.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="hidden md:block"
          >
            <img 
              src={autoridadeImage} 
              alt="Autoridade do método" 
              className="rounded-lg shadow-2xl w-full object-cover max-h-[400px]"
            />
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="flex items-center justify-center py-8">
        <span className="text-gold/40 text-xl">🜁</span>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 9 — PARA QUEM É
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="font-display text-2xl md:text-3xl text-gold mb-8 text-center">
            Para quem é
          </h2>
          
          <p className="text-foreground/70 text-center mb-6">Para:</p>
          
          <ul className="space-y-2 text-center text-foreground/70 mb-8">
            <li>terapeutas</li>
            <li>psicólogas</li>
            <li>mentoras do feminino</li>
            <li>facilitadoras de grupos</li>
          </ul>
          
          <p className="text-foreground/60 text-center italic">
            que já estudaram muito<br />
            mas sentem que falta eixo, estrutura e autoridade interna.
          </p>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="flex items-center justify-center py-8">
        <span className="text-gold/40 text-xl">🜄</span>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 10 — PARA QUEM NÃO É
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="font-display text-2xl md:text-3xl text-gold/80 mb-8 text-center">
            Para quem não é
          </h2>
          
          <p className="text-foreground/60 text-center mb-6">Não é para quem:</p>
          
          <ul className="space-y-2 text-center text-foreground/50">
            <li>busca atalhos</li>
            <li>copia métodos</li>
            <li>confunde espiritualidade com ausência de limite</li>
            <li>não deseja ser atravessada</li>
          </ul>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="flex items-center justify-center py-8">
        <span className="text-gold/40 text-xl">🌑</span>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 11 — ENCERRAMENTO
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-foreground/80 leading-relaxed mb-8">
            A Casa Orácula não promete resultados rápidos.<br />
            Ela oferece lugar.
          </p>
          
          <p className="text-foreground/70 mb-8">
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

      {/* Divider */}
      <div className="flex items-center justify-center py-8">
        <span className="text-gold/40 text-xl">🗝️</span>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOCO 12 — CHAMADO FINAL
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-foreground/80 text-lg mb-6">
            Se você sentiu o chamado, a Casa está aberta.
          </p>
          
          <p className="text-foreground/60 mb-10">
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
