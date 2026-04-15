import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { upsertCartografiaProfile } from '@/lib/dal/cartografiaProfile';
import { montarProfileJson } from '@/lib/cartografia/montarProfileJson';
import { useAuth } from '@/contexts/AuthContext';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { LeituraRevelacao } from '@/components/cartografia/LeituraRevelacao';
import { calcularLeitura } from '@/lib/cartografia/leituraComportamental';

const TERRITORIOS = [
  { key: 'torre_interna', nome: 'Torre Interna', desc: 'Conscienciosidade e disciplina interna', microcopy: 'O que sustenta essa cliente quando ninguém vê?' },
  { key: 'porta_possivel', nome: 'Porta do Possível', desc: 'Abertura a novas experiências', microcopy: 'Para onde a vida está tentando levá-la?' },
  { key: 'campo_outro', nome: 'Campo do Outro', desc: 'Relações e empatia', microcopy: 'O que nela responde ao mundo?' },
  { key: 'voz_mundo', nome: 'Voz no Mundo', desc: 'Expressão e extroversão', microcopy: 'Que narrativa externa a atravessa?' },
  { key: 'porta_abalo', nome: 'Porta do Abalo', desc: 'Sensibilidade e neuroticismo', microcopy: 'O que desorganiza sua estrutura hoje?' },
];

const PERGUNTAS_POR_TERRITORIO = 6;

