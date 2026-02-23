// ============================================
// MANDALA ANUAL — Página dedicada
// ============================================

import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { MandalaAnualDB } from '@/components/clube-livro/MandalaAnualDB';
import { BookOpen, ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ClubeLivroMandala() {
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
          <span className="text-foreground">Mandala Anual</span>
        </nav>

        {/* Texto orientador */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-lg text-foreground mb-2 flex items-center justify-center gap-2">
            <BookOpen className="w-5 h-5" />
            Mandala Anual
          </h1>
          <p className="text-sm text-muted-foreground italic max-w-sm mx-auto leading-relaxed">
            Comece pelo centro.
            <br />Depois escolha uma Travessia.
            <br />As Portas e Pontes se revelam no caminho.
          </p>
        </motion.div>

        {/* Mandala */}
        <MandalaAnualDB />
      </div>
    </AppLayout>
  );
}
