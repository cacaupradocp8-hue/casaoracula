import { useCidadelaEstado } from '@/hooks/useCidadelaEstado';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, BookOpen, GraduationCap, Compass, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function calcularProximoPasso(estado: any) {
  if (!estado) {
    return {
      acao: 'clube' as const,
      sugestao: 'Inicie sua jornada pela Cartografia Psíquica para revelar sua CidaDELA.',
      rota: '/ferramenta/cartografia-psiquica-oracula',
      icone: Compass,
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
  const taxaAcerto: number = totalTentativas > 0 ? totalAcertos / totalTentativas : 0;

  // Se tem distrito mas poucas competências → treinar
  if (totalTentativas < 3 && distrito_atual) {
    return {
      acao: 'treinamento' as const,
      sugestao: `Pratique sua leitura clínica no distrito "${distrito_atual}" na Sala de Treinamento.`,
      rota: '/sala-de-treinamento',
      icone: GraduationCap,
    };
  }

  // Se taxa de acerto boa → avançar no clube
  if (taxaAcerto >= 0.7 && (distritos_ativados?.length || 0) < 5) {
    return {
      acao: 'clube' as const,
      sugestao: 'Você está pronta para a próxima travessia no Círculo de Leitura.',
      rota: '/clube',
      icone: BookOpen,
    };
  }

  // Se taxa baixa → mais treino
  if (taxaAcerto < 0.5 && totalTentativas >= 3) {
    return {
      acao: 'treinamento' as const,
      sugestao: 'Refine sua leitura clínica com mais casos práticos antes de avançar.',
      rota: '/sala-de-treinamento',
      icone: GraduationCap,
    };
  }

  // Default → continuar travessia
  return {
    acao: 'clube' as const,
    sugestao: 'Continue explorando sua jornada no Círculo de Leitura.',
    rota: '/clube',
    icone: BookOpen,
  };
}

export function ProximoPasso() {
  const { estado, isLoading } = useCidadelaEstado();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card className="border-primary/10">
        <CardContent className="p-4 flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <span className="text-sm text-muted-foreground">Calculando próximo passo...</span>
        </CardContent>
      </Card>
    );
  }

  const passo = calcularProximoPasso(estado);
  const Icon = passo.icone;

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
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {passo.sugestao}
          </p>
          <Button
            size="sm"
            className="w-full"
            onClick={() => navigate(passo.rota)}
          >
            <Icon className="w-4 h-4 mr-2" />
            {passo.acao === 'treinamento' ? 'Ir para Treinamento' : 
             passo.acao === 'clube' ? 'Ir para o Clube' : 'Continuar'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
