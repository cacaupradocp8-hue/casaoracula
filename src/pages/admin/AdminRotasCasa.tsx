import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, Loader2, Compass, ChevronRight, Search, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';

/**
 * AdminRotasCasa — Versão Ultra-Simples e Read-Only
 * 
 * Este componente foi reescrito do zero para garantir o congelamento total.
 * Não contém handlers de criação, diálogos ou referências técnicas obsoletas.
 */

interface Estacao {
  id: string;
  numero: number;
  titulo: string;
  publicada: boolean;
  livro_titulo: string;
}

export default function AdminRotasCasa() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: estacoes, isLoading } = useQuery({
    queryKey: ['admin-rotas-casa-clean'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_estacoes')
        .select('id, numero, titulo, livro_titulo, publicada')
        .order('numero', { ascending: true });
      
      if (error) throw error;
      return (data || []) as Estacao[];
    },
  });

  const filteredEstacoes = useMemo(() => {
    if (!estacoes) return [];
    
    // Filtrar apenas estações reais (da Rota dos Lobos)
    const base = estacoes.filter(e => 
      e.numero > 0 && 
      (e.livro_titulo?.includes('Lobos') || e.livro_titulo === 'Mulheres que Correm com os Lobos')
    );

    if (!searchTerm) return base;
    
    const q = searchTerm.toLowerCase();
    return base.filter(e => 
      e.titulo.toLowerCase().includes(q) || 
      e.livro_titulo.toLowerCase().includes(q)
    );
  }, [estacoes, searchTerm]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="animate-spin text-gold w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <header className="space-y-2 border-b border-primary/10 pb-6">
        <h1 className="text-4xl font-serif text-foreground">Rotas da Casa</h1>
        <p className="text-muted-foreground font-light italic">Painel de visualização e acesso às estações.</p>
      </header>

      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          className="pl-10 bg-card/40 border-primary/10" 
          placeholder="Buscar estação..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
        />
      </div>

      <section className="space-y-8">
        <div className="flex items-center gap-3 text-gold">
          <Compass className="w-6 h-6" />
          <h2 className="text-2xl font-serif">Rota dos Lobos</h2>
        </div>

        <div className="ml-4 md:ml-8 space-y-6">
          <div className="flex items-center gap-3 text-emerald-400/80">
            <BookOpen className="w-5 h-5" />
            <h3 className="text-lg font-serif">Obra-base: Mulheres que Correm com os Lobos</h3>
          </div>

          <Card className="bg-card/40 border-primary/5 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="divide-y divide-primary/5">
                {filteredEstacoes.length > 0 ? (
                  filteredEstacoes.map(est => (
                    <div 
                      key={est.id} 
                      onClick={() => navigate(`/admin/clube/central/${est.id}`)}
                      className="flex items-center justify-between p-4 hover:bg-primary/5 cursor-pointer group transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-xs text-gold/40 w-6">
                          {String(est.numero).padStart(2, '0')}
                        </span>
                        <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground">
                          {est.titulo}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge variant={est.publicada ? "default" : "outline"} className="text-[9px] uppercase tracking-tighter">
                          {est.publicada ? 'Publicada' : 'Rascunho'}
                        </Badge>
                        <ChevronRight className="w-4 h-4 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                    <AlertCircle className="w-8 h-8 mb-2 opacity-20" />
                    <p className="text-sm italic">Nenhuma estação encontrada.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
