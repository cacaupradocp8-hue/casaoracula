// ============================================
// ESTAÇÃO I — Lê do banco de dados
// ============================================

import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, ChevronRight, Home, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEstacoes } from '@/hooks/useEstacoes';
import { useAllPortais } from '@/hooks/useClubeLivro';

export default function ClubeLivroEstacaoI() {
  const navigate = useNavigate();
  const { data: estacoes, isLoading: le } = useEstacoes();
  const estacaoI = estacoes?.find(e => e.numero === 1);
  const { data: allData, isLoading: lp } = useAllPortais(estacaoI?.id);

  if (le || lp) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  if (!estacaoI || !allData) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Estação não encontrada.</p>
        </div>
      </AppLayout>
    );
  }

  const { jornadas, portais } = allData;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/clube-livro" className="hover:text-foreground transition-colors">
            Clube do Livro
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Estação I</span>
        </nav>

        <SectionHeader
          title={estacaoI.titulo}
          subtitle={estacaoI.subtitulo}
          icon={<span className="text-xl">{estacaoI.fase_lunar}</span>}
          className="mb-4"
        />

        {/* Livro-eixo */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-muted/50 border border-border"
        >
          <BookOpen className="w-5 h-5 text-primary shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">{estacaoI.livro_titulo}</p>
            <p className="text-xs text-muted-foreground">{estacaoI.livro_autor}</p>
          </div>
        </motion.div>

        {/* Jornadas + Portais */}
        <div className="space-y-8">
          {jornadas.map((jornada, ji) => {
            const jornadaPortais = portais.filter(p => p.jornada_id === jornada.id);
            return (
              <motion.div
                key={jornada.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + ji * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-lg">{jornada.icone}</span>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">{jornada.nome}</h2>
                    <p className="text-xs text-muted-foreground">{jornada.subtitulo}</p>
                  </div>
                </div>

                <div className="space-y-3 pl-2 border-l-2 border-border ml-3">
                  {jornadaPortais.map((portal) => (
                    <Card
                      key={portal.id}
                      className="cursor-pointer hover:border-primary/40 transition-colors"
                      onClick={() => navigate(`/clube-livro/portal/${portal.slug}`)}
                    >
                      <CardContent className="p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-lg">{portal.icone}</span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground">{portal.nome}</p>
                            <p className="text-xs text-muted-foreground truncate">{portal.subtitulo}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
