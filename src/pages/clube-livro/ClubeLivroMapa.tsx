// ============================================
// MAPA DO ANO ORACULAR — Visão das 8 Estações
// ============================================

import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useEstacoes } from '@/hooks/useEstacoes';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessFeature } from '@/types/portal';
import { BookOpen, ChevronRight, Home, Lock, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const TEXTO_ABERTURA = `Este ciclo não foi criado para te explicar nada.
Ele existe para te deslocar.

Aqui, o livro é campo.
A jornada é estrutura.

Não avance por desempenho.
Avance por verdade.

Quando algo incomodar, permaneça.
Quando algo fizer sentido, anote.

Este é um espaço de maturidade simbólica.
Entre com presença.`;

export default function ClubeLivroMapa() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: estacoes, isLoading } = useEstacoes();

  const isAssinante = user && canAccessFeature(user.portal, 'aluna');
  const isAdmin = user?.portal === 'admin';

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" /> Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/clube-livro" className="hover:text-foreground transition-colors">Clube do Livro</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Mapa do Ano</span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-lg text-foreground mb-2 flex items-center justify-center gap-2">
            <BookOpen className="w-5 h-5" />
            Mapa do Ano Oracular
          </h1>
          <p className="text-xs text-muted-foreground italic max-w-sm mx-auto leading-relaxed whitespace-pre-line">
            {TEXTO_ABERTURA}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground text-sm animate-pulse">
            Carregando estações…
          </div>
        ) : (
          <div className="space-y-3">
            {estacoes?.map((est, i) => {
              const canAccess = isAdmin || (isAssinante && est.ativa);
              const isActive = est.ativa;

              return (
                <motion.div
                  key={est.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Card
                    className={`transition-all duration-200 cursor-pointer hover:shadow-md ${
                      isActive
                        ? 'border-primary/40 shadow-sm'
                        : canAccess
                        ? 'hover:border-primary/20'
                        : 'opacity-50'
                    }`}
                    onClick={() => {
                      if (canAccess) navigate(`/clube-livro/estacao/${est.id}`);
                    }}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      {/* Fase lunar */}
                      <div className="text-2xl select-none shrink-0 w-10 text-center">
                        {est.fase_lunar || '◯'}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-bold uppercase tracking-widest text-primary">
                            {est.titulo}
                          </span>
                          {isActive && (
                            <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-primary text-primary font-bold">
                              ATIVA
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{est.subtitulo}</p>
                        <p className="text-sm font-medium text-foreground mt-1 truncate">
                          {est.livro_titulo}
                        </p>
                        {est.livro_autor && (
                          <p className="text-xs text-muted-foreground truncate">{est.livro_autor}</p>
                        )}
                      </div>

                      {/* Ação */}
                      <div className="shrink-0">
                        {canAccess ? (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10">
                            <ArrowRight className="w-4 h-4 text-primary" />
                          </div>
                        ) : (
                          <Lock className="w-4 h-4 text-muted-foreground/40" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
