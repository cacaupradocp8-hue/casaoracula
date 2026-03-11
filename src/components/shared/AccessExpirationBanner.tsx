import { useAccessExpiration } from '@/hooks/useAccessExpiration';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, XCircle, CreditCard } from 'lucide-react';
import { format, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function AccessExpirationBanner() {
  const navigate = useNavigate();
  const { 
    isExpiringSoon, 
    isExpired, 
    daysUntilExpiration, 
    accessExpiresAt,
    hasActiveSubscription 
  } = useAccessExpiration();

  // Não mostrar nada se tem assinatura ativa ou não tem data de expiração
  if (hasActiveSubscription || (!isExpiringSoon && !isExpired)) {
    return null;
  }

  // Banner de expiração próxima (7 dias)
  if (isExpiringSoon && !isExpired) {
    return (
      <Alert className="mb-4 border-amber-500/50 bg-amber-500/10">
        <Clock className="h-4 w-4 text-amber-500" />
        <AlertTitle className="text-amber-600">
          Seu acesso se encerra em breve
        </AlertTitle>
        <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-amber-600/90">
            {daysUntilExpiration === 1 
              ? 'Seu acesso expira amanhã.' 
              : `Seu acesso expira em ${daysUntilExpiration} dias.`}
            {accessExpiresAt && isValid(accessExpiresAt) && (
              <span className="ml-1 text-muted-foreground">
                ({format(accessExpiresAt, "dd 'de' MMMM", { locale: ptBR })})
              </span>
            )}
            <span className="ml-1">Deseja manter seu espaço ativo?</span>
          </span>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => navigate('/planos')}
            >
              Ver planos
            </Button>
            <Button 
              size="sm" 
              className="bg-amber-600 hover:bg-amber-700"
              onClick={() => navigate('/planos')}
            >
              <CreditCard className="mr-1 h-4 w-4" />
              Assinar agora
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Banner de acesso expirado
  if (isExpired) {
    return (
      <Alert className="mb-4 border-destructive/50 bg-destructive/10">
        <XCircle className="h-4 w-4 text-destructive" />
        <AlertTitle className="text-destructive">
          Seu período de acesso se encerrou
        </AlertTitle>
        <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-destructive/90">
            Para continuar usando o app profissionalmente, ative a assinatura.
            Seus dados estão seguros e disponíveis para visualização.
          </span>
          <Button 
            size="sm" 
            variant="destructive"
            onClick={() => navigate('/planos')}
          >
            <CreditCard className="mr-1 h-4 w-4" />
            Ativar assinatura
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
