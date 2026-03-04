import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, Moon } from 'lucide-react';
import { toast } from 'sonner';

export default function DecodificacaoOniricaPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState<any[]>([]);
  const [clientId, setClientId] = useState('');
  const [dreamText, setDreamText] = useState('');
  const [centralImage, setCentralImage] = useState('');
  const [psychicForce, setPsychicForce] = useState('');
  const [interruptedMovement, setInterruptedMovement] = useState('');
  const [symbolicMessage, setSymbolicMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      supabase.from('clientes').select('id, nome').eq('terapeuta_id', user.id).order('nome')
        .then(({ data }) => setClients(data || []));
    }
  }, [user]);

  const handleSave = async () => {
    if (!clientId || !dreamText) { toast.error('Preencha os campos obrigatórios'); return; }
    setSaving(true);

    const { error } = await supabase.from('dreams').insert({
      client_id: clientId,
      dream_text: dreamText,
      central_image: centralImage || null,
      psychic_force: psychicForce || null,
      interrupted_movement: interruptedMovement || null,
      symbolic_message: symbolicMessage || null,
    });

    if (error) toast.error('Erro ao salvar');
    else { toast.success('Sonho registrado'); navigate(`/casa-das-maquinas/clientes/${clientId}`); }
    setSaving(false);
  };

  return (
    <CasaMaquinasLayout title="Decodificação Onírica" subtitle="Leitura simbólica de sonhos">
      <div className="max-w-lg mx-auto">
        <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
          <CardHeader>
            <CardTitle className="text-sm text-[#F5F1E8]/80 flex items-center gap-2">
              <Moon className="w-4 h-4 text-[#C9A24A]" />
              Registro de Sonho
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]"><SelectValue placeholder="Cliente..." /></SelectTrigger>
              <SelectContent>{clients.map(c => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}</SelectContent>
            </Select>

            <div>
              <Label className="text-[#F5F1E8]/70">Descrição do sonho *</Label>
              <Textarea value={dreamText} onChange={e => setDreamText(e.target.value)} className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8] min-h-[100px]" placeholder="Descreva o sonho..." />
            </div>

            <div>
              <Label className="text-[#F5F1E8]/70">Imagem central</Label>
              <Textarea value={centralImage} onChange={e => setCentralImage(e.target.value)} className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]" placeholder="Qual imagem predomina?" />
            </div>

            <div>
              <Label className="text-[#F5F1E8]/70">Força psíquica</Label>
              <Textarea value={psychicForce} onChange={e => setPsychicForce(e.target.value)} className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]" placeholder="Que força atua?" />
            </div>

            <div>
              <Label className="text-[#F5F1E8]/70">Movimento interrompido</Label>
              <Textarea value={interruptedMovement} onChange={e => setInterruptedMovement(e.target.value)} className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]" placeholder="O que foi impedido?" />
            </div>

            <div>
              <Label className="text-[#F5F1E8]/70">Mensagem simbólica</Label>
              <Textarea value={symbolicMessage} onChange={e => setSymbolicMessage(e.target.value)} className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]" placeholder="O que o sonho comunica?" />
            </div>

            <Button onClick={handleSave} disabled={saving || !clientId} className="w-full bg-[#C9A24A] hover:bg-[#C9A24A]/80 text-[#0B1B2B]">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar Sonho'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </CasaMaquinasLayout>
  );
}
