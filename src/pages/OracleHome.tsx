import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Sparkles, Play, History, Lock, ArrowLeft, Shield, BookOpen, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useOracleBySlug, useOracleDraws } from '@/hooks/useOracles';
import { AmbientSoundToggle } from '@/components/oracle/AmbientSoundToggle';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCopy } from '@/hooks/useCopy';

function useOracleBasePath() {
  return '/oraculos';
}

export default function OracleHome() {
  const { oracleSlug } = useParams<{ oracleSlug: string }>();
  const navigate = useNavigate();
  const basePath = useOracleBasePath();
  const { oracle, spreads, cards, isLoading, error, hasAccess } = useOracleBySlug(oracleSlug || '');
  const { draws } = useOracleDraws(oracle?.id);
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
  const publishedSpreads = spreads.filter(s => s.status === 'published');
  const totalCards = cards.filter(c => c.status === 'published').length;
  const recentDraws = draws.slice(0, 3);

  // Locked Screen
  if (!canAccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-sm text-center"
        >
          <Lock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-8" />
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
            <Button variant="ghost" onClick={() => navigate(basePath)} className="text-muted-foreground">
              Voltar
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      {/* Deep ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-gold/[0.03] blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-mystic/[0.04] blur-[120px]" />
      </div>

      {/* Cover Image with deep overlay */}
      {oracle.cover_image_url && (
        <div className="absolute inset-0 pointer-events-none">
          <img 
            src={oracle.cover_image_url} 
            alt=""
            className="w-full h-full object-cover opacity-[0.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
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

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-6">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-md pt-8 pb-12"
        >
          {/* Breathing oracle symbol */}
          <motion.div
            animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative mx-auto w-20 h-20 mb-8"
          >
            <div className="absolute inset-0 rounded-full bg-gold/10 blur-2xl" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-gold/15 to-gold/5 border border-gold/15 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-gold/60" />
            </div>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-display font-medium text-foreground mb-3 tracking-wide">
            {oracle.name}
          </h1>

          {oracle.subtitle && (
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              {oracle.subtitle}
            </p>
          )}

          {oracle.onboarding_json?.welcomeText && (
            <p className="text-sm text-muted-foreground/60 italic mb-8 max-w-xs mx-auto leading-relaxed">
              "{oracle.onboarding_json.welcomeText}"
            </p>
          )}

          <p className="text-xs text-muted-foreground/40 mb-10">
            {totalCards} cartas · {publishedSpreads.length} {publishedSpreads.length === 1 ? 'tiragem' : 'tiragens'}
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <Button 
              size="lg"
              className="w-full text-base py-6 relative overflow-hidden group"
              onClick={() => navigate(`${basePath}/${oracle.slug}/tirar`)}
              style={{ backgroundColor: primaryColor }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Play className="w-4 h-4" />
                Abrir o Oráculo
              </span>
            </Button>

            {publishedSpreads.length > 1 && (
              <Button 
                variant="outline"
                size="lg"
                className="w-full border-border/20 text-foreground/70 hover:text-foreground hover:border-gold/30 py-5"
                onClick={() => navigate(`${basePath}/${oracle.slug}/tirar`)}
              >
                <Layers className="w-4 h-4 mr-2 opacity-60" />
                Escolher Tiragem
              </Button>
            )}
          </div>
        </motion.div>

        {/* Spreads Preview */}
        {publishedSpreads.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-full max-w-md mb-10"
          >
            <div className="h-px w-full bg-gradient-to-r from-transparent via-border/30 to-transparent mb-8" />
            <div className="space-y-2">
              {publishedSpreads.map((spread) => (
                <button
                  key={spread.id}
                  onClick={() => navigate(`${basePath}/${oracle.slug}/tirar?spread=${spread.id}`)}
                  className={cn(
                    'w-full p-4 rounded-xl text-left',
                    'bg-card/20 hover:bg-card/40 transition-all duration-500',
                    'border border-border/10 hover:border-gold/15',
                    'group'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground group-hover:text-gold transition-colors duration-500">
                      {spread.name}
                    </span>
                    <span className="text-xs text-muted-foreground/50">
                      {spread.number_of_cards} {spread.number_of_cards === 1 ? 'carta' : 'cartas'}
                    </span>
                  </div>
                  {spread.description && (
                    <p className="text-xs text-muted-foreground/50 mt-1 leading-relaxed">
                      {spread.description}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recent Readings */}
        {recentDraws.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="w-full max-w-md mb-10"
          >
            <div className="h-px w-full bg-gradient-to-r from-transparent via-border/30 to-transparent mb-6" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs text-muted-foreground/50 tracking-widest uppercase">
                Últimas Consultas
              </h3>
              <button
                onClick={() => navigate(`${basePath}/${oracle.slug}/historico`)}
                className="text-xs text-gold/50 hover:text-gold transition-colors"
              >
                Ver todas
              </button>
            </div>
            <div className="space-y-2">
              {recentDraws.map((draw) => {
                const spreadName = spreads.find(s => s.id === draw.spread_id)?.name || 'Tiragem';
                return (
                  <div
                    key={draw.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-card/10 border border-border/5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gold/5 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-3 h-3 text-gold/40" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground/70 truncate">{spreadName}</p>
                      <p className="text-xs text-muted-foreground/40">
                        {format(new Date(draw.created_at), "d MMM", { locale: ptBR })}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground/30">
                      {draw.drawn_cards_json.length} cartas
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Bottom Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="w-full max-w-md pb-8"
        >
          <div className="flex items-center justify-center gap-6 pt-2">
            {oracle.enable_journal && (
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => navigate(`${basePath}/${oracle.slug}/historico`)}
                className="text-muted-foreground/50 hover:text-foreground"
              >
                <History className="w-4 h-4 mr-2" />
                Histórico
              </Button>
            )}
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => navigate(`${basePath}/${oracle.slug}/biblioteca`)}
              className="text-muted-foreground/50 hover:text-foreground"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Biblioteca
            </Button>
          </div>

          {oracle.is_sensitive_mode_available && (
            <div className="flex items-center justify-center gap-3 pt-6">
              <Shield className="w-4 h-4 text-muted-foreground/30" />
              <span className="text-xs text-muted-foreground/40">Modo sensível</span>
              <Switch 
                checked={sensitiveMode}
                onCheckedChange={setSensitiveMode}
                className="scale-75"
              />
            </div>
          )}
        </motion.div>
      </main>

      {oracle.disclaimer_text && (
        <footer className="relative z-10 px-6 py-4 text-center">
          <p className="text-[10px] text-muted-foreground/30 max-w-sm mx-auto">
            {oracle.disclaimer_text}
          </p>
        </footer>
      )}
    </div>
  );
}
