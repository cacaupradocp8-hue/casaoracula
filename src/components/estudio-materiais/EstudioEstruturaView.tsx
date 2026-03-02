import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, AlertTriangle, BookOpen, MessageCircle } from 'lucide-react';

interface Props {
  estrutura: any;
  onUpdate: (updated: any) => void;
}

export default function EstudioEstruturaView({ estrutura, onUpdate }: Props) {
  if (!estrutura) return null;

  return (
    <div className="space-y-6 mt-4">
      {/* Title & Essence */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">{estrutura.titulo_pedagogico}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Essência 80/20
            </h4>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{estrutura.essencia_8020}</p>
          </div>

          {estrutura.mapa_simbolico && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Mapa Simbólico</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{estrutura.mapa_simbolico}</p>
            </div>
          )}

          {estrutura.tensoes_centrais?.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Tensões Centrais</h4>
              <div className="flex flex-wrap gap-2">
                {estrutura.tensoes_centrais.map((t: string, i: number) => (
                  <Badge key={i} variant="secondary" className="text-xs">{t}</Badge>
                ))}
              </div>
            </div>
          )}

          {estrutura.arquetipos_envolvidos?.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Campos Arquetípicos</h4>
              <div className="flex flex-wrap gap-2">
                {estrutura.arquetipos_envolvidos.map((a: string, i: number) => (
                  <Badge key={i} variant="outline" className="text-xs">{a}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Encounters */}
      {estrutura.encontros?.map((enc: any, i: number) => (
        <Card key={i} className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Encontro {enc.numero}: {enc.titulo}
              </CardTitle>
              <Badge variant="outline" className="text-xs">{enc.fase}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{enc.tema_central}</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {enc.abertura_ritual && (
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs font-semibold text-foreground mb-1">🜂 Abertura Ritual</p>
                <p className="text-xs text-muted-foreground">{enc.abertura_ritual}</p>
              </div>
            )}

            <div>
              <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" /> Perguntas Guiadas
              </p>
              <ul className="space-y-1">
                {enc.perguntas_guiadas?.map((p: string, j: number) => (
                  <li key={j} className="text-xs text-muted-foreground pl-3 border-l-2 border-primary/30">{p}</li>
                ))}
              </ul>
            </div>

            {enc.aplicacao_profissional && (
              <div>
                <p className="text-xs font-semibold text-foreground mb-1">Aplicação Profissional</p>
                <p className="text-xs text-muted-foreground">{enc.aplicacao_profissional}</p>
              </div>
            )}

            {enc.alerta_clinico && (
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3">
                <p className="text-xs font-semibold text-destructive flex items-center gap-1 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Alerta Clínico
                </p>
                <p className="text-xs text-muted-foreground">{enc.alerta_clinico}</p>
              </div>
            )}

            {enc.encerramento_ritual && (
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs font-semibold text-foreground mb-1">🜃 Encerramento Ritual</p>
                <p className="text-xs text-muted-foreground">{enc.encerramento_ritual}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Warnings & Reflections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {estrutura.usos_inadequados?.length > 0 && (
          <Card className="border-destructive/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-4 h-4" /> Usos Inadequados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {estrutura.usos_inadequados.map((u: string, i: number) => (
                  <li key={i} className="text-xs text-muted-foreground">• {u}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" /> Jardins de Reflexão
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {estrutura.convites_jardim_psique?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-foreground mb-1">Jardim da Psique</p>
                {estrutura.convites_jardim_psique.map((c: string, i: number) => (
                  <p key={i} className="text-xs text-muted-foreground italic">"{c}"</p>
                ))}
              </div>
            )}
            {estrutura.convites_jardim_oficio?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-foreground mb-1">Jardim do Ofício</p>
                {estrutura.convites_jardim_oficio.map((c: string, i: number) => (
                  <p key={i} className="text-xs text-muted-foreground italic">"{c}"</p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
