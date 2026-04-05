import {
  Sparkles, Home, Compass, Flower, BookOpen,
  Target, FileText, ArrowRight,
} from 'lucide-react';
import { NavigationSuggestion } from '@/services/syntheiaContextAdapter';

const ICON_MAP: Record<string, React.ElementType> = {
  sparkles: Sparkles, home: Home, compass: Compass, flower: Flower,
  book: BookOpen, target: Target, 'file-text': FileText,
};

interface Props {
  suggestions: NavigationSuggestion[];
  onNavigate: (path: string) => void;
}

export function TherabotNavSuggestions({ suggestions, onNavigate }: Props) {
  if (!suggestions.length) return null;

  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider px-0.5">Explorar</p>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((s) => {
          const Icon = ICON_MAP[s.icon] || Compass;
          return (
            <button
              key={s.path}
              onClick={() => onNavigate(s.path)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gold/5 border border-gold/15 hover:bg-gold/10 hover:border-gold/30 transition-all text-[11px] text-muted-foreground hover:text-foreground group"
            >
              <Icon className="w-3 h-3 text-gold/50 group-hover:text-gold transition-colors" />
              <span>{s.label}</span>
              <ArrowRight className="w-2.5 h-2.5 text-gold/30 group-hover:text-gold/60 transition-colors" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
