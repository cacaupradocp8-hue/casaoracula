import { useParams, Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { 
  BookOpenCheck, 
  Home, 
  ChevronRight, 
  AlertTriangle, 
  User, 
  Users, 
  Sparkles,
  Eye,
  Shield,
  Globe,
  ArrowLeft,
  DoorOpen,
  ClipboardPen,
  Lock,
  ShieldAlert,
  Headphones,
  Ban,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CartografiaReacaoModal } from '@/components/narroterapia/CartografiaReacaoModal';
import { 
  useContoClinicoAccess, 
  getRiskLevelStyle,
  type ContoClinicoMetadata,
  type NivelRisco,
  type TipoUso
} from '@/hooks/useContoClinicoAccess';
import { useEffectivePortal } from '@/hooks/useEffectivePortal';

type IntentionType = 'individual' | 'grupo' | 'ritualistico';

export default function ContoClinicoDetalhe() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedIntention, setSelectedIntention] = useState<IntentionType | null>(null);
  const [showCartografia, setShowCartografia] = useState(false);
  const [acknowledgedWarning, setAcknowledgedWarning] = useState(false);
  const { isAdmin } = useEffectivePortal();

  // Fetch clinical tale by slug with all metadata
  const { data: conto, isLoading, error } = useQuery({
    queryKey: ['conto-clinico', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contos_clinicos')
        .select('*')
        .eq('slug', slug)
        .eq('ativo', true)
        .single();

      if (error) throw error;
      
      // Cast with defaults for new fields
      return {
        ...data,
        nivel_risco: data.nivel_risco || 'baixo',
        tipo_uso: data.tipo_uso || 'estudo',
        exige_certificacao: data.exige_certificacao || false,
        permite_grupo: data.permite_grupo ?? true,
        permite_crise_aguda: data.permite_crise_aguda || false,
        restricoes_combinacao: data.restricoes_combinacao || [],
        exige_cartografia: data.exige_cartografia || false,
        audio_padrao_disponivel: data.audio_padrao_disponivel || false,
      } as ContoClinicoMetadata;
    },
    enabled: !!slug,
  });

  const accessResult = useContoClinicoAccess(conto || null);
  const riskStyle = conto ? getRiskLevelStyle(conto.nivel_risco) : null;

  const intentions: { type: IntentionType; label: string; icon: React.ReactNode; posture: string; allowed: boolean }[] = [
    { 
      type: 'individual', 
      label: 'Individual', 
      icon: <User className="w-4 h-4" />,
      posture: 'Mantenha presença silenciosa. O conto trabalha sozinho.',
      allowed: true
    },
    { 
      type: 'grupo', 
      label: 'Grupo', 
      icon: <Users className="w-4 h-4" />,
      posture: 'Sustente o campo coletivo. Não direcione reações.',
      allowed: conto?.permite_grupo ?? true
    },
    { 
      type: 'ritualistico', 
      label: 'Ritualístico', 
      icon: <Sparkles className="w-4 h-4" />,
      posture: 'O ritual é continente. A palavra é sagrada.',
      allowed: true
    },
  ];

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl">
          <Skeleton className="h-6 w-1/2 mb-6" />
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-64 w-full mb-6" />
          <Skeleton className="h-32 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (error || !conto) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl">
          <Card className="text-center py-12 border-destructive/50">
            <CardContent>
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-destructive" />
              <p className="text-destructive mb-4">Conto não encontrado</p>
              <Button asChild variant="outline">
                <Link to="/narroterapia/clinica">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar à Câmara
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  // Access blocked - show locked state
  if (!accessResult.hasAccess) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Home className="w-3 h-3" />
              Casa
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/narroterapia" className="hover:text-foreground transition-colors">
              Narroterapia
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">Acesso Restrito</span>
          </nav>

          <Card className="border-amber-500/30">
            <CardContent className="py-12 text-center">
              <Lock className="w-16 h-16 mx-auto mb-6 text-amber-500" />
              <h2 className="text-xl font-display font-bold mb-2">Acesso Restrito</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {accessResult.reason}
              </p>
              
              {accessResult.blockReason === 'no_certification' && (
                <Alert className="text-left max-w-md mx-auto mb-6 border-amber-500/30">
                  <ShieldAlert className="w-4 h-4" />
                  <AlertTitle>Certificação Necessária</AlertTitle>
                  <AlertDescription className="text-sm">
                    Para acessar este conto clínico, é necessário possuir certificação 
                    ativa no programa Narroterapia Oracular™. O histórico permanece 
                    disponível para consulta.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3 justify-center">
                <Button asChild variant="outline">
                  <Link to="/narroterapia/clinica">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar à Câmara
                  </Link>
                </Button>
                <Button asChild variant="default">
                  <Link to="/formacao-oracula">
                    Ver Formação
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  // Show ethical warning for high-risk tales before access
  if (accessResult.requiresWarning && !acknowledgedWarning && !isAdmin) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Home className="w-3 h-3" />
              Casa
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/narroterapia" className="hover:text-foreground transition-colors">
              Narroterapia
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">Aviso Ético</span>
          </nav>

          <Card className="border-destructive/50">
            <CardContent className="py-8">
              <div className="text-center mb-6">
                <ShieldAlert className="w-16 h-16 mx-auto mb-4 text-destructive" />
                <h2 className="text-xl font-display font-bold mb-2">Conto de Alto Risco</h2>
                <Badge className={cn("mb-4", riskStyle?.className)}>
                  {riskStyle?.label}
                </Badge>
              </div>
              
              <Alert className="border-destructive/50 bg-destructive/5 mb-6">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <AlertTitle className="text-destructive">Aviso Ético Obrigatório</AlertTitle>
                <AlertDescription className="text-sm mt-2">
                  {conto.aviso_etico || 
                    'Este conto possui conteúdo que pode mobilizar camadas psíquicas profundas. ' +
                    'O uso inadequado pode causar desestabilização emocional. ' +
                    'A Cartografia da Reação Simbólica é obrigatória após o uso.'}
                </AlertDescription>
              </Alert>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Cartografia Obrigatória</p>
                    <p className="text-xs text-muted-foreground">
                      Você deverá registrar a reação simbólica após o uso deste conto
                    </p>
                  </div>
                </div>
                
                {!conto.permite_crise_aguda && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Ban className="w-5 h-5 text-destructive mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Contraindicado em Crise Aguda</p>
                      <p className="text-xs text-muted-foreground">
                        Não utilize este conto durante crises emocionais agudas
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-center">
                <Button asChild variant="outline">
                  <Link to="/narroterapia/clinica">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Link>
                </Button>
                <Button 
                  variant="default" 
                  onClick={() => setAcknowledgedWarning(true)}
                  className="gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Compreendo e Aceito
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/narroterapia" className="hover:text-foreground transition-colors">
            Narroterapia
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/narroterapia/clinica" className="hover:text-foreground transition-colors">
            Câmara
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground truncate max-w-[150px]">{conto.titulo}</span>
        </nav>

        {/* Header with Metadata Badges */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gold/10 text-gold">
              <BookOpenCheck className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-display font-bold text-foreground">
                {conto.titulo}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {conto.porta_psiquica && (
                  <Badge variant="outline" className="border-gold/50 text-gold gap-1">
                    <DoorOpen className="w-3 h-3" />
                    {conto.porta_psiquica}
                  </Badge>
                )}
                {riskStyle && (
                  <Badge className={riskStyle.className}>
                    {riskStyle.label}
                  </Badge>
                )}
                {conto.tipo_uso === 'clinico_autorizado' && (
                  <Badge variant="outline" className="border-sage/50 text-sage gap-1">
                    <Shield className="w-3 h-3" />
                    Uso Clínico
                  </Badge>
                )}
                {conto.audio_padrao_disponivel && (
                  <Badge variant="outline" className="gap-1">
                    <Headphones className="w-3 h-3" />
                    Áudio
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Secondary metadata row */}
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
            {conto.eixo_simbolico && (
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Eixo: {conto.eixo_simbolico}
              </div>
            )}
            {conto.origem_cultural && (
              <div className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {conto.origem_cultural}
              </div>
            )}
          </div>
        </div>

        {/* Usage Restrictions Alert */}
        {(!conto.permite_grupo || !conto.permite_crise_aguda || conto.restricoes_combinacao.length > 0) && (
          <Alert className="mb-6 border-amber-500/30 bg-amber-500/5">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <AlertTitle className="text-amber-200">Restrições de Uso</AlertTitle>
            <AlertDescription className="text-sm mt-2 space-y-1">
              {!conto.permite_grupo && (
                <p>• Não recomendado para uso em grupo</p>
              )}
              {!conto.permite_crise_aguda && (
                <p>• Contraindicado durante crise aguda</p>
              )}
              {conto.restricoes_combinacao.length > 0 && (
                <p>• Não combinar com: {conto.restricoes_combinacao.join(', ')}</p>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Tale Content */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <p className="text-foreground leading-relaxed whitespace-pre-line">
              {conto.texto_conto}
            </p>
          </CardContent>
        </Card>

        <Separator className="my-6" />

        {/* Clinical Sections */}
        <div className="space-y-6">
          {/* When to Use */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-display flex items-center gap-2">
                <Eye className="w-4 h-4 text-gold" />
                Quando usar clinicamente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {conto.quando_usar}
              </p>
            </CardContent>
          </Card>

          {/* What to Observe */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-display flex items-center gap-2">
                <Eye className="w-4 h-4 text-sage-light" />
                O que observar na reação da cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {conto.o_que_observar}
              </p>
            </CardContent>
          </Card>

          {/* Risks */}
          <Card className="border-amber-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-display flex items-center gap-2 text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Riscos de uso inadequado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-amber-200/80 leading-relaxed whitespace-pre-line">
                {conto.riscos_uso_inadequado}
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-6" />

        {/* Intention Buttons */}
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
            Intenção de Uso
          </p>
          <div className="flex flex-wrap gap-2">
            {intentions.map((intention) => (
              <Button
                key={intention.type}
                variant={selectedIntention === intention.type ? 'secondary' : 'outline'}
                size="sm"
                disabled={!intention.allowed}
                className={cn(
                  'gap-2',
                  selectedIntention === intention.type && 'border-gold/50 bg-gold/10',
                  !intention.allowed && 'opacity-50 cursor-not-allowed'
                )}
                onClick={() => intention.allowed && setSelectedIntention(
                  selectedIntention === intention.type ? null : intention.type
                )}
              >
                {intention.icon}
                {intention.label}
                {!intention.allowed && <Ban className="w-3 h-3 ml-1" />}
              </Button>
            ))}
          </div>
          
          {/* Posture message when intention selected */}
          {selectedIntention && (
            <Alert className="mt-4 border-gold/30 bg-gold/5">
              <Shield className="w-4 h-4 text-gold" />
              <AlertDescription className="text-gold-light text-sm">
                {intentions.find(i => i.type === selectedIntention)?.posture}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Register Reaction Button - Required for high risk or when exige_cartografia */}
        <div className="mb-6">
          <Button 
            variant={accessResult.requiresCartografia ? 'default' : 'outline'}
            className={cn(
              "w-full gap-2",
              accessResult.requiresCartografia 
                ? "bg-gold/90 hover:bg-gold text-gold-foreground" 
                : "border-gold/50 hover:bg-gold/10"
            )}
            onClick={() => setShowCartografia(true)}
          >
            <ClipboardPen className="w-4 h-4" />
            {accessResult.requiresCartografia 
              ? 'Registrar Reação Simbólica (Obrigatório)'
              : 'Registrar Reação Simbólica'}
          </Button>
          {accessResult.requiresCartografia && (
            <p className="text-xs text-amber-500 mt-2 text-center">
              * A Cartografia é obrigatória para este conto
            </p>
          )}
        </div>

        {/* Fixed Ethical Rule */}
        <div className="p-4 rounded-lg bg-muted/50 border border-border text-center">
          <p className="text-sm text-muted-foreground italic">
            {conto.aviso_etico || (
              <>
                O conto não deve ser explicado.
                <br />
                O conto não deve ser interpretado.
                <br />
                O conto abre campo, não fecha sentido.
              </>
            )}
          </p>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button asChild variant="ghost">
            <Link to="/narroterapia/clinica">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar à Câmara de Narração
            </Link>
          </Button>
        </div>

        {/* Cartografia Modal */}
        <CartografiaReacaoModal
          isOpen={showCartografia}
          onClose={() => setShowCartografia(false)}
          contoClinicoId={conto.id}
          contoTitulo={conto.titulo}
        />
      </div>
    </AppLayout>
  );
}
