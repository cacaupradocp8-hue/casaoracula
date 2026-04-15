import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { upsertCartografiaProfile } from '@/lib/dal/cartografiaProfile';
import { montarProfileJson } from '@/lib/cartografia/montarProfileJson';
import { calcularLeitura } from '@/lib/cartografia/leituraComportamental';
import { derivarCidadela } from '@/lib/cartografia/derivacaoCidadela';
import { useAuth } from '@/contexts/AuthContext';
import { useBig5Oracular } from '@/hooks/useBig5Oracular';
import { useCartografiaGPS } from '@/hooks/useCartografiaGPS';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Map, Sparkles, Loader2, Check, Eye } from 'lucide-react';
import { SaidaSimbolica } from '@/components/cartografia-unificada/SaidaSimbolica';
import { CamadaLeituraPsiquica } from '@/components/cartografia-unificada/CamadaLeituraPsiquica';
import { CamadaCidadela } from '@/components/cartografia-unificada/CamadaCidadela';
import { CamadaDirecaoClinica } from '@/components/cartografia-unificada/CamadaDirecaoClinica';
import { LeituraRevelacao } from '@/components/cartografia/LeituraRevelacao';

type Phase = 'intro' | 'questionnaire' | 'generating' | 'result';

export default function CartografiaPsiquicaPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    fatores, perguntas, loading: loadingBig5,
    calcularMedias, saveResult, getIntensidade,
  } = useBig5Oracular();
  const { saveTherapistCartografia } = useCartografiaGPS();

  const [phase, setPhase] = useState<Phase>('intro');
  const [saving, setSaving] = useState(false);

  // Questionnaire state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, number>>({});
  const [big5Result, setBig5Result] = useState<ReturnType<typeof calcularMedias> | null>(null);

  // Derived results
  const [leituraResult, setLeituraResult] = useState<ReturnType<typeof calcularLeitura> | null>(null);
  const [cidadelaResult, setCidadelaResult] = useState<ReturnType<typeof derivarCidadela> | null>(null);

  // AI result
  const [aiResult, setAiResult] = useState<any>(null);
  const [activeLayer, setActiveLayer] = useState(0);

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

  const handleAnswer = (value: number) => {
    if (!currentQ) return;
    setRespostas(prev => ({ ...prev, [currentQ.id]: value }));
    if (currentQIndex < totalQ - 1) {
      setTimeout(() => setCurrentQIndex(prev => prev + 1), 250);
    }
  };

  const handleGenerateReading = async () => {
    if (!user) return;
    setPhase('generating');
    setSaving(true);

    try {
      // 1. Calculate medias
      const result = calcularMedias(respostas);
      setBig5Result(result);
      await saveResult(respostas);

      const medias = result.medias;

      // 2. Motor unificado: leitura + cidadela + profile JSON
      const { profileJson, leitura, cidadela } = montarProfileJson({ rawMedias: medias, contexto: 'clube' });
      setLeituraResult(leitura);
      setCidadelaResult(cidadela);

      // 3. Save cartografia (no subjective data)
      const { data: cartoInserted } = await supabase.from('cartografia_psiquica').insert({
        user_id: user.id,
        cor_predominante: cidadela.cor_derivada,
        atmosfera: cidadela.atmosfera_derivada,
        territorios_principais: cidadela.distritos_acesos,
        recursos_internos: null,
        conflitos_tensoes: null,
        simbolo_pessoal: cidadela.simbolo_derivado,
        ponto_partida: cidadela.porta_inicial,
        indice_equilibrio: cidadela.indice_equilibrio,
        metadata_json: { 
          medias_big5: medias,
          predominante: result.predominante?.chave,
          fragilizado: result.fragilizado?.chave,
          derivacao_automatica: true,
        },
      } as any).select('id').single();

      // 4. Persist structured profile JSON
      if (cartoInserted?.id) {
        try {
          await upsertCartografiaProfile({
            userId: user.id,
            cartografiaId: cartoInserted.id,
            profileJson,
            mediasRaw: medias,
          });
        } catch (e) {
          console.error('Erro ao persistir perfil comportamental:', e);
        }
      }

      // 6. Auto_mapeamento with derived districts
      const DISTRITOS_ALL = [
        'portao_chegada', 'torres', 'portas', 'jardim_arquetipos', 'praca_abalo',
        'casa_sonhos', 'espelho_vinculos', 'forja', 'conselho_interior',
        'labirinto', 'praca_integracao', 'portal_renascimento',
      ];
      const distritosJson: Record<string, any> = {};
      DISTRITOS_ALL.forEach(d => {
        distritosJson[d] = {
          nome: d.replace(/_/g, ' '),
          estado: d === cidadela.porta_inicial ? 'central' : cidadela.distritos_acesos.includes(d) ? 'ativo' : 'potencial',
        };
      });

      await supabase.from('auto_mapeamento').upsert({
        user_id: user.id,
        distritos_json: distritosJson,
        anotacoes: `Auto-derivado | Cor: ${cidadela.cor_derivada} | Torre: ${cidadela.torre_dominante} | Clima: ${cidadela.clima_cidade}`,
      } as any, { onConflict: 'user_id' });

      // 7. Call AI for deep reading
      try {
        const { data: aiData, error: aiError } = await supabase.functions.invoke(
          'cartografia-leitura-profunda',
          {
            body: {
              medias_big5: medias,
              predominante: result.predominante?.chave,
              fragilizado: result.fragilizado?.chave,
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
          await saveTherapistCartografia(aiData);
        }
      } catch (err) {
        console.error('AI error:', err);
      }

      setPhase('result');
      toast.success('Sua CidaDELA Interior foi revelada ✨');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao gerar leitura');
      setPhase('questionnaire');
    } finally {
      setSaving(false);
    }
  };

  const progressPct = totalQ > 0 ? ((currentQIndex + 1) / totalQ) * 100 : 0;

  const slideVariants = {
    enter: { opacity: 0, x: 50 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  if (loadingBig5) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">
      {/* Progress bar */}
      {phase === 'questionnaire' && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progressPct}%` }} />
        </div>
      )}

      <div className="flex-1 flex items-center justify-center px-4 py-6 sm:p-6 w-full max-w-full">
        <AnimatePresence mode="wait">
          {/* ═══ INTRO ═══ */}
          {phase === 'intro' && (
            <motion.div key="intro" variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.35 }} className="w-full max-w-2xl text-center space-y-8">
              <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Map className="w-12 h-12 text-primary" />
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
                  Cartografia Psíquica Orácula
                </h1>
                <p className="text-lg text-muted-foreground">
                  Uma leitura profunda da sua psique, traduzida em mapa simbólico.
                </p>
              </div>
              <div className="max-w-md mx-auto space-y-4 text-sm text-muted-foreground/70 leading-relaxed">
                <p>Responda às 30 perguntas com honestidade. Não há respostas certas ou erradas.</p>
                <p className="text-xs">Sua CidaDELA Interior será revelada automaticamente a partir das suas respostas.</p>
              </div>
              <Button onClick={() => setPhase('questionnaire')} variant="gold" size="lg" className="mt-4">
                <Sparkles className="w-5 h-5 mr-2" /> Começar leitura profunda
              </Button>
              <p className="text-[10px] text-muted-foreground/30">
                Leitura simbólica. Não constitui avaliação clínica formal.
              </p>
            </motion.div>
          )}

          {/* ═══ QUESTIONNAIRE ═══ */}
          {phase === 'questionnaire' && currentQ && currentFator && (
            <motion.div key={`q-${currentQIndex}`} variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.25 }} className="w-full max-w-xl space-y-5">
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Leitura de Campo</span>
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
                  else setPhase('intro');
                }}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
                </Button>
                {currentQIndex === totalQ - 1 ? (
                  <Button size="sm" variant="gold" onClick={handleGenerateReading}
                    disabled={Object.keys(respostas).length < totalQ || saving}>
                    <Sparkles className="w-4 h-4 mr-1" /> Revelar minha CidaDELA
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => setCurrentQIndex(p => p + 1)}
                    disabled={!respostas[currentQ.id]}>
                    Próxima <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {/* ═══ GENERATING ═══ */}
          {phase === 'generating' && (
            <motion.div key="generating" variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.35 }} className="w-full max-w-md text-center space-y-8">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <div className="space-y-3">
                <h2 className="text-xl font-display font-semibold text-foreground">Processando sua leitura...</h2>
                <p className="text-sm text-muted-foreground/60 leading-relaxed">
                  A cartógrafa está derivando automaticamente o mapa da sua cidade interior
                  a partir das suas respostas.
                </p>
              </div>
              <div className="flex justify-center gap-1.5">
                {[0, 1, 2, 3, 4].map(i => (
                  <motion.div key={i} className="w-2 h-2 rounded-full bg-primary/40"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }} />
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══ RESULT ═══ */}
          {phase === 'result' && leituraResult && cidadelaResult && (
            <motion.div key="result" variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.5 }} className="w-full max-w-2xl space-y-8">
              
              {/* Symbolic output first */}
              <SaidaSimbolica
                saida={leituraResult.saida_cliente}
                cidadela={cidadelaResult}
                fraseSemente={aiResult?.leitura_psiquica?.frase_espelho}
              />

              {/* AI layers if available */}
              {aiResult && (
                <>
                  <div className="border-t border-border/10 pt-6">
                    <div className="flex justify-center gap-1 flex-wrap">
                      {['Leitura Profunda', 'CidaDELA', 'Direção Clínica'].map((label, i) => (
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
                  </div>

                  <AnimatePresence mode="wait">
                    {activeLayer === 0 && aiResult.leitura_psiquica && (
                      <motion.div key="l0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <CamadaLeituraPsiquica
                          data={aiResult.leitura_psiquica}
                          predominante={big5Result?.predominante}
                          fragilizado={big5Result?.fragilizado}
                          medias={big5Result?.medias}
                        />
                      </motion.div>
                    )}
                    {activeLayer === 1 && aiResult.cidadela && (
                      <motion.div key="l1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
                      </motion.div>
                    )}
                    {activeLayer === 2 && aiResult.direcao_clinica && (
                      <motion.div key="l2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <CamadaDirecaoClinica data={aiResult.direcao_clinica} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {/* Bottom actions */}
              <div className="flex flex-col items-center gap-4 pt-4">
                <Button variant="gold" size="lg" className="gap-2 px-8" onClick={() => navigate('/cidadela/revelacao')}>
                  <Eye className="w-4 h-4" /> Ver minha CidaDELA completa
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard-membro')}>
                  Entrar na Casa com meu mapa
                </Button>
                <p className="text-[10px] text-muted-foreground/30">
                  Leitura simbólica e exploratória. Não constitui avaliação clínica formal.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
