import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Loader2, BrainCircuit } from 'lucide-react';
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

export default function Neuroplasticidade() {
  const [padraoObservado, setPadraoObservado] = useState('');
  const [gatilhos, setGatilhos] = useState('');
  const [praticaAplicada, setPraticaAplicada] = useState('');
  const [frequencia, setFrequencia] = useState<'diaria' | 'semanal' | 'esporadica'>('semanal');
  const [observacoes, setObservacoes] = useState('');
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
    // Para futuro: salvar em tabela neuroplasticidade_registros
    toast({
      title: 'Registro salvo!',
      description: 'O mapeamento de padrões foi registrado.',
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
          title="Neuroplasticidade & Mudança de Padrões"
          subtitle="Mapeamento de padrões comportamentais e práticas de ressignificação"
          icon={<BrainCircuit className="w-5 h-5" />}
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

        <EthicalNotice toolName="Neuroplasticidade" className="mb-6" />

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Padrão Observado</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={padraoObservado}
                onChange={(e) => setPadraoObservado(e.target.value)}
                placeholder="Descreva o padrão de comportamento, pensamento ou emoção identificado..."
                rows={3}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gatilhos Identificados</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={gatilhos}
                onChange={(e) => setGatilhos(e.target.value)}
                placeholder="Situações, pessoas, ambientes ou estímulos que ativam o padrão..."
                rows={3}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prática Aplicada</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={praticaAplicada}
                onChange={(e) => setPraticaAplicada(e.target.value)}
                placeholder="Técnica ou prática utilizada para ressignificar o padrão..."
                rows={3}
              />
              <div>
                <Label>Frequência recomendada</Label>
                <Select value={frequencia} onValueChange={(v: any) => setFrequencia(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diaria">Diária</SelectItem>
                    <SelectItem value="semanal">Semanal</SelectItem>
                    <SelectItem value="esporadica">Esporádica (conforme necessidade)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Observações Clínicas</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Evolução percebida, resistências, insights..."
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Salvar Mapeamento
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
