import { Play } from 'lucide-react';

interface AulaHeaderBlockProps {
  ordem: number;
  titulo: string;
  descricaoCurta: string;
  onPlay?: () => void;
}

export function AulaHeaderBlock({ ordem, titulo, descricaoCurta, onPlay }: AulaHeaderBlockProps) {
  return (
    <div className="mb-6">
      <p className="text-xs uppercase tracking-widest text-gold mb-1">
        Aula {ordem}
      </p>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h1 className="font-display text-2xl md:text-4xl mb-2 leading-tight">{titulo}</h1>
          <p className="text-sm text-muted-foreground">{descricaoCurta}</p>
        </div>
        {onPlay && (
          <button
            onClick={onPlay}
            className="shrink-0 w-12 h-12 rounded-full bg-gold/10 hover:bg-gold/20 flex items-center justify-center transition-colors mt-1"
            aria-label="Iniciar aula"
          >
            <Play className="w-5 h-5 text-gold ml-0.5" />
          </button>
        )}
      </div>
    </div>
  );
}
