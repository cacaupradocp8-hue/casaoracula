import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ContentPageLayout } from '@/components/shared/ContentPageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EthicalNotice } from '@/components/shared/EthicalNotice';
import { 
  Shield, 
  AlertTriangle,
  Eye,
  Flame,
  Lock,
  Sparkles,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Pantaculo {
  id: string;
  nome: string;
  campoQueSustenta: string;
  situacoesDeUso: string[];
  alertasUsoIndevido: string[];
  ritualAtivacao: string;
  categoria: 'protecao' | 'sustentacao' | 'transmutacao';
}

const PANTACULOS: Pantaculo[] = [
  {
    id: 'selo-salomao',
    nome: 'Selo de Salomão',
    campoQueSustenta: 'Proteção contra influências externas negativas. Estabelece fronteira energética clara.',
    situacoesDeUso: [
      'Início de trabalhos energéticos profundos',
      'Proteção de espaço terapêutico',
      'Quando sentir vulnerabilidade energética',
    ],
    alertasUsoIndevido: [
      'Não usar como amuleto de controle sobre outros',
      'Não substitui trabalho psicoterapêutico',
      'Evitar dependência do símbolo',
    ],
    ritualAtivacao: 'Trace o símbolo mentalmente três vezes. Visualize luz dourada preenchendo-o. Declare sua intenção de proteção em voz baixa ou mentalmente. Agradeça.',
    categoria: 'protecao',
  },
  {
    id: 'pentagrama',
    nome: 'Pentagrama de Proteção',
    campoQueSustenta: 'Equilíbrio dos cinco elementos internos. Harmonização corpo-mente-espírito.',
    situacoesDeUso: [
      'Meditações de integração elemental',
      'Proteção durante viagens astrais conscientes',
      'Rituais de fechamento de ciclo',
    ],
    alertasUsoIndevido: [
      'Não inverter o símbolo sem compreensão profunda',
      'Evitar uso superficial ou decorativo',
      'Não usar em estados emocionais desregulados',
    ],
    ritualAtivacao: 'Trace cada ponta do pentagrama começando pelo topo (espírito), descendo para a esquerda (água), subindo para a direita (ar), cruzando para a esquerda (fogo), e retornando ao topo passando pela terra. Visualize cada elemento sendo ativado.',
    categoria: 'protecao',
  },
  {
    id: 'cruz-ansata',
    nome: 'Ankh (Cruz Ansata)',
    campoQueSustenta: 'Vitalidade e regeneração. Conexão entre vida terrena e espiritual.',
    situacoesDeUso: [
      'Processos de cura e recuperação',
      'Transições de vida importantes',
      'Meditações sobre propósito',
    ],
    alertasUsoIndevido: [
      'Não usar para prolongar artificialmente situações',
      'Não apropriar sem estudo da tradição egípcia',
      'Evitar uso em rituais de controle',
    ],
    ritualAtivacao: 'Segure a imagem do Ankh sobre o coração. Respire três vezes profundamente. Visualize energia dourada fluindo do símbolo para seu campo vital. Agradeça às tradições ancestrais.',
    categoria: 'sustentacao',
  },
  {
    id: 'vesica-piscis',
    nome: 'Vesica Piscis',
    campoQueSustenta: 'União de polaridades. Portal entre mundos visível e invisível.',
    situacoesDeUso: [
      'Trabalhos de integração de sombra',
      'Meditações de reconciliação interna',
      'Rituais de passagem',
    ],
    alertasUsoIndevido: [
      'Não forçar integração prematura',
      'Respeitar o tempo do processo',
      'Não usar para "consertar" o que precisa ser vivido',
    ],
    ritualAtivacao: 'Desenhe dois círculos que se sobrepõem. Na interseção, coloque sua intenção de integração. Observe a forma central (a Vesica) e permita que imagens surjam. Não force — apenas receba.',
    categoria: 'transmutacao',
  },
];

const CATEGORIAS = [
  { id: 'todos', label: 'Todos', icon: Shield },
  { id: 'protecao', label: 'Proteção', icon: Lock },
  { id: 'sustentacao', label: 'Sustentação', icon: Sparkles },
  { id: 'transmutacao', label: 'Transmutação', icon: Flame },
];

export default function Pantaculos() {
  const navigate = useNavigate();
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos');
  const [pantaculoExpandido, setPantaculoExpandido] = useState<string | null>(null);

  const pantaculosFiltrados = PANTACULOS.filter((p) => 
    categoriaAtiva === 'todos' || p.categoria === categoriaAtiva
  );

  return (
    <AppLayout>
      <ContentPageLayout
        title="Pantáculos & Selos"
        subtitle="Instrumentos de proteção e sustentação"
        badge="Uso Consciente"
        badgeIcon={<Shield className="w-4 h-4 text-gold" />}
        onBack={() => navigate('/radiestesia')}
        backLabel="Voltar ao Portal"
        maxWidth="4xl"
      >
        {/* Introdução */}
        <Card className="bg-gradient-to-br from-gold/10 to-background border-gold/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-foreground">
                  Pantáculos e selos são <strong>instrumentos de proteção e sustentação</strong>, 
                  não amuletos mágicos. Requerem estudo, intenção clara e uso ético.
                </p>
                <p className="text-sm text-muted-foreground">
                  Cada símbolo carrega tradições ancestrais. Use com reverência, não como decoração.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filtros */}
        <Tabs value={categoriaAtiva} onValueChange={setCategoriaAtiva}>
          <TabsList className="w-full flex-wrap h-auto gap-1 bg-background/50">
            {CATEGORIAS.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id} className="text-sm gap-2">
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Lista de Pantáculos */}
        <div className="space-y-4">
          {pantaculosFiltrados.map((pantaculo) => (
            <Card 
              key={pantaculo.id}
              className={cn(
                "transition-all cursor-pointer",
                pantaculoExpandido === pantaculo.id && "border-gold/50"
              )}
              onClick={() => setPantaculoExpandido(
                pantaculoExpandido === pantaculo.id ? null : pantaculo.id
              )}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{pantaculo.nome}</CardTitle>
                    <CardDescription className="mt-1">
                      {pantaculo.campoQueSustenta}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {pantaculo.categoria}
                  </Badge>
                </div>
              </CardHeader>
              
              {pantaculoExpandido === pantaculo.id && (
                <CardContent className="space-y-6 pt-0">
                  {/* Situações de uso */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-400">
                      <Eye className="w-4 h-4" />
                      Quando usar
                    </div>
                    <ul className="space-y-1 pl-6">
                      {pantaculo.situacoesDeUso.map((situacao, i) => (
                        <li key={i} className="text-sm text-muted-foreground list-disc">
                          {situacao}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Alertas */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-rose-400">
                      <AlertTriangle className="w-4 h-4" />
                      Alertas de uso indevido
                    </div>
                    <ul className="space-y-1 pl-6">
                      {pantaculo.alertasUsoIndevido.map((alerta, i) => (
                        <li key={i} className="text-sm text-muted-foreground list-disc">
                          {alerta}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Ritual de ativação */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gold">
                      <Flame className="w-4 h-4" />
                      Ritual simples de ativação
                    </div>
                    <Card className="bg-muted/20 border-dashed">
                      <CardContent className="py-3">
                        <p className="text-sm text-muted-foreground italic">
                          {pantaculo.ritualAtivacao}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <EthicalNotice toolName="Pantáculos & Selos" />
      </ContentPageLayout>
    </AppLayout>
  );
}
