import { useFormacaoContent } from "@/hooks/useFormacaoContent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, X, Users, Compass, BookOpen, FlaskConical, Sparkles, Lock, TrendingUp } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  users: Users,
  compass: Compass,
  "book-open": BookOpen,
  "flask-conical": FlaskConical,
  sparkles: Sparkles,
  lock: Lock,
  "trending-up": TrendingUp,
};

export default function FormacaoOracula() {
  const { sections, isLoading } = useFormacaoContent();

  const scrollToVSL = () => {
    document.getElementById("vsl-section")?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-gold">Carregando...</div>
      </div>
    );
  }

  const hero = sections.hero || {};
  const vsl = sections.vsl || {};
  const oQueE = sections.o_que_e || {};
  const appDiferencial = sections.app_diferencial || {};
  const paraQuem = sections.para_quem || {};
  const oQueRecebe = sections.o_que_recebe || {};
  const planos = sections.planos || {};
  const autoridade = sections.autoridade || {};
  const faq = sections.faq || {};

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            {hero.titulo || "ORÁCULA — A Formação"}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {hero.subtitulo || "Uma certificação para profissionais do feminino."}
          </p>
          <Button
            onClick={scrollToVSL}
            variant="gold"
            size="xl"
            className="mt-8"
          >
            {hero.cta_texto || "Quero entrar na Formação ORÁCULA"}
          </Button>
        </div>
      </section>

      {/* VSL Section */}
      <section id="vsl-section" className="py-20 px-4 bg-card/50">
        <div className="max-w-4xl mx-auto space-y-8">
          <p className="text-center text-lg text-muted-foreground">
            {vsl.texto_acima || "Assista ao vídeo e entenda a formação."}
          </p>
          
          {vsl.video_url ? (
            <div className="aspect-video rounded-lg overflow-hidden border border-border/50 shadow-lg">
              <iframe
                src={vsl.video_url.replace("watch?v=", "embed/").replace("vimeo.com/", "player.vimeo.com/video/")}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Vídeo de apresentação da formação ORÁCULA"
              />
            </div>
          ) : (
            <div className="aspect-video rounded-lg bg-secondary/50 border border-border/50 flex items-center justify-center">
              <p className="text-muted-foreground">Vídeo será adicionado em breve</p>
            </div>
          )}
          
          <p className="text-center text-lg text-muted-foreground">
            {vsl.texto_abaixo || "Essa formação forma terapeutas simbólicas."}
          </p>
          
          <div className="text-center">
            <Button variant="gold" size="lg">
              {vsl.cta_texto || "Entrar na Formação ORÁCULA"}
            </Button>
          </div>
        </div>
      </section>

      {/* O que é Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground">
            {oQueE.titulo || "O que é a Formação ORÁCULA"}
          </h2>
          <ul className="space-y-4">
            {(oQueE.items || []).map((item: string, index: number) => (
              <li key={index} className="flex items-start gap-3 text-lg text-muted-foreground">
                <Check className="w-6 h-6 text-gold shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* App Diferencial Section */}
      <section className="py-20 px-4 bg-card/50">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              {appDiferencial.titulo || "O APP Casa Orácula"}
            </h2>
            <p className="text-xl text-gold font-medium">
              {appDiferencial.subtitulo || "O app não é bônus. Ele é parte do método."}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(appDiferencial.items || []).map((item: { icone: string; texto: string }, index: number) => {
              const IconComponent = iconMap[item.icone] || Check;
              return (
                <Card key={index} className="bg-secondary/30 border-border/50 hover:border-gold/30 transition-colors">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-gold/10">
                      <IconComponent className="w-6 h-6 text-gold" />
                    </div>
                    <span className="text-foreground">{item.texto}</span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Para Quem Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground">
            {paraQuem.titulo || "Para quem é"}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {(paraQuem.incluidos || []).map((item: string, index: number) => (
                <div key={index} className="flex items-center gap-3 text-lg">
                  <Check className="w-6 h-6 text-green-500" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="flex items-start gap-3 p-6 rounded-lg bg-destructive/10 border border-destructive/20">
              <X className="w-6 h-6 text-destructive shrink-0" />
              <span className="text-muted-foreground">{paraQuem.excluidos}</span>
            </div>
          </div>
        </div>
      </section>

      {/* O que recebe Section */}
      <section className="py-20 px-4 bg-card/50">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground">
            {oQueRecebe.titulo || "O que você recebe"}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {(oQueRecebe.items || []).map((item: string, index: number) => (
              <Card key={index} className="bg-secondary/30 border-border/50">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gold" />
                  <span className="text-foreground">{item}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Planos Section */}
      <section id="planos-section" className="py-20 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground">
            {planos.titulo || "Escolha seu caminho"}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {(planos.planos || []).map((plano: any, index: number) => (
              <Card 
                key={index} 
                className={`relative overflow-hidden ${
                  plano.destaque 
                    ? "border-gold shadow-gold bg-gradient-to-b from-gold/10 to-transparent" 
                    : "border-border/50 bg-card"
                }`}
              >
                {plano.destaque && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold to-gold-dark" />
                )}
                <CardHeader className="text-center space-y-4 pb-4">
                  <CardTitle className="font-display text-2xl text-foreground">
                    {plano.nome}
                  </CardTitle>
                  <div>
                    <span className="text-4xl font-bold text-gold">{plano.preco}</span>
                    <p className="text-muted-foreground text-sm mt-1">{plano.periodo}</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {(plano.items || []).map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {plano.checkout_url ? (
                    <a href={plano.checkout_url} target="_blank" rel="noopener noreferrer" className="block">
                      <Button 
                        variant={plano.destaque ? "gold" : "outline"} 
                        className="w-full"
                      >
                        Garantir minha vaga
                      </Button>
                    </a>
                  ) : (
                    <Button 
                      variant={plano.destaque ? "gold" : "outline"} 
                      className="w-full"
                      disabled
                    >
                      Em breve
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Autoridade Section */}
      <section className="py-20 px-4 bg-card/50">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="font-display text-2xl md:text-3xl text-foreground italic leading-relaxed">
            "{autoridade.texto || "ORÁCULA é uma formação que respeita o simbólico."}"
          </blockquote>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground">
            {faq.titulo || "Perguntas Frequentes"}
          </h2>
          
          <Accordion type="single" collapsible className="w-full">
            {(faq.items || []).map((item: { pergunta: string; resposta: string }, index: number) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-border/50">
                <AccordionTrigger className="text-left text-foreground hover:text-gold">
                  {item.pergunta}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.resposta}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-4 bg-gradient-to-t from-gold/10 via-transparent to-transparent">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Pronta para começar sua travessia?
          </h2>
          <Button
            onClick={() => document.getElementById("planos-section")?.scrollIntoView({ behavior: "smooth" })}
            variant="gold"
            size="xl"
          >
            Escolher meu plano
          </Button>
        </div>
      </section>
    </div>
  );
}
