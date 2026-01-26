import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Leaf,
  Sparkles,
  Orbit,
  CheckCircle,
  ArrowRight,
  Star,
  Archive,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { RegistroBiblioteca, TipoRegistro } from '@/hooks/useMinhaBiblioteca';

// ════════════════════════════════════════════════════════════════════════════
// ICON MAPPING
// ════════════════════════════════════════════════════════════════════════════

const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen,
  Leaf,
  Sparkles,
  Orbit,
  CheckCircle,
};

const TYPE_CONFIG: Record<TipoRegistro, { label: string; color: string; bgColor: string }> = {
  diario: {
    label: 'Diário de Bordo',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
  jardim: {
    label: 'Jardim da Psique',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
  },
  oraculo: {
    label: 'Oráculo',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  labirinto: {
    label: 'Labirinto',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  progresso: {
    label: 'Aula Concluída',
    color: 'text-gold',
    bgColor: 'bg-gold/10',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════════════════════════════════════════

interface BibliotecaCardProps {
  registro: RegistroBiblioteca;
  index?: number;
}

export function BibliotecaCard({ registro, index = 0 }: BibliotecaCardProps) {
  const navigate = useNavigate();
  const Icon = ICON_MAP[registro.icone] || BookOpen;
  const config = TYPE_CONFIG[registro.tipo];

  const formattedDate = format(new Date(registro.data), "d 'de' MMM yyyy", {
    locale: ptBR,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        className={cn(
          'group cursor-pointer transition-all duration-300',
          'hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5',
          'bg-card/50 backdrop-blur-sm'
        )}
        onClick={() => navigate(registro.link)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                config.bgColor
              )}
            >
              <Icon className={cn('w-5 h-5', config.color)} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Type Badge + Date */}
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs font-normal px-2 py-0 h-5 border-0',
                    config.bgColor,
                    config.color
                  )}
                >
                  {config.label}
                </Badge>
                
                {registro.metadata.integrado && (
                  <Star className="w-3 h-3 text-gold fill-gold" />
                )}
                
                {registro.metadata.arquivado && (
                  <Archive className="w-3 h-3 text-muted-foreground" />
                )}
              </div>

              {/* Title */}
              <h4 className="font-medium text-foreground line-clamp-1 mb-1">
                {registro.titulo}
              </h4>

              {/* Summary */}
              {registro.resumo && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  "{registro.resumo}"
                </p>
              )}

              {/* Footer: Date + Action */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  📅 {formattedDate}
                </span>
                <span className="text-xs text-gold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Abrir
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
