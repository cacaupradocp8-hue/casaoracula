import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save, FileText, User, Phone, Mail, Calendar, Heart, Baby, FileTextIcon } from 'lucide-react';
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
  const [email, setEmail] = useState(cliente.email || '');
  const [telefone, setTelefone] = useState(cliente.telefone || '');
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
        email: email.trim().toLowerCase() || null,
        telefone: telefone.trim() || null,
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
    <div className="space-y-4 max-w-2xl">
      {/* Convite ao Jardim */}
      <ClienteConviteSection cliente={cliente} onUpdate={onUpdate} />

      {/* Dados Pessoais */}
      <Card className="border-border/30 bg-card/70">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-foreground/80">
            <User className="w-4 h-4 text-primary/60" />
            Dados Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Nome completo</Label>
            <Input value={nome} onChange={e => setNome(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-muted-foreground" />
                Email
              </Label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="cliente@email.com"
              />
            </div>
            <div>
              <Label className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-muted-foreground" />
                Telefone
              </Label>
              <Input
                type="tel"
                value={telefone}
                onChange={e => setTelefone(e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                Data de nascimento
              </Label>
              <Input type="date" value={dataNascimento} onChange={e => setDataNascimento(e.target.value)} />
              {idade !== null && (
                <p className="mt-1 text-xs text-muted-foreground">{idade} anos</p>
              )}
            </div>
            <div>
              <Label className="flex items-center gap-1.5">
                <Heart className="w-3 h-3 text-muted-foreground" />
                Estado civil
              </Label>
              <Input value={estadoCivil} onChange={e => setEstadoCivil(e.target.value)} placeholder="Ex: casada" />
            </div>
          </div>

          <div className="w-1/2">
            <Label className="flex items-center gap-1.5">
              <Baby className="w-3 h-3 text-muted-foreground" />
              Filhos
            </Label>
            <Input
              type="number"
              min="0"
              inputMode="numeric"
              value={numeroFilhos}
              onChange={e => setNumeroFilhos(e.target.value)}
              placeholder="Quantidade"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contexto Clínico */}
      <Card className="border-border/30 bg-card/70">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-foreground/80">
            <FileTextIcon className="w-4 h-4 text-primary/60" />
            Contexto Clínico
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Objetivo Terapêutico</Label>
            <Textarea value={objetivo} onChange={e => setObjetivo(e.target.value)} placeholder="Qual a demanda principal da cliente?" />
          </div>

          <div>
            <Label>Informações relevantes</Label>
            <Textarea
              value={informacoesRelevantes}
              onChange={e => setInformacoesRelevantes(e.target.value)}
              placeholder="Profissão, contexto familiar, saúde, marcos importantes, observações clínicas iniciais..."
              className="min-h-[100px]"
            />
          </div>

          <div>
            <Label>Observações internas</Label>
            <Textarea
              value={obs}
              onChange={e => setObs(e.target.value)}
              placeholder="Notas visíveis apenas para você..."
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={saving} className="gap-2 flex-1">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Salvar Perfil
        </Button>
        <Button onClick={handleGenerateReport} disabled={generatingReport} variant="outline" className="gap-2">
          {generatingReport ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
          Relatório
        </Button>
      </div>
    </div>
  );
}
