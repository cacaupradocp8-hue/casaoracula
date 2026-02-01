import { motion } from "framer-motion";

export function FormacaoFooter() {
  return (
    <footer className="py-12 px-6 border-t border-gold/10">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-display text-gold/50 text-lg mb-4">
            CASA ORÁCULA
          </p>
          
          <p className="font-body text-foreground/30 text-xs leading-relaxed max-w-xl mx-auto mb-6">
            A Casa Orácula e suas ferramentas operam exclusivamente em linguagem simbólica e narrativa. 
            Este programa não substitui acompanhamento psicológico, psiquiátrico ou qualquer tratamento de saúde mental. 
            Não oferecemos diagnósticos, conselhos terapêuticos ou soluções pessoais.
          </p>
          
          <p className="font-body text-foreground/20 text-xs">
            © {new Date().getFullYear()} Casa Orácula. Todos os direitos reservados.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
