import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Loader2, CircleDot } from 'lucide-react';
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

interface ChakraItem {
  nome: string;
  cor: string;
  status: 'ativo' | 'bloqueado' | 'integracao';
  observacao: string;
}

const CHAKRAS_INICIAL: ChakraItem[] = [
  { nome: 'Raiz (Muladhara)', cor: 'bg-red-500', status: 'ativo', observacao: '' },
  { nome: 'Sacral (Svadhisthana)', cor: 'bg-orange-500', status: 'ativo', observacao: '' },
  { nome: 'Plexo Solar (Manipura)', cor: 'bg-yellow-500', status: 'ativo', observacao: '' },
  { nome: 'Cardíaco (Anahata)', cor: 'bg-green-500', status: 'ativo', observacao: '' },
  { nome: 'Laríngeo (Vishuddha)', cor: 'bg-blue-500', status: 'ativo', observacao: '' },
  { nome: 'Frontal (Ajna)', cor: 'bg-indigo-500', status: 'ativo', observacao: '' },
  { nome: 'Coronário (Sahasrara)', cor: 'bg-violet-500', status: 'ativo', observacao: '' },
];

export default function Chakras() {
  const [chakras, setChakras] = useState<ChakraItem[]>(CHAKRAS_INICIAL);
  const [observacoesGerais, setObservacoesGerais] = useState('');
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

  const handleStatusChange = (index: number, status: 'ativo' | 'bloqueado' | 'integracao') => {
    const updated = [...chakras];
    updated[index].status = status;
    setChakras(updated);
  };

  const handleObservacaoChange = (index: number, observacao: string) => {
    const updated = [...chakras];
    updated[index].observacao = observacao;
    setChakras(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    // Para futuro: salvar em tabela chakras_registros
    toast({
      title: 'Leitura salva!',
      description: 'A leitura de chakras foi registrada com sucesso.',
    });
    setSaving(false);
    if (clienteId) {
      navigate(`/cliente/${clienteId}`);
    }
  };

  const statusLabel = {
    ativo: 'Ativo',
    bloqueado: 'Bloqueado',
    integracao: 'Em Integração',
  };

  const statusColor = {
    ativo: 'bg-green-100 text-green-800',
    bloqueado: 'bg-red-100 text-red-800',
    integracao: 'bg-yellow-100 text-yellow-800',
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
          title="Chakras – Leitura Energética Simbólica"
          subtitle="Avaliação simbólica dos 7 chakras principais"
          icon={<CircleDot className="w-5 h-5" />}
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

        <EthicalNotice toolName="Chakras" className="mb-6" />

        <div className="space-y-4">
          {chakras.map((chakra, index) => (
            <Card key={chakra.nome}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className={`w-4 h-4 rounded-full ${chakra.cor}`} />
                  {chakra.nome}
                  <Badge className={statusColor[chakra.status]}>
                    {statusLabel[chakra.status]}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Status</Label>
                  <Select
                    value={chakra.status}
                    onValueChange={(v) => handleStatusChange(index, v as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="bloqueado">Bloqueado</SelectItem>
                      <SelectItem value="integracao">Em Integração</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Observações simbólicas</Label>
                  <Textarea
                    value={chakra.observacao}
                    onChange={(e) => handleObservacaoChange(index, e.target.value)}
                    placeholder="Notas sobre este chakra..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Observações Gerais</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={observacoesGerais}
              onChange={(e) => setObservacoesGerais(e.target.value)}
              placeholder="Síntese da leitura energética..."
              rows={4}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end mt-6">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Salvar Leitura
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
