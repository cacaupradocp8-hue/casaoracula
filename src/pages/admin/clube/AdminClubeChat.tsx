// import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare, Info, Plus, Trash2, Save, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function AdminClubeChat() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCiclo, setSelectedCiclo] = useState<string | null>(null);
  const [chatPrompt, setChatPrompt] = useState('');
  const [chatKnowledge, setChatKnowledge] = useState('');

  const { data: ciclos } = useQuery({
    queryKey: ['admin-clube-ciclos-chat'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_ciclos')
        .select('id, titulo, chat_prompt, chat_knowledge_base')
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (selectedCiclo && ciclos) {
      const ciclo = ciclos.find(c => c.id === selectedCiclo);
      if (ciclo) {
        setChatPrompt(ciclo.chat_prompt || '');
        setChatKnowledge(ciclo.chat_knowledge_base || '');
      }
    }
  }, [selectedCiclo, ciclos]);

  const saveConfigMutation = useMutation({
    mutationFn: async () => {
      if (!selectedCiclo) return;
      const { error } = await supabase
        .from('clube_livro_ciclos')
        .update({
          chat_prompt: chatPrompt,
          chat_knowledge_base: chatKnowledge,
        })
        .eq('id', selectedCiclo);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-ciclos-chat'] });
      toast({
        title: "Configurações salvas",
        description: "A base de conhecimento e o prompt foram atualizados com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const { data: perguntas, isLoading } = useQuery({
    queryKey: ['admin-chat-perguntas', selectedCiclo],
    queryFn: async () => {
      if (!selectedCiclo) return [];
      const { data: phases } = await supabase
        .from('clube_livro_fases')
        .select('id')
        .eq('ciclo_id', selectedCiclo);
      
      if (!phases || phases.length === 0) return [];
      
      const { data, error } = await supabase
        .from('clube_livro_perguntas')
        .select('*')
        .in('fase_id', phases.map(p => p.id))
        .order('ordem', { ascending: true });
        
      if (error) throw error;
      return data;
    },
    enabled: !!selectedCiclo,
  });

  return (
    <div className="animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => {
            if ((window as any).Admin_SetActiveTab) {
              (window as any).Admin_SetActiveTab('clube');
            }
            navigate('/admin/clube');
          }}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0">
             <h2 className="text-xl font-serif text-foreground">Converse com o Livro</h2>
             <p className="text-sm text-muted-foreground">Configuração da inteligência oracular e perguntas guiadas</p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card className="border-gold/20">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Selecione o Ciclo/Estação</CardTitle>
              <CardDescription>O chat é alimentado por perguntas estruturadas por fase.</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedCiclo || ''} onValueChange={setSelectedCiclo}>
                <SelectTrigger className="w-full sm:w-[300px]">
                  <SelectValue placeholder="Escolha um ciclo..." />
                </SelectTrigger>
                <SelectContent>
                  {ciclos?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedCiclo ? (
             <div className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-md">Perguntas Guiadas</CardTitle>
                      <CardDescription>Perguntas que a IA usará para guiar a aluna.</CardDescription>
                    </div>
                    <Button size="sm" className="gap-2">
                      <Plus className="w-4 h-4" /> Adicionar Pergunta
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="py-8 text-center">Carregando...</div>
                    ) : perguntas && perguntas.length > 0 ? (
                      <div className="space-y-4">
                        {perguntas.map((p) => (
                          <div key={p.id} className="flex items-start gap-4 p-4 bg-muted/20 rounded-lg border">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{p.texto_pergunta}</p>
                              <p className="text-xs text-muted-foreground mt-1">Ordem: {p.ordem}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        Nenhuma pergunta cadastrada para este ciclo.
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-md">Base de Conhecimento (IA)</CardTitle>
                    <CardDescription>Instruções específicas para o comportamento da IA neste livro.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Prompt de Personalidade</label>
                      <Textarea 
                        placeholder="Como a IA deve se portar ao falar deste livro..." 
                        className="min-h-[100px]"
                        value={chatPrompt}
                        onChange={(e) => setChatPrompt(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Base de Conhecimento (Contexto)</label>
                      <Textarea 
                        placeholder="Informações relevantes do livro que a IA deve conhecer..." 
                        className="min-h-[150px]"
                        value={chatKnowledge}
                        onChange={(e) => setChatKnowledge(e.target.value)}
                      />
                    </div>
                    <Button 
                      className="w-full gap-2" 
                      onClick={() => saveConfigMutation.mutate()}
                      disabled={saveConfigMutation.isPending}
                    >
                      {saveConfigMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Salvar Instruções da IA
                    </Button>
                  </CardContent>
                </Card>
             </div>
          ) : (
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Info className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
                <p className="text-sm text-muted-foreground max-w-xs">
                  Selecione um ciclo acima para começar a configurar a base de conhecimento do Chat.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
