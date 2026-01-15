import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export default function CheckoutSucesso() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[70vh]">
        <Card className="max-w-md w-full text-center">
          <CardHeader className="pb-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Assinatura Ativada!</CardTitle>
            <CardDescription className="text-base mt-2">
              Bem-vinda à sua nova jornada na Casa ORÁCULA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center gap-2 text-gold">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Seu acesso já está liberado</span>
              <Sparkles className="w-5 h-5" />
            </div>

            <p className="text-sm text-muted-foreground">
              Agora você tem acesso a todos os recursos do seu plano. 
              Explore as ferramentas, salas e conteúdos disponíveis.
            </p>

            <div className="space-y-3 pt-4">
              <Button asChild className="w-full bg-gold text-black hover:bg-gold/90">
                <Link to="/dashboard">
                  Ir para o Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/assinatura">
                  Ver Minha Assinatura
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
