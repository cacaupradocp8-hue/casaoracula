import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, ChevronRight, Loader2 } from 'lucide-react';
import { useTherapeuticGroups, type TherapeuticGroup } from '@/hooks/useTherapeuticGroups';

interface Props {
  selectedGroupId: string | null;
  onSelectGroup: (id: string) => void;
}

export function CabineGrupoLeftPanel({ selectedGroupId, onSelectGroup }: Props) {
  const { fetchGroups, loading } = useTherapeuticGroups();
  const [groups, setGroups] = useState<TherapeuticGroup[]>([]);

  useEffect(() => {
    fetchGroups('active').then(setGroups);
  }, []);

  if (loading) {
    return (
      <Card className="border-border/15 bg-card/30">
        <CardContent className="p-5 flex justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground/40" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <Card className="border-border/15 bg-card/30">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 font-semibold">
              Grupos Terapêuticos
            </p>
            <Badge variant="outline" className="text-[9px] px-1.5 text-muted-foreground/40">
              {groups.length}
            </Badge>
          </div>

          {groups.length === 0 ? (
            <div className="text-center py-4">
              <Users className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground/40 italic">Nenhum grupo ativo</p>
            </div>
          ) : (
            <div className="space-y-1.5 max-h-[50vh] overflow-y-auto">
              {groups.map(g => (
                <button
                  key={g.id}
                  onClick={() => onSelectGroup(g.id)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all duration-200 ${
                    selectedGroupId === g.id
                      ? 'border-primary/30 bg-primary/10'
                      : 'border-border/10 bg-background/20 hover:bg-background/30'
                  }`}
                >
                  <p className="text-xs font-medium text-foreground/90 truncate">{g.nome}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] text-muted-foreground/40">
                      {g.participants_count || 0} participantes
                    </span>
                    {selectedGroupId === g.id && (
                      <ChevronRight className="w-3 h-3 text-primary/60 ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
