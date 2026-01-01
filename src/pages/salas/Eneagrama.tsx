import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Compass, Save, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EneagramaTipo {
  id: string;
  numero: number;
  nome: string;
  descricao: string;
  virtude: string | null;
  fixacao: string | null;
}

interface EneagramaInstinto {
  id: string;
  chave: string;
  nome: string;
  descricao: string;
}

export default function Eneagrama() {
  const [tipos, setTipos] = useState<EneagramaTipo[]>([]);
  const [instintos, setInstintos] = useState<EneagramaInstinto[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [tipoPrincipal, setTipoPrincipal] = useState<number | null>(null);
  const [asa, setAsa] = useState<string>('');
  const [instinto, setInstinto] = useState<string>('');
  const [defesas, setDefesas] = useState('');
  const [virtude, setVirtude] = useState('');
  const [armadilhas, setArmadilhas] = useState('');
  const [praticaSugerida, setPraticaSugerida] = useState('');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [tiposRes, instintosRes] = await Promise.all([
      supabase
        .from('eneagrama_tipos')
        .select('*')
        .eq('ativo', true)
        .order('numero'),
      supabase
        .from('eneagrama_instintos')
        .select('*')
        .eq('ativo', true)
        .order('chave')
    ]);

    if (tiposRes.data) setTipos(tiposRes.data);
    if (instintosRes.data) setInstintos(instintosRes.data);
    setLoading(false);
  };

  const getAsasDisponiveis = () => {
    if (!tipoPrincipal) return [];
    const asaEsq = tipoPrincipal === 1 ? 9 : tipoPrincipal - 1;
    const asaDir = tipoPrincipal === 9 ? 1 : tipoPrincipal + 1;
    return [asaEsq, asaDir];
  };

  const handleSave = async () => {
    if (!tipoPrincipal) {
      toast({ title: 'Selecione o tipo principal', variant: 'destructive' });
      return;
    }

    setSaving(true);

    const { error } = await supabase.from('eneagrama_registros').insert({
      user_id: user?.id,
      tipo_principal: tipoPrincipal,
      asa: asa ? parseInt(asa) : null,
      instinto: instinto || null,
      defesas,
      virtude,
      armadilhas,
      pratica_sugerida: praticaSugerida,
    });

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Registro Eneagrama salvo com sucesso!' });
      navigate('/salas');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/salas">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <SectionHeader
            title="Eneagrama"
            subtitle="Mapeamento dos 9 tipos, asas e instintos"
            icon={<Compass className="w-5 h-5" />}
          />
        </div>

        <Card className="glass mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Tipo Principal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 grid-cols-3 md:grid-cols-3">
              {tipos.map(tipo => (
                <button
                  key={tipo.id}
                  onClick={() => {
                    setTipoPrincipal(tipo.numero);
                    setAsa('');
                  }}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    tipoPrincipal === tipo.numero
                      ? 'border-gold bg-gold/10'
                      : 'border-border hover:border-gold/50'
                  }`}
                >
                  <div className="text-2xl font-display text-gold mb-1">{tipo.numero}</div>
                  <div className="text-sm font-medium">{tipo.nome}</div>
                  <div className="text-xs text-muted-foreground">{tipo.descricao}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg">Asa (opcional)</CardTitle>
            </CardHeader>
            <CardContent>
              {tipoPrincipal ? (
                <Select value={asa} onValueChange={setAsa}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a asa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhuma</SelectItem>
                    {getAsasDisponiveis().map(a => {
                      const tipoAsa = tipos.find(t => t.numero === a);
                      return (
                        <SelectItem key={a} value={a.toString()}>
                          Asa {a} - {tipoAsa?.nome || `Tipo ${a}`}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-muted-foreground">Selecione o tipo principal primeiro</p>
              )}
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg">Instinto Dominante</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={instinto} onValueChange={setInstinto}>
                {instintos.map(inst => (
                  <div key={inst.id} className="flex items-start space-x-2">
                    <RadioGroupItem value={inst.chave} id={inst.chave} />
                    <Label htmlFor={inst.chave} className="cursor-pointer">
                      <span className="font-medium">{inst.nome}</span>
                      <span className="block text-xs text-muted-foreground">{inst.descricao}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        <Card className="glass mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Análise Clínica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Padrão de defesa observado</Label>
              <Textarea
                value={defesas}
                onChange={e => setDefesas(e.target.value)}
                placeholder="Quais mecanismos de defesa são mais evidentes?"
                rows={3}
              />
            </div>
            <div>
              <Label>Virtude a cultivar</Label>
              <Textarea
                value={virtude}
                onChange={e => setVirtude(e.target.value)}
                placeholder="Qual qualidade pode contrabalançar a fixação do tipo?"
                rows={2}
              />
            </div>
            <div>
              <Label>Armadilhas na condução</Label>
              <Textarea
                value={armadilhas}
                onChange={e => setArmadilhas(e.target.value)}
                placeholder="O que evitar ao trabalhar com este tipo?"
                rows={3}
              />
            </div>
            <div>
              <Label>Prática sugerida</Label>
              <Textarea
                value={praticaSugerida}
                onChange={e => setPraticaSugerida(e.target.value)}
                placeholder="Exercícios, reflexões ou tarefas recomendadas"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={saving || !tipoPrincipal} variant="gold" className="w-full" size="lg">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Salvando...' : 'Salvar Registro'}
        </Button>
      </div>
    </AppLayout>
  );
}
