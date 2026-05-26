import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, BookOpen, Compass } from 'lucide-react';

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
          O Limiar foi Cruzado.
        </h3>
        <p className="text-muted-foreground max-w-lg mx-auto text-sm md:text-base leading-relaxed">
          Sua Primeira Leitura revelou uma prontidão. A Casa Orácula não é apenas um destino, é um laboratório de inteligência simbólica.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {/* Opção 1: Travessia 00 */}
        <div className="bg-card/40 border border-primary/5 rounded-[32px] p-8 flex flex-col items-center text-center space-y-6 hover:bg-card/60 transition-all duration-500 shadow-sm group">
          <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:scale-110 transition-transform">
            <Compass className="w-7 h-7 text-primary/60" />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-display text-primary">Travessia 00</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              O início do método. 7 dias de escuta guiada para habitar a Casa.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/travessia/travessia-zero-o-limiar-da-casa')}
            variant="gold"
            className="w-full py-6 rounded-2xl shadow-lg shadow-primary/5"
          >
            Iniciar Travessia 00
          </Button>
        </div>

        {/* Opção 2: Quiz da Voz */}
        <div className="bg-card/20 border border-white/5 rounded-[32px] p-8 flex flex-col items-center text-center space-y-6 hover:bg-card/40 transition-all duration-500 shadow-sm group">
          <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:scale-110 transition-transform">
            <Sparkles className="w-7 h-7 text-primary/40" />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-display text-primary/70">Quiz da Voz</h4>
            <p className="text-xs text-muted-foreground/60 leading-relaxed">
              Identifique seu eixo simbólico e sua voz de condução.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/quiz/descubra-seu-eixo')}
            variant="outline"
            className="w-full py-6 rounded-2xl border-primary/10 hover:bg-primary/5"
          >
            Segunda Camada
          </Button>
        </div>
      </div>

      <div className="w-full max-w-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/10 rounded-[32px] p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
        <div className="w-16 h-16 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="space-y-1">
            <h4 className="text-xl font-display text-primary">Clube & Escola</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Formação avançada para quem deseja transformar a escuta em profissão e método.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/clube')}
            variant="ghost"
            className="w-full md:w-auto text-primary hover:bg-primary/5 gap-2 group"
          >
            Conhecer o Aprofundamento
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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