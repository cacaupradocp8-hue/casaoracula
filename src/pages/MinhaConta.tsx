import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useAccessExpiration } from '@/hooks/useAccessExpiration';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { canAccessFeature } from '@/types/portal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  User,
  Crown,
  Shield,
  LogOut,
  KeyRound,
  Bell,
  ArrowUpRight,
  Sparkles,
  Calendar,
  Loader2,
  Mail,
  Smartphone,
  BookOpen,
  Clock,
  MessageSquare,
  Users,
} from 'lucide-react';

export default function MinhaConta() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { accessExpiresAt, subscriptionStatus, hasActiveSubscription } = useAccessExpiration();
  const { preferences, updatePreference } = useNotificationPreferences();
  const [resetLoading, setResetLoading] = useState(false);

  if (!user) return null;

  const isAssinante = canAccessFeature(user.portal, 'assinante');
  const initials = user.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  const handleResetPassword = async () => {
    setResetLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setResetLoading(false);
    if (error) {
      toast.error('Erro ao enviar email de redefinição.');
    } else {
      toast.success('Email de redefinição enviado. Verifique sua caixa.');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-lg space-y-6">

        {/* ─── SEÇÃO 1 — PERFIL ─── */}
        <Card className="overflow-hidden">
          <CardContent className="pt-8 pb-6 flex flex-col items-center text-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary/30">
              {user.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt={user.name} />
              ) : null}
              <AvatarFallback className="text-xl font-display bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <h2 className="text-xl font-display font-bold">{user.name || 'Sem nome'}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>

            <Button variant="outline" size="sm" asChild>
              <Link to="/onboarding">
                <User className="w-4 h-4 mr-2" />
                Editar Perfil
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* ─── SEÇÃO 2 — PLANO E ACESSO ─── */}
        <Card>
          <CardContent className="pt-6 pb-6 space-y-5">
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-display font-bold">Plano e Acesso</h3>
            </div>

            {isAssinante ? (
              /* ── ASSINANTE ── */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className="bg-primary/20 text-primary border-primary/40">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Assinante
                  </Badge>
                </div>

                 <div className="flex items-center justify-between text-sm">
                   <span className="text-muted-foreground">Plano ativo</span>
                   <span className="font-medium">{subscriptionStatus === 'active' ? 'Ativo' : subscriptionStatus || '—'}</span>
                 </div>

                {accessExpiresAt && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Renovação
                    </span>
                    <span className="font-medium">
                      {format(accessExpiresAt, "d 'de' MMM 'de' yyyy", { locale: ptBR })}
                    </span>
                  </div>
                )}

                <div className="grid gap-2 pt-2">
                  <Button className="w-full" asChild>
                    <Link to="/clube-livro">
                      Ir para Portal Atual
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/assinatura">
                      Gerenciar Assinatura
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                    asChild
                  >
                    <a href={`mailto:suporte@casaoracula.com.br?subject=Solicita%C3%A7%C3%A3o%20de%20Cancelamento&body=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20o%20cancelamento%20da%20minha%20assinatura.%0A%0AEmail%3A%20${encodeURIComponent(user.email)}`}>
                      Solicitar Cancelamento
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              /* ── GRATUITO ── */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="outline">Gratuito</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                   Você está no modo Gratuito.
                 </p>
                 <div className="grid gap-2 pt-2">
                   <Button className="w-full" asChild>
                     <Link to="/planos-clube">
                       <ArrowUpRight className="w-4 h-4 mr-2" />
                       Ver Planos
                     </Link>
                   </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ─── SEÇÃO 3 — PREFERÊNCIAS DE NOTIFICAÇÃO ─── */}
        <Card>
          <CardContent className="pt-6 pb-6 space-y-5">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-display font-bold">Notificações</h3>
            </div>

            {/* Canais */}
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Canais</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="pref-inapp" className="flex items-center gap-2 cursor-pointer text-sm">
                  <Bell className="w-4 h-4 text-muted-foreground" />
                  In-app (sino)
                </Label>
                <Switch id="pref-inapp" checked={preferences.in_app} onCheckedChange={(v) => updatePreference({ in_app: v })} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pref-email" className="flex items-center gap-2 cursor-pointer text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Email
                </Label>
                <Switch id="pref-email" checked={preferences.email} onCheckedChange={(v) => updatePreference({ email: v })} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pref-push" className="flex items-center gap-2 cursor-pointer text-sm">
                  <Smartphone className="w-4 h-4 text-muted-foreground" />
                  Push (navegador)
                </Label>
                <Switch id="pref-push" checked={preferences.push} onCheckedChange={(v) => updatePreference({ push: v })} />
              </div>
            </div>

            {/* Tipos de evento */}
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium pt-2">Eventos</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="pref-conteudo" className="flex items-center gap-2 cursor-pointer text-sm">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  Novo conteúdo
                </Label>
                <Switch id="pref-conteudo" checked={preferences.novo_conteudo} onCheckedChange={(v) => updatePreference({ novo_conteudo: v })} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pref-expiracao" className="flex items-center gap-2 cursor-pointer text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  Vencimento de assinatura
                </Label>
                <Switch id="pref-expiracao" checked={preferences.expiracao_assinatura} onCheckedChange={(v) => updatePreference({ expiracao_assinatura: v })} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pref-suporte" className="flex items-center gap-2 cursor-pointer text-sm">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  Mensagens do suporte
                </Label>
                <Switch id="pref-suporte" checked={preferences.mensagens_suporte} onCheckedChange={(v) => updatePreference({ mensagens_suporte: v })} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pref-comunidade" className="flex items-center gap-2 cursor-pointer text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  Atividade na comunidade
                </Label>
                <Switch id="pref-comunidade" checked={preferences.atividade_comunidade} onCheckedChange={(v) => updatePreference({ atividade_comunidade: v })} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── SEÇÃO 4 — SEGURANÇA ─── */}
        <Card>
          <CardContent className="pt-6 pb-6 space-y-5">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-display font-bold">Segurança</h3>
            </div>

            {/* Alterar senha */}
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleResetPassword}
              disabled={resetLoading}
            >
              {resetLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <KeyRound className="w-4 h-4 mr-2" />
              )}
              Alterar Senha
            </Button>

            {/* Sair */}
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair da Conta
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
