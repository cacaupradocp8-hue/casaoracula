import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { TravessiaItem } from '@/hooks/useClienteJardimCompleto';

interface Props {
  items: TravessiaItem[];
}

export function TravessiaSecao({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-2xl mb-3 block">🌿</span>
        <p className="text-xs text-muted-foreground/50">
          Sua travessia começará a se formar com o tempo.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50 text-center mb-4">
        Linha do tempo
      </p>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-border/20" />

        {items.map((item, i) => (
          <div key={item.id} className="relative flex items-start gap-4 pb-4">
            {/* Dot on the line */}
            <div className="relative z-10 w-8 h-8 rounded-full bg-card border border-border/20 flex items-center justify-center text-sm shrink-0">
              {item.icone}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-1">
              <p className="text-xs text-foreground/70">{item.titulo}</p>
              {item.subtitulo && (
                <p className="text-[10px] text-muted-foreground/40 truncate mt-0.5">{item.subtitulo}</p>
              )}
              <p className="text-[10px] text-muted-foreground/30 mt-0.5">
                {format(new Date(item.data), "dd 'de' MMMM · HH:mm", { locale: ptBR })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
