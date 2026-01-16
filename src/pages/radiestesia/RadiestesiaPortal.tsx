import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ContentPageLayout } from '@/components/shared/ContentPageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EthicalNotice } from '@/components/shared/EthicalNotice';
import { useRadiestesiaConfig } from '@/hooks/useRadiestesiaConfig';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Target, 
  Grid3X3, 
  Shield, 
  Gem, 
  Activity, 
  BookOpen,
  ArrowRight,
  AlertTriangle,
  Info,
  Stethoscope,
  Sparkles,
  GraduationCap,
  Radio,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FerramentaInterna {
  id: string;
  titulo: string;
  descricao: string;
  icon: React.ReactNode;
  rota: string;
  cor: string;
  destaque?: string;
  categoria: 'clinico' | 'oracular' | 'estudo';
}

const FERRAMENTAS: FerramentaInterna[] = [
  {
    id: 'leitura-5-camadas',
    titulo: 'Leitura em 5 Camadas',
    descricao: 'Método estruturado de leitura simbólica: Campo Atual, Origem, Bloqueio, Movimento e Integração.',
    icon: <Layers className="w-6 h-6" />,
    rota: '/radiestesia/leitura',
    cor: 'from-gold/20 to-amber-600/10',
    destaque: 'Principal',
    categoria: 'clinico',
  },
  {
    id: 'mesa-radionica',
    titulo: 'Mesa Radiónica Digital',
    descricao: 'Leitura simbólica de campos, não de pessoas. Sem respostas absolutas — apenas escuta do campo.',
    icon: <Target className="w-6 h-6" />,
    rota: '/radiestesia/mesa',
    cor: 'from-purple-500/20 to-purple-600/10',
    destaque: 'Leitura de Campo',
    categoria: 'clinico',
  },
  {
    id: 'catalogo-graficos',
    titulo: 'Catálogo de Gráficos',
    descricao: 'Estudo e uso consciente de gráficos radiónicos com origem, aplicação e contraindicações.',
    icon: <Grid3X3 className="w-6 h-6" />,
    rota: '/radiestesia/graficos',
    cor: 'from-blue-500/20 to-blue-600/10',
    destaque: 'Pedagógico',
    categoria: 'estudo',
  },
  {
    id: 'pantaculos',
    titulo: 'Pantáculos & Selos',
    descricao: 'Instrumentos de proteção e sustentação com orientações de uso ético e ritual.',
    icon: <Shield className="w-6 h-6" />,
    rota: '/radiestesia/pantaculos',
    cor: 'from-gold/20 to-amber-600/10',
    destaque: 'Proteção',
    categoria: 'oracular',
  },
  {
    id: 'cristais',
    titulo: 'Cristais & Campos',
    descricao: 'Leitura simbólica de sustentação energética — não escolha aleatória de cristal.',
    icon: <Gem className="w-6 h-6" />,
    rota: '/radiestesia/cristais',
    cor: 'from-emerald-500/20 to-emerald-600/10',
    destaque: 'Sustentação',
    categoria: 'clinico',
  },
  {
    id: 'escala-narrativa',
    titulo: 'Escala Narrativa Vibracional',
    descricao: 'Leitura narrativa do campo inspirada em Hawkins — sem frequências numéricas rígidas.',
    icon: <Activity className="w-6 h-6" />,
    rota: '/radiestesia/escala',
    cor: 'from-rose-500/20 to-rose-600/10',
    destaque: 'Autoral',
    categoria: 'oracular',
  },
  {
    id: 'diario',
    titulo: 'Diário de Práticas',
    descricao: 'Registro ético e profissional das suas leituras e práticas radiónicas.',
    icon: <BookOpen className="w-6 h-6" />,
    rota: '/radiestesia/diario',
    cor: 'from-indigo-500/20 to-indigo-600/10',
    destaque: 'Registro',
    categoria: 'clinico',
  },
];

const SECOES = [
  { id: 'todos', label: 'Todas', icon: Radio },
  { id: 'clinico', label: 'Clínica', icon: Stethoscope },
  { id: 'oracular', label: 'Oracular', icon: Sparkles },
  { id: 'estudo', label: 'Estudo', icon: GraduationCap },
];

