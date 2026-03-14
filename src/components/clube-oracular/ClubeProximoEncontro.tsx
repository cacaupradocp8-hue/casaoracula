import { CalendarDays, Video } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
  encontro: { titulo: string; data_encontro: string; link_ao_vivo?: string; descricao?: string } | null | undefined;
}

export function ClubeProximoEncontro({ encontro }: Props) {
  if (!encontro) {
    return (
      <Card className="border-border/15 bg-card/30 backdrop-blur-sm">
        <CardContent className="p-7 text-center">
          <CalendarDays className="w-6 h-6 text-muted-foreground/25 mx-auto mb-2.5" />
          <p className="text-xs text-muted-foreground/60">Nenhum encontro agendado.</p>
        </CardContent>
      </Card>
    );
  }

  const dateObj = new Date(encontro.data_encontro);
  const formatted = dateObj.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="border-mystic/12 bg-card/40 backdrop-blur-sm hover:-translate-y-1.5 hover:shadow-[0_10px_30px_-8px_hsl(var(--mystic)/0.1)] transition-all duration-500">
      <CardContent className="p-7">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-full bg-mystic/10 border border-mystic/15 flex items-center justify-center">
            <Video className="w-4 h-4 text-mystic" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-mystic/70 font-medium">
            Próximo Encontro ao Vivo
          </p>
        </div>
        <h3 className="font-display text-base text-foreground mb-1.5">{encontro.titulo}</h3>
        <p className="text-xs text-muted-foreground/70 capitalize mb-5">{formatted}</p>
        {encontro.link_ao_vivo && (
          <Button variant="outline" size="sm" className="w-full border-mystic/15 hover:bg-mystic/5 hover:border-mystic/25 transition-all duration-300" asChild>
            <a href={encontro.link_ao_vivo} target="_blank" rel="noopener noreferrer">
              Acessar Sala de Encontro
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
