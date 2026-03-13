import { CalendarDays, Video } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
  encontro: { titulo: string; data_encontro: string; link_ao_vivo?: string; descricao?: string } | null | undefined;
}

export function ClubeProximoEncontro({ encontro }: Props) {
  if (!encontro) {
    return (
      <Card className="border-border/20">
        <CardContent className="p-5 text-center">
          <CalendarDays className="w-6 h-6 text-muted-foreground/40 mx-auto mb-2" />
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
    <Card className="border-primary/15 bg-primary/[0.03]">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Video className="w-4 h-4 text-primary" />
          <p className="text-xs uppercase tracking-[0.15em] text-primary font-medium">
            Próximo Encontro ao Vivo
          </p>
        </div>
        <h3 className="text-sm font-medium text-foreground mb-1">{encontro.titulo}</h3>
        <p className="text-xs text-muted-foreground capitalize mb-3">{formatted}</p>
        {encontro.link_ao_vivo && (
          <Button variant="outline" size="sm" className="w-full" asChild>
            <a href={encontro.link_ao_vivo} target="_blank" rel="noopener noreferrer">
              Acessar Sala de Encontro
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
