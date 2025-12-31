import { cn } from '@/lib/utils';
import logoImage from '@/assets/logo-casa-oracula.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ className, size = 'md', showText = false }: LogoProps) {
  const sizes = {
    sm: 'h-14',
    md: 'h-20',
    lg: 'h-36',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <img
        src={logoImage}
        alt="Casa ORÁCULA"
        className={cn('w-auto object-contain', sizes[size])}
      />
    </div>
  );
}
