import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Bell, Edit2, Save, X, RotateCcw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Template {
  id: string;
  channel: 'email' | 'in_app';
  type: string;
  subject: string | null;
  title: string;
  body: string;
  cta_label: string | null;
  cta_url: string | null;
  is_enabled: boolean;
  updated_at: string;
}

const defaultTemplates: Record<string, { title: string; body: string; cta_label: string; cta_url: string }> = {
  pre_expiracao: {
    title: 'Seu acesso está prestes a encerrar',
    body: 'Seu acesso ao app se encerra em 7 dias. Seu histórico permanece. Para manter tudo ativo, veja os planos.',
    cta_label: 'Ver planos',
    cta_url: '/planos'
  },
  expiracao: {
    title: 'Seu acesso foi encerrado',
    body: 'As funções profissionais estão pausadas, mas seus dados continuam intactos. Reabra quando quiser.',
    cta_label: 'Reativar acesso',
    cta_url: '/planos'
  },
  retorno: {
    title: 'Seu espaço continua aqui',
    body: 'Clientes, registros e ferramentas seguem guardados. Você pode reativar quando for o momento.',
    cta_label: 'Ver planos',
    cta_url: '/planos'
  }
};

const typeLabels: Record<string, string> = {
  pre_expiracao: 'Pré-expiração (7 dias antes)',
  expiracao: 'Expiração (no dia)',
  retorno: 'Retorno (7 dias após)',
  info: 'Informativo',
  boas_vindas: 'Boas-vindas'
};

export function CommunicationTemplates() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState({
    subject: '',
    title: '',
    body: '',
    cta_label: '',
    cta_url: ''
  });

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['message-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('message_templates')
        .select('*')
        .order('channel', { ascending: true })
        .order('type', { ascending: true });
      
      if (error) throw error;
      return data as Template[];
    }
  });

  const updateTemplate = useMutation({
    mutationFn: async (template: Partial<Template> & { id: string }) => {
      const { error } = await supabase
        .from('message_templates')
        .update({
          ...template,
          updated_at: new Date().toISOString()
        })
        .eq('id', template.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['message-templates'] });
      toast({ title: 'Template atualizado com sucesso' });
      setEditingTemplate(null);
    },
    onError: (error) => {
      toast({ title: 'Erro ao atualizar template', description: error.message, variant: 'destructive' });
    }
  });

  const toggleEnabled = useMutation({
    mutationFn: async ({ id, is_enabled }: { id: string; is_enabled: boolean }) => {
      const { error } = await supabase
        .from('message_templates')
        .update({ is_enabled, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['message-templates'] });
      toast({ title: 'Status atualizado' });
    }
  });

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setFormData({
      subject: template.subject || '',
      title: template.title,
      body: template.body,
      cta_label: template.cta_label || '',
      cta_url: template.cta_url || ''
    });
  };

  const handleSave = () => {
    if (!editingTemplate) return;
    
    updateTemplate.mutate({
      id: editingTemplate.id,
      subject: formData.subject || null,
      title: formData.title,
      body: formData.body,
      cta_label: formData.cta_label || null,
      cta_url: formData.cta_url || null
    });
  };

  const handleRestore = () => {
    if (!editingTemplate) return;
    
    const defaults = defaultTemplates[editingTemplate.type];
    if (defaults) {
      setFormData({
        subject: editingTemplate.channel === 'email' ? defaults.title : '',
        title: defaults.title,
        body: defaults.body,
        cta_label: defaults.cta_label,
        cta_url: defaults.cta_url
      });
    }
  };

  const emailTemplates = templates.filter(t => t.channel === 'email');
  const inAppTemplates = templates.filter(t => t.channel === 'in_app');

  if (isLoading) {
    return <div className="text-center py-8">Carregando templates...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Email Templates */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Mail className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Templates de E-mail</h3>
        </div>
        <div className="grid gap-4">
          {emailTemplates.map(template => (
            <Card key={template.id} className={!template.is_enabled ? 'opacity-60' : ''}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{typeLabels[template.type] || template.type}</CardTitle>
                    <Badge variant={template.is_enabled ? 'default' : 'secondary'}>
                      {template.is_enabled ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={template.is_enabled}
                      onCheckedChange={(checked) => toggleEnabled.mutate({ id: template.id, is_enabled: checked })}
                    />
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(template)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">Assunto: {template.subject}</p>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{template.body}</p>
                {template.cta_label && (
                  <p className="text-xs text-primary mt-2">CTA: {template.cta_label} → {template.cta_url}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* In-App Templates */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Templates In-App</h3>
        </div>
        <div className="grid gap-4">
          {inAppTemplates.map(template => (
            <Card key={template.id} className={!template.is_enabled ? 'opacity-60' : ''}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{typeLabels[template.type] || template.type}</CardTitle>
                    <Badge variant={template.is_enabled ? 'default' : 'secondary'}>
                      {template.is_enabled ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={template.is_enabled}
                      onCheckedChange={(checked) => toggleEnabled.mutate({ id: template.id, is_enabled: checked })}
                    />
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(template)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">{template.title}</p>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{template.body}</p>
                {template.cta_label && (
                  <p className="text-xs text-primary mt-2">CTA: {template.cta_label} → {template.cta_url}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Editar Template - {editingTemplate && typeLabels[editingTemplate.type]}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {editingTemplate?.channel === 'email' && (
              <div>
                <Label>Assunto do E-mail</Label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Assunto do e-mail"
                />
              </div>
            )}

            <div>
              <Label>Título</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título da mensagem"
              />
            </div>

            <div>
              <Label>Corpo da Mensagem</Label>
              <Textarea
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                placeholder="Conteúdo da mensagem"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Texto do Botão (CTA)</Label>
                <Input
                  value={formData.cta_label}
                  onChange={(e) => setFormData({ ...formData, cta_label: e.target.value })}
                  placeholder="Ex: Ver planos"
                />
              </div>
              <div>
                <Label>URL do Botão</Label>
                <Input
                  value={formData.cta_url}
                  onChange={(e) => setFormData({ ...formData, cta_url: e.target.value })}
                  placeholder="Ex: /planos"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleRestore}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Restaurar padrão
              </Button>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setEditingTemplate(null)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={updateTemplate.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
