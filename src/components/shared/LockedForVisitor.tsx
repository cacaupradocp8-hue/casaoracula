import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, MapPin, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/layout/Logo';

interface LockedForVisitorProps {
  featureName?: string;
}

/**
 * LockedForVisitor - Blocking component for visitors trying to access restricted content
 * 
 * Shows a clear message that the content is for members only,
 * with CTAs to go to the plans page or return to the visitor room.
 */
export function LockedForVisitor({ featureName }: LockedForVisitorProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background flex flex-col"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-background to-background" />
      <div className="absolute inset-0 pattern-geometric opacity-20" />

      {/* Fixed "You are here" indicator */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border/30">
        <div className="max-w-2xl mx-auto px-6 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-gold" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Você está na Sala da Visitante</p>
            <p className="text-xs text-muted-foreground">
              Este conteúdo requer acesso como moradora
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 max-w-lg mx-auto">
        <div className="text-center space-y-6">
          {/* Lock Icon */}
          <div className="w-20 h-20 rounded-full bg-muted/50 border border-border flex items-center justify-center mx-auto">
            <Lock className="w-10 h-10 text-muted-foreground" />
          </div>

          {/* Message */}
          <div className="space-y-3">
            <h1 className="text-2xl font-display text-foreground">
              Este espaço é reservado
            </h1>
            
            {featureName && (
              <p className="text-gold font-medium">
                {featureName}
              </p>
            )}
            
            <p className="text-muted-foreground max-w-sm mx-auto">
              Este espaço é acessível para mentoradas, alunas da formação ou assinantes.
            </p>
            
            <p className="text-sm text-muted-foreground/70">
              Você está na Sala da Visitante.
            </p>
          </div>

          {/* CTAs */}
          <div className="space-y-3 pt-4">
            <Button
              variant="gold"
              size="lg"
              onClick={() => navigate('/planos')}
              className="w-full group"
            >
              Conhecer os Caminhos da Casa
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="ghost"
              onClick={() => navigate('/sala-da-visitante')}
              className="w-full text-muted-foreground hover:text-foreground"
            >
              <Home className="w-4 h-4 mr-2" />
              Voltar à Sala da Visitante
            </Button>
          </div>

          {/* Subtle footer */}
          <p className="text-xs text-muted-foreground/50 pt-8">
            Como moradora, você terá acesso às ferramentas simbólicas,
            formação completa e comunidade.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
