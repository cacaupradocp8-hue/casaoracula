// ============================================
// PÁGINA DO LIVRO — TRAVESSIA
// /clube-livro/livro/:id
// ============================================

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { useBook, useBookLessons, useBookLinksForBook } from '@/hooks/useBooks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Play, Headphones, MapPin, ChevronDown, ChevronUp,
  AlertTriangle, ArrowRight, BookOpen, Sparkles, Link2,
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const CATEGORY_LABELS: Record<string, string> = {
  TRAVESSIA: 'Travessia',
  PORTA: 'Porta',
  PONTE: 'Ponte',
  FUNDACAO: 'Fundação',
  MATRIZ: 'Matriz',
};

const PHASE_LABELS: Record<string, { label: string; icon: string }> = {
  CHAMADO: { label: 'Chamado', icon: '🌙' },
  RUPTURA: { label: 'Ruptura', icon: '🔥' },
  REORGANIZACAO: { label: 'Reorganização', icon: '🌊' },
  INTEGRACAO: { label: 'Integração', icon: '✦' },
};

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function ClubeLivroLivro() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: book, isLoading } = useBook(id);
  const { data: lessons } = useBookLessons(id);
  const { data: bookLinks } = useBookLinksForBook(id);
  const [openWeek, setOpenWeek] = useState<number | null>(null);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!book) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
          Livro não encontrado.
        </div>
      </AppLayout>
    );
  }

  const connections = (bookLinks || []).map(link => {
    const isFrom = link.from_book_id === id;
    const connectedBook = isFrom ? link.to_book : link.from_book;
    return { ...link, connectedBook, direction: isFrom ? 'para' : 'de' };
  }).filter(c => c.connectedBook);

  const sortedLessons = [...(lessons || [])].sort((a, b) => a.week_number - b.week_number);

  // Collect all clinical alerts from lessons
  const clinicalAlerts = sortedLessons
    .filter(l => l.clinical_alert)
    .map(l => ({ week: l.week_number, phase: l.phase, alert: l.clinical_alert! }));

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 pb-24">

        {/* ═══════════════════════════════════════
            1️⃣ TOPO — CAPA + TÍTULO + BADGES
        ═══════════════════════════════════════ */}
        <motion.section {...fade} className="pt-10 pb-8 text-center">
          {book.cover_url && (
            <div className="relative mx-auto w-48 h-72 mb-6">
              <img
                src={book.cover_url}
                alt={book.title}
                className="w-full h-full object-cover rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-primary/10"
              />
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5" />
            </div>
          )}

          <h1 className="font-display text-3xl md:text-4xl text-foreground tracking-wide mb-2">
            {book.title}
          </h1>
          {book.author && (
            <p className="text-muted-foreground text-sm mb-4">{book.author}</p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <Badge variant="outline" className="border-primary/20 text-primary text-xs">
              {CATEGORY_LABELS[book.category] || book.category}
            </Badge>
            {book.is_multipolar && (
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="w-3 h-3 mr-1" /> Multipolar
              </Badge>
            )}
          </div>

          {book.description_short && (
            <p className="text-sm text-muted-foreground/80 italic max-w-md mx-auto leading-relaxed mb-6">
              {book.description_short}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="gold"
              size="lg"
              className="gap-2"
              onClick={() => {
                const el = document.getElementById('aulas-album');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Play className="w-4 h-4" />
              Iniciar Travessia
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-primary/25 hover:bg-primary/5"
              onClick={() => navigate(`/clube/laboratorio/livro/${book.id}`)}
            >
              <Sparkles className="w-4 h-4" />
              Levar ao Laboratório
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground/50 mt-3">
            Simule a leitura desta obra como cliente simbólica.
          </p>
        </motion.section>

        <Divider />

        {/* ═══════════════════════════════════════
            2️⃣ ÁUDIO DE ABERTURA
        ═══════════════════════════════════════ */}
        <motion.section {...fade} className="py-10">
          <p className="text-xs uppercase tracking-[0.25em] text-primary/50 text-center mb-4">
            Ouça antes de começar
          </p>
          <Card className="border-primary/10 bg-card/60">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">Áudio de Abertura</p>
                <p className="text-xs text-muted-foreground">
                  Um convite à escuta antes da leitura.
                </p>
              </div>
              <Button variant="ghost" size="icon" className="text-primary shrink-0">
                <Play className="w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </motion.section>

        <Divider />

        {/* ═══════════════════════════════════════
            3️⃣ ONDE VOCÊ ESTÁ NA MANDALA
        ═══════════════════════════════════════ */}
        <motion.section {...fade} className="py-10">
          <p className="text-xs uppercase tracking-[0.25em] text-primary/50 text-center mb-4">
            Onde você está na mandala
          </p>
          <Card className="border-primary/10 bg-card/60">
            <CardContent className="p-6 text-center">
              <MapPin className="w-5 h-5 text-primary mx-auto mb-3" />
              <p className="text-sm text-foreground leading-relaxed">
                Este livro ativa principalmente o campo{' '}
                <span className="text-primary font-semibold">
                  {CATEGORY_LABELS[book.category] || book.category}
                </span>
              </p>
              <p className="text-xs text-muted-foreground/60 mt-2">
                Observe como ele ressoa com seu caminho atual.
              </p>
            </CardContent>
          </Card>
        </motion.section>

        <Divider />

        {/* ═══════════════════════════════════════
            4️⃣ AULAS-ÁLBUM (4 SEMANAS)
        ═══════════════════════════════════════ */}
        <motion.section {...fade} id="aulas-album" className="py-10">
          <p className="text-xs uppercase tracking-[0.25em] text-primary/50 text-center mb-6">
            Aulas-Álbum
          </p>

          {sortedLessons.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-6">
              As aulas deste livro estão em preparação.
            </p>
          ) : (
            <div className="space-y-3">
              {sortedLessons.map((lesson) => {
                const phase = PHASE_LABELS[lesson.phase] || { label: lesson.phase, icon: '○' };
                const isOpen = openWeek === lesson.week_number;

                return (
                  <Collapsible
                    key={lesson.id}
                    open={isOpen}
                    onOpenChange={(o) => setOpenWeek(o ? lesson.week_number : null)}
                  >
                    <CollapsibleTrigger asChild>
                      <Card className="border-primary/10 hover:border-primary/20 transition-colors cursor-pointer">
                        <CardContent className="p-4 flex items-center gap-3">
                          <span className="text-lg">{phase.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">
                              Semana {lesson.week_number} — {phase.label}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{lesson.title}</p>
                          </div>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                          )}
                        </CardContent>
                      </Card>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="mt-2 ml-2 border-l-2 border-primary/10 pl-4 pb-4 space-y-4">
                        {/* Description */}
                        {lesson.description && (
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {lesson.description}
                          </p>
                        )}

                        {/* Audio placeholder */}
                        {(lesson.audio_url || lesson.podcast_url) && (
                          <div className="flex items-center gap-3 bg-secondary/50 rounded-lg p-3">
                            <Headphones className="w-4 h-4 text-primary" />
                            <span className="text-xs text-foreground">Escuta disponível</span>
                            <Button variant="ghost" size="sm" className="ml-auto text-primary text-xs">
                              <Play className="w-3 h-3 mr-1" /> Ouvir
                            </Button>
                          </div>
                        )}

                        {/* Questions */}
                        {lesson.questions && Array.isArray(lesson.questions) && lesson.questions.length > 0 && (
                          <div>
                            <p className="text-xs uppercase tracking-widest text-primary/40 mb-2">Perguntas</p>
                            <ul className="space-y-1.5">
                              {(lesson.questions as string[]).map((q, i) => (
                                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                                  <span className="text-primary/40 shrink-0">•</span>
                                  {q}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Clinical alert */}
                        {lesson.clinical_alert && (
                          <div className="flex gap-2 text-sm bg-destructive/10 text-destructive/90 p-3 rounded-lg">
                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{lesson.clinical_alert}</span>
                          </div>
                        )}

                        {/* Guided reading */}
                        {lesson.guided_reading && (
                          <p className="text-xs text-muted-foreground/70 italic">
                            {lesson.guided_reading}
                          </p>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
          )}
        </motion.section>

        <Divider />

        {/* ═══════════════════════════════════════
            5️⃣ PERGUNTAS DA SEMANA
        ═══════════════════════════════════════ */}
        {sortedLessons.some(l => l.questions && (l.questions as string[]).length > 0) && (
          <>
            <motion.section {...fade} className="py-10">
              <p className="text-xs uppercase tracking-[0.25em] text-primary/50 text-center mb-6">
                Perguntas para contemplação
              </p>
              <div className="space-y-3">
                {sortedLessons
                  .filter(l => l.questions && (l.questions as string[]).length > 0)
                  .flatMap(l => (l.questions as string[]).map((q, i) => ({ q, key: `${l.id}-${i}` })))
                  .slice(0, 5)
                  .map(({ q, key }) => (
                    <div key={key} className="flex gap-3 items-start">
                      <span className="text-primary/30 mt-0.5">○</span>
                      <p className="text-sm text-foreground/90 leading-relaxed">{q}</p>
                    </div>
                  ))}
              </div>

              <div className="mt-6">
                <textarea
                  placeholder="Se algo se moveu, escreva aqui…"
                  className="w-full bg-secondary/30 border border-primary/10 rounded-lg p-4 text-sm text-foreground placeholder:text-muted-foreground/40 resize-none min-h-[100px] focus:outline-none focus:border-primary/30 transition-colors"
                />
                <p className="text-xs text-muted-foreground/50 mt-2 text-right">
                  Espaço pessoal — ninguém mais lê.
                </p>
              </div>
            </motion.section>
            <Divider />
          </>
        )}

        {/* ═══════════════════════════════════════
            6️⃣ ALERTA CLÍNICO
        ═══════════════════════════════════════ */}
        {clinicalAlerts.length > 0 && (
          <>
            <motion.section {...fade} className="py-10">
              <p className="text-xs uppercase tracking-[0.25em] text-destructive/50 text-center mb-4">
                Alerta clínico
              </p>
              <Card className="border-destructive/15 bg-destructive/5">
                <CardContent className="p-6 space-y-3">
                  <AlertTriangle className="w-5 h-5 text-destructive/70 mx-auto mb-2" />
                  {clinicalAlerts.map((a, i) => (
                    <p key={i} className="text-sm text-destructive/80 leading-relaxed text-center">
                      {a.alert}
                    </p>
                  ))}
                </CardContent>
              </Card>
            </motion.section>
            <Divider />
          </>
        )}

        {/* ═══════════════════════════════════════
            7️⃣ CONEXÕES
        ═══════════════════════════════════════ */}
        {connections.length > 0 && (
          <>
            <motion.section {...fade} className="py-10">
              <p className="text-xs uppercase tracking-[0.25em] text-primary/50 text-center mb-6">
                Conexões desta obra
              </p>
              <div className="grid gap-3">
                {connections.map(c => (
                  <Card
                    key={c.id}
                    className="border-primary/10 hover:border-primary/20 transition-all cursor-pointer"
                    onClick={() => navigate(`/clube-livro/livro/${c.connectedBook.id}`)}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <Link2 className="w-4 h-4 text-primary/40 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {c.connectedBook.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {c.link_type === 'SUPORTA' && 'Suporta esta travessia'}
                          {c.link_type === 'ABRE' && 'Abre caminho'}
                          {c.link_type === 'INTEGRA' && 'Integra com esta obra'}
                          {c.link_type === 'FUNDA' && 'Fundação'}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.section>
            <Divider />
          </>
        )}

        {/* ═══════════════════════════════════════
            8️⃣ CONTINUE SUA TRAVESSIA
        ═══════════════════════════════════════ */}
        <motion.section {...fade} className="py-14 text-center">
          <BookOpen className="w-6 h-6 text-primary/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-6">
            A travessia continua na mandala.
          </p>
          <Button
            variant="outline"
            className="border-primary/20 hover:border-primary/40 text-foreground gap-2"
            onClick={() => navigate('/clube-livro')}
          >
            Voltar para Mandala
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.section>
      </div>
    </AppLayout>
  );
}

/** Minimal horizontal divider */
function Divider() {
  return <div className="w-12 h-px bg-primary/10 mx-auto" />;
}
