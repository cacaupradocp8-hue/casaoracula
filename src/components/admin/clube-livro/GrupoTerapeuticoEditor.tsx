import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Users, AlertTriangle, Eye, Clock, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EtapaEncontro {
  duracao: string;
  objetivo: string;
  orientacao: string;
}

interface GrupoTerapeutico {
  intencao_encontro: string;
  campo_psiquico_ativado: string;
  estrutura_encontro: {
    abertura: EtapaEncontro;
    ativacao: EtapaEncontro;
    compartilhamento: EtapaEncontro;
    aprofundamento: EtapaEncontro;
    integracao: EtapaEncontro;
    fechamento: EtapaEncontro;
  };
  perguntas_conducao: string[];
  dinamica_principal: { nome: string; descricao: string; instrucoes: string };
  variacoes_grupo: { pequeno: string; medio: string; grande: string };
  alerta_grupo: string[];
  sinais_campo: string[];
  erros_comuns: string[];
}

const ETAPAS_LABELS: Record<string, string> = {
  abertura: 'Abertura',
  ativacao: 'Ativação',
  compartilhamento: 'Compartilhamento',
  aprofundamento: 'Aprofundamento',
  integracao: 'Integração',
  fechamento: 'Fechamento',
};

const ETAPAS_DURACAO: Record<string, string> = {
  abertura: '10–15 min',
  ativacao: '20 min',
  compartilhamento: '30–40 min',
  aprofundamento: '20–30 min',
  integracao: '15–20 min',
  fechamento: '5–10 min',
};

interface Props {
  labId: string | undefined;
  grupoData: GrupoTerapeutico | null;
  livroTitulo?: string;
  livroAutor?: string;
  temaSimbólico?: string;
  essenciaLab?: string;
  onSaved: () => void;
}

function emptyGrupo(): GrupoTerapeutico {
  return {
    intencao_encontro: '',
    campo_psiquico_ativado: '',
    estrutura_encontro: {
      abertura: { duracao: '10–15 min', objetivo: '', orientacao: '' },
      ativacao: { duracao: '20 min', objetivo: '', orientacao: '' },
      compartilhamento: { duracao: '30–40 min', objetivo: '', orientacao: '' },
      aprofundamento: { duracao: '20–30 min', objetivo: '', orientacao: '' },
      integracao: { duracao: '15–20 min', objetivo: '', orientacao: '' },
      fechamento: { duracao: '5–10 min', objetivo: '', orientacao: '' },
    },
    perguntas_conducao: ['', '', ''],
    dinamica_principal: { nome: '', descricao: '', instrucoes: '' },
    variacoes_grupo: { pequeno: '', medio: '', grande: '' },
    alerta_grupo: [''],
    sinais_campo: [''],
    erros_comuns: [''],
  };
}

