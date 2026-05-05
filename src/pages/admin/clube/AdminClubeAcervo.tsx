
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, ImageIcon, ExternalLink, Library, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminClubeAcervo() {
  const navigate = useNavigate();

  const { data: stations, isLoading } = useQuery({
    queryKey: ['admin-clube-acervo-v3-stations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_v3_stations')
        .select(`
          *,
          route:clube_v3_routes(*)
        `)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });

  const activeStation = stations?.find(s => s.status === 'published');
  const otherStations = stations?.filter(s => s.status !== 'published') || [];

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
            <h2 className="text-2xl font-serif text-foreground">Acervo de Rotas</h2>
            <p className="text-sm text-muted-foreground">Livros e Estações da Jornada (v3)</p>
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
      ) : stations && stations.length > 0 ? (
        <div className="space-y-12">
          {/* Destaque: Estação Ativa */}
          {activeStation && (
            <div className="space-y-4">
              <Badge className="bg-gold text-black">Estação Ativa</Badge>
              <Card className="overflow-hidden bg-gold/5 border-gold/20 hover:border-gold/40 transition-all flex flex-col md:flex-row h-auto md:h-64 shadow-xl shadow-gold/5">
                 <div className="w-full md:w-48 shrink-0 bg-muted">
                    {activeStation.route?.cover_image_url ? (
                      <img src={activeStation.route.cover_image_url} alt="Capa" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground"><ImageIcon className="w-10 h-10 opacity-20" /></div>
                    )}
                 </div>
                 <div className="flex-1 p-8 flex flex-col justify-between">
                    <div>
                       <h3 className="text-3xl font-serif text-foreground mb-2">{activeStation.title}</h3>
                       <p className="text-lg text-muted-foreground italic mb-4">{activeStation.subtitle}</p>
                       <p className="text-sm text-muted-foreground max-w-xl">Parte da rota: <strong>{activeStation.route?.title}</strong>.</p>
                    </div>
                    <div className="flex gap-3 pt-6">
                       <Button className="bg-gold text-black hover:bg-gold/80 font-bold gap-2" onClick={() => navigate(`/admin/clube/central/${activeStation.id}`)}>
                         <Settings className="w-4 h-4" />
                         Gerenciar Estação
                       </Button>
                    </div>
                 </div>
              </Card>
            </div>
          )}

          {otherStations.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/50">Arquivo de Rotas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {otherStations.map((s) => (
                  <Card key={s.id} className="overflow-hidden bg-card/50 hover:border-gold/30 transition-all group">
                    <div className="aspect-[3/4] relative bg-muted">
                      {s.route?.cover_image_url ? (
                        <img 
                          src={s.route.cover_image_url} 
                          alt={s.title || 'Capa'} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <ImageIcon className="w-10 h-10 opacity-20" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex flex-col gap-2">
                        {s.status === 'published' && <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Publicada</Badge>}
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-2">
                      <h3 className="font-serif text-lg leading-tight truncate">
                        {s.title}
                      </h3>
                      <p className="text-sm text-muted-foreground italic truncate">
                        {s.subtitle}
                      </p>
                      <div className="pt-2 flex items-center justify-between border-t border-primary/5">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                          {s.route?.title}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 hover:text-gold"
                          onClick={() => navigate(`/admin/clube/central/${s.id}`)}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed border-primary/5">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-serif">Nenhuma rota encontrada (v3)</h3>
          <p className="text-sm text-muted-foreground mt-2">As rotas aparecem aqui assim que você as cria no sistema v3.</p>
          <Button className="mt-6 bg-gold text-black hover:bg-gold/80" onClick={() => navigate('/admin/clube')}>
            Ir para o Hub
          </Button>
        </div>
      )}
    </div>
  );
}
