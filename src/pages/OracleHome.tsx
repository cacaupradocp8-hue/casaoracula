import { useParams, useNavigate } from 'react-router-dom';
import { Sparkles, Clock, Play, History, Lock, Loader2, ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useOracleBySlug } from '@/hooks/useOracles';
import { useState } from 'react';

export default function OracleHome() {
  const { oracleSlug } = useParams<{ oracleSlug: string }>();
  const navigate = useNavigate();
  const { oracle, spreads, cards, isLoading, error, hasAccess } = useOracleBySlug(oracleSlug || '');
  const [sensitiveMode, setSensitiveMode] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0F0D1A' }}>
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !oracle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">Oráculo não encontrado</h2>
          <Button variant="outline" onClick={() => navigate('/oraculos')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Oráculos
          </Button>
        </div>
      </div>
    );
  }

  const canAccess = hasAccess();
  const theme = oracle.theme_json;
  const voice = oracle.voice_settings_json;
  const onboarding = oracle.onboarding_json;
  const publishedSpreads = spreads.filter(s => s.status === 'published');
  const totalCards = cards.filter(c => c.status === 'published').length;

  // Locked Screen
  if (!canAccess) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{ backgroundColor: theme.backgroundColor || '#0F0D1A' }}
      >
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-3xl font-serif font-bold text-foreground mb-3">
            {oracle.lock_message_title}
          </h1>
          
          <p className="text-muted-foreground mb-8">
            {oracle.lock_message_body}
          </p>
          
          <div className="flex flex-col gap-3">
            <Button 
              size="lg"
              onClick={() => navigate(oracle.upgrade_cta_route)}
              style={{ backgroundColor: theme.primaryColor }}
            >
              {oracle.upgrade_cta_text}
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => navigate('/oraculos')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Oráculos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: theme.backgroundColor || '#0F0D1A',
        fontFamily: theme.fontFamily || 'serif'
      }}
    >
      {/* Hero Section */}
      <section className="relative">
        {/* Cover Image */}
        {oracle.cover_image_url ? (
          <div className="relative h-[40vh] md:h-[50vh]">
            <img 
              src={oracle.cover_image_url} 
              alt={oracle.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>
        ) : (
          <div 
            className="h-[30vh] flex items-center justify-center"
            style={{ backgroundColor: theme.backgroundColor }}
          >
            <Sparkles className="w-24 h-24 text-primary/20" />
          </div>
        )}

        {/* Back Button */}
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/oraculos')}
          className="absolute top-4 left-4 bg-background/50 backdrop-blur hover:bg-background/80"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        {/* Content Overlay */}
        <div className="relative -mt-20 px-4 pb-8">
          <div className="max-w-2xl mx-auto text-center">
            <Badge 
              className="mb-4"
              style={{ backgroundColor: `${theme.primaryColor}20`, color: theme.primaryColor }}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              {totalCards} cartas
            </Badge>

            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-3">
              {oracle.name}
            </h1>

            {oracle.subtitle && (
              <p className="text-xl text-muted-foreground mb-4">
                {oracle.subtitle}
              </p>
            )}

            {onboarding.welcomeText && (
              <p className="text-muted-foreground italic max-w-lg mx-auto">
                "{onboarding.welcomeText}"
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Actions */}
      <section className="max-w-2xl mx-auto px-4 pb-8">
        <div className="flex flex-col gap-4">
          {/* Primary CTA */}
          <Button 
            size="lg"
            className="w-full text-lg py-6"
            onClick={() => navigate(`/oraculos/${oracle.slug}/tirar`)}
            style={{ backgroundColor: theme.primaryColor }}
          >
            <Play className="w-5 h-5 mr-2" />
            Tirar Agora
          </Button>

          {/* Secondary Actions */}
          <div className="flex gap-3">
            {oracle.enable_journal && (
              <Button 
                variant="outline"
                className="flex-1"
                onClick={() => navigate(`/oraculos/${oracle.slug}/historico`)}
              >
                <History className="w-4 h-4 mr-2" />
                Histórico
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Spreads Section */}
      {publishedSpreads.length > 0 && (
        <section className="max-w-2xl mx-auto px-4 pb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Escolha uma Tiragem
          </h2>
          
          <div className="grid gap-3">
            {publishedSpreads.map((spread) => (
              <Card 
                key={spread.id}
                className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
                onClick={() => navigate(`/oraculos/${oracle.slug}/tirar?spread=${spread.id}`)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">{spread.name}</h3>
                    {spread.description && (
                      <p className="text-sm text-muted-foreground">{spread.description}</p>
                    )}
                  </div>
                  <Badge variant="secondary">
                    {spread.number_of_cards} {spread.number_of_cards === 1 ? 'carta' : 'cartas'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Settings */}
      {oracle.is_sensitive_mode_available && (
        <section className="max-w-2xl mx-auto px-4 pb-8">
          <Card className="bg-card/30 border-border/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="sensitive-mode" className="font-medium">
                      Modo Sensível
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Oculta cartas com temas delicados
                    </p>
                  </div>
                </div>
                <Switch 
                  id="sensitive-mode"
                  checked={sensitiveMode}
                  onCheckedChange={setSensitiveMode}
                />
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Disclaimer */}
      {oracle.disclaimer_text && (
        <section className="max-w-2xl mx-auto px-4 pb-12">
          <p className="text-xs text-center text-muted-foreground/70">
            {oracle.disclaimer_text}
          </p>
        </section>
      )}
    </div>
  );
}
