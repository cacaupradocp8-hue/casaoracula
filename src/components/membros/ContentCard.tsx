import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentCardProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  route: string;
  accentColor?: string;
  featured?: boolean;
}

export function ContentCard({
  title,
  subtitle,
  icon: Icon,
  route,
  accentColor = 'primary',
  featured = false,
}: ContentCardProps) {
  const navigate = useNavigate();

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(route)}
      className={cn(
        'group relative flex-shrink-0 snap-start rounded-xl overflow-hidden text-left transition-all duration-300',
        'border border-border/50 hover:border-primary/30',
        'bg-card hover:shadow-gold',
        featured ? 'w-72 md:w-80 h-44' : 'w-56 md:w-64 h-40'
      )}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 group-hover:to-primary/10 transition-colors" />

      {/* Icon glow */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

      <div className="relative z-10 p-5 h-full flex flex-col justify-between">
        <div>
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center mb-3',
            'bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors'
          )}>
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="font-display text-base md:text-lg font-medium text-foreground group-hover:text-primary transition-colors leading-tight">
            {title}
          </h3>
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </motion.button>
  );
}
