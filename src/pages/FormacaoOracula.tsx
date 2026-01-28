import { useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  X, 
  Play, 
  ChevronDown, 
  Sparkles, 
  Users, 
  BookOpen, 
  Award,
  Clock,
  FlaskConical,
  Lock,
  TrendingUp,
  Compass
} from "lucide-react";
import { cn } from "@/lib/utils";

// Import images
import heroPortal from "@/assets/formacao/hero-portal.jpg";
import circuloOracula from "@/assets/formacao/circulo-oracula.jpg";
import metodoLivro from "@/assets/formacao/metodo-livro.jpg";

interface FormacaoContent {
  [key: string]: Record<string, unknown>;
}

// Animated divider component
const RitualDivider = () => (
  <div className="flex items-center justify-center gap-4 py-16">
    <div className="h-px w-24 bg-gradient-to-r from-transparent to-gold/40" />
    <div className="w-2 h-2 rounded-full bg-gold/60" />
    <div className="h-px w-24 bg-gradient-to-l from-transparent to-gold/40" />
  </div>
);

// Feature icon mapping
const FEATURE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  users: Users,
  compass: Compass,
  'book-open': BookOpen,
  'flask-conical': FlaskConical,
  sparkles: Sparkles,
  lock: Lock,
  'trending-up': TrendingUp
};