export default function RadiestesiaPortal() {
  const navigate = useNavigate();
  const { config, isLoading } = useRadiestesiaConfig();
  const [secaoAtiva, setSecaoAtiva] = useState('todos');

  const intro = config.intro_pedagogica;
  const amplificador = config.amplificador_destaque;
  const secaoClinica = config.secao_clinica;
  const secaoOracular = config.secao_oracular;
  const secaoEstudo = config.secao_estudo;

  const ferramentasFiltradas = secaoAtiva === 'todos' 
    ? FERRAMENTAS 
    : FERRAMENTAS.filter(f => f.categoria === secaoAtiva);

  // Check if section is active
  const isSecaoAtiva = (secao: string) => {
    if (secao === 'clinico') return secaoClinica?.ativo !== false;
    if (secao === 'oracular') return secaoOracular?.ativo !== false;
    if (secao === 'estudo') return secaoEstudo?.ativo !== false;
    return true;
  };

  if (isLoading) {
    return (
      <AppLayout>
        <ContentPageLayout
          title="Radiestesia Oracular"
          subtitle="Campos Vibracionais & Práticas de Escuta"
          badge="Portal"
          badgeIcon={<Target className="w-4 h-4 text-gold" />}
          onBack={() => navigate('/ferramentas')}
          backLabel="Voltar às Ferramentas"
          maxWidth="4xl"
        >
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          </div>
        </ContentPageLayout>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <ContentPageLayout
        title="Radiestesia Oracular"
        subtitle="Campos Vibracionais & Práticas de Escuta"
        badge="Portal"
        badgeIcon={<Target className="w-4 h-4 text-gold" />}
        onBack={() => navigate('/ferramentas')}
        backLabel="Voltar às Ferramentas"
        maxWidth="4xl"
      >
        {/* Introdução Pedagógica */}
        {intro?.ativo !== false && (
          <Card className="bg-gradient-to-br from-purple-900/20 to-background border-purple-500/20">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  {intro?.titulo && (
                    <h3 className="font-semibold text-foreground">{intro.titulo}</h3>
                  )}
                  <p className="text-foreground">
                    {intro?.texto || 
                      "A radiestesia é uma arte de escuta sutil, não de medição absoluta. Neste portal, você encontrará instrumentos para ler campos, não pessoas."
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Cada ferramenta aqui foi desenhada para uso profissional e ético. 
                    Não prometemos respostas — oferecemos caminhos de percepção.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Amplificador de Sensibilidade - Destaque */}
        {amplificador?.ativo !== false && (
          <Card className="border-gold/30 bg-gradient-to-br from-gold/10 to-background">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold" />
                <CardTitle className="text-lg text-gold">
                  {amplificador?.titulo || "Amplificador de Sensibilidade Radiestésica"}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {amplificador?.descricao || 
                  "Instrumento para calibrar e ampliar a percepção sutil antes de uma prática."
                }
              </p>
              {amplificador?.uso_recomendado && (
                <div className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Uso recomendado:</strong> {amplificador.uso_recomendado}
                </div>
              )}
              {amplificador?.contexto_simbolico && (
                <div className="p-3 rounded-lg bg-background/50 border border-gold/20">
                  <p className="text-xs italic text-muted-foreground">
                    {amplificador.contexto_simbolico}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Alerta ético */}
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Aviso:</strong> Este portal não substitui 
                orientação clínica, não promete curas e não oferece diagnósticos. 
                É uma ferramenta de <em>exploração simbólica</em> para profissionais.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Filtro por Modalidade */}
        <Tabs value={secaoAtiva} onValueChange={setSecaoAtiva}>
          <TabsList className="w-full h-auto flex-wrap gap-1 bg-background/50 p-1">
            {SECOES.filter(s => s.id === 'todos' || isSecaoAtiva(s.id)).map((secao) => (
              <TabsTrigger 
                key={secao.id} 
                value={secao.id}
                className="flex items-center gap-2 data-[state=active]:bg-gold/20 data-[state=active]:text-gold"
              >
                <secao.icon className="w-4 h-4" />
                {secao.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Descrição da Seção */}
        {secaoAtiva !== 'todos' && (
          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground">
              {secaoAtiva === 'clinico' && (secaoClinica?.descricao || "Uso terapêutico, leitura de campo, apoio a processos.")}
              {secaoAtiva === 'oracular' && (secaoOracular?.descricao || "Leitura simbólica, orientação narrativa, ritos e travessias.")}
              {secaoAtiva === 'estudo' && (secaoEstudo?.descricao || "História, autores, fundamentos, comparação de métodos.")}
            </p>
          </div>
        )}

        {/* Grid de Ferramentas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ferramentasFiltradas.map((ferramenta) => (
            <Card 
              key={ferramenta.id}
              className={cn(
                "group cursor-pointer transition-all duration-300",
                "hover:shadow-lg hover:shadow-gold/10 hover:border-gold/30",
                "bg-gradient-to-br",
                ferramenta.cor
              )}
              onClick={() => navigate(ferramenta.rota)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className={cn(
                    "p-2 rounded-lg bg-background/50",
                    "group-hover:bg-gold/10 transition-colors"
                  )}>
                    {ferramenta.icon}
                  </div>
                  {ferramenta.destaque && (
                    <Badge variant="outline" className="text-xs">
                      {ferramenta.destaque}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg mt-3 group-hover:text-gold transition-colors">
                  {ferramenta.titulo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {ferramenta.descricao}
                </CardDescription>
                <div className="mt-4 flex items-center text-sm text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Acessar</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Microcopy final */}
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground/60 italic">
            "A mesa não responde. Ela revela onde o campo pede escuta."
          </p>
        </div>

        <EthicalNotice toolName="Radiestesia Oracular" />
      </ContentPageLayout>
    </AppLayout>
  );
}
