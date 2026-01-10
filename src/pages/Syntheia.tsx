import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Users, Flame, Package, BookOpen, Library, AlertTriangle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { SyntheiaTipo } from '@/types/syntheia';

const TIPO_OPTIONS = [
  { value: 'sessao_individual' as SyntheiaTipo, label: 'Sessão Individual', icon: User, description: 'Estruture uma sessão terapêutica individual' },
  { value: 'experiencia_grupo' as SyntheiaTipo, label: 'Experiência de Grupo', icon: Users, description: 'Crie uma experiência para grupos' },
  { value: 'ritual' as SyntheiaTipo, label: 'Ritual', icon: Flame, description: 'Desenhe um ritual simbólico' },
  { value: 'produto_programa' as SyntheiaTipo, label: 'Produto / Programa', icon: Package, description: 'Estruture um produto ou programa' },
  { value: 'aula_conteudo' as SyntheiaTipo, label: 'Aula / Conteúdo', icon: BookOpen, description: 'Crie uma aula ou conteúdo formativo' },
];

export default function Syntheia() {
  const navigate = useNavigate();
  const [showDisclaimer, setShowDisclaimer] = useState(() => {
    return !localStorage.getItem('syntheia-disclaimer-accepted');
  });

  const handleAcceptDisclaimer = () => {
    localStorage.setItem('syntheia-disclaimer-accepted', 'true');
    setShowDisclaimer(false);
  };

  const handleSelectTipo = (tipo: SyntheiaTipo) => {
    navigate(`/syntheia/criar?tipo=${tipo}`);
  };

  if (showDisclaimer) {
    return (
      <AppLayout>
        <div className="min-h-[80vh] flex items-center justify-center p-4">
          <Card className="max-w-lg w-full">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">SYNTHEIA</h1>
                <p className="text-muted-foreground">
                  Ferramenta profissional de apoio simbólico
                </p>
              </div>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-left">
                  Esta ferramenta foi projetada para apoiar profissionais treinados.
                  Ela não substitui terapia, diagnóstico ou julgamento clínico.
                </AlertDescription>
              </Alert>
              <Button onClick={handleAcceptDisclaimer} className="w-full">
                Entendi e aceito continuar
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">SYNTHEIA</h1>
          <p className="text-lg text-muted-foreground">
            O que você quer criar hoje?
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {TIPO_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <Card 
                key={option.value}
                className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
                onClick={() => handleSelectTipo(option.value)}
              >
                <CardContent className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">{option.label}</h3>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/syntheia/biblioteca')}
            className="gap-2"
          >
            <Library className="w-4 h-4" />
            Acessar Biblioteca
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
