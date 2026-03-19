import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { RitualGate } from '@/components/ritual';
import { FormationMapTrigger } from '@/components/formation-map';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export default function CasaTecelaAtrio() {
  const [entered, setEntered] = useState(false);
  const [mensagemDia, setMensagemDia] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchMensagemDia();
  }, [user]);

  const fetchMensagemDia = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await (supabase.from('tecela_mensagens_dia' as any) as any)
      .select('mensagem')
      .eq('ativa', true)
      .lte('data_exibicao', today)
      .order('data_exibicao', { ascending: false })
      .limit(1);
    if (data?.[0]) setMensagemDia(data[0].mensagem);
  };

  const handleEnter = () => {
    setEntered(true);
    setTimeout(() => navigate('/casa-tecelas/interior'), 900);
  };

  return (
    <AppLayout>
      <RitualGate triggerEvent="first_sala_access" contextType="sala" contextId="casa-tecelas">
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
          <AnimatePresence mode="wait">
            {!entered ? (
              <motion.div
                key="atrium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 1 }}
                className="max-w-lg w-full text-center space-y-12"
              >
                {/* Breath */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="flex justify-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gold/8 border border-gold/12 flex items-center justify-center animate-breathe">
                    <Sparkles className="w-7 h-7 text-gold/60" />
                  </div>
                </motion.div>

                {/* Title — minimal */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="space-y-3"
                >
                  <p className="text-[10px] uppercase tracking-[0.5em] text-gold/40 font-medium">
                    A Casa das Tecelãs
                  </p>
                </motion.div>

                {/* Message — the only content */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                >
                  <p className="text-foreground/70 text-base md:text-lg leading-relaxed font-display italic px-4">
                    "{mensagemDia || 'A tecelã não cria o fio — ela revela o tecido que já existe.'}"
                  </p>
                </motion.div>

                {/* Entry — silent */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.8 }}
                >
                  <button
                    onClick={handleEnter}
                    className="group inline-flex items-center gap-3 text-gold/60 hover:text-gold transition-colors duration-500"
                  >
                    <span className="text-xs uppercase tracking-[0.3em] font-medium">
                      Entrar no campo
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="transition"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-gold/8 animate-pulse flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-gold/40" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </RitualGate>
      <FormationMapTrigger />
    </AppLayout>
  );
}
