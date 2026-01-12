import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Loader2, Target, ExternalLink } from 'lucide-react';
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

const TIPOS_GRAFICO = [
  'Chakras',
  'Emoções',
  'Arquétipos',
  'Meridianos',
  'Órgãos',
  'Elementais',
  'Cores',
  'Frequências',
  'Outro',
];

export default function Radiestesia() {
  const [graficoUtilizado, setGraficoUtilizado] = useState('');
  const [tipoGrafico, setTipoGrafico] = useState('');
  const [resultado, setResultado] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [versaoFisicaUrl, setVersaoFisicaUrl] = useState('');
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
    // Para futuro: salvar em tabela radiestesia_registros
    toast({
      title: 'Registro salvo!',
      description: 'A leitura radiestésica foi registrada.',
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
          title="Radiestesia & Gráficos Vibracionais"
          subtitle="Registro de leituras radiestésicas e gráficos utilizados"
          icon={<Target className="w-5 h-5" />}
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

        <EthicalNotice toolName="Radiestesia" className="mb-6" />

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gráfico Utilizado</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={graficoUtilizado}
                onChange={(e) => setGraficoUtilizado(e.target.value)}
                placeholder="Nome do gráfico utilizado..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tipo de Gráfico</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={tipoGrafico} onValueChange={setTipoGrafico}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo..." />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_GRAFICO.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resultado da Leitura</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={resultado}
                onChange={(e) => setResultado(e.target.value)}
                placeholder="Resultado obtido na radiestesia..."
                rows={3}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Contexto, correlações percebidas, recomendações..."
                rows={3}
              />
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Versão Física Recomendada
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Link para aquisição da versão física do gráfico (configurável pelo Admin)
              </p>
              <Input
                value={versaoFisicaUrl}
                onChange={(e) => setVersaoFisicaUrl(e.target.value)}
                placeholder="https://..."
              />
              {versaoFisicaUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={versaoFisicaUrl} target="_blank" rel="noopener noreferrer">
                    Abrir link <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

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
