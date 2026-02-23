// ============================================
// CLUBE DO LIVRO ORACULAR — Página de Entrada
// ============================================

import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, ChevronRight, Home, Compass, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ESTACAO_PILOTO } from '@/data/clubeLivroData';

export default function ClubeLivroApresentacao() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isVisitor = !user || user.portal === 'visitante';

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Clube do Livro Oracular</span>
        </nav>

        <SectionHeader
          title="Clube do Livro Oracular"
          subtitle=""
          icon={<BookOpen className="w-5 h-5" />}
          className="mb-8"
        />

        {/* Texto-matriz */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 max-w-md mx-auto"
        >
          <p className="text-muted-foreground italic leading-relaxed text-sm">
            Este ciclo não foi criado para te explicar nada.
            <br />Ele existe para te deslocar.
          </p>
          <p className="text-muted-foreground/70 italic leading-relaxed text-xs mt-3">
            Aqui, o livro é campo.
            <br />A jornada é estrutura.
          </p>
        </motion.div>

        {/* Botões */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col gap-4 max-w-sm mx-auto"
        >
          <Button
            size="lg"
            className="w-full gap-2 h-14 text-base"
            onClick={() => navigate('/clube-livro/estacao')}
          >
            <Compass className="w-5 h-5" />
            {ESTACAO_PILOTO.nome}
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full gap-2 h-14 text-base"
            onClick={() => navigate('/clube-livro/como-ler')}
          >
            <Headphones className="w-5 h-5" />
            Como Ler no Clube
          </Button>
        </motion.div>

        {isVisitor && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-xs text-muted-foreground/60 mt-8"
          >
            Visitantes podem ver a página institucional.
            <br />Para acessar as Jornadas e Portais, é necessário ser assinante.
          </motion.p>
        )}
      </div>
    </AppLayout>
  );
}
