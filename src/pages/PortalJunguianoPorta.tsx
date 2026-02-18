import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Loader2,
  ArrowLeft,
  ArrowRight,
  Check,
  Volume2,
  BookOpen,
  Feather,
  Flame,
  Shield,
  AlertCircle,
  Save,
  Stethoscope,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────
interface PJPortal {
  id: string;
  modulo_id: string;
  titulo: string;
  subtitulo: string | null;
  descricao: string | null;
  numero_ordem: number;
  texto_aula_principal: string | null;
  audio_url: string | null;
  audio_titulo: string | null;
  vivencia_guiada: string | null;
  frase_oraculo: string | null;
  missao_titulo: string | null;
  missao_descricao: string | null;
  missao_criterio_conclusao: string | null;
}

interface PJRegistro {
  id?: string;
  reflexao: string;
  missao_concluida: boolean;
}

interface PJPortalSibling {
  id: string;
  numero_ordem: number;
  titulo: string;
}

// ─── Component ───────────────────────────────────────────────
export default function PortalJunguianoPorta() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [portal, setPortal] = useState<PJPortal | null>(null);
  const [registro, setRegistro] = useState<PJRegistro>({ reflexao: '', missao_concluida: false });
  const [siblings, setSiblings] = useState<PJPortalSibling[]>([]);
  const [modoClinicia, setModoClinicia] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchPortal = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data: portalData, error } = await supabase
        .from('portal_junguiano_portais')
        .select('*')
        .eq('id', id)
        .eq('ativo', true)
        .maybeSingle();

      if (error || !portalData) {
        navigate('/portal-junguiano');
        return;
      }
      setPortal(portalData as PJPortal);

      // Buscar irmãos (portais do mesmo módulo) para navegação
      const { data: siblingsData } = await supabase
        .from('portal_junguiano_portais')
        .select('id, numero_ordem, titulo')
        .eq('modulo_id', portalData.modulo_id)
        .eq('ativo', true)
        .order('numero_ordem');
      setSiblings((siblingsData || []) as PJPortalSibling[]);

      // Registro do usuário para este portal
      if (user?.id) {
        const { data: regData } = await supabase
          .from('portal_junguiano_registros')
          .select('id, reflexao, missao_concluida')
          .eq('user_id', user.id)
          .eq('portal_id', id)
          .maybeSingle();

        if (regData) {
          setRegistro({
            id: regData.id,
            reflexao: regData.reflexao || '',
            missao_concluida: regData.missao_concluida || false,
          });
        }
      }
    } catch (err) {
      console.error('[PortalJunguianoPorta] Error:', err);
    } finally {
      setLoading(false);
    }
  }, [id, user?.id, navigate]);

  useEffect(() => { fetchPortal(); }, [fetchPortal]);

  const handleSaveReflexao = async () => {
    if (!user?.id || !id) return;
    setSaving(true);
    try {
      const payload = {
        user_id: user.id,
        portal_id: id,
        reflexao: registro.reflexao,
        missao_concluida: registro.missao_concluida,
        missao_concluida_em: registro.missao_concluida ? new Date().toISOString() : null,
      };

      const { error } = await supabase
        .from('portal_junguiano_registros')
        .upsert(payload, { onConflict: 'user_id,portal_id' });

      if (error) throw error;
      toast.success('Registro salvo com segurança.');
    } catch (err) {
      console.error('[PortalJunguianoPorta] Save error:', err);
      toast.error('Não foi possível salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleConcluirMissao = async () => {
    const next = { ...registro, missao_concluida: true };
    setRegistro(next);
    if (!user?.id || !id) return;
    setSaving(true);
    try {
      await supabase.from('portal_junguiano_registros').upsert({
        user_id: user.id,
        portal_id: id,
        reflexao: next.reflexao,
        missao_concluida: true,
        missao_concluida_em: new Date().toISOString(),
      }, { onConflict: 'user_id,portal_id' });
      toast.success('Missão concluída. 🌿');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao registrar conclusão.');
    } finally {
      setSaving(false);
    }
  };

  // Navegação entre portais do mesmo módulo
  const currentIdx = siblings.findIndex((s) => s.id === id);
  const prevPortal = currentIdx > 0 ? siblings[currentIdx - 1] : null;
  const nextPortal = currentIdx < siblings.length - 1 ? siblings[currentIdx + 1] : null;

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!portal) return null;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-24 max-w-2xl">

        {/* ── Breadcrumb + Modo Clínica ──────────────────────────── */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <button
            onClick={() => navigate('/portal-junguiano')}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Travessia das 9 Forças
          </button>

          <div className="flex items-center gap-2">
            <Stethoscope className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Modo Clínica</span>
            <Switch checked={modoClinicia} onCheckedChange={setModoClinicia} />
          </div>
        </div>

        {/* ── Cabeçalho ─────────────────────────────────────────── */}
        <div className="mb-8 space-y-2">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Portal {portal.numero_ordem}
          </p>
          <h1 className="font-display text-2xl md:text-3xl font-semibold">
            {portal.titulo}
          </h1>
          {portal.subtitulo && !modoClinicia && (
            <p className="text-muted-foreground">{portal.subtitulo}</p>
          )}
          {registro.missao_concluida && (
            <Badge className="bg-primary/20 text-primary border-primary/30 gap-1">
              <Check className="w-3 h-3" /> Concluído
            </Badge>
          )}
        </div>

        {/* Aviso ético (modo clínica) */}
        {modoClinicia && (
          <div className="mb-6 text-xs text-amber-200/80 bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3">
            <AlertCircle className="w-3.5 h-3.5 inline mr-1.5 align-text-top" />
            Esta travessia é formativa e simbólica. Não substitui acompanhamento psicológico ou médico.
          </div>
        )}

        {/* ── Seção 1: Aula Principal ─────────────────────────── */}
        {portal.texto_aula_principal ? (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {modoClinicia ? 'Conteúdo' : 'Aula Principal'}
              </h2>
            </div>
            <Card>
              <CardContent className="pt-5 pb-5">
                <div className="prose prose-sm prose-invert max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {portal.texto_aula_principal}
                </div>
              </CardContent>
            </Card>
          </section>
        ) : (
          <section className="mb-8">
            <Card className="border-dashed border-border/40">
              <CardContent className="pt-8 pb-8 text-center text-muted-foreground">
                <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Conteúdo em preparação. Volte em breve.</p>
              </CardContent>
            </Card>
          </section>
        )}

        {/* ── Seção 2: Áudio Canônico ─────────────────────────── */}
        {portal.audio_url && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {modoClinicia ? 'Áudio complementar' : 'Áudio Canônico da Sibila'}
              </h2>
            </div>
            <Card>
              <CardContent className="pt-4 pb-4">
                {portal.audio_titulo && (
                  <p className="text-sm text-muted-foreground mb-3">{portal.audio_titulo}</p>
                )}
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <audio
                  controls
                  className="w-full"
                  preload="none"
                  src={portal.audio_url}
                />
                <p className="text-xs text-muted-foreground/50 mt-2">
                  Escuta opcional. Não reproduz automaticamente.
                </p>
              </CardContent>
            </Card>
          </section>
        )}

        {/* ── Seção 3: Vivência Guiada ────────────────────────── */}
        {portal.vivencia_guiada && !modoClinicia && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Vivência Guiada
              </h2>
            </div>
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-5 pb-5">
                <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {portal.vivencia_guiada}
                </div>
                <p className="text-xs text-muted-foreground/50 mt-4 border-t border-border/30 pt-3">
                  Ritual leve. Sem regressão. Sem imaginação ativa profunda.
                </p>
              </CardContent>
            </Card>
          </section>
        )}

        {/* ── Seção 4: Registro Reflexivo ─────────────────────── */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Feather className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Registro Reflexivo
            </h2>
          </div>
          <Card>
            <CardContent className="pt-4 pb-4 space-y-3">
              <Textarea
                placeholder={
                  modoClinicia
                    ? 'Observações objetivas...'
                    : 'O que emerge neste encontro? Escreva livremente...'
                }
                value={registro.reflexao}
                onChange={(e) => setRegistro((r) => ({ ...r, reflexao: e.target.value }))}
                className="min-h-[120px] resize-none text-sm bg-transparent border-border/50"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground/60">
                  Campo privado · Salvo automaticamente na sua conta
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSaveReflexao}
                  disabled={saving}
                  className="gap-1.5 text-xs"
                >
                  {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                  Salvar
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ── Seção 5: Frase-Oráculo ──────────────────────────── */}
        {portal.frase_oraculo && !modoClinicia && (
          <section className="mb-8">
            <Card className="bg-transparent border-border/30">
              <CardContent className="pt-6 pb-6 text-center">
                <blockquote className="font-display text-lg md:text-xl italic text-foreground/80 leading-relaxed">
                  "{portal.frase_oraculo}"
                </blockquote>
              </CardContent>
            </Card>
          </section>
        )}

        {/* ── Seção 6: Missão de Aplicação ────────────────────── */}
        {portal.missao_titulo && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {modoClinicia ? 'Tarefa de aplicação' : 'Missão de Aplicação'}
              </h2>
            </div>
            <Card className={cn(
              'border',
              registro.missao_concluida
                ? 'border-primary/30 bg-primary/5'
                : 'border-border'
            )}>
              <CardContent className="pt-5 pb-5 space-y-4">
                <div>
                  <h3 className="font-semibold text-sm mb-1">{portal.missao_titulo}</h3>
                  {portal.missao_descricao && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {portal.missao_descricao}
                    </p>
                  )}
                  {portal.missao_criterio_conclusao && (
                    <p className="text-xs text-muted-foreground/70 mt-2 border-t border-border/30 pt-2">
                      <span className="font-medium">Critério:</span> {portal.missao_criterio_conclusao}
                    </p>
                  )}
                </div>

                {!registro.missao_concluida ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={handleConcluirMissao}
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    Marcar como concluída
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Check className="w-4 h-4" />
                    Missão concluída
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {/* ── Navegação ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-6 border-t border-border/40 mt-4">
          {prevPortal ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/portal-junguiano/porta/${prevPortal.id}`)}
              className="gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Anterior
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/portal-junguiano')}
              className="gap-2 text-muted-foreground"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Voltar
            </Button>
          )}

          {nextPortal ? (
            <Button
              size="sm"
              onClick={() => navigate(`/portal-junguiano/porta/${nextPortal.id}`)}
              className="gap-2"
              disabled={!registro.missao_concluida && portal.missao_titulo !== null}
            >
              Próximo
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/portal-junguiano')}
              className="gap-2"
            >
              Concluir Módulo
              <Check className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>

        {/* Aviso ético fixo */}
        <p className="text-center text-xs text-muted-foreground/30 mt-8">
          Portal Junguiano · Casa Orácula · Conteúdo simbólico formativo. Não substitui supervisão clínica.
        </p>

      </div>
    </AppLayout>
  );
}
