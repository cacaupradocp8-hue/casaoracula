import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Map, Sparkles, ShieldAlert, History, User, 
  Brain, Heart, ShieldCheck, ArrowRight, ArrowLeft,
  Check, Loader2
} from 'lucide-react';
import { useCartografiaEstrutural, type CartografiaStepId } from '@/hooks/useCartografiaEstrutural';
import { SaidaSimbolica } from '@/components/cartografia-unificada/SaidaSimbolica';
import { CamadaLeituraPsiquica } from '@/components/cartografia-unificada/CamadaLeituraPsiquica';
import { CamadaCidadela } from '@/components/cartografia-unificada/CamadaCidadela';

const STEPS: { id: CartografiaStepId; title: string; icon: any }[] = [
  { id: 'sintoma', title: 'Sintoma', icon: ShieldAlert },
  { id: 'historia', title: 'História', icon: History },
  { id: 'tracos', title: 'Traços', icon: User },
  { id: 'crencas', title: 'Crenças', icon: Brain },
  { id: 'recursos', title: 'Recursos', icon: Heart },
  { id: 'seguranca', title: 'Segurança', icon: ShieldCheck },
];

export function CartografiaEstruturalStepper() {
  const { 
    step, setStep, respostas, updateResposta, 
    updateBig5, perguntas, finalizar, loading, result,
    saveStatus, hasDraft, retomarRascunho
  } = useCartografiaEstrutural();

  const currentStepIndex = STEPS.findIndex(s => s.id === step);
  const progress = step === 'intro' ? 0 : step === 'resultado' ? 100 : ((currentStepIndex + 1) / STEPS.length) * 100;

  const next = () => {
    if (step === 'intro') setStep('sintoma');
    else if (step === 'sintoma') setStep('historia');
    else if (step === 'historia') setStep('tracos');
    else if (step === 'tracos') setStep('crencas');
    else if (step === 'crencas') setStep('recursos');
    else if (step === 'recursos') setStep('seguranca');
    else if (step === 'seguranca') finalizar();
  };

  const back = () => {
    if (step === 'sintoma') setStep('intro');
    else if (step === 'historia') setStep('sintoma');
    else if (step === 'tracos') setStep('historia');
    else if (step === 'crencas') setStep('tracos');
    else if (step === 'recursos') setStep('crencas');
    else if (step === 'seguranca') setStep('recursos');
  };

  const slideVariants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  if (step === 'gerando') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <Loader2 className="w-12 h-12 animate-spin text-gold" />
        <div className="space-y-2">
          <h2 className="text-2xl font-display text-gold">Desenhando seu Mapa Vivo...</h2>
          <p className="text-muted-foreground max-w-xs mx-auto">
            A cartógrafa está integrando seus territórios e derivando sua CidaDELA Interior.
          </p>
        </div>
      </div>
    );
  }

  if (step === 'resultado' && result) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="w-full max-w-4xl mx-auto space-y-12 pb-20"
      >
        <div className="text-center space-y-4">
          <Badge variant="outline" className="text-gold border-gold/30 px-3 py-1">Cartografia Concluída</Badge>
          <h1 className="text-4xl font-display text-foreground">Mapa Vivo: CidaDELA Interior</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Este é o seu Mapa Vivo estrutural. Ele não é um diagnóstico, mas um espelho simbólico do seu momento atual.
          </p>
        </div>

        <SaidaSimbolica saida={result.leitura.saida_cliente} cidadela={result.cidadela} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CamadaLeituraPsiquica data={result.leitura.profile} medias={result.leitura.medias_calculadas} />
          <CamadaCidadela 
            data={result.cidadela} 
            cor={result.cidadela.cor_derivada} 
            corHex={result.cidadela.cor_hex}
            atmosfera={result.cidadela.atmosfera_derivada}
            simbolo={result.cidadela.simbolo_derivado}
            simboloIcon={result.cidadela.simbolo_derivado_icon}
            territorios={result.cidadela.distritos_acesos}
            pontoPartida={result.cidadela.porta_inicial}
          />
        </div>


        <Card className="glass border-gold/20">
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold" />
              Nível de Atenção e Segurança
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {result.profileJson.derivacao.territorios.atencao_seguranca}
            </p>
            <div className="mt-4 p-4 rounded-lg bg-gold/5 border border-gold/10 text-xs text-muted-foreground italic">
              Nota Ética: Esta cartografia é uma ferramenta de auto-observação e suporte ao processo terapêutico. 
              Em caso de crise ou sofrimento intenso, procure sempre um profissional de saúde mental ou serviços de emergência.
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col items-center gap-4 pt-8">
          <p className="text-sm text-muted-foreground">Sua travessia continua nas Rotas da Casa Orácula.</p>
          <Button onClick={() => window.location.href = '/dashboard'} variant="gold">
            Continuar para o Dashboard
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {step !== 'intro' && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-widest">
            <span>Território {currentStepIndex + 1} de {STEPS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1 bg-gold/10" />
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" {...slideVariants} className="text-center space-y-8 py-10">
            <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Map className="w-10 h-10 text-gold" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-display text-foreground">CidaDELA Interior</h1>
              <p className="text-muted-foreground leading-relaxed max-w-md mx-auto italic">
                Cartografia Estrutural Orácula™
              </p>
              <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
                Uma jornada de auto-observação profunda para organizar seu momento atual e habitar o que é seu.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 text-left max-w-sm mx-auto">
              <InfoItem icon={ShieldCheck} text="Experiência segura e não diagnóstica" />
              <InfoItem icon={Sparkles} text="Mapeamento de 6 territórios estruturais" />
              <InfoItem icon={History} text="Você pode pausar e continuar depois" />
            </div>
            <Button onClick={next} variant="gold" size="lg" className="px-10 h-14 text-lg">
              Começar a travessia
            </Button>
            <p className="text-[10px] text-muted-foreground/40 uppercase tracking-widest">
              Uso exclusivo para assinantes Casa Orácula
            </p>
          </motion.div>
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

        {step === 'tracos' && (
          <motion.div key="tracos" {...slideVariants} className="space-y-6">
            <header className="space-y-2">
              <h2 className="text-2xl font-display text-foreground">Território dos Traços</h2>
              <p className="text-sm text-muted-foreground">Suas tendências de funcionamento e estilo pessoal.</p>
            </header>
            
            <Card className="glass border-gold/10">
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm font-medium">Como você costuma reagir sob pressão?</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['Ação', 'Análise', 'Cuidado', 'Controle', 'Recolhimento'].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => updateResposta('tracos_qualitativo', opt)}
                      className={`p-3 rounded-lg border text-sm transition-all ${
                        respostas.tracos_qualitativo === opt 
                          ? 'border-gold bg-gold/10 text-gold' 
                          : 'border-border/40 hover:border-gold/30'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <Textarea 
                  placeholder="Conte mais sobre seus traços..."
                  className="min-h-[120px] bg-background/50"
                  value={respostas.tracos_qualitativo}
                  onChange={e => updateResposta('tracos_qualitativo', e.target.value)}
                />
              </CardContent>
            </Card>

            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={back}><ArrowLeft className="w-4 h-4 mr-2" /> Voltar</Button>
              <Button onClick={next} variant="gold" disabled={!respostas.tracos_qualitativo}>
                Próximo <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'crencas' && (
          <QuestionStep 
            key="crencas"
            title="Território das Crenças"
            description="Identifique narrativas internas, valores e lealdades invisíveis."
            questions={[
              "Que frase interna parece governar suas escolhas?",
              "O que você acredita que precisa provar?",
              "Que medo aparece quando você pensa em mudar?"
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
            description="Mapeie suas forças, práticas e saberes disponíveis."
            questions={[
              "O que em você continua vivo, mesmo nos períodos difíceis?",
              "Quem ou o que sustenta você quando tudo aperta?",
              "Que práticas ajudam você a voltar para si?"
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
            description="Sinalize sinais de sobrecarga e necessidade de apoio."
            questions={[
              "Há algo neste momento que parece grande demais para atravessar sozinha?",
              "Existem sinais de exaustão ou perda de suporte?",
              "Que tipo de apoio seria importante agora?"
            ]}
            value={respostas.seguranca}
            onChange={v => updateResposta('seguranca', v)}
            onNext={next}
            onBack={back}
            cta="Revelar meu Mapa Vivo"
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
      
      <Card className="glass border-gold/10">
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-3">
            {questions.map((q: string, i: number) => (
              <p key={i} className="text-sm text-foreground/80 leading-relaxed italic">• {q}</p>
            ))}
          </div>
          <Textarea 
            placeholder="Escreva livremente sobre este território..."
            className="min-h-[200px] bg-background/50 focus-visible:ring-gold/30"
            value={value}
            onChange={e => onChange(e.target.value)}
          />
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-2" /> Voltar</Button>
        <Button onClick={onNext} variant="gold" disabled={!value || value.length < 5}>
          {cta} <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}

function InfoItem({ icon: Icon, text }: any) {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <div className="w-8 h-8 rounded-full bg-gold/5 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-gold" />
      </div>
      <span>{text}</span>
    </div>
  );
}

function Badge({ children, variant, className }: any) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
}
