// ============================================
// ADMIN — Books & Cycles CRUD
// ============================================

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { useAllBooks, useAllCycles, useBookLessons, type Book } from '@/hooks/useBooks';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Plus, Pencil, Trash2, Columns, Map } from 'lucide-react';
import type { BookTour } from '@/hooks/useBooks';

const CATEGORIES = ['MATRIZ', 'TRAVESSIA', 'PORTA', 'PONTE', 'FUNDACAO'] as const;

function BookForm({ book, onSave, onClose }: { book?: Book; onSave: () => void; onClose: () => void }) {
  const [title, setTitle] = useState(book?.title || '');
  const [author, setAuthor] = useState(book?.author || '');
  const [category, setCategory] = useState(book?.category || 'PORTA');
  const [isMultipolar, setIsMultipolar] = useState(book?.is_multipolar || false);
  const [coverUrl, setCoverUrl] = useState(book?.cover_url || '');
  const [descShort, setDescShort] = useState(book?.description_short || '');
  const [whyHere, setWhyHere] = useState(book?.why_here || '');
  const [howToRead, setHowToRead] = useState(book?.how_to_read || '');
  const [manifesto, setManifesto] = useState(book?.manifesto_short || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) { toast.error('Título obrigatório'); return; }
    setSaving(true);
    const payload = {
      title: title.trim(),
      author: author.trim() || null,
      category,
      is_multipolar: isMultipolar,
      cover_url: coverUrl.trim() || null,
      description_short: descShort.trim() || null,
      why_here: whyHere.trim() || null,
      how_to_read: howToRead.trim() || null,
      manifesto_short: manifesto.trim() || null,
    };

    const { error } = book
      ? await supabase.from('books').update(payload).eq('id', book.id)
      : await supabase.from('books').insert(payload);

    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(book ? 'Livro atualizado' : 'Livro criado');
    onSave();
    onClose();
  };

  return (
    <div className="space-y-4">
      <Input placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} />
      <Input placeholder="Autor" value={author} onChange={e => setAuthor(e.target.value)} />
      <Select value={category} onValueChange={v => setCategory(v as any)}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
      </Select>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isMultipolar} onChange={e => setIsMultipolar(e.target.checked)} />
        Multipolar
      </label>
      <Input placeholder="URL da capa" value={coverUrl} onChange={e => setCoverUrl(e.target.value)} />
      <Input placeholder="Descrição curta" value={descShort} onChange={e => setDescShort(e.target.value)} />
      <Textarea placeholder="Por que este livro está aqui" value={whyHere} onChange={e => setWhyHere(e.target.value)} rows={3} />
      <Textarea placeholder="Como ler este livro" value={howToRead} onChange={e => setHowToRead(e.target.value)} rows={3} />
      <Textarea placeholder="Manifesto breve" value={manifesto} onChange={e => setManifesto(e.target.value)} rows={3} />
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} disabled={saving}>{saving ? 'Salvando…' : 'Salvar'}</Button>
      </div>
    </div>
  );
}

function GenerateLessonsButton({ bookId }: { bookId: string }) {
  const qc = useQueryClient();
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    const template = [
      { week_number: 1, phase: 'CHAMADO', title: 'Abertura do Campo', clinical_alert: 'Preencher alerta clínico.', misuse_list: 'Preencher lista de uso inadequado.', questions: ['Pergunta 1?', 'Pergunta 2?', 'Pergunta 3?', 'Pergunta 4?', 'Pergunta 5?'] },
      { week_number: 2, phase: 'RUPTURA', title: 'O Risco da Projeção', clinical_alert: 'Preencher alerta clínico.', misuse_list: 'Preencher lista de uso inadequado.', questions: ['Pergunta 1?', 'Pergunta 2?', 'Pergunta 3?', 'Pergunta 4?', 'Pergunta 5?'] },
      { week_number: 3, phase: 'REORGANIZACAO', title: 'Quando Não Usar', clinical_alert: 'Preencher alerta clínico.', misuse_list: 'Preencher lista de uso inadequado.', questions: ['Pergunta 1?', 'Pergunta 2?', 'Pergunta 3?', 'Pergunta 4?', 'Pergunta 5?'] },
      { week_number: 4, phase: 'INTEGRACAO', title: 'Integração e Fechamento', clinical_alert: 'Preencher alerta clínico.', misuse_list: 'Preencher lista de uso inadequado.', questions: ['Pergunta 1?', 'Pergunta 2?', 'Pergunta 3?', 'Pergunta 4?', 'Pergunta 5?'] },
    ];

    const { error } = await supabase.from('lessons_album').insert(
      template.map(t => ({ ...t, book_id: bookId }))
    );

    setGenerating(false);
    if (error) { toast.error(error.message); return; }
    toast.success('4 aulas geradas!');
    qc.invalidateQueries({ queryKey: ['book-lessons', bookId] });
  };

  return (
    <Button variant="outline" size="sm" onClick={handleGenerate} disabled={generating}>
      <Plus className="w-3 h-3 mr-1" /> {generating ? 'Gerando…' : 'Gerar 4 Semanas'}
    </Button>
  );
}

