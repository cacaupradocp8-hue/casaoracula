import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Compass, Layers, Target, Repeat, Save } from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const VALID_TABS = ['5-camadas', 'radar', 'trilha'] as const;

export default function FerramentasMetodo() {
  const [searchParams] = useSearchParams();
  
  const defaultTab = useMemo(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && VALID_TABS.includes(tabParam as typeof VALID_TABS[number])) {
      return tabParam;
    }
    return '5-camadas';
  }, [searchParams]);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <SectionHeader
          title="Sala do Método"
          subtitle="Ferramentas práticas para a leitura simbólica"
          icon={<Compass className="w-5 h-5" />}
          className="mb-8"
        />

        <Tabs defaultValue={defaultTab} className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="5-camadas" className="gap-2">
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">5 Camadas</span>
            </TabsTrigger>
            <TabsTrigger value="radar" className="gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Radar de Eixo</span>
            </TabsTrigger>
            <TabsTrigger value="trilha" className="gap-2">
              <Repeat className="w-4 h-4" />
              <span className="hidden sm:inline">Neuroplasticidade</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="5-camadas">
            <LeituraCincoCamadas />
          </TabsContent>

          <TabsContent value="radar">
            <RadarDeEixo />
          </TabsContent>

          <TabsContent value="trilha">
            <TrilhaNeuroplasticidade />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

