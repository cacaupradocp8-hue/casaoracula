import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Compass, Save, ArrowLeft, Loader2, Users } from 'lucide-react';
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
import { z } from 'zod';

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

interface ClienteOption {
  id: string;
  nome: string;
  email: string;
}

// Validation schema
const eneagramaSchema = z.object({
  tipo_principal: z.number().int().min(1).max(9),
  defesas: z.string().max(5000).optional(),
  virtude: z.string().max(5000).optional(),
  armadilhas: z.string().max(5000).optional(),
  pratica_sugerida: z.string().max(5000).optional(),
});

export default function Eneagrama() {
  const [tipos, setTipos] = useState<EneagramaTipo[]>([]);
  const [instintos, setInstintos] = useState<EneagramaInstinto[]>([]);
  const [clientes, setClientes] = useState<ClienteOption[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [tipoPrincipal, setTipoPrincipal] = useState<number | null>(null);
  const [asa, setAsa] = useState<string>('');
  const [instinto, setInstinto] = useState<string>('');
  const [defesas, setDefesas] = useState('');
  const [virtude, setVirtude] = useState('');
  const [armadilhas, setArmadilhas] = useState('');
  const [praticaSugerida, setPraticaSugerida] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedClienteId, setSelectedClienteId] = useState<string>('self');
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if user is a therapist (has clients linked)
  const isTerapeuta = clientes.length > 0;

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    const [tiposRes, instintosRes, clientesRes] = await Promise.all([
      supabase
        .from('eneagrama_tipos')
        .select('*')
        .eq('ativo', true)
        .order('numero'),
      supabase
        .from('eneagrama_instintos')
        .select('*')
        .eq('ativo', true)
        .order('chave'),
      // Fetch clients linked to current user as therapist
      supabase
        .from('terapeuta_clientes')
        .select('cliente_id')
        .eq('terapeuta_id', user.id)
        .eq('ativo', true)
    ]);

    if (tiposRes.data) setTipos(tiposRes.data);
    if (instintosRes.data) setInstintos(instintosRes.data);

    // If user has clients, fetch their profiles
    if (clientesRes.data && clientesRes.data.length > 0) {
      const clienteIds = clientesRes.data.map(c => c.cliente_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, nome, email')
        .in('id', clienteIds);
      
      if (profiles) setClientes(profiles);
    }

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

    // Validate input
    const validation = eneagramaSchema.safeParse({
      tipo_principal: tipoPrincipal,
      defesas,
      virtude,
      armadilhas,
      pratica_sugerida: praticaSugerida,
    });

    if (!validation.success) {
      toast({ 
        title: 'Erro de validação', 
        description: validation.error.errors[0].message, 
        variant: 'destructive' 
      });
      return;
    }

    setSaving(true);

    // Determine if self-assessment or client assessment
    const isSelfAssessment = selectedClienteId === 'self';

    const insertData = {
      user_id: isSelfAssessment ? user?.id : selectedClienteId,
      terapeuta_id: (!isSelfAssessment && isTerapeuta) ? user?.id : null,
      cliente_id: (!isSelfAssessment && isTerapeuta) ? selectedClienteId : null,
      tipo_principal: tipoPrincipal,
      asa: asa ? parseInt(asa) : null,
      instinto: instinto || null,
      defesas: defesas || null,
      virtude: virtude || null,
      armadilhas: armadilhas || null,
      pratica_sugerida: praticaSugerida || null,
    };

    const { error } = await supabase.from('eneagrama_registros').insert(insertData);

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

        {/* Client Selection (for therapists) */}
        {isTerapeuta && (
          <Card className="glass mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Para quem é esta avaliação?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedClienteId} onValueChange={setSelectedClienteId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self">
                    Para mim (autoavaliação)
                  </SelectItem>
                  {clientes.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nome || 'Sem nome'} ({c.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedClienteId !== 'self' && (
                <p className="text-sm text-muted-foreground mt-2">
                  O registro será vinculado à cliente selecionada.
                </p>
              )}
            </CardContent>
          </Card>
        )}

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
                maxLength={5000}
              />
              <p className="text-xs text-muted-foreground mt-1">{defesas.length}/5000</p>
            </div>
            <div>
              <Label>Virtude a cultivar</Label>
              <Textarea
                value={virtude}
                onChange={e => setVirtude(e.target.value)}
                placeholder="Qual qualidade pode contrabalançar a fixação do tipo?"
                rows={2}
                maxLength={5000}
              />
            </div>
            <div>
              <Label>Armadilhas na condução</Label>
              <Textarea
                value={armadilhas}
                onChange={e => setArmadilhas(e.target.value)}
                placeholder="O que evitar ao trabalhar com este tipo?"
                rows={3}
                maxLength={5000}
              />
            </div>
            <div>
              <Label>Prática sugerida</Label>
              <Textarea
                value={praticaSugerida}
                onChange={e => setPraticaSugerida(e.target.value)}
                placeholder="Exercícios, reflexões ou tarefas recomendadas"
                rows={3}
                maxLength={5000}
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
