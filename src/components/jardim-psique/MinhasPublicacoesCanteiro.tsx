import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useMinhasPublicacoesCanteiro, useRevogarPublicacao } from '@/hooks/useMinhasPublicacoesCanteiro';
import { Sprout, Trash2, Loader2, Clock, CheckCircle2, XCircle, BookOpen, HelpCircle, Flame, Headphones, Quote } from 'lucide-react';
import { formatDateSafe } from '@/lib/date-safe';

const ENTRY_TYPE_LABELS: Record<string, { label: string; icon: React.ElementType }> = {
  reflexao:        { label: 'Reflexão',           icon: BookOpen },
  pergunta:        { label: 'Pergunta',           icon: HelpCircle },
  semente_pratica: { label: 'Semente de Prática', icon: Flame },
  eco_de_leitura:  { label: 'Eco de Leitura',     icon: Headphones },
  fragmento:       { label: 'Fragmento',          icon: Quote },
};

export function MinhasPublicacoesCanteiro() {
  const { data: publicacoes, isLoading } = useMinhasPublicacoesCanteiro();
  const revogar = useRevogarPublicacao();
  const [revogarId, setRevogarId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="py-6 text-center">
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground mx-auto" />
      </div>
    );
  }

  if (!publicacoes || publicacoes.length === 0) {
    return (
      <Card className="border-dashed border-border/20 bg-card/30">
        <CardContent className="py-8 text-center">
          <Sprout className="w-8 h-8 text-muted-foreground/15 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground/50">
            Você ainda não compartilhou nenhum registro no Canteiro.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatus = (pub: typeof publicacoes[0]) => {
    if (pub.rejeitado) return { label: 'Recusada', icon: XCircle, color: 'text-destructive/70' };
    if (pub.aprovado_por_admin && pub.publicado_em) return { label: 'Publicada', icon: CheckCircle2, color: 'text-emerald-400' };
    return { label: 'Em curadoria', icon: Clock, color: 'text-amber-400' };
  };

  const publicadasCount = publicacoes.filter(p => p.aprovado_por_admin && p.publicado_em).length;
  const curadoriaCount = publicacoes.filter(p => !p.aprovado_por_admin && !p.rejeitado).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sprout className="w-4 h-4 text-primary/50" />
          <h3 className="text-sm font-medium text-foreground/70">Minhas Publicações no Canteiro</h3>
        </div>
        <div className="flex gap-1.5">
          {publicadasCount > 0 && (
            <Badge variant="outline" className="text-[9px] border-emerald-400/20 text-emerald-400/70">
              {publicadasCount} publicada{publicadasCount !== 1 ? 's' : ''}
            </Badge>
          )}
          {curadoriaCount > 0 && (
            <Badge variant="outline" className="text-[9px] border-amber-400/20 text-amber-400/70">
              {curadoriaCount} em curadoria
            </Badge>
          )}
        </div>
      </div>

      {publicacoes.map((pub) => {
        const status = getStatus(pub);
        const StatusIcon = status.icon;
        const entryType = (pub as any).entry_type as string | undefined;
        const typeInfo = entryType ? ENTRY_TYPE_LABELS[entryType] : null;
        const TypeIcon = typeInfo?.icon;
        const publishedTitle = (pub as any).published_title as string | undefined;

        return (
          <Card key={pub.id} className="bg-card/40 border-border/15 hover:border-border/25 transition-all">
            <CardContent className="p-4 space-y-2">
              {/* Type + Title row */}
              <div className="flex items-center gap-2">
                {TypeIcon && (
                  <div className="flex items-center gap-1.5">
                    <TypeIcon className="w-3 h-3 text-primary/50" />
                    <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">
                      {typeInfo?.label}
                    </span>
                  </div>
                )}
                {publishedTitle && (
                  <span className="text-xs text-foreground/50 italic ml-1">· {publishedTitle}</span>
                )}
              </div>

              {/* Text preview */}
              <p className="text-sm text-foreground/65 line-clamp-2 whitespace-pre-line">
                {pub.texto}
              </p>

              {/* Footer: status + date + actions */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <StatusIcon className={`w-3 h-3 ${status.color}`} />
                  <span className={`text-[10px] ${status.color}`}>{status.label}</span>
                  <span className="text-[10px] text-muted-foreground/30">
                    {formatDateSafe(pub.created_at, "dd MMM yyyy")}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-[10px] text-destructive/50 hover:text-destructive"
                  onClick={() => setRevogarId(pub.id)}
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Remover
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <AlertDialog open={!!revogarId} onOpenChange={(open) => !open && setRevogarId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-base">Remover do Canteiro?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              A publicação será removida do Canteiro. Seu registro original no Jardim permanece intacto e privado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={revogar.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (revogarId) revogar.mutate(revogarId, { onSuccess: () => setRevogarId(null) }); }}
              disabled={revogar.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {revogar.isPending ? 'Removendo...' : 'Remover'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
