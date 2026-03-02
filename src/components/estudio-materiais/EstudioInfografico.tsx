import { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Sparkles, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';

interface Props {
  estrutura: any;
  livroTitulo: string;
  projectId?: string | null;
  onImageGenerated?: (url: string) => void;
}

export default function EstudioInfografico({ estrutura, livroTitulo, projectId, onImageGenerated }: Props) {
  const infRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [aiImageUrl, setAiImageUrl] = useState<string | null>(null);

  const handleDownloadHtml = async () => {
    if (!infRef.current) return;
    try {
      const canvas = await html2canvas(infRef.current, { scale: 2 });
      const link = document.createElement('a');
      link.download = 'infografico.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const handleDownloadAi = () => {
    if (!aiImageUrl) return;
    const link = document.createElement('a');
    link.download = `infografico-ilustrado-${livroTitulo.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = aiImageUrl;
    link.target = '_blank';
    link.click();
  };

  const gerarInfograficoIlustrado = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('estudio-gerar-infografico', {
        body: {
          estrutura,
          livro_titulo: livroTitulo,
          project_id: projectId,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setAiImageUrl(data.image_url);
      onImageGenerated?.(data.image_url);
      toast({ title: 'Infográfico ilustrado gerado!' });
    } catch (err: any) {
      toast({ title: 'Erro ao gerar', description: err.message, variant: 'destructive' });
    } finally {
      setGenerating(false);
    }
  };

  if (!estrutura) return null;

  const encontros = estrutura.encontros || [];

  return (
    <div className="space-y-6 mt-4">
      {/* AI Illustrated Infographic Section */}
      <Card className="border-primary/20 bg-card/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Infográfico Ilustrado Premium</h3>
              <p className="text-xs text-muted-foreground">
                Gere um infográfico visual com ilustrações arquetípicas via IA
              </p>
            </div>
          </div>

          {aiImageUrl ? (
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden border border-border">
                <img
                  src={aiImageUrl}
                  alt={`Infográfico ilustrado: ${livroTitulo}`}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={gerarInfograficoIlustrado} disabled={generating} className="gap-2">
                  <Sparkles className="w-4 h-4" /> Regenerar
                </Button>
                <Button size="sm" onClick={handleDownloadAi} className="gap-2">
                  <Download className="w-4 h-4" /> Baixar Ilustrado
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={gerarInfograficoIlustrado}
              disabled={generating}
              className="w-full gap-2 h-12"
              variant="outline"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Gerando infográfico ilustrado...
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4" />
                  Gerar Infográfico Ilustrado com IA
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Classic HTML Infographic */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-muted-foreground">Versão Esquemática</p>
          <Button size="sm" variant="outline" onClick={handleDownloadHtml} className="gap-2">
            <Download className="w-4 h-4" /> Baixar PNG
          </Button>
        </div>

        <div className="flex justify-center">
          <div
            ref={infRef}
            className="w-[480px]"
            style={{ fontFamily: 'Georgia, serif', backgroundColor: '#F4EFE6' }}
          >
            {/* Header */}
            <div
              className="text-center py-8 px-6"
              style={{ backgroundColor: '#1F3D3A', color: '#F4EFE6' }}
            >
              <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: '#C6A75E' }}>
                Método de Leitura Oracular
              </p>
              <h1 className="text-xl font-bold mb-1">{estrutura.titulo_pedagogico || livroTitulo}</h1>
              <p className="text-xs opacity-70">{livroTitulo}</p>
            </div>

            {/* Essence block */}
            <div className="px-6 py-5 border-b" style={{ borderColor: '#C6A75E44' }}>
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: '#C6A75E' }}
                >
                  <span className="text-xs font-bold" style={{ color: '#1F3D3A' }}>✦</span>
                </div>
                <div>
                  <p className="text-xs font-bold mb-1" style={{ color: '#1F3D3A' }}>Tese Central</p>
                  <p className="text-[11px] leading-relaxed" style={{ color: '#1E2F3F' }}>
                    {estrutura.essencia_8020?.substring(0, 200)}...
                  </p>
                </div>
              </div>
            </div>

            {/* Tensions */}
            {estrutura.tensoes_centrais?.length > 0 && (
              <div className="px-6 py-4 border-b" style={{ borderColor: '#C6A75E44' }}>
                <p className="text-xs font-bold mb-2" style={{ color: '#1F3D3A' }}>Tensão Principal</p>
                <div className="flex flex-wrap gap-1.5">
                  {estrutura.tensoes_centrais.slice(0, 4).map((t: string, i: number) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-1 rounded"
                      style={{ backgroundColor: '#1E2F3F', color: '#F4EFE6' }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Archetypes */}
            {estrutura.arquetipos_envolvidos?.length > 0 && (
              <div className="px-6 py-4 border-b" style={{ borderColor: '#C6A75E44' }}>
                <p className="text-xs font-bold mb-2" style={{ color: '#1F3D3A' }}>Campos Arquetípicos</p>
                <div className="flex flex-wrap gap-1.5">
                  {estrutura.arquetipos_envolvidos.map((a: string, i: number) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-1 rounded border"
                      style={{ borderColor: '#C6A75E', color: '#1F3D3A' }}
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Encounters timeline */}
            <div className="px-6 py-4 border-b" style={{ borderColor: '#C6A75E44' }}>
              <p className="text-xs font-bold mb-3" style={{ color: '#1F3D3A' }}>Estrutura de Encontros</p>
              <div className="space-y-3">
                {encontros.map((enc: any, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                        style={{ backgroundColor: '#C6A75E', color: '#1F3D3A' }}
                      >
                        {enc.numero}
                      </div>
                      {i < encontros.length - 1 && (
                        <div className="w-0.5 h-6" style={{ backgroundColor: '#C6A75E44' }} />
                      )}
                    </div>
                    <div className="flex-1 pb-1">
                      <p className="text-[11px] font-bold" style={{ color: '#1F3D3A' }}>{enc.titulo}</p>
                      <p className="text-[10px]" style={{ color: '#C6A75E' }}>{enc.fase}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Application */}
            {encontros[0]?.aplicacao_profissional && (
              <div className="px-6 py-4 border-b" style={{ borderColor: '#C6A75E44' }}>
                <p className="text-xs font-bold mb-1" style={{ color: '#1F3D3A' }}>Aplicação Prática</p>
                <p className="text-[10px] leading-relaxed" style={{ color: '#1E2F3F' }}>
                  {encontros[0].aplicacao_profissional.substring(0, 150)}...
                </p>
              </div>
            )}

            {/* Footer */}
            <div
              className="text-center py-4 px-6"
              style={{ backgroundColor: '#1F3D3A', color: '#C6A75E' }}
            >
              <p className="text-[10px] tracking-wide">✦ Método de Leitura Oracular — Casa Orácula ✦</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
