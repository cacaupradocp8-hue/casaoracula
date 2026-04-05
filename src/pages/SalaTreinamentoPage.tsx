import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SimuladorConducao } from '@/components/treinamento/simulador/SimuladorConducao';
import { AutoMapeamento } from '@/components/treinamento/AutoMapeamento';
import { BibliotecaFerramentas } from '@/components/treinamento/BibliotecaFerramentas';
import { TrainingDashboard } from '@/components/treinamento/simulador/TrainingDashboard';
import { useEffectivePortal } from '@/hooks/useEffectivePortal';
import { FlaskConical, Compass, BookOpen, BarChart3 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useStudentTracking } from '@/hooks/useStudentTracking';

export default function SalaTreinamentoPage() {
  const { effectivePortal, isAdmin } = useEffectivePortal();
  const { track } = useStudentTracking();
  const trackedRef = useRef(false);

  useEffect(() => {
    if (!trackedRef.current) {
      trackedRef.current = true;
      track('treinamento', 'opened', 'sala_treinamento');
    }
  }, [track]);

  const tabs = [
    { value: 'simulador', label: 'Simulador', icon: FlaskConical },
    { value: 'dashboard', label: 'Progresso', icon: BarChart3 },
    { value: 'automapa', label: 'Auto-Mapeamento', icon: Compass },
    { value: 'biblioteca', label: 'Ferramentas', icon: BookOpen },
  ];

  return (
    <CasaMaquinasLayout
      title="Sala de Treinamento"
      subtitle="Pratique condução terapêutica simbólica com casos fictícios antes de atender clientes reais"
    >
      <Tabs defaultValue="simulador" className="space-y-6">
        <TabsList className="grid grid-cols-4 gap-2 h-auto bg-transparent p-0">
          {tabs.map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-1.5 px-2 py-3 rounded-lg border border-primary/20 data-[state=active]:bg-primary/15 data-[state=active]:border-primary/50 data-[state=active]:text-primary text-muted-foreground hover:text-foreground transition-all text-sm"
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
    </CasaMaquinasLayout>
  );
}
