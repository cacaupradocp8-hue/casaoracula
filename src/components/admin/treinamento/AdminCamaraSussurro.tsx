import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  EyeOff,
  Loader2,
  GraduationCap,
  Filter,
  Search,
  FlaskConical
} from 'lucide-react';

interface CamaraCaso {
  id: string;
  titulo: string;
  idade: number | null;
  contexto: string | null;
  fala_inicial: string | null;
  distrito_dominante: string | null;
  torre_provavel: string | null;
  erro_comum: string | null;
  pergunta_ideal: string | null;
  leitura_simbolica: string | null;
  resposta_correta: string | null;
  dificuldade: 'iniciante' | 'intermediario' | 'avancado' | string;
  tipo_cliente: string | null;
  tema_emocional: string | null;
  ativo: boolean;
  ciclo_id: string | null;
  created_at: string;
}

const DISTRICT_OPTIONS = [
  "Trilha da Floresta",
  "Vale das Sombras",
  "Pico da Clareza",
  "Rio da Fluidez",
  "Gruta do Silêncio",
  "Deserto da Busca"
];

const DIFFICULTY_LABELS = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado"
};

export function AdminCamaraSussurro({ cicloId }: { cicloId?: string }) {
  const { toast } = useToast();
  const [casos, setCasos] = useState<CamaraCaso[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCaso, setEditingCaso] = useState<CamaraCaso | null>(null);

  // Filters
  const [filterDistrito, setFilterDistrito] = useState<string>('all');
  const [filterDificuldade, setFilterDificuldade] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [form, setForm] = useState<Partial<CamaraCaso>>({
    titulo: '',
    idade: 30,
    contexto: '',
    fala_inicial: '',
    distrito_dominante: '',
    torre_provavel: '',
    erro_comum: '',
    pergunta_ideal: '',
    leitura_simbolica: '',
    resposta_correta: '',
    dificuldade: 'iniciante',
    tipo_cliente: '',
    tema_emocional: '',
    ativo: true,
  });

  useEffect(() => {
    fetchCasos();
  }, [cicloId]);

  const fetchCasos = async () => {
    setLoading(true);
    let query = supabase
      .from('co_camara_sussurro_casos')
      .select('*')
      .order('created_at', { ascending: false });

    if (cicloId) {
      query = query.eq('ciclo_id', cicloId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao carregar casos:', error);
      toast({ title: 'Erro ao carregar casos', variant: 'destructive' });
    } else {
      setCasos(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setForm({
      titulo: '',
      idade: 30,
      contexto: '',
      fala_inicial: '',
      distrito_dominante: '',
      torre_provavel: '',
      erro_comum: '',
      pergunta_ideal: '',
      leitura_simbolica: '',
      resposta_correta: '',
      dificuldade: 'iniciante',
      tipo_cliente: '',
      tema_emocional: '',
      ativo: true,
    });
    setEditingCaso(null);
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (caso: CamaraCaso) => {
    setEditingCaso(caso);
    setForm(caso);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.titulo?.trim()) {
      toast({ title: 'Título é obrigatório', variant: 'destructive' });
      return;
    }

    setSaving(true);
    
    // Clean up payload
    const { id, created_at, ...dataToSave } = form;
    const payload = {
      ...dataToSave,
      ciclo_id: cicloId || form.ciclo_id || null
    };

    if (editingCaso) {
      const { error } = await supabase
        .from('co_camara_sussurro_casos')
        .update(payload as any)
        .eq('id', editingCaso.id);

      if (error) {
        toast({ title: 'Erro ao atualizar caso', variant: 'destructive' });
      } else {
        toast({ title: 'Caso atualizado!' });
        setDialogOpen(false);
        fetchCasos();
      }
    } else {
      const { error } = await supabase
        .from('co_camara_sussurro_casos')
        .insert([payload as any]);

      if (error) {
        toast({ title: 'Erro ao criar caso', variant: 'destructive' });
      } else {
        toast({ title: 'Caso criado!' });
        setDialogOpen(false);
        fetchCasos();
      }
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este caso da Câmara?')) return;

    const { error } = await supabase
      .from('co_camara_sussurro_casos')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Erro ao excluir', variant: 'destructive' });
    } else {
      toast({ title: 'Caso removido!' });
      fetchCasos();
    }
  };

  const toggleAtivo = async (caso: CamaraCaso) => {
    const { error } = await supabase
      .from('co_camara_sussurro_casos')
      .update({ ativo: !caso.ativo })
      .eq('id', caso.id);

    if (error) {
      toast({ title: 'Erro ao alterar status', variant: 'destructive' });
    } else {
      fetchCasos();
    }
  };

  const filteredCasos = casos.filter(c => {
    const matchesDistrito = filterDistrito === 'all' || c.distrito_dominante === filterDistrito;
    const matchesDificuldade = filterDificuldade === 'all' || c.dificuldade === filterDificuldade;
    const matchesSearch = c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.tema_emocional?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.tipo_cliente?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDistrito && matchesDificuldade && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-gold" />
            Câmara do Sussurro
          </h3>
          <p className="text-sm text-muted-foreground">Gestão do banco infinito de casos clínicos</p>
        </div>
        <Button onClick={openCreate} className="bg-gold hover:bg-gold/90 text-black font-medium gap-2">
          <Plus className="w-4 h-4" />
          Novo Caso Clínico
        </Button>
      </div>

      <Card className="border-primary/10 bg-black/40 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por título, tema ou tipo..." 
                className="pl-10 bg-white/5 border-white/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterDistrito} onValueChange={setFilterDistrito}>
                <SelectTrigger className="w-[180px] bg-white/5 border-white/10">
                  <Filter className="w-3.5 h-3.5 mr-2" />
                  <SelectValue placeholder="Distrito" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Distritos</SelectItem>
                  {DISTRICT_OPTIONS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={filterDificuldade} onValueChange={setFilterDificuldade}>
                <SelectTrigger className="w-[150px] bg-white/5 border-white/10">
                  <SelectValue placeholder="Dificuldade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="iniciante">Iniciante</SelectItem>
                  <SelectItem value="intermediario">Intermediário</SelectItem>
                  <SelectItem value="avancado">Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCasos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-white/5 rounded-lg">
              <p>Nenhum caso clínico encontrado com os filtros atuais.</p>
              <Button variant="link" onClick={() => { setFilterDistrito('all'); setFilterDificuldade('all'); setSearchTerm(''); }}>Limpar filtros</Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-white/5">
                  <TableHead>Caso</TableHead>
                  <TableHead>Distrito / Tema</TableHead>
                  <TableHead>Dificuldade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCasos.map((caso) => (
                  <TableRow key={caso.id} className="border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-gold/90">{caso.titulo}</span>
                        <span className="text-xs text-muted-foreground">{caso.tipo_cliente || 'Cliente Padrão'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant="outline" className="w-fit text-[10px] border-gold/20 text-gold/70">{caso.distrito_dominante || 'Geral'}</Badge>
                        <span className="text-[11px] text-muted-foreground">{caso.tema_emocional}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`text-[10px] ${
                        caso.dificuldade === 'avancado' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        caso.dificuldade === 'intermediario' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {DIFFICULTY_LABELS[caso.dificuldade]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => toggleAtivo(caso)} className="p-0 h-auto">
                        {caso.ativo ? (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Ativo</Badge>
                        ) : (
                          <Badge variant="outline" className="opacity-50">Inativo</Badge>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-white/10" onClick={() => openEdit(caso)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-red-500/10 text-red-400/70" onClick={() => handleDelete(caso.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Editor Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto bg-zinc-950 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif text-gold flex items-center gap-2">
              {editingCaso ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {editingCaso ? 'Editar Caso Clínico' : 'Novo Caso na Câmara do Sussurro'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Título do Caso *</Label>
                <Input 
                  value={form.titulo} 
                  onChange={e => setForm({...form, titulo: e.target.value})} 
                  placeholder="Ex: O Silêncio da Torre de Marfim"
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Idade (opcional)</Label>
                  <Input 
                    type="number"
                    value={form.idade || ''} 
                    onChange={e => setForm({...form, idade: parseInt(e.target.value) || null})} 
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dificuldade</Label>
                  <Select 
                    value={form.dificuldade} 
                    onValueChange={v => setForm({...form, dificuldade: v as any})}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iniciante">Iniciante</SelectItem>
                      <SelectItem value="intermediario">Intermediário</SelectItem>
                      <SelectItem value="avancado">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Distrito Dominante</Label>
                <Select 
                  value={form.distrito_dominante || ''} 
                  onValueChange={v => setForm({...form, distrito_dominante: v})}
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Selecione o distrito..." />
                  </SelectTrigger>
                  <SelectContent>
                    {DISTRICT_OPTIONS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tipo de Cliente</Label>
                <Input 
                  value={form.tipo_cliente || ''} 
                  onChange={e => setForm({...form, tipo_cliente: e.target.value})} 
                  placeholder="Ex: Analista Financeira, Artista, Mãe solo..."
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label>Tema Emocional</Label>
                <Input 
                  value={form.tema_emocional || ''} 
                  onChange={e => setForm({...form, tema_emocional: e.target.value})} 
                  placeholder="Ex: Luto não elaborado, Medo do sucesso..."
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label>Torre Provável</Label>
                <Input 
                  value={form.torre_provavel || ''} 
                  onChange={e => setForm({...form, torre_provavel: e.target.value})} 
                  placeholder="Ex: Torre da Destruição, Torre da Ilusão..."
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>

            {/* Clinical Content */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Contexto do Atendimento</Label>
                <Textarea 
                  value={form.contexto || ''} 
                  onChange={e => setForm({...form, contexto: e.target.value})} 
                  placeholder="Descreva o cenário, postura e clima da sessão..."
                  className="bg-white/5 border-white/10 min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Fala Inicial do Cliente</Label>
                <Textarea 
                  value={form.fala_inicial || ''} 
                  onChange={e => setForm({...form, fala_inicial: e.target.value})} 
                  placeholder="O que o cliente diz logo ao começar?"
                  className="bg-white/5 border-white/10 font-mono text-sm italic"
                />
              </div>

              <div className="space-y-2">
                <Label>Pergunta Ideal (Condução)</Label>
                <Textarea 
                  value={form.pergunta_ideal || ''} 
                  onChange={e => setForm({...form, pergunta_ideal: e.target.value})} 
                  placeholder="Qual a pergunta cirúrgica para este momento?"
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label>Erro Comum a Evitar</Label>
                <Input 
                  value={form.erro_comum || ''} 
                  onChange={e => setForm({...form, erro_comum: e.target.value})} 
                  placeholder="O que as alunas costumam errar aqui?"
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label>Leitura Simbólica (Gabarito Mentora)</Label>
                <Textarea 
                  value={form.leitura_simbolica || ''} 
                  onChange={e => setForm({...form, leitura_simbolica: e.target.value})} 
                  placeholder="Explicação profunda do que está acontecendo no campo..."
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label>Resposta Correta (Resumo)</Label>
                <Input 
                  value={form.resposta_correta || ''} 
                  onChange={e => setForm({...form, resposta_correta: e.target.value})} 
                  placeholder="Resumo direto da direção técnica correta"
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-white/10 pt-4 mt-4">
            <Button variant="ghost" onClick={() => setDialogOpen(false)} className="text-white hover:bg-white/5">
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-gold hover:bg-gold/90 text-black font-bold px-8"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingCaso ? 'Salvar Alterações' : 'Criar Caso na Câmara'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}