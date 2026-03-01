import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, Brain, Sparkles } from 'lucide-react';

interface LabConfigManagerProps {
  cicloId: string;
}

export function LabConfigManager({ cicloId }: LabConfigManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Load lab config directly by ciclo_id
  const { data: labConfig, isLoading } = useQuery({
    queryKey: ['admin-lab-config', cicloId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('season_labs')
        .select('*')
        .eq('ciclo_id', cicloId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const [form, setForm] = useState({
    arquetipo_central: '',
    nucleo_vivo: '',
    tensao_central: '',
    imagem_organizadora: '',
    essencia_transformadora: '',
    transformacao_exigida: '',
    traducao_aula: '',
    aula_objetivo: '',
    aula_vivencia: '',
    aula_pergunta_fechamento: '',
    traducao_sessao: '',
    sessao_tema: '',
    sessao_pergunta_acesso: '',
    sessao_cuidado_etico: '',
    sessao_resistencia: '',
    traducao_circulo: '',
    palestra_imagem: '',
    palestra_narrativa: '',
    palestra_chamada: '',
    palestra_encerramento: '',
    pergunta_aplicacao_1: '',
    pergunta_aplicacao_2: '',
  });

  useEffect(() => {
    if (labConfig) {
      setForm({
        arquetipo_central: labConfig.arquetipo_central || '',
        nucleo_vivo: labConfig.nucleo_vivo || '',
        tensao_central: labConfig.tensao_central || '',
        imagem_organizadora: labConfig.imagem_organizadora || '',
        essencia_transformadora: labConfig.essencia_transformadora || '',
        transformacao_exigida: labConfig.transformacao_exigida || '',
        traducao_aula: labConfig.traducao_aula || '',
        aula_objetivo: labConfig.aula_objetivo || '',
        aula_vivencia: labConfig.aula_vivencia || '',
        aula_pergunta_fechamento: labConfig.aula_pergunta_fechamento || '',
        traducao_sessao: labConfig.traducao_sessao || '',
        sessao_tema: labConfig.sessao_tema || '',
        sessao_pergunta_acesso: labConfig.sessao_pergunta_acesso || '',
        sessao_cuidado_etico: labConfig.sessao_cuidado_etico || '',
        sessao_resistencia: labConfig.sessao_resistencia || '',
        traducao_circulo: labConfig.traducao_circulo || '',
        palestra_imagem: labConfig.palestra_imagem || '',
        palestra_narrativa: labConfig.palestra_narrativa || '',
        palestra_chamada: labConfig.palestra_chamada || '',
        palestra_encerramento: labConfig.palestra_encerramento || '',
        pergunta_aplicacao_1: labConfig.pergunta_aplicacao_1 || '',
        pergunta_aplicacao_2: labConfig.pergunta_aplicacao_2 || '',
      });
    }
  }, [labConfig]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { ...form, ciclo_id: cicloId };

      if (labConfig?.id) {
        const { error } = await supabase
          .from('season_labs')
          .update(payload)
          .eq('id', labConfig.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('season_labs')
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lab-config', cicloId] });
      toast({ title: 'Configuração do Lab 80/20 salva' });
    },
    onError: () => {
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    },
  });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bloco 1 — Essência Simbólica */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Search className="w-4 h-4 text-primary" />
            Bloco 1 — Essência Simbólica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Field label="Arquétipo Central" value={form.arquetipo_central} onChange={v => update('arquetipo_central', v)} placeholder="Ex: A Mulher Selvagem" />
          <Field label="Núcleo Vivo" value={form.nucleo_vivo} onChange={v => update('nucleo_vivo', v)} />
          <Field label="Tensão Psíquica" value={form.tensao_central} onChange={v => update('tensao_central', v)} />
          <Field label="Imagem Organizadora" value={form.imagem_organizadora} onChange={v => update('imagem_organizadora', v)} />
          <Field label="Essência Transformadora" value={form.essencia_transformadora} onChange={v => update('essencia_transformadora', v)} />
          <Field label="Transformação Exigida" value={form.transformacao_exigida} onChange={v => update('transformacao_exigida', v)} />
        </CardContent>
      </Card>

      {/* Bloco 2 — Tradução Profissional */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Brain className="w-4 h-4 text-primary" />
            Bloco 2 — Tradução Profissional
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Seção Aula</p>
            <Field label="Conceito-Matriz" value={form.traducao_aula} onChange={v => update('traducao_aula', v)} />
            <Field label="Objetivo Pedagógico" value={form.aula_objetivo} onChange={v => update('aula_objetivo', v)} />
            <Field label="Vivência Sugerida" value={form.aula_vivencia} onChange={v => update('aula_vivencia', v)} />
            <Field label="Pergunta de Fechamento" value={form.aula_pergunta_fechamento} onChange={v => update('aula_pergunta_fechamento', v)} />
          </div>
          <Separator />
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Seção Sessão</p>
            <Field label="Tema Recorrente" value={form.sessao_tema} onChange={v => update('sessao_tema', v)} />
            <Field label="Pergunta de Acesso" value={form.sessao_pergunta_acesso} onChange={v => update('sessao_pergunta_acesso', v)} />
            <Field label="Cuidado Ético" value={form.sessao_cuidado_etico} onChange={v => update('sessao_cuidado_etico', v)} />
            <Field label="Resistência Comum" value={form.sessao_resistencia} onChange={v => update('sessao_resistencia', v)} />
          </div>
          <Separator />
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Seção Palestra / Círculo</p>
            <Field label="Imagem de Abertura" value={form.palestra_imagem} onChange={v => update('palestra_imagem', v)} />
            <Field label="Narrativa Simbólica" value={form.palestra_narrativa} onChange={v => update('palestra_narrativa', v)} />
            <Field label="Chamada para Ação" value={form.palestra_chamada} onChange={v => update('palestra_chamada', v)} />
            <Field label="Encerramento Ritual" value={form.palestra_encerramento} onChange={v => update('palestra_encerramento', v)} />
          </div>
        </CardContent>
      </Card>

      {/* Perguntas de Aplicação */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            Perguntas de Aplicação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Field label="Pergunta 1" value={form.pergunta_aplicacao_1} onChange={v => update('pergunta_aplicacao_1', v)} />
          <Field label="Pergunta 2" value={form.pergunta_aplicacao_2} onChange={v => update('pergunta_aplicacao_2', v)} />
        </CardContent>
      </Card>

      <Button
        onClick={() => saveMutation.mutate()}
        disabled={saveMutation.isPending}
        className="w-full"
      >
        {saveMutation.isPending ? (
          <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Salvando...</>
        ) : (
          'Salvar Configuração do Lab 80/20'
        )}
      </Button>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <Textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || `${label}...`}
        className="min-h-[60px] text-sm resize-none"
      />
    </div>
  );
}
