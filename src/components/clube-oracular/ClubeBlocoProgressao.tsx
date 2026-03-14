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
  const cenario = CENARIOS.find(c => c.match(portal)) || CENARIOS[0];
  const Icon = cenario.icon;

  return (
    <Card className="border-gold/12 bg-card/40 backdrop-blur-sm hover:-translate-y-1.5 hover:shadow-[0_10px_30px_-8px_hsl(var(--gold)/0.1)] transition-all duration-500">
      <CardContent className="p-7">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/12 flex items-center justify-center">
            <Icon className="w-4 h-4 text-gold" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-medium">
            Seu Próximo Passo na Casa
          </p>
        </div>

        <h3 className="font-display text-base text-foreground mb-3 leading-snug">
          {cenario.titulo}
        </h3>
        <p className="text-xs text-muted-foreground/70 leading-relaxed mb-6">
          {cenario.texto}
        </p>

        <Button
          size="sm"
          className="w-full gap-2 bg-gradient-to-r from-gold to-mystic hover:scale-105 text-primary-foreground border border-gold/20 transition-all duration-300 shadow-[0_0_20px_-6px_hsl(var(--gold)/0.2)]"
          onClick={() => navigate(cenario.rota)}
        >
          {cenario.botao}
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>

        {engajamento === 'baixo' && (
          <p className="text-[10px] text-muted-foreground/40 text-center mt-4 italic">
            Participe mais do Clube para desbloquear convites personalizados.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
