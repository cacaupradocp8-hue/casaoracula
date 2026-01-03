import { Lock, ExternalLink, MessageCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTextModels } from '@/hooks/useTextModel';

interface LockedContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export function LockedContentModal({
  open,
  onOpenChange,
  title,
  description,
}: LockedContentModalProps) {
  const { getText } = useTextModels();

  const matriculaUrl = getText('cta_matricula_url', 'https://rockty.com/formacao-oracula');
  const whatsappNumero = getText('cta_whatsapp_numero', '5511999999999');
  const whatsappMensagem = getText('cta_whatsapp_mensagem', 'Olá! Tenho interesse em me matricular na formação da Casa ORÁCULA.');
  
  const modalTitle = title || getText('modal_bloqueio_titulo', 'Conteúdo exclusivo para matriculadas');
  const modalDescription = description || getText('modal_bloqueio_descricao', 'Este conteúdo faz parte da formação completa. Para acessar, você precisa estar matriculada na jornada formativa da Casa ORÁCULA.');
  const botaoMatricula = getText('modal_bloqueio_botao_matricula', 'Quero me matricular');
  const botaoWhatsapp = getText('modal_bloqueio_botao_whatsapp', 'Falar no WhatsApp');
  const rodape = getText('modal_bloqueio_rodape', 'Dúvidas? Entre em contato e converse conosco sobre a formação.');

  const handleMatricula = () => {
    window.open(matriculaUrl, '_blank');
  };

  const handleWhatsApp = () => {
    const encodedMessage = encodeURIComponent(whatsappMensagem);
    window.open(`https://wa.me/${whatsappNumero}?text=${encodedMessage}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-gold" />
          </div>
          <DialogTitle className="text-xl font-display">{modalTitle}</DialogTitle>
          <DialogDescription className="text-center mt-2">
            {modalDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-6">
          <Button 
            variant="gold" 
            className="w-full gap-2"
            onClick={handleMatricula}
          >
            <ExternalLink className="w-4 h-4" />
            {botaoMatricula}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full gap-2"
            onClick={handleWhatsApp}
          >
            <MessageCircle className="w-4 h-4" />
            {botaoWhatsapp}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          {rodape}
        </p>
      </DialogContent>
    </Dialog>
  );
}
