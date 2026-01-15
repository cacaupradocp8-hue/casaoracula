import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight, BookOpen, Video, DoorOpen, Music, FileText, Type, Eye, EyeOff, Image, Wrench, ExternalLink } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Database } from '@/integrations/supabase/types';

type PortalType = Database['public']['Enums']['portal_type'];

interface Sala {
  id: string;
  nome_exibicao: string;
  nivel_minimo: string;
}

interface Portal {
  id: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  ordem: number;
  portal_minimo: PortalType;
  sala_id: string | null;
  capa_url: string | null;
  publicado: boolean;
}

interface Aula {
  id: string;
  travessia_id: string;
  titulo: string;
  descricao_curta: string;
  texto_aula: string | null;
  ordem: number;
  video_url: string | null;
  audio_url: string | null;
  pdf_url: string | null;
  materiais_url: string | null;
  portal_minimo: PortalType;
  publicado: boolean;
}

interface Ferramenta {
  id: string;
  ferramenta_nome: string;
  ferramenta_descricao: string;
  icone: string | null;
  ativa: boolean;
  ordem: number;
  sala_id: string;
  portal_id: string | null;
}

const PORTAL_LABELS: Record<PortalType, string> = {
  visitante: 'Visitante',
  pre_iniciada: 'Pré-Iniciada',
  iniciada: 'Iniciada ORÁCULA',
  admin: 'Admin',
};

