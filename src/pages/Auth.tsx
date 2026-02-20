import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import { loginSchema, signupSchema, forgotPasswordSchema, getValidationError } from '@/lib/validations';
import { useCopy } from '@/hooks/useCopy';
import portalMandala from '@/assets/portal-auth-mandala.jpg';
import heroPortal from '@/assets/hero-portal.jpg';

/* ─────────────────────────────────────────────
   NOTE: All background animations use pure CSS
   (no framer-motion infinite loops) to prevent
   layout shifts / page shake on mobile & PWA.
───────────────────────────────────────────── */

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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
  const { getCopyByKey } = useCopy();

  /* ── Google OAuth: detects custom domain to bypass auth-bridge ── */
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const isCustomDomain =
        !window.location.hostname.includes('lovable.app') &&
        !window.location.hostname.includes('lovableproject.com') &&
        !window.location.hostname.includes('localhost');

      if (isCustomDomain) {
        // Bypass auth-bridge for custom domains (prevents 404)
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/`,
            skipBrowserRedirect: true,
          },
        });
        if (error) throw error;
        if (data?.url) {
          const oauthUrl = new URL(data.url);
          const allowedHosts = ['accounts.google.com'];
          if (allowedHosts.some((h) => oauthUrl.hostname === h || oauthUrl.hostname.endsWith(`.${h}`))) {
            window.location.href = data.url;
          } else {
            throw new Error('URL de OAuth inválida.');
          }
        }
      } else {
        // Lovable preview domains — use managed auth
        const { error } = await lovable.auth.signInWithOAuth('google', {
          redirect_uri: window.location.origin,
        });
        if (error) throw error;
      }
    } catch (err) {
      toast({ title: 'Erro ao entrar com Google', description: String(err), variant: 'destructive' });
      setGoogleLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = loginSchema.safeParse({ email: loginEmail, password: loginPassword });
    const error = getValidationError(validation);
    if (error) {
      toast({ title: 'Erro de validação', description: error, variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    const result = await login(loginEmail, loginPassword);
    if (result.success) {
      toast({ title: 'Bem-vinda de volta', description: 'A Casa ORÁCULA te recebe.' });
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase.from('profiles').select('onboarding_completed').eq('id', user.id).single();
          if (!profile?.onboarding_completed) { navigate('/onboarding'); } else { navigate('/dashboard'); }
        } else { navigate('/dashboard'); }
      } catch (err) { console.error('Error checking onboarding status:', err); navigate('/dashboard'); }
    } else {
      toast({ title: 'Erro ao entrar', description: result.error, variant: 'destructive' });
    }
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = signupSchema.safeParse({ name: signupName, email: signupEmail, password: signupPassword });
    const error = getValidationError(validation);
    if (error) {
      toast({ title: 'Erro de validação', description: error, variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    const result = await signup(signupEmail, signupPassword, signupName);
    if (result.success) {
      supabase.functions.invoke('send-welcome-email', {
        body: { email: signupEmail, userName: signupName, includeWaitingListLink: true },
      }).then(({ error }) => { if (error) console.error('Error sending welcome email:', error); });
      toast({ title: 'Conta criada', description: 'Seja bem-vinda à Casa ORÁCULA.' });
      navigate('/onboarding');
    } else {
      toast({ title: 'Erro ao criar conta', description: result.error, variant: 'destructive' });
    }
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = forgotPasswordSchema.safeParse({ email: forgotPasswordEmail });
    const error = getValidationError(validation);
    if (error) {
      toast({ title: 'Erro de validação', description: error, variant: 'destructive' });
      return;
    }
    setForgotPasswordLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, { redirectTo: redirectUrl });
      if (error) {
        toast({ title: 'Erro ao enviar email', description: error.message, variant: 'destructive' });
      } else {
        setForgotPasswordSent(true);
        toast({ title: 'Email enviado!', description: 'Verifique sua caixa de entrada para redefinir sua senha.' });
      }
    } catch (error) {
      toast({ title: 'Erro', description: 'Ocorreu um erro. Tente novamente.', variant: 'destructive' });
    }
    setForgotPasswordLoading(false);
  };

  /* ─── Static background — zero JS animation loops ─── */
  const StaticBg = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Base image */}
      <img
        src={heroPortal}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ opacity: 0.22 }}
        fetchPriority="high"
      />
      {/* Dark overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/88 to-background/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/90" />

      {/* Mandala — CSS opacity pulse only, will-change prevents layout reflow */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ willChange: 'auto' }}
      >
        <img
          src={portalMandala}
          alt=""
          className="auth-mandala-pulse rounded-full blur-sm"
          style={{
            width: 'min(700px, 90vw)',
            height: 'min(700px, 90vw)',
            objectFit: 'cover',
            opacity: 0.12,
          }}
        />
      </div>

      {/* Flower of Life — purely decorative SVG, no animation */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.035 }}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="fol-auth" x="0" y="0" width="120" height="104" patternUnits="userSpaceOnUse">
            <circle cx="60" cy="52" r="30" fill="none" stroke="hsl(42,49%,58%)" strokeWidth="0.6" />
            <circle cx="60" cy="22" r="30" fill="none" stroke="hsl(42,49%,58%)" strokeWidth="0.6" />
            <circle cx="60" cy="82" r="30" fill="none" stroke="hsl(42,49%,58%)" strokeWidth="0.6" />
            <circle cx="34" cy="37" r="30" fill="none" stroke="hsl(42,49%,58%)" strokeWidth="0.6" />
            <circle cx="86" cy="37" r="30" fill="none" stroke="hsl(42,49%,58%)" strokeWidth="0.6" />
            <circle cx="34" cy="67" r="30" fill="none" stroke="hsl(42,49%,58%)" strokeWidth="0.6" />
            <circle cx="86" cy="67" r="30" fill="none" stroke="hsl(42,49%,58%)" strokeWidth="0.6" />
          </pattern>
          {/* Radial fade — hides edges, no seams */}
          <radialGradient id="fol-fade-auth" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="60%" stopColor="white" stopOpacity="0.6" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="fol-mask-auth">
            <rect width="100%" height="100%" fill="url(#fol-fade-auth)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#fol-auth)" mask="url(#fol-mask-auth)" />
      </svg>

      {/* Static ambient glows — CSS animation, no JS */}
      <div className="auth-glow-1 absolute top-[8%] left-[12%] w-80 h-80 rounded-full bg-primary/8 blur-[110px]" />
      <div className="auth-glow-2 absolute bottom-[12%] right-[8%] w-72 h-72 rounded-full bg-accent/6 blur-[90px]" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(var(--background)/0.7)_100%)]" />
    </div>
  );

  /* ─── Premium glass card ─── */
  const GlassCard = ({ children }: { children: React.ReactNode }) => (
    <div className="relative auth-card-enter">
      <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-b from-primary/20 via-primary/5 to-transparent blur-[1px]" />
      <div className="relative rounded-3xl bg-card/55 backdrop-blur-2xl border border-border/20 p-8 md:p-10 shadow-[0_20px_70px_-12px_hsl(var(--background)/0.8)]">
        <div className="absolute top-0 left-10 w-14 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute bottom-0 right-10 w-14 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        {children}
      </div>
    </div>
  );

  const GoogleButton = ({ label }: { label: string }) => (
    <Button
      type="button"
      variant="outline"
      className="w-full h-12 flex items-center gap-3 bg-background/30 border-border/30 hover:bg-background/50 hover:border-primary/20"
      onClick={handleGoogleSignIn}
      disabled={googleLoading}
    >
      {googleLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      )}
      {label}
    </Button>
  );

  const Divider = () => (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border/30" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-transparent px-3 text-muted-foreground/60 backdrop-blur-sm">ou</span>
      </div>
    </div>
  );

  // ─── Forgot password view ───
  if (showForgotPassword) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
        <StaticBg />
        <div className="relative z-10 w-full max-w-md auth-card-enter">
          <button
            onClick={() => { setShowForgotPassword(false); setForgotPasswordSent(false); setForgotPasswordEmail(''); }}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Login</span>
          </button>

          <div className="text-center mb-8">
            <Logo size="lg" variant="vertical" className="justify-center mb-6" />
            <h1 className="text-2xl font-display text-primary mb-2 tracking-wide">Recuperar Senha</h1>
            <p className="text-muted-foreground text-sm">Digite seu email para receber o link de recuperação</p>
          </div>

          <GlassCard>
            {forgotPasswordSent ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium">Email Enviado!</h3>
                <p className="text-sm text-muted-foreground">
                  Enviamos um link de recuperação para <strong>{forgotPasswordEmail}</strong>. Verifique sua caixa de entrada e spam.
                </p>
                <p className="text-xs text-muted-foreground">O link expira em 1 hora.</p>
                <Button variant="outline" className="w-full mt-4" onClick={() => { setShowForgotPassword(false); setForgotPasswordSent(false); setForgotPasswordEmail(''); }}>
                  Voltar para Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="forgot-email" className="text-foreground/80">Email</Label>
                  <Input id="forgot-email" type="email" placeholder="seu@email.com" value={forgotPasswordEmail} onChange={(e) => setForgotPasswordEmail(e.target.value)} required className="bg-background/50 border-border/40 focus:border-primary/50" />
                </div>
                <Button type="submit" variant="gold" className="w-full h-12 text-base" disabled={forgotPasswordLoading}>
                  {forgotPasswordLoading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enviando...</>) : 'Enviar Link de Recuperação'}
                </Button>
              </form>
            )}
          </GlassCard>
        </div>
      </div>
    );
  }

  // ─── Main auth view ───
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <StaticBg />

      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </Link>

        {/* Logo + Portal label */}
        <div className="text-center mb-8 auth-card-enter">
          <Logo size="lg" variant="vertical" className="justify-center mb-6" />
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/40" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-primary/50 font-medium">Portal de Entrada</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/40" />
          </div>
        </div>

        {/* Manifesto card */}
        <div className="relative mb-8 text-center auth-card-enter" style={{ animationDelay: '0.15s' }}>
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/12 to-transparent" />
          <div className="relative rounded-2xl bg-card/35 backdrop-blur-xl border border-primary/10 p-6">
            <p className="text-foreground/90 text-base leading-relaxed font-display tracking-wide">
              <span className="text-primary font-medium">Antes de conduzir o outro,</span><br />
              aprenda a sustentar o campo.
            </p>
            <div className="h-px w-16 mx-auto my-4 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <p className="text-foreground/60 text-sm leading-relaxed italic">
              Aqui, não se aprende a interpretar.<br />
              Aprende-se a sustentar.
            </p>
          </div>
        </div>

        {/* Auth form */}
        <div style={{ animationDelay: '0.25s' }} className="auth-card-enter">
          <GlassCard>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-background/40">
                <TabsTrigger value="login" className="data-[state=active]:bg-primary/15 data-[state=active]:text-primary">Entrar</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-primary/15 data-[state=active]:text-primary">Criar Conta</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-foreground/80">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="h-12 bg-background/50 border-border/40 focus:border-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-foreground/80">Senha</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        className="h-12 bg-background/50 border-border/40 focus:border-primary/50"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" variant="gold" className="w-full h-12 text-base" disabled={isLoading}>
                    {isLoading ? 'Entrando...' : getCopyByKey('btn_atravessar_limiar', 'Atravessar o limiar')}
                  </Button>

                  <Divider />
                  <GoogleButton label="Entrar com Google" />

                  <button type="button" onClick={() => setShowForgotPassword(true)} className="w-full text-sm text-muted-foreground hover:text-primary transition-colors text-center pt-2">
                    Esqueci minha senha
                  </button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-foreground/80">Nome</Label>
                    <Input id="signup-name" type="text" placeholder="Seu nome" value={signupName} onChange={(e) => setSignupName(e.target.value)} required autoComplete="name" className="h-12 bg-background/50 border-border/40 focus:border-primary/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-foreground/80">Email</Label>
                    <Input id="signup-email" type="email" placeholder="seu@email.com" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required autoComplete="email" className="h-12 bg-background/50 border-border/40 focus:border-primary/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-foreground/80">Senha</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                        minLength={6}
                        autoComplete="new-password"
                        className="h-12 bg-background/50 border-border/40 focus:border-primary/50"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" variant="gold" className="w-full h-12 text-base" disabled={isLoading}>
                    {isLoading ? 'Criando conta...' : 'Criar Conta'}
                  </Button>

                  <Divider />
                  <GoogleButton label="Continuar com Google" />

                  <p className="text-xs text-muted-foreground/60 text-center pt-2 leading-relaxed">
                    Ao criar conta, você inicia como Visitante (Portal 1).<br />
                    O acesso a outros Portais é liberado pela Guardiã.
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
