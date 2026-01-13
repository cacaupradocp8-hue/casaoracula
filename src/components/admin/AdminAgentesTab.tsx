import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Loader2, Bot, Settings2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { agenteSchema, getValidationError } from '@/lib/validations';

type AgenteStatus = 'ativo' | 'inativo';
type PortalType = 'visitante' | 'pre_iniciada' | 'iniciada' | 'admin';
type BlockContextType = 'quiz_result' | 'portal' | 'ritual' | 'sala' | 'tool' | 'formation' | 'landing';

interface Agente {
  id: string;
  nome: string;
  descricao: string;
  instrucoes_base: string;
  status: AgenteStatus;
  portal_minimo: PortalType;
  prompt_personalidade: string | null;
  contextos_permitidos: BlockContextType[] | null;
  modelo_preferido: string | null;
  temperatura: number | null;
  max_tokens: number | null;
}

interface FormState {
  nome: string;
  descricao: string;
  instrucoes_base: string;
  status: AgenteStatus;
  portal_minimo: PortalType;
  prompt_personalidade: string;
  contextos_permitidos: BlockContextType[];
  modelo_preferido: string;
  temperatura: number;
  max_tokens: number;
}

const AI_MODELS = [
  { value: 'google/gemini-2.5-flash', label: 'Gemini 2.5 Flash (Rápido)' },
  { value: 'google/gemini-2.5-pro', label: 'Gemini 2.5 Pro (Avançado)' },
  { value: 'google/gemini-3-flash-preview', label: 'Gemini 3 Flash Preview' },
  { value: 'openai/gpt-5-mini', label: 'GPT-5 Mini' },
  { value: 'openai/gpt-5', label: 'GPT-5 (Premium)' },
];

const CONTEXT_OPTIONS: { value: BlockContextType; label: string }[] = [
  { value: 'quiz_result', label: 'Resultado de Quiz' },
  { value: 'portal', label: 'Portal/Travessia' },
  { value: 'ritual', label: 'Ritual' },
  { value: 'sala', label: 'Sala' },
  { value: 'tool', label: 'Ferramenta' },
  { value: 'formation', label: 'Formação' },
  { value: 'landing', label: 'Landing Page' },
];

