import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ContentPageLayout } from '@/components/shared/ContentPageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EthicalNotice } from '@/components/shared/EthicalNotice';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  Save,
  Loader2,
  Calendar,
  Target,
  AlertCircle,
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RegistroPratica {
  id: string;
  data_registro: string;
  dados: {
    tipo?: string;
    campo?: string;
    mapa?: string;
    pergunta?: string;
    leitura?: string;
    ferramenta_usada?: string;
    percepcao?: string;
    limite?: string;
  };
  notas: string | null;
}

const FERRAMENTAS_OPCOES = [
  { id: 'mesa_radionica', label: 'Mesa Radiónica Digital' },
  { id: 'grafico', label: 'Gráfico Radiónico' },
  { id: 'pantaculo', label: 'Pantáculo / Selo' },
  { id: 'cristal', label: 'Cristal / Pedra' },
  { id: 'pendulo', label: 'Pêndulo' },
  { id: 'escala', label: 'Escala Narrativa' },
  { id: 'outro', label: 'Outro' },
];

const CAMPOS_OPCOES = [
  { id: 'pessoal', label: 'Campo Pessoal' },
  { id: 'relacional', label: 'Campo Relacional' },
  { id: 'profissional', label: 'Campo Profissional' },
  { id: 'espacial', label: 'Campo Espacial (Ambiente)' },
  { id: 'decisao', label: 'Campo de Decisão' },
];

