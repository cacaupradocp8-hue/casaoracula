import { useState } from 'react';
import { ContentBlock, PatternDiaryContent } from '@/types/modular';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BookOpen, Sparkles, Loader2 } from 'lucide-react';

interface PatternDiaryBlockProps {
  block: ContentBlock;
  onSave?: (data: Record<string, string>) => void;
  onAIReflection?: (data: Record<string, string>) => Promise<string>;
}

const DEFAULT_FIELDS = [
  { key: 'gatilho', label: 'Gatilho', placeholder: 'O que disparou esse padrão?', type: 'textarea' as const },
  { key: 'emocao', label: 'Emoção', placeholder: 'O que você sentiu?', type: 'textarea' as const },
  { key: 'resposta', label: 'Resposta Desejada', placeholder: 'Como gostaria de responder da próxima vez?', type: 'textarea' as const },
];

export function PatternDiaryBlock({ block, onSave, onAIReflection }: PatternDiaryBlockProps) {
  const content = block.content as PatternDiaryContent;
  const fields = content.fields || DEFAULT_FIELDS;
  
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    fields.forEach(f => { initial[f.key] = ''; });
    return initial;
  });
  const [aiReflection, setAiReflection] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const updateField = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleAIReflection = async () => {
    if (!onAIReflection) return;
    setIsLoadingAI(true);
    try {
      const reflection = await onAIReflection(formData);
      setAiReflection(reflection);
    } catch (error) {
      console.error('Error getting AI reflection:', error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
  };

  const hasContent = Object.values(formData).some(v => v.trim().length > 0);

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-gold" />
          {block.titulo || 'Diário de Padrões'}
        </CardTitle>
        {block.descricao && (
          <p className="text-sm text-muted-foreground">{block.descricao}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dynamic Fields */}
        {fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key} className="text-sm font-medium">
              {field.label}
            </Label>
            
            {field.type === 'textarea' ? (
              <Textarea
                id={field.key}
                placeholder={field.placeholder}
                value={formData[field.key] || ''}
                onChange={(e) => updateField(field.key, e.target.value)}
                className="min-h-[100px] bg-background/50"
              />
            ) : field.type === 'select' && field.options ? (
              <Select
                value={formData[field.key] || ''}
                onValueChange={(value) => updateField(field.key, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={field.placeholder || 'Selecione...'} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id={field.key}
                type="text"
                placeholder={field.placeholder}
                value={formData[field.key] || ''}
                onChange={(e) => updateField(field.key, e.target.value)}
                className="bg-background/50"
              />
            )}
          </div>
        ))}

        {/* AI Reflection */}
        {content.showAIReflection && onAIReflection && hasContent && (
          <div className="pt-4 border-t border-border/30">
            <Button
              variant="outline"
              onClick={handleAIReflection}
              disabled={isLoadingAI}
              className="w-full border-gold/30 hover:border-gold/50"
            >
              {isLoadingAI ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Gerando reflexão...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2 text-gold" />
                  Gerar Reflexão com IA
                </>
              )}
            </Button>

            {aiReflection && (
              <div className="mt-4 p-4 rounded-lg bg-gold/5 border border-gold/20">
                <h4 className="text-sm font-medium text-gold mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Reflexão
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {aiReflection}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Save Button */}
        {content.saveToRegistros && onSave && (
          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSave} 
              disabled={!hasContent}
              className="bg-gold hover:bg-gold/90 text-background"
            >
              Salvar Registro
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
