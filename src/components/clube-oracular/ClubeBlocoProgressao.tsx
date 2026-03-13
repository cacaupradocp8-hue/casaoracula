import { useNavigate } from 'react-router-dom';
import { Compass, GraduationCap, Wrench, Star } from 'lucide-react';
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

  if (engajamento === 'baixo') return null;

  const cenario = CENARIOS.find(c => c.match(portal)) || CENARIOS[0];
  const Icon = cenario.icon;

  return (
    <Card className="border-primary/15 bg-gradient-to-br from-primary/5 to-card">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Icon className="w-4 h-4 text-primary" />
          <p className="text-xs uppercase tracking-[0.15em] text-primary font-medium">
            Seu Próximo Passo
          </p>
        </div>
        <h3 className="text-sm font-medium text-foreground mb-2">{cenario.titulo}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4">{cenario.texto}</p>
        <Button size="sm" className="w-full" onClick={() => navigate(cenario.rota)}>
          {cenario.botao}
        </Button>
      </CardContent>
    </Card>
  );
}
