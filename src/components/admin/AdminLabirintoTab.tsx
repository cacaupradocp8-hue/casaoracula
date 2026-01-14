import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DoorOpen, 
  Edit, 
  Save, 
  Loader2, 
  ArrowUpDown,
  Eye,
  BookOpen,
  Key,
  Image as ImageIcon
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PortalType } from "@/types/portal";

interface LabirintoPorta {
  id: string;
  numero: number;
  nome: string;
  subtitulo: string | null;
  imagem_url: string | null;
  ai_generated_image_url: string | null;
  symbolic_focus: string | null;
  cena_narrativa: string | null;
  eixo_psiquico: string | null;
  risco_clinico: string | null;
  pergunta_chave: string | null;
  caso_espelho_titulo: string | null;
  caso_espelho_frase_chegada: string | null;
  caso_espelho_erro_comum: string | null;
  caso_espelho_como_sustentar: string | null;
  chave_frase_ancora: string | null;
  chave_o_que_nao_fazer: string | null;
  chave_quando_parar: string | null;
  chave_sinal_maturidade: string | null;
  ativa: boolean;
  ordem: number;
  portal_minimo: PortalType;
  portal_caso_espelho: PortalType;
  portal_chave_facilitadora: PortalType;
}

export function AdminLabirintoTab() {
  const [portas, setPortas] = useState<LabirintoPorta[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPorta, setEditingPorta] = useState<LabirintoPorta | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPortas();
  }, []);

  const fetchPortas = async () => {
    const { data, error } = await supabase
      .from("labirinto_portas")
      .select("*")
      .order("ordem");

    if (error) {
      toast({ title: "Erro ao carregar portas", variant: "destructive" });
    } else {
      setPortas(data || []);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!editingPorta) return;
    setSaving(true);

    const { error } = await supabase
      .from("labirinto_portas")
      .update({
        nome: editingPorta.nome,
        subtitulo: editingPorta.subtitulo,
        imagem_url: editingPorta.imagem_url,
        symbolic_focus: editingPorta.symbolic_focus,
        cena_narrativa: editingPorta.cena_narrativa,
        eixo_psiquico: editingPorta.eixo_psiquico,
        risco_clinico: editingPorta.risco_clinico,
        pergunta_chave: editingPorta.pergunta_chave,
        caso_espelho_titulo: editingPorta.caso_espelho_titulo,
        caso_espelho_frase_chegada: editingPorta.caso_espelho_frase_chegada,
        caso_espelho_erro_comum: editingPorta.caso_espelho_erro_comum,
        caso_espelho_como_sustentar: editingPorta.caso_espelho_como_sustentar,
        chave_frase_ancora: editingPorta.chave_frase_ancora,
        chave_o_que_nao_fazer: editingPorta.chave_o_que_nao_fazer,
        chave_quando_parar: editingPorta.chave_quando_parar,
        chave_sinal_maturidade: editingPorta.chave_sinal_maturidade,
        ativa: editingPorta.ativa,
        ordem: editingPorta.ordem,
        portal_minimo: editingPorta.portal_minimo,
        portal_caso_espelho: editingPorta.portal_caso_espelho,
        portal_chave_facilitadora: editingPorta.portal_chave_facilitadora,
      })
      .eq("id", editingPorta.id);

    setSaving(false);

    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Porta atualizada com sucesso" });
      fetchPortas();
      setDialogOpen(false);
    }
  };

  const toggleAtiva = async (porta: LabirintoPorta) => {
    const { error } = await supabase
      .from("labirinto_portas")
      .update({ ativa: !porta.ativa })
      .eq("id", porta.id);

    if (error) {
      toast({ title: "Erro ao alterar status", variant: "destructive" });
    } else {
      fetchPortas();
    }
  };

  const handleImageGenerated = (imageUrl: string) => {
    if (editingPorta) {
      setEditingPorta({
        ...editingPorta,
        ai_generated_image_url: imageUrl,
      });
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <DoorOpen className="w-5 h-5 text-gold" />
            Labirinto das 39 Portas
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure cada porta do sistema simbólico
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {portas.filter((p) => p.ativa).length} de {portas.length} portas ativas
        </div>
      </div>

      {/* Dialog for editing */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="font-display text-2xl text-gold">
                {editingPorta?.numero}
              </span>
              <span>{editingPorta?.nome}</span>
            </DialogTitle>
          </DialogHeader>

          {editingPorta && (
            <Tabs defaultValue="basico" className="space-y-4">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="basico" className="gap-2">
                  <Eye className="w-4 h-4" />
                  Básico
                </TabsTrigger>
                <TabsTrigger value="leitura" className="gap-2">
                  <DoorOpen className="w-4 h-4" />
                  Leitura
                </TabsTrigger>
                <TabsTrigger value="caso" className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  Caso Espelho
                </TabsTrigger>
                <TabsTrigger value="chave" className="gap-2">
                  <Key className="w-4 h-4" />
                  Chave Facilitadora
                </TabsTrigger>
                <TabsTrigger value="imagem" className="gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Imagem
                </TabsTrigger>
              </TabsList>

              {/* Básico */}
              <TabsContent value="basico" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nome da Porta</Label>
                    <Input
                      value={editingPorta.nome}
                      onChange={(e) =>
                        setEditingPorta({ ...editingPorta, nome: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Subtítulo</Label>
                    <Input
                      value={editingPorta.subtitulo || ""}
                      onChange={(e) =>
                        setEditingPorta({ ...editingPorta, subtitulo: e.target.value })
                      }
                      placeholder="Subtítulo opcional"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Ordem</Label>
                    <Input
                      type="number"
                      value={editingPorta.ordem}
                      onChange={(e) =>
                        setEditingPorta({
                          ...editingPorta,
                          ordem: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Portal Mínimo (Leitura)</Label>
                    <Select
                      value={editingPorta.portal_minimo}
                      onValueChange={(v) =>
                        setEditingPorta({ ...editingPorta, portal_minimo: v as PortalType })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visitante">Visitante</SelectItem>
                        <SelectItem value="pre_iniciada">Pré-Iniciada</SelectItem>
                        <SelectItem value="iniciada">Iniciada</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch
                      checked={editingPorta.ativa}
                      onCheckedChange={(checked) =>
                        setEditingPorta({ ...editingPorta, ativa: checked })
                      }
                    />
                    <Label>Ativa</Label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Portal Mínimo (Caso Espelho)</Label>
                    <Select
                      value={editingPorta.portal_caso_espelho}
                      onValueChange={(v) =>
                        setEditingPorta({ ...editingPorta, portal_caso_espelho: v as PortalType })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pre_iniciada">Pré-Iniciada</SelectItem>
                        <SelectItem value="iniciada">Iniciada</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Portal Mínimo (Chave Facilitadora)</Label>
                    <Select
                      value={editingPorta.portal_chave_facilitadora}
                      onValueChange={(v) =>
                        setEditingPorta({ ...editingPorta, portal_chave_facilitadora: v as PortalType })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pre_iniciada">Pré-Iniciada</SelectItem>
                        <SelectItem value="iniciada">Iniciada</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              {/* Leitura */}
              <TabsContent value="leitura" className="space-y-4">
                <div>
                  <Label>Cena Narrativa</Label>
                  <Textarea
                    value={editingPorta.cena_narrativa || ""}
                    onChange={(e) =>
                      setEditingPorta({ ...editingPorta, cena_narrativa: e.target.value })
                    }
                    placeholder="Uma breve cena simbólica que descreve esta porta..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Eixo Psíquico</Label>
                  <Textarea
                    value={editingPorta.eixo_psiquico || ""}
                    onChange={(e) =>
                      setEditingPorta({ ...editingPorta, eixo_psiquico: e.target.value })
                    }
                    placeholder="O eixo psíquico central desta porta..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Atenção Clínica (Risco Simbólico)</Label>
                  <Textarea
                    value={editingPorta.risco_clinico || ""}
                    onChange={(e) =>
                      setEditingPorta({ ...editingPorta, risco_clinico: e.target.value })
                    }
                    placeholder="Pontos de atenção para a facilitadora..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Pergunta-Chave</Label>
                  <Textarea
                    value={editingPorta.pergunta_chave || ""}
                    onChange={(e) =>
                      setEditingPorta({ ...editingPorta, pergunta_chave: e.target.value })
                    }
                    placeholder="A pergunta central desta porta..."
                    rows={2}
                  />
                </div>
              </TabsContent>

              {/* Caso Espelho */}
              <TabsContent value="caso" className="space-y-4">
                <div>
                  <Label>Título do Caso</Label>
                  <Input
                    value={editingPorta.caso_espelho_titulo || ""}
                    onChange={(e) =>
                      setEditingPorta({
                        ...editingPorta,
                        caso_espelho_titulo: e.target.value,
                      })
                    }
                    placeholder="Ex: A mulher que nunca era vista"
                  />
                </div>

                <div>
                  <Label>Frase de Chegada</Label>
                  <Textarea
                    value={editingPorta.caso_espelho_frase_chegada || ""}
                    onChange={(e) =>
                      setEditingPorta({
                        ...editingPorta,
                        caso_espelho_frase_chegada: e.target.value,
                      })
                    }
                    placeholder="O que a cliente tipicamente diz ao chegar..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Erro Comum da Facilitadora</Label>
                  <Textarea
                    value={editingPorta.caso_espelho_erro_comum || ""}
                    onChange={(e) =>
                      setEditingPorta({
                        ...editingPorta,
                        caso_espelho_erro_comum: e.target.value,
                      })
                    }
                    placeholder="Onde facilitadoras costumam errar neste caso..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Como Sustentar o Campo</Label>
                  <Textarea
                    value={editingPorta.caso_espelho_como_sustentar || ""}
                    onChange={(e) =>
                      setEditingPorta({
                        ...editingPorta,
                        caso_espelho_como_sustentar: e.target.value,
                      })
                    }
                    placeholder="Orientações sobre como sustentar (não o que fazer)..."
                    rows={3}
                  />
                </div>
              </TabsContent>

              {/* Chave Facilitadora */}
              <TabsContent value="chave" className="space-y-4">
                <div>
                  <Label>Frase Âncora</Label>
                  <Textarea
                    value={editingPorta.chave_frase_ancora || ""}
                    onChange={(e) =>
                      setEditingPorta({
                        ...editingPorta,
                        chave_frase_ancora: e.target.value,
                      })
                    }
                    placeholder="A frase que ancora a facilitadora nesta porta..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label>O que NÃO Fazer</Label>
                  <Textarea
                    value={editingPorta.chave_o_que_nao_fazer || ""}
                    onChange={(e) =>
                      setEditingPorta({
                        ...editingPorta,
                        chave_o_que_nao_fazer: e.target.value,
                      })
                    }
                    placeholder="Ações a evitar nesta porta..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Quando Parar o Processo</Label>
                  <Textarea
                    value={editingPorta.chave_quando_parar || ""}
                    onChange={(e) =>
                      setEditingPorta({
                        ...editingPorta,
                        chave_quando_parar: e.target.value,
                      })
                    }
                    placeholder="Sinais de que é hora de parar..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Sinal de Maturidade Clínica</Label>
                  <Textarea
                    value={editingPorta.chave_sinal_maturidade || ""}
                    onChange={(e) =>
                      setEditingPorta({
                        ...editingPorta,
                        chave_sinal_maturidade: e.target.value,
                      })
                    }
                    placeholder="Como reconhecer maturidade na facilitação..."
                    rows={2}
                  />
                </div>
              </TabsContent>

              {/* Imagem */}
              <TabsContent value="imagem" className="space-y-4">
                <div>
                  <Label>Foco Simbólico</Label>
                  <Input
                    value={editingPorta.symbolic_focus || ""}
                    onChange={(e) =>
                      setEditingPorta({
                        ...editingPorta,
                        symbolic_focus: e.target.value,
                      })
                    }
                    placeholder="Ex: abandono, raiva-sagrada, ancestralidade"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Este foco será usado para gerar a imagem com IA
                  </p>
                </div>

                {/* Current image preview */}
                {(editingPorta.ai_generated_image_url || editingPorta.imagem_url) && (
                  <div>
                    <Label>Imagem Atual</Label>
                    <div className="mt-2 w-full max-w-md aspect-video rounded-lg overflow-hidden bg-muted">
                      <img
                        src={editingPorta.ai_generated_image_url || editingPorta.imagem_url || ""}
                        alt={editingPorta.nome}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Image generator note */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Para gerar imagens com IA, use o gerador de imagens na aba de Oráculos
                    com o foco simbólico configurado acima.
                  </p>
                </div>

                <div>
                  <Label>Ou URL da Imagem Manual</Label>
                  <Input
                    value={editingPorta.imagem_url || ""}
                    onChange={(e) =>
                      setEditingPorta({ ...editingPorta, imagem_url: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>
              </TabsContent>

              {/* Save button */}
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Salvar Alterações
                </Button>
              </div>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Doors table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Nº</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead className="w-24">Leitura</TableHead>
                <TableHead className="w-24">Caso</TableHead>
                <TableHead className="w-24">Chave</TableHead>
                <TableHead className="w-20">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portas.map((porta) => {
                const hasLeitura = porta.cena_narrativa || porta.eixo_psiquico;
                const hasCaso = porta.caso_espelho_titulo || porta.caso_espelho_frase_chegada;
                const hasChave = porta.chave_frase_ancora || porta.chave_o_que_nao_fazer;

                return (
                  <TableRow key={porta.id} className={!porta.ativa ? "opacity-50" : ""}>
                    <TableCell className="font-display text-lg text-gold">
                      {porta.numero}
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="font-medium">{porta.nome}</span>
                        {porta.subtitulo && (
                          <span className="text-sm text-muted-foreground ml-2">
                            {porta.subtitulo}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={porta.ativa}
                        onCheckedChange={() => toggleAtiva(porta)}
                      />
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs ${hasLeitura ? "text-green-500" : "text-muted-foreground"}`}
                      >
                        {hasLeitura ? "✓" : "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs ${hasCaso ? "text-green-500" : "text-muted-foreground"}`}
                      >
                        {hasCaso ? "✓" : "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs ${hasChave ? "text-green-500" : "text-muted-foreground"}`}
                      >
                        {hasChave ? "✓" : "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingPorta(porta);
                          setDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
