import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Trash2, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useSymbolicTemplates, TemplateType, SymbolicTemplateSession } from '@/hooks/useSymbolicTemplates';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TemplatesTabProps {
  caseId: string;
  clientId: string;
  clientName?: string;
}

const TEMPLATE_TYPES: { value: TemplateType; label: string; description: string }[] = [
  { value: 'big5', label: 'Big Five', description: 'Mapeamento de traços de personalidade' },
  { value: 'enneagram', label: 'Eneagrama', description: 'Leitura arquetípica dos 9 tipos' },
  { value: 'tarot', label: 'Tarot Narrativo', description: 'Leitura simbólica com arcanos' },
  { value: 'constellation', label: 'Constelação', description: 'Mapeamento sistêmico' },
];

export function TemplatesTab({ caseId, clientId, clientName }: TemplatesTabProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createSession, deleteSession } = useSymbolicTemplates();
  const [templates, setTemplates] = useState<SymbolicTemplateSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newType, setNewType] = useState<TemplateType | ''>('');
  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, [caseId]);

  const loadTemplates = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('symbolic_template_sessions')
        .select('*')
        .eq('case_id', caseId)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const transformedData = (data || []).map(session => ({
        ...session,
        template_type: session.template_type as TemplateType,
        sections: (session.sections as Record<string, string>) || {},
        notes: (session.notes as Record<string, string>) || {},
      }));

      setTemplates(transformedData);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newType || !newTitle.trim()) return;

    setCreating(true);
    try {
      const sessionId = await createSession(newType, newTitle.trim(), clientId, caseId);
      if (sessionId) {
        setDialogOpen(false);
        setNewType('');
        setNewTitle('');
        // Navigate to template editor
        navigate(`/templates/${newType}/${sessionId}?caseId=${caseId}`);
      }
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (sessionId: string) => {
    if (!confirm('Tem certeza que deseja excluir este template?')) return;
    
    const success = await deleteSession(sessionId);
    if (success) {
      loadTemplates();
    }
  };

  const handleOpen = (template: SymbolicTemplateSession) => {
    navigate(`/templates/${template.template_type}/${template.id}?caseId=${caseId}`);
  };

  const getTypeBadge = (type: TemplateType) => {
    const config = TEMPLATE_TYPES.find(t => t.value === type);
    return config?.label || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-gold font-display">Carregando templates...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-display text-foreground">Templates Guiados</h3>
          <p className="text-sm text-muted-foreground">
            Crie registros estruturados usando templates simbólicos
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Template</DialogTitle>
              <DialogDescription>
                Selecione o tipo de template e dê um título.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Tipo de Template</Label>
                <Select value={newType} onValueChange={(v) => setNewType(v as TemplateType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPLATE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-muted-foreground">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  placeholder={`Ex: ${clientName || 'Cliente'} - Sessão ${templates.length + 1}`}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              
              <Button
                onClick={handleCreate}
                disabled={!newType || !newTitle.trim() || creating}
                className="w-full"
              >
                {creating ? 'Criando...' : 'Criar Template'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Templates List */}
      {templates.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">Nenhum template criado para este caso.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Crie um template para registrar observações estruturadas.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="cursor-pointer hover:border-gold/50 transition-colors"
              onClick={() => handleOpen(template)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <FileText className="w-3 h-3" />
                      {getTypeBadge(template.template_type)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{getTypeBadge(template.template_type)}</Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(template.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  Atualizado em {format(new Date(template.updated_at), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}