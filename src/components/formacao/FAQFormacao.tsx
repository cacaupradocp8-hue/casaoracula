import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQItem {
  pergunta: string;
  resposta: string;
}

interface FAQFormacaoProps {
  titulo?: string;
  items?: FAQItem[];
}

export function FAQFormacao({ 
  titulo = "Perguntas frequentes",
  items = []
}: FAQFormacaoProps) {
  if (items.length === 0) return null;

  return (
    <section className="py-20 md:py-32 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="font-display text-2xl md:text-3xl text-foreground text-center mb-12"
        >
          {titulo}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.7 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {items.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className="border-border/30"
              >
                <AccordionTrigger className="text-left font-body text-foreground/90 hover:text-gold hover:no-underline py-5">
                  {item.pergunta}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-body leading-relaxed pb-5">
                  {item.resposta}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
