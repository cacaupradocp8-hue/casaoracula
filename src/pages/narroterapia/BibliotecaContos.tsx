import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Search, Home, ChevronRight, AlertTriangle, Globe, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ContoEstudo {
  id: string;
  title: string;
  content: string;
  tags: string[] | null;
  origem_cultural: string | null;
  observacoes_leitura: string | null;
}

export default function BibliotecaContos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConto, setSelectedConto] = useState<ContoEstudo | null>(null);

  // Fetch contos from library_items where type = 'conto'
  const { data: contos, isLoading } = useQuery<ContoEstudo[]>({
    queryKey: ['contos-estudo'],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const client = supabase as any;
      const { data, error } = await client
        .from('library_items')
        .select('id, title, content, tags, origem_cultural, observacoes_leitura')
        .eq('type', 'conto')
        .eq('ativo', true)
        .order('ordem');

      if (error) throw error;
      return (data || []) as ContoEstudo[];
    },
  });

  const filteredContos = contos?.filter(conto => {
    const matchesSearch =
      conto.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conto.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conto.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      conto.origem_cultural?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  }) || [];

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/narroterapia" className="hover:text-foreground transition-colors">
            Narroterapia Oracular™
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Biblioteca de Contos</span>
        </nav>

        <SectionHeader
          title="Biblioteca de Contos"
          subtitle="Contos clássicos e simbólicos para estudo"
          icon={<BookOpen className="w-5 h-5" />}
          className="mb-6"
        />

        {/* Fixed Ethical Warning */}
        <Alert className="mb-6 border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <AlertDescription className="text-amber-200">
            Este espaço é para estudo simbólico. Não utilizar clinicamente.
          </AlertDescription>
        </Alert>

        {/* Search */}
        <div className="glass rounded-xl p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título, conteúdo, tag ou origem..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredContos.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {searchTerm ? 'Nenhum conto encontrado' : 'Nenhum conto cadastrado ainda'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredContos.map((conto) => (
              <Card 
                key={conto.id} 
                className="group hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedConto(selectedConto?.id === conto.id ? null : conto)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-burgundy/20 text-burgundy-light">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-display">
                          {conto.title}
                        </CardTitle>
                        {conto.origem_cultural && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Globe className="w-3 h-3" />
                            {conto.origem_cultural}
                          </div>
                        )}
                      </div>
                    </div>
                    <Eye className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                    {conto.content}
                  </p>
                  
                  {/* Expanded View */}
                  {selectedConto?.id === conto.id && (
                    <div className="mt-4 pt-4 border-t border-border/50 space-y-4">
                      <p className="text-foreground text-sm leading-relaxed whitespace-pre-line">
                        {conto.content}
                      </p>
                      
                      {conto.observacoes_leitura && (
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                            Observações de Leitura
                          </p>
                          <p className="text-sm text-foreground">
                            {conto.observacoes_leitura}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {conto.tags && conto.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {conto.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
