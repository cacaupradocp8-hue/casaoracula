import { Lock, ExternalLink, MessageCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface LockedContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

const WHATSAPP_NUMBER = '5511999999999'; // Configure com número real
const WHATSAPP_MESSAGE = encodeURIComponent('Olá! Tenho interesse em me matricular na formação da Casa ORÁCULA.');
const MATRICULA_URL = 'https://rockty.com/formacao-oracula'; // Configure com URL real

export function LockedContentModal({
  open,
  onOpenChange,
  title = 'Conteúdo exclusivo para matriculadas',
  description = 'Este conteúdo faz parte da formação completa. Para acessar, você precisa estar matriculada na jornada formativa da Casa ORÁCULA.',
}: LockedContentModalProps) {
  const handleMatricula = () => {
    window.open(MATRICULA_URL, '_blank');
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-gold" />
          </div>
          <DialogTitle className="text-xl font-display">{title}</DialogTitle>
          <DialogDescription className="text-center mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-6">
          <Button 
            variant="gold" 
            className="w-full gap-2"
            onClick={handleMatricula}
          >
            <ExternalLink className="w-4 h-4" />
            Quero me matricular
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full gap-2"
            onClick={handleWhatsApp}
          >
            <MessageCircle className="w-4 h-4" />
            Falar no WhatsApp
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Dúvidas? Entre em contato e converse conosco sobre a formação.
        </p>
      </DialogContent>
    </Dialog>
  );
}
