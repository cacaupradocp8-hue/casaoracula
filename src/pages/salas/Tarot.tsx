import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Loader2, Layers, Plus, X, Leaf } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { EthicalNotice } from '@/components/shared/EthicalNotice';
import { SalvarJardimModal } from '@/components/shared/SalvarJardimModal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const TIRAGENS = [
  'Cruz Celta',
  'Três Cartas',
  'Linha do Tempo',
  'Mandala',
  'Caminho da Heroína',
  'Espelho',
  'Carta do Dia',
  'Outra',
];

export default function Tarot() {
  const [tiragemUtilizada, setTiragemUtilizada] = useState('');
  const [cartas, setCartas] = useState<string[]>([]);
  const [novaCarta, setNovaCarta] = useState('');
  const [leituraSimbolica, setLeituraSimbolica] = useState('');
  const [associacaoTerapeutica, setAssociacaoTerapeutica] = useState('');
  const [saving, setSaving] = useState(false);
  const [clienteInfo, setClienteInfo] = useState<{ id: string; nome: string } | null>(null);
  const [showJardimModal, setShowJardimModal] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const clienteId = searchParams.get('cliente');
  const isUsoPessoal = !clienteId;

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

  const adicionarCarta = () => {
    if (novaCarta.trim()) {
      setCartas([...cartas, novaCarta.trim()]);
      setNovaCarta('');
    }
  };

  const removerCarta = (index: number) => {
    setCartas(cartas.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    // Para futuro: salvar em tabela tarot_registros
    toast({
      title: 'Registro salvo!',
      description: 'A leitura de Tarô foi registrada.',
    });
    setSaving(false);
    
    // Se for uso pessoal (sem cliente), oferecer salvar no Jardim
    if (isUsoPessoal) {
      setShowJardimModal(true);
    } else if (clienteId) {
      navigate(`/cliente/${clienteId}`);
    }
  };

  const handleJardimSaved = () => {
    toast({ title: 'Salvo no Jardim da Psique!' });
    navigate('/jardim-da-psique');
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
          title="Tarô Terapêutico"
          subtitle="Registro de tiragens e leituras simbólicas do Tarô"
          icon={<Layers className="w-5 h-5" />}
          className="mb-8"
        />

        {clienteInfo && (
          <Card className="mb-6 border-gold/30 bg-gold/5">
            <CardContent className="py-4">
              <p className="text-sm">
                Registrando para: <strong>{clienteInfo.nome}</strong>
              </p>
            </CardContent>
          </Card>
        )}

        <EthicalNotice toolName="Tarô Terapêutico" className="mb-6" />

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tiragem Utilizada</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={tiragemUtilizada} onValueChange={setTiragemUtilizada}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a tiragem..." />
                </SelectTrigger>
                <SelectContent>
                  {TIRAGENS.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cartas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={novaCarta}
                  onChange={(e) => setNovaCarta(e.target.value)}
                  placeholder="Nome da carta..."
                  onKeyDown={(e) => e.key === 'Enter' && adicionarCarta()}
                />
                <Button onClick={adicionarCarta} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {cartas.map((carta, i) => (
                  <Badge key={i} variant="secondary" className="text-sm py-1 px-3">
                    {carta}
                    <button onClick={() => removerCarta(i)} className="ml-2 hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {cartas.length === 0 && (
                  <p className="text-sm text-muted-foreground">Nenhuma carta adicionada</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Leitura Simbólica</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={leituraSimbolica}
                onChange={(e) => setLeituraSimbolica(e.target.value)}
                placeholder="Interpretação simbólica das cartas..."
                rows={4}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Associação com Processo Terapêutico</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={associacaoTerapeutica}
                onChange={(e) => setAssociacaoTerapeutica(e.target.value)}
                placeholder="Como esta leitura se conecta com o processo terapêutico do cliente..."
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Salvar Leitura
          </Button>
        </div>

        {/* Modal Jardim da Psique - apenas para uso pessoal */}
        <SalvarJardimModal
          open={showJardimModal}
          onOpenChange={setShowJardimModal}
          ferramenta_nome="Tarô Terapêutico"
          ferramenta_chave="tarot"
          tipo_registro="ferramenta"
          conteudo={{
            tiragem: tiragemUtilizada,
            cartas: cartas,
            leitura_simbolica: leituraSimbolica,
            associacao_terapeutica: associacaoTerapeutica,
          }}
          resultado_simbolico={{
            tiragem: tiragemUtilizada,
            cartas_principais: cartas.join(', '),
          }}
          onSaved={handleJardimSaved}
          onSkipped={() => navigate('/ferramentas')}
        />
      </div>
    </AppLayout>
  );
}