export default function CartografiaPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isFromCabine = !!searchParams.get('clienteId');
  const [scores, setScores] = useState<Record<string, number[]>>(
    Object.fromEntries(TERRITORIOS.map(t => [t.key, Array(PERGUNTAS_POR_TERRITORIO).fill(3)]))
  );
  const [clientId, setClientId] = useState(searchParams.get('clienteId') || '');
  const [clients, setClients] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [concluido, setConcluido] = useState(false);

  // Ritual states
  const [ritualStarted, setRitualStarted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);

  useState(() => {
    if (user) {
      supabase.from('clientes').select('id, nome').eq('terapeuta_id', user.id).order('nome')
        .then(({ data }) => { setClients(data || []); setLoaded(true); });
    }
  });

  const clientName = clients.find(c => c.id === clientId)?.nome || '';

  const getAverage = (key: string) => {
    const arr = scores[key];
    return Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 20);
  };

  const handleScore = (territory: string, qIndex: number, value: number) => {
    setScores(prev => ({
      ...prev,
      [territory]: prev[territory].map((v, i) => i === qIndex ? value : v),
    }));
  };

  const classify = (score: number) => {
    if (score < 35) return 'baixo';
    if (score < 65) return 'equilibrado';
    return 'alto';
  };

  const handleSave = async () => {
    if (!clientId || !user) { toast.error('Selecione uma cliente'); return; }
    setSaving(true);

    const scoresJson = Object.fromEntries(TERRITORIOS.map(t => [t.key, getAverage(t.key)]));
    const classificationJson = Object.fromEntries(TERRITORIOS.map(t => [t.key, classify(getAverage(t.key))]));

    const { error, data: inserted } = await supabase.from('cartographies').insert({
      client_id: clientId,
      scores_json: scoresJson,
      classification_json: classificationJson,
    }).select('id').single();

    if (error || !inserted) {
      toast.error('Erro ao salvar cartografia');
      setSaving(false);
      return;
    }

    // Persist behavioral profile
    try {
      const mediasRaw: Record<string, number> = {};
      TERRITORIOS.forEach(t => {
        const arr = scores[t.key];
        mediasRaw[t.key] = arr.reduce((a, b) => a + b, 0) / arr.length;
      });
      const { profileJson } = montarProfileJson({ rawMedias: mediasRaw, contexto: 'casa_das_maquinas' });
      await upsertCartografiaProfile({
        userId: user.id,
        cartografiaId: inserted.id,
        profileJson,
        mediasRaw,
        therapistUserId: user.id,
      });

      await supabase.from('clientes').update({
        has_initial_cartography: true,
      }).eq('id', clientId);

      // Generate initial CidaDELA
      try {
        const { data: existingCase } = await supabase
          .from('session_cases')
          .select('id')
          .eq('client_id', clientId)
          .eq('therapist_id', user.id)
          .limit(1)
          .maybeSingle();

        let caseId = existingCase?.id;
        if (!caseId) {
          const { data: clienteData } = await supabase.from('clientes').select('nome').eq('id', clientId).single();
          const { data: newCase } = await supabase.from('session_cases').insert({
            therapist_id: user.id,
            client_id: clientId,
            title: `Jornada de ${clienteData?.nome || 'Cliente'}`,
            status: 'active',
          }).select('id').single();
          caseId = newCase?.id;
        }

        await supabase.from('jardim_heroina').update({ status: 'active', case_id: caseId }).eq('client_id', clientId).eq('therapist_id', user.id);

        await supabase.rpc('update_cidadela_from_session' as any, {
          _client_id: clientId,
          _therapist_id: user.id,
          _distrito: null,
          _torre: null,
          _porta: null,
          _arquetipo: null,
          _labirinto: null,
          _ferramenta: null,
          _insight: 'Cartografia inicial concluída — CidaDELA inaugurada',
        });

        await supabase.from('clientes').update({
          has_initial_cidadela: true,
        }).eq('id', clientId);
      } catch (cidadelaErr) {
        console.error('Erro ao gerar CidaDELA inicial:', cidadelaErr);
      }
    } catch (e) {
      console.error('Erro ao persistir perfil comportamental:', e);
    }

    setSaving(false);

    // Show ritual overlay before redirect
    setShowOverlay(true);
    setTimeout(() => {
      navigate(`/casa-das-maquinas/cabine?clienteId=${clientId}&fromCartografia=true`);
    }, 2000);
  };

  // ─── Overlay de transição ───
  if (showOverlay) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
        <div className="max-w-md text-center space-y-4 animate-fade-in">
          <p className="text-sm text-muted-foreground/80 italic leading-relaxed">
            Toda leitura cria um território.
          </p>
          <p className="text-sm text-muted-foreground/60 italic leading-relaxed">
            A CidaDELA está sendo formada.
          </p>
          <Loader2 className="w-4 h-4 animate-spin text-primary/40 mx-auto mt-6" />
        </div>
      </div>
    );
  }

  return (
    <CasaMaquinasLayout
      title={isFromCabine ? 'Diagnóstico Inicial' : 'Cartografia Psíquica Orácula'}
      subtitle={isFromCabine ? undefined : 'Big Five simbólico — 30 perguntas, 5 territórios'}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ─── Header ritual (quando vem da cabine) ─── */}
        {isFromCabine && clientName && (
          <div className="border border-border/20 rounded-lg bg-card/40 p-5 space-y-1.5">
            <p className="text-base font-medium text-foreground">{clientName}</p>
            <p className="text-xs text-primary/70 tracking-wide">Diagnóstico Inicial em andamento</p>
            <p className="text-[11px] text-muted-foreground/50 italic">
              Você está inaugurando a leitura desta cliente
            </p>
            <p className="text-[10px] text-muted-foreground/30 mt-2">
              Retorno à cabine após conclusão
            </p>
          </div>
        )}

        {/* ─── Seletor de cliente (livre) ou bloco travado (cabine) ─── */}
        {isFromCabine ? (
          <div className="rounded-md border border-primary/20 bg-card/60 px-4 py-3">
            <p className="text-xs text-muted-foreground mb-0.5">Cliente selecionada</p>
            <p className="text-sm font-medium text-foreground">
              {clientName || 'Carregando...'}
            </p>
          </div>
        ) : (
          <Select value={clientId} onValueChange={setClientId}>
            <SelectTrigger className="bg-card/60 border-border/20 text-foreground">
              <SelectValue placeholder="Selecione a cliente..." />
            </SelectTrigger>
            <SelectContent>
              {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
            </SelectContent>
          </Select>
        )}

        {/* ─── Abertura do Rito ─── */}
        {!ritualStarted && clientId && (
          <div className="py-10 text-center space-y-5 animate-fade-in">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground/70 italic leading-relaxed">
                Toda leitura começa antes das respostas.
              </p>
              <p className="text-sm text-muted-foreground/60 italic leading-relaxed">
                Observe antes de interpretar.
              </p>
              <p className="text-sm text-muted-foreground/50 italic leading-relaxed">
                Registre o que aparece, não o que você quer encontrar.
              </p>
            </div>
            <Button
              variant="outline"
              className="mt-6 border-primary/30 text-primary hover:bg-primary/5"
              onClick={() => setRitualStarted(true)}
            >
              Iniciar leitura
            </Button>
          </div>
        )}

        {/* ─── Conteúdo das perguntas (step by step) ─── */}
        {ritualStarted && !concluido && (
          <>
            {/* Território ativo */}
            {(() => {
              const t = TERRITORIOS[activeStep];
              if (!t) return null;
              return (
                <div key={t.key} className="animate-fade-in space-y-4">
                  {/* Microcopy de condução */}
                  <p className="text-xs text-primary/60 italic text-center py-2">
                    {t.microcopy}
                  </p>

                  <Card className="border-border/10 bg-card/50">
                    <CardHeader>
                      <CardTitle className="text-sm text-primary">{t.nome}</CardTitle>
                      <p className="text-xs text-muted-foreground/50">{t.desc}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Array.from({ length: PERGUNTAS_POR_TERRITORIO }).map((_, qi) => (
                        <div key={qi} className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground/40 w-4">{qi + 1}.</span>
                          <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map(v => (
                              <button
                                key={v}
                                onClick={() => handleScore(t.key, qi, v)}
                                className={`w-9 h-9 rounded-full text-xs font-medium transition-all ${
                                  scores[t.key][qi] === v
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted/20 text-muted-foreground/40 hover:bg-muted/40'
                                }`}
                              >
                                {v}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Navegação entre territórios */}
                  <div className="flex justify-between items-center pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveStep(s => s - 1)}
                      disabled={activeStep === 0}
                      className="text-muted-foreground/50"
                    >
                      Anterior
                    </Button>
                    <span className="text-[10px] text-muted-foreground/30">
                      {activeStep + 1} de {TERRITORIOS.length}
                    </span>
                    {activeStep < TERRITORIOS.length - 1 ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveStep(s => s + 1)}
                        className="text-primary/70"
                      >
                        Próximo
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConcluido(true)}
                        className="text-primary/70"
                      >
                        Concluir preenchimento
                      </Button>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Radar preview compacto */}
            <Card className="border-border/10 bg-card/30">
              <CardContent className="py-3">
                <div className="grid grid-cols-5 gap-2">
                  {TERRITORIOS.map((t, i) => {
                    const avg = getAverage(t.key);
                    const cls = classify(avg);
                    return (
                      <div
                        key={t.key}
                        className={`text-center cursor-pointer rounded-md py-1.5 transition-all ${i === activeStep ? 'bg-primary/10' : ''}`}
                        onClick={() => setActiveStep(i)}
                      >
                        <div className="relative w-10 h-10 mx-auto mb-1">
                          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                            <circle cx="18" cy="18" r="15.91" fill="transparent" stroke="hsl(var(--muted)/0.1)" strokeWidth="3" />
                            <circle cx="18" cy="18" r="15.91" fill="transparent" stroke="hsl(var(--primary))" strokeWidth="3"
                              strokeDasharray={`${avg} ${100 - avg}`} strokeLinecap="round" />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-foreground/70">{avg}</span>
                        </div>
                        <p className="text-[7px] text-muted-foreground/40 leading-tight">{t.nome}</p>
                        <span className={`text-[7px] ${cls === 'alto' ? 'text-emerald-500/60' : cls === 'baixo' ? 'text-red-400/60' : 'text-primary/60'}`}>{cls}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* ─── Leitura Revelação (pós preenchimento) ─── */}
        {concluido && (() => {
          const mediasRaw: Record<string, number> = {};
          TERRITORIOS.forEach(t => {
            const arr = scores[t.key];
            mediasRaw[t.key] = arr.reduce((a, b) => a + b, 0) / arr.length;
          });
          const leitura = calcularLeitura(mediasRaw, 'casa_das_maquinas');

          // Derive readable direction from ritmo
          const direcaoTexto: Record<string, string> = {
            lento: 'Evite condução direta. Primeiro estabilize.',
            medio: 'Sustente o que já existe antes de aprofundar.',
            rapido: 'Há espaço para explorar. Acompanhe o movimento.',
            'medio ou rapido': 'O campo tem abertura. Sustente e acompanhe.',
          };

          // Derive campo state from tensao
          const campoTexto: Record<string, string> = {
            'controle vs colapso': 'O movimento atual não é avançar, é reorganizar.',
            'estrutura vs expressão': 'O campo pede espaço entre estrutura e autenticidade.',
            'pertencimento vs autonomia': 'Há oscilação entre vínculo e caminho próprio.',
            'expansão vs segurança': 'O desejo de crescer tensiona a base construída.',
            'expressão vs aceitação': 'A expressão está contida pelo medo do julgamento.',
            'segurança vs movimento': 'O campo está entre estagnação e impulso.',
          };

          return (
            <>
              <LeituraRevelacao
                saida={leitura.saida_cliente}
                delayInicio={200}
              />

              {/* ─── Bloco de Revelação ─── */}
              <div className="animate-fade-in space-y-5 pt-2">
                <p className="text-xs text-muted-foreground/50 italic text-center">
                  Toda leitura revela um padrão.
                </p>

                <div className="border border-border/10 rounded-xl bg-card/30 px-5 py-5 space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground/40">
                      Força que organiza o campo
                    </p>
                    <p className="text-sm text-foreground/85 leading-relaxed">
                      {leitura.saida_terapeuta.padrao_dominante}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground/40">
                      Estado do campo
                    </p>
                    <p className="text-sm text-foreground/85 leading-relaxed">
                      {campoTexto[leitura.profile.tensao_central] || 'O campo está se organizando.'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground/40">
                      Direção sugerida
                    </p>
                    <p className="text-sm text-foreground/85 leading-relaxed">
                      {direcaoTexto[leitura.profile.ritmo_ideal] || direcaoTexto.medio}
                    </p>
                  </div>
                </div>

                <p className="text-[10px] text-muted-foreground/35 italic text-center leading-relaxed">
                  Essa leitura não é diagnóstico.<br />
                  É ponto de partida.
                </p>
              </div>
            </>
          );
        })()}

        {/* ─── Botão final ─── */}
        {concluido && (
          <div className="text-center space-y-2 py-4">
            <Button
              onClick={handleSave}
              disabled={saving || !clientId}
              className="w-full bg-primary hover:bg-primary/80 text-primary-foreground"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Concluir Diagnóstico Inicial
            </Button>
            <p className="text-[10px] text-muted-foreground/40 italic">
              Isso irá inaugurar o mapa da cliente
            </p>
          </div>
        )}
      </div>
    </CasaMaquinasLayout>
  );
}
