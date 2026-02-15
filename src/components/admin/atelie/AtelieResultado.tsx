import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Save, Copy, FileText, Eye, Edit, RefreshCw, Shield, Loader2 } from "lucide-react";
import { GenerateContentInput, ReviseContentResponse } from "@/hooks/useAtelieConteudo";
import {
  AtelieInstitucionalInput,
  useCreatePortalComAula,
  useCreateAulaEmPortal,
  useUpdateAulaExistente,
} from "@/hooks/useAtelieInstitucional";
import AtelieRevisao from "./AtelieRevisao";
import AtelieRevisaoEtica from "./AtelieRevisaoEtica";

interface AtelieResultadoProps {
  rawContent: string;
  sections: Record<string, string>;
  input: GenerateContentInput;
  institucional: AtelieInstitucionalInput;
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
  missao: "Missão Obrigatória",
  versao_publica: "Versão Pública (Círculo)",
  arquitetura_autoral: "Arquitetura Autoral (Mentorada)",
  ajustes_realizados: "Ajustes Realizados",
  conteudo_completo: "Conteúdo Completo",
};

type ReviewMode = "none" | "pedagogica" | "etica";

export default function AtelieResultado({ rawContent, sections, input, institucional, onSaved }: AtelieResultadoProps) {
  const [editedSections, setEditedSections] = useState<Record<string, string>>(sections);
  const [editedRaw, setEditedRaw] = useState(rawContent);
  const [viewMode, setViewMode] = useState<"sections" | "raw">("sections");
  const [isEditing, setIsEditing] = useState(false);
  const [reviewMode, setReviewMode] = useState<ReviewMode>("none");
  const [wasRevised, setWasRevised] = useState(false);

  const createPortalAula = useCreatePortalComAula();
  const createAula = useCreateAulaEmPortal();
  const updateAula = useUpdateAulaExistente();

  const isSaving = createPortalAula.isPending || createAula.isPending || updateAula.isPending;

  const handleSectionChange = (key: string, value: string) => {
    setEditedSections((prev) => ({ ...prev, [key]: value }));
  };

  const getContentToSave = () => {
    const conteudo = viewMode === "raw" ? { conteudo_completo: editedRaw } : editedSections;
    const raw = viewMode === "raw" ? editedRaw : Object.entries(editedSections)
      .map(([key, value]) => `### ${SECTION_LABELS[key] || key}\n\n${value}`)
      .join("\n\n---\n\n");
    return { conteudo, raw };
  };

  const extractMissao = () => {
    const missaoText = editedSections.missao;
    if (!missaoText) return undefined;
    return {
      titulo: `Missão: ${institucional.titulo_portal}`,
      descricao: missaoText,
      criterios_conclusao: missaoText,
    };
  };

  const handleSaveAsRascunho = async () => {
    const { conteudo, raw } = getContentToSave();
    const missao = extractMissao();

    try {
      if (institucional.modo === "criar_portal_aula") {
        await createPortalAula.mutateAsync({
          jornada_id: institucional.jornada_id,
          modulo_id: institucional.modulo_id,
          titulo: institucional.titulo_portal,
          objetivo: institucional.objetivo,
          motor_geracao: institucional.motor,
          nivel_conteudo: institucional.nivel,
          aula: {
            titulo: institucional.titulo_aula || institucional.titulo_portal,
            conteudo_gerado: conteudo,
            conteudo_raw: raw,
            tom: institucional.tom,
            duracao: institucional.duracao,
          },
          missao,
        });
      } else if (institucional.modo === "criar_aula" && institucional.portal_id) {
        await createAula.mutateAsync({
          portal_id: institucional.portal_id,
          titulo: institucional.titulo_aula || institucional.titulo_portal,
          conteudo_gerado: conteudo,
          conteudo_raw: raw,
          motor_geracao: institucional.motor,
          nivel_conteudo: institucional.nivel,
          tom: institucional.tom,
          duracao: institucional.duracao,
          missao,
        });
      } else if (institucional.modo === "atualizar_aula" && institucional.aula_id) {
        await updateAula.mutateAsync({
          aula_id: institucional.aula_id,
          conteudo_gerado: conteudo,
          conteudo_raw: raw,
          motor_geracao: institucional.motor,
          nivel_conteudo: institucional.nivel,
        });
      }
      onSaved();
    } catch {
      // errors handled by mutation hooks
    }
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
    setReviewMode("none");
  };

  const toggleReviewMode = (mode: ReviewMode) => {
    setReviewMode(reviewMode === mode ? "none" : mode);
  };

  const fullContentForRevision = Object.entries(editedSections)
    .map(([key, value]) => `### ${SECTION_LABELS[key] || key}\n\n${value}`)
    .join("\n\n---\n\n");

  const modoLabel = institucional.modo === "criar_portal_aula"
    ? "Novo Portal + Aula"
    : institucional.modo === "criar_aula"
    ? "Nova Aula"
    : "Atualizar Aula";

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gold" />
                Conteúdo Gerado
                {wasRevised && <Badge variant="secondary" className="ml-2">Revisado</Badge>}
              </CardTitle>
              <CardDescription>
                <span className="font-medium">{input.portal}</span> — {input.jornada}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{modoLabel}</Badge>
              <Badge variant="outline">{institucional.motor === "agente_casa_oracula" ? "Agente" : "Padrão"}</Badge>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t mt-4">
            <Button variant={reviewMode === "pedagogica" ? "default" : "ghost"} size="sm" onClick={() => toggleReviewMode("pedagogica")}>
              <RefreshCw className="h-4 w-4 mr-1" /> Revisão Pedagógica
            </Button>
            <Button variant={reviewMode === "etica" ? "default" : "ghost"} size="sm" onClick={() => toggleReviewMode("etica")}>
              <Shield className="h-4 w-4 mr-1" /> Revisão Ética
            </Button>
            <div className="flex-1" />
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? <Eye className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              {isEditing ? " Visualizar" : " Editar"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "sections" | "raw")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sections">Por Seções</TabsTrigger>
              <TabsTrigger value="raw">Texto Completo</TabsTrigger>
            </TabsList>

            <TabsContent value="sections" className="space-y-4 mt-4">
              {Object.entries(editedSections).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                    {SECTION_LABELS[key] || key}
                  </h4>
                  {isEditing ? (
                    <Textarea value={value} onChange={(e) => handleSectionChange(key, e.target.value)} rows={6} className="font-mono text-sm" />
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-muted/50 rounded-lg whitespace-pre-wrap">{value}</div>
                  )}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="raw" className="mt-4">
              {isEditing ? (
                <Textarea value={editedRaw} onChange={(e) => setEditedRaw(e.target.value)} rows={20} className="font-mono text-sm" />
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-muted/50 rounded-lg whitespace-pre-wrap max-h-[600px] overflow-y-auto">{editedRaw}</div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleCopyAll}>
              <Copy className="h-4 w-4 mr-2" /> Copiar Tudo
            </Button>
            <Button onClick={handleSaveAsRascunho} disabled={isSaving}>
              {isSaving ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Salvando...</>
              ) : (
                <><Save className="h-4 w-4 mr-2" /> Salvar como Rascunho</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {reviewMode === "pedagogica" && <AtelieRevisao conteudoOriginal={fullContentForRevision} onRevised={handleRevised} />}
      {reviewMode === "etica" && <AtelieRevisaoEtica conteudoOriginal={fullContentForRevision} />}
    </div>
  );
}
