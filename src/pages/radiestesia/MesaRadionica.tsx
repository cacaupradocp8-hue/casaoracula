import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ContentPageLayout } from '@/components/shared/ContentPageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { EthicalNotice } from '@/components/shared/EthicalNotice';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Target, 
  Loader2, 
  Save, 
  ChevronRight,
  CircleDot,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Campos disponíveis para leitura
const CAMPOS = [
  { id: 'pessoal', label: 'Campo Pessoal', descricao: 'Estado interno, energia vital, disposição' },
  { id: 'relacional', label: 'Campo Relacional', descricao: 'Dinâmicas de vínculo, comunicação, afeto' },
  { id: 'profissional', label: 'Campo Profissional', descricao: 'Trabalho, propósito, direção vocacional' },
  { id: 'decisao', label: 'Campo de Decisão', descricao: 'Encruzilhadas, escolhas, caminhos possíveis' },
];

// Mapas para leitura por campo
const MAPAS = [
  { id: 'chakras', label: 'Mapa de Chakras', descricao: 'Centros de energia e seus bloqueios' },
  { id: 'emocional', label: 'Mapa Emocional', descricao: 'Emoções predominantes e suas camadas' },
  { id: 'protecao', label: 'Mapa de Proteção', descricao: 'Defesas ativas e vulnerabilidades' },
  { id: 'integracao', label: 'Mapa de Integração', descricao: 'O que pede harmonização' },
];

type Step = 'campo' | 'mapa' | 'pergunta' | 'leitura';

