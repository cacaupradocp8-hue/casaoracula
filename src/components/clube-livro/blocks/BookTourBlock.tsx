import { BookTour } from '@/hooks/useBooks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Compass, MapPin, Sparkles, ShieldAlert, Route, Clock } from 'lucide-react';

interface BookTourBlockProps {
  tour: BookTour;
  bookTitle: string;
  onEnterTravessia?: () => void;
}

const JORNADA_COLORS: Record<string, string> = {
  Heroína: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  Sombra: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  Instinto: 'bg-red-500/15 text-red-300 border-red-500/30',
  Liderança: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Mundo: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
};

interface TourFieldProps {
  icon: React.ReactNode;
  label: string;
  text: string | null;
}

function TourField({ icon, label, text }: TourFieldProps) {
  if (!text) return null;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="text-sm text-foreground/90 leading-relaxed pl-6">{text}</p>
    </div>
  );
}

export function BookTourBlock({ tour, bookTitle, onEnterTravessia }: BookTourBlockProps) {
  const jornadaClass = JORNADA_COLORS[tour.jornada] || 'bg-muted text-muted-foreground';

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <Compass className="w-5 h-5 text-gold" />
          <h3 className="text-lg font-display font-semibold text-foreground">Tour pela Obra</h3>
        </div>
        <Badge variant="outline" className={jornadaClass}>
          Jornada: {tour.jornada}
        </Badge>
      </div>

      {/* Fields */}
      <div className="space-y-5 border-l-2 border-gold/20 pl-4 ml-2">
        <TourField
          icon={<MapPin className="w-3.5 h-3.5" />}
          label="Onde esta obra entra na Jornada"
          text={tour.onde_entra_jornada}
        />
        <TourField
          icon={<Sparkles className="w-3.5 h-3.5" />}
          label="Habilidade simbólica desenvolvida"
          text={tour.habilidade_simbolica}
        />
        <TourField
          icon={<ShieldAlert className="w-3.5 h-3.5" />}
          label="O que NÃO fazer com esta obra"
          text={tour.o_que_nao_fazer}
        />
        <TourField
          icon={<Route className="w-3.5 h-3.5" />}
          label="Como atravessar esta obra"
          text={tour.como_atravessar}
        />
        <TourField
          icon={<Clock className="w-3.5 h-3.5" />}
          label="Quando encerrar a travessia"
          text={tour.quando_encerrar}
        />
      </div>

      {/* CTA */}
      {onEnterTravessia && (
        <div className="text-center pt-2">
          <Button onClick={onEnterTravessia} className="bg-gold hover:bg-gold/90 text-black font-semibold px-8">
            Entrar na Travessia
          </Button>
        </div>
      )}
    </div>
  );
}
