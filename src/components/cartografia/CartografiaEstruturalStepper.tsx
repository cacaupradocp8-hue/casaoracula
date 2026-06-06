import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Map, Sparkles, ShieldAlert, History, User, 
  Brain, Heart, ShieldCheck, ArrowRight, ArrowLeft,
  Check, Loader2, Compass, DoorOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTodasRotas } from '@/hooks/useTodasRotas';
import { useCartografiaEstrutural, type CartografiaStepId } from '@/hooks/useCartografiaEstrutural';
import { SaidaSimbolica } from '@/components/cartografia-unificada/SaidaSimbolica';
import { CamadaCidadela } from '@/components/cartografia-unificada/CamadaCidadela';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LimiarCidadela } from './LimiarCidadela';
import { RevelacaoLoader } from './RevelacaoLoader';
import { PortaInicialHero } from './PortaInicialHero';

const STEPS: { id: CartografiaStepId; title: string; icon: any; anchor?: string }[] = [
  { id: 'sintoma', title: 'Sintoma', icon: ShieldAlert, anchor: 'Presença' },
  { id: 'historia', title: 'História', icon: History, anchor: 'Memória' },
  { id: 'objetivas', title: 'Modo de Habitar', icon: User, anchor: 'Centro de Atenção' },
  { id: 'crencas', title: 'Crenças', icon: Brain, anchor: 'Narrativa' },
  { id: 'recursos', title: 'Recursos', icon: Heart, anchor: 'Vitalidade' },
  { id: 'seguranca', title: 'Segurança', icon: ShieldCheck, anchor: 'Pacto' },
];

const DISTRITOS_META: Record<string, { nome: string; icon: string }> = {
  portao_chegada: { nome: 'Portão da Chegada', icon: '🚪' },
  torres: { nome: 'Torres', icon: '🏛️' },
  portas: { nome: 'Portas', icon: '🔑' },
  jardim_arquetipos: { nome: 'Jardim dos Arquétipos', icon: '🌿' },
  bosque_arquetipos: { nome: 'Bosque dos Arquétipos', icon: '🌿' },
  praca_abalo: { nome: 'Praça do Abalo', icon: '⚡' },
  casa_sonhos: { nome: 'Casa dos Sonhos', icon: '🌙' },
  espelho_vinculos: { nome: 'Espelho dos Vínculos', icon: '🪞' },
  forja: { nome: 'Forja', icon: '🔥' },
  conselho_interior: { nome: 'Conselho Interior', icon: '👁️' },
  labirinto: { nome: 'Labirinto', icon: '🌀' },
  praca_integracao: { nome: 'Praça da Integração', icon: '☀️' },
  portal_renascimento: { nome: 'Portal de Renascimento', icon: '🦋' },
};

