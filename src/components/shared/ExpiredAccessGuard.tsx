import { useNavigate } from 'react-router-dom';
import { useAccessExpiration } from '@/hooks/useAccessExpiration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, CreditCard, Eye } from 'lucide-react';

interface ExpiredAccessGuardProps {
  children: React.ReactNode;
  featureName?: string;
  showPreview?: boolean;
}

/**
 * Componente que bloqueia funcionalidades premium para usuários com acesso expirado
 * Dados continuam visíveis, mas não editáveis
 */
export function ExpiredAccessGuard({ 
  children, 
  featureName = 'esta funcionalidade',
  showPreview = false 
}: ExpiredAccessGuardProps) {
  const navigate = useNavigate();
  const { isExpired, hasActiveSubscription } = useAccessExpiration();

  // Se não expirou ou tem assinatura ativa, renderiza normalmente
  if (!isExpired || hasActiveSubscription) {
    return <>{children}</>;
  }

  // Se expirou, mostra bloqueio com opção de visualização
  return (
    <div className="relative">
      {showPreview && (
        <div className="pointer-events-none opacity-50 blur-sm">
          {children}
        </div>
      )}
      
      <Card className={`${showPreview ? 'absolute inset-0 m-auto h-fit max-w-md' : 'max-w-md mx-auto'} border-amber-500/50 bg-background/95 backdrop-blur`}>
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-amber-500" />
          </div>
          <CardTitle className="text-xl">Acesso Bloqueado</CardTitle>
          <CardDescription>
            Seu período de acesso expirou. Para continuar utilizando {featureName}, 
            ative sua assinatura profissional.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <Eye className="w-4 h-4 shrink-0" />
            <span>Seus dados continuam salvos e podem ser visualizados.</span>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button 
              className="w-full"
              onClick={() => navigate('/planos')}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Ver Planos e Assinar
            </Button>
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => navigate('/assinatura')}
            >
              Gerenciar Assinatura
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
