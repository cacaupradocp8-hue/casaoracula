import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, Users, Layers, Settings2 } from "lucide-react";
import { useAtelieTemplates, useGenerateContent, GenerateContentInput } from "@/hooks/useAtelieConteudo";
import {
  useJornadas,
  usePortaisByJornada,
  useAulasByPortal,
  ModoOperacao,
  MotorGeracao,
  NivelConteudo,
  AtelieInstitucionalInput,
} from "@/hooks/useAtelieInstitucional";

interface AtelieFormularioProps {
  onGenerated: (content: {
    raw_content: string;
    sections: Record<string, string>;
    input: GenerateContentInput;
    institucional: AtelieInstitucionalInput;
  }) => void;
}

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

const MODO_OPTIONS: { value: ModoOperacao; label: string; desc: string }[] = [
  { value: "criar_portal_aula", label: "Criar novo Portal + Aula", desc: "Cria portal e aula como rascunho" },
  { value: "criar_aula", label: "Nova Aula em Portal existente", desc: "Adiciona aula a um portal" },
  { value: "atualizar_aula", label: "Atualizar Aula existente", desc: "Sobrescreve conteúdo de uma aula" },
];

const MOTOR_OPTIONS: { value: MotorGeracao; label: string }[] = [
  { value: "padrao", label: "Padrão (Template atual)" },
  { value: "agente_casa_oracula", label: "Agente Casa Orácula (Andragogia + Missão)" },
];

const NIVEL_OPTIONS: { value: NivelConteudo; label: string }[] = [
  { value: "certificada", label: "Certificada (Método Casa Orácula)" },
  { value: "mentorada", label: "Mentorada (Arquitetura autoral)" },
];

