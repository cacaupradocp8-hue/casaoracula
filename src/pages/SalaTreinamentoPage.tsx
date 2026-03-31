import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SimuladorConducao } from '@/components/treinamento/simulador/SimuladorConducao';
import { AutoMapeamento } from '@/components/treinamento/AutoMapeamento';
import { BibliotecaFerramentas } from '@/components/treinamento/BibliotecaFerramentas';
import { useEffectivePortal } from '@/hooks/useEffectivePortal';
import { FlaskConical, Compass, BookOpen } from 'lucide-react';

export default function SalaTreinamentoPage() {
  const { effectivePortal, isAdmin } = useEffectivePortal();

  const tabs = [
    { value: 'simulador', label: 'Simulador', icon: FlaskConical },
    { value: 'automapa', label: 'Auto-Mapeamento', icon: Compass },
    { value: 'biblioteca', label: 'Ferramentas', icon: BookOpen },
  ];

  return (
    <CasaMaquinasLayout
      title="Sala de Treinamento"
      subtitle="Pratique condução terapêutica simbólica com casos fictícios antes de atender clientes reais"
    >
      <Tabs defaultValue="simulador" className="space-y-6">
        <TabsList className="grid grid-cols-3 gap-2 h-auto bg-transparent p-0">
          {tabs.map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2 px-3 py-3 rounded-lg border border-primary/20 data-[state=active]:bg-primary/15 data-[state=active]:border-primary/50 data-[state=active]:text-primary text-muted-foreground hover:text-foreground transition-all text-sm"
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-xs">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="simulador"><SimuladorConducao /></TabsContent>
        <TabsContent value="automapa"><AutoMapeamento /></TabsContent>
        <TabsContent value="biblioteca"><BibliotecaFerramentas /></TabsContent>
      </Tabs>
    </CasaMaquinasLayout>
  );
}
