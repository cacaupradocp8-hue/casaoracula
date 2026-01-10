import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Search, Trash2, Copy, Eye, Tag } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSyntheiaLibrary } from '@/hooks/useSyntheia';
import { TIPO_OPTIONS } from '@/types/syntheia';
import type { SyntheiaCreation } from '@/types/syntheia';
import DOMPurify from 'dompurify';

export default function SyntheiaBiblioteca() {
  const navigate = useNavigate();
  const { creations, isLoading, deleteCreation } = useSyntheiaLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCreation, setSelectedCreation] = useState<SyntheiaCreation | null>(null);

  const filteredCreations = creations.filter(creation => {
    const searchLower = searchTerm.toLowerCase();
    return (
      creation.titulo?.toLowerCase().includes(searchLower) ||
      creation.tema_principal.toLowerCase().includes(searchLower) ||
      creation.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });

  const getTipoLabel = (tipo: string) => {
    return TIPO_OPTIONS.find(t => t.value === tipo)?.label || tipo;
  };

  const handleDuplicate = (creation: SyntheiaCreation) => {
    navigate(`/syntheia/criar?tipo=${creation.tipo}`);
  };

  const renderMarkdown = (text: string | null | undefined) => {
    if (!text) return null;
    // Simple markdown to HTML conversion for bullets and bold
    const html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^\- /gm, '• ')
      .replace(/\n/g, '<br>');
    return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />;
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/syntheia')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <Button onClick={() => navigate('/syntheia')} className="gap-2">
            <Plus className="w-4 h-4" />
            Nova criação
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Biblioteca</h1>
          <p className="text-muted-foreground">
            Suas criações salvas para reutilização
          </p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título, tema ou tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCreations.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Nenhuma criação encontrada' : 'Sua biblioteca está vazia'}
              </p>
              <Button onClick={() => navigate('/syntheia')} variant="outline">
                Criar primeira estrutura
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredCreations.map(creation => (
              <Card key={creation.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {getTipoLabel(creation.tipo)}
                        </Badge>
                        {creation.tags?.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <h3 className="font-semibold truncate">
                        {creation.titulo || creation.tema_principal}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {creation.chave_simbolica}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(creation.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedCreation(creation)}
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDuplicate(creation)}
                        title="Duplicar e editar"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir criação?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteCreation.mutate(creation.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* View Dialog */}
        <Dialog open={!!selectedCreation} onOpenChange={() => setSelectedCreation(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedCreation && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedCreation.titulo || selectedCreation.tema_principal}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 mt-4">
                  <div>
                    <h4 className="font-semibold text-primary mb-2">🔮 Chave Simbólica</h4>
                    <p className="text-muted-foreground">{selectedCreation.chave_simbolica}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-2">🎯 Intenção Terapêutica</h4>
                    <p className="text-muted-foreground">{selectedCreation.intencao_terapeutica}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-2">📋 Estrutura Prática</h4>
                    <div className="text-muted-foreground prose prose-sm max-w-none">
                      {renderMarkdown(selectedCreation.estrutura_pratica)}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-2">💬 Suporte de Linguagem</h4>
                    <div className="text-muted-foreground prose prose-sm max-w-none">
                      {renderMarkdown(selectedCreation.suporte_linguagem)}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-2">🌙 Fechamento & Integração</h4>
                    <p className="text-muted-foreground">{selectedCreation.fechamento_integracao}</p>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
