import { motion } from "framer-motion";
import { OraclePhrase } from "./OraclePhrase";

interface SectionSilencioProps {
  lines?: string[];
}

export function SectionSilencio({ 
  lines = [
    "Algumas travessias",
    "só começam",
    "quando ninguém está tentando convencer você."
  ] 
}: SectionSilencioProps) {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-6 py-32">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.5 }}
        className="max-w-2xl mx-auto text-center space-y-2"
      >
        {lines.map((line, index) => (
          <OraclePhrase key={index} delay={index * 0.3}>
            {line}
          </OraclePhrase>
        ))}
      </motion.div>
    </section>
  );
}
