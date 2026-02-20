import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { ClubeCiclo } from '@/hooks/useClubeLivro';

interface UsoClinicalBlockProps {
  ciclo: ClubeCiclo;
}

export function UsoClinicalBlock({ ciclo }: UsoClinicalBlockProps) {
  return (
    <div className="space-y-6">
      {/* Aviso Ético */}
      <Card className="bg-amber-500/10 border-amber-500/30">
        <CardContent className="py-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-500 mb-1">
              Orientação para uso clínico supervisionado
            </p>
            <p className="text-xs text-muted-foreground">
              Este livro não interpreta a cliente. Ele afina a escuta da facilitadora.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quando usar */}
      {ciclo.orientacao_clinica_uso && (
        <Card className="bg-green-500/5 border-green-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm uppercase tracking-widest text-green-500 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Quando usar este livro com clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm">
              {ciclo.orientacao_clinica_uso}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quando evitar */}
      {ciclo.orientacao_clinica_evitar && (
        <Card className="bg-red-500/5 border-red-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm uppercase tracking-widest text-red-500 flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Quando evitar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm">
              {ciclo.orientacao_clinica_evitar}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Riscos de projeção */}
      {ciclo.orientacao_clinica_riscos && (
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm uppercase tracking-widest text-amber-500 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Riscos de projeção da terapeuta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm">
              {ciclo.orientacao_clinica_riscos}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Indicado / Contraindicado */}
      <div className="grid gap-4 md:grid-cols-2">
        {ciclo.orientacao_clinica_indicado && (
          <Card className="bg-card/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">
                Cliente indicado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {ciclo.orientacao_clinica_indicado}
              </p>
            </CardContent>
          </Card>
        )}
        {ciclo.orientacao_clinica_contraindicado && (
          <Card className="bg-card/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">
                Cliente contraindicado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {ciclo.orientacao_clinica_contraindicado}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
