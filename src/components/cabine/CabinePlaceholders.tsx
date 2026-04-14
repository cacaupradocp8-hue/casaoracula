import { Card, CardContent } from '@/components/ui/card';
import { Brain, Ear, AlertTriangle } from 'lucide-react';

const PLACEHOLDERS = [
  { icon: Brain, label: 'SINTHEYA', desc: 'Inteligência clínica invisível' },
  { icon: Ear, label: 'Modo Sussurro', desc: 'Sugestões em tempo real' },
  { icon: AlertTriangle, label: 'Alertas Clínicos', desc: 'Padrões e riscos detectados' },
];

export function CabinePlaceholders() {
  return (
    <div className="space-y-3 hidden lg:block">
      {PLACEHOLDERS.map(p => (
        <Card key={p.label} className="border-border/10 bg-card/30 backdrop-blur-sm">
          <CardContent className="p-3 text-center space-y-2">
            <div className="w-8 h-8 rounded-lg bg-muted/20 flex items-center justify-center mx-auto">
              <p.icon className="w-4 h-4 text-muted-foreground/30" />
            </div>
            <p className="text-[10px] font-display font-semibold text-muted-foreground/40 uppercase tracking-wider">
              {p.label}
            </p>
            <p className="text-[9px] text-muted-foreground/25 italic">{p.desc}</p>
            <div className="h-px bg-border/10" />
            <p className="text-[8px] text-muted-foreground/20 uppercase tracking-widest">em breve</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
