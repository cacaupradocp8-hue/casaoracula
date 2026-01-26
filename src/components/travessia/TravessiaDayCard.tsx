import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { DayUnlockStatus } from '@/hooks/useTravessiaUnlock';

interface TravessiaDayCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  colors: {
    icon: string;
  };
  unlockStatus?: DayUnlockStatus;
  onClick?: () => void;
  isTravessiaZero?: boolean;
}

export function TravessiaDayCard({
  title,
  description,
  icon: Icon,
  colors,
  unlockStatus,
  onClick,
  isTravessiaZero = false,
}: TravessiaDayCardProps) {
  // Se não for Travessia 00, sempre permite clicar
  const isLocked = isTravessiaZero && unlockStatus && !unlockStatus.isUnlocked;
  const isClickable = !isLocked;

  const handleClick = () => {
    if (isClickable && onClick) {
      onClick();
    }
  };

  return (
    <Card
      className={cn(
        "transition-all duration-300 relative overflow-hidden",
        isClickable && "group cursor-pointer hover:shadow-lg hover:border-gold/40",
        isLocked && "bg-card/50 opacity-75"
      )}
      onClick={handleClick}
    >
      {/* Overlay de bloqueio */}
      {isLocked && (
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <div className="text-center px-4">
            <Lock className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs text-muted-foreground max-w-[160px] leading-relaxed">
              Este passo pede um dia de intervalo para maturação.
            </p>
          </div>
        </div>
      )}

      <CardHeader className="pb-2">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colors.icon)}>
          <Icon className="w-5 h-5" />
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className={cn(
          "text-base mb-1",
          isClickable && "group-hover:text-gold transition-colors"
        )}>
          {title}
        </CardTitle>
        <CardDescription className="text-sm line-clamp-2">
          {description}
        </CardDescription>
        {isClickable && (
          <div className="flex items-center justify-end mt-3">
            <ArrowRight className="w-4 h-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-gold" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
