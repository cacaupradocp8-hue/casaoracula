// ============================================
// CLUBE DO LIVRO ORACULAR - Página de Entrada
// ============================================

import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessFeature } from '@/types/portal';
import { useAccessExpiration } from '@/hooks/useAccessExpiration';
import { LockedForVisitor } from '@/components/shared/LockedForVisitor';
import { BookOpen, ChevronRight, Home, Map, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function ClubeLivroApresentacao() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isExpired } = useAccessExpiration();

  const hasAccess = user && canAccessFeature(user.portal, 'aluna') && !isExpired;

  if (!hasAccess) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl">
          <SectionHeader
            title="Clube do Livro Oracular"
            subtitle="Este espaço é exclusivo para alunas e assinantes."
            icon={<BookOpen className="w-5 h-5" />}
          />
          <LockedForVisitor />
        </div>
      </AppLayout>
    );
  }

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

        {/* Texto de orientação */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 max-w-md mx-auto"
        >
          <p className="text-muted-foreground italic leading-relaxed text-sm">
            Este não é um clube de leitura comum.
            <br />
            Aqui, os livros não são lidos em sequência,
            <br />
            mas atravessados como jornadas de consciência.
          </p>
        </motion.div>

        {/* Dois botões principais */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col gap-4 max-w-sm mx-auto"
        >
          <Button
            size="lg"
            className="w-full gap-2 h-14 text-base"
            onClick={() => navigate('/clube-livro/mandala')}
          >
            <Map className="w-5 h-5" />
            Entrar pela Mandala Anual
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full gap-2 h-14 text-base"
            onClick={() => navigate('/clube-livro/como-funciona')}
          >
            <HelpCircle className="w-5 h-5" />
            Entender Como Funciona
          </Button>
        </motion.div>
      </div>
    </AppLayout>
  );
}
