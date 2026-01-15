// ============================================
// ANCHORING INPUT BLOCK
// ============================================
// Block for integration and final reflection
// Creates power phrases and closing insights

import { useState } from 'react';
import { ContentBlock } from '@/types/modular';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Anchor, Sparkles, Save, Quote } from 'lucide-react';

export interface AnchoringInputContent {
  integrationPrompt?: string;
  integrationPlaceholder?: string;
  finalQuestion?: string;
  finalPlaceholder?: string;
  saveToRegistros?: boolean;
  generateAnchorPhrase?: boolean;
}

interface AnchoringInputBlockProps {
  block: ContentBlock;
  onSave?: (data: unknown) => void;
}

export function AnchoringInputBlock({ block, onSave }: AnchoringInputBlockProps) {
  const content = block.content as AnchoringInputContent;
  const [integrationText, setIntegrationText] = useState('');
  const [powerPhrase, setPowerPhrase] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    if (!integrationText && !powerPhrase) {
      toast.error('Escreva pelo menos uma reflexão ou frase de poder.');
      return;
    }

    setIsSaving(true);
    try {
      if (onSave) {
        await onSave({
          integrationText,
          powerPhrase,
          savedAt: new Date().toISOString(),
        });
      }
      setIsSaved(true);
      toast.success('Ancoragem salva com sucesso!');
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
          <Anchor className="w-5 h-5 text-gold" />
          <h3 className="text-xl font-semibold text-foreground">{block.titulo}</h3>
        </div>
      )}

      {/* Integration Prompt */}
      {content.integrationPrompt && (
        <div className="space-y-3">
          <p className="text-foreground/90 leading-relaxed">
            {content.integrationPrompt}
          </p>
          <Textarea
            value={integrationText}
            onChange={(e) => setIntegrationText(e.target.value)}
            placeholder={content.integrationPlaceholder || 'Escreva sua percepção...'}
            className="min-h-[120px] bg-card/50 border-border/50 focus:border-gold/50 resize-none"
          />
        </div>
      )}

      {/* Power Phrase */}
      {content.finalQuestion && (
        <div className="p-5 bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/30 rounded-lg space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold" />
            <span className="font-semibold text-gold">Frase de Poder</span>
          </div>
          <p className="text-foreground/80">{content.finalQuestion}</p>
          <div className="relative">
            <Quote className="absolute left-3 top-3 w-4 h-4 text-gold/50" />
            <Textarea
              value={powerPhrase}
              onChange={(e) => setPowerPhrase(e.target.value)}
              placeholder={content.finalPlaceholder || 'Sua frase de poder...'}
              className="min-h-[80px] pl-10 bg-background/50 border-gold/20 focus:border-gold/50 resize-none"
            />
          </div>
        </div>
      )}

      {/* Save Button */}
      {content.saveToRegistros && !isSaved && (
        <Button
          onClick={handleSave}
          disabled={isSaving || (!integrationText && !powerPhrase)}
          className="w-full bg-gold hover:bg-gold/90 text-background font-medium"
        >
          {isSaving ? (
            'Salvando...'
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Completar Ancoragem
            </>
          )}
        </Button>
      )}

      {/* Success State */}
      {isSaved && (
        <div className="p-6 bg-gold/10 border border-gold/30 rounded-lg text-center space-y-4">
          <div className="w-12 h-12 mx-auto bg-gold/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Ancoragem Completa
            </h4>
            <p className="text-sm text-muted-foreground">
              Sua reflexão foi registrada. Volte quando precisar se reconectar.
            </p>
          </div>
          {powerPhrase && (
            <div className="p-4 bg-background/50 rounded-lg border border-gold/20">
              <Quote className="w-4 h-4 text-gold/50 mb-2" />
              <p className="text-foreground italic">&ldquo;{powerPhrase}&rdquo;</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
