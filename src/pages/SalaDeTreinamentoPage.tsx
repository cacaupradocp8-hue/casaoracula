import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  BookOpen, 
  Search, 
  AlertCircle, 
  Sparkles,
  FlaskConical, 
  Target, 
  BarChart3, 
  Users, 
  Wrench, 
  Compass,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PageBreadcrumb } from '@/components/navigation/PageBreadcrumb';
import { cn } from '@/lib/utils';
import { BackButton } from '@/components/navigation/BackButton';

export default function SalaDeTreinamentoPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 pattern-geometric overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
        <PageBreadcrumb
          items={[
            { label: 'Casa das Máquinas', href: '/casa-das-maquinas' },
            { label: 'Sala de Treinamento' },
          ]}
        />
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 sm:space-y-4 min-w-0">
            <BackButton />
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display tracking-wide text-foreground leading-tight">
                Sala de <span className="text-primary italic">Treinamento</span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
                Um laboratório seguro para treinar formulação, escuta simbólica, leitura de casos e escolha de intervenções antes do atendimento real.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6 bg-card border border-border rounded-2xl px-4 sm:px-6 py-3 sm:py-4 shadow-soft self-start md:self-auto">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-primary">
                <FlaskConical className="w-4 h-4" />
                <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">PRÁTICA ÉTICA</span>
              </div>
              <Progress value={100} className="w-20 sm:w-24 h-1.5 bg-muted" />
            </div>
          </div>
        </header>

        {/* Bloco ético obrigatório */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-6 sm:p-8 flex items-start gap-4 sm:gap-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6 text-amber-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-amber-500 font-display">Treino não é atendimento real</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              A Sala de Treinamento usa casos fictícios, exercícios pedagógicos e experiências simuladas. Ela não substitui supervisão profissional, não gera diagnóstico e não deve ser usada como prontuário ou decisão clínica.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TrainingModuleCard
            icon={BookOpen}
            title="Clínica dos Contos"
            description="Use histórias como casos-espelho para reconhecer vergonha, limites, reconstrução, intuição, pertencimento e padrões relacionais."
            status="Novo"
            primaryIcon={Sparkles}
            onClick={() => navigate('/sala-de-treinamento/clinica-dos-contos')}
          />
          <TrainingModuleCard
            icon={Users}
            title="Casos Simulados"
            description="Pratique leitura de contexto, sinais, hipóteses, cautelas, direção e intervenção sem usar clientes reais."
            status="Novo"
            primaryIcon={Target}
            onClick={() => navigate('/sala-de-treinamento/casos-simulados')}
          />
          <TrainingModuleCard
            icon={Compass}
            title="Formulação Guiada"
            description="Aprenda a organizar uma leitura em camadas: queixa, contexto, hipóteses, cautelas, direção, intervenção e evolução."
            status="Novo"
            primaryIcon={BarChart3}
            onClick={() => navigate('/sala-de-treinamento/formulacao-guiada')}
          />
          <TrainingModuleCard
            icon={Zap}
            title="Big Five em Treino"
            description="Treine a leitura de traços sem reduzir a pessoa a um tipo ou rótulo."
            status="Em estruturação"
            primaryIcon={Target}
          />
          <TrainingModuleCard
            icon={MessageCircle}
            title="Crenças Nucleares"
            description="Observe crenças de valor, segurança, merecimento, pertença e culpa como hipóteses provisórias."
            status="Em estruturação"
            primaryIcon={Search}
          />
          <TrainingModuleCard
            icon={Wrench}
            title="Intervenções Simbólicas"
            description="Experimente possibilidades de condução com cuidado, ética e respeito ao ritmo do caso."
            status="Em estruturação"
            primaryIcon={Sparkles}
          />
          <TrainingModuleCard
            icon={AlertCircle}
            title="Supervisão Simulada"
            description="Aprenda a reconhecer quando pedir mais contexto, supervisão, pausa ou encaminhamento responsável."
            status="Em estruturação"
            primaryIcon={Target}
          />
        </div>

        <section className="space-y-8 pt-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl sm:text-3xl font-display text-primary italic">Laboratórios de Apoio</h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Recursos já existentes da Casa que ampliam o treino de escuta, narração, literatura e formulação simbólica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SupportLabCard
              icon={FlaskConical}
              title="Laboratório Oracular"
              description="Treino 80/20 para transformar obras, símbolos e narrativas em leitura, espelho e prática."
              cta="Acessar laboratório"
              onClick={() => navigate('/clube/laboratorio')}
            />
            <SupportLabCard
              icon={MessageCircle}
              title="Ofício da Voz"
              description="Espaço de treino para voz, escuta, narração e presença simbólica."
              cta="Treinar narração"
              onClick={() => navigate('/narroterapia/audios')}
            />
            <SupportLabCard
              icon={Compass}
              title="Câmara do Sussurro"
              description="Ambiente de escuta e treino com casos inspirados em obras e narrativas simbólicas."
              cta="Entrar na câmara"
              onClick={() => navigate('/clube/treinamento')}
            />
          </div>

          <div className="bg-muted/30 border border-border/50 rounded-2xl p-5">
            <p className="text-xs text-muted-foreground leading-relaxed text-center">
              Alguns laboratórios podem depender de permissões, conteúdos liberados ou progresso da aluna. 
              Caso algo não esteja disponível, mantenha o percurso principal pela Sala de Treinamento.
            </p>
          </div>
        </section>

        <section className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-8 sm:p-10 space-y-6">
          <div className="flex items-center gap-3 text-primary">
            <Compass className="w-6 h-6" />
            <h2 className="text-xl font-display italic">Como usar esta sala (Percurso Recomendado)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Passo 1</span>
              <h4 className="text-sm font-bold uppercase tracking-tight">Clínica dos Contos</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Treine leitura simbólica e casos-espelho através da literatura.</p>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Passo 2</span>
              <h4 className="text-sm font-bold uppercase tracking-tight">Casos Simulados</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Pratique a escuta e formulação com personagens fictícias.</p>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Passo 3</span>
              <h4 className="text-sm font-bold uppercase tracking-tight">Formulação Guiada</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Organize o raciocínio em camadas antes de escolher a intervenção.</p>
            </div>
            <div className="space-y-2 border-l border-primary/10 pl-6">
              <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Passo 4</span>
              <h4 className="text-sm font-bold uppercase tracking-tight">Atlas Orácula</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Leve o aprendizado para a prática real na Casa das Máquinas.</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          <section className="bg-card/40 border border-border rounded-[2.5rem] p-8 sm:p-10 space-y-4">
            <h3 className="text-xl font-display text-primary italic">Como esta sala conversa com o Atlas</h3>
            <p className="text-muted-foreground leading-relaxed">
              A Sala de Treinamento ensina a pensar antes de atender. O Atlas organiza o raciocínio na Casa das Máquinas; aqui, a profissional treina esse raciocínio com segurança, casos simulados e literatura como laboratório.
            </p>
          </section>

          <section className="bg-card/40 border border-border rounded-[2.5rem] p-8 sm:p-10 space-y-4">
            <h3 className="text-xl font-display text-primary italic">Literatura como laboratório</h3>
            <p className="text-muted-foreground leading-relaxed">
              As Rotas da Casa alimentam a Clínica dos Contos: cada obra pode virar símbolo central, fenômeno psíquico, caso-espelho, perguntas clínicas e prática de integração.
            </p>
          </section>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-10">
          <Button variant="outline" className="rounded-full px-8 py-6 h-auto font-bold uppercase tracking-widest text-xs" onClick={() => navigate('/sala-de-treinamento/clinica-dos-contos')}>
            Treinar com Literatura
          </Button>
          <Button variant="outline" className="rounded-full px-8 py-6 h-auto font-bold uppercase tracking-widest text-xs" onClick={() => navigate('/sala-de-treinamento/casos-simulados')}>
            Praticar com Casos Fictícios
          </Button>
          <Button variant="outline" className="rounded-full px-8 py-6 h-auto font-bold uppercase tracking-widest text-xs" onClick={() => navigate('/sala-de-treinamento/formulacao-guiada')}>
            Organizar Formulação
          </Button>
          <Button variant="outline" className="rounded-full px-8 py-6 h-auto font-bold uppercase tracking-widest text-xs" onClick={() => navigate('/minha-jornada')}>
            Voltar para Minha Jornada
          </Button>
          <Button className="rounded-full px-8 py-6 h-auto font-bold uppercase tracking-widest text-xs" onClick={() => navigate('/casa-das-maquinas/atlas')}>
            Ver Atlas Orácula
          </Button>
        </div>
      </div>
    </div>
  );
}

function TrainingModuleCard({ icon: Icon, title, description, status, primaryIcon: PrimaryIcon, onClick }: { icon: any, title: string, description: string, status: string, primaryIcon: any, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "group bg-card/40 backdrop-blur-sm border border-border rounded-[2rem] p-8 space-y-6 transition-all duration-500 hover:border-primary/30 hover:shadow-glow relative overflow-hidden",
        onClick ? "cursor-pointer" : "opacity-80"
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 group-hover:bg-primary/10 transition-colors" />
      
      <div className="flex items-center justify-between">
        <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500">
          <Icon className="w-7 h-7 text-primary/60 group-hover:text-primary" />
        </div>
        <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-primary/20 text-primary/60 px-3 py-1">
          {status}
        </Badge>
      </div>

      <div className="space-y-3">
        <h4 className="text-xl font-display text-foreground group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed font-body">
          {description}
        </p>
      </div>

      <div className="pt-4 flex items-center gap-2 text-primary/40 group-hover:text-primary/70 transition-colors">
        <PrimaryIcon className="w-4 h-4" />
        <span className="text-[10px] uppercase font-bold tracking-widest">Laboratório Seguro</span>
      </div>
    </div>
  );
}
