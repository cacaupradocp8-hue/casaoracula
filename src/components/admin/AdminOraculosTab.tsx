import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Eye,
  EyeOff,
  Sparkles,
  Layers,
  CreditCard,
  Settings,
  Copy
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { OracleDeck, OracleCard, OracleSpread, OracleCategory, OracleContentStatus } from '@/types/oracle';

const PORTAL_LABELS: Record<string, string> = {
  visitante: 'Visitante',
  pre_iniciada: 'Pré-Iniciada',
  iniciada: 'Iniciada',
  oracula: 'Orácula',
  admin: 'Admin',
};

const STATUS_LABELS: Record<OracleContentStatus, string> = {
  draft: 'Rascunho',
  published: 'Publicado',
  archived: 'Arquivado',
};

export function AdminOraculosTab() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [oracles, setOracles] = useState<OracleDeck[]>([]);
  const [cards, setCards] = useState<OracleCard[]>([]);
  const [spreads, setSpreads] = useState<OracleSpread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('oracles');

  // Oracle form state
  const [editingOracle, setEditingOracle] = useState<OracleDeck | null>(null);
  const [oracleDialogOpen, setOracleDialogOpen] = useState(false);

  // Card form state
  const [editingCard, setEditingCard] = useState<OracleCard | null>(null);
  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const [selectedOracleId, setSelectedOracleId] = useState<string>('');

  // Spread form state
  const [editingSpread, setEditingSpread] = useState<OracleSpread | null>(null);
  const [spreadDialogOpen, setSpreadDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [oraclesRes, cardsRes, spreadsRes] = await Promise.all([
        supabase.from('oracle_decks').select('*').order('ordem'),
        supabase.from('oracle_cards').select('*').order('ordem'),
        supabase.from('oracle_spreads').select('*').order('ordem'),
      ]);

      if (oraclesRes.data) setOracles(oraclesRes.data as unknown as OracleDeck[]);
      if (cardsRes.data) setCards(cardsRes.data as unknown as OracleCard[]);
      if (spreadsRes.data) setSpreads(spreadsRes.data as unknown as OracleSpread[]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({ title: 'Erro ao carregar dados', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // Oracle CRUD
  const handleSaveOracle = async (formData: FormData) => {
    const slug = (formData.get('slug') as string || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const minPortal = formData.get('minimum_portal') as string;
    
    const oracleData: any = {
      name: formData.get('name') as string,
      slug: slug,
      subtitle: formData.get('subtitle') as string || null,
      description: formData.get('description') as string || null,
      cover_image_url: formData.get('cover_image_url') as string || null,
      minimum_portal: minPortal as 'visitante' | 'pre_iniciada' | 'iniciada' | 'admin',
      status: formData.get('status') as OracleContentStatus,
      disclaimer_text: formData.get('disclaimer_text') as string || null,
      lock_message_title: formData.get('lock_message_title') as string || 'Oráculo Bloqueado',
      lock_message_body: formData.get('lock_message_body') as string || null,
      upgrade_cta_text: formData.get('upgrade_cta_text') as string || 'Quero me inscrever',
      upgrade_cta_route: formData.get('upgrade_cta_route') as string || '/welcome',
      show_locked_teaser: formData.get('show_locked_teaser') === 'true',
      enable_journal: formData.get('enable_journal') === 'true',
      enable_professional_mode: formData.get('enable_professional_mode') === 'true',
      is_sensitive_mode_available: formData.get('is_sensitive_mode_available') === 'true',
      created_by: user?.id || null,
    };

    try {
      if (editingOracle) {
        const { error } = await supabase
          .from('oracle_decks')
          .update(oracleData)
          .eq('id', editingOracle.id);
        if (error) throw error;
        toast({ title: 'Oráculo atualizado!' });
      } else {
        const { error } = await supabase.from('oracle_decks').insert(oracleData);
        if (error) throw error;
        toast({ title: 'Oráculo criado!' });
      }
      fetchData();
      setOracleDialogOpen(false);
      setEditingOracle(null);
    } catch (error: any) {
      console.error('Error saving oracle:', error);
      toast({ 
        title: 'Erro ao salvar oráculo', 
        description: error.message?.includes('duplicate') ? 'Slug já existe' : error.message,
        variant: 'destructive' 
      });
    }
  };

  const handleDeleteOracle = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este oráculo? Todas as cartas e tiragens serão excluídas.')) return;
    
    try {
      const { error } = await supabase.from('oracle_decks').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Oráculo excluído!' });
      fetchData();
    } catch (error) {
      console.error('Error deleting oracle:', error);
      toast({ title: 'Erro ao excluir oráculo', variant: 'destructive' });
    }
  };

  const toggleOracleStatus = async (oracle: OracleDeck) => {
    const newStatus = oracle.status === 'published' ? 'draft' : 'published';
    try {
      const { error } = await supabase
        .from('oracle_decks')
        .update({ status: newStatus })
        .eq('id', oracle.id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error toggling status:', error);
      toast({ title: 'Erro ao alterar status', variant: 'destructive' });
    }
  };

  // Card CRUD
  const handleSaveCard = async (formData: FormData) => {
    const keywordsRaw = formData.get('keywords') as string || '';
    const questionsRaw = formData.get('reflection_questions') as string || '';
    
    const cardData = {
      oracle_id: formData.get('oracle_id') as string,
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string || null,
      main_image_url: formData.get('main_image_url') as string || null,
      short_message: formData.get('short_message') as string || null,
      deep_reading: formData.get('deep_reading') as string || null,
      polarity_light_text: formData.get('polarity_light_text') as string || null,
      polarity_shadow_text: formData.get('polarity_shadow_text') as string || null,
      ritual_text: formData.get('ritual_text') as string || null,
      care_notes: formData.get('care_notes') as string || null,
      keywords_json: keywordsRaw.split(',').map(k => k.trim()).filter(Boolean),
      reflection_questions_json: questionsRaw.split('\n').map(q => q.trim()).filter(Boolean),
      level: formData.get('level') as OracleCard['level'],
      status: formData.get('status') as OracleContentStatus,
      is_sensitive: formData.get('is_sensitive') === 'true',
    };

    try {
      if (editingCard) {
        const { error } = await supabase
          .from('oracle_cards')
          .update(cardData)
          .eq('id', editingCard.id);
        if (error) throw error;
        toast({ title: 'Carta atualizada!' });
      } else {
        const { error } = await supabase.from('oracle_cards').insert(cardData);
        if (error) throw error;
        toast({ title: 'Carta criada!' });
      }
      fetchData();
      setCardDialogOpen(false);
      setEditingCard(null);
    } catch (error) {
      console.error('Error saving card:', error);
      toast({ title: 'Erro ao salvar carta', variant: 'destructive' });
    }
  };

  const handleDeleteCard = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta carta?')) return;
    
    try {
      const { error } = await supabase.from('oracle_cards').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Carta excluída!' });
      fetchData();
    } catch (error) {
      console.error('Error deleting card:', error);
      toast({ title: 'Erro ao excluir carta', variant: 'destructive' });
    }
  };

  // Spread CRUD
  const handleSaveSpread = async (formData: FormData) => {
    const positionsRaw = formData.get('positions') as string || '';
    const positions = positionsRaw.split('\n').map((line, index) => {
      const [name, meaning] = line.split('|').map(s => s.trim());
      return { name: name || `Posição ${index + 1}`, meaning: meaning || '', order: index };
    }).filter(p => p.name);

    const spreadData = {
      oracle_id: formData.get('oracle_id') as string,
      name: formData.get('name') as string,
      description: formData.get('description') as string || null,
      number_of_cards: parseInt(formData.get('number_of_cards') as string) || 1,
      layout_type: formData.get('layout_type') as OracleSpread['layout_type'],
      positions_json: positions,
      opening_text: formData.get('opening_text') as string || null,
      closing_text: formData.get('closing_text') as string || null,
      status: formData.get('status') as OracleContentStatus,
    };

    try {
      if (editingSpread) {
        const { error } = await supabase
          .from('oracle_spreads')
          .update(spreadData)
          .eq('id', editingSpread.id);
        if (error) throw error;
        toast({ title: 'Tiragem atualizada!' });
      } else {
        const { error } = await supabase.from('oracle_spreads').insert(spreadData);
        if (error) throw error;
        toast({ title: 'Tiragem criada!' });
      }
      fetchData();
      setSpreadDialogOpen(false);
      setEditingSpread(null);
    } catch (error) {
      console.error('Error saving spread:', error);
      toast({ title: 'Erro ao salvar tiragem', variant: 'destructive' });
    }
  };

  const handleDeleteSpread = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta tiragem?')) return;
    
    try {
      const { error } = await supabase.from('oracle_spreads').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Tiragem excluída!' });
      fetchData();
    } catch (error) {
      console.error('Error deleting spread:', error);
      toast({ title: 'Erro ao excluir tiragem', variant: 'destructive' });
    }
  };

  const getOracleCards = (oracleId: string) => cards.filter(c => c.oracle_id === oracleId);
  const getOracleSpreads = (oracleId: string) => spreads.filter(s => s.oracle_id === oracleId);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{oracles.length}</p>
                <p className="text-sm text-muted-foreground">Oráculos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">{cards.length}</p>
                <p className="text-sm text-muted-foreground">Cartas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Layers className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{spreads.length}</p>
                <p className="text-sm text-muted-foreground">Tiragens</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{oracles.filter(o => o.status === 'published').length}</p>
                <p className="text-sm text-muted-foreground">Publicados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="oracles">Oráculos</TabsTrigger>
          <TabsTrigger value="cards">Cartas</TabsTrigger>
          <TabsTrigger value="spreads">Tiragens</TabsTrigger>
        </TabsList>

        {/* Oracles Tab */}
        <TabsContent value="oracles" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Gerenciar Oráculos</h3>
            <Dialog open={oracleDialogOpen} onOpenChange={setOracleDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingOracle(null)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Oráculo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>{editingOracle ? 'Editar Oráculo' : 'Novo Oráculo'}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh]">
                  <form onSubmit={e => { e.preventDefault(); handleSaveOracle(new FormData(e.currentTarget)); }} className="space-y-4 p-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="name">Nome *</Label>
                        <Input id="name" name="name" defaultValue={editingOracle?.name} required />
                      </div>
                      <div>
                        <Label htmlFor="slug">Slug (URL) *</Label>
                        <Input id="slug" name="slug" defaultValue={editingOracle?.slug} placeholder="oraculo-exemplo" required />
                      </div>
                      <div>
                        <Label htmlFor="subtitle">Subtítulo</Label>
                        <Input id="subtitle" name="subtitle" defaultValue={editingOracle?.subtitle || ''} />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea id="description" name="description" defaultValue={editingOracle?.description || ''} />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="cover_image_url">URL da Capa</Label>
                        <Input id="cover_image_url" name="cover_image_url" defaultValue={editingOracle?.cover_image_url || ''} placeholder="https://..." />
                      </div>
                      <div>
                        <Label htmlFor="minimum_portal">Portal Mínimo</Label>
                        <Select name="minimum_portal" defaultValue={editingOracle?.minimum_portal || 'pre_iniciada'}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {Object.entries(PORTAL_LABELS).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue={editingOracle?.status || 'draft'}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {Object.entries(STATUS_LABELS).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="disclaimer_text">Aviso Legal</Label>
                        <Textarea id="disclaimer_text" name="disclaimer_text" defaultValue={editingOracle?.disclaimer_text || ''} />
                      </div>
                      
                      {/* Lock Screen Settings */}
                      <div className="col-span-2 border-t pt-4 mt-2">
                        <h4 className="font-medium mb-3">Tela de Bloqueio</h4>
                      </div>
                      <div>
                        <Label htmlFor="lock_message_title">Título do Bloqueio</Label>
                        <Input id="lock_message_title" name="lock_message_title" defaultValue={editingOracle?.lock_message_title || 'Oráculo Bloqueado'} />
                      </div>
                      <div>
                        <Label htmlFor="upgrade_cta_text">Texto do CTA</Label>
                        <Input id="upgrade_cta_text" name="upgrade_cta_text" defaultValue={editingOracle?.upgrade_cta_text || 'Quero me inscrever'} />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="lock_message_body">Mensagem do Bloqueio</Label>
                        <Textarea id="lock_message_body" name="lock_message_body" defaultValue={editingOracle?.lock_message_body || ''} />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="upgrade_cta_route">Rota do CTA</Label>
                        <Input id="upgrade_cta_route" name="upgrade_cta_route" defaultValue={editingOracle?.upgrade_cta_route || '/welcome'} />
                      </div>

                      {/* Toggles */}
                      <div className="col-span-2 border-t pt-4 mt-2">
                        <h4 className="font-medium mb-3">Configurações</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <Switch id="show_locked_teaser" name="show_locked_teaser" defaultChecked={editingOracle?.show_locked_teaser ?? true} value="true" />
                            <Label htmlFor="show_locked_teaser">Mostrar teaser bloqueado</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch id="enable_journal" name="enable_journal" defaultChecked={editingOracle?.enable_journal ?? true} value="true" />
                            <Label htmlFor="enable_journal">Habilitar histórico</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch id="enable_professional_mode" name="enable_professional_mode" defaultChecked={editingOracle?.enable_professional_mode ?? false} value="true" />
                            <Label htmlFor="enable_professional_mode">Modo profissional</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch id="is_sensitive_mode_available" name="is_sensitive_mode_available" defaultChecked={editingOracle?.is_sensitive_mode_available ?? false} value="true" />
                            <Label htmlFor="is_sensitive_mode_available">Modo sensível disponível</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setOracleDialogOpen(false)}>Cancelar</Button>
                      <Button type="submit">Salvar</Button>
                    </div>
                  </form>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Oráculo</TableHead>
                <TableHead>Portal</TableHead>
                <TableHead>Cartas</TableHead>
                <TableHead>Tiragens</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[120px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {oracles.map(oracle => (
                <TableRow key={oracle.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {oracle.cover_image_url ? (
                        <img src={oracle.cover_image_url} alt="" className="w-10 h-10 object-cover rounded" />
                      ) : (
                        <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{oracle.name}</p>
                        <p className="text-xs text-muted-foreground">/{oracle.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{PORTAL_LABELS[oracle.minimum_portal]}</Badge>
                  </TableCell>
                  <TableCell>{getOracleCards(oracle.id).length}</TableCell>
                  <TableCell>{getOracleSpreads(oracle.id).length}</TableCell>
                  <TableCell>
                    <Badge 
                      className={oracle.status === 'published' ? 'bg-green-500/20 text-green-400' : ''}
                      variant={oracle.status === 'published' ? 'default' : 'secondary'}
                    >
                      {STATUS_LABELS[oracle.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => toggleOracleStatus(oracle)}
                        title={oracle.status === 'published' ? 'Despublicar' : 'Publicar'}
                      >
                        {oracle.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => { setEditingOracle(oracle); setOracleDialogOpen(true); }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => handleDeleteOracle(oracle.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Cards Tab */}
        <TabsContent value="cards" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold">Gerenciar Cartas</h3>
              <Select value={selectedOracleId} onValueChange={setSelectedOracleId}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Filtrar por oráculo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os oráculos</SelectItem>
                  {oracles.map(o => (
                    <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Dialog open={cardDialogOpen} onOpenChange={setCardDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingCard(null)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Carta
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>{editingCard ? 'Editar Carta' : 'Nova Carta'}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh]">
                  <form onSubmit={e => { e.preventDefault(); handleSaveCard(new FormData(e.currentTarget)); }} className="space-y-4 p-1">
                    <div>
                      <Label htmlFor="oracle_id">Oráculo *</Label>
                      <Select name="oracle_id" defaultValue={editingCard?.oracle_id || selectedOracleId || ''} required>
                        <SelectTrigger><SelectValue placeholder="Selecione o oráculo" /></SelectTrigger>
                        <SelectContent>
                          {oracles.map(o => (
                            <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Título *</Label>
                        <Input id="title" name="title" defaultValue={editingCard?.title} required />
                      </div>
                      <div>
                        <Label htmlFor="subtitle">Subtítulo</Label>
                        <Input id="subtitle" name="subtitle" defaultValue={editingCard?.subtitle || ''} />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="main_image_url">URL da Imagem</Label>
                        <Input id="main_image_url" name="main_image_url" defaultValue={editingCard?.main_image_url || ''} />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="short_message">Mensagem Curta</Label>
                        <Textarea id="short_message" name="short_message" defaultValue={editingCard?.short_message || ''} />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="deep_reading">Leitura Profunda</Label>
                        <Textarea id="deep_reading" name="deep_reading" rows={4} defaultValue={editingCard?.deep_reading || ''} />
                      </div>
                      <div>
                        <Label htmlFor="polarity_light_text">Aspecto Luz</Label>
                        <Textarea id="polarity_light_text" name="polarity_light_text" defaultValue={editingCard?.polarity_light_text || ''} />
                      </div>
                      <div>
                        <Label htmlFor="polarity_shadow_text">Aspecto Sombra</Label>
                        <Textarea id="polarity_shadow_text" name="polarity_shadow_text" defaultValue={editingCard?.polarity_shadow_text || ''} />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="reflection_questions">Perguntas para Reflexão (uma por linha)</Label>
                        <Textarea 
                          id="reflection_questions" 
                          name="reflection_questions" 
                          rows={3}
                          defaultValue={editingCard?.reflection_questions_json?.join('\n') || ''} 
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="ritual_text">Prática/Ritual</Label>
                        <Textarea id="ritual_text" name="ritual_text" defaultValue={editingCard?.ritual_text || ''} />
                      </div>
                      <div>
                        <Label htmlFor="keywords">Palavras-chave (separadas por vírgula)</Label>
                        <Input id="keywords" name="keywords" defaultValue={editingCard?.keywords_json?.join(', ') || ''} />
                      </div>
                      <div>
                        <Label htmlFor="level">Nível</Label>
                        <Select name="level" defaultValue={editingCard?.level || 'beginner'}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Iniciante</SelectItem>
                            <SelectItem value="intermediate">Intermediário</SelectItem>
                            <SelectItem value="advanced">Avançado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue={editingCard?.status || 'draft'}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {Object.entries(STATUS_LABELS).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch id="is_sensitive" name="is_sensitive" defaultChecked={editingCard?.is_sensitive ?? false} value="true" />
                        <Label htmlFor="is_sensitive">Conteúdo sensível</Label>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setCardDialogOpen(false)}>Cancelar</Button>
                      <Button type="submit">Salvar</Button>
                    </div>
                  </form>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Carta</TableHead>
                <TableHead>Oráculo</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cards
                .filter(c => !selectedOracleId || selectedOracleId === 'all' || c.oracle_id === selectedOracleId)
                .map(card => (
                  <TableRow key={card.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {card.main_image_url ? (
                          <img src={card.main_image_url} alt="" className="w-10 h-14 object-cover rounded" />
                        ) : (
                          <div className="w-10 h-14 bg-muted rounded flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{card.title}</p>
                          {card.subtitle && <p className="text-xs text-muted-foreground">{card.subtitle}</p>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {oracles.find(o => o.id === card.oracle_id)?.name || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {card.level === 'beginner' ? 'Iniciante' : card.level === 'intermediate' ? 'Intermediário' : 'Avançado'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={card.status === 'published' ? 'bg-green-500/20 text-green-400' : ''}
                        variant={card.status === 'published' ? 'default' : 'secondary'}
                      >
                        {STATUS_LABELS[card.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          size="icon" 
                          variant="ghost"
                          onClick={() => { setEditingCard(card); setCardDialogOpen(true); }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost"
                          onClick={() => handleDeleteCard(card.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Spreads Tab */}
        <TabsContent value="spreads" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Gerenciar Tiragens</h3>
            <Dialog open={spreadDialogOpen} onOpenChange={setSpreadDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingSpread(null)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Tiragem
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>{editingSpread ? 'Editar Tiragem' : 'Nova Tiragem'}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh]">
                  <form onSubmit={e => { e.preventDefault(); handleSaveSpread(new FormData(e.currentTarget)); }} className="space-y-4 p-1">
                    <div>
                      <Label htmlFor="oracle_id">Oráculo *</Label>
                      <Select name="oracle_id" defaultValue={editingSpread?.oracle_id || ''} required>
                        <SelectTrigger><SelectValue placeholder="Selecione o oráculo" /></SelectTrigger>
                        <SelectContent>
                          {oracles.map(o => (
                            <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nome *</Label>
                        <Input id="name" name="name" defaultValue={editingSpread?.name} required />
                      </div>
                      <div>
                        <Label htmlFor="number_of_cards">Número de Cartas *</Label>
                        <Input id="number_of_cards" name="number_of_cards" type="number" min="1" defaultValue={editingSpread?.number_of_cards || 1} required />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea id="description" name="description" defaultValue={editingSpread?.description || ''} />
                      </div>
                      <div>
                        <Label htmlFor="layout_type">Layout</Label>
                        <Select name="layout_type" defaultValue={editingSpread?.layout_type || 'line'}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="line">Linha</SelectItem>
                            <SelectItem value="cross">Cruz</SelectItem>
                            <SelectItem value="circle">Círculo</SelectItem>
                            <SelectItem value="spiral">Espiral</SelectItem>
                            <SelectItem value="custom">Personalizado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue={editingSpread?.status || 'draft'}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {Object.entries(STATUS_LABELS).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="positions">Posições (formato: nome|significado, uma por linha)</Label>
                        <Textarea 
                          id="positions" 
                          name="positions" 
                          rows={4}
                          placeholder="Presente|A situação atual&#10;Desafio|O obstáculo a superar&#10;Conselho|A orientação do oráculo"
                          defaultValue={editingSpread?.positions_json?.map(p => `${p.name}|${p.meaning}`).join('\n') || ''} 
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="opening_text">Texto de Abertura</Label>
                        <Textarea id="opening_text" name="opening_text" defaultValue={editingSpread?.opening_text || ''} />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="closing_text">Texto de Encerramento</Label>
                        <Textarea id="closing_text" name="closing_text" defaultValue={editingSpread?.closing_text || ''} />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setSpreadDialogOpen(false)}>Cancelar</Button>
                      <Button type="submit">Salvar</Button>
                    </div>
                  </form>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tiragem</TableHead>
                <TableHead>Oráculo</TableHead>
                <TableHead>Cartas</TableHead>
                <TableHead>Layout</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spreads.map(spread => (
                <TableRow key={spread.id}>
                  <TableCell>
                    <p className="font-medium">{spread.name}</p>
                    {spread.description && <p className="text-xs text-muted-foreground">{spread.description}</p>}
                  </TableCell>
                  <TableCell>
                    {oracles.find(o => o.id === spread.oracle_id)?.name || '-'}
                  </TableCell>
                  <TableCell>{spread.number_of_cards}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{spread.layout_type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={spread.status === 'published' ? 'bg-green-500/20 text-green-400' : ''}
                      variant={spread.status === 'published' ? 'default' : 'secondary'}
                    >
                      {STATUS_LABELS[spread.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => { setEditingSpread(spread); setSpreadDialogOpen(true); }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => handleDeleteSpread(spread.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
