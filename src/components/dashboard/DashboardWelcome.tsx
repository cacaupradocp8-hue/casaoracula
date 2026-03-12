import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const anim = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

export function DashboardWelcome() {
  const { user } = useAuth();
  const welcomeName = user?.name?.split(" ")[0] || "Membro";

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
