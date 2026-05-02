import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, ImageIcon, ExternalLink, Library } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminClubeAcervo() {
  const navigate = useNavigate();

  const { data: books, isLoading } = useQuery({
    queryKey: ['admin-clube-acervo-books'],
    queryFn: async () => {
      // Get all unique books from club stations
      const { data, error } = await supabase
        .from('clube_estacoes')
        .select('id, titulo, livro_titulo, livro_autor, livro_capa_url, ativa, publicada')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => {
            if ((window as any).Admin_SetActiveTab) {
              (window as any).Admin_SetActiveTab('clube');
            }
            navigate('/admin/clube');
          }}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-serif text-foreground">Acervo de Jornadas</h2>
            <p className="text-sm text-muted-foreground">Obras vinculadas às estações e rotas do Clube</p>
          </div>
        </div>
        
        <Button variant="outline" className="gap-2 border-primary/10" onClick={() => navigate('/admin?tab=biblioteca')}>
          <Library className="w-4 h-4" />
          Ver Biblioteca Geral
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : books && books.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Card key={book.id} className="overflow-hidden bg-card/50 hover:border-gold/30 transition-all group">
              <div className="aspect-[3/4] relative bg-muted">
                {book.livro_capa_url ? (
                  <img 
                    src={book.livro_capa_url} 
                    alt={book.livro_titulo || 'Capa'} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ImageIcon className="w-10 h-10 opacity-20" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                  {book.ativa && <Badge className="bg-gold text-black border-none">Ativa</Badge>}
                  {book.publicada && <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Publicada</Badge>}
                </div>
              </div>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-serif text-lg leading-tight truncate">
                  {book.livro_titulo || 'Sem título'}
                </h3>
                <p className="text-sm text-muted-foreground italic truncate">
                  {book.livro_autor || 'Autoria não informada'}
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-primary/5">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Estação: {book.titulo}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 hover:text-gold"
                    onClick={() => navigate(`/admin/clube/central/${book.id}`)}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed border-primary/5">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-serif">Nenhuma obra encontrada</h3>
          <p className="text-sm text-muted-foreground mt-2">As obras aparecem aqui assim que você cria uma estação.</p>
          <Button className="mt-6 bg-gold text-black hover:bg-gold/80" onClick={() => navigate('/admin/clube')}>
            Ir para o Hub
          </Button>
        </div>
      )}
    </div>
  );
}
