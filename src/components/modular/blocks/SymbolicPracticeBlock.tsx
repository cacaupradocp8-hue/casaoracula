// ============================================
// SYMBOLIC PRACTICE BLOCK
// ============================================
// Block for guiding simple symbolic practices
// Non-performative, presence-focused practices

import { useState } from 'react';
import { ContentBlock } from '@/types/modular';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Compass, Check, Save, ChevronRight } from 'lucide-react';
import DOMPurify from 'dompurify';

export interface SymbolicPracticeContent {
  description?: string;
  practiceSteps?: string[];
  closingNote?: string;
  saveToRegistros?: boolean;
}

interface SymbolicPracticeBlockProps {
  block: ContentBlock;
  onSave?: (data: unknown) => void;
}

export function SymbolicPracticeBlock({ block, onSave }: SymbolicPracticeBlockProps) {
  const content = block.content as SymbolicPracticeContent;
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [practiceNote, setPracticeNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const allStepsCompleted =
    content.practiceSteps &&
    completedSteps.length === content.practiceSteps.length;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave({
          completedSteps,
          practiceNote,
          completedAt: new Date().toISOString(),
        });
      }
      toast.success('Prática registrada.');
    } catch {
      toast.error('Erro ao salvar.');
    } finally {
      setIsSaving(false);
    }
  };

  const sanitizedDescription = content.description
    ? DOMPurify.sanitize(content.description)
    : '';

  return (
    <div className="animate-fade-in space-y-6">
      {/* Title */}
      {block.titulo && (
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-gold" />
          <h3 className="text-xl font-semibold text-foreground">{block.titulo}</h3>
        </div>
      )}

      {/* Description */}
      {sanitizedDescription && (
        <div
          className="prose prose-invert max-w-none text-foreground/80"
          dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
        />
      )}

      {/* Practice Steps */}
      {content.practiceSteps && content.practiceSteps.length > 0 && (
        <div className="space-y-3">
          {content.practiceSteps.map((step, index) => (
            <button
              key={index}
              onClick={() => toggleStep(index)}
              className={`w-full flex items-start gap-3 p-4 rounded-lg border transition-all text-left ${
                completedSteps.includes(index)
                  ? 'bg-gold/10 border-gold/30'
                  : 'bg-card/30 border-border/50 hover:border-gold/30'
              }`}
            >
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  completedSteps.includes(index)
                    ? 'bg-gold text-background'
                    : 'border-2 border-muted-foreground/50'
                }`}
              >
                {completedSteps.includes(index) ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                )}
              </div>
              <span
                className={`text-sm ${
                  completedSteps.includes(index)
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {step}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Closing Note */}
      {content.closingNote && (
        <p className="text-sm text-muted-foreground italic text-center py-2">
          {content.closingNote}
        </p>
      )}

      {/* Practice Note (shown after all steps completed) */}
      {allStepsCompleted && content.saveToRegistros && (
        <div className="space-y-4 p-4 bg-card/30 border border-gold/20 rounded-lg">
          <p className="text-sm text-foreground/80">
            Anote uma palavra ou sensação que ficou:
          </p>
          <Textarea
            value={practiceNote}
            onChange={(e) => setPracticeNote(e.target.value)}
            placeholder="Uma palavra, uma imagem, uma sensação..."
            className="min-h-[80px] bg-background/50 border-border/50 focus:border-gold/50 resize-none"
          />
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-gold/20 hover:bg-gold/30 text-gold border border-gold/30"
          >
            {isSaving ? (
              'Salvando...'
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Registrar Prática
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
