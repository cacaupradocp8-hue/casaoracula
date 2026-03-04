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
  journey?: {
    process_state: string;
    current_district?: { nome: string } | null;
  };
}

const estadoCores: Record<string, string> = {
  crise: 'bg-red-500/20 text-red-400 border-red-500/30',
  travessia: 'bg-[#C9A24A]/20 text-[#C9A24A] border-[#C9A24A]/30',
  integracao: 'bg-[#556B57]/20 text-[#556B57] border-[#556B57]/30',
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
  const [saving, setSaving] = useState(false);

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

    // Load journeys for each client
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
      })
      .select()
      .single();

    if (error) {
      toast.error('Erro ao criar cliente');
      setSaving(false);
      return;
    }

    // Create journey for this client
    if (data) {
      await supabase.from('journeys').insert({ client_id: data.id });
    }

    toast.success('Cliente criada com sucesso');
    setDialogOpen(false);
    setNewName('');
    setNewObjective('');
    setNewNotes('');
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F5F1E8]/30" />
          <Input
            placeholder="Buscar cliente..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8] placeholder:text-[#F5F1E8]/30"
          />
        </div>
        <Select value={filterState} onValueChange={setFilterState}>
          <SelectTrigger className="w-40 bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]">
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
            <Button className="bg-[#C9A24A] hover:bg-[#C9A24A]/80 text-[#0B1B2B] gap-2">
              <Plus className="w-4 h-4" />
              Nova Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0B1B2B] border-[#C9A24A]/20">
            <DialogHeader>
              <DialogTitle className="text-[#F5F1E8]">Nova Cliente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-[#F5F1E8]/70">Nome</Label>
                <Input value={newName} onChange={e => setNewName(e.target.value)} className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]" />
              </div>
              <div>
                <Label className="text-[#F5F1E8]/70">Objetivo Terapêutico</Label>
                <Textarea value={newObjective} onChange={e => setNewObjective(e.target.value)} className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]" />
              </div>
              <div>
                <Label className="text-[#F5F1E8]/70">Observações</Label>
                <Textarea value={newNotes} onChange={e => setNewNotes(e.target.value)} className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]" />
              </div>
              <Button onClick={handleCreate} disabled={saving || !newName.trim()} className="w-full bg-[#C9A24A] hover:bg-[#C9A24A]/80 text-[#0B1B2B]">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar Cliente'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Client List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-[#C9A24A]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-[#F5F1E8]/40">
          <p className="text-lg">Nenhuma cliente encontrada</p>
          <p className="text-sm mt-1">Crie sua primeira cliente para começar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(c => (
            <Card
              key={c.id}
              className="border-[#C9A24A]/10 bg-[#0B1B2B]/60 hover:border-[#C9A24A]/20 transition-all cursor-pointer"
              onClick={() => navigate(`/casa-das-maquinas/clientes/${c.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[#F5F1E8]">{c.nome}</h3>
                    <p className="text-[10px] text-[#F5F1E8]/40 mt-0.5">
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
                  <p className="text-xs text-[#F5F1E8]/50 mb-3 line-clamp-2">{c.objetivo_terapeutico}</p>
                )}
                <div className="flex items-center gap-2">
                  {c.journey?.current_district && (
                    <div className="flex items-center gap-1 text-[10px] text-[#F5F1E8]/50">
                      <MapPin className="w-3 h-3 text-[#C9A24A]/60" />
                      {c.journey.current_district.nome}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Button size="sm" variant="ghost" className="h-7 text-xs text-[#C9A24A] hover:text-[#C9A24A] hover:bg-[#C9A24A]/10 flex-1">
                    Abrir Cidade <ChevronRight className="w-3 h-3 ml-1" />
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
