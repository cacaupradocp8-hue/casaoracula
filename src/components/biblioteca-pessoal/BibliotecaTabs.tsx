import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TipoRegistro } from '@/hooks/useMinhaBiblioteca';
import { BookOpen, Leaf, Sparkles, Orbit, CheckCircle, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

// ════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════

interface TabConfig {
  value: TipoRegistro | 'todos';
  label: string;
  icon: React.ElementType;
  shortLabel: string;
}

const TABS: TabConfig[] = [
  { value: 'todos', label: 'Todos', shortLabel: 'Todos', icon: LayoutGrid },
  { value: 'diario', label: 'Diários', shortLabel: '📔', icon: BookOpen },
  { value: 'jardim', label: 'Jardim', shortLabel: '🌿', icon: Leaf },
  { value: 'oraculo', label: 'Oráculos', shortLabel: '🔮', icon: Sparkles },
  { value: 'labirinto', label: 'Labirinto', shortLabel: '🌀', icon: Orbit },
  { value: 'progresso', label: 'Progresso', shortLabel: '📊', icon: CheckCircle },
];

// ════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════════════════════════════════════════

interface BibliotecaTabsProps {
  value: TipoRegistro | 'todos';
  onChange: (value: TipoRegistro | 'todos') => void;
  contagem: Record<TipoRegistro | 'todos', number>;
}

export function BibliotecaTabs({ value, onChange, contagem }: BibliotecaTabsProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as TipoRegistro | 'todos')}>
      <TabsList className="w-full h-auto flex-wrap gap-1 bg-muted/50 p-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const count = contagem[tab.value];
          
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                'flex-1 min-w-[80px] gap-1.5 py-2 px-3',
                'data-[state=active]:bg-background data-[state=active]:shadow-sm',
                'text-xs sm:text-sm'
              )}
            >
              <Icon className="w-3.5 h-3.5 hidden sm:inline-block" />
              <span className="sm:hidden">{tab.shortLabel}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              {count > 0 && (
                <span className="ml-1 text-[10px] text-muted-foreground">
                  ({count})
                </span>
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
