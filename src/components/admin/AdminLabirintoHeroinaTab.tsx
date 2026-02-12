import { useState, useEffect, useRef } from "react";
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
  Compass, Moon, Loader2, Save, 
  BarChart3, Image as ImageIcon, AlertTriangle, CheckCircle2, Pencil,
  Printer, Eye, XCircle
} from "lucide-react";
import { toast } from "sonner";

// Card images for validation
import cartaVerso from "@/assets/portas/carta-verso.png";
import porta01 from "@/assets/portas/porta-01-o-chamado.png";
import porta02 from "@/assets/portas/porta-02-a-ruptura.png";
import porta03 from "@/assets/portas/porta-03-a-descida.png";
import porta04 from "@/assets/portas/porta-04-o-labirinto.png";
import porta05 from "@/assets/portas/porta-05-o-osso.png";
import porta06 from "@/assets/portas/porta-06-a-memoria.png";
import porta07 from "@/assets/portas/porta-07-a-ferida.png";
import porta08 from "@/assets/portas/porta-08-a-defesa.png";
import porta09 from "@/assets/portas/porta-09-o-espelho.png";
import porta10 from "@/assets/portas/porta-10-a-escolha.png";
import porta11 from "@/assets/portas/porta-11-a-integracao.png";
import porta12 from "@/assets/portas/porta-12-a-voz.png";
import porta13 from "@/assets/portas/porta-13-o-retorno.png";
import porta14 from "@/assets/portas/porta-14-a-guardia.png";

const PORTA_IMAGES: Record<number, string> = {
  1: porta01, 2: porta02, 3: porta03, 4: porta04, 5: porta05,
  6: porta06, 7: porta07, 8: porta08, 9: porta09, 10: porta10,
  11: porta11, 12: porta12, 13: porta13, 14: porta14,
};

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
  imagem_url: string | null;
  texto_simbolico: string | null;
  cor_acento: string | null;
  ativo: boolean;
  nucleo: string | null;
  tema_central: string | null;
  pergunta_chave: string | null;
  exercicio_titulo: string | null;
  exercicio_instrucao: string | null;
  ritual_texto: string | null;
  codigo_interno: string | null;
  versao_conteudo: string | null;
  observacoes_admin: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

