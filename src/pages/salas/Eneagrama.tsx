import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Compass, Save, ArrowLeft, Loader2, FolderOpen, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
  palavras_chave: string[] | null;
}

interface EneagramaInstinto {
  id: string;
  chave: string;
  nome: string;
  descricao: string;
}

interface CasoInfo {
  id: string;
  codinome: string;
  cliente_id: string;
  cliente_nome?: string;
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
  const [searchParams] = useSearchParams();
  const casoId = searchParams.get('caso');

  const [tipos, setTipos] = useState<EneagramaTipo[]>([]);
  const [instintos, setInstintos] = useState<EneagramaInstinto[]>([]);
  const [loading, setLoading] = useState(true);
  const [caso, setCaso] = useState<CasoInfo | null>(null);
  
  const [tipoPrincipal, setTipoPrincipal] = useState<number | null>(null);
  const [asa, setAsa] = useState<string>('');
  const [instinto, setInstinto] = useState<string>('');
  const [evidencias, setEvidencias] = useState<string[]>([]);
  const [defesas, setDefesas] = useState('');
  const [virtude, setVirtude] = useState('');
  const [armadilhas, setArmadilhas] = useState('');
  const [praticaSugerida, setPraticaSugerida] = useState('');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Determine mode: self-assessment (no caso) or therapist assessment (with caso)
  const isSelfAssessment = !casoId;

  useEffect(() => {
    fetchData();
  }, [user, casoId]);

  const fetchData = async () => {
    if (!user) return;

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
        .order('chave'),
    ]);

    if (tiposRes.data) setTipos(tiposRes.data);
    if (instintosRes.data) setInstintos(instintosRes.data);

    // If we have a caso ID, fetch caso info
    if (casoId) {
      const casoRes = await supabase
        .from('casos')
        .select('id, codinome, cliente_id')
        .eq('id', casoId)
        .eq('terapeuta_id', user.id)
        .maybeSingle();

      if (casoRes.data) {
        // Fetch cliente name
        const { data: profile } = await supabase
          .from('profiles')
          .select('nome')
          .eq('id', casoRes.data.cliente_id)
          .maybeSingle();

        setCaso({
          ...casoRes.data,
          cliente_nome: profile?.nome || 'Sem nome',
        });
      } else {
        toast({
          title: 'Caso não encontrado',
          description: 'O caso solicitado não existe ou você não tem permissão para acessá-lo.',
          variant: 'destructive',
        });
        navigate('/casos');
        return;
      }
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

    let insertData: any;

    if (isSelfAssessment) {
      // Self-assessment: no caso, no terapeuta, no cliente
      insertData = {
        user_id: user?.id,
        terapeuta_id: null,
        cliente_id: null,
        caso_id: null,
        tipo_principal: tipoPrincipal,
        asa: asa ? parseInt(asa) : null,
        instinto: instinto || null,
        defesas: defesas || null,
        virtude: virtude || null,
        armadilhas: armadilhas || null,
        pratica_sugerida: praticaSugerida || null,
      };
    } else {
      // Therapist assessment: requires caso
      if (!caso) {
        toast({ 
          title: 'Erro', 
          description: 'Caso não carregado corretamente.', 
          variant: 'destructive' 
        });
        setSaving(false);
        return;
      }

      insertData = {
        user_id: caso.cliente_id,
        terapeuta_id: user?.id,
        cliente_id: caso.cliente_id,
        caso_id: caso.id,
        tipo_principal: tipoPrincipal,
        asa: asa ? parseInt(asa) : null,
        instinto: instinto || null,
        defesas: defesas || null,
        virtude: virtude || null,
        armadilhas: armadilhas || null,
        pratica_sugerida: praticaSugerida || null,
      };
    }

    const { error } = await supabase.from('eneagrama_registros').insert(insertData);

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Registro Eneagrama salvo com sucesso!' });
      if (isSelfAssessment) {
        navigate('/salas');
      } else {
        navigate('/casos');
      }
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
          <Link to={isSelfAssessment ? '/salas' : '/casos'}>
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

        {/* Caso Info Banner (for therapist assessment) */}
        {!isSelfAssessment && caso && (
          <Card className="glass mb-6 border-gold/30 bg-gold/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FolderOpen className="w-5 h-5 text-gold" />
                <div>
                  <p className="font-medium">Avaliação para o caso: <span className="text-gold">{caso.codinome}</span></p>
                  <p className="text-sm text-muted-foreground">Cliente: {caso.cliente_nome}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Self-assessment notice */}
        {isSelfAssessment && (
          <Card className="glass mb-6 border-blue-500/30 bg-blue-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium">Autoavaliação</p>
                  <p className="text-sm text-muted-foreground">
                    Este registro será salvo no seu próprio perfil. Para avaliar uma cliente, acesse através da página de Casos.
                  </p>
                </div>
              </div>
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
                    setEvidencias([]);
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

        {/* Evidências comportamentais */}
        {tipoPrincipal && (
          <Card className="glass mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Evidências Comportamentais</CardTitle>
              <p className="text-sm text-muted-foreground">
                Selecione até 3 comportamentos que evidenciam este tipo
              </p>
            </CardHeader>
            <CardContent>
              {(() => {
                const tipoSelecionado = tipos.find(t => t.numero === tipoPrincipal);
                const palavrasChave = tipoSelecionado?.palavras_chave || [];
                
                // Generate evidence phrases based on type characteristics
                const evidenciasDisponiveis = [
                  `Demonstra forte tendência a ${tipoSelecionado?.fixacao?.toLowerCase() || 'padrão fixo'}`,
                  `Busca constantemente ${tipoSelecionado?.descricao?.toLowerCase().replace('busca ', '') || 'algo'}`,
                  ...palavrasChave.map(p => `Apresenta comportamento de ${p}`),
                  `Dificuldade em acessar ${tipoSelecionado?.virtude?.toLowerCase() || 'virtude'}`,
                  `Padrão defensivo relacionado ao tipo ${tipoPrincipal}`,
                ];
                
                return (
                  <div className="flex flex-wrap gap-2">
                    {evidenciasDisponiveis.map((ev, idx) => {
                      const isSelected = evidencias.includes(ev);
                      const canSelect = evidencias.length < 3 || isSelected;
                      
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setEvidencias(prev => prev.filter(e => e !== ev));
                            } else if (canSelect) {
                              setEvidencias(prev => [...prev, ev]);
                            }
                          }}
                          disabled={!canSelect && !isSelected}
                          className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                            isSelected
                              ? 'border-gold bg-gold/20 text-gold'
                              : canSelect
                                ? 'border-border hover:border-gold/50'
                                : 'border-border/50 opacity-50 cursor-not-allowed'
                          }`}
                        >
                          {ev}
                        </button>
                      );
                    })}
                  </div>
                );
              })()}
              {evidencias.length > 0 && (
                <p className="text-xs text-muted-foreground mt-3">
                  {evidencias.length}/3 evidências selecionadas
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg">Asa (opcional)</CardTitle>
            </CardHeader>
            <CardContent>
              {tipoPrincipal ? (
                <Select value={asa} onValueChange={(val) => setAsa(val === "none" ? "" : val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a asa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma</SelectItem>
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
