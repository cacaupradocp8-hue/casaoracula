import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { toast } from "sonner";
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
} from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2, GripVertical } from "lucide-react";

interface VitrineCard {
  id: string;
  titulo: string;
  subtitulo: string | null;
  descricao_curta: string | null;
  imagem: string | null;
  link_destino: string | null;
  ordem: number;
  ativo: boolean;
  estilo: string;
  visibilidade_role: string[];
}

const ROLE_OPTIONS = [
  { value: "visitante", label: "Visitante" },
  { value: "mentorada", label: "Mentorada" },
  { value: "aluna_formacao", label: "Aluna Formação" },
  { value: "assinante", label: "Assinante" },
  { value: "oracula", label: "Orácula" },
];

const EMPTY_CARD: Omit<VitrineCard, "id"> = {
  titulo: "",
  subtitulo: null,
  descricao_curta: null,
  imagem: null,
  link_destino: null,
  ordem: 0,
  ativo: true,
  estilo: "card_secundario",
  visibilidade_role: ["visitante"],
};

export default function AdminVitrineCards() {
  const queryClient = useQueryClient();
  const [editingCard, setEditingCard] = useState<VitrineCard | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<Omit<VitrineCard, "id">>(EMPTY_CARD);

  const { data: cards, isLoading } = useQuery({
    queryKey: ["admin-vitrine-cards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vitrine_cards")
        .select("*")
        .order("ordem", { ascending: true });
      if (error) throw error;
      return data as VitrineCard[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: { id?: string } & Omit<VitrineCard, "id">) => {
      if (data.id) {
        const { id, ...rest } = data as any;
        const { error } = await supabase.from("vitrine_cards").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("vitrine_cards").insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vitrine-cards"] });
      toast.success("Card salvo!");
      closeDialog();
    },
    onError: () => toast.error("Erro ao salvar card"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("vitrine_cards").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vitrine-cards"] });
      toast.success("Card removido!");
    },
    onError: () => toast.error("Erro ao remover card"),
  });

  const openCreate = () => {
    setForm({ ...EMPTY_CARD, ordem: (cards?.length || 0) + 1 });
    setIsCreating(true);
    setEditingCard(null);
  };

  const openEdit = (card: VitrineCard) => {
    setForm({
      titulo: card.titulo,
      subtitulo: card.subtitulo,
      descricao_curta: card.descricao_curta,
      imagem: card.imagem,
      link_destino: card.link_destino,
      ordem: card.ordem,
      ativo: card.ativo,
      estilo: card.estilo,
      visibilidade_role: card.visibilidade_role,
    });
    setEditingCard(card);
    setIsCreating(true);
  };

  const closeDialog = () => {
    setIsCreating(false);
    setEditingCard(null);
    setForm(EMPTY_CARD);
  };

  const handleSave = () => {
    if (!form.titulo.trim()) {
      toast.error("Título é obrigatório");
      return;
    }
    saveMutation.mutate(editingCard ? { id: editingCard.id, ...form } : form);
  };

  const toggleRole = (role: string) => {
    setForm((prev) => ({
      ...prev,
      visibilidade_role: prev.visibilidade_role.includes(role)
        ? prev.visibilidade_role.filter((r) => r !== role)
        : [...prev.visibilidade_role, role],
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-semibold text-foreground">Cards da Vitrine</h2>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Card
        </Button>
      </div>

      <div className="space-y-3">
        {(cards || []).map((card) => (
          <div
            key={card.id}
            className="flex items-center gap-4 p-4 rounded-lg border bg-card"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
            {card.imagem && (
              <img src={card.imagem} alt="" className="w-16 h-10 rounded object-cover shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{card.titulo}</p>
              <p className="text-xs text-muted-foreground">
                {card.estilo === "hero_unico" ? "🌟 Hero" : "📋 Card"} · Ordem: {card.ordem} ·{" "}
                {card.ativo ? "Ativo" : "Inativo"} · {card.visibilidade_role.join(", ")}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="ghost" size="icon" onClick={() => openEdit(card)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (confirm("Remover este card?")) deleteMutation.mutate(card.id);
                }}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {(!cards || cards.length === 0) && (
          <p className="text-center text-muted-foreground py-8">Nenhum card criado.</p>
        )}
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={isCreating} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCard ? "Editar Card" : "Novo Card"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Título *</Label>
              <Input
                value={form.titulo}
                onChange={(e) => setForm((p) => ({ ...p, titulo: e.target.value }))}
              />
            </div>
            <div>
              <Label>Subtítulo</Label>
              <Input
                value={form.subtitulo || ""}
                onChange={(e) => setForm((p) => ({ ...p, subtitulo: e.target.value || null }))}
              />
            </div>
            <div>
              <Label>Descrição curta</Label>
              <Textarea
                value={form.descricao_curta || ""}
                onChange={(e) => setForm((p) => ({ ...p, descricao_curta: e.target.value || null }))}
                rows={2}
              />
            </div>
            <ImageUpload
              value={form.imagem || ""}
              onChange={(url) => setForm((p) => ({ ...p, imagem: url || null }))}
              folder="vitrine"
              label="Imagem"
            />
            <div>
              <Label>Link destino (rota)</Label>
              <Input
                value={form.link_destino || ""}
                onChange={(e) => setForm((p) => ({ ...p, link_destino: e.target.value || null }))}
                placeholder="/salas"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ordem</Label>
                <Input
                  type="number"
                  value={form.ordem}
                  onChange={(e) => setForm((p) => ({ ...p, ordem: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label>Estilo</Label>
                <Select
                  value={form.estilo}
                  onValueChange={(v) => setForm((p) => ({ ...p, estilo: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hero_unico">🌟 Hero Único</SelectItem>
                    <SelectItem value="card_secundario">📋 Card Secundário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.ativo}
                onCheckedChange={(v) => setForm((p) => ({ ...p, ativo: v }))}
              />
              <Label>Ativo</Label>
            </div>
            <div>
              <Label>Visibilidade por Role</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {ROLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleRole(opt.value)}
                    className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                      form.visibilidade_role.includes(opt.value)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="w-full"
            >
              {saveMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
