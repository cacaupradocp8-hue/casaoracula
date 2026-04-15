import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Leaf, CheckCircle, Send, Shield, AlertCircle, Compass, Eye, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/dal/dbClient';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { ClienteComStatus, SessionData } from '@/pages/casa-maquinas/CabineTerapeutaPage';
import type { LeituraCampo } from '@/lib/cabine/motorOracular';
import type { MapaVivoState } from '@/lib/cabine/motorMapaVivo';
import type { FluxoClinicoResult } from '@/lib/cabine/motorSessaoVivo';
import { gerarSinteseSessao, type SinteseSessao } from '@/lib/cabine/motorSintese';

interface Props {
  cliente: ClienteComStatus;
  sessionId: string;
  sessionData: SessionData;
  leituraCampo: LeituraCampo | null;
  mapaVivoState: MapaVivoState | null;
  fluxoFinal: FluxoClinicoResult | null;
  onDone: () => void;
}

const TIPOS = [
  { value: 'percepcao', label: 'Percepção' },
  { value: 'pratica', label: 'Prática' },
  { value: 'limite', label: 'Limite' },
  { value: 'acao', label: 'Ação' },
  { value: 'presenca', label: 'Presença' },
  { value: 'escrita_reflexao', label: 'Escrita / Reflexão' },
];

