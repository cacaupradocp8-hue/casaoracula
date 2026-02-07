import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Save, Copy, FileText, Eye, Edit, RefreshCw } from "lucide-react";
import { useSaveConteudo, GenerateContentInput, ReviseContentResponse } from "@/hooks/useAtelieConteudo";
import AtelieRevisao from "./AtelieRevisao";

interface AtelieResultadoProps {
  rawContent: string;
  sections: Record<string, string>;
  input: GenerateContentInput;
  onSaved: () => void;
}

const SECTION_LABELS: Record<string, string> = {
  sentido_jornada: "1) Sentido da Jornada",
  essencia_80_20: "2) Essência 80/20",
  raiz_psiquica: "3) Raiz Psíquica",
  traducao_profissional: "4) Tradução Profissional",
  aplicacao_pessoal: "5) Aplicação Pessoal",
  pratica_autoeficacia: "6) Prática de Autoeficácia",
  registro_etico: "7) Registro Ético",
  ajustes_realizados: "Ajustes Realizados",
  conteudo_completo: "Conteúdo Completo",
};

export default function AtelieResultado({ rawContent, sections, input, onSaved }: AtelieResultadoProps) {
  const [editedSections, setEditedSections] = useState<Record<string, string>>(sections);
  const [editedRaw, setEditedRaw] = useState(rawContent);
  const [viewMode, setViewMode] = useState<"sections" | "raw">("sections");
  const [isEditing, setIsEditing] = useState(false);
  const [showRevisao, setShowRevisao] = useState(false);
  const [wasRevised, setWasRevised] = useState(false);

  const saveConteudo = useSaveConteudo();

  const handleSectionChange = (key: string, value: string) => {
    setEditedSections((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (status: "rascunho" | "revisado" | "publicado" = "rascunho") => {
    await saveConteudo.mutateAsync({
      template_id: input.template_id,
      jornada: input.jornada,
      portal: input.portal,
      objetivo: input.objetivo,
      ideias_chave: input.ideias_chave,
      tom: input.tom,
      duracao: input.duracao,
      conteudo_gerado: viewMode === "raw" ? { conteudo_completo: editedRaw } : editedSections,
      status,
    });
    onSaved();
  };

  const handleCopyAll = () => {
    const textToCopy = viewMode === "raw" ? editedRaw : Object.entries(editedSections)
      .map(([key, value]) => `### ${SECTION_LABELS[key] || key}\n\n${value}`)
      .join("\n\n---\n\n");
    navigator.clipboard.writeText(textToCopy);
  };

  const handleRevised = (result: ReviseContentResponse) => {
    setEditedSections(result.sections);
    setEditedRaw(result.raw_content);
    setWasRevised(true);
    setShowRevisao(false);
  };

  // Build full content for revision
  const fullContentForRevision = Object.entries(editedSections)
    .map(([key, value]) => `### ${SECTION_LABELS[key] || key}\n\n${value}`)
    .join("\n\n---\n\n");

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gold" />
                Conteúdo Gerado
                {wasRevised && (
                  <Badge variant="secondary" className="ml-2">
                    Revisado
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                <span className="font-medium">{input.portal}</span> — {input.jornada}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{input.tom}</Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRevisao(!showRevisao)}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Revisar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <Eye className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                {isEditing ? "Visualizar" : "Editar"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* View Mode Tabs */}
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "sections" | "raw")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sections">Por Seções</TabsTrigger>
              <TabsTrigger value="raw">Texto Completo</TabsTrigger>
            </TabsList>

            {/* Sections View */}
            <TabsContent value="sections" className="space-y-4 mt-4">
              {Object.entries(editedSections).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                    {SECTION_LABELS[key] || key}
                  </h4>
                  {isEditing ? (
                    <Textarea
                      value={value}
                      onChange={(e) => handleSectionChange(key, e.target.value)}
                      rows={6}
                      className="font-mono text-sm"
                    />
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-muted/50 rounded-lg whitespace-pre-wrap">
                      {value}
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>

            {/* Raw View */}
            <TabsContent value="raw" className="mt-4">
              {isEditing ? (
                <Textarea
                  value={editedRaw}
                  onChange={(e) => setEditedRaw(e.target.value)}
                  rows={20}
                  className="font-mono text-sm"
                />
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-muted/50 rounded-lg whitespace-pre-wrap max-h-[600px] overflow-y-auto">
                  {editedRaw}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleCopyAll}>
              <Copy className="h-4 w-4 mr-2" />
              Copiar Tudo
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSave("rascunho")}
              disabled={saveConteudo.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar como Rascunho
            </Button>
            <Button
              onClick={() => handleSave("revisado")}
              disabled={saveConteudo.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar como Revisado
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Revision Panel */}
      {showRevisao && (
        <AtelieRevisao
          conteudoOriginal={fullContentForRevision}
          onRevised={handleRevised}
        />
      )}
    </div>
  );
}
