import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Eye, FileText, Copy, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAtelieConteudos, useDeleteConteudo, useUpdateConteudo, AtelieConteudo } from "@/hooks/useAtelieConteudo";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  rascunho: { label: "Rascunho", variant: "secondary" },
  revisado: { label: "Revisado", variant: "outline" },
  publicado: { label: "Publicado", variant: "default" },
};

export default function AtelieHistorico() {
  const { data: conteudos, isLoading } = useAtelieConteudos();
  const deleteConteudo = useDeleteConteudo();
  const updateConteudo = useUpdateConteudo();
  const [selectedConteudo, setSelectedConteudo] = useState<AtelieConteudo | null>(null);

  const handleCopyContent = (conteudo: AtelieConteudo) => {
    const content = conteudo.conteudo_gerado;
    if (!content) return;

    const text = Object.entries(content)
      .map(([key, value]) => `### ${key}\n\n${value}`)
      .join("\n\n---\n\n");

    navigator.clipboard.writeText(text);
  };

  const handleStatusChange = (id: string, status: "rascunho" | "revisado" | "publicado") => {
    updateConteudo.mutate({ id, status });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Carregando histórico...
        </CardContent>
      </Card>
    );
  }

  if (!conteudos?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Histórico de Conteúdos
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center text-muted-foreground">
          Nenhum conteúdo gerado ainda. Use o formulário acima para criar seu primeiro portal.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Histórico de Conteúdos
        </CardTitle>
        <CardDescription>
          {conteudos.length} conteúdo(s) gerado(s)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {conteudos.map((conteudo) => (
            <div
              key={conteudo.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium truncate">{conteudo.portal}</h4>
                  <Badge variant={STATUS_LABELS[conteudo.status]?.variant || "secondary"}>
                    {STATUS_LABELS[conteudo.status]?.label || conteudo.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {conteudo.jornada}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(conteudo.created_at), "dd MMM yyyy, HH:mm", { locale: ptBR })}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* View Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedConteudo(conteudo)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>{conteudo.portal}</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[60vh] pr-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Jornada:</span> {conteudo.jornada}
                          </div>
                          <div>
                            <span className="font-medium">Tom:</span> {conteudo.tom}
                          </div>
                          <div className="col-span-2">
                            <span className="font-medium">Objetivo:</span> {conteudo.objetivo}
                          </div>
                        </div>
                        <hr />
                        {conteudo.conteudo_gerado && Object.entries(conteudo.conteudo_gerado).map(([key, value]) => (
                          <div key={key} className="space-y-2">
                            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                              {key.replace(/_/g, " ")}
                            </h4>
                            <div className="prose prose-sm dark:prose-invert whitespace-pre-wrap">
                              {value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>

                {/* Actions Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleCopyContent(conteudo)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar conteúdo
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(conteudo.id, "revisado")}>
                      Marcar como Revisado
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(conteudo.id, "publicado")}>
                      Marcar como Publicado
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Delete Confirmation */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir conteúdo?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. O conteúdo "{conteudo.portal}" será permanentemente excluído.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteConteudo.mutate(conteudo.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
