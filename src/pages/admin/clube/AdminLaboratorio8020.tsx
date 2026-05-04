import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { FlaskConical, Save, Plus, Trash2, CheckCircle2, BookOpen } from 'lucide-react';

interface Book { id: string; title: string }
interface Essencia {
  id?: string;
  book_id: string;
  nucleo_vivo: string | null;
  tensao_central: string | null;
  imagem_organizadora: string | null;
  aplicacao_terapeutica: string | null;
  distorcao_comum: string | null;
  perguntas_clinicas: string[] | null;
  exercicio: string | null;
  resumo_premium: string | null;
  riscos_eticos: string | null;
}

const EMPTY: Omit<Essencia, 'book_id'> = {
  nucleo_vivo: '', tensao_central: '', imagem_organizadora: '',
  aplicacao_terapeutica: '', distorcao_comum: '',
  perguntas_clinicas: [''], exercicio: '',
  resumo_premium: '', riscos_eticos: '',
};

export default function AdminLaboratorio8020() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [form, setForm] = useState<Essencia | null>(null);

  const { data: books = [] } = useQuery({
    queryKey: ['admin-lab-books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books').select('id, title').order('title');
      if (error) throw error;
      return data as Book[];
    },
  });

  const { data: essencia, isLoading } = useQuery({
    queryKey: ['admin-essencia-8020', selectedBookId],
    enabled: !!selectedBookId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_obras_essencia_8020')
        .select('*').eq('book_id', selectedBookId).maybeSingle();
      if (error) throw error;
      return data as Essencia | null;
    },
  });

  useEffect(() => {
    if (!selectedBookId) { setForm(null); return; }
    setForm(essencia
      ? { ...essencia, perguntas_clinicas: essencia.perguntas_clinicas?.length ? essencia.perguntas_clinicas : [''] }
      : { book_id: selectedBookId, ...EMPTY });
  }, [essencia, selectedBookId]);

  const saveMut = useMutation({
    mutationFn: async (payload: Essencia) => {
      const cleaned = {
        ...payload,
        perguntas_clinicas: (payload.perguntas_clinicas || []).map(p => p.trim()).filter(Boolean),
      };
      if (cleaned.id) {
        const { error } = await supabase.from('clube_obras_essencia_8020')
          .update(cleaned).eq('id', cleaned.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('clube_obras_essencia_8020').insert(cleaned);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: 'Laboratório 80/20 salvo', description: 'Conteúdo atualizado com sucesso.' });
      qc.invalidateQueries({ queryKey: ['admin-essencia-8020', selectedBookId] });
      qc.invalidateQueries({ queryKey: ['essencia-8020', selectedBookId] });
    },
    onError: (e: any) => toast({ title: 'Erro ao salvar', description: e.message, variant: 'destructive' }),
  });

  const selectedBook = useMemo(() => books.find(b => b.id === selectedBookId), [books, selectedBookId]);

  const updateField = (k: keyof Essencia, v: any) => setForm(f => f ? { ...f, [k]: v } : f);
  const updatePergunta = (i: number, v: string) => setForm(f => {
    if (!f) return f;
    const arr = [...(f.perguntas_clinicas || [])]; arr[i] = v;
    return { ...f, perguntas_clinicas: arr };
  });
  const addPergunta = () => setForm(f => f ? { ...f, perguntas_clinicas: [...(f.perguntas_clinicas || []), ''] } : f);
  const removePergunta = (i: number) => setForm(f => {
    if (!f) return f;
    const arr = [...(f.perguntas_clinicas || [])]; arr.splice(i, 1);
    return { ...f, perguntas_clinicas: arr.length ? arr : [''] };
  });

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={FlaskConical}
        title="Laboratório 80/20"
        description="Edite o núcleo simbólico e aplicável de cada obra do Clube."
      />

      <Card className="bg-card/40 border-border/50">
        <CardContent className="p-6 space-y-3">
          <Label>Selecione a obra</Label>
          <Select value={selectedBookId} onValueChange={setSelectedBookId}>
            <SelectTrigger className="max-w-xl"><SelectValue placeholder="Escolha um livro..." /></SelectTrigger>
            <SelectContent>
              {books.map(b => (
                <SelectItem key={b.id} value={b.id}>{b.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedBook && (
            <div className="flex items-center gap-2 pt-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{selectedBook.title}</span>
              {essencia
                ? <Badge variant="outline" className="gap-1 border-emerald-500/30 text-emerald-400"><CheckCircle2 className="w-3 h-3" /> Conteúdo existente</Badge>
                : <Badge variant="outline">Novo</Badge>}
            </div>
          )}
        </CardContent>
      </Card>

      {!selectedBookId && (
        <p className="text-muted-foreground text-sm">Selecione uma obra acima para editar o Laboratório 80/20.</p>
      )}

      {selectedBookId && form && (
        <Card className="bg-card/40 border-border/50">
          <CardContent className="p-6 space-y-8">
            {isLoading && <p className="text-sm text-muted-foreground">Carregando...</p>}

            <Field label="01. Núcleo Vivo" hint="A essência viva da obra — o que pulsa por trás de tudo.">
              <Textarea rows={3} value={form.nucleo_vivo || ''} onChange={e => updateField('nucleo_vivo', e.target.value)} />
            </Field>
            <Field label="02. Tensão Central" hint="O conflito simbólico que move a obra.">
              <Textarea rows={3} value={form.tensao_central || ''} onChange={e => updateField('tensao_central', e.target.value)} />
            </Field>
            <Field label="03. Imagem Organizadora" hint="A imagem-mãe que sintetiza o campo.">
              <Textarea rows={3} value={form.imagem_organizadora || ''} onChange={e => updateField('imagem_organizadora', e.target.value)} />
            </Field>
            <Field label="04. Aplicação Terapêutica" hint="Como o eixo simbólico se traduz em sessão.">
              <Textarea rows={4} value={form.aplicacao_terapeutica || ''} onChange={e => updateField('aplicacao_terapeutica', e.target.value)} />
            </Field>
            <Field label="05. Distorções Comuns" hint="Erros frequentes na leitura ou aplicação.">
              <Textarea rows={3} value={form.distorcao_comum || ''} onChange={e => updateField('distorcao_comum', e.target.value)} />
            </Field>

            <Separator />

            <div className="space-y-3">
              <div>
                <Label className="text-base font-medium">06. Perguntas Clínicas</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Perguntas que instrumentalizam a escuta.</p>
              </div>
              {(form.perguntas_clinicas || []).map((p, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={p} onChange={e => updatePergunta(i, e.target.value)} placeholder={`Pergunta ${i + 1}`} />
                  <Button type="button" size="icon" variant="ghost" onClick={() => removePergunta(i)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addPergunta} className="gap-2">
                <Plus className="w-4 h-4" /> Adicionar pergunta
              </Button>
            </div>

            <Separator />

            <Field label="07. Exercício Integrativo" hint="Prática simbólica de transmutação.">
              <Textarea rows={4} value={form.exercicio || ''} onChange={e => updateField('exercicio', e.target.value)} />
            </Field>

            <Separator />

            <Field label="O Olhar Oracular (resumo premium)" hint="Síntese poética da obra.">
              <Textarea rows={4} value={form.resumo_premium || ''} onChange={e => updateField('resumo_premium', e.target.value)} />
            </Field>
            <Field label="Riscos Éticos & Cautelas" hint="Cuidados na aplicação.">
              <Textarea rows={3} value={form.riscos_eticos || ''} onChange={e => updateField('riscos_eticos', e.target.value)} />
            </Field>

            <div className="flex justify-end pt-4">
              <Button onClick={() => saveMut.mutate(form)} disabled={saveMut.isPending} className="gap-2">
                <Save className="w-4 h-4" />
                {saveMut.isPending ? 'Salvando...' : 'Salvar Laboratório'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-base font-medium">{label}</Label>
      {hint && <p className="text-xs text-muted-foreground -mt-1">{hint}</p>}
      {children}
    </div>
  );
}
