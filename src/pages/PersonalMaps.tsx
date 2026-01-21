// ============================================
// PERSONAL SYMBOLIC MAPS - LIST PAGE
// ============================================
// Private reflective space for therapists
// NOT clinical records - symbolic/reflective/formative only

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Plus,
  Loader2,
  FileText,
  Calendar,
  Clock,
  Trash2,
  Map,
  Brain,
  Compass,
  Flower2,
  Users,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { usePersonalMaps } from '@/hooks/usePersonalMaps';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PERSONAL_MAP_TEMPLATES, PersonalMapTemplateKey, getTemplateByKey } from '@/types/personal-map';

const ICON_MAP: Record<string, React.ReactNode> = {
  Brain: <Brain className="w-5 h-5" />,
  Compass: <Compass className="w-5 h-5" />,
  Flower2: <Flower2 className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
};

export default function PersonalMaps() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { maps, loading, createMap, deleteMap } = usePersonalMaps();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<PersonalMapTemplateKey | ''>('');
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleCreate = async () => {
    if (!newTitle.trim() || !selectedTemplate) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha o título e selecione um modelo.',
        variant: 'destructive',
      });
      return;
    }

    setCreating(true);
    const mapId = await createMap(selectedTemplate, newTitle.trim(), newDescription.trim() || undefined);
    setCreating(false);

    if (mapId) {
      setShowCreateDialog(false);
      setNewTitle('');
      setNewDescription('');
      setSelectedTemplate('');
      navigate(`/mapas-pessoais/${mapId}`);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);
    await deleteMap(deleteId);
    setDeleting(false);
    setDeleteId(null);
  };

  const resetCreateDialog = () => {
    setShowCreateDialog(false);
    setNewTitle('');
    setNewDescription('');
    setSelectedTemplate('');
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/ferramentas')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <SectionHeader
            title="Mapas Reflexivos"
            subtitle="Espaço pessoal de reflexão simbólica"
            icon={<Map className="w-6 h-6 text-gold" />}
          />
        </div>

        {/* Disclaimer */}
        <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
          <CardContent className="py-4">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <p className="font-medium mb-1">Espaço privado de reflexão</p>
                <p className="text-amber-700 dark:text-amber-300">
                  Estes mapas são ferramentas <strong>simbólicas, reflexivas e formativas</strong>. 
                  Não são registros clínicos, diagnósticos ou documentação terapêutica. 
                  Somente você tem acesso ao conteúdo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create Button */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-medium text-muted-foreground">
            {maps.length > 0 ? `${maps.length} mapa(s) criado(s)` : 'Nenhum mapa criado'}
          </h3>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Mapa
          </Button>
        </div>

        {/* Maps List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : maps.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Map className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="font-medium mb-2">Nenhum mapa ainda</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Crie seu primeiro mapa reflexivo pessoal.
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Mapa
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {maps.map((map) => {
              const template = getTemplateByKey(map.template_key);
              return (
                <Card
                  key={map.id}
                  className="hover:border-gold/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/mapas-pessoais/${map.id}`)}
                >
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-gold/10 text-gold">
                          {template && ICON_MAP[template.icon]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{map.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {template?.title || map.template_key}
                          </p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(map.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {format(new Date(map.updated_at), 'dd/MM HH:mm', { locale: ptBR })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(map.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Create Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={resetCreateDialog}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Novo Mapa Reflexivo</DialogTitle>
              <DialogDescription>
                Escolha um modelo e dê um título para seu mapa de reflexão pessoal.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Template Select */}
              <div className="space-y-2">
                <Label>Modelo *</Label>
                <Select
                  value={selectedTemplate}
                  onValueChange={(v) => setSelectedTemplate(v as PersonalMapTemplateKey)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um modelo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PERSONAL_MAP_TEMPLATES.map((template) => (
                      <SelectItem key={template.key} value={template.key}>
                        <div className="flex items-center gap-2">
                          {ICON_MAP[template.icon]}
                          <span>{template.title}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTemplate && (
                  <p className="text-xs text-muted-foreground">
                    {getTemplateByKey(selectedTemplate)?.description}
                  </p>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Reflexão sessão 12/01"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Contexto ou notas adicionais..."
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetCreateDialog}>
                Cancelar
              </Button>
              <Button
                onClick={handleCreate}
                disabled={creating || !newTitle.trim() || !selectedTemplate}
              >
                {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Criar e Editar
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
                Esta ação não pode ser desfeita. O mapa e todas as suas reflexões serão permanentemente excluídos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                {deleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
