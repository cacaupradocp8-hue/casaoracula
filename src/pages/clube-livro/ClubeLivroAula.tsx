// ============================================
// CLUBE DO LIVRO — Página de Aula Estruturada
// Renderiza blocos dinâmicos armazenados no campo `conteudo` (JSONB)
// Mobile-first, editável via admin
// ============================================

import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft, BookOpen, Play, Headphones, Podcast,
  Sparkles, Brain, Briefcase, Compass, Sun, FileText, Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

// ============================================
// Tipos de Bloco de Conteúdo
// ============================================
export interface AulaBloco {
  tipo: 'essencia' | 'raiz_psiquica' | 'traducao_profissional' | 'atravessamento' | 'integracao_oracular' | 'registro' | 'texto_livre';
  titulo: string;
  conteudo: string;
  icone?: string;
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
  conteudo?: string; // JSON string of AulaBloco[]
  media_url?: string;
  media_type?: string;
  ordem: number;
  ativo: boolean;
  publicado: boolean;
}

// Ícone por tipo de bloco
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

  // Buscar escutas/áudios/podcasts vinculados à mesma porta
  const { data: midias } = useQuery({
    queryKey: ['clube-livro-aula-midias', aula?.porta_id, aula?.ciclo_id],
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
      return data || [];
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

  // Parse blocos do campo conteudo
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

  const audios = midias?.filter(m => m.tipo === 'audio') || [];
  const podcasts = midias?.filter(m => m.tipo === 'podcast') || [];

  return (
    <div className="max-w-2xl mx-auto px-4 pb-24">
      {/* ── Header ── */}
      <div className="pt-6 pb-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/clube-livro/${cicloId}`)} className="mb-4 -ml-2">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Voltar ao livro
        </Button>

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
      </div>

      <Separator className="mb-6" />

      {/* ── Bloco de Mídia Principal (Vídeo) ── */}
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

      {/* ── Áudio Principal ── */}
      {aula.media_url && aula.media_type === 'audio' && (
        <section className="mb-6">
          <Card className="bg-muted/20">
            <CardContent className="py-4">
              <div className="flex items-center gap-3 mb-3">
                <Headphones className="w-5 h-5 text-gold" />
                <span className="text-sm font-medium text-foreground">Áudio da Aula</span>
              </div>
              <audio controls className="w-full" src={aula.media_url}>
                Seu navegador não suporta áudio.
              </audio>
            </CardContent>
          </Card>
        </section>
      )}

      {/* ── Blocos de Conteúdo Dinâmicos ── */}
      {blocos.length > 0 ? (
        <div className="space-y-5">
          {blocos.map((bloco, i) => (
            <BlocoRenderer key={i} bloco={bloco} />
          ))}
        </div>
      ) : (
        <Card className="bg-muted/20 border-dashed mb-6">
          <CardContent className="py-8 text-center">
            <Sparkles className="w-6 h-6 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground italic">
              Conteúdo em preparação.
            </p>
          </CardContent>
        </Card>
      )}

      {/* ── Áudios Vinculados ── */}
      {audios.length > 0 && (
        <section className="mt-8">
          <h3 className="text-base font-display text-foreground mb-3 flex items-center gap-2">
            <Headphones className="w-4 h-4 text-gold" />
            Áudios
          </h3>
          <div className="space-y-3">
            {audios.map((a) => (
              <Card key={a.id} className="bg-muted/20">
                <CardContent className="py-3 px-4">
                  <p className="text-sm font-medium mb-2">{a.titulo}</p>
                  {a.audio_url && (
                    <audio controls className="w-full" src={a.audio_url}>
                      Seu navegador não suporta áudio.
                    </audio>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* ── Podcasts Vinculados ── */}
      {podcasts.length > 0 && (
        <section className="mt-8">
          <h3 className="text-base font-display text-foreground mb-3 flex items-center gap-2">
            <Podcast className="w-4 h-4 text-gold" />
            Podcasts
          </h3>
          <div className="space-y-3">
            {podcasts.map((p) => (
              <Card key={p.id} className="bg-muted/20">
                <CardContent className="py-3 px-4">
                  <p className="text-sm font-medium mb-2">{p.titulo}</p>
                  {p.audio_url && (
                    <audio controls className="w-full" src={p.audio_url}>
                      Seu navegador não suporta áudio.
                    </audio>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
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
      {expanded && (
        <CardContent className="pt-0 pb-4 px-4">
          <div
            className="prose prose-sm prose-invert max-w-none text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatContent(bloco.conteudo) }}
          />
        </CardContent>
      )}
    </Card>
  );
}

// Formata markdown simples para HTML
function formatContent(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br />')
    .replace(/^(.+)$/, '<p>$1</p>');
}
