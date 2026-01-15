// ============================================
// GUIDED WRITING BLOCK
// ============================================
// Block for symbolic naming and reflective writing
// Used in formation tools for personal exploration

import { useState } from 'react';
import { ContentBlock } from '@/types/modular';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { PenLine, Sparkles, Save } from 'lucide-react';

export interface GuidedWritingContent {
  prompt?: string;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  anchorSentence?: string;
  anchorPlaceholder?: string;
  saveToRegistros?: boolean;
}

interface GuidedWritingBlockProps {
  block: ContentBlock;
  onSave?: (data: unknown) => void;
}

export function GuidedWritingBlock({ block, onSave }: GuidedWritingBlockProps) {
  const content = block.content as GuidedWritingContent;
  const [mainText, setMainText] = useState('');
  const [anchorText, setAnchorText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (content.minLength && mainText.length < content.minLength) {
      toast.error(`Escreva pelo menos ${content.minLength} caracteres.`);
      return;
    }

    setIsSaving(true);
    try {
      if (onSave) {
        await onSave({
          mainText,
          anchorText,
          savedAt: new Date().toISOString(),
        });
      }
      toast.success('Sua reflexão foi salva.');
    } catch {
      toast.error('Erro ao salvar.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Title */}
      {block.titulo && (
        <div className="flex items-center gap-2">
          <PenLine className="w-5 h-5 text-gold" />
          <h3 className="text-xl font-semibold text-foreground">{block.titulo}</h3>
        </div>
      )}

      {/* Main Prompt */}
      {content.prompt && (
        <p className="text-lg text-foreground/90 leading-relaxed">
          {content.prompt}
        </p>
      )}

      {/* Main Writing Area */}
      <div className="space-y-2">
        <Textarea
          value={mainText}
          onChange={(e) => setMainText(e.target.value.slice(0, content.maxLength || 500))}
          placeholder={content.placeholder || 'Escreva sua reflexão...'}
          className="min-h-[150px] bg-card/50 border-border/50 focus:border-gold/50 resize-none"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {content.minLength && mainText.length < content.minLength
              ? `Mínimo: ${content.minLength} caracteres`
              : ''}
          </span>
          <span>
            {mainText.length}/{content.maxLength || 500}
          </span>
        </div>
      </div>

      {/* Anchor Sentence */}
      {content.anchorSentence && (
        <div className="p-4 bg-gold/5 border border-gold/20 rounded-lg space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-gold">Frase de Ancoragem</span>
          </div>
          <p className="text-foreground/80">{content.anchorSentence}</p>
          <Input
            value={anchorText}
            onChange={(e) => setAnchorText(e.target.value)}
            placeholder={content.anchorPlaceholder || 'Sua frase de ancoragem...'}
            className="bg-card/50 border-border/50 focus:border-gold/50"
          />
        </div>
      )}

      {/* Save Button */}
      {content.saveToRegistros && (
        <Button
          onClick={handleSave}
          disabled={isSaving || (content.minLength && mainText.length < content.minLength)}
          className="w-full bg-gold/20 hover:bg-gold/30 text-gold border border-gold/30"
        >
          {isSaving ? (
            'Salvando...'
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Salvar Reflexão
            </>
          )}
        </Button>
      )}
    </div>
  );
}
