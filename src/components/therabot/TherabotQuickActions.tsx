import {
  Sparkles, Home, Compass, Heart, Flower, Eye, BookOpen,
  Target, ListChecks, FileText, Lightbulb,
} from 'lucide-react';
import { QuickAction } from '@/services/syntheiaContextAdapter';

const ICON_MAP: Record<string, React.ElementType> = {
  sparkles: Sparkles, home: Home, compass: Compass, heart: Heart,
  flower: Flower, eye: Eye, book: BookOpen, target: Target,
  list: ListChecks, 'file-text': FileText, lightbulb: Lightbulb,
};

interface Props {
  actions: QuickAction[];
  onAction: (prompt: string) => void;
}

export function TherabotQuickActions({ actions, onAction }: Props) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider px-0.5">Ações rápidas</p>
      <div className="flex flex-col gap-1">
        {actions.map((action) => {
          const Icon = ICON_MAP[action.icon] || Sparkles;
          return (
            <button
              key={action.label}
              onClick={() => onAction(action.prompt)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-border/50 bg-card/40 hover:bg-card/80 hover:border-gold/30 transition-all text-xs text-muted-foreground hover:text-foreground text-left group"
            >
              <Icon className="w-3.5 h-3.5 text-gold/60 group-hover:text-gold flex-shrink-0 transition-colors" />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
