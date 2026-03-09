import { TERRITORIOS } from './constants';
import { Button } from '@/components/ui/button';

interface Props {
  territoriosSelecionados: string[];
  selected: string;
  onSelect: (t: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function TelaPontoPartida({ territoriosSelecionados, selected, onSelect, onNext, onBack }: Props) {
  const territorios = TERRITORIOS.filter(t => territoriosSelecionados.includes(t.key));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-display text-foreground">Por qual distrito você quer começar?</h3>
        <p className="text-xs text-muted-foreground">Escolha o ponto de partida da sua jornada</p>
      </div>

      <div className="space-y-2">
        {territorios.map(t => (
          <button
            key={t.key}
            onClick={() => onSelect(t.key)}
            className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
              selected === t.key
                ? 'bg-primary/10 border-primary/40 ring-1 ring-primary/20'
                : 'bg-card/40 border-border/30 hover:border-primary/20'
            }`}
          >
            <span className="text-2xl">{t.icon}</span>
            <div>
              <p className="text-sm font-medium text-foreground">{t.nome}</p>
              <p className="text-xs text-muted-foreground">{t.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground/50 text-center italic">
        Você pode explorar os outros territórios depois
      </p>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Voltar</Button>
        <Button onClick={onNext} disabled={!selected} className="flex-1">Ver meu mapa</Button>
      </div>
    </div>
  );
}
