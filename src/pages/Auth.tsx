import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(loginEmail, loginPassword);
    
    if (result.success) {
      toast({
        title: 'Bem-vinda de volta',
        description: 'A Casa ORÁCULA te recebe.',
      });
      navigate('/dashboard');
    } else {
      toast({
        title: 'Erro ao entrar',
        description: result.error,
        variant: 'destructive',
      });
    }
    
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!signupName.trim()) {
      toast({
        title: 'Nome obrigatório',
        description: 'Por favor, informe seu nome.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    const result = await signup(signupEmail, signupPassword, signupName);
    
    if (result.success) {
      toast({
        title: 'Conta criada',
        description: 'Seja bem-vinda à Casa ORÁCULA.',
      });
      navigate('/dashboard');
    } else {
      toast({
        title: 'Erro ao criar conta',
        description: result.error,
        variant: 'destructive',
      });
    }
    
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotPasswordEmail.trim()) {
      toast({
        title: 'Email obrigatório',
        description: 'Por favor, informe seu email.',
        variant: 'destructive',
      });
      return;
    }

    setForgotPasswordLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
        redirectTo: redirectUrl,
      });

      if (error) {
        toast({
          title: 'Erro ao enviar email',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setForgotPasswordSent(true);
        toast({
          title: 'Email enviado!',
          description: 'Verifique sua caixa de entrada para redefinir sua senha.',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro. Tente novamente.',
        variant: 'destructive',
      });
    }

    setForgotPasswordLoading(false);
  };

  // Forgot password view
  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-background pattern-geometric flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-hero-radial" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
        
        <div className="relative w-full max-w-md">
          <button 
            onClick={() => {
              setShowForgotPassword(false);
              setForgotPasswordSent(false);
              setForgotPasswordEmail('');
            }}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Login</span>
          </button>

          <div className="text-center mb-8">
            <Logo size="lg" variant="vertical" className="justify-center mb-4" />
            <h1 className="text-2xl font-display text-gold mb-2">Recuperar Senha</h1>
            <p className="text-muted-foreground">
              Digite seu email para receber o link de recuperação
            </p>
          </div>

          <div className="glass rounded-2xl p-8 shadow-glow">
            {forgotPasswordSent ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium">Email Enviado!</h3>
                <p className="text-sm text-muted-foreground">
                  Enviamos um link de recuperação para <strong>{forgotPasswordEmail}</strong>.
                  Verifique sua caixa de entrada e spam.
                </p>
                <p className="text-xs text-muted-foreground">
                  O link expira em 1 hora.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordSent(false);
                    setForgotPasswordEmail('');
                  }}
                >
                  Voltar para Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" variant="gold" className="w-full" disabled={forgotPasswordLoading}>
                  {forgotPasswordLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar Link de Recuperação'
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Você receberá um email com instruções para redefinir sua senha.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pattern-geometric flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-hero-radial" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
      
      <div className="relative w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </Link>

        <div className="text-center mb-8">
          <Logo size="lg" variant="vertical" className="justify-center mb-4" />
          <p className="text-muted-foreground font-display italic">
            "A mulher de alma antiga encontra aqui sua linguagem"
          </p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-glow">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Criar Conta</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" variant="gold" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Entrando...' : 'Entrar na Casa'}
                </Button>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="w-full text-sm text-muted-foreground hover:text-gold transition-colors text-center"
                >
                  Esqueci minha senha
                </button>
              </form>

              <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Novo por aqui? Crie uma conta na aba "Criar Conta".
                </p>
              </div>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nome</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Seu nome"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" variant="gold" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Criando conta...' : 'Criar Conta'}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Ao criar conta, você inicia como Visitante (Portal 1). 
                  O acesso a outros Portais é liberado pela Guardiã.
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
