import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, Loader2, Compass, ChevronRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * AdminRotasCasa — Versão Read-Only e Limpa (Final)
 * 
 * Foco exclusivo na exibição da Rota dos Lobos e suas obras/estações.
 * Toda a criação técnica e botões de ação foram removidos.
 */

interface EstacaoSimples {
  id: string;
  numero: number;
  titulo: string;
  publicada: boolean;
  livro_titulo: string;
}

export default function AdminRotasCasa() {
  const navigate = useNavigate();

  const { data: estacoes, isLoading } = useQuery({
    queryKey: ['admin-rotas-casa-final'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_estacoes')
        .select('id, numero, titulo, livro_titulo, publicada')
        .order('numero', { ascending: true });
      
      if (error) throw error;
      return (data || []) as EstacaoSimples[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="animate-spin text-gold w-8 h-8" />
      </div>
    );
  }

  // Filtramos apenas a Rota dos Lobos e suas estações reais
  const obraAlvo = 'Mulheres que Correm com os Lobos';
  const estacoesLobos = estacoes?.filter(e => 
    e.numero > 0 && 
    (e.livro_titulo?.includes(obraAlvo) || e.livro_titulo === 'Rota dos Lobos')
  ) || [];

  return (
    <div className="space-y-8 p-4 md:p-8 animate-in fade-in duration-700 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-4xl font-serif text-foreground">Rotas da Casa</h1>
        <p className="text-muted-foreground font-light">Gestão de travessias (Modo Somente Leitura).</p>
      </div>

      <div className="space-y-6">
        {/* Rota dos Lobos */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gold">
            <Compass className="w-6 h-6" />
            <h2 className="text-2xl font-serif">Rota dos Lobos</h2>
          </div>
          
          <div className="ml-6 border-l-2 border-primary/10 pl-6 space-y-6">
            {/* Obra-base */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <h3 className="font-serif text-xl text-foreground/90">
                  Obra-base: Mulheres que Correm com os Lobos
                </h3>
              </div>

              {/* Estações */}
              <Card className="bg-card/40 border-primary/5 overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-primary/5 px-4 py-2 border-b border-primary/5">
                    <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
                      Estações da Travessia
                    </span>
                  </div>
                  <div className="divide-y divide-primary/5">
                    {estacoesLobos.map(est => (
                      <div 
                        key={est.id} 
                        onClick={() => navigate(`/admin/clube/central/${est.id}`)}
                        className="flex items-center justify-between p-4 hover:bg-primary/5 cursor-pointer group transition-all"
                      >
                        <div className="flex items-center gap-4 text-sm text-muted-foreground group-hover:text-foreground">
                          <span className="w-6 text-xs font-mono text-gold/60">{String(est.numero).padStart(2, '0')}</span>
                          <span className="font-medium">{est.titulo}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={est.publicada ? "default" : "outline"} className="text-[9px] uppercase tracking-wider">
                            {est.publicada ? 'Publicada' : 'Rascunho'}
                          </Badge>
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-gold" />
                        </div>
                      </div>
                    ))}
                    {estacoesLobos.length === 0 && (
                      <div className="p-8 text-center text-muted-foreground text-sm italic">
                        Nenhuma estação encontrada.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
