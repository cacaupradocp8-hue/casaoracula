import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Compass, Moon, Sparkles, Feather, Flame,
  Plus, Pencil, Trash2, Loader2, GripVertical, Save, FileText
} from "lucide-react";
import { toast } from "sonner";

// ============================================
// TYPES
// ============================================

interface LabirintoFase {
  id: string;
  ordem: number;
  nome: string;
  subtitulo: string | null;
  descricao: string | null;
  icone: string | null;
  cor_acento: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

interface LabirintoArquetipo {
  id: string;
  ordem: number;
  nome: string;
  territorio: string | null;
  descricao_luz: string | null;
  descricao_sombra: string | null;
  icone: string | null;
  imagem_url: string | null;
  cor_acento: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

interface LabirintoMetafora {
  id: string;
  ordem: number;
  nome: string;
  texto_evocativo: string | null;
  pergunta_reflexao: string | null;
  icone: string | null;
  imagem_url: string | null;
  cor_acento: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

interface LabirintoRitual {
  id: string;
  ordem: number;
  nome: string;
  descricao: string | null;
  instrucoes: string | null;
  duracao: string | null;
  icone: string | null;
  cor_acento: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

interface RoteiroTemplate {
  id: string;
  camada_id: string | null;
  tipo_camada: string;
  secao: string;
  texto_base: string;
  ordem: number;
  ativo: boolean;
}

// ============================================
// MAIN COMPONENT
// ============================================

export function AdminLabirintoHeroinaTab() {
  const [activeTab, setActiveTab] = useState("fases");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Compass className="w-5 h-5 text-gold" />
            Labirinto da Heroína Interna®
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie as 4 camadas sistêmicas da Ferramenta-Mãe
          </p>
        </div>
      </div>

      {/* Tabs for each layer */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start flex-wrap h-auto gap-1 bg-muted/50">
          <TabsTrigger value="fases" className="gap-2">
            <Moon className="w-4 h-4" />
            Fases
          </TabsTrigger>
          <TabsTrigger value="arquetipos" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Arquétipos
          </TabsTrigger>
          <TabsTrigger value="metaforas" className="gap-2">
            <Feather className="w-4 h-4" />
            Metáforas
          </TabsTrigger>
          <TabsTrigger value="rituais" className="gap-2">
            <Flame className="w-4 h-4" />
            Rituais
          </TabsTrigger>
          <TabsTrigger value="templates" className="gap-2">
            <FileText className="w-4 h-4" />
            Templates Roteiro
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fases">
          <FasesSection />
        </TabsContent>
        <TabsContent value="arquetipos">
          <ArquetiposSection />
        </TabsContent>
        <TabsContent value="metaforas">
          <MetaforasSection />
        </TabsContent>
        <TabsContent value="rituais">
          <RituaisSection />
        </TabsContent>
        <TabsContent value="templates">
          <TemplatesSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================
// FASES SECTION
// ============================================

function FasesSection() {
  const [fases, setFases] = useState<LabirintoFase[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<LabirintoFase | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    subtitulo: "",
    descricao: "",
    icone: "",
    cor_acento: "",
    ativo: true,
    ordem: 0,
  });

  useEffect(() => {
    fetchFases();
  }, []);

  const fetchFases = async () => {
    const { data, error } = await supabase
      .from("labirinto_fases")
      .select("*")
      .order("ordem");

    if (error) {
      toast.error("Erro ao carregar fases");
    } else {
      setFases(data || []);
    }
    setLoading(false);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({
      nome: "",
      subtitulo: "",
      descricao: "",
      icone: "",
      cor_acento: "",
      ativo: true,
      ordem: fases.length,
    });
    setDialogOpen(true);
  };

  const openEdit = (fase: LabirintoFase) => {
    setEditing(fase);
    setForm({
      nome: fase.nome,
      subtitulo: fase.subtitulo || "",
      descricao: fase.descricao || "",
      icone: fase.icone || "",
      cor_acento: fase.cor_acento || "",
      ativo: fase.ativo,
      ordem: fase.ordem,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.nome.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    setSaving(true);

    const payload = {
      nome: form.nome,
      subtitulo: form.subtitulo || null,
      descricao: form.descricao || null,
      icone: form.icone || null,
      cor_acento: form.cor_acento || null,
      ativo: form.ativo,
      ordem: form.ordem,
    };

    if (editing) {
      const { error } = await supabase
        .from("labirinto_fases")
        .update(payload)
        .eq("id", editing.id);

      if (error) {
        toast.error("Erro ao atualizar fase");
      } else {
        toast.success("Fase atualizada");
        fetchFases();
        setDialogOpen(false);
      }
    } else {
      const { error } = await supabase
        .from("labirinto_fases")
        .insert(payload);

      if (error) {
        toast.error("Erro ao criar fase");
      } else {
        toast.success("Fase criada");
        fetchFases();
        setDialogOpen(false);
      }
    }

    setSaving(false);
  };

  const toggleAtivo = async (fase: LabirintoFase) => {
    const { error } = await supabase
      .from("labirinto_fases")
      .update({ ativo: !fase.ativo })
      .eq("id", fase.id);

    if (error) {
      toast.error("Erro ao alterar status");
    } else {
      fetchFases();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir esta fase?")) return;
    
    const { error } = await supabase
      .from("labirinto_fases")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erro ao excluir");
    } else {
      toast.success("Fase excluída");
      fetchFases();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-gold" />
            Fases da Travessia
          </CardTitle>
          <CardDescription>Estágios do processo de individuação</CardDescription>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Fase
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Ordem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Subtítulo</TableHead>
              <TableHead className="w-20">Ativo</TableHead>
              <TableHead className="w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fases.map((fase) => (
              <TableRow key={fase.id}>
                <TableCell>{fase.ordem}</TableCell>
                <TableCell className="font-medium">{fase.nome}</TableCell>
                <TableCell className="text-muted-foreground">{fase.subtitulo || "-"}</TableCell>
                <TableCell>
                  <Switch
                    checked={fase.ativo}
                    onCheckedChange={() => toggleAtivo(fase)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openEdit(fase)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(fase.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {fases.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Nenhuma fase cadastrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Fase" : "Nova Fase"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Nome *</Label>
              <Input
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Ex: A Chamada"
              />
            </div>

            <div>
              <Label>Subtítulo</Label>
              <Input
                value={form.subtitulo}
                onChange={(e) => setForm({ ...form, subtitulo: e.target.value })}
                placeholder="Ex: O despertar do chamado interior"
              />
            </div>

            <div>
              <Label>Descrição</Label>
              <Textarea
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                placeholder="Descrição completa da fase..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ícone (Lucide)</Label>
                <Input
                  value={form.icone}
                  onChange={(e) => setForm({ ...form, icone: e.target.value })}
                  placeholder="Ex: Moon"
                />
              </div>
              <div>
                <Label>Cor Acento</Label>
                <Input
                  value={form.cor_acento}
                  onChange={(e) => setForm({ ...form, cor_acento: e.target.value })}
                  placeholder="Ex: #D4AF37"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ordem</Label>
                <Input
                  type="number"
                  value={form.ordem}
                  onChange={(e) => setForm({ ...form, ordem: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  checked={form.ativo}
                  onCheckedChange={(checked) => setForm({ ...form, ativo: checked })}
                />
                <Label>Ativo</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// ============================================
// ARQUETIPOS SECTION
// ============================================

function ArquetiposSection() {
  const [arquetipos, setArquetipos] = useState<LabirintoArquetipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<LabirintoArquetipo | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    territorio: "",
    descricao_luz: "",
    descricao_sombra: "",
    icone: "",
    imagem_url: "",
    cor_acento: "",
    ativo: true,
    ordem: 0,
  });

  useEffect(() => {
    fetchArquetipos();
  }, []);

  const fetchArquetipos = async () => {
    const { data, error } = await supabase
      .from("labirinto_arquetipos")
      .select("*")
      .order("ordem");

    if (error) {
      toast.error("Erro ao carregar arquétipos");
    } else {
      setArquetipos(data || []);
    }
    setLoading(false);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({
      nome: "",
      territorio: "",
      descricao_luz: "",
      descricao_sombra: "",
      icone: "",
      imagem_url: "",
      cor_acento: "",
      ativo: true,
      ordem: arquetipos.length,
    });
    setDialogOpen(true);
  };

  const openEdit = (arq: LabirintoArquetipo) => {
    setEditing(arq);
    setForm({
      nome: arq.nome,
      territorio: arq.territorio || "",
      descricao_luz: arq.descricao_luz || "",
      descricao_sombra: arq.descricao_sombra || "",
      icone: arq.icone || "",
      imagem_url: arq.imagem_url || "",
      cor_acento: arq.cor_acento || "",
      ativo: arq.ativo,
      ordem: arq.ordem,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.nome.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    setSaving(true);

    const payload = {
      nome: form.nome,
      territorio: form.territorio || null,
      descricao_luz: form.descricao_luz || null,
      descricao_sombra: form.descricao_sombra || null,
      icone: form.icone || null,
      imagem_url: form.imagem_url || null,
      cor_acento: form.cor_acento || null,
      ativo: form.ativo,
      ordem: form.ordem,
    };

    if (editing) {
      const { error } = await supabase
        .from("labirinto_arquetipos")
        .update(payload)
        .eq("id", editing.id);

      if (error) {
        toast.error("Erro ao atualizar arquétipo");
      } else {
        toast.success("Arquétipo atualizado");
        fetchArquetipos();
        setDialogOpen(false);
      }
    } else {
      const { error } = await supabase
        .from("labirinto_arquetipos")
        .insert(payload);

      if (error) {
        toast.error("Erro ao criar arquétipo");
      } else {
        toast.success("Arquétipo criado");
        fetchArquetipos();
        setDialogOpen(false);
      }
    }

    setSaving(false);
  };

  const toggleAtivo = async (arq: LabirintoArquetipo) => {
    const { error } = await supabase
      .from("labirinto_arquetipos")
      .update({ ativo: !arq.ativo })
      .eq("id", arq.id);

    if (error) {
      toast.error("Erro ao alterar status");
    } else {
      fetchArquetipos();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este arquétipo?")) return;
    
    const { error } = await supabase
      .from("labirinto_arquetipos")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erro ao excluir");
    } else {
      toast.success("Arquétipo excluído");
      fetchArquetipos();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold" />
            Arquétipos Regentes
          </CardTitle>
          <CardDescription>Forças simbólicas que regem cada território</CardDescription>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Arquétipo
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Ordem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Território</TableHead>
              <TableHead className="w-20">Ativo</TableHead>
              <TableHead className="w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {arquetipos.map((arq) => (
              <TableRow key={arq.id}>
                <TableCell>{arq.ordem}</TableCell>
                <TableCell className="font-medium">{arq.nome}</TableCell>
                <TableCell className="text-muted-foreground">{arq.territorio || "-"}</TableCell>
                <TableCell>
                  <Switch
                    checked={arq.ativo}
                    onCheckedChange={() => toggleAtivo(arq)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openEdit(arq)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(arq.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {arquetipos.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Nenhum arquétipo cadastrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Arquétipo" : "Novo Arquétipo"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nome *</Label>
                <Input
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  placeholder="Ex: A Anciã Sábia"
                />
              </div>
              <div>
                <Label>Território</Label>
                <Input
                  value={form.territorio}
                  onChange={(e) => setForm({ ...form, territorio: e.target.value })}
                  placeholder="Ex: Sabedoria"
                />
              </div>
            </div>

            <div>
              <Label>Descrição (Luz)</Label>
              <Textarea
                value={form.descricao_luz}
                onChange={(e) => setForm({ ...form, descricao_luz: e.target.value })}
                placeholder="Manifestação em sua expressão luminosa..."
                rows={3}
              />
            </div>

            <div>
              <Label>Descrição (Sombra)</Label>
              <Textarea
                value={form.descricao_sombra}
                onChange={(e) => setForm({ ...form, descricao_sombra: e.target.value })}
                placeholder="Manifestação em sua expressão sombria..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ícone (Emoji)</Label>
                <Input
                  value={form.icone}
                  onChange={(e) => setForm({ ...form, icone: e.target.value })}
                  placeholder="Ex: 🐺"
                />
              </div>
              <div>
                <Label>Cor Acento</Label>
                <Input
                  value={form.cor_acento}
                  onChange={(e) => setForm({ ...form, cor_acento: e.target.value })}
                  placeholder="Ex: #D4AF37"
                />
              </div>
            </div>

            <div>
              <Label>URL da Imagem</Label>
              <Input
                value={form.imagem_url}
                onChange={(e) => setForm({ ...form, imagem_url: e.target.value })}
                placeholder="https://... (deixe vazio para usar imagem padrão)"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Se vazio, a imagem gerada automaticamente será usada
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ordem</Label>
                <Input
                  type="number"
                  value={form.ordem}
                  onChange={(e) => setForm({ ...form, ordem: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  checked={form.ativo}
                  onCheckedChange={(checked) => setForm({ ...form, ativo: checked })}
                />
                <Label>Ativo</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// ============================================
// METAFORAS SECTION
// ============================================

function MetaforasSection() {
  const [metaforas, setMetaforas] = useState<LabirintoMetafora[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<LabirintoMetafora | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    texto_evocativo: "",
    pergunta_reflexao: "",
    icone: "",
    imagem_url: "",
    cor_acento: "",
    ativo: true,
    ordem: 0,
  });

  useEffect(() => {
    fetchMetaforas();
  }, []);

  const fetchMetaforas = async () => {
    const { data, error } = await supabase
      .from("labirinto_metaforas")
      .select("*")
      .order("ordem");

    if (error) {
      toast.error("Erro ao carregar metáforas");
    } else {
      setMetaforas(data || []);
    }
    setLoading(false);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({
      nome: "",
      texto_evocativo: "",
      pergunta_reflexao: "",
      icone: "",
      imagem_url: "",
      cor_acento: "",
      ativo: true,
      ordem: metaforas.length,
    });
    setDialogOpen(true);
  };

  const openEdit = (met: LabirintoMetafora) => {
    setEditing(met);
    setForm({
      nome: met.nome,
      texto_evocativo: met.texto_evocativo || "",
      pergunta_reflexao: met.pergunta_reflexao || "",
      icone: met.icone || "",
      imagem_url: met.imagem_url || "",
      cor_acento: met.cor_acento || "",
      ativo: met.ativo,
      ordem: met.ordem,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.nome.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    setSaving(true);

    const payload = {
      nome: form.nome,
      texto_evocativo: form.texto_evocativo || null,
      pergunta_reflexao: form.pergunta_reflexao || null,
      icone: form.icone || null,
      imagem_url: form.imagem_url || null,
      cor_acento: form.cor_acento || null,
      ativo: form.ativo,
      ordem: form.ordem,
    };

    if (editing) {
      const { error } = await supabase
        .from("labirinto_metaforas")
        .update(payload)
        .eq("id", editing.id);

      if (error) {
        toast.error("Erro ao atualizar metáfora");
      } else {
        toast.success("Metáfora atualizada");
        fetchMetaforas();
        setDialogOpen(false);
      }
    } else {
      const { error } = await supabase
        .from("labirinto_metaforas")
        .insert(payload);

      if (error) {
        toast.error("Erro ao criar metáfora");
      } else {
        toast.success("Metáfora criada");
        fetchMetaforas();
        setDialogOpen(false);
      }
    }

    setSaving(false);
  };

  const toggleAtivo = async (met: LabirintoMetafora) => {
    const { error } = await supabase
      .from("labirinto_metaforas")
      .update({ ativo: !met.ativo })
      .eq("id", met.id);

    if (error) {
      toast.error("Erro ao alterar status");
    } else {
      fetchMetaforas();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir esta metáfora?")) return;
    
    const { error } = await supabase
      .from("labirinto_metaforas")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erro ao excluir");
    } else {
      toast.success("Metáfora excluída");
      fetchMetaforas();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Feather className="w-5 h-5 text-gold" />
            Metáforas Espelho
          </CardTitle>
          <CardDescription>Imagens simbólicas para reflexão</CardDescription>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Metáfora
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Ordem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Pergunta Reflexão</TableHead>
              <TableHead className="w-20">Ativo</TableHead>
              <TableHead className="w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metaforas.map((met) => (
              <TableRow key={met.id}>
                <TableCell>{met.ordem}</TableCell>
                <TableCell className="font-medium">{met.nome}</TableCell>
                <TableCell className="text-muted-foreground max-w-xs truncate">
                  {met.pergunta_reflexao || "-"}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={met.ativo}
                    onCheckedChange={() => toggleAtivo(met)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openEdit(met)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(met.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {metaforas.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Nenhuma metáfora cadastrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Metáfora" : "Nova Metáfora"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Nome *</Label>
              <Input
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Ex: O Espelho Partido"
              />
            </div>

            <div>
              <Label>Texto Evocativo</Label>
              <Textarea
                value={form.texto_evocativo}
                onChange={(e) => setForm({ ...form, texto_evocativo: e.target.value })}
                placeholder="Texto poético/simbólico..."
                rows={4}
              />
            </div>

            <div>
              <Label>Pergunta de Reflexão</Label>
              <Textarea
                value={form.pergunta_reflexao}
                onChange={(e) => setForm({ ...form, pergunta_reflexao: e.target.value })}
                placeholder="Pergunta para guiar a reflexão..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ícone (Lucide)</Label>
                <Input
                  value={form.icone}
                  onChange={(e) => setForm({ ...form, icone: e.target.value })}
                  placeholder="Ex: Feather"
                />
              </div>
              <div>
                <Label>Cor Acento</Label>
                <Input
                  value={form.cor_acento}
                  onChange={(e) => setForm({ ...form, cor_acento: e.target.value })}
                  placeholder="Ex: #D4AF37"
                />
              </div>
            </div>

            <div>
              <Label>URL da Imagem</Label>
              <Input
                value={form.imagem_url}
                onChange={(e) => setForm({ ...form, imagem_url: e.target.value })}
                placeholder="https://... (deixe vazio para usar imagem padrão)"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Se vazio, a imagem gerada automaticamente será usada
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ordem</Label>
                <Input
                  type="number"
                  value={form.ordem}
                  onChange={(e) => setForm({ ...form, ordem: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  checked={form.ativo}
                  onCheckedChange={(checked) => setForm({ ...form, ativo: checked })}
                />
                <Label>Ativo</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// ============================================
// RITUAIS SECTION
// ============================================

function RituaisSection() {
  const [rituais, setRituais] = useState<LabirintoRitual[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<LabirintoRitual | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    instrucoes: "",
    duracao: "",
    icone: "",
    cor_acento: "",
    ativo: true,
    ordem: 0,
  });

  useEffect(() => {
    fetchRituais();
  }, []);

  const fetchRituais = async () => {
    const { data, error } = await supabase
      .from("labirinto_rituais")
      .select("*")
      .order("ordem");

    if (error) {
      toast.error("Erro ao carregar rituais");
    } else {
      setRituais(data || []);
    }
    setLoading(false);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({
      nome: "",
      descricao: "",
      instrucoes: "",
      duracao: "",
      icone: "",
      cor_acento: "",
      ativo: true,
      ordem: rituais.length,
    });
    setDialogOpen(true);
  };

  const openEdit = (rit: LabirintoRitual) => {
    setEditing(rit);
    setForm({
      nome: rit.nome,
      descricao: rit.descricao || "",
      instrucoes: rit.instrucoes || "",
      duracao: rit.duracao || "",
      icone: rit.icone || "",
      cor_acento: rit.cor_acento || "",
      ativo: rit.ativo,
      ordem: rit.ordem,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.nome.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    setSaving(true);

    const payload = {
      nome: form.nome,
      descricao: form.descricao || null,
      instrucoes: form.instrucoes || null,
      duracao: form.duracao || null,
      icone: form.icone || null,
      cor_acento: form.cor_acento || null,
      ativo: form.ativo,
      ordem: form.ordem,
    };

    if (editing) {
      const { error } = await supabase
        .from("labirinto_rituais")
        .update(payload)
        .eq("id", editing.id);

      if (error) {
        toast.error("Erro ao atualizar ritual");
      } else {
        toast.success("Ritual atualizado");
        fetchRituais();
        setDialogOpen(false);
      }
    } else {
      const { error } = await supabase
        .from("labirinto_rituais")
        .insert(payload);

      if (error) {
        toast.error("Erro ao criar ritual");
      } else {
        toast.success("Ritual criado");
        fetchRituais();
        setDialogOpen(false);
      }
    }

    setSaving(false);
  };

  const toggleAtivo = async (rit: LabirintoRitual) => {
    const { error } = await supabase
      .from("labirinto_rituais")
      .update({ ativo: !rit.ativo })
      .eq("id", rit.id);

    if (error) {
      toast.error("Erro ao alterar status");
    } else {
      fetchRituais();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este ritual?")) return;
    
    const { error } = await supabase
      .from("labirinto_rituais")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erro ao excluir");
    } else {
      toast.success("Ritual excluído");
      fetchRituais();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-gold" />
            Rituais de Integração
          </CardTitle>
          <CardDescription>Práticas simbólicas para fechamento</CardDescription>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Ritual
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Ordem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead className="w-20">Ativo</TableHead>
              <TableHead className="w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rituais.map((rit) => (
              <TableRow key={rit.id}>
                <TableCell>{rit.ordem}</TableCell>
                <TableCell className="font-medium">{rit.nome}</TableCell>
                <TableCell className="text-muted-foreground">{rit.duracao || "-"}</TableCell>
                <TableCell>
                  <Switch
                    checked={rit.ativo}
                    onCheckedChange={() => toggleAtivo(rit)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openEdit(rit)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(rit.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {rituais.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Nenhum ritual cadastrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Ritual" : "Novo Ritual"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nome *</Label>
                <Input
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  placeholder="Ex: Ritual do Fogo"
                />
              </div>
              <div>
                <Label>Duração</Label>
                <Input
                  value={form.duracao}
                  onChange={(e) => setForm({ ...form, duracao: e.target.value })}
                  placeholder="Ex: 15-20 minutos"
                />
              </div>
            </div>

            <div>
              <Label>Descrição</Label>
              <Textarea
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                placeholder="Descrição do ritual..."
                rows={3}
              />
            </div>

            <div>
              <Label>Instruções</Label>
              <Textarea
                value={form.instrucoes}
                onChange={(e) => setForm({ ...form, instrucoes: e.target.value })}
                placeholder="Passo a passo do ritual..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ícone (Lucide)</Label>
                <Input
                  value={form.icone}
                  onChange={(e) => setForm({ ...form, icone: e.target.value })}
                  placeholder="Ex: Flame"
                />
              </div>
              <div>
                <Label>Cor Acento</Label>
                <Input
                  value={form.cor_acento}
                  onChange={(e) => setForm({ ...form, cor_acento: e.target.value })}
                  placeholder="Ex: #D4AF37"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ordem</Label>
                <Input
                  type="number"
                  value={form.ordem}
                  onChange={(e) => setForm({ ...form, ordem: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  checked={form.ativo}
                  onCheckedChange={(checked) => setForm({ ...form, ativo: checked })}
                />
                <Label>Ativo</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// ============================================
// TEMPLATES SECTION (for Script Generator)
// ============================================

function TemplatesSection() {
  const [templates, setTemplates] = useState<RoteiroTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<RoteiroTemplate | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    tipo_camada: "fase",
    secao: "abertura",
    texto_base: "",
    ordem: 0,
    ativo: true,
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const { data, error } = await supabase
      .from("labirinto_roteiro_templates")
      .select("*")
      .order("tipo_camada")
      .order("secao")
      .order("ordem");

    if (error) {
      toast.error("Erro ao carregar templates");
    } else {
      setTemplates(data || []);
    }
    setLoading(false);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({
      tipo_camada: "fase",
      secao: "abertura",
      texto_base: "",
      ordem: 0,
      ativo: true,
    });
    setDialogOpen(true);
  };

  const openEdit = (template: RoteiroTemplate) => {
    setEditing(template);
    setForm({
      tipo_camada: template.tipo_camada,
      secao: template.secao,
      texto_base: template.texto_base,
      ordem: template.ordem,
      ativo: template.ativo,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.texto_base.trim()) {
      toast.error("Texto base é obrigatório");
      return;
    }

    setSaving(true);

    const payload = {
      camada_id: "", // Generic template without specific camada
      tipo_camada: form.tipo_camada,
      secao: form.secao,
      texto_base: form.texto_base,
      ordem: form.ordem,
      ativo: form.ativo,
    };

    if (editing) {
      const { error } = await supabase
        .from("labirinto_roteiro_templates")
        .update(payload)
        .eq("id", editing.id);

      if (error) {
        toast.error("Erro ao atualizar template");
      } else {
        toast.success("Template atualizado");
        fetchTemplates();
        setDialogOpen(false);
      }
    } else {
      const { error } = await supabase
        .from("labirinto_roteiro_templates")
        .insert([payload]);

      if (error) {
        toast.error("Erro ao criar template");
      } else {
        toast.success("Template criado");
        fetchTemplates();
        setDialogOpen(false);
      }
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este template?")) return;
    
    const { error } = await supabase
      .from("labirinto_roteiro_templates")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erro ao excluir");
    } else {
      toast.success("Template excluído");
      fetchTemplates();
    }
  };

  const TIPOS_CAMADA = [
    { value: "fase", label: "Fase" },
    { value: "arquetipo", label: "Arquétipo" },
    { value: "metafora", label: "Metáfora" },
    { value: "ritual", label: "Ritual" },
  ];

  const SECOES = [
    { value: "abertura", label: "Abertura" },
    { value: "exploracao", label: "Exploração" },
    { value: "intervencao", label: "Intervenção" },
    { value: "fechamento", label: "Fechamento" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gold" />
            Templates de Roteiro
          </CardTitle>
          <CardDescription>Textos base para o gerador de roteiro de sessão</CardDescription>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Template
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Camada</TableHead>
              <TableHead>Seção</TableHead>
              <TableHead>Texto (preview)</TableHead>
              <TableHead className="w-20">Ativo</TableHead>
              <TableHead className="w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.map((template) => (
              <TableRow key={template.id}>
                <TableCell>
                  <Badge variant="outline">{template.tipo_camada}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{template.secao}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground max-w-xs truncate">
                  {template.texto_base.substring(0, 60)}...
                </TableCell>
                <TableCell>
                  <Badge variant={template.ativo ? "default" : "outline"}>
                    {template.ativo ? "Sim" : "Não"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openEdit(template)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(template.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {templates.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Nenhum template cadastrado. Adicione templates para habilitar o gerador de roteiro.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Template" : "Novo Template"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Tipo de Camada *</Label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.tipo_camada}
                  onChange={(e) => setForm({ ...form, tipo_camada: e.target.value })}
                >
                  {TIPOS_CAMADA.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Seção *</Label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.secao}
                  onChange={(e) => setForm({ ...form, secao: e.target.value })}
                >
                  {SECOES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  checked={form.ativo}
                  onCheckedChange={(checked) => setForm({ ...form, ativo: checked })}
                />
                <Label>Ativo</Label>
              </div>
            </div>

            <div>
              <Label>Texto Base *</Label>
              <Textarea
                value={form.texto_base}
                onChange={(e) => setForm({ ...form, texto_base: e.target.value })}
                placeholder="Escreva o texto template para esta seção. Use {nome} para substituir pelo nome da camada selecionada."
                rows={8}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Variáveis disponíveis: {"{nome}"}, {"{descricao}"}, {"{territorio}"}, {"{instrucoes}"}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
