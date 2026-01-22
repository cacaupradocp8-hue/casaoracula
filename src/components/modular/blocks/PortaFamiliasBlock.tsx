import { useState } from 'react';
import { ContentBlock } from '@/types/modular';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Compass, 
  Shield, 
  Moon, 
  Sparkles, 
  Heart,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export interface PortaFamiliasContent {
  showRisks?: boolean;
  showIntegration?: boolean;
  compactMode?: boolean;
  highlightedFamily?: string;
}

interface Porta {
  numero: number;
  nome: string;
  tipoEvento: string;
  camposFrequentes: string[];
  oQueE: string;
  riscoClinico: string;
  criterioIntegracao: string;
}

interface FamiliaData {
  id: string;
  nome: string;
  nomeCompleto: string;
  definicao: string;
  icon: React.ReactNode;
  cor: string;
  corBg: string;
  portas: Porta[];
}

// Canonical mapping from PDF
const FAMILIAS_DATA: FamiliaData[] = [
  {
    id: 'transicao',
    nome: 'Transição',
    nomeCompleto: 'Portas de Transição',
    definicao: 'Eventos de passagem, intervalo e suspensão do eixo anterior. A psique já saiu de um estado, mas ainda não pode habitar o próximo.',
    icon: <Compass className="w-5 h-5" />,
    cor: 'text-blue-400',
    corBg: 'bg-blue-500/10 border-blue-500/30',
    portas: [
      { numero: 1, nome: 'Limiar', tipoEvento: 'Passagem Não Resolvida', camposFrequentes: ['Campo de Limiar', 'Campo de Retenção'], oQueE: 'A identidade antiga perdeu validade. A nova ainda não tem forma.', riscoClinico: 'Tratar o entre como indecisão patológica.', criterioIntegracao: 'Sustenta o entre sem urgência.' },
      { numero: 2, nome: 'Suspensão', tipoEvento: 'Congelamento Funcional', camposFrequentes: ['Campo de Retenção', 'Campo de Defesa'], oQueE: 'Algo precisou parar completamente para não se perder.', riscoClinico: 'Cobrar movimento antes do tempo.', criterioIntegracao: 'A pausa é reconhecida como proteção.' },
      { numero: 3, nome: 'Espera', tipoEvento: 'Descompasso Temporal', camposFrequentes: ['Campo de Retenção', 'Campo de Limiar'], oQueE: 'A psique está pronta, mas o contexto não.', riscoClinico: 'Moralizar a espera como atraso.', criterioIntegracao: 'A espera vira estação consciente de maturação.' },
      { numero: 4, nome: 'Entre-Tempos', tipoEvento: 'Intervalo Identitário', camposFrequentes: ['Campo de Limiar'], oQueE: 'A pessoa já não ocupa o papel antigo e ainda não pode assumir o novo.', riscoClinico: 'Forçar reinvenção. Criar "novo eu" performático.', criterioIntegracao: 'O intervalo é vivido sem autodesprezo.' },
      { numero: 5, nome: 'Travessia Interrompida', tipoEvento: 'Fratura de Trajetória', camposFrequentes: ['Campo de Dissolução', 'Campo de Limiar'], oQueE: 'Um caminho foi cortado no meio. A narrativa de continuidade se rompeu.', riscoClinico: 'Tentar "retomar de onde parou".', criterioIntegracao: 'Construção de um novo mapa, não retorno ao antigo.' },
    ]
  },
  {
    id: 'defesa',
    nome: 'Defesa',
    nomeCompleto: 'Portas de Defesa',
    definicao: 'Eventos de autoproteção psíquica e preservação do núcleo. Não são falhas de caráter. São eventos inteligentes de sobrevivência.',
    icon: <Shield className="w-5 h-5" />,
    cor: 'text-amber-400',
    corBg: 'bg-amber-500/10 border-amber-500/30',
    portas: [
      { numero: 6, nome: 'Silêncio', tipoEvento: 'Proteção do Núcleo Vivo', camposFrequentes: ['Campo de Retenção', 'Campo de Defesa'], oQueE: 'Calar não é ausência de conteúdo. É proteção ativa de algo que ainda não suporta ser dito.', riscoClinico: 'Forçar fala. Confundir silêncio com resistência.', criterioIntegracao: 'O silêncio vira escolha consciente.' },
      { numero: 7, nome: 'Vergonha', tipoEvento: 'Exposição Ameaçadora', camposFrequentes: ['Campo de Defesa'], oQueE: 'Algo essencial foi marcado como errado, feio ou perigoso.', riscoClinico: 'Desconsiderar a função protetiva.', criterioIntegracao: 'A vergonha perde peso existencial.' },
      { numero: 8, nome: 'Segredo', tipoEvento: 'Ocultação Necessária', camposFrequentes: ['Campo de Defesa', 'Campo de Retenção'], oQueE: 'Há conteúdos que não devem ser narrados ainda.', riscoClinico: 'Incentivar confissão. Confundir segredo com negação.', criterioIntegracao: 'O segredo torna-se um arquivo vivo com tempo próprio.' },
      { numero: 9, nome: 'Censura Interna', tipoEvento: 'Supressão Internalizada', camposFrequentes: ['Campo de Defesa'], oQueE: 'A psique aprendeu a se calar antes de desejar.', riscoClinico: 'Estimular expressão sem segurança simbólica.', criterioIntegracao: 'O desejo começa a aparecer em fragmentos toleráveis.' },
      { numero: 10, nome: 'Autocontenção', tipoEvento: 'Retração Protetiva', camposFrequentes: ['Campo de Retenção', 'Campo de Defesa'], oQueE: 'O gesto ficou menor para não provocar reação.', riscoClinico: 'Cobrar expansão antes da segurança.', criterioIntegracao: 'Pequenas expansões sem colapso.' },
      { numero: 11, nome: 'Vigilância', tipoEvento: 'Alerta Permanente', camposFrequentes: ['Campo de Defesa'], oQueE: 'O mundo é percebido como potencial ameaça.', riscoClinico: 'Interpretar como paranoia ou controle excessivo.', criterioIntegracao: 'Momentos breves de descanso sem culpa.' },
      { numero: 12, nome: 'Controle', tipoEvento: 'Domínio Compensatório', camposFrequentes: ['Campo de Defesa'], oQueE: 'Controlar vira tentativa de impedir nova invasão.', riscoClinico: 'Patologizar o controle sem ver a origem.', criterioIntegracao: 'Permitir pequenos imprevistos sem colapso.' },
      { numero: 13, nome: 'Rigidez', tipoEvento: 'Fixação Estrutural', camposFrequentes: ['Campo de Defesa', 'Campo de Retenção'], oQueE: 'A estrutura endurece para não quebrar.', riscoClinico: 'Forçar mudança. Interpretar como teimosia.', criterioIntegracao: 'Pequenas flexibilizações sem perda de eixo.' },
      { numero: 14, nome: 'Ataque Preventivo', tipoEvento: 'Defesa Antecipatória', camposFrequentes: ['Campo de Defesa'], oQueE: 'Atacar antes de ser atacada.', riscoClinico: 'Moralizar a agressividade.', criterioIntegracao: 'A vulnerabilidade começa a ter espaço protegido.' },
    ]
  },
  {
    id: 'dissolucao',
    nome: 'Dissolução',
    nomeCompleto: 'Portas de Dissolução',
    definicao: 'Eventos de fim interno, colapso de sentido e esvaziamento psíquico. Não anunciam começo. Pedem tempo sem correção.',
    icon: <Moon className="w-5 h-5" />,
    cor: 'text-purple-400',
    corBg: 'bg-purple-500/10 border-purple-500/30',
    portas: [
      { numero: 15, nome: 'Vazio', tipoEvento: 'Fim Interno', camposFrequentes: ['Campo de Dissolução'], oQueE: 'O sentido caiu. Não há desejo, projeto ou narrativa disponível.', riscoClinico: 'Tentar preencher. Oferecer sentido.', criterioIntegracao: 'O vazio é habitado sem desespero.' },
      { numero: 16, nome: 'Luto', tipoEvento: 'Perda Reconhecida', camposFrequentes: ['Campo de Dissolução', 'Campo de Retenção'], oQueE: 'Algo foi perdido e a psique sabe disso.', riscoClinico: 'Acelerar elaboração. Converter luto em aprendizado.', criterioIntegracao: 'A dor perde urgência. A memória deixa de sangrar.' },
      { numero: 17, nome: 'Perda', tipoEvento: 'Esvaziamento de Referência', camposFrequentes: ['Campo de Dissolução'], oQueE: 'Não é só perder alguém ou algo. É perder o que organizava a vida.', riscoClinico: 'Tratar como apego excessivo.', criterioIntegracao: 'Novas referências começam a se formar lentamente.' },
      { numero: 18, nome: 'Abandono', tipoEvento: 'Ruptura Vincular', camposFrequentes: ['Campo de Dissolução', 'Campo de Defesa'], oQueE: 'A experiência de ter sido deixada sem sustentação.', riscoClinico: 'Racionalizar o abandono. Culpar a vítima.', criterioIntegracao: 'Diferenciar abandono real de medo de abandono.' },
      { numero: 19, nome: 'Desilusão', tipoEvento: 'Queda de Ideal', camposFrequentes: ['Campo de Dissolução'], oQueE: 'Um ideal caiu. A imagem que sustentava o sentido não se sustenta mais.', riscoClinico: 'Converter desilusão em cinismo.', criterioIntegracao: 'O mundo perde encanto, mas ganha verdade.' },
      { numero: 20, nome: 'Desencanto', tipoEvento: 'Perda de Magia', camposFrequentes: ['Campo de Dissolução'], oQueE: 'Nada emociona. Nada convoca. A vida parece opaca.', riscoClinico: 'Forçar entusiasmo. Patologizar a apatia.', criterioIntegracao: 'A sensibilidade retorna em micro-tons.' },
      { numero: 21, nome: 'Morte Simbólica', tipoEvento: 'Encerramento Estrutural', camposFrequentes: ['Campo de Dissolução'], oQueE: 'Uma identidade, papel ou versão de si morreu.', riscoClinico: 'Falar em renascimento cedo demais.', criterioIntegracao: 'A morte é reconhecida sem negação.' },
    ]
  },
  {
    id: 'emergencia',
    nome: 'Emergência',
    nomeCompleto: 'Portas de Emergência',
    definicao: 'Eventos de surgimento frágil, impulso inicial e vitalidade ainda instável. Sinais mínimos de vida voltando após a dissolução.',
    icon: <Sparkles className="w-5 h-5" />,
    cor: 'text-emerald-400',
    corBg: 'bg-emerald-500/10 border-emerald-500/30',
    portas: [
      { numero: 22, nome: 'Desejo', tipoEvento: 'Reativação Pulsional', camposFrequentes: ['Campo de Emergência'], oQueE: 'Um "quero" reaparece — ainda tímido.', riscoClinico: 'Transformar desejo em meta. Cobrar clareza.', criterioIntegracao: 'O desejo pode existir sem precisar virar ação.' },
      { numero: 23, nome: 'Voz', tipoEvento: 'Retorno Expressivo', camposFrequentes: ['Campo de Emergência', 'Campo de Defesa'], oQueE: 'A voz quer sair, mas ainda hesita.', riscoClinico: 'Forçar discurso completo.', criterioIntegracao: 'Falar sem precisar de validação.' },
      { numero: 24, nome: 'Criação', tipoEvento: 'Geração Simbólica', camposFrequentes: ['Campo de Emergência'], oQueE: 'A psique começa a criar sem finalidade.', riscoClinico: 'Transformar criação em performance.', criterioIntegracao: 'Criar sem precisar mostrar.' },
      { numero: 25, nome: 'Chamado', tipoEvento: 'Convocação Interna', camposFrequentes: ['Campo de Emergência'], oQueE: 'Algo chama — mas ainda não explica.', riscoClinico: 'Exigir clareza de propósito.', criterioIntegracao: 'Seguir o chamado sem mapa.' },
      { numero: 26, nome: 'Expressão', tipoEvento: 'Exteriorização', camposFrequentes: ['Campo de Emergência', 'Campo de Defesa'], oQueE: 'O interno começa a sair. Há medo de ser visto.', riscoClinico: 'Estimular exposição precoce.', criterioIntegracao: 'Expressar sem depender de resposta.' },
      { numero: 27, nome: 'Movimento', tipoEvento: 'Mobilização', camposFrequentes: ['Campo de Emergência'], oQueE: 'O corpo quer ir. Mesmo sem direção.', riscoClinico: 'Acelerar. Cobrar constância.', criterioIntegracao: 'O corpo sabe quando parar.' },
      { numero: 28, nome: 'Coragem Emergente', tipoEvento: 'Risco Consciente Inicial', camposFrequentes: ['Campo de Emergência', 'Campo de Defesa'], oQueE: 'A pessoa age apesar do medo, não sem ele.', riscoClinico: 'Celebrar heroísmo. Exigir repetição.', criterioIntegracao: 'A coragem aparece quando necessária.' },
    ]
  },
  {
    id: 'reintegracao',
    nome: 'Reintegração',
    nomeCompleto: 'Portas de Reintegração',
    definicao: 'Estabilizações possíveis após a travessia. A psique não está mais em colapso, nem em nascimento. Está aprendendo a habitar o que restou.',
    icon: <Heart className="w-5 h-5" />,
    cor: 'text-rose-400',
    corBg: 'bg-rose-500/10 border-rose-500/30',
    portas: [
      { numero: 29, nome: 'Integração', tipoEvento: 'Síntese Sustentável', camposFrequentes: ['Campo de Reintegração', 'Campo de Limiar'], oQueE: 'Partes antes dissociadas agora coexistem.', riscoClinico: 'Buscar coerência narrativa excessiva.', criterioIntegracao: 'A contradição pode existir sem conflito interno.' },
      { numero: 30, nome: 'Aliança', tipoEvento: 'Reorganização Relacional', camposFrequentes: ['Campo de Reintegração'], oQueE: 'A pessoa volta a se vincular sem submissão.', riscoClinico: 'Romantizar reconexão. Ignorar limites novos.', criterioIntegracao: 'Vínculo com fronteira clara.' },
      { numero: 31, nome: 'Retorno', tipoEvento: 'Reentrada no Mundo', camposFrequentes: ['Campo de Reintegração'], oQueE: 'A pessoa retorna à vida cotidiana diferente, mas sem espetáculo.', riscoClinico: 'Esperar transformação visível.', criterioIntegracao: 'A vida segue — com mais verdade, não mais brilho.' },
    ]
  },
];

