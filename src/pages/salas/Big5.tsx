import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Brain, Save, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const dimensoes = [
  {
    key: 'abertura',
    label: 'Abertura (Openness)',
    description: 'Curiosidade, criatividade, imaginação, interesse em experiências novas',
  },
  {
    key: 'conscienciosidade',
    label: 'Conscienciosidade (Conscientiousness)',
    description: 'Organização, disciplina, responsabilidade, planejamento',
  },
  {
    key: 'extroversao',
    label: 'Extroversão (Extraversion)',
    description: 'Sociabilidade, energia, assertividade, entusiasmo',
  },
  {
    key: 'amabilidade',
    label: 'Amabilidade (Agreeableness)',
    description: 'Cooperação, confiança, empatia, altruísmo',
  },
  {
    key: 'neuroticismo',
    label: 'Neuroticismo (Neuroticism)',
    description: 'Ansiedade, instabilidade emocional, vulnerabilidade ao estresse',
  },
];

export default function Big5() {
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

  const handleSave = async () => {
    setSaving(true);

    const { error } = await supabase.from('big5_registros').insert({
      user_id: user?.id,
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

        <Card className="glass mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Dimensões da Personalidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {dimensoes.map(dim => (
              <div key={dim.key} className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-medium">{dim.label}</Label>
                  <span className="text-gold font-bold">{valores[dim.key as keyof typeof valores]}</span>
                </div>
                <p className="text-xs text-muted-foreground">{dim.description}</p>
                <Slider
                  value={[valores[dim.key as keyof typeof valores]]}
                  onValueChange={([val]) =>
                    setValores(prev => ({ ...prev, [dim.key]: val }))
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
            ))}
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
