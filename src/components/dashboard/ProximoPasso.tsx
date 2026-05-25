import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Compass, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * COMPONENTE ProximoPasso (DASHBOARD) - Simplificado V0.3
 * 
 * Objetivo: Redirecionar para a Cidadela como fonte de verdade do percurso.
 * Desvinculado de IA/Syntheia neste contexto operacional.
 */
export function ProximoPasso() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-primary" />
            <p className="text-xs font-medium text-primary/80 uppercase tracking-wider">
              Seu próximo passo está na Cidadela
            </p>
          </div>
          
          <p className="text-sm text-foreground/80 leading-relaxed">
            A Cidadela reúne seu percurso, suas travessias e o próximo passo possível dentro da Casa.
          </p>

          <Button
            size="sm"
            className="w-full gap-2"
            onClick={() => navigate('/cidadela')}
          >
            Abrir Cidadela
            <ArrowRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

