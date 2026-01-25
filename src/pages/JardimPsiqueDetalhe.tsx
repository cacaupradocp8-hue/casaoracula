// ============================================
// JARDIM DA PSIQUE - DETALHE DO REGISTRO
// ============================================
// Visualização completa de uma leitura salva

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ContentPageLayout } from '@/components/shared/ContentPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Leaf,
  Calendar,
  CheckCircle2,
  Archive,
  ArchiveRestore,
  Save,
  Sparkles,
  FileDown,
  Moon,
  Quote,
  FileText,
  PenLine,
  Compass,
  BookOpen,
} from 'lucide-react';
import { exportJardimRegistroAsPdf } from '@/lib/exportPdf';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useJardimPsique, JardimRegistro, TipoRegistroJardim } from '@/hooks/useJardimPsique';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Mapa de nomes amigáveis
const FERRAMENTA_LABELS: Record<string, string> = {
  'big5-simbolico': 'Mapa dos Cinco Territórios',
  'eneagrama-feminino': 'Oráculo dos Nove Arquétipos',
  'mapa-arquetipos': 'Mapa dos Arquétipos',
  'jornada-heroina': 'Jornada da Heroína',
  '5-camadas': 'Leitura em 5 Camadas',
  'radar-eixo': 'Radar de Eixo',
  'trilha-neuroplasticidade': 'Trilha de Neuroplasticidade',
  radiestesia: 'Radiestesia',
  labirinto: 'Labirinto Oracular',
  tarot: 'Tarot Simbólico',
  sonho: 'Registro de Sonho',
  frase: 'Frase Guardada',
  fragmento: 'Fragmento de Sessão',
  reflexao: 'Reflexão Pessoal',
  oraculo: 'Tiragem de Oráculo',
};

// Configuração de tipos de registro
const TIPO_CONFIG: Record<TipoRegistroJardim, { icon: React.ElementType; label: string; color: string }> = {
  ferramenta: { icon: Compass, label: 'Ferramenta', color: 'text-purple-400' },
  sonho: { icon: Moon, label: 'Sonho', color: 'text-indigo-400' },
  frase: { icon: Quote, label: 'Frase', color: 'text-amber-400' },
  fragmento: { icon: FileText, label: 'Fragmento', color: 'text-blue-400' },
  oraculo: { icon: Sparkles, label: 'Oráculo', color: 'text-gold' },
  reflexao: { icon: PenLine, label: 'Reflexão', color: 'text-emerald-400' },
};

