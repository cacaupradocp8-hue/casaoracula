import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, CheckCircle, Copy, Leaf } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  cliente: any;
  onUpdate: () => void;
}

export function ClienteConviteSection({ cliente, onUpdate }: Props) {
  const { user } = useAuth();
  const [email, setEmail] = useState(cliente.email || '');
  const [saving, setSaving] = useState(false);
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

  const handleSendInvite = async () => {
    if (!user || !email.trim()) return;
    setSaving(true);

    try {
      // Save email if not saved yet
      await supabase
        .from('clientes')
        .update({ 
          email: email.trim().toLowerCase(),
          invited_by: user.id,
          invitation_sent_at: new Date().toISOString(),
        })
        .eq('id', cliente.id);

      // Create invitation token
      const { data: convite, error } = await supabase
        .from('co_convites')
        .insert({
          cliente_id: cliente.id,
          terapeuta_id: user.id,
          email: email.trim().toLowerCase(),
        })
        .select('token')
        .single();

      if (error) throw error;

      const link = `${window.location.origin}/aceitar-convite?token=${convite.token}`;
      setInviteLink(link);
      toast.success('Convite gerado! Copie o link e envie para sua cliente.');
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
          Informe o email da cliente para gerar um link de convite. 
          Ao aceitar, ela terá acesso ao seu próprio Jardim da Heroína.
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
            {!hasEmail && (
              <Button size="sm" variant="outline" onClick={handleSaveEmail} disabled={saving || !email.trim()}>
                Salvar
              </Button>
            )}
          </div>
        </div>

        {email.trim() && (
          <Button
            onClick={handleSendInvite}
            disabled={saving}
            className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Gerar Link de Convite
          </Button>
        )}

        {inviteLink && (
          <div className="rounded-lg bg-muted/30 p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">
                Link gerado
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground break-all font-mono">{inviteLink}</p>
            <Button size="sm" variant="outline" onClick={copyLink} className="gap-1 w-full">
              <Copy className="w-3 h-3" />
              Copiar link
            </Button>
            <p className="text-[10px] text-muted-foreground italic">
              Envie este link para sua cliente por WhatsApp, email ou como preferir. 
              Ela precisará criar uma conta para acessar o Jardim.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
