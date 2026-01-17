import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Trash2, Map, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { AppLayout } from '@/components/layout/AppLayout';
import { useMindMaps } from '@/hooks/useMindMaps';

export default function MapaVivoList() {
  const navigate = useNavigate();
  const { maps, loading, createMap, deleteMap } = useMindMaps();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);

  const filteredMaps = maps.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    
    setCreating(true);
    const map = await createMap(newTitle.trim());
    setCreating(false);
    
    if (map) {
      setShowNewDialog(false);
      setNewTitle('');
      navigate(`/ferramentas/mapa-vivo/${map.id}`);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMap(deleteId);
      setDeleteId(null);
    }
  };

  const handleOpenNewDialog = () => {
    setNewTitle('');
    setShowNewDialog(true);
  };

  return (
    <AppLayout>
      <div className="container max-w-5xl py-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display text-foreground">Mapa Mental Simbólico Livre</h1>
            <p className="text-muted-foreground mt-1 max-w-xl">
              Espaço visual livre para pensamento simbólico, insights, associações e reflexão criativa. 
              Não é uma ferramenta guiada ou diagnóstica.
            </p>
          </div>
          <Button onClick={handleOpenNewDialog} className="gap-2 shrink-0">
            <Plus className="h-4 w-4" />
            Novo Mapa
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar mapas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-2/3" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredMaps.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Map className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">
                {search ? 'Nenhum mapa encontrado' : 'Nenhum mapa criado ainda'}
              </h3>
              <p className="text-muted-foreground mt-1 mb-4">
                {search
                  ? 'Tente uma busca diferente'
                  : 'Crie seu primeiro mapa mental para começar a explorar suas ideias'}
              </p>
              {!search && (
                <Button onClick={handleOpenNewDialog} variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Criar Mapa
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMaps.map(map => (
              <Card
                key={map.id}
                className="group cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => navigate(`/ferramentas/mapa-vivo/${map.id}`)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-start justify-between">
                    <span className="truncate">{map.title}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(map.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Criado: {format(new Date(map.created_at), "d 'de' MMM, yyyy", { locale: ptBR })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Editado: {format(new Date(map.updated_at), "d 'de' MMM, HH:mm", { locale: ptBR })}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create New Map Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Mapa</DialogTitle>
            <DialogDescription>
              Dê um título ao seu mapa mental. Você pode editá-lo depois.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="map-title">Título do Mapa *</Label>
            <Input
              id="map-title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ex: Reflexões sobre o sonho de ontem"
              className="mt-2"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newTitle.trim()) {
                  handleCreate();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCreate} 
              disabled={!newTitle.trim() || creating}
            >
              {creating ? 'Criando...' : 'Criar Mapa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir mapa?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Todos os nós serão removidos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
