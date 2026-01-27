// ============================================
// CLUBE DO LIVRO - Conteúdo por Semana (Fase)
// ============================================

import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, AlertTriangle, Ban, ArrowRight, Sparkles, 
  BookMarked, MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ClubeFase } from '@/hooks/useClubeLivro';

interface FaseWeekContentProps {
  fase: ClubeFase;
  faseIndex: number;
}

export function FaseWeekContent({ fase, faseIndex }: FaseWeekContentProps) {
  const navigate = useNavigate();
  const weekNumber = fase.numero_semana ?? faseIndex + 1;

  return (
    <div className="space-y-6">
      {/* Week Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 mb-2">
          <span className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center text-sm font-display">
            {weekNumber}
          </span>
          <span className="text-xs uppercase tracking-widest text-gold">
            Semana {weekNumber}
          </span>
        </div>
        <h2 className="text-xl font-display text-foreground">
          {fase.titulo}
        </h2>
        {fase.descricao && (
          <p className="text-muted-foreground text-sm mt-1">
            {fase.descricao}
          </p>
        )}
      </div>

      {/* Leitura Orientada */}
      {fase.leitura_orientada && (
        <Card className="bg-card/50 border-gold/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm uppercase tracking-widest text-gold flex items-center gap-2">
              <BookMarked className="w-4 h-4" />
              Leitura Orientada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed whitespace-pre-line">
              {fase.leitura_orientada}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Observação Clínica */}
      {fase.observacao_clinica && (
        <Card className="bg-muted/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Observação Clínica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm">
              {fase.observacao_clinica}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Alerta Clínico */}
      {fase.alerta_clinico && (
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="py-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-500 mb-1">
                Alerta Clínico
              </p>
              <p className="text-sm text-foreground/90 whitespace-pre-line">
                {fase.alerta_clinico}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Uso Inadequado */}
      {fase.lista_uso_inadequado && fase.lista_uso_inadequado.length > 0 && (
        <Card className="bg-red-500/5 border-red-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm uppercase tracking-widest text-red-500 flex items-center gap-2">
              <Ban className="w-4 h-4" />
              Uso Inadequado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {fase.lista_uso_inadequado.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Ban className="w-3 h-3 text-red-400 shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Texto de Fechamento */}
      {fase.texto_fechamento && (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground italic text-center whitespace-pre-line">
              {fase.texto_fechamento}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Ponte com Sala */}
      {fase.ponte_sala_texto && fase.ponte_sala_id && (
        <Card className="bg-gold/5 border-gold/30">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gold mb-2">
                  Ponte com outra Sala
                </p>
                <p className="text-sm text-muted-foreground whitespace-pre-line mb-4">
                  {fase.ponte_sala_texto}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gold/30 text-gold hover:bg-gold/10"
                  onClick={() => navigate(`/sala/${fase.ponte_sala_id}`)}
                >
                  <ArrowRight className="w-3 h-3 mr-2" />
                  Ir para a Sala
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
