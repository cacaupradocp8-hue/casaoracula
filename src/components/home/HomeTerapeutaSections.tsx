import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, AlertTriangle, Wrench, Plus, ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  userId: string;
}

interface ClienteRecente {
  id: string;
  nome: string;
  updated_at: string;
}

export function HomeTerapeutaSections({ userId }: Props) {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<ClienteRecente[]>([]);
  const [totalClientes, setTotalClientes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data, count } = await supabase
          .from('clientes')
          .select('id, nome, updated_at', { count: 'exact' })
          .eq('terapeuta_id', userId)
          .order('updated_at', { ascending: false })
          .limit(5);

        setClientes(data || []);
        setTotalClientes(count || 0);
      } catch (e) {
        console.error('Error loading terapeuta data:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
  };

  return (
    <section className="px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Casa das Máquinas */}
        <motion.div {...fadeUp} className="text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-primary/60 mb-1">Casa das Máquinas</p>
          <h2 className="font-display text-xl md:text-2xl text-foreground">Sua prática profissional</h2>
        </motion.div>

        {/* Stats rápidos */}
        <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
          <div className="grid grid-cols-3 gap-3">
            <Card className="border-border/30 bg-card/50">
              <CardContent className="p-4 text-center">
                <Users className="h-5 w-5 mx-auto mb-1 text-primary/70" />
                <p className="text-2xl font-semibold text-foreground">{totalClientes}</p>
                <p className="text-xs text-muted-foreground">Clientes</p>
              </CardContent>
            </Card>
            <Card className="border-border/30 bg-card/50">
              <CardContent className="p-4 text-center">
                <Calendar className="h-5 w-5 mx-auto mb-1 text-primary/70" />
                <p className="text-2xl font-semibold text-foreground">—</p>
                <p className="text-xs text-muted-foreground">Sessões hoje</p>
              </CardContent>
            </Card>
            <Card className="border-border/30 bg-card/50">
              <CardContent className="p-4 text-center">
                <AlertTriangle className="h-5 w-5 mx-auto mb-1 text-accent/70" />
                <p className="text-2xl font-semibold text-foreground">—</p>
                <p className="text-xs text-muted-foreground">Alertas</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Clientes recentes */}
        <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
          <Card className="border-border/30 bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-lg font-display">
                  <Users className="h-5 w-5 text-primary" />
                  Clientes recentes
                </span>
                <Button variant="ghost" size="sm" className="text-xs gap-1 text-primary" onClick={() => navigate('/clientes')}>
                  Ver todos <ArrowRight className="h-3 w-3" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => <div key={i} className="h-10 animate-pulse bg-muted rounded" />)}
                </div>
              ) : clientes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhum cliente cadastrado ainda.</p>
              ) : (
                <div className="space-y-2">
                  {clientes.map(c => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/clientes/${c.id}`)}
                    >
                      <span className="text-sm text-foreground/80">{c.nome}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Ações rápidas */}
        <motion.div {...fadeUp} transition={{ delay: 0.3 }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              variant="gold"
              size="lg"
              className="gap-2 w-full"
              onClick={() => navigate('/casa-maquinas')}
            >
              <Wrench className="h-4 w-4" />
              Abrir Casa das Máquinas
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 w-full border-primary/20"
              onClick={() => navigate('/ferramentas')}
            >
              <Sparkles className="h-4 w-4" />
              Ferramentas do método
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
