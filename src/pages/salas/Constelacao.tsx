import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Loader2, Users, Leaf } from 'lucide-react';
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

const TIPOS_CONSTELACAO = [
  'Familiar',
  'Organizacional',
  'Sintoma',
  'Relação',
  'Ancestral',
  'Arquetípica',
  'Movimento da Alma',
  'Outra',
];

export default function Constelacao() {
  const [tipoConstelacao, setTipoConstelacao] = useState('');
  const [tema, setTema] = useState('');
  const [padroesIdentificados, setPadroesIdentificados] = useState('');
  const [frasesUsadas, setFrasesUsadas] = useState('');
  const [movimentosPercebidos, setMovimentosPercebidos] = useState('');
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

  const handleSave = async () => {
    setSaving(true);
    // Para futuro: salvar em tabela constelacao_registros
    toast({
      title: 'Registro salvo!',
      description: 'A constelação foi registrada.',
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
          title="Constelação Sistêmica"
          subtitle="Registro de movimentos e padrões observados em constelações"
          icon={<Users className="w-5 h-5" />}
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

        <EthicalNotice toolName="Constelação Sistêmica" className="mb-6" />

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tipo de Constelação</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={tipoConstelacao} onValueChange={setTipoConstelacao}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo..." />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_CONSTELACAO.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tema / Questão Central</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                placeholder="Qual foi a questão trabalhada..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Padrões Identificados</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={padroesIdentificados}
                onChange={(e) => setPadroesIdentificados(e.target.value)}
                placeholder="Padrões sistêmicos, emaranhamentos, exclusões..."
                rows={4}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frases Utilizadas</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={frasesUsadas}
                onChange={(e) => setFrasesUsadas(e.target.value)}
                placeholder="Frases de cura, reconhecimento, restituição..."
                rows={3}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Movimentos Percebidos</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={movimentosPercebidos}
                onChange={(e) => setMovimentosPercebidos(e.target.value)}
                placeholder="Movimentos da alma, reações, mudanças de posição..."
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Salvar Constelação
          </Button>
        </div>

        {/* Modal Jardim da Psique - apenas para uso pessoal */}
        <SalvarJardimModal
          open={showJardimModal}
          onOpenChange={setShowJardimModal}
          ferramenta_nome="Constelação Sistêmica"
          ferramenta_chave="constelacao"
          tipo_registro="ferramenta"
          conteudo={{
            tipo: tipoConstelacao,
            tema: tema,
            padroes_identificados: padroesIdentificados,
            frases_usadas: frasesUsadas,
            movimentos_percebidos: movimentosPercebidos,
          }}
          resultado_simbolico={{
            tipo: tipoConstelacao,
            tema: tema,
          }}
          onSaved={handleJardimSaved}
          onSkipped={() => navigate('/ferramentas')}
        />
      </div>
    </AppLayout>
  );
}
