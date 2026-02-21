// ============================================
// CLUBE DO LIVRO — Aula-Álbum Oracular
// Layout ritualístico, mobile-first, 100% dinâmico
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  ArrowLeft, BookOpen, Play, Pause, Headphones,
  Sparkles, Brain, Briefcase, Compass, Sun, FileText,
  Loader2, AlertTriangle, ChevronDown, Pen, Flower2,
  SkipBack, SkipForward, Volume2, VolumeX,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect, useCallback } from 'react';
import { formatAudioTime, getPublicAudioUrl } from '@/lib/audioUtils';
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

interface FaseDB {
  id: string;
  titulo: string;
  alerta_clinico?: string;
  observacao_clinica?: string;
  orientacao_curta?: string;
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

  // Player state
  const audioRef = useRef<HTMLAudioElement>(null);
  const [activeFaixaIndex, setActiveFaixaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Queries
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

  // ── Player Logic ──
  const activeFaixa = faixas?.[activeFaixaIndex];
  const activeAudioUrl = getPublicAudioUrl(activeFaixa?.audio_url);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => { setIsPlaying(false); setCurrentTime(0); };
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeAudioUrl) return;
    audio.src = activeAudioUrl;
    audio.load();
    setCurrentTime(0);
    setDuration(0);
    if (isPlaying) {
      audio.play().catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAudioUrl]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.pause();
    else audio.play().catch(() => {});
  }, [isPlaying]);

  const skip = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, duration));
  }, [duration]);

  const selectFaixa = useCallback((index: number) => {
    setActiveFaixaIndex(index);
    setIsPlaying(true);
  }, []);

  const handleSeek = useCallback((v: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = v[0];
    setCurrentTime(v[0]);
  }, []);

  // ── Parse blocos ──
  let blocos: AulaBloco[] = [];
  try {
    if (aula?.conteudo) {
      const parsed = typeof aula.conteudo === 'string' ? JSON.parse(aula.conteudo) : aula.conteudo;
      if (Array.isArray(parsed)) blocos = parsed.sort((a: AulaBloco, b: AulaBloco) => a.ordem - b.ordem);
    }
  } catch { blocos = []; }

  // ── Loading / Empty ──
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
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </Button>
      </div>
    );
  }

  const hasFaixas = faixas && faixas.length > 0;

  return (
    <div className="max-w-2xl mx-auto px-4 pb-28">
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="metadata" />

      {/* ═══ 1. CABEÇALHO DO ÁLBUM ═══ */}
      <header className="pt-6 pb-5">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/clube-livro/${cicloId}`)} className="mb-5 -ml-2 text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar ao livro
        </Button>

        <div className="space-y-2 mb-5">
          {ciclo && (
            <p className="text-xs tracking-widest text-gold/80">
              {ciclo.titulo}{ciclo.autor_livro ? ` — ${ciclo.autor_livro}` : ''}
            </p>
          )}
          {porta && (
            <p className="text-xs text-muted-foreground">
              {porta.titulo}{porta.jornada ? ` · ${porta.jornada}` : ''}
            </p>
          )}
        </div>

        <h1 className="text-xl font-display text-foreground leading-tight mb-1">
          {aula.titulo}
        </h1>
        {aula.subtitulo && (
          <p className="text-sm text-muted-foreground">{aula.subtitulo}</p>
        )}
        {aula.descricao && (
          <p className="text-sm text-muted-foreground/70 mt-2 italic">{aula.descricao}</p>
        )}
        {aula.duracao && (
          <Badge variant="outline" className="mt-3 text-xs font-normal">{aula.duracao}</Badge>
        )}
      </header>

      <Separator className="mb-6 opacity-30" />

      {/* ═══ 2. PLAYER PRINCIPAL ═══ */}
      {hasFaixas && activeAudioUrl && (
        <section className="mb-8">
          <Card className="bg-card/60 border-border/30 p-5">
            {/* Track info */}
            <p className="text-xs text-muted-foreground mb-1">
              Faixa {activeFaixaIndex + 1} de {faixas.length}
            </p>
            <p className="text-sm font-medium text-foreground mb-4 truncate">
              {activeFaixa?.titulo}
            </p>

            {/* Progress */}
            <Slider
              value={[currentTime]}
              max={duration || 1}
              step={0.1}
              onValueChange={handleSeek}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mb-4">
              <span>{formatAudioTime(currentTime)}</span>
              <span>{duration > 0 ? formatAudioTime(duration) : '--:--'}</span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground" onClick={() => skip(-15)}>
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                onClick={togglePlay}
                className="h-12 w-12 rounded-full bg-gold/20 text-gold hover:bg-gold/30"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground" onClick={() => skip(15)}>
                <SkipForward className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground ml-2" onClick={() => { if (audioRef.current) { audioRef.current.muted = !isMuted; setIsMuted(!isMuted); } }}>
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>
          </Card>
        </section>
      )}

      {/* ═══ 3. LISTA DE FAIXAS ═══ */}
      {hasFaixas && (
        <section className="mb-8">
          <h3 className="text-sm font-display text-foreground/70 mb-3 flex items-center gap-2">
            <Headphones className="w-4 h-4 text-gold/60" />
            Faixas
          </h3>
          <div className="space-y-1">
            {faixas.map((faixa, i) => {
              const isActive = i === activeFaixaIndex;
              return (
                <button
                  key={faixa.id}
                  onClick={() => selectFaixa(i)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                    isActive
                      ? "bg-gold/10 border border-gold/20"
                      : "hover:bg-muted/20 border border-transparent"
                  )}
                >
                  <span className={cn(
                    "text-xs font-mono w-5 text-center shrink-0",
                    isActive ? "text-gold" : "text-muted-foreground"
                  )}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm truncate",
                      isActive ? "text-foreground font-medium" : "text-foreground/80"
                    )}>
                      {faixa.titulo}
                    </p>
                    {faixa.descricao && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{faixa.descricao}</p>
                    )}
                  </div>
                  {faixa.duracao_segundos && (
                    <span className="text-xs text-muted-foreground shrink-0">
                      {Math.floor(faixa.duracao_segundos / 60)}min
                    </span>
                  )}
                  {isActive && isPlaying && (
                    <span className="w-2 h-2 rounded-full bg-gold shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ═══ 4. BLOCOS DE CONTEÚDO ═══ */}
      {blocos.length > 0 && (
        <div className="space-y-4 mb-8">
          {blocos.map((bloco, i) => (
            <BlocoRenderer key={i} bloco={bloco} />
          ))}
        </div>
      )}

      {/* ═══ 5. ALERTA CLÍNICO ═══ */}
      {fase?.alerta_clinico && (
        <section className="mb-8">
          <Collapsible>
            <CollapsibleTrigger className="w-full flex items-center gap-2 p-3 rounded-lg border border-amber-500/15 bg-amber-500/5 hover:bg-amber-500/8 transition-colors">
              <AlertTriangle className="w-4 h-4 text-amber-400/70 shrink-0" />
              <span className="text-sm text-amber-300/80 flex-1 text-left">Alerta de Uso</span>
              <ChevronDown className="w-4 h-4 text-amber-400/50" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 px-3">
              <div
                className="prose prose-sm prose-invert max-w-none text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(fase.alerta_clinico.replace(/\n/g, '<br/>')) }}
              />
              {fase.observacao_clinica && (
                <div className="mt-3 pt-3 border-t border-border/30">
                  <p className="text-xs font-medium text-muted-foreground/70 mb-1">Observação Clínica</p>
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
      {blocos.length === 0 && !hasFaixas && !aula.media_url && (
        <Card className="bg-muted/10 border-dashed mb-6">
          <CardContent className="py-8 text-center">
            <Sparkles className="w-6 h-6 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground/60 italic">Conteúdo em preparação.</p>
          </CardContent>
        </Card>
      )}

      {/* ═══ 6. BOTÃO FIXO: REGISTRAR INSIGHT ═══ */}
      <div className="fixed bottom-6 left-0 right-0 px-4 max-w-2xl mx-auto z-30">
        <Popover>
          <PopoverTrigger asChild>
            <Button className="w-full gap-2 bg-gold/15 hover:bg-gold/25 text-gold border border-gold/25 backdrop-blur-sm shadow-lg">
              <Pen className="w-4 h-4" />
              Registrar Insight
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2" align="center" side="top">
            <button
              onClick={() => navigate('/jardim-da-psique')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-muted/30 transition-colors text-left"
            >
              <Flower2 className="w-4 h-4 text-rose-400/70" />
              <span className="text-sm text-foreground">Jardim da Psique</span>
            </button>
            <button
              onClick={() => navigate('/jardim-do-oficio')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-muted/30 transition-colors text-left"
            >
              <Briefcase className="w-4 h-4 text-teal-400/70" />
              <span className="text-sm text-foreground">Jardim do Ofício</span>
            </button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

// ============================================
// Renderizador de Bloco
// ============================================
function BlocoRenderer({ bloco }: { bloco: AulaBloco }) {
  const [expanded, setExpanded] = useState(true);
  const config = BLOCO_CONFIG[bloco.tipo] || BLOCO_CONFIG.texto_livre;
  const Icon = config.icon;

  return (
    <Card className="overflow-hidden bg-card/40 border-border/30">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/10 transition-colors"
      >
        <Icon className={cn('w-4 h-4 shrink-0', config.accent)} />
        <span className="text-sm font-display text-foreground flex-1">
          {bloco.titulo || config.label}
        </span>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", expanded && "rotate-180")} />
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
