import { useState } from 'react';
import { Headphones, Sparkles, PenLine, Leaf, ExternalLink, Loader2, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { ConteudoSemanal } from '@/hooks/useClubeOracular';

interface Props {
  conteudo: ConteudoSemanal | null | undefined;
  onSalvarReflexao: (texto: string) => void;
  salvando: boolean;
}

export function ClubeConteudoSemanal({ conteudo, onSalvarReflexao, salvando }: Props) {
  const [reflexaoTexto, setReflexaoTexto] = useState('');

  if (!conteudo) {
    return (
      <Card className="border-dashed border-border/15 bg-card/30 backdrop-blur-sm">
        <CardContent className="py-16 text-center">
          <div className="w-11 h-11 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-5 h-5 text-muted-foreground/30" />
          </div>
          <p className="text-muted-foreground text-sm">
            O conteúdo semanal será publicado em breve.
          </p>
          <p className="text-muted-foreground/40 text-xs mt-1.5">
            A cada semana, um novo território se abre.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleSalvar = () => {
    if (!reflexaoTexto.trim()) return;
    onSalvarReflexao(reflexaoTexto.trim());
    setReflexaoTexto('');
  };

  const cardBase = "border-border/10 bg-card/40 backdrop-blur-sm hover:-translate-y-1 hover:shadow-[0_8px_25px_-8px_hsl(var(--foreground)/0.06)] transition-all duration-500";

  return (
    <div className="space-y-10">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-gold/50 to-mystic/30" />
        <h2 className="text-xs uppercase tracking-[0.25em] text-muted-foreground/70 font-medium">
          Conteúdo da Semana {conteudo.semana_numero}
        </h2>
      </div>

      {/* Podcast */}
      {conteudo.podcast_titulo && (
        <Card className={cardBase}>
          <CardContent className="p-7">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-primary/8 border border-primary/10 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 mb-1.5">
                  Podcast Oracular
                </p>
                <h3 className="font-display text-sm text-foreground mb-2">{conteudo.podcast_titulo}</h3>
                {conteudo.podcast_descricao && (
                  <p className="text-xs text-muted-foreground/60 leading-relaxed mb-3">{conteudo.podcast_descricao}</p>
                )}
                {conteudo.podcast_audio_url && (
                  <audio controls className="w-full h-10 mb-2" src={conteudo.podcast_audio_url} />
                )}
                {conteudo.podcast_externo_url && (
                  <a
                    href={conteudo.podcast_externo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-gold/70 transition-colors"
                  >
                    Ouvir na plataforma externa <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Carta da Semana */}
      {conteudo.carta_nome && (
        <Card className={cardBase}>
          <CardContent className="p-7">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-gold/8 border border-gold/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-gold" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 mb-1.5">
                  A Carta da Semana
                </p>
                <h3 className="font-display text-sm text-foreground mb-3">{conteudo.carta_nome}</h3>
                {conteudo.carta_imagem_url && (
                  <img
                    src={conteudo.carta_imagem_url}
                    alt={conteudo.carta_nome}
                    className="w-32 h-44 object-cover rounded-lg shadow-md mb-4"
                    loading="lazy"
                  />
                )}
                {conteudo.carta_descricao_simbolica && (
                  <p className="text-sm text-muted-foreground/70 italic leading-relaxed font-display">
                    "{conteudo.carta_descricao_simbolica}"
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pergunta Contemplativa */}
      {conteudo.pergunta_contemplativa && (
        <Card className="border-mystic/10 bg-card/40 backdrop-blur-sm">
          <CardContent className="p-7">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-mystic/8 border border-mystic/10 flex items-center justify-center shrink-0">
                <PenLine className="w-5 h-5 text-mystic" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 mb-1.5">
                  Sua Reflexão da Semana
                </p>
                <p className="font-display text-sm text-foreground leading-relaxed mb-6 italic">
                  "{conteudo.pergunta_contemplativa}"
                </p>
                <Textarea
                  value={reflexaoTexto}
                  onChange={(e) => setReflexaoTexto(e.target.value)}
                  placeholder="Escreva aqui suas percepções, sentimentos e insights..."
                  className="min-h-[110px] bg-background/50 border-border/20 focus:border-mystic/25 mb-3 text-sm"
                />
                <Button
                  onClick={handleSalvar}
                  disabled={!reflexaoTexto.trim() || salvando}
                  size="sm"
                  className="gap-2 bg-gradient-to-r from-gold to-mystic hover:scale-105 text-primary-foreground border border-gold/20 transition-all duration-300"
                >
                  {salvando ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                  Salvar Reflexão
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prática Terapêutica */}
      {conteudo.pratica_titulo && (
        <Card className={cardBase}>
          <CardContent className="p-7">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-primary/8 border border-primary/10 flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 mb-1.5">
                  Prática da Semana
                </p>
                <h3 className="font-display text-sm text-foreground mb-2">{conteudo.pratica_titulo}</h3>
                {conteudo.pratica_descricao && (
                  <p className="text-xs text-muted-foreground/60 leading-relaxed mb-4">{conteudo.pratica_descricao}</p>
                )}
                {conteudo.pratica_guia_url && (
                  <Button variant="outline" size="sm" className="gap-2 border-gold/15 hover:bg-gold/5 hover:border-gold/25 transition-all duration-300" asChild>
                    <a href={conteudo.pratica_guia_url} target="_blank" rel="noopener noreferrer">
                      Acessar Guia da Prática
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
