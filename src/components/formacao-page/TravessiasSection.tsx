import { motion } from "framer-motion";

interface TravessiaCardProps {
  numero: string;
  titulo: string;
  subtitulo: string;
  descricao: string[];
  nota?: string;
  delay: number;
}

function TravessiaCard({ numero, titulo, subtitulo, descricao, nota, delay }: TravessiaCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className="p-8 border border-gold/10 bg-gradient-to-b from-gold/[0.02] to-transparent rounded-sm"
    >
      <span className="text-gold/40 font-display text-sm tracking-widest block mb-4">
        {numero}
      </span>
      <h3 className="font-display text-2xl text-gold mb-2">
        {titulo}
      </h3>
      <p className="font-display text-foreground/60 italic text-sm mb-6">
        {subtitulo}
      </p>
      
      <ul className="space-y-2 mb-6">
        {descricao.map((item, i) => (
          <li key={i} className="flex items-start gap-2 font-body text-foreground/60 text-sm">
            <span className="text-gold/40 mt-1">—</span>
            {item}
          </li>
        ))}
      </ul>
      
      {nota && (
        <p className="font-body text-foreground/40 text-xs italic border-t border-gold/10 pt-4">
          {nota}
        </p>
      )}
    </motion.div>
  );
}

export function TravessiasSection() {
  const travessias = [
    {
      numero: "TRAVESSIA I",
      titulo: "A Jornada Ritual da Heroína",
      subtitulo: "As 14 Portas da Psique Feminina",
      descricao: [
        "seu Mapa Pessoal da Heroína",
        "sua leitura simbólica de origem",
        "a consciência das Portas que pode — e não pode — conduzir"
      ],
      nota: "Nada aqui é metáfora solta. Tudo vira estrutura interna."
    },
    {
      numero: "TRAVESSIA II",
      titulo: "Neuroplasticidade & Competências do Ego",
      subtitulo: "O corpo que sustenta o símbolo",
      descricao: [
        "tolerância à frustração",
        "continência emocional",
        "autorregulação",
        "limites de condução",
        "ritmo psíquico"
      ],
      nota: "O símbolo só transforma onde o ego aguenta."
    },
    {
      numero: "TRAVESSIA III",
      titulo: "Mito Pessoal & Linguagem Arquetípica",
      subtitulo: "A história que te forma como facilitadora",
      descricao: [
        "o mito que te atravessa",
        "os arquétipos que operam sua voz",
        "onde sua história cura — e onde ela invade"
      ],
      nota: "Sem romantização. Sem narrativa de vitrine."
    },
    {
      numero: "TRAVESSIA IV",
      titulo: "A Guardiã da Leitura",
      subtitulo: "Da experiência pessoal à condução ética",
      descricao: [
        "quando conduzir",
        "quando silenciar",
        "quando encerrar",
        "quando não abrir Portas"
      ],
      nota: "A facilitadora nasce quando sabe não agir."
    }
  ];

  return (
    <section className="py-20 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <span className="text-gold/60 text-sm tracking-[0.2em] uppercase font-body mb-4 block">
            🜂
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            As Travessias da Formação <span className="text-gold">ORÁCULA</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center mb-16"
        >
          <p className="font-body text-foreground/60 max-w-2xl mx-auto">
            Na ORÁCULA, travessia não é módulo.<br />
            É experiência guiada, com começo, meio e integração.
          </p>
          <p className="font-body text-foreground/50 text-sm mt-4 italic">
            Cada travessia é vivida pela própria terapeuta,<br />
            antes de qualquer aplicação profissional.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {travessias.map((t, index) => (
            <TravessiaCard
              key={t.numero}
              {...t}
              delay={0.2 + index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
