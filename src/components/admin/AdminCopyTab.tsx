import { useState, useEffect } from 'react';
import { useCopyAdmin } from '@/hooks/useCopy';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Plus, 
  Save, 
  Pencil, 
  Globe, 
  Compass, 
  Wrench, 
  AlertCircle, 
  BookOpen,
  FileText,
  Loader2,
  X
} from 'lucide-react';

type CopyScope = 'global' | 'travessia' | 'ferramenta' | 'sistema' | 'curso';

interface CopyItem {
  id: string;
  chave: string;
  titulo: string;
  conteudo: string;
  categoria: string;
  scope: CopyScope;
  scope_id: string | null;
  ativo: boolean;
}

interface Ferramenta {
  id: string;
  ferramenta_nome: string;
  ferramenta_chave: string;
}

interface Travessia {
  id: string;
  titulo: string;
  ordem: number;
}

interface Curso {
  id: string;
  titulo: string;
}

const SCOPE_CONFIG: Record<CopyScope, { label: string; icon: typeof Globe; color: string }> = {
  global: { label: 'Global', icon: Globe, color: 'bg-blue-500' },
  travessia: { label: 'Travessias', icon: Compass, color: 'bg-purple-500' },
  ferramenta: { label: 'Ferramentas', icon: Wrench, color: 'bg-amber-500' },
  sistema: { label: 'Sistema', icon: AlertCircle, color: 'bg-red-500' },
  curso: { label: 'Cursos', icon: BookOpen, color: 'bg-green-500' },
};

const CATEGORIAS_SISTEMA = [
  'limite_clientes',
  'ferramenta_indisponivel',
  'modulo_bloqueado',
  'em_breve',
  'erro_generico',
  'estado_vazio',
  'upgrade_plano',
  'bloqueio_acesso',
];