export function AdminLabirintoHeroinaTab() {
  const [activeTab, setActiveTab] = useState("fases");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Compass className="w-5 h-5 text-gold" />
          Labirinto da Heroína Interna®
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Gestão profissional das 14 Portas — edição controlada, auditoria e preparação gráfica
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start flex-wrap h-auto gap-1 bg-muted/50">
          <TabsTrigger value="fases" className="gap-2">
            <Moon className="w-4 h-4" /> Portas (14)
          </TabsTrigger>
          <TabsTrigger value="imagens" className="gap-2">
            <ImageIcon className="w-4 h-4" /> Imagens
          </TabsTrigger>
          <TabsTrigger value="auditoria" className="gap-2">
            <BarChart3 className="w-4 h-4" /> Auditoria
          </TabsTrigger>
          <TabsTrigger value="impressao" className="gap-2">
            <Printer className="w-4 h-4" /> Baralho Físico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fases"><FasesSection /></TabsContent>
        <TabsContent value="imagens"><ImagensSection /></TabsContent>
        <TabsContent value="auditoria"><AuditoriaSection /></TabsContent>
        <TabsContent value="impressao"><ImpressaoSection /></TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================
// FASES SECTION — Somente leitura + edição controlada
// ❌ Sem criar/duplicar/excluir portas
// ============================================

function FasesSection() {
  const [fases, setFases] = useState<LabirintoFase[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<LabirintoFase | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nome: "", subtitulo: "", descricao: "", icone: "", cor_acento: "",
    ativo: true, nucleo: "", tema_central: "", pergunta_chave: "",
    exercicio_titulo: "", exercicio_instrucao: "", ritual_texto: "",
    codigo_interno: "", versao_conteudo: "1.0", observacoes_admin: "",
  });

  useEffect(() => { fetchFases(); }, []);

  const fetchFases = async () => {
    const { data, error } = await supabase.from("labirinto_fases").select("*").order("ordem");
    if (error) toast.error("Erro ao carregar portas");
    else setFases(data || []);
    setLoading(false);
  };

  const openEdit = (fase: LabirintoFase) => {
    setEditing(fase);
    setForm({
      nome: fase.nome, subtitulo: fase.subtitulo || "", descricao: fase.descricao || "",
      icone: fase.icone || "", cor_acento: fase.cor_acento || "",
      ativo: fase.ativo, nucleo: fase.nucleo || "", tema_central: fase.tema_central || "",
      pergunta_chave: fase.pergunta_chave || "",
      exercicio_titulo: fase.exercicio_titulo || "",
      exercicio_instrucao: fase.exercicio_instrucao || "",
      ritual_texto: fase.ritual_texto || "",
      codigo_interno: fase.codigo_interno || "",
      versao_conteudo: fase.versao_conteudo || "1.0",
      observacoes_admin: fase.observacoes_admin || "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editing || !form.nome.trim()) { toast.error("Nome é obrigatório"); return; }
    setSaving(true);

    const { error } = await supabase.from("labirinto_fases").update({
      nome: form.nome, subtitulo: form.subtitulo || null, descricao: form.descricao || null,
      icone: form.icone || null, cor_acento: form.cor_acento || null, ativo: form.ativo,
      nucleo: form.nucleo || null, tema_central: form.tema_central || null,
      pergunta_chave: form.pergunta_chave || null,
      exercicio_titulo: form.exercicio_titulo || null,
      exercicio_instrucao: form.exercicio_instrucao || null,
      ritual_texto: form.ritual_texto || null,
      codigo_interno: form.codigo_interno || null,
      versao_conteudo: form.versao_conteudo || null,
      observacoes_admin: form.observacoes_admin || null,
    }).eq("id", editing.id);

    if (error) toast.error("Erro ao atualizar");
    else { toast.success("Porta atualizada"); fetchFases(); setDialogOpen(false); }
    setSaving(false);
  };

  const toggleAtivo = async (fase: LabirintoFase) => {
    const { error } = await supabase.from("labirinto_fases").update({ ativo: !fase.ativo }).eq("id", fase.id);
    if (error) toast.error("Erro ao alterar status"); else fetchFases();
  };

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gold" /></div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Moon className="w-5 h-5 text-gold" />
          14 Portas da Jornada
        </CardTitle>
        <CardDescription>
          Edição controlada dos conteúdos clínicos — não é possível criar ou excluir portas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Porta</TableHead>
              <TableHead>Núcleo</TableHead>
              <TableHead>Tema Central</TableHead>
              <TableHead className="w-16">Código</TableHead>
              <TableHead className="w-16">Versão</TableHead>
              <TableHead className="w-20">Status</TableHead>
              <TableHead className="w-16">Editar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fases.map((fase) => (
              <TableRow key={fase.id}>
                <TableCell className="font-mono text-muted-foreground font-bold">{fase.ordem}</TableCell>
                <TableCell className="font-medium">{fase.nome}</TableCell>
                <TableCell>
                  {fase.nucleo ? <Badge variant="outline" className="text-xs">{fase.nucleo}</Badge> : <span className="text-muted-foreground/40">—</span>}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">{fase.tema_central || "—"}</TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">{fase.codigo_interno || "—"}</TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">{fase.versao_conteudo || "1.0"}</TableCell>
                <TableCell>
                  <Switch checked={fase.ativo} onCheckedChange={() => toggleAtivo(fase)} />
                </TableCell>
                <TableCell>
                  <Button size="icon" variant="ghost" onClick={() => openEdit(fase)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* Edit Dialog — only edit, never create */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar: Porta {editing?.ordem} — {editing?.nome}</DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6">
              {/* Identification — ordem is read-only */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Identificação</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Nº da Porta</Label>
                    <Input value={editing?.ordem || 0} disabled className="bg-muted/50" />
                  </div>
                  <div className="col-span-2"><Label>Nome *</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Subtítulo</Label><Input value={form.subtitulo} onChange={(e) => setForm({ ...form, subtitulo: e.target.value })} /></div>
                  <div><Label>Núcleo</Label><Input value={form.nucleo} onChange={(e) => setForm({ ...form, nucleo: e.target.value })} placeholder="Identidade / Descida / Feridas / Integração" /></div>
                </div>
              </div>

              {/* Clinical content */}
              <div className="space-y-3 border-t border-border pt-4">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Conteúdo Clínico</h4>
                <div><Label>Tema Central</Label><Input value={form.tema_central} onChange={(e) => setForm({ ...form, tema_central: e.target.value })} /></div>
                <div><Label>Pergunta Terapêutica-Chave</Label><Textarea value={form.pergunta_chave} onChange={(e) => setForm({ ...form, pergunta_chave: e.target.value })} rows={2} /></div>
                <div><Label>Título do Exercício</Label><Input value={form.exercicio_titulo} onChange={(e) => setForm({ ...form, exercicio_titulo: e.target.value })} /></div>
                <div><Label>Instrução do Exercício</Label><Textarea value={form.exercicio_instrucao} onChange={(e) => setForm({ ...form, exercicio_instrucao: e.target.value })} rows={3} /></div>
                <div><Label>Texto do Ritual</Label><Textarea value={form.ritual_texto} onChange={(e) => setForm({ ...form, ritual_texto: e.target.value })} rows={3} /></div>
              </div>

              {/* Texto Oracular */}
              <div className="space-y-3 border-t border-border pt-4">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Texto Oracular</h4>
                <div><Label>Descrição</Label><Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={4} /></div>
              </div>

              {/* Internal fields */}
              <div className="space-y-3 border-t border-border pt-4">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Campos Internos (Admin)</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Código Interno</Label><Input value={form.codigo_interno} onChange={(e) => setForm({ ...form, codigo_interno: e.target.value })} placeholder="P01" /></div>
                  <div><Label>Versão do Conteúdo</Label><Input value={form.versao_conteudo} onChange={(e) => setForm({ ...form, versao_conteudo: e.target.value })} /></div>
                </div>
                <div><Label>Observações Editoriais</Label><Textarea value={form.observacoes_admin} onChange={(e) => setForm({ ...form, observacoes_admin: e.target.value })} rows={2} placeholder="Notas internas, decisões editoriais..." /></div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.ativo} onCheckedChange={(checked) => setForm({ ...form, ativo: checked })} />
                  <Label>Porta Ativa (visível ao usuário)</Label>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// ============================================
// IMAGENS SECTION — Validação de vinculação
// ============================================

function ImagensSection() {
  const [fases, setFases] = useState<LabirintoFase[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageChecks, setImageChecks] = useState<Record<string, { loaded: boolean; width: number; height: number; ratio: string; correct: boolean }>>({});

  useEffect(() => {
    supabase.from("labirinto_fases").select("*").order("ordem").then(({ data }) => {
      setFases((data || []) as LabirintoFase[]);
      setLoading(false);
    });
  }, []);

  const checkImage = (ordem: number, faseId: string) => {
    const src = PORTA_IMAGES[ordem];
    if (!src) {
      setImageChecks(prev => ({ ...prev, [faseId]: { loaded: false, width: 0, height: 0, ratio: "N/A", correct: false } }));
      return;
    }
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const ratio = h > 0 ? (w / h).toFixed(2) : "0";
      // 2:3 = 0.667, allow some tolerance
      const isCorrectRatio = Math.abs(parseFloat(ratio) - 0.667) < 0.05;
      setImageChecks(prev => ({ ...prev, [faseId]: { loaded: true, width: w, height: h, ratio: `${w}×${h}`, correct: isCorrectRatio } }));
    };
    img.onerror = () => {
      setImageChecks(prev => ({ ...prev, [faseId]: { loaded: false, width: 0, height: 0, ratio: "Erro", correct: false } }));
    };
    img.src = src;
  };

  useEffect(() => {
    if (fases.length > 0) {
      fases.forEach(f => checkImage(f.ordem, f.id));
    }
  }, [fases]);

  // Detect duplicate images
  const imageSources = fases.map(f => PORTA_IMAGES[f.ordem]).filter(Boolean);
  const duplicates = imageSources.filter((src, i) => imageSources.indexOf(src) !== i);

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gold" /></div>;

  const totalOk = Object.values(imageChecks).filter(c => c.loaded && c.correct).length;
  const totalMissing = fases.filter(f => !PORTA_IMAGES[f.ordem]).length;
  const totalBadRatio = Object.values(imageChecks).filter(c => c.loaded && !c.correct).length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold">{fases.length}</p>
          <p className="text-xs text-muted-foreground">Portas Totais</p>
        </CardContent></Card>
        <Card className="border-emerald-500/20"><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-emerald-500">{totalOk}</p>
          <p className="text-xs text-muted-foreground">Imagens OK</p>
        </CardContent></Card>
        <Card className={totalMissing > 0 ? "border-destructive/20" : ""}><CardContent className="p-4 text-center">
          <p className={`text-2xl font-bold ${totalMissing > 0 ? 'text-destructive' : ''}`}>{totalMissing}</p>
          <p className="text-xs text-muted-foreground">Ausentes</p>
        </CardContent></Card>
        <Card className={totalBadRatio > 0 ? "border-amber-500/20" : ""}><CardContent className="p-4 text-center">
          <p className={`text-2xl font-bold ${totalBadRatio > 0 ? 'text-amber-500' : ''}`}>{totalBadRatio}</p>
          <p className="text-xs text-muted-foreground">Proporção Incorreta</p>
        </CardContent></Card>
      </div>

      {duplicates.length > 0 && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4 flex items-center gap-3">
            <XCircle className="w-5 h-5 text-destructive shrink-0" />
            <div>
              <p className="text-sm font-medium text-destructive">Imagens Duplicadas Detectadas</p>
              <p className="text-xs text-muted-foreground">{duplicates.length} arquivo(s) estão sendo usados em mais de uma porta</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ImageIcon className="w-5 h-5 text-gold" /> Validação de Imagens</CardTitle>
          <CardDescription>Proporção ideal: 2:3 vertical (ex: 600×900px). Verifique ausências e proporções.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {fases.map((fase) => {
              const hasLocal = !!PORTA_IMAGES[fase.ordem];
              const check = imageChecks[fase.id];
              const status = !hasLocal ? "absent" : (check?.loaded && check.correct) ? "ok" : (check?.loaded && !check.correct) ? "bad-ratio" : "loading";

              return (
                <Card key={fase.id} className={`border ${
                  status === "ok" ? "border-emerald-500/20" : 
                  status === "absent" ? "border-destructive/20" : 
                  status === "bad-ratio" ? "border-amber-500/20" : "border-border"
                }`}>
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{fase.ordem}. {fase.nome}</span>
                      {status === "ok" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      {status === "absent" && <XCircle className="w-4 h-4 text-destructive" />}
                      {status === "bad-ratio" && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                      {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                    </div>

                    <div className="aspect-[2/3] rounded overflow-hidden bg-muted">
                      {hasLocal ? (
                        <img src={PORTA_IMAGES[fase.ordem]} alt={fase.nome} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center border border-dashed border-muted-foreground/20">
                          <p className="text-xs text-muted-foreground">Sem imagem</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs flex-wrap">
                      <Badge variant={status === "ok" ? "default" : status === "absent" ? "destructive" : "outline"} className="text-[10px]">
                        {status === "ok" ? "✓ Correta" : status === "absent" ? "Ausente" : status === "bad-ratio" ? "Proporção ≠ 2:3" : "Verificando..."}
                      </Badge>
                      {check?.loaded && (
                        <span className="text-muted-foreground font-mono">{check.ratio}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// AUDITORIA — MÉTRICAS AGREGADAS
// Pessoal x Profissional, Individual x Grupo
// ============================================

function AuditoriaSection() {
  const [metrics, setMetrics] = useState<{
    porPorta: Record<string, { total: number; pessoal: number; profissional: number }>;
    pessoal: number; profissional: number; total: number;
    concluidas: number;
  } | null>(null);
  const [fases, setFases] = useState<Array<{ id: string; nome: string; ordem: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("sessoes_labirinto").select("porta_id, modo, concluida"),
      supabase.from("labirinto_fases").select("id, nome, ordem").order("ordem"),
    ]).then(([sessRes, fasesRes]) => {
      const sessoes = sessRes.data || [];
      const porPorta: Record<string, { total: number; pessoal: number; profissional: number }> = {};
      let pessoal = 0, profissional = 0, concluidas = 0;

      sessoes.forEach((s: any) => {
        if (s.porta_id) {
          if (!porPorta[s.porta_id]) porPorta[s.porta_id] = { total: 0, pessoal: 0, profissional: 0 };
          porPorta[s.porta_id].total++;
          if (s.modo === "pessoal") porPorta[s.porta_id].pessoal++;
          if (s.modo === "profissional") porPorta[s.porta_id].profissional++;
        }
        if (s.modo === "pessoal") pessoal++;
        if (s.modo === "profissional") profissional++;
        if (s.concluida) concluidas++;
      });
      setMetrics({ porPorta, pessoal, profissional, total: sessoes.length, concluidas });
      setFases(fasesRes.data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gold" /></div>;
  if (!metrics) return null;

  const topPortas = [...fases].sort((a, b) => (metrics.porPorta[b.id]?.total || 0) - (metrics.porPorta[a.id]?.total || 0)).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center">
          <p className="text-3xl font-bold text-gold">{metrics.total}</p>
          <p className="text-sm text-muted-foreground">Sessões Totais</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-3xl font-bold">{metrics.pessoal}</p>
          <p className="text-sm text-muted-foreground">Modo Pessoal</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-3xl font-bold">{metrics.profissional}</p>
          <p className="text-sm text-muted-foreground">Modo Profissional</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-3xl font-bold text-emerald-500">{metrics.concluidas}</p>
          <p className="text-sm text-muted-foreground">Concluídas</p>
        </CardContent></Card>
      </div>

      {/* Top 5 most used */}
      {topPortas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">🏆 Portas Mais Recorrentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topPortas.map((f, i) => {
                const data = metrics.porPorta[f.id] || { total: 0, pessoal: 0, profissional: 0 };
                if (data.total === 0) return null;
                return (
                  <div key={f.id} className="flex items-center gap-3 text-sm">
                    <span className="font-mono text-muted-foreground w-6">{i + 1}.</span>
                    <span className="flex-1 font-medium">{f.nome}</span>
                    <Badge variant="outline" className="text-xs">{data.pessoal} pessoal</Badge>
                    <Badge variant="outline" className="text-xs">{data.profissional} profissional</Badge>
                    <Badge className="text-xs">{data.total} total</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-gold" /> Uso Detalhado por Porta</CardTitle>
          <CardDescription>Métricas agregadas — sem dados sensíveis de usuários</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Porta</TableHead>
              <TableHead className="w-20 text-right">Pessoal</TableHead>
              <TableHead className="w-20 text-right">Profissional</TableHead>
              <TableHead className="w-20 text-right">Total</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {fases.map((fase) => {
                const data = metrics.porPorta[fase.id] || { total: 0, pessoal: 0, profissional: 0 };
                return (
                  <TableRow key={fase.id}>
                    <TableCell className="font-mono text-muted-foreground">{fase.ordem}</TableCell>
                    <TableCell className="font-medium">{fase.nome}</TableCell>
                    <TableCell className="text-right">{data.pessoal}</TableCell>
                    <TableCell className="text-right">{data.profissional}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={data.total > 0 ? "default" : "outline"}>{data.total}</Badge>
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

// ============================================
// IMPRESSÃO — Layout preparado para baralho físico
// Proporção 2:3, sangria, margens, camadas
// ============================================

function ImpressaoSection() {
  const [fases, setFases] = useState<LabirintoFase[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewPorta, setPreviewPorta] = useState<number | null>(null);

  useEffect(() => {
    supabase.from("labirinto_fases").select("*").order("ordem").then(({ data }) => {
      setFases((data || []) as LabirintoFase[]);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gold" /></div>;

  return (
    <div className="space-y-6">
      {/* Spec card */}
      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Printer className="w-5 h-5 text-gold" /> Preparação para Baralho Físico</CardTitle>
          <CardDescription>Layout estruturado para futura impressão profissional em gráfica</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 text-sm">
              <h4 className="font-medium">📐 Especificações</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Proporção: <strong>2:3 vertical</strong> (ex: 63×89mm tarot)</li>
                <li>• Sangria (bleed): 3mm em cada lado</li>
                <li>• Margem de segurança: 5mm interno</li>
                <li>• Área central protegida para conteúdo</li>
                <li>• Cantos arredondados: 3mm</li>
              </ul>
            </div>
            <div className="space-y-2 text-sm">
              <h4 className="font-medium">📦 Camadas Lógicas</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• <strong>Camada 1:</strong> Fundo / Moldura padrão</li>
                <li>• <strong>Camada 2:</strong> Imagem da Porta</li>
                <li>• <strong>Camada 3:</strong> Nome da Porta</li>
                <li>• <strong>Camada 4:</strong> Número discreto (canto)</li>
              </ul>
            </div>
          </div>

          <div className="bg-muted/50 rounded p-3 text-xs text-muted-foreground">
            <strong>Nota:</strong> A exportação em PDF de alta resolução (individual ou lote de 14 cartas) será ativada em versão futura. O layout já está preparado.
          </div>
        </CardContent>
      </Card>

      {/* Card previews */}
      <Card>
        <CardHeader>
          <CardTitle>Preview das 14 Cartas (Layout Gráfico)</CardTitle>
          <CardDescription>Visualização com moldura, camadas e margens de segurança</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
            {fases.map((fase) => (
              <PrintCard key={fase.id} fase={fase} expanded={previewPorta === fase.ordem} onToggle={() => setPreviewPorta(previewPorta === fase.ordem ? null : fase.ordem)} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Verso */}
      <Card>
        <CardHeader>
          <CardTitle>Verso Padrão (Igual para todas)</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="print-card-wrapper">
            <div className="print-card-bleed">
              <div className="print-card-safe">
                <img src={cartaVerso} alt="Verso" className="w-full h-full object-cover rounded-sm" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <style>{`
        .print-card-wrapper {
          width: 180px;
          aspect-ratio: 2/3;
        }
        .print-card-bleed {
          position: relative;
          width: 100%;
          height: 100%;
          background: hsl(var(--muted));
          border-radius: 6px;
          overflow: hidden;
          /* Simulates bleed area */
          outline: 2px dashed hsl(var(--muted-foreground) / 0.2);
          outline-offset: 4px;
        }
        .print-card-safe {
          position: absolute;
          inset: 6%; /* ~5mm safe margin simulation */
          overflow: hidden;
          border-radius: 4px;
        }
        .print-card-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          pointer-events: none;
        }
        .print-card-title {
          padding: 8px;
          background: linear-gradient(to top, rgba(0,0,0,0.75), transparent);
          text-align: center;
        }
        .print-card-number {
          position: absolute;
          top: 8px;
          right: 10px;
          font-size: 10px;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}

function PrintCard({ fase, expanded, onToggle }: { fase: LabirintoFase; expanded: boolean; onToggle: () => void }) {
  const hasImage = !!PORTA_IMAGES[fase.ordem];

  return (
    <div className="space-y-2">
      <button onClick={onToggle} className="focus:outline-none print-card-wrapper group" title={`Preview: ${fase.nome}`}>
        <div className="print-card-bleed">
          {/* Camada 1: Fundo */}
          <div className="absolute inset-0 bg-gradient-to-b from-background to-muted" />
          
          {/* Camada 2: Imagem */}
          <div className="print-card-safe">
            {hasImage ? (
              <img src={PORTA_IMAGES[fase.ordem]} alt={fase.nome} className="w-full h-full object-cover rounded-sm" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted/80">
                <ImageIcon className="w-6 h-6 text-muted-foreground/30" />
              </div>
            )}
          </div>

          {/* Camada 3: Nome */}
          <div className="print-card-overlay">
            <div className="print-card-title">
              <p className="text-[10px] font-display text-gold leading-tight">{fase.nome}</p>
            </div>
          </div>

          {/* Camada 4: Número discreto */}
          <span className="print-card-number font-mono text-gold/60">{fase.ordem}</span>
        </div>
      </button>

      <p className="text-[10px] text-center text-muted-foreground font-mono">{fase.codigo_interno || `P${String(fase.ordem).padStart(2, "0")}`}</p>

      {expanded && (
        <div className="text-[10px] text-muted-foreground bg-muted/50 rounded p-2 space-y-1 max-w-[180px]">
          <p><strong>Núcleo:</strong> {fase.nucleo || "—"}</p>
          <p><strong>Versão:</strong> {fase.versao_conteudo || "—"}</p>
          <p><strong>Imagem:</strong> {hasImage ? "✓ Vinculada" : "✗ Ausente"}</p>
        </div>
      )}
    </div>
  );
}
