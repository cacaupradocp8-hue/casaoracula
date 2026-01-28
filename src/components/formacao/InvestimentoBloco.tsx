import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Plano {
  nome: string;
  preco: string;
  periodo: string;
  descricao?: string;
  items: string[];
  destaque?: boolean;
  checkout_url?: string;
}

interface InvestimentoBlocoProps {
  titulo?: string;
  subtitulo?: string;
  planos?: Plano[];
  notaFinal?: string;
}

export function InvestimentoBloco({ 
  titulo = "O investimento",
  subtitulo = "Clareza sobre valores e formas de entrada",
  planos = [],
  notaFinal = "Não há descontos, urgência artificial ou promoções. O valor é o que representa: uma formação séria exige investimento real."
}: InvestimentoBlocoProps) {
  return (
    <section className="py-20 md:py-32 px-6 bg-card/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">
            {titulo}
          </h2>
          <p className="text-muted-foreground font-body">
            {subtitulo}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {planos.map((plano, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative rounded-lg border p-6 ${
                plano.destaque 
                  ? "border-gold/50 bg-gradient-to-b from-gold/5 to-transparent" 
                  : "border-border/50 bg-card/50"
              }`}
            >
              {plano.destaque && (
                <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
              )}
              
              <div className="text-center mb-6">
                <h3 className="font-display text-xl text-foreground mb-2">
                  {plano.nome}
                </h3>
                <div className="mb-1">
                  <span className="text-2xl font-display text-gold">
                    {plano.preco}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-body">
                  {plano.periodo}
                </p>
              </div>

              <ul className="space-y-3 mb-6">
                {plano.items.map((item, i) => (
                  <li key={i} className="text-sm text-foreground/80 font-body flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {plano.checkout_url ? (
                <a 
                  href={plano.checkout_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button 
                    variant={plano.destaque ? "gold" : "outline"} 
                    className="w-full"
                  >
                    Escolher este caminho
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
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center text-sm text-muted-foreground/70 font-body max-w-2xl mx-auto"
        >
          {notaFinal}
        </motion.p>
      </div>
    </section>
  );
}
