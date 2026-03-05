import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, ArrowRight, ArrowLeft, Play, RotateCcw } from 'lucide-react';

const STEPS = [
  { id: 'checkin', label: 'Check-in', desc: 'Estado de presença e acolhimento' },
  { id: 'escolha', label: 'Escolha da Ferramenta', desc: 'Seleção do distrito e ferramenta' },
  { id: 'execucao', label: 'Execução', desc: 'Condução simbólica da sessão' },
  { id: 'registro', label: 'Registro Final', desc: 'Insight, tarefa simbólica e notas' },
];

const FERRAMENTAS_SIMULADAS = [
  'Cartografia Psíquica',
  'Torre Viva',
  'Labirinto das 39 Portas',
  'Atlas de Arquétipos',
  'Escrita Simbólica',
  'Decodificação Onírica',
  'Espelho Relacional',
  'Ritual Simbólico',
  'Diálogo de Partes',
];

export function SessaoSimulada() {
  const [ativa, setAtiva] = useState(false);
  const [step, setStep] = useState(0);
  const [checkin, setCheckin] = useState('');
  const [ferramenta, setFerramenta] = useState('');
  const [notasExec, setNotasExec] = useState('');
  const [insight, setInsight] = useState('');
  const [tarefa, setTarefa] = useState('');
  const [concluida, setConcluida] = useState(false);

  const reset = () => {
    setAtiva(false);
    setStep(0);
    setCheckin('');
    setFerramenta('');
    setNotasExec('');
    setInsight('');
    setTarefa('');
    setConcluida(false);
  };

  const canAdvance = () => {
    if (step === 0) return checkin.trim().length > 0;
    if (step === 1) return ferramenta.length > 0;
    if (step === 2) return notasExec.trim().length > 0;
    if (step === 3) return insight.trim().length > 0;
    return false;
  };

  const advance = () => {
    if (step < 3) setStep(s => s + 1);
    else setConcluida(true);
  };

  if (!ativa) {
    return (
      <div className="space-y-4">
        <Card className="bg-[#0F2438] border-[#C9A24A]/20 text-center py-12">
          <CardContent className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#C9A24A]/10 flex items-center justify-center">
              <Play className="w-8 h-8 text-[#C9A24A]" />
            </div>
            <h3 className="text-lg font-semibold text-[#F5F1E8]">Sessão Simulada</h3>
            <p className="text-sm text-[#F5F1E8]/50 max-w-md mx-auto">
              Pratique o fluxo completo de uma sessão do Método Orácula sem cliente real.
              Você passará por 4 etapas: Check-in, Escolha, Execução e Registro.
            </p>
            <Button onClick={() => setAtiva(true)} className="bg-[#C9A24A] text-[#0B1B2B] hover:bg-[#C9A24A]/80">
              Iniciar Sessão Simulada
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (concluida) {
    return (
      <div className="space-y-4">
        <Card className="bg-[#0F2438] border-emerald-500/30 text-center py-12">
          <CardContent className="space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-semibold text-[#F5F1E8]">Sessão Simulada Concluída</h3>
            <p className="text-sm text-[#F5F1E8]/50 max-w-md mx-auto">
              Você completou o fluxo de sessão com sucesso. Revise os dados abaixo.
            </p>
            <div className="text-left max-w-lg mx-auto space-y-3 mt-4">
              <div className="p-3 rounded-lg bg-[#0B1B2B] border border-[#C9A24A]/10">
                <p className="text-xs text-[#C9A24A] mb-1">Check-in</p>
                <p className="text-sm text-[#F5F1E8]/70">{checkin}</p>
              </div>
              <div className="p-3 rounded-lg bg-[#0B1B2B] border border-[#C9A24A]/10">
                <p className="text-xs text-[#C9A24A] mb-1">Ferramenta</p>
                <p className="text-sm text-[#F5F1E8]/70">{ferramenta}</p>
              </div>
              <div className="p-3 rounded-lg bg-[#0B1B2B] border border-[#C9A24A]/10">
                <p className="text-xs text-[#C9A24A] mb-1">Notas de Execução</p>
                <p className="text-sm text-[#F5F1E8]/70">{notasExec}</p>
              </div>
              <div className="p-3 rounded-lg bg-[#0B1B2B] border border-[#C9A24A]/10">
                <p className="text-xs text-[#C9A24A] mb-1">Insight Principal</p>
                <p className="text-sm text-[#F5F1E8]/70">{insight}</p>
              </div>
              {tarefa && (
                <div className="p-3 rounded-lg bg-[#0B1B2B] border border-[#C9A24A]/10">
                  <p className="text-xs text-[#C9A24A] mb-1">Tarefa Simbólica</p>
                  <p className="text-sm text-[#F5F1E8]/70">{tarefa}</p>
                </div>
              )}
            </div>
            <Button onClick={reset} variant="outline" className="mt-4 border-[#C9A24A]/30 text-[#C9A24A]">
              <RotateCcw className="w-4 h-4 mr-2" /> Nova Sessão
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#F5F1E8]/50">Etapa {step + 1} de 4</p>
          <Button variant="ghost" size="sm" onClick={reset} className="text-[#F5F1E8]/40 hover:text-[#F5F1E8]">
            <RotateCcw className="w-3 h-3 mr-1" /> Reiniciar
          </Button>
        </div>
        <Progress value={((step + 1) / 4) * 100} className="h-1" />
        <div className="flex gap-2">
          {STEPS.map((s, i) => (
            <Badge
              key={s.id}
              className={`text-xs ${i === step ? 'bg-[#C9A24A]/20 text-[#C9A24A]' : i < step ? 'bg-emerald-500/15 text-emerald-400' : 'bg-[#F5F1E8]/5 text-[#F5F1E8]/30'}`}
            >
              {i < step && <CheckCircle2 className="w-3 h-3 mr-1" />}
              {s.label}
            </Badge>
          ))}
        </div>
      </div>

      <Card className="bg-[#0F2438] border-[#C9A24A]/15">
        <CardHeader>
          <CardTitle className="text-[#F5F1E8]">{STEPS[step].label}</CardTitle>
          <p className="text-sm text-[#F5F1E8]/50">{STEPS[step].desc}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 0 && (
            <Textarea
              placeholder="Descreva o estado de presença da cliente fictícia ao chegar na sessão..."
              value={checkin}
              onChange={e => setCheckin(e.target.value)}
              className="min-h-[120px] bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8] placeholder:text-[#F5F1E8]/30"
            />
          )}
          {step === 1 && (
            <div className="grid gap-2 sm:grid-cols-3">
              {FERRAMENTAS_SIMULADAS.map(f => (
                <button
                  key={f}
                  onClick={() => setFerramenta(f)}
                  className={`text-left p-3 rounded-lg border transition-all text-sm ${
                    ferramenta === f
                      ? 'border-[#C9A24A]/50 bg-[#C9A24A]/10 text-[#C9A24A]'
                      : 'border-[#C9A24A]/10 text-[#F5F1E8]/60 hover:border-[#C9A24A]/30'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}
          {step === 2 && (
            <>
              <p className="text-sm text-[#C9A24A]/70">Ferramenta: {ferramenta}</p>
              <Textarea
                placeholder="Registre observações durante a execução da ferramenta: o que a cliente trouxe, qual o movimento psíquico, o que chamou atenção..."
                value={notasExec}
                onChange={e => setNotasExec(e.target.value)}
                className="min-h-[150px] bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8] placeholder:text-[#F5F1E8]/30"
              />
            </>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[#F5F1E8]/60 mb-1 block">Insight principal da sessão *</label>
                <Textarea
                  placeholder="Qual o insight mais importante desta sessão?"
                  value={insight}
                  onChange={e => setInsight(e.target.value)}
                  className="min-h-[80px] bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8] placeholder:text-[#F5F1E8]/30"
                />
              </div>
              <div>
                <label className="text-sm text-[#F5F1E8]/60 mb-1 block">Tarefa simbólica (opcional)</label>
                <Textarea
                  placeholder="Alguma proposta de prática para a cliente entre sessões?"
                  value={tarefa}
                  onChange={e => setTarefa(e.target.value)}
                  className="min-h-[60px] bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8] placeholder:text-[#F5F1E8]/30"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setStep(s => s - 1)}
          disabled={step === 0}
          className="border-[#C9A24A]/20 text-[#F5F1E8]/60"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Anterior
        </Button>
        <Button
          onClick={advance}
          disabled={!canAdvance()}
          className="bg-[#C9A24A] text-[#0B1B2B] hover:bg-[#C9A24A]/80"
        >
          {step < 3 ? 'Próxima' : 'Concluir'} <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
