import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen, Search,
  Loader2, AlertCircle, Route as RouteIcon, Layers, Compass
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * AdminRotasCasa — Versão Read-Only e Limpa
 * 
 * Foco exclusivo na exibição da Rota dos Lobos e suas obras/estações.
 * Criação técnica removida.
 */

interface EstacaoSimples {
  id: string;
  numero: number;
  titulo: string;
  publicada: boolean;
  livro_titulo: string;
}

interface ObraResumo {
  titulo: string;
  estacoes: EstacaoSimples[];
}

interface RotaAgrupada {
  id: string;
  nome: string;
  obras: ObraResumo[];
}

export default function AdminRotasCasa() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: dbData, isLoading } = useQuery({
    queryKey: ['admin-rotas-casa-readonly'],
    queryFn: async () => {
      const { data: estacoes, error } = await supabase
        .from('clube_estacoes')
        .select('id, numero, titulo, livro_titulo, publicada')
        .order('numero', { ascending: true });
      
      if (error) throw error;
      return estacoes || [];
    },
  });

  const rotasAgrupadas: RotaAgrupada[] = useMemo(() => {
    if (!dbData) return [];

    const estacoes = dbData as EstacaoSimples[];
    
    // Filtramos apenas as estações reais (com número > 0)
    const estacoesReais = estacoes.filter(e => e.numero > 0);

    // Agrupamos por obra (livro_titulo)
    const obrasMap = new Map<string, EstacaoSimples[]>();
    estacoesReais.forEach(e => {
      const obra = e.livro_titulo || 'Sem Obra';
      if (!obrasMap.has(obra)) obrasMap.set(obra, []);
      obrasMap.get(obra)!.push(e);
    });

    const obras: ObraResumo[] = Array.from(obrasMap.entries()).map(([titulo, ests]) => ({
      titulo,
      estacoes: ests
    }));

    // Para este hotfix, mostramos tudo sob "Rotas da Casa"
    return [{
      id: 'rotas-da-casa',
      nome: 'Rotas da Casa',
      obras: obras
    }];
  }, [dbData]);

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    if (!q) return rotasAgrupadas;
    
    return rotasAgrupadas.map(rota => ({
      ...rota,
      obras: rota.obras.filter(o => 
        o.titulo.toLowerCase().includes(q) || 
        o.estacoes.some(e => e.titulo.toLowerCase().includes(q))
      )
    })).filter(rota => rota.obras.length > 0);
  }, [rotasAgrupadas, searchTerm]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="animate-spin text-gold w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif text-foreground">Rotas da Casa</h1>
          <p className="text-muted-foreground font-light">Visualização das travessias e estações da Cidadela.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="group relative">
            <Button variant="outline" disabled className="border-gold/30 text-gold/50 cursor-not-allowed gap-2 opacity-50">
              <RouteIcon className="w-4 h-4" /> Nova Rota
            </Button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-[10px] rounded border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              Criação congelada.
            </div>
          </div>
          
          <div className="group relative">
            <Button variant="outline" disabled className="border-emerald-500/30 text-emerald-400/50 cursor-not-allowed gap-2 opacity-50">
              <BookOpen className="w-4 h-4" /> Nova Obra-base
            </Button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-[10px] rounded border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              Criação congelada.
            </div>
          </div>

          <div className="group relative">
            <Button variant="outline" disabled className="gap-2 opacity-50 cursor-not-allowed">
              <Layers className="w-4 h-4" /> Nova Estação
            </Button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-[10px] rounded border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              Criação congelada.
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          className="pl-10 bg-card/40" 
          placeholder="Buscar obra ou estação..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
        />
      </div>

      {filtered.length === 0 ? (
        <Card className="bg-card/20 border-dashed border-primary/10 p-20 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhuma rota ou obra encontrada.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {filtered.map(rota => (
            <div key={rota.id} className="space-y-6">
              <div className="flex items-center gap-3 text-gold">
                <Compass className="w-6 h-6" />
                <h2 className="text-2xl font-serif">{rota.nome}</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {rota.obras.map(obra => (
                  <Card key={obra.titulo} className="bg-card/60 border-primary/10 hover:border-primary/20 transition-colors overflow-hidden">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-3 border-b border-primary/5 pb-3">
                        <BookOpen className="w-5 h-5 text-emerald-400" />
                        <h3 className="font-serif text-xl text-foreground/90">{obra.titulo}</h3>
                      </div>
                      
                      <div className="space-y-2">
                        {obra.estacoes.map(est => (
                          <div 
                            key={est.id} 
                            onClick={() => navigate(`/admin/clube/central/${est.id}`)}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-primary/5 cursor-pointer group transition-all"
                          >
                            <div className="flex items-center gap-3 text-sm text-muted-foreground group-hover:text-foreground">
                              <span className="w-6 text-xs font-mono text-gold/60">{String(est.numero).padStart(2, '0')}</span>
                              <span>{est.titulo}</span>
                            </div>
                            <Badge variant={est.publicada ? "default" : "outline"} className="text-[9px] uppercase tracking-wider">
                              {est.publicada ? 'Publicada' : 'Rascunho'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