export default function AdminCopyTab() {
  const { copies, isLoading, fetchAllCopies, createCopy, updateCopy, toggleActive } = useCopyAdmin();
  const [ferramentas, setFerramentas] = useState<Ferramenta[]>([]);
  const [travessias, setTravessias] = useState<Travessia[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editTitulo, setEditTitulo] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newCopy, setNewCopy] = useState({
    chave: '',
    titulo: '',
    conteudo: '',
    categoria: 'geral',
    scope: 'global' as CopyScope,
    scope_id: null as string | null,
    ativo: true,
  });

  useEffect(() => {
    fetchAllCopies();
    fetchRelatedData();
  }, [fetchAllCopies]);

  const fetchRelatedData = async () => {
    const [ferramentasRes, travessiasRes, cursosRes] = await Promise.all([
      supabase.from('sala_ferramentas').select('id, ferramenta_nome, ferramenta_chave').eq('ativa', true),
      supabase.from('conteudo_travessias').select('id, titulo, ordem').order('ordem'),
      supabase.from('courses').select('id, titulo').eq('publicado', true),
    ]);

    if (ferramentasRes.data) setFerramentas(ferramentasRes.data);
    if (travessiasRes.data) setTravessias(travessiasRes.data);
    if (cursosRes.data) setCursos(cursosRes.data);
  };

  const getCopiesByScope = (scope: CopyScope, scopeId?: string) => {
    return copies.filter(c => {
      if (scopeId) {
        return c.scope === scope && c.scope_id === scopeId;
      }
      return c.scope === scope;
    });
  };

  const handleStartEdit = (copy: CopyItem) => {
    setEditingId(copy.id);
    setEditContent(copy.conteudo);
    setEditTitulo(copy.titulo);
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await updateCopy(id, { conteudo: editContent, titulo: editTitulo });
      toast.success('Copy atualizada!');
      setEditingId(null);
      fetchAllCopies();
    } catch (error) {
      toast.error('Erro ao salvar');
    }
  };

  const handleToggleActive = async (id: string, ativo: boolean) => {
    try {
      await toggleActive(id, ativo);
      toast.success(ativo ? 'Copy ativada' : 'Copy desativada');
      fetchAllCopies();
    } catch (error) {
      toast.error('Erro ao alterar status');
    }
  };

  const handleCreate = async () => {
    if (!newCopy.chave || !newCopy.titulo || !newCopy.conteudo) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      await createCopy({
        ...newCopy,
        chave: newCopy.chave.toLowerCase().replace(/\s+/g, '_'),
      });
      toast.success('Copy criada!');
      setShowCreateDialog(false);
      setNewCopy({
        chave: '',
        titulo: '',
        conteudo: '',
        categoria: 'geral',
        scope: 'global',
        scope_id: null,
        ativo: true,
      });
      fetchAllCopies();
    } catch (error) {
      toast.error('Erro ao criar copy');
    }
  };

  const renderCopyCard = (copy: CopyItem) => {
    const isEditing = editingId === copy.id;
    
    return (
      <Card key={copy.id} className={`mb-3 ${!copy.ativo ? 'opacity-50' : ''}`}>
        <CardContent className="pt-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    value={editTitulo}
                    onChange={(e) => setEditTitulo(e.target.value)}
                    placeholder="Título"
                    className="font-medium"
                  />
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={4}
                    placeholder="Conteúdo da copy..."
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSaveEdit(copy.id)}>
                      <Save className="w-4 h-4 mr-1" /> Salvar
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                      <X className="w-4 h-4 mr-1" /> Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{copy.titulo}</span>
                    <Badge variant="outline" className="text-xs">{copy.chave}</Badge>
                    {copy.categoria && (
                      <Badge variant="secondary" className="text-xs">{copy.categoria}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3">
                    {copy.conteudo}
                  </p>
                </>
              )}
            </div>
            {!isEditing && (
              <div className="flex items-center gap-2">
                <Switch
                  checked={copy.ativo}
                  onCheckedChange={(checked) => handleToggleActive(copy.id, checked)}
                />
                <Button size="icon" variant="ghost" onClick={() => handleStartEdit(copy)}>
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderScopeSection = (scope: CopyScope, scopeId?: string, title?: string) => {
    const scopeCopies = getCopiesByScope(scope, scopeId);
    const config = SCOPE_CONFIG[scope];
    const Icon = config.icon;

    return (
      <div className="space-y-3">
        {title && (
          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Icon className="w-4 h-4" />
            {title}
          </h4>
        )}
        {scopeCopies.length === 0 ? (
          <p className="text-sm text-muted-foreground italic py-4 text-center">
            Nenhuma copy cadastrada para esta seção
          </p>
        ) : (
          scopeCopies.map(renderCopyCard)
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-gold" />
            Copy & Narrativas do App
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie todos os textos do aplicativo de forma centralizada
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Nova Copy
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Criar Nova Copy</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Escopo *</Label>
                  <Select
                    value={newCopy.scope}
                    onValueChange={(value: CopyScope) => setNewCopy({ ...newCopy, scope: value, scope_id: null })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(SCOPE_CONFIG).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {newCopy.scope === 'travessia' && (
                  <div className="space-y-2">
                    <Label>Travessia</Label>
                    <Select
                      value={newCopy.scope_id || ''}
                      onValueChange={(value) => setNewCopy({ ...newCopy, scope_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {travessias.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.titulo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {newCopy.scope === 'ferramenta' && (
                  <div className="space-y-2">
                    <Label>Ferramenta</Label>
                    <Select
                      value={newCopy.scope_id || ''}
                      onValueChange={(value) => setNewCopy({ ...newCopy, scope_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {ferramentas.map((f) => (
                          <SelectItem key={f.id} value={f.ferramenta_chave}>
                            {f.ferramenta_nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {newCopy.scope === 'curso' && (
                  <div className="space-y-2">
                    <Label>Curso</Label>
                    <Select
                      value={newCopy.scope_id || ''}
                      onValueChange={(value) => setNewCopy({ ...newCopy, scope_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {cursos.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.titulo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {newCopy.scope === 'sistema' && (
                  <div className="space-y-2">
                    <Label>Categoria Sistema</Label>
                    <Select
                      value={newCopy.categoria}
                      onValueChange={(value) => setNewCopy({ ...newCopy, categoria: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIAS_SISTEMA.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat.replace(/_/g, ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Chave técnica *</Label>
                <Input
                  value={newCopy.chave}
                  onChange={(e) => setNewCopy({ ...newCopy, chave: e.target.value })}
                  placeholder="ex: titulo_pagina, descricao_vitrine..."
                />
              </div>

              <div className="space-y-2">
                <Label>Título (nome amigável) *</Label>
                <Input
                  value={newCopy.titulo}
                  onChange={(e) => setNewCopy({ ...newCopy, titulo: e.target.value })}
                  placeholder="ex: Título da Página Big5"
                />
              </div>

              <div className="space-y-2">
                <Label>Conteúdo *</Label>
                <Textarea
                  value={newCopy.conteudo}
                  onChange={(e) => setNewCopy({ ...newCopy, conteudo: e.target.value })}
                  rows={4}
                  placeholder="Texto que será exibido no app..."
                />
              </div>

              <Button onClick={handleCreate} className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Criar Copy
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Accordion type="multiple" defaultValue={['global']} className="space-y-4">
        {/* Seção A - Global */}
        <AccordionItem value="global" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Globe className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-left">
                <span className="font-medium">Copy Global</span>
                <p className="text-xs text-muted-foreground">
                  Boas-vindas, textos institucionais, avisos gerais
                </p>
              </div>
              <Badge variant="secondary" className="ml-2">
                {getCopiesByScope('global').length}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            {renderScopeSection('global')}
          </AccordionContent>
        </AccordionItem>

        {/* Seção B - Travessias */}
        <AccordionItem value="travessia" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Compass className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-left">
                <span className="font-medium">Copy das Travessias</span>
                <p className="text-xs text-muted-foreground">
                  Textos de abertura, encerramento e rituais
                </p>
              </div>
              <Badge variant="secondary" className="ml-2">
                {getCopiesByScope('travessia').length}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-6">
            {travessias.length > 0 ? (
              travessias.map((t) => (
                <div key={t.id} className="border-l-2 border-purple-500/30 pl-4">
                  {renderScopeSection('travessia', t.id, t.titulo)}
                </div>
              ))
            ) : (
              <>
                {renderScopeSection('travessia', undefined, 'Todas as Travessias')}
              </>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Seção C - Ferramentas */}
        <AccordionItem value="ferramenta" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Wrench className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-left">
                <span className="font-medium">Copy das Ferramentas</span>
                <p className="text-xs text-muted-foreground">
                  Títulos, descrições, vitrines e avisos éticos
                </p>
              </div>
              <Badge variant="secondary" className="ml-2">
                {getCopiesByScope('ferramenta').length}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-6">
            {ferramentas.map((f) => (
              <div key={f.id} className="border-l-2 border-amber-500/30 pl-4">
                {renderScopeSection('ferramenta', f.ferramenta_chave, f.ferramenta_nome)}
              </div>
            ))}
            {ferramentas.length === 0 && (
              <p className="text-sm text-muted-foreground italic text-center py-4">
                Nenhuma ferramenta cadastrada
              </p>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Seção D - Sistema */}
        <AccordionItem value="sistema" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-left">
                <span className="font-medium">Copy de Sistema</span>
                <p className="text-xs text-muted-foreground">
                  Erros, bloqueios, estados vazios, limites
                </p>
              </div>
              <Badge variant="secondary" className="ml-2">
                {getCopiesByScope('sistema').length}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            {renderScopeSection('sistema')}
          </AccordionContent>
        </AccordionItem>

        {/* Seção E - Cursos */}
        <AccordionItem value="curso" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-left">
                <span className="font-medium">Copy de Cursos</span>
                <p className="text-xs text-muted-foreground">
                  Aberturas, orientações, encerramentos
                </p>
              </div>
              <Badge variant="secondary" className="ml-2">
                {getCopiesByScope('curso').length}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-6">
            {cursos.map((c) => (
              <div key={c.id} className="border-l-2 border-green-500/30 pl-4">
                {renderScopeSection('curso', c.id, c.titulo)}
              </div>
            ))}
            {cursos.length === 0 && (
              <p className="text-sm text-muted-foreground italic text-center py-4">
                Nenhum curso cadastrado
              </p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
