// ============================================
// COMO LER NO CLUBE — Áudio-Matriz
// ============================================

import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Home, ChevronRight, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ClubeLivroComoLer() {
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
          <span className="text-foreground">Como Ler</span>
        </nav>

        <SectionHeader
          title="Como Ler no Clube"
          subtitle="Orientação simbólica para a travessia"
          icon={<Headphones className="w-5 h-5" />}
          className="mb-8"
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              Ler no Clube do Livro Oracular não é ler como se lê um manual.
              Não há resumo a fazer, fichamento a entregar, nem conteúdo a dominar.
            </p>

            <h3 className="text-foreground text-base font-semibold mt-6 mb-2">
              O que significa ler aqui?
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Significa permitir que o livro trabalhe em você — não o contrário.
              Cada obra foi escolhida como campo simbólico, não como conteúdo informativo.
              O objetivo não é saber mais, é perceber mais.
            </p>

            <h3 className="text-foreground text-base font-semibold mt-6 mb-2">
              A estrutura da travessia
            </h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <strong className="text-foreground">Estação</strong> — O campo simbólico ancorado por um livro-eixo.
              </li>
              <li>
                <strong className="text-foreground">Jornada</strong> — O ângulo pelo qual você atravessa o campo (pessoal ou sombra).
              </li>
              <li>
                <strong className="text-foreground">Portal</strong> — O gesto concreto de integração: reconhecer, recordar, romper.
              </li>
            </ul>

            <h3 className="text-foreground text-base font-semibold mt-6 mb-2">
              Orientação prática
            </h3>
            <ol className="text-muted-foreground space-y-2 text-sm">
              <li>Leia sem pressa. Não há prazo.</li>
              <li>Anote o que toca — não o que "deveria" anotar.</li>
              <li>Use os Portais como espelhos, não como checklists.</li>
              <li>O Laboratório 80/20 é onde a leitura vira prática.</li>
              <li>A Guardiã da Integração está disponível quando precisar destilar.</li>
            </ol>
          </div>

          {/* Placeholder para áudio futuro */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border text-center">
            <Headphones className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">
              Áudio-matriz em preparação.
            </p>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
