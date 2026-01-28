import { motion } from "framer-motion";
import { Shield, Eye, MessageCircle, Heart } from "lucide-react";

interface ComoESustentadaProps {
  titulo?: string;
  subtitulo?: string;
  elementos?: {
    icone: string;
    titulo: string;
    descricao: string;
  }[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  shield: Shield,
  eye: Eye,
  "message-circle": MessageCircle,
  heart: Heart,
};

export function ComoESustentada({ 
  titulo = "Como a travessia é sustentada",
  subtitulo = "A formação não te deixa sozinha. Cada etapa tem presença e contorno.",
  elementos = [
    {
      icone: "eye",
      titulo: "Presença formativa",
      descricao: "Encontros semanais ao vivo para aprofundamento, dúvidas e integração do conteúdo estudado."
    },
    {
      icone: "message-circle",
      titulo: "Acompanhamento contínuo",
      descricao: "Grupo privado para troca entre alunas e acesso direto à equipe de suporte pedagógico."
    },
    {
      icone: "shield",
      titulo: "Supervisão de casos",
      descricao: "Espaços dedicados para discutir atendimentos reais com orientação ética e simbólica."
    },
    {
      icone: "heart",
      titulo: "Limites éticos claros",
      descricao: "Orientação explícita sobre o que a formação habilita e o que permanece fora do escopo de atuação."
    }
  ]
}: ComoESustentadaProps) {
  return (
    <section className="py-20 md:py-32 px-6">
      <div className="max-w-3xl mx-auto">
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

        <div className="grid md:grid-cols-2 gap-6">
          {elementos.map((elemento, index) => {
            const IconComponent = iconMap[elemento.icone] || Shield;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 rounded-lg border border-border/50 bg-card/30"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-gold/10 shrink-0">
                    <IconComponent className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-foreground mb-2">
                      {elemento.titulo}
                    </h3>
                    <p className="text-muted-foreground text-sm font-body leading-relaxed">
                      {elemento.descricao}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
