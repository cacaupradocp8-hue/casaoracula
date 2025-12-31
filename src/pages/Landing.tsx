import { Link } from 'react-router-dom';
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/button';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-hero-radial" />
      <div className="absolute inset-0 pattern-geometric opacity-30" />
      
      {/* Floating orbs - subtle */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Logo */}
        <div className="animate-fade-in mb-10">
          <Logo size="lg" variant="vertical" className="justify-center" />
        </div>

        {/* Título */}
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-8 animate-slide-up leading-tight" style={{ animationDelay: '0.2s' }}>
          Bem-vinda à{' '}
          <span className="text-gold-gradient font-semibold">Casa ORÁCULA</span>
        </h1>

        {/* Texto poético */}
        <div className="space-y-4 text-foreground/90 text-lg md:text-xl leading-relaxed mb-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <p>A Casa ORÁCULA não é um curso.</p>
          <p>
            É um espaço de formação simbólica, clínica e ética
            para mulheres que conduzem outras mulheres.
          </p>
          <p>
            Aqui, a técnica não substitui a escuta.
            O símbolo não é ornamento — é linguagem.
            E a travessia não é metáfora — é prática.
          </p>
          <p>
            Você entra para aprender a ler narrativas profundas,
            sustentar eixo e conduzir processos reais de transformação.
          </p>
          <p className="text-primary/80 italic mt-8 font-display text-xl md:text-2xl">
            Sente-se. A Casa se revela passo a passo.
          </p>
        </div>

        {/* Botão ritual */}
        <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <Link to="/auth">
            <Button variant="gold" size="xl" className="text-lg px-10 py-6">
              Entrar na Casa
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
