// ============================================
// ADMIN TAB - CLUBE DO LIVRO ORACULAR (Avançado)
// CRUD: Estações → Jornadas → Portais + Editor Rico
// ============================================

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import {
  BookOpen, ChevronDown, ChevronUp, Lightbulb, Brain, User,
  Briefcase, Flower2, Sword, FlaskConical, Save, Loader2,
  Plus, Trash2, Eye, EyeOff
} from 'lucide-react';
import { useEstacoes, type Estacao } from '@/hooks/useEstacoes';
import { useAllPortais, useUpdatePortal, type ClubePortal, type ClubeJornada } from '@/hooks/useClubeLivro';
import { useCreateEstacao, useUpdateEstacao, useDeleteEstacao, useCreateJornada, useUpdateJornada, useDeleteJornada, useCreatePortal, useDeletePortal } from '@/hooks/useClubeLivroAdmin';
import { AdminAudioAlbumSection } from '@/components/admin/AdminAudioAlbumSection';

// ─── Constants ───────────────────────────────
const BLOCOS_META: { key: keyof Pick<ClubePortal, 'texto_simbolico' | 'essencia_8020' | 'raiz_psiquica' | 'aplicacao_pessoal' | 'aplicacao_profissional' | 'jardim_psique' | 'jardim_heroina' | 'laboratorio_8020'>; label: string; icon: React.ElementType }[] = [
  { key: 'texto_simbolico', label: 'Texto Simbólico', icon: Lightbulb },
  { key: 'essencia_8020', label: 'Essência 80/20', icon: FlaskConical },
  { key: 'raiz_psiquica', label: 'Raiz Psíquica', icon: Brain },
  { key: 'aplicacao_pessoal', label: 'Aplicação Pessoal', icon: User },
  { key: 'aplicacao_profissional', label: 'Aplicação Profissional', icon: Briefcase },
  { key: 'jardim_psique', label: 'Jardim da Psique', icon: Flower2 },
  { key: 'jardim_heroina', label: 'Jardim da Heroína', icon: Sword },
  { key: 'laboratorio_8020', label: 'Laboratório 80/20', icon: FlaskConical },
];

const JORNADA_TIPOS = [
  { value: 'heroina', label: 'Heroína', icone: '🌿' },
  { value: 'sombra', label: 'Sombra', icone: '🌘' },
  { value: 'expressao_mundo', label: 'Expressão & Mundo', icone: '🌍' },
] as const;

