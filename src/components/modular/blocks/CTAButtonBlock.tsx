import { ContentBlock, CTAButtonContent } from '@/types/modular';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

interface CTAButtonBlockProps {
  block: ContentBlock;
  onAction?: (action: string, data?: unknown) => void;
}

const sizeClasses = {
  sm: 'text-sm px-4 py-2',
  md: 'text-base px-6 py-3',
  lg: 'text-lg px-8 py-4',
  xl: 'text-xl px-10 py-5',
};

export function CTAButtonBlock({ block, onAction }: CTAButtonBlockProps) {
  const content = block.content as CTAButtonContent;
  const navigate = useNavigate();

  if (!content.text) {
    return null;
  }

  // Dynamic icon component
  const IconComponent = content.icon && (LucideIcons as any)[content.icon]
    ? (LucideIcons as any)[content.icon]
    : null;

  const handleClick = () => {
    switch (content.action) {
      case 'navigate':
        if (content.href) {
          navigate(content.href);
        }
        break;
      case 'external':
        if (content.href) {
          window.open(content.href, '_blank', 'noopener,noreferrer');
        }
        break;
      case 'scroll':
        if (content.href) {
          const element = document.querySelector(content.href);
          element?.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      case 'modal':
        onAction?.('modal', { href: content.href });
        break;
      default:
        if (content.href) {
          navigate(content.href);
        }
    }
  };

  return (
    <div className={cn(
      "animate-fade-in flex",
      content.fullWidth ? 'justify-stretch' : 'justify-center'
    )}>
      <Button
        variant={content.variant as any || 'gold'}
        size={content.size === 'md' ? 'default' : (content.size === 'xl' ? 'lg' : content.size) || 'lg'}
        onClick={handleClick}
        className={cn(
          "transition-all duration-300 hover:scale-105",
          content.size === 'xl' && 'text-xl px-10 py-6 h-auto',
          content.fullWidth && 'w-full'
        )}
      >
        {IconComponent && <IconComponent className="w-5 h-5 mr-2" />}
        {content.text}
      </Button>
    </div>
  );
}
