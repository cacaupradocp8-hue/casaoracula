// ============================================
// BIG5 SYMBOLIC — MAP OF THE SOUL FORCES
// A symbolic, non-numeric assessment tool
// ============================================

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ContentPageLayout } from '@/components/shared/ContentPageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2, Sparkles, ArrowRight, ArrowLeft, Moon, Sun, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RadialVisualization } from '@/components/visualization/RadialVisualization';
import { SymbolicElement } from '@/components/visualization/types';

interface SymbolicForce {
  id: string;
  chave: string;
  nome: string;
  descricao_simbolica: string;
  narrativa_elevada: string;
  narrativa_fragil: string;
  microcopy_reflexao: string;
  pratica_sugerida: string;
  cor_primaria: string;
  ordem: number;
}

interface Afirmacao {
  id: string;
  force_id: string;
  texto_afirmacao: string;
  peso: number;
  ordem: number;
}

type IntensityLevel = 'low' | 'medium' | 'high' | 'dominant';

const LIKERT_LABELS = [
  { value: 1, label: 'Não me reconheço', icon: Moon },
  { value: 2, label: 'Raramente', icon: null },
  { value: 3, label: 'Às vezes', icon: null },
  { value: 4, label: 'Frequentemente', icon: null },
  { value: 5, label: 'Profundamente me reconheço', icon: Sun },
];

const INTENSITY_MAP: Record<string, IntensityLevel> = {
  low: 'low',
  medium: 'medium',
  high: 'high',
  dominant: 'dominant',
};

