import { useCidadelaEstado } from '@/hooks/useCidadelaEstado';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, BookOpen, GraduationCap, Compass, Loader2, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SintheyaStep {
  proxima_acao: 'treinamento' | 'clube' | 'sessao' | 'cartografia';
  sugestao: string;
  ferramenta: string | null;
  urgencia: 'baixa' | 'media' | 'alta';
}

const routeMap: Record<string, string> = {
  treinamento: '/sala-de-treinamento',
  clube: '/clube',
  sessao: '/casa-das-maquinas',
  cartografia: '/ferramenta/cartografia-psiquica-oracula',
};

const iconMap: Record<string, typeof Compass> = {
  treinamento: GraduationCap,
  clube: BookOpen,
  sessao: Wrench,
  cartografia: Compass,
};

const labelMap: Record<string, string> = {
  treinamento: 'Ir para Treinamento',
  clube: 'Ir para o Clube',
  sessao: 'Ir para Casa das Máquinas',
  cartografia: 'Iniciar Cartografia',
};

function useSintheyaNextStep() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['sintheya-next-step', user?.id],
    queryFn: async (): Promise<SintheyaStep> => {
      const { data, error } = await supabase.functions.invoke('sintheya-next-step');
      if (error) throw error;
      return data as SintheyaStep;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

function calcularFallback(estado: any): SintheyaStep {
  if (!estado) {
    return {
      proxima_acao: 'cartografia',
      sugestao: 'Inicie sua jornada pela Cartografia Psíquica para revelar sua CidaDELA.',
      ferramenta: 'Cartografia Psíquica Orácula',
      urgencia: 'alta',
    };
  }

  const { distrito_atual, competencias, distritos_ativados } = estado;
  const comp = competencias || {};
  const totalTentativas: number = (Object.values(comp) as any[]).reduce(
    (sum: number, c: any) => sum + (c?.tentativas || 0), 0
  );
  const totalAcertos: number = (Object.values(comp) as any[]).reduce(
    (sum: number, c: any) => sum + (c?.acertos || 0), 0
  );
  const taxa: number = totalTentativas > 0 ? totalAcertos / totalTentativas : 0;

  if (totalTentativas < 3 && distrito_atual) {
    return {
      proxima_acao: 'treinamento',
      sugestao: `Pratique sua leitura clínica no distrito "${distrito_atual}" na Sala de Treinamento.`,
      ferramenta: null,
      urgencia: 'media',
    };
  }

  if (taxa >= 0.7 && (distritos_ativados?.length || 0) < 5) {
    return {
      proxima_acao: 'clube',
      sugestao: 'Você está pronta para a próxima travessia no Círculo de Leitura.',
      ferramenta: null,
      urgencia: 'baixa',
    };
  }

  if (taxa < 0.5 && totalTentativas >= 3) {
    return {
      proxima_acao: 'treinamento',
      sugestao: 'Refine sua leitura clínica com mais casos práticos antes de avançar.',
      ferramenta: null,
      urgencia: 'media',
    };
  }

  return {
    proxima_acao: 'clube',
    sugestao: 'Continue explorando sua jornada no Círculo de Leitura.',
    ferramenta: null,
    urgencia: 'baixa',
  };
}

export function ProximoPasso() {
  const { estado, isLoading: estadoLoading } = useCidadelaEstado();
  const { data: aiStep, isLoading: aiLoading } = useSintheyaNextStep();
  const navigate = useNavigate();

  const isLoading = estadoLoading || aiLoading;

  if (isLoading) {
    return (
      <Card className="border-primary/10">
        <CardContent className="p-4 flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <span className="text-sm text-muted-foreground">Sintheya calculando próximo passo...</span>
        </CardContent>
      </Card>
    );
  }

  const passo: SintheyaStep = aiStep || calcularFallback(estado);
  const Icon = iconMap[passo.proxima_acao] || Compass;
  const rota = routeMap[passo.proxima_acao] || '/';
  const label = labelMap[passo.proxima_acao] || 'Continuar';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <p className="text-xs font-medium text-primary/80 uppercase tracking-wider">
              Próximo passo sugerido
            </p>
            {aiStep && (
              <span className="text-[9px] text-primary/50 ml-auto">via Sintheya</span>
            )}
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {passo.sugestao}
          </p>
          {passo.ferramenta && (
            <p className="text-[11px] text-muted-foreground/60 flex items-center gap-1">
              <Wrench className="w-3 h-3" /> {passo.ferramenta}
            </p>
          )}
          <Button
            size="sm"
            className="w-full"
            onClick={() => navigate(rota)}
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
