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
        .from('club_cycles')
        .select('*, club_books(*)')
        .eq('ativo', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
  });

  const cycleId = cycle?.id;

  // Cartography
  const { data: carto } = useQuery({
    queryKey: ['club-cartography', cycleId],
    enabled: !!cycleId && !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from('club_cartography')
        .select('*')
        .eq('user_id', user!.id)
        .eq('cycle_id', cycleId!)
        .maybeSingle();
      return data;
    },
  });

  const [torre, setTorre] = useState('');
  const [porta, setPorta] = useState('');
  const [labirinto, setLabirinto] = useState('');
  const [arqs, setArqs] = useState<string[]>([]);
  const [notas, setNotas] = useState('');

  useEffect(() => {
    if (carto) {
      setTorre(carto.torre_dominante || '');
      setPorta(carto.porta_ativa || '');
      setLabirinto(carto.labirinto_recorrente || '');
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
        .from('club_reflections')
        .select('*')
        .eq('user_id', user!.id)
        .eq('cycle_id', cycleId!)
        .maybeSingle();
      return data;
    },
  });

  const [ondeVejo, setOndeVejo] = useState('');
  const [qualArq, setQualArq] = useState('');
  const [qualPost, setQualPost] = useState('');
  const [proposta, setProposta] = useState('');

  useEffect(() => {
    if (refl) {
      setOndeVejo(refl.onde_vejo_clientes || '');
      setQualArq(refl.qual_arquetipo || '');
      setQualPost(refl.qual_postura || '');
      setProposta(refl.proposta_intervencao || '');
    }
  }, [refl]);

  // Tool (Forja)
  const [toolTipo, setToolTipo] = useState('pergunta_clinica');
  const [toolContent, setToolContent] = useState('');

  // Compromisso
  const { data: userCycle } = useQuery({
    queryKey: ['club-user-cycle', cycleId],
    enabled: !!cycleId && !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from('club_user_cycles')
        .select('*')
        .eq('user_id', user!.id)
        .eq('cycle_id', cycleId!)
        .maybeSingle();
      return data;
    },
  });

  const [compromisso, setCompromisso] = useState('');
  const [concluido, setConcluido] = useState(false);

  useEffect(() => {
    if (userCycle) {
      setCompromisso(userCycle.compromisso_semana || '');
      setConcluido(userCycle.compromisso_concluido || false);
    }
  }, [userCycle]);

  const saveCarto = useMutation({
    mutationFn: async () => {
      if (!user || !cycleId) return;
      const payload = {
        user_id: user.id,
        cycle_id: cycleId,
        torre_dominante: torre,
        porta_ativa: porta,
        labirinto_recorrente: labirinto,
        arquetipos: arqs,
        notas,
      };
      if (carto) {
        await supabase.from('club_cartography').update(payload).eq('id', carto.id);
      } else {
        await supabase.from('club_cartography').insert(payload);
      }
    },
    onSuccess: () => { toast.success('Cartografia salva'); qc.invalidateQueries({ queryKey: ['club-cartography'] }); },
  });

  const saveRefl = useMutation({
    mutationFn: async () => {
      if (!user || !cycleId) return;
      const payload = {
        user_id: user.id,
        cycle_id: cycleId,
        onde_vejo_clientes: ondeVejo,
        qual_arquetipo: qualArq,
        qual_postura: qualPost,
        proposta_intervencao: proposta,
      };
      if (refl) {
        await supabase.from('club_reflections').update(payload).eq('id', refl.id);
      } else {
        await supabase.from('club_reflections').insert(payload);
      }
    },
    onSuccess: () => { toast.success('Reflexão salva'); qc.invalidateQueries({ queryKey: ['club-reflection'] }); },
  });

  const saveTool = useMutation({
    mutationFn: async () => {
      if (!user || !cycleId) return;
      await supabase.from('club_tools').insert({
        user_id: user.id,
        cycle_id: cycleId,
        tipo: toolTipo,
        conteudo: toolContent,
      });
    },
    onSuccess: () => { toast.success('Ferramenta salva'); setToolContent(''); },
  });

  const saveCompromisso = useMutation({
    mutationFn: async () => {
      if (!user || !cycleId) return;
      const payload = {
        user_id: user.id,
        cycle_id: cycleId,
        compromisso_semana: compromisso,
        compromisso_concluido: concluido,
      };
      if (userCycle) {
        await supabase.from('club_user_cycles').update(payload).eq('id', userCycle.id);
      } else {
        await supabase.from('club_user_cycles').insert(payload);
      }
    },
    onSuccess: () => { toast.success('Compromisso salvo'); qc.invalidateQueries({ queryKey: ['club-user-cycle'] }); },
  });

  const bookTitle = (cycle?.club_books as any)?.titulo || '—';

  return (
    <AppLayout>
      <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/clube')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">{cycle?.portal || 'Portal'}</p>
            <h1 className="font-display text-2xl text-primary">{bookTitle}</h1>
            {cycle?.data_inicio && cycle?.data_fim && (
              <p className="text-xs text-muted-foreground">
                {new Date(cycle.data_inicio).toLocaleDateString('pt-BR')} — {new Date(cycle.data_fim).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="cartografia" className="space-y-6">
          <TabsList className="w-full grid grid-cols-3 bg-muted/40">
            <TabsTrigger value="cartografia" className="text-xs">Cartografia</TabsTrigger>
            <TabsTrigger value="espelho" className="text-xs">Espelho</TabsTrigger>
            <TabsTrigger value="forja" className="text-xs">Forja</TabsTrigger>
          </TabsList>

          {/* ABA 1 — CARTOGRAFIA */}
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
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          arqs.includes(a) ? 'bg-primary/20 border-primary text-primary' : 'border-border/50 text-muted-foreground hover:border-primary/40'
                        }`}
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
                <Button onClick={() => saveCarto.mutate()} disabled={saveCarto.isPending} className="w-full bg-primary text-primary-foreground">
                  Salvar
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA 2 — ESPELHO */}
          <TabsContent value="espelho" className="space-y-4">
            <Card className="border-border/50 bg-card/60">
              <CardContent className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Onde vejo isso nas minhas clientes?</Label>
                  <Textarea value={ondeVejo} onChange={e => setOndeVejo(e.target.value)} rows={3} className="bg-input/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Qual arquétipo atravessa isso?</Label>
                  <Textarea value={qualArq} onChange={e => setQualArq(e.target.value)} rows={3} className="bg-input/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Qual postura esse campo pede?</Label>
                  <Textarea value={qualPost} onChange={e => setQualPost(e.target.value)} rows={3} className="bg-input/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Proposta de intervenção</Label>
                  <Textarea value={proposta} onChange={e => setProposta(e.target.value)} rows={3} className="bg-input/50" />
                </div>
                <Button onClick={() => saveRefl.mutate()} disabled={saveRefl.isPending} className="w-full bg-primary text-primary-foreground">
                  Salvar
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA 3 — FORJA */}
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
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          toolTipo === t.value ? 'bg-primary/20 border-primary text-primary' : 'border-border/50 text-muted-foreground hover:border-primary/40'
                        }`}
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
                <Button onClick={() => saveTool.mutate()} disabled={saveTool.isPending || !toolContent.trim()} className="w-full bg-primary text-primary-foreground">
                  Salvar ferramenta
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Compromisso da semana */}
        <Card className="border-primary/20 bg-card/60">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg text-primary">Compromisso da semana</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              value={compromisso}
              onChange={e => setCompromisso(e.target.value)}
              placeholder="O que você se compromete esta semana?"
              className="bg-input/50"
            />
            <div className="flex items-center gap-2">
              <Checkbox
                id="concluido"
                checked={concluido}
                onCheckedChange={v => setConcluido(v === true)}
              />
              <Label htmlFor="concluido" className="text-sm text-muted-foreground">Concluído</Label>
            </div>
            <Button onClick={() => saveCompromisso.mutate()} disabled={saveCompromisso.isPending} variant="outline" className="w-full border-primary/30 text-primary">
              Salvar
            </Button>
          </CardContent>
        </Card>

        {/* Alerta fixo */}
        <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <AlertTriangle className="w-4 h-4 text-primary flex-shrink-0" />
          <p className="text-xs text-muted-foreground italic">
            "Registre o que observa. Não o que conclui."
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
