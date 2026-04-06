import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Headphones, Flower2, Loader2 } from 'lucide-react';
import { ExplorarCasaSection } from '@/components/home/ExplorarCasaSection';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Estacao {
  id: string;
  titulo: string;
  subtitulo: string;
  numero: number;
  livro_titulo: string;
  livro_autor: string | null;
  ativa: boolean;
}

/**
 * ClubeHomePage — Home para Assinante do Clube
 * Portal Atual em destaque + Portais anteriores
 */
export function ClubeHomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [estacaoAtual, setEstacaoAtual] = useState<Estacao | null>(null);
  const [estacoesPrevias, setEstacoesPrevias] = useState<Estacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: estacoes } = await supabase
          .from('clube_estacoes')
          .select('id, titulo, subtitulo, numero, livro_titulo, livro_autor, ativa')
          .eq('publicada', true)
          .order('numero', { ascending: false });

        if (estacoes && estacoes.length > 0) {
          const atual = estacoes.find(e => e.ativa) || estacoes[0];
          setEstacaoAtual(atual);
          setEstacoesPrevias(estacoes.filter(e => e.id !== atual.id));
        }
      } catch (e) {
        console.error('Error loading clube data:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const welcomeName = user?.name?.split(' ')[0] || 'Assinante';

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">
            Bem-vinda, <span className="text-primary">{welcomeName}</span>
          </h1>
          <p className="text-muted-foreground">
            Seu portal de leitura simbólica.
          </p>
        </motion.div>

        {/* Portal Atual — Grande destaque */}
        {estacaoAtual && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 font-medium">
              Portal Atual
            </h2>
            <Card className="glass border-primary/15 hover:border-primary/25 transition-all">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                    Estação {estacaoAtual.numero}
                  </span>
                </div>
                <h3 className="font-display text-2xl font-semibold text-foreground mb-1">
                  {estacaoAtual.titulo}
                </h3>
                <p className="text-muted-foreground text-sm mb-1">{estacaoAtual.subtitulo}</p>
                <p className="text-muted-foreground/60 text-xs mb-6">
                  {estacaoAtual.livro_titulo}{estacaoAtual.livro_autor ? ` — ${estacaoAtual.livro_autor}` : ''}
                </p>

                <p className="text-xs uppercase tracking-[0.2em] text-primary/50 font-medium mb-4">
                  Seu próximo passo agora é:
                </p>

                <Button
                  variant="gold"
                  onClick={() => navigate(`/clube-livro/porta/${estacaoAtual.id}`)}
                  className="w-full gap-2"
                >
                  Abrir Portal
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Portais anteriores */}
        {estacoesPrevias.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 font-medium">
              Portais Anteriores
            </h2>
            <div className="space-y-2 mb-6">
              {estacoesPrevias.slice(0, 5).map(est => (
                <Card
                  key={est.id}
                  className="border-border/20 hover:border-primary/15 transition-all cursor-pointer"
                  onClick={() => navigate(`/clube-livro/porta/${est.id}`)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Estação {est.numero} — {est.titulo}
                      </p>
                      <p className="text-xs text-muted-foreground">{est.livro_titulo}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground/40" />
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/biblioteca-travessias')}
            >
              Ver Biblioteca de Portais
            </Button>
          </motion.div>
        )}

        <ExplorarCasaSection />
      </div>
    </AppLayout>
  );
}
