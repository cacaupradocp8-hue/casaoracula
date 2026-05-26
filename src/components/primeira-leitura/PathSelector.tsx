import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Map, Lock, Route } from 'lucide-react';

export const PathSelector: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center space-y-12 py-12 px-4 max-w-4xl mx-auto w-full"
    >
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-serif text-primary">
          Sua Primeira Leitura está Completa.
        </h3>

        <p className="text-muted-foreground max-w-lg mx-auto">
          Você cruzou o limiar. Agora, o caminho se abre em camadas: da escuta guiada à formação profunda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Opção 1: Travessia 00 (Aprofundamento Gratuito/Visitante) */}
        <div className="bg-card/40 border border-border/50 rounded-3xl p-8 flex flex-col items-center text-center space-y-6 hover:bg-card/60 transition-colors shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Route className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-semibold">Travessia 00</h4>
            <p className="text-sm text-muted-foreground">
              O Limiar da Casa: 7 dias de escuta guiada para habitar o método.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/travessia/travessia-zero-o-limiar-da-casa')}
            variant="outline"
            className="w-full py-6 rounded-xl border-primary/20 hover:border-primary/50"
          >
            Iniciar Travessia 00
          </Button>
        </div>

        {/* Opção 2: Quiz da Voz (Segunda Camada) */}
        <div className="bg-card/40 border border-border/50 rounded-3xl p-8 flex flex-col items-center text-center space-y-6 hover:bg-card/60 transition-colors shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-semibold">Quiz da Voz</h4>
            <p className="text-sm text-muted-foreground">
              Descubra seu eixo simbólico e sua voz de condução oracular.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/quiz/descubra-seu-eixo')}
            variant="outline"
            className="w-full py-6 rounded-xl border-primary/20 hover:border-primary/50"
          >
            Descobrir minha Voz
          </Button>
        </div>
      </div>

      {/* Opção 3: Clube Oracula (Conversão) */}
      <div className="relative w-full max-w-2xl overflow-hidden bg-gradient-to-br from-primary/90 to-primary/70 rounded-3xl p-8 flex flex-col md:flex-row items-center text-center md:text-left gap-8 shadow-2xl">
        <div className="absolute top-0 right-0 p-4">
          <Sparkles className="w-6 h-6 text-white/20 animate-pulse" />
        </div>
        <div className="w-20 h-20 shrink-0 rounded-2xl bg-white/10 flex items-center justify-center">
          <Lock className="w-10 h-10 text-white" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="space-y-1">
            <h4 className="text-2xl font-semibold text-white">Clube & Escola Orácula</h4>
            <p className="text-sm text-white/80">
              Acesso completo à Cartografia da Cidadela, travessias avançadas e formação profissional.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/clube')}
            className="w-full md:w-auto px-8 py-6 rounded-xl bg-white text-primary hover:bg-white/90 font-bold shadow-xl"
          >
            Conhecer o Clube
          </Button>
        </div>
      </div>

      
      <Button 
        variant="ghost" 
        onClick={() => navigate('/sala-da-visitante')}
        className="text-muted-foreground hover:text-primary"
      >
        Voltar para a Sala da Visitante
      </Button>
    </motion.div>
  );
};
