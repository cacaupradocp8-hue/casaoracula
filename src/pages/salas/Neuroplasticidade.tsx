import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { EthicalNotice } from '@/components/shared/EthicalNotice';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CampoIntegracaoViva() {
  const [modoAnterior, setModoAnterior] = useState('');
  const [contextoAtivacao, setContextoAtivacao] = useState('');
  const [novaResposta, setNovaResposta] = useState('');
  const [ritmo, setRitmo] = useState<'diaria' | 'semanal' | 'quando_surgir'>('semanal');
  const [percepcoes, setPercepcoes] = useState('');
  const [saving, setSaving] = useState(false);
  const [clienteInfo, setClienteInfo] = useState<{ id: string; nome: string } | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const clienteId = searchParams.get('cliente');

  useEffect(() => {
    if (clienteId) {
      fetchCliente();
    }
  }, [clienteId]);

  const fetchCliente = async () => {
    if (!clienteId) return;
    const { data } = await supabase
      .from('clientes')
      .select('id, nome')
      .eq('id', clienteId)
      .single();
    if (data) setClienteInfo(data);
  };

  const handleSave = async () => {
    setSaving(true);
    toast({
      title: 'Registro integrado',
      description: 'O campo de integração foi atualizado.',
    });
    setSaving(false);
    if (clienteId) {
      navigate(`/cliente/${clienteId}`);
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <div className="mb-6">
          <Link to="/ferramentas" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Voltar às Ferramentas
          </Link>
        </div>

        <SectionHeader
          title="Campo de Integração Viva"
          subtitle="Onde novos modos de responder à vida se estabilizam"
          icon={<Sparkles className="w-5 h-5" />}
          className="mb-8"
        />

        {clienteInfo && (
          <Card className="mb-6 border-gold/30 bg-gold/5">
            <CardContent className="py-4">
              <p className="text-sm">
                Integrando com: <strong>{clienteInfo.nome}</strong>
              </p>
            </CardContent>
          </Card>
        )}

        <EthicalNotice toolName="Campo de Integração" className="mb-6" />

        {/* Texto introdutório simbólico */}
        <Card className="mb-6 border-gold/20 bg-card/50">
          <CardContent className="py-6">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Este não é um espaço de correção. É um campo de reorganização interna —
              onde o que foi percebido encontra lugar para enraizar. Aqui, a consciência
              se transforma em continuidade. Sem pressa. Sem método. Apenas presença e repetição viva.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">O que pede para mudar</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={modoAnterior}
                onChange={(e) => setModoAnterior(e.target.value)}
                placeholder="Descreva o modo de responder que não serve mais... uma reação automática, uma forma antiga de lidar com algo..."
                rows={3}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quando isso aparece</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={contextoAtivacao}
                onChange={(e) => setContextoAtivacao(e.target.value)}
                placeholder="Em quais situações esse modo antigo costuma surgir? Lugares, pessoas, momentos..."
                rows={3}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">A nova resposta que deseja nascer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={novaResposta}
                onChange={(e) => setNovaResposta(e.target.value)}
                placeholder="Como você gostaria de responder de forma diferente? Qual movimento novo está tentando se estabelecer?"
                rows={3}
              />
              <div>
                <Label className="text-muted-foreground">Ritmo de sustentação</Label>
                <Select value={ritmo} onValueChange={(v: any) => setRitmo(v)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diaria">Atenção diária</SelectItem>
                    <SelectItem value="semanal">Revisão semanal</SelectItem>
                    <SelectItem value="quando_surgir">Quando surgir</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Percepções do caminho</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={percepcoes}
                onChange={(e) => setPercepcoes(e.target.value)}
                placeholder="O que você tem percebido nesse processo? Resistências, pequenas vitórias, momentos de clareza..."
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Registrar Integração
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
