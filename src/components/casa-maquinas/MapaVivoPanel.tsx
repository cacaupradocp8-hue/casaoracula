import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle, CheckCircle, Info, Map, Sparkles, Brain, FileText, ChevronRight, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
  detectAllPatterns,
  getNextStepSuggestion,
  getDistrictFrequency,
  generateMonthlySynthesis,
  type PatternFlag,
  type NextStepSuggestion,
  type DetectionInput,
} from '@/lib/mapa-vivo-engine';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const SEVERITY_CONFIG = {
  high: { icon: AlertTriangle, color: '#E879A0', bg: 'rgba(232,121,160,0.08)', border: 'rgba(232,121,160,0.2)' },
  medium: { icon: Info, color: '#C9A24A', bg: 'rgba(201,162,74,0.08)', border: 'rgba(201,162,74,0.2)' },
  low: { icon: CheckCircle, color: '#556B57', bg: 'rgba(85,107,87,0.08)', border: 'rgba(85,107,87,0.2)' },
};

const CHART_COLORS = ['#C9A24A', '#6366F1', '#556B57', '#E879A0', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'];

interface Props {
  clientId: string;
}

export function MapaVivoPanel({ clientId }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [labyrinthRecords, setLabyrinthRecords] = useState<any[]>([]);
  const [cartographyData, setCartographyData] = useState<any[]>([]);
  const [journeyDistricts, setJourneyDistricts] = useState<any[]>([]);
  const [dreams, setDreams] = useState<any[]>([]);
  const [showSynthesis, setShowSynthesis] = useState(false);
  const [showNextStep, setShowNextStep] = useState(false);
  const [savingSynthesis, setSavingSynthesis] = useState(false);

  useEffect(() => {
    if (user && clientId) loadAllData();
  }, [user, clientId]);

  const loadAllData = async () => {
    if (!user) return;
    setLoading(true);

    const [sessRes, distRes, labRes, cartRes, dreamRes, jdRes] = await Promise.all([
      supabase.from('sessions').select('id, date, district_id, tool_id, checkin_state, oracle_card_id, insight')
        .eq('client_id', clientId).order('date', { ascending: false }).limit(20),
      supabase.from('districts').select('id, nome, numero').order('numero'),
      supabase.from('labyrinth_records').select('*').eq('client_id', clientId).order('created_at', { ascending: false }).limit(10),
      supabase.from('cartographies').select('*').eq('client_id', clientId).order('date', { ascending: false }).limit(10),
      supabase.from('dreams').select('*').eq('client_id', clientId).order('date', { ascending: false }).limit(10),
      supabase.from('journey_districts').select('*'),
    ]);

    setSessions(sessRes.data || []);
    setDistricts(distRes.data || []);
    setLabyrinthRecords(labRes.data || []);
    setCartographyData(cartRes.data || []);
    setDreams(dreamRes.data || []);
    setJourneyDistricts(jdRes.data || []);
    setLoading(false);
  };

  const districtNames = useMemo(() => {
    const m: Record<string, string> = {};
    districts.forEach(d => { m[d.id] = d.nome; });
    return m;
  }, [districts]);

  const sessionsWithNames = useMemo(() =>
    sessions.map(s => ({ ...s, district_name: s.district_id ? districtNames[s.district_id] : null })),
    [sessions, districtNames]
  );

  const detectionInput: DetectionInput = useMemo(() => ({
    sessions: sessionsWithNames,
    labyrinthRecords,
    cartographyData,
    journeyDistricts,
    districtNames,
    dreams,
  }), [sessionsWithNames, labyrinthRecords, cartographyData, journeyDistricts, districtNames, dreams]);

  const flags = useMemo(() => detectAllPatterns(detectionInput), [detectionInput]);
  const nextStep = useMemo(() => getNextStepSuggestion(flags, dreams, districtNames), [flags, dreams, districtNames]);
  const districtFreq = useMemo(() => getDistrictFrequency(sessionsWithNames, districtNames), [sessionsWithNames, districtNames]);
  const synthesis = useMemo(() => generateMonthlySynthesis(flags, sessionsWithNames, districtNames), [flags, sessionsWithNames, districtNames]);

  const saveSynthesis = async () => {
    if (!user) return;
    setSavingSynthesis(true);
    const now = new Date();
    const range = `month_${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}`;

    const { error } = await supabase.from('symbolic_insights').insert({
      scope_type: 'client',
      scope_id: clientId,
      generated_for_range: range,
      insights_json: { text: synthesis, flags: flags.map(f => ({ type: f.flag_type, title: f.title })), generated_at: now.toISOString() },
    } as any);

    if (error) {
      toast.error('Erro ao salvar síntese');
    } else {
      toast.success('Síntese simbólica salva');
    }
    setSavingSynthesis(false);
  };

  const saveFlags = async () => {
    if (!user || flags.length === 0) return;
    const inserts = flags.map(f => ({
      scope_type: 'client' as const,
      scope_id: clientId,
      flag_type: f.flag_type,
      title: f.title,
      message: f.message,
      severity: f.severity,
      supporting_data_json: f.supporting_data,
    }));

    await supabase.from('pattern_flags').insert(inserts as any[]);
  };

  // Auto-save flags on detection
  useEffect(() => {
    if (!loading && flags.length > 0) {
      saveFlags();
    }
  }, [loading, flags.length]);

  if (loading) {
    return (
      <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
        <CardContent className="p-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#C9A24A]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Ethical notice */}
      <div className="flex items-start gap-2 px-3 py-2 rounded-md bg-[#C9A24A]/5 border border-[#C9A24A]/10">
        <Eye className="w-4 h-4 text-[#C9A24A]/50 mt-0.5 shrink-0" />
        <p className="text-[10px] text-[#C9A24A]/50 italic">
          Ferramenta de leitura simbólica. Não substitui julgamento clínico.
        </p>
      </div>

      {/* Pattern Flags */}
      {flags.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-[#F5F1E8]/40 uppercase tracking-wider flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5" />
            Leituras do Campo ({flags.length})
          </h3>
          {flags.slice(0, 6).map((flag, i) => {
            const config = SEVERITY_CONFIG[flag.severity];
            const Icon = config.icon;
            return (
              <Card key={i} className="border" style={{ borderColor: config.border, backgroundColor: config.bg }}>
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: config.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-medium text-[#F5F1E8]/80">{flag.title}</p>
                        <Badge variant="outline" className="text-[7px] py-0" style={{ borderColor: config.border, color: config.color }}>
                          {flag.severity}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-[#F5F1E8]/50 mt-1 leading-relaxed">{flag.message}</p>
                      {flag.suggestions && (
                        <div className="mt-2 space-y-0.5">
                          {flag.suggestions.map((s, j) => (
                            <p key={j} className="text-[9px] text-[#556B57]/70">• {s}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {flags.length === 0 && sessions.length > 0 && (
        <Card className="border-[#556B57]/10 bg-[#556B57]/5">
          <CardContent className="p-3 text-center">
            <CheckCircle className="w-4 h-4 text-[#556B57]/50 mx-auto mb-1" />
            <p className="text-[10px] text-[#556B57]/60">Sem padrões significativos detectados. A jornada segue em observação.</p>
          </CardContent>
        </Card>
      )}

      {/* District Frequency Chart */}
      {districtFreq.length > 0 && (
        <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-xs text-[#F5F1E8]/40 uppercase tracking-wider">
              Frequência de Distritos (últimas 10 sessões)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={districtFreq} layout="vertical" margin={{ left: 0, right: 10 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 9, fill: '#F5F1E850' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B1B2B', border: '1px solid rgba(201,162,74,0.2)', borderRadius: 6, fontSize: 10, color: '#F5F1E8' }}
                  formatter={(val: number) => [`${val} sessões`, 'Frequência']}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {districtFreq.map((_, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} opacity={0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Compact Timeline */}
      {sessions.length > 0 && (
        <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-xs text-[#F5F1E8]/40 uppercase tracking-wider">
              Linha do Tempo Compacta
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="flex gap-1 overflow-x-auto pb-1">
              {sessions.slice(0, 10).reverse().map((s, i) => (
                <div key={s.id} className="flex flex-col items-center gap-0.5 min-w-[40px]">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold"
                    style={{
                      backgroundColor: s.checkin_state === 'instavel' ? 'rgba(232,121,160,0.2)'
                        : s.checkin_state === 'presente' ? 'rgba(85,107,87,0.2)'
                        : 'rgba(201,162,74,0.1)',
                      color: s.checkin_state === 'instavel' ? '#E879A0'
                        : s.checkin_state === 'presente' ? '#556B57'
                        : '#C9A24A80',
                    }}
                  >
                    {i + 1}
                  </div>
                  <span className="text-[7px] text-[#F5F1E8]/30 text-center leading-tight">
                    {s.district_id ? (districtNames[s.district_id] || '').slice(0, 6) : '—'}
                  </span>
                  <span className="text-[6px] text-[#F5F1E8]/20">
                    {format(new Date(s.date), 'dd/MM', { locale: ptBR })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowNextStep(!showNextStep)}
          className="text-[10px] h-7 border-[#C9A24A]/20 text-[#C9A24A]/70 hover:text-[#C9A24A]"
        >
          <Sparkles className="w-3 h-3 mr-1" />
          Sugerir próximo passo
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSynthesis(!showSynthesis)}
          className="text-[10px] h-7 border-[#C9A24A]/20 text-[#C9A24A]/70 hover:text-[#C9A24A]"
        >
          <FileText className="w-3 h-3 mr-1" />
          Síntese simbólica do mês
        </Button>
      </div>

      {/* Next Step Card */}
      {showNextStep && (
        <Card className="border-[#6366F1]/20 bg-[#6366F1]/5">
          <CardContent className="p-4">
            <h4 className="text-xs font-semibold text-[#6366F1]/80 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Sugestão de Próximo Passo
            </h4>
            <div className="grid grid-cols-2 gap-3 text-[10px]">
              <div>
                <span className="text-[#F5F1E8]/30 uppercase text-[8px]">Distrito</span>
                <p className="text-[#F5F1E8]/70 font-medium">{nextStep.distrito_sugerido}</p>
              </div>
              <div>
                <span className="text-[#F5F1E8]/30 uppercase text-[8px]">Ferramenta</span>
                <p className="text-[#F5F1E8]/70 font-medium">{nextStep.ferramenta}</p>
              </div>
              <div className="col-span-2">
                <span className="text-[#F5F1E8]/30 uppercase text-[8px]">Pergunta Clínica</span>
                <p className="text-[#F5F1E8]/60 italic">"{nextStep.pergunta_clinica}"</p>
              </div>
              <div className="col-span-2">
                <span className="text-[#F5F1E8]/30 uppercase text-[8px]">Micro-ritual</span>
                <p className="text-[#F5F1E8]/50">{nextStep.micro_ritual}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" className="text-[9px] h-6 bg-[#6366F1]/20 text-[#6366F1] hover:bg-[#6366F1]/30 border-0">
                Aplicar na sessão
              </Button>
              <Button variant="ghost" size="sm" className="text-[9px] h-6 text-[#F5F1E8]/30" onClick={() => setShowNextStep(false)}>
                Ignorar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Monthly Synthesis */}
      {showSynthesis && (
        <Card className="border-[#C9A24A]/15 bg-[#C9A24A]/5">
          <CardContent className="p-4">
            <h4 className="text-xs font-semibold text-[#C9A24A]/70 mb-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Síntese Simbólica
            </h4>
            <pre className="text-[10px] text-[#F5F1E8]/50 whitespace-pre-wrap leading-relaxed font-sans">
              {synthesis}
            </pre>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                onClick={saveSynthesis}
                disabled={savingSynthesis}
                className="text-[9px] h-6 bg-[#C9A24A]/20 text-[#C9A24A] hover:bg-[#C9A24A]/30 border-0"
              >
                {savingSynthesis ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                Salvar síntese
              </Button>
              <Button variant="ghost" size="sm" className="text-[9px] h-6 text-[#F5F1E8]/30" onClick={() => setShowSynthesis(false)}>
                Fechar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {sessions.length === 0 && (
        <Card className="border-[#F5F1E8]/5 bg-[#0B1B2B]/40">
          <CardContent className="p-6 text-center">
            <Map className="w-6 h-6 text-[#F5F1E8]/10 mx-auto mb-2" />
            <p className="text-xs text-[#F5F1E8]/25">Nenhuma sessão registrada para esta cliente.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
