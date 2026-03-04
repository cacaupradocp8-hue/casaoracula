import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPin, Wrench, MessageCircle, Calendar } from 'lucide-react';

interface District {
  id: string;
  numero: number;
  nome: string;
  descricao: string;
}

interface Props {
  district: District | null;
  open: boolean;
  onClose: () => void;
  state: string;
  sessionCount: number;
  tools: { id: string; nome: string; rota: string; tipo: string }[];
  sessions: { id: string; created_at: string; checkin_state: string | null }[];
  clienteId: string;
}

const STATE_BADGES: Record<string, { label: string; cls: string }> = {
  inativo: { label: 'Inativo', cls: 'border-[#F5F1E8]/10 text-[#F5F1E8]/30' },
  ativo: { label: 'Ativo', cls: 'border-[#C9A24A]/30 text-[#C9A24A]' },
  integrado: { label: 'Integrado', cls: 'border-[#556B57]/30 text-[#556B57]' },
};

export function DistrictPanel({ district, open, onClose, state, sessionCount, tools, sessions, clienteId }: Props) {
  const navigate = useNavigate();

  if (!district) return null;

  const badge = STATE_BADGES[state] || STATE_BADGES.inativo;
  const recentSessions = sessions.slice(0, 5);

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="bottom"
        className="bg-[#0B1B2B] border-t border-[#C9A24A]/15 rounded-t-2xl max-h-[80vh] overflow-y-auto sm:max-w-lg sm:mx-auto"
      >
        <SheetHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C9A24A]/10 border border-[#C9A24A]/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#C9A24A]" />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-[#F5F1E8] text-lg">{district.nome}</SheetTitle>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline" className={`text-[9px] ${badge.cls}`}>{badge.label}</Badge>
                <span className="text-[10px] text-[#F5F1E8]/30">Distrito {district.numero}</span>
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Description */}
        <p className="text-sm text-[#F5F1E8]/50 leading-relaxed mt-3">{district.descricao}</p>

        <Separator className="my-4 bg-[#C9A24A]/10" />

        {/* Tools */}
        <div>
          <h4 className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#C9A24A]/60 mb-2">
            <Wrench className="w-3 h-3" /> Ferramentas
          </h4>
          {tools.length === 0 ? (
            <p className="text-xs text-[#F5F1E8]/25 py-2">Nenhuma ferramenta associada</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {tools.map(t => (
                <Button
                  key={t.id}
                  variant="outline"
                  size="sm"
                  className="justify-start border-[#C9A24A]/10 text-[#F5F1E8]/60 hover:text-[#C9A24A] hover:border-[#C9A24A]/30 text-xs h-9"
                  onClick={() => { onClose(); navigate(t.rota); }}
                >
                  {t.nome}
                </Button>
              ))}
            </div>
          )}
        </div>

        <Separator className="my-4 bg-[#C9A24A]/10" />

        {/* Recent sessions */}
        <div>
          <h4 className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#C9A24A]/60 mb-2">
            <Calendar className="w-3 h-3" /> Sessões ({sessionCount})
          </h4>
          {recentSessions.length === 0 ? (
            <p className="text-xs text-[#F5F1E8]/25 py-2">Nenhuma sessão neste distrito</p>
          ) : (
            <div className="space-y-1.5">
              {recentSessions.map(s => (
                <div key={s.id} className="flex items-center justify-between py-1.5 px-2 rounded bg-[#F5F1E8]/[0.03]">
                  <span className="text-[11px] text-[#F5F1E8]/50">
                    {new Date(s.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                  </span>
                  {s.checkin_state && (
                    <Badge variant="outline" className={`text-[8px] ${
                      s.checkin_state === 'presente' ? 'border-[#556B57]/30 text-[#556B57]'
                      : s.checkin_state === 'contraida' ? 'border-red-400/30 text-red-400'
                      : 'border-yellow-400/30 text-yellow-400'
                    }`}>
                      {s.checkin_state}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <Button
          className="w-full mt-5 bg-[#C9A24A] hover:bg-[#C9A24A]/80 text-[#0B1B2B] font-medium"
          onClick={() => {
            onClose();
            navigate(`/casa-das-maquinas/sessoes?clienteId=${clienteId}&districtId=${district.id}`);
          }}
        >
          Iniciar Sessão neste Distrito
        </Button>
      </SheetContent>
    </Sheet>
  );
}
