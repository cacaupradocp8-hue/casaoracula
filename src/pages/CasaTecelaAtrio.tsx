import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Flame, Waves, Zap } from 'lucide-react';
import { RitualGate } from '@/components/ritual';
import { FormationMapTrigger } from '@/components/formation-map';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const ESTADOS_CAMPO = [
  { value: 'retencao', label: 'Retenção', icon: Waves, desc: 'O campo pede quietude', color: 'text-blue-400' },
  { value: 'travessia', label: 'Travessia', icon: Flame, desc: 'O campo está em movimento', color: 'text-gold' },
  { value: 'emergencia', label: 'Emergência', icon: Zap, desc: 'Algo novo busca expressão', color: 'text-purple-400' },
];

export default function CasaTecelaAtrio() {
  const [entered, setEntered] = useState(false);
  const [mensagemDia, setMensagemDia] = useState<string | null>(null);
  const [estadoAtual, setEstadoAtual] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchMensagemDia();
    fetchEstadoAtual();
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

  const fetchEstadoAtual = async () => {
    if (!user) return;
    const { data } = await (supabase.from('tecela_registros_campo' as any) as any)
      .select('estado_campo')
      .eq('autor_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);
    if (data?.[0]) setEstadoAtual(data[0].estado_campo);
  };

  const estadoInfo = ESTADOS_CAMPO.find(e => e.value === estadoAtual) || ESTADOS_CAMPO[1];

  const handleEnter = () => {
    setEntered(true);
    setTimeout(() => navigate('/casa-tecelas/interior'), 800);
  };

  return (
    <AppLayout>
      <RitualGate triggerEvent="first_sala_access" contextType="sala" contextId="casa-tecelas">
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
          <AnimatePresence mode="wait">
            {!entered ? (
              <motion.div
                key="atrium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl w-full text-center space-y-8"
              >
                {/* Symbolic Icon */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-gold/30 to-purple-500/30 flex items-center justify-center border border-gold/30">
                    <Sparkles className="w-10 h-10 text-gold" />
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-3xl md:text-4xl font-display text-gold"
                >
                  A Casa das Tecelãs
                </motion.h1>

                {/* Estado do Campo */}
                {user && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <Card className="glass border-border/20 max-w-sm mx-auto">
                      <CardContent className="p-4 flex items-center gap-3">
                        <estadoInfo.icon className={`w-5 h-5 ${estadoInfo.color}`} />
                        <div className="text-left">
                          <p className="text-xs text-muted-foreground">Seu campo simbólico</p>
                          <p className={`text-sm font-display ${estadoInfo.color}`}>
                            {estadoInfo.label} — {estadoInfo.desc}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Mensagem do Dia */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  {mensagemDia ? (
                    <div className="glass p-6 rounded-2xl border border-gold/20 max-w-lg mx-auto">
                      <p className="text-xs text-muted-foreground mb-2 tracking-widest uppercase">Mensagem do Campo</p>
                      <p className="text-lg text-foreground leading-relaxed italic font-display">
                        "{mensagemDia}"
                      </p>
                    </div>
                  ) : (
                    <div className="glass p-6 rounded-2xl border border-gold/20 max-w-lg mx-auto">
                      <p className="text-lg text-foreground/80 leading-relaxed italic font-display">
                        "A tecelã não cria o fio — ela revela o tecido que já existe."
                      </p>
                    </div>
                  )}
                </motion.div>

                {/* Entry */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <Button onClick={handleEnter} variant="gold" size="lg" className="gap-2 px-8">
                    Entrar no Campo
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  className="text-sm text-muted-foreground"
                >
                  Espaço de sustentação, refinamento e maturação simbólica.
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                key="transition"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-gold/20 animate-pulse flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-gold" />
                </div>
                <p className="text-muted-foreground mt-4 font-display">Atravessando o limiar...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </RitualGate>
      <FormationMapTrigger />
    </AppLayout>
  );
}
