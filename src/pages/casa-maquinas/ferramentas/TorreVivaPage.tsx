import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const TORRES = ['Controle', 'Performance', 'Silêncio', 'Adaptação', 'Força', 'Espiritualização'];

export default function TorreVivaPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState<any[]>([]);
  const [clientId, setClientId] = useState('');
  const [towerPrimary, setTowerPrimary] = useState('');
  const [towerSecondary, setTowerSecondary] = useState('');
  const [notes, setNotes] = useState('');
  const [clinicalPosture, setClinicalPosture] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      supabase.from('clientes').select('id, nome').eq('terapeuta_id', user.id).order('nome')
        .then(({ data }) => setClients(data || []));
    }
  }, [user]);

  const handleSave = async () => {
    if (!clientId || !towerPrimary) { toast.error('Preencha os campos obrigatórios'); return; }
    setSaving(true);

    const { error } = await supabase.from('towers').insert({
      client_id: clientId,
      tower_primary: towerPrimary,
      tower_secondary: towerSecondary || null,
      notes: notes || null,
      clinical_posture: clinicalPosture || null,
    });

    if (error) toast.error('Erro ao salvar');
    else { toast.success('Torre registrada'); navigate(`/casa-das-maquinas/clientes/${clientId}`); }
    setSaving(false);
  };

  return (
    <CasaMaquinasLayout title="Torre Viva" subtitle="Identificação da torre predominante">
      <div className="max-w-lg mx-auto">
        <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
          <CardContent className="p-6 space-y-4">
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]"><SelectValue placeholder="Cliente..." /></SelectTrigger>
              <SelectContent>{clients.map(c => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}</SelectContent>
            </Select>

            <div>
              <label className="text-xs text-[#F5F1E8]/60 mb-2 block">Torre Predominante *</label>
              <Select value={towerPrimary} onValueChange={setTowerPrimary}>
                <SelectTrigger className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>{TORRES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-[#F5F1E8]/60 mb-2 block">Torre Secundária</label>
              <Select value={towerSecondary} onValueChange={setTowerSecondary}>
                <SelectTrigger className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]"><SelectValue placeholder="Opcional..." /></SelectTrigger>
                <SelectContent>{TORRES.filter(t => t !== towerPrimary).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-[#F5F1E8]/60 mb-2 block">Observações</label>
              <Textarea value={notes} onChange={e => setNotes(e.target.value)} className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]" />
            </div>

            <div>
              <label className="text-xs text-[#F5F1E8]/60 mb-2 block">Orientação Clínica</label>
              <Textarea value={clinicalPosture} onChange={e => setClinicalPosture(e.target.value)} className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]" placeholder="Postura clínica sugerida..." />
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full bg-[#C9A24A] hover:bg-[#C9A24A]/80 text-[#0B1B2B]">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar Torre'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </CasaMaquinasLayout>
  );
}
