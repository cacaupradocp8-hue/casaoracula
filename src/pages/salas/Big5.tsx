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
import { Brain, Save, ArrowLeft, Loader2, FolderOpen, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';

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

interface CasoInfo {
  id: string;
  codinome: string;
  cliente_id: string;
  cliente_nome?: string;
}

const dimensaoLabels: Record<string, { label: string; descricao: string }> = {
  abertura: { label: 'Abertura (Openness)', descricao: 'Curiosidade, criatividade, imaginação, interesse em experiências novas' },
  conscienciosidade: { label: 'Conscienciosidade (Conscientiousness)', descricao: 'Organização, disciplina, responsabilidade, planejamento' },
  extroversao: { label: 'Extroversão (Extraversion)', descricao: 'Sociabilidade, energia, assertividade, entusiasmo' },
  amabilidade: { label: 'Amabilidade (Agreeableness)', descricao: 'Cooperação, confiança, empatia, altruísmo' },
  neuroticismo: { label: 'Neuroticismo (Neuroticism)', descricao: 'Ansiedade, instabilidade emocional, vulnerabilidade ao estresse' },
};

// Validation schema
const big5Schema = z.object({
  notas: z.string().max(5000, 'Notas devem ter no máximo 5000 caracteres').optional(),
  impacto_clinico: z.string().max(5000, 'Impacto clínico deve ter no máximo 5000 caracteres').optional(),
  abertura: z.number().int().min(0).max(100),
  conscienciosidade: z.number().int().min(0).max(100),
  extroversao: z.number().int().min(0).max(100),
  amabilidade: z.number().int().min(0).max(100),
  neuroticismo: z.number().int().min(0).max(100),
});

export default function Big5() {
  const [searchParams] = useSearchParams();
  const casoId = searchParams.get('caso');

  const [perguntas, setPerguntas] = useState<Big5Pergunta[]>([]);
  const [dimensoes, setDimensoes] = useState<Big5Dimensao[]>([]);
  const [loading, setLoading] = useState(true);
  const [caso, setCaso] = useState<CasoInfo | null>(null);
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

  // Determine mode: self-assessment (no caso) or therapist assessment (with caso)
  const isSelfAssessment = !casoId;

  useEffect(() => {
    fetchData();
  }, [user, casoId]);

  const fetchData = async () => {
    if (!user) return;

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
        .order('ordem'),
    ]);

    if (perguntasRes.data) setPerguntas(perguntasRes.data);
    if (dimensoesRes.data) setDimensoes(dimensoesRes.data);

    // If we have a caso ID, fetch caso info
    if (casoId) {
      const casoRes = await supabase
        .from('casos')
        .select('id, codinome, cliente_id')
        .eq('id', casoId)
        .eq('terapeuta_id', user.id)
        .maybeSingle();

      if (casoRes.data) {
        // Fetch cliente name
        const { data: profile } = await supabase
          .from('profiles')
          .select('nome')
          .eq('id', casoRes.data.cliente_id)
          .maybeSingle();

        setCaso({
          ...casoRes.data,
          cliente_nome: profile?.nome || 'Sem nome',
        });
      } else {
        toast({
          title: 'Caso não encontrado',
          description: 'O caso solicitado não existe ou você não tem permissão para acessá-lo.',
          variant: 'destructive',
        });
        navigate('/casos');
        return;
      }
    }

    setLoading(false);
  };

  const handleRespostaChange = (perguntaId: string, valor: number | string) => {
    setRespostas(prev => ({ ...prev, [perguntaId]: valor }));
  };

  const handleSave = async () => {
    // Validate input
    const validation = big5Schema.safeParse({
      notas,
      impacto_clinico: impactoClinico,
      ...valores,
    });

    if (!validation.success) {
      toast({ 
        title: 'Erro de validação', 
        description: validation.error.errors[0].message, 
        variant: 'destructive' 
      });
      return;
    }

    setSaving(true);

    let insertData: any;

    if (isSelfAssessment) {
      // Self-assessment: no caso, no terapeuta, no cliente
      insertData = {
        user_id: user?.id,
        terapeuta_id: null,
        cliente_id: null,
        caso_id: null,
        ...valores,
        notas: notas || null,
        impacto_clinico: impactoClinico || null,
      };
    } else {
      // Therapist assessment: requires caso
      if (!caso) {
        toast({ 
          title: 'Erro', 
          description: 'Caso não carregado corretamente.', 
          variant: 'destructive' 
        });
        setSaving(false);
        return;
      }

      insertData = {
        user_id: caso.cliente_id,
        terapeuta_id: user?.id,
        cliente_id: caso.cliente_id,
        caso_id: caso.id,
        ...valores,
        notas: notas || null,
        impacto_clinico: impactoClinico || null,
      };
    }

    const { error } = await supabase.from('big5_registros').insert(insertData);

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Registro Big5 salvo com sucesso!' });
      if (isSelfAssessment) {
        navigate('/salas');
      } else {
        navigate('/casos');
      }
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
          <Link to={isSelfAssessment ? '/salas' : '/casos'}>
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

        {/* Caso Info Banner (for therapist assessment) */}
        {!isSelfAssessment && caso && (
          <Card className="glass mb-6 border-gold/30 bg-gold/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FolderOpen className="w-5 h-5 text-gold" />
                <div>
                  <p className="font-medium">Avaliação para o caso: <span className="text-gold">{caso.codinome}</span></p>
                  <p className="text-sm text-muted-foreground">Cliente: {caso.cliente_nome}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Self-assessment notice */}
        {isSelfAssessment && (
          <Card className="glass mb-6 border-blue-500/30 bg-blue-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium">Autoavaliação</p>
                  <p className="text-sm text-muted-foreground">
                    Este registro será salvo no seu próprio perfil. Para avaliar uma cliente, acesse através da página de Casos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
                            maxLength={1000}
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
                maxLength={5000}
              />
              <p className="text-xs text-muted-foreground mt-1">{notas.length}/5000</p>
            </div>
            <div>
              <Label>Hipóteses de impacto clínico</Label>
              <Textarea
                value={impactoClinico}
                onChange={e => setImpactoClinico(e.target.value)}
                placeholder="Como esses traços impactam a cliente? Quais padrões emergem?"
                rows={4}
                maxLength={5000}
              />
              <p className="text-xs text-muted-foreground mt-1">{impactoClinico.length}/5000</p>
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
