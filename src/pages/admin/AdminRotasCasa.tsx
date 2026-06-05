import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, Loader2, Compass, Eye, Edit3, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function AdminRotasCasa() {
  const navigate = useNavigate();

  const { data: estacoes, isLoading } = useQuery({
    queryKey: ['admin-rotas-casa-hub'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_estacoes')
        .select('id, numero, titulo, subtitulo, livro_titulo, publicada')
        .order('numero', { ascending: true });
      
      if (error) throw error;
      return (data || []);
    },
  });

  const rotaDosLobos = estacoes?.filter((e: any) => 
    e.numero > 0 && 
    (e.livro_titulo?.includes('Lobos') || e.livro_titulo === 'Mulheres que Correm com os Lobos')
  ) || [];

  const getPublicUrl = (titulo: string) => {
    const slugMap: Record<string, string> = {
      'Clareira do Chamado': 'clareira-do-chamado',
      'Casa da Boa Menina': 'casa-da-boa-menina',
      'Porta Proibida': 'porta-proibida',
      'Casa da Boneca Interior': 'casa-da-boneca-interior',
      'Margem dos Ossos': 'margem-dos-ossos',
      'Território da Loba': 'territorio-da-loba'
    };
    return `/clube/rota/${slugMap[titulo] || ''}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="animate-spin text-gold w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-500">
      <header className="space-y-2 border-b border-primary/10 pb-6">
        <h1 className="text-4xl font-serif text-foreground">Rotas da Casa</h1>
        <p className="text-muted-foreground font-light italic">Home operacional para gestão de conteúdo e acesso rápido.</p>
      </header>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-gold">
            <Compass className="w-6 h-6" />
            <h2 className="text-2xl font-serif">Rota dos Lobos</h2>
          </div>
          <Badge variant="secondary" className="bg-gold/10 text-gold border-gold/20 px-3 py-1">
            Status: Ativa
          </Badge>
        </div>

        <div className="flex items-center gap-3 text-emerald-400/80 mb-4 bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10">
          <BookOpen className="w-5 h-5" />
          <h3 className="text-lg font-serif">Obra: <span className="italic text-foreground/90">Mulheres que Correm com os Lobos</span></h3>
        </div>

        <div className="grid gap-4">
          {rotaDosLobos.map((est: any) => (
            <Card key={est.id} className="bg-card/40 border-primary/10 hover:border-gold/30 transition-all duration-300 overflow-hidden group">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center w-10 h-10 rounded-full bg-gold/5 border border-gold/10 text-gold font-mono text-lg">
                      {est.numero}
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-foreground">{est.titulo}</h4>
                      <p className="text-sm text-muted-foreground italic">Conto: {est.subtitulo || 'Não definido'}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant={est.publicada ? "default" : "outline"} className={`text-[10px] uppercase tracking-wider ${est.publicada ? 'bg-emerald-600 hover:bg-emerald-700' : 'text-amber-500 border-amber-500/30'}`}>
                      {est.publicada ? 'Publicada' : 'Rascunho'}
                    </Badge>

                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="secondary"
                        className="bg-primary/10 hover:bg-gold/20 text-foreground border border-primary/20 h-9"
                        onClick={() => navigate(`/admin/clube/central/${est.id}`)}
                      >
                        <Edit3 className="w-4 h-4 mr-2 text-gold" />
                        Editar
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-primary/10 hover:border-gold/30 h-9"
                        onClick={() => window.open(getPublicUrl(est.titulo), '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2 text-muted-foreground" />
                        Ver como aluna
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Removemos botões de criação não funcionais e referências v2/v3 para manter o foco operacional */}
    </div>
  );
}
