// ============================================
// CLUBE DO LIVRO — Página de Aula-Álbum Oracular
// 100% dinâmica: todo conteúdo vem do banco de dados
// Estrutura: Header > Player/Faixas > Blocos > Alerta Clínico
// ============================================

import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  ArrowLeft, BookOpen, Play, Headphones, Podcast,
  Sparkles, Brain, Briefcase, Compass, Sun, FileText,
  Loader2, AlertTriangle, ChevronDown, Pen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { UnifiedAudioPlayer } from '@/components/audio/UnifiedAudioPlayer';
import DOMPurify from 'dompurify';

// ============================================
// Tipos
// ============================================
interface AulaBloco {
  tipo: string;
  titulo: string;
  conteudo: string;
  ordem: number;
}

interface AulaDB {
  id: string;
  ciclo_id: string;
  porta_id?: string;
  titulo: string;
  subtitulo?: string;
  descricao?: string;
  duracao?: string;
  conteudo?: string;
  media_url?: string;
  media_type?: string;
  ordem: number;
  ativo: boolean;
  publicado: boolean;
}

interface FaseDB {
  id: string;
  titulo: string;
  alerta_clinico?: string;
  observacao_clinica?: string;
  orientacao_curta?: string;
}

interface EscutaDB {
  id: string;
  titulo: string;
  descricao?: string;
  tipo: string;
  audio_url?: string;
  duracao_segundos?: number;
  ordem: number;
}

interface CicloDB {
  id: string;
  titulo: string;
  autor_livro?: string;
  campo_simbolico?: string;
}

interface PortaDB {
  id: string;
  titulo: string;
  jornada: string;
  descricao?: string;
}

const BLOCO_CONFIG: Record<string, { icon: React.ElementType; label: string; accent: string }> = {
  essencia: { icon: Sparkles, label: 'Essência', accent: 'text-amber-400' },
  raiz_psiquica: { icon: Brain, label: 'Raiz Psíquica', accent: 'text-violet-400' },
  traducao_profissional: { icon: Briefcase, label: 'Tradução Profissional', accent: 'text-teal-400' },
  atravessamento: { icon: Compass, label: 'Atravessamento', accent: 'text-rose-400' },
  integracao_oracular: { icon: Sun, label: 'Integração Oracular', accent: 'text-gold' },
  registro: { icon: FileText, label: 'Registro', accent: 'text-sky-400' },
  texto_livre: { icon: BookOpen, label: 'Texto', accent: 'text-muted-foreground' },
};

