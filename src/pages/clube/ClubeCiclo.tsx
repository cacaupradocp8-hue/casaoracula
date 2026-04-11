import { AppLayout } from '@/components/layout/AppLayout';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

const PORTAS = ['Porta da Sombra', 'Porta do Instinto', 'Porta da Heroína', 'Porta do Corpo', 'Porta da Liderança'];
const ARQUETIPOS = ['Mãe', 'Donzela', 'Anciã', 'Selvagem', 'Guerreira', 'Amante', 'Sacerdotisa', 'Rainha'];
const TOOL_TYPES = [
  { value: 'pergunta_clinica', label: 'Pergunta clínica' },
  { value: 'exercicio_narrativo', label: 'Exercício narrativo' },
  { value: 'mini_travessia', label: 'Mini travessia' },
];

export default function ClubeCiclo() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: cycle } = useQuery({
    queryKey: ['club-active-cycle'],
    queryFn: async () => {
      const { data } = await supabase
        .from('club_cycles' as any)
        .select('*, club_books(*)')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      return data as any;
    },
  });

  const cycleId = cycle?.id;
  const bookArr = cycle?.club_books;
  const book = Array.isArray(bookArr) ? bookArr[0] : bookArr;

  // Cartography
  const { data: carto } = useQuery({
    queryKey: ['club-cartography', cycleId],
    enabled: !!cycleId && !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from('club_cartography' as any)
        .select('*')
        .eq('user_id', user!.id)
        .eq('cycle_id', cycleId!)
        .maybeSingle();
      return data as any;
    },
  });

  const [torre, setTorre] = useState('');
  const [porta, setPorta] = useState('');
  const [labirinto, setLabirinto] = useState('');
  const [arqs, setArqs] = useState<string[]>([]);
  const [notas, setNotas] = useState('');

  useEffect(() => {
    if (carto) {
      setTorre(carto.torre || '');
      setPorta(carto.porta || '');
      setLabirinto(carto.labirinto || '');
      setArqs(carto.arquetipos || []);
      setNotas(carto.notas || '');
    }
  }, [carto]);

  // Reflections
  const { data: refl } = useQuery({
    queryKey: ['club-reflection', cycleId],
    enabled: !!cycleId && !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from('club_reflections' as any)
        .select('*')
        .eq('user_id', user!.id)
        .eq('cycle_id', cycleId!)
        .maybeSingle();
      return data as any;
    },
  });

  const [campoClientes, setCampoClientes] = useState('');
  const [arquetipo, setArquetipo] = useState('');
  const [postura, setPostura] = useState('');
  const [intervencao, setIntervencao] = useState('');

  useEffect(() => {
    if (refl) {
      setCampoClientes(refl.campo_clientes || '');
      setArquetipo(refl.arquetipo || '');
      setPostura(refl.postura || '');
      setIntervencao(refl.intervencao || '');
    }
  }, [refl]);

  // Tool (Forja)
  const [toolTipo, setToolTipo] = useState('pergunta_clinica');
  const [toolContent, setToolContent] = useState('');

  // User cycle (compromisso)
  const { data: userCycle } = useQuery({
    queryKey: ['club-user-cycle', cycleId],
    enabled: !!cycleId && !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from('club_user_cycles' as any)
        .select('*')
        .eq('user_id', user!.id)
        .eq('cycle_id', cycleId!)
        .maybeSingle();
      return data as any;
    },
  });

  // No compromisso fields in new schema — use status as placeholder
  // We'll store compromisso in a simple approach

  const saveCarto = useMutation({
    mutationFn: async () => {
      if (!user || !cycleId) return;
      const payload = { user_id: user.id, cycle_id: cycleId, torre, porta, labirinto, arquetipos: arqs, notas };
      if (carto) {
        await supabase.from('club_cartography' as any).update(payload).eq('id', carto.id);
      } else {
        await supabase.from('club_cartography' as any).insert(payload);
      }
    },
    onSuccess: () => { toast.success('Cartografia salva'); qc.invalidateQueries({ queryKey: ['club-cartography'] }); },
  });

  const saveRefl = useMutation({
    mutationFn: async () => {
      if (!user || !cycleId) return;
      const payload = { user_id: user.id, cycle_id: cycleId, campo_clientes: campoClientes, arquetipo, postura, intervencao };
      if (refl) {
        await supabase.from('club_reflections' as any).update(payload).eq('id', refl.id);
      } else {
        await supabase.from('club_reflections' as any).insert(payload);
      }
    },
    onSuccess: () => { toast.success('Reflexão salva'); qc.invalidateQueries({ queryKey: ['club-reflection'] }); },
  });

  const saveTool = useMutation({
    mutationFn: async () => {
      if (!user || !cycleId) return;
      await supabase.from('club_tools' as any).insert({ user_id: user.id, cycle_id: cycleId, tipo: toolTipo, conteudo: toolContent });
    },
    onSuccess: () => { toast.success('Ferramenta salva'); setToolContent(''); },
  });

  return (
    <AppLayout>
      <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/clube')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">{cycle?.portal || 'Portal'}</p>
            <h1 className="font-display text-2xl text-primary">{book?.title || '—'}</h1>
            {cycle?.start_date && cycle?.end_date && (
              <p className="text-xs text-muted-foreground">
                {new Date(cycle.start_date).toLocaleDateString('pt-BR')} — {new Date(cycle.end_date).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
        </div>

        <Tabs defaultValue="cartografia" className="space-y-6">
          <TabsList className="w-full grid grid-cols-3 bg-muted/40">
            <TabsTrigger value="cartografia" className="text-xs">Cartografia</TabsTrigger>
            <TabsTrigger value="espelho" className="text-xs">Espelho</TabsTrigger>
            <TabsTrigger value="forja" className="text-xs">Forja</TabsTrigger>
          </TabsList>

          <TabsContent value="cartografia" className="space-y-4">
            <Card className="border-border/50 bg-card/60">
              <CardContent className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Torre dominante</Label>
                  <Input value={torre} onChange={e => setTorre(e.target.value)} placeholder="Ex: Torre da Memória" className="bg-input/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Porta ativa</Label>
                  <Select value={porta} onValueChange={setPorta}>
                    <SelectTrigger className="bg-input/50"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {PORTAS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Labirinto recorrente</Label>
                  <Input value={labirinto} onChange={e => setLabirinto(e.target.value)} placeholder="Ex: Labirinto do abandono" className="bg-input/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Arquétipos</Label>
                  <div className="flex flex-wrap gap-2">
                    {ARQUETIPOS.map(a => (
                      <button
                        key={a}
                        onClick={() => setArqs(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${arqs.includes(a) ? 'bg-primary/20 border-primary text-primary' : 'border-border/50 text-muted-foreground hover:border-primary/40'}`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Notas</Label>
                  <Textarea value={notas} onChange={e => setNotas(e.target.value)} rows={4} placeholder="Observações livres..." className="bg-input/50" />
                </div>
                <Button onClick={() => saveCarto.mutate()} disabled={saveCarto.isPending} className="w-full bg-primary text-primary-foreground">Salvar</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="espelho" className="space-y-4">
            <Card className="border-border/50 bg-card/60">
              <CardContent className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Onde vejo isso nas minhas clientes?</Label>
                  <Textarea value={campoClientes} onChange={e => setCampoClientes(e.target.value)} rows={3} className="bg-input/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Qual arquétipo atravessa isso?</Label>
                  <Textarea value={arquetipo} onChange={e => setArquetipo(e.target.value)} rows={3} className="bg-input/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Qual postura esse campo pede?</Label>
                  <Textarea value={postura} onChange={e => setPostura(e.target.value)} rows={3} className="bg-input/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Proposta de intervenção</Label>
                  <Textarea value={intervencao} onChange={e => setIntervencao(e.target.value)} rows={3} className="bg-input/50" />
                </div>
                <Button onClick={() => saveRefl.mutate()} disabled={saveRefl.isPending} className="w-full bg-primary text-primary-foreground">Salvar</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forja" className="space-y-4">
            <Card className="border-border/50 bg-card/60">
              <CardContent className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Tipo</Label>
                  <div className="flex flex-wrap gap-2">
                    {TOOL_TYPES.map(t => (
                      <button
                        key={t.value}
                        onClick={() => setToolTipo(t.value)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${toolTipo === t.value ? 'bg-primary/20 border-primary text-primary' : 'border-border/50 text-muted-foreground hover:border-primary/40'}`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Conteúdo</Label>
                  <Textarea value={toolContent} onChange={e => setToolContent(e.target.value)} rows={5} placeholder="Descreva sua ferramenta..." className="bg-input/50" />
                </div>
                <Button onClick={() => saveTool.mutate()} disabled={saveTool.isPending || !toolContent.trim()} className="w-full bg-primary text-primary-foreground">Salvar ferramenta</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Alerta fixo */}
        <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <AlertTriangle className="w-4 h-4 text-primary flex-shrink-0" />
          <p className="text-xs text-muted-foreground italic">"Registre o que observa. Não o que conclui."</p>
        </div>
      </div>
    </AppLayout>
  );
}
