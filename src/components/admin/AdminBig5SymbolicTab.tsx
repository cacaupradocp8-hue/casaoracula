// ============================================
// ADMIN BIG5 SYMBOLIC TAB
// Manage symbolic forces, statements and narratives
// ============================================

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Save, Sparkles, MessageSquare, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SymbolicForce {
  id: string;
  chave: string;
  nome: string;
  nome_en: string | null;
  descricao_simbolica: string;
  narrativa_elevada: string | null;
  narrativa_fragil: string | null;
  microcopy_reflexao: string | null;
  pratica_sugerida: string | null;
  icone: string | null;
  cor_primaria: string | null;
  ordem: number;
  ativo: boolean;
  // Clinical protocol fields
  padrao_emocional: string | null;
  conflito_recorrente: string | null;
  repeticao_comportamental: string | null;
  risco_clinico: string | null;
  potencial_inexplorado: string | null;
}

interface Afirmacao {
  id: string;
  force_id: string;
  texto_afirmacao: string;
  peso: number;
  ordem: number;
  ativo: boolean;
}

export function AdminBig5SymbolicTab() {
  return (
    <Tabs defaultValue="forces" className="space-y-4">
      <TabsList>
        <TabsTrigger value="forces" className="gap-2">
          <Sparkles className="w-4 h-4" />
          Forças
        </TabsTrigger>
        <TabsTrigger value="statements" className="gap-2">
          <MessageSquare className="w-4 h-4" />
          Afirmações
        </TabsTrigger>
      </TabsList>

      <TabsContent value="forces">
        <ForcesSection />
      </TabsContent>

      <TabsContent value="statements">
        <StatementsSection />
      </TabsContent>
    </Tabs>
  );
}

