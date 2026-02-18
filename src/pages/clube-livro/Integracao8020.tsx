// ============================================
// INTEGRAÇÃO 80/20 — Clube do Livro
// ============================================

import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  useIntegracao8020Config,
  useIntegracao8020Record,
  useSalvarIntegracao8020,
} from '@/hooks/useIntegracao8020';
import { useClubeCicloDetalhe } from '@/hooks/useClubeLivro';
import { GuardiaIntegracao8020Chat } from '@/components/clube-livro/GuardiaIntegracao8020Chat';
import { useJardimPsique } from '@/hooks/useJardimPsique';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Home,
  ChevronRight,
  Target,
  Briefcase,
  Heart,
  PenLine,
  Loader2,
  ArrowLeft,
  Save,
  GraduationCap,
  Mic,
  Stethoscope,
  CheckCircle2,
  Flower2,
  Sprout,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';


// Textarea com label
function FieldTextarea({
  label,
  placeholder,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="resize-none bg-background/60 border-border/50 focus:border-gold/50 transition-colors text-sm leading-relaxed"
      />
    </div>
  );
}

// Card de subseção dentro de Bloco 2
function SubsecaoCard({
  icon: Icon,
  titulo,
  descricao,
  children,
}: {
  icon: React.ElementType;
  titulo: string;
  descricao: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-border/40 rounded-lg p-4 space-y-3 bg-background/40">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-gold shrink-0" />
        <div>
          <p className="text-sm font-medium text-foreground">{titulo}</p>
          <p className="text-xs text-muted-foreground">{descricao}</p>
        </div>
      </div>
      <Separator className="opacity-30" />
      {children}
    </div>
  );
}

