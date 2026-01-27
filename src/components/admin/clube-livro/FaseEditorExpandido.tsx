// ============================================
// ADMIN - Fase Editor Expandido (Clube do Livro)
// ============================================

import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, Plus, Trash2, BookOpen, AlertTriangle, 
  Ban, MessageCircle, Sparkles, X
} from 'lucide-react';

interface FaseEditorProps {
  faseId: string;
  cicloId: string;
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
  numero_semana?: number;
  leitura_orientada?: string;
  alerta_clinico?: string;
  observacao_clinica?: string;
  lista_uso_inadequado?: string[];
  ponte_sala_id?: string;
  ponte_sala_texto?: string;
  texto_fechamento?: string;
}

interface Sala {
  id: string;
  nome_exibicao: string;
}

interface Pergunta {
  id: string;
  fase_id: string;
  texto_pergunta: string;
  ordem: number;
  ativo: boolean;
}

export function FaseEditorExpandido({ faseId, cicloId }: FaseEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [form, setForm] = useState<Partial<Fase>>({});
  const [listaItens, setListaItens] = useState<string[]>([]);
  const [novoItem, setNovoItem] = useState('');
  const [newPergunta, setNewPergunta] = useState('');
  
  // Fetch fase data
  const { data: fase, isLoading: loadingFase } = useQuery({
    queryKey: ['admin-fase-detalhe', faseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_fases')
        .select('*')
        .eq('id', faseId)
        .single();
      if (error) throw error;
      return data as Fase;
    },
  });
  
  // Fetch salas for ponte selector
  const { data: salas } = useQuery({
    queryKey: ['admin-salas-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salas')
        .select('id, nome_exibicao')
        .eq('ativa', true)
        .order('nome_exibicao');
      if (error) throw error;
      return data as Sala[];
    },
  });
  
  // Fetch perguntas
  const { data: perguntas, isLoading: loadingPerguntas } = useQuery({
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
  
  // Update form when fase loads
  useEffect(() => {
    if (fase) {
      setForm({
        titulo: fase.titulo,
        descricao: fase.descricao,
        numero_semana: fase.numero_semana,
        leitura_orientada: fase.leitura_orientada,
        alerta_clinico: fase.alerta_clinico,
        observacao_clinica: fase.observacao_clinica,
        ponte_sala_id: fase.ponte_sala_id,
        ponte_sala_texto: fase.ponte_sala_texto,
        texto_fechamento: fase.texto_fechamento,
      });
      setListaItens(fase.lista_uso_inadequado || []);
    }
  }, [fase]);
  
  // Save fase
  const saveFase = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('clube_livro_fases')
        .update({
          titulo: form.titulo,
          descricao: form.descricao,
          numero_semana: form.numero_semana,
          leitura_orientada: form.leitura_orientada,
          alerta_clinico: form.alerta_clinico,
          observacao_clinica: form.observacao_clinica,
          lista_uso_inadequado: listaItens.length > 0 ? listaItens : null,
          ponte_sala_id: form.ponte_sala_id || null,
          ponte_sala_texto: form.ponte_sala_texto,
          texto_fechamento: form.texto_fechamento,
        })
        .eq('id', faseId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-fases', cicloId] });
      queryClient.invalidateQueries({ queryKey: ['admin-fase-detalhe', faseId] });
      toast({ title: 'Semana salva com sucesso' });
    },
    onError: () => {
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    },
  });
  
  // Add item to lista
  const addItemLista = () => {
    if (!novoItem.trim()) return;
    setListaItens([...listaItens, novoItem.trim()]);
    setNovoItem('');
  };
  
  // Remove item from lista
  const removeItemLista = (index: number) => {
    setListaItens(listaItens.filter((_, i) => i !== index));
  };

  // Add pergunta
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
  
  if (loadingFase) {
    return <div className="animate-pulse h-32 bg-muted rounded" />;
  }

  return (
    <div className="space-y-4 pt-4">
      <Tabs defaultValue="conteudo" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-8">
          <TabsTrigger value="conteudo" className="text-xs">
            <BookOpen className="w-3 h-3 mr-1" />
            Conteúdo
          </TabsTrigger>
          <TabsTrigger value="clinico" className="text-xs">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Clínico
          </TabsTrigger>
          <TabsTrigger value="perguntas" className="text-xs">
            <MessageCircle className="w-3 h-3 mr-1" />
            Perguntas
          </TabsTrigger>
        </TabsList>
        
        {/* Tab: Conteúdo */}
        <TabsContent value="conteudo" className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Título</Label>
              <Input
                value={form.titulo || ''}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Ex: O Arquétipo Não É a Cliente"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Nº Semana</Label>
              <Input
                type="number"
                min={0}
                max={4}
                value={form.numero_semana ?? ''}
                onChange={(e) => setForm({ ...form, numero_semana: parseInt(e.target.value) || undefined })}
                placeholder="1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs">Descrição</Label>
            <Textarea
              value={form.descricao || ''}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              placeholder="Breve descrição da semana..."
              className="min-h-[60px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs flex items-center gap-2">
              <BookOpen className="w-3 h-3 text-gold" />
              Leitura Orientada
            </Label>
            <Textarea
              value={form.leitura_orientada || ''}
              onChange={(e) => setForm({ ...form, leitura_orientada: e.target.value })}
              placeholder="Ex: Introdução + Capítulo: La Loba"
              className="min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs">Texto de Fechamento</Label>
            <Textarea
              value={form.texto_fechamento || ''}
              onChange={(e) => setForm({ ...form, texto_fechamento: e.target.value })}
              placeholder="Bloco de fechamento da semana..."
              className="min-h-[60px]"
            />
          </div>
          
          {/* Ponte com Sala */}
          <div className="p-3 border rounded-lg bg-muted/30 space-y-3">
            <Label className="text-xs flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-gold" />
              Ponte com outra Sala
            </Label>
            
            <Select
              value={form.ponte_sala_id || 'none'}
              onValueChange={(v) => setForm({ ...form, ponte_sala_id: v === 'none' ? undefined : v })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Selecione uma Sala" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhuma</SelectItem>
                {salas?.map((sala) => (
                  <SelectItem key={sala.id} value={sala.id}>
                    {sala.nome_exibicao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {form.ponte_sala_id && (
              <Textarea
                value={form.ponte_sala_texto || ''}
                onChange={(e) => setForm({ ...form, ponte_sala_texto: e.target.value })}
                placeholder="Texto explicativo da ponte... Ex: Se esta leitura ativar excesso de identificação, pause."
                className="min-h-[60px] text-xs"
              />
            )}
          </div>
        </TabsContent>
        
        {/* Tab: Clínico */}
        <TabsContent value="clinico" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label className="text-xs flex items-center gap-2">
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              Alerta Clínico
            </Label>
            <Textarea
              value={form.alerta_clinico || ''}
              onChange={(e) => setForm({ ...form, alerta_clinico: e.target.value })}
              placeholder='Ex: Nunca diga à cliente: "Você é a mulher selvagem." O arquétipo é campo, não rótulo.'
              className="min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs flex items-center gap-2">
              <MessageCircle className="w-3 h-3" />
              Observação Clínica
            </Label>
            <Textarea
              value={form.observacao_clinica || ''}
              onChange={(e) => setForm({ ...form, observacao_clinica: e.target.value })}
              placeholder="Observação clínica expandida..."
              className="min-h-[80px]"
            />
          </div>
          
          {/* Lista de Uso Inadequado */}
          <div className="space-y-2">
            <Label className="text-xs flex items-center gap-2">
              <Ban className="w-3 h-3 text-red-500" />
              Lista de Uso Inadequado
            </Label>
            
            {listaItens.length > 0 && (
              <div className="space-y-1">
                {listaItens.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs bg-red-500/5 p-2 rounded">
                    <Ban className="w-3 h-3 text-red-400 shrink-0" />
                    <span className="flex-1">{item}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeItemLista(i)}
                      className="h-5 w-5 p-0 text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-2">
              <Input
                value={novoItem}
                onChange={(e) => setNovoItem(e.target.value)}
                placeholder="Ex: cliente dissociada"
                className="text-xs h-8"
                onKeyDown={(e) => e.key === 'Enter' && addItemLista()}
              />
              <Button size="sm" variant="outline" onClick={addItemLista} className="h-8">
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </TabsContent>
        
        {/* Tab: Perguntas */}
        <TabsContent value="perguntas" className="space-y-4 pt-4">
          <Label className="text-xs text-muted-foreground">Perguntas-Guia (Oraculares)</Label>

          {loadingPerguntas ? (
            <div className="animate-pulse h-8 bg-muted/50 rounded" />
          ) : perguntas && perguntas.length > 0 ? (
            <div className="space-y-2">
              {perguntas.map((p, i) => (
                <div key={p.id} className="flex items-start gap-2 text-sm bg-muted/30 p-2 rounded">
                  <span className="text-xs text-muted-foreground pt-0.5">{i + 1}.</span>
                  <span className="flex-1">{p.texto_pergunta}</span>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => deletePergunta.mutate(p.id)} 
                    className="h-6 w-6 p-0 text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Nenhuma pergunta cadastrada.</p>
          )}

          <div className="flex gap-2">
            <Textarea
              placeholder="Nova pergunta oracular... Ex: Onde eu costumo confundir símbolo com identidade?"
              value={newPergunta}
              onChange={(e) => setNewPergunta(e.target.value)}
              className="min-h-[60px] text-sm"
            />
            <Button 
              size="sm" 
              onClick={() => addPergunta.mutate()} 
              disabled={addPergunta.isPending || !newPergunta.trim()}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Save Button */}
      <div className="pt-2 border-t">
        <Button 
          size="sm" 
          onClick={() => saveFase.mutate()} 
          disabled={saveFase.isPending}
          className="w-full"
        >
          <Save className="w-3 h-3 mr-2" />
          Salvar Semana
        </Button>
      </div>
    </div>
  );
}
