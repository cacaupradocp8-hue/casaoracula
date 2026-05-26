import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const PathSelector: React.FC = () => {
  const navigate = useNavigate();

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {/* Caminho 1: Travessia 00 */}
        <div className="bg-card/60 border border-primary/20 rounded-[32px] p-8 flex flex-col items-center text-center space-y-6 shadow-sm border-2">
          <div className="space-y-2">
            <h4 className="text-lg font-display text-primary">Travessia 00</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              O primeiro passo oficial. Se esta leitura acendeu algo, a Travessia 00 é o caminho para entrar na Casa com direção.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/travessia/travessia-zero-o-limiar-da-casa')}
            variant="gold"
            className="w-full py-6 rounded-2xl"
          >
            Iniciar Travessia 00
          </Button>
        </div>

        {/* Caminho 2: Quiz da Voz */}
        <div className="bg-card/30 border border-primary/5 rounded-[32px] p-8 flex flex-col items-center text-center space-y-6 shadow-sm">
          <div className="space-y-2">
            <h4 className="text-lg font-display text-primary">Quiz da Voz</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Segunda camada: para reconhecer a linguagem simbólica que mais se aproxima da sua forma de escutar.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/quiz/voz-da-alma')}
            variant="outline"
            className="w-full py-6 rounded-2xl border-primary/10 hover:bg-primary/5"
          >
            Conhecer minha Voz
          </Button>
        </div>

        {/* Caminho 3: Clube / Escola */}
        <div className="bg-card/30 border border-primary/5 rounded-[32px] p-8 flex flex-col items-center text-center space-y-6 shadow-sm">
          <div className="space-y-2">
            <h4 className="text-lg font-display text-primary">Clube & Escola</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Para continuar treinando leitura, método e travessia em um espaço de aprofundamento.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/formacao')}
            variant="outline"
            className="w-full py-6 rounded-2xl border-primary/10 hover:bg-primary/5"
          >
            Ver Caminhos
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
