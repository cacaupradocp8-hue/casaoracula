import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  BookOpen, 
  GraduationCap,
  Lightbulb, 
  HelpCircle, 
  Compass,
  Wrench,
  ArrowRight,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

// Casos-modelo educativos (mock local V1)
const casosModelo = [
  {
    id: '1',
    titulo: 'O Fio Invisível',
    tema: 'Codependência e limites relacionais',
    nivel: 'iniciante' as const,
    contexto: 'Uma mulher de 35 anos busca atendimento após o término de um relacionamento de 8 anos. Relata um padrão recorrente de priorizar as necessidades do parceiro em detrimento das suas próprias. Sente-se "vazia" quando está sozinha e tem dificuldade em identificar seus próprios desejos.',
    perguntas_conducao: [
      'Como esse padrão de cuidar excessivamente do outro se manifestou na história de vida?',
      'Quais medos surgem quando ela pensa em estabelecer limites?',
      'Onde está a raiva não expressa nesse sistema?',
      'Qual seria o primeiro passo para ela se reconectar consigo mesma?'
    ],
    hipoteses_simbolicas: [
      'O cuidado excessivo pode ser uma forma de garantir que não será abandonada',
      'A "vazio" quando sozinha pode indicar uma identidade construída em função do outro',
      'Os limites fracos podem estar conectados a uma crença de que suas necessidades são menos importantes'
    ],
    ferramentas_sugeridas: ['Eneagrama (Tipo 2?)', 'Big5 (Amabilidade alta?)']
  },
  {
    id: '2',
    titulo: 'A Torre de Cristal',
    tema: 'Perfeccionismo e medo do fracasso',
    nivel: 'intermediario' as const,
    contexto: 'Homem de 42 anos, executivo bem-sucedido, procura terapia por "esgotamento". Trabalha 70 horas por semana e não consegue delegar tarefas. Relata crises de ansiedade quando algo não sai "perfeito". Infância com pai crítico que nunca demonstrou aprovação.',
    perguntas_conducao: [
      'Qual é o custo real desse perfeccionismo na vida dele?',
      'O que aconteceria se ele permitisse um "fracasso"?',
      'Quem seria ele se não fosse o "funcionário exemplar"?',
      'Existe uma parte dele que está pedindo descanso?'
    ],
    hipoteses_simbolicas: [
      'O perfeccionismo pode ser uma estratégia para finalmente receber a aprovação do pai',
      'A torre de cristal representa uma identidade frágil que pode ruir com qualquer falha',
      'O esgotamento pode ser o corpo expressando o que a mente não permite'
    ],
    ferramentas_sugeridas: ['Eneagrama (Tipo 3?)', 'Big5 (Conscienciosidade e Neuroticismo)']
  },
  {
    id: '3',
    titulo: 'O Mar Profundo',
    tema: 'Luto não elaborado e depressão',
    nivel: 'avancado' as const,
    contexto: 'Mulher de 55 anos, perdeu a mãe há 3 anos. Desde então, sente-se "presa" em uma tristeza que não passa. Abandonou hobbies, distanciou-se de amigos. Relata sonhos recorrentes com a mãe. Culpa por conflitos não resolvidos antes da morte.',
    perguntas_conducao: [
      'O que ainda não foi dito para a mãe?',
      'Existe algo que ela precisava receber da mãe e nunca recebeu?',
      'Como seria honrar a mãe sem perder a si mesma?',
      'Os sonhos estão trazendo alguma mensagem específica?'
    ],
    hipoteses_simbolicas: [
      'A "prisão" pode ser uma forma inconsciente de manter-se conectada à mãe',
      'A culpa não elaborada impede a conclusão do luto',
      'O mar profundo representa emoções submersas que precisam emergir'
    ],
    ferramentas_sugeridas: ['Mapa Oracular', 'Perguntas do Oráculo']
  },
  {
    id: '4',
    titulo: 'O Labirinto do Espelho',
    tema: 'Identidade e autoimagem distorcida',
    nivel: 'intermediario' as const,
    contexto: 'Jovem de 24 anos, artista, questiona sua identidade e lugar no mundo. Sente que "usa máscaras" diferentes em cada contexto social. Dificuldade em manter relacionamentos íntimos pois "não sabe quem realmente é". História de bullying na adolescência.',
    perguntas_conducao: [
      'Qual foi a primeira máscara que ela precisou usar para sobreviver?',
      'Existe algum contexto onde ela se sente mais "verdadeira"?',
      'O que ela teme que as pessoas vejam se as máscaras caírem?',
      'O bullying silenciou qual parte dela?'
    ],
    hipoteses_simbolicas: [
      'As máscaras podem ter sido criadas como proteção contra novas rejeições',
      'O labirinto representa a confusão entre quem ela é e quem ela aprendeu a ser',
      'A arte pode ser um canal onde o eu autêntico encontra expressão'
    ],
    ferramentas_sugeridas: ['Eneagrama', 'Big5 (todos os eixos)']
  }
];

