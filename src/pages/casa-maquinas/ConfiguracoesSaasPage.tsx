import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { useAppSettings } from '@/hooks/useAppSettings';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import {
  User, Settings, CreditCard, HelpCircle, Camera, Save, Loader2,
  KeyRound, Bell, Mail, Shield, ChevronDown, ChevronUp,
  ExternalLink, MessageCircle, Send, Headphones,
} from 'lucide-react';

const ESPECIALIDADES = [
  'Psicologia Analítica', 'Arteterapia', 'Constelação Familiar',
  'Terapia Corporal', 'Mitologia & Simbolismo', 'Astrologia Terapêutica',
  'Tarot Clínico', 'Danças Circulares', 'Trabalho com Sonhos',
  'Círculos de Mulheres', 'Narroterapia', 'Respiração & Corpo',
];

const VOZ_OPTIONS = [
  'Acolhedora', 'Direta', 'Poética', 'Investigativa', 'Ritualística', 'Contemplativa',
];

const AGENT_ID = 'a0000000-0000-0000-0000-000000000001';

const FAQ_ITEMS = [
  { q: 'Como começo a usar a Casa das Máquinas?', a: 'Acesse o Dashboard para ter uma visão geral. A partir dali, você pode cadastrar clientes, iniciar sessões e acessar ferramentas.' },
  { q: 'Como cadastrar uma nova cliente?', a: 'Acesse "Clientes" no menu lateral e clique em "Nova Cliente". Preencha os dados e ela aparecerá no seu painel.' },
  { q: 'Posso usar as ferramentas na Sala de Treinamento?', a: 'Sim! Se você é Aluna em Formação, a Sala de Treinamento permite praticar com clientes fictícias.' },
  { q: 'O que é a Biblioteca de Intervenções?', a: 'É o repositório de ferramentas clínicas estruturadas: mapeamentos, protocolos, diários e instrumentos simbólicos.' },
  { q: 'Como altero minha senha?', a: 'Na aba "Conta", clique em "Enviar email de redefinição". Você receberá um link para criar uma nova senha.' },
  { q: 'Preciso de ajuda com pagamento', a: 'Para questões financeiras, fale diretamente pelo WhatsApp no botão abaixo.' },
];

interface ChatMessage { role: 'user' | 'assistant'; content: string; }

export default function ConfiguracoesSaasPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-display font-bold text-foreground">Configurações</h1>
          <p className="text-sm text-muted-foreground">Gerencie seu perfil, conta e preferências.</p>
        </div>

        <Tabs defaultValue="perfil" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="perfil" className="text-xs gap-1"><User className="w-3.5 h-3.5 hidden sm:block" />Perfil</TabsTrigger>
            <TabsTrigger value="conta" className="text-xs gap-1"><Settings className="w-3.5 h-3.5 hidden sm:block" />Conta</TabsTrigger>
            <TabsTrigger value="historico" className="text-xs gap-1"><CreditCard className="w-3.5 h-3.5 hidden sm:block" />Histórico</TabsTrigger>
            <TabsTrigger value="ajuda" className="text-xs gap-1"><HelpCircle className="w-3.5 h-3.5 hidden sm:block" />Ajuda</TabsTrigger>
          </TabsList>

          <TabsContent value="perfil"><TabPerfil /></TabsContent>
          <TabsContent value="conta"><TabConta /></TabsContent>
          <TabsContent value="historico"><TabHistorico /></TabsContent>
          <TabsContent value="ajuda"><TabAjuda /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/* ─── Tab: Meu Perfil ─── */
