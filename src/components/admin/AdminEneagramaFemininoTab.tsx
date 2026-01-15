// ============================================
// ADMIN TAB — FEMININE ENNEAGRAM MANAGEMENT
// ============================================

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2, Pencil, Plus, Trash2, Flower2, MessageCircle } from 'lucide-react';

interface Arquetipo {
  id: string;
  numero: number;
  chave: string;
  nome: string;
  nome_en: string | null;
  essencia_simbolica: string;
  ferida_central: string | null;
  dom_central: string | null;
  expressao_sombra: string | null;
  caminho_expansao: string | null;
  pergunta_reflexiva: string | null;
  pratica_simbolica: string | null;
  icone: string | null;
  cor_primaria: string | null;
  ordem: number;
  ativo: boolean;
}

interface Afirmacao {
  id: string;
  arquetipo_id: string;
  texto_afirmacao: string;
  peso: number;
  ordem: number;
  ativo: boolean;
}

export default function AdminEneagramaFemininoTab() {
  const [arquetipos, setArquetipos] = useState<Arquetipo[]>([]);
  const [afirmacoes, setAfirmacoes] = useState<Afirmacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArquetipo, setEditingArquetipo] = useState<Arquetipo | null>(null);
  const [editingAfirmacao, setEditingAfirmacao] = useState<Afirmacao | null>(null);
  const [arquetipoDialogOpen, setArquetipoDialogOpen] = useState(false);
  const [afirmacaoDialogOpen, setAfirmacaoDialogOpen] = useState(false);
  const [selectedArquetipoId, setSelectedArquetipoId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [arquetiposRes, afirmacoesRes] = await Promise.all([
      supabase.from('eneagrama_feminino_arquetipos').select('*').order('ordem'),
      supabase.from('eneagrama_feminino_afirmacoes').select('*').order('ordem'),
    ]);

    if (arquetiposRes.data) setArquetipos(arquetiposRes.data);
    if (afirmacoesRes.data) setAfirmacoes(afirmacoesRes.data);
    setLoading(false);
  };

  const handleSaveArquetipo = async () => {
    if (!editingArquetipo) return;

    const { error } = await supabase
      .from('eneagrama_feminino_arquetipos')
      .update({
        nome: editingArquetipo.nome,
        nome_en: editingArquetipo.nome_en,
        essencia_simbolica: editingArquetipo.essencia_simbolica,
        ferida_central: editingArquetipo.ferida_central,
        dom_central: editingArquetipo.dom_central,
        expressao_sombra: editingArquetipo.expressao_sombra,
        caminho_expansao: editingArquetipo.caminho_expansao,
        pergunta_reflexiva: editingArquetipo.pergunta_reflexiva,
        pratica_simbolica: editingArquetipo.pratica_simbolica,
        icone: editingArquetipo.icone,
        cor_primaria: editingArquetipo.cor_primaria,
        ativo: editingArquetipo.ativo,
      })
      .eq('id', editingArquetipo.id);

    if (error) {
      toast.error('Erro ao salvar: ' + error.message);
    } else {
      toast.success('Arquétipo atualizado');
      fetchData();
      setArquetipoDialogOpen(false);
      setEditingArquetipo(null);
    }
  };

  const handleSaveAfirmacao = async () => {
    if (!editingAfirmacao) return;

    const isNew = !editingAfirmacao.id;

    if (isNew) {
      const { error } = await supabase
        .from('eneagrama_feminino_afirmacoes')
        .insert({
          arquetipo_id: editingAfirmacao.arquetipo_id,
          texto_afirmacao: editingAfirmacao.texto_afirmacao,
          peso: editingAfirmacao.peso,
          ordem: editingAfirmacao.ordem,
          ativo: editingAfirmacao.ativo,
        });

      if (error) {
        toast.error('Erro ao criar: ' + error.message);
      } else {
        toast.success('Afirmação criada');
        fetchData();
        setAfirmacaoDialogOpen(false);
        setEditingAfirmacao(null);
      }
    } else {
      const { error } = await supabase
        .from('eneagrama_feminino_afirmacoes')
        .update({
          texto_afirmacao: editingAfirmacao.texto_afirmacao,
          peso: editingAfirmacao.peso,
          ordem: editingAfirmacao.ordem,
          ativo: editingAfirmacao.ativo,
        })
        .eq('id', editingAfirmacao.id);

      if (error) {
        toast.error('Erro ao salvar: ' + error.message);
      } else {
        toast.success('Afirmação atualizada');
        fetchData();
        setAfirmacaoDialogOpen(false);
        setEditingAfirmacao(null);
      }
    }
  };

  const handleDeleteAfirmacao = async (id: string) => {
    if (!confirm('Remover esta afirmação?')) return;

    const { error } = await supabase
      .from('eneagrama_feminino_afirmacoes')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao remover: ' + error.message);
    } else {
      toast.success('Afirmação removida');
      fetchData();
    }
  };

  const getAfirmacoesByArquetipo = (arquetipoId: string) => {
    return afirmacoes.filter(a => a.arquetipo_id === arquetipoId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Flower2 className="w-6 h-6 text-gold" />
        <h2 className="text-xl font-display">Eneagrama Feminino</h2>
      </div>

      <Tabs defaultValue="arquetipos">
        <TabsList>
          <TabsTrigger value="arquetipos">9 Arquétipos</TabsTrigger>
          <TabsTrigger value="afirmacoes">Afirmações do Quiz</TabsTrigger>
        </TabsList>

        {/* ARCHETYPES TAB */}
        <TabsContent value="arquetipos" className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">
            Configure os 9 arquétipos femininos — seus nomes, narrativas e práticas.
          </p>

          <div className="grid gap-4">
            {arquetipos.map(arq => (
              <Card key={arq.id} className={!arq.ativo ? 'opacity-50' : ''}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{ 
                            backgroundColor: `${arq.cor_primaria}20`,
                            color: arq.cor_primaria || 'inherit'
                          }}
                        >
                          {arq.numero}
                        </div>
                        <div>
                          <p className="font-medium">{arq.nome}</p>
                          <p className="text-xs text-muted-foreground">{arq.nome_en}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {arq.essencia_simbolica}
                      </p>
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Afirmações: {getAfirmacoesByArquetipo(arq.id).length}</span>
                        <span>•</span>
                        <span className={arq.ativo ? 'text-green-500' : 'text-red-500'}>
                          {arq.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingArquetipo(arq);
                        setArquetipoDialogOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* AFFIRMATIONS TAB */}
        <TabsContent value="afirmacoes" className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground mb-4">
            Gerencie as afirmações do quiz para cada arquétipo.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {arquetipos.map(arq => (
              <Button
                key={arq.id}
                variant={selectedArquetipoId === arq.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedArquetipoId(arq.id)}
              >
                {arq.numero}. {arq.nome}
              </Button>
            ))}
          </div>

          {selectedArquetipoId && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    Afirmações: {arquetipos.find(a => a.id === selectedArquetipoId)?.nome}
                  </CardTitle>
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingAfirmacao({
                        id: '',
                        arquetipo_id: selectedArquetipoId,
                        texto_afirmacao: '',
                        peso: 1,
                        ordem: getAfirmacoesByArquetipo(selectedArquetipoId).length + 1,
                        ativo: true,
                      });
                      setAfirmacaoDialogOpen(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {getAfirmacoesByArquetipo(selectedArquetipoId).map((af, idx) => (
                  <div 
                    key={af.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border"
                  >
                    <span className="text-xs text-muted-foreground mt-1">{idx + 1}.</span>
                    <p className="flex-1 text-sm">{af.texto_afirmacao}</p>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setEditingAfirmacao(af);
                          setAfirmacaoDialogOpen(true);
                        }}
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDeleteAfirmacao(af.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}

                {getAfirmacoesByArquetipo(selectedArquetipoId).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhuma afirmação cadastrada.
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* ARCHETYPE EDIT DIALOG */}
      <Dialog open={arquetipoDialogOpen} onOpenChange={setArquetipoDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Arquétipo: {editingArquetipo?.nome}</DialogTitle>
          </DialogHeader>

          {editingArquetipo && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nome (PT)</Label>
                  <Input
                    value={editingArquetipo.nome}
                    onChange={(e) => setEditingArquetipo({ ...editingArquetipo, nome: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Nome (EN)</Label>
                  <Input
                    value={editingArquetipo.nome_en || ''}
                    onChange={(e) => setEditingArquetipo({ ...editingArquetipo, nome_en: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Essência Simbólica</Label>
                <Textarea
                  value={editingArquetipo.essencia_simbolica}
                  onChange={(e) => setEditingArquetipo({ ...editingArquetipo, essencia_simbolica: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Dom Central</Label>
                  <Textarea
                    value={editingArquetipo.dom_central || ''}
                    onChange={(e) => setEditingArquetipo({ ...editingArquetipo, dom_central: e.target.value })}
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Ferida Central</Label>
                  <Textarea
                    value={editingArquetipo.ferida_central || ''}
                    onChange={(e) => setEditingArquetipo({ ...editingArquetipo, ferida_central: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>

              <div>
                <Label>Expressão Sombra</Label>
                <Textarea
                  value={editingArquetipo.expressao_sombra || ''}
                  onChange={(e) => setEditingArquetipo({ ...editingArquetipo, expressao_sombra: e.target.value })}
                  rows={2}
                />
              </div>

              <div>
                <Label>Caminho de Expansão</Label>
                <Textarea
                  value={editingArquetipo.caminho_expansao || ''}
                  onChange={(e) => setEditingArquetipo({ ...editingArquetipo, caminho_expansao: e.target.value })}
                  rows={2}
                />
              </div>

              <div>
                <Label>Pergunta Reflexiva</Label>
                <Input
                  value={editingArquetipo.pergunta_reflexiva || ''}
                  onChange={(e) => setEditingArquetipo({ ...editingArquetipo, pergunta_reflexiva: e.target.value })}
                />
              </div>

              <div>
                <Label>Prática Simbólica</Label>
                <Textarea
                  value={editingArquetipo.pratica_simbolica || ''}
                  onChange={(e) => setEditingArquetipo({ ...editingArquetipo, pratica_simbolica: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Ícone (Lucide)</Label>
                  <Input
                    value={editingArquetipo.icone || ''}
                    onChange={(e) => setEditingArquetipo({ ...editingArquetipo, icone: e.target.value })}
                    placeholder="Heart, Crown, Star..."
                  />
                </div>
                <div>
                  <Label>Cor Primária (HEX)</Label>
                  <div className="flex gap-2">
                    <Input
                      value={editingArquetipo.cor_primaria || ''}
                      onChange={(e) => setEditingArquetipo({ ...editingArquetipo, cor_primaria: e.target.value })}
                      placeholder="#E8B4B8"
                    />
                    {editingArquetipo.cor_primaria && (
                      <div 
                        className="w-10 h-10 rounded border"
                        style={{ backgroundColor: editingArquetipo.cor_primaria }}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={editingArquetipo.ativo}
                  onCheckedChange={(checked) => setEditingArquetipo({ ...editingArquetipo, ativo: checked })}
                />
                <Label>Ativo</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setArquetipoDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveArquetipo}>
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* AFFIRMATION EDIT DIALOG */}
      <Dialog open={afirmacaoDialogOpen} onOpenChange={setAfirmacaoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAfirmacao?.id ? 'Editar Afirmação' : 'Nova Afirmação'}
            </DialogTitle>
          </DialogHeader>

          {editingAfirmacao && (
            <div className="space-y-4 py-4">
              <div>
                <Label>Texto da Afirmação</Label>
                <Textarea
                  value={editingAfirmacao.texto_afirmacao}
                  onChange={(e) => setEditingAfirmacao({ ...editingAfirmacao, texto_afirmacao: e.target.value })}
                  rows={3}
                  placeholder="Ex: Frequentemente me pego priorizando as necessidades dos outros..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Peso</Label>
                  <Input
                    type="number"
                    value={editingAfirmacao.peso}
                    onChange={(e) => setEditingAfirmacao({ ...editingAfirmacao, peso: parseInt(e.target.value) || 1 })}
                    min={1}
                    max={3}
                  />
                </div>
                <div>
                  <Label>Ordem</Label>
                  <Input
                    type="number"
                    value={editingAfirmacao.ordem}
                    onChange={(e) => setEditingAfirmacao({ ...editingAfirmacao, ordem: parseInt(e.target.value) || 1 })}
                    min={1}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={editingAfirmacao.ativo}
                  onCheckedChange={(checked) => setEditingAfirmacao({ ...editingAfirmacao, ativo: checked })}
                />
                <Label>Ativa</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setAfirmacaoDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveAfirmacao}>
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