export default function Integracao8020() {
  const { id: cicloId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { ciclo, isLoading: loadingCiclo } = useClubeCicloDetalhe(cicloId);
  const { data: config, isLoading: loadingConfig } = useIntegracao8020Config(cicloId);
  const { data: record, isLoading: loadingRecord } = useIntegracao8020Record(cicloId);
  const salvar = useSalvarIntegracao8020(cicloId);
  const { salvarRegistro } = useJardimPsique();
  const { user } = useAuth();

  // Bloco 3 – Aplicação Pessoal
  const [onde, setOnde] = useState('');
  const [comportamento, setComportamento] = useState('');
  const [acao, setAcao] = useState('');

  // Bloco 4 – Registro Integrado
  const [registroLivre, setRegistroLivre] = useState('');
  const [notasProfissionais, setNotasProfissionais] = useState('');

  const [salvando, setSalvando] = useState(false);
  const [enviandoJardim, setEnviandoJardim] = useState<'psique' | 'oficio' | null>(null);

  // Inicializa com dados salvos
  useEffect(() => {
    if (record) {
      setOnde(record.aplicacao_pessoal_onde ?? '');
      setComportamento(record.aplicacao_pessoal_comportamento ?? '');
      setAcao(record.aplicacao_pessoal_acao ?? '');
      setRegistroLivre(record.registro_livre ?? '');
      setNotasProfissionais(record.notas_profissionais ?? '');
    }
  }, [record]);

  const isLoading = loadingCiclo || loadingConfig || loadingRecord;

  const temConteudoMinimo =
    onde.trim().length > 0 || registroLivre.trim().length > 0;

  const tudo_concluido =
    onde.trim().length > 0 &&
    comportamento.trim().length > 0 &&
    acao.trim().length > 0 &&
    registroLivre.trim().length > 0;

  const handleSalvar = async () => {
    if (!temConteudoMinimo) return;
    setSalvando(true);
    try {
      await salvar.mutateAsync({
        aplicacao_pessoal_onde: onde,
        aplicacao_pessoal_comportamento: comportamento,
        aplicacao_pessoal_acao: acao,
        registro_livre: registroLivre,
        notas_profissionais: notasProfissionais,
        status: tudo_concluido ? 'concluida' : 'em_andamento',
      });
      toast.success('Integração 80/20 salva no seu caminho ✦');
      navigate(`/clube-livro/${cicloId}`);
    } finally {
      setSalvando(false);
    }
  };

  // Enviar insights ao Jardim da Psique (campo pessoal)
  const handleEnviarJardimPsique = async () => {
    if (!registroLivre.trim() && !onde.trim()) {
      toast.error('Preencha ao menos um campo pessoal antes de enviar ao Jardim da Psique.');
      return;
    }
    setEnviandoJardim('psique');
    try {
      await salvarRegistro({
        ferramenta_nome: `Clube do Livro — ${ciclo?.titulo || 'Integração 80/20'}`,
        ferramenta_chave: 'clube-livro-8020',
        tipo_registro: 'reflexao',
        titulo: `Integração 80/20: ${ciclo?.titulo || ''}`,
        conteudo: {
          onde_me_atravessa: onde,
          comportamento_observar: comportamento,
          acao_pratica: acao,
          escrita_livre: registroLivre,
        },
        reflexao_pessoal: registroLivre || onde,
        tags: ['clube-livro', '8020', ciclo?.titulo || ''],
        fonte: 'Laboratório de Integração 80/20',
      });
      toast.success('Insight enviado ao Jardim da Psique ✦');
    } finally {
      setEnviandoJardim(null);
    }
  };

  // Enviar notas ao Jardim do Ofício (campo profissional) via jardim_oficio_registros
  const handleEnviarJardimOficio = async () => {
    if (!notasProfissionais.trim()) {
      toast.error('Preencha as anotações profissionais antes de enviar ao Jardim do Ofício.');
      return;
    }
    if (!user) return;
    setEnviandoJardim('oficio');
    try {
      const { error } = await (supabase as any)
        .from('jardim_oficio_registros')
        .insert({
          user_id: user.id,
          titulo: `Integração 80/20 — ${ciclo?.titulo || ''}`,
          conteudo: notasProfissionais,
          contexto_origem: `Laboratório de Integração 80/20 do Clube do Livro: ${ciclo?.titulo || ''}`,
          status: 'privado',
          tags: ['clube-livro', '8020', ciclo?.titulo || ''],
        });
      if (error) throw error;
      toast.success('Notas enviadas ao Jardim do Ofício ✦');
    } catch {
      toast.error('Erro ao enviar ao Jardim do Ofício.');
    } finally {
      setEnviandoJardim(null);
    }
  };



  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-24 max-w-2xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/clube-livro" className="hover:text-foreground transition-colors">
            Clube do Livro
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/clube-livro/${cicloId}`} className="hover:text-foreground transition-colors">
            {ciclo?.titulo}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Integração 80/20</span>
        </nav>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/10 mb-4">
            <Target className="w-6 h-6 text-gold" />
          </div>
          <Badge variant="outline" className="border-gold/40 text-gold text-xs mb-3">
            Integração 80/20
          </Badge>
          <h1 className="text-2xl font-display text-foreground mb-2">
            {ciclo?.titulo}
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
            Transforme o que leu em aplicação real — profissional, emocional e comportamental.
            Sem acúmulo, sem repetição superficial.
          </p>
        </div>

        {/* ============================
            BLOCO 1 — ESSÊNCIA DO LIVRO
        ============================== */}
        <section className="mb-6">
          <Card className="border-gold/20 bg-gradient-to-br from-card to-gold/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm uppercase tracking-widest text-gold flex items-center gap-2">
                <Target className="w-4 h-4" />
                Bloco 1 — Essência do Livro (Princípio 80/20)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {config?.essencia_texto ? (
                <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">
                  {config.essencia_texto}
                </p>
              ) : (
                <p className="text-muted-foreground/60 text-sm italic">
                  A autora ainda não adicionou o texto de essência para este livro.
                </p>
              )}

              <div className="grid gap-3 mt-2">
                {config?.tensao_central && (
                  <div className="bg-background/50 rounded-lg p-3 border border-border/30">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                      Tensão central revelada
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">
                      {config.tensao_central}
                    </p>
                  </div>
                )}
                {config?.transformacao_proposta && (
                  <div className="bg-background/50 rounded-lg p-3 border border-border/30">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                      Principal transformação proposta
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">
                      {config.transformacao_proposta}
                    </p>
                  </div>
                )}
                {config?.comportamento_abandonar && (
                  <div className="bg-background/50 rounded-lg p-3 border border-border/30">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                      Comportamento a abandonar
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">
                      {config.comportamento_abandonar}
                    </p>
                  </div>
                )}

                {!config?.tensao_central && !config?.transformacao_proposta && !config?.comportamento_abandonar && (
                  <p className="text-muted-foreground/60 text-xs italic">
                    Os campos de essência serão preenchidos pela autora.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ============================
            BLOCO 2 — TRADUÇÃO PROFISSIONAL
        ============================== */}
        <section className="mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gold" />
                Bloco 2 — Tradução Profissional
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Como este livro se transforma em prática profissional real.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Como vira aula */}
              <SubsecaoCard
                icon={GraduationCap}
                titulo="Como isso vira uma aula?"
                descricao="Estrutura de ensino a partir deste livro"
              >
                {config?.aula_conceito || config?.aula_exemplo || config?.aula_exercicio ? (
                  <div className="space-y-2">
                    {config?.aula_conceito && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                          Conceito central
                        </p>
                        <p className="text-sm text-foreground leading-relaxed">
                          {config.aula_conceito}
                        </p>
                      </div>
                    )}
                    {config?.aula_exemplo && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                          Exemplo prático
                        </p>
                        <p className="text-sm text-foreground leading-relaxed">
                          {config.aula_exemplo}
                        </p>
                      </div>
                    )}
                    {config?.aula_exercicio && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                          Exercício sugerido
                        </p>
                        <p className="text-sm text-foreground leading-relaxed">
                          {config.aula_exercicio}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground/60 text-xs italic">
                    A ser preenchido pela autora.
                  </p>
                )}
              </SubsecaoCard>

              {/* Como vira sessão */}
              <SubsecaoCard
                icon={Stethoscope}
                titulo="Como isso se aplica em uma sessão?"
                descricao="Escuta clínica e simbólica a partir deste livro"
              >
                {config?.sessao_pergunta || config?.sessao_escuta || config?.sessao_resistencia ? (
                  <div className="space-y-2">
                    {config?.sessao_pergunta && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                          Pergunta-chave
                        </p>
                        <p className="text-sm text-foreground leading-relaxed italic">
                          "{config.sessao_pergunta}"
                        </p>
                      </div>
                    )}
                    {config?.sessao_escuta && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                          Escuta que se abre
                        </p>
                        <p className="text-sm text-foreground leading-relaxed">
                          {config.sessao_escuta}
                        </p>
                      </div>
                    )}
                    {config?.sessao_resistencia && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                          Ponto de resistência comum
                        </p>
                        <p className="text-sm text-foreground leading-relaxed">
                          {config.sessao_resistencia}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground/60 text-xs italic">
                    A ser preenchido pela autora.
                  </p>
                )}
              </SubsecaoCard>

              {/* Como vira palestra */}
              <SubsecaoCard
                icon={Mic}
                titulo="Como isso vira uma palestra?"
                descricao="Narrativa pública e convite à transformação"
              >
                {config?.palestra_narrativa || config?.palestra_ideia || config?.palestra_convite ? (
                  <div className="space-y-2">
                    {config?.palestra_narrativa && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                          Narrativa simbólica
                        </p>
                        <p className="text-sm text-foreground leading-relaxed">
                          {config.palestra_narrativa}
                        </p>
                      </div>
                    )}
                    {config?.palestra_ideia && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                          Ideia central
                        </p>
                        <p className="text-sm text-foreground leading-relaxed">
                          {config.palestra_ideia}
                        </p>
                      </div>
                    )}
                    {config?.palestra_convite && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                          Convite à ação
                        </p>
                        <p className="text-sm text-foreground leading-relaxed italic">
                          "{config.palestra_convite}"
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground/60 text-xs italic">
                    A ser preenchido pela autora.
                  </p>
                )}
              </SubsecaoCard>
            </CardContent>
          </Card>
        </section>

        {/* ============================
            BLOCO 3 — APLICAÇÃO PESSOAL
        ============================== */}
        <section className="mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Heart className="w-4 h-4 text-gold" />
                Bloco 3 — Aplicação Pessoal
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Onde este livro te atravessa agora — sem pressão, com honestidade.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldTextarea
                label="Onde isso me atravessa hoje?"
                placeholder="Que situação, relação ou padrão da minha vida este livro tocou diretamente?"
                value={onde}
                onChange={setOnde}
                rows={4}
              />
              <FieldTextarea
                label="Comportamento a observar"
                placeholder="Qual comportamento meu este conteúdo convida a observar com mais atenção?"
                value={comportamento}
                onChange={setComportamento}
              />
              <FieldTextarea
                label="Ação prática para a semana"
                placeholder="Uma ação concreta, pequena e realizável que nasce desta leitura..."
                value={acao}
                onChange={setAcao}
              />
            </CardContent>
          </Card>
        </section>

        {/* ============================
            BLOCO 4 — REGISTRO INTEGRADO
        ============================== */}
        <section className="mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <PenLine className="w-4 h-4 text-gold" />
                Bloco 4 — Registro Integrado
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Espaço privado — visível apenas por você.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldTextarea
                label="Escrita livre"
                placeholder="O que ficou? O que se moveu? O que não cabia em nenhum dos campos anteriores?"
                value={registroLivre}
                onChange={setRegistroLivre}
                rows={6}
              />
              <FieldTextarea
                label="Anotações para uso profissional futuro"
                placeholder="Fragmentos, ideias ou conexões que quero lembrar quando trabalhar este tema com clientes ou em aulas..."
                value={notasProfissionais}
                onChange={setNotasProfissionais}
                rows={4}
              />
            </CardContent>
          </Card>
        </section>

        {/* ============================
            GUARDIÃ — Chat de apoio
        ============================== */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Apoio à integração
            </p>
          </div>
        </section>

        {/* ============================
            ENVIAR AOS JARDINS
        ============================== */}
        <section className="mb-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
            <Flower2 className="w-3 h-3" />
            Registro nos Jardins
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card className="bg-card/60 border-border/50">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Flower2 className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Jardim da Psique</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Envia sua escrita livre e campo pessoal para seu diário simbólico privado.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full gap-2 text-xs mt-1"
                  disabled={enviandoJardim === 'psique' || (!registroLivre.trim() && !onde.trim())}
                  onClick={handleEnviarJardimPsique}
                >
                  {enviandoJardim === 'psique' ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Flower2 className="w-3 h-3" />
                  )}
                  Enviar ao Jardim da Psique
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-card/60 border-border/50">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Jardim do Ofício</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Envia suas anotações profissionais para a reflexão da terapeuta.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full gap-2 text-xs mt-1"
                  disabled={enviandoJardim === 'oficio' || !notasProfissionais.trim()}
                  onClick={handleEnviarJardimOficio}
                >
                  {enviandoJardim === 'oficio' ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sprout className="w-3 h-3" />
                  )}
                  Enviar ao Jardim do Ofício
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="space-y-3">
          {tudo_concluido && (
            <div className="flex items-center justify-center gap-2 text-xs text-gold mb-1">
              <CheckCircle2 className="w-3 h-3" />
              Integração completa — todos os blocos preenchidos
            </div>
          )}
          <Button
            onClick={handleSalvar}
            disabled={salvando || !temConteudoMinimo}
            className="w-full bg-gold hover:bg-gold/90 text-primary-foreground gap-2 py-6 text-base"
          >
            {salvando ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Salvar integração
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => navigate(`/clube-livro/${cicloId}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao livro
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