export function CartografiaEstruturalStepper() {

  const navigate = useNavigate();
  const { data: estacoes } = useTodasRotas();

  const { 
    step, setStep, respostas, updateResposta, 
    updateObjetiva, perguntas, finalizar, loading, result,
    saveStatus, hasDraft, retomarRascunho
  } = useCartografiaEstrutural();

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionAnchor, setTransitionAnchor] = useState('');

  const currentStepIndex = STEPS.findIndex(s => s.id === step);
  const progress = step === 'intro' ? 0 : step === 'resultado' ? 100 : ((currentStepIndex + 1) / STEPS.length) * 100;

  const triggerTransition = (nextStep: () => void, anchor: string) => {
    setTransitionAnchor(anchor);
    setIsTransitioning(true);
    setTimeout(() => {
      nextStep();
      setTimeout(() => setIsTransitioning(false), 400);
    }, 800);
  };

  const next = () => {
    const currentStepObj = STEPS.find(s => s.id === step);
    const nextAnchor = currentStepObj?.anchor || 'Avançando';

    if (step === 'intro') setStep('sintoma');
    else if (step === 'sintoma') triggerTransition(() => setStep('historia'), 'Memória');
    else if (step === 'historia') triggerTransition(() => setStep('objetivas'), 'Centro de Atenção');
    else if (step === 'objetivas') triggerTransition(() => setStep('crencas'), 'Narrativa');
    else if (step === 'crencas') triggerTransition(() => setStep('recursos'), 'Vitalidade');
    else if (step === 'recursos') triggerTransition(() => setStep('seguranca'), 'Pacto');
    else if (step === 'seguranca') triggerTransition(() => finalizar(), 'Revelação');
  };

  const back = () => {
    if (step === 'sintoma') setStep('intro');
    else if (step === 'historia') setStep('sintoma');
    else if (step === 'objetivas') setStep('historia');
    else if (step === 'crencas') setStep('objetivas');
    else if (step === 'recursos') setStep('crencas');
    else if (step === 'seguranca') setStep('recursos');
  };

  const slideVariants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  if (step === 'gerando') {
    return <RevelacaoLoader />;
  }

  if (step === 'resultado' && result) {
    const { cidadela, leitura, profileJson } = result;
    const portaNome = cidadela.porta_inicial_nome;
    const rawSlug = result.profileJson.recomendacoes?.rotas?.[0];
    const portaSlug = rawSlug?.replace(/^\/+/, '').replace(/^clube\/rota\//, '').replace(/^rota\//, '').split('?')[0];

    const handleAtravessar = () => {
      navigate('/clube/rotas/lobos');
    };

    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="w-full max-w-4xl mx-auto space-y-16 pb-32"
      >

        {/* 1. TÍTULO PRINCIPAL */}
        <header className="text-center space-y-6 pt-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-gold/5 rounded-full flex items-center justify-center mx-auto mb-2 border border-gold/20 shadow-premium-glow"
          >
            <Compass className="w-10 h-10 text-gold/80" />
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-display text-foreground tracking-tight">Sua CidadELA</h1>
            <p className="text-sm font-display text-gold/60 italic tracking-widest uppercase">O mapa do modo como você habita o agora.</p>
          </div>
          <div className="max-w-2xl mx-auto pt-6 px-4">
            <p className="text-foreground/80 italic text-base leading-relaxed">
              “Sua CidadELA revelou onde sua energia está habitando agora. Este não é um diagnóstico. É uma cartografia do momento. A Casa não vai dizer quem você é. Ela vai mostrar por onde sua travessia pode começar.”
            </p>
          </div>
        </header>


        <section className="space-y-24">
          {/* 2. MANDALA CENTRAL (PRIORIDADE MÁXIMA) */}
          <div className="space-y-6 relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
              <div className="w-[400px] h-[400px] rounded-full bg-gold/5 blur-[100px] animate-pulse" />
            </div>
            
            <CamadaCidadela 
              data={cidadela} 
              cor={cidadela.cor_derivada} 
              corHex={cidadela.cor_hex}
              atmosfera={cidadela.atmosfera_derivada}
              simbolo={cidadela.simbolo_derivado}
              simboloIcon={cidadela.simbolo_derivado_icon}
              territorios={cidadela.distritos_acesos}
              pontoPartida={cidadela.porta_inicial}
              hideTechnical
            />
          </div>

          {/* 3. TERRITÓRIOS VIVOS */}
          <div className="max-w-3xl mx-auto px-6 space-y-10">
            <div className="text-center space-y-2">
              <h3 className="text-xs uppercase tracking-[0.3em] text-gold/40">O que se acendeu na sua CidadELA</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cidadela.distritos_acesos?.map((distritoKey: string) => {
                const meta = DISTRITOS_META[distritoKey] || { nome: distritoKey.replace(/_/g, ' '), icon: '📍' };
                return (
                  <motion.div 
                    key={distritoKey}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-6 rounded-2xl border border-gold/10 bg-gold/[0.02] flex items-start gap-4 transition-all hover:bg-gold/[0.04]"
                  >
                    <span className="text-2xl mt-1">{meta.icon}</span>
                    <div className="space-y-1">
                      <h4 className="text-lg font-display text-gold/90">{meta.nome}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed italic">
                        {distritoKey === 'torres' ? 'Estrutura, limites e o modo como você organiza sua energia vital.' :
                         distritoKey === 'labirinto' ? 'Onde você atravessa as perguntas que ainda não possuem resposta.' :
                         distritoKey === 'portao_chegada' ? 'O início de tudo, onde a coragem do primeiro passo reside.' :
                         distritoKey === 'conselho_interior' ? 'Onde suas vozes internas buscam harmonia e direção.' :
                         distritoKey === 'espelho_vinculos' ? 'O que suas relações revelam sobre seu próprio interior.' :
                         distritoKey === 'casa_sonhos' ? 'Onde o inconsciente fala através de imagens e silêncios.' :
                         distritoKey === 'forja' ? 'O calor da transformação e a alquimia do próprio ser.' :
                         distritoKey === 'portal_renascimento' ? 'O limiar entre o que precisa terminar e o que começa.' :
                         'Este território se acende em resposta ao seu momento atual.'}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* 4. PORTA INICIAL (CARD DE DESTAQUE) */}
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center space-y-2 mb-8">
              <h3 className="text-xs uppercase tracking-[0.3em] text-gold/40">Sua Porta Inicial</h3>
            </div>
            
            <Card className="glass border-gold/20 bg-gold/[0.03] overflow-hidden relative shadow-premium-glow">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <DoorOpen className="w-24 h-24 text-gold" />
              </div>
              <CardContent className="p-10 space-y-8 relative z-10">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center border border-gold/30">
                    <DoorOpen className="w-8 h-8 text-gold" />
                  </div>
                  
                  <div className="space-y-3">
                    <h2 className="text-3xl font-display text-gold">{portaNome}</h2>
                    <p className="text-lg text-foreground/90 leading-relaxed italic max-w-xl mx-auto">
                      "O mapa não é o território, mas o modo como escolhemos habitá-lo."
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left pt-6 border-t border-gold/10 w-full">
                    <div className="space-y-2">
                      <h4 className="text-xs uppercase tracking-widest text-gold/50">Por onde começar</h4>
                      <p className="text-sm text-muted-foreground">O território que mais pede sua presença e consciência neste exato momento.</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs uppercase tracking-widest text-gold/50">Primeiro gesto</h4>
                      <p className="text-sm text-muted-foreground">Observar como este tema se manifesta em sua rotina hoje, sem tentar mudar nada.</p>
                    </div>
                  </div>

                  <div className="pt-8 w-full space-y-4">
                    <Button 
                      variant="gold" 
                      size="lg" 
                      onClick={handleAtravessar}
                      className="group px-12 h-16 text-lg shadow-premium-glow w-full sm:w-auto"
                    >
                      Seguir para a Rota dos Lobos
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground/60 max-w-md mx-auto italic">
                        A primeira travessia recomendada para fundadoras é a Rota dos Lobos. Nela, você começará a reconhecer onde sua voz foi silenciada e onde seu instinto tenta retornar.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>


          {/* 5. TORRE DOMINANTE (SECUNDÁRIA) */}
          <div className="max-w-2xl mx-auto px-6">
             <div className="text-center space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xs uppercase tracking-[0.3em] text-gold/40">Sua forma de sustentar o agora</h3>
                  <h4 className="text-2xl font-display text-gold/80">{cidadela.torre_dominante}</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Esta torre representa o alicerce estável de onde você observa o mundo e organiza sua energia vital.
                </p>
             </div>
          </div>

          {/* 6. ATMOSFERA DA CIDADELA (NARRATIVA) */}
          <div className="max-w-2xl mx-auto px-6 text-center">
            <Card className="border-gold/5 bg-transparent shadow-none">
              <CardContent className="space-y-6">
                <div className="w-12 h-px bg-gold/20 mx-auto" />
                <h3 className="text-xs uppercase tracking-[0.3em] text-gold/40">Atmosfera da CidadELA</h3>
                <div className="space-y-4">
                  <p className="text-lg text-foreground/80 font-display italic leading-relaxed">
                    Sua CidadELA atravessa um período de {cidadela.clima_cidadela.toLowerCase()}.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                    Há um movimento de {cidadela.atmosfera_derivada.join(', ').toLowerCase()}. Nem tudo está claro. Mas algo já começou a mudar.
                  </p>
                </div>
                <div className="w-12 h-px bg-gold/20 mx-auto" />
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="flex flex-col items-center gap-6 pt-12 border-t border-gold/5">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/clube')} 
            className="text-muted-foreground/50 hover:text-gold hover:bg-transparent text-xs uppercase tracking-widest"
          >
            Retornar ao Painel
          </Button>
        </div>
      </motion.div>
    );
  }
  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">

      <AnimatePresence>
        {isTransitioning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-background pointer-events-none"
          >
            <motion.p 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-gold font-display text-xl tracking-[0.2em] uppercase"
            >
              {transitionAnchor}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {(step as string) !== 'intro' && (step as string) !== 'resultado' && (step as string) !== 'gerando' && (

        <div className="flex flex-col space-y-6 pt-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gold/40">
              {saveStatus === 'saving' && "Sincronizando..."}
              {saveStatus === 'saved' && "CidadELA Salva"}
              {saveStatus === 'idle' && "Caminhando"}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-gold/40">
              {currentStepIndex + 1} / {STEPS.length}
            </div>
          </div>
          <div className="h-[2px] w-full bg-gold/5 overflow-hidden rounded-full">
            <motion.div 
              className="h-full bg-gold/30"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <LimiarCidadela key="intro" onEnter={next} />
        )}

        {step === 'sintoma' && (
          <QuestionStep 
            key="sintoma"
            title="Território do Sintoma"
            description="O que tem pedido sua atenção nos últimos tempos? Mapeie desconfortos, padrões e sinais."
            questions={[
              "Que padrão parece se repetir na sua vida?",
              "Onde isso aparece no corpo, nas emoções ou nas relações?",
              "O que você sente que já não consegue mais sustentar?"
            ]}
            value={respostas.sintoma}
            onChange={v => updateResposta('sintoma', v)}
            onNext={next}
            onBack={back}
          />
        )}

        {step === 'historia' && (
          <QuestionStep 
            key="historia"
            title="Território da História"
            description="Compreenda eventos e vínculos que contextualizam seu momento atual."
            questions={[
              "Que acontecimentos marcaram a forma como você se vê hoje?",
              "Que histórias você aprendeu a contar sobre si mesma?",
              "Houve alguma virada importante que mudou seu modo de existir?"
            ]}
            value={respostas.historia}
            onChange={v => updateResposta('historia', v)}
            onNext={next}
            onBack={back}
          />
        )}

        {step === 'objetivas' && (
          <motion.div key="objetivas" {...slideVariants} className="space-y-6">
            <header className="space-y-2">
              <h2 className="text-2xl font-display text-foreground">Primeira Cartografia</h2>
              <p className="text-sm text-muted-foreground">Onde sua vida interior está concentrando energia neste momento?</p>
            </header>
            
            <Card className="glass border-gold/10">
              <CardContent className="pt-6 space-y-12">
                {/* Pergunta 1 */}
                <div className="space-y-6">
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    1. Quando algo começa a mudar na sua vida, sua primeira reação costuma ser:
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'torres', text: 'Tentar organizar tudo para não perder o controle.', territory: 'Torres' },
                      { id: 'conselho_interior', text: 'Buscar entender o que isso significa antes de agir.', territory: 'Conselho Interior' },
                      { id: 'espelho_vinculos', text: 'Sentir medo de desagradar ou romper vínculos.', territory: 'Espelho dos Vínculos' },
                      { id: 'labirinto', text: 'Adiar a decisão até ter certeza.', territory: 'Labirinto' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => updateObjetiva('p1', opt.id)}
                        className={`p-4 rounded-xl border text-sm text-left transition-all ${
                          respostas.objetivas['p1'] === opt.id
                            ? 'bg-gold/20 border-gold text-gold shadow-premium-glow' 
                            : 'border-gold/10 hover:border-gold/30 text-muted-foreground'
                        }`}
                      >
                        <span className="block font-medium mb-1">{opt.text}</span>
                        <span className="text-[10px] uppercase tracking-widest opacity-40">→ {opt.territory}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pergunta 2 */}
                <div className="space-y-6">
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    2. Quando você percebe que algo já não funciona, tende a:
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'torres', text: 'Insistir mais um pouco.', territory: 'Torres' },
                      { id: 'bosque_arquetipos', text: 'Buscar sinais antes de agir.', territory: 'Bosque dos Arquétipos' },
                      { id: 'espelho_vinculos', text: 'Sentir culpa por decepcionar alguém.', territory: 'Espelho dos Vínculos' },
                      { id: 'praca_abalo', text: 'Esperar uma ruptura externa.', territory: 'Praça do Abalo' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => updateObjetiva('p2', opt.id)}
                        className={`p-4 rounded-xl border text-sm text-left transition-all ${
                          respostas.objetivas['p2'] === opt.id
                            ? 'bg-gold/20 border-gold text-gold shadow-premium-glow' 
                            : 'border-gold/10 hover:border-gold/30 text-muted-foreground'
                        }`}
                      >
                        <span className="block font-medium mb-1">{opt.text}</span>
                        <span className="text-[10px] uppercase tracking-widest opacity-40">→ {opt.territory}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pergunta 3 */}
                <div className="space-y-6">
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    3. Quando sente um desejo próprio, normalmente:
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'conselho_interior', text: 'Analisa se é viável.', territory: 'Conselho Interior' },
                      { id: 'portas', text: 'Questiona se tem direito a isso.', territory: 'Portas' },
                      { id: 'casa_matriz', text: 'Esconde para não incomodar.', territory: 'Casa Matriz' },
                      { id: 'forja', text: 'Transforma em projeto concreto.', territory: 'A Forja' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => updateObjetiva('p3', opt.id)}
                        className={`p-4 rounded-xl border text-sm text-left transition-all ${
                          respostas.objetivas['p3'] === opt.id
                            ? 'bg-gold/20 border-gold text-gold shadow-premium-glow' 
                            : 'border-gold/10 hover:border-gold/30 text-muted-foreground'
                        }`}
                      >
                        <span className="block font-medium mb-1">{opt.text}</span>
                        <span className="text-[10px] uppercase tracking-widest opacity-40">→ {opt.territory}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={back} className="text-muted-foreground hover:text-gold hover:bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
              </Button>
              <Button 
                onClick={next} 
                variant="gold" 
                disabled={Object.keys(respostas.objetivas).length < 3}
              >
                Avançar para Crenças <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'crencas' && (
          <QuestionStep 
            key="crencas"
            title="Território das Crenças"
            description="Identifique as narrativas que governam suas decisões e percepções."
            questions={[
              "Que verdades absolutas você carrega sobre a vida?",
              "Que voz interna mais te limita ou te impulsiona?",
              "Quais são os 'não ditos' que ainda comandam suas ações?"
            ]}
            value={respostas.crencas}
            onChange={v => updateResposta('crencas', v)}
            onNext={next}
            onBack={back}
          />
        )}

        {step === 'recursos' && (
          <QuestionStep 
            key="recursos"
            title="Território dos Recursos"
            description="Mapeie suas forças, práticas de sustentação e saberes acumulados."
            questions={[
              "O que te devolve o eixo quando você se perde?",
              "Quais são suas ferramentas naturais de enfrentamento?",
              "Em que você reconhece sua maior vitalidade?"
            ]}
            value={respostas.recursos}
            onChange={v => updateResposta('recursos', v)}
            onNext={next}
            onBack={back}
          />
        )}

        {step === 'seguranca' && (
          <QuestionStep 
            key="seguranca"
            title="Nível de Atenção e Segurança"
            description="Estabeleça um pacto de cuidado para sua jornada de travessia."
            questions={[
              "Como você avalia sua capacidade atual de sustentar este processo?",
              "Quais são seus limites inegociáveis neste momento?",
              "Que tipo de suporte você sente que mais precisa agora?"
            ]}
            value={respostas.seguranca}
            onChange={v => updateResposta('seguranca', v)}
            onNext={next}
            onBack={back}
            cta="Finalizar e Revelar"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function QuestionStep({ title, description, questions, value, onChange, onNext, onBack, cta = "Próximo" }: any) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-display text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </header>
      
      <Card className="glass border-gold/10 bg-card/20">
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-3">
            {questions.map((q: string, i: number) => (
              <p key={i} className="text-sm text-foreground/70 leading-relaxed italic">• {q}</p>
            ))}
          </div>
          <Textarea 
            placeholder="Escreva livremente sobre este território..."
            className="min-h-[200px] bg-background/30 border-gold/10 focus-visible:ring-gold/20 resize-none text-sm"
            value={value}
            onChange={e => onChange(e.target.value)}
          />
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-gold hover:bg-transparent">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </Button>
        <Button onClick={onNext} variant="gold" disabled={!value || value.length < 5}>
          {cta} <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}
