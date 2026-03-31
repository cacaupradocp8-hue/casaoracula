import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SimuladorConducao } from '@/components/treinamento/simulador/SimuladorConducao';
import { AutoMapeamento } from '@/components/treinamento/AutoMapeamento';
import { BibliotecaFerramentas } from '@/components/treinamento/BibliotecaFerramentas';
import { TrainingDashboard } from '@/components/treinamento/simulador/TrainingDashboard';
import { FlaskConical, Compass, BookOpen, BarChart3 } from 'lucide-react';

export default function SalaDeTreinamentoPage() {
  const tabs = [
    { value: 'simulador', label: 'Simulador', icon: FlaskConical },
    { value: 'dashboard', label: 'Progresso', icon: BarChart3 },
    { value: 'automapa', label: 'Auto-Mapeamento', icon: Compass },
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

        <Tabs defaultValue="simulador" className="space-y-4">
          <TabsList className="grid grid-cols-4 gap-2 h-auto bg-transparent p-0">
            {tabs.map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-1.5 px-2 py-3 rounded-lg border border-border/30 data-[state=active]:bg-primary/10 data-[state=active]:border-primary/40 data-[state=active]:text-primary text-muted-foreground hover:text-foreground transition-all text-sm"
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-[10px]">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="simulador"><SimuladorConducao /></TabsContent>
          <TabsContent value="dashboard"><TrainingDashboard /></TabsContent>
          <TabsContent value="automapa"><AutoMapeamento /></TabsContent>
          <TabsContent value="biblioteca"><BibliotecaFerramentas /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
