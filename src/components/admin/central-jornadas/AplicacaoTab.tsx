import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { User, Stethoscope, Users, Save, Loader2 } from 'lucide-react';

interface Estacao {
  id: string;
  titulo: string;
  aplicar_mim_instrucao: string | null;
  aplicar_mim_exercicio: string | null;
  aplicar_sessao_pergunta: string | null;
  aplicar_sessao_intervencao: string | null;
  aplicar_sessao_risco: string | null;
  aplicar_grupo_dinamica: string | null;
  aplicar_grupo_regra: string | null;
  aplicar_grupo_risco: string | null;
}

interface Props {
  estacao: Estacao;
}

export function AplicacaoTab({ estacao }: Props) {
  const { toast } = useToast();
  const qc = useQueryClient();

  const [form, setForm] = useState({
    aplicar_mim_instrucao: estacao.aplicar_mim_instrucao || '',
    aplicar_mim_exercicio: estacao.aplicar_mim_exercicio || '',
    aplicar_sessao_pergunta: estacao.aplicar_sessao_pergunta || '',
    aplicar_sessao_intervencao: estacao.aplicar_sessao_intervencao || '',
    aplicar_sessao_risco: estacao.aplicar_sessao_risco || '',
    aplicar_grupo_dinamica: estacao.aplicar_grupo_dinamica || '',
    aplicar_grupo_regra: estacao.aplicar_grupo_regra || '',
    aplicar_grupo_risco: estacao.aplicar_grupo_risco || '',
  });

  useEffect(() => {
    setForm({
      aplicar_mim_instrucao: estacao.aplicar_mim_instrucao || '',
      aplicar_mim_exercicio: estacao.aplicar_mim_exercicio || '',
      aplicar_sessao_pergunta: estacao.aplicar_sessao_pergunta || '',
      aplicar_sessao_intervencao: estacao.aplicar_sessao_intervencao || '',
      aplicar_sessao_risco: estacao.aplicar_sessao_risco || '',
      aplicar_grupo_dinamica: estacao.aplicar_grupo_dinamica || '',
      aplicar_grupo_regra: estacao.aplicar_grupo_regra || '',
      aplicar_grupo_risco: estacao.aplicar_grupo_risco || '',
    });
  }, [estacao]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('clube_estacoes')
        .update({
          aplicar_mim_instrucao: form.aplicar_mim_instrucao || null,
          aplicar_mim_exercicio: form.aplicar_mim_exercicio || null,
          aplicar_sessao_pergunta: form.aplicar_sessao_pergunta || null,
          aplicar_sessao_intervencao: form.aplicar_sessao_intervencao || null,
          aplicar_sessao_risco: form.aplicar_sessao_risco || null,
          aplicar_grupo_dinamica: form.aplicar_grupo_dinamica || null,
          aplicar_grupo_regra: form.aplicar_grupo_regra || null,
          aplicar_grupo_risco: form.aplicar_grupo_risco || null,
        })
        .eq('id', estacao.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-estacao-detail', estacao.id] });
      toast({ title: 'Aplicação salva' });
    },
    onError: (err: Error) => {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    },
  });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Como aplicar o conteúdo desta estação — organizado por contexto
      </p>

      {/* Aplicar em Mim */}
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <div className="p-1.5 rounded bg-primary/10">
              <User className="w-4 h-4 text-primary" />
            </div>
            Aplicar em Mim
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Instrução</label>
            <Textarea
              value={form.aplicar_mim_instrucao}
              onChange={(e) => update('aplicar_mim_instrucao', e.target.value)}
              placeholder="Como a leitora pode aplicar este conteúdo em sua vida pessoal..."
              rows={3}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Exercício</label>
            <Textarea
              value={form.aplicar_mim_exercicio}
              onChange={(e) => update('aplicar_mim_exercicio', e.target.value)}
              placeholder="Exercício prático de integração pessoal..."
              rows={3}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Aplicar em Sessão */}
      <Card className="border-teal-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <div className="p-1.5 rounded bg-teal-500/10">
              <Stethoscope className="w-4 h-4 text-teal-500" />
            </div>
            Aplicar em Sessão
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Pergunta-chave</label>
            <Textarea
              value={form.aplicar_sessao_pergunta}
              onChange={(e) => update('aplicar_sessao_pergunta', e.target.value)}
              placeholder="Pergunta para abrir o campo simbólico em sessão..."
              rows={2}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Intervenção</label>
            <Textarea
              value={form.aplicar_sessao_intervencao}
              onChange={(e) => update('aplicar_sessao_intervencao', e.target.value)}
              placeholder="Intervenção terapêutica sugerida..."
              rows={3}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Risco</label>
            <Textarea
              value={form.aplicar_sessao_risco}
              onChange={(e) => update('aplicar_sessao_risco', e.target.value)}
              placeholder="Riscos de uso inadequado em sessão..."
              rows={2}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Aplicar em Grupo */}
      <Card className="border-purple-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <div className="p-1.5 rounded bg-purple-500/10">
              <Users className="w-4 h-4 text-purple-500" />
            </div>
            Aplicar em Grupo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Dinâmica</label>
            <Textarea
              value={form.aplicar_grupo_dinamica}
              onChange={(e) => update('aplicar_grupo_dinamica', e.target.value)}
              placeholder="Dinâmica de grupo sugerida..."
              rows={3}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Regra</label>
            <Textarea
              value={form.aplicar_grupo_regra}
              onChange={(e) => update('aplicar_grupo_regra', e.target.value)}
              placeholder="Regras de condução do grupo..."
              rows={2}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Risco</label>
            <Textarea
              value={form.aplicar_grupo_risco}
              onChange={(e) => update('aplicar_grupo_risco', e.target.value)}
              placeholder="Riscos de uso inadequado em grupo..."
              rows={2}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={() => saveMutation.mutate()}
        disabled={saveMutation.isPending}
        className="w-full gap-2"
      >
        {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Salvar Aplicação
      </Button>
    </div>
  );
}
