import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  cliente: any;
  onUpdate: () => void;
}

export function ClientePerfil({ cliente, onUpdate }: Props) {
  const [nome, setNome] = useState(cliente.nome || '');
  const [objetivo, setObjetivo] = useState(cliente.objetivo_terapeutico || '');
  const [obs, setObs] = useState(cliente.observacao_segura || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('clientes')
      .update({ nome, objetivo_terapeutico: objetivo, observacao_segura: obs })
      .eq('id', cliente.id);

    if (error) {
      toast.error('Erro ao salvar');
    } else {
      toast.success('Perfil atualizado');
      onUpdate();
    }
    setSaving(false);
  };

  return (
    <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60 max-w-lg">
      <CardHeader>
        <CardTitle className="text-sm text-[#F5F1E8]/80">Dados da Cliente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-[#F5F1E8]/70">Nome</Label>
          <Input value={nome} onChange={e => setNome(e.target.value)} className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]" />
        </div>
        <div>
          <Label className="text-[#F5F1E8]/70">Objetivo Terapêutico</Label>
          <Textarea value={objetivo} onChange={e => setObjetivo(e.target.value)} className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]" />
        </div>
        <div>
          <Label className="text-[#F5F1E8]/70">Observações</Label>
          <Textarea value={obs} onChange={e => setObs(e.target.value)} className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]" />
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-[#C9A24A] hover:bg-[#C9A24A]/80 text-[#0B1B2B] gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Salvar
        </Button>
      </CardContent>
    </Card>
  );
}
