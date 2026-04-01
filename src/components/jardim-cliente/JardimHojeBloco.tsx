import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sparkles, Heart, Moon, PenLine, Eye, Lock, Send, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const TIPOS = [
  { key: 'reflexao', label: 'Reflexão', icon: Sparkles, placeholder: 'O que surgiu em mim...' },
  { key: 'sensacao', label: 'Sensação', icon: Heart, placeholder: 'O que estou sentindo...' },
  { key: 'sonho', label: 'Sonho', icon: Moon, placeholder: 'Sonhei que...' },
  { key: 'anotacao', label: 'Anotação', icon: PenLine, placeholder: 'Algo que quero guardar...' },
] as const;

interface Props {
  saving: boolean;
  onCriar: (content: string, type: string, shared: boolean) => Promise<boolean>;
}

export function JardimHojeBloco({ saving, onCriar }: Props) {
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState('reflexao');
  const [content, setContent] = useState('');
  const [shared, setShared] = useState(false);

  const tipoAtual = TIPOS.find((t) => t.key === tipo) || TIPOS[0];

  const handleSubmit = async () => {
    if (!content.trim()) return;
    const ok = await onCriar(content.trim(), tipo, shared);
    if (ok) {
      toast.success('🌿 Registro guardado');
      setContent('');
      setShared(false);
      setOpen(false);
    }
  };

  if (!open) {
    return (
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50 text-center">
          Seu Jardim hoje
        </p>
        <div className="grid grid-cols-2 gap-2">
          {TIPOS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setTipo(key); setOpen(true); }}
              className="flex items-center gap-2 p-3 rounded-xl border border-border/20 bg-card/50 hover:bg-emerald-500/5 hover:border-emerald-500/20 transition-all text-left"
            >
              <Icon className="w-4 h-4 text-emerald-500/50" />
              <span className="text-xs text-foreground/70">{label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card className="border-emerald-500/20 bg-card/70">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <tipoAtual.icon className="w-4 h-4 text-emerald-500/60" />
            <span className="text-xs font-medium text-foreground/80">{tipoAtual.label}</span>
          </div>
          <button onClick={() => setOpen(false)} className="text-muted-foreground/40 hover:text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tipo selector */}
        <div className="flex gap-1.5">
          {TIPOS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTipo(key)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] transition-all border",
                tipo === key
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                  : "bg-card/50 border-border/15 text-muted-foreground"
              )}
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>

        <Textarea
          placeholder={tipoAtual.placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, 500))}
          className="min-h-[100px] resize-none bg-background/50 text-sm"
          maxLength={500}
        />

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground/40">{content.length}/500</span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-muted/20 p-3">
          <div className="flex items-center gap-2">
            {shared ? <Eye className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-muted-foreground/50" />}
            <Label className="text-xs text-foreground/60 cursor-pointer">
              {shared ? 'Terapeuta poderá ver' : 'Só eu vejo'}
            </Label>
          </div>
          <Switch checked={shared} onCheckedChange={setShared} />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={saving || !content.trim()}
          className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2 text-sm"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Guardar no Jardim
        </Button>
      </CardContent>
    </Card>
  );
}
