import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ChevronRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { updateClientDistrict } from '@/utils/updateClientDistrict';

const CAMADAS = [
  { key: 'fact', label: 'Fato', placeholder: 'O que aconteceu? Descreva o evento concreto.' },
  { key: 'emotional_field', label: 'Campo Emocional', placeholder: 'O que sentiu? Qual o campo emocional ativado?' },
  { key: 'archetypal_image', label: 'Imagem Arquetípica', placeholder: 'Que imagem surge? Qual símbolo aparece?' },
  { key: 'crossing', label: 'Travessia', placeholder: 'Qual o movimento de travessia possível?' },
  { key: 'facilitator_support', label: 'Sustentação', placeholder: 'Como a facilitadora sustenta este campo?' },
];

export default function LabirintoPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState<any[]>([]);
  const [clientId, setClientId] = useState('');
  const [currentLayer, setCurrentLayer] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      supabase.from('clientes').select('id, nome').eq('terapeuta_id', user.id).order('nome')
        .then(({ data }) => setClients(data || []));
    }
  }, [user]);

  const handleSave = async () => {
    if (!clientId) { toast.error('Selecione uma cliente'); return; }
    setSaving(true);

    const { error } = await supabase.from('labyrinth_records').insert({
      client_id: clientId,
      fact: values.fact || null,
      emotional_field: values.emotional_field || null,
      archetypal_image: values.archetypal_image || null,
      crossing: values.crossing || null,
      facilitator_support: values.facilitator_support || null,
    });

    if (error) toast.error('Erro ao salvar');
    else {
      await updateClientDistrict(clientId, 'labirinto');
      toast.success('Registro do labirinto salvo');
      navigate(`/casa-das-maquinas/clientes/${clientId}`);
    }
    setSaving(false);
  };

  const camada = CAMADAS[currentLayer];

  return (
    <CasaMaquinasLayout title="Labirinto das 39 Portas" subtitle="Travessia em 5 camadas">
      <div className="max-w-lg mx-auto space-y-4">
        {/* Client */}
        <Select value={clientId} onValueChange={setClientId}>
          <SelectTrigger className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]"><SelectValue placeholder="Selecione a cliente..." /></SelectTrigger>
          <SelectContent>{clients.map(c => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}</SelectContent>
        </Select>

        {/* Layer indicators */}
        <div className="flex items-center justify-center gap-2">
          {CAMADAS.map((c, i) => (
            <div key={c.key} className="flex items-center gap-1">
              <button
                onClick={() => setCurrentLayer(i)}
                className={`w-7 h-7 rounded-full text-[10px] font-bold flex items-center justify-center ${
                  i === currentLayer ? 'bg-[#C9A24A] text-[#0B1B2B]'
                  : values[c.key] ? 'bg-[#556B57] text-[#F5F1E8]'
                  : 'bg-[#F5F1E8]/10 text-[#F5F1E8]/30'
                }`}
              >
                {values[c.key] ? <CheckCircle className="w-3 h-3" /> : i + 1}
              </button>
              {i < CAMADAS.length - 1 && <ChevronRight className="w-3 h-3 text-[#F5F1E8]/20" />}
            </div>
          ))}
        </div>

        {/* Current layer */}
        <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
          <CardHeader>
            <CardTitle className="text-sm text-[#C9A24A]">Camada {currentLayer + 1}: {camada.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={values[camada.key] || ''}
              onChange={e => setValues(prev => ({ ...prev, [camada.key]: e.target.value }))}
              className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8] min-h-[120px]"
              placeholder={camada.placeholder}
            />
            <div className="flex gap-2 mt-4">
              {currentLayer > 0 && (
                <Button variant="outline" onClick={() => setCurrentLayer(currentLayer - 1)} className="flex-1 border-[#C9A24A]/10 text-[#F5F1E8]/60">Voltar</Button>
              )}
              {currentLayer < CAMADAS.length - 1 ? (
                <Button onClick={() => setCurrentLayer(currentLayer + 1)} className="flex-1 bg-[#C9A24A] hover:bg-[#C9A24A]/80 text-[#0B1B2B]">Próxima</Button>
              ) : (
                <Button onClick={handleSave} disabled={saving} className="flex-1 bg-[#C9A24A] hover:bg-[#C9A24A]/80 text-[#0B1B2B]">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar Registro'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </CasaMaquinasLayout>
  );
}
