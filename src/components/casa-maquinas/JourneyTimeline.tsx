import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Sparkles, Wrench, MessageCircle } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  sessions: any[];
  districts: any[];
  oracleCards: any[];
  tools: any[];
}

const CHECKIN_COLORS: Record<string, string> = {
  presente: 'border-[#556B57]/40 text-[#556B57]',
  contraida: 'border-red-400/40 text-red-400',
  instavel: 'border-yellow-400/40 text-yellow-400',
  expandida: 'border-[#C9A24A]/40 text-[#C9A24A]',
};

export function JourneyTimeline({ open, onClose, sessions, districts, oracleCards, tools }: Props) {
  const getDistrict = (id: string) => districts.find(d => d.id === id);
  const getCard = (id: string) => oracleCards.find(c => c.id === id);
  const getTool = (id: string) => tools.find(t => t.id === id);

  // Sessions are already ordered ascending
  const orderedSessions = [...sessions];

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="bg-[#0B1B2B] border-l border-[#C9A24A]/15 w-full sm:max-w-md p-0"
      >
        <SheetHeader className="p-4 pb-2 border-b border-[#C9A24A]/10">
          <SheetTitle className="text-[#F5F1E8] text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C9A24A]" />
            Linha do Tempo da Jornada
          </SheetTitle>
          <p className="text-[10px] text-[#F5F1E8]/30">{orderedSessions.length} sessões registradas</p>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="relative px-4 py-4">
            {/* Vertical timeline line */}
            <div className="absolute left-7 top-4 bottom-4 w-px bg-gradient-to-b from-[#C9A24A]/20 via-[#C9A24A]/10 to-transparent" />

            {orderedSessions.length === 0 ? (
              <p className="text-xs text-[#F5F1E8]/30 text-center py-10">Nenhuma sessão registrada</p>
            ) : (
              <div className="space-y-4">
                {orderedSessions.map((s, i) => {
                  const district = getDistrict(s.district_id);
                  const card = s.oracle_card_id ? getCard(s.oracle_card_id) : null;
                  const tool = s.tool_id ? getTool(s.tool_id) : null;

                  return (
                    <div key={s.id} className="relative pl-8">
                      {/* Timeline dot */}
                      <div className="absolute left-[22px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#C9A24A]/30 border border-[#C9A24A]/50" />

                      <div className="bg-[#F5F1E8]/[0.03] border border-[#C9A24A]/8 rounded-lg p-3 hover:border-[#C9A24A]/15 transition-colors">
                        {/* Date & district */}
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div>
                            <p className="text-[10px] text-[#F5F1E8]/30 mb-0.5">
                              {new Date(s.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                            {district && (
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 text-[#C9A24A]/60" />
                                <span className="text-xs text-[#F5F1E8]/70 font-medium">{district.nome}</span>
                              </div>
                            )}
                          </div>
                          {s.checkin_state && (
                            <Badge variant="outline" className={`text-[8px] shrink-0 ${CHECKIN_COLORS[s.checkin_state] || 'text-[#F5F1E8]/30'}`}>
                              {s.checkin_state}
                            </Badge>
                          )}
                        </div>

                        {/* Tool */}
                        {tool && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <Wrench className="w-2.5 h-2.5 text-[#556B57]/60" />
                            <span className="text-[10px] text-[#556B57]/80">{tool.nome}</span>
                          </div>
                        )}

                        {/* Oracle card */}
                        {card && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] text-[#C9A24A]/60">✦</span>
                            <span className="text-[10px] text-[#C9A24A]/60 italic">{card.name}</span>
                          </div>
                        )}

                        {/* Insight */}
                        {s.insight && (
                          <div className="mt-2 flex items-start gap-1.5">
                            <MessageCircle className="w-2.5 h-2.5 text-[#F5F1E8]/20 mt-0.5 shrink-0" />
                            <p className="text-[10px] text-[#F5F1E8]/40 italic leading-relaxed line-clamp-2">{s.insight}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
