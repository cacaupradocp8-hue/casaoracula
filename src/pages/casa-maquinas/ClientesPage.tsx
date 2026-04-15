import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, MapPin, Castle, ChevronRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Cliente {
  id: string;
  nome: string;
  status: string;
  objetivo_terapeutico: string | null;
  observacao_segura: string | null;
  created_at: string;
  has_initial_cartography: boolean;
  has_initial_cidadela: boolean;
  journey?: {
    process_state: string;
    current_district?: { nome: string } | null;
  };
}

const ESTADOS_CIVIS = ['solteira', 'casada', 'união estável', 'divorciada', 'viúva', 'outro'];

const estadoCores: Record<string, string> = {
  crise: 'bg-destructive/15 text-destructive border-destructive/30',
  travessia: 'bg-primary/15 text-primary border-primary/30',
  integracao: 'bg-accent/15 text-accent border-accent/30',
};

const getAgeFromBirthDate = (value: string) => {
  if (!value) return null;
  const birthDate = new Date(value);
  if (Number.isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
};

export default function ClientesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newBirthDate, setNewBirthDate] = useState('');
  const [newMaritalStatus, setNewMaritalStatus] = useState('');
  const [newChildrenCount, setNewChildrenCount] = useState('');
  const [newRelevantInfo, setNewRelevantInfo] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const estimatedAge = getAgeFromBirthDate(newBirthDate);

  useEffect(() => {
    if (user) loadClientes();
  }, [user]);

  const loadClientes = async () => {
    if (!user) return;
    setLoading(true);
    
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('terapeuta_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erro ao carregar clientes');
      setLoading(false);
      return;
    }

    const clientIds = (data || []).map(c => c.id);
    const { data: journeys } = await supabase
      .from('journeys')
      .select('client_id, process_state, current_district_id')
      .in('client_id', clientIds.length > 0 ? clientIds : ['none']);

    const { data: districts } = await supabase.from('districts').select('id, nome');
    const districtMap = Object.fromEntries((districts || []).map(d => [d.id, d.nome]));

    const enriched = (data || []).map(c => {
      const j = journeys?.find(j => j.client_id === c.id);
      return {
        ...c,
        journey: j ? {
          process_state: j.process_state,
          current_district: j.current_district_id ? { nome: districtMap[j.current_district_id] || '' } : null,
        } : undefined,
      };
    });

    setClientes(enriched);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!user || !newName.trim()) return;
    setSaving(true);

    const { data, error } = await supabase
      .from('clientes')
      .insert({
        nome: newName.trim(),
        terapeuta_id: user.id,
        objetivo_terapeutico: newObjective || null,
        observacao_segura: newNotes || null,
        data_nascimento: newBirthDate || null,
        estado_civil: newMaritalStatus || null,
        numero_filhos: newChildrenCount === '' ? null : Number(newChildrenCount),
        informacoes_relevantes: newRelevantInfo || null,
        email: newEmail.trim().toLowerCase() || null,
        telefone: newPhone.trim() || null,
      })
      .select()
      .single();

    if (error) {
      toast.error('Erro ao criar cliente');
      setSaving(false);
      return;
    }

    if (data) {
      // No longer auto-create journeys/maps/cidadela — only the trigger creates a bare jardim container

      // Send invitation if email is provided
      if (newEmail.trim()) {
        try {
          const { error: inviteError } = await supabase.functions.invoke('send-client-invitation', {
            body: {
              cliente_id: data.id,
              email: newEmail.trim().toLowerCase(),
              nome_cliente: newName.trim(),
            },
          });
          if (inviteError) {
            console.error('Invite error:', inviteError);
            toast.warning('Cliente criada, mas erro ao enviar convite por email');
          } else {
            toast.success('Cliente criada e convite enviado por email 🌿');
          }
        } catch (err) {
          console.error('Invite send error:', err);
          toast.success('Cliente criada (convite não enviado)');
        }
      } else {
        toast.success('Cliente criada com sucesso');
      }
    } else {
      toast.success('Cliente criada com sucesso');
    }
    setDialogOpen(false);
    setNewName('');
    setNewObjective('');
    setNewNotes('');
    setNewBirthDate('');
    setNewMaritalStatus('');
    setNewChildrenCount('');
    setNewRelevantInfo('');
    setNewEmail('');
    setNewPhone('');
    setSaving(false);
    loadClientes();
  };

  const filtered = clientes.filter(c => {
    const matchSearch = c.nome.toLowerCase().includes(search.toLowerCase());
    const matchState = filterState === 'all' || c.journey?.process_state === filterState;
    return matchSearch && matchState;
  });

  return (
    <CasaMaquinasLayout title="Clientes" subtitle="Gestão de clientes e jornadas">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cliente..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterState} onValueChange={setFilterState}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="crise">Crise</SelectItem>
            <SelectItem value="travessia">Travessia</SelectItem>
            <SelectItem value="integracao">Integração</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/80 gap-2">
              <Plus className="w-4 h-4" />
              Nova Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nova Cliente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input value={newName} onChange={e => setNewName(e.target.value)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="cliente@email.com" />
                </div>
                <div>
                  <Label>Telefone</Label>
                  <Input type="tel" value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="(11) 99999-9999" />
                </div>
              </div>
              <div>
                <Label>Objetivo Terapêutico</Label>
                <Textarea value={newObjective} onChange={e => setNewObjective(e.target.value)} />
              </div>
              <div>
                <Label>Observações</Label>
                <Textarea value={newNotes} onChange={e => setNewNotes(e.target.value)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Data de nascimento</Label>
                  <Input type="date" value={newBirthDate} onChange={e => setNewBirthDate(e.target.value)} />
                  {estimatedAge !== null && (
                    <p className="mt-1 text-xs text-muted-foreground">Idade calculada: {estimatedAge} anos</p>
                  )}
                </div>
                <div>
                  <Label>Estado civil</Label>
                  <Select value={newMaritalStatus} onValueChange={setNewMaritalStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {ESTADOS_CIVIS.map((estado) => (
                        <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Filhos</Label>
                <Input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={newChildrenCount}
                  onChange={e => setNewChildrenCount(e.target.value)}
                  placeholder="Quantidade de filhos"
                />
              </div>
              <div>
                <Label>Informações relevantes</Label>
                <Textarea
                  value={newRelevantInfo}
                  onChange={e => setNewRelevantInfo(e.target.value)}
                  placeholder="Estado civil, filhos, contexto familiar, saúde, marcos importantes..."
                />
              </div>
              <Button onClick={handleCreate} disabled={saving || !newName.trim()} className="w-full bg-primary text-primary-foreground hover:bg-primary/80">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar Cliente'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Client List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">Nenhuma cliente encontrada</p>
          <p className="text-sm mt-1">Crie sua primeira cliente para começar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(c => (
            <Card
              key={c.id}
              className="border-border/30 bg-card/70 backdrop-blur-sm hover:border-primary/30 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-lg"
              onClick={() => navigate(`/casa-das-maquinas/clientes/${c.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-display font-semibold text-foreground">{c.nome}</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Desde {new Date(c.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  {c.journey && (
                    <Badge variant="outline" className={`text-[10px] ${estadoCores[c.journey.process_state] || ''}`}>
                      {c.journey.process_state}
                    </Badge>
                  )}
                </div>
                {c.objetivo_terapeutico && (
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{c.objetivo_terapeutico}</p>
                )}
                <div className="flex items-center gap-2">
                  {c.journey?.current_district && (
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <MapPin className="w-3 h-3 text-primary/60" />
                      {c.journey.current_district.nome}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-primary hover:text-primary hover:bg-primary/10 flex-1"
                    onClick={(e) => { e.stopPropagation(); navigate(`/casa-das-maquinas/cabine?clienteId=${c.id}`); }}
                  >
                    Abrir Cabine <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </CasaMaquinasLayout>
  );
}
