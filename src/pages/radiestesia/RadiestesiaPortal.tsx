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
  Layers,
  Moon
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
    destaque: 'Método Principal',
    categoria: 'clinico',
  },
  {
    id: 'mesa-radionica',
    titulo: 'Mesa Radiónica Digital',
    descricao: 'Leitura simbólica de campos, não de pessoas. Sem respostas absolutas — apenas escuta do campo.',
    icon: <Target className="w-6 h-6" />,
    rota: '/radiestesia/mesa',
    cor: 'from-purple-500/20 to-purple-600/10',
    destaque: 'Leitura Livre',
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

// Textos fixos para cada modo
const TEXTOS_MODO = {
  clinico: {
    titulo: '🜂 Radiestesia Clínica',
    descricao: 'Aqui a radiestesia organiza a escuta e sustenta o campo terapêutico.',
    uso: 'Atendimento simbólico estruturado, leitura de campo, apoio a processos.',
  },
  oracular: {
    titulo: '🜁 Radiestesia Oracular',
    descricao: 'Aqui a radiestesia lê movimentos, não destinos.',
    uso: 'Leitura simbólica, ritualística e narrativa. Integração com arquétipos.',
  },
  estudo: {
    titulo: '🜄 Radiestesia de Estudo',
    descricao: 'Aqui a radiestesia é estudada como linguagem.',
    uso: 'Aprendizado, pesquisa, treino, comparação de métodos e autores.',
  },
};

export default function RadiestesiaPortal() {
  const navigate = useNavigate();
  const { config, isLoading } = useRadiestesiaConfig();
  const [modoAtivo, setModoAtivo] = useState<'clinico' | 'oracular' | 'estudo'>('clinico');

  const ferramentasFiltradas = FERRAMENTAS.filter(f => f.categoria === modoAtivo);
  const modoTexto = TEXTOS_MODO[modoAtivo];

  if (isLoading) {
    return (
      <AppLayout>
        <ContentPageLayout
          title="Portal Radiestesia"
          subtitle="Método de Leitura Simbólica"
          badge="Portal"
          badgeIcon={<Moon className="w-4 h-4 text-gold" />}
          onBack={() => navigate('/ferramentas')}
          backLabel="Voltar"
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
        title="Portal Radiestesia"
        subtitle="Método de Leitura Simbólica"
        badge="Portal 6"
        badgeIcon={<Moon className="w-4 h-4 text-gold" />}
        onBack={() => navigate('/ferramentas')}
        backLabel="Voltar"
        maxWidth="4xl"
      >
        {/* Introdução Pedagógica Principal */}
        <Card className="bg-gradient-to-br from-purple-900/30 to-background border-purple-500/30">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-purple-500/20">
                <Moon className="w-6 h-6 text-purple-400" />
              </div>
              <div className="space-y-3 flex-1">
                <h3 className="font-display text-lg text-foreground">
                  🌒 Portal Radiestesia — Introdução
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    Este Portal sustenta a Radiestesia como <strong className="text-foreground">linguagem de leitura</strong>, 
                    não como técnica de resposta rápida.
                  </p>
                  <p className="italic">
                    Aqui, o pêndulo não decide. Ele responde à qualidade da pergunta.
                  </p>
                </div>
                
                <div className="pt-2 space-y-2">
                  <p className="text-sm font-medium text-foreground">A Radiestesia Oracular:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Não substitui presença</li>
                    <li>Não promete solução imediata</li>
                    <li>Não cria dependência</li>
                  </ul>
                </div>

                <div className="pt-2 p-3 rounded-lg bg-background/50 border border-dashed border-purple-500/30">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Use este Portal quando:</strong> O campo pede escuta antes de ação. 
                    A leitura precisa de estrutura. O processo exige limite e clareza.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aviso Ético */}
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Aviso:</strong> Este portal não substitui 
                orientação clínica, não promete curas e não oferece diagnósticos. 
                Ela organiza o campo, revela padrões e sustenta escolhas éticas.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 3 Abas Fixas: Clínica, Oracular, Estudo */}
        <Tabs value={modoAtivo} onValueChange={(v) => setModoAtivo(v as typeof modoAtivo)}>
          <TabsList className="w-full h-auto grid grid-cols-3 gap-1 bg-background/50 p-1">
            <TabsTrigger 
              value="clinico"
              className="flex items-center gap-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
            >
              <Stethoscope className="w-4 h-4" />
              <span className="hidden sm:inline">Clínica</span>
            </TabsTrigger>
            <TabsTrigger 
              value="oracular"
              className="flex items-center gap-2 data-[state=active]:bg-gold/20 data-[state=active]:text-gold"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Oracular</span>
            </TabsTrigger>
            <TabsTrigger 
              value="estudo"
              className="flex items-center gap-2 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
            >
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Estudo</span>
            </TabsTrigger>
          </TabsList>

          {/* Descrição do Modo Ativo */}
          <Card className={cn(
            "mt-4 border-l-4",
            modoAtivo === 'clinico' && "border-l-purple-500 bg-purple-500/5",
            modoAtivo === 'oracular' && "border-l-gold bg-gold/5",
            modoAtivo === 'estudo' && "border-l-blue-500 bg-blue-500/5"
          )}>
            <CardContent className="py-4">
              <h4 className="font-medium text-foreground mb-1">{modoTexto.titulo}</h4>
              <p className="text-sm text-muted-foreground italic mb-2">
                "{modoTexto.descricao}"
              </p>
              <p className="text-xs text-muted-foreground">
                <strong>Uso:</strong> {modoTexto.uso}
              </p>
            </CardContent>
          </Card>
        </Tabs>

        {/* Grid de Ferramentas Filtradas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ferramentasFiltradas.map((ferramenta) => (
            <Card 
              key={ferramenta.id}
              className={cn(
                "group cursor-pointer transition-all duration-300",
                "hover:shadow-lg hover:shadow-gold/10 hover:border-gold/30",
                "bg-gradient-to-br",
                ferramenta.cor,
                ferramenta.id === 'leitura-5-camadas' && "ring-2 ring-gold/50"
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
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs",
                        ferramenta.id === 'leitura-5-camadas' && "bg-gold/20 text-gold border-gold/50"
                      )}
                    >
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

        {/* CTA para ver todas as ferramentas se não estiver em "todos" */}
        {ferramentasFiltradas.length < FERRAMENTAS.length && (
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/radiestesia/graficos')}
              className="text-muted-foreground hover:text-gold"
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Ver Catálogo Completo de Gráficos
            </Button>
          </div>
        )}

        {/* Microcopy final */}
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground/60 italic">
            "A mesa não responde. Ela revela onde o campo pede escuta."
          </p>
        </div>

        <EthicalNotice toolName="Portal Radiestesia" />
      </ContentPageLayout>
    </AppLayout>
  );
}
