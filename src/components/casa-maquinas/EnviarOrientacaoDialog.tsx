import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, Send, Loader2, BookOpen, Headphones, Sparkles, MapPin, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const TIPOS = [
  { key: 'pratica', label: 'Prática', icon: BookOpen, desc: 'Exercício ou prática sugerida' },
  { key: 'escuta', label: 'Escuta', icon: Headphones, desc: 'Áudio ou escuta recomendada' },
  { key: 'reflexao', label: 'Reflexão', icon: Sparkles, desc: 'Pergunta ou reflexão guiada' },
  { key: 'territorio', label: 'Território', icon: MapPin, desc: 'Território em foco' },
  { key: 'foco_semana', label: 'Foco da Semana', icon: Target, desc: 'Orientação semanal' },
] as const;

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (data: { tipo: string; titulo?: string; mensagem: string }) => Promise<boolean>;
  saving: boolean;
}

export function EnviarOrientacaoDialog({ open, onOpenChange, onSubmit, saving }: Props) {
  const [tipo, setTipo] = useState('reflexao');
  const [titulo, setTitulo] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async () => {
    if (!mensagem.trim()) return;
    const ok = await onSubmit({ tipo, titulo: titulo.trim() || undefined, mensagem: mensagem.trim() });
    if (ok) {
      setTipo('reflexao');
      setTitulo('');
      setMensagem('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm">
            <Leaf className="w-4 h-4 text-emerald-500" />
            Enviar Orientação ao Jardim
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Type selection */}
          <div className="grid grid-cols-2 gap-2">
            {TIPOS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTipo(key)}
                className={cn(
                  "flex items-center gap-2 p-2.5 rounded-lg text-xs transition-all border",
                  tipo === key
                    ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                    : "bg-card/50 border-border/20 text-muted-foreground hover:border-border/40"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          <div>
            <Label className="text-xs">Título (opcional)</Label>
            <Input
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              placeholder="Ex: Prática da semana"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs">Mensagem para a cliente</Label>
            <Textarea
              value={mensagem}
              onChange={e => setMensagem(e.target.value)}
              placeholder="O que você gostaria que ela observasse, praticasse ou refletisse..."
              className="mt-1 min-h-[100px] resize-none"
              maxLength={1000}
            />
            <p className="text-[10px] text-muted-foreground mt-1">{mensagem.length}/1000</p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={saving || !mensagem.trim()}
            className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Enviar ao Jardim
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
