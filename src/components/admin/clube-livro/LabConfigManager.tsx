import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Target, Loader2, Search, Brain, Sparkles, Link2, AlertCircle } from 'lucide-react';

interface LabConfigManagerProps {
  cicloId: string;
}

export function LabConfigManager({ cicloId }: LabConfigManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 1. Find the season linked to this ciclo via season_books table
  const { data: seasonLink, isLoading: linkLoading } = useQuery({
    queryKey: ['admin-season-link-for-ciclo', cicloId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('season_books')
        .select('season_id')
        .eq('book_id', cicloId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: season, isLoading: seasonLoading } = useQuery({
    queryKey: ['admin-season-detail', seasonLink?.season_id],
    queryFn: async () => {
      if (!seasonLink?.season_id) return null;
      const { data, error } = await supabase
        .from('oracular_seasons')
        .select('id, nome_estacao, simbolo, periodo, status')
        .eq('id', seasonLink.season_id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!seasonLink?.season_id,
  });

  // 2. Load season_labs config
  const { data: labConfig, isLoading: configLoading } = useQuery({
    queryKey: ['admin-season-lab', season?.id],
    queryFn: async () => {
      if (!season?.id) return null;
      const { data, error } = await supabase
        .from('season_labs')
        .select('*')
        .eq('season_id', season.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!season?.id,
  });

  const [form, setForm] = useState({
    // Bloco 1
    arquetipo_central: '',
    nucleo_vivo: '',
    tensao_central: '',
    imagem_organizadora: '',
    essencia_transformadora: '',
    transformacao_exigida: '',
    // Bloco 2 - Aula
    traducao_aula: '',
    aula_objetivo: '',
    aula_vivencia: '',
    aula_pergunta_fechamento: '',
    // Bloco 2 - Sessão
    traducao_sessao: '',
    sessao_tema: '',
    sessao_pergunta_acesso: '',
    sessao_cuidado_etico: '',
    sessao_resistencia: '',
    // Bloco 2 - Palestra
    traducao_circulo: '',
    palestra_imagem: '',
    palestra_narrativa: '',
    palestra_chamada: '',
    palestra_encerramento: '',
    // Perguntas
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
      if (!season?.id) throw new Error('Estação não vinculada');

      const payload = { ...form, season_id: season.id };

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
      queryClient.invalidateQueries({ queryKey: ['admin-season-lab', season?.id] });
      toast({ title: 'Configuração do Lab 80/20 salva' });
    },
    onError: () => {
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    },
  });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  if (linkLoading || seasonLoading || configLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!season) {
    return (
      <Card className="border-dashed border-destructive/30 bg-destructive/5">
        <CardContent className="py-6 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
          <div>
            <p className="text-sm font-medium text-foreground">Estação Oracular não vinculada</p>
            <p className="text-xs text-muted-foreground mt-1">
              Para configurar o Lab 80/20, este ciclo precisa estar vinculado a uma Estação Oracular.
              Crie a estação com o mesmo título do livro no menu "Conteúdo".
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Season link info */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
        <Link2 className="w-3.5 h-3.5" />
        <span>Vinculado à estação:</span>
        <Badge variant="outline" className="text-xs">{season.simbolo} {season.nome_estacao}</Badge>
        <Badge variant="outline" className="text-xs">{season.status}</Badge>
      </div>

      {/* Bloco 1 — Essência Simbólica */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Search className="w-4 h-4 text-gold" />
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
            <Brain className="w-4 h-4 text-gold" />
            Bloco 2 — Tradução Profissional
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Aula */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Seção Aula</p>
            <Field label="Conceito-Matriz" value={form.traducao_aula} onChange={v => update('traducao_aula', v)} />
            <Field label="Objetivo Pedagógico" value={form.aula_objetivo} onChange={v => update('aula_objetivo', v)} />
            <Field label="Vivência Sugerida" value={form.aula_vivencia} onChange={v => update('aula_vivencia', v)} />
            <Field label="Pergunta de Fechamento" value={form.aula_pergunta_fechamento} onChange={v => update('aula_pergunta_fechamento', v)} />
          </div>

          <Separator />

          {/* Sessão */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Seção Sessão</p>
            <Field label="Tema Recorrente" value={form.sessao_tema} onChange={v => update('sessao_tema', v)} />
            <Field label="Pergunta de Acesso" value={form.sessao_pergunta_acesso} onChange={v => update('sessao_pergunta_acesso', v)} />
            <Field label="Cuidado Ético" value={form.sessao_cuidado_etico} onChange={v => update('sessao_cuidado_etico', v)} />
            <Field label="Resistência Comum" value={form.sessao_resistencia} onChange={v => update('sessao_resistencia', v)} />
          </div>

          <Separator />

          {/* Palestra */}
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
            <Sparkles className="w-4 h-4 text-gold" />
            Perguntas de Aplicação (Legacy)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Field label="Pergunta 1" value={form.pergunta_aplicacao_1} onChange={v => update('pergunta_aplicacao_1', v)} />
          <Field label="Pergunta 2" value={form.pergunta_aplicacao_2} onChange={v => update('pergunta_aplicacao_2', v)} />
        </CardContent>
      </Card>

      {/* Save */}
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
