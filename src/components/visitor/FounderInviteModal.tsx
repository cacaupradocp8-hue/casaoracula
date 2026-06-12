import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, KeyRound, Sparkles } from 'lucide-react';
import { useFounderAccess } from '@/hooks/useFounderAccess';
import { toast } from 'sonner';

interface FounderInviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function FounderInviteModal({ open, onOpenChange, onSuccess }: FounderInviteModalProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { validateAndActivateInvite } = useFounderAccess();

  const handleActivate = async () => {
    if (!inviteCode.trim()) {
      toast.error('Por favor, insira um código de convite.');
      return;
    }

    setIsSubmitting(true);
    const result = await validateAndActivateInvite(inviteCode);
    setIsSubmitting(false);

    if (result.success) {
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } else {
      toast.error(result.error || 'Código inválido.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-primary/20">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <KeyRound className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-xl font-display text-primary">Convite Fundadora</DialogTitle>
          <DialogDescription className="text-center mt-2">
            Insira seu código de convite para liberar 7 dias de degustação da Rota dos Lobos.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Ex: LOBA2025"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              className="text-center uppercase tracking-widest font-bold h-12 border-primary/20 focus:border-primary/40 bg-background/50"
              onKeyDown={(e) => e.key === 'Enter' && handleActivate()}
            />
          </div>
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
                Ativar Acesso Temporário
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
