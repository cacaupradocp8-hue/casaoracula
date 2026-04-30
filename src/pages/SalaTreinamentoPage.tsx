import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SimuladorConducao } from '@/components/treinamento/simulador/SimuladorConducao';
import { AutoMapeamento } from '@/components/treinamento/AutoMapeamento';
import { BibliotecaFerramentas } from '@/components/treinamento/BibliotecaFerramentas';
import { TrainingDashboard } from '@/components/treinamento/simulador/TrainingDashboard';
import { useEffectivePortal } from '@/hooks/useEffectivePortal';
import { FlaskConical, Compass, BookOpen, BarChart3, Flame, Award } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useStudentTracking } from '@/hooks/useStudentTracking';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function SalaTreinamentoPage() {
  const { effectivePortal, isAdmin } = useEffectivePortal();
  const { user } = useAuth();
  const { track } = useStudentTracking();
  const trackedRef = useRef(false);

  const { data: progress } = useQuery({
    queryKey: ['training-room-header-progress', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('co_training_progress')
        .select('streak_days, nivel_atual')
        .eq('user_id', user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

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
      title={
        <div className="flex flex-col gap-1">
          <span className="text-xs font-normal text-muted-foreground">Bom dia, {user?.nome?.split(' ')[0] || 'Oraculista'}</span>
          <div className="flex items-center gap-4">
            <span>Câmara do Sussurro</span>
            <div className="flex items-center gap-3 ml-auto">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                <Flame className="w-3 h-3 text-orange-500" />
                <span className="text-[10px] font-bold text-orange-400">{progress?.streak_days || 0}</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                <Award className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-bold text-primary uppercase">{progress?.nivel_atual || 'Iniciante'}</span>
              </div>
            </div>
          </div>
        </div>
      }
      subtitle="Refine sua escuta clínica e ative seus distritos através da prática constante."
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
