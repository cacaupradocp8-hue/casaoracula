import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Save, Check, Layers } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { useSessionRoom } from '@/hooks/useSessionRoom';
import { LAYER_CONFIG, type NarrativeMap } from '@/types/session-room';

interface SevenLayersTabProps {
  caseId: string;
  clientId: string;
  narrativeMap: NarrativeMap | null;
  onUpdate: (map: NarrativeMap) => void;
}

export function SevenLayersTab({ caseId, clientId, narrativeMap, onUpdate }: SevenLayersTabProps) {
  const { saveNarrativeMap } = useSessionRoom();
  
  const [currentLayer, setCurrentLayer] = useState(0);
  const [formData, setFormData] = useState<Record<string, string | number | null>>({});
  const [saving, setSaving] = useState(false);
  const [completedLayers, setCompletedLayers] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (narrativeMap) {
      // Load existing data
      const data: Record<string, string | number | null> = {};
      Object.keys(narrativeMap).forEach((key) => {
        if (key.startsWith('layer')) {
          data[key] = (narrativeMap as any)[key];
        }
      });
      setFormData(data);
      
      // Calculate completed layers
      const completed = new Set<number>();
      LAYER_CONFIG.forEach((layer, index) => {
        const requiredFields = layer.fields.filter(f => !(f as any).optional);
        const allFilled = requiredFields.every(f => {
          const value = data[f.key];
          return value !== null && value !== undefined && value !== '';
        });
        if (allFilled) completed.add(index);
      });
      setCompletedLayers(completed);
    }
  }, [narrativeMap]);

  const handleFieldChange = (key: string, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveLayer = async () => {
    setSaving(true);
    
    // Generate summaries if on last layer
    let summaries = {};
    if (currentLayer === LAYER_CONFIG.length - 1) {
      summaries = generateSummaries(formData);
    }
    
    const saved = await saveNarrativeMap(
      caseId,
      clientId,
      { ...formData, ...summaries },
      narrativeMap?.id
    );
    
    if (saved) {
      onUpdate(saved);
      setCompletedLayers((prev) => new Set([...prev, currentLayer]));
    }
    setSaving(false);
  };

  const generateSummaries = (data: Record<string, string | number | null>) => {
    // Structured summary (no interpretation, just organization)
    const core = [
      data.layer1_fact_event,
      data.layer2_emotion_main ? `Emoção: ${data.layer2_emotion_main}` : null,
      data.layer3_scene ? `Imagem: ${data.layer3_scene}` : null,
    ].filter(Boolean).join(' | ');

    const archetype = [
      data.layer4_archetype_main,
      data.layer4_protects ? `Protege: ${data.layer4_protects}` : null,
      data.layer5_prohibition ? `Silencia: ${data.layer5_prohibition}` : null,
    ].filter(Boolean).join(' | ');

    const repetition = [
      data.layer6_pattern,
      data.layer6_current_repeat ? `Hoje: ${data.layer6_current_repeat}` : null,
    ].filter(Boolean).join(' | ');

    const invitation = [
      data.layer7_invitation,
      data.layer7_small_gesture ? `Gesto: ${data.layer7_small_gesture}` : null,
    ].filter(Boolean).join(' | ');

    return {
      summary_core: core || null,
      summary_archetype: archetype || null,
      summary_repetition: repetition || null,
      summary_invitation: invitation || null,
    };
  };

  const currentConfig = LAYER_CONFIG[currentLayer];
  const progress = ((currentLayer + 1) / LAYER_CONFIG.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Camada {currentLayer + 1} de {LAYER_CONFIG.length}</span>
          <div className="flex gap-1">
            {LAYER_CONFIG.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentLayer(index)}
                className={`w-6 h-6 rounded-full text-xs flex items-center justify-center transition-colors ${
                  index === currentLayer
                    ? 'bg-gold text-white'
                    : completedLayers.has(index)
                    ? 'bg-green-500/20 text-green-500'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {completedLayers.has(index) ? <Check className="w-3 h-3" /> : index + 1}
              </button>
            ))}
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Current Layer Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
              <Layers className="w-4 h-4 text-gold" />
            </div>
            <div>
              <CardTitle className="text-lg">{currentConfig.title}</CardTitle>
              <CardDescription>{currentConfig.subtitle}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentConfig.fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label className="flex items-center gap-2">
                {field.label}
                {field.optional && (
                  <span className="text-xs text-muted-foreground">(opcional)</span>
                )}
              </Label>
              
              {field.type === 'slider' ? (
                <div className="space-y-2">
                  <Slider
                    value={[typeof formData[field.key] === 'number' ? formData[field.key] as number : 5]}
                    min={0}
                    max={10}
                    step={1}
                    onValueChange={([v]) => handleFieldChange(field.key, v)}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0 (Baixa)</span>
                    <span className="font-medium text-foreground">
                      {formData[field.key] ?? 5}
                    </span>
                    <span>10 (Alta)</span>
                  </div>
                </div>
              ) : field.maxLength && field.maxLength > 100 ? (
                <div className="space-y-1">
                  <Textarea
                    value={(formData[field.key] as string) || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                    rows={3}
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {((formData[field.key] as string) || '').length}/{field.maxLength}
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <Input
                    value={(formData[field.key] as string) || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                  />
                  {field.maxLength && (
                    <div className="text-xs text-muted-foreground text-right">
                      {((formData[field.key] as string) || '').length}/{field.maxLength}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentLayer((prev) => Math.max(0, prev - 1))}
          disabled={currentLayer === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>

        <Button onClick={handleSaveLayer} disabled={saving} variant="secondary">
          <Save className="w-4 h-4 mr-2" />
          Salvar Camada
        </Button>

        <Button
          onClick={() => setCurrentLayer((prev) => Math.min(LAYER_CONFIG.length - 1, prev + 1))}
          disabled={currentLayer === LAYER_CONFIG.length - 1}
        >
          Próxima
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
