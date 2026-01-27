import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Big5InterpretacaoCardProps {
  nome: string;
  nomeIngles: string;
  cor: string;
  media: number;
  interpretacaoAlto: string | null;
  interpretacaoBaixo: string | null;
  pontoAtencaoAlto: string | null;
  pontoAtencaoBaixo: string | null;
}

export function Big5InterpretacaoCard({
  nome,
  nomeIngles,
  cor,
  media,
  interpretacaoAlto,
  interpretacaoBaixo,
  pontoAtencaoAlto,
  pontoAtencaoBaixo,
}: Big5InterpretacaoCardProps) {
  // Threshold: ≥3.5 is high, <3.5 is low
  const isAlto = media >= 3.5;
  const interpretacao = isAlto ? interpretacaoAlto : interpretacaoBaixo;
  const pontoAtencao = isAlto ? pontoAtencaoAlto : pontoAtencaoBaixo;
  const nivel = isAlto ? 'alto' : 'baixo';

  if (!interpretacao) return null;

  return (
    <Card className="border-l-4" style={{ borderLeftColor: cor }}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full shrink-0"
              style={{ backgroundColor: cor }}
            />
            <CardTitle className="text-base font-semibold">
              {nome}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className="text-xs"
              style={{ borderColor: cor, color: cor }}
            >
              {nomeIngles}
            </Badge>
            <Badge 
              variant={isAlto ? "default" : "secondary"}
              className="text-xs"
            >
              {nivel} ({media.toFixed(1)})
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Interpretação */}
        <div className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
          {interpretacao}
        </div>

        {/* Ponto de atenção */}
        {pontoAtencao && (
          <div className="flex gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-amber-600 dark:text-amber-400">
                Ponto de atenção:{' '}
              </span>
              {pontoAtencao}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
