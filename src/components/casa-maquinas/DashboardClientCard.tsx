import { Users, MapPin, Castle, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ClientCardProps {
  nome: string;
  ultimaSessao: string;
  distritoAtual: string;
  torrePredominante: string;
  estado: 'crise' | 'travessia' | 'integração';
  onOpenCity?: () => void;
  onStartSession?: () => void;
}

const estadoCores: Record<string, string> = {
  crise: 'bg-red-500/20 text-red-400 border-red-500/30',
  travessia: 'bg-[#C9A24A]/20 text-[#C9A24A] border-[#C9A24A]/30',
  'integração': 'bg-[#556B57]/20 text-[#556B57] border-[#556B57]/30',
};

export function DashboardClientCard({
  nome,
  ultimaSessao,
  distritoAtual,
  torrePredominante,
  estado,
  onOpenCity,
  onStartSession,
}: ClientCardProps) {
  return (
    <div className="p-4 rounded-xl border border-[#C9A24A]/10 bg-[#0B1B2B]/60 hover:border-[#C9A24A]/20 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-[#F5F1E8]">{nome}</h3>
          <p className="text-[10px] text-[#F5F1E8]/40 mt-0.5">Última sessão: {ultimaSessao}</p>
        </div>
        <Badge variant="outline" className={`text-[10px] ${estadoCores[estado]}`}>
          {estado}
        </Badge>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1 text-[10px] text-[#F5F1E8]/50">
          <MapPin className="w-3 h-3 text-[#C9A24A]/60" />
          {distritoAtual}
        </div>
        <span className="text-[#F5F1E8]/20">·</span>
        <div className="flex items-center gap-1 text-[10px] text-[#F5F1E8]/50">
          <Castle className="w-3 h-3 text-[#C9A24A]/60" />
          {torrePredominante}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={onOpenCity}
          className="h-7 text-xs text-[#C9A24A] hover:text-[#C9A24A] hover:bg-[#C9A24A]/10 flex-1"
        >
          Abrir Cidade
          <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onStartSession}
          className="h-7 text-xs border-[#C9A24A]/20 text-[#F5F1E8]/60 hover:text-[#F5F1E8] hover:bg-[#C9A24A]/10"
        >
          Sessão
        </Button>
      </div>
    </div>
  );
}
