import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have a valid recovery session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Check if user came from a recovery link
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const type = hashParams.get('type');
      
      if (type === 'recovery' && accessToken) {
        // User clicked on recovery link
        setIsValidSession(true);
      } else if (session) {
        // User has a valid session (might have been set by recovery)
        setIsValidSession(true);
      } else {
        setIsValidSession(false);
      }
    };

    checkSession();

    // Listen for auth state changes (recovery link sets session)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsValidSession(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      toast({
        title: 'Senha muito curta',
        description: 'A senha deve ter pelo menos 6 caracteres.',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Senhas não coincidem',
        description: 'Por favor, verifique se as senhas são iguais.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        if (error.message.includes('expired') || error.message.includes('invalid')) {
          toast({
            title: 'Link expirado',
            description: 'O link de recuperação expirou. Por favor, solicite um novo.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Erro ao redefinir senha',
            description: error.message,
            variant: 'destructive',
          });
        }
      } else {
        setIsSuccess(true);
        toast({
          title: 'Senha redefinida!',
          description: 'Sua senha foi alterada com sucesso.',
        });
        
        // Sign out and redirect to login after a delay
        setTimeout(async () => {
          await supabase.auth.signOut();
          navigate('/auth');
        }, 2000);
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao redefinir sua senha.',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  // Loading state
  if (isValidSession === null) {
    return (
      <div className="min-h-screen bg-background pattern-geometric flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-hero-radial" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
        <div className="relative">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </div>
    );
  }

  // Invalid or expired session
  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-background pattern-geometric flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-hero-radial" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
        
        <div className="relative w-full max-w-md text-center">
          <div className="glass rounded-2xl p-8 shadow-glow">
            <h2 className="text-xl font-display text-gold mb-4">Link Inválido ou Expirado</h2>
            <p className="text-muted-foreground mb-6">
              Este link de recuperação não é válido ou já expirou. 
              Por favor, solicite um novo link de recuperação.
            </p>
            <Link to="/auth">
              <Button variant="gold" className="w-full">
                Voltar para Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background pattern-geometric flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-hero-radial" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
        
        <div className="relative w-full max-w-md text-center">
          <div className="glass rounded-2xl p-8 shadow-glow">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-display text-gold mb-4">Senha Redefinida!</h2>
            <p className="text-muted-foreground mb-6">
              Sua senha foi alterada com sucesso. Você será redirecionada para o login.
            </p>
            <Loader2 className="w-6 h-6 animate-spin text-gold mx-auto" />
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
        <Link to="/auth" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Login</span>
        </Link>

        <div className="text-center mb-8">
          <Logo size="lg" variant="vertical" className="justify-center mb-4" />
          <h1 className="text-2xl font-display text-gold mb-2">Redefinir Senha</h1>
          <p className="text-muted-foreground">
            Digite sua nova senha abaixo
          </p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-glow">
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              A senha deve ter pelo menos 6 caracteres.
            </p>

            <Button type="submit" variant="gold" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Redefinindo...
                </>
              ) : (
                'Redefinir Senha'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