// Forces Management
function ForcesSection() {
  const [forces, setForces] = useState<SymbolicForce[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingForce, setEditingForce] = useState<SymbolicForce | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchForces();
  }, []);

  const fetchForces = async () => {
    const { data, error } = await supabase
      .from('big5_symbolic_forces')
      .select('*')
      .order('ordem');

    if (error) {
      toast({ title: 'Erro ao carregar forças', variant: 'destructive' });
    } else {
      setForces(data || []);
    }
    setLoading(false);
  };

  const handleSave = async (force: SymbolicForce) => {
    const { error } = await supabase
      .from('big5_symbolic_forces')
      .update({
        nome: force.nome,
        nome_en: force.nome_en,
        descricao_simbolica: force.descricao_simbolica,
        narrativa_elevada: force.narrativa_elevada,
        narrativa_fragil: force.narrativa_fragil,
        microcopy_reflexao: force.microcopy_reflexao,
        pratica_sugerida: force.pratica_sugerida,
        icone: force.icone,
        cor_primaria: force.cor_primaria,
        ordem: force.ordem,
        ativo: force.ativo,
        // Clinical protocol fields
        padrao_emocional: force.padrao_emocional,
        conflito_recorrente: force.conflito_recorrente,
        repeticao_comportamental: force.repeticao_comportamental,
        risco_clinico: force.risco_clinico,
        potencial_inexplorado: force.potencial_inexplorado,
      })
      .eq('id', force.id);

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Força atualizada' });
      fetchForces();
      setDialogOpen(false);
    }
  };

  const toggleAtivo = async (force: SymbolicForce) => {
    const { error } = await supabase
      .from('big5_symbolic_forces')
      .update({ ativo: !force.ativo })
      .eq('id', force.id);

    if (error) {
      toast({ title: 'Erro ao alterar status', variant: 'destructive' });
    } else {
      fetchForces();
    }
  };

  if (loading) return <div className="text-muted-foreground p-4">Carregando...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
      <div>
          <h3 className="text-lg font-semibold">Forças Simbólicas</h3>
          <p className="text-sm text-muted-foreground">
            O Mapa dos Cinco Territórios da Psique Feminina (não adicione novas — edite as existentes)
          </p>
        </div>
        <Button variant="outline" onClick={() => window.open('/ferramenta/big5-simbolico', '_blank')}>
          <ExternalLink className="w-4 h-4 mr-2" />
          Ver ferramenta
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Força: {editingForce?.nome}</DialogTitle>
          </DialogHeader>
          {editingForce && (
            <ForceForm 
              force={editingForce} 
              onSave={handleSave}
              onChange={setEditingForce}
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {forces.map(force => (
          <Card key={force.id} className={force.ativo ? '' : 'opacity-50'}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: force.cor_primaria || '#D4AF37' }}
                  />
                  <div>
                    <CardTitle className="text-base">{force.nome}</CardTitle>
                    <CardDescription className="text-xs">{force.nome_en}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={force.ativo} onCheckedChange={() => toggleAtivo(force)} />
                  <Button variant="ghost" size="icon" onClick={() => {
                    setEditingForce(force);
                    setDialogOpen(true);
                  }}>
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {force.descricao_simbolica}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Force Edit Form
function ForceForm({ force, onSave, onChange }: {
  force: SymbolicForce;
  onSave: (f: SymbolicForce) => void;
  onChange: (f: SymbolicForce) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Nome (PT)</Label>
          <Input 
            value={force.nome} 
            onChange={(e) => onChange({ ...force, nome: e.target.value })}
          />
        </div>
        <div>
          <Label>Nome (EN)</Label>
          <Input 
            value={force.nome_en || ''} 
            onChange={(e) => onChange({ ...force, nome_en: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Cor primária (hex)</Label>
          <div className="flex gap-2">
            <Input 
              value={force.cor_primaria || '#D4AF37'} 
              onChange={(e) => onChange({ ...force, cor_primaria: e.target.value })}
            />
            <div 
              className="w-10 h-10 rounded border"
              style={{ backgroundColor: force.cor_primaria || '#D4AF37' }}
            />
          </div>
        </div>
        <div>
          <Label>Ordem</Label>
          <Input 
            type="number"
            value={force.ordem} 
            onChange={(e) => onChange({ ...force, ordem: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div>
        <Label>Descrição simbólica</Label>
        <Textarea 
          value={force.descricao_simbolica} 
          onChange={(e) => onChange({ ...force, descricao_simbolica: e.target.value })}
          rows={2}
        />
      </div>

      <div>
        <Label>Narrativa quando ELEVADA</Label>
        <Textarea 
          value={force.narrativa_elevada || ''} 
          onChange={(e) => onChange({ ...force, narrativa_elevada: e.target.value })}
          rows={3}
          placeholder="O que significa quando essa força está viva..."
        />
      </div>

      <div>
        <Label>Narrativa quando FRAGILIZADA</Label>
        <Textarea 
          value={force.narrativa_fragil || ''} 
          onChange={(e) => onChange({ ...force, narrativa_fragil: e.target.value })}
          rows={3}
          placeholder="O que significa quando essa força está baixa..."
        />
      </div>

      <div>
        <Label>Microcopy de reflexão (pergunta)</Label>
        <Input 
          value={force.microcopy_reflexao || ''} 
          onChange={(e) => onChange({ ...force, microcopy_reflexao: e.target.value })}
          placeholder="O que você tem evitado descobrir?"
        />
      </div>

      <div>
        <Label>Prática sugerida</Label>
        <Textarea 
          value={force.pratica_sugerida || ''} 
          onChange={(e) => onChange({ ...force, pratica_sugerida: e.target.value })}
          rows={2}
          placeholder="Uma prática simbólica para trabalhar essa força..."
        />
      </div>

      {/* Clinical Protocol Fields */}
      <div className="border-t pt-4 mt-4">
        <h4 className="text-sm font-medium text-purple-400 mb-3">Campos do Protocolo Clínico</h4>
        
        <div className="space-y-3">
          <div>
            <Label>Padrão emocional</Label>
            <Textarea 
              value={force.padrao_emocional || ''} 
              onChange={(e) => onChange({ ...force, padrao_emocional: e.target.value })}
              rows={2}
              placeholder="Qual padrão emocional caracteriza este território..."
            />
          </div>

          <div>
            <Label>Conflito recorrente</Label>
            <Textarea 
              value={force.conflito_recorrente || ''} 
              onChange={(e) => onChange({ ...force, conflito_recorrente: e.target.value })}
              rows={2}
              placeholder="Que tipo de conflito tende a se repetir..."
            />
          </div>

          <div>
            <Label>Repetição comportamental</Label>
            <Textarea 
              value={force.repeticao_comportamental || ''} 
              onChange={(e) => onChange({ ...force, repeticao_comportamental: e.target.value })}
              rows={2}
              placeholder="Padrões de comportamento recorrentes..."
            />
          </div>

          <div>
            <Label>Risco clínico (linguagem ética)</Label>
            <Textarea 
              value={force.risco_clinico || ''} 
              onChange={(e) => onChange({ ...force, risco_clinico: e.target.value })}
              rows={2}
              placeholder="O que observar com cuidado ético..."
            />
          </div>

          <div>
            <Label>Potencial inexplorado</Label>
            <Textarea 
              value={force.potencial_inexplorado || ''} 
              onChange={(e) => onChange({ ...force, potencial_inexplorado: e.target.value })}
              rows={2}
              placeholder="Recursos ainda não desenvolvidos neste território..."
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch 
          checked={force.ativo} 
          onCheckedChange={(checked) => onChange({ ...force, ativo: checked })}
        />
        <Label>Ativa</Label>
      </div>

      <Button onClick={() => onSave(force)} className="w-full gap-2">
        <Save className="w-4 h-4" />
        Salvar Força
      </Button>
    </div>
  );
}

// Statements Management
function StatementsSection() {
  const [statements, setStatements] = useState<Afirmacao[]>([]);
  const [forces, setForces] = useState<SymbolicForce[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStatement, setEditingStatement] = useState<Afirmacao | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedForceId, setSelectedForceId] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [statementsRes, forcesRes] = await Promise.all([
      supabase.from('big5_symbolic_afirmacoes').select('*').order('force_id').order('ordem'),
      supabase.from('big5_symbolic_forces').select('*').order('ordem'),
    ]);

    if (statementsRes.data) setStatements(statementsRes.data);
    if (forcesRes.data) {
      setForces(forcesRes.data);
      if (forcesRes.data.length > 0 && !selectedForceId) {
        setSelectedForceId(forcesRes.data[0].id);
      }
    }
    setLoading(false);
  };

  const handleSave = async (statement: Afirmacao) => {
    if (isCreating) {
      const { error } = await supabase
        .from('big5_symbolic_afirmacoes')
        .insert([{
          force_id: statement.force_id,
          texto_afirmacao: statement.texto_afirmacao,
          peso: statement.peso,
          ordem: statement.ordem,
          ativo: statement.ativo,
        }]);

      if (error) {
        toast({ title: 'Erro ao criar', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Afirmação criada' });
        fetchData();
        setDialogOpen(false);
        setIsCreating(false);
      }
    } else {
      const { error } = await supabase
        .from('big5_symbolic_afirmacoes')
        .update({
          texto_afirmacao: statement.texto_afirmacao,
          peso: statement.peso,
          ordem: statement.ordem,
          ativo: statement.ativo,
        })
        .eq('id', statement.id);

      if (error) {
        toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Afirmação atualizada' });
        fetchData();
        setDialogOpen(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta afirmação?')) return;
    
    const { error } = await supabase.from('big5_symbolic_afirmacoes').delete().eq('id', id);
    
    if (error) {
      toast({ title: 'Erro ao excluir', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Afirmação excluída' });
      fetchData();
    }
  };

  const openCreateDialog = () => {
    const filteredForce = forces.find(f => f.id === selectedForceId);
    const existingStatements = statements.filter(s => s.force_id === selectedForceId);
    
    setEditingStatement({
      id: '',
      force_id: selectedForceId,
      texto_afirmacao: '',
      peso: 1,
      ordem: existingStatements.length + 1,
      ativo: true,
    });
    setIsCreating(true);
    setDialogOpen(true);
  };

  const getForceNome = (forceId: string) => {
    return forces.find(f => f.id === forceId)?.nome || 'Desconhecida';
  };

  const filteredStatements = statements.filter(s => s.force_id === selectedForceId);

  if (loading) return <div className="text-muted-foreground p-4">Carregando...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Afirmações do Quiz</h3>
          <p className="text-sm text-muted-foreground">
            Statements que o usuário responderá (escala Likert)
          </p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Afirmação
        </Button>
      </div>

      {/* Force Filter */}
      <div className="flex gap-2 flex-wrap">
        {forces.map(force => (
          <Button
            key={force.id}
            variant={selectedForceId === force.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedForceId(force.id)}
            style={{ 
              borderColor: force.cor_primaria || undefined,
              backgroundColor: selectedForceId === force.id ? force.cor_primaria || undefined : undefined,
            }}
          >
            {force.nome}
          </Button>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) {
          setEditingStatement(null);
          setIsCreating(false);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isCreating ? 'Nova Afirmação' : 'Editar Afirmação'}
            </DialogTitle>
          </DialogHeader>
          {editingStatement && (
            <div className="space-y-4">
              <div>
                <Label>Força: {getForceNome(editingStatement.force_id)}</Label>
              </div>
              <div>
                <Label>Texto da afirmação</Label>
                <Textarea 
                  value={editingStatement.texto_afirmacao} 
                  onChange={(e) => setEditingStatement({ ...editingStatement, texto_afirmacao: e.target.value })}
                  rows={2}
                  placeholder="Sinto-me confortável com a incerteza..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Peso (1-3)</Label>
                  <Input 
                    type="number"
                    min={1}
                    max={3}
                    value={editingStatement.peso} 
                    onChange={(e) => setEditingStatement({ ...editingStatement, peso: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div>
                  <Label>Ordem</Label>
                  <Input 
                    type="number"
                    value={editingStatement.ordem} 
                    onChange={(e) => setEditingStatement({ ...editingStatement, ordem: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  checked={editingStatement.ativo} 
                  onCheckedChange={(checked) => setEditingStatement({ ...editingStatement, ativo: checked })}
                />
                <Label>Ativa</Label>
              </div>
              <Button onClick={() => handleSave(editingStatement)} className="w-full gap-2">
                <Save className="w-4 h-4" />
                Salvar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Ordem</TableHead>
                <TableHead>Afirmação</TableHead>
                <TableHead className="w-16">Peso</TableHead>
                <TableHead className="w-20">Status</TableHead>
                <TableHead className="w-24">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStatements.map(s => (
                <TableRow key={s.id} className={!s.ativo ? 'opacity-50' : ''}>
                  <TableCell className="font-mono text-xs">{s.ordem}</TableCell>
                  <TableCell className="max-w-md">
                    <p className="text-sm line-clamp-2">{s.texto_afirmacao}</p>
                  </TableCell>
                  <TableCell className="font-mono">{s.peso}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={s.ativo}
                      onCheckedChange={async () => {
                        await supabase.from('big5_symbolic_afirmacoes').update({ ativo: !s.ativo }).eq('id', s.id);
                        fetchData();
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => {
                        setEditingStatement(s);
                        setIsCreating(false);
                        setDialogOpen(true);
                      }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredStatements.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    Nenhuma afirmação para esta força
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
