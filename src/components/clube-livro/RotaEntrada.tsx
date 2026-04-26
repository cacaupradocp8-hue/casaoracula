import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mic, MessageCircle, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function RotaEntrada() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-4"
    >
      <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 font-medium text-center">
        Ponto de Início
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card className="border-primary/15 bg-card/40 backdrop-blur hover:bg-card/60 transition-colors cursor-pointer" onClick={() => navigate('/clube/quiz-voz')}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Mic className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">Quiz da Voz</h3>
              <p className="text-[10px] text-muted-foreground/60">Descubra sua nota dominante</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/15 bg-card/40 backdrop-blur hover:bg-card/60 transition-colors cursor-pointer" onClick={() => navigate('/clube/mapa-cidadela')}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">Mapa da Cidadela</h3>
              <p className="text-[10px] text-muted-foreground/60">Sua estrutura psíquica</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
