import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Edit, Eye, Sparkles, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';

interface Fase {
  id: string;
  numero: number;
  chave: string;
  nome: string;
  nome_en: string | null;
  subtitulo: string | null;
  descricao: string;
  pergunta_central: string | null;
  perguntas_reflexao: string[] | null;
  arquetipos_sugeridos: string[] | null;
  praticas_simbolicas: string[] | null;
  linguagem_contencao: string | null;
  microcopy: string | null;
  icone: string | null;
  cor_primaria: string | null;
  ativo: boolean | null;
  ordem: number | null;
}

interface Registro {
  id: string;
  user_id: string;
  cliente_id: string | null;
  terapeuta_id: string | null;
  modo: string;
  fase_atual: number | null;
  nome_simbolico: string | null;
  status: string | null;
  created_at: string;
}

export function AdminJornadaHeroinaTab() {
  const navigate = useNavigate();
  const [fases, setFases] = useState<Fase[]>([]);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFase, setEditingFase] = useState<Fase | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fasesRes, registrosRes] = await Promise.all([
        supabase.from('jornada_heroina_fases').select('*').order('numero'),
        supabase.from('jornada_heroina_registros').select('*').order('created_at', { ascending: false }).limit(50)
      ]);

      if (fasesRes.error) throw fasesRes.error;
      if (registrosRes.error) throw registrosRes.error;

      setFases(fasesRes.data || []);
      setRegistros(registrosRes.data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar dados: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditFase = (fase: Fase) => {
    setEditingFase({ ...fase });
    setDialogOpen(true);
  };

  const handleSaveFase = async () => {
    if (!editingFase) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('jornada_heroina_fases')
        .update({
          nome: editingFase.nome,
          nome_en: editingFase.nome_en,
          subtitulo: editingFase.subtitulo,
          descricao: editingFase.descricao,
          pergunta_central: editingFase.pergunta_central,
          perguntas_reflexao: editingFase.perguntas_reflexao,
          arquetipos_sugeridos: editingFase.arquetipos_sugeridos,
          praticas_simbolicas: editingFase.praticas_simbolicas,
          linguagem_contencao: editingFase.linguagem_contencao,
          microcopy: editingFase.microcopy,
          icone: editingFase.icone,
          cor_primaria: editingFase.cor_primaria,
          ativo: editingFase.ativo,
          ordem: editingFase.ordem
        })
        .eq('id', editingFase.id);

      if (error) throw error;

      toast.success('Fase atualizada com sucesso!');
      setDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error('Erro ao salvar: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAtivo = async (fase: Fase) => {
    try {
      const { error } = await supabase
        .from('jornada_heroina_fases')
        .update({ ativo: !fase.ativo })
        .eq('id', fase.id);

      if (error) throw error;
      toast.success(`Fase ${fase.ativo ? 'desativada' : 'ativada'}`);
      fetchData();
    } catch (error: any) {
      toast.error('Erro ao atualizar: ' + error.message);
    }
  };

  const parseArrayField = (value: string): string[] => {
    return value.split('\n').map(s => s.trim()).filter(Boolean);
  };

  const formatArrayField = (arr: string[] | null): string => {
    return arr?.join('\n') || '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Jornada da Heroína</h2>
          <p className="text-sm text-muted-foreground">Gerencie as 7 fases da Jornada Iniciática Feminina</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/ferramenta/jornada-heroina')}>
          <ExternalLink className="w-4 h-4 mr-2" />
          Ver Ferramenta
        </Button>
      </div>

      <Tabs defaultValue="fases">
        <TabsList>
          <TabsTrigger value="fases" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Fases ({fases.length})
          </TabsTrigger>
          <TabsTrigger value="registros" className="gap-2">
            <Eye className="w-4 h-4" />
            Registros ({registros.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fases" className="mt-4">
          <div className="grid gap-4">
            {fases.map((fase) => (
              <Card key={fase.id} className={!fase.ativo ? 'opacity-60' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                        style={{ backgroundColor: fase.cor_primaria || 'hsl(var(--primary))' }}
                      >
                        {fase.numero}
                      </div>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {fase.icone && <span>{fase.icone}</span>}
                          {fase.nome}
                          {!fase.ativo && <Badge variant="secondary">Inativa</Badge>}
                        </CardTitle>
                        {fase.subtitulo && (
                          <p className="text-sm text-muted-foreground">{fase.subtitulo}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={fase.ativo ?? true} 
                        onCheckedChange={() => handleToggleAtivo(fase)}
                      />
                      <Button size="sm" variant="ghost" onClick={() => handleEditFase(fase)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{fase.descricao}</p>
                  {fase.pergunta_central && (
                    <p className="text-sm mt-2 italic text-primary">"{fase.pergunta_central}"</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {fase.arquetipos_sugeridos?.slice(0, 3).map((arq, i) => (
                      <Badge key={i} variant="outline">{arq}</Badge>
                    ))}
                    {(fase.arquetipos_sugeridos?.length || 0) > 3 && (
                      <Badge variant="outline">+{(fase.arquetipos_sugeridos?.length || 0) - 3}</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="registros" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Jornadas em Andamento</CardTitle>
            </CardHeader>
            <CardContent>
              {registros.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhum registro de jornada encontrado.
                </p>
              ) : (
                <div className="space-y-3">
                  {registros.map((reg) => (
                    <div key={reg.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-sm font-medium">
                          {reg.nome_simbolico || 'Jornada sem nome'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Modo: {reg.modo === 'conducao' ? 'Condução Profissional' : 'Pessoal'} • 
                          Fase atual: {reg.fase_atual || 1} • 
                          Status: {reg.status || 'em_andamento'}
                        </p>
                      </div>
                      <Badge variant={reg.status === 'concluido' ? 'default' : 'secondary'}>
                        {reg.status === 'concluido' ? 'Concluída' : 'Em andamento'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de Edição */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              Editar Fase {editingFase?.numero}: {editingFase?.nome}
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh] pr-4">
            {editingFase && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome</Label>
                    <Input
                      value={editingFase.nome}
                      onChange={(e) => setEditingFase({ ...editingFase, nome: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nome (EN)</Label>
                    <Input
                      value={editingFase.nome_en || ''}
                      onChange={(e) => setEditingFase({ ...editingFase, nome_en: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Subtítulo</Label>
                  <Input
                    value={editingFase.subtitulo || ''}
                    onChange={(e) => setEditingFase({ ...editingFase, subtitulo: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea
                    value={editingFase.descricao}
                    onChange={(e) => setEditingFase({ ...editingFase, descricao: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Pergunta Central</Label>
                  <Input
                    value={editingFase.pergunta_central || ''}
                    onChange={(e) => setEditingFase({ ...editingFase, pergunta_central: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Perguntas de Reflexão (uma por linha)</Label>
                  <Textarea
                    value={formatArrayField(editingFase.perguntas_reflexao)}
                    onChange={(e) => setEditingFase({ 
                      ...editingFase, 
                      perguntas_reflexao: parseArrayField(e.target.value) 
                    })}
                    rows={4}
                    placeholder="O que está te chamando?&#10;Qual o som desse chamado?"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Arquétipos Sugeridos (um por linha)</Label>
                  <Textarea
                    value={formatArrayField(editingFase.arquetipos_sugeridos)}
                    onChange={(e) => setEditingFase({ 
                      ...editingFase, 
                      arquetipos_sugeridos: parseArrayField(e.target.value) 
                    })}
                    rows={3}
                    placeholder="Perséfone&#10;Inanna&#10;Psiquê"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Práticas Simbólicas (uma por linha)</Label>
                  <Textarea
                    value={formatArrayField(editingFase.praticas_simbolicas)}
                    onChange={(e) => setEditingFase({ 
                      ...editingFase, 
                      praticas_simbolicas: parseArrayField(e.target.value) 
                    })}
                    rows={3}
                    placeholder="Meditação com o chamado&#10;Escrita livre sobre o desejo"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Linguagem de Contenção (orientação para facilitadoras)</Label>
                  <Textarea
                    value={editingFase.linguagem_contencao || ''}
                    onChange={(e) => setEditingFase({ ...editingFase, linguagem_contencao: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Microcopy (texto de apoio na UI)</Label>
                  <Input
                    value={editingFase.microcopy || ''}
                    onChange={(e) => setEditingFase({ ...editingFase, microcopy: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Ícone (emoji)</Label>
                    <Input
                      value={editingFase.icone || ''}
                      onChange={(e) => setEditingFase({ ...editingFase, icone: e.target.value })}
                      placeholder="🌙"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cor Primária</Label>
                    <Input
                      type="color"
                      value={editingFase.cor_primaria || '#8B5CF6'}
                      onChange={(e) => setEditingFase({ ...editingFase, cor_primaria: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ordem</Label>
                    <Input
                      type="number"
                      value={editingFase.ordem || editingFase.numero}
                      onChange={(e) => setEditingFase({ ...editingFase, ordem: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={editingFase.ativo ?? true}
                    onCheckedChange={(checked) => setEditingFase({ ...editingFase, ativo: checked })}
                  />
                  <Label>Fase Ativa</Label>
                </div>
              </div>
            )}
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveFase} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminJornadaHeroinaTab;
