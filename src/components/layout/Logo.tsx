import { cn } from '@/lib/utils';
import logoFull from '@/assets/logo-casa-oracula.png';
import logoIcon from '@/assets/logo-icon.png';
import logoText from '@/assets/logo-text.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon' | 'text' | 'combined';
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

  // Combined variant: icon + text side by side
  if (variant === 'combined') {
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