export default function DiarioPraticas() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [registros, setRegistros] = useState<RegistroPratica[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Form state
  const [campoTrabalhado, setCampoTrabalhado] = useState('');
  const [ferramentaUsada, setFerramentaUsada] = useState('');
  const [percepcao, setPercepcao] = useState('');
  const [limite, setLimite] = useState('');

  useEffect(() => {
    fetchRegistros();
  }, [user]);

  const fetchRegistros = async () => {
    if (!user?.id) return;
    
    try {
      // Buscar ferramenta_id para radiestesia
      const { data: ferramenta } = await supabase
        .from('sala_ferramentas')
        .select('id')
        .eq('ferramenta_chave', 'radiestesia')
        .single();

      if (ferramenta) {
        const { data } = await supabase
          .from('ferramenta_registros')
          .select('*')
          .eq('user_id', user.id)
          .eq('ferramenta_id', ferramenta.id)
          .order('data_registro', { ascending: false })
          .limit(50);

        if (data) {
          setRegistros(data as RegistroPratica[]);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar registros:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    setSaving(true);
    try {
      const { data: ferramenta } = await supabase
        .from('sala_ferramentas')
        .select('id')
        .eq('ferramenta_chave', 'radiestesia')
        .single();

      if (ferramenta) {
        await supabase.from('ferramenta_registros').insert({
          user_id: user.id,
          ferramenta_id: ferramenta.id,
          dados: {
            tipo: 'diario',
            campo: campoTrabalhado,
            ferramenta_usada: ferramentaUsada,
            percepcao,
            limite,
          },
          notas: percepcao,
        });

        toast({
          title: 'Prática registrada',
          description: 'Seu diário foi atualizado.',
        });

        // Reset form
        setCampoTrabalhado('');
        setFerramentaUsada('');
        setPercepcao('');
        setLimite('');
        setShowForm(false);
        
        // Reload
        fetchRegistros();
      }
    } catch (error) {
      toast({
        title: 'Erro ao salvar',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const formatData = (dataStr: string) => {
    try {
      return format(new Date(dataStr), "d 'de' MMMM", { locale: ptBR });
    } catch {
      return dataStr;
    }
  };

  const getTipoLabel = (dados: RegistroPratica['dados']) => {
    if (dados.tipo === 'mesa_radionica') return 'Mesa Radiónica';
    if (dados.tipo === 'diario') return 'Registro Manual';
    if (dados.ferramenta_usada) {
      return FERRAMENTAS_OPCOES.find(f => f.id === dados.ferramenta_usada)?.label || dados.ferramenta_usada;
    }
    return 'Prática';
  };

  return (
    <AppLayout>
      <ContentPageLayout
        title="Diário de Práticas"
        subtitle="Registro ético e profissional"
        badge="Histórico"
        badgeIcon={<BookOpen className="w-4 h-4 text-gold" />}
        onBack={() => navigate('/radiestesia')}
        backLabel="Voltar ao Portal"
        maxWidth="2xl"
      >
        {/* Botão para novo registro */}
        {!showForm && (
          <Button 
            onClick={() => setShowForm(true)}
            className="w-full bg-gold hover:bg-gold/90 text-background"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Novo Registro
          </Button>
        )}

        {/* Formulário de novo registro */}
        {showForm && (
          <Card className="border-gold/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gold" />
                Registrar Prática
              </CardTitle>
              <CardDescription>
                {format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Campo trabalhado</Label>
                  <Select value={campoTrabalhado} onValueChange={setCampoTrabalhado}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {CAMPOS_OPCOES.map((campo) => (
                        <SelectItem key={campo.id} value={campo.id}>
                          {campo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Ferramenta usada</Label>
                  <Select value={ferramentaUsada} onValueChange={setFerramentaUsada}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {FERRAMENTAS_OPCOES.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Percepção / Resultado</Label>
                <Textarea
                  value={percepcao}
                  onChange={(e) => setPercepcao(e.target.value)}
                  placeholder="O que você percebeu durante ou após a prática?"
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  Limite (o que NÃO deve ser mexido agora)
                </Label>
                <Textarea
                  value={limite}
                  onChange={(e) => setLimite(e.target.value)}
                  placeholder="Há algo que precisa de tempo? Algo que não deve ser forçado?"
                  rows={2}
                  className="resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={saving || !campoTrabalhado || !percepcao}
                  className="bg-gold hover:bg-gold/90 text-background"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Salvar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Histórico de registros */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Histórico de Práticas
          </h3>

          {loading ? (
            <Card className="border-dashed">
              <CardContent className="py-8 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ) : registros.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center text-muted-foreground">
                <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Nenhuma prática registrada ainda.</p>
                <p className="text-sm mt-1">
                  Comece usando as ferramentas do portal ou registre manualmente.
                </p>
              </CardContent>
            </Card>
          ) : (
            registros.map((registro) => (
              <Card 
                key={registro.id}
                className={cn(
                  "transition-all cursor-pointer",
                  expandedId === registro.id && "border-gold/30"
                )}
                onClick={() => setExpandedId(expandedId === registro.id ? null : registro.id)}
              >
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Target className="w-4 h-4 text-gold" />
                      <div>
                        <p className="text-sm font-medium">
                          {getTipoLabel(registro.dados)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatData(registro.data_registro)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {registro.dados.campo && (
                        <Badge variant="outline" className="text-xs">
                          {CAMPOS_OPCOES.find(c => c.id === registro.dados.campo)?.label || registro.dados.campo}
                        </Badge>
                      )}
                      {expandedId === registro.id ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                {expandedId === registro.id && (
                  <CardContent className="pt-0 space-y-3">
                    {registro.dados.pergunta && (
                      <div>
                        <p className="text-xs text-muted-foreground">Pergunta:</p>
                        <p className="text-sm italic">"{registro.dados.pergunta}"</p>
                      </div>
                    )}
                    
                    {(registro.dados.leitura || registro.dados.percepcao || registro.notas) && (
                      <div>
                        <p className="text-xs text-muted-foreground">Percepção/Leitura:</p>
                        <p className="text-sm">
                          {registro.dados.leitura || registro.dados.percepcao || registro.notas}
                        </p>
                      </div>
                    )}

                    {registro.dados.limite && (
                      <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20">
                        <p className="text-xs text-amber-500 mb-1">Limite identificado:</p>
                        <p className="text-sm text-muted-foreground">
                          {registro.dados.limite}
                        </p>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>

        <EthicalNotice toolName="Diário de Práticas" />
      </ContentPageLayout>
    </AppLayout>
  );
}
