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

      <div className="relative z-10 flex max-w-sm flex-col items-center gap-8 text-center">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute inset-4 rounded-full border border-primary/20 bg-primary/5"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.3,
            }}
          />
          <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_30px_hsl(var(--primary)/0.6)]" />
        </div>

        <div className="space-y-4">
          <p className="text-[10px] uppercase tracking-[0.5em] text-primary/50 font-bold">Casa Orácula</p>
          <h1 className="font-display text-4xl text-white tracking-tight">{title}</h1>
          <p className="text-lg leading-relaxed text-white/40 italic font-light">{message}</p>
        </div>
      </div>
    </div>
  );
}