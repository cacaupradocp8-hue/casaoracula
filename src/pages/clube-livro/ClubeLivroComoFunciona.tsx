// ============================================
// COMO FUNCIONA O CLUBE DO LIVRO ORACULAR
// ============================================

import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { BookOpen, ChevronRight, Home, Map, Headphones, BookMarked, Mic, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const LAYERS = [
  { key: 'MATRIZ', label: 'Matriz', desc: 'Campo central que sustenta o ciclo', icon: '☽◯☾', cor: 'hsl(43, 60%, 54%)' },
  { key: 'TRAVESSIA', label: 'Travessia', desc: 'Livros-guia do amadurecimento', icon: '◈', cor: 'hsl(212, 50%, 36%)' },
  { key: 'PORTA', label: 'Porta', desc: 'Livros que aprofundam um tema', icon: '🗝', cor: 'hsl(152, 37%, 36%)' },
  { key: 'PONTE', label: 'Ponte', desc: 'Livros que ajudam a integrar na vida', icon: '⌒', cor: 'hsl(268, 38%, 64%)' },
  { key: 'FUNDACAO', label: 'Fundação', desc: 'Base teórica do método', icon: '⊞', cor: 'hsl(30, 6%, 45%)' },
];

const FORMATOS = [
  { label: 'Áudios semanais', icon: Headphones },
  { label: 'Aulas-Álbum', icon: BookMarked },
  { label: 'Podcasts', icon: Mic },
  { label: 'Registros no Jardim', icon: PenLine },
];

export default function ClubeLivroComoFunciona() {
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
          <span className="text-foreground">Como Funciona</span>
        </nav>

        <div className="space-y-10">
          {/* BLOCO 1 — O QUE É UMA JORNADA */}
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
              O que é uma Jornada
            </h2>
            <p className="text-sm text-foreground/80 italic leading-relaxed border-l-2 border-primary/30 pl-4">
              Uma jornada é a estrutura que sustenta a leitura.
              <br />O livro é o portal. A jornada é o caminho.
            </p>
          </motion.section>

          {/* BLOCO 2 — AS PARTES DA JORNADA */}
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
              As Partes da Jornada
            </h2>
            <div className="grid gap-3">
              {LAYERS.map((l) => (
                <Card key={l.key} className="border-l-4" style={{ borderLeftColor: l.cor }}>
                  <CardContent className="p-4 flex items-start gap-3">
                    <span className="text-lg select-none shrink-0" style={{ color: l.cor }}>{l.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{l.label}</p>
                      <p className="text-xs text-muted-foreground">{l.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>

          {/* BLOCO 3 — COMO A LEITURA ACONTECE */}
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Como a Leitura Acontece
            </h2>
            <p className="text-sm text-foreground/80 italic leading-relaxed border-l-2 border-primary/30 pl-4">
              Você não precisa ler tudo.
              <br />Você precisa escutar o que chama.
            </p>
          </motion.section>

          {/* BLOCO 4 — FORMATO */}
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Formato
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {FORMATOS.map((f) => (
                <div key={f.label} className="flex items-center gap-2.5 p-3 rounded-lg bg-muted/40 border border-border/50">
                  <f.icon className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm text-foreground">{f.label}</span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* BLOCO 5 — RITMO */}
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Ritmo
            </h2>
            <p className="text-sm text-foreground/80 italic leading-relaxed border-l-2 border-primary/30 pl-4">
              O ritmo não é cronológico.
              <br />É simbólico.
            </p>
          </motion.section>

          {/* CTA */}
          <div className="pt-4">
            <Button
              size="lg"
              className="w-full gap-2 h-14 text-base"
              onClick={() => navigate('/clube-livro/mandala')}
            >
              <Map className="w-5 h-5" />
              Entrar pela Mandala Anual
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