export function AdminAgentesTab() {
  const [agentes, setAgentes] = useState<Agente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Agente | null>(null);
  const [form, setForm] = useState<FormState>({
    nome: '',
    descricao: '',
    instrucoes_base: '',
    status: 'ativo',
    portal_minimo: 'pre_iniciada',
    prompt_personalidade: '',
    contextos_permitidos: [],
    modelo_preferido: 'google/gemini-2.5-flash',
    temperatura: 0.7,
    max_tokens: 1024,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAgentes();
  }, []);

  const fetchAgentes = async () => {
    const { data } = await supabase.from('agentes').select('*').order('nome');
    setAgentes((data || []) as Agente[]);
    setIsLoading(false);
  };

  const openDialog = (a?: Agente) => {
    if (a) {
      setEditing(a);
      setForm({
        nome: a.nome,
        descricao: a.descricao,
        instrucoes_base: a.instrucoes_base,
        status: a.status,
        portal_minimo: a.portal_minimo,
        prompt_personalidade: a.prompt_personalidade || '',
        contextos_permitidos: (a.contextos_permitidos || []) as BlockContextType[],
        modelo_preferido: a.modelo_preferido || 'google/gemini-2.5-flash',
        temperatura: a.temperatura ?? 0.7,
        max_tokens: a.max_tokens ?? 1024,
      });
    } else {
      setEditing(null);
      setForm({
        nome: '',
        descricao: '',
        instrucoes_base: '',
        status: 'ativo',
        portal_minimo: 'pre_iniciada',
        prompt_personalidade: '',
        contextos_permitidos: [],
        modelo_preferido: 'google/gemini-2.5-flash',
        temperatura: 0.7,
        max_tokens: 1024,
      });
    }
    setDialogOpen(true);
  };

  const save = async () => {
    const validation = agenteSchema.safeParse(form);
    const error = getValidationError(validation);
    if (error) {
      toast({ title: 'Erro de validação', description: error, variant: 'destructive' });
      return;
    }

    const payload = {
      nome: form.nome,
      descricao: form.descricao,
      instrucoes_base: form.instrucoes_base,
      status: form.status,
      portal_minimo: form.portal_minimo,
      prompt_personalidade: form.prompt_personalidade || null,
      contextos_permitidos: form.contextos_permitidos.length > 0 ? form.contextos_permitidos : null,
      modelo_preferido: form.modelo_preferido || null,
      temperatura: form.temperatura,
      max_tokens: form.max_tokens,
    };

    const { error: dbError } = editing
      ? await supabase.from('agentes').update(payload).eq('id', editing.id)
      : await supabase.from('agentes').insert(payload);

    if (dbError) {
      toast({ title: 'Erro ao salvar', description: dbError.message, variant: 'destructive' });
      return;
    }

    toast({ title: 'Salvo!' });
    setDialogOpen(false);
    fetchAgentes();
  };

  const remove = async (id: string) => {
    await supabase.from('agentes').delete().eq('id', id);
    toast({ title: 'Excluído!' });
    fetchAgentes();
  };

  const toggleContext = (ctx: BlockContextType) => {
    setForm((prev) => ({
      ...prev,
      contextos_permitidos: prev.contextos_permitidos.includes(ctx)
        ? prev.contextos_permitidos.filter((c) => c !== ctx)
        : [...prev.contextos_permitidos, ctx],
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => openDialog()} variant="gold">
          <Plus className="w-4 h-4 mr-2" /> Novo Agente
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {agentes.map((a) => (
          <Card key={a.id} className="glass">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <CardTitle className="text-lg">{a.nome}</CardTitle>
                  <div className="flex gap-1 mt-1">
                    <Badge variant={a.status === 'ativo' ? 'default' : 'secondary'}>{a.status}</Badge>
                    {a.modelo_preferido && (
                      <Badge variant="outline" className="text-xs">
                        {a.modelo_preferido.split('/')[1]}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => openDialog(a)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir agente?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => remove(a.id)}>Excluir</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{a.descricao}</p>
              {a.contextos_permitidos && a.contextos_permitidos.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {a.contextos_permitidos.map((ctx) => (
                    <Badge key={ctx} variant="secondary" className="text-xs">
                      {ctx}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Agente' : 'Novo Agente'}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Básico</TabsTrigger>
              <TabsTrigger value="advanced" className="gap-2">
                <Settings2 className="w-4 h-4" />
                Avançado
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div>
                <Label>Nome</Label>
                <Input value={form.nome} onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))} />
              </div>

              <div>
                <Label>Descrição</Label>
                <Textarea value={form.descricao} onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value }))} rows={2} />
              </div>

              <div>
                <Label>Instruções Base (System Prompt)</Label>
                <Textarea
                  value={form.instrucoes_base}
                  onChange={(e) => setForm((p) => ({ ...p, instrucoes_base: e.target.value }))}
                  rows={4}
                  placeholder="Defina o comportamento base do agente..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as AgenteStatus }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Portal Mínimo</Label>
                  <Select value={form.portal_minimo} onValueChange={(v) => setForm((p) => ({ ...p, portal_minimo: v as PortalType }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visitante">Visitante</SelectItem>
                      <SelectItem value="pre_iniciada">Pré-Iniciada</SelectItem>
                      <SelectItem value="iniciada">Iniciada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 mt-4">
              <div>
                <Label>Prompt de Personalidade</Label>
                <Textarea
                  value={form.prompt_personalidade}
                  onChange={(e) => setForm((p) => ({ ...p, prompt_personalidade: e.target.value }))}
                  rows={3}
                  placeholder="Adicione traços de personalidade, tom de voz, estilo de comunicação..."
                />
                <p className="text-xs text-muted-foreground mt-1">Define o tom e estilo das respostas</p>
              </div>

              <div>
                <Label>Modelo de IA</Label>
                <Select value={form.modelo_preferido} onValueChange={(v) => setForm((p) => ({ ...p, modelo_preferido: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AI_MODELS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Temperatura: {form.temperatura.toFixed(2)}</Label>
                <Slider
                  value={[form.temperatura]}
                  onValueChange={([v]) => setForm((p) => ({ ...p, temperatura: v }))}
                  min={0}
                  max={1}
                  step={0.05}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">0 = Mais preciso | 1 = Mais criativo</p>
              </div>

              <div>
                <Label>Max Tokens</Label>
                <Input
                  type="number"
                  value={form.max_tokens}
                  onChange={(e) => setForm((p) => ({ ...p, max_tokens: parseInt(e.target.value) || 1024 }))}
                  min={256}
                  max={8192}
                />
                <p className="text-xs text-muted-foreground mt-1">Limite de tokens por resposta (256-8192)</p>
              </div>

              <div>
                <Label>Contextos Permitidos</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {CONTEXT_OPTIONS.map((opt) => (
                    <Badge
                      key={opt.value}
                      variant={form.contextos_permitidos.includes(opt.value) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleContext(opt.value)}
                    >
                      {opt.label}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Onde este agente pode ser usado</p>
              </div>
            </TabsContent>
          </Tabs>

          <Button onClick={save} variant="gold" className="w-full mt-4">
            Salvar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
