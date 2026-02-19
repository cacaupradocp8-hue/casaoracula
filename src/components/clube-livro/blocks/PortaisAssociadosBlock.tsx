import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Map, ArrowRight, Flower2, Sprout } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PortalConfig {
  nome: string;
  icone?: string;
  descricao: string;
  rota: string;
}

interface JornadaCor {
  label: string;
  simbolo: string;
  corBg: string;
  corBorda: string;
  corLabel: string;
}

interface PortaisAssociadosBlockProps {
  portais: PortalConfig[];
  jornadaCor: JornadaCor;
  orientacaoCurta: string;
  onNavigate: (rota: string) => void;
}

export function PortaisAssociadosBlock({ portais, jornadaCor, orientacaoCurta, onNavigate }: PortaisAssociadosBlockProps) {
  return (
    <section>
      {/* Banner da Jornada */}
      <div className={cn(
        'rounded-xl p-4 mb-4 bg-gradient-to-br border flex items-start gap-3',
        jornadaCor.corBg,
        jornadaCor.corBorda,
      )}>
        <span className={cn('text-xl leading-none mt-0.5 shrink-0', jornadaCor.corLabel)}>
          {jornadaCor.simbolo}
        </span>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-display text-base text-foreground">
              {jornadaCor.label}
            </h2>
            <Map className={cn('w-4 h-4', jornadaCor.corLabel)} />
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {orientacaoCurta}
          </p>
        </div>
      </div>

      {/* Portais */}
      <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
        <Map className="w-3 h-3" />
        Portais associados a este livro
      </h3>
      <div className="space-y-2 mb-4">
        {portais.map((portal) => (
          <Card
            key={portal.rota}
            className="cursor-pointer hover:border-gold/40 transition-all group"
            onClick={() => onNavigate(portal.rota)}
          >
            <CardContent className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={cn('text-lg leading-none shrink-0', jornadaCor.corLabel)}>
                  {portal.icone}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-gold transition-colors">
                    {portal.nome}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {portal.descricao}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="shrink-0 gap-1.5 text-xs"
                onClick={(e) => { e.stopPropagation(); onNavigate(portal.rota); }}
              >
                Entrar no Portal
                <ArrowRight className="w-3 h-3" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Atalhos Jardins */}
      <div className="grid grid-cols-2 gap-2">
        <Card
          className="cursor-pointer hover:border-gold/30 transition-all group bg-card/50"
          onClick={() => onNavigate('/jardim-da-psique')}
        >
          <CardContent className="py-3 text-center">
            <Flower2 className="w-5 h-5 text-muted-foreground group-hover:text-gold transition-colors mx-auto mb-1" />
            <p className="text-xs font-medium text-foreground">Jardim da Psique</p>
            <p className="text-[10px] text-muted-foreground">Registro pessoal</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:border-gold/30 transition-all group bg-card/50"
          onClick={() => onNavigate('/casa-das-maquinas/jardim-oficio')}
        >
          <CardContent className="py-3 text-center">
            <Sprout className="w-5 h-5 text-muted-foreground group-hover:text-gold transition-colors mx-auto mb-1" />
            <p className="text-xs font-medium text-foreground">Jardim do Ofício</p>
            <p className="text-[10px] text-muted-foreground">Registro profissional</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
