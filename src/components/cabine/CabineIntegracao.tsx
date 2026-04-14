import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Leaf, CheckCircle, Send } from 'lucide-react';
import { supabase } from '@/lib/dal/dbClient';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { ClienteComStatus } from '@/pages/casa-maquinas/CabineTerapeutaPage';

interface Props {
  cliente: ClienteComStatus;
  sessionId: string;
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

export function CabineIntegracao({ cliente, sessionId, onDone }: Props) {
  const { user } = useAuth();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('');
  const [duracao, setDuracao] = useState('');
  const [intencao, setIntencao] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!user || !titulo) return;
    setSending(true);

    // Save gesto de integração linked to session
    const { error } = await supabase
      .from('gestos_integracao')
      .insert({
        owner_id: user.id,
        cliente_id: cliente.id,
        sessao_id: sessionId,
        gesto_texto: JSON.stringify({
          titulo, descricao, tipo, duracao, intencao_simbolica: intencao,
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

  if (sent) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6 text-center space-y-3">
          <CheckCircle className="w-10 h-10 text-primary mx-auto" />
          <h3 className="font-display font-semibold text-foreground">Sessão concluída</h3>
          <p className="text-xs text-muted-foreground">Sessão registrada e movimento de integração enviado.</p>
          <Button onClick={onDone} variant="outline" size="sm" className="mt-2">
            Voltar à preparação
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Leaf className="w-4 h-4 text-primary" />
            <p className="text-[10px] uppercase tracking-widest text-primary/70 font-medium">
              Definir movimento de integração
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Sessão de {cliente.nome} foi registrada. Defina o gesto de integração.
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/20 bg-card/50">
        <CardContent className="p-4 space-y-3">
          <Input value={titulo} onChange={e => setTitulo(e.target.value)}
            placeholder="Título do movimento" className="bg-background/40 border-border/20 h-9 text-sm" />
          <Textarea value={descricao} onChange={e => setDescricao(e.target.value)}
            placeholder="Descrição..." className="bg-background/40 border-border/20 min-h-[60px] text-sm" />
          <Select value={tipo} onValueChange={setTipo}>
            <SelectTrigger className="bg-background/40 border-border/20">
              <SelectValue placeholder="Tipo de movimento..." />
            </SelectTrigger>
            <SelectContent>
              {TIPOS.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input value={duracao} onChange={e => setDuracao(e.target.value)}
            placeholder="Duração sugerida (ex: 7 dias)" className="bg-background/40 border-border/20 h-9 text-sm" />
          <Textarea value={intencao} onChange={e => setIntencao(e.target.value)}
            placeholder="Intenção simbólica..." className="bg-background/40 border-border/20 min-h-[60px] text-sm" />
          <Button onClick={handleSend} disabled={!titulo || sending} className="w-full" variant="gold">
            <Send className="w-3.5 h-3.5 mr-1" />
            {cliente.client_user_id ? 'Enviar para o Jardim' : 'Salvar na Sessão'}
          </Button>
          <Button onClick={onDone} variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
            Pular e voltar à preparação
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
