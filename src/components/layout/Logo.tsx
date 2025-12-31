import { cn } from '@/lib/utils';
import logoFull from '@/assets/logo-casa-oracula.png';
import logoIcon from '@/assets/logo-icon.png';
import logoText from '@/assets/logo-text.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon' | 'text';
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