export function AdminConteudosTab() {
  const navigate = useNavigate();
  const [portais, setPortais] = useState<Portal[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [aulas, setAulas] = useState<Record<string, Aula[]>>({});
  const [ferramentas, setFerramentas] = useState<Ferramenta[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPortal, setExpandedPortal] = useState<string | null>(null);

  // Portal dialog state
  const [portalDialogOpen, setPortalDialogOpen] = useState(false);
  const [editingPortal, setEditingPortal] = useState<Portal | null>(null);
  const [portalForm, setPortalForm] = useState({
    titulo: '',
    subtitulo: '',
    descricao: '',
    ordem: 0,
    portal_minimo: 'visitante' as PortalType,
    sala_id: '' as string | null,
    capa_url: '',
    publicado: true,
  });

  // Aula dialog state
  const [aulaDialogOpen, setAulaDialogOpen] = useState(false);
  const [editingAula, setEditingAula] = useState<Aula | null>(null);
  const [aulaForm, setAulaForm] = useState({
    travessia_id: '',
    titulo: '',
    descricao_curta: '',
    texto_aula: '',
    ordem: 0,
    video_url: '',
    audio_url: '',
    pdf_url: '',
    materiais_url: '',
    portal_minimo: 'visitante' as PortalType,
    publicado: true,
  });

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'portal' | 'aula'; id: string; title: string } | null>(null);

  useEffect(() => {
    fetchPortais();
    fetchSalas();
    fetchFerramentas();
  }, []);

  const fetchPortais = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('conteudo_travessias')
      .select('*')
      .order('ordem', { ascending: true });

    if (error) {
      toast.error('Erro ao carregar portais');
      console.error(error);
    } else {
      // Map data to Portal interface
      const mappedPortais: Portal[] = (data || []).map((item: any) => ({
        id: item.id,
        titulo: item.titulo,
        subtitulo: item.subtitulo || '',
        descricao: item.descricao,
        ordem: item.ordem,
        portal_minimo: item.portal_minimo,
        sala_id: item.sala_id,
        capa_url: item.capa_url,
        publicado: item.publicado ?? true,
      }));
      setPortais(mappedPortais);
    }
    setLoading(false);
  };

  const fetchSalas = async () => {
    const { data, error } = await supabase
      .from('salas')
      .select('id, nome_exibicao, nivel_minimo')
      .eq('ativa', true)
      .order('ordem', { ascending: true });

    if (error) {
      console.error('Erro ao carregar salas:', error);
    } else {
      setSalas(data || []);
    }
  };

  const fetchFerramentas = async () => {
    const { data, error } = await supabase
      .from('sala_ferramentas')
      .select('id, ferramenta_nome, ferramenta_descricao, icone, ativa, ordem, sala_id, portal_id')
      .order('ordem', { ascending: true });

    if (error) {
      console.error('Erro ao carregar ferramentas:', error);
    } else {
      setFerramentas(data || []);
    }
  };

  const getFerramentasByPortal = (portalId: string): Ferramenta[] => {
    return ferramentas.filter(f => f.portal_id === portalId);
  };

  const getAvailableFerramentas = (): Ferramenta[] => {
    // Return active ferramentas not yet assigned to a portal
    return ferramentas.filter(f => !f.portal_id && f.ativa);
  };

  const addFerramentaToPortal = async (ferramentaId: string, portalId: string) => {
    const { error } = await supabase
      .from('sala_ferramentas')
      .update({ portal_id: portalId })
      .eq('id', ferramentaId);

    if (error) {
      toast.error('Erro ao vincular ferramenta');
      console.error(error);
    } else {
      toast.success('Ferramenta vinculada ao portal');
      fetchFerramentas();
    }
  };

  const removeFerramentaFromPortal = async (ferramentaId: string) => {
    const { error } = await supabase
      .from('sala_ferramentas')
      .update({ portal_id: null })
      .eq('id', ferramentaId);

    if (error) {
      toast.error('Erro ao desvincular ferramenta');
      console.error(error);
    } else {
      toast.success('Ferramenta removida do portal');
      fetchFerramentas();
    }
  };

  const fetchAulas = async (portalId: string) => {
    const { data, error } = await supabase
      .from('conteudo_aulas')
      .select('*')
      .eq('travessia_id', portalId)
      .order('ordem', { ascending: true });

    if (error) {
      toast.error('Erro ao carregar aulas');
      console.error(error);
    } else {
      const mappedAulas: Aula[] = (data || []).map((item: any) => ({
        id: item.id,
        travessia_id: item.travessia_id,
        titulo: item.titulo,
        descricao_curta: item.descricao_curta,
        texto_aula: item.texto_aula,
        ordem: item.ordem,
        video_url: item.video_url,
        audio_url: item.audio_url,
        pdf_url: item.pdf_url,
        materiais_url: item.materiais_url,
        portal_minimo: item.portal_minimo,
        publicado: item.publicado ?? true,
      }));
      setAulas((prev) => ({ ...prev, [portalId]: mappedAulas }));
    }
  };

  const handleExpandPortal = (portalId: string) => {
    if (expandedPortal === portalId) {
      setExpandedPortal(null);
    } else {
      setExpandedPortal(portalId);
      if (!aulas[portalId]) {
        fetchAulas(portalId);
      }
    }
  };

  // Portal CRUD
  const openPortalDialog = (portal?: Portal) => {
    if (portal) {
      setEditingPortal(portal);
      setPortalForm({
        titulo: portal.titulo,
        subtitulo: portal.subtitulo,
        descricao: portal.descricao,
        ordem: portal.ordem,
        portal_minimo: portal.portal_minimo,
        sala_id: portal.sala_id || '',
        capa_url: portal.capa_url || '',
        publicado: portal.publicado,
      });
    } else {
      setEditingPortal(null);
      setPortalForm({
        titulo: '',
        subtitulo: '',
        descricao: '',
        ordem: portais.length,
        portal_minimo: 'visitante',
        sala_id: '',
        capa_url: '',
        publicado: true,
      });
    }
    setPortalDialogOpen(true);
  };

  const savePortal = async () => {
    if (!portalForm.titulo.trim()) {
      toast.error('Título é obrigatório');
      return;
    }

    const dataToSave = {
      titulo: portalForm.titulo,
      subtitulo: portalForm.subtitulo,
      descricao: portalForm.descricao,
      ordem: portalForm.ordem,
      portal_minimo: portalForm.portal_minimo,
      sala_id: portalForm.sala_id || null,
      capa_url: portalForm.capa_url || null,
      publicado: portalForm.publicado,
    };

    if (editingPortal) {
      const { error } = await supabase
        .from('conteudo_travessias')
        .update(dataToSave)
        .eq('id', editingPortal.id);

      if (error) {
        toast.error('Erro ao atualizar portal');
        console.error(error);
      } else {
        toast.success('Portal atualizado');
        setPortalDialogOpen(false);
        fetchPortais();
      }
    } else {
      const { error } = await supabase
        .from('conteudo_travessias')
        .insert(dataToSave);

      if (error) {
        toast.error('Erro ao criar portal');
        console.error(error);
      } else {
        toast.success('Portal criado');
        setPortalDialogOpen(false);
        fetchPortais();
      }
    }
  };

  // Aula CRUD
  const openAulaDialog = (portalId: string, aula?: Aula) => {
    if (aula) {
      setEditingAula(aula);
      setAulaForm({
        travessia_id: aula.travessia_id,
        titulo: aula.titulo,
        descricao_curta: aula.descricao_curta,
        texto_aula: aula.texto_aula || '',
        ordem: aula.ordem,
        video_url: aula.video_url || '',
        audio_url: aula.audio_url || '',
        pdf_url: aula.pdf_url || '',
        materiais_url: aula.materiais_url || '',
        portal_minimo: aula.portal_minimo,
        publicado: aula.publicado,
      });
    } else {
      setEditingAula(null);
      const currentAulas = aulas[portalId] || [];
      setAulaForm({
        travessia_id: portalId,
        titulo: '',
        descricao_curta: '',
        texto_aula: '',
        ordem: currentAulas.length,
        video_url: '',
        audio_url: '',
        pdf_url: '',
        materiais_url: '',
        portal_minimo: 'visitante',
        publicado: true,
      });
    }
    setAulaDialogOpen(true);
  };

  const saveAula = async () => {
    if (!aulaForm.titulo.trim()) {
      toast.error('Título é obrigatório');
      return;
    }

    const dataToSave = {
      travessia_id: aulaForm.travessia_id,
      titulo: aulaForm.titulo,
      descricao_curta: aulaForm.descricao_curta,
      texto_aula: aulaForm.texto_aula || null,
      ordem: aulaForm.ordem,
      video_url: aulaForm.video_url || null,
      audio_url: aulaForm.audio_url || null,
      pdf_url: aulaForm.pdf_url || null,
      materiais_url: aulaForm.materiais_url || null,
      portal_minimo: aulaForm.portal_minimo,
      publicado: aulaForm.publicado,
    };

    if (editingAula) {
      const { error } = await supabase
        .from('conteudo_aulas')
        .update(dataToSave)
        .eq('id', editingAula.id);

      if (error) {
        toast.error('Erro ao atualizar aula');
        console.error(error);
      } else {
        toast.success('Aula atualizada');
        fetchAulas(aulaForm.travessia_id);
      }
    } else {
      const { error } = await supabase
        .from('conteudo_aulas')
        .insert(dataToSave);

      if (error) {
        toast.error('Erro ao criar aula');
        console.error(error);
      } else {
        toast.success('Aula criada');
        fetchAulas(aulaForm.travessia_id);
      }
    }
    setAulaDialogOpen(false);
  };

  // Delete
  const openDeleteDialog = (type: 'portal' | 'aula', id: string, title: string) => {
    setDeleteTarget({ type, id, title });
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'portal') {
      // First delete all associated aulas
      const { error: aulasError } = await supabase
        .from('conteudo_aulas')
        .delete()
        .eq('travessia_id', deleteTarget.id);

      if (aulasError) {
        toast.error('Erro ao excluir aulas do portal');
        console.error(aulasError);
        return;
      }

      const { error } = await supabase
        .from('conteudo_travessias')
        .delete()
        .eq('id', deleteTarget.id);

      if (error) {
        toast.error('Erro ao excluir portal');
        console.error(error);
      } else {
        toast.success('Portal excluído');
        fetchPortais();
      }
    } else {
      const aula = Object.values(aulas).flat().find((a) => a.id === deleteTarget.id);
      const { error } = await supabase
        .from('conteudo_aulas')
        .delete()
        .eq('id', deleteTarget.id);

      if (error) {
        toast.error('Erro ao excluir aula');
        console.error(error);
      } else {
        toast.success('Aula excluída');
        if (aula) fetchAulas(aula.travessia_id);
      }
    }
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  // Toggle publicado inline
  const togglePortalPublicado = async (portal: Portal) => {
    const { error } = await supabase
      .from('conteudo_travessias')
      .update({ publicado: !portal.publicado })
      .eq('id', portal.id);

    if (error) {
      toast.error('Erro ao atualizar status');
    } else {
      setPortais((prev) =>
        prev.map((p) => (p.id === portal.id ? { ...p, publicado: !p.publicado } : p))
      );
    }
  };

  const toggleAulaPublicado = async (aula: Aula) => {
    const { error } = await supabase
      .from('conteudo_aulas')
      .update({ publicado: !aula.publicado })
      .eq('id', aula.id);

    if (error) {
      toast.error('Erro ao atualizar status');
    } else {
      setAulas((prev) => ({
        ...prev,
        [aula.travessia_id]: prev[aula.travessia_id].map((a) =>
          a.id === aula.id ? { ...a, publicado: !a.publicado } : a
        ),
      }));
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Carregando...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Gestão de Conteúdo</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie Portais e Aulas da formação
          </p>
        </div>
        <Button onClick={() => openPortalDialog()} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Portal
        </Button>
      </div>

      {/* Portais List */}
      {portais.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Nenhum portal cadastrado.</p>
            <Button onClick={() => openPortalDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Criar primeiro Portal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {portais.map((portal) => {
            const isExpanded = expandedPortal === portal.id;
            const portalAulas = aulas[portal.id] || [];
            const linkedSala = portal.sala_id ? salas.find((s) => s.id === portal.sala_id) : null;

            return (
              <Card key={portal.id} className={!portal.publicado ? 'opacity-60' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className="flex items-center gap-3 cursor-pointer flex-1"
                      onClick={() => handleExpandPortal(portal.id)}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                      )}
                      {portal.capa_url ? (
                        <img
                          src={portal.capa_url}
                          alt={portal.titulo}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <BookOpen className="w-6 h-6 text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CardTitle className="text-base">{portal.titulo}</CardTitle>
                          <Badge variant={portal.publicado ? 'default' : 'secondary'} className="text-xs">
                            {portal.publicado ? 'Publicado' : 'Rascunho'}
                          </Badge>
                        </div>
                        {portal.subtitulo && (
                          <p className="text-sm text-muted-foreground">{portal.subtitulo}</p>
                        )}
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                          <span>Ordem: {portal.ordem}</span>
                          <span>•</span>
                          <span>{PORTAL_LABELS[portal.portal_minimo]}</span>
                          {linkedSala && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <DoorOpen className="w-3 h-3" />
                                {linkedSala.nome_exibicao}
                              </span>
                            </>
                          )}
                          <span>•</span>
                          <span>{portalAulas.length} aulas</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePortalPublicado(portal);
                        }}
                        title={portal.publicado ? 'Despublicar' : 'Publicar'}
                      >
                        {portal.publicado ? (
                          <Eye className="w-4 h-4 text-primary" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          openPortalDialog(portal);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteDialog('portal', portal.id, portal.titulo);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-4 border-t space-y-6">
                    {/* Ferramentas Vinculadas ao Portal */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <Wrench className="w-4 h-4" />
                          Ferramentas do Portal
                        </h4>
                      </div>
                      {(() => {
                        const portalFerramentas = getFerramentasByPortal(portal.id);
                        const availableFerramentas = getAvailableFerramentas();
                        
                        return (
                          <div className="space-y-3">
                            {portalFerramentas.length === 0 ? (
                              <p className="text-sm text-muted-foreground text-center py-4 border rounded-lg bg-muted/20">
                                Nenhuma ferramenta vinculada a este portal.
                              </p>
                            ) : (
                              <div className="grid gap-2">
                                {portalFerramentas.map((f) => (
                                  <div
                                    key={f.id}
                                    className={`flex items-center gap-3 p-3 border rounded-lg ${
                                      !f.ativa ? 'opacity-50' : ''
                                    }`}
                                  >
                                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                                      <Wrench className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm">{f.ferramenta_nome}</p>
                                      {f.ferramenta_descricao && (
                                        <p className="text-xs text-muted-foreground truncate">
                                          {f.ferramenta_descricao}
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                      <Badge variant={f.ativa ? 'default' : 'secondary'} className="text-xs">
                                        {f.ativa ? 'Ativa' : 'Inativa'}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">#{f.ordem}</span>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeFerramentaFromPortal(f.id)}
                                        title="Remover do portal"
                                      >
                                        <Trash2 className="w-3 h-3 text-destructive" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {/* Add ferramenta dropdown */}
                            {availableFerramentas.length > 0 && (
                              <div className="flex items-center gap-2 pt-2">
                                <Select
                                  onValueChange={(value) => addFerramentaToPortal(value, portal.id)}
                                >
                                  <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Adicionar ferramenta..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {availableFerramentas.map((f) => (
                                      <SelectItem key={f.id} value={f.id}>
                                        {f.ferramenta_nome}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    <Separator />

                    {/* Aulas */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-sm">Aulas deste Portal</h4>
                        <Button size="sm" variant="outline" onClick={() => openAulaDialog(portal.id)} className="gap-1">
                          <Plus className="w-3 h-3" />
                          Nova Aula
                        </Button>
                      </div>

                      {portalAulas.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-6">
                          Nenhuma aula cadastrada neste portal.
                        </p>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12">Ordem</TableHead>
                              <TableHead>Título</TableHead>
                              <TableHead>Portal</TableHead>
                              <TableHead className="w-24">Conteúdo</TableHead>
                              <TableHead className="w-20">Status</TableHead>
                              <TableHead className="w-24">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {portalAulas.map((aula) => (
                              <TableRow key={aula.id} className={!aula.publicado ? 'opacity-60' : ''}>
                                <TableCell>{aula.ordem}</TableCell>
                                <TableCell>
                                  <div>
                                    <p className="font-medium">{aula.titulo}</p>
                                    {aula.descricao_curta && (
                                      <p className="text-xs text-muted-foreground truncate max-w-xs">
                                        {aula.descricao_curta}
                                      </p>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm">{PORTAL_LABELS[aula.portal_minimo]}</TableCell>
                                <TableCell>
                                  <div className="flex gap-1" title="Tipos de conteúdo">
                                    {aula.video_url && <Video className="w-4 h-4 text-red-500" />}
                                    {aula.audio_url && <Music className="w-4 h-4 text-purple-500" />}
                                    {aula.pdf_url && <FileText className="w-4 h-4 text-orange-500" />}
                                    {aula.texto_aula && <Type className="w-4 h-4 text-blue-500" />}
                                    {!aula.video_url && !aula.audio_url && !aula.pdf_url && !aula.texto_aula && (
                                      <span className="text-muted-foreground text-xs">—</span>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={aula.publicado ? 'default' : 'secondary'} className="text-xs">
                                    {aula.publicado ? 'Pub.' : 'Rasc.'}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => toggleAulaPublicado(aula)}
                                      title={aula.publicado ? 'Despublicar' : 'Publicar'}
                                    >
                                      {aula.publicado ? (
                                        <Eye className="w-3 h-3 text-primary" />
                                      ) : (
                                        <EyeOff className="w-3 h-3" />
                                      )}
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => openAulaDialog(portal.id, aula)}>
                                      <Pencil className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => openDeleteDialog('aula', aula.id, aula.titulo)}
                                    >
                                      <Trash2 className="w-3 h-3 text-destructive" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Portal Dialog */}
      <Dialog open={portalDialogOpen} onOpenChange={setPortalDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPortal ? 'Editar Portal' : 'Novo Portal'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Título *</Label>
              <Input
                value={portalForm.titulo}
                onChange={(e) => setPortalForm({ ...portalForm, titulo: e.target.value })}
                placeholder="Ex: Introdução ao Método"
              />
            </div>
            <div>
              <Label>Subtítulo</Label>
              <Input
                value={portalForm.subtitulo}
                onChange={(e) => setPortalForm({ ...portalForm, subtitulo: e.target.value })}
                placeholder="Ex: Os fundamentos da jornada"
              />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea
                value={portalForm.descricao}
                onChange={(e) => setPortalForm({ ...portalForm, descricao: e.target.value })}
                placeholder="Descreva o portal..."
                rows={3}
              />
            </div>
            <ImageUpload
              value={portalForm.capa_url}
              onChange={(url) => setPortalForm({ ...portalForm, capa_url: url })}
              folder="portais"
              label="Imagem de Capa"
              aspectRatio="video"
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ordem</Label>
                <Input
                  type="number"
                  value={portalForm.ordem}
                  onChange={(e) => setPortalForm({ ...portalForm, ordem: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>Portal Mínimo</Label>
                <Select
                  value={portalForm.portal_minimo}
                  onValueChange={(value: PortalType) => setPortalForm({ ...portalForm, portal_minimo: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visitante">Visitante</SelectItem>
                    <SelectItem value="pre_iniciada">Pré-Iniciada</SelectItem>
                    <SelectItem value="iniciada">Iniciada ORÁCULA</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Sala (opcional)</Label>
              <Select
                value={portalForm.sala_id || 'none'}
                onValueChange={(value) => setPortalForm({ ...portalForm, sala_id: value === 'none' ? null : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sem sala vinculada" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem sala vinculada</SelectItem>
                  {salas.map((sala) => (
                    <SelectItem key={sala.id} value={sala.id}>
                      {sala.nome_exibicao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Se vinculada, usuária precisa ter acesso à sala para ver o portal.
              </p>
            </div>
            <div className="flex items-center justify-between border rounded-lg p-3">
              <div>
                <Label className="text-base">Publicado</Label>
                <p className="text-xs text-muted-foreground">Conteúdo visível para usuárias</p>
              </div>
              <Switch
                checked={portalForm.publicado}
                onCheckedChange={(checked) => setPortalForm({ ...portalForm, publicado: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPortalDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={savePortal}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Aula Dialog */}
      <Dialog open={aulaDialogOpen} onOpenChange={setAulaDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAula ? 'Editar Aula' : 'Nova Aula'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Informações Básicas */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Informações Básicas
              </h4>
              <div>
                <Label>Título *</Label>
                <Input
                  value={aulaForm.titulo}
                  onChange={(e) => setAulaForm({ ...aulaForm, titulo: e.target.value })}
                  placeholder="Ex: Aula 1 - Fundamentos"
                />
              </div>
              <div>
                <Label>Descrição Curta</Label>
                <Textarea
                  value={aulaForm.descricao_curta}
                  onChange={(e) => setAulaForm({ ...aulaForm, descricao_curta: e.target.value })}
                  placeholder="Breve descrição da aula..."
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Ordem</Label>
                  <Input
                    type="number"
                    value={aulaForm.ordem}
                    onChange={(e) => setAulaForm({ ...aulaForm, ordem: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Portal Mínimo</Label>
                  <Select
                    value={aulaForm.portal_minimo}
                    onValueChange={(value: PortalType) => setAulaForm({ ...aulaForm, portal_minimo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visitante">Visitante</SelectItem>
                      <SelectItem value="pre_iniciada">Pré-Iniciada</SelectItem>
                      <SelectItem value="iniciada">Iniciada ORÁCULA</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between border rounded-lg p-3">
                <div>
                  <Label className="text-base">Publicado</Label>
                  <p className="text-xs text-muted-foreground">Aula visível para usuárias</p>
                </div>
                <Switch
                  checked={aulaForm.publicado}
                  onCheckedChange={(checked) => setAulaForm({ ...aulaForm, publicado: checked })}
                />
              </div>
            </div>

            <Separator />

            {/* Conteúdo Escrito */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <Type className="w-4 h-4" />
                Conteúdo Markdown
              </h4>
              <div>
                <Textarea
                  value={aulaForm.texto_aula}
                  onChange={(e) => setAulaForm({ ...aulaForm, texto_aula: e.target.value })}
                  placeholder="Escreva o conteúdo principal da aula aqui. Suporta Markdown..."
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>
            </div>

            <Separator />

            {/* Vídeo */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <Video className="w-4 h-4" />
                Vídeo Embed
              </h4>
              <div>
                <Input
                  value={aulaForm.video_url}
                  onChange={(e) => setAulaForm({ ...aulaForm, video_url: e.target.value })}
                  placeholder="https://youtube.com/embed/... ou https://player.vimeo.com/..."
                />
                <p className="text-xs text-muted-foreground mt-1">Cole a URL de embed do YouTube ou Vimeo</p>
              </div>
            </div>

            <Separator />

            {/* Áudio */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <Music className="w-4 h-4" />
                Áudio
              </h4>
              <div>
                <Input
                  value={aulaForm.audio_url}
                  onChange={(e) => setAulaForm({ ...aulaForm, audio_url: e.target.value })}
                  placeholder="https://soundcloud.com/... ou URL de MP3"
                />
              </div>
            </div>

            <Separator />

            {/* Materiais */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Materiais
              </h4>
              <div>
                <Label>URL do PDF</Label>
                <Input
                  value={aulaForm.pdf_url}
                  onChange={(e) => setAulaForm({ ...aulaForm, pdf_url: e.target.value })}
                  placeholder="https://drive.google.com/... ou link direto para PDF"
                />
              </div>
              <div>
                <Label>URL de Materiais Extras</Label>
                <Input
                  value={aulaForm.materiais_url}
                  onChange={(e) => setAulaForm({ ...aulaForm, materiais_url: e.target.value })}
                  placeholder="Link para pasta com materiais complementares"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAulaDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveAula}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.type === 'portal'
                ? `Excluir o portal "${deleteTarget?.title}" e todas as suas aulas? Esta ação não pode ser desfeita.`
                : `Excluir a aula "${deleteTarget?.title}"? Esta ação não pode ser desfeita.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