const JORNADAS = ['Heroína', 'Sombra', 'Instinto', 'Liderança', 'Mundo'] as const;

function BookTourForm({ bookId, books, existingTour, onSave }: { bookId: string; books: Book[]; existingTour?: BookTour | null; onSave: () => void }) {
  const [jornada, setJornada] = useState(existingTour?.jornada || 'Heroína');
  const [ondeEntra, setOndeEntra] = useState(existingTour?.onde_entra_jornada || '');
  const [habilidade, setHabilidade] = useState(existingTour?.habilidade_simbolica || '');
  const [oQueNao, setOQueNao] = useState(existingTour?.o_que_nao_fazer || '');
  const [comoAtravessar, setComoAtravessar] = useState(existingTour?.como_atravessar || '');
  const [quandoEncerrar, setQuandoEncerrar] = useState(existingTour?.quando_encerrar || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      book_id: bookId,
      jornada,
      onde_entra_jornada: ondeEntra.trim() || null,
      habilidade_simbolica: habilidade.trim() || null,
      o_que_nao_fazer: oQueNao.trim() || null,
      como_atravessar: comoAtravessar.trim() || null,
      quando_encerrar: quandoEncerrar.trim() || null,
      ativo: true,
    };

    const { error } = existingTour
      ? await supabase.from('book_tours' as any).update(payload).eq('id', existingTour.id)
      : await supabase.from('book_tours' as any).insert(payload);

    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(existingTour ? 'Tour atualizado' : 'Tour criado');
    onSave();
  };

  const bookTitle = books.find(b => b.id === bookId)?.title || '';

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-muted-foreground">{bookTitle}</p>
      <Select value={jornada} onValueChange={setJornada}>
        <SelectTrigger><SelectValue placeholder="Jornada" /></SelectTrigger>
        <SelectContent>{JORNADAS.map(j => <SelectItem key={j} value={j}>{j}</SelectItem>)}</SelectContent>
      </Select>
      <Textarea placeholder="Onde esta obra entra na Jornada" value={ondeEntra} onChange={e => setOndeEntra(e.target.value)} rows={2} />
      <Textarea placeholder="Habilidade simbólica desenvolvida" value={habilidade} onChange={e => setHabilidade(e.target.value)} rows={2} />
      <Textarea placeholder="O que NÃO fazer com esta obra" value={oQueNao} onChange={e => setOQueNao(e.target.value)} rows={2} />
      <Textarea placeholder="Como atravessar esta obra" value={comoAtravessar} onChange={e => setComoAtravessar(e.target.value)} rows={2} />
      <Textarea placeholder="Quando encerrar a travessia" value={quandoEncerrar} onChange={e => setQuandoEncerrar(e.target.value)} rows={2} />
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>{saving ? 'Salvando…' : 'Salvar Tour'}</Button>
      </div>
    </div>
  );
}

