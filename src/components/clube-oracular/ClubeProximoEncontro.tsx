import { CalendarDays, Video } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
  encontro: { titulo: string; data_encontro: string; link_ao_vivo?: string; descricao?: string } | null | undefined;
}

export function ClubeProximoEncontro({ encontro }: Props) {
  if (!encontro) {
    return (
      <Card className="border-border/15">
        <CardContent className="p-6 text-center">
          <CalendarDays className="w-6 h-6 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Nenhum encontro agendado.</p>
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
    <Card className="border-mystic/15 bg-gradient-to-br from-mystic/[0.04] to-card hover:shadow-lg hover:shadow-mystic/5 transition-all duration-500">
      <CardContent className="p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-mystic/20 to-primary/10 flex items-center justify-center">
            <Video className="w-4 h-4 text-mystic" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-mystic/80 font-medium">
            Próximo Encontro ao Vivo
          </p>
        </div>
        <h3 className="font-display text-sm text-foreground mb-1.5">{encontro.titulo}</h3>
        <p className="text-xs text-muted-foreground capitalize mb-4">{formatted}</p>
        {encontro.link_ao_vivo && (
          <Button variant="outline" size="sm" className="w-full border-mystic/20 hover:bg-mystic/5" asChild>
            <a href={encontro.link_ao_vivo} target="_blank" rel="noopener noreferrer">
              Acessar Sala de Encontro
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
