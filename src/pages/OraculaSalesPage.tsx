import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { VideoCard } from "@/components/sales/VideoCard";

// Imagens fornecidas pelo usuário
import heroTopo from "@/assets/formacao/hero-topo.png";
import eticaSustentacao from "@/assets/formacao/etica-sustentacao.png";
import finalPagina from "@/assets/formacao/final-pagina.png";
import fundoRitual2 from "@/assets/formacao/fundo-ritual-2.png";
import fundoNarroterapia from "@/assets/formacao/fundo-narroterapia.png";
import fundoParaQuemE from "@/assets/formacao/fundo-para-quem-e.png";

/**
 * OraculaSalesPage — Página de Apresentação Hi-Ticket da Formação ORÁCULA
 * 
 * ESTRUTURA OBRIGATÓRIA COM 3 VÍDEO-CARDS:
 * 1. Hero → Vídeo 1 → Filtro → Vídeo 2 → Ferramentas → Vídeo 3 → Fechamento
 * 
 * Os vídeo-cards são pilares da experiência simbólica.
 */
export default function OraculaSalesPage() {
  const navigate = useNavigate();

  // URLs dos vídeos (configuráveis via app_settings futuramente)
  const VIDEO_1_URL = "https://www.youtube.com/watch?v=PLACEHOLDER_1"; // A Voz da Orácula
  const VIDEO_2_URL = "https://www.youtube.com/watch?v=PLACEHOLDER_2"; // Não é para todas
  const VIDEO_3_URL = "https://www.youtube.com/watch?v=PLACEHOLDER_3"; // O Convite

  return (
    <div className="min-h-screen bg-[hsl(220,20%,4%)] text-foreground overflow-x-hidden selection:bg-gold/20">
      
      {/* ═══════════════════════════════════════════════════════════════════
          1️⃣ SEÇÃO HERO — ABERTURA (SEM VÍDEO)
          Imagem de impacto + Headline + Subheadline ritualística
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full">
        <img 
          src={heroTopo} 
          alt="Formação Orácula" 
          className="w-full h-auto object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[hsl(220,20%,4%)] to-transparent" />
      </section>

      <section className="py-16 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-gold/60 uppercase tracking-[0.3em] text-sm mb-6">
            Casa Orácula
          </p>
          
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground tracking-wide leading-tight mb-8">
            Formação Iniciática em Terapia Arquetípica
          </h1>
          
          <p className="text-lg text-foreground/60 leading-relaxed">
            Não é um curso.<br />
            É um território de formação simbólica, ética e estruturada<br />
            para mulheres que não podem mais improvisar profundidade.
          </p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          🎥 2️⃣ VÍDEO-CARD 1 — "A Voz da Orácula"
          Posicionamento + Autoridade + Eixo Ético
          IMEDIATAMENTE APÓS A HERO SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <VideoCard 
        title="A Voz da Orácula"
        videoUrl={VIDEO_1_URL}
      />

      {/* ═══════════════════════════════════════════════════════════════════
          🪞 3️⃣ SEÇÃO — TEXTO DE FILTRO / OBJEÇÃO (SEM VÍDEO)
          Quebra sutil de objeção + Filtrar quem não é público
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
          
          <p className="text-foreground/50 text-center mb-6">
            Se você procura:
          </p>
          
          <ul className="space-y-2 text-center text-foreground/40 mb-8">
            <li>técnicas rápidas</li>
            <li>certificações vazias</li>
            <li>espiritualidade performática</li>
            <li>atalhos para "atender mais"</li>
          </ul>
          
          <p className="text-gold/70 text-center italic mb-8">
            esta formação não é para você.
          </p>
          
          <p className="text-foreground/60 text-center leading-relaxed">
            A ORÁCULA forma mulheres que sustentam processos humanos<br />
            com leitura simbólica, presença e responsabilidade psíquica.
          </p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          🎥 4️⃣ VÍDEO-CARD 2 — "Não é para todas"
          Exclusão consciente + Desejo silencioso
          LOGO APÓS A SEÇÃO DE FILTRO
      ═══════════════════════════════════════════════════════════════════ */}
      <VideoCard 
        title="Não é para todas"
        videoUrl={VIDEO_2_URL}
      />

      {/* Divider */}
      <div className="flex items-center justify-center py-8">
        <div className="w-20 h-px bg-gold/15" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          🧰 5️⃣ SEÇÃO — FERRAMENTAS DO APP (CARDS VISUAIS)
          Grid de cards visuais com imagem + nome + microdescrição
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="font-display text-2xl md:text-3xl text-gold mb-4 text-center">
            As Ferramentas da Casa
          </h2>
          
          <p className="text-foreground/50 text-center mb-12 text-sm">
            Ao entrar na Formação, você acessa um App exclusivo.
          </p>
          
          {/* Grid de Ferramentas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { nome: "Mapa Vivo", desc: "Sua jornada visível" },
              { nome: "Jardim da Psique", desc: "Registro simbólico" },
              { nome: "Oráculo das Portas", desc: "Leitura direcionada" },
              { nome: "Biblioteca Narrativa", desc: "Contos terapêuticos" },
              { nome: "Checklists", desc: "Condução estruturada" },
              { nome: "Sibila", desc: "IA de apoio simbólico" },
              { nome: "Sala de Sessão", desc: "Espaço clínico" },
              { nome: "Travessias", desc: "Jornada iniciática" },
            ].map((ferramenta, i) => (
              <motion.div
                key={ferramenta.nome}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="bg-card/5 border border-border/10 rounded-lg p-4 text-center hover:border-gold/20 transition-colors"
              >
                <p className="text-foreground/80 font-medium text-sm mb-1">
                  {ferramenta.nome}
                </p>
                <p className="text-foreground/40 text-xs">
                  {ferramenta.desc}
                </p>
              </motion.div>
            ))}
          </div>
          
          <p className="text-gold/60 text-center italic mt-10 text-sm">
            Tudo criado para não depender de improviso.
          </p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          🎥 6️⃣ VÍDEO-CARD 3 — "O Convite"
          Convite + Decisão + Encerramento de campo
          IMEDIATAMENTE APÓS A SEÇÃO DE FERRAMENTAS
      ═══════════════════════════════════════════════════════════════════ */}
      <VideoCard 
        title="O Convite"
        videoUrl={VIDEO_3_URL}
      />

      {/* Divider */}
      <div className="flex items-center justify-center py-8">
        <div className="w-20 h-px bg-gold/15" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SEÇÃO COMPLEMENTAR — O QUE É A FORMAÇÃO (breve)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="font-display text-2xl text-gold mb-8 text-center">
            O que é a Formação ORÁCULA
          </h2>
          
          <p className="text-foreground/60 text-center leading-relaxed mb-8">
            Uma metodologia viva para terapeutas, psicólogas e mentoras do feminino<br />
            que desejam atuar com profundidade sem ferir, invadir ou improvisar.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="border border-gold/15 rounded-lg p-6 bg-card/5">
              <h3 className="font-display text-lg text-gold mb-3">TRAVESSIAS</h3>
              <p className="text-foreground/50 text-sm">
                O mergulho na própria psique. Nada é aplicado sem antes ser vivido.
              </p>
            </div>
            
            <div className="border border-gold/15 rounded-lg p-6 bg-card/5">
              <h3 className="font-display text-lg text-gold mb-3">PORTAIS</h3>
              <p className="text-foreground/50 text-sm">
                O aprendizado estruturado. Aqui você aprende a sustentar outras mulheres.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SEÇÃO — PARA QUEM É / PARA QUEM NÃO É
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 px-6 overflow-hidden">
        <img 
          src={fundoParaQuemE} 
          alt="" 
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,20%,4%)]/70 via-transparent to-[hsl(220,20%,4%)]/70" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-display text-xl text-gold mb-6">Para quem é</h2>
              <ul className="space-y-2 text-foreground/60">
                <li>• terapeutas</li>
                <li>• psicólogas</li>
                <li>• mentoras do feminino</li>
                <li>• facilitadoras de grupos</li>
              </ul>
              <p className="text-foreground/40 italic text-sm mt-4">
                que já estudaram muito, mas sentem que falta eixo.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground/40 mb-6">Para quem não é</h2>
              <ul className="space-y-2 text-foreground/35">
                <li>• busca atalhos</li>
                <li>• copia métodos</li>
                <li>• confunde espiritualidade com ausência de limite</li>
                <li>• não deseja ser atravessada</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SEÇÃO — ÉTICA E SUSTENTAÇÃO
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-2xl text-gold mb-6">
              Ética e Sustentação
            </h2>
            
            <p className="text-foreground/60 leading-relaxed mb-6">
              A ORÁCULA não certifica presença.<br />
              Certifica integração.
            </p>
            
            <ul className="space-y-2 text-foreground/50 mb-6 text-sm">
              <li>• critérios claros de passagem</li>
              <li>• termos éticos desde o onboarding</li>
              <li>• leitura humana do processo</li>
              <li>• limite de atuação profissional</li>
            </ul>
            
            <p className="text-gold/60 italic">
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

      {/* ═══════════════════════════════════════════════════════════════════
          🏛️ 7️⃣ SEÇÃO FINAL — FECHAMENTO INSTITUCIONAL
          Texto curto + Tom: Casa / Pertencimento / Responsabilidade
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 px-6 overflow-hidden">
        <img 
          src={fundoRitual2} 
          alt="" 
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.08]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,20%,4%)] via-transparent to-[hsl(220,20%,4%)]" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-2xl mx-auto text-center"
        >
          <p className="text-foreground/60 leading-relaxed mb-6">
            A Casa Orácula não promete resultados rápidos.<br />
            Ela oferece lugar.
          </p>
          
          <p className="text-foreground/50 mb-6">
            Lugar interno. Lugar simbólico. Lugar profissional.
          </p>
          
          <p className="text-gold italic text-lg">
            Você não entra para aprender.<br />
            Você entra para atravessar.
          </p>
        </motion.div>
      </section>

      {/* Imagem final */}
      <section className="w-full py-6">
        <img 
          src={finalPagina} 
          alt="Casa Orácula" 
          className="w-full max-h-[500px] object-contain opacity-20"
        />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CHAMADO FINAL — CTA discreto
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-foreground/50 mb-8">
            A ORÁCULA não tem pressa.<br />
            Mas, não espera para sempre.<br />
            Entre quando estiver pronta.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline"
              onClick={() => navigate('/auth')}
              className="border-border/30 hover:border-gold/30"
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

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border/10">
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
