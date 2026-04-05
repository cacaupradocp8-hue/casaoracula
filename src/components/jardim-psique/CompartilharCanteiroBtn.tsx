import { useState } from 'react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { trackLearningEvent } from '@/services/studentTrackingService';
import type { JardimRegistro } from '@/hooks/useJardimPsique';

interface Props {
  registro: JardimRegistro;
}

export function CompartilharCanteiroBtn({ registro }: Props) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [sharing, setSharing] = useState(false);

  const texto = registro.reflexao_pessoal
    || (registro.conteudo?.texto as string)
    || '';

  if (!texto.trim()) return null;

  const handleShare = async () => {
    if (!user) return;
    setSharing(true);
    try {
      const { data: bed } = await supabase
        .from('collective_beds')
        .select('id, season_id')
        .eq('status', 'ativo')
        .maybeSingle();

      if (!bed) {
        toast.error('Nenhum Canteiro ativo no momento.');
        return;
      }

      const insertData: Record<string, any> = {
        bed_id: bed.id,
        season_id: bed.season_id,
        user_id: user.id,
        origem: 'psique',
        texto: texto.trim(),
        exibicao_anonima: false,
        aprovado_por_admin: false,
        source_entry_id: registro.id,
      };

      const { error } = await supabase
        .from('collective_bed_entries')
        .insert(insertData as any);

      if (error) throw error;

      trackLearningEvent({
        contextArea: 'jardim-da-psique',
        actionType: 'shared_to_canteiro',
        objectType: 'registro_jardim',
        objectId: registro.id,
      });

      toast.success('Partilha enviada para curadoria do Canteiro.');
      setOpen(false);
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
      toast.error('Erro ao compartilhar no Canteiro.');
    } finally {
      setSharing(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-[10px] text-muted-foreground/50 hover:text-primary/60 gap-1"
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
      >
        <Send className="w-3 h-3" />
        Canteiro
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-base">Compartilhar no Canteiro?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground space-y-2">
              <p>
                Seu registro será enviado para curadoria e, se aprovado, ficará visível para outras participantes da comunidade.
              </p>
              <p className="text-[11px] italic text-muted-foreground/60">
                O registro original permanece privado no seu Jardim. Apenas uma cópia será publicada.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={sharing}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleShare} disabled={sharing}>
              {sharing ? 'Enviando...' : 'Enviar para o Canteiro'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
