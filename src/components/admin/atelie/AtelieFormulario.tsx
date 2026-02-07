import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";
import { useAtelieTemplates, useGenerateContent, GenerateContentInput } from "@/hooks/useAtelieConteudo";

interface AtelieFormularioProps {
  onGenerated: (content: { raw_content: string; sections: Record<string, string>; input: GenerateContentInput }) => void;
}

const TOM_OPTIONS = [
  { value: "profundo e reflexivo", label: "Profundo e reflexivo" },
  { value: "acolhedor e didático", label: "Acolhedor e didático" },
  { value: "poético e evocativo", label: "Poético e evocativo" },
  { value: "direto e prático", label: "Direto e prático" },
  { value: "inspirador e transformador", label: "Inspirador e transformador" },
];

export default function AtelieFormulario({ onGenerated }: AtelieFormularioProps) {
  const { data: templates, isLoading: loadingTemplates } = useAtelieTemplates();
  const { generate, isGenerating } = useGenerateContent();

  const [formData, setFormData] = useState<GenerateContentInput>({
    jornada: "",
    portal: "",
    objetivo: "",
    ideias_chave: "",
    tom: "acolhedor e didático",
    duracao: "",
    template_id: undefined,
  });

  const handleChange = (field: keyof GenerateContentInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.jornada || !formData.portal || !formData.objetivo || !formData.ideias_chave || !formData.tom) {
      return;
    }

    const result = await generate(formData);
    if (result) {
      onGenerated({
        raw_content: result.raw_content,
        sections: result.sections,
        input: formData,
      });
    }
  };

  const defaultTemplate = templates?.find((t) => t.is_default);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-gold" />
          Gerar Novo Conteúdo
        </CardTitle>
        <CardDescription>
          Preencha os campos abaixo para gerar uma aula/portal completo usando IA
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Template Selection */}
          <div className="space-y-2">
            <Label htmlFor="template">Template</Label>
            <Select
              value={formData.template_id || defaultTemplate?.id || ""}
              onValueChange={(value) => handleChange("template_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingTemplates ? "Carregando..." : "Selecione um template"} />
              </SelectTrigger>
              <SelectContent>
                {templates?.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.nome} {template.is_default && "(Padrão)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Jornada */}
          <div className="space-y-2">
            <Label htmlFor="jornada">Jornada *</Label>
            <Input
              id="jornada"
              placeholder="Ex: Jornada da Heroína Interna"
              value={formData.jornada}
              onChange={(e) => handleChange("jornada", e.target.value)}
              required
            />
          </div>

          {/* Portal */}
          <div className="space-y-2">
            <Label htmlFor="portal">Portal *</Label>
            <Input
              id="portal"
              placeholder="Ex: Portal 3 — O Campo do Desconhecido"
              value={formData.portal}
              onChange={(e) => handleChange("portal", e.target.value)}
              required
            />
          </div>

          {/* Objetivo */}
          <div className="space-y-2">
            <Label htmlFor="objetivo">Objetivo do Portal *</Label>
            <Textarea
              id="objetivo"
              placeholder="Qual é o objetivo central deste portal? O que a aluna deve compreender ou integrar?"
              value={formData.objetivo}
              onChange={(e) => handleChange("objetivo", e.target.value)}
              rows={2}
              required
            />
          </div>

          {/* Ideias-chave */}
          <div className="space-y-2">
            <Label htmlFor="ideias_chave">Ideias-chave (matéria-prima autoral) *</Label>
            <Textarea
              id="ideias_chave"
              placeholder="Liste as ideias principais, conceitos, metáforas ou insights que devem ser trabalhados..."
              value={formData.ideias_chave}
              onChange={(e) => handleChange("ideias_chave", e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Tom */}
          <div className="space-y-2">
            <Label htmlFor="tom">Tom desejado *</Label>
            <Select value={formData.tom} onValueChange={(value) => handleChange("tom", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tom" />
              </SelectTrigger>
              <SelectContent>
                {TOM_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duração */}
          <div className="space-y-2">
            <Label htmlFor="duracao">Duração sugerida (opcional)</Label>
            <Input
              id="duracao"
              placeholder="Ex: 45 minutos, 1 hora, etc."
              value={formData.duracao}
              onChange={(e) => handleChange("duracao", e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isGenerating} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Gerando conteúdo...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar Aula no Template
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
