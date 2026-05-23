import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Target, 
  ArrowLeft, 
  AlertCircle, 
  FileText, 
  Search, 
  BarChart3, 
  Compass,
  GraduationCap,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PageBreadcrumb } from '@/components/navigation/PageBreadcrumb';
import { BackButton } from '@/components/navigation/BackButton';

export default function CasosSimuladosPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 pattern-geometric overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
        <PageBreadcrumb
          items={[
            { label: 'Casa das Máquinas', href: '/casa-das-maquinas' },
            { label: 'Sala de Treinamento', href: '/sala-de-treinamento' },
            { label: 'Casos Simulados' },
          ]}
        />
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 sm:space-y-4 min-w-0">
            <BackButton />
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display tracking-wide text-foreground leading-tight">
                Casos <span className="text-primary italic">Simulados</span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
                Um espaço seguro para treinar formulação, perguntas, cautelas e próximos passos com personagens fictícias.
              </p>
            </div>
          </div>
          
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs px-4 py-2 font-bold uppercase tracking-widest self-start md:self-auto">
            Laboratório de Formulação
          </Badge>
        </header>

        {/* Bloco ético obrigatório */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-6 sm:p-8 flex items-start gap-4 sm:gap-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6 text-amber-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-amber-500 font-display">Treino Ético e Fictício</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Casos Simulados não são atendimentos reais, não geram diagnóstico e não substituem supervisão. Eles servem para treinar perguntas, prudência, formulação e escolha responsável de próximos passos.
            </p>
          </div>
        </div>

        <section className="bg-card/40 border border-border rounded-[2.5rem] p-8 sm:p-10 space-y-6">
          <div className="flex items-center gap-3 text-primary">
            <GraduationCap className="w-6 h-6" />
            <h2 className="text-2xl font-display italic">O que são Casos Simulados</h2>
          </div>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-4xl">
            Casos Simulados são exercícios pedagógicos com personagens fictícias. Eles ajudam a treinar raciocínio, escuta, formulação e escolha de próximos passos sem usar dados de clientes reais.
          </p>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-3 text-primary border-b border-border/10 pb-4">
            <Compass className="w-5 h-5" />
            <h2 className="text-xl font-display tracking-widest uppercase text-xs font-bold">Como treinar um caso</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { step: 1, title: 'Contexto fictício' },
              { step: 2, title: 'Identificar sinais' },
              { step: 3, title: 'Hipóteses provisórias' },
              { step: 4, title: 'Observar cautelas' },
              { step: 5, title: 'Definir direção' },
              { step: 6, title: 'Escolher intervenção' },
              { step: 7, title: 'Refletir evolução' },
            ].map((item) => (
              <div key={item.step} className="bg-card/30 border border-border rounded-2xl p-4 text-center space-y-2 group hover:border-primary/30 transition-colors">
                <span className="text-[10px] font-bold text-primary/40 group-hover:text-primary transition-colors">PASSO {item.step}</span>
                <p className="text-xs font-medium leading-tight">{item.title}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-3 text-primary border-b border-border/10 pb-4">
            <Target className="w-5 h-5" />
            <h2 className="text-xl font-display tracking-widest uppercase text-xs font-bold">Casos demonstrativos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SimulatedCaseCard 
              name="Caso Lia"
              theme="limites e sobrecarga"
              description="Dificuldade de dizer não e sensação de invasão no campo pessoal."
            />
            <SimulatedCaseCard 
              name="Caso Joana"
              theme="procrastinação e autocobrança"
              description="Paralisia por medo de errar e altos padrões internos de exigência."
            />
            <SimulatedCaseCard 
              name="Caso Helena"
              theme="identidade e insegurança"
              description="Sentimento de inadequação em uma nova fase de vida e carreira."
            />
            <SimulatedCaseCard 
              name="Caso Rosa"
              theme="repetição e culpa"
              description="Padrões relacionais repetitivos e forte necessidade de pertencimento."
            />
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-3 text-primary border-b border-border/10 pb-4">
            <FileText className="w-5 h-5" />
            <h2 className="text-xl font-display tracking-widest uppercase text-xs font-bold">Ficha de Simulação (Modelo)</h2>
          </div>
          <Card className="bg-card/40 border-border rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 sm:p-12 space-y-8 opacity-60">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Nome Fictício</label>
                  <div className="h-10 border-b border-border/50 text-sm text-muted-foreground italic">Selecionar caso...</div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Tema Central</label>
                  <div className="h-10 border-b border-border/50 text-sm text-muted-foreground italic">Tema identificado...</div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Sinais Observados</label>
                  <div className="h-10 border-b border-border/50 text-sm text-muted-foreground italic">Liste os sinais...</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Hipóteses Provisórias</label>
                  <div className="h-16 border-b border-border/50 text-sm text-muted-foreground italic">Levante possibilidades...</div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Cautelas</label>
                  <div className="h-16 border-b border-border/50 text-sm text-muted-foreground italic">O que exige cuidado?</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Direção Possível</label>
                  <div className="h-16 border-b border-border/50 text-sm text-muted-foreground italic">Para onde seguir?</div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Intervenção</label>
                  <div className="h-16 border-b border-border/50 text-sm text-muted-foreground italic">Escolha da prática...</div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Próximo Passo</label>
                  <div className="h-16 border-b border-border/50 text-sm text-muted-foreground italic">Ação de treino...</div>
                </div>
              </div>
              <div className="pt-4 flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500/60 flex items-center gap-2">
                  <AlertCircle className="w-3 h-3" /> Ficha de Simulação Mock — Não persistente
                </span>
                <Button variant="outline" className="rounded-full px-6 text-xs uppercase tracking-widest font-bold" disabled>
                  Iniciar Simulação
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="bg-card/40 border border-border rounded-[2.5rem] p-8 sm:p-10 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <BarChart3 className="w-6 h-6" />
            <h3 className="text-xl font-display italic">Treinar o ciclo do Atlas</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed max-w-4xl">
            Cada caso simulado percorre o mesmo ciclo do Atlas Orácula: entender, levantar hipóteses, observar cautelas, definir direção, escolher intervenção e acompanhar evolução. Aqui, tudo acontece em ambiente fictício e pedagógico.
          </p>
        </section>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-10">
          <Button variant="outline" className="rounded-full px-8 py-6 h-auto font-bold uppercase tracking-widest text-xs" onClick={() => navigate('/sala-de-treinamento')}>
            Voltar para Sala de Treinamento
          </Button>
          <Button variant="outline" className="rounded-full px-8 py-6 h-auto font-bold uppercase tracking-widest text-xs" onClick={() => navigate('/sala-de-treinamento/clinica-dos-contos')}>
            Clínica dos Contos
          </Button>
          <Button className="rounded-full px-8 py-6 h-auto font-bold uppercase tracking-widest text-xs" onClick={() => navigate('/casa-das-maquinas/atlas')}>
            Voltar para o Atlas
          </Button>
        </div>
      </div>
    </div>
  );
}

function SimulatedCaseCard({ name, theme, description }: { name: string, theme: string, description: string }) {
  return (
    <div className="group bg-card/40 backdrop-blur-sm border border-border rounded-3xl p-6 space-y-4 transition-all duration-500 hover:border-primary/30 hover:shadow-glow relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl -z-10 group-hover:bg-primary/10 transition-colors" />
      <div className="space-y-2">
        <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-primary/20 text-primary/60 px-3 py-0.5">
          Caso Fictício
        </Badge>
        <h4 className="text-xl font-display text-foreground group-hover:text-primary transition-colors">{name}</h4>
      </div>
      <div className="space-y-1">
        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/40">Tema:</p>
        <p className="text-xs text-foreground font-medium">{theme}</p>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed font-body line-clamp-2">
        {description}
      </p>
      <div className="pt-2">
        <Button variant="ghost" size="sm" className="p-0 h-auto text-[10px] uppercase font-bold tracking-widest text-primary/60 hover:text-primary transition-colors hover:bg-transparent" disabled>
          Praticar com {name} <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </div>
  );
}
