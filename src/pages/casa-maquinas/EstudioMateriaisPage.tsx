import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Loader2,
  Plus,
  FileText,
  Network,
  Image,
  BookOpen,
  ChevronRight,
  Copy,
  Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import EstudioProjetoWizard from '@/components/estudio-materiais/EstudioProjetoWizard';

interface Projeto {
  id: string;
  titulo: string;
  modo: string;
  status: string;
  created_at: string;
  livro_externo_nome?: string;
  book_id?: string;
  estrutura_gerada?: any;
}

export default function EstudioMateriaisPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);

  useEffect(() => {
    if (user) loadProjetos();
  }, [user]);

  const loadProjetos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('estudio_projetos')
      .select('*')
      .eq('owner_id', user!.id)
      .order('updated_at', { ascending: false });

    if (!error && data) setProjetos(data as any);
    setLoading(false);
  };

  const duplicarProjeto = async (projeto: Projeto) => {
    const { data, error } = await supabase
      .from('estudio_projetos')
      .insert({
        owner_id: user!.id,
        titulo: `${projeto.titulo} (cópia)`,
        modo: projeto.modo,
        book_id: projeto.book_id,
        livro_externo_nome: projeto.livro_externo_nome,
        estrutura_gerada: projeto.estrutura_gerada,
        status: 'rascunho',
      } as any)
      .select()
      .single();

    if (!error) {
      toast({ title: 'Projeto duplicado' });
      loadProjetos();
    }
  };

  const deletarProjeto = async (id: string) => {
    const { error } = await supabase.from('estudio_projetos').delete().eq('id', id);
    if (!error) {
      toast({ title: 'Projeto removido' });
      setProjetos(prev => prev.filter(p => p.id !== id));
    }
  };

  if (showWizard || editingProject) {
    return (
      <EstudioProjetoWizard
        projectId={editingProject}
        onClose={() => {
          setShowWizard(false);
          setEditingProject(null);
          loadProjetos();
        }}
      />
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">Estúdio de Materiais</h1>
              <p className="text-sm text-muted-foreground">Gere Playbooks, Mapas Mentais e Infográficos</p>
            </div>
          </div>
          <Button onClick={() => setShowWizard(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Projeto
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : projetos.length === 0 ? (
          <Card className="border-dashed border-2 border-border">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum projeto ainda</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-md">
                Crie seu primeiro projeto para gerar materiais profissionais baseados no Método de Leitura Oracular.
              </p>
              <Button onClick={() => setShowWizard(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Criar Primeiro Projeto
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projetos.map(projeto => (
              <Card
                key={projeto.id}
                className="hover:border-primary/30 transition-all cursor-pointer border-border group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">{projeto.titulo}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {projeto.modo === 'casa' ? 'Livro da Casa' : projeto.livro_externo_nome || 'Livro Externo'}
                        {' · '}
                        {format(new Date(projeto.created_at), "dd MMM yyyy", { locale: ptBR })}
                      </CardDescription>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      projeto.status === 'completo'
                        ? 'bg-green-500/10 text-green-600'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {projeto.status === 'completo' ? 'Completo' : 'Rascunho'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex gap-1">
                      <FileText className={`w-4 h-4 ${projeto.estrutura_gerada ? 'text-primary' : 'text-muted-foreground/30'}`} />
                      <Network className={`w-4 h-4 ${projeto.estrutura_gerada ? 'text-primary' : 'text-muted-foreground/30'}`} />
                      <Image className={`w-4 h-4 ${projeto.estrutura_gerada ? 'text-primary' : 'text-muted-foreground/30'}`} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-1"
                      onClick={() => setEditingProject(projeto.id)}
                    >
                      Abrir <ChevronRight className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => { e.stopPropagation(); duplicarProjeto(projeto); }}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={(e) => { e.stopPropagation(); deletarProjeto(projeto.id); }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
