// ============================================
// PÁGINA DO LIVRO — /clube-livro/livro/:id
// ============================================

import { useParams, Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { useBook, useBookLessons } from '@/hooks/useBooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ChevronRight, Home, AlertTriangle } from 'lucide-react';

export default function ClubeLivroLivro() {
  const { id } = useParams<{ id: string }>();
  const { data: book, isLoading } = useBook(id);
  const { data: lessons } = useBookLessons(id);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="animate-pulse text-muted-foreground">Carregando…</div>
        </div>
      </AppLayout>
    );
  }

  if (!book) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <p className="text-muted-foreground">Livro não encontrado.</p>
        </div>
      </AppLayout>
    );
  }

  const PHASE_COLORS: Record<string, string> = {
    CHAMADO: 'bg-amber-500/20 text-amber-300',
    RUPTURA: 'bg-red-500/20 text-red-300',
    REORGANIZACAO: 'bg-blue-500/20 text-blue-300',
    INTEGRACAO: 'bg-emerald-500/20 text-emerald-300',
  };

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
          <span className="text-foreground truncate">{book.title}</span>
        </nav>

        <SectionHeader
          title={book.title}
          subtitle={book.author || ''}
          icon={<BookOpen className="w-5 h-5" />}
          className="mb-6"
        />

        {book.cover_url && (
          <img src={book.cover_url} alt={book.title} className="w-full max-w-xs mx-auto h-64 object-cover rounded-xl shadow-lg mb-8" />
        )}

        <div className="flex gap-2 mb-6">
          <Badge variant="outline">{book.category}</Badge>
          {book.is_multipolar && <Badge variant="secondary">Multipolar</Badge>}
          {book.description_short && <Badge variant="secondary">{book.description_short}</Badge>}
        </div>

        <Tabs defaultValue="why" className="w-full">
          <TabsList className="w-full grid grid-cols-3 lg:grid-cols-5">
            <TabsTrigger value="why">Por quê</TabsTrigger>
            <TabsTrigger value="how">Como ler</TabsTrigger>
            <TabsTrigger value="manifesto">Manifesto</TabsTrigger>
            <TabsTrigger value="lessons" className="hidden lg:inline-flex">Aulas-Álbum</TabsTrigger>
            <TabsTrigger value="chat" className="hidden lg:inline-flex">Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="why" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <p className="text-foreground whitespace-pre-wrap">{book.why_here || 'Conteúdo em construção.'}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="how" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <p className="text-foreground whitespace-pre-wrap">{book.how_to_read || 'Conteúdo em construção.'}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manifesto" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <p className="text-foreground whitespace-pre-wrap">{book.manifesto_short || 'Conteúdo em construção.'}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons" className="mt-6 space-y-4">
            {!lessons?.length ? (
              <p className="text-muted-foreground text-center py-8">Nenhuma aula cadastrada.</p>
            ) : (
              lessons.map((lesson) => (
                <Card key={lesson.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={PHASE_COLORS[lesson.phase] || ''}>{lesson.phase}</Badge>
                      <span className="text-xs text-muted-foreground">Semana {lesson.week_number}</span>
                    </div>
                    <CardTitle className="text-base">{lesson.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {lesson.clinical_alert && (
                      <div className="flex gap-2 text-sm bg-destructive/10 text-destructive p-3 rounded-lg">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{lesson.clinical_alert}</span>
                      </div>
                    )}
                    {lesson.misuse_list && (
                      <div className="text-sm text-muted-foreground">
                        <strong>Uso inadequado:</strong> {lesson.misuse_list}
                      </div>
                    )}
                    {lesson.questions && Array.isArray(lesson.questions) && (
                      <div className="space-y-1">
                        <strong className="text-sm text-foreground">Perguntas:</strong>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {(lesson.questions as string[]).map((q, i) => <li key={i}>{q}</li>)}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Chat com o livro em breve.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
