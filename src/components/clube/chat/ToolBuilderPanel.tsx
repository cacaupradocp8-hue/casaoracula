import { useState, useEffect } from 'react';
import { X, Save, Sparkles, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ToolDraft {
  tipo: string;
  titulo: string;
  conteudo: string;
  contexto_uso: string;
  limite_etico: string;
}

interface Props {
  tipo: string;
  content: string;
  onSave: (tool: ToolDraft) => void;
  onSaveDraft: (tool: ToolDraft) => void;
  onClose: () => void;
  isSaving?: boolean;
}

const TIPO_LABELS: Record<string, string> = {
  pergunta_clinica: 'Pergunta Clínica',
  exercicio_narrativo: 'Exercício Narrativo',
  mini_travessia: 'Mini Travessia',
};

function autoTitle(tipo: string, content: string): string {
  const first = content.split('\n').find(l => l.trim().length > 5)?.trim() || '';
  const prefix = TIPO_LABELS[tipo] || tipo;
  return `${prefix} — ${first.slice(0, 50)}${first.length > 50 ? '…' : ''}`;
}

export function ToolBuilderPanel({ tipo, content, onSave, onSaveDraft, onClose, isSaving }: Props) {
  const [draft, setDraft] = useState<ToolDraft>({
    tipo,
    titulo: autoTitle(tipo, content),
    conteudo: content,
    contexto_uso: '',
    limite_etico: '',
  });

  useEffect(() => {
    setDraft({
      tipo,
      titulo: autoTitle(tipo, content),
      conteudo: content,
      contexto_uso: '',
      limite_etico: '',
    });
  }, [tipo, content]);

  const update = (field: keyof ToolDraft, value: string) =>
    setDraft(prev => ({ ...prev, [field]: value }));

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2340]">
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[hsl(var(--gold))]" />
            Refinar ferramenta
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {TIPO_LABELS[tipo] || tipo}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Título</Label>
          <Input
            value={draft.titulo}
            onChange={e => update('titulo', e.target.value)}
            className="bg-[#13101C] border-[#2A2340] text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Conteúdo</Label>
          <Textarea
            value={draft.conteudo}
            onChange={e => update('conteudo', e.target.value)}
            className="bg-[#13101C] border-[#2A2340] text-sm min-h-[120px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Contexto de uso</Label>
          <Textarea
            value={draft.contexto_uso}
            onChange={e => update('contexto_uso', e.target.value)}
            placeholder="Quando usar isso em sessão?"
            className="bg-[#13101C] border-[#2A2340] text-sm min-h-[72px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Limite ético</Label>
          <Textarea
            value={draft.limite_etico}
            onChange={e => update('limite_etico', e.target.value)}
            placeholder="Quando NÃO usar isso?"
            className="bg-[#13101C] border-[#2A2340] text-sm min-h-[72px] resize-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-[#2A2340] px-5 py-4 space-y-2">
        <Button
          onClick={() => onSave(draft)}
          disabled={isSaving || !draft.conteudo.trim()}
          className="w-full bg-[hsl(var(--gold))] text-background hover:bg-[hsl(var(--gold))]/90 h-10"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar na Forja
        </Button>
        <Button
          variant="ghost"
          onClick={() => onSaveDraft(draft)}
          disabled={isSaving}
          className="w-full text-muted-foreground hover:text-foreground h-9 text-xs"
        >
          <FileText className="w-3.5 h-3.5 mr-1.5" />
          Salvar rascunho
        </Button>
      </div>
    </motion.div>
  );
}
