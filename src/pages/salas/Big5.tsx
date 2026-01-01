import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Brain, Save, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

interface Big5Pergunta {
  id: string;
  dimensao: 'abertura' | 'conscienciosidade' | 'extroversao' | 'amabilidade' | 'neuroticismo';
  texto_pergunta: string;
  tipo: 'escala_1_5' | 'texto';
  ordem: number;
}

interface Big5Dimensao {
  id: string;
  chave: string;
  nome: string;
  descricao: string;
}

const dimensaoLabels: Record<string, { label: string; descricao: string }> = {
  abertura: { label: 'Abertura (Openness)', descricao: 'Curiosidade, criatividade, imaginação, interesse em experiências novas' },
  conscienciosidade: { label: 'Conscienciosidade (Conscientiousness)', descricao: 'Organização, disciplina, responsabilidade, planejamento' },
  extroversao: { label: 'Extroversão (Extraversion)', descricao: 'Sociabilidade, energia, assertividade, entusiasmo' },
  amabilidade: { label: 'Amabilidade (Agreeableness)', descricao: 'Cooperação, confiança, empatia, altruísmo' },
  neuroticismo: { label: 'Neuroticismo (Neuroticism)', descricao: 'Ansiedade, instabilidade emocional, vulnerabilidade ao estresse' },
};

export default function Big5() {
  const [perguntas, setPerguntas] = useState<Big5Pergunta[]>([]);
  const [dimensoes, setDimensoes] = useState<Big5Dimensao[]>([]);
  const [loading, setLoading] = useState(true);
  const [respostas, setRespostas] = useState<Record<string, number | string>>({});
  const [valores, setValores] = useState({
    abertura: 50,
    conscienciosidade: 50,
    extroversao: 50,
    amabilidade: 50,
    neuroticismo: 50,
  });
  const [notas, setNotas] = useState('');
  const [impactoClinico, setImpactoClinico] = useState('');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [perguntasRes, dimensoesRes] = await Promise.all([
      supabase
        .from('big5_questionario')
        .select('*')
        .eq('ativo', true)
        .order('dimensao')
        .order('ordem'),
      supabase
        .from('big5_dimensoes')
        .select('*')
        .eq('ativo', true)
        .order('ordem')
    ]);

    if (perguntasRes.data) setPerguntas(perguntasRes.data);
    if (dimensoesRes.data) setDimensoes(dimensoesRes.data);
    setLoading(false);
  };

  const handleRespostaChange = (perguntaId: string, valor: number | string) => {
    setRespostas(prev => ({ ...prev, [perguntaId]: valor }));
  };

  const handleSave = async () => {
    setSaving(true);

    const { error } = await supabase.from('big5_registros').insert({
      user_id: user?.id,
      therapist_id: user?.id,
      ...valores,
      notas,
      impacto_clinico: impactoClinico,
    });

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Registro Big5 salvo com sucesso!' });
      navigate('/salas');
    }
    setSaving(false);
  };

  // Agrupar perguntas por dimensão
  const perguntasPorDimensao = perguntas.reduce((acc, p) => {
    if (!acc[p.dimensao]) acc[p.dimensao] = [];
    acc[p.dimensao].push(p);
    return acc;
  }, {} as Record<string, Big5Pergunta[]>);

  const temPerguntas = perguntas.length > 0;

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/salas">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <SectionHeader
            title="Big Five (OCEAN)"
            subtitle="Avaliação das cinco grandes dimensões da personalidade"
            icon={<Brain className="w-5 h-5" />}
          />
        </div>

        {/* Questionário dinâmico se houver perguntas */}
        {temPerguntas && (
          <Card className="glass mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Questionário</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {Object.entries(perguntasPorDimensao).map(([dimensao, perguntasDimensao]) => {
                const dimInfo = dimensoes.find(d => d.chave === dimensao);
                const labelInfo = dimensaoLabels[dimensao] || { label: dimensao, descricao: '' };
                
                return (
                  <div key={dimensao} className="space-y-4">
                    <div className="border-b pb-2">
                      <h4 className="font-medium text-gold">{dimInfo?.nome || labelInfo.label}</h4>
                      <p className="text-xs text-muted-foreground">{dimInfo?.descricao || labelInfo.descricao}</p>
                    </div>
                    
                    {perguntasDimensao.map((pergunta) => (
                      <div key={pergunta.id} className="space-y-2 pl-2">
                        <Label className="text-sm">{pergunta.texto_pergunta}</Label>
                        
                        {pergunta.tipo === 'escala_1_5' ? (
                          <RadioGroup
                            value={String(respostas[pergunta.id] || '')}
                            onValueChange={(val) => handleRespostaChange(pergunta.id, parseInt(val))}
                            className="flex gap-4"
                          >
                            {[1, 2, 3, 4, 5].map((n) => (
                              <div key={n} className="flex flex-col items-center">
                                <RadioGroupItem value={String(n)} id={`${pergunta.id}-${n}`} />
                                <Label htmlFor={`${pergunta.id}-${n}`} className="text-xs mt-1">{n}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        ) : (
                          <Input
                            value={String(respostas[pergunta.id] || '')}
                            onChange={(e) => handleRespostaChange(pergunta.id, e.target.value)}
                            placeholder="Sua resposta..."
                          />
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Sliders para pontuação geral das dimensões */}
        <Card className="glass mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Dimensões da Personalidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {Object.keys(valores).map(key => {
              const dimInfo = dimensoes.find(d => d.chave === key);
              const labelInfo = dimensaoLabels[key] || { label: key, descricao: '' };
              
              return (
                <div key={key} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-medium">{dimInfo?.nome || labelInfo.label}</Label>
                    <span className="text-gold font-bold">{valores[key as keyof typeof valores]}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{dimInfo?.descricao || labelInfo.descricao}</p>
                  <Slider
                    value={[valores[key as keyof typeof valores]]}
                    onValueChange={([val]) =>
                      setValores(prev => ({ ...prev, [key]: val }))
                    }
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Baixo</span>
                    <span>Alto</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="glass mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Anotações Clínicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Notas da terapeuta</Label>
              <Textarea
                value={notas}
                onChange={e => setNotas(e.target.value)}
                placeholder="Observações, contexto da avaliação, percepções..."
                rows={4}
              />
            </div>
            <div>
              <Label>Hipóteses de impacto clínico</Label>
              <Textarea
                value={impactoClinico}
                onChange={e => setImpactoClinico(e.target.value)}
                placeholder="Como esses traços impactam a cliente? Quais padrões emergem?"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={saving} variant="gold" className="w-full" size="lg">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Salvando...' : 'Salvar Registro'}
        </Button>
      </div>
    </AppLayout>
  );
}
