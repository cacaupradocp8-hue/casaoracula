import { useCidadelaEstado } from '@/hooks/useCidadelaEstado';
import { useSimCases } from '@/hooks/useSimuladorInterativo';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Compass, Users, User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onStartCase: (caseId: string) => void;
}

export function SuaPraticaHoje({ onStartCase }: Props) {
  const { estado } = useCidadelaEstado();
  const { data: allCases = [] } = useSimCases();

  const distrito = estado?.distrito_atual;
  if (!distrito) return null;

  // Find cases matching the current distrito
  const casosDistrito = allCases.filter(c => 
    c.distrito?.toLowerCase() === distrito.toLowerCase()
  );

  // If no distrito-specific cases, show general ones
  const casoIndividual = casosDistrito.find(c => c.tipo === 'individual') 
    || allCases.find(c => c.tipo === 'individual');
  const casoGrupo = casosDistrito.find(c => c.tipo === 'grupo') 
    || allCases.find(c => c.tipo === 'grupo');

  const sugestoes = [casoIndividual, casoGrupo].filter(Boolean);
  if (sugestoes.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="border-primary/15 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <p className="text-xs font-medium text-primary/80 uppercase tracking-wider">
              Sua prática hoje
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Baseado no seu distrito atual: <span className="text-foreground font-medium">{distrito}</span>
          </p>
          <div className="grid gap-2">
            {sugestoes.map((caso) => {
              if (!caso) return null;
              const isGrupo = caso.tipo === 'grupo';
              const Icon = isGrupo ? Users : User;
              return (
                <button
                  key={caso.id}
                  onClick={() => onStartCase(caso.id)}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border/20 bg-card/30 hover:bg-primary/5 hover:border-primary/30 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-foreground/60" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground/80 truncate">{caso.titulo}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-border/15">
                        {isGrupo ? 'Grupo' : 'Individual'}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground/50">Nível {caso.nivel}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
