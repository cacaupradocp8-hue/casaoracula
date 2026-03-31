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
import { ClienteConviteSection } from './ClienteConviteSection';

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

interface Props {
  cliente: any;
  onUpdate: () => void;
}

export function ClientePerfil({ cliente, onUpdate }: Props) {
  const { user } = useAuth();
  const [nome, setNome] = useState(cliente.nome || '');
  const [objetivo, setObjetivo] = useState(cliente.objetivo_terapeutico || '');
  const [obs, setObs] = useState(cliente.observacao_segura || '');
  const [dataNascimento, setDataNascimento] = useState(cliente.data_nascimento || '');
  const [estadoCivil, setEstadoCivil] = useState(cliente.estado_civil || '');
  const [numeroFilhos, setNumeroFilhos] = useState(
    cliente.numero_filhos === null || cliente.numero_filhos === undefined ? '' : String(cliente.numero_filhos)
  );
  const [informacoesRelevantes, setInformacoesRelevantes] = useState(cliente.informacoes_relevantes || '');
  const [saving, setSaving] = useState(false);
  const [reportData, setReportData] = useState<JourneyReportData | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const idade = getAgeFromBirthDate(dataNascimento);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('clientes')
      .update({
        nome,
        objetivo_terapeutico: objetivo,
        observacao_segura: obs,
        data_nascimento: dataNascimento || null,
        estado_civil: estadoCivil || null,
        numero_filhos: numeroFilhos === '' ? null : Number(numeroFilhos),
        informacoes_relevantes: informacoesRelevantes || null,
      })
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
      <Card className="border-border/30 bg-card/70">
        <CardHeader>
          <CardTitle className="text-sm text-foreground/80">Dados da Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Nome</Label>
            <Input value={nome} onChange={e => setNome(e.target.value)} />
          </div>
          <div>
            <Label>Objetivo Terapêutico</Label>
            <Textarea value={objetivo} onChange={e => setObjetivo(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Data de nascimento</Label>
              <Input type="date" value={dataNascimento} onChange={e => setDataNascimento(e.target.value)} />
              {idade !== null && (
                <p className="mt-1 text-xs text-muted-foreground">Idade calculada: {idade} anos</p>
              )}
            </div>
            <div>
              <Label>Estado civil</Label>
              <Input value={estadoCivil} onChange={e => setEstadoCivil(e.target.value)} placeholder="Ex: casada" />
            </div>
          </div>
          <div>
            <Label>Filhos</Label>
            <Input
              type="number"
              min="0"
              inputMode="numeric"
              value={numeroFilhos}
              onChange={e => setNumeroFilhos(e.target.value)}
              placeholder="Quantidade de filhos"
            />
          </div>
          <div>
            <Label>Informações relevantes</Label>
            <Textarea
              value={informacoesRelevantes}
              onChange={e => setInformacoesRelevantes(e.target.value)}
              placeholder="Contexto familiar, profissão, marcos importantes, saúde, observações clínicas iniciais..."
            />
          </div>
          <div>
            <Label>Observações</Label>
            <Textarea value={obs} onChange={e => setObs(e.target.value)} />
          </div>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/30 bg-card/70">
        <CardContent className="p-4">
          <Button onClick={handleGenerateReport} disabled={generatingReport} variant="outline"
            className="w-full gap-2">
            {generatingReport ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            Gerar Relatório de Jornada
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
