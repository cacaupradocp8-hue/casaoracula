import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, Pause, Square, Shield, Zap, Compass, Sparkles, MessageCircle } from 'lucide-react';
import type { ClienteComStatus, CartografiaProfile, SessionData } from '@/pages/casa-maquinas/CabineTerapeutaPage';

interface Props {
  cliente: ClienteComStatus;
  profile: CartografiaProfile | null;
  sessionData: SessionData;
  setSessionData: React.Dispatch<React.SetStateAction<SessionData>>;
  startedAt: Date;
  onEnd: () => void;
}

const FERRAMENTAS = [
  'Cartografia', 'Torres', 'Portas', 'Arquétipos', 'Sonhos', 'Biblioteca de Intervenções',
];

function Timer({ startedAt }: { startedAt: Date }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);
  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;
  return <span className="tabular-nums">{m.toString().padStart(2, '0')}:{s.toString().padStart(2, '0')}</span>;
}

export function CabineSessao({ cliente, profile, sessionData, setSessionData, startedAt, onEnd }: Props) {
  const [step, setStep] = useState(1);
  const [paused, setPaused] = useState(false);
  const pj = profile?.profile_json;

  const update = (field: keyof SessionData, value: string) => {
    setSessionData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      {/* Header fixo */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{cliente.nome}</p>
              <p className="text-xs text-primary/70 font-mono">
                <Timer startedAt={startedAt} />
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPaused(!paused)}>
              <Pause className="w-3.5 h-3.5" />
            </Button>
            <Button variant="destructive" size="sm" className="text-xs h-8" onClick={onEnd}>
              <Square className="w-3 h-3 mr-1" /> Encerrar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resumo de condução */}
      {pj && (
        <div className="flex gap-2 flex-wrap">
          {pj.estrategia_defesa && (
            <Badge variant="outline" className="text-[9px] gap-1 border-amber-500/20 text-amber-400/80">
              <Shield className="w-2.5 h-2.5" /> {pj.estrategia_defesa}
            </Badge>
          )}
          {pj.tensao_central && (
            <Badge variant="outline" className="text-[9px] gap-1 border-red-400/20 text-red-400/80">
              <Zap className="w-2.5 h-2.5" /> {pj.tensao_central}
            </Badge>
          )}
          {pj.ritmo_ideal && (
            <Badge variant="outline" className="text-[9px] gap-1 border-primary/20 text-primary/80">
              <Compass className="w-2.5 h-2.5" /> {pj.ritmo_ideal}
            </Badge>
          )}
        </div>
      )}

      {/* Step indicator */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            onClick={() => setStep(n)}
            className={`flex-1 h-1 rounded-full transition-all ${
              step >= n ? 'bg-primary' : 'bg-muted/30'
            }`}
          />
        ))}
      </div>

      {/* Etapa 1: Check-in */}
      {step === 1 && (
        <Card className="border-border/20 bg-card/50">
          <CardContent className="p-4 space-y-3">
            <p className="text-[10px] uppercase tracking-widest text-primary/60 font-medium">Etapa 1 — Check-in</p>
            <Textarea
              value={sessionData.checkinTexto}
              onChange={e => update('checkinTexto', e.target.value)}
              placeholder="Estado inicial da cliente..."
              className="bg-background/40 border-border/20 min-h-[80px] text-sm"
            />
            <Button onClick={() => setStep(2)} className="w-full" size="sm">
              Registrar estado inicial
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Etapa 2: Leitura de Campo */}
      {step === 2 && (
        <Card className="border-border/20 bg-card/50">
          <CardContent className="p-4 space-y-3">
            <p className="text-[10px] uppercase tracking-widest text-primary/60 font-medium">Etapa 2 — Leitura de campo</p>
            <Input value={sessionData.portaAtiva} onChange={e => update('portaAtiva', e.target.value)}
              placeholder="Porta ativa" className="bg-background/40 border-border/20 h-9 text-sm" />
            <Input value={sessionData.campoPredominante} onChange={e => update('campoPredominante', e.target.value)}
              placeholder="Campo predominante" className="bg-background/40 border-border/20 h-9 text-sm" />
            <Input value={sessionData.torreEstruturante} onChange={e => update('torreEstruturante', e.target.value)}
              placeholder="Torre estruturante" className="bg-background/40 border-border/20 h-9 text-sm" />
            <Textarea value={sessionData.observacaoEtica} onChange={e => update('observacaoEtica', e.target.value)}
              placeholder="Observação ética..." className="bg-background/40 border-border/20 min-h-[60px] text-sm" />
            <Button onClick={() => setStep(3)} className="w-full" size="sm">Avançar</Button>
          </CardContent>
        </Card>
      )}

      {/* Etapa 3: Ferramenta */}
      {step === 3 && (
        <Card className="border-border/20 bg-card/50">
          <CardContent className="p-4 space-y-3">
            <p className="text-[10px] uppercase tracking-widest text-primary/60 font-medium">Etapa 3 — Ferramenta</p>
            <Select value={sessionData.ferramentaEscolhida} onValueChange={v => update('ferramentaEscolhida', v)}>
              <SelectTrigger className="bg-background/40 border-border/20">
                <SelectValue placeholder="Selecione a ferramenta..." />
              </SelectTrigger>
              <SelectContent>
                {FERRAMENTAS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={() => setStep(4)} className="w-full" size="sm">Avançar</Button>
          </CardContent>
        </Card>
      )}

      {/* Etapa 4: Condução */}
      {step === 4 && (
        <Card className="border-border/20 bg-card/50">
          <CardContent className="p-4 space-y-3">
            <p className="text-[10px] uppercase tracking-widest text-primary/60 font-medium">Etapa 4 — Condução</p>
            <Textarea
              value={sessionData.anotacoes}
              onChange={e => update('anotacoes', e.target.value)}
              placeholder="Anotações contínuas da sessão..."
              className="bg-background/40 border-border/20 min-h-[120px] text-sm"
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 text-xs gap-1 opacity-50 cursor-default" disabled>
                <Sparkles className="w-3 h-3" /> Sugerir próxima pergunta
              </Button>
              <Button variant="ghost" size="sm" className="text-xs gap-1 opacity-40 cursor-default" disabled>
                <MessageCircle className="w-3 h-3" /> Ampliação simbólica
              </Button>
            </div>
            <Button onClick={() => setStep(5)} className="w-full" size="sm">Avançar para síntese</Button>
          </CardContent>
        </Card>
      )}

      {/* Etapa 5: Síntese */}
      {step === 5 && (
        <Card className="border-border/20 bg-card/50">
          <CardContent className="p-4 space-y-3">
            <p className="text-[10px] uppercase tracking-widest text-primary/60 font-medium">Etapa 5 — Síntese</p>
            <Textarea value={sessionData.resumoSessao} onChange={e => update('resumoSessao', e.target.value)}
              placeholder="Resumo da sessão..." className="bg-background/40 border-border/20 min-h-[80px] text-sm" />
            <Textarea value={sessionData.hipoteseSimbólica} onChange={e => update('hipoteseSimbólica', e.target.value)}
              placeholder="Hipótese simbólica..." className="bg-background/40 border-border/20 min-h-[60px] text-sm" />
            <Textarea value={sessionData.proximosPassos} onChange={e => update('proximosPassos', e.target.value)}
              placeholder="Próximos passos..." className="bg-background/40 border-border/20 min-h-[60px] text-sm" />
            <Button onClick={onEnd} className="w-full h-11 font-semibold" variant="gold">
              <Square className="w-3.5 h-3.5 mr-1" /> Encerrar Sessão
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
