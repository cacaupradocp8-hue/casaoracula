import { Bot, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TherabotUserType } from '@/services/syntheiaContextAdapter';

const USER_TYPE_LABELS: Record<TherabotUserType, string> = {
  visitante: 'Visitante',
  cliente: 'Cliente',
  aluna: 'Aluna',
  terapeuta: 'Terapeuta',
};

interface Props {
  title: string;
  areaLabel: string;
  userType: TherabotUserType;
  onClose: () => void;
}

export function TherabotHeader({ title, areaLabel, userType, onClose }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gold/10 bg-gradient-to-r from-card via-card to-gold/5">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold/25 to-gold/10 flex items-center justify-center ring-1 ring-gold/20">
          <Bot className="w-4.5 h-4.5 text-gold" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground leading-tight">{title}</h3>
          <p className="text-[10px] text-muted-foreground leading-tight">
            {areaLabel} <span className="text-gold/60">•</span> {USER_TYPE_LABELS[userType]}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={onClose}>
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