export default function Big5Simbolico() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [forces, setForces] = useState<SymbolicForce[]>([]);
  const [afirmacoes, setAfirmacoes] = useState<Afirmacao[]>([]);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nomeSimbolico, setNomeSimbolico] = useState('');
  const [reflexaoFinal, setReflexaoFinal] = useState('');
  const [savedResultId, setSavedResultId] = useState<string | null>(null);

  // Group afirmacoes by force
  const afirmacoesByForce = useMemo(() => {
    const grouped: Record<string, Afirmacao[]> = {};
    afirmacoes.forEach(a => {
      if (!grouped[a.force_id]) grouped[a.force_id] = [];
      grouped[a.force_id].push(a);
    });
    return grouped;
  }, [afirmacoes]);

  // Flatten for navigation
  const allStatements = useMemo(() => {
    return forces.flatMap(f => 
      (afirmacoesByForce[f.id] || []).map(a => ({ ...a, force: f }))
    );
  }, [forces, afirmacoesByForce]);

  const currentStatement = allStatements[currentIndex];
  const progress = allStatements.length > 0 
    ? ((currentIndex + 1) / allStatements.length) * 100 
    : 0;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [forcesRes, afirmacoesRes] = await Promise.all([
        supabase.from('big5_symbolic_forces').select('*').eq('ativo', true).order('ordem'),
        supabase.from('big5_symbolic_afirmacoes').select('*').eq('ativo', true).order('ordem'),
      ]);

      if (forcesRes.data) setForces(forcesRes.data);
      if (afirmacoesRes.data) setAfirmacoes(afirmacoesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erro ao carregar o mapa');
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = (value: number) => {
    if (!currentStatement) return;
    setResponses(prev => ({ ...prev, [currentStatement.id]: value }));
    
    // Auto-advance after selection
    if (currentIndex < allStatements.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
    }
  };

  const calculateIntensities = (): Record<string, IntensityLevel> => {
    const intensities: Record<string, IntensityLevel> = {};
    
    forces.forEach(force => {
      const forceAfirmacoes = afirmacoesByForce[force.id] || [];
      const scores = forceAfirmacoes.map(a => responses[a.id]).filter(Boolean);
      
      if (scores.length === 0) {
        intensities[force.chave] = 'medium';
        return;
      }

      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      
      // Map 1-5 to intensity levels
      if (avg <= 1.5) intensities[force.chave] = 'low';
      else if (avg <= 2.5) intensities[force.chave] = 'medium';
      else if (avg <= 3.5) intensities[force.chave] = 'high';
      else intensities[force.chave] = 'dominant';
    });

    return intensities;
  };

  const handleFinish = async () => {
    setSaving(true);
    const intensities = calculateIntensities();

    try {
      const { data, error } = await supabase.from('big5_symbolic_registros').insert({
        user_id: user?.id,
        abertura_intensidade: intensities['abertura_misterio'] || 'medium',
        suporte_intensidade: intensities['eixo_suporte'] || 'medium',
        relacional_intensidade: intensities['pulso_relacional'] || 'medium',
        expressao_intensidade: intensities['fogo_expressao'] || 'medium',
        sensibilidade_intensidade: intensities['sensibilidade_caos'] || 'medium',
        respostas_json: responses,
        nome_simbolico: nomeSimbolico || null,
        reflexao_final: reflexaoFinal || null,
      }).select('id').single();

      if (error) throw error;
      
      setSavedResultId(data.id);
      setShowResult(true);
      toast.success('Mapa salvo com sucesso');
    } catch (error: any) {
      console.error('Error saving:', error);
      toast.error('Erro ao salvar: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const getIntensities = (): Record<string, IntensityLevel> => calculateIntensities();

  // Prepare elements for visualization
  const visualElements: SymbolicElement[] = useMemo(() => {
    const intensities = calculateIntensities();
    return forces.map(f => ({
      id: f.chave,
      label: f.nome,
      description: f.descricao_simbolica,
      color: f.cor_primaria,
      intensity: intensities[f.chave] || 'medium',
    }));
  }, [forces, responses]);

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  // Check if all answered
  const allAnswered = allStatements.every(s => responses[s.id]);

  // RESULT VIEW
  if (showResult) {
    const intensities = getIntensities();

    return (
      <AppLayout>
        <ContentPageLayout
          title="Mapa das Forças da Alma"
          subtitle="Sua leitura simbólica"
          onBack={() => navigate('/ferramentas')}
          backLabel="Voltar"
        >
          {/* Intro Block */}
          <Card className="glass mb-8">
            <CardContent className="p-6 text-center">
              <Sparkles className="w-8 h-8 text-gold mx-auto mb-4" />
              <p className="text-lg text-muted-foreground italic">
                "Este não é um diagnóstico. É um espelho narrativo do momento atual da sua alma."
              </p>
            </CardContent>
          </Card>

          {/* Visual Map */}
          <Card className="glass mb-8">
            <CardHeader className="text-center">
              <CardTitle className="font-display text-gold">Seu Mapa Simbólico</CardTitle>
              <CardDescription>As forças que movem sua jornada agora</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <RadialVisualization
                elements={visualElements}
                config={{
                  type: 'radial',
                  centerLabel: nomeSimbolico || 'Sua Alma',
                  showLabels: true,
                  showDescriptions: true,
                  animated: true,
                  interactive: true,
                  glowEffect: true,
                  size: 'lg',
                  colorScheme: 'custom',
                }}
                onElementSelect={() => {}}
              />
            </CardContent>
          </Card>

          {/* Force Narratives */}
          <div className="space-y-6">
            {forces.map(force => {
              const intensity = intensities[force.chave] || 'medium';
              const isElevated = intensity === 'high' || intensity === 'dominant';
              
              return (
                <Card key={force.id} className="glass overflow-hidden">
                  <div 
                    className="h-1" 
                    style={{ backgroundColor: force.cor_primaria }}
                  />
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: force.cor_primaria }}
                      />
                      <CardTitle className="text-lg">{force.nome}</CardTitle>
                    </div>
                    <CardDescription>{force.descricao_simbolica}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className={cn(
                      "p-4 rounded-lg",
                      isElevated ? "bg-green-500/10 border border-green-500/20" : "bg-orange-500/10 border border-orange-500/20"
                    )}>
                      <p className="text-sm leading-relaxed">
                        {isElevated ? force.narrativa_elevada : force.narrativa_fragil}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-xs uppercase text-muted-foreground mb-2">Pergunta para reflexão</p>
                      <p className="text-sm italic">{force.microcopy_reflexao}</p>
                    </div>

                    <div className="p-4 bg-gold/5 border border-gold/20 rounded-lg">
                      <p className="text-xs uppercase text-gold mb-2">Prática sugerida</p>
                      <p className="text-sm">{force.pratica_sugerida}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Symbolic Naming & Reflection (if filled) */}
          {(nomeSimbolico || reflexaoFinal) && (
            <Card className="glass mt-8">
              <CardContent className="p-6 space-y-4">
                {nomeSimbolico && (
                  <div>
                    <p className="text-xs uppercase text-muted-foreground mb-1">Nome simbólico escolhido</p>
                    <p className="text-lg font-display text-gold">{nomeSimbolico}</p>
                  </div>
                )}
                {reflexaoFinal && (
                  <div>
                    <p className="text-xs uppercase text-muted-foreground mb-1">Sua reflexão</p>
                    <p className="text-sm italic">{reflexaoFinal}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* CTA */}
          <div className="mt-8 text-center">
            <Button onClick={() => navigate('/ferramentas')} variant="outline" className="mr-4">
              Voltar para Ferramentas
            </Button>
            <Button onClick={() => {
              setShowResult(false);
              setCurrentIndex(0);
              setResponses({});
              setNomeSimbolico('');
              setReflexaoFinal('');
            }}>
              Refazer o Mapa
            </Button>
          </div>
        </ContentPageLayout>
      </AppLayout>
    );
  }

  // QUIZ VIEW
  return (
    <AppLayout>
      <ContentPageLayout
        title="Mapa das Forças da Alma"
        subtitle="Uma leitura simbólica — não um diagnóstico"
        onBack={() => navigate(-1)}
        backLabel="Voltar"
      >
        {/* Opening Ritual */}
        {currentIndex === 0 && !responses[allStatements[0]?.id] && (
          <Card className="glass mb-8">
            <CardContent className="p-8 text-center">
              <Sparkles className="w-12 h-12 text-gold mx-auto mb-6" />
              <h2 className="text-2xl font-display text-gold mb-4">
                Bem-vinda à leitura das Forças da Alma
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Este não é um teste. É um espelho. Não há respostas certas ou erradas — 
                apenas o reconhecimento do que está vivo em você agora.
              </p>
              <p className="text-sm text-muted-foreground italic">
                "Nem toda força precisa ser dominante. A fragilidade também é movimento."
              </p>
            </CardContent>
          </Card>
        )}

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>{currentStatement?.force.nome}</span>
            <span>{currentIndex + 1} / {allStatements.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Current Statement */}
        {currentStatement && (
          <Card className="glass mb-6">
            <CardContent className="p-8">
              <div 
                className="w-full h-1 rounded-full mb-6"
                style={{ backgroundColor: currentStatement.force.cor_primaria }}
              />
              
              <p className="text-xl text-center mb-8 leading-relaxed">
                "{currentStatement.texto_afirmacao}"
              </p>

              <RadioGroup
                value={String(responses[currentStatement.id] || '')}
                onValueChange={(val) => handleResponse(parseInt(val))}
                className="space-y-3"
              >
                {LIKERT_LABELS.map(option => (
                  <div 
                    key={option.value}
                    className={cn(
                      "flex items-center p-4 rounded-lg border transition-all cursor-pointer",
                      responses[currentStatement.id] === option.value
                        ? "border-gold bg-gold/10"
                        : "border-border hover:border-gold/50 hover:bg-muted/30"
                    )}
                    onClick={() => handleResponse(option.value)}
                  >
                    <RadioGroupItem value={String(option.value)} id={`opt-${option.value}`} />
                    <Label htmlFor={`opt-${option.value}`} className="ml-3 flex-1 cursor-pointer flex items-center gap-2">
                      {option.icon && <option.icon className="w-4 h-4 text-muted-foreground" />}
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          {currentIndex < allStatements.length - 1 ? (
            <Button
              onClick={() => setCurrentIndex(prev => prev + 1)}
              disabled={!responses[currentStatement?.id]}
            >
              Próximo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentIndex(allStatements.length)} // Move to naming phase
              disabled={!allAnswered}
            >
              Continuar
              <Check className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Symbolic Naming Phase (after all statements) */}
        {currentIndex >= allStatements.length && (
          <Card className="glass mt-8">
            <CardContent className="p-8 space-y-6">
              <div className="text-center">
                <Sparkles className="w-8 h-8 text-gold mx-auto mb-4" />
                <h3 className="text-xl font-display text-gold mb-2">
                  Nomeie seu mapa
                </h3>
                <p className="text-sm text-muted-foreground">
                  Dê um nome simbólico a este momento da sua jornada (opcional)
                </p>
              </div>

              <div>
                <Label htmlFor="nome-simbolico">Nome simbólico</Label>
                <input
                  id="nome-simbolico"
                  type="text"
                  value={nomeSimbolico}
                  onChange={(e) => setNomeSimbolico(e.target.value)}
                  placeholder="Ex: A Dançarina em Travessia, A Guerreira em Repouso..."
                  className="w-full mt-2 p-3 rounded-lg bg-background border border-border"
                />
              </div>

              <div>
                <Label htmlFor="reflexao">O que você não quer reconstruir do mesmo jeito?</Label>
                <Textarea
                  id="reflexao"
                  value={reflexaoFinal}
                  onChange={(e) => setReflexaoFinal(e.target.value)}
                  placeholder="Sua reflexão..."
                  rows={3}
                  className="mt-2"
                />
              </div>

              <Button 
                onClick={handleFinish} 
                disabled={saving} 
                className="w-full"
                size="lg"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Revelar meu Mapa
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </ContentPageLayout>
    </AppLayout>
  );
}
