import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, Save, RefreshCw, CheckCircle, XCircle, Bot, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GlobalSetting {
  id: string;
  chave: string;
  valor: string;
  descricao: string | null;
  ativo: boolean;
}

interface Agente {
  id: string;
  nome: string;
}

interface InteractionLog {
  id: string;
  created_at: string;
  user_id: string;
  agente_id: string | null;
  context_type: string | null;
  input_text: string;
  output_text: string | null;
  modelo_usado: string | null;
  tokens_used: number | null;
  latency_ms: number | null;
  success: boolean | null;
  error_message: string | null;
  agentes?: { nome: string } | null;
}

export function AdminAISettingsTab() {
  const [settings, setSettings] = useState<GlobalSetting[]>([]);
  const [agentes, setAgentes] = useState<Agente[]>([]);
  const [logs, setLogs] = useState<InteractionLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Form state
  const [aiEnabled, setAiEnabled] = useState(true);
  const [globalPrompt, setGlobalPrompt] = useState('');
  const [defaultAgentId, setDefaultAgentId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch global settings
      const { data: settingsData } = await supabase
        .from('ai_global_settings')
        .select('*')
        .order('chave');

      if (settingsData) {
        setSettings(settingsData);
        
        // Parse settings into form state
        const enabledSetting = settingsData.find(s => s.chave === 'ai_enabled');
        const promptSetting = settingsData.find(s => s.chave === 'global_system_prompt');
        const agentSetting = settingsData.find(s => s.chave === 'default_agent_id');
        
        setAiEnabled(enabledSetting?.valor === 'true');
        setGlobalPrompt(promptSetting?.valor || '');
        setDefaultAgentId(agentSetting?.valor || '');
      }

      // Fetch agents for dropdown
      const { data: agentesData } = await supabase
        .from('agentes')
        .select('id, nome')
        .eq('status', 'ativo')
        .order('nome');

      if (agentesData) {
        setAgentes(agentesData);
      }

      // Fetch recent logs
      const { data: logsData } = await supabase
        .from('ai_interaction_logs')
        .select(`
          *,
          agentes (nome)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (logsData) {
        setLogs(logsData);
      }
    } catch (error) {
      console.error('Error fetching AI settings:', error);
      toast({
        title: 'Erro ao carregar configurações',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSetting = async (chave: string, valor: string, descricao?: string) => {
    const existing = settings.find(s => s.chave === chave);
    
    if (existing) {
      const { error } = await supabase
        .from('ai_global_settings')
        .update({ valor, updated_at: new Date().toISOString() })
        .eq('id', existing.id);
      
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('ai_global_settings')
        .insert({ chave, valor, descricao, ativo: true });
      
      if (error) throw error;
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        saveSetting('ai_enabled', String(aiEnabled), 'Habilita/desabilita IA globalmente'),
        saveSetting('global_system_prompt', globalPrompt, 'Prompt de sistema global para todos os agentes'),
        saveSetting('default_agent_id', defaultAgentId, 'ID do agente padrão quando nenhum especificado'),
      ]);

      toast({ title: 'Configurações salvas com sucesso' });
      fetchData();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Erro ao salvar configurações',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate metrics
  const totalLogs = logs.length;
  const successfulLogs = logs.filter(l => l.success).length;
  const avgLatency = logs.filter(l => l.latency_ms).reduce((acc, l) => acc + (l.latency_ms || 0), 0) / (logs.filter(l => l.latency_ms).length || 1);
  const totalTokens = logs.reduce((acc, l) => acc + (l.tokens_used || 0), 0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Configurações Globais de IA
          </CardTitle>
          <CardDescription>
            Defina comportamentos padrão para todos os agentes de IA do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI Enabled Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label className="text-base font-medium">IA Habilitada</Label>
              <p className="text-sm text-muted-foreground">
                Desativar irá pausar todas as interações com IA no sistema
              </p>
            </div>
            <Switch
              checked={aiEnabled}
              onCheckedChange={setAiEnabled}
            />
          </div>

          {/* Default Agent */}
          <div className="space-y-2">
            <Label>Agente Padrão</Label>
            <Select value={defaultAgentId || "none"} onValueChange={(v) => setDefaultAgentId(v === "none" ? "" : v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um agente padrão..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum (usar configurações globais)</SelectItem>
                {agentes.map(a => (
                  <SelectItem key={a.id} value={a.id}>{a.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Usado quando um bloco de chat não especifica um agente
            </p>
          </div>

          {/* Global System Prompt */}
          <div className="space-y-2">
            <Label>Prompt de Sistema Global</Label>
            <Textarea
              value={globalPrompt}
              onChange={e => setGlobalPrompt(e.target.value)}
              placeholder="Você é um assistente ético e responsável..."
              rows={8}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Este prompt é prepended a todos os agentes. Use para definir diretrizes éticas, 
              limites de segurança e comportamento base.
            </p>
          </div>

          <Button onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>

      {/* Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Métricas de Uso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-2xl font-bold">{totalLogs}</div>
              <div className="text-sm text-muted-foreground">Interações (últimas 50)</div>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                {totalLogs > 0 ? Math.round((successfulLogs / totalLogs) * 100) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-2xl font-bold">{Math.round(avgLatency)}ms</div>
              <div className="text-sm text-muted-foreground">Latência Média</div>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-2xl font-bold">{totalTokens.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Tokens Usados</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interaction Logs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Logs de Interação</CardTitle>
            <CardDescription>Últimas 50 interações com agentes de IA</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">Data</TableHead>
                  <TableHead>Agente</TableHead>
                  <TableHead>Contexto</TableHead>
                  <TableHead className="max-w-[200px]">Input</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead className="text-right">Tokens</TableHead>
                  <TableHead className="text-right">Latência</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Nenhuma interação registrada ainda
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell className="text-xs">
                        {format(new Date(log.created_at), "dd/MM HH:mm", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        {log.agentes?.nome || (
                          <span className="text-muted-foreground">Padrão</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {log.context_type ? (
                          <Badge variant="outline">{log.context_type}</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-xs">
                        {log.input_text}
                      </TableCell>
                      <TableCell className="text-xs">
                        {log.modelo_usado || '—'}
                      </TableCell>
                      <TableCell className="text-right text-xs">
                        {log.tokens_used?.toLocaleString() || '—'}
                      </TableCell>
                      <TableCell className="text-right text-xs">
                        {log.latency_ms ? `${log.latency_ms}ms` : '—'}
                      </TableCell>
                      <TableCell className="text-center">
                        {log.success ? (
                          <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-destructive mx-auto" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
