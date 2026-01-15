import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Send, Loader2, Users, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Campaign {
  id: string;
  channel: 'email' | 'in_app';
  name: string;
  subject: string | null;
  title: string;
  body: string;
  cta_label: string | null;
  cta_url: string | null;
  segment_json: {
    portals?: string[];
    subscription_status?: string[];
    expired_days_ago?: number;
  };
  status: 'draft' | 'sending' | 'done' | 'failed';
  total_sent: number;
  total_failed: number;
  created_at: string;
  sent_at: string | null;
}

interface Template {
  id: string;
  channel: string;
  type: string;
  subject: string | null;
  title: string;
  body: string;
  cta_label: string | null;
  cta_url: string | null;
}

const MAX_RECIPIENTS = 500;

export function CommunicationCampaigns() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [recipientCount, setRecipientCount] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    channel: 'in_app' as 'email' | 'in_app',
    name: '',
    subject: '',
    title: '',
    body: '',
    cta_label: '',
    cta_url: '',
    portals: [] as string[],
    subscription_status: [] as string[],
    expired_days_ago: ''
  });

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['message-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('message_campaigns')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Campaign[];
    }
  });

  const { data: templates = [] } = useQuery({
    queryKey: ['message-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('message_templates')
        .select('*')
        .eq('is_enabled', true);
      
      if (error) throw error;
      return data as Template[];
    }
  });

  const countRecipients = async () => {
    let query = supabase.from('profiles').select('id', { count: 'exact', head: true });
    
    if (formData.portals.length > 0) {
      // Need to join with user_roles
      const portalValues = formData.portals as Array<'visitante' | 'pre_iniciada' | 'iniciada' | 'admin'>;
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .in('portal', portalValues);
      
      if (userRoles) {
        const userIds = userRoles.map(r => r.user_id);
        query = query.in('id', userIds);
      }
    }
    
    if (formData.subscription_status.length > 0) {
      query = query.in('subscription_status', formData.subscription_status);
    }
    
    if (formData.expired_days_ago) {
      const daysAgo = parseInt(formData.expired_days_ago);
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - daysAgo);
      query = query.lte('access_expires_at', targetDate.toISOString());
    }
    
    const { count } = await query;
    setRecipientCount(count || 0);
  };

  const loadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setFormData({
        ...formData,
        channel: template.channel as 'email' | 'in_app',
        subject: template.subject || '',
        title: template.title,
        body: template.body,
        cta_label: template.cta_label || '',
        cta_url: template.cta_url || ''
      });
    }
  };

  const createAndSendCampaign = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Usuário não autenticado');
      
      // Create campaign
      const { data: campaign, error: createError } = await supabase
        .from('message_campaigns')
        .insert({
          channel: formData.channel,
          name: formData.name,
          subject: formData.subject || null,
          title: formData.title,
          body: formData.body,
          cta_label: formData.cta_label || null,
          cta_url: formData.cta_url || null,
          segment_json: {
            portals: formData.portals.length > 0 ? formData.portals : undefined,
            subscription_status: formData.subscription_status.length > 0 ? formData.subscription_status : undefined,
            expired_days_ago: formData.expired_days_ago ? parseInt(formData.expired_days_ago) : undefined
          },
          status: 'sending',
          created_by: user.id
        })
        .select()
        .single();
      
      if (createError) throw createError;
      
      // Get recipients
      let recipientsQuery = supabase.from('profiles').select('id, email');
      
      if (formData.portals.length > 0) {
        const portalValues = formData.portals as Array<'visitante' | 'pre_iniciada' | 'iniciada' | 'admin'>;
        const { data: userRoles } = await supabase
          .from('user_roles')
          .select('user_id')
          .in('portal', portalValues);
        
        if (userRoles) {
          const userIds = userRoles.map(r => r.user_id);
          recipientsQuery = recipientsQuery.in('id', userIds);
        }
      }
      
      if (formData.subscription_status.length > 0) {
        recipientsQuery = recipientsQuery.in('subscription_status', formData.subscription_status);
      }
      
      if (formData.expired_days_ago) {
        const daysAgo = parseInt(formData.expired_days_ago);
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - daysAgo);
        recipientsQuery = recipientsQuery.lte('access_expires_at', targetDate.toISOString());
      }
      
      const { data: recipients } = await recipientsQuery.limit(MAX_RECIPIENTS);
      
      if (!recipients || recipients.length === 0) {
        throw new Error('Nenhum destinatário encontrado');
      }
      
      let successCount = 0;
      let failCount = 0;
      
      // Send notifications (in_app)
      if (formData.channel === 'in_app') {
        for (const recipient of recipients) {
          try {
            // Create notification
            const { error: notifError } = await supabase
              .from('notifications')
              .insert({
                user_id: recipient.id,
                type: 'info',
                title: formData.title,
                body: formData.body,
                cta_label: formData.cta_label || null,
                cta_url: formData.cta_url || null
              });
            
            // Log
            await supabase.from('message_logs').insert({
              user_id: recipient.id,
              channel: 'in_app',
              type: 'manual',
              campaign_id: campaign.id,
              success: !notifError,
              error_message: notifError?.message
            });
            
            if (notifError) {
              failCount++;
            } else {
              successCount++;
            }
          } catch (e) {
            failCount++;
          }
        }
      }
      
      // Update campaign status
      await supabase
        .from('message_campaigns')
        .update({
          status: 'done',
          total_sent: successCount,
          total_failed: failCount,
          sent_at: new Date().toISOString()
        })
        .eq('id', campaign.id);
      
      return { successCount, failCount };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['message-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['message-logs'] });
      toast({
        title: 'Campanha enviada',
        description: `${data.successCount} enviados, ${data.failCount} falhas`
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: 'Erro ao enviar campanha',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const resetForm = () => {
    setFormData({
      channel: 'in_app',
      name: '',
      subject: '',
      title: '',
      body: '',
      cta_label: '',
      cta_url: '',
      portals: [],
      subscription_status: [],
      expired_days_ago: ''
    });
    setRecipientCount(null);
  };

  const handlePortalToggle = (portal: string) => {
    setFormData(prev => ({
      ...prev,
      portals: prev.portals.includes(portal)
        ? prev.portals.filter(p => p !== portal)
        : [...prev.portals, portal]
    }));
    setRecipientCount(null);
  };

  const handleStatusToggle = (status: string) => {
    setFormData(prev => ({
      ...prev,
      subscription_status: prev.subscription_status.includes(status)
        ? prev.subscription_status.filter(s => s !== status)
        : [...prev.subscription_status, status]
    }));
    setRecipientCount(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'done':
        return <Badge className="bg-green-500">Enviada</Badge>;
      case 'sending':
        return <Badge className="bg-yellow-500">Enviando</Badge>;
      case 'failed':
        return <Badge variant="destructive">Falhou</Badge>;
      default:
        return <Badge variant="secondary">Rascunho</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Campanhas Manuais</h3>
          <p className="text-sm text-muted-foreground">
            Envie mensagens segmentadas para grupos de usuários
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Campanha
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Campanha Manual</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <Label>Nome da Campanha</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Reativação Janeiro 2026"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Canal</Label>
                    <Select
                      value={formData.channel}
                      onValueChange={(v: 'email' | 'in_app') => setFormData({ ...formData, channel: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in_app">In-App (Notificação)</SelectItem>
                        <SelectItem value="email" disabled>E-mail (em breve)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Usar Template</Label>
                    <Select onValueChange={loadTemplate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar template..." />
                      </SelectTrigger>
                      <SelectContent>
                        {templates
                          .filter(t => t.channel === formData.channel)
                          .map(t => (
                            <SelectItem key={t.id} value={t.id}>
                              {t.title}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium">Conteúdo da Mensagem</h4>
                
                <div>
                  <Label>Título</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Título da notificação"
                  />
                </div>

                <div>
                  <Label>Mensagem</Label>
                  <Textarea
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    placeholder="Conteúdo da mensagem"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Texto do Botão (opcional)</Label>
                    <Input
                      value={formData.cta_label}
                      onChange={(e) => setFormData({ ...formData, cta_label: e.target.value })}
                      placeholder="Ex: Ver mais"
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
              </div>

              {/* Segmentation */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium">Segmentação</h4>
                
                <div>
                  <Label className="mb-2 block">Portais</Label>
                  <div className="flex flex-wrap gap-4">
                    {['visitante', 'pre_iniciada', 'iniciada'].map(portal => (
                      <div key={portal} className="flex items-center gap-2">
                        <Checkbox
                          id={`portal-${portal}`}
                          checked={formData.portals.includes(portal)}
                          onCheckedChange={() => handlePortalToggle(portal)}
                        />
                        <label htmlFor={`portal-${portal}`} className="text-sm capitalize">
                          {portal.replace('_', '-')}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">Status da Assinatura</Label>
                  <div className="flex flex-wrap gap-4">
                    {['active', 'none', 'expired'].map(status => (
                      <div key={status} className="flex items-center gap-2">
                        <Checkbox
                          id={`status-${status}`}
                          checked={formData.subscription_status.includes(status)}
                          onCheckedChange={() => handleStatusToggle(status)}
                        />
                        <label htmlFor={`status-${status}`} className="text-sm capitalize">
                          {status}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Expirou há X dias (opcional)</Label>
                  <Input
                    type="number"
                    value={formData.expired_days_ago}
                    onChange={(e) => {
                      setFormData({ ...formData, expired_days_ago: e.target.value });
                      setRecipientCount(null);
                    }}
                    placeholder="Ex: 7"
                    className="w-32"
                  />
                </div>

                <Button variant="outline" onClick={countRecipients}>
                  <Users className="h-4 w-4 mr-2" />
                  Calcular destinatários
                </Button>

                {recipientCount !== null && (
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <Users className="h-5 w-5" />
                    <span className="font-medium">{recipientCount} destinatários</span>
                    {recipientCount > MAX_RECIPIENTS && (
                      <Badge variant="destructive" className="ml-2">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Limite: {MAX_RECIPIENTS}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={() => createAndSendCampaign.mutate()}
                  disabled={
                    createAndSendCampaign.isPending ||
                    !formData.name ||
                    !formData.title ||
                    !formData.body
                  }
                >
                  {createAndSendCampaign.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Criar e Enviar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Campaign List */}
      {isLoading ? (
        <div className="text-center py-8">Carregando campanhas...</div>
      ) : campaigns.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhuma campanha criada ainda
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {campaigns.map(campaign => (
            <Card key={campaign.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{campaign.name}</CardTitle>
                    <CardDescription>
                      {format(new Date(campaign.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </CardDescription>
                  </div>
                  {getStatusBadge(campaign.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm">
                  <span className="capitalize">{campaign.channel}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-green-600">{campaign.total_sent} enviados</span>
                  {campaign.total_failed > 0 && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-red-600">{campaign.total_failed} falhas</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                  {campaign.title}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