export function CabineIntegracao({ cliente, sessionId, sessionData, leituraCampo, mapaVivoState, fluxoFinal, onDone }: Props) {
  const { user } = useAuth();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('');
  const [duracao, setDuracao] = useState('');
  const [intencao, setIntencao] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Auto-generate synthesis
  const sintese: SinteseSessao = useMemo(() => {
    return gerarSinteseSessao({
      sessionData,
      leitura: leituraCampo,
      mapaVivo: mapaVivoState,
      fluxoFinal,
      liveUpdate: null,
    });
  }, [sessionData, leituraCampo, mapaVivoState, fluxoFinal]);

  const handleSend = async () => {
    if (!user || !titulo) return;
    setSending(true);

    const { error } = await supabase
      .from('gestos_integracao')
      .insert({
        owner_id: user.id,
        cliente_id: cliente.id,
        sessao_id: sessionId,
        gesto_texto: JSON.stringify({
          titulo, descricao, tipo, duracao, intencao_simbolica: intencao,
          sintese_auto: sintese,
        }),
        status: 'ativo',
      } as any);

    setSending(false);
    if (error) {
      toast.error('Erro ao salvar movimento de integração');
      return;
    }
    toast.success('Movimento de integração registrado');
    setSent(true);
  };

  const handleEnviarJardim = async () => {
    if (!user || !cliente.client_user_id) return;
    setSending(true);

    // Save gesto
    const { error: gestoError } = await supabase
      .from('gestos_integracao')
      .insert({
        owner_id: user.id,
        cliente_id: cliente.id,
        sessao_id: sessionId,
        gesto_texto: JSON.stringify({
          titulo: titulo || 'Integração da sessão',
          descricao, tipo, duracao, intencao_simbolica: intencao,
          sintese_auto: sintese,
        }),
        status: 'ativo',
      } as any);

    if (gestoError) {
      setSending(false);
      toast.error('Erro ao salvar');
      return;
    }

    // Find jardim for this client
    const { data: jardimData } = await supabase
      .from('co_jardins')
      .select('id')
      .eq('client_user_id', cliente.client_user_id)
      .eq('therapist_user_id', user.id)
      .eq('status', 'active')
      .limit(1)
      .maybeSingle();

    if (!jardimData) {
      setSending(false);
      toast.success('Sessão salva. Jardim ainda não ativo para esta cliente.');
      setSent(true);
      return;
    }

    // Send symbolic message to garden using correct column names
    const { error: jardimError } = await supabase
      .from('co_jardim_entries')
      .insert({
        jardim_id: jardimData.id,
        client_user_id: cliente.client_user_id,
        therapist_user_id: user.id,
        created_by: user.id,
        entry_type: 'mensagem_sessao',
        content: sintese.mensagem_simbolica,
        visibility_to_client: true,
        shared_with_therapist: true,
      });

    setSending(false);

    if (jardimError) {
      console.error('Jardim send error:', jardimError);
      toast.success('Sessão salva. Envio ao jardim não disponível para esta cliente.');
    } else {
      toast.success('Enviado para o Jardim da cliente');
    }
    setSent(true);
  };

  if (sent) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6 text-center space-y-3">
          <CheckCircle className="w-10 h-10 text-primary mx-auto" />
          <h3 className="font-display font-semibold text-foreground">Sessão concluída</h3>
          <p className="text-xs text-muted-foreground">Sessão registrada e síntese gerada.</p>
          <Button onClick={onDone} variant="outline" size="sm" className="mt-2">
            Voltar à preparação
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Leaf className="w-4 h-4 text-primary" />
            <p className="text-[10px] uppercase tracking-widest text-primary/70 font-medium">
              Síntese e Integração
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Sessão de {cliente.nome} concluída. Revise a síntese gerada.
          </p>
        </CardContent>
      </Card>

      {/* === SÍNTESE AUTOMÁTICA === */}
      <Card className="border-border/20 bg-card/50">
        <CardContent className="p-4 space-y-3">
          {/* Sustentar */}
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-start gap-2">
              <Shield className="w-3.5 h-3.5 text-primary/60 mt-0.5 shrink-0" />
              <div>
                <p className="text-[9px] text-primary/50 uppercase tracking-wider mb-0.5">O que sustentar</p>
                <p className="text-xs text-foreground/80">{sintese.sustentar}</p>
              </div>
            </div>
          </div>

          {/* Evitar */}
          <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/10">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-destructive/50 mt-0.5 shrink-0" />
              <div>
                <p className="text-[9px] text-destructive/50 uppercase tracking-wider mb-0.5">O que evitar</p>
                <p className="text-xs text-foreground/80">{sintese.evitar}</p>
              </div>
            </div>
          </div>

          {/* Em aberto */}
          <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
            <div className="flex items-start gap-2">
              <Eye className="w-3.5 h-3.5 text-amber-400/50 mt-0.5 shrink-0" />
              <div>
                <p className="text-[9px] text-amber-400/50 uppercase tracking-wider mb-0.5">O que ficou em aberto</p>
                <p className="text-xs text-foreground/80">{sintese.em_aberto}</p>
              </div>
            </div>
          </div>

          {/* Direção próxima */}
          <div className="p-3 rounded-lg bg-background/50 border border-border/15">
            <div className="flex items-start gap-2">
              <Compass className="w-3.5 h-3.5 text-primary/40 mt-0.5 shrink-0" />
              <div>
                <p className="text-[9px] text-primary/40 uppercase tracking-wider mb-0.5">Direção próxima sessão</p>
                <p className="text-xs text-foreground/80">{sintese.direcao_proxima}</p>
              </div>
            </div>
          </div>

          {/* Mensagem simbólica */}
          <div className="p-3 rounded-lg bg-primary/3 border border-primary/8">
            <p className="text-[9px] text-primary/40 uppercase tracking-wider mb-1">Mensagem para o Jardim</p>
            <p className="text-sm text-foreground/90 italic leading-relaxed">{sintese.mensagem_simbolica}</p>
          </div>
        </CardContent>
      </Card>

      {/* === MOVIMENTO DE INTEGRAÇÃO (opcional) === */}
      <Card className="border-border/20 bg-card/50">
        <CardContent className="p-4 space-y-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 font-medium">
            Movimento de integração (opcional)
          </p>
          <Input value={titulo} onChange={e => setTitulo(e.target.value)}
            placeholder="Título do movimento" className="bg-background/40 border-border/20 h-9 text-sm" />
          <Textarea value={descricao} onChange={e => setDescricao(e.target.value)}
            placeholder="Descrição..." className="bg-background/40 border-border/20 min-h-[50px] text-sm" />
          <div className="grid grid-cols-2 gap-2">
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger className="bg-background/40 border-border/20 text-sm">
                <SelectValue placeholder="Tipo..." />
              </SelectTrigger>
              <SelectContent>
                {TIPOS.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input value={duracao} onChange={e => setDuracao(e.target.value)}
              placeholder="Duração (ex: 7 dias)" className="bg-background/40 border-border/20 h-9 text-sm" />
          </div>
          <Textarea value={intencao} onChange={e => setIntencao(e.target.value)}
            placeholder="Intenção simbólica..." className="bg-background/40 border-border/20 min-h-[50px] text-sm" />
        </CardContent>
      </Card>

      {/* === AÇÕES === */}
      <div className="space-y-2">
        {cliente.client_user_id && (
          <Button onClick={handleEnviarJardim} disabled={sending} className="w-full h-11" variant="gold">
            <Send className="w-3.5 h-3.5 mr-1.5" />
            Enviar para o Jardim da cliente
          </Button>
        )}
        <Button onClick={handleSend} disabled={sending} variant="outline" className="w-full text-sm">
          <ArrowRight className="w-3.5 h-3.5 mr-1.5" />
          {cliente.client_user_id ? 'Salvar sem enviar ao Jardim' : 'Salvar síntese'}
        </Button>
        <Button onClick={onDone} variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
          Pular e voltar à preparação
        </Button>
      </div>
    </div>
  );
}