function TabPerfil() {
  const { user } = useAuth();
  const [nome, setNome] = useState(user?.name || '');
  const [bio, setBio] = useState('');
  const [cidade, setCidade] = useState('');
  const [vozConducao, setVozConducao] = useState('');
  const [especializacoes, setEspecializacoes] = useState<string[]>([]);
  const [perfilPublico, setPerfilPublico] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: fp } = await supabase
        .from('facilitadora_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (fp) {
        setBio(fp.bio || '');
        setCidade(fp.cidade || '');
        setVozConducao(fp.voz_conducao || '');
        setEspecializacoes(fp.especializacoes || []);
        setPerfilPublico(fp.perfil_publico || false);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Imagem deve ter no máximo 2MB.'); return; }
    setAvatarUploading(true);
    const ext = file.name.split('.').pop();
    const path = `avatars/${user.id}.${ext}`;
    const { error: uploadErr } = await supabase.storage.from('content-images').upload(path, file, { upsert: true });
    if (uploadErr) { toast.error('Erro ao enviar imagem.'); setAvatarUploading(false); return; }
    const { data: urlData } = supabase.storage.from('content-images').getPublicUrl(path);
    await supabase.from('profiles').update({ avatar_url: urlData.publicUrl }).eq('id', user.id);
    toast.success('Foto atualizada! Recarregue para ver.');
    setAvatarUploading(false);
  };

  const toggleEspec = (e: string) => {
    setEspecializacoes(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    // Update profile name
    await supabase.from('profiles').update({ nome }).eq('id', user.id);
    // Upsert facilitadora profile
    const { error } = await supabase.from('facilitadora_profiles').upsert({
      user_id: user.id,
      bio, cidade, voz_conducao: vozConducao,
      especializacoes, perfil_publico: perfilPublico,
    }, { onConflict: 'user_id' });
    setSaving(false);
    if (error) { toast.error('Erro ao salvar perfil.'); return; }
    toast.success('Perfil salvo com sucesso.');
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-4 mt-4">
      {/* Avatar */}
      <Card>
        <CardContent className="pt-6 flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20 border-2 border-primary/20">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-display">
                {user?.name?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1.5 hover:bg-primary/90 transition"
              disabled={avatarUploading}
            >
              {avatarUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </div>
          <p className="text-sm text-muted-foreground">Clique no ícone para alterar a foto</p>
        </CardContent>
      </Card>

      {/* Dados pessoais */}
      <Card>
        <CardHeader><CardTitle className="text-base">Dados Pessoais</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nome</Label>
            <Input value={nome} onChange={e => setNome(e.target.value)} maxLength={100} />
          </div>
          <div className="space-y-1.5">
            <Label>Bio</Label>
            <Textarea value={bio} onChange={e => setBio(e.target.value)} maxLength={500} rows={3} placeholder="Uma breve apresentação…" />
          </div>
          <div className="space-y-1.5">
            <Label>Cidade</Label>
            <Input value={cidade} onChange={e => setCidade(e.target.value)} maxLength={100} placeholder="Ex: São Paulo, SP" />
          </div>
        </CardContent>
      </Card>

      {/* Voz de Condução */}
      <Card>
        <CardHeader><CardTitle className="text-base">Voz de Condução</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {VOZ_OPTIONS.map(v => (
              <button
                key={v}
                onClick={() => setVozConducao(vozConducao === v ? '' : v)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  vozConducao === v
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border bg-secondary/50 hover:bg-secondary text-foreground'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Especializações */}
      <Card>
        <CardHeader><CardTitle className="text-base">Especializações</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {ESPECIALIDADES.map(e => (
              <button
                key={e}
                onClick={() => toggleEspec(e)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  especializacoes.includes(e)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border bg-secondary/50 hover:bg-secondary text-foreground'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Perfil Público */}
      <Card>
        <CardContent className="pt-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Perfil Público</p>
            <p className="text-xs text-muted-foreground">Visível no diretório de facilitadoras</p>
          </div>
          <Switch checked={perfilPublico} onCheckedChange={setPerfilPublico} />
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
        Salvar Perfil
      </Button>
    </div>
  );
}

/* ─── Tab: Conta ─── */
function TabConta() {
  const { user, logout } = useAuth();
  const { preferences, updatePreference } = useNotificationPreferences();
  const [resetLoading, setResetLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!user) return;
    setResetLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setResetLoading(false);
    if (error) toast.error('Erro ao enviar email.');
    else toast.success('Email de redefinição enviado.');
  };

  return (
    <div className="space-y-4 mt-4">
      {/* Email */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Mail className="w-4 h-4" />Email</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Para alterar seu email, entre em contato com o suporte.</p>
        </CardContent>
      </Card>

      {/* Senha */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><KeyRound className="w-4 h-4" />Senha</CardTitle></CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleResetPassword} disabled={resetLoading} className="w-full">
            {resetLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Shield className="w-4 h-4 mr-2" />}
            Enviar email de redefinição
          </Button>
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Bell className="w-4 h-4" />Notificações</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'novo_conteudo' as const, label: 'Novidades por email', desc: 'Portais, travessias e conteúdos novos' },
            { key: 'email' as const, label: 'Emails gerais', desc: 'Comunicações e lembretes' },
            { key: 'push' as const, label: 'Notificações push', desc: 'Alertas no navegador' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch
                checked={preferences?.[item.key] ?? false}
                onCheckedChange={v => updatePreference({ [item.key]: v })}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sair */}
      <Button variant="destructive" onClick={logout} className="w-full">
        Sair da Conta
      </Button>
    </div>
  );
}

/* ─── Tab: Histórico ─── */
function TabHistorico() {
  const { user } = useAuth();
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setSubs(data || []);
      setLoading(false);
    };
    load();
  }, [user]);

  const statusLabel: Record<string, string> = {
    active: 'Ativa', canceled: 'Cancelada', past_due: 'Pendente',
    expired: 'Expirada', trialing: 'Teste',
  };
  const statusColor: Record<string, string> = {
    active: 'bg-green-500/10 text-green-600 border-green-500/20',
    canceled: 'bg-destructive/10 text-destructive border-destructive/20',
    past_due: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><CreditCard className="w-4 h-4" />Histórico de Assinaturas</CardTitle></CardHeader>
        <CardContent>
          {subs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Nenhuma assinatura encontrada.</p>
          ) : (
            <div className="space-y-3">
              {subs.map(s => (
                <div key={s.id} className="border border-border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{s.provider}</span>
                    <Badge variant="outline" className={statusColor[s.status] || ''}>
                      {statusLabel[s.status] || s.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    <p>Início: {s.current_period_start ? format(new Date(s.current_period_start), "dd 'de' MMM yyyy", { locale: ptBR }) : '—'}</p>
                    {s.current_period_end && <p>Renovação: {format(new Date(s.current_period_end), "dd 'de' MMM yyyy", { locale: ptBR })}</p>}
                    {s.next_billing_date && <p>Próxima cobrança: {format(new Date(s.next_billing_date), "dd 'de' MMM yyyy", { locale: ptBR })}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── Tab: Ajuda ─── */
function TabAjuda() {
  const { user } = useAuth();
  const { getSetting } = useAppSettings();
  const whatsappUrl = getSetting('support_whatsapp_url', '');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: ChatMessage = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { messages: newMessages, context: { agentId: AGENT_ID, userId: user?.id, contextType: 'suporte' } },
      });
      if (error) throw error;
      setMessages(prev => [...prev, { role: 'assistant', content: data?.content || 'Desculpe, tente novamente.' }]);
    } catch {
      toast.error('Erro ao enviar mensagem.');
    } finally { setIsLoading(false); }
  };

  return (
    <div className="space-y-4 mt-4">
      {/* Chat IA */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><MessageCircle className="w-4 h-4" />Fale com a Guardiã</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {messages.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-secondary text-foreground rounded-bl-md'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:m-0">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-2.5">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
          <form onSubmit={e => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
            <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Digite sua dúvida…" disabled={isLoading} className="flex-1" />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}><Send className="w-4 h-4" /></Button>
          </form>
        </CardContent>
      </Card>

      {/* WhatsApp */}
      {whatsappUrl && (
        <Card>
          <CardContent className="pt-6 space-y-2">
            <p className="text-sm font-medium">Falar no WhatsApp</p>
            <p className="text-xs text-muted-foreground">Para dúvidas de acesso, pagamento e suporte técnico.</p>
            <Button className="w-full" onClick={() => window.open(whatsappUrl, '_blank')}>
              <ExternalLink className="w-4 h-4 mr-2" />Abrir WhatsApp
            </Button>
          </CardContent>
        </Card>
      )}

      {/* FAQ */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><HelpCircle className="w-4 h-4" />Perguntas Frequentes</CardTitle></CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-3 text-sm font-medium text-left hover:text-primary transition-colors"
                >
                  {item.q}
                  {openFaq === i ? <ChevronUp className="w-4 h-4 shrink-0 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" />}
                </button>
                {openFaq === i && <p className="text-sm text-muted-foreground pb-3 pl-1">{item.a}</p>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
