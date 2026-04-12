import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  useOraculoPortal, usePortalEssencia, usePortalAudios, usePortalLaboratorio,
  usePortalLabPassos, usePortalJardins, usePortalAplicacoes, usePortalNarroterapia,
  usePortalNarroterapiaPerguntas, usePortalForja, usePortalForjaPassos, usePortalForjaErros,
  usePortalFerramenta, usePortalFerramentaCampos, usePortalRiscosEticos, usePortalMateriais,
  usePortalMutations,
} from '@/hooks/useOraculoPortais';
import {
  ArrowLeft, DoorOpen, Save, Plus, Trash2, CheckCircle2, XCircle,
  Compass, Headphones, FlaskConical, Flower2, Briefcase, BookOpen, Flame, Wrench, ShieldAlert, FileText
} from 'lucide-react';

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">{children}</label>;
}

// ── Reusable 1:1 form section ──
function SingleFormSection({ fields, data, onSave, saving }: {
  fields: { key: string; label: string; type?: 'text' | 'textarea' }[];
  data: Record<string, any> | null;
  onSave: (values: Record<string, any>) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<Record<string, any>>(data || {});

  const handleChange = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  // Sync when data loads
  if (data && !form._synced && data.id) {
    Object.assign(form, data, { _synced: true });
  }

  return (
    <div className="space-y-4">
      {fields.map(f => (
        <div key={f.key}>
          <FieldLabel>{f.label}</FieldLabel>
          {f.type === 'textarea' ? (
            <Textarea value={form[f.key] || ''} onChange={e => handleChange(f.key, e.target.value)} rows={3} />
          ) : (
            <Input value={form[f.key] || ''} onChange={e => handleChange(f.key, e.target.value)} />
          )}
        </div>
      ))}
      <Button onClick={() => { const { _synced, ...rest } = form; onSave(rest); }} disabled={saving} size="sm">
        <Save className="w-3.5 h-3.5 mr-1" /> Salvar
      </Button>
    </div>
  );
}

// ── Reusable 1:N list section ──
function ListSection({ items, fields, onAdd, onUpdate, onRemove }: {
  items: any[];
  fields: { key: string; label: string; type?: 'text' | 'textarea' }[];
  onAdd: (values: Record<string, any>) => void;
  onUpdate: (values: Record<string, any>) => void;
  onRemove: (id: string) => void;
}) {
  const [newItem, setNewItem] = useState<Record<string, any>>({});

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <Card key={item.id} className="border-muted">
          <CardContent className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">#{idx + 1}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onRemove(item.id)}>
                <Trash2 className="w-3 h-3 text-destructive" />
              </Button>
            </div>
            {fields.map(f => (
              <div key={f.key}>
                <FieldLabel>{f.label}</FieldLabel>
                {f.type === 'textarea' ? (
                  <Textarea
                    defaultValue={item[f.key] || ''}
                    onBlur={e => onUpdate({ id: item.id, [f.key]: e.target.value })}
                    rows={2}
                  />
                ) : (
                  <Input
                    defaultValue={item[f.key] || ''}
                    onBlur={e => onUpdate({ id: item.id, [f.key]: e.target.value })}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
      <Card className="border-dashed border-primary/20">
        <CardContent className="p-3 space-y-2">
          {fields.map(f => (
            <div key={f.key}>
              <FieldLabel>{f.label}</FieldLabel>
              {f.type === 'textarea' ? (
                <Textarea value={newItem[f.key] || ''} onChange={e => setNewItem(prev => ({ ...prev, [f.key]: e.target.value }))} rows={2} placeholder={`Novo ${f.label.toLowerCase()}`} />
              ) : (
                <Input value={newItem[f.key] || ''} onChange={e => setNewItem(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={`Novo ${f.label.toLowerCase()}`} />
              )}
            </div>
          ))}
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              onAdd({ ...newItem, ordem: items.length + 1 });
              setNewItem({});
            }}
            disabled={!fields.some(f => newItem[f.key])}
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Tab: Geral ──
function TabGeral({ portal, updatePortal, checkPublicacao }: {
  portal: any; updatePortal: any; checkPublicacao: (id: string) => Promise<boolean>;
}) {
  const [form, setForm] = useState<Record<string, any>>({});
  const [podePublicar, setPodePublicar] = useState<boolean | null>(null);
  const { toast } = useToast();

  if (portal && !form._synced) {
    Object.assign(form, portal, { _synced: true });
  }

  const update = (key: string, val: any) => setForm(prev => ({ ...prev, [key]: val }));

  const handleCheck = async () => {
    const ok = await checkPublicacao(portal.id);
    setPodePublicar(ok);
    if (ok) toast({ title: 'Portal pronto para publicação!' });
    else toast({ title: 'Portal incompleto', description: 'Preencha todas as seções obrigatórias.', variant: 'destructive' });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><FieldLabel>Nome</FieldLabel><Input value={form.nome || ''} onChange={e => update('nome', e.target.value)} /></div>
        <div><FieldLabel>Subtítulo</FieldLabel><Input value={form.subtitulo || ''} onChange={e => update('subtitulo', e.target.value)} /></div>
        <div><FieldLabel>Slug</FieldLabel><Input value={form.slug || ''} onChange={e => update('slug', e.target.value)} /></div>
        <div><FieldLabel>Ordem</FieldLabel><Input type="number" value={form.ordem || 0} onChange={e => update('ordem', parseInt(e.target.value))} /></div>
        <div>
          <FieldLabel>Status</FieldLabel>
          <Select value={form.status || 'draft'} onValueChange={v => update('status', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="published">Publicado</SelectItem>
              <SelectItem value="archived">Arquivado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><FieldLabel>Tempo estimado</FieldLabel><Input value={form.tempo_estimado || ''} onChange={e => update('tempo_estimado', e.target.value)} /></div>
      </div>
      <div><FieldLabel>Descrição curta</FieldLabel><Textarea value={form.descricao_curta || ''} onChange={e => update('descricao_curta', e.target.value)} rows={2} /></div>
      <div><FieldLabel>Objetivo formativo</FieldLabel><Textarea value={form.objetivo_formativo || ''} onChange={e => update('objetivo_formativo', e.target.value)} rows={2} /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><FieldLabel>Inspirado em</FieldLabel><Input value={form.inspirado_em || ''} onChange={e => update('inspirado_em', e.target.value)} /></div>
        <div><FieldLabel>Livro base</FieldLabel><Input value={form.livro_base || ''} onChange={e => update('livro_base', e.target.value)} /></div>
        <div><FieldLabel>Cover image URL</FieldLabel><Input value={form.cover_image_url || ''} onChange={e => update('cover_image_url', e.target.value)} /></div>
        <div><FieldLabel>Ícone</FieldLabel><Input value={form.icon_name || ''} onChange={e => update('icon_name', e.target.value)} /></div>
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={() => {
          const { _synced, id, created_at, updated_at, ...rest } = form;
          updatePortal.mutate({ id: portal.id, ...rest });
        }} disabled={updatePortal.isPending}>
          <Save className="w-4 h-4 mr-1" /> Salvar Portal
        </Button>
        <Button variant="outline" onClick={handleCheck}>
          Verificar publicação
        </Button>
        {podePublicar !== null && (
          podePublicar
            ? <Badge variant="default" className="gap-1"><CheckCircle2 className="w-3 h-3" /> Pronto</Badge>
            : <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" /> Incompleto</Badge>
        )}
      </div>
    </div>
  );
}

// ── Tab: Áudios ──
function TabAudios({ portalId }: { portalId: string }) {
  const { data: audios, add, update, remove } = usePortalAudios(portalId);
  const [newAudio, setNewAudio] = useState({ titulo: '', tipo: 'principal', duracao: '', audio_url: '', roteiro: '' });

  return (
    <div className="space-y-3">
      {audios.map((a: any, idx: number) => (
        <Card key={a.id} className="border-muted">
          <CardContent className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-[10px]">{a.tipo}</Badge>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => remove.mutate(a.id)}>
                <Trash2 className="w-3 h-3 text-destructive" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><FieldLabel>Título</FieldLabel><Input defaultValue={a.titulo} onBlur={e => update.mutate({ id: a.id, titulo: e.target.value })} /></div>
              <div><FieldLabel>Duração</FieldLabel><Input defaultValue={a.duracao || ''} onBlur={e => update.mutate({ id: a.id, duracao: e.target.value })} /></div>
            </div>
            <div><FieldLabel>URL do áudio</FieldLabel><Input defaultValue={a.audio_url || ''} onBlur={e => update.mutate({ id: a.id, audio_url: e.target.value })} /></div>
            <div><FieldLabel>Roteiro</FieldLabel><Textarea defaultValue={a.roteiro || ''} onBlur={e => update.mutate({ id: a.id, roteiro: e.target.value })} rows={3} /></div>
          </CardContent>
        </Card>
      ))}
      <Card className="border-dashed border-primary/20">
        <CardContent className="p-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div><FieldLabel>Título</FieldLabel><Input value={newAudio.titulo} onChange={e => setNewAudio(p => ({ ...p, titulo: e.target.value }))} /></div>
            <div>
              <FieldLabel>Tipo</FieldLabel>
              <Select value={newAudio.tipo} onValueChange={v => setNewAudio(p => ({ ...p, tipo: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="principal">Principal</SelectItem>
                  <SelectItem value="integracao">Integração</SelectItem>
                  <SelectItem value="pratica_guiada">Prática Guiada</SelectItem>
                  <SelectItem value="extra">Extra</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button size="sm" variant="outline" disabled={!newAudio.titulo} onClick={() => {
            add.mutate({ ...newAudio, ordem: audios.length + 1 });
            setNewAudio({ titulo: '', tipo: 'principal', duracao: '', audio_url: '', roteiro: '' });
          }}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar áudio
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Tab: Laboratório 80/20 ──
function TabLaboratorio({ portalId }: { portalId: string }) {
  const lab = usePortalLaboratorio(portalId);
  const passos = usePortalLabPassos(lab.data?.id || null);

  return (
    <div className="space-y-6">
      <SingleFormSection
        fields={[
          { key: 'acao_minima', label: 'Ação mínima', type: 'textarea' },
          { key: 'regulacao_emocional', label: 'Regulação emocional', type: 'textarea' },
          { key: 'resultado_esperado', label: 'Resultado esperado', type: 'textarea' },
          { key: 'observacoes', label: 'Observações', type: 'textarea' },
        ]}
        data={lab.data}
        onSave={v => lab.upsert.mutate(v)}
        saving={lab.upsert.isPending}
      />
      {lab.data?.id && (
        <>
          <h4 className="text-sm font-semibold mt-4">Passos do Laboratório</h4>
          <ListSection
            items={passos.data}
            fields={[
              { key: 'titulo', label: 'Título' },
              { key: 'descricao', label: 'Descrição', type: 'textarea' },
            ]}
            onAdd={v => passos.add.mutate(v)}
            onUpdate={v => passos.update.mutate(v)}
            onRemove={id => passos.remove.mutate(id)}
          />
        </>
      )}
    </div>
  );
}

// ── Tab: Narroterapia ──
function TabNarroterapia({ portalId }: { portalId: string }) {
  const narro = usePortalNarroterapia(portalId);
  const perguntas = usePortalNarroterapiaPerguntas(narro.data?.id || null);

  return (
    <div className="space-y-6">
      <SingleFormSection
        fields={[
          { key: 'conto_sugerido', label: 'Conto sugerido', type: 'textarea' },
          { key: 'script_abertura', label: 'Script de abertura', type: 'textarea' },
          { key: 'observacao_metodologica', label: 'Observação metodológica', type: 'textarea' },
        ]}
        data={narro.data}
        onSave={v => narro.upsert.mutate(v)}
        saving={narro.upsert.isPending}
      />
      {narro.data?.id && (
        <>
          <h4 className="text-sm font-semibold mt-4">Perguntas</h4>
          <ListSection
            items={perguntas.data}
            fields={[{ key: 'pergunta', label: 'Pergunta', type: 'textarea' }]}
            onAdd={v => perguntas.add.mutate(v)}
            onUpdate={v => perguntas.update.mutate(v)}
            onRemove={id => perguntas.remove.mutate(id)}
          />
        </>
      )}
    </div>
  );
}

// ── Tab: Forja ──
function TabForja({ portalId }: { portalId: string }) {
  const forja = usePortalForja(portalId);
  const passos = usePortalForjaPassos(forja.data?.id || null);
  const erros = usePortalForjaErros(forja.data?.id || null);

  return (
    <div className="space-y-6">
      <SingleFormSection
        fields={[
          { key: 'cenario', label: 'Cenário', type: 'textarea' },
          { key: 'portal_ativo', label: 'Portal ativo', type: 'textarea' },
          { key: 'conto_sugerido', label: 'Conto sugerido', type: 'textarea' },
          { key: 'ajuste_fino', label: 'Ajuste fino', type: 'textarea' },
        ]}
        data={forja.data}
        onSave={v => forja.upsert.mutate(v)}
        saving={forja.upsert.isPending}
      />
      {forja.data?.id && (
        <>
          <h4 className="text-sm font-semibold mt-4">Passos da Forja</h4>
          <ListSection
            items={passos.data}
            fields={[
              { key: 'titulo', label: 'Título' },
              { key: 'descricao', label: 'Descrição', type: 'textarea' },
            ]}
            onAdd={v => passos.add.mutate(v)}
            onUpdate={v => passos.update.mutate(v)}
            onRemove={id => passos.remove.mutate(id)}
          />
          <h4 className="text-sm font-semibold mt-4">Erros Comuns</h4>
          <ListSection
            items={erros.data}
            fields={[
              { key: 'erro', label: 'Erro', type: 'textarea' },
              { key: 'impacto', label: 'Impacto', type: 'textarea' },
            ]}
            onAdd={v => erros.add.mutate(v)}
            onUpdate={v => erros.update.mutate(v)}
            onRemove={id => erros.remove.mutate(id)}
          />
        </>
      )}
    </div>
  );
}

// ── Tab: Ferramenta ──
function TabFerramenta({ portalId }: { portalId: string }) {
  const ferramenta = usePortalFerramenta(portalId);
  const campos = usePortalFerramentaCampos(ferramenta.data?.id || null);

  return (
    <div className="space-y-6">
      <SingleFormSection
        fields={[
          { key: 'nome', label: 'Nome da ferramenta' },
          { key: 'descricao', label: 'Descrição', type: 'textarea' },
          { key: 'uso_contexto', label: 'Contexto de uso', type: 'textarea' },
          { key: 'instrucoes', label: 'Instruções', type: 'textarea' },
        ]}
        data={ferramenta.data}
        onSave={v => ferramenta.upsert.mutate(v)}
        saving={ferramenta.upsert.isPending}
      />
      {ferramenta.data?.id && (
        <>
          <h4 className="text-sm font-semibold mt-4">Campos da Ferramenta</h4>
          <ListSection
            items={campos.data}
            fields={[
              { key: 'label', label: 'Label' },
              { key: 'field_key', label: 'Chave do campo' },
              { key: 'field_type', label: 'Tipo (text/textarea/select/multiselect/boolean/number)' },
              { key: 'placeholder', label: 'Placeholder' },
              { key: 'help_text', label: 'Texto de ajuda' },
            ]}
            onAdd={v => campos.add.mutate({ ...v, required: false })}
            onUpdate={v => campos.update.mutate(v)}
            onRemove={id => campos.remove.mutate(id)}
          />
        </>
      )}
    </div>
  );
}

// ── Tab: Materiais ──
function TabMateriais({ portalId }: { portalId: string }) {
  const { data: materiais, add, update, remove } = usePortalMateriais(portalId);
  const [newMat, setNewMat] = useState({ titulo: '', tipo: 'pdf', url: '', descricao: '' });

  return (
    <div className="space-y-3">
      {materiais.map((m: any) => (
        <Card key={m.id} className="border-muted">
          <CardContent className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-[10px]">{m.tipo}</Badge>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => remove.mutate(m.id)}>
                <Trash2 className="w-3 h-3 text-destructive" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><FieldLabel>Título</FieldLabel><Input defaultValue={m.titulo} onBlur={e => update.mutate({ id: m.id, titulo: e.target.value })} /></div>
              <div><FieldLabel>URL</FieldLabel><Input defaultValue={m.url || ''} onBlur={e => update.mutate({ id: m.id, url: e.target.value })} /></div>
            </div>
            <div><FieldLabel>Descrição</FieldLabel><Textarea defaultValue={m.descricao || ''} onBlur={e => update.mutate({ id: m.id, descricao: e.target.value })} rows={2} /></div>
          </CardContent>
        </Card>
      ))}
      <Card className="border-dashed border-primary/20">
        <CardContent className="p-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div><FieldLabel>Título</FieldLabel><Input value={newMat.titulo} onChange={e => setNewMat(p => ({ ...p, titulo: e.target.value }))} /></div>
            <div>
              <FieldLabel>Tipo</FieldLabel>
              <Select value={newMat.tipo} onValueChange={v => setNewMat(p => ({ ...p, tipo: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['pdf','slide','video','audio','link','imagem','bonus'].map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div><FieldLabel>URL</FieldLabel><Input value={newMat.url} onChange={e => setNewMat(p => ({ ...p, url: e.target.value }))} /></div>
          <Button size="sm" variant="outline" disabled={!newMat.titulo} onClick={() => {
            add.mutate({ ...newMat, ordem: materiais.length + 1 });
            setNewMat({ titulo: '', tipo: 'pdf', url: '', descricao: '' });
          }}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar material
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ── MAIN PAGE ──
export default function AdminOraculoPortalEditor() {
  const { portalId } = useParams<{ portalId: string }>();
  const { data: portal, isLoading } = useOraculoPortal(portalId || null);
  const { updatePortal, checkPublicacao } = usePortalMutations();

  const essencia = usePortalEssencia(portalId || null);
  const jardins = usePortalJardins(portalId || null);
  const aplicacoes = usePortalAplicacoes(portalId || null);
  const riscos = usePortalRiscosEticos(portalId || null);

  if (isLoading) {
    return <AppLayout><div className="container mx-auto px-4 py-12 text-center text-muted-foreground">Carregando portal…</div></AppLayout>;
  }

  if (!portal) {
    return <AppLayout><div className="container mx-auto px-4 py-12 text-center text-muted-foreground">Portal não encontrado.</div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin/clube-livro/oraculo-portais">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <SectionHeader
            title={portal.nome}
            subtitle={portal.subtitulo || 'Editor do portal'}
            icon={<DoorOpen className="w-5 h-5" />}
          />
        </div>

        <Tabs defaultValue="geral" className="space-y-4">
          <TabsList className="flex flex-wrap h-auto gap-1">
            <TabsTrigger value="geral" className="text-xs gap-1"><DoorOpen className="w-3 h-3" /> Geral</TabsTrigger>
            <TabsTrigger value="essencia" className="text-xs gap-1"><Compass className="w-3 h-3" /> Essência</TabsTrigger>
            <TabsTrigger value="audio" className="text-xs gap-1"><Headphones className="w-3 h-3" /> Áudio</TabsTrigger>
            <TabsTrigger value="laboratorio" className="text-xs gap-1"><FlaskConical className="w-3 h-3" /> Lab 80/20</TabsTrigger>
            <TabsTrigger value="jardins" className="text-xs gap-1"><Flower2 className="w-3 h-3" /> Jardins</TabsTrigger>
            <TabsTrigger value="aplicacao" className="text-xs gap-1"><Briefcase className="w-3 h-3" /> Aplicação</TabsTrigger>
            <TabsTrigger value="narroterapia" className="text-xs gap-1"><BookOpen className="w-3 h-3" /> Converse com o Livro</TabsTrigger>
            <TabsTrigger value="forja" className="text-xs gap-1"><Flame className="w-3 h-3" /> A Forja</TabsTrigger>
            <TabsTrigger value="ferramenta" className="text-xs gap-1"><Wrench className="w-3 h-3" /> Ferramenta</TabsTrigger>
            <TabsTrigger value="risco" className="text-xs gap-1"><ShieldAlert className="w-3 h-3" /> Risco Ético</TabsTrigger>
            <TabsTrigger value="materiais" className="text-xs gap-1"><FileText className="w-3 h-3" /> Materiais</TabsTrigger>
          </TabsList>

          <TabsContent value="geral">
            <Card><CardContent className="p-6">
              <TabGeral portal={portal} updatePortal={updatePortal} checkPublicacao={checkPublicacao} />
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="essencia">
            <Card><CardContent className="p-6">
              <SingleFormSection
                fields={[
                  { key: 'onde_estamos', label: 'Onde estamos na jornada', type: 'textarea' },
                  { key: 'habilidade', label: 'Habilidade simbólica', type: 'textarea' },
                  { key: 'tensao_central', label: 'Tensão central', type: 'textarea' },
                  { key: 'nucleo_80_20', label: 'Núcleo 80/20', type: 'textarea' },
                  { key: 'o_que_nao_fazer', label: 'O que não fazer', type: 'textarea' },
                  { key: 'leitura_etica', label: 'Leitura ética', type: 'textarea' },
                ]}
                data={essencia.data}
                onSave={v => essencia.upsert.mutate(v)}
                saving={essencia.upsert.isPending}
              />
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="audio">
            <Card><CardContent className="p-6">
              <TabAudios portalId={portalId!} />
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="laboratorio">
            <Card><CardContent className="p-6">
              <TabLaboratorio portalId={portalId!} />
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="jardins">
            <Card><CardContent className="p-6">
              <SingleFormSection
                fields={[
                  { key: 'jardim_psique', label: 'Jardim da Psique', type: 'textarea' },
                  { key: 'jardim_oficio', label: 'Jardim do Ofício', type: 'textarea' },
                  { key: 'laboratorio_integracao', label: 'Laboratório de integração', type: 'textarea' },
                ]}
                data={jardins.data}
                onSave={v => jardins.upsert.mutate(v)}
                saving={jardins.upsert.isPending}
              />
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="aplicacao">
            <Card><CardContent className="p-6">
              <SingleFormSection
                fields={[
                  { key: 'uso_sessao', label: 'Uso em sessão individual', type: 'textarea' },
                  { key: 'uso_grupo', label: 'Uso em grupo terapêutico', type: 'textarea' },
                  { key: 'uso_aula', label: 'Uso em aula/círculo', type: 'textarea' },
                ]}
                data={aplicacoes.data}
                onSave={v => aplicacoes.upsert.mutate(v)}
                saving={aplicacoes.upsert.isPending}
              />
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="narroterapia">
            <Card><CardContent className="p-6">
              <TabNarroterapia portalId={portalId!} />
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="forja">
            <Card><CardContent className="p-6">
              <TabForja portalId={portalId!} />
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="ferramenta">
            <Card><CardContent className="p-6">
              <TabFerramenta portalId={portalId!} />
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="risco">
            <Card><CardContent className="p-6">
              <ListSection
                items={riscos.data}
                fields={[
                  { key: 'risco', label: 'Risco', type: 'textarea' },
                  { key: 'descricao', label: 'Descrição', type: 'textarea' },
                ]}
                onAdd={v => riscos.add.mutate(v)}
                onUpdate={v => riscos.update.mutate(v)}
                onRemove={id => riscos.remove.mutate(id)}
              />
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="materiais">
            <Card><CardContent className="p-6">
              <TabMateriais portalId={portalId!} />
            </CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
