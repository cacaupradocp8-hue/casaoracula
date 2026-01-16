import { useState, useEffect } from 'react';
import { X, Tag, Palette } from 'lucide-react';
import { MindMapNode, NODE_COLORS } from '@/types/mindmap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface MindMapSidePanelProps {
  node: MindMapNode | null;
  onClose: () => void;
  onUpdate: (updates: Partial<MindMapNode>) => void;
}

export function MindMapSidePanel({ node, onClose, onUpdate }: MindMapSidePanelProps) {
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  useEffect(() => {
    if (node) {
      setNotes(node.notes || '');
      setTagsInput(node.tags?.join(', ') || '');
      setSelectedColor(node.color);
    }
  }, [node?.id]);

  if (!node) return null;

  const handleNotesChange = (value: string) => {
    setNotes(value);
  };

  const handleNotesBlur = () => {
    onUpdate({ notes: notes || null });
  };

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
  };

  const handleTagsBlur = () => {
    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
    onUpdate({ tags: tags.length > 0 ? tags : null });
  };

  const handleColorSelect = (color: string | null) => {
    setSelectedColor(color);
    onUpdate({ color });
  };

  return (
    <div className="w-80 border-l bg-card flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-medium truncate">{node.title}</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Notes */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Notas
          </Label>
          <Textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            onBlur={handleNotesBlur}
            placeholder="Adicione observações..."
            rows={5}
            className="resize-none"
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Tags
          </Label>
          <Input
            value={tagsInput}
            onChange={(e) => handleTagsChange(e.target.value)}
            onBlur={handleTagsBlur}
            placeholder="tag1, tag2, tag3..."
          />
          <p className="text-xs text-muted-foreground">
            Separe as tags por vírgula
          </p>
        </div>

        {/* Color */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Cor
          </Label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleColorSelect(null)}
              className={cn(
                "w-8 h-8 rounded-full border-2 transition-all",
                "bg-card hover:scale-110",
                selectedColor === null
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border"
              )}
              title="Sem cor"
            />
            {NODE_COLORS.map(color => (
              <button
                key={color.value}
                onClick={() => handleColorSelect(color.value)}
                className={cn(
                  "w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
                  selectedColor === color.value
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent"
                )}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Keyboard shortcuts help */}
      <div className="p-4 border-t bg-muted/30">
        <p className="text-xs text-muted-foreground font-medium mb-2">Atalhos:</p>
        <div className="text-xs text-muted-foreground space-y-1">
          <div><kbd className="px-1 bg-muted rounded">Enter</kbd> Adicionar filho</div>
          <div><kbd className="px-1 bg-muted rounded">Tab</kbd> Adicionar irmão</div>
          <div><kbd className="px-1 bg-muted rounded">Delete</kbd> Excluir nó</div>
        </div>
      </div>
    </div>
  );
}
