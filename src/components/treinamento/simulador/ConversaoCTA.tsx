import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, ShieldCheck, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ConversaoCTAProps {
  type: 'streak' | 'desempenho' | 'erros' | 'concluido' | 'casa_maquinas';
  customMessage?: string;
}

export function ConversaoCTA({ type, customMessage }: ConversaoCTAProps) {
  const navigate = useNavigate();

  const configs = {
    streak: {
      title: 'Hábito de Mestre',
      description: 'Sua constância revela um compromisso raro. Você está pronta para o próximo nível.',
      cta: 'Ver Formação ORÁCULA',
      icon: Sparkles,
      message: 'Seu olhar existe. Falta método.',
      route: '/formacao'
    },
    desempenho: {
      title: 'Potencial de Elite',
      description: 'Seus acertos mostram uma intuição refinada. Transforme isso em uma profissão certificada.',
      cta: 'Acessar Certificação',
      icon: ShieldCheck,
      message: 'Você percebe padrões. Aprenda a conduzir.',
      route: '/formacao'
    },
    erros: {
      title: 'O Ponto de Virada',
      description: 'Erros repetidos são apenas lacunas de método. A Formação preenche esses vazios.',
      cta: 'Conhecer o Método',
      icon: ArrowRight,
      message: 'Próximo nível disponível: Formação ORÁCULA',
      route: '/formacao'
    },
    concluido: {
      title: 'Treino Finalizado',
      description: 'Mais um passo na sua jornada. A maestria clínica exige profundidade.',
      cta: 'Explorar Formação',
      icon: Sparkles,
      message: 'Você percebe padrões. Aprenda a conduzir.',
      route: '/formacao'
    },
    casa_maquinas: {
      title: 'Espaço Profissional',
      description: 'Sua prática amadureceu. É hora de gerir seus próprios casos no Laboratório Clínico.',
      cta: 'Ir para Casa das Máquinas',
      icon: Wrench,
      message: 'Pronta para a Clínica Real?',
      route: '/casa-maquinas'
    }
  };

  const config = (configs as any)[type];
  const Icon = config.icon;

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className="w-24 h-24 text-primary" />
      </div>
      
      <CardContent className="p-6 space-y-4 relative z-10">
        <div className="flex items-center gap-2 text-primary">
          <Icon className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-widest">{config.title}</span>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-serif text-foreground leading-tight">
            {customMessage || config.message}
          </h3>
          <p className="text-sm text-muted-foreground max-w-[80%]">
            {config.description}
          </p>
        </div>

        <Button 
          onClick={() => navigate(config.route)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium group"
        >
          {config.cta}
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}