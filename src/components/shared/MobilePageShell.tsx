import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';

interface CollapsibleBlockProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleBlock({ title, children, defaultOpen = false }: CollapsibleBlockProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border/40 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left bg-card/50 hover:bg-card/80 transition-colors"
      >
        <span className="font-medium text-sm text-foreground">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-2 text-sm text-muted-foreground leading-relaxed border-t border-border/30 bg-card/20">
          {children}
        </div>
      )}
    </div>
  );
}

interface MobileTabProps {
  tabs: { key: string; label: string; content: ReactNode }[];
  defaultTab?: string;
}

function MobileTabs({ tabs, defaultTab }: MobileTabProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.key);

  return (
    <div>
      <div className="flex border-b border-border/40 mb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex-shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
              activeTab === tab.key
                ? 'border-gold text-gold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {tabs.find((t) => t.key === activeTab)?.content}
      </div>
    </div>
  );
}

interface MobilePageShellProps {
  // Header
  title: string;
  subtitle?: string;
  badge?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  headerExtra?: ReactNode;

  // Collapsible info blocks
  collapsibles?: CollapsibleBlockProps[];

  // Tabs (Modo Individual / Profissional)
  tabs?: MobileTabProps['tabs'];
  defaultTab?: string;

  // Main content (sem tabs)
  children?: ReactNode;

  // Fixed bottom button
  fixedAction?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
    disabled?: boolean;
    variant?: 'gold' | 'default' | 'outline';
  };

  className?: string;
}

export function MobilePageShell({
  title,
  subtitle,
  badge,
  primaryAction,
  headerExtra,
  collapsibles,
  tabs,
  defaultTab,
  children,
  fixedAction,
  className,
}: MobilePageShellProps) {
  return (
    <div className={cn('flex flex-col min-h-[calc(100vh-4rem)]', className)}>
      <ResponsiveContainer>
        {/* Header */}
        <div className="pt-6 pb-4 space-y-3">
          {badge && (
            <p className="text-xs uppercase tracking-widest text-gold font-medium">{badge}</p>
          )}
          <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground leading-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">{subtitle}</p>
          )}
          {primaryAction && (
            <Button
              variant="gold"
              size="sm"
              onClick={primaryAction.onClick}
              className="gap-2 mt-1 min-h-[40px]"
            >
              {primaryAction.icon}
              {primaryAction.label}
            </Button>
          )}
          {headerExtra}
        </div>

        {/* Collapsible Blocks */}
        {collapsibles && collapsibles.length > 0 && (
          <div className="pb-4 space-y-2 max-w-2xl">
            {collapsibles.map((block, i) => (
              <CollapsibleBlock key={i} {...block} />
            ))}
          </div>
        )}

        {/* Tabs or Main Content */}
        <div className="flex-1 pb-4">
          {tabs && tabs.length > 0 ? (
            <MobileTabs tabs={tabs} defaultTab={defaultTab} />
          ) : (
            children
          )}
        </div>
      </ResponsiveContainer>

      {/* Fixed Bottom Action */}
      {fixedAction && (
        <div className="sticky bottom-0 left-0 right-0 z-20 bg-background/95 backdrop-blur-sm border-t border-border/30 px-4 py-3 safe-area-bottom">
          <ResponsiveContainer className="px-0">
            <Button
              variant={fixedAction.variant || 'gold'}
              className="w-full gap-2 min-h-[44px]"
              onClick={fixedAction.onClick}
              disabled={fixedAction.disabled}
            >
              {fixedAction.icon}
              {fixedAction.label}
            </Button>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// Re-export primitives for selective use
export { CollapsibleBlock, MobileTabs };
