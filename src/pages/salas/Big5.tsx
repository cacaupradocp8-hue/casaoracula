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

interface ClienteInfo {
  id: string;
  nome: string;
}

export default function Big5() {
  const [searchParams] = useSearchParams();
  const casoId = searchParams.get('caso');
  const clienteId = searchParams.get('cliente');

  const [perguntas, setPerguntas] = useState<Big5Pergunta[]>([]);
  const [dimensoes, setDimensoes] = useState<Big5Dimensao[]>([]);
  const [loading, setLoading] = useState(true);
  const [caso, setCaso] = useState<CasoInfo | null>(null);
  const [cliente, setCliente] = useState<ClienteInfo | null>(null);
  const [respostas, setRespostas] = useState<Record<string, number | string>>({});
  const [valores, setValores] = useState({
    abertura: 0,
    conscienciosidade: 0,
    extroversao: 0,
    amabilidade: 0,
    neuroticismo: 0,
  });
  const [notas, setNotas] = useState('');
  const [impactoClinico, setImpactoClinico] = useState('');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Determine mode: self-assessment (no caso/cliente) or therapist assessment (with caso or cliente)
  const isSelfAssessment = !casoId && !clienteId;
  const isClienteMode = !!clienteId && !casoId;

  useEffect(() => {
    fetchData();
  }, [user, casoId]);

  // Calculate scores when responses change
  useEffect(() => {
    if (perguntas.length === 0) return;
    
    const dimensaoKeys = ['abertura', 'conscienciosidade', 'extroversao', 'amabilidade', 'neuroticismo'] as const;
    const newScores = { ...valores };
    
    dimensaoKeys.forEach(dim => {
      const perguntasDim = perguntas.filter(p => p.dimensao === dim && p.tipo === 'escala_1_5');
      if (perguntasDim.length === 0) {
        newScores[dim] = 0;
        return;
      }
      
      const respostasValidas = perguntasDim
        .map(p => respostas[p.id])
        .filter((r): r is number => typeof r === 'number' && r >= 1 && r <= 5);
      
      if (respostasValidas.length === 0) {
        newScores[dim] = 0;
        return;
      }
      
      // Calculate average and normalize to 0-100
      // Formula: score = ((media - 1) / 4) * 100
      const media = respostasValidas.reduce((a, b) => a + b, 0) / respostasValidas.length;
      newScores[dim] = Math.round(((media - 1) / 4) * 100);
    });
    
    setValores(newScores);
  }, [respostas, perguntas]);

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

    // If we have a cliente ID (new flow), fetch cliente info and verify access
    if (clienteId) {
      // Verify therapist has access to this client
      const { data: vinculo } = await supabase
        .from('terapeuta_clientes')
        .select('cliente_id, ativo')
        .eq('terapeuta_id', user.id)
        .eq('cliente_id', clienteId)
        .eq('ativo', true)
        .maybeSingle();

      if (!vinculo) {
        toast({
          title: 'Acesso negado',
          description: 'Você não tem permissão para avaliar esta cliente.',
          variant: 'destructive',
        });
        navigate('/minhas-clientes');
        return;
      }

      // Fetch cliente name
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, nome')
        .eq('id', clienteId)
        .maybeSingle();

      if (profile) {
        setCliente({
          id: profile.id,
          nome: profile.nome || 'Sem nome',
        });
      }
    }

    // If we have a caso ID (legacy flow), fetch caso info
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
    } else if (isClienteMode && cliente) {
      // New flow: direct cliente assessment (no caso)
      insertData = {
        user_id: cliente.id,
        terapeuta_id: user?.id,
        cliente_id: cliente.id,
        caso_id: null,
        ...valores,
        notas: notas || null,
        impacto_clinico: impactoClinico || null,
      };
    } else if (caso) {
      // Legacy flow: therapist assessment via caso
      insertData = {
        user_id: caso.cliente_id,
        terapeuta_id: user?.id,
        cliente_id: caso.cliente_id,
        caso_id: caso.id,
        ...valores,
        notas: notas || null,
        impacto_clinico: impactoClinico || null,
      };
    } else {
      toast({ 
        title: 'Erro', 
        description: 'Cliente ou caso não carregado corretamente.', 
        variant: 'destructive' 
      });
      setSaving(false);
      return;
    }

    const { error } = await supabase.from('big5_registros').insert(insertData);

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Registro Big5 salvo com sucesso!' });
      if (isSelfAssessment) {
        navigate('/salas');
      } else if (isClienteMode && cliente) {
        navigate(`/cliente/${cliente.id}`);
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
          <Link to={isSelfAssessment ? '/salas' : isClienteMode && cliente ? `/cliente/${cliente.id}` : '/minhas-clientes'}>
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

        {/* Cliente Info Banner (new flow) */}
        {isClienteMode && cliente && (
          <Card className="glass mb-6 border-gold/30 bg-gold/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FolderOpen className="w-5 h-5 text-gold" />
                <div>
                  <p className="font-medium">Avaliação para: <span className="text-gold">{cliente.nome}</span></p>
                  <p className="text-sm text-muted-foreground">
                    Este registro será vinculado à linha do tempo da cliente.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Caso Info Banner (legacy flow) */}
        {!isSelfAssessment && !isClienteMode && caso && (
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
                    Este registro será salvo no seu próprio perfil. Para avaliar uma cliente, acesse através de Minhas Clientes.
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

        {/* Resultados calculados automaticamente */}
        <Card className="glass mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Resultados das Dimensões</CardTitle>
            {temPerguntas && (
              <p className="text-sm text-muted-foreground">
                Os scores são calculados automaticamente com base nas suas respostas ao questionário.
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.keys(valores).map(key => {
              const dimInfo = dimensoes.find(d => d.chave === key);
              const labelInfo = dimensaoLabels[key] || { label: key, descricao: '' };
              const score = valores[key as keyof typeof valores];
              
              // Count answered questions for this dimension
              const perguntasDim = perguntas.filter(p => p.dimensao === key && p.tipo === 'escala_1_5');
              const respondidas = perguntasDim.filter(p => typeof respostas[p.id] === 'number').length;
              const total = perguntasDim.length;
              
              return (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label className="text-base font-medium">{dimInfo?.nome || labelInfo.label}</Label>
                      {temPerguntas && total > 0 && (
                        <span className="text-xs text-muted-foreground ml-2">
                          ({respondidas}/{total} perguntas)
                        </span>
                      )}
                    </div>
                    <span className={`font-bold text-lg ${score > 0 ? 'text-gold' : 'text-muted-foreground'}`}>
                      {score > 0 ? score : '-'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{dimInfo?.descricao || labelInfo.descricao}</p>
                  <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full bg-gold transition-all duration-300"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Baixo (0)</span>
                    <span>Alto (100)</span>
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
