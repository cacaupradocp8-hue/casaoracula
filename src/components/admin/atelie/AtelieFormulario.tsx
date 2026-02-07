import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, Users } from "lucide-react";
import { useAtelieTemplates, useGenerateContent, GenerateContentInput } from "@/hooks/useAtelieConteudo";

interface AtelieFormularioProps {
  onGenerated: (content: { raw_content: string; sections: Record<string, string>; input: GenerateContentInput }) => void;
}

const JORNADA_OPTIONS = [
  { value: "Jornada da Heroína", label: "Jornada da Heroína" },
  { value: "Jornada da Sombra", label: "Jornada da Sombra" },
  { value: "Jornada do Instinto", label: "Jornada do Instinto" },
  { value: "Jornada do Corpo", label: "Jornada do Corpo" },
];

const TOM_OPTIONS = [
  { value: "simbólico e poético", label: "Mais simbólico / poético" },
  { value: "acolhedor e didático", label: "Equilibrado (padrão Casa Orácula)" },
  { value: "direto e clínico", label: "Mais direto / clínico" },
];

const DURACAO_OPTIONS = [
  { value: "20-30 minutos", label: "20–30 minutos" },
  { value: "30-45 minutos", label: "30–45 minutos" },
  { value: "45-60 minutos", label: "45–60 minutos" },
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
          Ateliê de Conteúdo — Casa Orácula
        </CardTitle>
        <CardDescription>
          Desenvolva aulas, portais e jornadas dentro do Método Formativo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* BLOCO 1 — Identificação da Jornada */}
          <div className="space-y-4 p-4 border border-border/50 rounded-lg bg-muted/20">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              🔮 Identificação da Jornada
            </h3>
            
            {/* Jornada - Select */}
            <div className="space-y-2">
              <Label htmlFor="jornada">Jornada *</Label>
              <Select 
                value={formData.jornada} 
                onValueChange={(value) => handleChange("jornada", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a jornada" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  {JORNADA_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Portal */}
            <div className="space-y-2">
              <Label htmlFor="portal">Nome do Portal / Aula *</Label>
              <Input
                id="portal"
                placeholder="Ex: O Encontro com a Sombra"
                value={formData.portal}
                onChange={(e) => handleChange("portal", e.target.value)}
                required
              />
            </div>
          </div>

          {/* BLOCO 2 — Intenção Pedagógica */}
          <div className="space-y-4 p-4 border border-border/50 rounded-lg bg-muted/20">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              🎯 Intenção Pedagógica
            </h3>
            
            {/* Objetivo */}
            <div className="space-y-2">
              <Label htmlFor="objetivo">Objetivo do Portal *</Label>
              <Textarea
                id="objetivo"
                placeholder="O que esta aula precisa desenvolver na aluna? (habilidade, consciência, aplicação)"
                value={formData.objetivo}
                onChange={(e) => handleChange("objetivo", e.target.value)}
                rows={3}
                required
              />
            </div>

            {/* Público - Texto fixo */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Público
              </Label>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md border border-border/30">
                Terapeutas, psicólogas, mentoras do feminino, facilitadoras de círculos e buscadoras
              </p>
            </div>
          </div>

          {/* BLOCO 3 — Matéria-Prima Autoral */}
          <div className="space-y-4 p-4 border border-border/50 rounded-lg bg-muted/20">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              🧠 Matéria-Prima Autoral
            </h3>
            
            {/* Ideias-chave */}
            <div className="space-y-2">
              <Label htmlFor="ideias_chave">Ideias-chave (matéria bruta) *</Label>
              <p className="text-xs text-muted-foreground mb-2">
                • Que imagem você quer que fique?<br/>
                • Que comportamento quer transformar?<br/>
                • Que tensão psíquica está em jogo?<br/>
                • Que risco ético existe?
              </p>
              <Textarea
                id="ideias_chave"
                placeholder="Escreva aqui sua autoria crua — conceitos, metáforas, insights..."
                value={formData.ideias_chave}
                onChange={(e) => handleChange("ideias_chave", e.target.value)}
                rows={5}
                required
              />
            </div>
          </div>

          {/* BLOCO 4 — Tom e Ritmo */}
          <div className="space-y-4 p-4 border border-border/50 rounded-lg bg-muted/20">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              🎭 Tom e Ritmo
            </h3>
            
            {/* Tom */}
            <div className="space-y-2">
              <Label htmlFor="tom">Tom do conteúdo *</Label>
              <Select value={formData.tom} onValueChange={(value) => handleChange("tom", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tom" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
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
              <Label htmlFor="duracao">Duração sugerida da aula</Label>
              <Select 
                value={formData.duracao} 
                onValueChange={(value) => handleChange("duracao", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a duração" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  {DURACAO_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Template Selection (opcional - avançado) */}
          <div className="space-y-2">
            <Label htmlFor="template" className="text-muted-foreground text-xs">Template (avançado)</Label>
            <Select
              value={formData.template_id || defaultTemplate?.id || ""}
              onValueChange={(value) => handleChange("template_id", value)}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder={loadingTemplates ? "Carregando..." : "Template padrão"} />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-50">
                {templates?.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name} {template.is_default && "(Padrão)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* BLOCO 5 — Botão de Ação */}
          <Button type="submit" disabled={isGenerating} className="w-full" size="lg">
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Gerando conteúdo...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar Aula no Template da Casa Orácula
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
