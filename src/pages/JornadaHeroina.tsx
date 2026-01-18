// ============================================
// JOURNEY OF THE HEROINE — FEMININE INITIATORY MAP
// A symbolic navigation tool — not therapy
// ============================================

import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ContentPageLayout } from '@/components/shared/ContentPageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useProfessionalStatus } from '@/hooks/useProfessionalStatus';
import { toast } from 'sonner';
import { 
  Loader2, Sparkles, ArrowRight, ArrowLeft, Check, 
  Compass, Users, ChevronRight, Save, Eye, EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { JourneySpiral } from '@/components/jornada/JourneySpiral';
import { PhaseDetailPanel } from '@/components/jornada/PhaseDetailPanel';
import { ProfessionalNotesPanel } from '@/components/jornada/ProfessionalNotesPanel';
import { EthicalNotice } from '@/components/shared/EthicalNotice';

interface Fase {
  id: string;
  numero: number;
  chave: string;
  nome: string;
  subtitulo: string;
  descricao: string;
  pergunta_central: string;
  perguntas_reflexao: string[];
  arquetipos_sugeridos: string[];
  praticas_simbolicas: string[];
  linguagem_contencao: string;
  microcopy: string;
  icone: string;
  cor_primaria: string;
}

interface Cliente {
  id: string;
  nome: string;
}

interface JornadaRegistro {
  id: string;
  user_id: string;
  cliente_id: string | null;
  terapeuta_id: string | null;
  modo: 'pessoal' | 'conducao';
  fase_atual: number;
  nome_simbolico: string | null;
  intencao_inicial: string | null;
  reflexao_final: string | null;
  status: 'em_andamento' | 'pausado' | 'concluido';
}

interface FaseResposta {
  id?: string;
  registro_id: string;
  fase_numero: number;
  respostas_reflexao: Record<number, string>;
  arquetipo_escolhido: string | null;
  tom_emocional: string | null;
  simbolo_pessoal: string | null;
  notas_pessoais: string | null;
}

const EMOTIONAL_TONES = [
  { value: 'quietude', label: 'Quietude' },
  { value: 'inquietacao', label: 'Inquietação' },
  { value: 'luto', label: 'Luto' },
  { value: 'rendicao', label: 'Rendição' },
  { value: 'forca', label: 'Força' },
  { value: 'clareza', label: 'Clareza' },
  { value: 'gratidao', label: 'Gratidão' },
  { value: 'medo', label: 'Medo' },
  { value: 'raiva', label: 'Raiva' },
  { value: 'esperanca', label: 'Esperança' },
  { value: 'confusao', label: 'Confusão' },
  { value: 'paz', label: 'Paz' },
];

export default function JornadaHeroina() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { isProfessional, isLoading: loadingProfessional } = useProfessionalStatus();
  
  // Mode from URL or default to personal
  const initialMode = searchParams.get('modo') === 'conducao' ? 'conducao' : 'pessoal';
  const clienteIdFromUrl = searchParams.get('cliente');
  
  const [loading, setLoading] = useState(true);
  const [fases, setFases] = useState<Fase[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<string | null>(clienteIdFromUrl);
  const [mode, setMode] = useState<'pessoal' | 'conducao'>(initialMode);
  
  const [registro, setRegistro] = useState<JornadaRegistro | null>(null);
  const [respostas, setRespostas] = useState<Record<number, FaseResposta>>({});
  const [selectedFase, setSelectedFase] = useState<number>(1);
  const [saving, setSaving] = useState(false);
  
  // Phase state
  const [phase, setPhase] = useState<'intro' | 'journey' | 'complete'>('intro');
  const [intencaoInicial, setIntencaoInicial] = useState('');
  const [nomeSimbolico, setNomeSimbolico] = useState('');
  const [reflexaoFinal, setReflexaoFinal] = useState('');
  
  const [showProfessionalNotes, setShowProfessionalNotes] = useState(false);

  const currentFase = fases.find(f => f.numero === selectedFase);
  const currentResposta = respostas[selectedFase];

  useEffect(() => {
    fetchData();
  }, [user, mode, selectedCliente]);

  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch phases
      const { data: fasesData } = await supabase
        .from('jornada_heroina_fases')
        .select('*')
        .eq('ativo', true)
        .order('numero');
      
      if (fasesData) setFases(fasesData);

      // Fetch clients if professional
      if (isProfessional && mode === 'conducao') {
        const { data: clientesData } = await supabase
          .from('clientes')
          .select('id, nome')
          .eq('terapeuta_id', user.id)
          .eq('status', 'ativo')
          .order('nome');
        
        if (clientesData) setClientes(clientesData);
      }

      // Fetch existing journey record
      let query = supabase
        .from('jornada_heroina_registros')
        .select('*')
        .eq('modo', mode)
        .order('created_at', { ascending: false })
        .limit(1);

      if (mode === 'pessoal') {
        query = query.eq('user_id', user.id).is('cliente_id', null);
      } else if (mode === 'conducao' && selectedCliente) {
        query = query.eq('terapeuta_id', user.id).eq('cliente_id', selectedCliente);
      }

      const { data: registroData } = await query.maybeSingle();

      if (registroData) {
        setRegistro({
          ...registroData,
          modo: registroData.modo as 'pessoal' | 'conducao',
          status: registroData.status as 'em_andamento' | 'pausado' | 'concluido',
        });
        setNomeSimbolico(registroData.nome_simbolico || '');
        setIntencaoInicial(registroData.intencao_inicial || '');
        setReflexaoFinal(registroData.reflexao_final || '');
        setSelectedFase(registroData.fase_atual || 1);

        // Fetch responses
        const { data: respostasData } = await supabase
          .from('jornada_heroina_respostas')
          .select('*')
          .eq('registro_id', registroData.id);

        if (respostasData) {
          const respostasMap: Record<number, FaseResposta> = {};
          respostasData.forEach(r => {
            respostasMap[r.fase_numero] = {
              ...r,
              respostas_reflexao: r.respostas_reflexao as Record<number, string> || {}
            };
          });
          setRespostas(respostasMap);
        }

        if (registroData.status !== 'em_andamento') {
          setPhase('complete');
        } else {
          setPhase('journey');
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleStartJourney = async () => {
    if (!user) return;
    
    if (mode === 'conducao' && !selectedCliente) {
      toast.error('Selecione uma cliente para iniciar a condução');
      return;
    }

    setSaving(true);
    try {
      const insertData: any = {
        user_id: user.id,
        modo: mode,
        fase_atual: 1,
        intencao_inicial: intencaoInicial || null,
        nome_simbolico: nomeSimbolico || null,
        status: 'em_andamento',
      };

      if (mode === 'conducao') {
        insertData.terapeuta_id = user.id;
        insertData.cliente_id = selectedCliente;
      }

      const { data, error } = await supabase
        .from('jornada_heroina_registros')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      
      setRegistro({
        ...data,
        modo: data.modo as 'pessoal' | 'conducao',
        status: data.status as 'em_andamento' | 'pausado' | 'concluido',
      });
      setPhase('journey');
      toast.success('Jornada iniciada');
    } catch (error: any) {
      console.error('Error starting journey:', error);
      toast.error('Erro ao iniciar: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePhaseResponse = async (faseNumero: number, data: Partial<FaseResposta>) => {
    if (!registro) return;
    
    setSaving(true);
    try {
      const existingResposta = respostas[faseNumero];
      
      if (existingResposta?.id) {
        // Update
        const { error } = await supabase
          .from('jornada_heroina_respostas')
          .update({
            ...data,
            respostas_reflexao: data.respostas_reflexao || existingResposta.respostas_reflexao,
          })
          .eq('id', existingResposta.id);
        
        if (error) throw error;
      } else {
        // Insert
        const { data: newResposta, error } = await supabase
          .from('jornada_heroina_respostas')
          .insert({
            registro_id: registro.id,
            fase_numero: faseNumero,
            ...data,
          })
          .select()
          .single();
        
        if (error) throw error;
        
        setRespostas(prev => ({
          ...prev,
          [faseNumero]: {
            ...newResposta,
            respostas_reflexao: (newResposta.respostas_reflexao as Record<number, string>) || {}
          }
        }));
      }

      // Update current phase in registro
      await supabase
        .from('jornada_heroina_registros')
        .update({ fase_atual: faseNumero })
        .eq('id', registro.id);

      setRespostas(prev => ({
        ...prev,
        [faseNumero]: {
          ...prev[faseNumero],
          registro_id: registro.id,
          fase_numero: faseNumero,
          ...data,
          respostas_reflexao: {
            ...prev[faseNumero]?.respostas_reflexao,
            ...data.respostas_reflexao
          }
        } as FaseResposta
      }));

      toast.success('Resposta salva');
    } catch (error: any) {
      console.error('Error saving response:', error);
      toast.error('Erro ao salvar: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteJourney = async () => {
    if (!registro) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('jornada_heroina_registros')
        .update({
          status: 'concluido',
          reflexao_final: reflexaoFinal || null,
          nome_simbolico: nomeSimbolico || null,
        })
        .eq('id', registro.id);

      if (error) throw error;
      
      setPhase('complete');
      toast.success('Jornada concluída');
    } catch (error: any) {
      console.error('Error completing journey:', error);
      toast.error('Erro ao concluir: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleNewJourney = () => {
    setRegistro(null);
    setRespostas({});
    setIntencaoInicial('');
    setNomeSimbolico('');
    setReflexaoFinal('');
    setSelectedFase(1);
    setPhase('intro');
  };

  if (loading || loadingProfessional) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  // COMPLETE VIEW
  if (phase === 'complete') {
    return (
      <AppLayout>
        <ContentPageLayout
          title="O Caminho da Mulher que se Torna Inteira"
          subtitle="Travessia concluída"
          onBack={() => navigate(-1)}
          backLabel="Voltar"
        >
          <EthicalNotice />
          
          <Card className="glass mb-8">
            <CardContent className="p-8 text-center">
              <Compass className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-2xl font-display text-primary mb-4">
                {nomeSimbolico || 'Jornada Concluída'}
              </h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Você atravessou as 7 fases da jornada da heroína. Este mapa registra 
                sua passagem — não como um fim, mas como um marco no caminho.
              </p>
            </CardContent>
          </Card>

          {/* Spiral Summary */}
          <Card className="glass mb-8">
            <CardHeader className="text-center">
              <CardTitle className="font-display">Sua Espiral de Travessia</CardTitle>
              <CardDescription>Cada fase vivida</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <JourneySpiral 
                fases={fases}
                currentFase={7}
                respostas={respostas}
                onSelect={setSelectedFase}
                selected={selectedFase}
                readOnly
              />
            </CardContent>
          </Card>

          {/* Reflection Summary */}
          {(intencaoInicial || reflexaoFinal) && (
            <Card className="glass mb-8">
              <CardContent className="p-6 space-y-4">
                {intencaoInicial && (
                  <div>
                    <p className="text-xs uppercase text-muted-foreground mb-1">Intenção inicial</p>
                    <p className="text-sm italic">{intencaoInicial}</p>
                  </div>
                )}
                {reflexaoFinal && (
                  <div>
                    <p className="text-xs uppercase text-muted-foreground mb-1">Reflexão final</p>
                    <p className="text-sm italic">{reflexaoFinal}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Voltar
            </Button>
            <Button onClick={handleNewJourney}>
              Iniciar Nova Jornada
            </Button>
          </div>
        </ContentPageLayout>
      </AppLayout>
    );
  }

  // INTRO VIEW
  if (phase === 'intro') {
    return (
      <AppLayout>
        <ContentPageLayout
          title="O Caminho da Mulher que se Torna Inteira"
          subtitle="Mapa Iniciático Feminino"
          onBack={() => navigate(-1)}
          backLabel="Voltar"
        >
          <EthicalNotice />
          
          <Card className="glass mb-8">
            <CardContent className="p-8 text-center">
              <Compass className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-2xl font-display text-primary mb-4">
                A Jornada da Heroína
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Este não é um percurso linear. É um mapa espiral de transformação — 
                feito de fases que se atravessam, não etapas que se vencem.
              </p>
              <p className="text-sm text-muted-foreground italic mb-8">
                "Cada fase responde: Onde estou na minha jornada? 
                O que está sendo pedido de mim agora?"
              </p>
            </CardContent>
          </Card>

          {/* Mode Selection (only for professionals) */}
          {isProfessional && (
            <Card className="glass mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Modo de Uso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={mode} onValueChange={(v) => setMode(v as 'pessoal' | 'conducao')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="pessoal">Modo Pessoal</TabsTrigger>
                    <TabsTrigger value="conducao">Modo Condução</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="pessoal" className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      Use este modo para mapear sua própria jornada de transformação.
                    </p>
                  </TabsContent>
                  
                  <TabsContent value="conducao" className="mt-4 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Acompanhe a jornada de uma cliente ao longo das sessões.
                    </p>
                    
                    <div>
                      <Label>Selecione a Cliente</Label>
                      <Select value={selectedCliente || ''} onValueChange={setSelectedCliente}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Escolha uma cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {clientes.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Intention Setting */}
          <Card className="glass mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Defina sua Intenção</CardTitle>
              <CardDescription>
                O que você busca ao iniciar esta jornada?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="intencao">Intenção inicial (opcional)</Label>
                <Textarea
                  id="intencao"
                  value={intencaoInicial}
                  onChange={(e) => setIntencaoInicial(e.target.value)}
                  placeholder="O que está chamando você para esta jornada?"
                  className="mt-2 min-h-[100px]"
                />
              </div>
              <div>
                <Label htmlFor="nome">Nome simbólico para esta jornada (opcional)</Label>
                <input
                  id="nome"
                  type="text"
                  value={nomeSimbolico}
                  onChange={(e) => setNomeSimbolico(e.target.value)}
                  placeholder="Ex: A Travessia da Coragem"
                  className="w-full mt-2 p-3 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* The 7 Phases Preview */}
          <Card className="glass mb-8">
            <CardHeader>
              <CardTitle className="text-lg">As 7 Fases da Jornada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {fases.map((fase) => (
                  <div 
                    key={fase.numero}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50"
                  >
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ backgroundColor: `${fase.cor_primaria}20`, color: fase.cor_primaria }}
                    >
                      {fase.numero}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{fase.nome}</p>
                      <p className="text-xs text-muted-foreground">{fase.subtitulo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button 
              size="lg" 
              onClick={handleStartJourney}
              disabled={saving || (mode === 'conducao' && !selectedCliente)}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Iniciar a Jornada
            </Button>
          </div>
        </ContentPageLayout>
      </AppLayout>
    );
  }

  // JOURNEY VIEW
  return (
    <AppLayout>
      <ContentPageLayout
        title="Jornada da Heroína"
        subtitle={currentFase?.nome || 'Navegue pela espiral'}
        onBack={() => setPhase('intro')}
        backLabel="Voltar"
      >
        <div className="grid lg:grid-cols-[1fr_350px] gap-8">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Spiral Navigation */}
            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Mapa da Jornada</CardTitle>
                  <CardDescription>Clique em uma fase para navegar</CardDescription>
                </div>
                {isProfessional && mode === 'conducao' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowProfessionalNotes(!showProfessionalNotes)}
                  >
                    {showProfessionalNotes ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    Notas Profissionais
                  </Button>
                )}
              </CardHeader>
              <CardContent className="flex justify-center py-8">
                <JourneySpiral 
                  fases={fases}
                  currentFase={selectedFase}
                  respostas={respostas}
                  onSelect={setSelectedFase}
                  selected={selectedFase}
                />
              </CardContent>
            </Card>

            {/* Current Phase Detail */}
            {currentFase && (
              <PhaseDetailPanel
                fase={currentFase}
                resposta={currentResposta}
                emotionalTones={EMOTIONAL_TONES}
                onSave={(data) => handleSavePhaseResponse(currentFase.numero, data)}
                saving={saving}
                mode={mode}
              />
            )}

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                disabled={selectedFase <= 1}
                onClick={() => setSelectedFase(prev => Math.max(1, prev - 1))}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Fase Anterior
              </Button>
              
              {selectedFase < 7 ? (
                <Button
                  onClick={() => setSelectedFase(prev => Math.min(7, prev + 1))}
                >
                  Próxima Fase
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleCompleteJourney} disabled={saving}>
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  Concluir Jornada
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar - Professional Notes */}
          {isProfessional && mode === 'conducao' && showProfessionalNotes && registro && (
            <div className="hidden lg:block">
              <ProfessionalNotesPanel
                registroId={registro.id}
                faseNumero={selectedFase}
                terapeutaId={user?.id || ''}
              />
            </div>
          )}
        </div>

        {/* Mobile Professional Notes */}
        {isProfessional && mode === 'conducao' && showProfessionalNotes && registro && (
          <div className="lg:hidden mt-6">
            <ProfessionalNotesPanel
              registroId={registro.id}
              faseNumero={selectedFase}
              terapeutaId={user?.id || ''}
            />
          </div>
        )}
      </ContentPageLayout>
    </AppLayout>
  );
}
