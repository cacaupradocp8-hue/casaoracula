import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  ArrowLeft, Plus, Pencil, Trash2, ChevronDown, ChevronRight, Save,
  Compass, Headphones, FlaskConical, Flower2, Briefcase, Wrench, ShieldAlert, DoorOpen,
  GripVertical, Copy, Eye
} from 'lucide-react';

const TIPOS_PORTAL = ['fundacional', 'ruptura', 'integração', 'aprofundamento', 'travessia', 'encerramento'];

interface Portal {
  id: string;
  jornada_id: string;
  nome: string;
  subtitulo: string | null;
  slug: string;
  ordem: number;
  ativo: boolean;
  tipo_portal: string | null;
  // Essência
  texto_simbolico: string | null;
  essencia_8020: string | null;
  raiz_psiquica: string | null;
  onde_estamos_jornada: string | null;
  habilidade_simbolica: string | null;
  tensao_central: string | null;
  o_que_nao_fazer: string | null;
  leitura_etica: string | null;
  // Audio
  audio_url: string | null;
  audio_titulo: string | null;
  audio_duracao: string | null;
  audio_roteiro: string | null;
  // Laboratório
  acao_pequena: string | null;
  estrutura_replicavel: string[] | null;
  regulacao_emocional: string | null;
  laboratorio_8020: string | null;
  laboratorio_integracao: string | null;
  // Jardins
  jardim_psique: string | null;
  jardim_heroina: string | null;
  // Aplicação
  aplicacao_pessoal: string | null;
  aplicacao_profissional: string | null;
  aplicacao_sessao: string | null;
  aplicacao_aula: string | null;
  aplicacao_circulo: string | null;
  // Ferramenta
  ferramenta_nome: string | null;
  ferramenta_campos: any;
  // Risco
  riscos_eticos: string[] | null;
  // Aula
  aula_titulo: string | null;
  aula_data: string | null;
  aula_link: string | null;
  aula_replay_url: string | null;
}

