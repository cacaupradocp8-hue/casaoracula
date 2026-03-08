import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AutoMapeamento } from '@/components/treinamento/AutoMapeamento';
import { EstudosCasoTreinamento } from '@/components/treinamento/EstudosCasoTreinamento';
import { SimuladorSessaoAvancado } from '@/components/treinamento/SimuladorSessaoAvancado';
import { ClientesPiloto } from '@/components/treinamento/ClientesPiloto';
import { BibliotecaFerramentas } from '@/components/treinamento/BibliotecaFerramentas';
import { JornadaExemplo } from '@/components/treinamento/JornadaExemplo';
import { useEffectivePortal } from '@/hooks/useEffectivePortal';
import { Compass, BookOpen, Play, Map, Users, FlaskConical } from 'lucide-react';

export default function SalaTreinamentoPage() {
  const { effectivePortal, isAdmin } = useEffectivePortal();

  // Clientes-Piloto visible only for facilitadoras em formação / admin
  const showPiloto = isAdmin || ['aluna_formacao', 'oracula', 'admin'].includes(effectivePortal);

  const tabs = [
    { value: 'automapa', label: 'Auto-Mapeamento', icon: Compass },
    { value: 'estudos', label: 'Estudos de Caso', icon: BookOpen },
    { value: 'simulador', label: 'Simulador de Sessão', icon: Play },
    { value: 'biblioteca', label: 'Ferramentas', icon: FlaskConical },
    { value: 'jornada', label: 'Jornada Exemplo', icon: Map },
    ...(showPiloto ? [{ value: 'piloto', label: 'Clientes-Piloto', icon: Users }] : []),
  ];

  return (
    <CasaMaquinasLayout
      title="Sala de Treinamento"
      subtitle="Ambiente seguro para prática e desenvolvimento de habilidades com o Método Orácula"
    >
      <Tabs defaultValue="automapa" className="space-y-6">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 h-auto bg-transparent p-0">
          {tabs.map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2 px-3 py-3 rounded-lg border border-primary/20 data-[state=active]:bg-primary/15 data-[state=active]:border-primary/50 data-[state=active]:text-primary text-muted-foreground hover:text-foreground transition-all text-sm"
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden md:inline text-xs">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="automapa"><AutoMapeamento /></TabsContent>
        <TabsContent value="estudos"><EstudosCasoTreinamento /></TabsContent>
        <TabsContent value="simulador"><SimuladorSessaoAvancado /></TabsContent>
        <TabsContent value="biblioteca"><BibliotecaFerramentas /></TabsContent>
        <TabsContent value="jornada"><JornadaExemplo /></TabsContent>
        {showPiloto && <TabsContent value="piloto"><ClientesPiloto /></TabsContent>}
      </Tabs>
    </CasaMaquinasLayout>
  );
}
