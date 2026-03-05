import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Loader2, Search, Flower2, AlertTriangle, MessageCircle, Shield,
  Sparkles, Eye
} from 'lucide-react';

const TERRITORY_META: Record<string, { label: string; color: string }> = {
  sustentacao: { label: 'Sustentação', color: '#C9A24A' },
  travessia: { label: 'Travessia', color: '#7B68EE' },
  profundidade: { label: 'Profundidade', color: '#556B57' },
  integracao: { label: 'Integração', color: '#DAA520' },
};

function MandalaParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      cx: 50 + (Math.random() - 0.5) * 70,
      cy: 50 + (Math.random() - 0.5) * 70,
      r: 0.2 + Math.random() * 0.3,
      dur: 6 + Math.random() * 8,
      delay: Math.random() * 4,
    })), []
  );
  return (
    <>
      {particles.map(p => (
        <circle key={p.id} cx={p.cx} cy={p.cy} r={p.r} fill="#C9A24A" opacity="0">
          <animate attributeName="opacity" values="0;0.2;0" dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </>
  );
}

export default function AtlasArquetiposPage() {
  const [arquetipos, setArquetipos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    supabase
      .from('atlas_arquetipos_femininos')
      .select('*')
      .eq('ativo', true)
      .order('ordem')
      .then(({ data }) => { setArquetipos(data || []); setLoading(false); });
  }, []);

  const filtered = arquetipos.filter(a =>
    a.nome.toLowerCase().includes(search.toLowerCase()) ||
    a.territorio.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (a: any) => {
    setSelected(a);
    setSheetOpen(true);
  };

  if (loading) {
    return (
      <CasaMaquinasLayout title="Atlas de Arquétipos">
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[#C9A24A]" /></div>
      </CasaMaquinasLayout>
    );
  }

  const cx = 50, cy = 50, r = 34;
  const getPos = (i: number, total: number) => {
    const angle = ((i / total) * 360 - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  return (
    <CasaMaquinasLayout title="Atlas de Arquétipos" subtitle="Jardim simbólico da CidaDELA Interior">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Ethical notice */}
        <div className="bg-[#556B57]/10 border border-[#556B57]/20 rounded-lg px-4 py-2.5 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-[#C9A24A] mt-0.5 shrink-0" />
          <p className="text-[11px] text-[#F5F1E8]/50 leading-relaxed">
            Arquétipos são forças simbólicas em movimento — não tipos fixos de personalidade. Use como ferramenta de leitura, não como rótulo.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-sm mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F5F1E8]/30" />
          <Input
            placeholder="Buscar arquétipo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8] placeholder:text-[#F5F1E8]/30"
          />
        </div>

        {/* Mandala SVG */}
        {!search && (
          <div className="relative w-full max-w-[480px] mx-auto" style={{ aspectRatio: '1/1' }}>
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <filter id="arq-glow">
                  <feGaussianBlur stdDeviation="0.6" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <radialGradient id="arq-center-glow">
                  <stop offset="0%" stopColor="#C9A24A" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="#C9A24A" stopOpacity="0" />
                </radialGradient>
              </defs>

              <MandalaParticles />

              {/* Decorative rings */}
              <circle cx={cx} cy={cy} r={r + 5} fill="none" stroke="rgba(201,162,74,0.03)" strokeWidth="0.12" />
              <circle cx={cx} cy={cy} r={r + 2} fill="none" stroke="rgba(201,162,74,0.06)" strokeWidth="0.15" />
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(201,162,74,0.08)" strokeWidth="0.12" strokeDasharray="0.6 1" />

              {/* Inner rings for territories */}
              <circle cx={cx} cy={cy} r={r * 0.55} fill="none" stroke="rgba(201,162,74,0.05)" strokeWidth="0.1" />

              {/* Center */}
              <circle cx={cx} cy={cy} r="7" fill="url(#arq-center-glow)" />
              <circle cx={cx} cy={cy} r="5" fill="rgba(201,162,74,0.04)" stroke="rgba(201,162,74,0.12)" strokeWidth="0.25">
                <animate attributeName="r" values="4.8;5.3;4.8" dur="5s" repeatCount="indefinite" />
              </circle>
              <text x={cx} y={cy - 1.5} textAnchor="middle" fill="#C9A24A" fontSize="1.8" fontWeight="600" opacity="0.6">Jardim dos</text>
              <text x={cx} y={cy + 1} textAnchor="middle" fill="#C9A24A" fontSize="1.8" fontWeight="600" opacity="0.6">Arquétipos</text>

              {/* Connection lines from center to each archetype */}
              {arquetipos.map((a, i) => {
                const pos = getPos(i, arquetipos.length);
                const color = a.cor_acento || '#C9A24A';
                return (
                  <line key={`line-${a.id}`} x1={cx} y1={cy} x2={pos.x} y2={pos.y}
                    stroke={color} strokeWidth="0.08" strokeOpacity="0.15" />
                );
              })}

              {/* Archetype nodes */}
              {arquetipos.map((a, i) => {
                const pos = getPos(i, arquetipos.length);
                const color = a.cor_acento || '#C9A24A';
                const nodeR = 4;

                return (
                  <g key={a.id} className="cursor-pointer" onClick={() => handleSelect(a)}>
                    {/* Glow */}
                    <circle cx={pos.x} cy={pos.y} r={nodeR + 1} fill="none"
                      stroke={color} strokeWidth="0.12" strokeOpacity="0.2" filter="url(#arq-glow)">
                      <animate attributeName="r" values={`${nodeR + 0.5};${nodeR + 1.5};${nodeR + 0.5}`} dur="4s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
                      <animate attributeName="stroke-opacity" values="0.15;0.3;0.15" dur="4s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
                    </circle>

                    {/* Main circle */}
                    <circle cx={pos.x} cy={pos.y} r={nodeR}
                      fill={`${color}15`} stroke={color} strokeWidth="0.35" strokeOpacity="0.5" />

                    {/* Emoji icon */}
                    <text x={pos.x} y={pos.y + 1} textAnchor="middle" fontSize="3.5">
                      {a.icone || '✦'}
                    </text>

                    {/* Name label */}
                    <text x={pos.x} y={pos.y + nodeR + 2.5} textAnchor="middle"
                      fill={color} fontSize="1.6" fontWeight="500" opacity="0.8">
                      {a.nome.length > 14 ? a.nome.slice(0, 13) + '…' : a.nome}
                    </text>

                    {/* Territory tag */}
                    <text x={pos.x} y={pos.y + nodeR + 4.2} textAnchor="middle"
                      fill="rgba(245,241,232,0.25)" fontSize="1.1">
                      {TERRITORY_META[a.territorio]?.label || a.territorio}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {/* Territory legend */}
        {!search && (
          <div className="flex items-center justify-center gap-5 flex-wrap">
            {Object.entries(TERRITORY_META).map(([key, meta]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: `${meta.color}30`, border: `1px solid ${meta.color}50` }} />
                <span className="text-[10px] text-[#F5F1E8]/40">{meta.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Filtered list (shown when searching) */}
        {search && (
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <p className="text-center text-[#F5F1E8]/30 py-10">Nenhum resultado</p>
            ) : (
              filtered.map(a => (
                <button
                  key={a.id}
                  onClick={() => handleSelect(a)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#0B1B2B]/60 border border-[#C9A24A]/8 hover:border-[#C9A24A]/20 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: (a.cor_acento || '#C9A24A') + '15' }}>
                    <span className="text-lg">{a.icone || '✦'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-[#F5F1E8]">{a.nome}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-[8px] border-[#556B57]/30 text-[#556B57]">
                        {TERRITORY_META[a.territorio]?.label || a.territorio}
                      </Badge>
                    </div>
                  </div>
                  <Eye className="w-4 h-4 text-[#F5F1E8]/20" />
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={v => !v && setSheetOpen(false)}>
        <SheetContent
          side="right"
          className="bg-[#0B1B2B] border-l border-[#C9A24A]/15 w-full sm:max-w-md p-0"
        >
          {selected && (
            <>
              <SheetHeader className="p-5 pb-3 border-b border-[#C9A24A]/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: (selected.cor_acento || '#C9A24A') + '15', border: `1px solid ${selected.cor_acento || '#C9A24A'}40` }}>
                    <span className="text-2xl">{selected.icone || '✦'}</span>
                  </div>
                  <div>
                    <SheetTitle className="text-[#F5F1E8] text-lg">{selected.nome}</SheetTitle>
                    <Badge variant="outline" className="text-[9px] mt-0.5" style={{ borderColor: (selected.cor_acento || '#C9A24A') + '40', color: selected.cor_acento || '#C9A24A' }}>
                      {TERRITORY_META[selected.territorio]?.label || selected.territorio}
                    </Badge>
                  </div>
                </div>
              </SheetHeader>

              <ScrollArea className="h-[calc(100vh-100px)]">
                <div className="p-5 space-y-5">
                  {/* Essência */}
                  <div>
                    <h4 className="text-[10px] uppercase tracking-wider text-[#C9A24A]/60 mb-1.5 flex items-center gap-1">
                      <Flower2 className="w-3 h-3" /> Essência Simbólica
                    </h4>
                    <p className="text-sm text-[#F5F1E8]/60 leading-relaxed">{selected.descricao_clinica}</p>
                  </div>

                  <Separator className="bg-[#C9A24A]/8" />

                  {/* Manifestações */}
                  {selected.manifestacoes_frequentes?.length > 0 && (
                    <div>
                      <h4 className="text-[10px] uppercase tracking-wider text-[#C9A24A]/60 mb-1.5 flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" /> Manifestações na Psique
                      </h4>
                      <ul className="space-y-1.5">
                        {selected.manifestacoes_frequentes.map((m: string, i: number) => (
                          <li key={i} className="text-xs text-[#F5F1E8]/50 pl-3 border-l-2 border-[#C9A24A]/15">{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Separator className="bg-[#C9A24A]/8" />

                  {/* Sombra */}
                  {selected.riscos_projecao?.length > 0 && (
                    <div>
                      <h4 className="text-[10px] uppercase tracking-wider text-red-400/60 mb-1.5 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Sombra Possível
                      </h4>
                      <ul className="space-y-1.5">
                        {selected.riscos_projecao.map((r: string, i: number) => (
                          <li key={i} className="text-xs text-red-400/50 pl-3 border-l-2 border-red-400/15">{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Separator className="bg-[#C9A24A]/8" />

                  {/* Perguntas clínicas */}
                  {selected.perguntas_sessao?.length > 0 && (
                    <div>
                      <h4 className="text-[10px] uppercase tracking-wider text-[#556B57]/80 mb-1.5">Perguntas Clínicas</h4>
                      <ul className="space-y-2">
                        {selected.perguntas_sessao.map((p: string, i: number) => (
                          <li key={i} className="text-xs text-[#F5F1E8]/50 pl-3 border-l-2 border-[#556B57]/20 italic">"{p}"</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Separator className="bg-[#C9A24A]/8" />

                  {/* Intervenção sugerida */}
                  {selected.trabalhar_forca_sem_reforcar_ferida && (
                    <div>
                      <h4 className="text-[10px] uppercase tracking-wider text-[#C9A24A]/60 mb-1.5 flex items-center gap-1">
                        <Shield className="w-3 h-3" /> Intervenção Sugerida
                      </h4>
                      <p className="text-xs text-[#F5F1E8]/50 leading-relaxed">{selected.trabalhar_forca_sem_reforcar_ferida}</p>
                    </div>
                  )}

                  {/* Distrito associado */}
                  <div className="bg-[#C9A24A]/[0.04] border border-[#C9A24A]/10 rounded-lg p-3">
                    <p className="text-[10px] uppercase tracking-wider text-[#C9A24A]/50 mb-1">Distrito Associado</p>
                    <p className="text-xs text-[#F5F1E8]/60">Jardim dos Arquétipos</p>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>
    </CasaMaquinasLayout>
  );
}