interface BlockSectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function BlockSection({ title, icon: Icon, children, defaultOpen = false }: BlockSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="border-primary/10">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors py-3 px-4">
            <div className="flex items-center gap-3">
              <Icon className="w-4 h-4 text-gold" />
              <CardTitle className="text-sm font-semibold flex-1">{title}</CardTitle>
              {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4 px-4 space-y-4">
            {children}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{children}</label>;
}

export default function AdminPortalCMS() {
  const [params] = useSearchParams();
  const jornadaId = params.get('jornada');
  const { toast } = useToast();
  const qc = useQueryClient();

  const [selectedPortal, setSelectedPortal] = useState<string | null>(null);
  const [portalForm, setPortalForm] = useState<Partial<Portal>>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [newPortal, setNewPortal] = useState({ nome: '', subtitulo: '', tipo_portal: 'fundacional' });

  // Fetch jornada info
  const { data: jornada } = useQuery({
    queryKey: ['admin-jornada', jornadaId],
    queryFn: async () => {
      if (!jornadaId) return null;
      const { data } = await supabase.from('clube_jornadas').select('*').eq('id', jornadaId).single();
      return data;
    },
    enabled: !!jornadaId,
  });

  // Fetch all jornadas for selector
  const { data: jornadas = [] } = useQuery({
    queryKey: ['admin-jornadas-list'],
    queryFn: async () => {
      const { data } = await supabase.from('clube_jornadas').select('id, nome').order('ordem');
      return data || [];
    },
  });

  const [activeJornadaId, setActiveJornadaId] = useState(jornadaId || '');

  useEffect(() => {
    if (jornadaId) setActiveJornadaId(jornadaId);
  }, [jornadaId]);

  // Fetch portais
  const { data: portais = [], isLoading } = useQuery({
    queryKey: ['admin-portais', activeJornadaId],
    queryFn: async () => {
      if (!activeJornadaId) return [];
      const { data, error } = await supabase
        .from('clube_portais')
        .select('*')
        .eq('jornada_id', activeJornadaId)
        .order('ordem');
      if (error) throw error;
      return data as Portal[];
    },
    enabled: !!activeJornadaId,
  });

  // Load portal into form when selected
  useEffect(() => {
    if (selectedPortal) {
      const p = portais.find(x => x.id === selectedPortal);
      if (p) setPortalForm({ ...p });
    }
  }, [selectedPortal, portais]);

  const updateField = (field: string, value: any) => {
    setPortalForm(prev => ({ ...prev, [field]: value }));
  };

  // Save portal
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!selectedPortal) return;
      const { id, jornada_id, slug, created_at, updated_at, ...rest } = portalForm as any;
      const { error } = await supabase.from('clube_portais').update(rest).eq('id', selectedPortal);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-portais'] });
      toast({ title: 'Portal salvo com sucesso' });
    },
    onError: (err: Error) => toast({ title: 'Erro', description: err.message, variant: 'destructive' }),
  });

  // Create portal
  const createMutation = useMutation({
    mutationFn: async () => {
      if (!activeJornadaId) return;
      const slug = newPortal.nome.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const { error } = await supabase.from('clube_portais').insert({
        jornada_id: activeJornadaId,
        nome: newPortal.nome,
        subtitulo: newPortal.subtitulo || null,
        tipo_portal: newPortal.tipo_portal,
        slug,
        ordem: portais.length,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-portais'] });
      setCreateOpen(false);
      setNewPortal({ nome: '', subtitulo: '', tipo_portal: 'fundacional' });
      toast({ title: 'Portal criado' });
    },
    onError: (err: Error) => toast({ title: 'Erro', description: err.message, variant: 'destructive' }),
  });

  // Delete portal
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clube_portais').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-portais'] });
      setSelectedPortal(null);
      toast({ title: 'Portal excluído' });
    },
  });

  // Toggle active
  const toggleMutation = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      const { error } = await supabase.from('clube_portais').update({ ativo }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-portais'] }),
  });

  // Duplicate portal
  const duplicateMutation = useMutation({
    mutationFn: async (portal: Portal) => {
      const { id, created_at, updated_at, ...rest } = portal as any;
      const { error } = await supabase.from('clube_portais').insert({
        ...rest,
        nome: `${rest.nome} (cópia)`,
        slug: `${rest.slug}-copia-${Date.now()}`,
        ordem: portais.length,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-portais'] });
      toast({ title: 'Portal duplicado' });
    },
  });

  // Riscos éticos helpers
  const addRisco = () => {
    const current = portalForm.riscos_eticos || [];
    updateField('riscos_eticos', [...current, '']);
  };
  const updateRisco = (idx: number, val: string) => {
    const current = [...(portalForm.riscos_eticos || [])];
    current[idx] = val;
    updateField('riscos_eticos', current);
  };
  const removeRisco = (idx: number) => {
    const current = [...(portalForm.riscos_eticos || [])];
    current.splice(idx, 1);
    updateField('riscos_eticos', current);
  };

  // Estrutura replicavel helpers
  const addEstrutura = () => {
    const current = portalForm.estrutura_replicavel || [];
    updateField('estrutura_replicavel', [...current, '']);
  };
  const updateEstrutura = (idx: number, val: string) => {
    const current = [...(portalForm.estrutura_replicavel || [])];
    current[idx] = val;
    updateField('estrutura_replicavel', current);
  };
  const removeEstrutura = (idx: number) => {
    const current = [...(portalForm.estrutura_replicavel || [])];
    current.splice(idx, 1);
    updateField('estrutura_replicavel', current);
  };

  // Ferramenta campos helpers
  const ferramentaCampos = Array.isArray(portalForm.ferramenta_campos) ? portalForm.ferramenta_campos : [];
  const addCampo = () => updateField('ferramenta_campos', [...ferramentaCampos, '']);
  const updateCampo = (idx: number, val: string) => {
    const c = [...ferramentaCampos]; c[idx] = val;
    updateField('ferramenta_campos', c);
  };
  const removeCampo = (idx: number) => {
    const c = [...ferramentaCampos]; c.splice(idx, 1);
    updateField('ferramenta_campos', c);
  };

  const activePortal = portais.find(p => p.id === selectedPortal);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => (window as any).Admin_SetActiveTab?.('clube')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <SectionHeader
            title="CMS de Portais"
            subtitle={jornada?.nome || 'Estrutura formativa completa'}
            icon={<DoorOpen className="w-5 h-5" />}
          />
        </div>

        {/* Jornada selector */}
        <div className="mb-6">
          <Select value={activeJornadaId} onValueChange={(v) => { setActiveJornadaId(v); setSelectedPortal(null); }}>
            <SelectTrigger className="w-72">
              <SelectValue placeholder="Selecione uma jornada" />
            </SelectTrigger>
            <SelectContent>
              {jornadas.map(j => (
                <SelectItem key={j.id} value={j.id}>{j.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!activeJornadaId ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">Selecione uma jornada para gerenciar os portais.</CardContent></Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
            {/* Sidebar - Lista de Portais */}
            <div className="space-y-3">
              <Button onClick={() => setCreateOpen(true)} size="sm" className="w-full">
                <Plus className="w-4 h-4 mr-1" /> Novo Portal
              </Button>
              
              {isLoading ? (
                <p className="text-sm text-muted-foreground text-center py-4">Carregando...</p>
              ) : portais.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhum portal criado.</p>
              ) : (
                portais.map((p) => (
                  <Card
                    key={p.id}
                    className={`cursor-pointer transition-all ${selectedPortal === p.id ? 'border-gold/50 bg-gold/5' : 'hover:border-primary/20'}`}
                    onClick={() => setSelectedPortal(p.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-3 h-3 text-muted-foreground/30" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{p.nome}</p>
                          <div className="flex gap-1 mt-1">
                            <Badge variant={p.ativo ? 'default' : 'secondary'} className="text-[9px]">{p.ativo ? 'Ativo' : 'Inativo'}</Badge>
                            {p.tipo_portal && <Badge variant="outline" className="text-[9px]">{p.tipo_portal}</Badge>}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Main - Editor do Portal */}
            {selectedPortal && activePortal ? (
              <div className="space-y-4">
                {/* Portal header */}
                <Card className="border-gold/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h2 className="text-lg font-semibold">{activePortal.nome}</h2>
                        {activePortal.subtitulo && <p className="text-sm text-muted-foreground">{activePortal.subtitulo}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={portalForm.ativo ?? true}
                          onCheckedChange={(v) => toggleMutation.mutate({ id: selectedPortal, ativo: v })}
                        />
                        <Button variant="outline" size="icon" onClick={() => duplicateMutation.mutate(activePortal)}>
                          <Copy className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => deleteMutation.mutate(selectedPortal)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
                          <Save className="w-4 h-4 mr-1" /> Salvar
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <FieldLabel>Nome</FieldLabel>
                        <Input value={portalForm.nome || ''} onChange={(e) => updateField('nome', e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel>Subtítulo</FieldLabel>
                        <Input value={portalForm.subtitulo || ''} onChange={(e) => updateField('subtitulo', e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel>Tipo</FieldLabel>
                        <Select value={portalForm.tipo_portal || 'fundacional'} onValueChange={(v) => updateField('tipo_portal', v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {TIPOS_PORTAL.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* BLOCO 1 — ESSÊNCIA */}
                <BlockSection title="Essência" icon={Compass} defaultOpen>
                  <div>
                    <FieldLabel>Onde estamos na jornada</FieldLabel>
                    <Textarea value={portalForm.onde_estamos_jornada || ''} onChange={(e) => updateField('onde_estamos_jornada', e.target.value)} rows={2} />
                  </div>
                  <div>
                    <FieldLabel>Habilidade simbólica</FieldLabel>
                    <Textarea value={portalForm.habilidade_simbolica || ''} onChange={(e) => updateField('habilidade_simbolica', e.target.value)} rows={2} />
                  </div>
                  <div>
                    <FieldLabel>Tensão central</FieldLabel>
                    <Textarea value={portalForm.tensao_central || ''} onChange={(e) => updateField('tensao_central', e.target.value)} rows={2} />
                  </div>
                  <div>
                    <FieldLabel>Núcleo 80/20</FieldLabel>
                    <Textarea value={portalForm.essencia_8020 || ''} onChange={(e) => updateField('essencia_8020', e.target.value)} rows={2} />
                  </div>
                  <div>
                    <FieldLabel>Raiz psíquica</FieldLabel>
                    <Textarea value={portalForm.raiz_psiquica || ''} onChange={(e) => updateField('raiz_psiquica', e.target.value)} rows={2} />
                  </div>
                  <div>
                    <FieldLabel>Texto simbólico</FieldLabel>
                    <Textarea value={portalForm.texto_simbolico || ''} onChange={(e) => updateField('texto_simbolico', e.target.value)} rows={3} />
                  </div>
                  <div>
                    <FieldLabel>O que NÃO fazer</FieldLabel>
                    <Textarea value={portalForm.o_que_nao_fazer || ''} onChange={(e) => updateField('o_que_nao_fazer', e.target.value)} rows={2} />
                  </div>
                  <div>
                    <FieldLabel>Leitura ética</FieldLabel>
                    <Textarea value={portalForm.leitura_etica || ''} onChange={(e) => updateField('leitura_etica', e.target.value)} rows={2} />
                  </div>
                </BlockSection>

                {/* BLOCO 2 — ÁUDIO PRINCIPAL */}
                <BlockSection title="Áudio Principal" icon={Headphones}>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <FieldLabel>Título do áudio</FieldLabel>
                      <Input value={portalForm.audio_titulo || ''} onChange={(e) => updateField('audio_titulo', e.target.value)} />
                    </div>
                    <div>
                      <FieldLabel>Duração</FieldLabel>
                      <Input value={portalForm.audio_duracao || ''} onChange={(e) => updateField('audio_duracao', e.target.value)} placeholder="45:00" />
                    </div>
                  </div>
                  <div>
                    <FieldLabel>URL do áudio (MP3)</FieldLabel>
                    <Input value={portalForm.audio_url || ''} onChange={(e) => updateField('audio_url', e.target.value)} placeholder="https://..." />
                  </div>
                  <div>
                    <FieldLabel>Roteiro do áudio</FieldLabel>
                    <Textarea value={portalForm.audio_roteiro || ''} onChange={(e) => updateField('audio_roteiro', e.target.value)} rows={6} />
                  </div>
                </BlockSection>

                {/* BLOCO 4 — LABORATÓRIO 80/20 */}
                <BlockSection title="Laboratório 80/20" icon={FlaskConical}>
                  <div>
                    <FieldLabel>Laboratório 80/20</FieldLabel>
                    <Textarea value={portalForm.laboratorio_8020 || ''} onChange={(e) => updateField('laboratorio_8020', e.target.value)} rows={3} />
                  </div>
                  <div>
                    <FieldLabel>Ação pequena possível</FieldLabel>
                    <Textarea value={portalForm.acao_pequena || ''} onChange={(e) => updateField('acao_pequena', e.target.value)} rows={2} />
                  </div>
                  <div>
                    <FieldLabel>Estrutura replicável</FieldLabel>
                    {(portalForm.estrutura_replicavel || []).map((item, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <Input value={item} onChange={(e) => updateEstrutura(idx, e.target.value)} />
                        <Button variant="ghost" size="icon" onClick={() => removeEstrutura(idx)}><Trash2 className="w-3 h-3" /></Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addEstrutura}><Plus className="w-3 h-3 mr-1" /> Adicionar</Button>
                  </div>
                  <div>
                    <FieldLabel>Regulação emocional</FieldLabel>
                    <Textarea value={portalForm.regulacao_emocional || ''} onChange={(e) => updateField('regulacao_emocional', e.target.value)} rows={2} />
                  </div>
                </BlockSection>

                {/* BLOCO 5 — JARDINS */}
                <BlockSection title="Jardins" icon={Flower2}>
                  <div>
                    <FieldLabel>Jardim da Psique</FieldLabel>
                    <Textarea value={portalForm.jardim_psique || ''} onChange={(e) => updateField('jardim_psique', e.target.value)} rows={3} />
                  </div>
                  <div>
                    <FieldLabel>Jardim da Heroína</FieldLabel>
                    <Textarea value={portalForm.jardim_heroina || ''} onChange={(e) => updateField('jardim_heroina', e.target.value)} rows={3} />
                  </div>
                  <div>
                    <FieldLabel>Laboratório de Integração</FieldLabel>
                    <Textarea value={portalForm.laboratorio_integracao || ''} onChange={(e) => updateField('laboratorio_integracao', e.target.value)} rows={3} />
                  </div>
                </BlockSection>

                {/* BLOCO 6 — APLICAÇÃO PROFISSIONAL */}
                <BlockSection title="Aplicação Profissional" icon={Briefcase}>
                  <div>
                    <FieldLabel>Aplicação pessoal</FieldLabel>
                    <Textarea value={portalForm.aplicacao_pessoal || ''} onChange={(e) => updateField('aplicacao_pessoal', e.target.value)} rows={3} />
                  </div>
                  <div>
                    <FieldLabel>Aplicação profissional</FieldLabel>
                    <Textarea value={portalForm.aplicacao_profissional || ''} onChange={(e) => updateField('aplicacao_profissional', e.target.value)} rows={3} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <FieldLabel>Sessão</FieldLabel>
                      <Textarea value={portalForm.aplicacao_sessao || ''} onChange={(e) => updateField('aplicacao_sessao', e.target.value)} rows={3} />
                    </div>
                    <div>
                      <FieldLabel>Aula</FieldLabel>
                      <Textarea value={portalForm.aplicacao_aula || ''} onChange={(e) => updateField('aplicacao_aula', e.target.value)} rows={3} />
                    </div>
                    <div>
                      <FieldLabel>Círculo</FieldLabel>
                      <Textarea value={portalForm.aplicacao_circulo || ''} onChange={(e) => updateField('aplicacao_circulo', e.target.value)} rows={3} />
                    </div>
                  </div>
                </BlockSection>

                {/* BLOCO 7 — FERRAMENTA DO PORTAL */}
                <BlockSection title="Ferramenta do Portal" icon={Wrench}>
                  <div>
                    <FieldLabel>Nome da ferramenta</FieldLabel>
                    <Input value={portalForm.ferramenta_nome || ''} onChange={(e) => updateField('ferramenta_nome', e.target.value)} />
                  </div>
                  <div>
                    <FieldLabel>Campos da ferramenta</FieldLabel>
                    {ferramentaCampos.map((campo: string, idx: number) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <Input value={campo} onChange={(e) => updateCampo(idx, e.target.value)} placeholder={`Campo ${idx + 1}`} />
                        <Button variant="ghost" size="icon" onClick={() => removeCampo(idx)}><Trash2 className="w-3 h-3" /></Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addCampo}><Plus className="w-3 h-3 mr-1" /> Adicionar campo</Button>
                  </div>
                </BlockSection>

                {/* BLOCO 8 — RISCO ÉTICO */}
                <BlockSection title="Risco Ético" icon={ShieldAlert}>
                  {(portalForm.riscos_eticos || []).map((risco, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input value={risco} onChange={(e) => updateRisco(idx, e.target.value)} placeholder={`Risco ${idx + 1}`} />
                      <Button variant="ghost" size="icon" onClick={() => removeRisco(idx)}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addRisco}><Plus className="w-3 h-3 mr-1" /> Adicionar risco</Button>
                </BlockSection>

                {/* Floating save */}
                <div className="sticky bottom-4">
                  <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="w-full shadow-lg">
                    <Save className="w-4 h-4 mr-2" /> {saveMutation.isPending ? 'Salvando...' : 'Salvar Portal'}
                  </Button>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="py-16 text-center text-muted-foreground">
                  <DoorOpen className="w-8 h-8 mx-auto mb-3 opacity-40" />
                  <p>Selecione um portal para editar ou crie um novo.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Create Dialog */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Novo Portal</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <FieldLabel>Nome *</FieldLabel>
                <Input value={newPortal.nome} onChange={(e) => setNewPortal({ ...newPortal, nome: e.target.value })} placeholder="Portal da Ruptura" />
              </div>
              <div>
                <FieldLabel>Subtítulo</FieldLabel>
                <Input value={newPortal.subtitulo} onChange={(e) => setNewPortal({ ...newPortal, subtitulo: e.target.value })} />
              </div>
              <div>
                <FieldLabel>Tipo</FieldLabel>
                <Select value={newPortal.tipo_portal} onValueChange={(v) => setNewPortal({ ...newPortal, tipo_portal: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TIPOS_PORTAL.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" disabled={!newPortal.nome || createMutation.isPending} onClick={() => createMutation.mutate()}>
                {createMutation.isPending ? 'Criando...' : 'Criar Portal'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
