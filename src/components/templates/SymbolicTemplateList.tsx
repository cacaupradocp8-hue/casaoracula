import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Plus, 
  Loader2, 
  FileText,
  Calendar,
  Clock,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { useSymbolicTemplates, TemplateType } from '@/hooks/useSymbolicTemplates';
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
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SymbolicTemplateListProps {
  templateType: TemplateType;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  editorPath: string;
  backPath: string;
}

export function SymbolicTemplateList({
  templateType,
  title,
  subtitle,
  description,
  icon,
  editorPath,
  backPath,
}: SymbolicTemplateListProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sessions, loading, createSession, deleteSession } = useSymbolicTemplates(templateType);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleCreate = async () => {
    if (!newTitle.trim()) {
      toast({
        title: 'Título obrigatório',
        description: 'Por favor, insira um título para a sessão.',
        variant: 'destructive',
      });
      return;
    }

    setCreating(true);
    const sessionId = await createSession(templateType, newTitle.trim());
    setCreating(false);

    if (sessionId) {
      setShowCreateDialog(false);
      setNewTitle('');
      navigate(`${editorPath}/${sessionId}`);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);
    await deleteSession(deleteId);
    setDeleting(false);
    setDeleteId(null);
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(backPath)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <SectionHeader
            title={title}
            subtitle={subtitle}
            icon={icon}
          />
        </div>

        {/* Description */}
        <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
          <CardContent className="py-4">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                {description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Create Button */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-medium text-muted-foreground">
            {sessions.length > 0 
              ? `${sessions.length} sessão(ões) salva(s)` 
              : 'Nenhuma sessão criada'}
          </h3>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Sessão
          </Button>
        </div>

        {/* Sessions List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : sessions.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="font-medium mb-2">Nenhuma sessão ainda</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Crie sua primeira sessão de reflexão simbólica.
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Sessão
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <Card 
                key={session.id} 
                className="hover:border-gold/50 transition-colors cursor-pointer"
                onClick={() => navigate(`${editorPath}/${session.id}`)}
              >
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{session.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Criado: {format(new Date(session.created_at), "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Editado: {format(new Date(session.updated_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(session.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Sessão</DialogTitle>
              <DialogDescription>
                Dê um título para esta sessão de reflexão.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="title">Título da Sessão *</Label>
              <Input
                id="title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex: Sessão inicial - Maria"
                className="mt-2"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreate} disabled={creating || !newTitle.trim()}>
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
              <AlertDialogTitle>Excluir sessão?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. A sessão e todas as suas anotações serão permanentemente excluídas.
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
