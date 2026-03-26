import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useBig5Oracular } from '@/hooks/useBig5Oracular';
import { useCartografiaGPS } from '@/hooks/useCartografiaGPS';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Map, Sparkles, Save, Loader2, Check, Eye } from 'lucide-react';
import { CamadaLeituraPsiquica } from '@/components/cartografia-unificada/CamadaLeituraPsiquica';
import { CamadaCidadela } from '@/components/cartografia-unificada/CamadaCidadela';
import { CamadaDirecaoClinica } from '@/components/cartografia-unificada/CamadaDirecaoClinica';

/* ─── Constants ─── */
const CORES = [
  { nome: 'Ouro', hex: '#C9A24A', significado: 'esperança, abundância' },
  { nome: 'Prata', hex: '#A8B2BD', significado: 'reflexão, mistério' },
  { nome: 'Azul', hex: '#3B6B9E', significado: 'calma, profundidade' },
  { nome: 'Vermelho', hex: '#B44B4B', significado: 'paixão, energia' },
  { nome: 'Verde', hex: '#556B57', significado: 'crescimento, renovação' },
  { nome: 'Roxo', hex: '#7B5EA7', significado: 'transformação, magia' },
  { nome: 'Cinza', hex: '#8A8A8A', significado: 'neutralidade, transição' },
  { nome: 'Preto', hex: '#1A1A2E', significado: 'potencial, desconhecido' },
  { nome: 'Branco', hex: '#E8E4DA', significado: 'clareza, vazio' },
  { nome: 'Rosa', hex: '#C4848A', significado: 'ternura, vulnerabilidade' },
  { nome: 'Laranja', hex: '#D4874D', significado: 'criatividade, alegria' },
  { nome: 'Marrom', hex: '#8B6F47', significado: 'enraizamento, estabilidade' },
];

const DISTRITOS = [
  { key: 'portao_chegada', nome: 'Portão da Chegada', desc: 'Chegadas, inícios', icon: '🚪' },
  { key: 'torres', nome: 'Torres', desc: 'Estruturas, proteção', icon: '🏛️' },
  { key: 'portas', nome: 'Portas', desc: 'Emoções, acessos', icon: '🔑' },
  { key: 'jardim_arquetipos', nome: 'Jardim dos Arquétipos', desc: 'Forças profundas', icon: '🌿' },
  { key: 'praca_abalo', nome: 'Praça do Abalo', desc: 'Emoções intensas', icon: '⚡' },
  { key: 'casa_sonhos', nome: 'Casa dos Sonhos', desc: 'Inconsciente, imaginação', icon: '🌙' },
  { key: 'espelho_vinculos', nome: 'Espelho dos Vínculos', desc: 'Relacionamentos', icon: '🪞' },
  { key: 'forja', nome: 'Forja', desc: 'Transformação', icon: '🔥' },
  { key: 'conselho_interior', nome: 'Conselho Interior', desc: 'Sabedoria interna', icon: '👁️' },
  { key: 'labirinto', nome: 'Labirinto', desc: 'Confusão, ciclos', icon: '🌀' },
  { key: 'praca_integracao', nome: 'Praça da Integração', desc: 'Síntese', icon: '☀️' },
  { key: 'portal_renascimento', nome: 'Portal de Renascimento', desc: 'Transição', icon: '🦋' },
];

const ATMOSFERAS = [
  'Calma', 'Agitada', 'Clara', 'Nebulosa', 'Quente', 'Fria',
  'Viva', 'Estática', 'Segura', 'Ameaçadora', 'Aberta', 'Fechada',
  'Organizada', 'Caótica', 'Esperançosa', 'Desesperada',
];

const SIMBOLOS = [
  { nome: 'Árvore', icon: '🌳' }, { nome: 'Montanha', icon: '⛰️' },
  { nome: 'Rio', icon: '🏞️' }, { nome: 'Fogo', icon: '🔥' },
  { nome: 'Água', icon: '💧' }, { nome: 'Vento', icon: '🌬️' },
  { nome: 'Luz', icon: '✨' }, { nome: 'Sombra', icon: '🌑' },
  { nome: 'Ponte', icon: '🌉' }, { nome: 'Porta', icon: '🚪' },
  { nome: 'Coração', icon: '❤️' }, { nome: 'Coroa', icon: '👑' },
  { nome: 'Espada', icon: '⚔️' }, { nome: 'Escudo', icon: '🛡️' },
  { nome: 'Chave', icon: '🗝️' }, { nome: 'Labirinto', icon: '🌀' },
  { nome: 'Espelho', icon: '🪞' }, { nome: 'Livro', icon: '📖' },
  { nome: 'Flor', icon: '🌸' }, { nome: 'Estrela', icon: '⭐' },
];

