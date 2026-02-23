// ============================================
// COMO ESCOLHEMOS OS LIVROS — Página Institucional
// ============================================

import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { BookOpen, ChevronRight, Home, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const SECTIONS = [
  {
    titulo: 'Um livro não é escolhido. Ele é convocado.',
    texto: 'Cada obra que entra neste ciclo foi testada em contexto clínico, formativo e simbólico. Não basta ser bom — precisa mover. Não basta ser profundo — precisa ser aplicável.',
  },
  {
    titulo: 'O critério não é popularidade.',
    texto: 'Nenhum livro está aqui por ser bestseller, por estar na moda ou por recomendação genérica. Cada obra foi selecionada por sua capacidade de ativar um campo psíquico específico — e de sustentar a travessia que esse campo exige.',
  },
  {
    titulo: 'Cada estação é um campo.',
    texto: 'Os livros não formam uma lista. Formam uma arquitetura. Cada estação ativa um território da psique — e o livro-eixo é a porta de entrada. A leitura não é consumo. É travessia.',
  },
  {
    titulo: 'O que buscamos em cada obra:',
    texto: '• Capacidade de deslocamento interior\n• Aplicabilidade em sessão, aula ou círculo\n• Profundidade simbólica sem academicismo\n• Força narrativa que sustenta a escuta\n• Ética no trato com a dor humana',
  },
  {
    titulo: 'Este é um espaço de maturidade.',
    texto: 'Não oferecemos resumos. Não traduzimos em linguagem fácil. Não simplificamos o que precisa ser vivido. Oferecemos estrutura para que você atravesse — com presença, com ética, com corpo.',
  },
];

export default function ClubeLivroComoEscolhemos() {
  const navigate = useNavigate();

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
          <span className="text-foreground">Como Escolhemos os Livros</span>
        </nav>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-xl text-foreground mb-8 text-center"
        >
          <BookOpen className="w-5 h-5 inline-block mr-2 -mt-0.5" />
          Como Escolhemos os Livros
        </motion.h1>

        <div className="space-y-8">
          {SECTIONS.map((s, i) => (
            <motion.section
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <h2 className="text-sm font-semibold text-foreground mb-2">{s.titulo}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {s.texto}
              </p>
            </motion.section>
          ))}
        </div>

        <div className="pt-8">
          <Button
            size="lg"
            className="w-full gap-2 h-14 text-base"
            onClick={() => navigate('/clube-livro/mapa')}
          >
            <Compass className="w-5 h-5" />
            Ver o Mapa do Ano Oracular
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
