import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Eye, EyeOff, BookOpen, Heart, Moon, PenLine, Sparkles, Lock, Send } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { trackLearningEvent } from '@/services/studentTrackingService';
import type { JardimEntry } from '@/hooks/useClienteJardimCompleto';
import { JardimHojeBloco } from './JardimHojeBloco';

const TIPO_ICON: Record<string, { icon: any; label: string }> = {
  reflexao: { icon: Sparkles, label: 'Reflexão' },
  sensacao: { icon: Heart, label: 'Sensação' },
  sonho: { icon: Moon, label: 'Sonho' },
  anotacao: { icon: PenLine, label: 'Anotação' },
  observacao: { icon: Eye, label: 'Observação' },
  sentimento: { icon: Heart, label: 'Sentimento' },
  resposta: { icon: BookOpen, label: 'Resposta' },
};

interface Props {
  entries: JardimEntry[];
  userId: string;
  saving: boolean;
  onCriar: (content: string, type: string, shared: boolean) => Promise<boolean>;
  onToggleShare: (id: string, current: boolean) => void;
}

export function MeuJardimSecao({ entries, userId, saving, onCriar, onToggleShare }: Props) {
  const { user } = useAuth();
  const [shareConfirm, setShareConfirm] = useState<JardimEntry | null>(null);
  const [sharing, setSharing] = useState(false);

  const handleShareToCanteiro = async () => {
    if (!shareConfirm || !user) return;
    setSharing(true);
    try {
      // Get active canteiro
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
        texto: shareConfirm.content || '',
        exibicao_anonima: false,
        aprovado_por_admin: false,
        source_entry_id: shareConfirm.id,
      };

      const { error } = await supabase
        .from('collective_bed_entries')
        .insert(insertData as any);

      if (error) throw error;

      trackLearningEvent({
        contextArea: 'jardim-da-psique',
        actionType: 'shared_to_canteiro',
        objectType: 'registro_jardim',
        objectId: shareConfirm.id,
      });

      toast.success('Partilha enviada para curadoria do Canteiro.');
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
      toast.error('Erro ao compartilhar no Canteiro.');
    } finally {
      setSharing(false);
      setShareConfirm(null);
    }
  };

  return (
    <div className="space-y-6">
      <JardimHojeBloco saving={saving} onCriar={onCriar} />

      {entries.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50 text-center">
            Meus registros
          </p>
          <AnimatePresence>
            {entries.map((entry) => {
              const tipo = TIPO_ICON[entry.entry_type] || TIPO_ICON.anotacao;
              const Icon = tipo.icon;
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl p-4 border border-border/20 bg-card/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] border-border/20 text-foreground/60">
                        <Icon className="w-3 h-3 mr-1" />
                        {tipo.label}
                      </Badge>
                      {/* Privacy indicator */}
                      <span className="flex items-center gap-1 text-[9px] text-muted-foreground/40">
                        <Lock className="w-2.5 h-2.5" />
                        Privado
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground/40">
                      {format(new Date(entry.created_at), "dd MMM · HH:mm", { locale: ptBR })}
                    </span>
                  </div>

                  <p className="text-sm text-foreground/70 leading-relaxed whitespace-pre-wrap">
                    {entry.content}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-border/10">
                    <button
                      onClick={() => onToggleShare(entry.id, entry.shared_with_therapist)}
                      className={cn(
                        "flex items-center gap-1.5 text-[10px] transition-colors",
                        entry.shared_with_therapist
                          ? "text-emerald-400 hover:text-emerald-300"
                          : "text-muted-foreground/40 hover:text-muted-foreground/60"
                      )}
                    >
                      {entry.shared_with_therapist ? (
                        <><Eye className="w-3 h-3" /> Visível para terapeuta</>
                      ) : (
                        <><EyeOff className="w-3 h-3" /> Só eu vejo</>
                      )}
                    </button>

                    {/* Share to Canteiro */}
                    {entry.content && (
                      <button
                        onClick={() => setShareConfirm(entry)}
                        className="flex items-center gap-1 text-[10px] text-muted-foreground/40 hover:text-primary/60 transition-colors"
                      >
                        <Send className="w-3 h-3" />
                        Canteiro
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {entries.length === 0 && (
        <div className="text-center py-8">
          <p className="text-xs text-muted-foreground/40 italic">
            O Jardim aguarda suas primeiras sementes.
          </p>
        </div>
      )}

      {/* Confirmation dialog */}
      <AlertDialog open={!!shareConfirm} onOpenChange={(open) => !open && setShareConfirm(null)}>
        <AlertDialogContent>
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
            <AlertDialogAction onClick={handleShareToCanteiro} disabled={sharing}>
              {sharing ? 'Enviando...' : 'Enviar para o Canteiro'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