export default function FormacaoOracula() {
  const [content, setContent] = useState<FormacaoContent>({});
  const [isLoading, setIsLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 1.1]);

  const fetchContent = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("formacao_oracula_content")
        .select("section_key, content");

      if (error) throw error;

      const contentMap: FormacaoContent = {};
      data?.forEach((item) => {
        contentMap[item.section_key] = item.content as Record<string, unknown>;
      });

      setContent(contentMap);
    } catch (error) {
      console.error("Error fetching formacao content:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-body">Preparando a travessia...</p>
        </motion.div>
      </div>
    );
  }

  // Extract content with safe fallbacks
  const hero = content.hero || {};
  const oQueE = content.o_que_e || {};
  const paraQuem = content.para_quem || {};
  const oQueRecebe = content.o_que_recebe || {};
  const appDiferencial = content.app_diferencial || {};
  const planos = content.planos || {};
  const faq = content.faq || {};
  const autoridade = content.autoridade || {};

  // Safe array extraction
  const oQueEItems = Array.isArray(oQueE.items) ? oQueE.items as string[] : [];
  const oQueRecebeItems = Array.isArray(oQueRecebe.items) ? oQueRecebe.items as string[] : [];
  const paraQuemIncluidos = Array.isArray(paraQuem.incluidos) ? paraQuem.incluidos as string[] : [];
  const paraQuemExcluidos = paraQuem.excluidos as string || "";
  const appItems = Array.isArray(appDiferencial.items) 
    ? (appDiferencial.items as { icone: string; texto: string }[]) 
    : [];
  const planosItems = Array.isArray(planos.planos) 
    ? (planos.planos as { nome: string; preco: string; periodo: string; items: string[]; destaque?: boolean; checkout_url?: string }[]) 
    : [];
  const faqItems = Array.isArray(faq.items) 
    ? (faq.items as { pergunta: string; resposta: string }[]) 
    : [];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════════════════════
          HERO SECTION - Full-screen immersive
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background image with parallax */}
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0"
        >
          <img 
            src={heroPortal} 
            alt="Portal da Formação ORÁCULA" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </motion.div>

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <span className="inline-block text-gold/80 text-sm tracking-[0.3em] uppercase mb-6 font-body">
              Formação Profissional
            </span>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-foreground mb-6 leading-tight">
              {(hero.titulo as string) || "ORÁCULA"}
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-10 font-body leading-relaxed">
              {(hero.subtitulo as string) || "Uma certificação para terapeutas, psicólogas e mentoras do feminino que querem profundidade simbólica, método aplicável e um APP profissional."}
            </p>
            <Button 
              variant="gold" 
              size="lg" 
              className="text-lg px-10 py-6 rounded-full shadow-lg shadow-gold/20"
              onClick={() => document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Play className="w-5 h-5 mr-2" />
              {(hero.cta_texto as string) || "Quero entrar na Formação"}
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8 text-gold/60" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          O QUE É - Split section with image
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <img 
                src={metodoLivro} 
                alt="Método ORÁCULA" 
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gold/20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-gold text-sm tracking-[0.2em] uppercase font-body">Sobre a formação</span>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mt-3 mb-6">
              {(oQueE.titulo as string) || "O que é a Formação ORÁCULA"}
            </h2>
            <ul className="space-y-4">
              {oQueEItems.map((item, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-gold" />
                  </div>
                  <span className="text-foreground/80 font-body">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      <RitualDivider />

      {/* ═══════════════════════════════════════════════════════════════════
          PARA QUEM É - Elegant cards
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              {(paraQuem.titulo as string) || "Para quem é"}
            </h2>
            <p className="text-muted-foreground font-body max-w-xl mx-auto">
              Esta formação foi desenhada para profissionais que buscam profundidade e ética
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Para quem É */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gold/5 to-transparent rounded-2xl p-8 border border-gold/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-gold" />
                </div>
                <h3 className="font-display text-xl text-foreground">É para você se...</h3>
              </div>
              <ul className="space-y-4">
                {paraQuemIncluidos.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-gold shrink-0 mt-1" />
                    <span className="text-foreground/80 font-body text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Para quem NÃO É */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-muted/20 rounded-2xl p-8 border border-border/50"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center">
                  <X className="w-5 h-5 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl text-muted-foreground">Não é para você se...</h3>
              </div>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">
                {paraQuemExcluidos || "Não é para curiosas ou consumo superficial. Esta é uma formação que exige compromisso, tempo e disposição para atravessar processos reais."}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          O QUE VOCÊ RECEBE - Visual grid
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              {(oQueRecebe.titulo as string) || "O que você recebe"}
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {oQueRecebeItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-card/50 rounded-xl p-6 border border-border/50 hover:border-gold/30 transition-all duration-300"
              >
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-gold" />
                </div>
                <p className="text-foreground/90 font-body">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          APP DIFERENCIAL - With background image
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img 
            src={circuloOracula} 
            alt="Círculo ORÁCULA" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-gold text-sm tracking-[0.2em] uppercase font-body">Tecnologia viva</span>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mt-3 mb-4">
              {(appDiferencial.titulo as string) || "O APP Casa Orácula"}
            </h2>
            <p className="text-muted-foreground font-body max-w-xl mx-auto">
              {(appDiferencial.subtitulo as string) || "O app não é bônus. Ele é parte do método."}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {appItems.map((item, index) => {
              const IconComponent = FEATURE_ICONS[item.icone] || Sparkles;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 bg-card/60 backdrop-blur-sm rounded-xl p-5 border border-border/50"
                >
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                    <IconComponent className="w-5 h-5 text-gold" />
                  </div>
                  <span className="text-foreground/90 font-body text-sm">{item.texto}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <RitualDivider />

      {/* ═══════════════════════════════════════════════════════════════════
          AUTORIDADE
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <blockquote className="font-display text-xl md:text-2xl text-foreground/90 italic leading-relaxed">
            "{(autoridade.texto as string) || "ORÁCULA é uma formação que respeita o simbólico, a clínica, a ética e o tempo da psique."}"
          </blockquote>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          PLANOS - Premium pricing cards
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="planos" className="py-24 px-6 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              {(planos.titulo as string) || "Escolha seu caminho"}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {planosItems.map((plano, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "relative rounded-2xl p-8 transition-all duration-300",
                  plano.destaque 
                    ? "bg-gradient-to-b from-gold/10 to-transparent border-2 border-gold/40 shadow-xl shadow-gold/10" 
                    : "bg-card/50 border border-border/50 hover:border-gold/30"
                )}
              >
                {plano.destaque && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gold text-background text-xs font-bold px-4 py-1 rounded-full">
                      RECOMENDADO
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="font-display text-2xl text-foreground mb-2">{plano.nome}</h3>
                  <div className="mb-2">
                    <span className="text-3xl font-display text-gold">{plano.preco}</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-body">{plano.periodo}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {Array.isArray(plano.items) && plano.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                      <span className="text-foreground/80 font-body text-sm">{item}</span>
                    </li>
                  ))}
                </ul>

                {plano.checkout_url ? (
                  <a href={plano.checkout_url} target="_blank" rel="noopener noreferrer">
                    <Button 
                      variant={plano.destaque ? "gold" : "outline"} 
                      className="w-full rounded-full"
                    >
                      Escolher este caminho
                    </Button>
                  </a>
                ) : (
                  <Button 
                    variant={plano.destaque ? "gold" : "outline"} 
                    className="w-full rounded-full"
                    disabled
                  >
                    Em breve
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FAQ - Accordion style
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              {(faq.titulo as string) || "Perguntas Frequentes"}
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <FAQItem key={index} pergunta={item.pergunta} resposta={item.resposta} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FECHAMENTO - Final CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent to-gold/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="font-display text-2xl md:text-3xl text-foreground mb-8 leading-relaxed">
            Se você chegou até aqui, é porque algo em você já sabe que esse é o caminho.
          </p>
          <Button 
            variant="gold" 
            size="lg" 
            className="text-lg px-10 py-6 rounded-full shadow-lg shadow-gold/20"
            onClick={() => document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Iniciar minha travessia
          </Button>
        </motion.div>
      </section>

      {/* Footer note */}
      <footer className="py-8 px-6 border-t border-border/30">
        <p className="text-center text-xs text-muted-foreground/60 font-body max-w-xl mx-auto">
          A Formação ORÁCULA não é terapia nem substitui acompanhamento profissional. 
          É uma formação para profissionais do cuidado.
        </p>
      </footer>
    </div>
  );
}

// FAQ Item component with expand/collapse
function FAQItem({ pergunta, resposta, index }: { pergunta: string; resposta: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="border border-border/50 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/10 transition-colors"
      >
        <span className="font-display text-foreground pr-4">{pergunta}</span>
        <ChevronDown className={cn(
          "w-5 h-5 text-gold shrink-0 transition-transform duration-300",
          isOpen && "rotate-180"
        )} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="px-6 pb-6 text-muted-foreground font-body text-sm leading-relaxed">
          {resposta}
        </p>
      </motion.div>
    </motion.div>
  );
}
