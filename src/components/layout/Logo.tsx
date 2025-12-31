import { cn } from '@/lib/utils';
import logoFull from '@/assets/logo-casa-oracula.png';
import logoIcon from '@/assets/logo-icon.png';
import logoText from '@/assets/logo-text.png';
import logoHorizontal from '@/assets/logo-horizontal.png';
import logoVertical from '@/assets/logo-vertical.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon' | 'text' | 'combined' | 'horizontal' | 'vertical';
}

export function Logo({ className, size = 'md', variant = 'full' }: LogoProps) {
  const iconSizes = {
    sm: 'h-10',
    md: 'h-14',
    lg: 'h-20',
  };

  const fullSizes = {
    sm: 'h-14',
    md: 'h-20',
    lg: 'h-36',
  };

  const textSizes = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
  };

  const horizontalSizes = {
    sm: 'h-10',
    md: 'h-14',
    lg: 'h-20',
  };

  const verticalSizes = {
    sm: 'h-20',
    md: 'h-28',
    lg: 'h-40',
  };

  // Horizontal variant - logo lado a lado (para header do portal)
  if (variant === 'horizontal') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <img
          src={logoHorizontal}
          alt="Casa ORÁCULA"
          className={cn('w-auto object-contain', horizontalSizes[size])}
        />
      </div>
    );
  }

  // Vertical variant - logo empilhado (para Landing e Login)
  if (variant === 'vertical') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <img
          src={logoVertical}
          alt="Casa ORÁCULA"
          className={cn('w-auto object-contain', verticalSizes[size])}
        />
      </div>
    );
  }

  // Combined variant (legacy - uses separate icon + text)
  if (variant === 'combined') {
    const combinedIconSizes = {
      sm: 'h-12',
      md: 'h-16',
      lg: 'h-24',
    };

    const combinedTextSizes = {
      sm: 'h-10',
      md: 'h-14',
      lg: 'h-20',
    };

    return (
      <div className={cn('flex items-center justify-center gap-4', className)}>
        <img
          src={logoIcon}
          alt="Casa ORÁCULA"
          className={cn('w-auto object-contain', combinedIconSizes[size])}
        />
        <img
          src={logoText}
          alt="Casa ORÁCULA"
          className={cn('w-auto object-contain', combinedTextSizes[size])}
        />
      </div>
    );
  }

  const getImage = () => {
    switch (variant) {
      case 'icon':
        return { src: logoIcon, sizes: iconSizes };
      case 'text':
        return { src: logoText, sizes: textSizes };
      default:
        return { src: logoFull, sizes: fullSizes };
    }
  };

  const { src, sizes } = getImage();

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <img
        src={src}
        alt="Casa ORÁCULA"
        className={cn('w-auto object-contain', sizes[size])}
      />
    </div>
  );
}