type NivelCaso = 'iniciante' | 'intermediario' | 'avancado';

interface CasoModelo {
  id: string;
  titulo: string;
  tema: string;
  nivel: NivelCaso;
  contexto: string;
  perguntas_conducao: string[];
  hipoteses_simbolicas: string[];
  ferramentas_sugeridas: string[];
}

export default function LaboratorioLeitura() {
  const [selectedCaso, setSelectedCaso] = useState<CasoModelo | null>(null);
  const [filterNivel, setFilterNivel] = useState<NivelCaso | 'todos'>('todos');

  const getNivelBadge = (nivel: NivelCaso) => {
    switch (nivel) {
      case 'iniciante':
        return <Badge variant="secondary" className="bg-green-600/20 text-green-400">Iniciante</Badge>;
      case 'intermediario':
        return <Badge variant="secondary" className="bg-amber-600/20 text-amber-400">Intermediário</Badge>;
      case 'avancado':
        return <Badge variant="secondary" className="bg-red-600/20 text-red-400">Avançado</Badge>;
    }
  };

  const filteredCasos = filterNivel === 'todos' 
    ? casosModelo 
    : casosModelo.filter(c => c.nivel === filterNivel);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <SectionHeader
          title="Laboratório de Leitura"
          subtitle="Casos-modelo para estudo e prática — sem vínculo com clientes reais"
          icon={<BookOpen className="w-5 h-5" />}
          className="mb-6"
        />

        {/* Aviso Educativo */}
        <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">
                <strong className="text-amber-500">Aviso:</strong> Esta é uma área educativa. Os casos apresentados são fictícios e 
                servem apenas para estudo e prática de leitura simbólica. Nenhum dado é salvo em prontuário.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            variant={filterNivel === 'todos' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilterNivel('todos')}
          >
            Todos
          </Button>
          <Button 
            variant={filterNivel === 'iniciante' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilterNivel('iniciante')}
          >
            <GraduationCap className="w-4 h-4 mr-1" />
            Iniciante
          </Button>
          <Button 
            variant={filterNivel === 'intermediario' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilterNivel('intermediario')}
          >
            Intermediário
          </Button>
          <Button 
            variant={filterNivel === 'avancado' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilterNivel('avancado')}
          >
            Avançado
          </Button>
        </div>

        {/* Lista de Casos */}
        <div className="grid gap-4">
          {filteredCasos.map((caso) => (
            <Card 
              key={caso.id} 
              className="group hover:shadow-gold transition-shadow cursor-pointer"
              onClick={() => setSelectedCaso(caso)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl font-display flex items-center gap-2">
                      {caso.titulo}
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-gold transition-colors" />
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {caso.tema}
                    </CardDescription>
                  </div>
                  {getNivelBadge(caso.nivel)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {caso.contexto}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {caso.ferramentas_sugeridas.map((ferramenta, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      <Wrench className="w-3 h-3 mr-1" />
                      {ferramenta}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal de Detalhe do Caso */}
        <Dialog open={!!selectedCaso} onOpenChange={(open) => !open && setSelectedCaso(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedCaso && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {getNivelBadge(selectedCaso.nivel)}
                  </div>
                  <DialogTitle className="font-display text-2xl">
                    {selectedCaso.titulo}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedCaso.tema}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  {/* Contexto */}
                  <Card className="border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-gold" />
                        Contexto do Caso
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedCaso.contexto}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Perguntas de Condução */}
                  <Card className="border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-blue-500" />
                        Perguntas de Condução
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedCaso.perguntas_conducao.map((pergunta, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <ArrowRight className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                            <span>{pergunta}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Hipóteses Simbólicas */}
                  <Card className="border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        Hipóteses Simbólicas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedCaso.hipoteses_simbolicas.map((hipotese, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Compass className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                            <span>{hipotese}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Ferramentas Sugeridas */}
                  <Card className="border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-green-500" />
                        Ferramentas Sugeridas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedCaso.ferramentas_sugeridas.map((ferramenta, i) => (
                          <Badge key={i} variant="secondary" className="text-sm">
                            {ferramenta}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        💡 Experimente aplicar mentalmente essas ferramentas ao caso e observe quais insights surgem.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
