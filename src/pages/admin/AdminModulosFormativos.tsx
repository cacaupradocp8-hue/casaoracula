import { useState, useEffect, useRef } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Star, Loader2, Film, Save, Upload, Music, Link } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

// ── Route Options Hook ────────────────────────────────

interface RouteOption {
  value: string;
  label: string;
  group: string;
}

function useAvailableRoutes() {
  const { data: routes = [], isLoading } = useQuery({
    queryKey: ["admin-available-routes"],
    queryFn: async () => {
      const [coursesRes, salasRes, toolsRes] = await Promise.all([
        supabase.from("courses").select("id, titulo, publicado").order("titulo"),
        supabase.from("salas").select("id, nome_exibicao, ativa").order("nome_exibicao"),
        supabase.from("sala_ferramentas").select("id, ferramenta_nome, rota, ativa, slug").order("ferramenta_nome"),
      ]);

      const options: RouteOption[] = [];

      salasRes.data?.forEach((s) => {
        options.push({
          value: `/sala/${s.id}`,
          label: `${s.nome_exibicao}${s.ativa ? "" : " (inativa)"}`,
          group: "Salas",
        });
      });

      coursesRes.data?.forEach((c) => {
        options.push({
          value: `/curso/${c.id}`,
          label: `${c.titulo}${c.publicado ? "" : " (rascunho)"}`,
          group: "Cursos",
        });
      });

      toolsRes.data?.forEach((t) => {
        const route = t.rota || (t.slug ? `/ferramenta/${t.slug}` : null);
        if (route) {
          options.push({
            value: route,
            label: `${t.ferramenta_nome}${t.ativa ? "" : " (inativa)"}`,
            group: "Ferramentas",
          });
        }
      });

      return options;
    },
    staleTime: 60_000,
  });

  return { routes, isLoading };
}

function RotaDestinoField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { routes, isLoading } = useAvailableRoutes();
  const [customMode, setCustomMode] = useState(!value || !routes.some((r) => r.value === value));

  // When routes load, check if current value matches any route
  useEffect(() => {
    if (routes.length > 0 && value) {
      setCustomMode(!routes.some((r) => r.value === value));
    }
  }, [routes, value]);

  const grouped = routes.reduce((acc, r) => {
    if (!acc[r.group]) acc[r.group] = [];
    acc[r.group].push(r);
    return acc;
  }, {} as Record<string, RouteOption[]>);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Rota de Destino</Label>
        <button
          type="button"
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          onClick={() => setCustomMode(!customMode)}
        >
          <Link className="w-3 h-3" />
          {customMode ? "Selecionar existente" : "Digitar manualmente"}
        </button>
      </div>

      {customMode ? (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/jornada ou /salas/..."
        />
      ) : (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione um conteúdo"} />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            {Object.entries(grouped).map(([group, items]) => (
              <div key={group}>
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{group}</div>
                {items.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </div>
            ))}
          </SelectContent>
        </Select>
      )}

      {value && (
        <p className="text-xs text-muted-foreground">Rota: <code className="bg-muted px-1 rounded">{value}</code></p>
      )}
    </div>
  );
}

// ── Types ──────────────────────────────────────────────

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

// ── Banner Settings Keys ──────────────────────────────

const BANNER_KEYS = [
  "vitrine_hero_video_url",
  "vitrine_hero_texto",
  "vitrine_hero_btn_texto",
  "vitrine_hero_btn_link",
  "vitrine_hero_overlay_opacity",
  "vitrine_hero_ativo",
  "vitrine_ambient_audio_url",
  "vitrine_ambient_audio_ativo",
  "vitrine_ambient_audio_volume",
];

// ── Banner Config Panel ───────────────────────────────

