import React from 'react';
import { cn } from '@/lib/utils';
import logoFull from '@/assets/logo-casa-oracula.png';
import logoIcon from '@/assets/logo-casa-icon-new.png';
import logoText from '@/assets/logo-casa-text-new.png';
import logoHorizontal from '@/assets/logo-horizontal.png';
import logoVertical from '@/assets/logo-vertical.png';

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text' | 'combined' | 'horizontal' | 'vertical';
}

export const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  ({ className, size = 'md', variant = 'full', ...props }, ref) => {
    const iconSizes = {
      sm: 'h-10',
      md: 'h-14',
      lg: 'h-20',
      xl: 'h-24'
    };
    const fullSizes = {
      sm: 'h-14',
      md: 'h-20',
      lg: 'h-36',
      xl: 'h-40'
    };
    const textSizes = {
      sm: 'h-8',
      md: 'h-12',
      lg: 'h-16',
      xl: 'h-20'
    };
    const horizontalSizes = {
      sm: 'h-12 md:h-14',
      md: 'h-14 md:h-16',
      lg: 'h-16 md:h-18',
      xl: 'h-12 md:h-16'
    };
    const verticalSizes = {
      sm: 'h-16 md:h-20',
      md: 'h-20 md:h-24',
      lg: 'h-28 md:h-36',
      xl: 'h-36 md:h-44'
    };

    // Horizontal variant - logo lado a lado (para header do portal)
    if (variant === 'horizontal') {
      return (
        <div ref={ref} className={cn('flex items-center', className)} {...props}>
          <img 
            src={logoHorizontal} 
            alt="Casa ORÁCULA" 
            className="h-20 w-auto object-contain sm:h-24 md:h-28 lg:h-32"
          />
        </div>
      );
    }

    // Vertical variant - logo empilhado (para Landing e Login)
    if (variant === 'vertical') {
      return (
        <div ref={ref} className={cn('flex items-center justify-center', className)} {...props}>
          <img src={logoVertical} alt="Casa ORÁCULA" className={cn('w-auto object-contain', verticalSizes[size])} />
        </div>
      );
    }

    // Combined variant - icon only on mobile, icon + text on desktop
    if (variant === 'combined') {
      const iconSizesMap = {
        sm: 'h-10',
        md: 'h-12',
        lg: 'h-14',
        xl: 'h-12 md:h-16'
      };
      const textSizesMap = {
        sm: 'h-6',
        md: 'h-8',
        lg: 'h-10',
        xl: 'h-8 md:h-12'
      };
      return (
        <div ref={ref} className={cn('flex items-center justify-center gap-2 md:gap-4 h-full', className)} {...props}>
          <img src={logoIcon} alt="Casa ORÁCULA" className={cn('w-auto object-contain', iconSizesMap[size])} />
          <img src={logoText} alt="" className={cn('w-auto object-contain hidden md:block', textSizesMap[size])} />
        </div>
      );
    }

    const getImage = () => {
      switch (variant) {
        case 'icon':
          return {
            src: logoIcon,
            sizes: iconSizes
          };
        case 'text':
          return {
            src: logoText,
            sizes: textSizes
          };
        default:
          return {
            src: logoFull,
            sizes: fullSizes
          };
      }
    };

    const { src, sizes } = getImage();

    return (
      <div ref={ref} className={cn('flex items-center justify-center', className)} {...props}>
        <img src={src} alt="Casa ORÁCULA" className={cn('w-auto object-contain', sizes[size])} />
      </div>
    );
  }
);

Logo.displayName = 'Logo';
