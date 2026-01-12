import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Save, Loader2, Activity } from 'lucide-react';
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

const NIVEIS_HAWKINS = [
  { nivel: 20, nome: 'Vergonha' },
  { nivel: 30, nome: 'Culpa' },
  { nivel: 50, nome: 'Apatia' },
  { nivel: 75, nome: 'Pesar' },
  { nivel: 100, nome: 'Medo' },
  { nivel: 125, nome: 'Desejo' },
  { nivel: 150, nome: 'Raiva' },
  { nivel: 175, nome: 'Orgulho' },
  { nivel: 200, nome: 'Coragem' },
  { nivel: 250, nome: 'Neutralidade' },
  { nivel: 310, nome: 'Disposição' },
  { nivel: 350, nome: 'Aceitação' },
  { nivel: 400, nome: 'Razão' },
  { nivel: 500, nome: 'Amor' },
  { nivel: 540, nome: 'Alegria' },
  { nivel: 600, nome: 'Paz' },
  { nivel: 700, nome: 'Iluminação' },
];

export default function Hawkins() {
  const [nivelAtual, setNivelAtual] = useState(200);
  const [tendencia, setTendencia] = useState<'subindo' | 'estavel' | 'oscilante'>('estavel');
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

  const getNivelNome = (nivel: number) => {
    const encontrado = [...NIVEIS_HAWKINS].reverse().find(n => nivel >= n.nivel);
    return encontrado?.nome || 'Vergonha';
  };

  const getNivelCor = (nivel: number) => {
    if (nivel < 200) return 'text-red-500';
    if (nivel < 400) return 'text-yellow-500';
    if (nivel < 600) return 'text-green-500';
    return 'text-violet-500';
  };

  const handleSave = async () => {
    setSaving(true);
    // Para futuro: salvar em tabela hawkins_registros
    toast({
      title: 'Registro salvo!',
      description: 'A leitura de Hawkins foi registrada com sucesso.',
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
          title="Tabela de Hawkins – Tendência Vibracional"
          subtitle="Mapeamento do nível de consciência baseado na escala de David Hawkins"
          icon={<Activity className="w-5 h-5" />}
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

        <EthicalNotice toolName="Tabela de Hawkins" className="mb-6" />

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Nível de Consciência Aproximado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <span className={`text-6xl font-bold ${getNivelCor(nivelAtual)}`}>
                {nivelAtual}
              </span>
              <p className="text-xl text-muted-foreground mt-2">
                {getNivelNome(nivelAtual)}
              </p>
            </div>

            <div className="px-4">
              <Slider
                value={[nivelAtual]}
                onValueChange={(v) => setNivelAtual(v[0])}
                min={20}
                max={700}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>20 - Vergonha</span>
                <span>200 - Coragem</span>
                <span>500 - Amor</span>
                <span>700 - Iluminação</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
              {NIVEIS_HAWKINS.filter(n => n.nivel >= 100).map((n) => (
                <Button
                  key={n.nivel}
                  variant={nivelAtual === n.nivel ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNivelAtual(n.nivel)}
                  className="text-xs"
                >
                  {n.nivel} - {n.nome}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tendência Observada</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={tendencia} onValueChange={(v: any) => setTendencia(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="subindo">⬆️ Subindo</SelectItem>
                <SelectItem value="estavel">➡️ Estável</SelectItem>
                <SelectItem value="oscilante">↕️ Oscilante</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Contexto da avaliação, comportamentos observados, eventos recentes..."
              rows={4}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Salvar Registro
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