type Phase = 'intro' | 'big5' | 'cartografia' | 'generating' | 'result';

export default function CartografiaPsiquicaPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    fatores, perguntas, loading: loadingBig5,
    calcularMedias, saveResult, getIntensidade,
  } = useBig5Oracular();

  const [phase, setPhase] = useState<Phase>('intro');
  const [saving, setSaving] = useState(false);

  // Big5 state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, number>>({});
  const [big5Result, setBig5Result] = useState<ReturnType<typeof calcularMedias> | null>(null);

  // Cartografia state
  const [cartoStep, setCartoStep] = useState(0);
  const [cor, setCor] = useState('');
  const [atmosfera, setAtmosfera] = useState<string[]>([]);
  const [territorios, setTerritorios] = useState<string[]>([]);
  const [recursos, setRecursos] = useState('');
  const [conflitos, setConflitos] = useState('');
  const [simbolo, setSimbolo] = useState('');
  const [porqueSimbolo, setPorqueSimbolo] = useState('');
  const [pontoPartida, setPontoPartida] = useState('');

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
  const corObj = CORES.find(c => c.nome === cor);
  const selectedDistritos = DISTRITOS.filter(d => territorios.includes(d.key));
  const CARTO_STEPS = 7; // cor, atmosfera, territórios, recursos, conflitos, símbolo, ponto de partida

  const opcoes = [
    { value: 1, label: 'Nunca / Quase nunca' },
    { value: 2, label: 'Raramente' },
    { value: 3, label: 'Às vezes' },
    { value: 4, label: 'Frequentemente' },
    { value: 5, label: 'Quase sempre' },
  ];

  // Big5 handlers
  const handleAnswer = (value: number) => {
    if (!currentQ) return;
    setRespostas(prev => ({ ...prev, [currentQ.id]: value }));
    if (currentQIndex < totalQ - 1) {
      setTimeout(() => setCurrentQIndex(prev => prev + 1), 250);
    }
  };

  const handleCompleteBig5 = async () => {
    const result = calcularMedias(respostas);
    setBig5Result(result);
    await saveResult(respostas);
    setPhase('cartografia');
  };

  // Cartografia handlers
  const toggleAtmosfera = (a: string) => {
    setAtmosfera(prev => prev.includes(a) ? prev.filter(x => x !== a) : prev.length < 4 ? [...prev, a] : prev);
  };
  const toggleTerritorio = (key: string) => {
    setTerritorios(prev => prev.includes(key) ? prev.filter(x => x !== key) : prev.length < 5 ? [...prev, key] : prev);
  };

  const canAdvanceCarto = () => {
    switch (cartoStep) {
      case 0: return !!cor;
      case 1: return atmosfera.length > 0;
      case 2: return territorios.length > 0;
      case 5: return !!simbolo;
      case 6: return !!pontoPartida;
      default: return true;
    }
  };

  // Generate AI reading + save
  const handleGenerateReading = async () => {
    if (!user || !big5Result) return;
    setPhase('generating');
    setSaving(true);

    try {
      // 1. Save cartografia
      const indice = (() => {
        const rLen = recursos.trim().length;
        const cLen = conflitos.trim().length;
        if (rLen + cLen === 0) return 50;
        return Math.round((rLen / (rLen + cLen)) * 100);
      })();

      await supabase.from('cartografia_psiquica').insert({
        user_id: user.id,
        cor_predominante: cor,
        atmosfera,
        territorios_principais: territorios,
        recursos_internos: recursos,
        conflitos_tensoes: conflitos,
        simbolo_pessoal: simbolo,
        por_que_simbolo: porqueSimbolo,
        ponto_partida: pontoPartida,
        indice_equilibrio: indice,
        metadata_json: { cor_hex: corObj?.hex, cor_significado: corObj?.significado },
      } as any);

      // 2. Generate CidaDELA
      const distritoCentral = pontoPartida || territorios[0] || 'portao_chegada';
      const distritosJson: Record<string, any> = {};
      DISTRITOS.forEach(d => {
        distritosJson[d.key] = {
          nome: d.nome,
          estado: d.key === distritoCentral ? 'central' : territorios.includes(d.key) ? 'ativo' : 'potencial',
          icon: d.icon,
        };
      });

      await supabase.from('auto_mapeamento').upsert({
        user_id: user.id,
        distritos_json: distritosJson,
        anotacoes: `Cor: ${cor} | Atmosfera: ${atmosfera.join(', ')} | Símbolo: ${simbolo}`,
      } as any, { onConflict: 'user_id' });

      // 3. Call AI for deep reading
      const { data: aiData, error: aiError } = await supabase.functions.invoke(
        'cartografia-leitura-profunda',
        {
          body: {
            medias_big5: big5Result.medias,
            predominante: big5Result.predominante?.chave,
            fragilizado: big5Result.fragilizado?.chave,
            cor,
            atmosfera,
            territorios,
            recursos,
            conflitos,
            simbolo,
            ponto_partida: pontoPartida,
          },
        }
      );

      if (aiError) {
        console.error('AI Error:', aiError);
        // Fallback without AI
        setAiResult(null);
      } else {
        setAiResult(aiData);
      }

      setPhase('result');
      toast.success('Sua CidaDELA Interior foi revelada ✨');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao gerar leitura');
      setPhase('cartografia');
    } finally {
      setSaving(false);
    }
  };

  // Progress calculation
  const totalSteps = totalQ + CARTO_STEPS;
  const currentStep = phase === 'big5' ? currentQIndex : phase === 'cartografia' ? totalQ + cartoStep : totalSteps;
  const progressPct = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

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
      {phase !== 'intro' && phase !== 'result' && phase !== 'generating' && (
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
                <p>Esta não é uma ferramenta comum. É uma experiência em 3 camadas:</p>
                <div className="grid grid-cols-1 gap-2 text-left">
                  <div className="flex gap-3 items-start p-3 rounded-lg bg-card/40 border border-border/10">
                    <span className="text-primary text-lg">1</span>
                    <div><p className="text-foreground text-sm font-medium">Leitura Psíquica</p>
                    <p className="text-xs text-muted-foreground">Mapeamento profundo dos seus traços e padrões</p></div>
                  </div>
                  <div className="flex gap-3 items-start p-3 rounded-lg bg-card/40 border border-border/10">
                    <span className="text-primary text-lg">2</span>
                    <div><p className="text-foreground text-sm font-medium">CidaDELA Interior</p>
                    <p className="text-xs text-muted-foreground">Tradução simbólica em mapa de territórios</p></div>
                  </div>
                  <div className="flex gap-3 items-start p-3 rounded-lg bg-card/40 border border-border/10">
                    <span className="text-primary text-lg">3</span>
                    <div><p className="text-foreground text-sm font-medium">Direção Clínica</p>
                    <p className="text-xs text-muted-foreground">Como você atua como guia — forças e atenções</p></div>
                  </div>
                </div>
              </div>
              <Button onClick={() => setPhase('big5')} variant="gold" size="lg" className="mt-4">
                <Sparkles className="w-5 h-5 mr-2" /> Começar leitura profunda
              </Button>
              <p className="text-[10px] text-muted-foreground/30">
                Leitura simbólica. Não constitui avaliação clínica formal.
              </p>
            </motion.div>
          )}

          {/* ═══ BIG5 QUESTIONNAIRE ═══ */}
          {phase === 'big5' && currentQ && currentFator && (
            <motion.div key={`big5-${currentQIndex}`} variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.25 }} className="w-full max-w-xl space-y-5">
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Camada 1 — Leitura Psíquica</span>
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
                  <Button size="sm" onClick={handleCompleteBig5}
                    disabled={Object.keys(respostas).length < totalQ}>
                    Avançar para CidaDELA <ArrowRight className="w-4 h-4 ml-1" />
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

          {/* ═══ CARTOGRAFIA STEPS ═══ */}
          {phase === 'cartografia' && (
            <motion.div key={`carto-${cartoStep}`} variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.3 }} className="w-full max-w-2xl space-y-6">
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Camada 2 — CidaDELA Interior</span>
                <span>{cartoStep + 1} / {CARTO_STEPS}</span>
              </div>

              {/* Step 0: Cor */}
              {cartoStep === 0 && (
                <div className="space-y-5">
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-display font-semibold">Se sua cidade interior fosse uma cor, qual seria?</h2>
                    <p className="text-xs text-muted-foreground">Escolha a cor que ressoa com seu momento</p>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {CORES.map(c => (
                      <button key={c.nome} onClick={() => setCor(c.nome)}
                        className={`rounded-xl p-2.5 text-center transition-all border ${
                          cor === c.nome ? 'border-primary ring-2 ring-primary/30 scale-105' : 'border-border/20 hover:border-border/50'
                        }`}>
                        <div className="w-8 h-8 rounded-full mx-auto mb-1.5 shadow-md" style={{ backgroundColor: c.hex }} />
                        <p className="text-[10px] font-medium text-foreground">{c.nome}</p>
                        <p className="text-[8px] text-muted-foreground">{c.significado}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: Atmosfera */}
              {cartoStep === 1 && (
                <div className="space-y-5">
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-display font-semibold">Como é a atmosfera dessa cidade agora?</h2>
                    <p className="text-xs text-muted-foreground">Selecione até 4</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {ATMOSFERAS.map(a => (
                      <button key={a} onClick={() => toggleAtmosfera(a)}
                        className={`rounded-lg py-2.5 px-3 text-xs font-medium transition-all border ${
                          atmosfera.includes(a) ? 'bg-primary/10 border-primary text-primary' : 'border-border/20 text-muted-foreground hover:border-border/50'
                        }`}>{a}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Territórios */}
              {cartoStep === 2 && (
                <div className="space-y-5">
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-display font-semibold">Quais territórios estão mais presentes em você?</h2>
                    <p className="text-xs text-muted-foreground">Selecione até 5 distritos</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {DISTRITOS.map(d => (
                      <button key={d.key} onClick={() => toggleTerritorio(d.key)}
                        className={`flex items-center gap-3 rounded-xl p-2.5 text-left transition-all border ${
                          territorios.includes(d.key) ? 'bg-primary/10 border-primary' : 'border-border/15 hover:border-border/40'
                        }`}>
                        <span className="text-xl">{d.icon}</span>
                        <div>
                          <p className="text-xs font-medium text-foreground">{d.nome}</p>
                          <p className="text-[10px] text-muted-foreground">{d.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Recursos */}
              {cartoStep === 3 && (
                <div className="space-y-5">
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-display font-semibold">Onde você encontra força e segurança?</h2>
                    <p className="text-xs text-muted-foreground">Descreva seus recursos internos</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-[10px] text-muted-foreground/60">
                    {['Encontro força em...', 'Me sinto segura quando...', 'Sou capaz de...'].map(s => (
                      <button key={s} onClick={() => setRecursos(prev => prev ? `${prev}\n${s}` : s)}
                        className="border border-border/15 rounded-full px-2.5 py-0.5 hover:border-primary/30 hover:text-primary transition-colors">{s}</button>
                    ))}
                  </div>
                  <Textarea value={recursos} onChange={e => setRecursos(e.target.value)}
                    placeholder="Escreva livremente sobre seus recursos internos..."
                    className="min-h-[140px] bg-card/50 border-border/15 text-foreground placeholder:text-muted-foreground/30"
                    maxLength={2000} />
                </div>
              )}

              {/* Step 4: Conflitos */}
              {cartoStep === 4 && (
                <div className="space-y-5">
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-display font-semibold">Quais territórios estão em tensão?</h2>
                    <p className="text-xs text-muted-foreground">Descreva os conflitos ou áreas de sombra</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-[10px] text-muted-foreground/60">
                    {['Há conflito entre...', 'Sinto tensão quando...', 'Preciso integrar...'].map(s => (
                      <button key={s} onClick={() => setConflitos(prev => prev ? `${prev}\n${s}` : s)}
                        className="border border-border/15 rounded-full px-2.5 py-0.5 hover:border-primary/30 hover:text-primary transition-colors">{s}</button>
                    ))}
                  </div>
                  <Textarea value={conflitos} onChange={e => setConflitos(e.target.value)}
                    placeholder="Escreva livremente sobre tensões e conflitos..."
                    className="min-h-[140px] bg-card/50 border-border/15 text-foreground placeholder:text-muted-foreground/30"
                    maxLength={2000} />
                </div>
              )}

              {/* Step 5: Símbolo */}
              {cartoStep === 5 && (
                <div className="space-y-5">
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-display font-semibold">Há um símbolo que representa sua jornada agora?</h2>
                    <p className="text-xs text-muted-foreground">Escolha o que mais ressoa</p>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {SIMBOLOS.map(s => (
                      <button key={s.nome} onClick={() => setSimbolo(s.nome)}
                        className={`rounded-xl p-2.5 text-center transition-all border ${
                          simbolo === s.nome ? 'bg-primary/10 border-primary ring-1 ring-primary/30 scale-105' : 'border-border/15 hover:border-border/40'
                        }`}>
                        <span className="text-xl block">{s.icon}</span>
                        <p className="text-[9px] mt-0.5 text-foreground/60">{s.nome}</p>
                      </button>
                    ))}
                  </div>
                  {simbolo && (
                    <Textarea value={porqueSimbolo} onChange={e => setPorqueSimbolo(e.target.value)}
                      placeholder="O que esse símbolo significa para você neste momento..."
                      className="min-h-[80px] bg-card/50 border-border/15 text-foreground placeholder:text-muted-foreground/30"
                      maxLength={1000} />
                  )}
                </div>
              )}

              {/* Step 6: Ponto de partida */}
              {cartoStep === 6 && (
                <div className="space-y-5">
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-display font-semibold">Por qual distrito você quer começar?</h2>
                    <p className="text-xs text-muted-foreground">Escolha entre os territórios selecionados</p>
                  </div>
                  <div className="space-y-2">
                    {selectedDistritos.map(d => (
                      <button key={d.key} onClick={() => setPontoPartida(d.key)}
                        className={`w-full flex items-center gap-4 rounded-xl p-3 text-left transition-all border ${
                          pontoPartida === d.key ? 'bg-primary/10 border-primary' : 'border-border/15 hover:border-border/40'
                        }`}>
                        <span className="text-2xl">{d.icon}</span>
                        <div>
                          <p className="text-sm font-medium text-foreground">{d.nome}</p>
                          <p className="text-xs text-muted-foreground">{d.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-2">
                <Button variant="ghost" size="sm" onClick={() => {
                  if (cartoStep > 0) setCartoStep(s => s - 1);
                  else setPhase('big5');
                }}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
                </Button>
                {cartoStep === CARTO_STEPS - 1 ? (
                  <Button size="sm" variant="gold" onClick={handleGenerateReading}
                    disabled={!canAdvanceCarto() || saving}>
                    <Sparkles className="w-4 h-4 mr-1" /> Revelar minha CidaDELA
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => setCartoStep(s => s + 1)}
                    disabled={!canAdvanceCarto()}>
                    Próximo <ArrowRight className="w-4 h-4 ml-1" />
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
                <h2 className="text-xl font-display font-semibold text-foreground">Tecendo sua leitura...</h2>
                <p className="text-sm text-muted-foreground/60 leading-relaxed">
                  A cartógrafa está analisando seus traços, territórios e padrões
                  para revelar o mapa da sua cidade interior.
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

          {/* ═══ RESULT — 3 LAYERS ═══ */}
          {phase === 'result' && (
            <motion.div key="result" variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.5 }} className="w-full max-w-2xl space-y-8">
              
              {/* Layer tabs */}
              <div className="flex justify-center gap-1">
                {['Leitura Psíquica', 'CidaDELA', 'Direção Clínica'].map((label, i) => (
                  <button key={label} onClick={() => setActiveLayer(i)}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeLayer === i
                        ? 'bg-primary/15 text-primary border border-primary/30'
                        : 'text-muted-foreground/50 hover:text-muted-foreground border border-transparent'
                    }`}>
                    {label}
                  </button>
                ))}
              </div>

              {/* Layer content */}
              <AnimatePresence mode="wait">
                {activeLayer === 0 && (
                  <motion.div key="layer0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {aiResult?.leitura_psiquica ? (
                      <CamadaLeituraPsiquica
                        data={aiResult.leitura_psiquica}
                        predominante={big5Result?.predominante}
                        fragilizado={big5Result?.fragilizado}
                        medias={big5Result?.medias}
                      />
                    ) : (
                      <FallbackLeitura medias={big5Result?.medias} predominante={big5Result?.predominante} fragilizado={big5Result?.fragilizado} />
                    )}
                  </motion.div>
                )}
                {activeLayer === 1 && (
                  <motion.div key="layer1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {aiResult?.cidadela ? (
                      <CamadaCidadela
                        data={aiResult.cidadela}
                        cor={cor}
                        corHex={corObj?.hex || '#C9A24A'}
                        atmosfera={atmosfera}
                        simbolo={simbolo}
                        simboloIcon={SIMBOLOS.find(s => s.nome === simbolo)?.icon || '✨'}
                        territorios={territorios}
                        pontoPartida={pontoPartida}
                      />
                    ) : (
                      <FallbackCidadela cor={cor} corHex={corObj?.hex || '#C9A24A'} territorios={territorios} pontoPartida={pontoPartida} />
                    )}
                  </motion.div>
                )}
                {activeLayer === 2 && (
                  <motion.div key="layer2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {aiResult?.direcao_clinica ? (
                      <CamadaDirecaoClinica data={aiResult.direcao_clinica} />
                    ) : (
                      <div className="text-center py-12 space-y-3">
                        <p className="text-muted-foreground text-sm">A leitura clínica não foi gerada.</p>
                        <p className="text-xs text-muted-foreground/50">Tente novamente mais tarde.</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom actions */}
              <div className="flex flex-col items-center gap-4 pt-4">
                <Button variant="gold" size="lg" className="gap-2 px-8" onClick={() => navigate('/revelacao-cidadela')}>
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

/* ─── Fallback components when AI is unavailable ─── */
function FallbackLeitura({ medias, predominante, fragilizado }: any) {
  return (
    <div className="space-y-4 text-center">
      <h3 className="font-display text-lg text-foreground">Mapa de Forças</h3>
      {medias && Object.entries(medias)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .map(([chave, media]) => (
          <div key={chave} className="space-y-1 max-w-sm mx-auto">
            <div className="flex justify-between text-xs">
              <span className="text-foreground/70 capitalize">{chave.replace(/_/g, ' ')}</span>
              <span className="text-muted-foreground">{(media as number).toFixed(1)}</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${((media as number) / 5) * 100}%` }} />
            </div>
          </div>
        ))}
      {predominante && (
        <p className="text-sm text-foreground/60 mt-4">
          Força predominante: <strong>{predominante.nome}</strong>
        </p>
      )}
    </div>
  );
}

function FallbackCidadela({ cor, corHex, territorios, pontoPartida }: any) {
  const DISTRITOS_MAP: Record<string, string> = {
    portao_chegada: 'Portão da Chegada', torres: 'Torres', portas: 'Portas',
    jardim_arquetipos: 'Jardim dos Arquétipos', praca_abalo: 'Praça do Abalo',
    casa_sonhos: 'Casa dos Sonhos', espelho_vinculos: 'Espelho dos Vínculos',
    forja: 'Forja', conselho_interior: 'Conselho Interior', labirinto: 'Labirinto',
    praca_integracao: 'Praça da Integração', portal_renascimento: 'Portal de Renascimento',
  };
  return (
    <div className="text-center space-y-4">
      <div className="w-8 h-8 rounded-full mx-auto shadow" style={{ backgroundColor: corHex }} />
      <p className="text-sm text-foreground">Cor: {cor}</p>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {(territorios || []).map((t: string) => (
          <span key={t} className="text-xs bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground">
            {DISTRITOS_MAP[t] || t}
          </span>
        ))}
      </div>
      {pontoPartida && (
        <p className="text-xs text-muted-foreground">Ponto de partida: {DISTRITOS_MAP[pontoPartida]}</p>
      )}
    </div>
  );
}
