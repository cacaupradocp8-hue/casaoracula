import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, Sparkles, Moon, Feather, Flame, 
  Copy, Printer, Save, Check, FileText, AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { LabirintoFase, LabirintoArquetipo, LabirintoMetafora, LabirintoRitual } from "@/hooks/useLabirintoHeroina";

interface CamadaSelecionada {
  tipo: "fase" | "arquetipo" | "metafora" | "ritual";
  id: string;
  nome: string;
  descricao?: string;
}

interface RoteiroGerado {
  abertura: string;
  exploracao: string;
  intervencao: string;
  fechamento: string;
}

interface GeradorRoteiroModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fases: LabirintoFase[];
  arquetipos: LabirintoArquetipo[];
  metaforas: LabirintoMetafora[];
  rituais: LabirintoRitual[];
}

export function GeradorRoteiroModal({
  open,
  onOpenChange,
  fases,
  arquetipos,
  metaforas,
  rituais,
}: GeradorRoteiroModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<"selecao" | "gerando" | "resultado">("selecao");
  const [selectedFase, setSelectedFase] = useState<string | null>(null);
  const [selectedArquetipo, setSelectedArquetipo] = useState<string | null>(null);
  const [selectedMetafora, setSelectedMetafora] = useState<string | null>(null);
  const [selectedRitual, setSelectedRitual] = useState<string | null>(null);
  const [roteiro, setRoteiro] = useState<RoteiroGerado | null>(null);
  const [editedRoteiro, setEditedRoteiro] = useState<RoteiroGerado | null>(null);
  const [roteiroId, setRoteiroId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const hasSelection = selectedFase || selectedArquetipo || selectedMetafora || selectedRitual;

  const handleGenerate = async () => {
    setStep("gerando");

    const camadas: CamadaSelecionada[] = [];
    
    if (selectedFase) {
      const fase = fases.find(f => f.id === selectedFase);
      if (fase) camadas.push({ tipo: "fase", id: fase.id, nome: fase.nome, descricao: fase.descricao || undefined });
    }
    if (selectedArquetipo) {
      const arq = arquetipos.find(a => a.id === selectedArquetipo);
      if (arq) camadas.push({ tipo: "arquetipo", id: arq.id, nome: arq.nome, descricao: arq.territorio || undefined });
    }
    if (selectedMetafora) {
      const meta = metaforas.find(m => m.id === selectedMetafora);
      if (meta) camadas.push({ tipo: "metafora", id: meta.id, nome: meta.nome, descricao: meta.texto_evocativo || undefined });
    }
    if (selectedRitual) {
      const rit = rituais.find(r => r.id === selectedRitual);
      if (rit) camadas.push({ tipo: "ritual", id: rit.id, nome: rit.nome, descricao: rit.descricao || undefined });
    }

    try {
      const { data, error } = await supabase.functions.invoke("generate-labirinto-roteiro", {
        body: { camadas, useAI: true },
      });

      if (error) throw error;

      setRoteiro(data.roteiro);
      setEditedRoteiro(data.roteiro);
      setRoteiroId(data.id);
      setStep("resultado");
    } catch (err) {
      console.error("Erro ao gerar roteiro:", err);
      toast({
        title: "Erro ao gerar roteiro",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
      setStep("selecao");
    }
  };

  const handleCopy = async (section: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(section);
    setTimeout(() => setCopied(null), 2000);
    toast({ title: "Copiado!", description: `Seção "${section}" copiada para a área de transferência.` });
  };

  const handlePrint = () => {
    if (!editedRoteiro) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Roteiro de Sessão - Labirinto da Heroína Interna®</title>
          <style>
            body { font-family: Georgia, serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { text-align: center; color: #b8860b; border-bottom: 2px solid #b8860b; padding-bottom: 10px; }
            h2 { color: #333; margin-top: 30px; }
            .section { margin-bottom: 30px; padding: 20px; background: #fafafa; border-left: 3px solid #b8860b; }
            .warning { background: #fff3cd; padding: 10px; border-radius: 4px; margin: 10px 0; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <h1>🌙 Roteiro de Sessão</h1>
          <p style="text-align: center; color: #666;">Labirinto da Heroína Interna® | ${new Date().toLocaleDateString("pt-BR")}</p>
          
          <div class="section">
            <h2>Abertura Simbólica</h2>
            <div>${editedRoteiro.abertura.replace(/\n/g, "<br>")}</div>
          </div>
          
          <div class="section">
            <h2>Exploração do Núcleo</h2>
            <div>${editedRoteiro.exploracao.replace(/\n/g, "<br>")}</div>
          </div>
          
          <div class="section">
            <h2>Intervenção Simbólica</h2>
            <div class="warning">⚠️ Não force catarse. Não interprete. Apenas sustente.</div>
            <div>${editedRoteiro.intervencao.replace(/\n/g, "<br>")}</div>
          </div>
          
          <div class="section">
            <h2>Fechamento Ritual</h2>
            <div>${editedRoteiro.fechamento.replace(/\n/g, "<br>")}</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleSave = async () => {
    if (!roteiroId || !editedRoteiro) return;

    try {
      const { error } = await supabase
        .from("labirinto_roteiros_gerados")
        .update({
          abertura: editedRoteiro.abertura,
          exploracao: editedRoteiro.exploracao,
          intervencao: editedRoteiro.intervencao,
          fechamento: editedRoteiro.fechamento,
          editado: true,
        })
        .eq("id", roteiroId);

      if (error) throw error;

      toast({ title: "Roteiro salvo!", description: "Suas edições foram salvas com sucesso." });
    } catch (err) {
      console.error("Erro ao salvar:", err);
      toast({ title: "Erro ao salvar", variant: "destructive" });
    }
  };

  const handleReset = () => {
    setStep("selecao");
    setRoteiro(null);
    setEditedRoteiro(null);
    setRoteiroId(null);
    setSelectedFase(null);
    setSelectedArquetipo(null);
    setSelectedMetafora(null);
    setSelectedRitual(null);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) handleReset(); }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gold">
            <FileText className="w-5 h-5" />
            Gerador de Roteiro de Sessão
          </DialogTitle>
        </DialogHeader>

        {step === "selecao" && (
          <div className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg border border-gold/20">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Como funciona</p>
                  <p>Selecione as camadas que deseja trabalhar na sessão. O gerador criará um roteiro estruturado com abertura, exploração, intervenção e fechamento — <strong>sem automatizar fala ou interpretar emoções</strong>.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fases */}
              <Card className="border-gold/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Moon className="w-4 h-4 text-gold" />
                    Fase
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {fases.map(fase => (
                    <button
                      key={fase.id}
                      onClick={() => setSelectedFase(selectedFase === fase.id ? null : fase.id)}
                      className={cn(
                        "w-full text-left p-2 rounded-md text-sm transition-colors",
                        selectedFase === fase.id
                          ? "bg-gold/20 text-gold border border-gold"
                          : "bg-muted/50 hover:bg-muted"
                      )}
                    >
                      {fase.nome}
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Arquétipos */}
              <Card className="border-gold/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold" />
                    Arquétipo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {arquetipos.map(arq => (
                    <button
                      key={arq.id}
                      onClick={() => setSelectedArquetipo(selectedArquetipo === arq.id ? null : arq.id)}
                      className={cn(
                        "w-full text-left p-2 rounded-md text-sm transition-colors",
                        selectedArquetipo === arq.id
                          ? "bg-gold/20 text-gold border border-gold"
                          : "bg-muted/50 hover:bg-muted"
                      )}
                    >
                      {arq.nome}
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Metáforas */}
              <Card className="border-gold/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Feather className="w-4 h-4 text-gold" />
                    Metáfora
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {metaforas.map(meta => (
                    <button
                      key={meta.id}
                      onClick={() => setSelectedMetafora(selectedMetafora === meta.id ? null : meta.id)}
                      className={cn(
                        "w-full text-left p-2 rounded-md text-sm transition-colors",
                        selectedMetafora === meta.id
                          ? "bg-gold/20 text-gold border border-gold"
                          : "bg-muted/50 hover:bg-muted"
                      )}
                    >
                      {meta.nome}
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Rituais */}
              <Card className="border-gold/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Flame className="w-4 h-4 text-gold" />
                    Ritual
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {rituais.map(rit => (
                    <button
                      key={rit.id}
                      onClick={() => setSelectedRitual(selectedRitual === rit.id ? null : rit.id)}
                      className={cn(
                        "w-full text-left p-2 rounded-md text-sm transition-colors",
                        selectedRitual === rit.id
                          ? "bg-gold/20 text-gold border border-gold"
                          : "bg-muted/50 hover:bg-muted"
                      )}
                    >
                      {rit.nome}
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleGenerate} 
                disabled={!hasSelection}
                className="bg-gold hover:bg-gold/90 text-gold-foreground gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Gerar Roteiro
              </Button>
            </div>
          </div>
        )}

        {step === "gerando" && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-gold" />
            <p className="text-muted-foreground">Organizando o campo simbólico...</p>
            <p className="text-xs text-muted-foreground">Isso pode levar alguns segundos</p>
          </div>
        )}

        {step === "resultado" && editedRoteiro && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Roteiro gerado. Você pode editar cada seção antes de usar.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1">
                  <Printer className="w-4 h-4" />
                  Imprimir
                </Button>
                <Button variant="outline" size="sm" onClick={handleSave} className="gap-1">
                  <Save className="w-4 h-4" />
                  Salvar
                </Button>
              </div>
            </div>

            <Tabs defaultValue="abertura">
              <TabsList className="w-full justify-start flex-wrap h-auto gap-1">
                <TabsTrigger value="abertura" className="gap-1">
                  <Moon className="w-3 h-3" />
                  Abertura
                </TabsTrigger>
                <TabsTrigger value="exploracao" className="gap-1">
                  <Sparkles className="w-3 h-3" />
                  Exploração
                </TabsTrigger>
                <TabsTrigger value="intervencao" className="gap-1">
                  <Feather className="w-3 h-3" />
                  Intervenção
                </TabsTrigger>
                <TabsTrigger value="fechamento" className="gap-1">
                  <Flame className="w-3 h-3" />
                  Fechamento
                </TabsTrigger>
              </TabsList>

              {(["abertura", "exploracao", "intervencao", "fechamento"] as const).map(secao => (
                <TabsContent key={secao} value={secao} className="space-y-2">
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(secao, editedRoteiro[secao])}
                      className="gap-1"
                    >
                      {copied === secao ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied === secao ? "Copiado" : "Copiar"}
                    </Button>
                  </div>
                  <Textarea
                    value={editedRoteiro[secao]}
                    onChange={(e) => setEditedRoteiro({ ...editedRoteiro, [secao]: e.target.value })}
                    className="min-h-[300px] font-mono text-sm"
                  />
                </TabsContent>
              ))}
            </Tabs>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleReset}>
                Novo Roteiro
              </Button>
              <Button onClick={() => onOpenChange(false)} className="bg-gold hover:bg-gold/90 text-gold-foreground">
                Concluir
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
