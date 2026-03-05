import { useState } from 'react';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BibliotecaFerramentas } from '@/components/treinamento/BibliotecaFerramentas';
import { CasosSimulados } from '@/components/treinamento/CasosSimulados';
import { SessaoSimulada } from '@/components/treinamento/SessaoSimulada';
import { JornadaExemplo } from '@/components/treinamento/JornadaExemplo';
import { BookOpen, FlaskConical, Play, Map } from 'lucide-react';

export default function SalaTreinamentoPage() {
  return (
    <CasaMaquinasLayout
      title="Sala de Treinamento"
      subtitle="Ambiente simulado para prática com o Método Orácula"
    >
      <Tabs defaultValue="biblioteca" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 h-auto bg-transparent p-0">
          {[
            { value: 'biblioteca', label: 'Biblioteca de Ferramentas', icon: BookOpen },
            { value: 'casos', label: 'Casos Simulados', icon: FlaskConical },
            { value: 'sessao', label: 'Sessão Simulada', icon: Play },
            { value: 'jornada', label: 'Jornada de Exemplo', icon: Map },
          ].map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2 px-4 py-3 rounded-lg border border-[#C9A24A]/20 data-[state=active]:bg-[#C9A24A]/15 data-[state=active]:border-[#C9A24A]/50 data-[state=active]:text-[#C9A24A] text-[#F5F1E8]/60 hover:text-[#F5F1E8] transition-all text-sm"
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden md:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="biblioteca"><BibliotecaFerramentas /></TabsContent>
        <TabsContent value="casos"><CasosSimulados /></TabsContent>
        <TabsContent value="sessao"><SessaoSimulada /></TabsContent>
        <TabsContent value="jornada"><JornadaExemplo /></TabsContent>
      </Tabs>
    </CasaMaquinasLayout>
  );
}
