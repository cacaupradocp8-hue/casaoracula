// ============================================
// ADMIN TAB - CLUBE DO LIVRO ORACULAR
// ============================================

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, Plus, Pencil, Trash2, ChevronDown, ChevronUp,
  Sparkles, Headphones, Video, FileText
} from 'lucide-react';

interface Ciclo {
  id: string;
  titulo: string;
  subtitulo?: string;
  autor_livro?: string;
  capa_url?: string;
  por_que_este_livro?: string;
  como_ler?: string;
  manifesto?: string;
  ordem: number;
  ativo: boolean;
  publicado: boolean;
  portal_minimo: string;
  // New clinical fields
  tema_simbolico?: string;
  orientacao_clinica_uso?: string;
  orientacao_clinica_evitar?: string;
  orientacao_clinica_riscos?: string;
  orientacao_clinica_indicado?: string;
  orientacao_clinica_contraindicado?: string;
  ritual_aceite_obrigatorio?: boolean;
  portal_minimo_clinico?: string;
}

interface Fase {
  id: string;
  ciclo_id: string;
  titulo: string;
  descricao?: string;
  icone?: string;
  ordem: number;
  ativo: boolean;
  tipo_fase?: string;
  orientacao_curta?: string;
}

interface Pergunta {
  id: string;
  fase_id: string;
  texto_pergunta: string;
  ordem: number;
  ativo: boolean;
}

interface Escuta {
  id: string;
  ciclo_id: string;
  fase_id?: string;
  titulo: string;
  descricao?: string;
  tipo: 'audio' | 'texto';
  audio_url?: string;
  texto_conteudo?: string;
  duracao_segundos?: number;
  ordem: number;
  ativo: boolean;
}

interface Encontro {
  id: string;
  ciclo_id: string;
  titulo: string;
  descricao?: string;
  orientacao_encontro?: string;
  data_encontro?: string;
  link_ao_vivo?: string;
  replay_url?: string;
  ativo: boolean;
}

export function AdminClubeLivroTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCiclo, setSelectedCiclo] = useState<string | null>(null);
  const [cicloDialogOpen, setCicloDialogOpen] = useState(false);
  const [editingCiclo, setEditingCiclo] = useState<Ciclo | null>(null);

  // Fetch ciclos
  const { data: ciclos, isLoading } = useQuery({
    queryKey: ['admin-clube-ciclos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_ciclos')
        .select('*')
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as Ciclo[];
    },
  });

  // Create/Update ciclo
  const saveCiclo = useMutation({
    mutationFn: async (ciclo: Partial<Ciclo>) => {
      const payload = {
        titulo: ciclo.titulo,
        subtitulo: ciclo.subtitulo,
        autor_livro: ciclo.autor_livro,
        capa_url: ciclo.capa_url,
        por_que_este_livro: ciclo.por_que_este_livro,
        como_ler: ciclo.como_ler,
        manifesto: ciclo.manifesto,
        publicado: ciclo.publicado,
      };
      
      if (ciclo.id) {
        const { error } = await supabase
          .from('clube_livro_ciclos')
          .update(payload)
          .eq('id', ciclo.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('clube_livro_ciclos')
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-ciclos'] });
      setCicloDialogOpen(false);
      setEditingCiclo(null);
      toast({ title: 'Ciclo salvo com sucesso' });
    },
    onError: () => {
      toast({ title: 'Erro ao salvar ciclo', variant: 'destructive' });
    },
  });

  // Delete ciclo
  const deleteCiclo = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('clube_livro_ciclos')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-ciclos'] });
      if (selectedCiclo) setSelectedCiclo(null);
      toast({ title: 'Ciclo removido' });
    },
  });

  const handleNewCiclo = () => {
    setEditingCiclo(null);
    setCicloDialogOpen(true);
  };

  const handleEditCiclo = (ciclo: Ciclo) => {
    setEditingCiclo(ciclo);
    setCicloDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-display text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-gold" />
            Clube do Livro Oracular
          </h2>
          <p className="text-sm text-muted-foreground">
            Gerencie ciclos, fases, perguntas, escutas e encontros.
          </p>
        </div>
        <Button onClick={handleNewCiclo} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Ciclo
        </Button>
      </div>

      {/* Lista de Ciclos */}
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-muted rounded" />
          <div className="h-20 bg-muted rounded" />
        </div>
      ) : ciclos && ciclos.length > 0 ? (
        <div className="space-y-4">
          {ciclos.map((ciclo) => (
            <CicloCard
              key={ciclo.id}
              ciclo={ciclo}
              isExpanded={selectedCiclo === ciclo.id}
              onToggle={() => setSelectedCiclo(selectedCiclo === ciclo.id ? null : ciclo.id)}
              onEdit={() => handleEditCiclo(ciclo)}
              onDelete={() => deleteCiclo.mutate(ciclo.id)}
            />
          ))}
        </div>
      ) : (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="py-8 text-center">
            <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Nenhum ciclo cadastrado.</p>
            <Button variant="outline" className="mt-4" onClick={handleNewCiclo}>
              Criar primeiro ciclo
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog para criar/editar ciclo */}
      <CicloDialog
        open={cicloDialogOpen}
        onOpenChange={setCicloDialogOpen}
        ciclo={editingCiclo}
        onSave={(data) => saveCiclo.mutate(data)}
        isLoading={saveCiclo.isPending}
      />
    </div>
  );
}

