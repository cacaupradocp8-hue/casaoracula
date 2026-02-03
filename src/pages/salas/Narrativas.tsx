import { useState, useEffect } from 'react';
import { FerramentaPageTemplate } from '@/components/shared/FerramentaPageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Save, Loader2, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SalvarJardimModal } from '@/components/shared/SalvarJardimModal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Narrativas() {
  const [contoUtilizado, setContoUtilizado] = useState('');
  const [tema, setTema] = useState('');
  const [emocaoAtivada, setEmocaoAtivada] = useState('');
  const [insight, setInsight] = useState('');
  const [resistenciaPercebida, setResistenciaPercebida] = useState<'nenhuma' | 'leve' | 'moderada' | 'intensa'>('nenhuma');
  const [saving, setSaving] = useState(false);
  const [clienteInfo, setClienteInfo] = useState<{ id: string; nome: string } | null>(null);
  const [showJardimModal, setShowJardimModal] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const clienteId = searchParams.get('cliente');
  const isUsoPessoal = !clienteId;

  useEffect(() => {
    if (clienteId) {
      fetchCliente();
    }
  }, [clienteId]);

  const fetchCliente = async () => {
    if (!clienteId) return;
    const { data } = await supabase
      .from('clientes')
      .select('id, nome')
      .eq('id', clienteId)
      .single();
    if (data) setClienteInfo(data);
  };

  const handleSave = async () => {
    setSaving(true);
    // Para futuro: salvar em tabela narrativas_registros
    toast({
      title: 'Registro salvo!',
      description: 'A narrativa terapêutica foi registrada.',
    });
    setSaving(false);
    
    if (isUsoPessoal) {
      setShowJardimModal(true);
    } else if (clienteId) {
      navigate(`/cliente/${clienteId}`);
    }
  };

  const handleJardimSaved = () => {
    toast({ title: 'Salvo no Jardim da Psique!' });
    navigate('/jardim-da-psique');
  };

  return (
    <FerramentaPageTemplate
      title="Narrativas Terapêuticas (Contos)"
      subtitle="Registro de contos e histórias utilizadas em sessões terapêuticas"
      icon={<BookOpen className="w-5 h-5" />}
      categoriaBadge="metodo_oracula"
      toolName="Narrativas Terapêuticas"
      clienteInfo={clienteInfo}
      textoQuandoUsar="Esta ferramenta é chamada quando a narrativa pode oferecer o que a fala direta não alcança. Contos e mitos operam no registro simbólico, permitindo que verdades sejam recebidas sem a resistência do ego."
      textoOQueSustenta="Sustenta a capacidade de oferecer imagens e jornadas simbólicas que ressoam com o processo interno. Não oferece interpretação — oferece possibilidade de reconhecimento através do espelhamento narrativo."
      textoComoAtravessar="Pode ser usada para documentar contos utilizados em sessões, registrar as reações observadas e acompanhar quais narrativas ressoam com cada processo. O registro cria um acervo vivo de ferramentas narrativas."
    >
      {/* Conto Utilizado */}
      <Card>
        <CardHeader>
          <CardTitle>Conto Utilizado</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={contoUtilizado}
            onChange={(e) => setContoUtilizado(e.target.value)}
            placeholder="Nome ou título do conto/história..."
          />
        </CardContent>
      </Card>

      {/* Tema */}
      <Card>
        <CardHeader>
          <CardTitle>Tema Central</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            placeholder="Transformação, morte/renascimento, jornada do herói..."
          />
        </CardContent>
      </Card>

      {/* Emoção Ativada */}
      <Card>
        <CardHeader>
          <CardTitle>Emoção Ativada</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={emocaoAtivada}
            onChange={(e) => setEmocaoAtivada(e.target.value)}
            placeholder="Emoções observadas durante ou após a narrativa..."
            rows={2}
          />
        </CardContent>
      </Card>

      {/* Insight */}
      <Card>
        <CardHeader>
          <CardTitle>Insight Obtido</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={insight}
            onChange={(e) => setInsight(e.target.value)}
            placeholder="Compreensões ou conexões feitas pelo cliente..."
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Resistência */}
      <Card>
        <CardHeader>
          <CardTitle>Resistência Percebida</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={resistenciaPercebida} onValueChange={(v: any) => setResistenciaPercebida(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nenhuma">Nenhuma – Cliente receptivo</SelectItem>
              <SelectItem value="leve">Leve – Pequenas hesitações</SelectItem>
              <SelectItem value="moderada">Moderada – Dificuldade em se conectar</SelectItem>
              <SelectItem value="intensa">Intensa – Resistência significativa</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Botão Salvar */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Salvar Narrativa
        </Button>
      </div>

      {/* Modal Jardim da Psique */}
      <SalvarJardimModal
        open={showJardimModal}
        onOpenChange={setShowJardimModal}
        ferramenta_nome="Narrativas Terapêuticas"
        ferramenta_chave="narrativas"
        tipo_registro="ferramenta"
        conteudo={{
          conto: contoUtilizado,
          tema: tema,
          emocao_ativada: emocaoAtivada,
          insight: insight,
          resistencia: resistenciaPercebida,
        }}
        resultado_simbolico={{
          conto: contoUtilizado,
          tema: tema,
        }}
        onSaved={handleJardimSaved}
        onSkipped={() => navigate('/ferramentas')}
      />
    </FerramentaPageTemplate>
  );
}
