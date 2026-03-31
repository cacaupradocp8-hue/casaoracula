import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Leaf, Loader2, Send, Lock, Eye, EyeOff, 
  Sparkles, Heart, BookOpen 
} from 'lucide-react';
import { useClienteJardim, type JardimEntry } from '@/hooks/useClienteJardim';
import { useOrientacoesCliente } from '@/hooks/useOrientacoes';
import { OrientacaoCard } from '@/components/jardim/OrientacaoCard';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const ENTRY_TYPES = [
  { key: 'reflexao', label: 'Reflexão', icon: Sparkles, desc: 'Um pensamento, uma percepção' },
  { key: 'sentimento', label: 'Sentimento', icon: Heart, desc: 'O que sinto agora' },
  { key: 'observacao', label: 'Observação', icon: Eye, desc: 'Algo que notei em mim' },
] as const;

function EntryCard({ entry, userId, onToggleShare }: { 
  entry: JardimEntry; 
  userId: string;
  onToggleShare: (id: string, current: boolean) => void;
}) {
  const isOwn = entry.created_by === userId;
  const isTherapist = !isOwn;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl p-4 border transition-all",
        isTherapist 
          ? "bg-emerald-950/20 border-emerald-500/20" 
          : "bg-card/60 border-border/30"
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          {isTherapist ? (
            <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">
              <Leaf className="w-3 h-3 mr-1" />
              Da terapeuta
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
              <BookOpen className="w-3 h-3 mr-1" />
              {entry.entry_type === 'reflexao' ? 'Reflexão' : 
               entry.entry_type === 'sentimento' ? 'Sentimento' : 'Observação'}
            </Badge>
          )}
        </div>
        <span className="text-[10px] text-muted-foreground">
          {format(new Date(entry.created_at), "dd MMM · HH:mm", { locale: ptBR })}
        </span>
      </div>

      <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
        {entry.content}
      </p>

      {isOwn && (
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/20">
          <button
            onClick={() => onToggleShare(entry.id, entry.shared_with_therapist)}
            className={cn(
              "flex items-center gap-1.5 text-[10px] transition-colors",
              entry.shared_with_therapist 
                ? "text-emerald-400 hover:text-emerald-300" 
                : "text-muted-foreground/50 hover:text-muted-foreground"
            )}
          >
            {entry.shared_with_therapist ? (
              <><Eye className="w-3 h-3" /> Visível para terapeuta</>
            ) : (
              <><EyeOff className="w-3 h-3" /> Só eu vejo</>
            )}
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default function JardimHeroinaClientePage() {
  const { user } = useAuth();
  const { jardim, entries, loading, saving, criarEntry, toggleSharedWithTherapist } = useClienteJardim();
  const { orientacoes, loading: loadingOrientacoes, marcarVista, completar, responder } = useOrientacoesCliente();
  const [content, setContent] = useState('');
  const [entryType, setEntryType] = useState('reflexao');
  const [shareWithTherapist, setShareWithTherapist] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    const success = await criarEntry(content.trim(), entryType, shareWithTherapist);
    if (success) {
      setContent('');
      setShareWithTherapist(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-5 h-5 text-emerald-500/50 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!jardim) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center mb-6">
            <Leaf className="w-8 h-8 text-emerald-500/30" />
          </div>
          <h2 className="text-lg font-display text-foreground/80 mb-2">Jardim ainda não preparado</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Seu Jardim da Heroína será ativado pela sua terapeuta durante a sessão. 
            Este é um espaço de integração entre sessões.
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen pb-24">
        {/* Header */}
        <section className="relative py-12 md:py-16 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 container mx-auto px-6 text-center max-w-md">
            <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center mb-4">
              <Leaf className="w-5 h-5 text-emerald-500/60" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.5em] text-emerald-500/40 font-medium mb-3">
              Jardim da Heroína
            </p>
            <p className="text-foreground/50 text-xs font-display italic">
              Um espaço seguro para observar o que emergiu
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-lg space-y-6">
          {/* New Entry Form */}
          <Card className="border-emerald-500/20 bg-card/70 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-foreground/80">
                <Sparkles className="w-4 h-4 text-emerald-500/60" />
                Novo registro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Entry type selection */}
              <div className="flex gap-2">
                {ENTRY_TYPES.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setEntryType(key)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs transition-all border",
                      entryType === key 
                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" 
                        : "bg-card/50 border-border/20 text-muted-foreground hover:border-border/40"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>

              <Textarea
                placeholder={
                  entryType === 'reflexao' ? 'O que surgiu em mim desde a última sessão...' :
                  entryType === 'sentimento' ? 'O que estou sentindo agora...' :
                  'Algo que notei em mim esta semana...'
                }
                value={content}
                onChange={e => setContent(e.target.value.slice(0, 500))}
                className="min-h-[100px] resize-none bg-background/50"
                maxLength={500}
              />
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-muted-foreground">{content.length}/500</p>
              </div>

              {/* Share toggle */}
              <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                <div className="flex items-center gap-2">
                  {shareWithTherapist ? (
                    <Eye className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  )}
                  <Label className="text-xs text-foreground/70 cursor-pointer">
                    {shareWithTherapist ? 'Terapeuta poderá ver' : 'Só eu verei este registro'}
                  </Label>
                </div>
                <Switch
                  checked={shareWithTherapist}
                  onCheckedChange={setShareWithTherapist}
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={saving || !content.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Guardar no Jardim
              </Button>
            </CardContent>
          </Card>

          {/* Entries List */}
          {entries.length > 0 && (
            <>
              <Separator className="border-border/20" />
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50 text-center">
                  Registros do Jardim
                </p>
                <AnimatePresence>
                  {entries.map(entry => (
                    <EntryCard
                      key={entry.id}
                      entry={entry}
                      userId={user?.id || ''}
                      onToggleShare={toggleSharedWithTherapist}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}

          {entries.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground/40 font-display italic">
                O Jardim aguarda suas primeiras sementes.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
