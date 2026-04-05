import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Sparkles, Lock, Home, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layout/AppLayout';
import { useOracles } from '@/hooks/useOracles';
import { OracleDeck } from '@/types/oracle';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

function useOracleBasePath() {
  return '/oraculos';
}

export default function Oraculos() {
  const navigate = useNavigate();
  const basePath = useOracleBasePath();
  const { oracles, isLoading, hasAccess } = useOracles();

  const publishedOracles = oracles.filter(o => o.status === 'published' || hasAccess(o));

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Sparkles className="w-8 h-8 animate-breathe text-gold" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-12 pb-24 max-w-5xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-10">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" /> Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Oráculos</span>
        </nav>

        {/* ─── Grand Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 space-y-6 relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-gold/5 blur-[100px] pointer-events-none" />

          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="relative mx-auto w-16 h-16"
          >
            <div className="absolute inset-0 rounded-full bg-gold/10 blur-xl" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-gold" />
            </div>
          </motion.div>

          <h1 className="font-display text-4xl md:text-5xl text-foreground tracking-wide font-light">
            Oráculos
          </h1>
          <p className="text-foreground/60 text-base max-w-lg mx-auto leading-relaxed font-body">
            Portas para a sabedoria interior — instrumentos de escuta que acessam 
            a linguagem do inconsciente através de imagens e símbolos.
          </p>

          <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </motion.div>

        {/* ─── Oracle Grid ─── */}
        {publishedOracles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Sparkles className="w-14 h-14 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground/60 text-sm">Os oráculos estão sendo preparados</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {publishedOracles.map((oracle, index) => (
              <OracleCardItem 
                key={oracle.id} 
                oracle={oracle} 
                hasAccess={hasAccess(oracle)} 
                onNavigate={() => navigate(`${basePath}/${oracle.slug}`)}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

interface OracleCardItemProps {
  oracle: OracleDeck;
  hasAccess: boolean;
  onNavigate: () => void;
  index: number;
}

function OracleCardItem({ oracle, hasAccess, onNavigate, index }: OracleCardItemProps) {
  const navigate = useNavigate();
  const primaryColor = oracle.theme_json?.primaryColor || 'hsl(var(--gold))';
  const backgroundColor = oracle.theme_json?.backgroundColor || 'hsl(var(--midnight))';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'group relative overflow-hidden rounded-2xl cursor-pointer',
        'border border-border/10 bg-card/50 backdrop-blur-sm',
        'transition-all duration-700',
        hasAccess && 'hover:border-gold/25 hover:shadow-[0_20px_60px_-16px_hsl(var(--gold)/0.2)]',
        !hasAccess && 'opacity-60'
      )}
      onClick={hasAccess ? onNavigate : undefined}
    >
      {/* Cover Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {oracle.cover_image_url ? (
          <img 
            src={oracle.cover_image_url} 
            alt={oracle.name}
            className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${backgroundColor} 0%, ${primaryColor}20 100%)` }}
          >
            <Sparkles className="w-16 h-16 text-gold/20" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-card/30 via-transparent to-card/30" />
        
        <div className="absolute top-4 right-4 w-8 h-8">
          <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-gold/30 to-transparent" />
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-gold/30 to-transparent" />
        </div>

        {!hasAccess && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center p-6">
              <div className="w-14 h-14 mx-auto rounded-full bg-background/60 border border-border/30 flex items-center justify-center mb-3">
                <Lock className="w-6 h-6 text-muted-foreground/50" />
              </div>
              <p className="text-sm text-muted-foreground/70">{oracle.lock_message_title}</p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative p-7 -mt-14 z-10">
        <h3 className="text-2xl md:text-3xl font-display font-medium text-foreground mb-2 tracking-wide group-hover:text-gold transition-colors duration-500">
          {oracle.name}
        </h3>
        
        {oracle.subtitle && (
          <p className="text-sm text-foreground/50 mb-5 leading-relaxed">
            {oracle.subtitle}
          </p>
        )}

        {hasAccess ? (
          <div className="flex items-center gap-2 text-sm font-medium group-hover:gap-4 transition-all duration-500" style={{ color: primaryColor }}>
            <div className="w-6 h-px" style={{ backgroundColor: primaryColor, opacity: 0.4 }} />
            <span className="tracking-widest uppercase text-xs">Consultar</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        ) : (
          <Button 
            variant="ghost"
            onClick={(e) => { e.stopPropagation(); navigate(oracle.upgrade_cta_route); }}
            className="p-0 h-auto text-sm text-muted-foreground hover:bg-transparent hover:text-gold"
          >
            {oracle.upgrade_cta_text}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