export function GrupoTerapeuticoEditor({
  labId,
  grupoData,
  livroTitulo,
  livroAutor,
  temaSimbólico,
  essenciaLab,
  onSaved,
}: Props) {
  const [form, setForm] = useState<GrupoTerapeutico>(grupoData || emptyGrupo());
  const [gerando, setGerando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const gerarComIA = async () => {
    if (!labId || !livroTitulo) {
      toast.error('Selecione um ciclo com livro vinculado.');
      return;
    }
    setGerando(true);
    try {
      const { data, error } = await supabase.functions.invoke('gerar-grupo-terapeutico', {
        body: {
          lab_id: labId,
          livro_titulo: livroTitulo,
          livro_autor: livroAutor,
          tema_simbolico: temaSimbólico,
          essencia_lab: essenciaLab,
        },
      });
      if (error) throw error;
      if (data?.grupo_terapeutico) {
        setForm(data.grupo_terapeutico);
        toast.success('Roteiro do grupo gerado com sucesso!');
        onSaved();
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Erro ao gerar roteiro.');
    } finally {
      setGerando(false);
    }
  };

  const salvarManual = async () => {
    if (!labId) return;
    setSalvando(true);
    try {
      const { error } = await supabase
        .from('season_labs')
        .update({ grupo_terapeutico: form as any, updated_at: new Date().toISOString() })
        .eq('id', labId);
      if (error) throw error;
      toast.success('Roteiro salvo.');
      onSaved();
    } catch {
      toast.error('Erro ao salvar.');
    } finally {
      setSalvando(false);
    }
  };

  const updateEtapa = (key: string, field: keyof EtapaEncontro, value: string) => {
    setForm(prev => ({
      ...prev,
      estrutura_encontro: {
        ...prev.estrutura_encontro,
        [key]: { ...prev.estrutura_encontro[key as keyof typeof prev.estrutura_encontro], [field]: value },
      },
    }));
  };

  const updateListItem = (listKey: 'perguntas_conducao' | 'alerta_grupo' | 'sinais_campo' | 'erros_comuns', idx: number, value: string) => {
    setForm(prev => {
      const arr = [...prev[listKey]];
      arr[idx] = value;
      return { ...prev, [listKey]: arr };
    });
  };

  const addListItem = (listKey: 'perguntas_conducao' | 'alerta_grupo' | 'sinais_campo' | 'erros_comuns') => {
    setForm(prev => ({ ...prev, [listKey]: [...prev[listKey], ''] }));
  };

  const removeListItem = (listKey: 'perguntas_conducao' | 'alerta_grupo' | 'sinais_campo' | 'erros_comuns', idx: number) => {
    setForm(prev => ({ ...prev, [listKey]: prev[listKey].filter((_, i) => i !== idx) }));
  };

  return (
    <div className="space-y-4">
      {/* Header + Generate */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">Grupo Terapêutico</h3>
          {grupoData && <Badge variant="outline" className="text-xs">Preenchido</Badge>}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={gerarComIA}
          disabled={gerando || !labId}
        >
          {gerando ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Sparkles className="w-3.5 h-3.5 mr-1" />}
          {gerando ? 'Gerando...' : 'Gerar com IA'}
        </Button>
      </div>

      {/* 1. Intenção + Campo */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">1. Intenção & Campo Psíquico</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Intenção do Encontro</Label>
            <Textarea value={form.intencao_encontro} onChange={e => setForm(p => ({ ...p, intencao_encontro: e.target.value }))} placeholder="O que esse encontro ativa internamente..." className="min-h-[60px] text-sm resize-none" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Campo Psíquico Ativado</Label>
            <Textarea value={form.campo_psiquico_ativado} onChange={e => setForm(p => ({ ...p, campo_psiquico_ativado: e.target.value }))} placeholder="Qual conflito simbólico está em jogo..." className="min-h-[60px] text-sm resize-none" />
          </div>
        </CardContent>
      </Card>

      {/* 3. Estrutura do Encontro */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-1 text-xs uppercase tracking-wider text-muted-foreground">
            <Clock className="w-3.5 h-3.5" /> 3. Estrutura do Encontro (90–120 min)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(ETAPAS_LABELS).map(([key, label]) => (
            <div key={key} className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold">{label}</p>
                <Badge variant="secondary" className="text-[10px]">{ETAPAS_DURACAO[key]}</Badge>
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">Objetivo</Label>
                <Textarea value={form.estrutura_encontro[key as keyof typeof form.estrutura_encontro]?.objetivo || ''} onChange={e => updateEtapa(key, 'objetivo', e.target.value)} className="min-h-[50px] text-sm resize-none" />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">Orientação para facilitadora</Label>
                <Textarea value={form.estrutura_encontro[key as keyof typeof form.estrutura_encontro]?.orientacao || ''} onChange={e => updateEtapa(key, 'orientacao', e.target.value)} className="min-h-[50px] text-sm resize-none" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 4. Perguntas de Condução */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">4. Perguntas de Condução</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {form.perguntas_conducao.map((p, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-xs text-muted-foreground mt-2 w-4">{i + 1}.</span>
              <Textarea value={p} onChange={e => updateListItem('perguntas_conducao', i, e.target.value)} className="min-h-[40px] text-sm resize-none flex-1" placeholder="Pergunta aberta..." />
              {form.perguntas_conducao.length > 1 && (
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeListItem('perguntas_conducao', i)}><Trash2 className="w-3 h-3" /></Button>
              )}
            </div>
          ))}
          {form.perguntas_conducao.length < 7 && (
            <Button variant="ghost" size="sm" onClick={() => addListItem('perguntas_conducao')}><Plus className="w-3 h-3 mr-1" /> Adicionar</Button>
          )}
        </CardContent>
      </Card>

      {/* 5. Dinâmica Principal */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">5. Dinâmica Principal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Nome</Label>
            <Input value={form.dinamica_principal.nome} onChange={e => setForm(p => ({ ...p, dinamica_principal: { ...p.dinamica_principal, nome: e.target.value } }))} className="text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Descrição</Label>
            <Textarea value={form.dinamica_principal.descricao} onChange={e => setForm(p => ({ ...p, dinamica_principal: { ...p.dinamica_principal, descricao: e.target.value } }))} className="min-h-[50px] text-sm resize-none" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Instruções</Label>
            <Textarea value={form.dinamica_principal.instrucoes} onChange={e => setForm(p => ({ ...p, dinamica_principal: { ...p.dinamica_principal, instrucoes: e.target.value } }))} className="min-h-[60px] text-sm resize-none" />
          </div>
        </CardContent>
      </Card>

      {/* 6. Variações de Grupo */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">6. Variações de Grupo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { key: 'pequeno' as const, label: 'Pequeno (até 6)', icon: '👥' },
            { key: 'medio' as const, label: 'Médio (7–15)', icon: '👥👥' },
            { key: 'grande' as const, label: 'Grande (15+)', icon: '👥👥👥' },
          ].map(v => (
            <div key={v.key} className="space-y-1">
              <Label className="text-xs">{v.icon} {v.label}</Label>
              <Textarea value={form.variacoes_grupo[v.key]} onChange={e => setForm(p => ({ ...p, variacoes_grupo: { ...p.variacoes_grupo, [v.key]: e.target.value } }))} className="min-h-[50px] text-sm resize-none" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 7-9. Alertas, Sinais, Erros */}
      {[
        { key: 'alerta_grupo' as const, title: '7. Alertas para o Grupo', icon: <AlertTriangle className="w-3.5 h-3.5 text-destructive" />, placeholder: 'O que evitar...' },
        { key: 'sinais_campo' as const, title: '8. Sinais de Campo', icon: <Eye className="w-3.5 h-3.5 text-primary" />, placeholder: 'Indicador comportamental...' },
        { key: 'erros_comuns' as const, title: '9. Erros Comuns', icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />, placeholder: 'Falha de condução...' },
      ].map(section => (
        <Card key={section.key}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
              {section.icon} {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {form[section.key].map((item, i) => (
              <div key={i} className="flex gap-2 items-start">
                <Textarea value={item} onChange={e => updateListItem(section.key, i, e.target.value)} className="min-h-[36px] text-sm resize-none flex-1" placeholder={section.placeholder} />
                {form[section.key].length > 1 && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeListItem(section.key, i)}><Trash2 className="w-3 h-3" /></Button>
                )}
              </div>
            ))}
            <Button variant="ghost" size="sm" onClick={() => addListItem(section.key)}><Plus className="w-3 h-3 mr-1" /> Adicionar</Button>
          </CardContent>
        </Card>
      ))}

      {/* Save */}
      <Button onClick={salvarManual} disabled={salvando || !labId} className="w-full">
        {salvando ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Salvando...</> : 'Salvar Roteiro do Grupo'}
      </Button>
    </div>
  );
}
