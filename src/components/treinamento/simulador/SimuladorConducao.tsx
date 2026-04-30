import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, FlaskConical, Eye, EyeOff, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { RespostaAluna, SimuladorStep, STEP_ORDER, STEP_LABELS } from './types';
import { calcularFeedback } from './feedbackEngine';
import { calculateTrainingScore, gerarFeedbackJson } from './scoringEngine';
import { useTrainingCases } from './useTrainingCases';
import { useCamaraCases } from './useCamaraCases';
import { useTrainingProgress } from './useTrainingProgress';
import { ProgressCard } from './ProgressCard';
import { CaseList } from './CaseList';
import { BlocoCaso } from './BlocoCaso';
import { BlocoLeitura } from './BlocoLeitura';
import { BlocoPosicionamento } from './BlocoPosicionamento';
import { BlocoDirecao } from './BlocoDirecao';
import { BlocoFerramenta } from './BlocoFerramenta';
import { BlocoFeedback } from './BlocoFeedback';
import { useQueryClient } from '@tanstack/react-query';
import { useAvaliacaoIA } from './useAvaliacaoIA';
import { useStudentTracking } from '@/hooks/useStudentTracking';
import { useCidadelaEstado } from '@/hooks/useCidadelaEstado';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

export function SimuladorConducao() {
  const { user } = useAuth();
  const { data: legacyCases = [], isLoading: isLoadingLegacy } = useTrainingCases();
  const { data: camaraCases = [], isLoading: isLoadingCamara } = useCamaraCases();
  
  // Merge cases, prioritizing Camara cases
  const cases = [...camaraCases, ...legacyCases];
  const isLoading = isLoadingLegacy || isLoadingCamara;
  
  const { progress, completedCount, getCaseStatus } = useTrainingProgress();
  const queryClient = useQueryClient();
  const { avaliacao, isLoading: isLoadingIA, avaliar, reset: resetAvaliacao } = useAvaliacaoIA();
  const { track } = useStudentTracking();
  const { addCompetencia } = useCidadelaEstado();
  const [casoIndex, setCasoIndex] = useState(0);
  const [active, setActive] = useState(false);
  const [modoTerapeuta, setModoTerapeuta] = useState(false);
  const [step, setStep] = useState<SimuladorStep>('caso');
  
  // Filters
  const [filterDistrito, setFilterDistrito] = useState<string>('all');
  const [filterDificuldade, setFilterDificuldade] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [resposta, setResposta] = useState<RespostaAluna>({
    leitura_texto: '',
    distrito_escolhido: '',
    estado_escolhido: '',
    hipotese_texto: '',
    vetor_texto: '',
    ferramenta_escolhida: '',
  });

  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      const matchesDistrito = filterDistrito === 'all' || c.distrito_esperado === filterDistrito;
      const matchesDificuldade = filterDificuldade === 'all' || 
        (filterDificuldade === 'iniciante' && c.nivel === 'guiado') ||
        (filterDificuldade === 'intermediario' && c.nivel === 'semi_guiado') ||
        (filterDificuldade === 'avancado' && c.nivel === 'livre');
      const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            c.tema?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesDistrito && matchesDificuldade && matchesSearch;
    });
  }, [cases, filterDistrito, filterDificuldade, searchTerm]);

  const caso = filteredCases[casoIndex];
  const stepIdx = STEP_ORDER.indexOf(step);
  const progressPct = active ? ((stepIdx + 1) / STEP_ORDER.length) * 100 : 0;

  const resetResposta = () => {
    setResposta({
      leitura_texto: '',
      distrito_escolhido: '',
      estado_escolhido: '',
      hipotese_texto: '',
      vetor_texto: '',
      ferramenta_escolhida: '',
    });
    setStep('caso');
    resetAvaliacao();
  };

  const iniciar = (idx: number) => {
    setCasoIndex(idx);
    setActive(true);
    resetResposta();
    const c = cases[idx];
    if (c) {
      track('treinamento', 'opened_case', 'caso_treinamento', c.id, {
        case_id: c.id,
        nivel: c.nivel,
      });
    }
  };

  const nextStep = () => {
    const nextIdx = stepIdx + 1;
    if (nextIdx < STEP_ORDER.length) {
      setStep(STEP_ORDER[nextIdx]);
    }
  };

  const salvarResposta = async () => {
    if (!user || !caso) return;
    const result = calcularFeedback(caso, resposta);
    const score = calculateTrainingScore(caso, resposta);
    const feedbackJson = gerarFeedbackJson(caso, resposta, score);
    const feedbackFinal = `[${result.nivel}] Score: ${score.total}/9 — ${result.resumo}`;

    // Fire AI evaluation in parallel (non-blocking)
    avaliar(caso, resposta);

    await supabase.from('co_training_attempts').insert({
      user_id: user.id,
      case_id: caso.id,
      resposta_o_que_acontece: resposta.leitura_texto,
      resposta_parece_o_que: '',
      resposta_distrito: resposta.distrito_escolhido,
      resposta_estado: resposta.estado_escolhido,
      resposta_movimento: '',
      resposta_hipotese: resposta.hipotese_texto,
      resposta_vetor: resposta.vetor_texto,
      resposta_ferramenta: resposta.ferramenta_escolhida,
      feedback_final: feedbackFinal,
      score_total: score.total,
      score_distrito: score.distrito,
      score_hipotese: score.hipotese,
      score_ferramenta: score.ferramenta,
      feedback_json: feedbackJson as any,
      status: 'concluido',
    });

    // Track submission + completion
    track('treinamento', 'submitted_response', 'caso_treinamento', caso.id, { case_id: caso.id, nivel: caso.nivel });
    track('treinamento', 'completed', 'caso_treinamento', caso.id, { case_id: caso.id, nivel: caso.nivel });

    await supabase.from('co_training_progress').upsert({
      user_id: user.id,
      nivel_atual: caso.nivel,
      casos_concluidos: casoIndex + 1,
      ultimo_case_id: caso.id,
      coerencia_media: score.total / 9 * 100,
      total_casos: casoIndex + 1,
      taxa_acerto: score.total >= 7 ? 100 : score.total >= 4 ? 50 : 0,
    }, { onConflict: 'user_id' });

    // Update CidaDELA competencias
    if (caso.distrito_esperado) {
      addCompetencia.mutate({
        distrito: caso.distrito_esperado,
        tipo: 'individual',
        nivel: caso.nivel === 'guiado' ? 1 : caso.nivel === 'semi_guiado' ? 2 : 3,
        acerto: score.total >= 7,
      });
    }

    queryClient.invalidateQueries({ queryKey: ['training-progress'] });
    queryClient.invalidateQueries({ queryKey: ['training-attempts'] });
    queryClient.invalidateQueries({ queryKey: ['training-dashboard'] });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  // --- LIST VIEW ---
  if (!active) {
    return (
      <div className="space-y-6">
        <ProgressCard
          totalCases={cases.length}
          completedCount={completedCount}
          nivelAtual={progress?.nivel_atual || null}
        />

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar tema ou tipo de cliente..." 
              className="pl-10 bg-white/5 border-white/10 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterDistrito} onValueChange={setFilterDistrito}>
              <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-xs">
                <Filter className="w-3 h-3 mr-2" />
                <SelectValue placeholder="Distrito" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Distritos</SelectItem>
                <SelectItem value="Distrito do Metal">Metal</SelectItem>
                <SelectItem value="Distrito da Água">Água</SelectItem>
                <SelectItem value="Distrito da Terra">Terra</SelectItem>
                <SelectItem value="Distrito do Fogo">Fogo</SelectItem>
                <SelectItem value="Distrito do Ar">Ar</SelectItem>
                <SelectItem value="Distrito da Madeira">Madeira</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterDificuldade} onValueChange={setFilterDificuldade}>
              <SelectTrigger className="w-[120px] bg-white/5 border-white/10 text-xs">
                <SelectValue placeholder="Dificuldade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="iniciante">Iniciante</SelectItem>
                <SelectItem value="intermediario">Intermediário</SelectItem>
                <SelectItem value="avancado">Avançado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredCases.length === 0 ? (
          <Card className="border-dashed border-primary/20 bg-transparent">
            <CardContent className="py-12 text-center">
              <FlaskConical className="w-10 h-10 mx-auto text-primary/30 mb-3" />
              <p className="text-muted-foreground">Nenhum caso encontrado com esses filtros.</p>
              <Button variant="link" size="sm" onClick={() => { setSearchTerm(''); setFilterDistrito('all'); setFilterDificuldade('all'); }}>
                Limpar filtros
              </Button>
            </CardContent>
          </Card>
        ) : (
          <CaseList
            cases={filteredCases}
            getCaseStatus={getCaseStatus}
            onSelectCase={iniciar}
          />
        )}
      </div>
    );
  }

  // --- ACTIVE SIMULATION ---
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-foreground">{caso?.title}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            {STEP_LABELS[step]} — Passo {stepIdx + 1} de {STEP_ORDER.length}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            {modoTerapeuta ? <Eye className="w-3.5 h-3.5 text-primary" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
            <span className="text-[10px] text-muted-foreground">Mentora</span>
            <Switch
              checked={modoTerapeuta}
              onCheckedChange={setModoTerapeuta}
              className="scale-75"
            />
          </div>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => setActive(false)}>
            Sair
          </Button>
        </div>
      </div>

      {/* Modo Terapeuta — Leitura da Mentora */}
      {modoTerapeuta && caso && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-primary" />
              <p className="text-[10px] font-medium text-primary uppercase tracking-wider">Visão da Mentora</p>
            </div>
            {caso.hipotese_esperada && (
              <div>
                <p className="text-[10px] text-muted-foreground">Hipótese esperada</p>
                <p className="text-xs text-foreground/80">{caso.hipotese_esperada}</p>
              </div>
            )}
            {caso.distrito_esperado && (
              <div>
                <p className="text-[10px] text-muted-foreground">Distrito</p>
                <Badge variant="outline" className="text-[10px]">{caso.distrito_esperado}</Badge>
              </div>
            )}
            {caso.ferramenta_principal && (
              <div>
                <p className="text-[10px] text-muted-foreground">Ferramenta sugerida</p>
                <Badge variant="outline" className="text-[10px]">{caso.ferramenta_principal}</Badge>
              </div>
            )}
            {caso.erro_comum && (
              <div>
                <p className="text-[10px] text-muted-foreground">Erro comum</p>
                <p className="text-xs text-foreground/60 italic">{caso.erro_comum}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="space-y-1">
        <Progress value={progressPct} className="h-1" />
        <div className="flex justify-between">
          {STEP_ORDER.map((s, i) => (
            <span
              key={s}
              className={`text-[9px] uppercase tracking-wider ${
                i <= stepIdx ? 'text-primary font-medium' : 'text-muted-foreground/40'
              }`}
            >
              {STEP_LABELS[s]}
            </span>
          ))}
        </div>
      </div>

      {caso && step === 'caso' && <BlocoCaso caso={caso} onNext={nextStep} />}
      {caso && step === 'leitura' && (
        <BlocoLeitura
          caso={caso}
          value={resposta.leitura_texto}
          onChange={v => setResposta(r => ({ ...r, leitura_texto: v }))}
          onNext={nextStep}
        />
      )}
      {caso && step === 'posicionamento' && (
        <BlocoPosicionamento
          caso={caso}
          distrito={resposta.distrito_escolhido}
          estado={resposta.estado_escolhido}
          onDistritoChange={v => setResposta(r => ({ ...r, distrito_escolhido: v }))}
          onEstadoChange={v => setResposta(r => ({ ...r, estado_escolhido: v }))}
          onNext={nextStep}
        />
      )}
      {caso && step === 'direcao' && (
        <BlocoDirecao
          caso={caso}
          hipotese={resposta.hipotese_texto}
          vetor={resposta.vetor_texto}
          onHipoteseChange={v => setResposta(r => ({ ...r, hipotese_texto: v }))}
          onVetorChange={v => setResposta(r => ({ ...r, vetor_texto: v }))}
          onNext={nextStep}
        />
      )}
      {caso && step === 'ferramenta' && (
        <BlocoFerramenta
          caso={caso}
          ferramenta={resposta.ferramenta_escolhida}
          onChange={v => setResposta(r => ({ ...r, ferramenta_escolhida: v }))}
          onNext={() => { nextStep(); salvarResposta(); }}
        />
      )}
      {caso && step === 'feedback' && (
        <BlocoFeedback
          caso={caso}
          resposta={resposta}
          onReset={resetResposta}
          onNextCaso={() => iniciar(Math.min(casoIndex + 1, cases.length - 1))}
          isLast={casoIndex >= cases.length - 1}
          avaliacaoIA={avaliacao}
          isLoadingIA={isLoadingIA}
          proximoCaso={cases[casoIndex + 1] ?? null}
        />
      )}
    </div>
  );
}
