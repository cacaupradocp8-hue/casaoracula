import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEstacaoAtiva } from '@/hooks/useEstacaoAtiva';
import { useAllBooks } from '@/hooks/useBooks';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FlaskConical, Compass, Eye, Hammer, BookOpen, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { Laboratorio8020Modal } from '@/components/clube/Laboratorio8020Modal';

// ─────────────────────────────────────────────────────────────
// /clube/laboratorio — Hub do Laboratório Oracular
// Estação ativa em destaque + acervo de livros abaixo.
// Cada card abre /clube/laboratorio/:tipo/:id (tipo = season|book)
// ─────────────────────────────────────────────────────────────

export default function ClubeLaboratorio() {
  const { user } = useAuth();
  const { data: estacao, isLoading: loadingEstacao } = useEstacaoAtiva();
  const { data: books = [], isLoading: loadingBooks } = useAllBooks();

  // Progresso do usuário em cada laboratório (para mostrar status)
  const { data: progresso = [] } = useQuery({
    queryKey: ['lab-oracular-progress-list', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lab_8020_progress')
        .select('id, season_id, book_id, cart_status, esp_status, forja_status, concluido')
        .eq('user_id', user!.id);
      if (error) throw error;
      return data || [];
    },
  });

  const statusFor = (kind: 'season' | 'book', id: string) => {
    const p = progresso.find(p => kind === 'season' ? p.season_id === id : p.book_id === id);
    if (!p) return 'not_started' as const;
    if (p.concluido) return 'completed' as const;
    const phases = [p.cart_status, p.esp_status, p.forja_status];
    if (phases.every(s => s === 'completed')) return 'completed' as const;
    if (phases.some(s => s !== 'not_started')) return 'in_progress' as const;
    return 'not_started' as const;
  };

  const isLoading = loadingEstacao || loadingBooks;

  // Encontrar o ID do livro correspondente à estação atual (se houver)
  const estacaoBook = books.find(b => b.title === estacao?.livro_titulo);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <SectionHeader
          title="Laboratório Oracular"
          subtitle="Cabine de simulação clínica simbólica — Cartografia → Espelho → Forja"
          icon={<FlaskConical className="w-5 h-5" />}
        />

        {/* Manifesto curto + 3 fases */}
        <Card className="mt-6 p-5 bg-gradient-to-br from-primary/5 via-background to-amber-500/5 border-primary/20">
          <div className="flex items-start gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Aqui você lê uma obra como cliente simbólica, atravessa o campo, conecta com sua prática e cria condução terapêutica. Use repetidamente — o laboratório melhora sua escuta real.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <PhaseChip icon={<Compass className="w-3.5 h-3.5" />} label="Cartografia" />
            <PhaseChip icon={<Eye className="w-3.5 h-3.5" />} label="Espelho" />
            <PhaseChip icon={<Hammer className="w-3.5 h-3.5" />} label="Forja" />
          </div>
        </Card>

        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <>
            {/* Estação ativa em destaque */}
            {estacao && (
              <div className="mt-8">
                <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Travessia do ciclo
                </h2>
                <div className="relative">
                  <Link to={`/clube/laboratorio/season/${estacao.id}`}>
                    <Card className="p-5 border-primary/30 bg-card hover:border-primary/60 transition group cursor-pointer">
                      <div className="flex gap-4">
                        {estacao.livro_capa_url ? (
                          <img src={estacao.livro_capa_url} alt={estacao.livro_titulo} className="w-20 h-28 object-cover rounded flex-shrink-0" loading="lazy" />
                        ) : (
                          <div className="w-20 h-28 rounded bg-muted flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <Badge className="mb-2 text-[10px]" variant="default">Estação ativa</Badge>
                          <h3 className="font-display text-lg text-foreground group-hover:text-primary transition truncate">
                            {estacao.titulo}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-0.5 truncate">
                            {estacao.livro_titulo}{estacao.livro_autor ? ` — ${estacao.livro_autor}` : ''}
                          </p>
                          <div className="mt-3 flex items-center gap-3">
                            <StatusBadge status={statusFor('season', estacao.id)} />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                  {estacaoBook && (
                    <div className="absolute bottom-5 right-5 z-20">
                      <Laboratorio8020Modal 
                        bookId={estacaoBook.id} 
                        bookTitle={estacaoBook.title} 
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Acervo livre */}
            <div className="mt-8">
              <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Acervo — prática livre
              </h2>
              {books.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground text-sm">
                  Nenhum livro no acervo ainda.
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {books
                    .filter(b => !estacao || b.title !== estacao.livro_titulo)
                    .map(book => (
                      <div key={book.id} className="relative group/essence">
                        <Link to={`/clube/laboratorio/book/${book.id}`}>
                          <Card className="p-4 hover:border-primary/40 transition group cursor-pointer h-full">
                            <div className="flex gap-3">
                              {book.cover_url ? (
                                <img src={book.cover_url} alt={book.title} className="w-14 h-20 object-cover rounded flex-shrink-0" loading="lazy" />
                              ) : (
                                <div className="w-14 h-20 rounded bg-muted flex items-center justify-center flex-shrink-0">
                                  <BookOpen className="w-5 h-5 text-muted-foreground" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition line-clamp-2">
                                  {book.title}
                                </h3>
                                {book.author && (
                                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{book.author}</p>
                                )}
                                <div className="mt-2">
                                  <StatusBadge status={statusFor('book', book.id)} small />
                                </div>
                              </div>
                            </div>
                          </Card>
                        </Link>
                        <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover/essence:opacity-100 transition-opacity">
                          <Laboratorio8020Modal 
                            bookId={book.id} 
                            bookTitle={book.title} 
                          />
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}

function PhaseChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center justify-center gap-1.5 py-2 px-2 rounded bg-background/50 border border-border/40 text-xs text-foreground">
      {icon}{label}
    </div>
  );
}

function StatusBadge({ status, small }: { status: 'not_started' | 'in_progress' | 'completed'; small?: boolean }) {
  const map = {
    not_started: { label: 'Não iniciado', variant: 'secondary' as const },
    in_progress: { label: 'Em andamento', variant: 'default' as const },
    completed: { label: 'Concluído', variant: 'outline' as const },
  };
  const m = map[status];
  return <Badge variant={m.variant} className={small ? 'text-[10px]' : 'text-[11px]'}>{m.label}</Badge>;
}
