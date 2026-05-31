import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, Sparkles, BookOpen, Clock, 
  ArrowRight, Search, LayoutGrid, List as ListIcon, Star,
  Loader2, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Input } from "@/components/ui/input";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface RotaAgrupada {
  id: string;
  title: string;
  baseWork: string;
  description: string;
  stations: number;
  status: 'Ativa' | 'Rascunho';
  lastUpdate: string;
  icon: any;
  color: string;
}

export default function AdminRotasCasa() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [newRota, setNewRota] = useState({
    title: '',
    baseWork: '',
    description: ''
  });

  const { data: estacoes, isLoading, refetch } = useQuery({
    queryKey: ['admin-rotas-casa-estacoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_estacoes')
        .select('*')
        .order('numero', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const rotas = useMemo(() => {
    if (!estacoes) return [];

    // Agrupar estações por Obra-base (livro_titulo)
    const groups: Record<string, any[]> = {};
    estacoes.forEach(est => {
      const work = est.livro_titulo || 'Sem Obra Definida';
      if (!groups[work]) groups[work] = [];
      groups[work].push(est);
    });

    return Object.entries(groups).map(([work, ests]) => {
      const firstEst = ests[0];
      const isRotaDosLobos = work.toLowerCase().includes('mulheres que correm com os lobos');
      
      // Tentar extrair o nome da Rota do título da primeira estação 
      // ou usar um padrão baseado na obra
      let title = isRotaDosLobos ? 'Rota dos Lobos' : `Rota: ${work}`;
      
      return {
        id: encodeURIComponent(work),
        title: title,
        baseWork: work,
        description: firstEst.descricao || `Jornada baseada na obra "${work}".`,
        status: ests.some(e => e.publicada) ? 'Ativa' : 'Rascunho',
        stations: ests.length,
        lastUpdate: firstEst.updated_at ? new Date(firstEst.updated_at).toLocaleDateString('pt-BR') : '-',
        icon: isRotaDosLobos ? Sparkles : BookOpen,
        color: isRotaDosLobos ? 'gold' : 'emerald'
      } as RotaAgrupada;
    });
  }, [estacoes]);

  const filteredRotas = useMemo(() => {
    return rotas.filter(r => 
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.baseWork.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rotas, searchTerm]);

  const handleCreateRota = async () => {
    if (!newRota.title || !newRota.baseWork) {
      toast.error("Título e Obra-base são obrigatórios");
      return;
    }

    setIsSubmitting(true);
    try {
      // Criar a primeira estação da nova rota
      const { error } = await supabase
        .from('clube_estacoes')
        .insert({
          numero: 1,
          titulo: `Estação I - ${newRota.title}`,
          subtitulo: '', // Campo obrigatório no schema
          livro_titulo: newRota.baseWork,
          descricao: newRota.description,
          ativa: true,
          publicada: false, // Começa como rascunho
          ordem: 1
        });

      if (error) throw error;

      toast.success("Nova Rota criada com sucesso!");
      setIsCreateDialogOpen(false);
      setNewRota({ title: '', baseWork: '', description: '' });
      refetch();
    } catch (error: any) {
      console.error("Erro ao criar rota:", error);
      toast.error("Erro ao criar nova rota: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManageRota = (rota: RotaAgrupada) => {
    if (rota.baseWork === 'Mulheres que Correm com os Lobos') {
      navigate('/admin/clube/rota-dos-lobos');
    } else {
      // Para outras rotas, filtramos as estações pela obra
      navigate(`/admin/clube/ciclos?obra=${encodeURIComponent(rota.baseWork)}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Breadcrumb & Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-medium">
          <span className="hover:text-gold cursor-pointer" onClick={() => navigate('/admin')}>Central</span>
          <span>/</span>
          <span className="text-gold">Rotas da Casa</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-serif text-foreground">Rotas da Casa</h1>
            <p className="text-muted-foreground max-w-2xl font-light">
              Gerencie as jornadas iniciáticas e arquiteturas simbólicas do ecossistema Oracula.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-muted/50 rounded-lg p-1 border border-primary/5">
              <Button 
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setViewMode('list')}
              >
                <ListIcon className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              className="bg-gold hover:bg-gold/80 text-black font-semibold gap-2"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Criar Nova Rota
            </Button>
          </div>
        </div>
      </div>

      {/* Filters & Stats */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            className="pl-10 bg-card/40 border-primary/10" 
            placeholder="Buscar rotas ou obras..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gold/5 border border-gold/10">
            <Star className="w-4 h-4 text-gold fill-gold" />
            <span className="font-medium text-gold">{rotas.filter(r => r.status === 'Ativa').length} Rota(s) Ativa(s)</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 border border-primary/5">
            <Clock className="w-4 h-4" />
            <span>{rotas.length} Total</span>
          </div>
        </div>
      </div>

      {filteredRotas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card/20 rounded-2xl border border-dashed border-primary/10">
          <AlertCircle className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-serif text-muted-foreground">Nenhuma rota encontrada</h3>
          <p className="text-sm text-muted-foreground/60 mt-2">Tente ajustar sua busca ou crie uma nova rota.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredRotas.map((rota) => (
            <Card 
              key={rota.id} 
              className={cn(
                "group relative bg-card/40 border-primary/10 backdrop-blur-xl hover:border-gold/30 transition-all duration-500 overflow-hidden",
                rota.status === 'Ativa' ? "ring-1 ring-gold/20" : "opacity-80"
              )}
            >
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className={cn(
                    "p-4 rounded-2xl transition-transform duration-500 group-hover:scale-110",
                    rota.color === 'gold' ? "bg-gold/10 text-gold" : "bg-emerald-500/10 text-emerald-500"
                  )}>
                    <rota.icon className="w-8 h-8" />
                  </div>
                  <Badge variant={rota.status === 'Ativa' ? 'default' : 'secondary'} className={cn(
                    rota.status === 'Ativa' ? "bg-gold text-black" : "bg-muted text-muted-foreground"
                  )}>
                    {rota.status}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-serif text-foreground group-hover:text-gold transition-colors">
                      {rota.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="w-4 h-4 text-gold/60" />
                      <span className="italic">{rota.baseWork}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 min-h-[40px]">
                    {rota.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/5">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Estações</span>
                      <p className="text-lg font-serif">{rota.stations}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Última Atualização</span>
                      <p className="text-xs font-medium text-muted-foreground mt-1">
                        {rota.lastUpdate}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      className="flex-1 gap-2 bg-gold hover:bg-gold/80 text-black font-bold"
                      onClick={() => handleManageRota(rota)}
                    >
                      Gerenciar Rota
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-card/40 border border-primary/10 rounded-xl overflow-hidden backdrop-blur-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-primary/10 bg-muted/30">
                <th className="p-4 text-xs uppercase tracking-widest font-bold text-muted-foreground">Rota</th>
                <th className="p-4 text-xs uppercase tracking-widest font-bold text-muted-foreground">Status</th>
                <th className="p-4 text-xs uppercase tracking-widest font-bold text-muted-foreground text-center">Estações</th>
                <th className="p-4 text-xs uppercase tracking-widest font-bold text-muted-foreground text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredRotas.map((rota) => (
                <tr key={rota.id} className="border-b border-primary/5 hover:bg-primary/5 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        rota.color === 'gold' ? "bg-gold/10 text-gold" : "bg-emerald-500/10 text-emerald-500"
                      )}>
                        <rota.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground group-hover:text-gold transition-colors">{rota.title}</p>
                        <p className="text-xs text-muted-foreground italic">{rota.baseWork}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant={rota.status === 'Ativa' ? 'default' : 'secondary'} className="text-[10px]">
                      {rota.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-center font-serif text-lg">{rota.stations}</td>
                  <td className="p-4 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-2 hover:text-gold"
                      onClick={() => handleManageRota(rota)}
                    >
                      Gerenciar <ArrowRight className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Info Section */}
      <div className="p-6 rounded-2xl bg-gold/5 border border-gold/10 flex items-start gap-4">
        <Sparkles className="w-6 h-6 text-gold shrink-0 mt-1" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-gold">Dica da Guardiã</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            As Rotas da Casa são trilhas estruturadas que guiam a aluna por um processo de transformação. 
            Você pode criar novas rotas para diferentes temas ou obras literárias, definindo suas próprias estações e portais.
          </p>
        </div>
      </div>

      {/* Create Rota Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-card border-primary/20 sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-gold flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Criar Nova Rota da Casa
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Inicie uma nova jornada simbólica definindo a obra-base e a descrição da rota.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Título da Rota</label>
              <Input 
                placeholder="Ex: Rota da Heroína" 
                className="bg-muted/30 border-primary/10 focus:border-gold/50"
                value={newRota.title}
                onChange={(e) => setNewRota({...newRota, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Obra-base (Livro)</label>
              <Input 
                placeholder="Ex: A Jornada da Heroína" 
                className="bg-muted/30 border-primary/10 focus:border-gold/50"
                value={newRota.baseWork}
                onChange={(e) => setNewRota({...newRota, baseWork: e.target.value})}
              />
              <p className="text-[10px] text-muted-foreground italic">
                Esta obra será o eixo central de todas as estações desta rota.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Descrição Curta</label>
              <Input 
                placeholder="Explique brevemente o propósito desta rota..." 
                className="bg-muted/30 border-primary/10 focus:border-gold/50"
                value={newRota.description}
                onChange={(e) => setNewRota({...newRota, description: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="ghost" 
              onClick={() => setIsCreateDialogOpen(false)}
              className="text-muted-foreground hover:text-white"
            >
              Cancelar
            </Button>
            <Button 
              className="bg-gold hover:bg-gold/80 text-black font-bold"
              onClick={handleCreateRota}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar Rota'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
