import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

interface LockedForVisitorProps {
  featureName?: string;
}

/**
 * LockedForVisitor - Blocking component for visitors trying to access restricted content
 * 
 * Shows a simple, calm message that the content belongs to another stage.
 * NO buttons, NO CTAs, NO alternative routes.
 */
export function LockedForVisitor({ featureName }: LockedForVisitorProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background flex flex-col items-center justify-center p-6"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-background to-background" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-md mx-auto space-y-6">
        {/* Lock Icon */}
        <div className="w-16 h-16 rounded-full bg-muted/30 border border-border/30 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8 text-muted-foreground/50" />
        </div>

        {/* Message */}
        <div className="space-y-3">
          {featureName && (
            <p className="text-muted-foreground text-sm">
              {featureName}
            </p>
          )}
          
          <h1 className="font-display text-xl text-foreground">
            Entrada por círculo
          </h1>
          
          <p className="text-muted-foreground leading-relaxed">
            Este espaço exige travessia prévia.
          </p>

          <p className="text-sm text-muted-foreground/60 pt-4">
            Este conteúdo pertence a outra etapa da travessia.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
