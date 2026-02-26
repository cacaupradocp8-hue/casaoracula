import { motion } from 'framer-motion';

const passos = [
  { num: '1', titulo: 'Inscrição', descricao: 'Preencha o formulário de interesse e aguarde contato.' },
  { num: '2', titulo: 'Entrevista', descricao: 'Conversa individual para alinhamento de expectativas.' },
  { num: '3', titulo: 'Matrícula', descricao: 'Confirmação de vaga e início do acesso à plataforma.' },
  { num: '4', titulo: 'Início', descricao: 'Abertura da primeira Travessia com o grupo formativo.' },
];

export function ProcessoEntradaSection() {
  return (
    <section className="relative py-24 md:py-32 px-6 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-light text-foreground">
            Processo de <span className="text-gold-gradient font-semibold">Entrada</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-8 left-[calc(12.5%)] right-[calc(12.5%)] h-px bg-primary/15" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {passos.map((p, i) => (
              <motion.div
                key={p.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full border border-primary/20 bg-background flex items-center justify-center mx-auto mb-4 relative z-10">
                  <span className="font-display text-xl text-primary/70">{p.num}</span>
                </div>
                <h3 className="font-display text-base font-semibold text-foreground mb-2">{p.titulo}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{p.descricao}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </section>
  );
}
