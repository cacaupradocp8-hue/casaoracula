import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface Props {
  title: string;
  subtitle?: string;
  value: string;
  onChange: (v: string) => void;
  suggestions: string[];
  onNext: () => void;
  onBack: () => void;
}

export function TelaTexto({ title, subtitle, value, onChange, suggestions, onNext, onBack }: Props) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-display text-foreground">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => onChange(value ? `${value}\n${s}` : s)}
              className="text-[10px] px-2.5 py-1 rounded-full border border-primary/20 text-primary/70 hover:bg-primary/5 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
        <Textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Escreva aqui..."
          className="min-h-[120px] bg-card/60 border-border/30 text-foreground placeholder:text-muted-foreground/40"
        />
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Voltar</Button>
        <Button onClick={onNext} className="flex-1">Próximo</Button>
      </div>
    </div>
  );
}
