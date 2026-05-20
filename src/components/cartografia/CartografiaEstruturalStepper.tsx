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
  { id: 'objetivas', title: 'Núcleo Estruturado', icon: User },
  { id: 'crencas', title: 'Crenças', icon: Brain },
  { id: 'recursos', title: 'Recursos', icon: Heart },
  { id: 'seguranca', title: 'Segurança', icon: ShieldCheck },
];

function TerritorioCard({ title, content, icon: Icon }: { title: string, content: string, icon: any }) {
  const isPlaceholder = !content || content === '""' || content.toLowerCase().includes('aprofundando') || content.toLowerCase().includes('contextualização') || content.toLowerCase().includes('identificando') || content.toLowerCase().includes('mapeando');
  
  if (!content || content === '""') return null;

  return (
    <Card className="glass border-gold/10 hover:border-gold/30 transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-display flex items-center gap-2 text-gold/80">
          <Icon className="w-4 h-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-xs leading-relaxed ${isPlaceholder ? 'italic text-muted-foreground/60' : 'text-muted-foreground'}`}>
          {isPlaceholder ? "Este território será aprofundado em uma próxima travessia." : content}
        </p>
      </CardContent>
    </Card>
  );
}

export function CartografiaEstruturalStepper() {
  const { 
    step, setStep, respostas, updateResposta, 
    updateObjetiva, perguntas, finalizar, loading, result,
    saveStatus, hasDraft, retomarRascunho
  } = useCartografiaEstrutural();

  const currentStepIndex = STEPS.findIndex(s => s.id === step);
  const progress = step === 'intro' ? 0 : step === 'resultado' ? 100 : ((currentStepIndex + 1) / STEPS.length) * 100;

  const next = () => {
    if (step === 'intro') setStep('sintoma');
    else if (step === 'sintoma') setStep('historia');
    else if (step === 'historia') setStep('objetivas');
    else if (step === 'objetivas') setStep('crencas');
    else if (step === 'crencas') setStep('recursos');
    else if (step === 'recursos') setStep('seguranca');
    else if (step === 'seguranca') finalizar();
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
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-gold border-gold/30 mx-auto">Cartografia Concluída</div>
          <h1 className="text-4xl font-display text-foreground">Mapa Vivo: CidaDELA Interior</h1>
          <p className="text-sm font-display text-gold/80 italic">Um retrato simbólico-estrutural do seu momento atual</p>
          <p className="text-muted-foreground max-w-2xl mx-auto text-xs">
            Esta cartografia é uma ferramenta de auto-observação e suporte ao processo terapêutico.
          </p>
        </div>

        <SaidaSimbolica saida={result.leitura.saida_cliente} cidadela={result.cidadela} profileJson={result.profileJson} />
        
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

        {/* Bloco 3 — Territórios da CidaDELA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TerritorioCard 
            title="Sintoma" 
            content={result.profileJson.derivacao.territorios.sintoma} 
            icon={ShieldAlert}
          />
          <TerritorioCard 
            title="História" 
            content={result.profileJson.derivacao.territorios.historia_vida} 
            icon={History}
          />
          <TerritorioCard 
            title="Traços" 
            content={result.profileJson.derivacao.territorios.tracos} 
            icon={User}
          />
          <TerritorioCard 
            title="Crenças" 
            content={result.profileJson.derivacao.territorios.crencas} 
            icon={Brain}
          />
          <TerritorioCard 
            title="Recursos" 
            content={result.profileJson.derivacao.territorios.recursos} 
            icon={Heart}
          />
          <TerritorioCard 
            title="Atenção e Segurança" 
            content={result.profileJson.derivacao.territorios.atencao_seguranca} 
            icon={ShieldCheck}
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
              {result.profileJson.derivacao.territorios.atencao_seguranca || 'Nível de segurança estabilizado para a travessia.'}
            </p>
            <div className="mt-4 p-4 rounded-lg bg-gold/5 border border-gold/10 text-xs text-muted-foreground italic">
              Nota Ética: Esta cartografia é uma ferramenta de auto-observação e suporte ao processo terapêutico. 
              Em caso de crise ou sofrimento intenso, procure sempre um profissional de saúde mental ou serviços de emergência.
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-gold/20 overflow-hidden">
          <CardHeader className="bg-gold/5">
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" />
              Próximo Passo: Sua Travessia Guiada
            </CardTitle>
            <CardDescription>
              Com base no seu Mapa Vivo, sugerimos este caminho para continuar habitando sua CidaDELA.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Map className="w-4 h-4 text-gold" />
                  Rotas Recomendadas
                </h4>
                <ul className="space-y-2">
                  {result.profileJson.recomendacoes?.rotas && result.profileJson.recomendacoes.rotas.length > 0 ? (
                    result.profileJson.recomendacoes.rotas
                      .filter((r: string) => r && r !== '""' && r.length > 2)
                      .map((rota: string) => (
                        <li key={rota} className="text-xs text-muted-foreground flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-gold/40" />
                          {rota}
                        </li>
                      ))
                  ) : (
                    <li className="text-xs text-muted-foreground italic">Identificando rotas ideais...</li>
                  )}
                  {result.profileJson.recomendacoes?.rotas?.filter((r: string) => r && r !== '""' && r.length > 2).length === 0 && (
                     <li className="text-xs text-muted-foreground italic">Identificando rotas ideais...</li>
                  )}
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Heart className="w-4 h-4 text-gold" />
                  Práticas Iniciais
                </h4>
                <ul className="space-y-2">
                  {result.profileJson.recomendacoes?.praticas && result.profileJson.recomendacoes.praticas.length > 0 ? (
                    result.profileJson.recomendacoes.praticas
                      .filter((p: string) => p && p !== '""' && p.length > 2)
                      .map((pratica: string) => (
                        <li key={pratica} className="text-xs text-muted-foreground flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-gold/40" />
                          {pratica}
                        </li>
                      ))
                  ) : (
                    <li className="text-xs text-muted-foreground italic">Mapeando práticas de sustentação...</li>
                  )}
                  {result.profileJson.recomendacoes?.praticas?.filter((p: string) => p && p !== '""' && p.length > 2).length === 0 && (
                    <li className="text-xs text-muted-foreground italic">Mapeando práticas de sustentação...</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gold/5 border border-gold/10 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gold">
                <Sparkles className="w-4 h-4" />
                Rotas da Casa Orácula
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {result.profileJson.recomendacoes?.proximo_passo && result.profileJson.recomendacoes.proximo_passo !== '""' 
                  ? result.profileJson.recomendacoes.proximo_passo 
                  : "Continue habitando sua CidaDELA através das Rotas da Casa Orácula."}
              </p>
              <Button 
                variant="gold" 
                size="sm" 
                className="w-full text-[10px] uppercase tracking-wider"
                onClick={() => window.location.href = '/clube'}
              >
                Entrar nas Rotas da Casa Orácula
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col items-center gap-4 pt-8">
          <Button onClick={() => window.location.href = '/dashboard'} variant="outline" className="px-8 border-gold/30 text-gold hover:bg-gold/5">
            Voltar ao Painel
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {(step as string) !== 'intro' && (step as string) !== 'resultado' && (step as string) !== 'gerando' && (
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground/60">
              {saveStatus === 'saving' && <><Loader2 className="w-3 h-3 animate-spin" /> Salvando...</>}
              {saveStatus === 'saved' && <><Check className="w-3 h-3 text-green-500" /> Progresso salvo</>}
              {saveStatus === 'error' && <><ShieldAlert className="w-3 h-3 text-red-500" /> Erro ao salvar</>}
              {saveStatus === 'idle' && <>Você pode continuar depois</>}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
              {Math.round(progress)}%
            </div>
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
                Leitura Estrutural Orácula™
              </p>
              <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
                Uma jornada de auto-observação guiada para organizar seu momento atual e habitar o que é seu.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 text-left max-w-sm mx-auto">
              <InfoItem icon={ShieldCheck} text="Experiência segura e não diagnóstica" />
              <InfoItem icon={Sparkles} text="Mapeamento de 6 territórios reflexivos" />
              <InfoItem icon={History} text="Você pode pausar e continuar depois" />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={next} variant="gold" size="lg" className="px-10 h-14 text-lg w-full sm:w-auto">
                Começar a travessia
              </Button>
              {hasDraft && (
                <Button 
                  onClick={retomarRascunho} 
                  variant="outline" 
                  size="lg" 
                  className="px-10 h-14 text-lg border-gold/30 text-gold hover:bg-gold/5 w-full sm:w-auto"
                >
                  Continuar de onde parei
                </Button>
              )}
            </div>
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

        {step === 'objetivas' && (
          <motion.div key="objetivas" {...slideVariants} className="space-y-6">
            <header className="space-y-2">
              <h2 className="text-2xl font-display text-foreground">Núcleo Estruturado</h2>
              <p className="text-sm text-muted-foreground">Responda com honestidade para mapear seu modo de funcionamento atual.</p>
            </header>
            
            <div className="space-y-8">
              {perguntas.map((p) => (
                <Card key={p.id} className="glass border-gold/10 overflow-hidden">
                  <CardContent className="pt-6 space-y-4">
                    <p className="text-sm font-medium leading-relaxed">{p.texto_pergunta}</p>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Discordo</span>
                      <div className="flex-1 flex justify-between px-4">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            key={val}
                            onClick={() => updateObjetiva(p.id, val)}
                            className={`w-10 h-10 rounded-full border transition-all flex items-center justify-center text-xs ${
                              respostas.objetivas[p.id] === val
                                ? 'bg-gold border-gold text-gold-foreground shadow-lg shadow-gold/20'
                                : 'border-border/40 hover:border-gold/30 text-muted-foreground'
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Concordo</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between pt-8">
              <Button variant="ghost" onClick={back}><ArrowLeft className="w-4 h-4 mr-2" /> Voltar</Button>
              <Button 
                onClick={next} 
                variant="gold" 
                disabled={Object.keys(respostas.objetivas).length < perguntas.length}
              >
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
