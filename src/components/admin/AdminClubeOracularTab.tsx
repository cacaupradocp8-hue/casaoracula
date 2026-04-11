import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Calendar, BookOpen, Users } from 'lucide-react';
import { toast } from 'sonner';

export function AdminClubeOracularTab() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="font-display text-2xl text-primary">Clube do Livro Oracular</h2>
        <p className="text-sm text-muted-foreground">Gerencie ciclos, livros e encontros</p>
      </div>

      <Tabs defaultValue="ciclos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ciclos">Ciclos</TabsTrigger>
          <TabsTrigger value="livros">Livros</TabsTrigger>
          <TabsTrigger value="encontros">Encontros</TabsTrigger>
        </TabsList>

        <TabsContent value="ciclos"><CiclosManager /></TabsContent>
        <TabsContent value="livros"><LivrosManager /></TabsContent>
        <TabsContent value="encontros"><EncontrosManager /></TabsContent>
      </Tabs>
    </div>
  );
}

// ── CICLOS ──────────────────────────────────────────────────────────────────
function CiclosManager() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [portal, setPortal] = useState('');
  const [desc, setDesc] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: cycles, isLoading } = useQuery({
    queryKey: ['admin-club-cycles'],
    queryFn: async () => {
      const { data } = await supabase.from('club_cycles' as any).select('*').order('created_at', { ascending: false });
      return (data || []) as any[];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      await supabase.from('club_cycles' as any).insert({
        title, portal, description: desc,
        start_date: startDate || null, end_date: endDate || null,
      });
    },
    onSuccess: () => {
      toast.success('Ciclo criado');
      qc.invalidateQueries({ queryKey: ['admin-club-cycles'] });
      setShowForm(false); setTitle(''); setPortal(''); setDesc(''); setStartDate(''); setEndDate('');
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from('club_cycles' as any).delete().eq('id', id);
    },
    onSuccess: () => { toast.success('Ciclo removido'); qc.invalidateQueries({ queryKey: ['admin-club-cycles'] }); },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium flex items-center gap-2"><Calendar className="w-4 h-4" /> Ciclos</h3>
        <Button size="sm" onClick={() => setShowForm(!showForm)}><Plus className="w-4 h-4 mr-1" /> Novo</Button>
      </div>

      {showForm && (
        <Card className="border-primary/20">
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Título</Label><Input value={title} onChange={e => setTitle(e.target.value)} /></div>
              <div><Label className="text-xs">Portal</Label><Input value={portal} onChange={e => setPortal(e.target.value)} /></div>
            </div>
            <div><Label className="text-xs">Descrição</Label><Textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Início</Label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
              <div><Label className="text-xs">Fim</Label><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></div>
            </div>
            <Button onClick={() => create.mutate()} disabled={create.isPending || !title.trim()}>Criar ciclo</Button>
          </CardContent>
        </Card>
      )}

      {isLoading ? <p className="text-sm text-muted-foreground">Carregando...</p> : (
        <div className="space-y-2">
          {cycles?.map((c: any) => (
            <Card key={c.id} className="border-border/50">
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{c.title || 'Sem título'}</p>
                  <p className="text-xs text-muted-foreground">{c.portal || '—'} · {c.start_date || '—'} → {c.end_date || '—'}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => remove.mutate(c.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </CardContent>
            </Card>
          ))}
          {!cycles?.length && <p className="text-sm text-muted-foreground">Nenhum ciclo cadastrado</p>}
        </div>
      )}
    </div>
  );
}

// ── LIVROS ──────────────────────────────────────────────────────────────────
function LivrosManager() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [desc, setDesc] = useState('');
  const [cycleId, setCycleId] = useState('');

  const { data: cycles } = useQuery({
    queryKey: ['admin-club-cycles'],
    queryFn: async () => {
      const { data } = await supabase.from('club_cycles' as any).select('id, title').order('created_at', { ascending: false });
      return (data || []) as any[];
    },
  });

  const { data: books, isLoading } = useQuery({
    queryKey: ['admin-club-books'],
    queryFn: async () => {
      const { data } = await supabase.from('club_books' as any).select('*, club_cycles(title)').order('title');
      return (data || []) as any[];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      await supabase.from('club_books' as any).insert({
        title, author, description: desc, cycle_id: cycleId || null,
      });
    },
    onSuccess: () => {
      toast.success('Livro adicionado');
      qc.invalidateQueries({ queryKey: ['admin-club-books'] });
      setShowForm(false); setTitle(''); setAuthor(''); setDesc(''); setCycleId('');
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { await supabase.from('club_books' as any).delete().eq('id', id); },
    onSuccess: () => { toast.success('Livro removido'); qc.invalidateQueries({ queryKey: ['admin-club-books'] }); },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium flex items-center gap-2"><BookOpen className="w-4 h-4" /> Livros</h3>
        <Button size="sm" onClick={() => setShowForm(!showForm)}><Plus className="w-4 h-4 mr-1" /> Novo</Button>
      </div>

      {showForm && (
        <Card className="border-primary/20">
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Título</Label><Input value={title} onChange={e => setTitle(e.target.value)} /></div>
              <div><Label className="text-xs">Autor(a)</Label><Input value={author} onChange={e => setAuthor(e.target.value)} /></div>
            </div>
            <div><Label className="text-xs">Descrição</Label><Textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} /></div>
            <div>
              <Label className="text-xs">Ciclo</Label>
              <select value={cycleId} onChange={e => setCycleId(e.target.value)} className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm">
                <option value="">Nenhum</option>
                {cycles?.map((c: any) => <option key={c.id} value={c.id}>{c.title || c.id}</option>)}
              </select>
            </div>
            <Button onClick={() => create.mutate()} disabled={create.isPending || !title.trim()}>Adicionar livro</Button>
          </CardContent>
        </Card>
      )}

      {isLoading ? <p className="text-sm text-muted-foreground">Carregando...</p> : (
        <div className="space-y-2">
          {books?.map((b: any) => (
            <Card key={b.id} className="border-border/50">
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{b.title}</p>
                  <p className="text-xs text-muted-foreground">{b.author || '—'} · Ciclo: {b.club_cycles?.title || '—'}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => remove.mutate(b.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </CardContent>
            </Card>
          ))}
          {!books?.length && <p className="text-sm text-muted-foreground">Nenhum livro cadastrado</p>}
        </div>
      )}
    </div>
  );
}

// ── ENCONTROS ───────────────────────────────────────────────────────────────
function EncontrosManager() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState('');
  const [cycleId, setCycleId] = useState('');

  const { data: cycles } = useQuery({
    queryKey: ['admin-club-cycles'],
    queryFn: async () => {
      const { data } = await supabase.from('club_cycles' as any).select('id, title').order('created_at', { ascending: false });
      return (data || []) as any[];
    },
  });

  const { data: meetings, isLoading } = useQuery({
    queryKey: ['admin-club-meetings'],
    queryFn: async () => {
      const { data } = await supabase.from('club_meetings' as any).select('*, club_cycles(title)').order('date', { ascending: false });
      return (data || []) as any[];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      await supabase.from('club_meetings' as any).insert({
        date: date || null, cycle_id: cycleId || null,
      });
    },
    onSuccess: () => {
      toast.success('Encontro criado');
      qc.invalidateQueries({ queryKey: ['admin-club-meetings'] });
      setShowForm(false); setDate(''); setCycleId('');
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { await supabase.from('club_meetings' as any).delete().eq('id', id); },
    onSuccess: () => { toast.success('Encontro removido'); qc.invalidateQueries({ queryKey: ['admin-club-meetings'] }); },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium flex items-center gap-2"><Users className="w-4 h-4" /> Encontros</h3>
        <Button size="sm" onClick={() => setShowForm(!showForm)}><Plus className="w-4 h-4 mr-1" /> Novo</Button>
      </div>

      {showForm && (
        <Card className="border-primary/20">
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Data</Label><Input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} /></div>
              <div>
                <Label className="text-xs">Ciclo</Label>
                <select value={cycleId} onChange={e => setCycleId(e.target.value)} className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm">
                  <option value="">Nenhum</option>
                  {cycles?.map((c: any) => <option key={c.id} value={c.id}>{c.title || c.id}</option>)}
                </select>
              </div>
            </div>
            <Button onClick={() => create.mutate()} disabled={create.isPending}>Criar encontro</Button>
          </CardContent>
        </Card>
      )}

      {isLoading ? <p className="text-sm text-muted-foreground">Carregando...</p> : (
        <div className="space-y-2">
          {meetings?.map((m: any) => (
            <Card key={m.id} className="border-border/50">
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{m.date ? new Date(m.date).toLocaleDateString('pt-BR') : 'Sem data'}</p>
                  <p className="text-xs text-muted-foreground">Ciclo: {m.club_cycles?.title || '—'} · {m.completed ? '✅ Realizado' : '⏳ Pendente'}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => remove.mutate(m.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </CardContent>
            </Card>
          ))}
          {!meetings?.length && <p className="text-sm text-muted-foreground">Nenhum encontro cadastrado</p>}
        </div>
      )}
    </div>
  );
}

export default AdminClubeOracularTab;
