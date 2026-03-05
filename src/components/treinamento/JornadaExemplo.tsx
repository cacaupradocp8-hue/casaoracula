import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowDown } from 'lucide-react';

const ETAPAS = [
  {
    sessao: 1,
    distrito: 'Portão da Chegada',
    ferramenta: 'Cartografia Psíquica',
    descricao: 'Primeiro mapeamento da psique. A terapeuta aplica a Cartografia para identificar as Torres, Portas e o campo dominante da cliente.',
    insight: 'Torre predominante: Controle. Porta mais ativa: Porta do Abandono.',
  },
  {
    sessao: 2,
    distrito: 'Torres',
    ferramenta: 'Torre Viva',
    descricao: 'Exploração da Torre de Controle identificada. Compreensão dos mecanismos de defesa e seu papel protetor.',
    insight: 'A cliente percebe que o controle surgiu como resposta a um ambiente instável na infância.',
  },
  {
    sessao: 3,
    distrito: 'Portas',
    ferramenta: 'Labirinto das 39 Portas',
    descricao: 'Navegação pela Porta do Abandono. Identificação do padrão de antecipação da perda em relacionamentos.',
    insight: 'Padrão recorrente: sabotar relações antes de ser abandonada.',
  },
  {
    sessao: 4,
    distrito: 'Casa dos Sonhos',
    ferramenta: 'Decodificação Onírica',
    descricao: 'A cliente traz um sonho com casa vazia. Trabalho de escuta simbólica revela o medo de solidão interior.',
    insight: 'O sonho aponta para um espaço interno que pede habitação, não preenchimento externo.',
  },
  {
    sessao: 5,
    distrito: 'Jardim dos Arquétipos',
    ferramenta: 'Atlas de Arquétipos',
    descricao: 'Identificação do arquétipo predominante (A Guardiã) e em sombra (A Sobrevivente).',
    insight: 'Movimento de integração: transformar proteção rígida em presença sustentada.',
  },
  {
    sessao: 6,
    distrito: 'Forja',
    ferramenta: 'Ritual Simbólico',
    descricao: 'Criação de um ritual de soltura. A cliente escreve uma carta para a parte de si que ainda sobrevive.',
    insight: 'Gesto simbólico: entregar a carta ao fogo como ato de passagem.',
  },
  {
    sessao: 7,
    distrito: 'Praça da Integração',
    ferramenta: 'Mapa de Transformação',
    descricao: 'Revisão de toda a jornada. Consolidação dos aprendizados e reconhecimento do caminho percorrido.',
    insight: 'A cliente reconhece que a solidão interior pode ser habitada — não precisa ser evitada.',
  },
];

export function JornadaExemplo() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-[#F5F1E8]/50">
        Exemplo fictício de jornada terapêutica completa usando o Método Orácula — 7 sessões através dos distritos da CidaDELA Interior.
      </p>

      <div className="relative space-y-2">
        {/* Vertical line */}
        <div className="absolute left-6 top-4 bottom-4 w-px bg-gradient-to-b from-[#C9A24A]/40 via-[#C9A24A]/20 to-[#C9A24A]/40" />

        {ETAPAS.map((etapa, i) => (
          <div key={i} className="relative pl-14">
            {/* Node */}
            <div className="absolute left-4 top-4 w-5 h-5 rounded-full border-2 border-[#C9A24A]/50 bg-[#0B1B2B] flex items-center justify-center">
              <span className="text-[10px] text-[#C9A24A] font-bold">{etapa.sessao}</span>
            </div>

            <Card className="bg-[#0F2438] border-[#C9A24A]/10">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-[#C9A24A]/15 text-[#C9A24A] text-xs">Sessão {etapa.sessao}</Badge>
                  <Badge variant="outline" className="text-xs text-[#F5F1E8]/50 border-[#F5F1E8]/10">{etapa.distrito}</Badge>
                  <Badge variant="outline" className="text-xs text-[#F5F1E8]/50 border-[#F5F1E8]/10">{etapa.ferramenta}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <p className="text-sm text-[#F5F1E8]/70">{etapa.descricao}</p>
                <div className="p-2 rounded bg-[#C9A24A]/5 border border-[#C9A24A]/10">
                  <p className="text-xs text-[#C9A24A]/80">
                    <strong>Insight:</strong> {etapa.insight}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <p className="text-xs text-[#F5F1E8]/30 text-center mt-6">
        Esta jornada é ilustrativa. Cada processo real é único e segue o ritmo da cliente.
      </p>
    </div>
  );
}
