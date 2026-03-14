import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Users, Compass, Sparkles } from 'lucide-react';
import type { MandalaDistrict, MandalaDistrictState, MandalaCollectiveData } from './MandalaCidadela';

const STATE_LABELS: Record<string, { label: string; color: string }> = {
  inativo: { label: 'Não explorado', color: 'rgba(245,241,232,0.3)' },
  ativo: { label: 'Ativo', color: '#C9A24A' },
  integrado: { label: 'Integrado', color: '#b8a4d8' },
};

// Map district numbers to symbolic tools
const DISTRICT_TOOLS: Record<number, string[]> = {
  1: ['Cartografia Psíquica', 'Ritual de Entrada'],
  2: ['Atlas de Arquétipos', 'Big5 Simbólico'],
  3: ['Labirinto das Portas'],
  4: ['Atlas de Arquétipos', 'Diário Arquetípico'],
  5: ['Ritual de Integração', 'Oráculo das Estações'],
  6: ['Narroterapia', 'Cartografia Psíquica'],
  7: ['Relacionamentos como Espelho'],
  8: ['Fio de Ariadne', 'Conselho das Partes'],
  9: ['Conselho das Partes Internas'],
  10: ['Labirinto das Portas', 'Fio de Ariadne'],
  11: ['Ritual de Integração', 'Mandala Pessoal'],
  12: ['Ritual de Integração', 'Oráculo das Estações'],
};

interface Props {
  district: MandalaDistrict | null;
  districtState?: MandalaDistrictState;
  collectiveData?: MandalaCollectiveData;
  open: boolean;
  onClose: () => void;
}

export function DistrictDetailSheet({ district, districtState, collectiveData, open, onClose }: Props) {
  if (!district) return null;

  const state = districtState?.state || 'inativo';
  const stateInfo = STATE_LABELS[state];
  const tools = DISTRICT_TOOLS[district.numero] || [];

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="bottom" className="bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-[#C9A24A]/15 rounded-t-2xl max-h-[70vh] overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: state === 'integrado' ? 'rgba(107,75,161,0.2)' : state === 'ativo' ? 'rgba(201,162,74,0.15)' : 'rgba(245,241,232,0.05)', border: `1px solid ${stateInfo.color}` }}>
              <Compass className="w-5 h-5" style={{ color: stateInfo.color }} />
            </div>
            <div>
              <SheetTitle className="text-left text-base" style={{ color: stateInfo.color }}>
                {district.nome}
              </SheetTitle>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-[#C9A24A]/20" style={{ color: stateInfo.color }}>
                  {stateInfo.label}
                </Badge>
                <span className="text-[10px] text-muted-foreground/40">Distrito #{district.numero}</span>
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Symbolic description */}
        {district.descricao && (
          <div className="mb-4 p-3 rounded-lg bg-[#F5F1E8]/[0.03] border border-[#C9A24A]/8">
            <p className="text-[10px] uppercase tracking-wider text-[#C9A24A]/40 mb-1.5">Descrição Simbólica</p>
            <p className="text-sm text-[#F5F1E8]/60 leading-relaxed">{district.descricao}</p>
          </div>
        )}

        {/* Session info */}
        {districtState && districtState.sessions_count > 0 && (
          <div className="mb-4 p-3 rounded-lg bg-[#C9A24A]/[0.04] border border-[#C9A24A]/10">
            <p className="text-[10px] uppercase tracking-wider text-[#C9A24A]/40 mb-1">Sessões</p>
            <p className="text-sm text-[#C9A24A]/80 font-medium">
              {districtState.sessions_count} {districtState.sessions_count === 1 ? 'sessão' : 'sessões'} registradas
            </p>
            {districtState.last_session_at && (
              <p className="text-[10px] text-muted-foreground/40 mt-0.5">
                Última: {new Date(districtState.last_session_at).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
        )}

        {/* Collective data */}
        {collectiveData && collectiveData.client_count > 0 && (
          <div className="mb-4 p-3 rounded-lg bg-[#6b4ba1]/[0.06] border border-[#6b4ba1]/15">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Users className="w-3.5 h-3.5 text-[#b8a4d8]/60" />
              <p className="text-[10px] uppercase tracking-wider text-[#b8a4d8]/50">
                {collectiveData.client_count} {collectiveData.client_count === 1 ? 'cliente' : 'clientes'} neste distrito
              </p>
            </div>
            {collectiveData.client_names && collectiveData.client_names.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {collectiveData.client_names.map((name, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-[#6b4ba1]/10 text-[#b8a4d8]/70 border border-[#6b4ba1]/15">
                    {name}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Related tools */}
        {tools.length > 0 && (
          <div className="p-3 rounded-lg bg-[#F5F1E8]/[0.02] border border-[#F5F1E8]/5">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A24A]/40" />
              <p className="text-[10px] uppercase tracking-wider text-[#C9A24A]/40">Ferramentas Relacionadas</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tools.map((tool, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-[#C9A24A]/[0.06] text-[#C9A24A]/60 border border-[#C9A24A]/10">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
