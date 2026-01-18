import { useState, useEffect } from 'react';
import { Sparkles, Shuffle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useSessionRoom } from '@/hooks/useSessionRoom';
import { ORACLE_TEMPLATES, type OracleMode, type SessionOracleDraw } from '@/types/session-room';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface OracleTabProps {
  caseId: string;
  clientId: string;
}

const MODE_LABELS: Record<OracleMode, string> = {
  symbolic_card: 'Carta Simbólica',
  tarot: 'Tarô',
  numerology: 'Numerologia',
  radiesthesia: 'Radiestesia',
};

export function OracleTab({ caseId, clientId }: OracleTabProps) {
  const { fetchOracleDraws, createOracleDraw, updateOracleNotes } = useSessionRoom();
  
  const [draws, setDraws] = useState<SessionOracleDraw[]>([]);
  const [mode, setMode] = useState<OracleMode>('symbolic_card');
  const [currentDraw, setCurrentDraw] = useState<{
    narrative: string;
    archetype: string;
    movement: string;
  } | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDraws();
  }, [caseId]);

  const loadDraws = async () => {
    const data = await fetchOracleDraws(caseId);
    setDraws(data);
  };

  const handleDraw = () => {
    const templates = ORACLE_TEMPLATES[mode];
    const randomNarrative = templates.narratives[Math.floor(Math.random() * templates.narratives.length)];
    const randomArchetype = templates.archetypes[Math.floor(Math.random() * templates.archetypes.length)];
    const randomMovement = templates.movements[Math.floor(Math.random() * templates.movements.length)];
    
    setCurrentDraw({
      narrative: randomNarrative,
      archetype: randomArchetype,
      movement: randomMovement,
    });
    setNotes('');
  };

  const handleSave = async () => {
    if (!currentDraw) return;
    
    setLoading(true);
    const saved = await createOracleDraw(caseId, clientId, mode, {
      axis_narrative: currentDraw.narrative,
      axis_archetype: currentDraw.archetype,
      axis_movement: currentDraw.movement,
      notes: notes || null,
    });
    
    if (saved) {
      setDraws([saved, ...draws]);
      setCurrentDraw(null);
      setNotes('');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Draw Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold" />
            Oráculo da Sessão
          </CardTitle>
          <CardDescription>
            Tiragem simbólica para abrir o campo. Não é previsão — é espelho narrativo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Modo</Label>
              <Select value={mode} onValueChange={(v) => setMode(v as OracleMode)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(MODE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleDraw} className="self-end gap-2">
              <Shuffle className="w-4 h-4" />
              Tirar
            </Button>
          </div>

          {currentDraw && (
            <div className="space-y-4 pt-4 border-t">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Narrativa Atual</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{currentDraw.narrative}</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Arquétipo Ativo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{currentDraw.archetype}</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Movimento Pedido</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{currentDraw.movement}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <Label>Notas (opcional)</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anotações pessoais sobre esta tiragem..."
                  rows={3}
                />
              </div>

              <Button onClick={handleSave} disabled={loading} className="w-full">
                Salvar Tiragem
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Previous Draws */}
      {draws.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tiragens Anteriores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {draws.map((draw) => (
              <div key={draw.id} className="p-4 bg-muted/30 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{MODE_LABELS[draw.mode]}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(draw.created_at), "d MMM yyyy 'às' HH:mm", { locale: ptBR })}
                  </span>
                </div>
                <div className="grid gap-2 text-sm">
                  <div><strong>Narrativa:</strong> {draw.axis_narrative}</div>
                  <div><strong>Arquétipo:</strong> {draw.axis_archetype}</div>
                  <div><strong>Movimento:</strong> {draw.axis_movement}</div>
                  {draw.notes && <div className="text-muted-foreground italic">{draw.notes}</div>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
