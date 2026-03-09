import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Map } from 'lucide-react';
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

interface Props {
  clienteId: string;
}

export function CartografiaPsiquicaOracula({ clienteId }: Props) {
  const { user } = useAuth();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'list' | 'wizard'>('list');
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
    const ratio = rLen / (rLen + cLen);
    return Math.round(ratio * 100);
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

    const { error } = await supabase.from('cartografia_psiquica').insert({
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
    });

    if (error) {
      toast.error('Erro ao salvar cartografia');
    } else {
      toast.success('Cartografia salva com sucesso');
      resetWizard();
      loadRecords();
    }
    setSaving(false);
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
  };

  const startNew = () => {
    resetWizard();
    setMode('wizard');
  };

  if (loading) {
    return <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>;
  }

  // ---- WIZARD MODE ----
  if (mode === 'wizard') {
    return (
      <div className="max-w-lg mx-auto">
        {/* Progress */}
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
            title="Onde você encontra força, segurança e criatividade?"
            subtitle="Descreva seus recursos internos"
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
            subtitle="Descreva os conflitos ou áreas de sombra"
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

  // ---- LIST MODE ----
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
            <Card key={r.id} className="border-border/20 bg-card/60">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: corObj?.hex || '#666' }} />
                    <span className="text-sm font-medium text-foreground">
                      {new Date(r.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  {simbObj && <span className="text-lg">{simbObj.icon}</span>}
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
