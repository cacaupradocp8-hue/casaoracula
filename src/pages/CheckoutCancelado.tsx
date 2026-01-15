import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';

export default function CheckoutCancelado() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[70vh]">
        <Card className="max-w-md w-full text-center">
          <CardHeader className="pb-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl">Checkout Cancelado</CardTitle>
            <CardDescription className="text-base mt-2">
              O processo de pagamento foi interrompido
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Não se preocupe, nenhum valor foi cobrado. 
              Você pode tentar novamente quando quiser.
            </p>

            <div className="space-y-3 pt-4">
              <Button asChild className="w-full">
                <Link to="/planos">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Ver Planos Novamente
                </Link>
              </Button>
              <Button variant="ghost" asChild className="w-full">
                <Link to="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
