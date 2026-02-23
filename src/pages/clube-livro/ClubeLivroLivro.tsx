// ============================================
// PÁGINA DO LIVRO — /clube-livro/livro/:id
// ============================================

import { useParams, Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { useBook, useBookLessons, useBookLinksForBook } from '@/hooks/useBooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ChevronRight, Home, AlertTriangle, ExternalLink, MapPin } from 'lucide-react';

const PHASE_COLORS: Record<string, string> = {
  CHAMADO: 'bg-amber-500/20 text-amber-300',
  RUPTURA: 'bg-red-500/20 text-red-300',
  REORGANIZACAO: 'bg-blue-500/20 text-blue-300',
  INTEGRACAO: 'bg-emerald-500/20 text-emerald-300',
};

const CATEGORY_LABEL: Record<string, string> = {
  TRAVESSIA: 'Travessia',
  PORTA: 'Porta',
  PONTE: 'Ponte',
  FUNDACAO: 'Fundação',
  MATRIZ: 'Matriz',
};

export default function ClubeLivroLivro() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: book, isLoading } = useBook(id);
  const { data: lessons } = useBookLessons(id);
  const { data: bookLinks } = useBookLinksForBook(id);

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

  const connections = (bookLinks || []).map(link => {
    const isFrom = link.from_book_id === id;
    const connectedBook = isFrom ? link.to_book : link.from_book;
    return { ...link, connectedBook, direction: isFrom ? 'para' : 'de' };
  }).filter(c => c.connectedBook);

  const categoryLabel = CATEGORY_LABEL[book.category] || book.category;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl">
        {/* Banner de orientação fixo */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 p-2.5 rounded-lg bg-muted/40 border border-border/50">
          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
          <span>
            Você está em:{' '}
            <Link to="/clube-livro/mandala" className="hover:text-foreground transition-colors underline underline-offset-2">Mandala</Link>
            {' → '}
            <span className="text-foreground font-medium">{categoryLabel}</span>
            {' → '}
            <span className="text-foreground font-medium truncate">{book.title}</span>
          </span>
        </div>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" /> Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/clube-livro" className="hover:text-foreground transition-colors">Clube do Livro</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/clube-livro/mandala" className="hover:text-foreground transition-colors">Mandala</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground truncate max-w-[150px]">{book.title}</span>
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

        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="outline">{categoryLabel}</Badge>
          {book.is_multipolar && <Badge variant="secondary">Multipolar</Badge>}
        </div>

        {book.description_short && (
          <p className="text-sm text-muted-foreground italic border-l-2 border-amber-500/30 pl-3 mb-6">{book.description_short}</p>
        )}

        <Tabs defaultValue="lessons" className="w-full">
          <TabsList className="w-full flex flex-wrap h-auto gap-1">
            <TabsTrigger
              value="lessons"
              className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold"
            >
              Aulas-Álbum
            </TabsTrigger>
            <TabsTrigger value="why" className="text-xs">Por quê</TabsTrigger>
            <TabsTrigger value="how" className="text-xs">Como ler</TabsTrigger>
            <TabsTrigger value="manifesto" className="text-xs">Manifesto</TabsTrigger>
            <TabsTrigger value="chat" className="text-xs">Chat</TabsTrigger>
            <TabsTrigger value="buy" className="text-xs">Comprar</TabsTrigger>
          </TabsList>

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
                    {lesson.description && <p className="text-sm text-muted-foreground mt-1">{lesson.description}</p>}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {lesson.clinical_alert && (
                      <div className="flex gap-2 text-sm bg-destructive/10 text-destructive p-3 rounded-lg">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{lesson.clinical_alert}</span>
                      </div>
                    )}
                    {lesson.guided_reading && (
                      <div className="text-sm text-muted-foreground">
                        <strong>Leitura orientada:</strong> {lesson.guided_reading}
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
                    {lesson.closing_text && (
                      <div className="text-sm text-muted-foreground/80 italic border-t border-border pt-3 mt-3">
                        {lesson.closing_text}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="why" className="mt-6">
            <Card><CardContent className="p-6">
              <p className="text-foreground whitespace-pre-wrap">{book.why_here || 'Conteúdo em construção.'}</p>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="how" className="mt-6">
            <Card><CardContent className="p-6">
              <p className="text-foreground whitespace-pre-wrap">{book.how_to_read || 'Conteúdo em construção.'}</p>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="manifesto" className="mt-6">
            <Card><CardContent className="p-6">
              <p className="text-foreground whitespace-pre-wrap">{book.manifesto_short || 'Conteúdo em construção.'}</p>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <Card><CardContent className="p-6 text-center text-muted-foreground">
              Conversar com o livro — em breve.
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="buy" className="mt-6">
            <Card><CardContent className="p-6 text-center text-muted-foreground">
              <ExternalLink className="w-5 h-5 mx-auto mb-2 opacity-50" />
              Links para compra — em breve.
            </CardContent></Card>
          </TabsContent>
        </Tabs>

        {/* Conexões */}
        {connections.length > 0 && (
          <div className="mt-10">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">Conexões desta obra</h3>
            <div className="flex flex-wrap gap-2">
              {connections.map(c => (
                <Badge
                  key={c.id}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => navigate(`/clube-livro/livro/${c.connectedBook.id}`)}
                >
                  <span className="text-xs text-muted-foreground mr-1">{c.link_type}</span>
                  {c.connectedBook.title}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
