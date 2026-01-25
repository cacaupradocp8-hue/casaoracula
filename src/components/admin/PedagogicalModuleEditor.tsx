import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Trash2,
  Play,
  BookOpen,
  Wrench,
  FileText,
  Brain,
  GripVertical,
  Save,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  PedagogicalModuleData,
  LeituraCard,
  EstudoCaso,
  CheckMaturidade,
  FerramentaPratica,
  PEDAGOGICAL_LIMITS,
} from '@/types/pedagogical-module';

interface PedagogicalModuleEditorProps {
  moduleId: string;
  onSave?: () => void;
  onClose?: () => void;
}

export function PedagogicalModuleEditor({
  moduleId,
  onSave,
  onClose,
}: PedagogicalModuleEditorProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [titulo, setTitulo] = useState('');
  const [subtitulo, setSubtitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  
  // Block 1: Video
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitulo, setVideoTitulo] = useState('');
  const [videoDuracao, setVideoDuracao] = useState<number | ''>('');
  
  // Block 2: Cards
  const [cards, setCards] = useState<LeituraCard[]>([]);
  
  // Block 3: Ferramenta
  const [ferramentaNome, setFerramentaNome] = useState('');
  const [ferramentaDescricao, setFerramentaDescricao] = useState('');
  const [ferramentaRota, setFerramentaRota] = useState('');
  
  // Block 4: Casos
  const [casos, setCasos] = useState<EstudoCaso[]>([]);
  
  // Block 5: Check
  const [checks, setChecks] = useState<CheckMaturidade[]>([]);

  useEffect(() => {
    fetchModule();
  }, [moduleId]);

  const fetchModule = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('course_modules')
        .select('*')
        .eq('id', moduleId)
        .single();

      if (error) throw error;

      if (data) {
        setTitulo(data.titulo || '');
        setSubtitulo((data as any).subtitulo || '');
        setDescricao(data.descricao || '');
        setVideoUrl((data as any).video_principal_url || '');
        setVideoTitulo((data as any).video_principal_titulo || '');
        setVideoDuracao((data as any).video_principal_duracao || '');
        
        const cardsData = (data as any).cards_leitura;
        setCards(Array.isArray(cardsData) ? cardsData : []);
        
        const ferramentaData = (data as any).ferramenta_pratica;
        if (ferramentaData && typeof ferramentaData === 'object') {
          setFerramentaNome(ferramentaData.nome || '');
          setFerramentaDescricao(ferramentaData.descricao || '');
          setFerramentaRota(ferramentaData.rota || '');
        }
        
        const casosData = (data as any).estudos_caso;
        setCasos(Array.isArray(casosData) ? casosData : []);
        
        const checksData = (data as any).check_maturidade;
        setChecks(Array.isArray(checksData) ? checksData : []);
      }
    } catch (error) {
      console.error('Error fetching module:', error);
      toast({ title: 'Erro ao carregar módulo', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const ferramenta = ferramentaNome
        ? { nome: ferramentaNome, descricao: ferramentaDescricao, rota: ferramentaRota }
        : null;

      // Cast to JSON-compatible format for Supabase
      const updateData = {
        titulo,
        subtitulo: subtitulo || null,
        descricao: descricao || null,
        formato_pedagogico: true,
        video_principal_url: videoUrl || null,
        video_principal_titulo: videoTitulo || null,
        video_principal_duracao: videoDuracao || null,
        cards_leitura: JSON.parse(JSON.stringify(cards)),
        ferramenta_pratica: ferramenta ? JSON.parse(JSON.stringify(ferramenta)) : null,
        estudos_caso: JSON.parse(JSON.stringify(casos)),
        check_maturidade: JSON.parse(JSON.stringify(checks)),
      };

      const { error } = await supabase
        .from('course_modules')
        .update(updateData)
        .eq('id', moduleId);

      if (error) throw error;

      toast({ title: 'Módulo pedagógico salvo!' });
      onSave?.();
    } catch (error) {
      console.error('Error saving module:', error);
      toast({ title: 'Erro ao salvar módulo', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  // Card handlers
  const addCard = () => {
    if (cards.length >= PEDAGOGICAL_LIMITS.MAX_CARDS) {
      toast({ title: `Máximo de ${PEDAGOGICAL_LIMITS.MAX_CARDS} cards`, variant: 'destructive' });
      return;
    }
    setCards([...cards, { numero: cards.length + 1, texto: '' }]);
  };

  const updateCard = (index: number, texto: string) => {
    const updated = [...cards];
    updated[index] = { ...updated[index], texto };
    setCards(updated);
  };

  const removeCard = (index: number) => {
    const updated = cards.filter((_, i) => i !== index);
    setCards(updated.map((c, i) => ({ ...c, numero: i + 1 })));
  };

  // Caso handlers
  const addCaso = () => {
    if (casos.length >= PEDAGOGICAL_LIMITS.MAX_CASE_STUDIES) {
      toast({ title: `Máximo de ${PEDAGOGICAL_LIMITS.MAX_CASE_STUDIES} estudos de caso`, variant: 'destructive' });
      return;
    }
    setCasos([...casos, { titulo: '', texto: '' }]);
  };

  const updateCaso = (index: number, field: keyof EstudoCaso, value: string) => {
    const updated = [...casos];
    updated[index] = { ...updated[index], [field]: value };
    setCasos(updated);
  };

  const removeCaso = (index: number) => {
    setCasos(casos.filter((_, i) => i !== index));
  };

  // Check handlers
  const addCheck = () => {
    if (checks.length >= PEDAGOGICAL_LIMITS.MAX_CHECK_QUESTIONS) {
      toast({ title: `Máximo de ${PEDAGOGICAL_LIMITS.MAX_CHECK_QUESTIONS} perguntas`, variant: 'destructive' });
      return;
    }
    setChecks([...checks, { pergunta: '' }]);
  };

  const updateCheck = (index: number, pergunta: string) => {
    const updated = [...checks];
    updated[index] = { pergunta };
    setChecks(updated);
  };

  const removeCheck = (index: number) => {
    setChecks(checks.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[80vh]">
      <div className="space-y-8 p-1">
        {/* Header */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Editor de Módulo Pedagógico
          </h2>
          
          <div className="grid gap-4">
            <div>
              <Label>Título do Módulo *</Label>
              <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Neuroplasticidade & Competências do Ego" />
            </div>
            <div>
              <Label>Subtítulo (opcional)</Label>
              <Input value={subtitulo} onChange={(e) => setSubtitulo(e.target.value)} placeholder="Uma linha de apoio..." />
            </div>
            <div>
              <Label>Descrição Curta</Label>
              <Textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={2} placeholder="Breve descrição do módulo..." />
            </div>
          </div>
        </div>

        <Separator />

        {/* Block 1: Video */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Play className="w-4 h-4 text-primary" />
              Bloco 1 — Vídeo-Aula Principal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>URL do Vídeo (YouTube/Vimeo)</Label>
              <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Título da Aula</Label>
                <Input value={videoTitulo} onChange={(e) => setVideoTitulo(e.target.value)} placeholder="Ex: Eixo, Trilha, Sentido" />
              </div>
              <div>
                <Label>Duração (minutos)</Label>
                <Input type="number" value={videoDuracao} onChange={(e) => setVideoDuracao(e.target.value ? parseInt(e.target.value) : '')} placeholder="15" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Block 2: Cards */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-accent" />
                Bloco 2 — Cards de Leitura Rápida
              </span>
              <Badge variant="outline">{cards.length}/{PEDAGOGICAL_LIMITS.MAX_CARDS}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cards.map((card, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex items-center gap-1 pt-2 text-muted-foreground">
                  <GripVertical className="w-4 h-4" />
                  <span className="text-sm w-6">{index + 1}.</span>
                </div>
                <Textarea
                  value={card.texto}
                  onChange={(e) => updateCard(index, e.target.value)}
                  rows={2}
                  className="flex-1"
                  placeholder="Texto do card..."
                />
                <Button variant="ghost" size="icon" onClick={() => removeCard(index)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addCard} disabled={cards.length >= PEDAGOGICAL_LIMITS.MAX_CARDS}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Card
            </Button>
          </CardContent>
        </Card>

        {/* Block 3: Ferramenta */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Wrench className="w-4 h-4 text-green-400" />
              Bloco 3 — Ferramenta Prática do Módulo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nome da Ferramenta</Label>
              <Input value={ferramentaNome} onChange={(e) => setFerramentaNome(e.target.value)} placeholder="Ex: Mapa da Plasticidade – 4 passos" />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea value={ferramentaDescricao} onChange={(e) => setFerramentaDescricao(e.target.value)} rows={2} placeholder="Breve explicação..." />
            </div>
            <div>
              <Label>Rota Interna (link para ferramenta)</Label>
              <Input value={ferramentaRota} onChange={(e) => setFerramentaRota(e.target.value)} placeholder="/ferramentas/mapa-plasticidade" />
            </div>
          </CardContent>
        </Card>

        {/* Block 4: Casos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                Bloco 4 — Estudos de Caso
              </span>
              <Badge variant="outline">{casos.length}/{PEDAGOGICAL_LIMITS.MAX_CASE_STUDIES}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {casos.map((caso, index) => (
              <div key={index} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Caso {index + 1}</span>
                  <Button variant="ghost" size="icon" onClick={() => removeCaso(index)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
                <Input
                  value={caso.titulo}
                  onChange={(e) => updateCaso(index, 'titulo', e.target.value)}
                  placeholder="Título do caso..."
                />
                <Textarea
                  value={caso.texto}
                  onChange={(e) => updateCaso(index, 'texto', e.target.value)}
                  rows={4}
                  placeholder="Descrição do caso..."
                />
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addCaso} disabled={casos.length >= PEDAGOGICAL_LIMITS.MAX_CASE_STUDIES}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Estudo de Caso
            </Button>
          </CardContent>
        </Card>

        {/* Block 5: Check */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                Bloco 5 — Check de Maturidade
              </span>
              <Badge variant="outline">{checks.length}/{PEDAGOGICAL_LIMITS.MAX_CHECK_QUESTIONS}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground italic">
              Perguntas reflexivas sem pontuação ou nota. Apenas para autorregulação.
            </p>
            {checks.map((check, index) => (
              <div key={index} className="flex gap-2 items-start">
                <span className="pt-2 text-sm text-muted-foreground w-6">{index + 1}.</span>
                <Textarea
                  value={check.pergunta}
                  onChange={(e) => updateCheck(index, e.target.value)}
                  rows={2}
                  className="flex-1"
                  placeholder="Pergunta reflexiva..."
                />
                <Button variant="ghost" size="icon" onClick={() => removeCheck(index)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addCheck} disabled={checks.length >= PEDAGOGICAL_LIMITS.MAX_CHECK_QUESTIONS}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Pergunta
            </Button>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          )}
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save className="w-4 h-4" />
            {isSaving ? 'Salvando...' : 'Salvar Módulo Pedagógico'}
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}
