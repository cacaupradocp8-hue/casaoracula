import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

type Step = 'loading' | 'login' | 'accepting' | 'success' | 'error';

export default function AceitarConvitePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = searchParams.get('token');

  const [step, setStep] = useState<Step>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setStep('error');
      setErrorMsg('Link de convite inválido.');
      return;
    }

    if (user) {
      acceptInvite();
    } else {
      setStep('login');
    }
  }, [user, token]);

  const acceptInvite = async () => {
    if (!token) return;
    setStep('accepting');

    const { data, error } = await supabase.rpc('accept_client_invitation', {
      _token: token,
    });

    if (error) {
      console.error('Error accepting invite:', error);
      setStep('error');
      setErrorMsg('Não foi possível aceitar o convite. Tente novamente.');
      return;
    }

    const result = data as any;
    if (result?.error) {
      setStep('error');
      setErrorMsg(result.error);
      return;
    }

    setStep('success');
    toast.success('Convite aceito! Seu Jardim da Heroína está pronto 🌿');
  };

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) return;
    setSubmitting(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { nome: nome.trim() || undefined },
            emailRedirectTo: `${window.location.origin}/aceitar-convite?token=${token}`,
          },
        });
        if (error) throw error;
        toast.success('Conta criada! Verifique seu email para confirmar.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        // After login, useEffect will trigger acceptInvite
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro na autenticação');
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 'loading' || step === 'accepting') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto" />
          <p className="text-sm text-muted-foreground">
            {step === 'accepting' ? 'Vinculando seu Jardim...' : 'Carregando...'}
          </p>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="max-w-md w-full border-emerald-500/20">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-lg font-display text-foreground">Jardim Ativado 🌿</h2>
            <p className="text-sm text-muted-foreground">
              Seu espaço simbólico está pronto. Você pode acessá-lo a qualquer momento 
              pelo menu "Meu Jardim".
            </p>
            <Button
              onClick={() => navigate('/meu-jardim')}
              className="bg-emerald-600 hover:bg-emerald-700 gap-2"
            >
              <Leaf className="w-4 h-4" />
              Ir para Meu Jardim
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="max-w-md w-full border-destructive/20">
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
            <h2 className="text-lg font-display text-foreground">Convite Inválido</h2>
            <p className="text-sm text-muted-foreground">{errorMsg}</p>
            <Button variant="outline" onClick={() => navigate('/')}>
              Voltar ao início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Login/Signup step
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="max-w-md w-full border-emerald-500/20">
        <CardHeader className="text-center pb-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center mb-3">
            <Leaf className="w-6 h-6 text-emerald-500/60" />
          </div>
          <CardTitle className="text-base">Convite para o Jardim da Heroína</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Sua terapeuta preparou um espaço simbólico para você.
            {isSignUp ? ' Crie sua conta para acessar.' : ' Entre com sua conta.'}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {isSignUp && (
            <div>
              <Label className="text-xs">Seu nome</Label>
              <Input
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Como gostaria de ser chamada"
              />
            </div>
          )}
          <div>
            <Label className="text-xs">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <Label className="text-xs">Senha</Label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={isSignUp ? 'Crie uma senha' : 'Sua senha'}
            />
          </div>

          <Button
            onClick={handleAuth}
            disabled={submitting || !email.trim() || !password.trim()}
            className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Leaf className="w-4 h-4" />
            )}
            {isSignUp ? 'Criar conta e acessar Jardim' : 'Entrar e acessar Jardim'}
          </Button>

          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {isSignUp ? 'Já tenho conta → Entrar' : 'Não tenho conta → Criar'}
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
