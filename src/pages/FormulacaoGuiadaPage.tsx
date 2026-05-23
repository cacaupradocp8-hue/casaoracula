import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Target, 
  ArrowLeft, 
  AlertCircle, 
  FileText, 
  Search, 
  BarChart3, 
  GraduationCap,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Zap,
  RefreshCcw,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PageBreadcrumb } from '@/components/navigation/PageBreadcrumb';
import { BackButton } from '@/components/navigation/BackButton';

export default function FormulacaoGuiadaPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 pattern-geometric overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
        <PageBreadcrumb
          items={[
            { label: 'Casa das Máquinas', href: '/casa-das-maquinas' },
            { label: 'Sala de Treinamento', href: '/sala-de-treinamento' },
            { label: 'Formulação Guiada' },
          ]}
        />
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 sm:space-y-4 min-w-0">
            <BackButton />
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display tracking-wide text-foreground leading-tight">
                Formulação <span className="text-primary italic">Guiada</span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
                Aprenda a organizar uma leitura em camadas antes de escolher uma direção ou intervenção.
              </p>
            </div>
          </div>
          
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs px-4 py-2 font-bold uppercase tracking-widest self-start md:self-auto">
            Laboratório de Raciocínio
          </Badge>
        </header>

        {/* Bloco ético obrigatório */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-6 sm:p-8 flex items-start gap-4 sm:gap-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-amber-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-amber-500 font-display">Espaço Pedagógico e Ético</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Este espaço é pedagógico. Não usa clientes reais, não gera diagnóstico, não substitui supervisão e não deve ser usado como prontuário ou decisão profissional automática. Uma boa formulação permanece aberta, contextual e revisável.
            </p>
          </div>
        </div>

        <section className="bg-card/40 border border-border rounded-[2.5rem] p-8 sm:p-10 space-y-6">
          <div className="flex items-center gap-3 text-primary">
            <GraduationCap className="w-6 h-6" />
            <h2 className="text-2xl font-display italic">O que é formular</h2>
          </div>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-4xl">
            Formular é organizar sinais, contexto, hipóteses, cautelas e direções possíveis sem reduzir a pessoa a um rótulo. Uma boa formulação permanece aberta, supervisionável e ajustável ao ritmo e resposta de quem atendemos.
          </p>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-3 text-primary border-b border-border/10 pb-4">
            <BarChart3 className="w-5 h-5" />
            <h2 className="text-xl font-display tracking-widest uppercase text-xs font-bold">As 7 camadas de formulação</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <LayerCard 
              num={1}
              title="Queixa e contexto"
              description="O que aparece? Em que situação? Há quanto tempo? O que intensifica ou suaviza?"
              icon={MessageCircle}
            />
            <LayerCard 
              num={2}
              title="Sinais observáveis"
              description="Que sinais podem ser observados no campo sem interpretar cedo demais?"
              icon={Search}
            />
            <LayerCard 
              num={3}
              title="Hipóteses provisórias"
              description="Que leituras são possíveis? O que aponta a favor e contra cada hipótese?"
              icon={Sparkles}
            />
            <LayerCard 
              num={4}
              title="Cautelas éticas"
              description="Há algo que peça mais contexto, supervisão, estabilização ou encaminhamento?"
              icon={AlertCircle}
            />
            <LayerCard 
              num={5}
              title="Direção de trabalho"
              description="O caso pede estabilizar, regular, investigar crenças ou fortalecer recursos?"
              icon={Compass}
            />
            <LayerCard 
              num={6}
              title="Intervenção possível"
              description="Qual seria o menor próximo passo responsável e coerente com a direção?"
              icon={Target}
            />
            <LayerCard 
              num={7}
              title="Evolução e revisão"
              description="Como observar a resposta, ajustar a direção e rever periodicamente a formulação?"
              icon={RefreshCcw}
            />
            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4">
              <Zap className="w-8 h-8 text-primary/40" />
              <p className="text-xs text-primary/60 font-bold uppercase tracking-widest">Maestria em Treino</p>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-3 text-primary border-b border-border/10 pb-4">
            <FileText className="w-5 h-5" />
            <h2 className="text-xl font-display tracking-widest uppercase text-xs font-bold">Exercício de Treino (Modelo)</h2>
          </div>
          <Card className="bg-card/40 border-border rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 sm:p-12 space-y-8 opacity-60">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Tema do caso fictício</label>
                  <div className="h-10 border-b border-border/50 text-sm text-muted-foreground italic">Ex: Sobrecarga em transição...</div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Queixa aparente</label>
                  <div className="h-10 border-b border-border/50 text-sm text-muted-foreground italic">O que a personagem diz?</div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Sinais e Contexto</label>
                <div className="h-20 border-b border-border/50 text-sm text-muted-foreground italic">O que foi observado no cenário fictício?</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Hipóteses Provisórias</label>
                  <div className="h-16 border-b border-border/50 text-sm text-muted-foreground italic">Possíveis leituras simbólicas...</div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Cautelas</label>
                  <div className="h-16 border-b border-border/50 text-sm text-muted-foreground italic">Pontos de atenção ética...</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Direção e Intervenção</label>
                  <div className="h-16 border-b border-border/50 text-sm text-muted-foreground italic">Próximo passo proposto...</div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">O que revisar depois?</label>
                  <div className="h-16 border-b border-border/50 text-sm text-muted-foreground italic">Sinais de resposta esperados...</div>
                </div>
              </div>
              <div className="pt-4 flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500/60 flex items-center gap-2">
                  <AlertCircle className="w-3 h-3" /> Ficha Visual Mock — Não persistente
                </span>
                <Button variant="outline" className="rounded-full px-6 text-xs uppercase tracking-widest font-bold" disabled>
                  Começar Exercício
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-3 text-primary border-b border-border/10 pb-4">
            <Target className="w-5 h-5" />
            <h2 className="text-xl font-display tracking-widest uppercase text-xs font-bold">Perguntas-guia para o olhar</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Estou confundindo hipótese com certeza?",
              "Estou reduzindo a pessoa a uma ferramenta ou tipo?",
              "Que contexto ainda falta para esta leitura?",
              "Que hipótese alternativa precisa ser considerada?",
              "Existe algo que peça supervisão ou pausa?",
              "Qual é o menor próximo passo responsável?"
            ].map((q, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-card/30 border border-border rounded-2xl group hover:border-primary/20 transition-colors">
                <div className="w-6 h-6 rounded-full bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                  <span className="text-[10px] font-bold text-primary/40">?</span>
                </div>
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{q}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-card/40 border border-border rounded-[2.5rem] p-8 sm:p-10 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <BarChart3 className="w-6 h-6" />
            <h3 className="text-xl font-display italic">Treinar para pensar com o Atlas</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed max-w-4xl">
            A Formulação Guiada treina a mesma lógica que o Atlas organiza na Casa das Máquinas. Aqui, a profissional aprende a pensar em camadas antes de aplicar esse raciocínio em casos reais. Tudo acontece em ambiente fictício e pedagógico.
          </p>
        </section>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-10">
          <Button variant="outline" className="rounded-full px-8 py-6 h-auto font-bold uppercase tracking-widest text-xs" onClick={() => navigate('/sala-de-treinamento')}>
            Voltar para Sala de Treinamento
          </Button>
          <Button variant="outline" className="rounded-full px-8 py-6 h-auto font-bold uppercase tracking-widest text-xs" onClick={() => navigate('/sala-de-treinamento/casos-simulados')}>
            Praticar com Casos Fictícios
          </Button>
          <Button variant="outline" className="rounded-full px-8 py-6 h-auto font-bold uppercase tracking-widest text-xs" onClick={() => navigate('/sala-de-treinamento/clinica-dos-contos')}>
            Treinar com Literatura
          </Button>
        </div>

        <section className="mt-12 pt-12 border-t border-border/10 max-w-3xl mx-auto space-y-8">
          <div className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-8 sm:p-10 space-y-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Do treino à prática profissional</span>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-2xl font-display text-foreground italic">Pronto para aplicar na prática real?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Na Formulação Guiada, você treina o raciocínio com exercícios pedagógicos e fictícios. No Atlas Orácula, esse mesmo raciocínio é aplicado no contexto profissional da Casa das Máquinas, com mais responsabilidade, cautela e respeito aos limites éticos.
              </p>
              <p className="text-xs text-muted-foreground/60 italic max-w-xl mx-auto">
                Os exercícios desta sala não são salvos como prontuário, não são transferidos para o Atlas e não substituem supervisão profissional.
              </p>
            </div>

            <div className="pt-4">
              <Button 
                className="rounded-full px-10 py-7 h-auto font-bold uppercase tracking-widest text-sm shadow-gold group" 
                onClick={() => navigate('/casa-das-maquinas/atlas')}
              >
                Aplicar raciocínio no Atlas
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function LayerCard({ num, title, description, icon: Icon }: { num: number, title: string, description: string, icon: any }) {
  return (
    <div className="group bg-card/40 backdrop-blur-sm border border-border rounded-3xl p-6 space-y-4 transition-all duration-500 hover:border-primary/30 hover:shadow-glow relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl -z-10 group-hover:bg-primary/10 transition-colors" />
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
          <Icon className="w-5 h-5 text-primary/60 group-hover:text-primary" />
        </div>
        <span className="text-[10px] font-bold text-primary/20 group-hover:text-primary/40 transition-colors">CAMADA {num}</span>
      </div>
      <div className="space-y-2">
        <h4 className="text-lg font-display text-foreground group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed font-body">
          {description}
        </p>
      </div>
    </div>
  );
}
