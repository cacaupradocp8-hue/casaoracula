import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useSyntheiaGenerate, useSyntheiaLibrary } from '@/hooks/useSyntheia';
import { useAuth } from '@/contexts/AuthContext';
import { SyntheiaResult } from '@/components/syntheia/SyntheiaResult';
import type { 
  SyntheiaTipo, 
  SyntheiaPublicoAlvo, 
  SyntheiaMomentoJornada, 
  SyntheiaTempoDisponivel,
  SyntheiaFormData,
  SyntheiaGeneratedContent
} from '@/types/syntheia';
import { TIPO_OPTIONS, PUBLICO_OPTIONS, MOMENTO_OPTIONS, TEMPO_OPTIONS } from '@/types/syntheia';

export default function SyntheiaCriar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { generate, isGenerating } = useSyntheiaGenerate();
  const { saveCreation } = useSyntheiaLibrary();

  const initialTipo = (searchParams.get('tipo') as SyntheiaTipo) || 'sessao_individual';

  const [formData, setFormData] = useState<SyntheiaFormData>({
    tipo: initialTipo,
    publico_alvo: 'mulher_individual',
    momento_jornada: 'inicio',
    tempo_disponivel: '50min',
    tema_principal: '',
  });

  const [generatedContent, setGeneratedContent] = useState<SyntheiaGeneratedContent | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tema_principal.trim()) return;

    const result = await generate(formData);
    if (result) {
      setGeneratedContent(result);
    }
  };

  const handleSave = async () => {
    if (!user?.id || !generatedContent) return;

    await saveCreation.mutateAsync({
      user_id: user.id,
      ...formData,
      ...generatedContent,
      tags: [],
    });
  };

  const handleNewCreation = () => {
    setGeneratedContent(null);
    setFormData(prev => ({ ...prev, tema_principal: '' }));
  };

  const tipoLabel = TIPO_OPTIONS.find(t => t.value === formData.tipo)?.label || formData.tipo;

  if (generatedContent) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <SyntheiaResult
            content={generatedContent}
            formData={formData}
            onSave={handleSave}
            onNew={handleNewCreation}
            isSaving={saveCreation.isPending}
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/syntheia')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Criar {tipoLabel}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Público-alvo */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Público-alvo</Label>
                <RadioGroup
                  value={formData.publico_alvo}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, publico_alvo: value as SyntheiaPublicoAlvo }))}
                  className="grid gap-2"
                >
                  {PUBLICO_OPTIONS.map(option => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`publico-${option.value}`} />
                      <Label htmlFor={`publico-${option.value}`} className="cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Momento da jornada */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Momento da jornada</Label>
                <RadioGroup
                  value={formData.momento_jornada}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, momento_jornada: value as SyntheiaMomentoJornada }))}
                  className="grid grid-cols-2 gap-2"
                >
                  {MOMENTO_OPTIONS.map(option => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`momento-${option.value}`} />
                      <Label htmlFor={`momento-${option.value}`} className="cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Tempo disponível */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Tempo disponível</Label>
                <RadioGroup
                  value={formData.tempo_disponivel}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, tempo_disponivel: value as SyntheiaTempoDisponivel }))}
                  className="grid grid-cols-2 gap-2"
                >
                  {TEMPO_OPTIONS.map(option => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`tempo-${option.value}`} />
                      <Label htmlFor={`tempo-${option.value}`} className="cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Tema principal */}
              <div className="space-y-3">
                <Label htmlFor="tema" className="text-base font-medium">
                  Tema principal
                </Label>
                <Input
                  id="tema"
                  placeholder="Ex: luto, transição, identidade, limites, bloqueio criativo..."
                  value={formData.tema_principal}
                  onChange={(e) => setFormData(prev => ({ ...prev, tema_principal: e.target.value }))}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full gap-2"
                disabled={isGenerating || !formData.tema_principal.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Gerando estrutura...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Gerar estrutura
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
