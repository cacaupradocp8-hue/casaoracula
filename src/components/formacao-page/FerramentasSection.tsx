import { motion } from "framer-motion";
import { 
  Map, 
  Flower2, 
  Eye, 
  BookOpen, 
  CheckSquare, 
  Sparkles, 
  PenLine,
  BarChart3
} from "lucide-react";

export function FerramentasSection() {
  const ferramentas = [
    { icon: Map, nome: "Mapa Vivo da Heroína" },
    { icon: Flower2, nome: "Jardim da Psique" },
    { icon: Eye, nome: "Oráculo das Portas" },
    { icon: BookOpen, nome: "Biblioteca de Narrativas" },
    { icon: CheckSquare, nome: "Checklists de condução" },
    { icon: Sparkles, nome: "Prompts da Sibila por Portal" },
    { icon: PenLine, nome: "Espaços de registro e integração" },
    { icon: BarChart3, nome: "Avaliação automática + avaliação humana" }
  ];

  return (
    <section className="py-20 md:py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-gold/60 text-sm tracking-[0.2em] uppercase font-body mb-4 block">
            🜂
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            As Ferramentas da <span className="text-gold">Casa</span>
          </h2>
          
          <p className="font-body text-foreground/60 mt-6">
            Ao entrar na ORÁCULA, você acessa um <span className="text-gold/80">App exclusivo</span>, com:
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {ferramentas.map((ferramenta, index) => (
            <motion.div
              key={ferramenta.nome}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
              className="p-4 md:p-6 border border-gold/10 bg-gradient-to-b from-gold/[0.02] to-transparent rounded-sm text-center group hover:border-gold/20 transition-colors"
            >
              <ferramenta.icon className="w-6 h-6 text-gold/60 mx-auto mb-3 group-hover:text-gold/80 transition-colors" />
              <p className="font-body text-foreground/70 text-xs md:text-sm leading-tight">
                {ferramenta.nome}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center"
        >
          <p className="font-display text-foreground/50 italic">
            Tudo construído para não depender da memória,<br />
            da intuição solta ou do improviso.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
