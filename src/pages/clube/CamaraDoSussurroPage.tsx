import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Play, Clock, Trophy, Flame, Music,
  Sparkles, Compass, MessageCircle, BookOpen, FlaskConical, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useCamaraCases } from '@/components/treinamento/simulador/useCamaraCases';
import { SimuladorClube } from '@/components/treinamento/simulador/SimuladorClube';
import { TrainingCase } from '@/components/treinamento/simulador/types';
import { cn } from '@/lib/utils';
import { ConversaoCTA } from '@/components/treinamento/simulador/ConversaoCTA';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Laboratorio8020Modal } from '@/components/clube/Laboratorio8020Modal';
import { useAllBooks } from '@/hooks/useBooks';
import { SpotifyPlaylistEmbed } from '@/components/clube/SpotifyPlaylistEmbed';

export default function CamaraDoSussurroPage() {
  const [activeCase, setActiveCase] = useState<TrainingCase | null>(null);
  const { data: allCases = [] } = useCamaraCases();
  const { data: books = [] } = useAllBooks();
  const [searchParams] = useSearchParams();

  const rotaParam = searchParams.get('rota');
  const estacaoParam = searchParams.get('estacao');
  const modoParam = searchParams.get('modo');
  const isAprofundamento =
    rotaParam === 'rota-dos-lobos' &&
    estacaoParam === 'clareira-do-chamado' &&
    modoParam === 'aprofundamento';

  const matchesAprofundamento = (caso: TrainingCase) => {
    const raw: any = (caso as any).rawCamara || {};
    const categoria = String(raw.categoria || '').toLowerCase();
    if (categoria.includes('clareira-do-chamado') && categoria.includes('aprofundamento')) return true;
    const haystack = [
      raw.rota_slug, raw.estacao_slug, raw.modo, raw.tag, raw.tags,
      caso.tema, caso.title
    ].filter(Boolean).join(' ').toLowerCase();
    return haystack.includes('clareira-do-chamado') || haystack.includes('clareira do chamado');
  };

  const handleBack = () => {
    if (activeCase) {
      setActiveCase(null);
    } else {
      window.history.back();
    }
  };

  if (activeCase) {
    return (
      <div className="min-h-screen bg-background">
        <SimuladorClube 
          caso={activeCase} 
          onExit={handleBack}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pattern-geometric">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8 md:space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.history.back()}
              className="p-0 h-auto text-primary hover:text-primary-foreground hover:bg-primary/10 transition-colors -ml-1 mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Voltar ao Clube
            </Button>
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-display tracking-wide text-foreground">
                Câmara do <span className="text-primary italic">Sussurro</span>
              </h1>
              <p className="text-muted-foreground text-xs tracking-widest uppercase font-medium">
                {isAprofundamento ? 'Aprofundamento · Clareira do Chamado' : 'Pratique a escuta imersiva com as obras do Clube do Livro.'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-card border border-border rounded-2xl px-4 md:px-6 py-3 md:py-4 shadow-soft self-start">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-primary">
                <Trophy className="w-4 h-4" />
                <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase font-body">CLUBE</span>
              </div>
              <Progress value={20} className="w-20 md:w-24 h-1.5 bg-muted" />
            </div>
          </div>
        </header>

        <section className="space-y-8 animate-fade-in">
          <div className="grid gap-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-primary/40 mb-2">Obras em Estudo</h2>
            
            {allCases.length === 0 ? (
              <div className="h-64 rounded-[2.5rem] bg-card/70 border border-dashed border-border flex items-center justify-center">
                <p className="text-sm text-muted-foreground italic font-body">Aguardando novos sussurros das obras...</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {allCases.filter(c => c.nivel_produto === 'clube').filter(c => !isAprofundamento || matchesAprofundamento(c)).map((caso) => {
                  const correspondingBook = books.find(b => b.title.toLowerCase().includes(caso.title.toLowerCase()) || caso.title.toLowerCase().includes(b.title.toLowerCase()));
                  const raw: any = (caso as any).rawCamara || {};
                  const isSonoro = String(raw.categoria || '').toLowerCase().includes('sussurro-sonoro')
                    || String(caso.title || '').toLowerCase().includes('sussurro sonoro');
                  
                  return (
                    <div 
                      key={caso.id}
                      className="group relative overflow-hidden rounded-3xl md:rounded-[2.5rem] border border-border bg-card/60 backdrop-blur-sm transition-all duration-700 hover:border-primary/40 hover:shadow-glow p-5 md:p-8 flex flex-col md:flex-row items-stretch md:items-start justify-between gap-5 md:gap-6"
                    >
                      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[80px] -z-10 group-hover:bg-primary/10 transition-colors" />
                      
                      <div className="space-y-4 flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-bold tracking-widest uppercase">
                            {isSonoro ? 'Escuta Simbólica · Música' : 'OBRA DO CLUBE'}
                          </Badge>
                          <span className="text-muted-foreground text-xs flex items-center gap-1.5 font-body">
                            <Clock className="w-3.5 h-3.5" /> 5-10 min
                          </span>
                        </div>
                        <h3 className="text-lg md:text-xl font-display text-foreground group-hover:text-primary transition-colors duration-500">
                          {caso.title}
                        </h3>

                        {isSonoro && (
                          <div className="rounded-2xl border border-primary/15 bg-primary/[0.04] p-5 space-y-3">
                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-primary/70 font-bold">
                              <Music className="w-3.5 h-3.5" /> Música desta escuta
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-base font-display text-foreground">{raw.nome_musica || '—'}</span>
                              {raw.artista && (
                                <span className="text-xs text-muted-foreground italic">{raw.artista}</span>
                              )}
                            </div>
                            {raw.funcao_escuta && (
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                <span className="text-foreground/70 font-medium">Função da escuta: </span>
                                {raw.funcao_escuta}
                              </p>
                            )}
                            {(raw.embed_url || raw.spotify_url) && (
                              <div className="pt-2">
                                {raw.embed_url ? (
                                  <SpotifyPlaylistEmbed url={raw.embed_url} />
                                ) : (
                                  <SpotifyPlaylistEmbed url={raw.spotify_url} />
                                )}
                              </div>
                            )}
                            {raw.spotify_url && (
                              <a
                                href={raw.spotify_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                              >
                                Abrir no Spotify <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                              {raw.distrito_dominante && (
                                <div><span className="text-muted-foreground">Distrito: </span><span className="text-foreground/80">{raw.distrito_dominante}</span></div>
                              )}
                              {raw.torre_provavel && (
                                <div><span className="text-muted-foreground">Torre: </span><span className="text-foreground/80">{raw.torre_provavel}</span></div>
                              )}
                              {raw.pergunta_ideal && (
                                <div className="col-span-2"><span className="text-muted-foreground">Pergunta ideal: </span><span className="text-foreground/80 italic">"{raw.pergunta_ideal}"</span></div>
                              )}
                            </div>
                          </div>
                        )}

                        {!isSonoro && (
                          <p className="text-muted-foreground text-sm line-clamp-2 font-body leading-relaxed max-w-2xl">
                            {caso.tema || 'Prática de escuta ativa baseada nos conceitos da obra atual.'}
                          </p>
                        )}
                        
                        {correspondingBook && (
                          <div className="pt-2">
                            <Laboratorio8020Modal 
                              bookId={correspondingBook.id} 
                              bookTitle={correspondingBook.title} 
                            />
                          </div>
                        )}
                      </div>
                      <Button 
                        onClick={() => setActiveCase(caso)}
                        className="rounded-full px-10 py-7 bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-3 shadow-gold transition-all hover:scale-105 active:scale-95 shrink-0"
                      >
                        <Play className="w-4 h-4 fill-current" /> Iniciar Escuta
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card/50 border border-border rounded-2xl p-8 space-y-4 hover:border-primary/20 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h4 className="font-display text-lg text-foreground">Reflexões do Círculo</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-body">Discussões recentes sobre os sussurros das obras.</p>
              </div>
            </div>
            <div className="bg-card/50 border border-border rounded-2xl p-8 space-y-4 hover:border-primary/20 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h4 className="font-display text-lg text-foreground">Biblioteca de Apoio</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-body">Materiais complementares para aprofundar a escuta.</p>
              </div>
            </div>
            <div className="bg-card/50 border border-border rounded-2xl p-8 space-y-4 hover:border-primary/20 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h4 className="font-display text-lg text-foreground">Maestria da Escuta</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-body">Seu progresso no desenvolvimento da escuta clínica.</p>
              </div>
            </div>
          </div>

          <div className="pt-10">
            <ConversaoCTA type="concluido" />
          </div>
        </section>
      </div>
    </div>
  );
}
