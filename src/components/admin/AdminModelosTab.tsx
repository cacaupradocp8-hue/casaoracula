import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Loader2, Check, Plus, Trash2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TextModel {
  id: string;
  chave: string;
  titulo: string;
  conteudo: string;
  categoria: string;
}

const CATEGORIAS = ['cta', 'modal', 'ui', 'portais', 'mensagens', 'geral'];

export function AdminModelosTab() {
  const [models, setModels] = useState<TextModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newModel, setNewModel] = useState({ chave: '', titulo: '', conteudo: '', categoria: 'geral' });
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => { fetchModels(); }, []);

  const fetchModels = async () => {
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
    fetchModels();
  };

  const handleCreate = async () => {
    if (!newModel.chave.trim() || !newModel.titulo.trim()) {
      toast({ title: 'Preencha chave e título', variant: 'destructive' });
      return;
    }

    const chaveFormatada = newModel.chave.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');

    setIsCreating(true);
    const { error } = await supabase.from('text_models').insert({
      chave: chaveFormatada,
      titulo: newModel.titulo.trim(),
      conteudo: newModel.conteudo.trim(),
      categoria: newModel.categoria,
    });

    if (error) {
      toast({ title: 'Erro ao criar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Modelo criado!' });
      setNewModel({ chave: '', titulo: '', conteudo: '', categoria: 'geral' });
      setShowCreate(false);
      fetchModels();
    }
    setIsCreating(false);
  };

  const handleDelete = async (id: string, titulo: string) => {
    if (!confirm(`Excluir "${titulo}"?`)) return;
    
    await supabase.from('text_models').delete().eq('id', id);
    toast({ title: 'Modelo excluído!' });
    fetchModels();
  };

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  const grouped = models.reduce((acc, m) => {
    if (!acc[m.categoria]) acc[m.categoria] = [];
    acc[m.categoria].push(m);
    return acc;
  }, {} as Record<string, TextModel[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Personalize os textos do app sem mexer no código.</p>
        <Button variant="gold" size="sm" onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? <X className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
          {showCreate ? 'Cancelar' : 'Novo Texto'}
        </Button>
      </div>

      {showCreate && (
        <Card className="glass border-gold/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Criar novo modelo de texto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Chave (identificador único)</Label>
                <Input 
                  placeholder="ex: botao_confirmar" 
                  value={newModel.chave}
                  onChange={e => setNewModel({ ...newModel, chave: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <select 
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={newModel.categoria}
                  onChange={e => setNewModel({ ...newModel, categoria: e.target.value })}
                >
                  {CATEGORIAS.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Título (nome amigável)</Label>
              <Input 
                placeholder="ex: Texto do botão confirmar" 
                value={newModel.titulo}
                onChange={e => setNewModel({ ...newModel, titulo: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Conteúdo</Label>
              <Textarea 
                placeholder="O texto que será exibido..." 
                value={newModel.conteudo}
                onChange={e => setNewModel({ ...newModel, conteudo: e.target.value })}
                rows={3}
              />
            </div>
            <Button variant="gold" onClick={handleCreate} disabled={isCreating}>
              {isCreating ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
              Criar Modelo
            </Button>
          </CardContent>
        </Card>
      )}

      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat}>
          <h3 className="text-lg font-medium text-gold mb-3 capitalize">{cat.replace('_', ' ')}</h3>
          <div className="grid gap-4">
            {items.map(model => (
              <Card key={model.id} className="glass">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{model.titulo}</CardTitle>
                    <p className="text-xs text-muted-foreground font-mono">{model.chave}</p>
                  </div>
                  <div className="flex gap-2">
                    {editing === model.id ? (
                      <Button size="sm" variant="gold" onClick={() => save(model.id)}>
                        <Check className="w-4 h-4 mr-1" /> Salvar
                      </Button>
                    ) : (
                      <>
                        <Button size="sm" variant="ghost" onClick={() => startEdit(model)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(model.id, model.titulo)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
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