export default function AtelieFormulario({ onGenerated }: AtelieFormularioProps) {
  const { data: templates, isLoading: loadingTemplates } = useAtelieTemplates();
  const { generate, isGenerating } = useGenerateContent();
  const { data: jornadas } = useJornadas();

  // Institutional fields
  const [jornadaId, setJornadaId] = useState("");
  const [portalId, setPortalId] = useState("");
  const [aulaId, setAulaId] = useState("");
  const [modo, setModo] = useState<ModoOperacao>("criar_portal_aula");
  const [motor, setMotor] = useState<MotorGeracao>("padrao");
  const [nivel, setNivel] = useState<NivelConteudo>("certificada");

  // Cascading queries
  const { data: portais } = usePortaisByJornada(jornadaId || undefined);
  const { data: aulas } = useAulasByPortal(portalId || undefined);

  // Content fields
  const [formData, setFormData] = useState<GenerateContentInput>({
    jornada: "",
    portal: "",
    objetivo: "",
    ideias_chave: "",
    tom: "acolhedor e didático",
    duracao: "",
    template_id: undefined,
  });

  // Sync jornada name when selection changes
  useEffect(() => {
    if (jornadaId && jornadas) {
      const j = jornadas.find((j) => j.id === jornadaId);
      if (j) setFormData((prev) => ({ ...prev, jornada: j.nome }));
    }
  }, [jornadaId, jornadas]);

  // Reset dependent selects on parent change
  useEffect(() => { setPortalId(""); setAulaId(""); }, [jornadaId]);
  useEffect(() => { setAulaId(""); }, [portalId]);

  const handleChange = (field: keyof GenerateContentInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    if (!jornadaId || !formData.portal || !formData.objetivo || !formData.ideias_chave || !formData.tom) return false;
    if (modo === "criar_aula" && !portalId) return false;
    if (modo === "atualizar_aula" && (!portalId || !aulaId)) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    const result = await generate(formData);
    if (result) {
      const institucional: AtelieInstitucionalInput = {
        jornada_id: jornadaId,
        portal_id: portalId || undefined,
        aula_id: aulaId || undefined,
        modo,
        motor,
        nivel,
        titulo_portal: formData.portal,
        objetivo: formData.objetivo,
        ideias_chave: formData.ideias_chave,
        tom: formData.tom,
        duracao: formData.duracao,
        template_id: formData.template_id,
      };

      onGenerated({
        raw_content: result.raw_content,
        sections: result.sections,
        input: formData,
        institucional,
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
          Gerador institucional conectado a Jornadas, Portais, Aulas e Missões
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* BLOCO 1 — Identificação Estrutural */}
          <div className="space-y-4 p-4 border border-border/50 rounded-lg bg-muted/20">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Identificação Estrutural
            </h3>

            {/* Jornada (do banco) */}
            <div className="space-y-2">
              <Label>Jornada *</Label>
              <Select value={jornadaId} onValueChange={setJornadaId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a jornada" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  {jornadas?.map((j) => (
                    <SelectItem key={j.id} value={j.id}>{j.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Portal existente (cascaded) */}
            {(modo === "criar_aula" || modo === "atualizar_aula") && (
              <div className="space-y-2">
                <Label>Portal/Travessia *</Label>
                <Select value={portalId} onValueChange={setPortalId} disabled={!jornadaId}>
                  <SelectTrigger>
                    <SelectValue placeholder={!jornadaId ? "Selecione uma jornada primeiro" : "Selecione o portal"} />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50">
                    {portais?.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.titulo} <span className="text-muted-foreground ml-1">({p.status})</span>
                      </SelectItem>
                    ))}
                    {portais?.length === 0 && (
                      <div className="px-3 py-2 text-sm text-muted-foreground">Nenhum portal nesta jornada</div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Aula existente (cascaded) */}
            {modo === "atualizar_aula" && (
              <div className="space-y-2">
                <Label>Aula *</Label>
                <Select value={aulaId} onValueChange={setAulaId} disabled={!portalId}>
                  <SelectTrigger>
                    <SelectValue placeholder={!portalId ? "Selecione um portal primeiro" : "Selecione a aula"} />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50">
                    {aulas?.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.titulo} <span className="text-muted-foreground ml-1">({a.status})</span>
                      </SelectItem>
                    ))}
                    {aulas?.length === 0 && (
                      <div className="px-3 py-2 text-sm text-muted-foreground">Nenhuma aula neste portal</div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* BLOCO 2 — Modo de Operação + Motor + Nível */}
          <div className="space-y-4 p-4 border border-border/50 rounded-lg bg-muted/20">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Configuração de Geração
            </h3>

            <div className="grid gap-4 sm:grid-cols-3">
              {/* Modo */}
              <div className="space-y-2">
                <Label>Modo de operação *</Label>
                <Select value={modo} onValueChange={(v) => setModo(v as ModoOperacao)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50">
                    {MODO_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        <div>
                          <div>{o.label}</div>
                          <span className="text-xs text-muted-foreground ml-1">— {o.desc}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Motor */}
              <div className="space-y-2">
                <Label>Motor de geração</Label>
                <Select value={motor} onValueChange={(v) => setMotor(v as MotorGeracao)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50">
                    {MOTOR_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Nível */}
              <div className="space-y-2">
                <Label>Nível do conteúdo</Label>
                <Select value={nivel} onValueChange={(v) => setNivel(v as NivelConteudo)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50">
                    {NIVEL_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* BLOCO 3 — Nome e Intenção */}
          <div className="space-y-4 p-4 border border-border/50 rounded-lg bg-muted/20">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              🎯 Intenção Pedagógica
            </h3>

            <div className="space-y-2">
              <Label>Nome do Portal / Aula *</Label>
              <Input
                placeholder="Ex: O Encontro com a Sombra"
                value={formData.portal}
                onChange={(e) => handleChange("portal", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Objetivo *</Label>
              <Textarea
                placeholder="O que esta aula precisa desenvolver na aluna?"
                value={formData.objetivo}
                onChange={(e) => handleChange("objetivo", e.target.value)}
                rows={3}
                required
              />
            </div>

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

          {/* BLOCO 4 — Matéria-Prima */}
          <div className="space-y-4 p-4 border border-border/50 rounded-lg bg-muted/20">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              🧠 Matéria-Prima Autoral
            </h3>
            <div className="space-y-2">
              <Label>Ideias-chave (matéria bruta) *</Label>
              <p className="text-xs text-muted-foreground mb-2">
                • Que imagem você quer que fique?<br/>
                • Que comportamento quer transformar?<br/>
                • Que tensão psíquica está em jogo?<br/>
                • Que risco ético existe?
              </p>
              <Textarea
                placeholder="Escreva aqui sua autoria crua — conceitos, metáforas, insights..."
                value={formData.ideias_chave}
                onChange={(e) => handleChange("ideias_chave", e.target.value)}
                rows={5}
                required
              />
            </div>
          </div>

          {/* BLOCO 5 — Tom e Ritmo */}
          <div className="space-y-4 p-4 border border-border/50 rounded-lg bg-muted/20">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              🎭 Tom e Ritmo
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tom *</Label>
                <Select value={formData.tom} onValueChange={(v) => handleChange("tom", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50">
                    {TOM_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Duração sugerida</Label>
                <Select value={formData.duracao} onValueChange={(v) => handleChange("duracao", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50">
                    {DURACAO_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Template (avançado) */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs">Template (avançado)</Label>
            <Select
              value={formData.template_id || defaultTemplate?.id || ""}
              onValueChange={(v) => handleChange("template_id", v)}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder={loadingTemplates ? "Carregando..." : "Template padrão"} />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-50">
                {templates?.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name} {t.is_default && "(Padrão)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Botão */}
          <Button type="submit" disabled={isGenerating || !isFormValid()} className="w-full" size="lg">
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Gerando conteúdo...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                {motor === "agente_casa_oracula" ? "Gerar com Agente Casa Orácula" : "Gerar Aula no Template"}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
