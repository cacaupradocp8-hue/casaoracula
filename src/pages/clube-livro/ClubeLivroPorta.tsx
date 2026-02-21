// ============================================
// CLUBE DO LIVRO — Página Individual da Porta/Jornada
// Abas: Aula-Álbum, Escuta Simbólica, Aplicação Profissional,
//       Jardim da Psique, Jardim do Ofício
// ============================================

import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { formatAudioTime, getPublicAudioUrl } from '@/lib/audioUtils';
import DOMPurify from 'dompurify';
import {
  ArrowLeft, BookOpen, Play, Pause, Headphones,
  Sparkles, Brain, Briefcase, Compass, Sun, FileText,
  Loader2, AlertTriangle, ChevronDown, ChevronRight,
  SkipBack, SkipForward, Volume2, VolumeX,
  Flower2, Home, Music, Stethoscope, Pen,
} from 'lucide-react';

// ── Types ──
interface AulaBloco {
  tipo: string;
  titulo: string;
  conteudo: string;
  ordem: number;
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

// ── Resonance CSS animation (pure CSS for GPU perf) ──
const resonanceKeyframes = `
@keyframes resonance-breathe {
  0%, 100% { opacity: 0; transform: scale(0.95); }
  50% { opacity: 0.15; transform: scale(1.05); }
}
`;

export default function ClubeLivroPorta() {
  const { id: cicloId, portaId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('aula-album');

  // Player state
  const audioRef = useRef<HTMLAudioElement>(null);
  const [activeFaixaIndex, setActiveFaixaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // ── Queries ──
  const { data: ciclo } = useQuery({
    queryKey: ['clube-ciclo-meta', cicloId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_ciclos')
        .select('id, titulo, autor_livro, campo_simbolico')
        .eq('id', cicloId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!cicloId,
  });

  const { data: porta, isLoading } = useQuery({
    queryKey: ['clube-porta', portaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_portas')
        .select('*')
        .eq('id', portaId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!portaId,
  });

  const { data: aula } = useQuery({
    queryKey: ['clube-porta-aula', cicloId, portaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_aulas')
        .select('*')
        .eq('ciclo_id', cicloId!)
        .eq('porta_id', portaId!)
        .eq('ativo', true)
        .order('ordem', { ascending: true })
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!cicloId && !!portaId,
  });

  const { data: faixas } = useQuery({
    queryKey: ['clube-porta-faixas', cicloId, portaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_escutas')
        .select('*')
        .eq('ciclo_id', cicloId!)
        .eq('porta_id', portaId!)
        .eq('ativo', true)
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!cicloId && !!portaId,
  });

  const { data: fase } = useQuery({
    queryKey: ['clube-porta-fase', cicloId, portaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_fases')
        .select('id, titulo, alerta_clinico, observacao_clinica, orientacao_curta, lista_uso_inadequado')
        .eq('ciclo_id', cicloId!)
        .eq('porta_id', portaId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!cicloId && !!portaId,
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

  // ── Parse blocos from aula ──
  let blocos: AulaBloco[] = [];
  try {
    if (aula?.conteudo) {
      const parsed = typeof aula.conteudo === 'string' ? JSON.parse(aula.conteudo) : aula.conteudo;
      if (Array.isArray(parsed)) blocos = parsed.sort((a: AulaBloco, b: AulaBloco) => a.ordem - b.ordem);
    }
  } catch { blocos = []; }

  // Separate blocos by tab
  const blocosAplicacao = blocos.filter(b => b.tipo === 'traducao_profissional');
  const blocosAula = blocos.filter(b => b.tipo !== 'traducao_profissional');

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-6 h-6 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  if (!porta) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Porta não encontrada.</p>
          <Button variant="ghost" className="mt-4" onClick={() => navigate(`/clube-livro/${cicloId}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
        </div>
      </AppLayout>
    );
  }

  const hasFaixas = faixas && faixas.length > 0;

  return (
    <AppLayout>
      {/* Inject resonance keyframes */}
      <style>{resonanceKeyframes}</style>
      <audio ref={audioRef} preload="metadata" />

      <div className="container mx-auto px-4 py-6 pb-20 max-w-2xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-5 flex-wrap">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/clube-livro" className="hover:text-foreground transition-colors">Clube</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/clube-livro/${cicloId}`} className="hover:text-foreground transition-colors truncate max-w-[120px]">
            {ciclo?.titulo || 'Livro'}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground truncate max-w-[140px]">{porta.titulo}</span>
        </nav>

        {/* Header da Porta */}
        <header className="mb-6 relative">
          {/* Resonance effect */}
          {isPlaying && (
            <div
              className="absolute inset-0 -m-4 rounded-2xl pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, hsl(var(--gold) / 0.12) 0%, transparent 70%)',
                animation: 'resonance-breathe 4s ease-in-out infinite',
                willChange: 'opacity, transform',
                transform: 'translateZ(0)',
              }}
            />
          )}
          <div className="relative">
            {ciclo && (
              <p className="text-xs tracking-widest text-gold/80 mb-1">
                {ciclo.titulo}{ciclo.autor_livro ? ` — ${ciclo.autor_livro}` : ''}
              </p>
            )}
            <h1 className="text-xl font-display text-foreground leading-tight mb-1">
              {porta.titulo}
            </h1>
            {porta.jornada && (
              <Badge variant="outline" className="text-xs font-normal mt-1">{porta.jornada}</Badge>
            )}
            {porta.descricao && (
              <p className="text-sm text-muted-foreground/70 mt-2 italic">{porta.descricao}</p>
            )}
          </div>
        </header>

        {/* ═══ TABS ═══ */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-5 h-auto gap-0 bg-muted/50 rounded-lg p-1">
            <TabsTrigger value="aula-album" className="text-xs px-1 py-2 flex flex-col gap-1 data-[state=active]:bg-background">
              <Headphones className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Aula</span>
            </TabsTrigger>
            <TabsTrigger value="escuta" className="text-xs px-1 py-2 flex flex-col gap-1 data-[state=active]:bg-background">
              <Music className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Escuta</span>
            </TabsTrigger>
            <TabsTrigger value="aplicacao" className="text-xs px-1 py-2 flex flex-col gap-1 data-[state=active]:bg-background">
              <Stethoscope className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Aplicação</span>
            </TabsTrigger>
            <TabsTrigger value="jardim-psique" className="text-xs px-1 py-2 flex flex-col gap-1 data-[state=active]:bg-background">
              <Flower2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Psique</span>
            </TabsTrigger>
            <TabsTrigger value="jardim-oficio" className="text-xs px-1 py-2 flex flex-col gap-1 data-[state=active]:bg-background">
              <Briefcase className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ofício</span>
            </TabsTrigger>
          </TabsList>

          {/* ── TAB: Aula-Álbum ── */}
          <TabsContent value="aula-album" className="mt-5 space-y-6">
            {/* Player */}
            {hasFaixas && activeAudioUrl && (
              <PlayerSection
                faixas={faixas}
                activeFaixaIndex={activeFaixaIndex}
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={duration}
                isMuted={isMuted}
                audioRef={audioRef}
                onTogglePlay={togglePlay}
                onSkip={skip}
                onSeek={handleSeek}
                onSelectFaixa={selectFaixa}
                onToggleMute={() => {
                  if (audioRef.current) {
                    audioRef.current.muted = !isMuted;
                    setIsMuted(!isMuted);
                  }
                }}
              />
            )}

            {/* Content blocks */}
            {blocosAula.length > 0 && (
              <div className="space-y-4">
                {blocosAula.map((bloco, i) => (
                  <BlocoRenderer key={i} bloco={bloco} />
                ))}
              </div>
            )}

            {/* Clinical alert */}
            {fase?.alerta_clinico && <AlertaClinicoBlock fase={fase} />}

            {/* Empty */}
            {blocosAula.length === 0 && !hasFaixas && (
              <EmptyBlock label="Conteúdo da aula em preparação." />
            )}
          </TabsContent>

          {/* ── TAB: Escuta Simbólica ── */}
          <TabsContent value="escuta" className="mt-5">
            {hasFaixas ? (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground mb-3">
                  Faixas de escuta profunda desta porta. Toque para ouvir.
                </p>
                {faixas.map((faixa, i) => {
                  const isActive = i === activeFaixaIndex && activeTab === 'escuta';
                  return (
                    <button
                      key={faixa.id}
                      onClick={() => { selectFaixa(i); setActiveTab('aula-album'); }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                        isActive ? "bg-gold/10 border border-gold/20" : "hover:bg-muted/20 border border-transparent"
                      )}
                    >
                      <span className="text-xs font-mono w-5 text-center shrink-0 text-muted-foreground">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate text-foreground/80">{faixa.titulo}</p>
                        {faixa.descricao && <p className="text-xs text-muted-foreground truncate mt-0.5">{faixa.descricao}</p>}
                      </div>
                      {faixa.duracao_segundos && (
                        <span className="text-xs text-muted-foreground shrink-0">{Math.floor(faixa.duracao_segundos / 60)}min</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <EmptyBlock label="Escutas em preparação." />
            )}
          </TabsContent>

          {/* ── TAB: Aplicação Profissional ── */}
          <TabsContent value="aplicacao" className="mt-5 space-y-4">
            {blocosAplicacao.length > 0 ? (
              blocosAplicacao.map((bloco, i) => <BlocoRenderer key={i} bloco={bloco} />)
            ) : (
              <EmptyBlock label="Aplicação profissional em preparação." />
            )}
            {fase?.observacao_clinica && (
              <Card className="bg-card/40 border-border/30">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-muted-foreground/70 mb-2 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5" /> Observação Clínica
                  </p>
                  <div
                    className="prose prose-sm prose-invert max-w-none text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(fase.observacao_clinica.replace(/\n/g, '<br/>')) }}
                  />
                </CardContent>
              </Card>
            )}
            {fase?.lista_uso_inadequado && fase.lista_uso_inadequado.length > 0 && (
              <Card className="bg-amber-500/5 border-amber-500/15">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-amber-300/80 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Uso Inadequado
                  </p>
                  <ul className="space-y-1">
                    {fase.lista_uso_inadequado.map((item, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-amber-400/60 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ── TAB: Jardim da Psique ── */}
          <TabsContent value="jardim-psique" className="mt-5">
            <div className="text-center py-8">
              <Flower2 className="w-8 h-8 text-rose-400/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                Registre seus insights pessoais sobre esta travessia.
              </p>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => navigate('/jardim-da-psique')}
              >
                <Pen className="w-4 h-4" />
                Ir ao Jardim da Psique
              </Button>
            </div>
          </TabsContent>

          {/* ── TAB: Jardim do Ofício ── */}
          <TabsContent value="jardim-oficio" className="mt-5">
            <div className="text-center py-8">
              <Briefcase className="w-8 h-8 text-teal-400/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                Registre aplicações profissionais desta porta.
              </p>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => navigate('/jardim-do-oficio')}
              >
                <Pen className="w-4 h-4" />
                Ir ao Jardim do Ofício
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

// ════════════════════════════════════════
// Sub-components
// ════════════════════════════════════════

function PlayerSection({
  faixas, activeFaixaIndex, isPlaying, currentTime, duration, isMuted, audioRef,
  onTogglePlay, onSkip, onSeek, onSelectFaixa, onToggleMute,
}: {
  faixas: any[];
  activeFaixaIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isMuted: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
  onTogglePlay: () => void;
  onSkip: (s: number) => void;
  onSeek: (v: number[]) => void;
  onSelectFaixa: (i: number) => void;
  onToggleMute: () => void;
}) {
  const activeFaixa = faixas[activeFaixaIndex];
  return (
    <div className="space-y-4">
      <Card className="bg-card/60 border-border/30 p-5 relative overflow-hidden">
        {/* Resonance inside player */}
        {isPlaying && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, hsl(var(--gold) / 0.08) 0%, transparent 60%)',
              animation: 'resonance-breathe 4s ease-in-out infinite',
              willChange: 'opacity',
              transform: 'translateZ(0)',
            }}
          />
        )}
        <div className="relative">
          <p className="text-xs text-muted-foreground mb-1">
            Faixa {activeFaixaIndex + 1} de {faixas.length}
          </p>
          <p className="text-sm font-medium text-foreground mb-4 truncate">
            {activeFaixa?.titulo}
          </p>
          <Slider value={[currentTime]} max={duration || 1} step={0.1} onValueChange={onSeek} className="mb-2" />
          <div className="flex justify-between text-xs text-muted-foreground mb-4">
            <span>{formatAudioTime(currentTime)}</span>
            <span>{duration > 0 ? formatAudioTime(duration) : '--:--'}</span>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground" onClick={() => onSkip(-15)}>
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button size="icon" onClick={onTogglePlay} className="h-12 w-12 rounded-full bg-gold/20 text-gold hover:bg-gold/30">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground" onClick={() => onSkip(15)}>
              <SkipForward className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground ml-2" onClick={onToggleMute}>
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </Card>

      {/* Track list */}
      <div className="space-y-1">
        {faixas.map((faixa, i) => {
          const isActive = i === activeFaixaIndex;
          return (
            <button
              key={faixa.id}
              onClick={() => onSelectFaixa(i)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                isActive ? "bg-gold/10 border border-gold/20" : "hover:bg-muted/20 border border-transparent"
              )}
            >
              <span className={cn("text-xs font-mono w-5 text-center shrink-0", isActive ? "text-gold" : "text-muted-foreground")}>
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm truncate", isActive ? "text-foreground font-medium" : "text-foreground/80")}>
                  {faixa.titulo}
                </p>
              </div>
              {faixa.duracao_segundos && (
                <span className="text-xs text-muted-foreground shrink-0">{Math.floor(faixa.duracao_segundos / 60)}min</span>
              )}
              {isActive && isPlaying && <span className="w-2 h-2 rounded-full bg-gold shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AlertaClinicoBlock({ fase }: { fase: any }) {
  return (
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
      </CollapsibleContent>
    </Collapsible>
  );
}

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
        <span className="text-sm font-display text-foreground flex-1">{bloco.titulo || config.label}</span>
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

function EmptyBlock({ label }: { label: string }) {
  return (
    <Card className="bg-muted/10 border-dashed">
      <CardContent className="py-8 text-center">
        <Sparkles className="w-6 h-6 text-muted-foreground/30 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground/60 italic">{label}</p>
      </CardContent>
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
