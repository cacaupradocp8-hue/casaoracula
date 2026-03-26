import { motion } from 'framer-motion';

interface BootLoadingScreenProps {
  title?: string;
  message?: string;
}

export function BootLoadingScreen({
  title = 'Preparando a entrada',
  message = 'Aguarde enquanto alinhamos sua jornada.',
}: BootLoadingScreenProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-hero-radial opacity-70" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-12 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex max-w-sm flex-col items-center gap-4 text-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full border border-primary/25"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.45, 0.85, 0.45],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute inset-3 rounded-full border border-primary/20 bg-primary/10"
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.3, 0.65, 0.3],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.2,
            }}
          />
          <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_24px_hsl(var(--primary)/0.45)]" />
        </div>

        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.35em] text-primary/70">Casa Orácula</p>
          <h1 className="font-display text-2xl text-foreground">{title}</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}