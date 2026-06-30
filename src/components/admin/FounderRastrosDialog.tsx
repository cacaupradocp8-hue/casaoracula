import { useEffect, useState } from 'react';
import { Loader2, Check, Circle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FounderRastrosDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  founder: {
    user_id: string;
    nome: string | null;
    email: string | null;
    data_ativacao: string;
  } | null;
}

interface LearningEvent {
  id: string;
  created_at: string;
  context_area: string | null;
  action_type: string | null;
  object_type: string | null;
  object_id: string | null;
  metadata_short: any;
}

interface Rastro {
  key: string;
  label: string;
  match: (e: LearningEvent) => boolean;
}

const r = (e: LearningEvent) => (e.metadata_short?.rastro || '') as string;

const RASTROS: Rastro[] = [
  {
    key: 'entrada',
    label: 'Entrada na Sala da Visitante',
    match: (e) => r(e) === 'sala_da_visitante',
  },
  {
    key: 'retorno',
    label: 'Retorno à plataforma',
    match: (e) => e.action_type === 'returned' || r(e) === 'retorno_plataforma',
  },
  {
    key: 'rota_lobos',
    label: 'Entrou na Rota dos Lobos',
    match: (e) => r(e) === 'rota_dos_lobos',
  },
  {
    key: 'clareira',
    label: 'Concluiu a Clareira do Chamado',
    match: (e) => r(e) === 'clareira_concluida',
  },
  {
    key: 'camara_aberta',
    label: 'Abriu a Câmara do Sussurro',
    match: (e) => r(e) === 'camara_do_sussurro_aberta',
  },
  {
    key: 'sussurro_concluido',
    label: 'Concluiu Sussurro',
    match: (e) => r(e) === 'sussurro_concluido',
  },
  {
    key: 'jardim_psique',
    label: 'Registro no Jardim da Psique',
    match: (e) => e.context_area === 'jardim-da-psique' && e.action_type === 'created_entry',
  },
  {
    key: 'jardim_oficio',
    label: 'Registro no Jardim do Ofício',
    match: (e) => e.context_area === 'jardim-do-oficio' && e.action_type === 'created_entry',
  },
  {
    key: 'ferramenta',
    label: 'Usou uma Ferramenta Oracular',
    match: (e) => r(e) === 'ferramenta_uso' || e.object_type === 'ferramenta',
  },
];

export function FounderRastrosDialog({ open, onOpenChange, founder }: FounderRastrosDialogProps) {
  const [events, setEvents] = useState<LearningEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open || !founder?.user_id) return;
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('student_learning_events')
          .select('id, created_at, context_area, action_type, object_type, object_id, metadata_short')
          .eq('user_id', founder.user_id)
          .order('created_at', { ascending: true })
          .limit(500);
        if (error) throw error;
        if (!cancelled) setEvents((data as any) || []);
      } catch (err) {
        console.warn('[FounderRastros] erro:', err);
        if (!cancelled) setEvents([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, founder?.user_id]);

  const rastroStatus = RASTROS.map((r) => ({
    ...r,
    present: events.some(r.match),
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-card/95 backdrop-blur-xl border-primary/20">
        <DialogHeader>
          <DialogTitle className="font-display text-primary">
            Rastros da Travessia
          </DialogTitle>
          <DialogDescription>
            Linha do tempo simbólica da fundadora.
          </DialogDescription>
        </DialogHeader>

        {founder && (
          <div className="space-y-1 pb-2 border-b border-primary/10">
            <div className="text-base font-medium text-foreground">
              {founder.nome || 'Fundadora'}
            </div>
            <div className="text-xs text-muted-foreground">{founder.email}</div>
            <div className="text-xs text-muted-foreground">
              Ativada em{' '}
              {format(new Date(founder.data_ativacao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6 py-2">
            <div>
              <h3 className="text-sm font-medium text-foreground/80 mb-3">
                Marcadores da travessia
              </h3>
              <ul className="space-y-2">
                {rastroStatus.map((r) => (
                  <li key={r.key} className="flex items-center gap-3 text-sm">
                    {r.present ? (
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                    )}
                    <span
                      className={
                        r.present ? 'text-foreground' : 'text-muted-foreground/60'
                      }
                    >
                      {r.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium text-foreground/80 mb-3">
                Linha do tempo
              </h3>
              {events.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  Ainda não há rastros registrados.
                </p>
              ) : (
                <ScrollArea className="h-64 pr-3">
                  <ol className="relative border-l border-primary/20 pl-4 space-y-3">
                    {events.map((e) => (
                      <li key={e.id} className="text-xs">
                        <div className="absolute -left-[5px] w-2 h-2 rounded-full bg-primary/60 mt-1.5" />
                        <div className="text-muted-foreground">
                          {format(new Date(e.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </div>
                        <div className="text-foreground/90">
                          {[e.context_area, e.action_type, e.object_type].filter(Boolean).join(' · ')}
                          {e.metadata_short?.rastro ? ` — ${e.metadata_short.rastro}` : ''}
                        </div>
                      </li>
                    ))}
                  </ol>
                </ScrollArea>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