function LeituraCincoCamadas() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    layer1: '',
    layer2: '',
    layer3: '',
    layer4: '',
    layer5: '',
  });

  const layers = [
    {
      key: 'layer1',
      number: 1,
      title: 'Sintoma / Padrão',
      question: 'O que a cliente apresenta como queixa principal? Qual padrão se repete em sua vida?',
      placeholder: 'Descreva o sintoma ou padrão observado...',
    },
    {
      key: 'layer2',
      number: 2,
      title: 'Ego / Defesa',
      question: 'Como o ego está reagindo? Que defesas estão ativas? O que o ego está tentando proteger?',
      placeholder: 'Analise as defesas egoicas...',
    },
    {
      key: 'layer3',
      number: 3,
      title: 'Projeção',
      question: 'O que está sendo projetado para fora? Quem ou o que recebe essa projeção? O que a cliente não está vendo em si mesma?',
      placeholder: 'Identifique as projeções...',
    },
    {
      key: 'layer4',
      number: 4,
      title: 'Arquétipo / Narrativa',
      question: 'Qual arquétipo está constelado? Que narrativa mítica ou conto de poder ressoa com esta situação?',
      placeholder: 'Identifique arquétipos e narrativas simbólicas...',
    },
    {
      key: 'layer5',
      number: 5,
      title: 'Portal',
      question: 'Qual é o portal sendo pedido? O que precisa morrer para que algo novo nasça? Qual o chamado da alma?',
      placeholder: 'Delineie o portal necessário...',
    },
  ];

  const handleSave = () => {
    toast({
      title: 'Leitura salva',
      description: 'A Leitura em 5 Camadas foi salva com sucesso.',
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-mystical border-gold/20">
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            A Leitura Simbólica em 5 Camadas é a ferramenta central do método ORÁCULA. 
            Cada camada desvela uma dimensão da experiência da cliente, partindo do sintoma 
            visível até a travessia que a alma pede. <strong>Nunca gere diagnósticos automáticos</strong>. 
            Use as perguntas como guia reflexivo.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-8">
        {layers.map((layer) => (
          <Card key={layer.key} className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gold to-gold-dark" />
            <CardHeader className="pl-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-display font-bold">
                  {layer.number}
                </span>
                <CardTitle className="font-display">{layer.title}</CardTitle>
              </div>
              <CardDescription className="italic">
                {layer.question}
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-6">
              <Textarea
                placeholder={layer.placeholder}
                className="min-h-[120px] resize-y"
                value={formData[layer.key as keyof typeof formData]}
                onChange={(e) => setFormData(prev => ({ ...prev, [layer.key]: e.target.value }))}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="gold" size="lg" onClick={handleSave} className="w-full gap-2">
        <Save className="w-4 h-4" />
        Salvar Leitura
      </Button>
    </div>
  );
}

function RadarDeEixo() {
  const { toast } = useToast();
  const [values, setValues] = useState({
    realityOrientation: 3,
    psychicFlexibility: 3,
    emotionalRegulation: 3,
    decisionCapacity: 3,
    beingContinuity: 3,
    boundariesLimits: 3,
  });
  const [evidence, setEvidence] = useState('');
  const [notes, setNotes] = useState('');

  const axes = [
    { key: 'realityOrientation', label: 'Orientação da Realidade', shortLabel: 'Realidade', description: 'Capacidade de diferenciar fantasia de realidade' },
    { key: 'psychicFlexibility', label: 'Flexibilidade Psíquica', shortLabel: 'Flexibilidade', description: 'Abertura para novas perspectivas e mudanças' },
    { key: 'emotionalRegulation', label: 'Regulação Emocional', shortLabel: 'Regulação', description: 'Capacidade de modular intensidade emocional' },
    { key: 'decisionCapacity', label: 'Capacidade de Decisão', shortLabel: 'Decisão', description: 'Autonomia para fazer escolhas conscientes' },
    { key: 'beingContinuity', label: 'Continuidade do Ser', shortLabel: 'Continuidade', description: 'Senso de identidade estável através do tempo' },
    { key: 'boundariesLimits', label: 'Fronteiras e Limites', shortLabel: 'Fronteiras', description: 'Clareza sobre onde eu termino e o outro começa' },
  ];

  // Prepare data for the radar chart
  const radarData = axes.map((axis) => ({
    axis: axis.shortLabel,
    fullLabel: axis.label,
    value: values[axis.key as keyof typeof values],
    fullMark: 5,
  }));

  const handleSave = () => {
    toast({
      title: 'Radar salvo',
      description: 'O Radar de Eixo foi salvo com sucesso.',
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-mystical border-gold/20">
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            O Radar de Eixo mapeia 6 competências estruturais que sustentam o funcionamento psíquico. 
            Avalie cada eixo de 1 (muito baixo) a 5 (muito alto) com base em evidências observáveis, 
            não em interpretações.
          </p>
        </CardContent>
      </Card>

      {/* Radar Chart Visualization */}
      <Card className="overflow-hidden">
        <CardHeader className="text-center pb-0">
          <CardTitle className="font-display text-gold">Mapa dos Eixos</CardTitle>
          <CardDescription>Visualização radial das 6 competências estruturais</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="w-full h-[350px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeOpacity={0.3}
                  gridType="polygon"
                />
                <PolarAngleAxis 
                  dataKey="axis" 
                  tick={{ 
                    fill: 'hsl(var(--foreground))', 
                    fontSize: 11,
                    fontWeight: 500,
                  }}
                  tickLine={false}
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 5]} 
                  tickCount={6}
                  tick={{ 
                    fill: 'hsl(var(--muted-foreground))', 
                    fontSize: 10,
                  }}
                  axisLine={false}
                />
                <Radar
                  name="Eixos"
                  dataKey="value"
                  stroke="hsl(45 93% 47%)"
                  fill="hsl(45 93% 47%)"
                  fillOpacity={0.3}
                  strokeWidth={2}
                  dot={{
                    r: 4,
                    fill: 'hsl(45 93% 47%)',
                    strokeWidth: 0,
                  }}
                  activeDot={{
                    r: 6,
                    fill: 'hsl(45 93% 47%)',
                    stroke: 'hsl(var(--background))',
                    strokeWidth: 2,
                  }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background/95 backdrop-blur-sm border border-gold/30 rounded-lg px-3 py-2 shadow-lg">
                          <p className="font-display text-sm text-gold">{data.fullLabel}</p>
                          <p className="text-muted-foreground text-xs">
                            Nível: <span className="text-foreground font-semibold">{data.value}</span>/5
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {axes.map((axis) => (
          <Card key={axis.key}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-display">{axis.label}</CardTitle>
              <CardDescription>{axis.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Slider
                  value={[values[axis.key as keyof typeof values]]}
                  onValueChange={(v) => setValues(prev => ({ ...prev, [axis.key]: v[0] }))}
                  min={1}
                  max={5}
                  step={1}
                  className="flex-1"
                />
                <span className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">
                  {values[axis.key as keyof typeof values]}
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
                <span>Muito baixo</span>
                <span>Muito alto</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">Evidências Observáveis</CardTitle>
          <CardDescription>Descreva os comportamentos e falas que sustentam sua avaliação</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Quais evidências você observou para cada eixo..."
            className="min-h-[120px]"
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">Notas Clínicas</CardTitle>
          <CardDescription>Suas reflexões e hipóteses como terapeuta</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Anotações privadas da terapeuta..."
            className="min-h-[120px]"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </CardContent>
      </Card>

      <Button variant="gold" size="lg" onClick={handleSave} className="w-full gap-2">
        <Save className="w-4 h-4" />
        Salvar Radar
      </Button>
    </div>
  );
}

function TrilhaNeuroplasticidade() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    trigger: '',
    currentResponse: '',
    desiredResponse: '',
    microAction: '',
    frequency: '',
    barriers: '',
    planB: '',
  });

  const fields = [
    { key: 'trigger', label: 'Gatilho', question: 'Qual situação dispara a resposta automática?', placeholder: 'Descreva o gatilho...' },
    { key: 'currentResponse', label: 'Resposta Automática Atual', question: 'O que acontece automaticamente quando o gatilho é acionado?', placeholder: 'Descreva a resposta atual...' },
    { key: 'desiredResponse', label: 'Nova Resposta Desejada', question: 'Qual resposta a cliente deseja cultivar no lugar da automática?', placeholder: 'Descreva a nova resposta...' },
    { key: 'microAction', label: 'Microação Diária', question: 'Qual pequena ação pode ser repetida diariamente para criar novo caminho neural?', placeholder: 'Descreva a microação...' },
    { key: 'frequency', label: 'Frequência', question: 'Quantas vezes por dia/semana será praticada?', placeholder: 'Ex: 3x ao dia, toda manhã...' },
    { key: 'barriers', label: 'Barreiras Prováveis', question: 'O que pode impedir a prática consistente?', placeholder: 'Liste as possíveis barreiras...' },
    { key: 'planB', label: 'Plano B', question: 'Se a barreira aparecer, qual será a alternativa?', placeholder: 'Descreva o plano alternativo...' },
  ];

  const handleSave = () => {
    toast({
      title: 'Trilha salva',
      description: 'A Trilha de Neuroplasticidade foi salva com sucesso.',
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-mystical border-gold/20">
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            A Trilha de Neuroplasticidade transforma insight em mudança sustentável. 
            Toda transformação exige repetição consciente. Esta ferramenta mapeia o caminho 
            do antigo padrão para a nova resposta desejada.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {fields.map((field) => (
          <Card key={field.key}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-display">{field.label}</CardTitle>
              <CardDescription className="italic">{field.question}</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={field.placeholder}
                className="min-h-[100px]"
                value={formData[field.key as keyof typeof formData]}
                onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="gold" size="lg" onClick={handleSave} className="w-full gap-2">
        <Save className="w-4 h-4" />
        Salvar Trilha
      </Button>
    </div>
  );
}
