import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ContentPageLayoutProps {
  // Header
  breadcrumbs?: BreadcrumbItem[];
  badge?: string;
  badgeIcon?: ReactNode;
  title: string;
  subtitle?: string;
  
  // Content
  children: ReactNode;
  
  // Navigation
  onBack?: () => void;
  backLabel?: string;
  onNext?: () => void;
  nextLabel?: string;
  showNavigation?: boolean;
  
  // Optional header actions
  headerActions?: ReactNode;
  
  // Styling
  maxWidth?: 'md' | 'lg' | 'xl' | '2xl' | '4xl';
  className?: string;
}

const maxWidthClasses = {
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
};

export function ContentPageLayout({
  breadcrumbs,
  badge,
  badgeIcon,
  title,
  subtitle,
  children,
  onBack,
  backLabel = 'Voltar',
  onNext,
  nextLabel = 'Próximo',
  showNavigation = true,
  headerActions,
  maxWidth = '4xl',
  className,
}: ContentPageLayoutProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={cn('container mx-auto px-4 py-8 pb-20', maxWidthClasses[maxWidth], className)}>
      {/* Breadcrumb */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <BreadcrumbItem key={index}>
                {index > 0 && <BreadcrumbSeparator />}
                {crumb.href ? (
                  <BreadcrumbLink 
                    href={crumb.href}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(crumb.href!);
                    }}
                  >
                    {crumb.label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {/* Header */}
      <div className="mb-8">
        {badge && (
          <div className="flex items-center gap-2 mb-2">
            {badgeIcon}
            <p className="text-xs uppercase tracking-widest text-gold">
              {badge}
            </p>
          </div>
        )}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl text-gold mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {headerActions && (
            <div className="flex-shrink-0">
              {headerActions}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {children}
      </div>

      {/* Navigation */}
      {showNavigation && (onBack || onNext) && (
        <div className="flex justify-between mt-10 pt-6 border-t border-border/30">
          <Button
            variant="outline"
            onClick={handleBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </Button>
          
          {onNext && (
            <Button
              variant="gold"
              onClick={onNext}
              className="gap-2"
            >
              {nextLabel}
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
