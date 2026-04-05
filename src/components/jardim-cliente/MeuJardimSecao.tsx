import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, BookOpen, Heart, Moon, PenLine, Sparkles, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
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

                  <div className="flex items-center pt-1 border-t border-border/10">
                    <button
                      onClick={() => onToggleShare(entry.id, entry.shared_with_therapist)}
                      className={cn(
                        "flex items-center gap-1.5 text-[10px] transition-colors",
                        entry.shared_with_therapist
                          ? "text-primary/70 hover:text-primary/50"
                          : "text-muted-foreground/40 hover:text-muted-foreground/60"
                      )}
                    >
                      {entry.shared_with_therapist ? (
                        <><Eye className="w-3 h-3" /> Visível para terapeuta</>
                      ) : (
                        <><EyeOff className="w-3 h-3" /> Só eu vejo</>
                      )}
                    </button>
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
    </div>
  );
}
