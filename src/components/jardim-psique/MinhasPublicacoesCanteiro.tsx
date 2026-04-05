import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useMinhasPublicacoesCanteiro, useRevogarPublicacao } from '@/hooks/useMinhasPublicacoesCanteiro';
import { Sprout, Trash2, Loader2, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
          <Sprout className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground/60">
            Você ainda não compartilhou nenhum registro no Canteiro.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatus = (pub: typeof publicacoes[0]) => {
    if (pub.rejeitado) return { label: 'Recusada', icon: XCircle, color: 'text-red-400' };
    if (pub.aprovado_por_admin && pub.publicado_em) return { label: 'Publicada', icon: CheckCircle2, color: 'text-emerald-400' };
    return { label: 'Em curadoria', icon: Clock, color: 'text-amber-400' };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Sprout className="w-4 h-4 text-emerald-400/60" />
        <h3 className="text-sm font-medium text-foreground/70">Minhas Publicações no Canteiro</h3>
        <Badge variant="outline" className="text-[10px]">{publicacoes.length}</Badge>
      </div>

      {publicacoes.map((pub) => {
        const status = getStatus(pub);
        const StatusIcon = status.icon;
        return (
          <Card key={pub.id} className="bg-card/50 border-border/20">
            <CardContent className="p-4 space-y-2">
              <p className="text-sm text-foreground/70 line-clamp-2 whitespace-pre-line">
                {pub.texto}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusIcon className={`w-3 h-3 ${status.color}`} />
                  <span className={`text-[10px] ${status.color}`}>{status.label}</span>
                  <span className="text-[10px] text-muted-foreground/40">
                    {format(new Date(pub.created_at), "dd MMM yyyy", { locale: ptBR })}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-[10px] text-destructive/60 hover:text-destructive"
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
