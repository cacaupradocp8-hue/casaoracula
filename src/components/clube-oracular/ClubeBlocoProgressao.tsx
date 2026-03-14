import { useNavigate } from 'react-router-dom';
import { Compass, GraduationCap, Wrench, Star, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
  portal?: string;
  engajamento: 'baixo' | 'medio' | 'alto';
}

const CENARIOS = [
  {
    key: 'formacao',
    match: (portal?: string) => !portal || portal === 'visitante' || portal === 'assinante' || portal === 'mentorada',
    icon: Compass,
    titulo: 'Sua CidaDELA Interior pede mais',
    texto: 'Talvez esse caminho esteja pedindo aprofundamento. Algumas travessias pedem estudo mais profundo para serem plenamente vividas. Explore a Formação no Método Orácula e descubra como se tornar uma Cartógrafa da Alma.',
    botao: 'Explorar a Formação',
    rota: '/cursos',
  },
  {
    key: 'treinamento',
    match: (portal?: string) => portal === 'aluna_formacao',
    icon: GraduationCap,
    titulo: 'Sua prática busca um novo território',
    texto: 'Seu percurso já mostra sinais de prontidão para o próximo portal. A Sala de Treinamento é o espaço onde a teoria se encontra com a prática, preparando você para guiar outras jornadas.',
    botao: 'Acessar Sala de Treinamento',
    rota: '/sala-treinamento',
  },
  {
    key: 'casa-maquinas',
    match: (portal?: string) => portal === 'oracula',
    icon: Wrench,
    titulo: 'Sua Voz de Condução está pronta para o mundo',
    texto: 'Você já possui o mapa e a bússola. A Casa das Máquinas é o seu ateliê, onde você tece as jornadas de suas clientes com maestria e inteligência simbólica.',
    botao: 'Acessar Casa das Máquinas',
    rota: '/casa-das-maquinas',
  },
  {
    key: 'especializacoes',
    match: (portal?: string) => portal === 'admin',
    icon: Star,
    titulo: 'Novos Portais de Aprofundamento',
    texto: 'Sua maestria se expande. Explore os Portais de Especialização e refine ainda mais sua arte de cartografar a alma.',
    botao: 'Explorar Especializações',
    rota: '/cursos',
  },
];

export function ClubeBlocoProgressao({ portal, engajamento }: Props) {
  const navigate = useNavigate();

  // Show even for "baixo" with a gentler message — this is the funnel heart
  const cenario = CENARIOS.find(c => c.match(portal)) || CENARIOS[0];
  const Icon = cenario.icon;

  return (
    <Card className="border-gold/20 bg-gradient-to-br from-gold/[0.04] via-card to-mystic/[0.03] hover:shadow-lg hover:shadow-gold/5 transition-all duration-500">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold/20 to-mystic/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-gold" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gold/70 font-medium">
            Seu Próximo Passo na Casa
          </p>
        </div>

        {/* Content */}
        <h3 className="font-display text-base text-foreground mb-2.5 leading-snug">
          {cenario.titulo}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-5">
          {cenario.texto}
        </p>

        {/* CTA */}
        <Button
          size="sm"
          className="w-full gap-2 bg-gradient-to-r from-gold to-mystic hover:from-gold/90 hover:to-mystic/90 text-primary-foreground shadow-sm"
          onClick={() => navigate(cenario.rota)}
        >
          {cenario.botao}
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>

        {/* Engagement hint for low engagement */}
        {engajamento === 'baixo' && (
          <p className="text-[10px] text-muted-foreground/50 text-center mt-3 italic">
            Participe mais do Clube para desbloquear convites personalizados.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