// ─── Portal Editor ──────────────────────────
function PortalEditor({ portal, onDelete }: { portal: ClubePortal; onDelete: () => void }) {
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState<Partial<ClubePortal>>({});
  const updatePortal = useUpdatePortal();

  const getValue = (key: string) => (draft as any)[key] ?? (portal as any)[key] ?? '';
  const handleChange = (key: string, value: string) => setDraft(prev => ({ ...prev, [key]: value }));
  const hasDraft = Object.keys(draft).length > 0;

  const handleSave = async () => {
    if (!hasDraft) return;
    try {
      await updatePortal.mutateAsync({ id: portal.id, ...draft });
      setDraft({});
      toast({ title: 'Salvo', description: `Portal "${portal.nome}" atualizado.` });
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    }
  };

  const togglePublish = async () => {
    try {
      await updatePortal.mutateAsync({ id: portal.id, ativo: !portal.ativo });
      toast({ title: portal.ativo ? 'Despublicado' : 'Publicado' });
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <Card className="border-l-4 border-l-primary/30">
      <CardContent className="p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg">{portal.icone}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground">{portal.nome}</p>
                <Badge variant={portal.ativo ? 'default' : 'secondary'} className="text-[10px]">
                  {portal.ativo ? 'Publicado' : 'Rascunho'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{portal.subtitulo}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={togglePublish} title={portal.ativo ? 'Despublicar' : 'Publicar'}>
              {portal.ativo ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </Button>
            {hasDraft && (
              <Button size="sm" onClick={handleSave} disabled={updatePortal.isPending} className="gap-1">
                {updatePortal.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                Salvar
              </Button>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir portal "{portal.nome}"?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação é irreversível. Todo o conteúdo dos 8 blocos será perdido.
                    Tem certeza absoluta?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground">
                    Sim, excluir portal
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 space-y-4 border-t border-border pt-4">
            {/* Meta fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Nome</Label>
                <Input value={getValue('nome')} onChange={e => handleChange('nome', e.target.value)} className="h-8 text-sm" />
              </div>
              <div>
                <Label className="text-xs">Ícone</Label>
                <Input value={getValue('icone')} onChange={e => handleChange('icone', e.target.value)} className="h-8 text-sm" />
              </div>
              <div className="col-span-2">
                <Label className="text-xs">Subtítulo</Label>
                <Input value={getValue('subtitulo')} onChange={e => handleChange('subtitulo', e.target.value)} className="h-8 text-sm" />
              </div>
            </div>

            <Separator />

            {/* 8 blocos — editor rico */}
            {BLOCOS_META.map(({ key, label, icon: Icon }) => (
              <div key={key}>
                <Label className="text-xs flex items-center gap-1 mb-1">
                  <Icon className="w-3 h-3" />
                  {label}
                </Label>
                <RichTextEditor
                  content={getValue(key)}
                  onChange={(html) => handleChange(key, html)}
                  placeholder={`${label}...`}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Create Portal Form ─────────────────────
function CreatePortalForm({ jornadaId, onCreated }: { jornadaId: string; onCreated: () => void }) {
  const { toast } = useToast();
  const [nome, setNome] = useState('');
  const [icone, setIcone] = useState('');
  const createPortal = useCreatePortal();

  const handleCreate = async () => {
    if (!nome.trim()) return;
    const slug = nome.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
    try {
      await createPortal.mutateAsync({ jornada_id: jornadaId, nome: nome.trim(), slug, icone: icone || '🔮' });
      setNome('');
      setIcone('');
      onCreated();
      toast({ title: 'Portal criado' });
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <div className="flex items-end gap-2 p-3 rounded-md border border-dashed border-border">
      <div className="flex-1">
        <Label className="text-xs">Nome do portal (verbo)</Label>
        <Input value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Transformar" className="h-8 text-sm" />
      </div>
      <div className="w-16">
        <Label className="text-xs">Ícone</Label>
        <Input value={icone} onChange={e => setIcone(e.target.value)} placeholder="🔮" className="h-8 text-sm" />
      </div>
      <Button size="sm" onClick={handleCreate} disabled={createPortal.isPending || !nome.trim()} className="gap-1">
        <Plus className="w-3 h-3" /> Criar
      </Button>
    </div>
  );
}

// ─── Jornada Section ────────────────────────
function JornadaSection({ jornada, portais, onRefresh }: { jornada: ClubeJornada; portais: ClubePortal[]; onRefresh: () => void }) {
  const { toast } = useToast();
  const updateJornada = useUpdateJornada();
  const deleteJornada = useDeleteJornada();
  const deletePortalMut = useDeletePortal();
  const [showCreate, setShowCreate] = useState(false);

  const tipoInfo = JORNADA_TIPOS.find(t => t.value === (jornada as any).tipo) || JORNADA_TIPOS[0];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{jornada.icone || tipoInfo.icone}</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">{jornada.nome}</h3>
              <Badge variant="outline" className="text-[10px]">{tipoInfo.label}</Badge>
              {!jornada.ativa && <Badge variant="secondary" className="text-[10px]">Inativa</Badge>}
            </div>
            <p className="text-xs text-muted-foreground">{jornada.subtitulo}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => updateJornada.mutate({ id: jornada.id, ativa: !jornada.ativa })}>
            {jornada.ativa ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir jornada "{jornada.nome}"?</AlertDialogTitle>
                <AlertDialogDescription>
                  Todos os portais dentro desta jornada serão excluídos permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteJornada.mutate(jornada.id)} className="bg-destructive text-destructive-foreground">
                  Sim, excluir jornada
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="space-y-2 ml-4 border-l-2 border-border pl-4">
        {portais.map((portal) => (
          <PortalEditor
            key={portal.id}
            portal={portal}
            onDelete={() => deletePortalMut.mutate(portal.id)}
          />
        ))}

        {showCreate ? (
          <CreatePortalForm jornadaId={jornada.id} onCreated={() => setShowCreate(false)} />
        ) : (
          <Button variant="outline" size="sm" onClick={() => setShowCreate(true)} className="gap-1 w-full border-dashed">
            <Plus className="w-3 h-3" /> Novo Portal
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Create Jornada Form ────────────────────
function CreateJornadaForm({ estacaoId, onCreated }: { estacaoId: string; onCreated: () => void }) {
  const { toast } = useToast();
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<'heroina' | 'sombra' | 'expressao_mundo'>('heroina');
  const createJornada = useCreateJornada();

  const handleCreate = async () => {
    if (!nome.trim()) return;
    const slug = nome.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
    const tipoInfo = JORNADA_TIPOS.find(t => t.value === tipo)!;
    try {
      await createJornada.mutateAsync({
        estacao_id: estacaoId,
        nome: nome.trim(),
        slug,
        tipo,
        icone: tipoInfo.icone,
      });
      setNome('');
      onCreated();
      toast({ title: 'Jornada criada' });
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <div className="flex items-end gap-2 p-3 rounded-md border border-dashed border-border bg-muted/30">
      <div className="flex-1">
        <Label className="text-xs">Nome da jornada</Label>
        <Input value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Jornada da Expressão" className="h-8 text-sm" />
      </div>
      <div className="w-44">
        <Label className="text-xs">Tipo</Label>
        <Select value={tipo} onValueChange={v => setTipo(v as any)}>
          <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            {JORNADA_TIPOS.map(t => (
              <SelectItem key={t.value} value={t.value}>{t.icone} {t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button size="sm" onClick={handleCreate} disabled={createJornada.isPending || !nome.trim()} className="gap-1">
        <Plus className="w-3 h-3" /> Criar
      </Button>
    </div>
  );
}

// ─── Estação Section ────────────────────────
function EstacaoSection({ estacao }: { estacao: Estacao }) {
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [showCreateJornada, setShowCreateJornada] = useState(false);
  const { data: allData, isLoading, refetch } = useAllPortais(estacao.id);
  const updateEstacao = useUpdateEstacao();
  const deleteEstacao = useDeleteEstacao();

  const jornadas = allData?.jornadas || [];
  const portais = allData?.portais || [];

  const statusLabel = estacao.ativa ? 'Ativa' : estacao.publicada ? 'Publicada' : 'Rascunho';
  const statusVariant = estacao.ativa ? 'default' as const : 'secondary' as const;

  const toggleActive = async () => {
    try {
      await updateEstacao.mutateAsync({ id: estacao.id, ativa: !estacao.ativa, publicada: !estacao.ativa ? true : estacao.publicada });
      toast({ title: estacao.ativa ? 'Estação desativada' : 'Estação ativada' });
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="text-lg">{estacao.fase_lunar || '🌑'}</span>
            {estacao.titulo}
            <Badge variant={statusVariant} className="text-[10px] ml-2">{statusLabel}</Badge>
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={toggleActive} title={estacao.ativa ? 'Desativar' : 'Ativar'}>
              {estacao.ativa ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </Button>
            {!estacao.ativa && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir estação "{estacao.titulo}"?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Todas as jornadas e portais serão excluídos permanentemente. Esta ação é irreversível.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteEstacao.mutate(estacao.id)} className="bg-destructive text-destructive-foreground">
                      Sim, excluir estação
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="w-4 h-4" />
          <span>{estacao.livro_titulo}{estacao.livro_autor ? ` — ${estacao.livro_autor}` : ''}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {jornadas.length} jornada(s) · {portais.length} portal(is)
        </p>
      </CardContent>

      {expanded && (
        <CardContent className="pt-0 space-y-6">
          <Separator />
          {isLoading ? (
            <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
          ) : (
            <>
              {jornadas.map(jornada => (
                <JornadaSection
                  key={jornada.id}
                  jornada={jornada}
                  portais={portais.filter(p => p.jornada_id === jornada.id)}
                  onRefresh={() => refetch()}
                />
              ))}

              {showCreateJornada ? (
                <CreateJornadaForm estacaoId={estacao.id} onCreated={() => setShowCreateJornada(false)} />
              ) : (
                <Button variant="outline" size="sm" onClick={() => setShowCreateJornada(true)} className="gap-1 w-full border-dashed">
                  <Plus className="w-3 h-3" /> Nova Jornada
                </Button>
              )}

              <Separator />
              <AdminAudioAlbumSection estacaoId={estacao.id} />
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}

// ─── Create Estação Form ────────────────────
function CreateEstacaoForm({ onCreated }: { onCreated: () => void }) {
  const { toast } = useToast();
  const [titulo, setTitulo] = useState('');
  const [subtitulo, setSubtitulo] = useState('');
  const [livroTitulo, setLivroTitulo] = useState('');
  const [livroAutor, setLivroAutor] = useState('');
  const [faseLunar, setFaseLunar] = useState('🌑');
  const createEstacao = useCreateEstacao();

  const handleCreate = async () => {
    if (!titulo.trim() || !livroTitulo.trim()) return;
    try {
      await createEstacao.mutateAsync({
        titulo: titulo.trim(),
        subtitulo: subtitulo.trim(),
        livro_titulo: livroTitulo.trim(),
        livro_autor: livroAutor.trim() || undefined,
        fase_lunar: faseLunar || undefined,
      });
      setTitulo(''); setSubtitulo(''); setLivroTitulo(''); setLivroAutor('');
      onCreated();
      toast({ title: 'Estação criada como rascunho' });
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nova Estação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Label className="text-xs">Nome da estação *</Label>
            <Input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ex: Estação II — Fogo & Renascimento" className="h-9" />
          </div>
          <div className="col-span-2">
            <Label className="text-xs">Subtítulo / Tema simbólico</Label>
            <Input value={subtitulo} onChange={e => setSubtitulo(e.target.value)} placeholder="Ex: O território da transformação" className="h-9" />
          </div>
          <div>
            <Label className="text-xs">Livro-eixo *</Label>
            <Input value={livroTitulo} onChange={e => setLivroTitulo(e.target.value)} placeholder="Título do livro" className="h-9" />
          </div>
          <div>
            <Label className="text-xs">Autor</Label>
            <Input value={livroAutor} onChange={e => setLivroAutor(e.target.value)} placeholder="Autor(a)" className="h-9" />
          </div>
          <div className="w-20">
            <Label className="text-xs">Fase lunar</Label>
            <Input value={faseLunar} onChange={e => setFaseLunar(e.target.value)} className="h-9 text-center" />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onCreated}>Cancelar</Button>
          <Button size="sm" onClick={handleCreate} disabled={createEstacao.isPending || !titulo.trim() || !livroTitulo.trim()} className="gap-1">
            {createEstacao.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
            Criar como Rascunho
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Tab ───────────────────────────────
export function AdminClubeLivroTab() {
  const { data: estacoes, isLoading } = useEstacoes();
  const [showCreate, setShowCreate] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Clube do Livro Oracular
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gerenciamento de estações, jornadas e portais
          </p>
        </div>
        {!showCreate && (
          <Button size="sm" onClick={() => setShowCreate(true)} className="gap-1">
            <Plus className="w-3.5 h-3.5" /> Nova Estação
          </Button>
        )}
      </div>

      {/* Create form */}
      {showCreate && <CreateEstacaoForm onCreated={() => setShowCreate(false)} />}

      {/* Estações list */}
      {(estacoes || []).map(estacao => (
        <EstacaoSection key={estacao.id} estacao={estacao} />
      ))}

      {(!estacoes || estacoes.length === 0) && !showCreate && (
        <p className="text-sm text-muted-foreground text-center py-8">
          Nenhuma estação encontrada. Crie a primeira.
        </p>
      )}
    </div>
  );
}
