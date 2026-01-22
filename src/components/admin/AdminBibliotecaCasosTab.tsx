import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2, BookOpen, Building2 } from "lucide-react";
import {
  useBibliotecaCasosAdmin,
  useCreateBibliotecaCaso,
  useUpdateBibliotecaCaso,
  useDeleteBibliotecaCaso,
  BibliotecaCaso,
} from "@/hooks/useBibliotecaCasos";
import { TorreId, TORRE_METADATA } from "@/hooks/useTorrePortaIntegracao";

const TORRE_IDS: TorreId[] = [
  "controle",
  "performance",
  "silencio",
  "cuidado",
  "adaptacao",
  "espiritualizacao",
  "forca",
];

const RISCO_TIPOS = [
  { value: "pressa", label: "Pressa", class: "bg-red-500/20 text-red-300" },
  { value: "interpretacao", label: "Interpretação", class: "bg-purple-500/20 text-purple-300" },
  { value: "confronto", label: "Confronto", class: "bg-orange-500/20 text-orange-300" },
  { value: "moralizacao", label: "Moralização", class: "bg-yellow-500/20 text-yellow-300" },
  { value: "resiliencia", label: "Resiliência", class: "bg-green-500/20 text-green-300" },
  { value: "explicacao", label: "Explicação", class: "bg-blue-500/20 text-blue-300" },
  { value: "outro", label: "Outro", class: "bg-muted text-muted-foreground" },
];

const FONTE_OPTIONS = [
  { value: "modelo", label: "Modelo (Canônico)" },
  { value: "comunidade", label: "Comunidade" },
  { value: "supervisionado", label: "Supervisionado" },
];

interface FormData {
  torre_id: TorreId;
  porta_nome: string;
  titulo: string;
  cena: string;
  erro_comum: string;
  leitura_oracula: string;
  resultado: string;
  risco_tipo: string;
  tags: string;
  fonte: string;
  ativa: boolean;
  ordem: number;
}

const emptyForm: FormData = {
  torre_id: "controle",
  porta_nome: "",
  titulo: "",
  cena: "",
  erro_comum: "",
  leitura_oracula: "",
  resultado: "",
  risco_tipo: "",
  tags: "",
  fonte: "modelo",
  ativa: true,
  ordem: 0,
};

