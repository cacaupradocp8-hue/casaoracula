import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, Wand2, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface SymbolicFocus {
  id: string;
  nome: string;
  descricao: string;
  ordem: number;
}

interface OracleImageGeneratorProps {
  cardId?: string;
  currentImageUrl?: string | null;
  currentSymbolicFocus?: string | null;
  onImageGenerated?: (imageUrl: string, symbolicFocus: string) => void;
  previewMode?: boolean;
}

export function OracleImageGenerator({
  cardId,
  currentImageUrl,
  currentSymbolicFocus,
  onImageGenerated,
  previewMode = false,
}: OracleImageGeneratorProps) {
  const { toast } = useToast();
  const [symbolicFocuses, setSymbolicFocuses] = useState<SymbolicFocus[]>([]);
  const [selectedFocus, setSelectedFocus] = useState<string>(currentSymbolicFocus || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFocuses, setIsLoadingFocuses] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(currentImageUrl || null);

  useEffect(() => {
    fetchSymbolicFocuses();
  }, []);

  useEffect(() => {
    if (currentSymbolicFocus) {
      setSelectedFocus(currentSymbolicFocus);
    }
  }, [currentSymbolicFocus]);

  const fetchSymbolicFocuses = async () => {
    try {
      const { data, error } = await supabase
        .from('oracle_symbolic_focuses')
        .select('*')
        .eq('ativo', true)
        .order('ordem');

      if (error) throw error;
      setSymbolicFocuses(data || []);
    } catch (error) {
      console.error('Error fetching symbolic focuses:', error);
      toast({
        title: 'Erro ao carregar focos simbólicos',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingFocuses(false);
    }
  };

  const handleGeneratePreview = async () => {
    if (!selectedFocus) {
      toast({
        title: 'Selecione um foco simbólico',
        description: 'Escolha um elemento arquetípico para gerar a imagem.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setPreviewImage(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-oracle-image', {
        body: {
          symbolic_focus: selectedFocus,
          preview_only: true,
        },
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      setPreviewImage(data.image_base64);
      toast({ title: 'Pré-visualização gerada!' });
    } catch (err) {
      console.error('Error generating preview:', err);
      toast({
        title: 'Erro ao gerar imagem',
        description: err instanceof Error ? err.message : 'Tente novamente',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveImage = async () => {
    if (!cardId) {
      // If in preview mode without card, just notify parent
      if (previewImage && onImageGenerated) {
        onImageGenerated(previewImage, selectedFocus);
      }
      return;
    }

    if (!selectedFocus) {
      toast({
        title: 'Selecione um foco simbólico',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-oracle-image', {
        body: {
          card_id: cardId,
          symbolic_focus: selectedFocus,
          preview_only: false,
        },
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      setGeneratedImageUrl(data.image_url);
      setPreviewImage(null);
      
      if (onImageGenerated) {
        onImageGenerated(data.image_url, selectedFocus);
      }

      toast({ title: 'Imagem salva com sucesso!' });
    } catch (err) {
      console.error('Error saving image:', err);
      toast({
        title: 'Erro ao salvar imagem',
        description: err instanceof Error ? err.message : 'Tente novamente',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedFocusData = symbolicFocuses.find(f => f.nome === selectedFocus);

  return (
    <Card className="border-dashed border-gold/30 bg-gold/5">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-gold" />
          <Label className="text-sm font-medium text-gold">Geração Visual com DNA Oracular</Label>
        </div>

        {/* Symbolic Focus Selector */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Foco Simbólico (único elemento variável)
          </Label>
          <Select 
            value={selectedFocus} 
            onValueChange={setSelectedFocus}
            disabled={isLoading || isLoadingFocuses}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Selecione o elemento arquetípico..." />
            </SelectTrigger>
            <SelectContent>
              {symbolicFocuses.map(focus => (
                <SelectItem key={focus.id} value={focus.nome}>
                  <div className="flex flex-col">
                    <span className="capitalize">{focus.nome}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedFocusData && (
            <p className="text-xs text-muted-foreground italic">
              {selectedFocusData.descricao}
            </p>
          )}
        </div>

        {/* Preview Area */}
        <div className="space-y-3">
          {(previewImage || generatedImageUrl) && (
            <div className="relative rounded-lg overflow-hidden border border-border aspect-square max-w-[200px] mx-auto">
              <img
                src={previewImage || generatedImageUrl || ''}
                alt="Oracle card preview"
                className="w-full h-full object-cover"
              />
              {previewImage && !generatedImageUrl && (
                <Badge className="absolute top-2 right-2 bg-amber-500/90 text-xs">
                  Pré-visualização
                </Badge>
              )}
              {generatedImageUrl && !previewImage && (
                <Badge className="absolute top-2 right-2 bg-emerald-500/90 text-xs gap-1">
                  <Check className="w-3 h-3" />
                  Salva
                </Badge>
              )}
            </div>
          )}

          {!previewImage && !generatedImageUrl && (
            <div className="border border-dashed border-border rounded-lg aspect-square max-w-[200px] mx-auto flex items-center justify-center bg-secondary/30">
              <div className="text-center text-muted-foreground p-4">
                <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">Nenhuma imagem gerada</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGeneratePreview}
            disabled={!selectedFocus || isLoading}
            className="flex-1 gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {previewImage ? 'Regenerar' : 'Gerar Preview'}
          </Button>
          
          {previewImage && cardId && (
            <Button
              type="button"
              size="sm"
              onClick={handleSaveImage}
              disabled={isLoading}
              className="flex-1 gap-2 bg-gold hover:bg-gold/90 text-background"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Aplicar
            </Button>
          )}
        </div>

        {/* Info */}
        <div className="flex items-start gap-2 p-2 rounded bg-secondary/50 text-xs text-muted-foreground">
          <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
          <p>
            O prompt-mãe visual é fixo e imutável. Apenas o foco simbólico varia por carta, 
            garantindo coerência visual em todo o oráculo.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
