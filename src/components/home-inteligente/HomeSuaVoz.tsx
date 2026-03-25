import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import type { VozData } from '@/hooks/useHomeInteligente';

const anim = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
});

interface Props { voz: VozData; }

export function HomeSuaVoz({ voz }: Props) {
  const { user } = useAuth();
  const welcomeName = user?.name?.split(' ')[0] || 'Habitante';

  if (!voz.primaria) {
    return (
      <motion.div {...anim(0)} className="text-center mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-2">
          Bem-vinda à <span className="text-primary">Casa Orácula</span>
        </h1>
        <p className="text-muted-foreground text-base max-w-lg mx-auto">
          Cada jornada começa em um lugar diferente.
          <br />
          Escolha o caminho que deseja atravessar hoje, {welcomeName}.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.section {...anim(0)} className="text-center mb-10">
      {/* Ícone simbólico */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-4xl mb-3"
      >
        {voz.primaria.icone}
      </motion.div>

      <p className="text-[10px] uppercase tracking-[0.3em] text-primary/50 mb-2">
        Sua Voz na Casa
      </p>

      <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-1">
        {welcomeName}, <span className="text-primary">{voz.primaria.nome}</span>
      </h1>

      {voz.apoio && (
        <p className="text-xs text-muted-foreground/60 mb-4">
          Voz de apoio: <span className="text-foreground/50">{voz.apoio.nome}</span>
          {voz.simbolo && <> · Símbolo: <span className="text-foreground/50">{voz.simbolo}</span></>}
        </p>
      )}

      <motion.blockquote
        {...anim(0.3)}
        className="text-foreground/50 italic leading-relaxed text-base md:text-lg font-display max-w-md mx-auto"
      >
        "{voz.mensagem}"
      </motion.blockquote>
    </motion.section>
  );
}
