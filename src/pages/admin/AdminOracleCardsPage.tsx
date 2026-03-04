import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Loader2, Edit, Copy, Search } from 'lucide-react';
import { toast } from 'sonner';
import { FAMILY_ICONS, FAMILY_COLORS } from '@/hooks/useCidadelaOracle';

const TABLE = 'cidadela_oracle_cards' as any;
const FAMILIES = ['TORRES', 'PORTAS', 'ARQUÉTIPOS', 'SONHOS', 'LABIRINTOS', 'TRANSFORMAÇÕES'];

export default function AdminOracleCardsPage() {
  const { user } = useAuth();
  const [cards, setCards] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [familyFilter, setFamilyFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editCard, setEditCard] = useState<any | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [c, d] = await Promise.all([
      (supabase.from(TABLE) as any).select('*').order('ordem'),
      supabase.from('districts').select('id, nome, numero').order('numero'),
    ]);
    setCards(c.data || []);
    setDistricts(d.data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!editCard) return;
    const { id, created_at, updated_at, ...data } = editCard;
    if (id) {
      await (supabase.from(TABLE) as any).update({ ...data, updated_at: new Date().toISOString() }).eq('id', id);
    } else {
      await (supabase.from(TABLE) as any).insert(data);
    }
    toast.success('Carta salva');
    setEditCard(null);
    loadData();
  };

  const handleDuplicate = async (card: any) => {
    const { id, created_at, updated_at, ...data } = card;
    await (supabase.from(TABLE) as any).insert({ ...data, name: data.name + ' (cópia)', ordem: data.ordem + 100 });
    toast.success('Carta duplicada');
    loadData();
  };

  const toggleActive = async (card: any) => {
    await (supabase.from(TABLE) as any).update({ is_active: !card.is_active }).eq('id', card.id);
    loadData();
  };

  const filtered = cards.filter(c => {
    if (familyFilter !== 'all' && c.family !== familyFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return <CasaMaquinasLayout title="Oráculo (Cartas)"><div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[#C9A24A]" /></div></CasaMaquinasLayout>;
  }

  return (
    <CasaMaquinasLayout title="Oráculo da CidaDELA — Cartas" subtitle={`${cards.length} cartas no baralho`}>
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="w-48 bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]" />
          <Select value={familyFilter} onValueChange={setFamilyFilter}>
            <SelectTrigger className="w-44 bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]">
              <SelectValue placeholder="Família" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as famílias</SelectItem>
              {FAMILIES.map(f => <SelectItem key={f} value={f}>{FAMILY_ICONS[f]} {f}</SelectItem>)}
            </SelectContent>
          </Select>
          <Badge variant="secondary">{filtered.length} cartas</Badge>
        </div>

        <div className="space-y-2">
          {filtered.map(card => {
            const colors = FAMILY_COLORS[card.family] || FAMILY_COLORS.TORRES;
            const district = districts.find((d: any) => d.id === card.district_id);
            return (
              <Card key={card.id} className={`${colors.bg} ${colors.border} border ${!card.is_active ? 'opacity-40' : ''}`}>
                <CardContent className="p-3 flex items-center gap-3">
                  <span className="text-lg">{FAMILY_ICONS[card.family]}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${colors.text}`}>{card.name}</p>
                    <p className="text-[10px] text-[#F5F1E8]/40">
                      {card.keyword} • {district?.nome || '—'} • #{card.ordem}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Switch checked={card.is_active} onCheckedChange={() => toggleActive(card)} />
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditCard({ ...card })}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDuplicate(card)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editCard} onOpenChange={open => !open && setEditCard(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Editar Carta</DialogTitle></DialogHeader>
          {editCard && (
            <div className="space-y-3">
              <Input placeholder="Nome" value={editCard.name} onChange={e => setEditCard((c: any) => ({ ...c, name: e.target.value }))} />
              <Select value={editCard.family} onValueChange={v => setEditCard((c: any) => ({ ...c, family: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{FAMILIES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={editCard.district_id || ''} onValueChange={v => setEditCard((c: any) => ({ ...c, district_id: v || null }))}>
                <SelectTrigger><SelectValue placeholder="Distrito" /></SelectTrigger>
                <SelectContent>{districts.map((d: any) => <SelectItem key={d.id} value={d.id}>{d.numero}. {d.nome}</SelectItem>)}</SelectContent>
              </Select>
              <Input placeholder="Palavra-chave" value={editCard.keyword || ''} onChange={e => setEditCard((c: any) => ({ ...c, keyword: e.target.value }))} />
              <Textarea placeholder="Descrição simbólica" value={editCard.description || ''} onChange={e => setEditCard((c: any) => ({ ...c, description: e.target.value }))} />
              <Input placeholder="Pergunta clínica" value={editCard.base_question || ''} onChange={e => setEditCard((c: any) => ({ ...c, base_question: e.target.value }))} />
              <Input placeholder="Cor (hex)" value={editCard.color_hex || ''} onChange={e => setEditCard((c: any) => ({ ...c, color_hex: e.target.value }))} />
              <Input placeholder="Imagem URL" value={editCard.image_url || ''} onChange={e => setEditCard((c: any) => ({ ...c, image_url: e.target.value }))} />
              <Input type="number" placeholder="Ordem" value={editCard.ordem} onChange={e => setEditCard((c: any) => ({ ...c, ordem: parseInt(e.target.value) || 0 }))} />
              <Button onClick={handleSave} className="w-full" variant="gold">Salvar</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </CasaMaquinasLayout>
  );
}
