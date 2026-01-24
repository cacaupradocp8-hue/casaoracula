import { useParams, Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  ArrowLeft
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ContoClinicoFull {
  id: string;
  slug: string;
  titulo: string;
  texto_conto: string;
  quando_usar: string;
  o_que_observar: string;
  riscos_uso_inadequado: string;
  origem_cultural: string | null;
}

type IntentionType = 'individual' | 'grupo' | 'ritualistico';

export default function ContoClinicoDetalhe() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedIntention, setSelectedIntention] = useState<IntentionType | null>(null);

  // Fetch clinical tale by slug
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
      return data as ContoClinicoFull;
    },
    enabled: !!slug,
  });

  const intentions: { type: IntentionType; label: string; icon: React.ReactNode }[] = [
    { type: 'individual', label: 'Individual', icon: <User className="w-4 h-4" /> },
    { type: 'grupo', label: 'Grupo', icon: <Users className="w-4 h-4" /> },
    { type: 'ritualistico', label: 'Ritualístico', icon: <Sparkles className="w-4 h-4" /> },
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
                  Voltar à biblioteca
                </Link>
              </Button>
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
            Biblioteca Clínica
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground truncate max-w-[150px]">{conto.titulo}</span>
        </nav>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gold/10 text-gold">
              <BookOpenCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                {conto.titulo}
              </h1>
              {conto.origem_cultural && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <Globe className="w-3 h-3" />
                  {conto.origem_cultural}
                </div>
              )}
            </div>
          </div>
        </div>

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
                className={cn(
                  'gap-2',
                  selectedIntention === intention.type && 'border-gold/50 bg-gold/10'
                )}
                onClick={() => setSelectedIntention(
                  selectedIntention === intention.type ? null : intention.type
                )}
              >
                {intention.icon}
                {intention.label}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Marcação pessoal – não executa nenhuma ação.
          </p>
        </div>

        {/* Fixed Ethical Rule */}
        <Alert className="border-gold bg-gold/5">
          <Shield className="w-4 h-4 text-gold" />
          <AlertDescription className="text-gold-light font-medium">
            O conto não deve ser explicado nem interpretado.
          </AlertDescription>
        </Alert>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button asChild variant="ghost">
            <Link to="/narroterapia/clinica">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar à Biblioteca Clínica
            </Link>
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