export default function AdminBibliotecaCasosTab() {
  const { toast } = useToast();
  const { data: casos, isLoading, refetch } = useBibliotecaCasosAdmin();
  const createMutation = useCreateBibliotecaCaso();
  const updateMutation = useUpdateBibliotecaCaso();
  const deleteMutation = useDeleteBibliotecaCaso();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCaso, setEditingCaso] = useState<BibliotecaCaso | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [filterTorre, setFilterTorre] = useState<string>("all");

  const filteredCasos = casos?.filter(
    (c) => filterTorre === "all" || c.torre_id === filterTorre
  );

  const openCreate = () => {
    setEditingCaso(null);
    setFormData(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (caso: BibliotecaCaso) => {
    setEditingCaso(caso);
    setFormData({
      torre_id: caso.torre_id,
      porta_nome: caso.porta_nome || "",
      titulo: caso.titulo || "",
      cena: caso.cena,
      erro_comum: caso.erro_comum,
      leitura_oracula: caso.leitura_oracula,
      resultado: caso.resultado,
      risco_tipo: caso.risco_tipo || "",
      tags: (caso.tags || []).join(", "),
      fonte: caso.fonte || "modelo",
      ativa: caso.ativa,
      ordem: caso.ordem,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.cena || !formData.erro_comum || !formData.leitura_oracula || !formData.resultado) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha Cena, Erro Comum, Leitura Orácula e Resultado.",
        variant: "destructive",
      });
      return;
    }

    const tagsArray = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      torre_id: formData.torre_id,
      porta_nome: formData.porta_nome || null,
      titulo: formData.titulo || null,
      cena: formData.cena,
      erro_comum: formData.erro_comum,
      leitura_oracula: formData.leitura_oracula,
      resultado: formData.resultado,
      risco_tipo: (formData.risco_tipo || null) as BibliotecaCaso["risco_tipo"],
      tags: tagsArray.length > 0 ? tagsArray : null,
      fonte: formData.fonte || null,
      ativa: formData.ativa,
      ordem: formData.ordem,
      porta_id: null,
      autor_id: null,
    };

    try {
      if (editingCaso) {
        await updateMutation.mutateAsync({ id: editingCaso.id, ...payload });
        toast({ title: "Caso atualizado com sucesso!" });
      } else {
        await createMutation.mutateAsync(payload);
        toast({ title: "Caso criado com sucesso!" });
      }
      setDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este caso?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: "Caso excluído!" });
      refetch();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleAtiva = async (caso: BibliotecaCaso) => {
    try {
      await updateMutation.mutateAsync({ id: caso.id, ativa: !caso.ativa });
      refetch();
    } catch (error: any) {
      toast({
        title: "Erro ao alterar status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getRiscoBadge = (risco: string | null) => {
    const found = RISCO_TIPOS.find((r) => r.value === risco);
    if (!found) return null;
    return <Badge className={found.class}>{found.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Biblioteca de Casos Clínicos</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Gerencie vinhetas clínicas para cada Torre
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Select value={filterTorre} onValueChange={setFilterTorre}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar Torre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Torres</SelectItem>
                {TORRE_IDS.map((id) => (
                  <SelectItem key={id} value={id}>
                    {TORRE_METADATA[id].nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Caso
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Torre</TableHead>
                <TableHead>Porta</TableHead>
                <TableHead className="max-w-xs">Cena</TableHead>
                <TableHead>Risco</TableHead>
                <TableHead>Fonte</TableHead>
                <TableHead className="w-20">Ativo</TableHead>
                <TableHead className="w-24">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(filteredCasos || []).map((caso) => (
                <TableRow key={caso.id}>
                  <TableCell className="text-muted-foreground">
                    {caso.ordem}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" style={{ color: TORRE_METADATA[caso.torre_id]?.cor }} />
                      <span className="text-sm">{TORRE_METADATA[caso.torre_id]?.nome || caso.torre_id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {caso.porta_nome || "-"}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm truncate">{caso.cena}</p>
                  </TableCell>
                  <TableCell>{getRiscoBadge(caso.risco_tipo)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {caso.fonte || "modelo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={caso.ativa}
                      onCheckedChange={() => toggleAtiva(caso)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(caso)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(caso.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!filteredCasos || filteredCasos.length === 0) && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Nenhum caso encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog para criar/editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCaso ? "Editar Caso Clínico" : "Novo Caso Clínico"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Torre *</Label>
                <Select
                  value={formData.torre_id}
                  onValueChange={(v) =>
                    setFormData({ ...formData, torre_id: v as TorreId })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TORRE_IDS.map((id) => (
                      <SelectItem key={id} value={id}>
                        {TORRE_METADATA[id].nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Porta Ativa</Label>
                <Input
                  placeholder="Ex: Porta da Incerteza"
                  value={formData.porta_nome}
                  onChange={(e) =>
                    setFormData({ ...formData, porta_nome: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Título (opcional)</Label>
              <Input
                placeholder="Título curto para identificação"
                value={formData.titulo}
                onChange={(e) =>
                  setFormData({ ...formData, titulo: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Cena Clínica * (5-7 linhas, descrição objetiva)</Label>
              <Textarea
                rows={4}
                placeholder="Descreva a cena clínica de forma objetiva..."
                value={formData.cena}
                onChange={(e) =>
                  setFormData({ ...formData, cena: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Erro Comum * (o que costuma acontecer sem o método)</Label>
              <Textarea
                rows={2}
                placeholder="O que terapeuta sem o método faria..."
                value={formData.erro_comum}
                onChange={(e) =>
                  setFormData({ ...formData, erro_comum: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Leitura Orácula * (o ajuste real feito)</Label>
              <Textarea
                rows={3}
                placeholder="O ajuste de postura no método..."
                value={formData.leitura_oracula}
                onChange={(e) =>
                  setFormData({ ...formData, leitura_oracula: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Resultado Observado * (o que mudou no campo)</Label>
              <Textarea
                rows={2}
                placeholder="O que mudou - não 'cura', mas movimento..."
                value={formData.resultado}
                onChange={(e) =>
                  setFormData({ ...formData, resultado: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Risco</Label>
                <Select
                  value={formData.risco_tipo || "none"}
                  onValueChange={(v) =>
                    setFormData({ ...formData, risco_tipo: v === "none" ? "" : v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    {RISCO_TIPOS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Fonte</Label>
                <Select
                  value={formData.fonte}
                  onValueChange={(v) => setFormData({ ...formData, fonte: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONTE_OPTIONS.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Ordem</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.ordem}
                  onChange={(e) =>
                    setFormData({ ...formData, ordem: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags (separadas por vírgula)</Label>
              <Input
                placeholder="ex: rigidez, controle, corpo"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.ativa}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, ativa: checked })
                }
              />
              <Label>Caso ativo (visível na biblioteca)</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {editingCaso ? "Salvar Alterações" : "Criar Caso"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