interface PortaFamiliasBlockProps {
  block: ContentBlock;
  onSave?: (data: Record<string, unknown>) => void;
}

export function PortaFamiliasBlock({ block }: PortaFamiliasBlockProps) {
  const content = block.content as PortaFamiliasContent;
  const { showRisks = true, showIntegration = true, compactMode = false, highlightedFamily } = content;
  
  const [expandedFamilies, setExpandedFamilies] = useState<Record<string, boolean>>({});
  const [selectedPorta, setSelectedPorta] = useState<Porta | null>(null);
  const [selectedFamilia, setSelectedFamilia] = useState<FamiliaData | null>(null);

  const toggleFamily = (familyId: string) => {
    setExpandedFamilies(prev => ({ ...prev, [familyId]: !prev[familyId] }));
  };

  const openPortaDetail = (porta: Porta, familia: FamiliaData) => {
    setSelectedPorta(porta);
    setSelectedFamilia(familia);
  };

  const closeDetail = () => {
    setSelectedPorta(null);
    setSelectedFamilia(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-heading text-gold">Famílias das Portas</h2>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          As 39 Portas do Labirinto organizam-se em cinco famílias distintas, cada uma nomeando um tipo específico de evento psíquico.
        </p>
      </div>

      {/* Families Grid */}
      <div className="grid gap-4">
        {FAMILIAS_DATA.map((familia) => {
          const isExpanded = expandedFamilies[familia.id];
          const isHighlighted = highlightedFamily === familia.id;
          
          return (
            <Collapsible 
              key={familia.id} 
              open={isExpanded}
              onOpenChange={() => toggleFamily(familia.id)}
            >
              <Card className={cn(
                "border transition-all duration-300",
                familia.corBg,
                isHighlighted && "ring-2 ring-gold"
              )}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-white/5 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg bg-background/50", familia.cor)}>
                          {familia.icon}
                        </div>
                        <div>
                          <CardTitle className={cn("text-lg", familia.cor)}>
                            {familia.nomeCompleto}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {familia.portas.length} portas • Portas {familia.portas[0].numero}-{familia.portas[familia.portas.length - 1].numero}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={familia.cor}>
                          Família {FAMILIAS_DATA.indexOf(familia) + 1}
                        </Badge>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    {/* Family Definition */}
                    <div className="p-3 rounded-lg bg-background/30 border border-white/10">
                      <p className="text-sm text-foreground/80 italic">
                        {familia.definicao}
                      </p>
                    </div>

                    {/* Portas List */}
                    <div className={cn(
                      "grid gap-2",
                      compactMode ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1"
                    )}>
                      {familia.portas.map((porta) => (
                        <button
                          key={porta.numero}
                          onClick={() => openPortaDetail(porta, familia)}
                          className={cn(
                            "p-3 rounded-lg text-left transition-all hover:scale-[1.02]",
                            "bg-background/20 border border-white/10 hover:border-gold/30",
                            "hover:bg-background/40"
                          )}
                        >
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className={cn("shrink-0", familia.cor)}>
                              {porta.numero}
                            </Badge>
                            <div className="min-w-0">
                              <p className="font-medium text-foreground truncate">
                                {porta.nome}
                              </p>
                              {!compactMode && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {porta.tipoEvento}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}
      </div>

      {/* Porta Detail Modal */}
      {selectedPorta && selectedFamilia && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeDetail}
        >
          <Card 
            className={cn(
              "max-w-lg w-full max-h-[80vh] overflow-y-auto",
              selectedFamilia.corBg
            )}
            onClick={e => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg bg-background/50", selectedFamilia.cor)}>
                  {selectedFamilia.icon}
                </div>
                <div>
                  <Badge variant="outline" className={selectedFamilia.cor}>
                    Porta {selectedPorta.numero}
                  </Badge>
                  <CardTitle className="text-xl mt-1">
                    {selectedPorta.nome}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {selectedPorta.tipoEvento}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Campos Frequentes */}
              <div className="flex flex-wrap gap-2">
                {selectedPorta.camposFrequentes.map((campo, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {campo}
                  </Badge>
                ))}
              </div>

              {/* O que é */}
              <div className="p-3 rounded-lg bg-background/30 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-blue-400">O que este evento é</span>
                </div>
                <p className="text-sm text-foreground/90">
                  {selectedPorta.oQueE}
                </p>
              </div>

              {/* Risco Clínico */}
              {showRisks && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-sm font-medium text-red-400">Risco clínico comum</span>
                  </div>
                  <p className="text-sm text-foreground/90">
                    {selectedPorta.riscoClinico}
                  </p>
                </div>
              )}

              {/* Critério de Integração */}
              {showIntegration && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-400">Critério de integração</span>
                  </div>
                  <p className="text-sm text-foreground/90">
                    {selectedPorta.criterioIntegracao}
                  </p>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={closeDetail}
                className="w-full py-2 rounded-lg bg-background/50 hover:bg-background/70 transition-colors text-sm text-muted-foreground"
              >
                Fechar
              </button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
