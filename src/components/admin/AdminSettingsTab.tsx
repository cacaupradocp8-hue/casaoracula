import { useState } from 'react';
import { useAppSettingsAdmin, AppSetting } from '@/hooks/useAppSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Settings, ExternalLink } from 'lucide-react';
import { AmbientAudioManager } from './AmbientAudioManager';
import { WebhookDebugPanel } from './WebhookDebugPanel';

export function AdminSettingsTab() {
  const { settings, isLoading, updateSetting, createSetting, deleteSetting, refetch } = useAppSettingsAdmin();
  const { toast } = useToast();
  const [editingSetting, setEditingSetting] = useState<AppSetting | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newSetting, setNewSetting] = useState({ key: '', value: '', description: '' });

  const handleEdit = (setting: AppSetting) => {
    setEditingSetting(setting);
    setEditValue(setting.value);
  };

  const handleSave = async () => {
    if (!editingSetting) return;
    
    const success = await updateSetting(editingSetting.key, editValue);
    if (success) {
      toast({ title: 'Configuração atualizada' });
      setEditingSetting(null);
    } else {
      toast({ title: 'Erro ao atualizar', variant: 'destructive' });
    }
  };

  const handleCreate = async () => {
    if (!newSetting.key || !newSetting.value) {
      toast({ title: 'Preencha a chave e o valor', variant: 'destructive' });
      return;
    }

    const success = await createSetting(newSetting.key, newSetting.value, newSetting.description);
    if (success) {
      toast({ title: 'Configuração criada' });
      setIsCreateOpen(false);
      setNewSetting({ key: '', value: '', description: '' });
    } else {
      toast({ title: 'Erro ao criar', variant: 'destructive' });
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Excluir a configuração "${key}"?`)) return;
    
    const success = await deleteSetting(key);
    if (success) {
      toast({ title: 'Configuração excluída' });
    } else {
      toast({ title: 'Erro ao excluir', variant: 'destructive' });
    }
  };

  const webhookUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rockty-webhook`;

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Webhook Debug Panel */}
      <WebhookDebugPanel />

      {/* Ambient Audio Manager - unified panel for all pages */}
      <AmbientAudioManager />

      {/* Webhook Info Card */}
      <Card className="bg-secondary/30 border-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Webhook Rockty
          </CardTitle>
          <CardDescription>
            Configure este URL no painel da Rockty para receber eventos de assinatura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input 
              readOnly 
              value={webhookUrl}
              className="font-mono text-sm"
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(webhookUrl);
                toast({ title: 'URL copiada!' });
              }}
            >
              Copiar
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Eventos suportados: subscription_created, subscription_renewed, payment_failed, subscription_canceled, subscription_expired
          </p>
        </CardContent>
      </Card>

      {/* Settings Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configurações do App
            </CardTitle>
            <CardDescription>
              Edite textos, links e configurações gerais do aplicativo
            </CardDescription>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Nova Configuração
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Configuração</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Chave (snake_case)</Label>
                  <Input
                    value={newSetting.key}
                    onChange={(e) => setNewSetting(prev => ({ ...prev, key: e.target.value }))}
                    placeholder="ex: cta_whatsapp_number"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Valor</Label>
                  <Textarea
                    value={newSetting.value}
                    onChange={(e) => setNewSetting(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="Valor da configuração"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descrição (opcional)</Label>
                  <Input
                    value={newSetting.description}
                    onChange={(e) => setNewSetting(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição para referência"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreate}>Criar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chave</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {settings.map((setting) => (
                <TableRow key={setting.id}>
                  <TableCell className="font-mono text-sm">{setting.key}</TableCell>
                  <TableCell className="max-w-[300px] truncate">{setting.value}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{setting.description}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(setting)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(setting.key)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingSetting} onOpenChange={(open) => !open && setEditingSetting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar: {editingSetting?.key}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Valor</Label>
              <Textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                rows={4}
              />
            </div>
            {editingSetting?.description && (
              <p className="text-sm text-muted-foreground">{editingSetting.description}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSetting(null)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
