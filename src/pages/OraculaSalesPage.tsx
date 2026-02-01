import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { VideoCard } from "@/components/sales/VideoCard";

// Imagens fornecidas pelo usuário
import heroTopo from "@/assets/formacao/hero-topo.png";
import finalPagina from "@/assets/formacao/final-pagina.png";

/**
 * OraculaSalesPage — Página de Apresentação Hi-Ticket da Formação ORÁCULA
 * 
 * ESTRUTURA:
 * 1. Hero → Vídeo 1 → O que é → Como funciona → Primeira Travessia
 * 2. Vídeo 2 → Ferramentas (Grid) → Vídeo 3 → Diferencial → CTA → Rodapé
 */
export default function OraculaSalesPage() {
  const navigate = useNavigate();

  // URLs dos vídeos (configuráveis via app_settings futuramente)
  const VIDEO_1_URL = "https://www.youtube.com/watch?v=PLACEHOLDER_1";
  const VIDEO_2_URL = "https://www.youtube.com/watch?v=PLACEHOLDER_2";
  const VIDEO_3_URL = "https://www.youtube.com/watch?v=PLACEHOLDER_3";

  const ferramentas = [
    { nome: "Mapa Vivo da Heroína", desc: "Onde a jornada ganha forma e limite." },
    { nome: "Jardim da Psiquê", desc: "Integração silenciosa, sem exposição." },
    { nome: "Jardim da Heroína", desc: "Uso ético do símbolo em sessão." },
    { nome: "Oráculo das Portas", desc: "Diagnóstico simbólico, não adivinhação." },
    { nome: "Narroterapia Oracular", desc: "Histórias como instrumento — não espetáculo." },
    { nome: "Sala de Sessão ORÁCULA", desc: "Início, meio e fechamento de campo." },
    { nome: "Checklists de Ego & Ética", desc: "O que não pode ser atravessado agora." },
    { nome: "App com Bloqueios Automáticos", desc: "Nem tudo é liberado. E isso é proteção." },
  ];

  return (
    <div className="min-h-screen bg-[hsl(220,20%,4%)] text-foreground overflow-x-hidden selection:bg-gold/20">
      
      {/* ═══════════════════════════════════════════════════════════════════
          1️⃣ SEÇÃO HERO — ABERTURA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full">
        <img 
          src={heroTopo} 
          alt="Formação Orácula" 
          className="w-full h-auto object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[hsl(220,20%,4%)] to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          🎥 2️⃣ VÍDEO-CARD 1 — A Voz da Orácula
      ═══════════════════════════════════════════════════════════════════ */}
      <VideoCard 
        title="A Voz da Orácula"
        videoUrl={VIDEO_1_URL}
      />

      {/* ═══════════════════════════════════════════════════════════════════
          3️⃣ SEÇÃO — O QUE É A CASA ORÁCULA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-foreground/60 leading-relaxed mb-10">
            A ORÁCULA é uma formação longa, iniciática e ética<br />
            para mulheres que conduzem processos humanos<br />
            e sabem que improvisar profundidade<br />
            tem custo.
          </p>
          
          <p className="text-gold/70 italic">
            Aqui você não aprende rápido.<br />
            Você aprende a sustentar.
          </p>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="flex items-center justify-center py-4">
        <div className="w-16 h-px bg-gold/15" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          🧭 4️⃣ SEÇÃO — COMO A ORÁCULA FUNCIONA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <p className="text-foreground/50 text-center mb-14">
            A ORÁCULA não funciona em módulos.<br />
            Funciona em travessia.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-14">
            {/* Travessias */}
            <div className="text-center">
              <h3 className="font-display text-xl text-gold mb-4">TRAVESSIAS</h3>
              <p className="text-foreground/50 text-sm leading-relaxed">
                Você vive no próprio corpo<br />
                antes de tentar conduzir o corpo da outra.
              </p>
            </div>
            
            {/* Portais */}
            <div className="text-center">
              <h3 className="font-display text-xl text-gold mb-4">PORTAIS</h3>
              <p className="text-foreground/50 text-sm leading-relaxed">
                Você aprende o método<br />
                depois que o símbolo já te atravessou.
              </p>
            </div>
            
            {/* Círculos */}
            <div className="text-center">
              <h3 className="font-display text-xl text-gold mb-4">CÍRCULOS</h3>
              <p className="text-foreground/50 text-sm leading-relaxed">
                Você integra, transmite<br />
                e aprende a sustentar campo coletivo.
              </p>
            </div>
          </div>
          
          <p className="text-foreground/40 text-center text-sm italic">
            Nada é ensinado antes de ser vivido.<br />
            Nada é aplicado antes de ser sustentado.
          </p>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="flex items-center justify-center py-4">
        <div className="w-16 h-px bg-gold/15" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          🌕 5️⃣ SEÇÃO — PRIMEIRA TRAVESSIA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="font-display text-2xl md:text-3xl text-gold mb-8">
            A Heroína e o Templo das Portas
          </h2>
          
          <p className="text-foreground/60 leading-relaxed mb-8">
            Um rito iniciático onde você atravessa<br />
            as Portas da própria psique<br />
            e constrói um Mapa vivo<br />
            que revela onde você pode conduzir —<br />
            e onde ainda não deve.
          </p>
          
          <p className="text-gold/60 italic text-sm">
            Aqui começa a formação.<br />
            Não no método.<br />
            Em você.
          </p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          🎥 6️⃣ VÍDEO-CARD 2 — Não é para todas
      ═══════════════════════════════════════════════════════════════════ */}
      <VideoCard 
        title="Não é para todas"
        videoUrl={VIDEO_2_URL}
        microcopy="Pertencimento não se explica. Se reconhece — ou não."
      />

      {/* Divider */}
      <div className="flex items-center justify-center py-8">
        <div className="w-16 h-px bg-gold/15" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          🧰 7️⃣ SEÇÃO — FERRAMENTAS DA CASA ORÁCULA (GRID)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <p className="text-foreground/50 text-center mb-4">
            Ferramentas não transformam.<br />
            Critério transforma.
          </p>
          
          <p className="text-foreground/35 text-center text-sm mb-14">
            Aqui, cada ferramenta só aparece<br />
            quando o campo sustenta.
          </p>
          
          {/* Grid de Ferramentas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ferramentas.map((ferramenta, i) => (
              <motion.div
                key={ferramenta.nome}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="bg-card/5 border border-border/10 rounded-lg p-5 hover:border-gold/20 transition-colors"
              >
                <p className="text-foreground/80 font-medium text-sm mb-2">
                  {ferramenta.nome}
                </p>
                <p className="text-foreground/40 text-xs leading-relaxed">
                  {ferramenta.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          🎥 8️⃣ VÍDEO-CARD 3 — O Convite
      ═══════════════════════════════════════════════════════════════════ */}
      <VideoCard 
        title="O Convite"
        videoUrl={VIDEO_3_URL}
        microcopy="Entrar não é comprar. É assumir um lugar."
      />

      {/* Divider */}
      <div className="flex items-center justify-center py-8">
        <div className="w-16 h-px bg-gold/15" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          🜄 9️⃣ SEÇÃO — DIFERENCIAL
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-foreground/60 leading-relaxed mb-8">
            Antes de símbolo, a ORÁCULA ensina limite.<br />
            Antes de rito, ensina ego.<br />
            Antes de mudança, ensina<br />
            quando não mudar.
          </p>
          
          <p className="text-foreground/40 italic text-sm">
            Aqui, neuroplasticidade não é promessa.<br />
            É responsabilidade.
          </p>
        </motion.div>
      </section>

      {/* Imagem final sutil */}
      <section className="w-full py-4">
        <img 
          src={finalPagina} 
          alt="" 
          aria-hidden="true"
          className="w-full max-h-[400px] object-contain opacity-15"
        />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          🜂 🔟 CTA FINAL
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-md mx-auto text-center"
        >
          <Button 
            onClick={() => navigate('/planos')}
            size="lg"
            className="bg-gold text-background hover:bg-gold/90 px-10 py-6 text-base"
          >
            Entrar na Casa Orácula
          </Button>
          
          <p className="text-foreground/35 text-xs mt-6 italic">
            Esta não é uma decisão impulsiva.<br />
            É uma escolha de caminho.
          </p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          🕯️ 1️⃣1️⃣ RODAPÉ — FRASE FINAL
      ═══════════════════════════════════════════════════════════════════ */}
      <footer className="py-16 px-6 border-t border-border/10">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-foreground/40 text-sm leading-relaxed italic">
            Quando uma mulher aprende a sustentar processos,<br />
            ela não cura o mundo —<br />
            ela impede que o mundo adoeça mais.
          </p>
        </div>
      </footer>
    </div>
  );
}
