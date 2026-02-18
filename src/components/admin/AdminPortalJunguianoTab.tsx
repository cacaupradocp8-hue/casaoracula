import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ExternalLink, RefreshCw, Eye, Edit2, Save, X } from "lucide-react";

export function AdminPortalJunguianoTab() {
  const queryClient = useQueryClient();
  const [editingPorta, setEditingPorta] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Record<string, string>>({});

  // Fetch config
  const { data: config, isLoading: configLoading } = useQuery({
    queryKey: ["portal-junguiano-config"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portal_junguiano_config")
        .select("*")
        .single();
      if (error) throw error;
      return data;
    },
  });

  // Fetch modulos with portais
  const { data: modulos, isLoading: modulosLoading } = useQuery({
    queryKey: ["portal-junguiano-modulos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portal_junguiano_modulos")
        .select(`*, portal_junguiano_portais(*)`)
        .order("ordem");
      if (error) throw error;
      return data;
    },
  });

  // Toggle status (rascunho <-> publicado)
  const toggleStatus = useMutation({
    mutationFn: async () => {
      const novoStatus = config?.status === "publicado" ? "rascunho" : "publicado";
      const { error } = await supabase
        .from("portal_junguiano_config")
        .update({ status: novoStatus })
        .eq("id", config!.id);
      if (error) throw error;
      return novoStatus;
    },
    onSuccess: (novoStatus) => {
      toast.success(`Portal ${novoStatus === "publicado" ? "publicado" : "voltou para rascunho"}`);
      queryClient.invalidateQueries({ queryKey: ["portal-junguiano-config"] });
    },
    onError: () => toast.error("Erro ao atualizar status"),
  });

  // Update porta
  const updatePorta = useMutation({
    mutationFn: async ({ id, dados }: { id: string; dados: Record<string, string> }) => {
      const { error } = await supabase
        .from("portal_junguiano_portais")
        .update(dados)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Porta atualizada");
      setEditingPorta(null);
      queryClient.invalidateQueries({ queryKey: ["portal-junguiano-modulos"] });
    },
    onError: () => toast.error("Erro ao salvar"),
  });

  const startEdit = (porta: Record<string, string>) => {
    setEditingPorta(porta.id);
    setEditForm({
      titulo: porta.titulo || "",
      subtitulo: porta.subtitulo || "",
      texto_aula_principal: porta.texto_aula_principal || "",
      audio_url: porta.audio_url || "",
      vivencia_guiada: porta.vivencia_guiada || "",
      missao_titulo: porta.missao_titulo || "",
      missao_descricao: porta.missao_descricao || "",
    });
  };

  if (configLoading || modulosLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header / Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                Portal Junguiano — Travessia das 9 Forças da Psique
                <Badge variant={config?.status === "publicado" ? "default" : "secondary"}>
                  {config?.status || "rascunho"}
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Acesso mínimo: <strong>{config?.portal_minimo || "aluna_formacao"}</strong>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/portal-junguiano"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="gap-2">
                  <Eye className="w-4 h-4" />
                  Ver Portal
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </a>
              <Button
                size="sm"
                variant={config?.status === "publicado" ? "destructive" : "default"}
                className="gap-2"
                onClick={() => toggleStatus.mutate()}
                disabled={toggleStatus.isPending || !config}
              >
                {config?.status === "publicado" ? "Despublicar" : "Publicar Portal"}
              </Button>
            </div>
          </div>
        </CardHeader>
        {config?.aviso_etico && (
          <CardContent>
            <div className="rounded-md bg-warning/10 border border-warning/30 p-3 text-sm text-foreground">
              <strong>Aviso ético configurado:</strong> {config.aviso_etico}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Módulos e Portas */}
      {modulos?.map((modulo: Record<string, unknown>) => (
        <Card key={modulo.id as string}>
          <CardHeader>
            <CardTitle className="text-base capitalize">
              {(modulo.tipo as string)?.replace(/_/g, " ")} — Módulo {modulo.ordem as number}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {((modulo.portal_junguiano_portais as Record<string, unknown>[]) || [])
              .sort((a, b) => (a.numero_ordem as number) - (b.numero_ordem as number))
              .map((porta) => (
                <div
                  key={porta.id as string}
                  className="border border-border rounded-lg p-4 space-y-3"
                >
                  {editingPorta === porta.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Título</Label>
                          <Input
                            value={editForm.titulo}
                            onChange={(e) => setEditForm({ ...editForm, titulo: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Subtítulo</Label>
                          <Input
                            value={editForm.subtitulo}
                            onChange={(e) => setEditForm({ ...editForm, subtitulo: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Texto da Aula Principal</Label>
                        <Textarea
                          rows={5}
                          value={editForm.texto_aula_principal}
                          onChange={(e) => setEditForm({ ...editForm, texto_aula_principal: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>URL Áudio (Sibila)</Label>
                          <Input
                            value={editForm.audio_url}
                            onChange={(e) => setEditForm({ ...editForm, audio_url: e.target.value })}
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <Label>Vivência Guiada</Label>
                          <Input
                            value={editForm.vivencia_guiada}
                            onChange={(e) => setEditForm({ ...editForm, vivencia_guiada: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Missão — Título</Label>
                          <Input
                            value={editForm.missao_titulo}
                            onChange={(e) => setEditForm({ ...editForm, missao_titulo: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Missão — Descrição</Label>
                          <Input
                            value={editForm.missao_descricao}
                            onChange={(e) => setEditForm({ ...editForm, missao_descricao: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="gap-2"
                          onClick={() => updatePorta.mutate({ id: porta.id as string, dados: editForm })}
                          disabled={updatePorta.isPending}
                        >
                          <Save className="w-4 h-4" />
                          Salvar
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingPorta(null)}>
                          <X className="w-4 h-4" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            #{porta.numero_ordem as number}
                          </Badge>
                          <span className="font-medium">{(porta.titulo as string) || "Sem título"}</span>
                          {porta.subtitulo && (
                            <span className="text-sm text-muted-foreground">— {porta.subtitulo as string}</span>
                          )}
                        </div>
                        <div className="mt-1 flex gap-4 text-xs text-muted-foreground">
                          {porta.audio_url && <span>🔊 Áudio configurado</span>}
                          {porta.missao_titulo && <span>🎯 Missão: {porta.missao_titulo as string}</span>}
                          {!(porta.texto_aula_principal) && (
                            <span className="text-destructive">⚠ Sem conteúdo de aula</span>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-2 shrink-0"
                        onClick={() => startEdit(porta as Record<string, string>)}
                      >
                        <Edit2 className="w-4 h-4" />
                        Editar
                      </Button>
                    </div>
                  )}
                </div>
              ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
