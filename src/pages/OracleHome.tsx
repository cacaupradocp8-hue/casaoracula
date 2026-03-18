import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Sparkles, Play, History, Lock, ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useOracleBySlug } from '@/hooks/useOracles';
import { AmbientSoundToggle } from '@/components/oracle/AmbientSoundToggle';
import { cn } from '@/lib/utils';
import { useCopy } from '@/hooks/useCopy';

function useOracleBasePath() {
  const location = useLocation();
  return location.pathname.startsWith('/casa-das-maquinas') 
    ? '/casa-das-maquinas/oraculo' 
    : '/oraculos';
}

export default function OracleHome() {
  const { oracleSlug } = useParams<{ oracleSlug: string }>();
  const navigate = useNavigate();
  const basePath = useOracleBasePath();
  const { oracle, spreads, cards, isLoading, error, hasAccess } = useOracleBySlug(oracleSlug || '');
  const [sensitiveMode, setSensitiveMode] = useState(false);
  const { getCopyByKey } = useCopy();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Sparkles className="w-8 h-8 animate-breathe text-primary" />
      </div>
    );
  }

  if (error || !oracle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Oráculo não encontrado</p>
          <Button variant="ghost" onClick={() => navigate(basePath)}>
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const canAccess = hasAccess();
  const primaryColor = oracle.theme_json?.primaryColor || 'hsl(var(--gold))';
  const backgroundColor = oracle.theme_json?.backgroundColor || 'hsl(var(--midnight))';
  const welcomeText = oracle.onboarding_json?.welcomeText || null;
  const publishedSpreads = spreads.filter(s => s.status === 'published');
  const totalCards = cards.filter(c => c.status === 'published').length;

  // Locked Screen
  if (!canAccess) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{ backgroundColor }}
      >
        <div className="max-w-sm text-center animate-fade-in">
          <Lock className="w-12 h-12 text-muted-foreground/50 mx-auto mb-8" />
          
          <h1 className="text-2xl font-display text-foreground mb-3">
            {oracle.lock_message_title}
          </h1>
          
          <p className="text-sm text-muted-foreground mb-8">
            {oracle.lock_message_body}
          </p>
          
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => navigate(oracle.upgrade_cta_route)}
              style={{ backgroundColor: primaryColor }}
            >
              {oracle.upgrade_cta_text}
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => navigate(basePath)}
              className="text-muted-foreground"
            >
              Voltar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor }}
    >
      {/* Full-screen cover */}
      <section className="relative flex-1 flex flex-col">
        {/* Cover Image */}
        {oracle.cover_image_url && (
          <div className="absolute inset-0">
            <img 
              src={oracle.cover_image_url} 
              alt={oracle.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
          </div>
        )}

        {/* Top Bar */}
        <header className="relative z-10 flex items-center justify-between p-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(basePath)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <AmbientSoundToggle />
        </header>

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-8">
          <div className="text-center max-w-md animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-display font-medium text-foreground mb-2 tracking-wide">
              {oracle.name}
            </h1>

            {oracle.subtitle && (
              <p className="text-muted-foreground mb-6">
                {oracle.subtitle}
              </p>
            )}

            {welcomeText && (
              <p className="text-sm text-muted-foreground/80 italic mb-8 max-w-xs mx-auto">
                "{welcomeText}"
              </p>
            )}

            {/* Primary CTA */}
            <Button 
              size="lg"
              className="w-full max-w-xs text-base py-6 mb-4"
              onClick={() => navigate(`${basePath}/${oracle.slug}/tirar`)}
              style={{ backgroundColor: primaryColor }}
            >
              <Play className="w-4 h-4 mr-2" />
              {getCopyByKey('btn_iniciar_travessia', 'Iniciar a travessia')}
            </Button>

            <p className="text-xs text-muted-foreground/60 mb-8">
              {totalCards} cartas disponíveis
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="relative z-10 px-6 pb-8 max-w-md mx-auto w-full space-y-4">
          {publishedSpreads.length > 1 && (
            <div className="space-y-2">
              {publishedSpreads.map((spread) => (
                <button
                  key={spread.id}
                  onClick={() => navigate(`${basePath}/${oracle.slug}/tirar?spread=${spread.id}`)}
                  className={cn(
                    'w-full p-4 rounded-xl text-left',
                    'bg-card/30 hover:bg-card/50 transition-colors',
                    'border border-border/20 hover:border-border/40'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {spread.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {spread.number_of_cards} {spread.number_of_cards === 1 ? 'carta' : 'cartas'}
                    </span>
                  </div>
                  {spread.description && (
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      {spread.description}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center justify-center gap-4 pt-2">
            {oracle.enable_journal && (
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => navigate(`${basePath}/${oracle.slug}/historico`)}
                className="text-muted-foreground hover:text-foreground"
              >
                <History className="w-4 h-4 mr-2" />
                Histórico
              </Button>
            )}
          </div>

          {oracle.is_sensitive_mode_available && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <Shield className="w-4 h-4 text-muted-foreground/50" />
              <span className="text-xs text-muted-foreground">Modo sensível</span>
              <Switch 
                checked={sensitiveMode}
                onCheckedChange={setSensitiveMode}
                className="scale-75"
              />
            </div>
          )}
        </div>
      </section>

      {oracle.disclaimer_text && (
        <footer className="px-6 py-4 text-center">
          <p className="text-[10px] text-muted-foreground/50 max-w-sm mx-auto">
            {oracle.disclaimer_text}
          </p>
        </footer>
      )}
    </div>
  );
}
