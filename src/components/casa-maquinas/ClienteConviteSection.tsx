import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, CheckCircle, Copy, Leaf, MessageCircle, Mail, Link2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  cliente: any;
  onUpdate: () => void;
}

export function ClienteConviteSection({ cliente, onUpdate }: Props) {
  const { user } = useAuth();
  const [email, setEmail] = useState(cliente.email || '');
  const [saving, setSaving] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  const isLinked = !!cliente.client_user_id;
  const hasEmail = !!cliente.email;

  const handleSaveEmail = async () => {
    if (!user || !email.trim()) return;
    setSaving(true);
    const { error } = await supabase
      .from('clientes')
      .update({ email: email.trim().toLowerCase() })
      .eq('id', cliente.id);

    if (error) {
      toast.error('Erro ao salvar email');
    } else {
      toast.success('Email salvo');
      onUpdate();
    }
    setSaving(false);
  };

  const handleGenerateLink = async () => {
    if (!user) return;
    setSaving(true);

    try {
      if (email.trim()) {
        await supabase
          .from('clientes')
          .update({ 
            email: email.trim().toLowerCase(),
            invited_by: user.id,
            invitation_sent_at: new Date().toISOString(),
          })
          .eq('id', cliente.id);
      }

      const { data: convite, error } = await supabase
        .from('co_convites')
        .insert({
          cliente_id: cliente.id,
          terapeuta_id: user.id,
          email: email.trim().toLowerCase() || null,
        })
        .select('token')
        .single();

      if (error) throw error;

      const link = `${window.location.origin}/aceitar-convite?token=${convite.token}`;
      setInviteLink(link);
      toast.success('Link de convite gerado!');
      onUpdate();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao gerar convite');
    } finally {
      setSaving(false);
    }
  };

  const copyLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      toast.success('Link copiado!');
    }
  };

  const sendViaWhatsApp = () => {
    if (!inviteLink) return;
    const nomeCliente = cliente.nome || 'querida';
    const message = encodeURIComponent(
      `🌿 Olá, ${nomeCliente}!\n\nPreparei um espaço especial para você — o Jardim da Heroína.\n\nÉ um lugar seguro de integração e continuidade do seu processo terapêutico.\n\nAcesse aqui: ${inviteLink}\n\nVocê precisará criar uma conta para entrar. 💚`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
    toast.success('WhatsApp aberto!');
  };

  const sendViaEmail = async () => {
    if (!inviteLink || !email.trim()) return;
    setSendingEmail(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-client-invitation', {
        body: {
          cliente_id: cliente.id,
          email: email.trim().toLowerCase(),
          nome_cliente: cliente.nome || undefined,
        },
      });

      if (error) throw error;

      toast.success('Email de convite enviado!');
      onUpdate();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao enviar email. Verifique se o serviço de email está configurado.');
    } finally {
      setSendingEmail(false);
    }
  };

  if (isLinked) {
    return (
      <Card className="border-emerald-500/20 bg-emerald-950/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <p className="text-sm text-emerald-400">
              Cliente vinculada — acesso ao Jardim da Heroína ativo
            </p>
          </div>
          {cliente.email && (
            <p className="text-xs text-muted-foreground mt-1 ml-6">{cliente.email}</p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/30 bg-card/70">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2 text-foreground/80">
          <Leaf className="w-4 h-4 text-emerald-500/60" />
          Convite para o Jardim
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Informe o email da cliente e gere um link personalizado. 
          Envie por WhatsApp, email ou copie o link.
        </p>

        <div className="space-y-2">
          <Label className="text-xs">Email da cliente</Label>
          <div className="flex gap-2">
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="cliente@email.com"
              className="flex-1"
            />
            {!hasEmail && email.trim() && (
              <Button size="sm" variant="outline" onClick={handleSaveEmail} disabled={saving || !email.trim()}>
                Salvar
              </Button>
            )}
          </div>
        </div>

        {!inviteLink && (
          <Button
            onClick={handleGenerateLink}
            disabled={saving}
            className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Link2 className="w-4 h-4" />
            )}
            Gerar Link de Convite
          </Button>
        )}

        {inviteLink && (
          <div className="rounded-lg bg-muted/30 p-3 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">
                Link personalizado gerado
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground break-all font-mono bg-background/50 p-2 rounded">
              {inviteLink}
            </p>

            <div className="grid grid-cols-3 gap-2">
              <Button size="sm" variant="outline" onClick={copyLink} className="gap-1 text-xs">
                <Copy className="w-3 h-3" />
                Copiar
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={sendViaWhatsApp} 
                className="gap-1 text-xs text-green-400 border-green-500/30 hover:bg-green-500/10"
              >
                <MessageCircle className="w-3 h-3" />
                WhatsApp
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={sendViaEmail} 
                disabled={sendingEmail || !email.trim()}
                className="gap-1 text-xs"
                title={!email.trim() ? 'Informe o email para enviar' : ''}
              >
                {sendingEmail ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Mail className="w-3 h-3" />
                )}
                Email
              </Button>
            </div>

            {!email.trim() && (
              <p className="text-[10px] text-amber-400/80 italic">
                Informe o email acima para habilitar o envio por email.
              </p>
            )}

            <p className="text-[10px] text-muted-foreground italic">
              Ao acessar o link, a cliente criará sua conta e terá acesso ao Jardim da Heroína.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
