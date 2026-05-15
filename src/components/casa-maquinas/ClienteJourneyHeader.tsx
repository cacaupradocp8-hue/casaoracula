import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Zap, Calendar, History, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ClienteJourneyHeader({ cliente, clienteId }: { cliente: any, clienteId: string }) {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="md:col-span-2 border-border/30 bg-card/50">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-display">{cliente.nome}</CardTitle>
            <Badge variant="outline" className="text-[10px] bg-primary/10 border-primary/20">
              {cliente.status || 'Ativa'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 italic">{cliente.objetivo_terapeutico || 'Sem objetivo definido'}</p>
          <div className="flex gap-2 mt-4">
            <Button 
              size="sm" 
              className="gap-2"
              onClick={() => navigate(`/casa-das-maquinas/cabine?clienteId=${clienteId}`)}
            >
              <Zap className="w-4 h-4" /> Nova Sessão
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => navigate(`/casa-das-maquinas/gestos?clienteId=${clienteId}`)}
            >
              <Plus className="w-4 h-4 mr-2" /> Registrar Gesto
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-border/30 bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display uppercase tracking-wider text-muted-foreground">Progresso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            <span>Última sessão: Há 2 dias</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-primary" />
            <span>Próximo gesto: Pendente</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
