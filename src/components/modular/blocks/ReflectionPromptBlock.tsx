import { useState } from 'react';
import { ContentBlock, ReflectionPromptContent } from '@/types/modular';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Sparkles, Loader2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReflectionPromptBlockProps {
  block: ContentBlock;
  onSave?: (data: { reflection: string; aiResponse?: string }) => void;
  onAIResponse?: (reflection: string) => Promise<string>;
}

export function ReflectionPromptBlock({ block, onSave, onAIResponse }: ReflectionPromptBlockProps) {
  const content = block.content as ReflectionPromptContent;
  const [reflection, setReflection] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const minLength = content.minLength || 0;
  const maxLength = content.maxLength || 2000;
  const isValid = reflection.length >= minLength && reflection.length <= maxLength;

  const handleSubmit = async () => {
    if (!isValid) return;

    if (content.showAIResponse && onAIResponse) {
      setIsLoadingAI(true);
      try {
        const response = await onAIResponse(reflection);
        setAiResponse(response);
      } catch (error) {
        console.error('Error getting AI response:', error);
      } finally {
        setIsLoadingAI(false);
      }
    }

    if (onSave) {
      onSave({ reflection, aiResponse: aiResponse || undefined });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-gold" />
          {block.titulo || 'Reflexão'}
        </CardTitle>
        {block.descricao && (
          <p className="text-sm text-muted-foreground">{block.descricao}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Prompt */}
        {content.prompt && (
          <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
            <p className="text-muted-foreground italic leading-relaxed">
              "{content.prompt}"
            </p>
          </div>
        )}

        {/* Reflection Input */}
        <div className="space-y-2">
          <Textarea
            placeholder={content.placeholder || 'Escreva sua reflexão...'}
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            className={cn(
              "min-h-[150px] bg-background/50 transition-all",
              reflection.length > 0 && !isValid && "border-destructive"
            )}
            maxLength={maxLength}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {minLength > 0 && reflection.length < minLength
                ? `Mínimo ${minLength} caracteres`
                : ''}
            </span>
            <span className={cn(
              reflection.length > maxLength * 0.9 && "text-amber-400"
            )}>
              {reflection.length}/{maxLength}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isLoadingAI}
            className={cn(
              "transition-all",
              isSaved 
                ? "bg-emerald-500 hover:bg-emerald-600" 
                : "bg-gold hover:bg-gold/90 text-background"
            )}
          >
            {isLoadingAI ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : isSaved ? (
              'Salvo!'
            ) : content.showAIResponse ? (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Enviar e Refletir
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Salvar
              </>
            )}
          </Button>
        </div>

        {/* AI Response */}
        {aiResponse && (
          <div className="p-4 rounded-lg bg-gold/5 border border-gold/20 space-y-3">
            <h4 className="text-sm font-medium text-gold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Resposta
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {aiResponse}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
