import { Link } from 'react-router-dom';
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/button';
import { useCopy } from '@/hooks/useCopy';
import { useAppSettings } from '@/hooks/useAppSettings';
import { UnifiedAudioPlayer } from '@/components/audio/UnifiedAudioPlayer';

export default function Landing() {
  const { getCopyByKey } = useCopy();
  const { getEntryAudioUrl, getEntryAudioTitle, getEntryAudioCaption, isLoading } = useAppSettings();
  
  const audioUrl = getEntryAudioUrl();
  const audioTitle = getEntryAudioTitle();
  const audioCaption = getEntryAudioCaption();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-hero-radial" />
      <div className="absolute inset-0 pattern-geometric opacity-30" />
      
      {/* Floating orbs - subtle */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto pt-8 md:pt-12">
        {/* Logo */}
        <div className="animate-fade-in mb-12">
          <Logo size="xl" variant="vertical" className="justify-center" />
        </div>

        {/* Título */}
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-8 animate-slide-up leading-tight" style={{ animationDelay: '0.2s' }}>
          {getCopyByKey('landing_titulo', 'Bem-vinda à')}{' '}
          <span className="text-gold-gradient font-semibold">{getCopyByKey('landing_destaque', 'Casa ORÁCULA')}</span>
        </h1>

        {/* Texto poético */}
        <div className="space-y-4 text-foreground text-lg md:text-xl leading-relaxed mb-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <p>{getCopyByKey('landing_texto_1', 'A Casa ORÁCULA não é um curso.')}</p>
          <p>{getCopyByKey('landing_texto_2', 'É um espaço de formação simbólica, clínica e ética para mulheres que conduzem outras mulheres.')}</p>
          <p>{getCopyByKey('landing_texto_3', 'Aqui, a técnica não substitui a escuta. O símbolo não é ornamento — é linguagem. E o portal não é metáfora — é prática.')}</p>
          <p>{getCopyByKey('landing_texto_4', 'Você entra para aprender a ler narrativas profundas, sustentar eixo e conduzir processos reais de transformação.')}</p>
        <p className="text-primary italic mt-8 font-display text-xl md:text-2xl">
            {getCopyByKey('landing_convite', 'Sente-se. A Casa se revela passo a passo.')}
          </p>
        </div>

        {/* Audio Player - Dynamic */}
        {audioUrl && (
          <div className="animate-slide-up max-w-md mx-auto space-y-2" style={{ animationDelay: '0.5s' }}>
            <UnifiedAudioPlayer 
              audioUrl={audioUrl}
              title={audioTitle || undefined}
              size="lg"
            />
            {audioCaption && (
              <p className="text-sm text-muted-foreground text-center italic">
                {audioCaption}
              </p>
            )}
          </div>
        )}

        {/* Botões */}
        <div className="animate-slide-up flex flex-col sm:flex-row gap-4 justify-center" style={{ animationDelay: '0.6s' }}>
          <Link to="/auth">
            <Button variant="gold" size="xl" className="text-lg px-10 py-6 w-full sm:w-auto">
              {getCopyByKey('btn_entrar_casa', 'Entrar na Casa ORÁCULA')}
            </Button>
          </Link>
          <Link to="/tour">
            <Button variant="outline" size="xl" className="text-lg px-8 py-6 w-full sm:w-auto border-gold/30 hover:bg-gold/10">
              Conhecer a Casa
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