export default function AdminBooks() {
  const { data: books, isLoading } = useAllBooks();
  const { data: cycles } = useAllCycles();
  const qc = useQueryClient();
  const [editingBook, setEditingBook] = useState<Book | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [tourBookId, setTourBookId] = useState<string | null>(null);
  const [existingTour, setExistingTour] = useState<BookTour | null>(null);
  const [loadingTour, setLoadingTour] = useState(false);

  const { data: lessons } = useBookLessons(selectedBookId || undefined);

  const loadTourForBook = async (bookId: string) => {
    setTourBookId(bookId);
    setLoadingTour(true);
    const { data } = await supabase.from('book_tours' as any).select('*').eq('book_id', bookId).maybeSingle();
    setExistingTour(data as unknown as BookTour | null);
    setLoadingTour(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apagar este livro?')) return;
    const { error } = await supabase.from('books').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Livro apagado');
    qc.invalidateQueries({ queryKey: ['all-books'] });
  };

  const refreshBooks = () => qc.invalidateQueries({ queryKey: ['all-books'] });

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <SectionHeader title="Gestão de Livros" subtitle="CRUD completo — Mandala Anual" icon={<BookOpen className="w-5 h-5" />} className="mb-6" />

        <Tabs defaultValue="books">
          <TabsList>
            <TabsTrigger value="books">Livros</TabsTrigger>
            <TabsTrigger value="cycles">Ciclos</TabsTrigger>
            <TabsTrigger value="lessons">Aulas-Álbum</TabsTrigger>
            <TabsTrigger value="tours">Tours</TabsTrigger>
          </TabsList>

          {/* === LIVROS === */}
          <TabsContent value="books" className="mt-4">
            <div className="flex justify-end mb-4">
              <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditingBook(undefined); }}>
                <DialogTrigger asChild>
                  <Button><Plus className="w-4 h-4 mr-1" /> Novo Livro</Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader><DialogTitle>{editingBook ? 'Editar Livro' : 'Novo Livro'}</DialogTitle></DialogHeader>
                  <BookForm book={editingBook} onSave={refreshBooks} onClose={() => setDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>

            {isLoading ? (
              <div className="animate-pulse text-muted-foreground">Carregando…</div>
            ) : (
              <div className="space-y-2">
                {CATEGORIES.map(cat => {
                  const catBooks = books?.filter(b => b.category === cat) || [];
                  if (!catBooks.length) return null;
                  return (
                    <div key={cat} className="space-y-2">
                      <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mt-4">{cat}</h3>
                      {catBooks.map(book => (
                        <Card key={book.id}>
                          <CardContent className="p-3 flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{book.title}</p>
                              <p className="text-xs text-muted-foreground">{book.author}</p>
                            </div>
                            <div className="flex gap-1">
                              {book.is_multipolar && <Badge variant="secondary" className="text-[10px]">MP</Badge>}
                              <Button variant="ghost" size="icon" onClick={() => { setEditingBook(book); setDialogOpen(true); }}>
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(book.id)}>
                                <Trash2 className="w-3.5 h-3.5 text-destructive" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* === CICLOS === */}
          <TabsContent value="cycles" className="mt-4">
            <div className="space-y-2">
              {cycles?.map(c => (
                <Card key={c.id}>
                  <CardContent className="p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{c.label}</p>
                      <p className="text-xs text-muted-foreground">Status: {c.status}</p>
                    </div>
                    <Badge variant="outline">{c.year || '—'}</Badge>
                  </CardContent>
                </Card>
              )) || <p className="text-muted-foreground">Nenhum ciclo.</p>}
            </div>
          </TabsContent>

          {/* === AULAS-ÁLBUM === */}
          <TabsContent value="lessons" className="mt-4 space-y-4">
            <Select value={selectedBookId || ''} onValueChange={v => setSelectedBookId(v)}>
              <SelectTrigger><SelectValue placeholder="Selecione um livro" /></SelectTrigger>
              <SelectContent>
                {books?.map(b => <SelectItem key={b.id} value={b.id}>{b.title}</SelectItem>)}
              </SelectContent>
            </Select>

            {selectedBookId && (
              <div className="flex justify-end">
                <GenerateLessonsButton bookId={selectedBookId} />
              </div>
            )}

          {lessons?.map(l => (
              <Card key={l.id}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary">{l.phase}</Badge>
                    <span className="text-xs text-muted-foreground">Semana {l.week_number}</span>
                  </div>
                  <p className="text-sm font-medium">{l.title}</p>
                  {l.clinical_alert && <p className="text-xs text-destructive mt-1">{l.clinical_alert}</p>}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* === TOURS === */}
          <TabsContent value="tours" className="mt-4 space-y-4">
            <Select value={tourBookId || ''} onValueChange={v => loadTourForBook(v)}>
              <SelectTrigger><SelectValue placeholder="Selecione um livro para editar o Tour" /></SelectTrigger>
              <SelectContent>
                {books?.map(b => <SelectItem key={b.id} value={b.id}>{b.title}</SelectItem>)}
              </SelectContent>
            </Select>

            {loadingTour && <p className="text-sm text-muted-foreground animate-pulse">Carregando…</p>}

            {tourBookId && !loadingTour && (
              <BookTourForm
                bookId={tourBookId}
                books={books || []}
                existingTour={existingTour}
                onSave={() => {
                  loadTourForBook(tourBookId);
                  qc.invalidateQueries({ queryKey: ['book-tour', tourBookId] });
                }}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