function BannerConfigPanel() {
  const queryClient = useQueryClient();
  const [bannerForm, setBannerForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-banner-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("app_settings")
        .select("key, value")
        .in("key", BANNER_KEYS);
      if (error) throw error;
      const map: Record<string, string> = {};
      data?.forEach((s) => (map[s.key] = s.value));
      return map;
    },
  });

  useEffect(() => {
    if (settings) setBannerForm(settings);
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const key of BANNER_KEYS) {
        const value = bannerForm[key];
        if (value === undefined) continue;
        const { error } = await supabase
          .from("app_settings")
          .update({ value })
          .eq("key", key);
        if (error) throw error;
      }
      queryClient.invalidateQueries({ queryKey: ["admin-banner-settings"] });
      queryClient.invalidateQueries({ queryKey: ["vitrine-hero-settings"] });
      toast.success("Banner atualizado");
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar banner");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-gold" />
      </div>
    );
  }

  const overlayValue = Number(bannerForm.vitrine_hero_overlay_opacity ?? "30");

  return (
    <Card className="border-border mb-8">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <Film className="w-5 h-5 text-gold" />
          <CardTitle className="text-lg">Configurações do Banner</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Active toggle */}
        <div className="flex items-center gap-3">
          <Switch
            checked={bannerForm.vitrine_hero_ativo !== "false"}
            onCheckedChange={(v) =>
              setBannerForm((prev) => ({ ...prev, vitrine_hero_ativo: v ? "true" : "false" }))
            }
          />
          <Label>Banner ativo</Label>
        </div>

        {/* Video / Image Upload + URL */}
        <div className="space-y-3">
          <Label>Vídeo ou Imagem do Banner</Label>
          
          {/* Upload button */}
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                
                const maxSize = 50 * 1024 * 1024; // 50MB
                if (file.size > maxSize) {
                  toast.error("Arquivo muito grande. Máximo: 50MB");
                  return;
                }

                setUploading(true);
                try {
                  const ext = file.name.split('.').pop() || 'mp4';
                  const filePath = `banner/hero-banner-${Date.now()}.${ext}`;
                  
                  const { error: uploadError } = await supabase.storage
                    .from('content-images')
                    .upload(filePath, file, { upsert: true });
                  
                  if (uploadError) throw uploadError;

                  const { data: urlData } = supabase.storage
                    .from('content-images')
                    .getPublicUrl(filePath);

                  setBannerForm((prev) => ({
                    ...prev,
                    vitrine_hero_video_url: urlData.publicUrl,
                  }));
                  toast.success("Arquivo enviado com sucesso");
                } catch (err: any) {
                  toast.error(err.message || "Erro ao enviar arquivo");
                } finally {
                  setUploading(false);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {uploading ? "Enviando..." : "Enviar vídeo ou imagem"}
            </Button>
            <span className="text-xs text-muted-foreground">MP4, JPG, PNG, WebP (máx. 50MB)</span>
          </div>

          {/* URL input */}
          <Input
            value={bannerForm.vitrine_hero_video_url ?? ""}
            onChange={(e) =>
              setBannerForm((prev) => ({ ...prev, vitrine_hero_video_url: e.target.value }))
            }
            placeholder="URL gerada pelo upload ou cole uma URL externa"
          />
          <p className="text-xs text-muted-foreground">
            Envie um arquivo acima ou cole uma URL externa. Deixe vazio para usar o vídeo padrão.
          </p>

          {/* Preview */}
          {bannerForm.vitrine_hero_video_url?.trim() && (
            <div className="rounded-lg overflow-hidden border border-border max-w-sm">
              {bannerForm.vitrine_hero_video_url.match(/\.(mp4|webm|mov)(\?|$)/i) ? (
                <video
                  src={bannerForm.vitrine_hero_video_url}
                  className="w-full h-32 object-cover"
                  muted
                  autoPlay
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={bannerForm.vitrine_hero_video_url}
                  alt="Preview do banner"
                  className="w-full h-32 object-cover"
                />
              )}
            </div>
          )}
        </div>

        {/* Hero text */}
        <div>
          <Label>Texto Principal</Label>
          <Input
            value={bannerForm.vitrine_hero_texto ?? ""}
            onChange={(e) =>
              setBannerForm((prev) => ({ ...prev, vitrine_hero_texto: e.target.value }))
            }
            placeholder="Aqui, a travessia começa com presença"
          />
        </div>

        {/* Button text + link */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Texto do Botão</Label>
            <Input
              value={bannerForm.vitrine_hero_btn_texto ?? ""}
              onChange={(e) =>
                setBannerForm((prev) => ({ ...prev, vitrine_hero_btn_texto: e.target.value }))
              }
              placeholder="Continuar minha travessia"
            />
          </div>
          <div>
            <Label>Link do Botão</Label>
            <Input
              value={bannerForm.vitrine_hero_btn_link ?? ""}
              onChange={(e) =>
                setBannerForm((prev) => ({ ...prev, vitrine_hero_btn_link: e.target.value }))
              }
              placeholder="/salas"
            />
          </div>
        </div>

        {/* Overlay opacity */}
        <div>
          <Label>Opacidade do Overlay ({overlayValue}%)</Label>
          <Slider
            value={[overlayValue]}
            min={0}
            max={80}
            step={5}
            onValueChange={([v]) =>
              setBannerForm((prev) => ({ ...prev, vitrine_hero_overlay_opacity: String(v) }))
            }
            className="mt-2"
          />
        </div>

        {/* ── Ambient Audio Section ── */}
        <div className="pt-4 border-t border-border space-y-4">
          <div className="flex items-center gap-3">
            <Music className="w-5 h-5 text-gold" />
            <h3 className="text-sm font-semibold">Áudio Ambiente</h3>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={bannerForm.vitrine_ambient_audio_ativo === "true"}
              onCheckedChange={(v) =>
                setBannerForm((prev) => ({ ...prev, vitrine_ambient_audio_ativo: v ? "true" : "false" }))
              }
            />
            <Label>Áudio ambiente ativo</Label>
          </div>

          {/* Audio Upload */}
          <div className="space-y-3">
            <Label>Arquivo de Áudio (música ambiente ou ruído branco)</Label>
            <div className="flex items-center gap-3">
              <input
                ref={audioInputRef}
                type="file"
                accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/webm"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 50 * 1024 * 1024) {
                    toast.error("Arquivo muito grande. Máximo: 50MB");
                    return;
                  }
                  setUploadingAudio(true);
                  try {
                    const ext = file.name.split('.').pop() || 'mp3';
                    const filePath = `ambient/ambient-audio-${Date.now()}.${ext}`;
                    const { error: uploadError } = await supabase.storage
                      .from('audios')
                      .upload(filePath, file, { upsert: true });
                    if (uploadError) throw uploadError;
                    const { data: urlData } = supabase.storage
                      .from('audios')
                      .getPublicUrl(filePath);
                    setBannerForm((prev) => ({
                      ...prev,
                      vitrine_ambient_audio_url: urlData.publicUrl,
                    }));
                    toast.success("Áudio enviado com sucesso");
                  } catch (err: any) {
                    toast.error(err.message || "Erro ao enviar áudio");
                  } finally {
                    setUploadingAudio(false);
                    if (audioInputRef.current) audioInputRef.current.value = '';
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                disabled={uploadingAudio}
                onClick={() => audioInputRef.current?.click()}
              >
                {uploadingAudio ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {uploadingAudio ? "Enviando..." : "Enviar áudio"}
              </Button>
              <span className="text-xs text-muted-foreground">MP3, WAV, OGG (máx. 50MB)</span>
            </div>

            <Input
              value={bannerForm.vitrine_ambient_audio_url ?? ""}
              onChange={(e) =>
                setBannerForm((prev) => ({ ...prev, vitrine_ambient_audio_url: e.target.value }))
              }
              placeholder="URL do áudio ambiente"
            />

            {/* Audio preview */}
            {bannerForm.vitrine_ambient_audio_url?.trim() && (
              <audio
                src={bannerForm.vitrine_ambient_audio_url}
                controls
                className="w-full max-w-sm h-10"
              />
            )}
          </div>

          {/* Volume */}
          <div>
            <Label>Volume Padrão ({bannerForm.vitrine_ambient_audio_volume ?? "30"}%)</Label>
            <Slider
              value={[Number(bannerForm.vitrine_ambient_audio_volume ?? "30")]}
              min={0}
              max={100}
              step={5}
              onValueChange={([v]) =>
                setBannerForm((prev) => ({ ...prev, vitrine_ambient_audio_volume: String(v) }))
              }
              className="mt-2"
            />
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar Configurações
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main Admin Component ──────────────────────────────

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Banner Configuration */}
      <BannerConfigPanel />

      {/* Modules Management */}
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

            <RotaDestinoField
              value={form.rota_destino || ""}
              onChange={(v) => setForm({ ...form, rota_destino: v })}
            />

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
}
