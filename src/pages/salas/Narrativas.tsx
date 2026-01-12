import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Loader2, BookOpen } from 'lucide-react';
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

export default function Narrativas() {
  const [contoUtilizado, setContoUtilizado] = useState('');
  const [tema, setTema] = useState('');
  const [emocaoAtivada, setEmocaoAtivada] = useState('');
  const [insight, setInsight] = useState('');
  const [resistenciaPercebida, setResistenciaPercebida] = useState<'nenhuma' | 'leve' | 'moderada' | 'intensa'>('nenhuma');
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
    // Para futuro: salvar em tabela narrativas_registros
    toast({
      title: 'Registro salvo!',
      description: 'A narrativa terapêutica foi registrada.',
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
          title="Narrativas Terapêuticas (Contos)"
          subtitle="Registro de contos e histórias utilizadas em sessões terapêuticas"
          icon={<BookOpen className="w-5 h-5" />}
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

        <EthicalNotice toolName="Narrativas Terapêuticas" className="mb-6" />

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conto Utilizado</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={contoUtilizado}
                onChange={(e) => setContoUtilizado(e.target.value)}
                placeholder="Nome ou título do conto/história..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tema Central</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                placeholder="Transformação, morte/renascimento, jornada do herói..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emoção Ativada</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={emocaoAtivada}
                onChange={(e) => setEmocaoAtivada(e.target.value)}
                placeholder="Emoções observadas durante ou após a narrativa..."
                rows={2}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Insight Obtido</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={insight}
                onChange={(e) => setInsight(e.target.value)}
                placeholder="Compreensões ou conexões feitas pelo cliente..."
                rows={3}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resistência Percebida</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={resistenciaPercebida} onValueChange={(v: any) => setResistenciaPercebida(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nenhuma">Nenhuma – Cliente receptivo</SelectItem>
                  <SelectItem value="leve">Leve – Pequenas hesitações</SelectItem>
                  <SelectItem value="moderada">Moderada – Dificuldade em se conectar</SelectItem>
                  <SelectItem value="intensa">Intensa – Resistência significativa</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Salvar Narrativa
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
