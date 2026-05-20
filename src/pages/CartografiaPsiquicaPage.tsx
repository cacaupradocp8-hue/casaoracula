import { useEffectivePortal } from '@/hooks/useEffectivePortal';
import { CartografiaEstruturalStepper } from '@/components/cartografia/CartografiaEstruturalStepper';
import { Lock, ShieldCheck, Sparkles, Map } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function CartografiaPsiquicaPage() {
  const { canAccess } = useEffectivePortal();
  const navigate = useNavigate();
  
  // A CidaDELA agora exige nível 'aluna' (membros pagantes) ou superior
  const hasSubscriptionAccess = canAccess('aluna');

  if (!hasSubscriptionAccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <Card className="glass border-gold/30 shadow-premium-glow">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-gold" />
              </div>
              <CardTitle className="text-2xl font-display text-gold">CidaDELA Interior</CardTitle>
              <CardDescription className="text-muted-foreground pt-2">
                O mapa profundo da sua psique é o coração das Rotas da Casa Orácula. Um benefício exclusivo para quem habita este espaço.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <ShieldCheck className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <p>Acesse sua CidaDELA Interior completa e integrada.</p>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Sparkles className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <p>Receba sua Leitura Profunda gerada por inteligência operacional.</p>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Map className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <p>Revele seu GPS simbólico e receba sua Jornada 00.</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 pt-4">
                <Button 
                  variant="gold" 
                  size="lg" 
                  className="w-full shadow-premium-glow"
                  onClick={() => navigate('/planos')}
                >
                  Habitar as Rotas da Casa Orácula
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-muted-foreground"
                  onClick={() => navigate('/dashboard')}
                >
                  Voltar ao Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-12 pb-20 px-4 sm:px-6">
      <CartografiaEstruturalStepper />
    </div>
  );
}
