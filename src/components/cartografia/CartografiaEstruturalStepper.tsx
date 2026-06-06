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
    const proximoPasso = profileJson.recomendacoes?.proximo_passo || "Iniciar a Rota dos Lobos";

    const handleRotaLobos = () => {
      navigate('/clube/rotas/lobos');
    };

    const territoriesMetadata: Record<string, { label: string; districts: string[] }> = {
      dominante: { label: 'Território Dominante', districts: [cidadela.porta_inicial] },
      tensao: { label: 'Território em Tensão', districts: cidadela.distritos_tensao || [] },
      adormecido: { label: 'Território Adormecido', districts: cidadela.distritos_adormecidos || [] },
    };

    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="w-full max-w-4xl mx-auto space-y-16 pb-32"
      >
        <header className="text-center space-y-4 pt-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-gold/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-gold/20 shadow-premium-glow"
          >
            <Compass className="w-10 h-10 text-gold/80" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-display text-foreground tracking-tight">Leitura Estrutural Orácula™</h1>
          <p className="text-sm font-display text-gold/60 italic tracking-widest uppercase">CidaDELA Interior</p>
        </header>

        <section className="space-y-24">
          <div className="space-y-6 relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
              <div className="w-[400px] h-[400px] rounded-full bg-gold/5 blur-[100px] animate-pulse" />
            </div>
            
            <CamadaCidadela 
              data={{
                ...cidadela,
                distrito_dominante: cidadela.porta_inicial_nome,
                distritos_ativos: cidadela.distritos_acesos,
                distritos_tensao: cidadela.distritos_tensao,
                leitura_integrada: profileJson.leitura_simbolica.frase_semente,
                tensao_simbolica: profileJson.leitura_simbolica.tensao_que_pede_escuta,
                direcao_travessia: profileJson.leitura_simbolica.movimento_necessario,
              }} 
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

          <div className="max-w-2xl mx-auto px-6 text-center space-y-8">
            <div className="space-y-4">
              <p className="text-lg text-foreground/90 font-display italic leading-relaxed">
                "Sua CidadELA revelou onde sua energia está habitando agora. Este não é um diagnóstico. É uma cartografia do momento."
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A Casa não vai dizer quem você é. Ela vai mostrar por onde sua travessia pode começar.
              </p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(territoriesMetadata).map(([key, meta]) => (
              <motion.div 
                key={key}
                className={`p-6 rounded-2xl border transition-all ${
                  key === 'dominante' ? 'border-gold/30 bg-gold/10 shadow-premium-glow' : 
                  key === 'tensao' ? 'border-amber-500/20 bg-amber-500/5 animate-pulse' : 
                  'border-white/5 bg-white/5 opacity-60'
                }`}
              >
                <h4 className="text-xs uppercase tracking-widest text-gold/60 mb-3">{meta.label}</h4>
                <div className="space-y-2">
                  {meta.districts.map(d => (
                    <p key={d} className="text-lg font-display text-foreground">{DISTRITOS_META[d]?.nome || d}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto px-6 text-center">
            <Card className="glass border-gold/20 bg-gold/[0.03]">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xs uppercase tracking-[0.3em] text-gold/40">Próxima Travessia Recomendada</h3>
                  <h4 className="text-xl font-display text-gold">{proximoPasso}</h4>
                </div>
                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  <p>A primeira travessia recomendada para fundadoras é a Rota dos Lobos.</p>
                  <p className="italic">Nela, você começará a reconhecer onde sua voz foi silenciada, onde sua adaptação virou sobrevivência e onde seu instinto tenta retornar.</p>
                </div>
                <Button 
                  variant="gold" 
                  size="lg" 
                  onClick={handleRotaLobos}
                  className="w-full h-14 shadow-premium-glow group"
                >
                  Entrar na Rota dos Lobos
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/clube/cidadela')}
                  className="w-full text-muted-foreground/60 hover:text-gold"
                >
                  Ver minha CidadELA completa
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
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
              <h2 className="text-2xl font-display text-foreground">Modo de Habitar</h2>
              <p className="text-sm text-muted-foreground">O núcleo da sua forma de habitar o mundo.</p>
            </header>
            
            <Card className="glass border-gold/10">
              <CardContent className="pt-6 space-y-8">
                {perguntas.map((p, i) => (
                  <div key={p.id} className="space-y-4">
                    <p className="text-sm font-medium text-foreground/80 leading-relaxed">{(p as any).texto_pergunta || p.id}</p>
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          onClick={() => updateObjetiva(p.id, val)}
                          className={`h-10 rounded-md border text-sm transition-all ${
                            respostas.objetivas[p.id] === val 
                              ? 'bg-gold border-gold text-gold-foreground shadow-premium-glow' 
                              : 'border-gold/10 hover:border-gold/30 text-muted-foreground'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={back} className="text-muted-foreground hover:text-gold hover:bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
              </Button>
              <Button 
                onClick={next} 
                variant="gold" 
                disabled={Object.keys(respostas.objetivas).length < perguntas.length}
              >
                Prosseguir <ArrowRight className="w-4 h-4 ml-2" />
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
