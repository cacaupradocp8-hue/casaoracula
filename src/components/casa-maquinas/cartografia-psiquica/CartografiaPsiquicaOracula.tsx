import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { upsertCartografiaProfile } from '@/lib/dal/cartografiaProfile';
import { calcularLeitura } from '@/lib/cartografia/leituraComportamental';
import { derivarCidadela } from '@/lib/cartografia/derivacaoCidadela';
import { useAuth } from '@/contexts/AuthContext';
import { useCartografiaGPS } from '@/hooks/useCartografiaGPS';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Map, Sparkles, Eye, Stethoscope } from 'lucide-react';
import { toast } from 'sonner';
import { useBig5Oracular } from '@/hooks/useBig5Oracular';
import { SaidaClinica } from '@/components/cartografia-unificada/SaidaClinica';
import { CamadaLeituraPsiquica } from '@/components/cartografia-unificada/CamadaLeituraPsiquica';
import { CamadaCidadela } from '@/components/cartografia-unificada/CamadaCidadela';
import { CamadaDirecaoClinica } from '@/components/cartografia-unificada/CamadaDirecaoClinica';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface Props {
  clienteId: string;
}

type Mode = 'list' | 'questionnaire' | 'generating' | 'result';

export function CartografiaPsiquicaOracula({ clienteId }: Props) {
  const { user } = useAuth();
  const { saveClientCartografia } = useCartografiaGPS();
  const {
    fatores, perguntas, loading: loadingBig5,
    calcularMedias, getIntensidade,
  } = useBig5Oracular();

  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>('list');
  const [saving, setSaving] = useState(false);

  // Questionnaire state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, number>>({});

  // Results
  const [leituraResult, setLeituraResult] = useState<ReturnType<typeof calcularLeitura> | null>(null);
  const [cidadelaResult, setCidadelaResult] = useState<ReturnType<typeof derivarCidadela> | null>(null);
  const [aiResult, setAiResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Derived
  const allQuestions = fatores.flatMap(f =>
    perguntas.filter(p => p.fator_id === f.id).sort((a, b) => a.ordem - b.ordem)
  );
  const totalQ = allQuestions.length;
  const currentQ = allQuestions[currentQIndex];
  const currentFator = currentQ ? fatores.find(f => f.id === currentQ.fator_id) : null;

  const opcoes = [
    { value: 1, label: 'Nunca / Quase nunca' },
    { value: 2, label: 'Raramente' },
    { value: 3, label: 'Às vezes' },
    { value: 4, label: 'Frequentemente' },
    { value: 5, label: 'Quase sempre' },
  ];

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

  const handleAnswer = (value: number) => {
    if (!currentQ) return;
    setRespostas(prev => ({ ...prev, [currentQ.id]: value }));
    if (currentQIndex < totalQ - 1) {
      setTimeout(() => setCurrentQIndex(prev => prev + 1), 250);
    }
  };

  const handleCompleteQuestionnaire = async () => {
    if (!user) return;
    setMode('generating');
    setSaving(true);

    try {
      const big5Result = calcularMedias(respostas);
      const medias = big5Result.medias;

      // Calculate behavioral reading
      const leitura = calcularLeitura(medias, 'casa_das_maquinas');
      setLeituraResult(leitura);

      // Auto-derive CidaDELA
      const cidadela = derivarCidadela(medias, leitura.profile.tensao_central);
      setCidadelaResult(cidadela);

      // Save cartografia to DB (no subjective data)
      const { data: cartoInserted, error } = await supabase.from('cartografia_psiquica').insert({
        user_id: user.id,
        client_id: clienteId,
        therapist_id: user.id,
        cor_predominante: cidadela.cor_derivada,
        atmosfera: cidadela.atmosfera_derivada,
        territorios_principais: cidadela.distritos_acesos,
        recursos_internos: null,
        conflitos_tensoes: null,
        simbolo_pessoal: cidadela.simbolo_derivado,
        por_que_simbolo: null,
        ponto_partida: cidadela.porta_inicial,
        indice_equilibrio: cidadela.indice_equilibrio,
        resumo_narrativo: `Eixo dominante: ${cidadela.porta_inicial_nome}. Torre: ${cidadela.torre_dominante}. Clima: ${cidadela.clima_cidade}.`,
        sugestao_proximo_passo: `Trabalhar a ${cidadela.porta_inicial_nome} com ritmo ${leitura.profile.ritmo_ideal}`,
        metadata_json: { 
          medias_big5: medias, 
          predominante: big5Result.predominante?.chave,
          fragilizado: big5Result.fragilizado?.chave,
          derivacao_automatica: true,
        },
      }).select();

      if (error || !cartoInserted?.[0]) {
        toast.error('Erro ao salvar cartografia');
        setMode('list');
        return;
      }

      const cartografiaId = cartoInserted[0].id;

      // Persist behavioral profile
      try {
        await upsertCartografiaProfile({
          userId: user.id,
          cartografiaId,
          leitura,
          mediasRaw: medias,
          therapistUserId: user.id,
        });
      } catch (e) {
        console.error('Erro ao persistir perfil comportamental:', e);
      }

      // Update client_city_state
      await supabase.from('client_city_state' as any).upsert({
        client_id: clienteId,
        distrito_ativo: cidadela.porta_inicial_nome,
        ultima_ferramenta_id: null,
        updated_at: new Date().toISOString(),
      } as any, { onConflict: 'client_id' });

      // Save Big5 oracular registro for the client
      await supabase.from('big5_oracular_registros').insert({
        user_id: user.id,
        respostas_json: respostas,
        medias_json: medias,
        fator_predominante: big5Result.predominante?.chave || null,
        fator_fragilizado: big5Result.fragilizado?.chave || null,
      });

      // Generate AI deep reading
      try {
        const { data: aiData, error: aiError } = await supabase.functions.invoke(
          'cartografia-leitura-profunda',
          {
            body: {
              modo: 'cliente',
              medias_big5: medias,
              predominante: big5Result.predominante?.chave,
              fragilizado: big5Result.fragilizado?.chave,
              cidadela_derivada: cidadela,
              leitura_comportamental: {
                tensao_central: leitura.profile.tensao_central,
                estrategia_defesa: leitura.profile.estrategia_defesa,
                medo_dominante: leitura.profile.medo_dominante,
                ritmo_ideal: leitura.profile.ritmo_ideal,
              },
            },
          }
        );

        if (!aiError && aiData) {
          setAiResult(aiData);
          await saveClientCartografia(clienteId, aiData);
        }
      } catch (err) {
        console.error('AI reading error:', err);
      }

      toast.success('Cartografia diagnóstica salva');
      setMode('result');
      setActiveTab(0);
      loadRecords();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao processar cartografia');
      setMode('list');
    } finally {
      setSaving(false);
    }
  };

  const viewRecord = async (record: any) => {
    // Try to reconstruct reading from metadata
    const metadata = record.metadata_json || {};
    const medias = metadata.medias_big5;

    if (medias && Object.keys(medias).length > 0) {
      const leitura = calcularLeitura(medias, 'casa_das_maquinas');
      setLeituraResult(leitura);
      const cidadela = derivarCidadela(medias, leitura.profile.tensao_central);
      setCidadelaResult(cidadela);
    } else {
      setLeituraResult(null);
      setCidadelaResult(null);
    }

    setAiResult(null);
    setMode('result');
    setActiveTab(0);
  };

  const resetToList = () => {
    setMode('list');
    setCurrentQIndex(0);
    setRespostas({});
    setLeituraResult(null);
    setCidadelaResult(null);
    setAiResult(null);
  };

  if (loading || loadingBig5) {
    return <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>;
  }

  // ── RESULT MODE ──
  if (mode === 'result') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 overflow-x-hidden">
        <Button variant="ghost" size="sm" onClick={resetToList} className="mb-2">
          ← Voltar para lista
        </Button>

        {leituraResult && cidadelaResult ? (
          <>
            {/* Tabs: Clínica | AI Leitura | AI CidaDELA | AI Direção */}
            <div className="flex justify-center gap-1 flex-wrap">
              {['Saída Clínica', ...(aiResult ? ['Leitura IA', 'CidaDELA IA', 'Direção IA'] : [])].map((label, i) => (
                <button key={label} onClick={() => setActiveTab(i)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeTab === i
                      ? 'bg-primary/15 text-primary border border-primary/30'
                      : 'text-muted-foreground/50 hover:text-muted-foreground border border-transparent'
                  }`}>
                  {label}
                </button>
              ))}
            </div>

            {activeTab === 0 && (
              <SaidaClinica leitura={leituraResult} cidadela={cidadelaResult} />
            )}
            {activeTab === 1 && aiResult?.leitura_psiquica && (
              <CamadaLeituraPsiquica data={aiResult.leitura_psiquica} />
            )}
            {activeTab === 2 && aiResult?.cidadela && (
              <CamadaCidadela
                data={aiResult.cidadela}
                cor={cidadelaResult.cor_derivada}
                corHex={cidadelaResult.cor_hex}
                atmosfera={cidadelaResult.atmosfera_derivada}
                simbolo={cidadelaResult.simbolo_derivado}
                simboloIcon={cidadelaResult.simbolo_icon}
                territorios={cidadelaResult.distritos_acesos}
                pontoPartida={cidadelaResult.porta_inicial}
              />
            )}
            {activeTab === 3 && aiResult?.direcao_clinica && (
              <CamadaDirecaoClinica data={aiResult.direcao_clinica} modo="cliente" />
            )}
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <p>Registro anterior sem dados de médias disponíveis.</p>
            <p className="text-xs text-muted-foreground/50 mt-1">Crie uma nova cartografia para obter a leitura completa.</p>
          </div>
        )}
      </div>
    );
  }

  // ── GENERATING MODE ──
  if (mode === 'generating') {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Processando leitura diagnóstica...</p>
        <p className="text-xs text-muted-foreground/40">Derivando CidaDELA automaticamente</p>
      </div>
    );
  }

  // ── QUESTIONNAIRE MODE ──
  if (mode === 'questionnaire' && currentQ && currentFator) {
    const progressPct = totalQ > 0 ? ((currentQIndex + 1) / totalQ) * 100 : 0;

    return (
      <div className="max-w-xl mx-auto space-y-5 overflow-x-hidden">
        {/* Progress */}
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progressPct}%` }} />
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Diagnóstico — Leitura de Campo</span>
          <span>{currentQIndex + 1} / {totalQ}</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full w-fit mx-auto"
          style={{ backgroundColor: `${currentFator.cor_primaria}15` }}>
          <span className="text-base">{currentFator.simbolo}</span>
          <span className="text-xs font-medium" style={{ color: currentFator.cor_primaria }}>
            {currentFator.nome}
          </span>
        </div>

        <Card className="border-border/10 bg-card/60">
          <CardContent className="py-6 px-5">
            <p className="text-base text-center leading-relaxed mb-6 text-foreground/90">
              "{currentQ.texto_pergunta}"
            </p>
            <div className="space-y-2">
              {opcoes.map(o => (
                <button key={o.value} onClick={() => handleAnswer(o.value)}
                  className={`w-full p-3 rounded-lg border transition-all text-left text-sm ${
                    respostas[currentQ.id] === o.value
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border/20 hover:border-border/50 text-foreground/70'
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      respostas[currentQ.id] === o.value ? 'border-primary bg-primary' : 'border-muted-foreground/20'
                    }`}>
                      {respostas[currentQ.id] === o.value && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <span>{o.value} — {o.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="ghost" size="sm" onClick={() => {
            if (currentQIndex > 0) setCurrentQIndex(p => p - 1);
            else resetToList();
          }}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
          {currentQIndex === totalQ - 1 ? (
            <Button size="sm" variant="gold" onClick={handleCompleteQuestionnaire}
              disabled={Object.keys(respostas).length < totalQ || saving}>
              <Sparkles className="w-4 h-4 mr-1" /> Gerar leitura diagnóstica
            </Button>
          ) : (
            <Button size="sm" onClick={() => setCurrentQIndex(p => p + 1)}
              disabled={!respostas[currentQ.id]}>
              Próxima <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // ── LIST MODE ──
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Cartografias Diagnósticas</h3>
        <Button size="sm" onClick={() => { resetToList(); setMode('questionnaire'); }}>
          <Plus className="w-3.5 h-3.5 mr-1" /> Novo diagnóstico
        </Button>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <Stethoscope className="w-8 h-8 mx-auto text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground/50">Nenhuma cartografia diagnóstica registrada</p>
          <Button variant="outline" size="sm" onClick={() => { resetToList(); setMode('questionnaire'); }}>
            Iniciar primeiro diagnóstico
          </Button>
        </div>
      ) : (
        records.map(r => {
          const metadata = r.metadata_json || {};
          const isAutomatic = metadata.derivacao_automatica;
          return (
            <Card key={r.id} className="border-border/20 bg-card/60 cursor-pointer hover:border-primary/30 transition-colors"
              onClick={() => viewRecord(r)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    {new Date(r.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <div className="flex items-center gap-2">
                    {isAutomatic && (
                      <Badge variant="outline" className="text-[9px] border-primary/20 text-primary/70">Auto-derivada</Badge>
                    )}
                    <Eye className="w-3.5 h-3.5 text-muted-foreground/40" />
                  </div>
                </div>
                {r.resumo_narrativo && (
                  <p className="text-xs text-muted-foreground/60 line-clamp-2">{r.resumo_narrativo}</p>
                )}
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
