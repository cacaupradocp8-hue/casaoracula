import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Edit, Loader2, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TextModel {
  id: string;
  chave: string;
  titulo: string;
  conteudo: string;
  categoria: string;
}

export function AdminModelosTab() {
  const [models, setModels] = useState<TextModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const { toast } = useToast();

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    const { data } = await supabase.from('text_models').select('*').order('categoria').order('titulo');
    setModels((data || []) as TextModel[]);
    setIsLoading(false);
  };

  const startEdit = (model: TextModel) => {
    setEditing(model.id);
    setEditContent(model.conteudo);
  };

  const save = async (id: string) => {
    await supabase.from('text_models').update({ conteudo: editContent }).eq('id', id);
    toast({ title: 'Modelo atualizado!' });
    setEditing(null);
    fetch();
  };

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  const grouped = models.reduce((acc, m) => {
    if (!acc[m.categoria]) acc[m.categoria] = [];
    acc[m.categoria].push(m);
    return acc;
  }, {} as Record<string, TextModel[]>);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Personalize os textos do app sem mexer no código.</p>
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat}>
          <h3 className="text-lg font-medium text-gold mb-3 capitalize">{cat.replace('_', ' ')}</h3>
          <div className="grid gap-4">
            {items.map(model => (
              <Card key={model.id} className="glass">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-base">{model.titulo}</CardTitle>
                  {editing === model.id ? (
                    <Button size="sm" variant="gold" onClick={() => save(model.id)}><Check className="w-4 h-4 mr-1" /> Salvar</Button>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => startEdit(model)}><Edit className="w-4 h-4 mr-1" /> Editar</Button>
                  )}
                </CardHeader>
                <CardContent>
                  {editing === model.id ? (
                    <Textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={3} />
                  ) : (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{model.conteudo}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
