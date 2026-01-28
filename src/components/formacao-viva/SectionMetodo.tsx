import { motion } from "framer-motion";

const PILARES = [
  {
    symbol: "🜂",
    nome: "PORTAS",
    descricao: [
      "A psique se move por limiares.",
      "A pergunta não é quem você é.",
      "É onde você está."
    ]
  },
  {
    symbol: "🌑",
    nome: "LABIRINTOS",
    descricao: [
      "Entre uma Porta e outra, há percurso.",
      "Aqui, aprende-se a ler o caminho."
    ]
  },
  {
    symbol: "🜁",
    nome: "TORRES",
    descricao: [
      "Algumas formas atravessam a vida inteira.",
      "Não como erro.",
      "Como sobrevivência."
    ]
  }
];

export function SectionMetodo() {
  return (
    <section className="py-32 md:py-48 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-24"
        >
          <span className="text-gold/50 text-sm tracking-[0.3em] uppercase font-body">
            Arquitetura
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mt-4 tracking-wide">
            O Método ORÁCULA
          </h2>
        </motion.div>

        {/* Three pillars */}
        <div className="space-y-20 md:space-y-32">
          {PILARES.map((pilar, index) => (
            <motion.div
              key={pilar.nome}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="relative"
            >
              {/* Vertical line accent */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-gold/30 via-gold/10 to-transparent hidden md:block" />
              
              <div className="md:pl-12">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-2xl text-gold/60">{pilar.symbol}</span>
                  <h3 className="font-display text-2xl md:text-3xl text-foreground tracking-widest">
                    {pilar.nome}
                  </h3>
                </div>
                
                <div className="space-y-2 max-w-xl">
                  {pilar.descricao.map((line, lineIndex) => (
                    <p 
                      key={lineIndex}
                      className="font-display text-lg md:text-xl text-muted-foreground leading-relaxed"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
