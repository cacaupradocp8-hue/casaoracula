import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Save, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { gatherReportData, type JourneyReportData } from '@/lib/journey-report';
import { JourneyReportPreview } from './JourneyReportPreview';

interface Props {
  cliente: any;
  onUpdate: () => void;
}

export function ClientePerfil({ cliente, onUpdate }: Props) {
  const { user } = useAuth();
  const [nome, setNome] = useState(cliente.nome || '');
  const [objetivo, setObjetivo] = useState(cliente.objetivo_terapeutico || '');
  const [obs, setObs] = useState(cliente.observacao_segura || '');
  const [saving, setSaving] = useState(false);
  const [reportData, setReportData] = useState<JourneyReportData | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);

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

  const handleGenerateReport = async () => {
    if (!user) return;
    setGeneratingReport(true);
    try {
      const data = await gatherReportData(cliente.id, user.id);
      setReportData(data);
    } catch (e) {
      console.error(e);
      toast.error('Erro ao gerar relatório');
    }
    setGeneratingReport(false);
  };

  if (reportData) {
    return <JourneyReportPreview data={reportData} clienteId={cliente.id} onClose={() => setReportData(null)} />;
  }

  return (
    <div className="space-y-4 max-w-lg">
      <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
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

      <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
        <CardContent className="p-4">
          <Button onClick={handleGenerateReport} disabled={generatingReport} variant="outline"
            className="w-full border-[#C9A24A]/20 text-[#C9A24A] hover:bg-[#C9A24A]/10 gap-2">
            {generatingReport ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            Gerar Relatório de Jornada
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
