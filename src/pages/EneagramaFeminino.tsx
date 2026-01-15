// ============================================
// FEMININE ENNEAGRAM — THE LIVING ARCHETYPES
// A symbolic narrative quiz — not a clinical tool
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
import { 
  Loader2, Sparkles, ArrowRight, ArrowLeft, Moon, Sun, Check, 
  Heart, Crown, Star, Eye, Shield, Flower, Flower2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Arquetipo {
  id: string;
  numero: number;
  chave: string;
  nome: string;
  nome_en: string;
  essencia_simbolica: string;
  ferida_central: string;
  dom_central: string;
  expressao_sombra: string;
  caminho_expansao: string;
  pergunta_reflexiva: string;
  pratica_simbolica: string;
  icone: string;
  cor_primaria: string;
  ordem: number;
}

interface Afirmacao {
  id: string;
  arquetipo_id: string;
  texto_afirmacao: string;
  peso: number;
  ordem: number;
}

const LIKERT_LABELS = [
  { value: 1, label: 'Não me reconheço', icon: Moon },
  { value: 2, label: 'Raramente', icon: null },
  { value: 3, label: 'Às vezes', icon: null },
  { value: 4, label: 'Frequentemente', icon: null },
  { value: 5, label: 'Profundamente me reconheço', icon: Sun },
];

// Icon mapping
const ICON_MAP: Record<string, typeof Heart> = {
  Heart, Crown, Star, Moon, Eye, Shield, Flower, Flower2, Sparkles
};

export default function EneagramaFeminino() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [arquetipos, setArquetipos] = useState<Arquetipo[]>([]);
  const [afirmacoes, setAfirmacoes] = useState<Afirmacao[]>([]);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'naming' | 'result'>('intro');
  const [saving, setSaving] = useState(false);
  const [nomeSimbolico, setNomeSimbolico] = useState('');
  const [reflexaoFinal, setReflexaoFinal] = useState('');
  const [selectedArchetype, setSelectedArchetype] = useState<Arquetipo | null>(null);

  // Group afirmacoes by archetype
  const afirmacoesByArquetipo = useMemo(() => {
    const grouped: Record<string, Afirmacao[]> = {};
    afirmacoes.forEach(a => {
      if (!grouped[a.arquetipo_id]) grouped[a.arquetipo_id] = [];
      grouped[a.arquetipo_id].push(a);
    });
    return grouped;
  }, [afirmacoes]);

  // Flatten for navigation
  const allStatements = useMemo(() => {
    return arquetipos.flatMap(arq => 
      (afirmacoesByArquetipo[arq.id] || []).map(a => ({ ...a, arquetipo: arq }))
    );
  }, [arquetipos, afirmacoesByArquetipo]);

  const currentStatement = allStatements[currentIndex];
  const progress = allStatements.length > 0 
    ? ((currentIndex + 1) / allStatements.length) * 100 
    : 0;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [arquetiposRes, afirmacoesRes] = await Promise.all([
        supabase.from('eneagrama_feminino_arquetipos').select('*').eq('ativo', true).order('ordem'),
        supabase.from('eneagrama_feminino_afirmacoes').select('*').eq('ativo', true).order('ordem'),
      ]);

      if (arquetiposRes.data) setArquetipos(arquetiposRes.data);
      if (afirmacoesRes.data) setAfirmacoes(afirmacoesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erro ao carregar os arquétipos');
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

  // Calculate scores for each archetype
  const calculateScores = (): Record<number, number> => {
    const scores: Record<number, number> = {};
    
    arquetipos.forEach(arq => {
      const arqAfirmacoes = afirmacoesByArquetipo[arq.id] || [];
      const arqScores = arqAfirmacoes.map(a => responses[a.id] * a.peso).filter(Boolean);
      
      if (arqScores.length > 0) {
        scores[arq.numero] = arqScores.reduce((a, b) => a + b, 0) / arqScores.length;
      } else {
        scores[arq.numero] = 0;
      }
    });

    return scores;
  };

  // Get top archetypes
  const getTopArchetypes = () => {
    const scores = calculateScores();
    const sorted = Object.entries(scores)
      .map(([num, score]) => ({ numero: parseInt(num), score }))
      .sort((a, b) => b.score - a.score);

    const primary = sorted[0]?.numero || 1;
    const secondary = sorted[1]?.score > 2.5 ? sorted[1]?.numero : null;
    
    // Shadow is the lowest scoring archetype
    const shadow = sorted[sorted.length - 1]?.numero || null;

    return { primary, secondary, shadow };
  };

  const handleFinish = async () => {
    setSaving(true);
    const { primary, secondary, shadow } = getTopArchetypes();

    try {
      const { error } = await supabase.from('eneagrama_feminino_registros').insert({
        user_id: user?.id,
        arquetipo_primario: primary,
        arquetipo_secundario: secondary,
        arquetipo_sombra: shadow,
        respostas_json: responses,
        nome_simbolico: nomeSimbolico || null,
        reflexao_final: reflexaoFinal || null,
      });

      if (error) throw error;
      
      setPhase('result');
      toast.success('Leitura salva com sucesso');
    } catch (error: any) {
      console.error('Error saving:', error);
      toast.error('Erro ao salvar: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const getArquetipoByNumero = (num: number) => arquetipos.find(a => a.numero === num);

  const getIcon = (iconName: string) => {
    const IconComponent = ICON_MAP[iconName] || Sparkles;
    return IconComponent;
  };

  // Check if all answered
  const allAnswered = allStatements.every(s => responses[s.id]);

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  // RESULT VIEW
  if (phase === 'result') {
    const { primary, secondary, shadow } = getTopArchetypes();
    const primaryArq = getArquetipoByNumero(primary);
    const secondaryArq = secondary ? getArquetipoByNumero(secondary) : null;
    const shadowArq = shadow ? getArquetipoByNumero(shadow) : null;

    return (
      <AppLayout>
        <ContentPageLayout
          title="Os Arquétipos Vivos da Psique"
          subtitle="Sua leitura simbólica"
          onBack={() => navigate('/ferramentas')}
          backLabel="Voltar"
        >
          {/* Intro Block */}
          <Card className="glass mb-8">
            <CardContent className="p-6 text-center">
              <Flower2 className="w-8 h-8 text-gold mx-auto mb-4" />
              <p className="text-lg text-muted-foreground italic">
                "Este não é um rótulo. É um espelho das estratégias que sua alma feminina desenvolveu para sobreviver, amar e pertencer."
              </p>
            </CardContent>
          </Card>

          {/* Enneagram Wheel */}
          <Card className="glass mb-8">
            <CardHeader className="text-center">
              <CardTitle className="font-display text-gold">Sua Mandala Arquetípica</CardTitle>
              <CardDescription>Os arquétipos que tecem sua jornada</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <EnneagramWheel 
                arquetipos={arquetipos}
                primary={primary}
                secondary={secondary}
                shadow={shadow}
                onSelect={setSelectedArchetype}
                selected={selectedArchetype}
              />
            </CardContent>
          </Card>

          {/* Primary Archetype */}
          {primaryArq && (
            <ArchetypeCard 
              arquetipo={primaryArq}
              type="primary"
              getIcon={getIcon}
            />
          )}

          {/* Secondary Archetype */}
          {secondaryArq && (
            <ArchetypeCard 
              arquetipo={secondaryArq}
              type="secondary"
              getIcon={getIcon}
            />
          )}

          {/* Shadow Archetype */}
          {shadowArq && (
            <Card className="glass mb-6 border-orange-500/30">
              <div className="h-1 bg-gradient-to-r from-orange-500/50 to-red-500/50" />
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-orange-500/10">
                    {(() => {
                      const IconComp = getIcon(shadowArq.icone);
                      return <IconComp className="w-5 h-5 text-orange-400" />;
                    })()}
                  </div>
                  <div>
                    <CardDescription className="text-orange-400">Arquétipo Sombra</CardDescription>
                    <CardTitle className="text-lg">{shadowArq.nome}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-lg">
                  <p className="text-sm leading-relaxed mb-4">
                    <strong>O que rejeita:</strong> {shadowArq.expressao_sombra}
                  </p>
                  <p className="text-sm leading-relaxed">
                    <strong>O que pode integrar:</strong> {shadowArq.dom_central}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Symbolic Naming & Reflection */}
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
              setPhase('intro');
              setCurrentIndex(0);
              setResponses({});
              setNomeSimbolico('');
              setReflexaoFinal('');
              setSelectedArchetype(null);
            }}>
              Refazer a Leitura
            </Button>
          </div>
        </ContentPageLayout>
      </AppLayout>
    );
  }

  // INTRO VIEW
  if (phase === 'intro') {
    return (
      <AppLayout>
        <ContentPageLayout
          title="Eneagrama Feminino"
          subtitle="Os Arquétipos Vivos da Psique"
          onBack={() => navigate(-1)}
          backLabel="Voltar"
        >
          <Card className="glass mb-8">
            <CardContent className="p-8 text-center">
              <Flower2 className="w-16 h-16 text-gold mx-auto mb-6" />
              <h2 className="text-2xl font-display text-gold mb-4">
                Bem-vinda à leitura dos Arquétipos Femininos
              </h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Este não é um teste de personalidade. É um espelho simbólico das 
                estratégias que a sua alma desenvolveu para sobreviver, amar e pertencer.
              </p>
              <p className="text-sm text-muted-foreground italic mb-8">
                "Não há tipo melhor ou pior. Cada arquétipo carrega feridas e dons — 
                e todos podem amadurecer."
              </p>
              
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
                {arquetipos.slice(0, 9).map(arq => {
                  const IconComp = getIcon(arq.icone);
                  return (
                    <div 
                      key={arq.numero}
                      className="p-3 rounded-lg bg-muted/30 border border-border/50 text-center"
                    >
                      <IconComp 
                        className="w-6 h-6 mx-auto mb-1" 
                        style={{ color: arq.cor_primaria }}
                      />
                      <p className="text-xs text-muted-foreground truncate">{arq.nome}</p>
                    </div>
                  );
                })}
              </div>

              <Button size="lg" onClick={() => setPhase('quiz')}>
                Iniciar a Leitura
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </ContentPageLayout>
      </AppLayout>
    );
  }

  // NAMING PHASE
  if (phase === 'naming') {
    return (
      <AppLayout>
        <ContentPageLayout
          title="Eneagrama Feminino"
          subtitle="Nomeie sua jornada"
          onBack={() => setPhase('quiz')}
          backLabel="Voltar"
        >
          <Card className="glass">
            <CardContent className="p-8 space-y-6">
              <div className="text-center">
                <Sparkles className="w-8 h-8 text-gold mx-auto mb-4" />
                <h3 className="text-xl font-display text-gold mb-2">
                  Nomeie este momento
                </h3>
                <p className="text-sm text-muted-foreground">
                  Dê um nome simbólico a esta leitura da sua jornada (opcional)
                </p>
              </div>

              <div>
                <Label htmlFor="nome-simbolico">Nome simbólico</Label>
                <input
                  id="nome-simbolico"
                  type="text"
                  value={nomeSimbolico}
                  onChange={(e) => setNomeSimbolico(e.target.value)}
                  placeholder="Ex: A que aprende a receber"
                  className="w-full mt-2 p-3 rounded-lg bg-muted/50 border border-border focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <Label htmlFor="reflexao">Reflexão final (opcional)</Label>
                <Textarea
                  id="reflexao"
                  value={reflexaoFinal}
                  onChange={(e) => setReflexaoFinal(e.target.value)}
                  placeholder="O que esta leitura revela sobre você neste momento?"
                  className="mt-2 min-h-[120px]"
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setPhase('quiz')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <Button onClick={handleFinish} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      Ver Resultado
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </ContentPageLayout>
      </AppLayout>
    );
  }

  // QUIZ VIEW
  return (
    <AppLayout>
      <ContentPageLayout
        title="Eneagrama Feminino"
        subtitle="Uma leitura simbólica — não um rótulo"
        onBack={() => setPhase('intro')}
        backLabel="Voltar"
      >
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>{currentStatement?.arquetipo.nome}</span>
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
                style={{ backgroundColor: currentStatement.arquetipo.cor_primaria }}
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
              onClick={() => setPhase('naming')}
              disabled={!allAnswered}
            >
              Continuar
              <Check className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </ContentPageLayout>
    </AppLayout>
  );
}

// ============================================
// ENNEAGRAM WHEEL COMPONENT
// ============================================
interface EnneagramWheelProps {
  arquetipos: Arquetipo[];
  primary: number;
  secondary: number | null;
  shadow: number | null;
  onSelect: (arq: Arquetipo | null) => void;
  selected: Arquetipo | null;
}

function EnneagramWheel({ arquetipos, primary, secondary, shadow, onSelect, selected }: EnneagramWheelProps) {
  const size = 320;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = 120;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold/20 to-purple-500/20 border border-gold/30 flex items-center justify-center">
          <Flower2 className="w-8 h-8 text-gold" />
        </div>
      </div>

      {/* Archetype nodes */}
      {arquetipos.map((arq, i) => {
        const angle = (i * 40 - 90) * (Math.PI / 180); // 40 degrees apart, starting from top
        const x = centerX + radius * Math.cos(angle) - 24;
        const y = centerY + radius * Math.sin(angle) - 24;

        const isPrimary = arq.numero === primary;
        const isSecondary = arq.numero === secondary;
        const isShadow = arq.numero === shadow;
        const isSelected = selected?.numero === arq.numero;

        return (
          <button
            key={arq.numero}
            onClick={() => onSelect(isSelected ? null : arq)}
            className={cn(
              "absolute w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
              "border-2 hover:scale-110",
              isPrimary && "border-gold bg-gold/20 shadow-lg shadow-gold/30 scale-110",
              isSecondary && "border-purple-400 bg-purple-500/20",
              isShadow && "border-orange-400 bg-orange-500/10 opacity-70",
              !isPrimary && !isSecondary && !isShadow && "border-border bg-muted/50",
              isSelected && "ring-2 ring-gold ring-offset-2 ring-offset-background"
            )}
            style={{ left: x, top: y }}
          >
            <span 
              className={cn(
                "text-sm font-bold",
                isPrimary && "text-gold",
                isSecondary && "text-purple-400",
                isShadow && "text-orange-400",
                !isPrimary && !isSecondary && !isShadow && "text-muted-foreground"
              )}
            >
              {arq.numero}
            </span>
          </button>
        );
      })}

      {/* Legend */}
      <div className="absolute -bottom-12 left-0 right-0 flex justify-center gap-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-gold" /> Primário
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-purple-400" /> Secundário
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-orange-400" /> Sombra
        </span>
      </div>
    </div>
  );
}

// ============================================
// ARCHETYPE CARD COMPONENT
// ============================================
interface ArchetypeCardProps {
  arquetipo: Arquetipo;
  type: 'primary' | 'secondary';
  getIcon: (name: string) => typeof Heart;
}

function ArchetypeCard({ arquetipo, type, getIcon }: ArchetypeCardProps) {
  const isPrimary = type === 'primary';
  const IconComp = getIcon(arquetipo.icone);

  return (
    <Card className={cn(
      "glass mb-6 overflow-hidden",
      isPrimary && "border-gold/30"
    )}>
      <div 
        className="h-1" 
        style={{ backgroundColor: arquetipo.cor_primaria }}
      />
      <CardHeader>
        <div className="flex items-center gap-3">
          <div 
            className="p-2 rounded-full"
            style={{ backgroundColor: `${arquetipo.cor_primaria}20` }}
          >
            <IconComp 
              className="w-6 h-6" 
              style={{ color: arquetipo.cor_primaria }}
            />
          </div>
          <div>
            <CardDescription className={isPrimary ? "text-gold" : "text-purple-400"}>
              {isPrimary ? 'Arquétipo Primário' : 'Arquétipo Secundário'}
            </CardDescription>
            <CardTitle className="text-xl">{arquetipo.nome}</CardTitle>
            <p className="text-sm text-muted-foreground">{arquetipo.nome_en}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Essence */}
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-sm leading-relaxed italic">{arquetipo.essencia_simbolica}</p>
        </div>

        {/* Gift & Wound */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-xs uppercase text-green-400 mb-2">Dom Central</p>
            <p className="text-sm">{arquetipo.dom_central}</p>
          </div>
          <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <p className="text-xs uppercase text-orange-400 mb-2">Ferida Central</p>
            <p className="text-sm">{arquetipo.ferida_central}</p>
          </div>
        </div>

        {/* Shadow Expression */}
        <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-lg">
          <p className="text-xs uppercase text-red-400 mb-2">Expressão Sombra (quando em excesso)</p>
          <p className="text-sm">{arquetipo.expressao_sombra}</p>
        </div>

        {/* Expansion Path */}
        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
          <p className="text-xs uppercase text-purple-400 mb-2">Caminho de Expansão</p>
          <p className="text-sm">{arquetipo.caminho_expansao}</p>
        </div>

        {/* Reflective Question */}
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-xs uppercase text-muted-foreground mb-2">Pergunta para Reflexão</p>
          <p className="text-sm italic">{arquetipo.pergunta_reflexiva}</p>
        </div>

        {/* Symbolic Practice */}
        <div 
          className="p-4 rounded-lg border"
          style={{ 
            backgroundColor: `${arquetipo.cor_primaria}08`,
            borderColor: `${arquetipo.cor_primaria}30`
          }}
        >
          <p className="text-xs uppercase mb-2" style={{ color: arquetipo.cor_primaria }}>
            Prática Sugerida
          </p>
          <p className="text-sm">{arquetipo.pratica_simbolica}</p>
        </div>
      </CardContent>
    </Card>
  );
}
