import React from 'react';
import { motion } from 'framer-motion';
import { Inbox, Search } from 'lucide-react';
import { RegistroBiblioteca } from '@/hooks/useMinhaBiblioteca';
import { BibliotecaCard } from './BibliotecaCard';

// ════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════════════════════════════════════════

interface BibliotecaTimelineProps {
  registros: RegistroBiblioteca[];
  isLoading?: boolean;
  isFiltered?: boolean;
}

export function BibliotecaTimeline({ registros, isLoading, isFiltered }: BibliotecaTimelineProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 rounded-lg bg-muted/30 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (registros.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
          {isFiltered ? (
            <Search className="w-8 h-8 text-muted-foreground" />
          ) : (
            <Inbox className="w-8 h-8 text-muted-foreground" />
          )}
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          {isFiltered ? 'Nenhum resultado encontrado' : 'Sua biblioteca está vazia'}
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          {isFiltered
            ? 'Tente ajustar os filtros ou buscar por outro termo.'
            : 'Conforme você avança em sua jornada, suas notas, tiragens e progresso aparecerão aqui.'}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      {registros.map((registro, index) => (
        <BibliotecaCard key={registro.id} registro={registro} index={index} />
      ))}
    </div>
  );
}
