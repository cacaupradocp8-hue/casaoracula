import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
  { id: 'objetivas', title: 'Mapeamento', icon: User, anchor: 'Centro de Atenção' },
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

    if (step === 'intro') setStep('objetivas');
    else if (step === 'objetivas') triggerTransition(() => finalizar(), 'Revelação');
  };

  const back = () => {
    if (step === 'objetivas') setStep('intro');
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
            <p className="text-sm font-display text-gold/60 italic tracking-widest uppercase">Primeira Cartografia</p>
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

          {/* 3. LEITURA VIBRACIONAL (DOMINANTE, TENSÃO, ADORMECIDO) */}
          <div className="max-w-3xl mx-auto px-6 space-y-12">
            <div className="text-center space-y-2">
              <h3 className="text-xs uppercase tracking-[0.3em] text-gold/40">Leitura Vibracional dos Territórios</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Dominante */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl border border-gold/20 bg-gold/10 flex flex-col items-center text-center gap-4 transition-all hover:bg-gold/15"
              >
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center border border-gold/30">
                  <span className="text-2xl">{DISTRITOS_META[result.profileJson.recomendacoes?.territorio_dominante || '']?.icon || '🏛️'}</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm uppercase tracking-widest text-gold/60">Território Dominante</h4>
                  <h5 className="text-xl font-display text-gold">{DISTRITOS_META[result.profileJson.recomendacoes?.territorio_dominante || '']?.nome || 'Em Revelação'}</h5>
                  <p className="text-xs text-muted-foreground leading-relaxed italic mt-2">
                    Onde sua energia está mais presente e estruturada agora.
                  </p>
                </div>
              </motion.div>

              {/* Tensão */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-2xl border border-red-500/10 bg-red-500/5 flex flex-col items-center text-center gap-4 transition-all hover:bg-red-500/10"
              >
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                  <span className="text-2xl">{DISTRITOS_META[result.profileJson.recomendacoes?.territorio_tensao || '']?.icon || '⚡'}</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm uppercase tracking-widest text-red-400/60">Território de Tensão</h4>
                  <h5 className="text-xl font-display text-red-400/80">{DISTRITOS_META[result.profileJson.recomendacoes?.territorio_tensao || '']?.nome || 'Em Revelação'}</h5>
                  <p className="text-xs text-muted-foreground leading-relaxed italic mt-2">
                    O ponto que pede atenção e cuidado para não gerar colapso.
                  </p>
                </div>
              </motion.div>

              {/* Adormecido */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-2xl border border-blue-500/10 bg-blue-500/5 flex flex-col items-center text-center gap-4 transition-all hover:bg-blue-500/10"
              >
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                  <span className="text-2xl">{DISTRITOS_META[result.profileJson.recomendacoes?.territorio_adormecido || '']?.icon || '🌙'}</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm uppercase tracking-widest text-blue-400/60">Território Adormecido</h4>
                  <h5 className="text-xl font-display text-blue-400/80">{DISTRITOS_META[result.profileJson.recomendacoes?.territorio_adormecido || '']?.nome || 'Em Revelação'}</h5>
                  <p className="text-xs text-muted-foreground leading-relaxed italic mt-2">
                    Onde reside um potencial ainda não explorado nesta fase.
                  </p>
                </div>
              </motion.div>
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


        {step === 'objetivas' && (
          <motion.div key="objetivas" {...slideVariants} className="space-y-6">
            <header className="space-y-2">
              <h2 className="text-2xl font-display text-foreground">Primeira Cartografia</h2>
              <p className="text-sm text-muted-foreground">Onde sua vida interior está concentrando energia neste momento?</p>
            </header>
            
            <Card className="glass border-gold/10">
              <CardContent className="pt-6 space-y-12">
                {/* Pergunta 1 */}
                {/* Pergunta 1 */}
                <div className="space-y-6">
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    1. Quando você percebe que um ciclo está chegando ao fim e algo novo precisa nascer, qual é o seu primeiro movimento?
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'portao_chegada', text: 'Eu sinto um impulso de agir imediatamente, mesmo sem saber para onde vou.' },
                      { id: 'torres', text: 'Eu tento organizar tudo o que restou e criar uma estrutura para o que virá.' },
                      { id: 'labirinto', text: 'Eu me recolho para processar a dúvida e o medo de errar o caminho.' },
                      { id: 'conselho_interior', text: 'Eu busco silenciar para ouvir o que a minha sabedoria interna diz sobre a mudança.' }
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
                        <span className="block font-medium">{opt.text}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pergunta 2 */}
                <div className="space-y-6 pt-6 border-t border-gold/5">
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    2. Em momentos de grande pressão externa ou crise, como sua energia se manifesta?
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'praca_abalo', text: 'Eu me sinto paralisada ou sinto que as bases do que eu acreditava foram abaladas.' },
                      { id: 'forja', text: 'Eu canalizo essa pressão para transformar algo concreto na minha realidade.' },
                      { id: 'espelho_vinculos', text: 'Eu me preocupo excessivamente com o impacto disso nas minhas relações.' },
                      { id: 'casa_sonhos', text: 'Eu fujo para o meu mundo interno ou sinto um cansaço profundo e vontade de dormir.' }
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
                        <span className="block font-medium">{opt.text}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pergunta 3 */}
                <div className="space-y-6 pt-6 border-t border-gold/5">
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    3. Qual dessas frases mais ressoa com a sua dificuldade atual?
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'portal_renascimento', text: 'Eu sei que preciso deixar algo ir, mas não sei como dar o adeus final.' },
                      { id: 'bosque_arquetipos', text: 'Eu sinto que perdi o contato com a minha força selvagem e instintiva.' },
                      { id: 'jardim_arquetipos', text: 'Eu sinto que cuido de todos ao meu redor, mas esqueço de nutrir a mim mesma.' },
                      { id: 'casa_matriz', text: 'Eu sinto que não tenho um espaço seguro (interno ou externo) para ser quem eu sou.' }
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
                        <span className="block font-medium">{opt.text}</span>
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
                disabled={Object.keys(respostas.objetivas).length < 3 || loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Finalizar e Revelar'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


