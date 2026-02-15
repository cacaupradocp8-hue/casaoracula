import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Star, Loader2 } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

interface ModuloFormativo {
  id: string;
  nome_modulo: string;
  tipo_modulo: string;
  descricao_curta: string | null;
  imagem_capa: string | null;
  ordem_exibicao: number;
  nivel_acesso: string;
  status_publicacao: string;
  destaque_vitrine: boolean;
  rota_destino: string | null;
  created_at: string;
  updated_at: string;
}

type ModuloForm = Omit<ModuloFormativo, "id" | "created_at" | "updated_at">;

const EMPTY_FORM: ModuloForm = {
  nome_modulo: "",
  tipo_modulo: "curso",
  descricao_curta: "",
  imagem_capa: "",
  ordem_exibicao: 0,
  nivel_acesso: "aberta",
  status_publicacao: "rascunho",
  destaque_vitrine: false,
  rota_destino: "",
};

const TIPO_OPTIONS = [
  { value: "jornada", label: "Jornada" },
  { value: "curso", label: "Curso" },
  { value: "circulo", label: "Círculo" },
  { value: "travessia", label: "Travessia" },
  { value: "biblioteca", label: "Biblioteca" },
];

const NIVEL_OPTIONS = [
  { value: "aberta", label: "Aberta (todos)" },
  { value: "iniciada", label: "Iniciada (Certificação)" },
  { value: "certificada", label: "Certificada (Assinante)" },
  { value: "mentoria", label: "Mentoria" },
];

const STATUS_OPTIONS = [
  { value: "rascunho", label: "Rascunho" },
  { value: "publicado", label: "Publicado" },
];

export default function AdminModulosFormativos() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ModuloForm>(EMPTY_FORM);

  const { data: modulos, isLoading } = useQuery({
    queryKey: ["admin-modulos-formativos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("modulos_formativos")
        .select("*")
        .order("ordem_exibicao", { ascending: true });
      if (error) throw error;
      return data as ModuloFormativo[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: { id?: string; form: ModuloForm }) => {
      if (data.id) {
        const { error } = await supabase
          .from("modulos_formativos")
          .update(data.form as any)
          .eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("modulos_formativos")
          .insert(data.form as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-modulos-formativos"] });
      queryClient.invalidateQueries({ queryKey: ["modulos-formativos-vitrine"] });
      toast.success(editingId ? "Módulo atualizado" : "Módulo criado");
      closeDialog();
    },
    onError: (err: any) => toast.error(err.message || "Erro ao salvar"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("modulos_formativos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-modulos-formativos"] });
      queryClient.invalidateQueries({ queryKey: ["modulos-formativos-vitrine"] });
      toast.success("Módulo removido");
    },
    onError: (err: any) => toast.error(err.message || "Erro ao remover"),
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ id, newOrder }: { id: string; newOrder: number }) => {
      const { error } = await supabase
        .from("modulos_formativos")
        .update({ ordem_exibicao: newOrder } as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-modulos-formativos"] });
      queryClient.invalidateQueries({ queryKey: ["modulos-formativos-vitrine"] });
    },
  });

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const openCreate = () => {
    setForm({ ...EMPTY_FORM, ordem_exibicao: (modulos?.length || 0) + 1 });
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (m: ModuloFormativo) => {
    setForm({
      nome_modulo: m.nome_modulo,
      tipo_modulo: m.tipo_modulo,
      descricao_curta: m.descricao_curta || "",
      imagem_capa: m.imagem_capa || "",
      ordem_exibicao: m.ordem_exibicao,
      nivel_acesso: m.nivel_acesso,
      status_publicacao: m.status_publicacao,
      destaque_vitrine: m.destaque_vitrine,
      rota_destino: m.rota_destino || "",
    });
    setEditingId(m.id);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.nome_modulo.trim()) {
      toast.error("Nome do módulo é obrigatório");
      return;
    }
    saveMutation.mutate({ id: editingId || undefined, form });
  };

  const handleReorder = (id: string, currentOrder: number, direction: "up" | "down") => {
    const newOrder = direction === "up" ? currentOrder - 1 : currentOrder + 1;
    reorderMutation.mutate({ id, newOrder });
  };

  const content = (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <SectionHeader
            title="Módulos Formativos"
            subtitle="Gerencie os módulos exibidos na Vitrine"
          />
          <Button onClick={openCreate} className="gap-2">
            <Plus className="w-4 h-4" /> Novo Módulo
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Acesso</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12">⭐</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modulos?.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-mono text-xs">{m.ordem_exibicao}</TableCell>
                    <TableCell className="font-medium">{m.nome_modulo}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {TIPO_OPTIONS.find((t) => t.value === m.tipo_modulo)?.label || m.tipo_modulo}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {NIVEL_OPTIONS.find((n) => n.value === m.nivel_acesso)?.label || m.nivel_acesso}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={m.status_publicacao === "publicado" ? "default" : "outline"}
                        className="text-xs"
                      >
                        {m.status_publicacao === "publicado" ? "Publicado" : "Rascunho"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {m.destaque_vitrine && <Star className="w-4 h-4 text-gold" />}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleReorder(m.id, m.ordem_exibicao, "up")}
                        >
                          <ArrowUp className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleReorder(m.id, m.ordem_exibicao, "down")}
                        >
                          <ArrowDown className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(m)}>
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => {
                            if (confirm("Remover este módulo?")) deleteMutation.mutate(m.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {(!modulos || modulos.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhum módulo criado ainda.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Módulo" : "Novo Módulo"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label>Nome do Módulo *</Label>
                <Input
                  value={form.nome_modulo}
                  onChange={(e) => setForm({ ...form, nome_modulo: e.target.value })}
                  placeholder="Ex: Travessia Zero"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo</Label>
                  <Select value={form.tipo_modulo} onValueChange={(v) => setForm({ ...form, tipo_modulo: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TIPO_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Nível de Acesso</Label>
                  <Select value={form.nivel_acesso} onValueChange={(v) => setForm({ ...form, nivel_acesso: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {NIVEL_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Descrição Curta</Label>
                <Textarea
                  value={form.descricao_curta || ""}
                  onChange={(e) => setForm({ ...form, descricao_curta: e.target.value })}
                  placeholder="Breve descrição do módulo"
                  rows={2}
                />
              </div>

              <div>
                <Label>URL da Imagem de Capa</Label>
                <Input
                  value={form.imagem_capa || ""}
                  onChange={(e) => setForm({ ...form, imagem_capa: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label>Rota de Destino</Label>
                <Input
                  value={form.rota_destino || ""}
                  onChange={(e) => setForm({ ...form, rota_destino: e.target.value })}
                  placeholder="/jornada ou /salas/..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Select
                    value={form.status_publicacao}
                    onValueChange={(v) => setForm({ ...form, status_publicacao: v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Ordem de Exibição</Label>
                  <Input
                    type="number"
                    value={form.ordem_exibicao}
                    onChange={(e) => setForm({ ...form, ordem_exibicao: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={form.destaque_vitrine}
                  onCheckedChange={(v) => setForm({ ...form, destaque_vitrine: v })}
                />
                <Label>Destaque na Vitrine</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>Cancelar</Button>
              <Button onClick={handleSave} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editingId ? "Salvar" : "Criar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );

  return content;
}
