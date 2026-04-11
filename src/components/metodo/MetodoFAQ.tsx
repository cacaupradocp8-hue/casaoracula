import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const perguntas = [
  {
    q: 'Preciso ser terapeuta para participar?',
    a: 'Não necessariamente. O Método Orácula é aberto a mulheres que trabalham com processos humanos — terapeutas, psicólogas, mentoras, facilitadoras de grupos.',
  },
  {
    q: 'É uma formação online?',
    a: 'Sim. Toda a formação acontece dentro da plataforma Casa Orácula, com aulas, travessias, ferramentas e supervisão integradas.',
  },
  {
    q: 'Qual a diferença entre os planos?',
    a: 'Cada plano oferece uma profundidade diferente de acesso. Explorar dá acesso às ferramentas básicas. Atravessar inclui travessias e clube de leitura. Conduzir é para formação profissional completa.',
  },
  {
    q: 'Quanto tempo dura a formação?',
    a: 'A formação é progressiva. Não se avança por tempo, mas por maturidade. Cada nível exige prática, evidência e revisão antes da passagem.',
  },
  {
    q: 'Posso cancelar a qualquer momento?',
    a: 'Sim. Não há fidelidade. Porém, a formação é um processo contínuo — cada interrupção impacta a jornada.',
  },
];

export function MetodoFAQ() {
  return (
    <motion.section {...fadeInUp} transition={{ duration: 0.8 }} className="py-16 md:py-24">
      <h2 className="text-3xl md:text-4xl font-display text-foreground mb-10 text-center tracking-wide">
        Perguntas Frequentes
      </h2>

      <Accordion type="single" collapsible className="max-w-2xl mx-auto space-y-2">
        {perguntas.map((item, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="border border-border/50 rounded-lg px-5 bg-card/20">
            <AccordionTrigger className="text-foreground text-sm font-medium hover:no-underline py-4">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-foreground/80 text-sm leading-relaxed pb-4">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.section>
  );
}
