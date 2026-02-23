// ============================================
// ESTAÇÃO I — Matriz · Chamado · Feminino Arcaico
// ============================================

import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronRight, Home, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { ESTACAO_PILOTO, JORNADAS, getPortaisByJornada } from '@/data/clubeLivroData';

export default function ClubeLivroEstacaoI() {
  const navigate = useNavigate();

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
          title={ESTACAO_PILOTO.nome}
          subtitle={ESTACAO_PILOTO.subtitulo}
          icon={<span className="text-xl">{ESTACAO_PILOTO.faseLunar}</span>}
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
            <p className="text-sm font-medium text-foreground">{ESTACAO_PILOTO.livroTitulo}</p>
            <p className="text-xs text-muted-foreground">{ESTACAO_PILOTO.livroAutor}</p>
          </div>
        </motion.div>

        {/* Descrição */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-muted-foreground leading-relaxed mb-10"
        >
          {ESTACAO_PILOTO.descricao}
        </motion.p>

        {/* Jornadas + Portais */}
        <div className="space-y-8">
          {JORNADAS.map((jornada, ji) => {
            const portais = getPortaisByJornada(jornada.slug);
            return (
              <motion.div
                key={jornada.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + ji * 0.1 }}
              >
                {/* Jornada header */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-lg">{jornada.icone}</span>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">{jornada.nome}</h2>
                    <p className="text-xs text-muted-foreground">{jornada.subtitulo}</p>
                  </div>
                </div>

                {/* Portais */}
                <div className="space-y-3 pl-2 border-l-2 border-border ml-3">
                  {portais.map((portal) => (
                    <Card
                      key={portal.slug}
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