export default function JardimPsiqueDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { getRegistro, atualizarReflexao, marcarIntegrado, arquivarRegistro } =
    useJardimPsique();

  const [registro, setRegistro] = useState<JardimRegistro | null>(null);
  const [loading, setLoading] = useState(true);
  const [reflexaoEditada, setReflexaoEditada] = useState('');
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Detect if coming from /casa/jardim
  const isFromCasa = location.pathname.startsWith('/casa/jardim');
  const backPath = isFromCasa ? '/casa/jardim' : '/jardim-da-psique';

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      const data = await getRegistro(id);
      setRegistro(data);
      setReflexaoEditada(data?.reflexao_pessoal || '');
      setLoading(false);
    };
    fetchData();
  }, [id, getRegistro]);

  useEffect(() => {
    setHasChanges(reflexaoEditada !== (registro?.reflexao_pessoal || ''));
  }, [reflexaoEditada, registro?.reflexao_pessoal]);

  const handleSalvarReflexao = async () => {
    if (!registro) return;
    setSaving(true);
    const success = await atualizarReflexao(registro.id, reflexaoEditada);
    if (success) {
      setRegistro({ ...registro, reflexao_pessoal: reflexaoEditada });
      setHasChanges(false);
    }
    setSaving(false);
  };

  const handleToggleIntegrado = async () => {
    if (!registro) return;
    const success = await marcarIntegrado(registro.id, !registro.integrado);
    if (success) {
      setRegistro({ ...registro, integrado: !registro.integrado });
    }
  };

  const handleToggleArquivar = async () => {
    if (!registro) return;
    const success = await arquivarRegistro(registro.id, !registro.arquivado);
    if (success) {
      toast({
        title: registro.arquivado ? 'Registro restaurado' : 'Registro arquivado',
      });
      navigate(backPath);
    }
  };

  const renderConteudo = () => {
    if (!registro?.conteudo) return null;

    const entries = Object.entries(registro.conteudo);
    if (entries.length === 0) return null;

    // For manual entries (sonho, frase, etc.) show content differently
    if (registro.tipo_registro !== 'ferramenta') {
      const texto = registro.conteudo.texto as string;
      if (!texto) return null;

      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Conteúdo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground whitespace-pre-wrap leading-relaxed">
              {texto}
            </p>
            {registro.fonte && (
              <p className="mt-4 text-sm text-muted-foreground italic">
                Fonte: {registro.fonte}
              </p>
            )}
          </CardContent>
        </Card>
      );
    }

    // For ferramentas, show structured content
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Respostas da Leitura</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {entries.map(([key, value]) => (
            <div key={key} className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground capitalize">
                {key.replace(/_/g, ' ')}
              </p>
              <p className="text-sm text-foreground">
                {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  const renderResultadoSimbolico = () => {
    if (!registro?.resultado_simbolico) return null;

    const entries = Object.entries(registro.resultado_simbolico);
    if (entries.length === 0) return null;

    return (
      <Card className="border-gold/30 bg-gold/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" />
            Resultado Simbólico
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {entries.map(([key, value]) => (
            <div key={key} className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground capitalize">
                {key.replace(/_/g, ' ')}
              </p>
              <p className="text-sm text-foreground">
                {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <AppLayout>
        <ContentPageLayout
          title="Carregando..."
          onBack={() => navigate(backPath)}
          backLabel="Voltar ao Jardim"
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </ContentPageLayout>
      </AppLayout>
    );
  }

  if (!registro) {
    return (
      <AppLayout>
        <ContentPageLayout
          title="Registro não encontrado"
          onBack={() => navigate(backPath)}
          backLabel="Voltar ao Jardim"
          maxWidth="2xl"
        >
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Este registro não existe ou você não tem acesso a ele.
              </p>
            </CardContent>
          </Card>
        </ContentPageLayout>
      </AppLayout>
    );
  }

  const dataFormatada = format(
    new Date(registro.data_aplicacao),
    "d 'de' MMMM 'de' yyyy, 'às' HH:mm",
    { locale: ptBR }
  );

  const tipoConfig = TIPO_CONFIG[registro.tipo_registro] || TIPO_CONFIG.ferramenta;
  const TipoIcon = tipoConfig.icon;
  const displayTitle = registro.titulo || 
    FERRAMENTA_LABELS[registro.ferramenta_chave] || 
    registro.ferramenta_nome;

  return (
    <AppLayout>
      <ContentPageLayout
        title={displayTitle}
        subtitle={dataFormatada}
        badge="Registro Privado"
        badgeIcon={<Leaf className="w-4 h-4 text-emerald-500" />}
        onBack={() => navigate(backPath)}
        backLabel="Voltar ao Jardim"
        maxWidth="2xl"
      >
        {/* Status badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="outline" className={cn("gap-1", tipoConfig.color)}>
            <TipoIcon className="w-3 h-3" />
            {tipoConfig.label}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Calendar className="w-3 h-3" />
            {format(new Date(registro.data_aplicacao), 'dd/MM/yyyy')}
          </Badge>
          {registro.emocao_predominante && (
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="w-3 h-3" />
              {registro.emocao_predominante}
            </Badge>
          )}
          {registro.integrado && (
            <Badge variant="outline" className="gap-1 text-emerald-500 border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3" />
              Integrado
            </Badge>
          )}
          {registro.arquivado && (
            <Badge variant="secondary" className="gap-1">
              <Archive className="w-3 h-3" />
              Arquivado
            </Badge>
          )}
        </div>

        {/* Conteúdo da leitura */}
        <div className="space-y-6">
          {renderConteudo()}
          {renderResultadoSimbolico()}

          <Separator />

          {/* Reflexão pessoal (editável) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reflexões da Tecelã</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="O que essa leitura despertou em você? Anote livremente..."
                value={reflexaoEditada}
                onChange={(e) => setReflexaoEditada(e.target.value)}
                className="min-h-[120px] resize-none"
              />
              {hasChanges && (
                <Button
                  onClick={handleSalvarReflexao}
                  disabled={saving}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Salvando...' : 'Salvar reflexão'}
                </Button>
              )}
            </CardContent>
          </Card>

          <Separator />

          {/* Ações */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => exportJardimRegistroAsPdf(registro)}
              className="gap-2"
            >
              <FileDown className="w-4 h-4" />
              Exportar PDF
            </Button>

            <Button
              variant={registro.integrado ? 'secondary' : 'outline'}
              onClick={handleToggleIntegrado}
              className="gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {registro.integrado ? 'Desmarcar integrado' : 'Marcar como integrado'}
            </Button>

            <Button
              variant="outline"
              onClick={handleToggleArquivar}
              className="gap-2"
            >
              {registro.arquivado ? (
                <>
                  <ArchiveRestore className="w-4 h-4" />
                  Restaurar
                </>
              ) : (
                <>
                  <Archive className="w-4 h-4" />
                  Arquivar
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Nota de privacidade */}
        <div className="mt-8 p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-center">
          <p className="text-sm text-muted-foreground">
            🔒 Este registro é <strong>100% privado</strong>. Apenas você tem acesso.
          </p>
        </div>
      </ContentPageLayout>
    </AppLayout>
  );
}
