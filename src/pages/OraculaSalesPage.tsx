import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Shield, BookOpen, Users, Sparkles } from "lucide-react";

/**
 * OraculaSalesPage — Página de Vendas da Formação Orácula
 * 
 * Página pública para visitantes e usuárias não matriculadas.
 * Design contemplativo, minimalista, com tom iniciático.
 * 
 * NOVO COMPONENTE - Sem herança de componentes anteriores.
 */
export default function OraculaSalesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[hsl(220,20%,6%)] text-foreground overflow-x-hidden selection:bg-gold/20">
      
      {/* ═══════════════════════════════════════════════════════════════════
          HERO — Portal de Entrada
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-24">
        {/* Gradiente sutil de fundo */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.02] to-transparent pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          {/* Símbolo */}
          <div className="mb-8">
            <span className="text-4xl text-gold/60">🜂</span>
          </div>
          
          {/* Título Principal */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground tracking-wide leading-tight mb-6">
            Formação Orácula
          </h1>
          
          {/* Subtítulo */}
          <p className="font-display text-xl md:text-2xl text-gold/80 italic mb-8">
            Uma jornada iniciática para quem sustenta travessias
          </p>
          
          {/* Frase de impacto */}
          <p className="text-lg text-muted-foreground/80 max-w-xl mx-auto mb-12 leading-relaxed">
            Aqui não formamos terapeutas. Aqui formamos guardiãs — 
            profissionais que sabem quando falar, quando silenciar, e quando apenas sustentar.
          </p>
          
          {/* CTA */}
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/planos')}
            className="border-gold/30 text-gold hover:bg-gold/10 hover:border-gold/50"
          >
            Conhecer os caminhos
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SILÊNCIO — Pausa contemplativa
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="font-display text-2xl md:text-3xl text-foreground/70 italic leading-relaxed">
            "Algumas travessias só começam<br />
            quando ninguém está tentando convencer você."
          </p>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="flex items-center justify-center py-8">
        <span className="text-gold/40 text-xl">🌑</span>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          O QUE É — Apresentação
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
            O que é a Formação Orácula
          </h2>
          
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <p>
              A Formação Orácula é um percurso de treinamento profundo para profissionais 
              que desejam dominar a arte de sustentar travessias psíquicas com rigor, ética e presença.
            </p>
            
            <p>
              Não é um curso de técnicas. É uma arquitetura viva — onde você aprende a ler 
              os campos, a usar as ferramentas oraculares e a conduzir processos terapêuticos 
              que tocam o simbólico sem perder o chão clínico.
            </p>
            
            <p className="text-gold/90 italic">
              Aqui, profundidade não é luxo. É responsabilidade.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="flex items-center justify-center py-8">
        <span className="text-gold/40 text-xl">🜁</span>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          PILARES — Estrutura da Formação
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-2xl md:text-3xl text-gold mb-16 text-center"
          >
            Os Três Pilares
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                symbol: "🜂",
                title: "Portas",
                description: "Onde a psique está. Limiares, momentos internos, territórios de entrada."
              },
              {
                symbol: "🌑",
                title: "Labirintos",
                description: "Como a psique se move. Processo, complexidade inteligente, travessia."
              },
              {
                symbol: "🜁",
                title: "Torres",
                description: "Por que a forma existe. Estrutura, sustentação, dignidade da prática."
              }
            ].map((pilar, index) => (
              <motion.div
                key={pilar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="text-center p-6 border border-border/20 rounded-lg bg-card/5 hover:border-gold/20 transition-colors"
              >
                <span className="text-3xl mb-4 block">{pilar.symbol}</span>
                <h3 className="font-display text-xl text-foreground mb-3">{pilar.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{pilar.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="flex items-center justify-center py-8">
        <span className="text-gold/40 text-xl">✦</span>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          PARA QUEM É — Reconhecimento
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="font-display text-2xl md:text-3xl text-gold mb-10 text-center">
            Para quem é esta jornada
          </h2>
          
          <div className="space-y-4">
            {[
              "Você sente antes de falar. Percebe quando algo abre.",
              "Já conduziu processos profundos, mas falta território para sustentar.",
              "Busca rigor ético sem perder a dimensão simbólica.",
              "Quer dominar ferramentas oraculares com fundamento clínico.",
              "Está pronta para ser guardiã, não apenas facilitadora."
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 text-foreground/80"
              >
                <Star className="w-4 h-4 text-gold mt-1 flex-shrink-0" />
                <span>{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="flex items-center justify-center py-8">
        <span className="text-gold/40 text-xl">🜃</span>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          O QUE VOCÊ VAI APRENDER
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-2xl md:text-3xl text-gold mb-12 text-center"
          >
            O que você vai dominar
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: BookOpen, title: "Leitura de Campos", desc: "Identificar territórios psíquicos e portas de entrada" },
              { icon: Shield, title: "Ética Oracular", desc: "Conduzir com responsabilidade e sem projeção" },
              { icon: Users, title: "Condução de Sessões", desc: "Sustentar travessias com presença e rigor" },
              { icon: Sparkles, title: "Ferramentas Simbólicas", desc: "Big5, Eneagrama, Narroterapia e mais" }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-5 border border-border/20 rounded-lg bg-card/5"
              >
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FECHAMENTO — CTA Final
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="font-display text-2xl md:text-3xl text-foreground/80 italic leading-relaxed mb-10">
            "O valor não está no acesso.<br />
            Está na responsabilidade de quem atravessa."
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