// ============================================
// CicloCard Component
// ============================================
function CicloCard({
  ciclo,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
}: {
  ciclo: Ciclo;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className={isExpanded ? 'border-gold/50' : ''}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            {ciclo.capa_url ? (
              <img src={ciclo.capa_url} alt="" className="w-12 h-16 object-cover rounded" />
            ) : (
              <div className="w-12 h-16 bg-muted rounded flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base truncate">{ciclo.titulo}</CardTitle>
                {ciclo.publicado ? (
                  <Badge className="bg-green-500/20 text-green-400">Publicado</Badge>
                ) : (
                  <Badge variant="outline">Rascunho</Badge>
                )}
              </div>
              {ciclo.autor_livro && (
                <CardDescription className="text-sm">{ciclo.autor_livro}</CardDescription>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button size="sm" variant="ghost" onClick={onEdit}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onDelete} className="text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onToggle}>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-4 border-t">
          <CicloDetailTabs cicloId={ciclo.id} />
        </CardContent>
      )}
    </Card>
  );
}

// ============================================
// CicloDetailTabs - Fases, Escutas, Encontros
// ============================================
function CicloDetailTabs({ cicloId }: { cicloId: string }) {
  return (
    <Tabs defaultValue="fases" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="fases" className="gap-1 text-xs">
          <Sparkles className="w-3 h-3" />
          Fases
        </TabsTrigger>
        <TabsTrigger value="escutas" className="gap-1 text-xs">
          <Headphones className="w-3 h-3" />
          Escutas
        </TabsTrigger>
        <TabsTrigger value="encontros" className="gap-1 text-xs">
          <Video className="w-3 h-3" />
          Encontros
        </TabsTrigger>
      </TabsList>
      <TabsContent value="fases" className="pt-4">
        <FasesManager cicloId={cicloId} />
      </TabsContent>
      <TabsContent value="escutas" className="pt-4">
        <EscutasManager cicloId={cicloId} />
      </TabsContent>
      <TabsContent value="encontros" className="pt-4">
        <EncontrosManager cicloId={cicloId} />
      </TabsContent>
    </Tabs>
  );
}

// ============================================
// FasesManager
// ============================================
function FasesManager({ cicloId }: { cicloId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newFaseTitulo, setNewFaseTitulo] = useState('');
  const [expandedFase, setExpandedFase] = useState<string | null>(null);

  const { data: fases, isLoading } = useQuery({
    queryKey: ['admin-clube-fases', cicloId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_fases')
        .select('*')
        .eq('ciclo_id', cicloId)
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as Fase[];
    },
  });

  const addFase = useMutation({
    mutationFn: async () => {
      if (!newFaseTitulo.trim()) return;
      const ordem = (fases?.length || 0) + 1;
      const { error } = await supabase
        .from('clube_livro_fases')
        .insert({ ciclo_id: cicloId, titulo: newFaseTitulo, ordem });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-fases', cicloId] });
      setNewFaseTitulo('');
      toast({ title: 'Fase adicionada' });
    },
  });

  // Generate standard 4 phases
  const gerarFasesPadrao = useMutation({
    mutationFn: async () => {
      const fasesExistentes = fases?.length || 0;
      const fasesPadrao = [
        { ciclo_id: cicloId, titulo: 'Chamado', tipo_fase: 'chamado', descricao: 'Início da jornada - o livro chega até você', ordem: fasesExistentes + 1 },
        { ciclo_id: cicloId, titulo: 'Ruptura', tipo_fase: 'ruptura', descricao: 'Momento de crise ou desorganização interna', ordem: fasesExistentes + 2 },
        { ciclo_id: cicloId, titulo: 'Reorganização', tipo_fase: 'reorganizacao', descricao: 'Retomada do fio - integração gradual', ordem: fasesExistentes + 3 },
        { ciclo_id: cicloId, titulo: 'Integração', tipo_fase: 'integracao', descricao: 'Consolidação e encerramento do ciclo', ordem: fasesExistentes + 4 },
      ];
      
      const { error } = await supabase
        .from('clube_livro_fases')
        .insert(fasesPadrao);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-fases', cicloId] });
      toast({ title: '4 fases padrão criadas' });
    },
    onError: () => {
      toast({ title: 'Erro ao criar fases', variant: 'destructive' });
    },
  });

  const deleteFase = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clube_livro_fases').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-fases', cicloId] });
      toast({ title: 'Fase removida' });
    },
  });



  return (
    <div className="space-y-4">
      {/* Generate standard phases button */}
      <div className="flex gap-2 items-center">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => gerarFasesPadrao.mutate()}
          disabled={gerarFasesPadrao.isPending}
          className="text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          Gerar 4 Fases Padrão
        </Button>
        <span className="text-xs text-muted-foreground">
          (Chamado, Ruptura, Reorganização, Integração)
        </span>
      </div>

      {/* Add fase manually */}
      <div className="flex gap-2">
        <Input
          placeholder="Nome da nova fase..."
          value={newFaseTitulo}
          onChange={(e) => setNewFaseTitulo(e.target.value)}
          className="flex-1"
        />
        <Button onClick={() => addFase.mutate()} disabled={addFase.isPending || !newFaseTitulo.trim()}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Lista de fases */}
      {isLoading ? (
        <div className="animate-pulse h-16 bg-muted rounded" />
      ) : fases && fases.length > 0 ? (
        <div className="space-y-2">
          {fases.map((fase, i) => (
            <div key={fase.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs">
                    {i + 1}
                  </span>
                  <span className="font-medium text-sm">{fase.titulo}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setExpandedFase(expandedFase === fase.id ? null : fase.id)}
                  >
                    {expandedFase === fase.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteFase.mutate(fase.id)} className="text-destructive">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              {expandedFase === fase.id && (
                <div className="mt-3 pt-3 border-t">
                  <PerguntasManager faseId={fase.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          Nenhuma fase cadastrada.
        </p>
      )}
    </div>
  );
}

// ============================================
// PerguntasManager
// ============================================
function PerguntasManager({ faseId }: { faseId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newPergunta, setNewPergunta] = useState('');

  const { data: perguntas, isLoading } = useQuery({
    queryKey: ['admin-clube-perguntas', faseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_perguntas')
        .select('*')
        .eq('fase_id', faseId)
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as Pergunta[];
    },
  });

  const addPergunta = useMutation({
    mutationFn: async () => {
      if (!newPergunta.trim()) return;
      const ordem = (perguntas?.length || 0) + 1;
      const { error } = await supabase
        .from('clube_livro_perguntas')
        .insert({ fase_id: faseId, texto_pergunta: newPergunta, ordem });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-perguntas', faseId] });
      setNewPergunta('');
      toast({ title: 'Pergunta adicionada' });
    },
  });

  const deletePergunta = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clube_livro_perguntas').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-perguntas', faseId] });
    },
  });

  return (
    <div className="space-y-3">
      <Label className="text-xs text-muted-foreground">Perguntas Oraculares</Label>

      {isLoading ? (
        <div className="animate-pulse h-8 bg-muted/50 rounded" />
      ) : perguntas && perguntas.length > 0 ? (
        <div className="space-y-2">
          {perguntas.map((p, i) => (
            <div key={p.id} className="flex items-start gap-2 text-sm bg-muted/30 p-2 rounded">
              <span className="text-xs text-muted-foreground pt-0.5">{i + 1}.</span>
              <span className="flex-1">{p.texto_pergunta}</span>
              <Button size="sm" variant="ghost" onClick={() => deletePergunta.mutate(p.id)} className="h-6 w-6 p-0 text-destructive">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex gap-2">
        <Textarea
          placeholder="Nova pergunta oracular..."
          value={newPergunta}
          onChange={(e) => setNewPergunta(e.target.value)}
          className="min-h-[60px] text-sm"
        />
        <Button size="sm" onClick={() => addPergunta.mutate()} disabled={addPergunta.isPending || !newPergunta.trim()}>
          <Plus className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

// ============================================
// EscutasManager
// ============================================
function EscutasManager({ cicloId }: { cicloId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: escutas, isLoading } = useQuery({
    queryKey: ['admin-clube-escutas', cicloId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_escutas')
        .select('*')
        .eq('ciclo_id', cicloId)
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as Escuta[];
    },
  });

  const deleteEscuta = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clube_livro_escutas').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-escutas', cicloId] });
      toast({ title: 'Escuta removida' });
    },
  });

  return (
    <div className="space-y-4">
      <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>
        <Plus className="w-3 h-3 mr-1" />
        Adicionar Escuta
      </Button>

      {isLoading ? (
        <div className="animate-pulse h-16 bg-muted rounded" />
      ) : escutas && escutas.length > 0 ? (
        <div className="space-y-2">
          {escutas.map((e) => (
            <div key={e.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {e.tipo === 'audio' ? (
                  <Headphones className="w-4 h-4 text-gold" />
                ) : (
                  <FileText className="w-4 h-4 text-gold" />
                )}
                <div>
                  <p className="text-sm font-medium">{e.titulo}</p>
                  <p className="text-xs text-muted-foreground">{e.tipo === 'audio' ? 'Áudio' : 'Texto'}</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => deleteEscuta.mutate(e.id)} className="text-destructive">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          Nenhuma escuta cadastrada.
        </p>
      )}

      <EscutaDialog cicloId={cicloId} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

// ============================================
// EncontrosManager
// ============================================
function EncontrosManager({ cicloId }: { cicloId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: encontros, isLoading } = useQuery({
    queryKey: ['admin-clube-encontros', cicloId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_encontros')
        .select('*')
        .eq('ciclo_id', cicloId)
        .order('data_encontro', { ascending: true });

      if (error) throw error;
      return data as Encontro[];
    },
  });

  const deleteEncontro = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clube_livro_encontros').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-encontros', cicloId] });
      toast({ title: 'Encontro removido' });
    },
  });

  return (
    <div className="space-y-4">
      <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>
        <Plus className="w-3 h-3 mr-1" />
        Adicionar Encontro
      </Button>

      {isLoading ? (
        <div className="animate-pulse h-16 bg-muted rounded" />
      ) : encontros && encontros.length > 0 ? (
        <div className="space-y-2">
          {encontros.map((e) => (
            <div key={e.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Video className="w-4 h-4 text-gold" />
                <div>
                  <p className="text-sm font-medium">{e.titulo}</p>
                  {e.data_encontro && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(e.data_encontro).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => deleteEncontro.mutate(e.id)} className="text-destructive">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          Nenhum encontro agendado.
        </p>
      )}

      <EncontroDialog cicloId={cicloId} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

// ============================================
// Dialogs
// ============================================
function CicloDialog({
  open,
  onOpenChange,
  ciclo,
  onSave,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ciclo: Ciclo | null;
  onSave: (data: Partial<Ciclo>) => void;
  isLoading: boolean;
}) {
  const [form, setForm] = useState({
    titulo: '',
    subtitulo: '',
    autor_livro: '',
    capa_url: '',
    por_que_este_livro: '',
    como_ler: '',
    manifesto: '',
    publicado: false,
  });

  // Reset form when dialog opens
  useState(() => {
    if (ciclo) {
      setForm({
        titulo: ciclo.titulo || '',
        subtitulo: ciclo.subtitulo || '',
        autor_livro: ciclo.autor_livro || '',
        capa_url: ciclo.capa_url || '',
        por_que_este_livro: ciclo.por_que_este_livro || '',
        como_ler: ciclo.como_ler || '',
        manifesto: ciclo.manifesto || '',
        publicado: ciclo.publicado || false,
      });
    }
  });

  const handleSubmit = () => {
    if (!form.titulo.trim()) return;
    onSave({
      ...form,
      ...(ciclo?.id ? { id: ciclo.id } : {}),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{ciclo ? 'Editar Ciclo' : 'Novo Ciclo'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Título do Livro *</Label>
              <Input
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Ex: A Heroína de Mil Faces"
              />
            </div>
            <div className="space-y-2">
              <Label>Autor</Label>
              <Input
                value={form.autor_livro}
                onChange={(e) => setForm({ ...form, autor_livro: e.target.value })}
                placeholder="Ex: Maria Tatar"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Subtítulo</Label>
            <Input
              value={form.subtitulo}
              onChange={(e) => setForm({ ...form, subtitulo: e.target.value })}
              placeholder="Opcional"
            />
          </div>

          <div className="space-y-2">
            <Label>URL da Capa do Livro</Label>
            <Input
              value={form.capa_url}
              onChange={(e) => setForm({ ...form, capa_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label>Por que este livro está aqui</Label>
            <Textarea
              value={form.por_que_este_livro}
              onChange={(e) => setForm({ ...form, por_que_este_livro: e.target.value })}
              placeholder="Texto explicando a escolha do livro..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Como ler este livro na Casa Orácula</Label>
            <Textarea
              value={form.como_ler}
              onChange={(e) => setForm({ ...form, como_ler: e.target.value })}
              placeholder="Orientações sobre a leitura..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Manifesto (texto da apresentação)</Label>
            <Textarea
              value={form.manifesto}
              onChange={(e) => setForm({ ...form, manifesto: e.target.value })}
              placeholder="Texto-manifesto sobre o que é o clube..."
              className="min-h-[120px]"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <Switch
                checked={form.publicado}
                onCheckedChange={(checked) => setForm({ ...form, publicado: checked })}
              />
              <Label>Publicado</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !form.titulo.trim()}>
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EscutaDialog({ cicloId, open, onOpenChange }: { cicloId: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    titulo: '',
    tipo: 'audio' as 'audio' | 'texto',
    audio_url: '',
    texto_conteudo: '',
  });

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('clube_livro_escutas').insert({
        ciclo_id: cicloId,
        ...form,
        ordem: 0,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-escutas', cicloId] });
      onOpenChange(false);
      setForm({ titulo: '', tipo: 'audio', audio_url: '', texto_conteudo: '' });
      toast({ title: 'Escuta adicionada' });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Escuta</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Título *</Label>
            <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v as 'audio' | 'texto' })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="audio">Áudio</SelectItem>
                <SelectItem value="texto">Texto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {form.tipo === 'audio' && (
            <div className="space-y-2">
              <Label>URL do Áudio</Label>
              <Input value={form.audio_url} onChange={(e) => setForm({ ...form, audio_url: e.target.value })} />
            </div>
          )}
          {form.tipo === 'texto' && (
            <div className="space-y-2">
              <Label>Conteúdo</Label>
              <Textarea value={form.texto_conteudo} onChange={(e) => setForm({ ...form, texto_conteudo: e.target.value })} className="min-h-[120px]" />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={() => save.mutate()} disabled={save.isPending || !form.titulo.trim()}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EncontroDialog({ cicloId, open, onOpenChange }: { cicloId: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    titulo: '',
    data_encontro: '',
    link_ao_vivo: '',
    replay_url: '',
    orientacao_encontro: '',
  });

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('clube_livro_encontros').insert({
        ciclo_id: cicloId,
        ...form,
        data_encontro: form.data_encontro ? new Date(form.data_encontro).toISOString() : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-encontros', cicloId] });
      onOpenChange(false);
      setForm({ titulo: '', data_encontro: '', link_ao_vivo: '', replay_url: '', orientacao_encontro: '' });
      toast({ title: 'Encontro adicionado' });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Encontro</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Título *</Label>
            <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Data e Hora</Label>
            <Input type="datetime-local" value={form.data_encontro} onChange={(e) => setForm({ ...form, data_encontro: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Link Ao Vivo</Label>
            <Input value={form.link_ao_vivo} onChange={(e) => setForm({ ...form, link_ao_vivo: e.target.value })} placeholder="Ex: https://zoom.us/..." />
          </div>
          <div className="space-y-2">
            <Label>URL do Replay</Label>
            <Input value={form.replay_url} onChange={(e) => setForm({ ...form, replay_url: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Orientação para o Encontro</Label>
            <Textarea value={form.orientacao_encontro} onChange={(e) => setForm({ ...form, orientacao_encontro: e.target.value })} className="min-h-[80px]" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={() => save.mutate()} disabled={save.isPending || !form.titulo.trim()}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AdminClubeLivroTab;
