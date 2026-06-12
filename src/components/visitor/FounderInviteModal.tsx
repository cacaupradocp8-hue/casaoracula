import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, KeyRound, Sparkles } from 'lucide-react';
import { useFounderAccess } from '@/hooks/useFounderAccess';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface FounderInviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  /**
   * Se true, e o usuário não estiver autenticado, armazena o código em localStorage
   * e instrui a usuária a fazer login/cadastro. Após autenticar, o Auth page
   * detecta o código pendente e ativa automaticamente.
   */
  allowPendingActivation?: boolean;
}

export const PENDING_FOUNDER_CODE_KEY = 'pending_founder_invite_code';

export function FounderInviteModal({
  open,
  onOpenChange,
  onSuccess,
  allowPendingActivation = false,
}: FounderInviteModalProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { validateAndActivateInvite } = useFounderAccess();
  const { user } = useAuth();

  const handleActivate = async () => {
    const code = inviteCode.trim().toUpperCase();
    if (!code) {
      toast.error('Por favor, insira um código de convite.');
      return;
    }

    // Caso 1: não autenticada e o modal permite ativação pendente (página /auth)
    if (!user && allowPendingActivation) {
      try {
        localStorage.setItem(PENDING_FOUNDER_CODE_KEY, code);
      } catch (_) {
        /* ignore */
      }
      toast.info('Entre ou crie sua conta para ativar seu Convite Fundadora.');
      onOpenChange(false);
      return;
    }

    // Caso 2: não autenticada e sem suporte a pendente — erro claro
    if (!user) {
      toast.error('Entre ou crie sua conta para ativar seu Convite Fundadora.');
      return;
    }

    setIsSubmitting(true);
    const result = await validateAndActivateInvite(code);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Convite ativado. A Clareira está aberta para você.');
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } else {
      toast.error(result.error || 'Este convite não foi encontrado ou já expirou.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-primary/20">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <KeyRound className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-xl font-display text-primary">
            Convite Fundadora
          </DialogTitle>
          <DialogDescription className="text-center mt-2">
            {user
              ? 'Insira seu código de convite para liberar 7 dias de degustação da Rota dos Lobos.'
              : 'Insira seu código abaixo. Depois entre ou crie sua conta para que o acesso seja liberado.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Input
            placeholder="Ex: LOBA2025"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            className="text-center uppercase tracking-widest font-bold h-12 border-primary/20 focus:border-primary/40 bg-background/50"
            onKeyDown={(e) => e.key === 'Enter' && handleActivate()}
          />
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-col">
          <Button
            className="w-full gap-2 py-6 bg-primary hover:bg-primary/90"
            onClick={handleActivate}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Validando...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {user ? 'Ativar Convite' : 'Guardar e continuar'}
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            className="w-full text-xs text-muted-foreground"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Ainda não tenho um código
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
