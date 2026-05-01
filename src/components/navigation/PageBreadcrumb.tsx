import { useNavigate } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PageBreadcrumbItem {
  label: string;
  href?: string;
}

interface PageBreadcrumbProps {
  items: PageBreadcrumbItem[];
  /** Show a Home icon as the first item linking to "/". Default: true */
  showHome?: boolean;
  className?: string;
}

/**
 * Breadcrumb leve, mobile-friendly.
 * - Em telas pequenas (sm-) mostra apenas Home + último item (com "...").
 * - Em telas maiores (sm+) mostra a trilha completa.
 * Não altera identidade visual: usa text-muted-foreground / hover:text-primary.
 */
export function PageBreadcrumb({ items, showHome = true, className }: PageBreadcrumbProps) {
  const navigate = useNavigate();

  if (!items || items.length === 0) return null;

  const last = items[items.length - 1];
  const middle = items.slice(0, -1);
  const hasMiddle = middle.length > 0;

  const renderItem = (item: PageBreadcrumbItem, isLast: boolean) => {
    const base = 'transition-colors';
    if (isLast || !item.href) {
      return (
        <span className={cn(base, 'text-foreground/80 font-medium truncate max-w-[180px] sm:max-w-none')}>
          {item.label}
        </span>
      );
    }
    return (
      <button
        type="button"
        onClick={() => navigate(item.href!)}
        className={cn(base, 'text-muted-foreground hover:text-primary truncate max-w-[140px] sm:max-w-none')}
      >
        {item.label}
      </button>
    );
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center gap-1.5 text-xs sm:text-sm mb-4 sm:mb-6 min-w-0', className)}
    >
      {showHome && (
        <>
          <button
            type="button"
            onClick={() => navigate('/')}
            aria-label="Início"
            className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
          >
            <Home className="w-3.5 h-3.5" />
          </button>
          <ChevronRight className="w-3 h-3 text-muted-foreground/40 flex-shrink-0" />
        </>
      )}

      {/* Mobile: collapse middle items */}
      {hasMiddle && (
        <span className="sm:hidden flex items-center gap-1.5 min-w-0">
          <span className="text-muted-foreground/60">…</span>
          <ChevronRight className="w-3 h-3 text-muted-foreground/40 flex-shrink-0" />
        </span>
      )}

      {/* Desktop: full trail */}
      <span className="hidden sm:flex items-center gap-1.5 min-w-0">
        {middle.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5 min-w-0">
            {renderItem(item, false)}
            <ChevronRight className="w-3 h-3 text-muted-foreground/40 flex-shrink-0" />
          </span>
        ))}
      </span>

      {/* Last item (always visible) */}
      <span className="min-w-0 flex items-center">
        {renderItem(last, true)}
      </span>
    </nav>
  );
}