// ============================================
// Componente Principal
// ============================================
export default function ClubeLivroAula() {
  const { id: cicloId, aulaId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Buscar aula
  const { data: aula, isLoading } = useQuery({
    queryKey: ['clube-livro-aula', aulaId],
    queryFn: async () => {
      if (!aulaId) return null;
      const { data, error } = await supabase
        .from('clube_livro_aulas')
        .select('*')
        .eq('id', aulaId)
        .maybeSingle();
      if (error) throw error;
      return data as AulaDB | null;
    },
    enabled: !!aulaId && !!user,
  });

  // Buscar ciclo (título do livro + autor)
  const { data: ciclo } = useQuery({
    queryKey: ['clube-livro-ciclo-meta', aula?.ciclo_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_ciclos')
        .select('id, titulo, autor_livro, campo_simbolico')
        .eq('id', aula!.ciclo_id)
        .maybeSingle();
      if (error) throw error;
      return data as CicloDB | null;
    },
    enabled: !!aula?.ciclo_id,
  });

  // Buscar porta (jornada + título)
  const { data: porta } = useQuery({
    queryKey: ['clube-livro-porta-meta', aula?.porta_id],
    queryFn: async () => {
      if (!aula?.porta_id) return null;
      const { data, error } = await supabase
        .from('clube_livro_portas')
        .select('id, titulo, jornada, descricao')
        .eq('id', aula.porta_id)
        .maybeSingle();
      if (error) throw error;
      return data as PortaDB | null;
    },
    enabled: !!aula?.porta_id,
  });

  // Buscar faixas de áudio (escutas vinculadas)
  const { data: faixas } = useQuery({
    queryKey: ['clube-livro-aula-faixas', aula?.porta_id, aula?.ciclo_id],
    queryFn: async () => {
      if (!aula?.ciclo_id) return [];
      let query = supabase
        .from('clube_livro_escutas')
        .select('*')
        .eq('ciclo_id', aula.ciclo_id)
        .eq('ativo', true)
        .order('ordem', { ascending: true });
      if (aula.porta_id) {
        query = query.eq('porta_id', aula.porta_id);
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as EscutaDB[];
    },
    enabled: !!aula?.ciclo_id,
  });

  // Buscar fase clínica (alerta + observação)
  const { data: fase } = useQuery({
    queryKey: ['clube-livro-fase-clinica', aula?.porta_id, aula?.ciclo_id],
    queryFn: async () => {
      if (!aula?.ciclo_id) return null;
      let query = supabase
        .from('clube_livro_fases')
        .select('id, titulo, alerta_clinico, observacao_clinica, orientacao_curta')
        .eq('ciclo_id', aula.ciclo_id);
      if (aula.porta_id) {
        query = query.eq('porta_id', aula.porta_id);
      }
      const { data, error } = await query.maybeSingle();
      if (error) throw error;
      return data as FaseDB | null;
    },
    enabled: !!aula?.ciclo_id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-gold" />
      </div>
    );
  }

  if (!aula) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Aula não encontrada.</p>
        <Button variant="ghost" className="mt-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>
    );
  }

  // Parse blocos
  let blocos: AulaBloco[] = [];
  try {
    if (aula.conteudo) {
      const parsed = typeof aula.conteudo === 'string' ? JSON.parse(aula.conteudo) : aula.conteudo;
      if (Array.isArray(parsed)) {
        blocos = parsed.sort((a: AulaBloco, b: AulaBloco) => a.ordem - b.ordem);
      }
    }
  } catch {
    blocos = [];
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pb-24">

      {/* ═══ SEÇÃO 1: Cabeçalho do Álbum (tudo do banco) ═══ */}
      <div className="pt-6 pb-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/clube-livro/${cicloId}`)} className="mb-4 -ml-2">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Voltar ao livro
        </Button>

        {/* Dados do ciclo + porta */}
        <div className="space-y-1 mb-4">
          {ciclo && (
            <p className="text-xs uppercase tracking-widest text-gold">
              {ciclo.titulo}{ciclo.autor_livro ? ` — ${ciclo.autor_livro}` : ''}
            </p>
          )}
          {porta && (
            <p className="text-xs text-muted-foreground">
              {porta.titulo}{porta.jornada ? ` · ${porta.jornada}` : ''}
            </p>
          )}
        </div>

        {/* Título da aula */}
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
            <span className="text-sm font-mono text-gold font-bold">{aula.ordem}</span>
          </div>
          <div>
            <h1 className="text-xl font-display text-foreground leading-tight">{aula.titulo}</h1>
            {aula.subtitulo && (
              <p className="text-sm text-muted-foreground mt-1">{aula.subtitulo}</p>
            )}
            {aula.duracao && (
              <Badge variant="outline" className="mt-2 text-xs">{aula.duracao}</Badge>
            )}
          </div>
        </div>

        {/* Descrição curta */}
        {aula.descricao && (
          <p className="text-sm text-muted-foreground mt-3">{aula.descricao}</p>
        )}
      </div>

      <Separator className="mb-6" />

      {/* ═══ SEÇÃO 2: Player Principal (mídia da aula) ═══ */}
      {aula.media_url && aula.media_type === 'audio' && (
        <section className="mb-6">
          <UnifiedAudioPlayer audioUrl={aula.media_url} title={aula.titulo} size="lg" />
        </section>
      )}

      {aula.media_url && aula.media_type === 'video' && (
        <section className="mb-6">
          <div className="rounded-xl overflow-hidden bg-black aspect-video">
            <iframe
              src={aula.media_url}
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={aula.titulo}
            />
          </div>
        </section>
      )}

      {/* ═══ SEÇÃO 3: Lista de Faixas (escutas do banco) ═══ */}
      {faixas && faixas.length > 0 && (
        <section className="mb-8">
          <h3 className="text-base font-display text-foreground mb-3 flex items-center gap-2">
            <Headphones className="w-4 h-4 text-gold" />
            Faixas
          </h3>
          <div className="space-y-3">
            {faixas.map((faixa, i) => (
              <Card key={faixa.id} className="bg-muted/20">
                <CardContent className="py-3 px-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-gold w-5 text-center">{i + 1}</span>
                    <span className="text-sm font-medium flex-1">{faixa.titulo}</span>
                    {faixa.duracao_segundos && (
                      <Badge variant="outline" className="text-[10px]">
                        {Math.floor(faixa.duracao_segundos / 60)}min
                      </Badge>
                    )}
                  </div>
                  {faixa.descricao && (
                    <p className="text-xs text-muted-foreground mb-2 ml-7">{faixa.descricao}</p>
                  )}
                  {faixa.audio_url && (
                    <div className="ml-7">
                      <UnifiedAudioPlayer audioUrl={faixa.audio_url} title={faixa.titulo} size="sm" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* ═══ SEÇÃO 4: Blocos de Conteúdo Dinâmicos (do JSONB) ═══ */}
      {blocos.length > 0 && (
        <div className="space-y-5 mb-8">
          {blocos.map((bloco, i) => (
            <BlocoRenderer key={i} bloco={bloco} />
          ))}
        </div>
      )}

      {/* ═══ SEÇÃO 5: Botão "Registrar Insight" ═══ */}
      {blocos.some(b => b.tipo === 'registro') && (
        <div className="mb-8">
          <Button className="w-full gap-2 bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30">
            <Pen className="w-4 h-4" />
            Registrar Insight
          </Button>
        </div>
      )}

      {/* ═══ SEÇÃO 6: Alerta Clínico (colapsável, do banco) ═══ */}
      {fase?.alerta_clinico && (
        <section className="mb-8">
          <Collapsible>
            <CollapsibleTrigger className="w-full flex items-center gap-2 p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-colors">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-sm font-medium text-amber-300 flex-1 text-left">Alerta Clínico</span>
              <ChevronDown className="w-4 h-4 text-amber-400" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 px-3">
              <div
                className="prose prose-sm prose-invert max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(fase.alerta_clinico.replace(/\n/g, '<br/>')) }}
              />
              {fase.observacao_clinica && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Observação Clínica</p>
                  <div
                    className="prose prose-sm prose-invert max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(fase.observacao_clinica.replace(/\n/g, '<br/>')) }}
                  />
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </section>
      )}

      {/* Empty state */}
      {blocos.length === 0 && (!faixas || faixas.length === 0) && !aula.media_url && (
        <Card className="bg-muted/20 border-dashed mb-6">
          <CardContent className="py-8 text-center">
            <Sparkles className="w-6 h-6 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground italic">Conteúdo em preparação.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ============================================
// Renderizador de Bloco Individual
// ============================================
function BlocoRenderer({ bloco }: { bloco: AulaBloco }) {
  const [expanded, setExpanded] = useState(true);
  const config = BLOCO_CONFIG[bloco.tipo] || BLOCO_CONFIG.texto_livre;
  const Icon = config.icon;

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/10 transition-colors"
      >
        <Icon className={cn('w-5 h-5 shrink-0', config.accent)} />
        <span className="text-sm font-display font-medium text-foreground flex-1">
          {bloco.titulo || config.label}
        </span>
        <Badge variant="outline" className="text-[10px] shrink-0">
          {config.label}
        </Badge>
      </button>
      {expanded && bloco.conteudo && (
        <CardContent className="pt-0 pb-4 px-4">
          <div
            className="prose prose-sm prose-invert max-w-none text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formatContent(bloco.conteudo)) }}
          />
        </CardContent>
      )}
    </Card>
  );
}

function formatContent(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br />')
    .replace(/^(.+)$/, '<p>$1</p>');
}
