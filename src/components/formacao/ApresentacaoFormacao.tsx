import { motion } from "framer-motion";
import { Clock, BookOpen, Users, Award } from "lucide-react";

interface ApresentacaoFormacaoProps {
  titulo?: string;
  subtitulo?: string;
  detalhes?: {
    duracao?: string;
    estrutura?: string;
    presenca?: string;
    ritoFinal?: string;
  };
}

export function ApresentacaoFormacao({ 
  titulo = "Formação ORÁCULA",
  subtitulo = "Formação Profissional em Leitura Simbólica da Psique Feminina",
  detalhes = {
    duracao: "12 meses de imersão formativa",
    estrutura: "Travessias semanais + ferramentas práticas + supervisões ao vivo",
    presenca: "Acompanhamento contínuo durante toda a jornada formativa",
    ritoFinal: "Certificação e rito de passagem para terapeutas formadas"
  }
}: ApresentacaoFormacaoProps) {
  const items = [
    { icon: Clock, label: "Duração", value: detalhes.duracao },
    { icon: BookOpen, label: "Estrutura", value: detalhes.estrutura },
    { icon: Users, label: "Presença", value: detalhes.presenca },
    { icon: Award, label: "Rito Final", value: detalhes.ritoFinal },
  ];

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
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
            {titulo}
          </h2>
          <p className="text-muted-foreground text-lg font-body">
            {subtitulo}
          </p>
        </motion.div>

        <div className="grid gap-6 md:gap-8">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex items-start gap-4 p-6 rounded-lg bg-card/50 border border-border/50"
            >
              <div className="p-2 rounded-lg bg-gold/10 shrink-0">
                <item.icon className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-wide text-gold/80 mb-1 font-body">
                  {item.label}
                </h3>
                <p className="text-foreground/90 font-body">
                  {item.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
