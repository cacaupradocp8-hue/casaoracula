import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCartografiaGPS } from '@/hooks/useCartografiaGPS';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Map, Sparkles, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { CORES_SIMBOLICAS, TERRITORIOS, SIMBOLOS, SUGESTOES_RECURSOS, SUGESTOES_CONFLITOS } from './constants';
import { TelaAbertura } from './TelaAbertura';
import { TelaCor } from './TelaCor';
import { TelaAtmosfera } from './TelaAtmosfera';
import { TelaTerritorios } from './TelaTerritorios';
import { TelaTexto } from './TelaTexto';
import { TelaSimbolo } from './TelaSimbolo';
import { TelaPontoPartida } from './TelaPontoPartida';
import { TelaVisualizacao } from './TelaVisualizacao';
import { CamadaLeituraPsiquica } from '@/components/cartografia-unificada/CamadaLeituraPsiquica';
import { CamadaCidadela } from '@/components/cartografia-unificada/CamadaCidadela';
import { CamadaDirecaoClinica } from '@/components/cartografia-unificada/CamadaDirecaoClinica';

interface Props {
  clienteId: string;
}

export function CartografiaPsiquicaOracula({ clienteId }: Props) {
  const { user } = useAuth();
  const { saveClientCartografia } = useCartografiaGPS();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'list' | 'wizard' | 'result'>('list');
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Wizard state
  const [cor, setCor] = useState('');
  const [atmosfera, setAtmosfera] = useState<string[]>([]);
  const [territorios, setTerritorios] = useState<string[]>([]);
  const [recursos, setRecursos] = useState('');
  const [conflitos, setConflitos] = useState('');
  const [simbolo, setSimbolo] = useState('');
  const [porQueSimbolo, setPorQueSimbolo] = useState('');
  const [pontoPartida, setPontoPartida] = useState('');

  // AI result
  const [aiResult, setAiResult] = useState<any>(null);
  const [activeLayer, setActiveLayer] = useState(0);
  const [generatingAI, setGeneratingAI] = useState(false);

  useEffect(() => { loadRecords(); }, [clienteId]);

  const loadRecords = async () => {
    const { data } = await supabase
      .from('cartografia_psiquica')
      .select('*')
      .eq('client_id', clienteId)
      .order('created_at', { ascending: false });
    setRecords(data || []);
    setLoading(false);
  };

  const toggleAtmosfera = (d: string) => {
    setAtmosfera(prev =>
      prev.includes(d) ? prev.filter(x => x !== d) : prev.length < 4 ? [...prev, d] : prev
    );
  };

  const toggleTerritorio = (t: string) => {
    setTerritorios(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : prev.length < 5 ? [...prev, t] : prev
    );
  };

  const calcEquilibrio = (): number => {
    const rLen = recursos.trim().length;
    const cLen = conflitos.trim().length;
    if (rLen === 0 && cLen === 0) return 50;
    return Math.round(rLen / (rLen + cLen) * 100);
  };

  const gerarResumo = (): string => {
    const corObj = CORES_SIMBOLICAS.find(c => c.nome === cor);
    const terrNomes = TERRITORIOS.filter(t => territorios.includes(t.key)).map(t => t.nome);
    return `A cidade interior se apresenta em ${cor} (${corObj?.significado || ''}), ` +
      `com atmosfera ${atmosfera.join(', ').toLowerCase()}. ` +
      `Os territórios mais presentes são ${terrNomes.join(', ')}. ` +
      `O símbolo escolhido — ${simbolo} — marca o centro desta cartografia.`;
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const indice = calcEquilibrio();

    const { error, data: insertedData } = await supabase.from('cartografia_psiquica').insert({
      user_id: user.id,
      client_id: clienteId,
      therapist_id: user.id,
      cor_predominante: cor,
      atmosfera,
      territorios_principais: territorios,
      recursos_internos: recursos || null,
      conflitos_tensoes: conflitos || null,
      simbolo_pessoal: simbolo || null,
      por_que_simbolo: porQueSimbolo || null,
      ponto_partida: pontoPartida || null,
      indice_equilibrio: indice,
      resumo_narrativo: gerarResumo(),
      sugestao_proximo_passo: `Explorar o distrito ${TERRITORIOS.find(t => t.key === pontoPartida)?.nome || 'selecionado'}`,
    }).select();

    if (error) {
      toast.error('Erro ao salvar cartografia');
      setSaving(false);
      return;
    }

    // Update client_city_state
    const distritoCentral = pontoPartida || territorios[0] || 'portao_chegada';
    const distritoNome = TERRITORIOS.find(t => t.key === distritoCentral)?.nome || distritoCentral;

    await supabase.from('client_city_state' as any).upsert({
      client_id: clienteId,
      distrito_ativo: distritoNome,
      ultima_ferramenta_id: null,
      updated_at: new Date().toISOString(),
    } as any, { onConflict: 'client_id' });

    toast.success('Cartografia salva — gerando leitura clínica...');
    setSaving(false);

    // Generate AI reading
    await generateAIReading();
    loadRecords();
  };

  const generateAIReading = async () => {
    setGeneratingAI(true);
    try {
      const { data: aiData, error: aiError } = await supabase.functions.invoke(
        'cartografia-leitura-profunda',
        {
          body: {
            modo: 'cliente',
            cor,
            atmosfera,
            territorios,
            recursos,
            conflitos,
            simbolo,
            ponto_partida: pontoPartida,
            medias_big5: {},
            predominante: null,
            fragilizado: null,
            client_context: `Recursos: ${recursos}\nConflitos: ${conflitos}\nSímbolo: ${simbolo} — ${porQueSimbolo}`,
          },
        }
      );

      if (aiError) {
        console.error('AI Error:', aiError);
        toast.error('Leitura IA não disponível');
      } else {
        setAiResult(aiData);
        setMode('result');
        setActiveLayer(0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingAI(false);
    }
  };

  const viewRecord = async (record: any) => {
    // If record has AI data cached, show it; otherwise regenerate
    setMode('result');
    setAiResult(null);
    setActiveLayer(0);

    // Populate state from record for display
    setCor(record.cor_predominante || '');
    setAtmosfera(record.atmosfera || []);
    setTerritorios(record.territorios_principais || []);
    setRecursos(record.recursos_internos || '');
    setConflitos(record.conflitos_tensoes || '');
    setSimbolo(record.simbolo_pessoal || '');
    setPontoPartida(record.ponto_partida || '');
  };

  const resetWizard = () => {
    setMode('list');
    setStep(0);
    setCor('');
    setAtmosfera([]);
    setTerritorios([]);
    setRecursos('');
    setConflitos('');
    setSimbolo('');
    setPorQueSimbolo('');
    setPontoPartida('');
    setAiResult(null);
  };

  const startNew = () => {
    resetWizard();
    setMode('wizard');
  };

  if (loading) {
    return <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>;
  }

  // ── RESULT MODE ──
  if (mode === 'result') {
    const corObj = CORES_SIMBOLICAS.find(c => c.nome === cor);
    const simboloObj = SIMBOLOS.find(s => s.nome === simbolo);

    return (
      <div className="max-w-2xl mx-auto space-y-6 overflow-x-hidden">
        <Button variant="ghost" size="sm" onClick={resetWizard} className="mb-2">
          ← Voltar para lista
        </Button>

        {generatingAI && (
          <div className="text-center py-12 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">Gerando leitura clínica...</p>
          </div>
        )}

        {aiResult && (
          <>
            {/* Layer tabs */}
            <div className="flex justify-center gap-1 flex-wrap">
              {['Leitura Psíquica', 'CidaDELA', 'Direção Clínica'].map((label, i) => (
                <button key={label} onClick={() => setActiveLayer(i)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeLayer === i
                      ? 'bg-primary/15 text-primary border border-primary/30'
                      : 'text-muted-foreground/50 hover:text-muted-foreground border border-transparent'
                  }`}>
                  {label}
                </button>
              ))}
            </div>

            {activeLayer === 0 && aiResult.leitura_psiquica && (
              <CamadaLeituraPsiquica data={aiResult.leitura_psiquica} />
            )}
            {activeLayer === 1 && aiResult.cidadela && (
              <CamadaCidadela
                data={aiResult.cidadela}
                cor={cor}
                corHex={corObj?.hex || '#C9A24A'}
                atmosfera={atmosfera}
                simbolo={simbolo}
                simboloIcon={simboloObj?.icon || '✨'}
                territorios={territorios}
                pontoPartida={pontoPartida}
              />
            )}
            {activeLayer === 2 && aiResult.direcao_clinica && (
              <CamadaDirecaoClinica data={aiResult.direcao_clinica} modo="cliente" />
            )}
          </>
        )}

        {!generatingAI && !aiResult && (
          <div className="text-center py-8 space-y-3">
            <p className="text-sm text-muted-foreground">Leitura IA não disponível para este registro.</p>
            <Button variant="outline" size="sm" onClick={generateAIReading}>
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Gerar leitura agora
            </Button>
          </div>
        )}
      </div>
    );
  }

  // ── WIZARD MODE ──
  if (mode === 'wizard') {
    return (
      <div className="max-w-lg mx-auto overflow-x-hidden">
        <div className="flex gap-1 mb-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-muted'}`} />
          ))}
        </div>

        {step === 0 && <TelaAbertura onNext={() => setStep(1)} />}
        {step === 1 && <TelaCor selected={cor} onSelect={setCor} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
        {step === 2 && <TelaAtmosfera selected={atmosfera} onToggle={toggleAtmosfera} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
        {step === 3 && <TelaTerritorios selected={territorios} onToggle={toggleTerritorio} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
        {step === 4 && (
          <TelaTexto
            title="Onde essa cliente encontra força e segurança?"
            subtitle="Descreva os recursos internos observados"
            value={recursos}
            onChange={setRecursos}
            suggestions={SUGESTOES_RECURSOS}
            onNext={() => setStep(5)}
            onBack={() => setStep(3)}
          />
        )}
        {step === 5 && (
          <TelaTexto
            title="Quais territórios estão em tensão?"
            subtitle="Descreva conflitos ou áreas de sombra observados"
            value={conflitos}
            onChange={setConflitos}
            suggestions={SUGESTOES_CONFLITOS}
            onNext={() => setStep(6)}
            onBack={() => setStep(4)}
          />
        )}
        {step === 6 && (
          <TelaSimbolo
            selected={simbolo}
            onSelect={setSimbolo}
            motivo={porQueSimbolo}
            onMotivo={setPorQueSimbolo}
            onNext={() => setStep(7)}
            onBack={() => setStep(5)}
          />
        )}
        {step === 7 && (
          <TelaPontoPartida
            territoriosSelecionados={territorios}
            selected={pontoPartida}
            onSelect={setPontoPartida}
            onNext={() => setStep(8)}
            onBack={() => setStep(6)}
          />
        )}
        {step === 8 && (
          <TelaVisualizacao
            cor={cor}
            atmosfera={atmosfera}
            territorios={territorios}
            recursos={recursos}
            conflitos={conflitos}
            simbolo={simbolo}
            pontoPartida={pontoPartida}
            indiceEquilibrio={calcEquilibrio()}
            saving={saving}
            onSave={handleSave}
            onBack={() => setStep(7)}
          />
        )}
      </div>
    );
  }

  // ── LIST MODE ──
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Cartografias Psíquicas</h3>
        <Button size="sm" onClick={startNew}>
          <Plus className="w-3.5 h-3.5 mr-1" /> Nova
        </Button>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <Map className="w-8 h-8 mx-auto text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground/50">Nenhuma cartografia psíquica registrada</p>
          <Button variant="outline" size="sm" onClick={startNew}>Criar primeira cartografia</Button>
        </div>
      ) : (
        records.map(r => {
          const corObj = CORES_SIMBOLICAS.find(c => c.nome === r.cor_predominante);
          const simbObj = SIMBOLOS.find(s => s.nome === r.simbolo_pessoal);
          return (
            <Card key={r.id} className="border-border/20 bg-card/60 cursor-pointer hover:border-primary/30 transition-colors"
              onClick={() => viewRecord(r)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full shrink-0" style={{ backgroundColor: corObj?.hex || '#666' }} />
                    <span className="text-sm font-medium text-foreground">
                      {new Date(r.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {simbObj && <span className="text-lg">{simbObj.icon}</span>}
                    <Eye className="w-3.5 h-3.5 text-muted-foreground/40" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-2">
                  {(r.atmosfera || []).map((a: string) => (
                    <Badge key={a} variant="outline" className="text-[9px] border-primary/20 text-primary/70">{a}</Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1 mb-2">
                  {(r.territorios_principais || []).map((t: string) => {
                    const tObj = TERRITORIOS.find(x => x.key === t);
                    return tObj ? (
                      <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground">
                        {tObj.icon} {tObj.nome}
                      </span>
                    ) : null;
                  })}
                </div>

                {r.indice_equilibrio != null && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${r.indice_equilibrio}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium">{r.indice_equilibrio}%</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
