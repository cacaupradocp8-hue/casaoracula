import { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Compass, Eye, Hammer, User, Stethoscope, Users, Save, Loader2 } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// LaboratorioTab — configuração autoral do Laboratório Oracular
// para uma estação. Reorganiza a antiga aba "Aplicação" em
// 3 sub-blocos alinhados às 3 fases do laboratório:
//   1) Cartografia (sugestões da obra)
//   2) Espelho Clínico (inclui campos legados Mim/Sessão/Grupo
//      como exemplos de manifestação)
//   3) Forja Narrativa (template de plano)
// Persiste em season_labs (config autoral) e mantém compat com
// clube_estacoes para os campos de aplicação legados.
// ─────────────────────────────────────────────────────────────

interface Estacao {
  id: string;
  titulo: string;
  // legado (preservado como exemplos do espelho)
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

  // Carrega config do laboratório (season_labs) ligada à estação
  const { data: lab, isLoading: loadingLab } = useQuery({
    queryKey: ['season-lab-admin', estacao.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('season_labs')
        .select('*')
        .eq('season_id', estacao.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const [labForm, setLabForm] = useState({
    cart_torre_sugerida: '',
    cart_porta_sugerida: '',
    cart_labirinto_sugerido: '',
    cart_distrito_sugerido: '',
    cart_arquetipos_sugeridos: '', // CSV no input
    cart_observacoes_obra: '',
    esp_exemplos_manifestacao: '',
    esp_categorias_padrao: '', // CSV
    esp_riscos_clinicos: '',
    esp_contraindicacoes: '',
    forja_template_objetivo: '',
    forja_template_estrategia: '',
    forja_perguntas_chave: '', // CSV
    forja_intervencao_modelo: '',
    forja_fechamento_sugerido: '',
  });

  const [legacy, setLegacy] = useState({
    aplicar_mim_instrucao: '',
    aplicar_mim_exercicio: '',
    aplicar_sessao_pergunta: '',
    aplicar_sessao_intervencao: '',
    aplicar_sessao_risco: '',
    aplicar_grupo_dinamica: '',
    aplicar_grupo_regra: '',
    aplicar_grupo_risco: '',
  });

  useEffect(() => {
    if (lab) {
      setLabForm({
        cart_torre_sugerida: (lab as any).cart_torre_sugerida || '',
        cart_porta_sugerida: (lab as any).cart_porta_sugerida || '',
        cart_labirinto_sugerido: (lab as any).cart_labirinto_sugerido || '',
        cart_distrito_sugerido: (lab as any).cart_distrito_sugerido || '',
        cart_arquetipos_sugeridos: ((lab as any).cart_arquetipos_sugeridos || []).join(', '),
        cart_observacoes_obra: (lab as any).cart_observacoes_obra || '',
        esp_exemplos_manifestacao: (lab as any).esp_exemplos_manifestacao || '',
        esp_categorias_padrao: ((lab as any).esp_categorias_padrao || []).join(', '),
        esp_riscos_clinicos: (lab as any).esp_riscos_clinicos || '',
        esp_contraindicacoes: (lab as any).esp_contraindicacoes || '',
        forja_template_objetivo: (lab as any).forja_template_objetivo || '',
        forja_template_estrategia: (lab as any).forja_template_estrategia || '',
        forja_perguntas_chave: ((lab as any).forja_perguntas_chave || []).join('\n'),
        forja_intervencao_modelo: (lab as any).forja_intervencao_modelo || '',
        forja_fechamento_sugerido: (lab as any).forja_fechamento_sugerido || '',
      });
    }
  }, [lab]);

  useEffect(() => {
    setLegacy({
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

  const csvToArr = (s: string) =>
    s.split(/[,\n]/).map(x => x.trim()).filter(Boolean);

  const saveMutation = useMutation({
    mutationFn: async () => {
      // 1) season_labs (upsert por season_id)
      const labRecord: any = {
        season_id: estacao.id,
        cart_torre_sugerida: labForm.cart_torre_sugerida || null,
        cart_porta_sugerida: labForm.cart_porta_sugerida || null,
        cart_labirinto_sugerido: labForm.cart_labirinto_sugerido || null,
        cart_distrito_sugerido: labForm.cart_distrito_sugerido || null,
        cart_arquetipos_sugeridos: csvToArr(labForm.cart_arquetipos_sugeridos),
        cart_observacoes_obra: labForm.cart_observacoes_obra || null,
        esp_exemplos_manifestacao: labForm.esp_exemplos_manifestacao || null,
        esp_categorias_padrao: csvToArr(labForm.esp_categorias_padrao),
        esp_riscos_clinicos: labForm.esp_riscos_clinicos || null,
        esp_contraindicacoes: labForm.esp_contraindicacoes || null,
        forja_template_objetivo: labForm.forja_template_objetivo || null,
        forja_template_estrategia: labForm.forja_template_estrategia || null,
        forja_perguntas_chave: csvToArr(labForm.forja_perguntas_chave),
        forja_intervencao_modelo: labForm.forja_intervencao_modelo || null,
        forja_fechamento_sugerido: labForm.forja_fechamento_sugerido || null,
      };

      if (lab?.id) {
        const { error } = await supabase
          .from('season_labs')
          .update(labRecord)
          .eq('id', lab.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('season_labs')
          .insert(labRecord);
        if (error) throw error;
      }

      // 2) campos legados em clube_estacoes (mantém compat)
      const { error: eErr } = await supabase
        .from('clube_estacoes')
        .update({
          aplicar_mim_instrucao: legacy.aplicar_mim_instrucao || null,
          aplicar_mim_exercicio: legacy.aplicar_mim_exercicio || null,
          aplicar_sessao_pergunta: legacy.aplicar_sessao_pergunta || null,
          aplicar_sessao_intervencao: legacy.aplicar_sessao_intervencao || null,
          aplicar_sessao_risco: legacy.aplicar_sessao_risco || null,
          aplicar_grupo_dinamica: legacy.aplicar_grupo_dinamica || null,
          aplicar_grupo_regra: legacy.aplicar_grupo_regra || null,
          aplicar_grupo_risco: legacy.aplicar_grupo_risco || null,
        })
        .eq('id', estacao.id);
      if (eErr) throw eErr;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-estacao-detail', estacao.id] });
      qc.invalidateQueries({ queryKey: ['season-lab-admin', estacao.id] });
      toast({ title: 'Laboratório salvo' });
    },
    onError: (err: Error) => {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    },
  });

  const upd = (field: keyof typeof labForm, v: string) =>
    setLabForm(prev => ({ ...prev, [field]: v }));
  const updLegacy = (field: keyof typeof legacy, v: string) =>
    setLegacy(prev => ({ ...prev, [field]: v }));

  if (loadingLab) {
    return <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Configuração autoral do <strong>Laboratório Oracular</strong> desta obra — alimenta as 3 fases que a leitora atravessa: Cartografia, Espelho Clínico e Forja Narrativa.
        </p>
      </div>

      {/* ───── FASE 1: CARTOGRAFIA ───── */}
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <div className="p-1.5 rounded bg-primary/10"><Compass className="w-4 h-4 text-primary" /></div>
            Cartografia — sugestões simbólicas da obra
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Torre sugerida"><Input value={labForm.cart_torre_sugerida} onChange={e => upd('cart_torre_sugerida', e.target.value)} placeholder="Ex.: Torre da Performance" /></Field>
            <Field label="Porta sugerida"><Input value={labForm.cart_porta_sugerida} onChange={e => upd('cart_porta_sugerida', e.target.value)} placeholder="Ex.: Porta da Vulnerabilidade" /></Field>
            <Field label="Labirinto recorrente"><Input value={labForm.cart_labirinto_sugerido} onChange={e => upd('cart_labirinto_sugerido', e.target.value)} placeholder="Ex.: Repetição da entrega" /></Field>
            <Field label="Distrito predominante"><Input value={labForm.cart_distrito_sugerido} onChange={e => upd('cart_distrito_sugerido', e.target.value)} placeholder="Ex.: Distrito da Sombra" /></Field>
          </div>
          <Field label="Arquétipos ativos (separe por vírgula)">
            <Input value={labForm.cart_arquetipos_sugeridos} onChange={e => upd('cart_arquetipos_sugeridos', e.target.value)} placeholder="Mãe Devoradora, Heroína, Sombra Adolescente" />
          </Field>
          <Field label="Observações da obra (contexto para a IA)">
            <Textarea rows={3} value={labForm.cart_observacoes_obra} onChange={e => upd('cart_observacoes_obra', e.target.value)} placeholder="Notas autorais sobre a leitura simbólica desta obra..." />
          </Field>
        </CardContent>
      </Card>

      {/* ───── FASE 2: ESPELHO CLÍNICO ───── */}
      <Card className="border-teal-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <div className="p-1.5 rounded bg-teal-500/10"><Eye className="w-4 h-4 text-teal-500" /></div>
            Espelho Clínico — tradução simbólico → clínico
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Field label="Exemplos de manifestação comportamental">
            <Textarea rows={3} value={labForm.esp_exemplos_manifestacao} onChange={e => upd('esp_exemplos_manifestacao', e.target.value)} placeholder="Como esse padrão aparece na fala/comportamento da cliente..." />
          </Field>
          <Field label="Categorias estruturadas de padrão (separe por vírgula)">
            <Input value={labForm.esp_categorias_padrao} onChange={e => upd('esp_categorias_padrao', e.target.value)} placeholder="Hipercontrole, Apagamento, Idealização, Culpa" />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Riscos clínicos"><Textarea rows={3} value={labForm.esp_riscos_clinicos} onChange={e => upd('esp_riscos_clinicos', e.target.value)} placeholder="Riscos de leitura literal..." /></Field>
            <Field label="Contraindicações"><Textarea rows={3} value={labForm.esp_contraindicacoes} onChange={e => upd('esp_contraindicacoes', e.target.value)} placeholder="Quando NÃO usar este eixo..." /></Field>
          </div>

          {/* Campos legados preservados como exemplos práticos */}
          <div className="pt-3 mt-3 border-t border-border/50 space-y-3">
            <p className="text-xs text-muted-foreground font-medium">Exemplos legados de aplicação (referência para o Espelho)</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <SubBlock icon={<User className="w-3.5 h-3.5" />} title="Mim">
                <Textarea rows={2} value={legacy.aplicar_mim_instrucao} onChange={e => updLegacy('aplicar_mim_instrucao', e.target.value)} placeholder="Instrução pessoal" className="text-xs" />
                <Textarea rows={2} value={legacy.aplicar_mim_exercicio} onChange={e => updLegacy('aplicar_mim_exercicio', e.target.value)} placeholder="Exercício" className="text-xs" />
              </SubBlock>
              <SubBlock icon={<Stethoscope className="w-3.5 h-3.5" />} title="Sessão">
                <Textarea rows={2} value={legacy.aplicar_sessao_pergunta} onChange={e => updLegacy('aplicar_sessao_pergunta', e.target.value)} placeholder="Pergunta-chave" className="text-xs" />
                <Textarea rows={2} value={legacy.aplicar_sessao_intervencao} onChange={e => updLegacy('aplicar_sessao_intervencao', e.target.value)} placeholder="Intervenção" className="text-xs" />
                <Textarea rows={2} value={legacy.aplicar_sessao_risco} onChange={e => updLegacy('aplicar_sessao_risco', e.target.value)} placeholder="Risco" className="text-xs" />
              </SubBlock>
              <SubBlock icon={<Users className="w-3.5 h-3.5" />} title="Grupo">
                <Textarea rows={2} value={legacy.aplicar_grupo_dinamica} onChange={e => updLegacy('aplicar_grupo_dinamica', e.target.value)} placeholder="Dinâmica" className="text-xs" />
                <Textarea rows={2} value={legacy.aplicar_grupo_regra} onChange={e => updLegacy('aplicar_grupo_regra', e.target.value)} placeholder="Regra" className="text-xs" />
                <Textarea rows={2} value={legacy.aplicar_grupo_risco} onChange={e => updLegacy('aplicar_grupo_risco', e.target.value)} placeholder="Risco" className="text-xs" />
              </SubBlock>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ───── FASE 3: FORJA NARRATIVA ───── */}
      <Card className="border-amber-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <div className="p-1.5 rounded bg-amber-500/10"><Hammer className="w-4 h-4 text-amber-500" /></div>
            Forja Narrativa — template de plano terapêutico
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Objetivo da sessão (template)"><Textarea rows={3} value={labForm.forja_template_objetivo} onChange={e => upd('forja_template_objetivo', e.target.value)} placeholder="Objetivo simbólico-clínico..." /></Field>
            <Field label="Estratégia de condução"><Textarea rows={3} value={labForm.forja_template_estrategia} onChange={e => upd('forja_template_estrategia', e.target.value)} placeholder="Sequência de movimento na sessão..." /></Field>
          </div>
          <Field label="Perguntas-chave (uma por linha)">
            <Textarea rows={4} value={labForm.forja_perguntas_chave} onChange={e => upd('forja_perguntas_chave', e.target.value)} placeholder={'O que protege esse padrão?\nO que pede travessia agora?'} />
          </Field>
          <Field label="Intervenção simbólica modelo"><Textarea rows={3} value={labForm.forja_intervencao_modelo} onChange={e => upd('forja_intervencao_modelo', e.target.value)} placeholder="Gesto / imagem / ritual sugerido..." /></Field>
          <Field label="Fechamento sugerido"><Textarea rows={2} value={labForm.forja_fechamento_sugerido} onChange={e => upd('forja_fechamento_sugerido', e.target.value)} placeholder="Como encerrar mantendo o campo aberto..." /></Field>
        </CardContent>
      </Card>

      <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="w-full gap-2">
        {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Salvar Laboratório
      </Button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function SubBlock({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5 p-2 rounded bg-muted/30">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">{icon}{title}</div>
      {children}
    </div>
  );
}
