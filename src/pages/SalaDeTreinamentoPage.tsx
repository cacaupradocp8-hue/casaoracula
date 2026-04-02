import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SimuladorConducao } from '@/components/treinamento/simulador/SimuladorConducao';
import { SimuladorInterativo } from '@/components/treinamento/simulador/SimuladorInterativo';
import { AutoMapeamento } from '@/components/treinamento/AutoMapeamento';
import { BibliotecaFerramentas } from '@/components/treinamento/BibliotecaFerramentas';
import { TrainingDashboard } from '@/components/treinamento/simulador/TrainingDashboard';
import { FlaskConical, Compass, BookOpen, BarChart3, Gamepad2 } from 'lucide-react';

export default function SalaDeTreinamentoPage() {
  const tabs = [
    { value: 'interativo', label: 'Decisão', icon: Gamepad2 },
    { value: 'simulador', label: 'Leitura', icon: FlaskConical },
    { value: 'dashboard', label: 'Progresso', icon: BarChart3 },
    { value: 'automapa', label: 'Auto-Mapa', icon: Compass },
    { value: 'biblioteca', label: 'Ferramentas', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-primary" />
            Sala de Treinamento
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Este espaço é para praticar condução terapêutica simbólica. Não existe resposta certa — 
            existe leitura coerente. Treine seu olhar clínico com casos fictícios antes de atender.
          </p>
        </div>

        <Tabs defaultValue="interativo" className="space-y-4">
          <TabsList className="grid grid-cols-5 gap-1.5 h-auto bg-transparent p-0">
            {tabs.map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex flex-col items-center gap-1 px-1.5 py-2.5 rounded-lg border border-border/30 data-[state=active]:bg-primary/10 data-[state=active]:border-primary/40 data-[state=active]:text-primary text-muted-foreground hover:text-foreground transition-all"
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-[9px]">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="interativo"><SimuladorInterativo /></TabsContent>
          <TabsContent value="simulador"><SimuladorConducao /></TabsContent>
          <TabsContent value="dashboard"><TrainingDashboard /></TabsContent>
          <TabsContent value="automapa"><AutoMapeamento /></TabsContent>
          <TabsContent value="biblioteca"><BibliotecaFerramentas /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
