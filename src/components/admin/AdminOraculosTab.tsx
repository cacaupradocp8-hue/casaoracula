import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Eye,
  EyeOff,
  Sparkles,
  Layers,
  CreditCard,
  ArrowRight,
  AlertTriangle,
  Info,
  RotateCcw,
} from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { OracleDeck, OracleCard as OracleCardData, OracleSpread, OracleContentStatus } from '@/types/oracle';
import { OracleCard as OracleCardPreview } from '@/components/oracle/OracleCard';

const PORTAL_LABELS: Record<string, string> = {
  visitante: 'Visitante',
  mentorada: 'Mentorada',
  aluna_formacao: 'Aluna Formação',
  assinante: 'Assinante',
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
  const [cards, setCards] = useState<OracleCardData[]>([]);
  const [spreads, setSpreads] = useState<OracleSpread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('oracles');

  // Oracle form state
  const [editingOracle, setEditingOracle] = useState<OracleDeck | null>(null);
  const [oracleDialogOpen, setOracleDialogOpen] = useState(false);
  const [oracleCoverUrl, setOracleCoverUrl] = useState('');
  const [oracleCardBackUrl, setOracleCardBackUrl] = useState('');

  // Card form state
  const [editingCard, setEditingCard] = useState<OracleCardData | null>(null);
  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const [selectedOracleId, setSelectedOracleId] = useState<string>('');
  const [cardImageUrl, setCardImageUrl] = useState('');
  const [cardBackImageUrl, setCardBackImageUrl] = useState('');
  const [previewFlipped, setPreviewFlipped] = useState(false);

  // Spread form state
  const [editingSpread, setEditingSpread] = useState<OracleSpread | null>(null);
  const [spreadDialogOpen, setSpreadDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // Reset card form state when dialog opens/closes
  useEffect(() => {
    if (cardDialogOpen) {
      setCardImageUrl(editingCard?.main_image_url || '');
      setCardBackImageUrl(editingCard?.back_image_url || '');
      setPreviewFlipped(false);
    }
  }, [cardDialogOpen, editingCard]);

  // Reset oracle form when dialog opens/closes
  useEffect(() => {
    if (oracleDialogOpen) {
      setOracleCoverUrl(editingOracle?.cover_image_url || '');
      setOracleCardBackUrl(editingOracle?.theme_json?.cardBackImage || '');
    }
  }, [oracleDialogOpen, editingOracle]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [oraclesRes, cardsRes, spreadsRes] = await Promise.all([
        supabase.from('oracle_decks').select('*').order('ordem'),
        (supabase.from('oracle_cards') as any).select('*').order('ordem'),
        supabase.from('oracle_spreads').select('*').order('ordem'),
      ]);

      if (oraclesRes.data) setOracles(oraclesRes.data as unknown as OracleDeck[]);
      if (cardsRes.data) setCards(cardsRes.data as unknown as OracleCardData[]);
      if (spreadsRes.data) setSpreads(spreadsRes.data as unknown as OracleSpread[]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({ title: 'Erro ao carregar dados', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions
  const getOracleCards = (oracleId: string) => cards.filter(c => c.oracle_id === oracleId);
  const getOracleSpreads = (oracleId: string) => spreads.filter(s => s.oracle_id === oracleId);
  const getPublishedCards = (oracleId: string) => cards.filter(c => c.oracle_id === oracleId && c.status === 'published');
  
  const canPublishOracle = (oracle: OracleDeck) => {
    const oracleCards = getPublishedCards(oracle.id);
    const oracleSpreads = getOracleSpreads(oracle.id).filter(s => s.status === 'published');
    return oracleCards.length >= 1 && oracleSpreads.length >= 1;
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
      cover_image_url: oracleCoverUrl || null,
      theme_json: {
        ...(editingOracle?.theme_json || {}),
        cardBackImage: oracleCardBackUrl || null,
      },
      minimum_portal: minPortal as 'visitante' | 'mentorada' | 'aluna_formacao' | 'assinante' | 'oracula' | 'admin',
      status: formData.get('status') as OracleContentStatus,
      disclaimer_text: formData.get('disclaimer_text') as string || 'Leitura simbólica. Não é previsão. Não substitui acompanhamento clínico.',
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
        const { error } = await supabase.from('oracle_decks').update(oracleData).eq('id', editingOracle.id);
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
    
    // Check if can publish
    if (newStatus === 'published' && !canPublishOracle(oracle)) {
      toast({ 
        title: 'Não é possível publicar', 
        description: 'O oráculo precisa ter pelo menos 1 carta e 1 tiragem publicadas.',
        variant: 'destructive' 
      });
      return;
    }

    try {
      const { error } = await supabase.from('oracle_decks').update({ status: newStatus }).eq('id', oracle.id);
      if (error) throw error;
      fetchData();
      toast({ title: newStatus === 'published' ? 'Oráculo publicado!' : 'Oráculo despublicado' });
    } catch (error) {
      console.error('Error toggling status:', error);
      toast({ title: 'Erro ao alterar status', variant: 'destructive' });
    }
  };

  // Card CRUD
  const handleSaveCard = async (formData: FormData) => {
    const oracleId = formData.get('oracle_id') as string;
    
    if (!oracleId) {
      toast({ title: 'Selecione um oráculo', variant: 'destructive' });
      return;
    }
    
    if (!cardImageUrl) {
      toast({ title: 'A imagem é obrigatória', description: 'Faça upload de uma imagem para a carta.', variant: 'destructive' });
      return;
    }

    const keywordsRaw = formData.get('keywords') as string || '';
    const questionsRaw = formData.get('reflection_questions') as string || '';
    
    const cardData = {
      oracle_id: oracleId,
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string || null,
      main_image_url: cardImageUrl,
      back_image_url: cardBackImageUrl || null,
      short_message: formData.get('short_message') as string || null,
      deep_reading: formData.get('deep_reading') as string || null,
      polarity_light_text: formData.get('polarity_light_text') as string || null,
      polarity_shadow_text: formData.get('polarity_shadow_text') as string || null,
      ritual_text: formData.get('ritual_text') as string || null,
      care_notes: formData.get('care_notes') as string || null,
      keywords_json: keywordsRaw.split(',').map(k => k.trim()).filter(Boolean),
      reflection_questions_json: questionsRaw.split('\n').map(q => q.trim()).filter(Boolean),
      level: formData.get('level') as OracleCardData['level'],
      status: formData.get('status') as OracleContentStatus,
      is_sensitive: formData.get('is_sensitive') === 'true',
    };

    try {
      if (editingCard) {
        const { error } = await (supabase.from('oracle_cards') as any).update(cardData).eq('id', editingCard.id);
        if (error) throw error;
        toast({ title: 'Carta atualizada!' });
      } else {
        const { error } = await (supabase.from('oracle_cards') as any).insert(cardData);
        if (error) throw error;
        toast({ title: 'Carta criada!' });
      }
      fetchData();
      setCardDialogOpen(false);
      setEditingCard(null);
      setCardImageUrl('');
      setCardBackImageUrl('');
    } catch (error) {
      console.error('Error saving card:', error);
      toast({ title: 'Erro ao salvar carta', variant: 'destructive' });
    }
  };

  const handleDeleteCard = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta carta?')) return;
    
    try {
      const { error } = await (supabase.from('oracle_cards') as any).delete().eq('id', id);
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
    const oracleId = formData.get('oracle_id') as string;
    
    if (!oracleId) {
      toast({ title: 'Selecione um oráculo', variant: 'destructive' });
      return;
    }

    const positionsRaw = formData.get('positions') as string || '';
    const positions = positionsRaw.split('\n').map((line, index) => {
      const [name, meaning] = line.split('|').map(s => s.trim());
      return { name: name || `Posição ${index + 1}`, meaning: meaning || '', order: index };
    }).filter(p => p.name);

    const spreadData = {
      oracle_id: oracleId,
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
        const { error } = await supabase.from('oracle_spreads').update(spreadData).eq('id', editingSpread.id);
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

  // Navigate to cards/spreads for a specific oracle
  const navigateToOracleCards = (oracleId: string) => {
    setSelectedOracleId(oracleId);
    setActiveTab('cards');
  };

  const navigateToOracleSpreads = (oracleId: string) => {
    setSelectedOracleId(oracleId);
    setActiveTab('spreads');
  };

  return (
    <div className="space-y-6">
      {/* Guided Flow Banner */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 text-sm">
            <Info className="w-5 h-5 text-primary shrink-0" />
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium">Fluxo recomendado:</span>
              <Badge variant="outline" className="gap-1">1. Criar Oráculo</Badge>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <Badge variant="outline" className="gap-1">2. Criar Cartas</Badge>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <Badge variant="outline" className="gap-1">3. Criar Tiragens</Badge>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <Badge variant="outline" className="gap-1">4. Publicar</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

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
                        <Label htmlFor="description">Descrição Simbólica</Label>
                        <Textarea id="description" name="description" defaultValue={editingOracle?.description || ''} placeholder="Qual a finalidade terapêutica deste oráculo?" />
                      </div>
                      <div className="col-span-2">
                        <ImageUpload
                          value={oracleCoverUrl}
                          onChange={setOracleCoverUrl}
                          folder="oraculos"
                          label="Capa do Oráculo"
                          aspectRatio="square"
                          showGallery={true}
                        />
                      </div>
                      <div className="col-span-2">
                        <ImageUpload
                          value={oracleCardBackUrl}
                          onChange={setOracleCardBackUrl}
                          folder="oracle-cards"
                          label="Verso Padrão das Cartas"
                          aspectRatio="square"
                          showGallery={true}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Imagem de verso usada como fallback para todas as cartas deste oráculo.
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="minimum_portal">Portal Mínimo</Label>
                        <Select name="minimum_portal" defaultValue={editingOracle?.minimum_portal || 'mentorada'}>
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
                        <Textarea 
                          id="disclaimer_text" 
                          name="disclaimer_text" 
                          defaultValue={editingOracle?.disclaimer_text || 'Leitura simbólica. Não é previsão. Não substitui acompanhamento clínico.'} 
                        />
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
                        <Label htmlFor="upgrade_cta_text">Texto do Botão</Label>
                        <Input id="upgrade_cta_text" name="upgrade_cta_text" defaultValue={editingOracle?.upgrade_cta_text || 'Quero me inscrever'} />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="lock_message_body">Mensagem do Bloqueio</Label>
                        <Textarea id="lock_message_body" name="lock_message_body" defaultValue={editingOracle?.lock_message_body || ''} />
                      </div>
                      <div>
                        <Label htmlFor="upgrade_cta_route">Rota do Botão</Label>
                        <Input id="upgrade_cta_route" name="upgrade_cta_route" defaultValue={editingOracle?.upgrade_cta_route || '/welcome'} />
                      </div>
                      <div className="flex items-center gap-2 pt-6">
                        <Switch id="show_locked_teaser" name="show_locked_teaser" defaultChecked={editingOracle?.show_locked_teaser ?? true} value="true" />
                        <Label htmlFor="show_locked_teaser">Mostrar teaser quando bloqueado</Label>
                      </div>

                      {/* Features */}
                      <div className="col-span-2 border-t pt-4 mt-2">
                        <h4 className="font-medium mb-3">Funcionalidades</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch id="enable_journal" name="enable_journal" defaultChecked={editingOracle?.enable_journal ?? true} value="true" />
                        <Label htmlFor="enable_journal">Diário pessoal</Label>
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
                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setOracleDialogOpen(false)}>Cancelar</Button>
                      <Button type="submit">Salvar</Button>
                    </div>
                  </form>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>

          {/* Oracle Cards Grid */}
          <div className="grid gap-4">
            {oracles.map(oracle => {
              const oracleCards = getOracleCards(oracle.id);
              const oracleSpreads = getOracleSpreads(oracle.id);
              const publishedCards = oracleCards.filter(c => c.status === 'published').length;
              const publishedSpreads = oracleSpreads.filter(s => s.status === 'published').length;
              const canPublish = publishedCards >= 1 && publishedSpreads >= 1;

              return (
                <Card key={oracle.id} className={oracle.status === 'published' ? 'border-green-500/30' : ''}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {oracle.cover_image_url ? (
                          <img src={oracle.cover_image_url} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-primary" />
                          </div>
                        )}
                        <div>
                          <CardTitle className="text-lg">{oracle.name}</CardTitle>
                          {oracle.subtitle && <p className="text-sm text-muted-foreground">{oracle.subtitle}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={oracle.status === 'published' ? 'bg-green-500/20 text-green-400' : ''}
                          variant={oracle.status === 'published' ? 'default' : 'secondary'}
                        >
                          {STATUS_LABELS[oracle.status]}
                        </Badge>
                        <Badge variant="outline">{PORTAL_LABELS[oracle.minimum_portal]}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {oracle.description && (
                      <p className="text-sm text-muted-foreground mb-4">{oracle.description}</p>
                    )}
                    
                    {/* Counters */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          <strong>{oracleCards.length}</strong> cartas ({publishedCards} publicadas)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          <strong>{oracleSpreads.length}</strong> tiragens ({publishedSpreads} publicadas)
                        </span>
                      </div>
                    </div>

                    {/* Warning if cannot publish */}
                    {oracle.status === 'draft' && !canPublish && (
                      <Alert variant="destructive" className="mb-4 py-2">
                        <AlertTriangle className="w-4 h-4" />
                        <AlertDescription className="text-xs">
                          Para publicar, adicione pelo menos 1 carta e 1 tiragem publicadas.
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => navigateToOracleCards(oracle.id)}>
                        <CreditCard className="w-4 h-4 mr-1" />
                        Gerenciar Cartas
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => navigateToOracleSpreads(oracle.id)}>
                        <Layers className="w-4 h-4 mr-1" />
                        Gerenciar Tiragens
                      </Button>
                      <div className="flex-1" />
                      <Button size="sm" variant="ghost" onClick={() => toggleOracleStatus(oracle)} title={oracle.status === 'published' ? 'Despublicar' : 'Publicar'}>
                        {oracle.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => { setEditingOracle(oracle); setOracleDialogOpen(true); }}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteOracle(oracle.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {oracles.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Nenhum oráculo criado ainda.</p>
                  <Button onClick={() => { setEditingOracle(null); setOracleDialogOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Oráculo
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Cards Tab */}
        <TabsContent value="cards" className="space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold">Gerenciar Cartas</h3>
              <Select value={selectedOracleId || 'all'} onValueChange={(v) => setSelectedOracleId(v === 'all' ? '' : v)}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Filtrar por oráculo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os oráculos</SelectItem>
                  {oracles.map(o => (
                    <SelectItem key={o.id} value={o.id}>{o.name} ({getOracleCards(o.id).length})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Dialog open={cardDialogOpen} onOpenChange={setCardDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingCard(null)} disabled={oracles.length === 0}>
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
                    
                    {/* Front Image Upload */}
                    <ImageUpload
                      value={cardImageUrl}
                      onChange={setCardImageUrl}
                      folder="oracle-cards"
                      label="Imagem da Carta (Frente) *"
                      aspectRatio="square"
                      showGallery={true}
                    />

                    {/* Back Image Upload - OPTIONAL */}
                    <div className="space-y-1">
                      <ImageUpload
                        value={cardBackImageUrl}
                        onChange={setCardBackImageUrl}
                        folder="oracle-cards"
                        label="Imagem do Verso (opcional)"
                        aspectRatio="square"
                        showGallery={true}
                      />
                      <p className="text-xs text-muted-foreground">
                        Se não definida, usa o verso padrão do oráculo.
                      </p>
                    </div>

                    {/* Card Preview with 3D Flip */}
                    {(cardImageUrl || cardBackImageUrl) && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Preview da Carta (Flip 3D)</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setPreviewFlipped(!previewFlipped)}
                            className="gap-2"
                          >
                            <RotateCcw className="w-4 h-4" />
                            {previewFlipped ? 'Ver Frente' : 'Ver Verso'}
                          </Button>
                        </div>
                        <div className="flex justify-center py-4 bg-muted/30 rounded-lg border border-dashed">
                          <OracleCardPreview
                            frontImage={cardImageUrl || null}
                            backImage={cardBackImageUrl || null}
                            title={editingCard?.title || 'Nova Carta'}
                            isRevealed={previewFlipped}
                            size="lg"
                            showGlow={previewFlipped}
                            onClick={() => setPreviewFlipped(!previewFlipped)}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                          Clique na carta ou no botão para ver o flip 3D
                        </p>
                      </div>
                    )}

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
                        <Label htmlFor="short_message">Mensagem Curta</Label>
                        <Textarea id="short_message" name="short_message" defaultValue={editingCard?.short_message || ''} placeholder="Uma frase de impacto..." />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="deep_reading">Leitura Profunda</Label>
                        <Textarea id="deep_reading" name="deep_reading" rows={4} defaultValue={editingCard?.deep_reading || ''} placeholder="Texto expandido para reflexão..." />
                      </div>
                      <div>
                        <Label htmlFor="polarity_light_text">Aspecto Luz ☀️</Label>
                        <Textarea id="polarity_light_text" name="polarity_light_text" defaultValue={editingCard?.polarity_light_text || ''} />
                      </div>
                      <div>
                        <Label htmlFor="polarity_shadow_text">Aspecto Sombra 🌙</Label>
                        <Textarea id="polarity_shadow_text" name="polarity_shadow_text" defaultValue={editingCard?.polarity_shadow_text || ''} />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="ritual_text">Prática/Ritual (opcional)</Label>
                        <Textarea id="ritual_text" name="ritual_text" defaultValue={editingCard?.ritual_text || ''} />
                      </div>
                      <div>
                        <Label htmlFor="keywords">Palavras-chave (vírgula)</Label>
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

          {oracles.length === 0 && (
            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                Crie um oráculo primeiro antes de adicionar cartas.
              </AlertDescription>
            </Alert>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Carta</TableHead>
                <TableHead>Oráculo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cards
                .filter(c => !selectedOracleId || c.oracle_id === selectedOracleId)
                .map(card => (
                  <TableRow key={card.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {card.main_image_url ? (
                          <img src={card.main_image_url} alt="" className="w-10 h-14 object-cover rounded" />
                        ) : (
                          <div className="w-10 h-14 bg-muted rounded flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-destructive" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{card.title}</p>
                          {card.subtitle && <p className="text-xs text-muted-foreground">{card.subtitle}</p>}
                          {!card.main_image_url && <p className="text-xs text-destructive">Sem imagem</p>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {oracles.find(o => o.id === card.oracle_id)?.name || '-'}
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
                        <Button size="icon" variant="ghost" onClick={() => { setEditingCard(card); setCardDialogOpen(true); }}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDeleteCard(card.id)}>
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
          {/* Explanatory note */}
          <Alert className="bg-muted/50">
            <Info className="w-4 h-4" />
            <AlertDescription>
              <strong>A tiragem organiza a leitura. O sentido nasce do símbolo.</strong><br />
              Tiragens apenas definem número de cartas, posições e texto de abertura — não criam conteúdo novo.
            </AlertDescription>
          </Alert>

          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold">Gerenciar Tiragens</h3>
              <Select value={selectedOracleId || 'all'} onValueChange={(v) => setSelectedOracleId(v === 'all' ? '' : v)}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Filtrar por oráculo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os oráculos</SelectItem>
                  {oracles.map(o => (
                    <SelectItem key={o.id} value={o.id}>{o.name} ({getOracleSpreads(o.id).length})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Dialog open={spreadDialogOpen} onOpenChange={setSpreadDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingSpread(null)} disabled={oracles.length === 0}>
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
                      <Select name="oracle_id" defaultValue={editingSpread?.oracle_id || selectedOracleId || ''} required>
                        <SelectTrigger><SelectValue placeholder="Selecione o oráculo" /></SelectTrigger>
                        <SelectContent>
                          {oracles.map(o => (
                            <SelectItem key={o.id} value={o.id}>{o.name} ({getOracleCards(o.id).length} cartas)</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nome *</Label>
                        <Input id="name" name="name" defaultValue={editingSpread?.name} required placeholder="Ex: Tiragem da Encruzilhada" />
                      </div>
                      <div>
                        <Label htmlFor="number_of_cards">Número de Cartas *</Label>
                        <Input id="number_of_cards" name="number_of_cards" type="number" min="1" defaultValue={editingSpread?.number_of_cards || 1} required />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="description">Descrição / Finalidade</Label>
                        <Textarea id="description" name="description" defaultValue={editingSpread?.description || ''} placeholder="Para que serve esta tiragem?" />
                      </div>
                      <div>
                        <Label htmlFor="layout_type">Layout Visual</Label>
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
                        <Label htmlFor="positions">Posições Simbólicas (formato: nome|significado, uma por linha)</Label>
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
                        <Textarea id="opening_text" name="opening_text" defaultValue={editingSpread?.opening_text || ''} placeholder="Texto exibido antes da tiragem..." />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="closing_text">Texto de Encerramento</Label>
                        <Textarea id="closing_text" name="closing_text" defaultValue={editingSpread?.closing_text || ''} placeholder="Texto exibido após a tiragem..." />
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

          {oracles.length === 0 && (
            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                Crie um oráculo primeiro antes de adicionar tiragens.
              </AlertDescription>
            </Alert>
          )}

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
              {spreads
                .filter(s => !selectedOracleId || s.oracle_id === selectedOracleId)
                .map(spread => {
                  const oracleCardCount = getOracleCards(spread.oracle_id).length;
                  const hasEnoughCards = oracleCardCount >= spread.number_of_cards;
                  
                  return (
                    <TableRow key={spread.id}>
                      <TableCell>
                        <p className="font-medium">{spread.name}</p>
                        {spread.description && <p className="text-xs text-muted-foreground">{spread.description}</p>}
                      </TableCell>
                      <TableCell>
                        {oracles.find(o => o.id === spread.oracle_id)?.name || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span>{spread.number_of_cards}</span>
                          {!hasEnoughCards && (
                            <span title={`Oráculo tem apenas ${oracleCardCount} cartas`}>
                              <AlertTriangle className="w-3 h-3 text-destructive" />
                            </span>
                          )}
                        </div>
                      </TableCell>
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
                          <Button size="icon" variant="ghost" onClick={() => { setEditingSpread(spread); setSpreadDialogOpen(true); }}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDeleteSpread(spread.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
