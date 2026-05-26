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
        {/* Opção 1: Explorar a Casa (Público) */}
        <div className="bg-card/40 border border-border/50 rounded-3xl p-8 flex flex-col items-center text-center space-y-6 hover:bg-card/60 transition-colors shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center">
            <Map className="w-8 h-8 text-amber-500" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-semibold">Explorar a Casa</h4>
            <p className="text-sm text-muted-foreground">
              Veja o mapa público e entenda a estrutura desta escola de autoconhecimento oracular.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/explorar-a-casa')}
            variant="outline"
            className="w-full py-6 rounded-xl border-amber-500/20 hover:border-amber-500/50"
          >
            Ver Mapa Público
          </Button>
        </div>

        {/* Opção 2: Tornar-se Membro (Conversão) */}
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-600 to-amber-800 rounded-3xl p-8 flex flex-col items-center text-center space-y-6 shadow-2xl">
          <div className="absolute top-0 right-0 p-4">
            <Sparkles className="w-6 h-6 text-white/20 animate-pulse" />
          </div>
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-semibold text-white">O Clube Oracula</h4>
            <p className="text-sm text-white/80">
              Acesse ferramentas completas, sessões guiadas e a jornada profunda de transformação.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/clube')}
            className="w-full py-6 rounded-xl bg-white text-amber-900 hover:bg-amber-50 font-bold shadow-xl"
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
