import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useSeasonLab, useLabProgress, useSaveLabProgress } from '@/hooks/useSeasonLab';
import { useSeasonForBook } from '@/hooks/useOracularSeasons';
import { useClubeCicloDetalhe } from '@/hooks/useClubeLivro';
import {
  Home, ChevronRight, ChevronDown, Search, Brain, Moon, CheckCircle2,
  Loader2, Target, BookOpen, Sparkles, GraduationCap, Heart, Feather,
} from 'lucide-react';
import { Lab8020Chat } from '@/components/clube-livro/blocks/Lab8020Chat';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

/* ─── Bloco 1 — Essência Simbólica (read-only config) ─── */
function BlocoEssencia({ config }: { config: any }) {
  const fields = [
    { label: 'Arquétipo Central', value: config?.arquetipo_central },
    { label: 'Núcleo Vivo', value: config?.nucleo_vivo },
    { label: 'Tensão Psíquica', value: config?.tensao_central },
    { label: 'Imagem Organizadora', value: config?.imagem_organizadora },
    { label: 'Essência Transformadora', value: config?.essencia_transformadora },
    { label: 'Transformação Exigida', value: config?.transformacao_exigida },
  ].filter(f => f.value);

  if (!fields.length) return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Search className="w-4 h-4 text-gold" /> Essência Simbólica
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground italic">Conteúdo ainda não configurado.</p>
      </CardContent>
    </Card>
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Search className="w-4 h-4 text-gold" /> Essência Simbólica
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map(f => (
          <div key={f.label}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{f.label}</p>
            <p className="text-sm text-foreground leading-relaxed">{f.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* ─── Sub-section for Bloco 2 ─── */
function SubSection({ icon, title, fields }: { icon: React.ReactNode; title: string; fields: { label: string; value: string | null | undefined }[] }) {
  const visible = fields.filter(f => f.value);
  if (!visible.length) return null;

  return (
    <Collapsible defaultOpen>
      <CollapsibleTrigger className="flex items-center gap-2 w-full text-left py-2 group">
        {icon}
        <span className="text-sm font-medium text-foreground">{title}</span>
        <ChevronDown className="w-3 h-3 text-muted-foreground ml-auto transition-transform group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 pl-6 pb-3">
        {visible.map(f => (
          <div key={f.label}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{f.label}</p>
            <p className="text-sm text-foreground leading-relaxed">{f.value}</p>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

/* ─── Bloco 2 — Tradução Profissional (read-only config) ─── */
function BlocoTraducao({ config }: { config: any }) {
  const aulaFields = [
    { label: 'Conceito-Matriz', value: config?.traducao_aula },
    { label: 'Objetivo Pedagógico', value: config?.aula_objetivo },
    { label: 'Vivência Sugerida', value: config?.aula_vivencia },
    { label: 'Pergunta de Fechamento', value: config?.aula_pergunta_fechamento },
  ];
  const sessaoFields = [
    { label: 'Tema Recorrente', value: config?.sessao_tema || config?.traducao_sessao },
    { label: 'Pergunta de Acesso', value: config?.sessao_pergunta_acesso },
    { label: 'Cuidado Ético', value: config?.sessao_cuidado_etico },
    { label: 'Resistência Comum', value: config?.sessao_resistencia },
  ];
  const palestraFields = [
    { label: 'Imagem de Abertura', value: config?.palestra_imagem },
    { label: 'Narrativa Simbólica', value: config?.palestra_narrativa || config?.traducao_circulo },
    { label: 'Chamada para Ação', value: config?.palestra_chamada },
    { label: 'Encerramento Ritual', value: config?.palestra_encerramento },
  ];

  const hasAny = [...aulaFields, ...sessaoFields, ...palestraFields].some(f => f.value);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Brain className="w-4 h-4 text-gold" /> Tradução Profissional
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {!hasAny ? (
          <p className="text-sm text-muted-foreground italic">Conteúdo ainda não configurado.</p>
        ) : (
          <>
            <SubSection icon={<GraduationCap className="w-3.5 h-3.5 text-gold/70" />} title="Aula" fields={aulaFields} />
            <SubSection icon={<Heart className="w-3.5 h-3.5 text-gold/70" />} title="Sessão" fields={sessaoFields} />
            <SubSection icon={<Sparkles className="w-3.5 h-3.5 text-gold/70" />} title="Palestra / Círculo" fields={palestraFields} />
          </>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── Bloco 3 — Aplicação Encarnada (user writes) ─── */
function BlocoAplicacao({
  values, onChange, disabled
}: {
  values: { onde: string; comportamento: string; gesto: string };
  onChange: (field: string, value: string) => void;
  disabled: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Moon className="w-4 h-4 text-gold" /> Aplicação Encarnada
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Onde isso me atravessa hoje?
          </label>
          <Textarea
            value={values.onde}
            onChange={e => onChange('onde', e.target.value)}
            placeholder="Escreva sua reflexão..."
            rows={3}
            disabled={disabled}
            className="resize-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Comportamento a observar
          </label>
          <Textarea
            value={values.comportamento}
            onChange={e => onChange('comportamento', e.target.value)}
            placeholder="O que você reconhece?"
            rows={3}
            disabled={disabled}
            className="resize-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Gesto concreto para a semana
          </label>
          <Textarea
            value={values.gesto}
            onChange={e => onChange('gesto', e.target.value)}
            placeholder="Um gesto pequeno e possível..."
            rows={2}
            disabled={disabled}
            className="resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Bloco 4 — Registro Vivo (user writes) ─── */
function BlocoRegistro({
  values, onChange, disabled
}: {
  values: { reflexivo: string; notas: string };
  onChange: (field: string, value: string) => void;
  disabled: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Feather className="w-4 h-4 text-gold" /> Registro Vivo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Escrita reflexiva
          </label>
          <Textarea
            value={values.reflexivo}
            onChange={e => onChange('reflexivo', e.target.value)}
            placeholder="O que emergiu desta travessia..."
            rows={4}
            disabled={disabled}
            className="resize-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground block mb-2">
            Anotações para prática profissional (opcional)
          </label>
          <Textarea
            value={values.notas}
            onChange={e => onChange('notas', e.target.value)}
            placeholder="Algo para levar à sua prática..."
            rows={3}
            disabled={disabled}
            className="resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── PÁGINA PRINCIPAL ─── */
export default function Lab8020Season() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { ciclo, isLoading: cicloLoading } = useClubeCicloDetalhe(id);

  const season = useSeasonForBook(id);
  const { data: labConfig, isLoading: configLoading } = useSeasonLab(season?.id);
  const { data: progress, isLoading: progressLoading } = useLabProgress(season?.id);
  const saveMutation = useSaveLabProgress(season?.id);

  // Bloco 3
  const [aplicacaoOnde, setAplicacaoOnde] = useState('');
  const [aplicacaoComportamento, setAplicacaoComportamento] = useState('');
  const [aplicacaoGesto, setAplicacaoGesto] = useState('');
  // Bloco 4
  const [registroReflexivo, setRegistroReflexivo] = useState('');
  const [notasProfissionais, setNotasProfissionais] = useState('');

  useEffect(() => {
    if (progress) {
      setAplicacaoOnde(progress.aplicacao_onde || progress.resposta_1 || '');
      setAplicacaoComportamento(progress.aplicacao_comportamento || progress.resposta_2 || '');
      setAplicacaoGesto(progress.aplicacao_gesto || progress.insight_livre || '');
      setRegistroReflexivo(progress.registro_reflexivo || '');
      setNotasProfissionais(progress.notas_profissionais || '');
    }
  }, [progress]);

  const isLoading = cicloLoading || configLoading || progressLoading;
  const concluido = progress?.concluido === true;

  const buildPayload = (extra?: Record<string, any>) => ({
    aplicacao_onde: aplicacaoOnde,
    aplicacao_comportamento: aplicacaoComportamento,
    aplicacao_gesto: aplicacaoGesto,
    registro_reflexivo: registroReflexivo,
    notas_profissionais: notasProfissionais,
    // keep legacy in sync
    resposta_1: aplicacaoOnde,
    resposta_2: aplicacaoComportamento,
    insight_livre: aplicacaoGesto,
    ...extra,
  });

  const handleSave = () => {
    saveMutation.mutate(buildPayload(), { onSuccess: () => toast.success('Rascunho salvo.') });
  };

  const handleConcluir = () => {
    if (!aplicacaoOnde.trim() || !aplicacaoComportamento.trim()) {
      toast.error('Preencha os campos obrigatórios da Aplicação Encarnada.');
      return;
    }
    saveMutation.mutate(buildPayload({ concluido: true }), {
      onSuccess: () => toast.success('Laboratório concluído.'),
    });
  };

  const handleAplicacaoChange = (field: string, value: string) => {
    if (field === 'onde') setAplicacaoOnde(value);
    if (field === 'comportamento') setAplicacaoComportamento(value);
    if (field === 'gesto') setAplicacaoGesto(value);
  };

  const handleRegistroChange = (field: string, value: string) => {
    if (field === 'reflexivo') setRegistroReflexivo(value);
    if (field === 'notas') setNotasProfissionais(value);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  if (!ciclo || !season) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl text-center">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-display mb-2">Laboratório indisponível</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Este livro ainda não está vinculado a uma estação oracular.
          </p>
          <Button variant="outline" onClick={() => navigate(-1)}>Voltar</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" /> Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/clube-livro" className="hover:text-foreground transition-colors">Círculo de Leitura</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/clube-livro/${id}`} className="hover:text-foreground transition-colors">{ciclo.titulo}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Lab 80/20</span>
        </nav>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="text-3xl mb-2">{season.simbolo}</div>
          <h1 className="text-2xl font-display text-foreground mb-1">Laboratório de Integração 80/20</h1>
          <p className="text-sm text-muted-foreground">{season.nome_estacao} · {season.periodo}</p>
        </div>

        {concluido && (
          <Card className="mb-6 border-gold/30 bg-gold/5">
            <CardContent className="p-4 flex items-center justify-center gap-2 text-gold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Laboratório concluído
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {/* BLOCO 1 — Essência Simbólica */}
          <BlocoEssencia config={labConfig} />

          {/* BLOCO 2 — Tradução Profissional */}
          <BlocoTraducao config={labConfig} />

          {/* BLOCO AI — Guardiã da Integração */}
          <Lab8020Chat livroTitulo={ciclo.titulo} labConfig={labConfig} />

          {/* BLOCO 3 — Aplicação Encarnada */}
          <BlocoAplicacao
            values={{ onde: aplicacaoOnde, comportamento: aplicacaoComportamento, gesto: aplicacaoGesto }}
            onChange={handleAplicacaoChange}
            disabled={concluido}
          />

          {/* BLOCO 4 — Registro Vivo */}
          <BlocoRegistro
            values={{ reflexivo: registroReflexivo, notas: notasProfissionais }}
            onChange={handleRegistroChange}
            disabled={concluido}
          />

          {/* Actions */}
          {!concluido && (
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="flex-1"
              >
                {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Salvar Rascunho
              </Button>
              <Button
                onClick={handleConcluir}
                disabled={saveMutation.isPending}
                className="flex-1 bg-gold hover:bg-gold/90 text-primary-foreground"
              >
                Marcar como Concluído
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
