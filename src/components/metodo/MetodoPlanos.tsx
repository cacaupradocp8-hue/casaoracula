import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const planos = [
  {
    nome: 'Explorar',
    desc: 'Acesso inicial ao método e ferramentas básicas.',
    itens: ['Cartografia Psíquica', 'Leitura Simbólica', 'Jardim da Psique'],
    destaque: false,
  },
  {
    nome: 'Atravessar',
    desc: 'Formação completa com travessias e supervisão.',
    itens: ['Tudo do Explorar', 'Travessias guiadas', 'Clube do Livro', 'Supervisão'],
    destaque: true,
  },
  {
    nome: 'Conduzir',
    desc: 'Para facilitadoras em formação profissional.',
    itens: ['Tudo do Atravessar', 'Casa das Máquinas', 'Certificação', 'Mentoria'],
    destaque: false,
  },
];

export function MetodoPlanos() {
  const navigate = useNavigate();

  return (
    <motion.section {...fadeInUp} transition={{ duration: 0.8 }} className="py-16 md:py-24">
      <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4 text-center tracking-wide">
        Caminhos de Entrada
      </h2>
      <p className="text-foreground/80 text-center max-w-xl mx-auto mb-12">
        Cada caminho respeita o seu momento. Nenhum é maior que o outro — são diferentes profundidades.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {planos.map((plano, i) => (
          <motion.div
            key={plano.nome}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`border rounded-xl p-7 ${
              plano.destaque
                ? 'border-gold/30 bg-gold/5'
                : 'border-border/50 bg-card/20'
            }`}
          >
            {plano.destaque && (
              <p className="text-gold text-xs uppercase tracking-widest mb-3 font-medium">Mais escolhido</p>
            )}
            <h3 className="font-display text-xl text-foreground mb-2">{plano.nome}</h3>
            <p className="text-sm text-foreground/80 mb-5">{plano.desc}</p>
            <ul className="space-y-2">
              {plano.itens.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground/80">
                  <Check className="w-3.5 h-3.5 text-gold shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <Button
          onClick={() => navigate('/planos')}
          variant="outline"
          className="border-gold/20 hover:border-gold/40 text-foreground"
        >
          Ver todos os planos
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.section>
  );
}
