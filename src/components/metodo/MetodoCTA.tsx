import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useCopy } from '@/hooks/useCopy';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export function MetodoCTA() {
  const navigate = useNavigate();
  const { getCopyByKey } = useCopy();

  return (
    <motion.section {...fadeInUp} transition={{ duration: 0.8 }} className="text-center py-20 md:py-28">
      <p className="text-foreground text-lg mb-3 font-display italic">
        {getCopyByKey('casa_cta_texto', 'Pronta para atravessar o limiar?')}
      </p>
      <p className="text-foreground/85 text-sm mb-10 max-w-md mx-auto">
        A Casa Orácula não promete resultados rápidos. Ela oferece lugar — interno, simbólico e profissional.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          size="lg"
          onClick={() => navigate('/planos')}
          className="bg-gold/90 hover:bg-gold text-background text-lg px-10 py-6"
        >
          {getCopyByKey('casa_cta_botao', 'Explorar Caminhos')}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => navigate('/auth')}
          className="border-gold/20 hover:border-gold/40 text-foreground px-8 py-6"
        >
          Criar Conta Gratuita
        </Button>
      </div>
    </motion.section>
  );
}
