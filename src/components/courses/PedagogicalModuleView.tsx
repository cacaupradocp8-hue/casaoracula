import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Play,
  BookOpen,
  Wrench,
  FileText,
  Brain,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  LeituraCard,
  EstudoCaso,
  CheckMaturidade,
  FerramentaPratica,
} from '@/types/pedagogical-module';

// Simplified data type for PedagogicalModuleView
export interface PedagogicalModuleViewData {
  id: string;
  titulo: string;
  subtitulo?: string;
  descricao?: string;
  video_principal_url?: string;
  video_principal_titulo?: string;
  video_principal_duracao?: number;
  cards_leitura?: LeituraCard[];
  ferramenta_pratica?: FerramentaPratica | null;
  estudos_caso?: EstudoCaso[];
  check_maturidade?: CheckMaturidade[];
}

interface PedagogicalModuleViewProps {
  module: PedagogicalModuleViewData;
  courseId: string;
  onBack?: () => void;
}

export function PedagogicalModuleView({
  module,
  courseId,
  onBack,
}: PedagogicalModuleViewProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [checkResponses, setCheckResponses] = useState<Record<number, string>>({});
  const [checkCompleted, setCheckCompleted] = useState(false);

  const cards = module.cards_leitura || [];
  const casos = module.estudos_caso || [];
  const checks = module.check_maturidade || [];

  const getEmbedUrl = (url: string): string => {
    const youtubeMatch = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s]+)/
    );
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    return url;
  };

  const handleCheckChange = (index: number, value: string) => {
    setCheckResponses((prev) => ({ ...prev, [index]: value }));
  };

  const handleCompleteCheck = () => {
    setCheckCompleted(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar ao curso
        </button>
      )}

      {/* =========== HEADER =========== */}
      <header className="space-y-4">
        <Badge variant="secondary" className="gap-1">
          <BookOpen className="w-3 h-3" />
          Módulo Pedagógico
        </Badge>
        <h1 className="font-display text-4xl font-bold text-foreground">
          {module.titulo}
        </h1>
        {module.subtitulo && (
          <p className="text-xl text-muted-foreground">{module.subtitulo}</p>
        )}
        {module.descricao && (
          <p className="text-muted-foreground">{module.descricao}</p>
        )}
      </header>

      <Separator />

      {/* =========== BLOCK 1: VIDEO PRINCIPAL =========== */}
      {module.video_principal_url && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Play className="w-5 h-5 text-primary" />
            <span>Vídeo-Aula Principal</span>
            {module.video_principal_duracao && (
              <Badge variant="outline" className="ml-auto">
                {module.video_principal_duracao} min
              </Badge>
            )}
          </div>
          {module.video_principal_titulo && (
            <h3 className="text-xl font-medium">{module.video_principal_titulo}</h3>
          )}
          <Card className="aspect-video overflow-hidden bg-black/20">
            <iframe
              src={getEmbedUrl(module.video_principal_url)}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Card>
        </section>
      )}

      {/* =========== BLOCK 2: CARDS DE LEITURA =========== */}
      {cards.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <BookOpen className="w-5 h-5 text-accent" />
            <span>Resumo em Cards</span>
            <Badge variant="outline" className="ml-auto">
              {cards.length} cards
            </Badge>
          </div>

          {/* Carousel style */}
          <Card className="p-6">
            <div className="min-h-[200px] flex flex-col items-center justify-center text-center space-y-6">
              <Badge className="bg-primary/20 text-primary">
                Card {currentCardIndex + 1} de {cards.length}
              </Badge>
              <p className="text-lg leading-relaxed max-w-2xl">
                {cards[currentCardIndex]?.texto}
              </p>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentCardIndex((i) => Math.max(0, i - 1))}
                  disabled={currentCardIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex gap-1">
                  {cards.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentCardIndex(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i === currentCardIndex
                          ? 'bg-primary'
                          : 'bg-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentCardIndex((i) => Math.min(cards.length - 1, i + 1))
                  }
                  disabled={currentCardIndex === cards.length - 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* =========== BLOCK 3: FERRAMENTA PRÁTICA =========== */}
      {module.ferramenta_pratica && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Wrench className="w-5 h-5 text-green-400" />
            <span>Ferramenta Prática do Módulo</span>
          </div>
          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">
                  {module.ferramenta_pratica.nome}
                </h3>
                <p className="text-muted-foreground">
                  {module.ferramenta_pratica.descricao}
                </p>
              </div>
              <Link to={module.ferramenta_pratica.rota}>
                <Button className="gap-2 whitespace-nowrap">
                  <ExternalLink className="w-4 h-4" />
                  Acessar Ferramenta
                </Button>
              </Link>
            </div>
          </Card>
        </section>
      )}

      {/* =========== BLOCK 4: ESTUDOS DE CASO =========== */}
      {casos.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <FileText className="w-5 h-5 text-amber-400" />
            <span>Estudos de Caso</span>
          </div>
          <div className="space-y-4">
            {casos.map((caso, index) => (
              <Card key={index} className="p-6">
                <CardHeader className="p-0 pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    {caso.titulo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {caso.texto}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* =========== BLOCK 5: CHECK DE MATURIDADE =========== */}
      {checks.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Brain className="w-5 h-5 text-purple-400" />
            <span>Check de Maturidade</span>
          </div>

          <Card className="p-6 space-y-6 border-purple-400/30">
            <p className="text-sm text-muted-foreground italic text-center border border-border rounded-lg p-3 bg-muted/30">
              "Este check não avalia. Ele organiza percepção."
            </p>

            {checkCompleted ? (
              <div className="text-center space-y-4 py-8">
                <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto" />
                <p className="text-lg font-medium">Reflexão concluída!</p>
                <p className="text-muted-foreground">
                  Suas anotações ficam salvas apenas na sua memória.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setCheckCompleted(false)}
                >
                  Refazer reflexão
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {checks.map((check, index) => (
                    <div key={index} className="space-y-2">
                      <label className="text-sm font-medium flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-400/20 text-purple-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        {check.pergunta}
                      </label>
                      <Textarea
                        placeholder="Escreva sua reflexão..."
                        value={checkResponses[index] || ''}
                        onChange={(e) => handleCheckChange(index, e.target.value)}
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={handleCompleteCheck}
                    className="gap-2"
                    disabled={Object.keys(checkResponses).length === 0}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Concluir reflexão
                  </Button>
                </div>
              </>
            )}
          </Card>
        </section>
      )}
    </div>
  );
}
