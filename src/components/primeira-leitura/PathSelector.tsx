import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const PathSelector: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const goCidadela = () => {
    const dest = '/ferramenta/cartografia-psiquica-oracula';
    if (user) navigate(dest);
    else navigate(`/auth?redirect=${encodeURIComponent(dest)}`);
  };
  const goTravessia = () => {
    const dest = '/travessia/travessia-zero-o-limiar-da-casa';
    if (user) navigate(dest);
    else navigate(`/auth?redirect=${encodeURIComponent(dest)}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center space-y-12 py-12 px-6 max-w-4xl mx-auto w-full"
    >
      <div className="text-center space-y-4">
        <h3 className="text-2xl md:text-3xl font-display text-primary">
          Caminhos de Aprofundamento
        </h3>
        <p className="text-muted-foreground max-w-lg mx-auto text-sm md:text-base leading-relaxed italic font-serif">
          A Casa se revela por camadas. Onde sua escuta deseja habitar agora?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
        {/* Caminho 1: Cartografia da Cidadela */}
        <div className="bg-card/60 border border-primary/20 rounded-[32px] p-8 flex flex-col items-center text-center space-y-6 shadow-sm border-2">
          <div className="space-y-2">
            <h4 className="text-lg font-display text-primary">Cartografia da Cidadela</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              O mapa simbólico do seu percurso. Onde suas forças habitam e onde a jornada se inicia.
            </p>
          </div>
          <Button 
            onClick={goCidadela}
            variant="gold"
            className="w-full py-6 rounded-2xl"
          >
            Ver minha Cidadela
          </Button>
        </div>

        {/* Caminho 2: Travessia 00 */}
        <div className="bg-card/30 border border-primary/5 rounded-[32px] p-8 flex flex-col items-center text-center space-y-6 shadow-sm">
          <div className="space-y-2">
            <h4 className="text-lg font-display text-primary">Travessia 00</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              O primeiro passo oficial. O caminho para entrar na Casa com direção e propósito.
            </p>
          </div>
          <Button 
            onClick={goTravessia}
            variant="outline"
            className="w-full py-6 rounded-2xl border-primary/10 hover:bg-primary/5"
          >
            Iniciar Travessia 00
          </Button>
        </div>
      </div>
      
      <button 
        onClick={() => navigate('/sala-da-visitante')}
        className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-primary/60 transition-colors"
      >
        Voltar à Sala da Visitante
      </button>
    </motion.div>
  );
};