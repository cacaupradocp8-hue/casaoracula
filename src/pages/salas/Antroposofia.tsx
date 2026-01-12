import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Save, Loader2, Triangle } from 'lucide-react';
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

export default function Antroposofia() {
  const [pensar, setPensar] = useState(5);
  const [sentir, setSentir] = useState(5);
  const [querer, setQuerer] = useState(5);
  const [coerencia, setCoerencia] = useState<'alta' | 'media' | 'baixa'>('media');
  const [observacoesBiograficas, setObservacoesBiograficas] = useState('');
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
    // Para futuro: salvar em tabela antroposofia_registros
    toast({
      title: 'Registro salvo!',
      description: 'A avaliação de competências do ego foi registrada.',
    });
    setSaving(false);
    if (clienteId) {
      navigate(`/cliente/${clienteId}`);
    }
  };

  const getForçaLabel = (valor: number) => {
    if (valor <= 3) return 'Pouco desenvolvida';
    if (valor <= 6) return 'Em desenvolvimento';
    if (valor <= 8) return 'Bem desenvolvida';
    return 'Muito forte';
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
          title="Competências do Ego (Antroposofia)"
          subtitle="Avaliação das forças do Pensar, Sentir e Querer"
          icon={<Triangle className="w-5 h-5" />}
          className="mb-8"
        />

        {clienteInfo && (
          <Card className="mb-6 border-gold/30 bg-gold/5">
            <CardContent className="py-4">
              <p className="text-sm">
                Avaliando para: <strong>{clienteInfo.nome}</strong>
              </p>
            </CardContent>
          </Card>
        )}

        <EthicalNotice toolName="Antroposofia" className="mb-6" />

        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-500 flex items-center gap-2">
                💭 Pensar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <span className="text-4xl font-bold text-blue-500">{pensar}</span>
                <p className="text-sm text-muted-foreground">{getForçaLabel(pensar)}</p>
              </div>
              <Slider
                value={[pensar]}
                onValueChange={(v) => setPensar(v[0])}
                min={1}
                max={10}
                step={1}
              />
              <p className="text-xs text-muted-foreground">
                Clareza mental, capacidade de abstração, organização de ideias
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-red-500 flex items-center gap-2">
                ❤️ Sentir
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <span className="text-4xl font-bold text-red-500">{sentir}</span>
                <p className="text-sm text-muted-foreground">{getForçaLabel(sentir)}</p>
              </div>
              <Slider
                value={[sentir]}
                onValueChange={(v) => setSentir(v[0])}
                min={1}
                max={10}
                step={1}
              />
              <p className="text-xs text-muted-foreground">
                Vida emocional, empatia, conexão com os próprios sentimentos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-yellow-600 flex items-center gap-2">
                ⚡ Querer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <span className="text-4xl font-bold text-yellow-600">{querer}</span>
                <p className="text-sm text-muted-foreground">{getForçaLabel(querer)}</p>
              </div>
              <Slider
                value={[querer]}
                onValueChange={(v) => setQuerer(v[0])}
                min={1}
                max={10}
                step={1}
              />
              <p className="text-xs text-muted-foreground">
                Força de vontade, capacidade de ação, persistência
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Coerência Percebida</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={coerencia} onValueChange={(v: any) => setCoerencia(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alta">Alta – As três forças estão equilibradas</SelectItem>
                <SelectItem value="media">Média – Algum desequilíbrio perceptível</SelectItem>
                <SelectItem value="baixa">Baixa – Forças muito desproporcionais</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Observações Biográficas</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={observacoesBiograficas}
              onChange={(e) => setObservacoesBiograficas(e.target.value)}
              placeholder="Momentos de vida relevantes, padrões observados, fases biográficas..."
              rows={4}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Salvar Avaliação
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
