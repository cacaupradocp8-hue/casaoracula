import { useState } from 'react';
import { Headphones, Sparkles, PenLine, Leaf, ExternalLink, Loader2 } from 'lucide-react';
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
      <Card className="border-border/20">
        <CardContent className="py-10 text-center">
          <p className="text-muted-foreground text-sm">
            O conteúdo semanal será publicado em breve.
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

  return (
    <div className="space-y-6">
      <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
        Conteúdo da Semana {conteudo.semana_numero}
      </h2>

      {/* Podcast */}
      {conteudo.podcast_titulo && (
        <Card className="border-border/20">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Podcast Oracular</p>
                <h3 className="font-medium text-foreground text-sm mb-1">{conteudo.podcast_titulo}</h3>
                {conteudo.podcast_descricao && (
                  <p className="text-xs text-muted-foreground mb-3">{conteudo.podcast_descricao}</p>
                )}
                {conteudo.podcast_audio_url && (
                  <audio controls className="w-full h-10 mb-2" src={conteudo.podcast_audio_url} />
                )}
                {conteudo.podcast_externo_url && (
                  <a
                    href={conteudo.podcast_externo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
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
        <Card className="border-border/20">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">A Carta da Semana</p>
                <h3 className="font-medium text-foreground text-sm mb-2">{conteudo.carta_nome}</h3>
                {conteudo.carta_imagem_url && (
                  <img
                    src={conteudo.carta_imagem_url}
                    alt={conteudo.carta_nome}
                    className="w-32 h-44 object-cover rounded-lg shadow-md mb-3"
                  />
                )}
                {conteudo.carta_descricao_simbolica && (
                  <p className="text-sm text-muted-foreground/80 italic leading-relaxed">
                    {conteudo.carta_descricao_simbolica}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pergunta Contemplativa */}
      {conteudo.pergunta_contemplativa && (
        <Card className="border-primary/10 bg-primary/[0.02]">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <PenLine className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Sua Reflexão da Semana</p>
                <p className="text-sm text-foreground font-medium mb-4 leading-relaxed">
                  {conteudo.pergunta_contemplativa}
                </p>
                <Textarea
                  value={reflexaoTexto}
                  onChange={(e) => setReflexaoTexto(e.target.value)}
                  placeholder="Escreva aqui suas percepções e insights..."
                  className="min-h-[100px] bg-background/50 mb-3"
                />
                <Button
                  onClick={handleSalvar}
                  disabled={!reflexaoTexto.trim() || salvando}
                  size="sm"
                  className="gap-2"
                >
                  {salvando ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                  Salvar Reflexão
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prática Terapêutica */}
      {conteudo.pratica_titulo && (
        <Card className="border-border/20">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Prática da Semana</p>
                <h3 className="font-medium text-foreground text-sm mb-1">{conteudo.pratica_titulo}</h3>
                {conteudo.pratica_descricao && (
                  <p className="text-xs text-muted-foreground mb-3">{conteudo.pratica_descricao}</p>
                )}
                {conteudo.pratica_guia_url && (
                  <Button variant="outline" size="sm" asChild>
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