export default function MesaRadionica() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const clienteId = searchParams.get('cliente');
  const [clienteInfo, setClienteInfo] = useState<{ id: string; nome: string } | null>(null);
  
  const [step, setStep] = useState<Step>('campo');
  const [campoSelecionado, setCampoSelecionado] = useState('');
  const [mapaSelecionado, setMapaSelecionado] = useState('');
  const [perguntaOraculo, setPerguntaOraculo] = useState('');
  const [registroLeitura, setRegistroLeitura] = useState('');
  const [saving, setSaving] = useState(false);

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

  const handleNext = () => {
    if (step === 'campo' && campoSelecionado) setStep('mapa');
    else if (step === 'mapa' && mapaSelecionado) setStep('pergunta');
    else if (step === 'pergunta' && perguntaOraculo.trim()) setStep('leitura');
  };

  const handleBack = () => {
    if (step === 'mapa') setStep('campo');
    else if (step === 'pergunta') setStep('mapa');
    else if (step === 'leitura') setStep('pergunta');
    else navigate('/radiestesia');
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    setSaving(true);
    try {
      // Buscar ferramenta_id para mesa radiónica
      const { data: ferramenta } = await supabase
        .from('sala_ferramentas')
        .select('id')
        .eq('ferramenta_chave', 'radiestesia')
        .single();

      if (ferramenta) {
        await supabase.from('ferramenta_registros').insert({
          user_id: user.id,
          ferramenta_id: ferramenta.id,
          cliente_id: clienteId || null,
          dados: {
            tipo: 'mesa_radionica',
            campo: campoSelecionado,
            mapa: mapaSelecionado,
            pergunta: perguntaOraculo,
            leitura: registroLeitura,
          },
          notas: registroLeitura,
        });
      }

      toast({
        title: 'Leitura registrada',
        description: 'O campo revelou o que precisava ser escutado.',
      });

      // Reset ou navegar
      if (clienteId) {
        navigate(`/cliente/${clienteId}`);
      } else {
        navigate('/radiestesia/diario');
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

  const getStepNumber = () => {
    switch (step) {
      case 'campo': return 1;
      case 'mapa': return 2;
      case 'pergunta': return 3;
      case 'leitura': return 4;
    }
  };

  return (
    <AppLayout>
      <ContentPageLayout
        title="Mesa Radiónica Digital"
        subtitle="Leitura simbólica de campos"
        badge="Ferramenta"
        badgeIcon={<Target className="w-4 h-4 text-gold" />}
        onBack={handleBack}
        backLabel={step === 'campo' ? 'Voltar ao Portal' : 'Voltar'}
        showNavigation={false}
        maxWidth="2xl"
      >
        {/* Cliente Info */}
        {clienteInfo && (
          <Card className="border-gold/30 bg-gold/5">
            <CardContent className="py-4">
              <p className="text-sm">
                Leitura para: <strong>{clienteInfo.nome}</strong>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 py-4">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                getStepNumber() >= num 
                  ? "bg-gold text-background" 
                  : "bg-muted text-muted-foreground"
              )}>
                {num}
              </div>
              {num < 4 && (
                <ChevronRight className={cn(
                  "w-4 h-4 mx-1",
                  getStepNumber() > num ? "text-gold" : "text-muted-foreground/30"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Step: Campo */}
        {step === 'campo' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Qual campo deseja escutar?</CardTitle>
              <CardDescription>
                A radiestesia lê campos, não pessoas. Escolha o território a ser explorado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={campoSelecionado} onValueChange={setCampoSelecionado}>
                <div className="space-y-3">
                  {CAMPOS.map((campo) => (
                    <label
                      key={campo.id}
                      className={cn(
                        "flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all",
                        campoSelecionado === campo.id 
                          ? "border-gold bg-gold/5" 
                          : "border-border hover:border-gold/30"
                      )}
                    >
                      <RadioGroupItem value={campo.id} className="mt-1" />
                      <div>
                        <p className="font-medium">{campo.label}</p>
                        <p className="text-sm text-muted-foreground">{campo.descricao}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {/* Step: Mapa */}
        {step === 'mapa' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Qual mapa usar para esta leitura?</CardTitle>
              <CardDescription>
                Campo selecionado: <Badge variant="outline">{CAMPOS.find(c => c.id === campoSelecionado)?.label}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={mapaSelecionado} onValueChange={setMapaSelecionado}>
                <div className="grid gap-3 md:grid-cols-2">
                  {MAPAS.map((mapa) => (
                    <label
                      key={mapa.id}
                      className={cn(
                        "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all",
                        mapaSelecionado === mapa.id 
                          ? "border-gold bg-gold/5" 
                          : "border-border hover:border-gold/30"
                      )}
                    >
                      <RadioGroupItem value={mapa.id} className="mt-1" />
                      <div>
                        <p className="font-medium text-sm">{mapa.label}</p>
                        <p className="text-xs text-muted-foreground">{mapa.descricao}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {/* Step: Pergunta-Oráculo */}
        {step === 'pergunta' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Formule sua pergunta-oráculo</CardTitle>
              <CardDescription>
                Não busque respostas objetivas. Pergunte ao campo o que ele quer revelar.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">{CAMPOS.find(c => c.id === campoSelecionado)?.label}</Badge>
                <Badge variant="outline">{MAPAS.find(m => m.id === mapaSelecionado)?.label}</Badge>
              </div>
              
              <div className="space-y-2">
                <Label>Sua pergunta ao campo</Label>
                <Textarea
                  value={perguntaOraculo}
                  onChange={(e) => setPerguntaOraculo(e.target.value)}
                  placeholder="O que este campo precisa que eu escute agora?"
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="p-3 rounded-lg bg-muted/30 border border-dashed">
                <p className="text-xs text-muted-foreground italic">
                  💡 Dica: Evite perguntas de "sim/não". Prefira: "O que pede atenção?", 
                  "Onde está a tensão?", "O que precisa ser visto?"
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step: Leitura */}
        {step === 'leitura' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Registre a leitura do campo</CardTitle>
              <CardDescription>
                O que você percebeu? O que o campo revelou? Anote sem julgamento.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">{CAMPOS.find(c => c.id === campoSelecionado)?.label}</Badge>
                <Badge variant="outline">{MAPAS.find(m => m.id === mapaSelecionado)?.label}</Badge>
              </div>

              <Card className="bg-muted/20 border-dashed">
                <CardContent className="py-3">
                  <p className="text-sm italic text-muted-foreground">"{perguntaOraculo}"</p>
                </CardContent>
              </Card>
              
              <div className="space-y-2">
                <Label>Registro da leitura</Label>
                <Textarea
                  value={registroLeitura}
                  onChange={(e) => setRegistroLeitura(e.target.value)}
                  placeholder="Descreva o que você percebeu durante a leitura... Impressões, imagens, sensações, direções..."
                  rows={5}
                  className="resize-none"
                />
              </div>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Lembre-se: a leitura revela padrões simbólicos, não verdades absolutas. 
                  Não faça promessas baseadas nesta leitura.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleBack}>
            Voltar
          </Button>
          
          {step !== 'leitura' ? (
            <Button 
              onClick={handleNext}
              disabled={
                (step === 'campo' && !campoSelecionado) ||
                (step === 'mapa' && !mapaSelecionado) ||
                (step === 'pergunta' && !perguntaOraculo.trim())
              }
              className="bg-gold hover:bg-gold/90 text-background"
            >
              Continuar
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button 
              onClick={handleSave}
              disabled={saving || !registroLeitura.trim()}
              className="bg-gold hover:bg-gold/90 text-background"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Salvar Leitura
            </Button>
          )}
        </div>

        <EthicalNotice toolName="Mesa Radiónica" />
      </ContentPageLayout>
    </AppLayout>
  );
}
