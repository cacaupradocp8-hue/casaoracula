import { useState, useEffect } from 'react';
import { FileText, Save, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSessionRoom } from '@/hooks/useSessionRoom';
import type { NarrativeMap, SessionScript, InterventionType } from '@/types/session-room';

interface SessionScriptTabProps {
  caseId: string;
  clientId: string;
  narrativeMap: NarrativeMap | null;
}

const INTERVENTION_TYPES: { value: InterventionType; label: string; description: string }[] = [
  { value: 'short_story', label: 'Conto Breve', description: 'Uma história curta que espelha o tema' },
  { value: 'metaphor', label: 'Metáfora', description: 'Uma imagem simbólica para reflexão' },
  { value: 'writing', label: 'Escrita Terapêutica', description: 'Exercício de escrita guiada' },
  { value: 'visualization', label: 'Visualização', description: 'Jornada imaginativa guiada' },
];

export function SessionScriptTab({ caseId, clientId, narrativeMap }: SessionScriptTabProps) {
  const { fetchSessionScript, saveSessionScript } = useSessionRoom();
  
  const [script, setScript] = useState<SessionScript | null>(null);
  const [formData, setFormData] = useState({
    opening_question: '',
    opening_gesture: '',
    exploration_questions: '',
    intervention_type: '' as InterventionType | '',
    intervention_prompt: '',
    closing_name: '',
    closing_seal: '',
    closing_leave_open: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadScript();
  }, [caseId]);

  useEffect(() => {
    if (script) {
      setFormData({
        opening_question: script.opening_question || '',
        opening_gesture: script.opening_gesture || '',
        exploration_questions: script.exploration_questions || '',
        intervention_type: (script.intervention_type as InterventionType) || '',
        intervention_prompt: script.intervention_prompt || '',
        closing_name: script.closing_name || '',
        closing_seal: script.closing_seal || '',
        closing_leave_open: script.closing_leave_open || '',
      });
    }
  }, [script]);

  const loadScript = async () => {
    const data = await fetchSessionScript(caseId);
    setScript(data);
  };

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const saved = await saveSessionScript(
      caseId,
      clientId,
      formData as Partial<SessionScript>,
      script?.id,
      narrativeMap?.id
    );
    if (saved) {
      setScript(saved);
    }
    setSaving(false);
  };

  // Suggestions based on narrative map
  const getSuggestions = () => {
    if (!narrativeMap) return null;
    
    return {
      opening: narrativeMap.layer7_invitation 
        ? `Baseado no convite: "${narrativeMap.layer7_invitation}"`
        : null,
      exploration: narrativeMap.layer6_pattern
        ? `Explorar o padrão: "${narrativeMap.layer6_pattern}"`
        : null,
      intervention: narrativeMap.layer4_archetype_main
        ? `Trabalhar com o arquétipo: ${narrativeMap.layer4_archetype_main}`
        : null,
    };
  };

  const suggestions = getSuggestions();

  return (
    <div className="space-y-6">
      {/* Ethical Warning */}
      <Alert className="bg-gold/10 border-gold/30">
        <AlertCircle className="w-4 h-4 text-gold" />
        <AlertDescription className="text-sm">
          <strong>Lembrete ético:</strong> Evite catarse forçada. O campo se abre no tempo dela.
        </AlertDescription>
      </Alert>

      {/* Movement 1: Opening */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-gold/20 text-gold text-sm flex items-center justify-center">1</span>
            Abertura Simbólica
          </CardTitle>
          <CardDescription>Uma pergunta + um gesto simples</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestions?.opening && (
            <p className="text-xs text-muted-foreground italic">{suggestions.opening}</p>
          )}
          <div className="space-y-2">
            <Label>Pergunta de Abertura</Label>
            <Textarea
              value={formData.opening_question}
              onChange={(e) => handleChange('opening_question', e.target.value)}
              placeholder="Ex: O que você trouxe hoje para olharmos juntas?"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Gesto Simples</Label>
            <Input
              value={formData.opening_gesture}
              onChange={(e) => handleChange('opening_gesture', e.target.value)}
              placeholder="Ex: Respire fundo e traga uma imagem..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Movement 2: Exploration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-sm flex items-center justify-center">2</span>
            Explorar o Núcleo
          </CardTitle>
          <CardDescription>1-2 perguntas para aprofundar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestions?.exploration && (
            <p className="text-xs text-muted-foreground italic">{suggestions.exploration}</p>
          )}
          <div className="space-y-2">
            <Label>Perguntas de Exploração</Label>
            <Textarea
              value={formData.exploration_questions}
              onChange={(e) => handleChange('exploration_questions', e.target.value)}
              placeholder="• Quando você sentiu isso pela primeira vez?&#10;• O que essa imagem te lembra?"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Movement 3: Intervention */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-sm flex items-center justify-center">3</span>
            Intervenção Narrativa
          </CardTitle>
          <CardDescription>Escolha um tipo + escreva o prompt</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestions?.intervention && (
            <p className="text-xs text-muted-foreground italic">{suggestions.intervention}</p>
          )}
          <div className="space-y-2">
            <Label>Tipo de Intervenção</Label>
            <Select
              value={formData.intervention_type}
              onValueChange={(v) => handleChange('intervention_type', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {INTERVENTION_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex flex-col">
                      <span>{type.label}</span>
                      <span className="text-xs text-muted-foreground">{type.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Prompt / Instrução</Label>
            <Textarea
              value={formData.intervention_prompt}
              onChange={(e) => handleChange('intervention_prompt', e.target.value)}
              placeholder="Escreva a instrução ou história que usará..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Movement 4: Closing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 text-sm flex items-center justify-center">4</span>
            Fechamento Ritual
          </CardTitle>
          <CardDescription>Nomear, selar, deixar aberto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nomear</Label>
            <Input
              value={formData.closing_name}
              onChange={(e) => handleChange('closing_name', e.target.value)}
              placeholder="Ex: O que você leva da sessão de hoje?"
            />
          </div>
          <div className="space-y-2">
            <Label>Selar</Label>
            <Input
              value={formData.closing_seal}
              onChange={(e) => handleChange('closing_seal', e.target.value)}
              placeholder="Ex: Um gesto para honrar o que se abriu..."
            />
          </div>
          <div className="space-y-2">
            <Label>Deixar Aberto</Label>
            <Input
              value={formData.closing_leave_open}
              onChange={(e) => handleChange('closing_leave_open', e.target.value)}
              placeholder="Ex: O que pode continuar trabalhando em você?"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button onClick={handleSave} disabled={saving} className="w-full">
        <Save className="w-4 h-4 mr-2" />
        Salvar Roteiro
      </Button>
    </div>
  );
}
