import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import atmosfera2 from "@/assets/formacao/atmosfera-ritual-02.png";

export function ChamadoFinalSection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 md:py-40 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src={atmosfera2} 
          alt="" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/70 to-[#0a0a0a]" />
      </div>

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-gold/60 text-sm tracking-[0.2em] uppercase font-body mb-8 block">
            🌑 Um último chamado
          </span>
          
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-8">
            A Casa Orácula não promete sucesso rápido.
          </h2>
          
          <p className="font-display text-2xl md:text-3xl text-gold/80 mb-12">
            Ela oferece <span className="italic">lugar</span>.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <p className="font-body text-foreground/60 text-lg leading-relaxed">
            Lugar interno.<br />
            Lugar simbólico.<br />
            Lugar profissional.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <div className="h-px w-24 bg-gold/20 mx-auto mb-8" />
          
          <p className="font-display text-xl md:text-2xl text-foreground/70 italic leading-relaxed">
            "Você não entra para aprender.<br />
            Você entra para atravessar.<br />
            E só atravessa quem aceita não voltar igual."
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="space-y-6"
        >
          <p className="font-body text-gold/70 text-lg">
            🗝️ Se você sentiu o chamado, a Casa está aberta.
          </p>
          
          <Button
            onClick={() => navigate('/planos')}
            size="lg"
            className="bg-gold/90 hover:bg-gold text-background font-body text-base px-10 py-6 h-auto"
          >
            Conhecer os Caminhos
          </Button>
          
          <p className="font-body text-foreground/40 text-sm italic pt-4">
            Entre quando estiver pronta.<br />
            A ORÁCULA não tem pressa. Mas não espera para sempre.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
