import { Lock, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNarroterapiaAutorizacao, PreRequisitos } from '@/hooks/useNarroterapiaAutorizacao';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface PreRequisitItemProps {
  label: string;
  fulfilled: boolean;
}

function PreRequisitItem({ label, fulfilled }: PreRequisitItemProps) {
  return (
    <div className="flex items-center gap-3 text-sm">
      {fulfilled ? (
        <Check className="w-4 h-4 text-emerald-500" />
      ) : (
        <AlertCircle className="w-4 h-4 text-muted-foreground" />
      )}
      <span className={cn(
        fulfilled ? 'text-foreground' : 'text-muted-foreground'
      )}>
        {label}
      </span>
    </div>
  );
}

export default function RitualGatekeeper() {
  const navigate = useNavigate();
  const {
    isLoading,
    preRequisitos,
    podeIniciarRitual,
    ritualIniciado,
    movimentoAtual,
    suspenso,
    iniciarRitual,
    isInicializando,
    isAdmin,
  } = useNarroterapiaAutorizacao();

  const handleIniciarRitual = async () => {
    try {
      await iniciarRitual();
      navigate('/narroterapia/ritual');
    } catch (error) {
      console.error('Erro ao iniciar ritual:', error);
    }
  };

  const handleContinuarRitual = () => {
    navigate('/narroterapia/ritual');
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Se suspenso, mostra mensagem específica
  if (suspenso) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-card/50 border-destructive/30">
          <CardContent className="p-8 text-center">
            <Lock className="w-12 h-12 mx-auto mb-6 text-destructive/70" />
            <h2 className="text-xl font-display text-destructive mb-4">
              Autorização Suspensa
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Sua autorização para a Narroterapia Oracular™ foi suspensa. 
              Entre em contato com a administração para mais informações.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12">
      <div className="max-w-lg mx-auto px-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-8">
            {/* Ícone */}
            <div className="flex justify-center mb-8">
              <div className="p-4 rounded-full bg-muted/50">
                <Lock className="w-8 h-8 text-gold" />
              </div>
            </div>

            {/* Mensagem principal */}
            <div className="text-center mb-8">
              <p className="text-lg font-display text-foreground/90 italic leading-relaxed">
                "Esta Porta não se abre por curiosidade.
                <br />
                Ela se abre por maturidade."
              </p>
            </div>

            {/* Pré-requisitos */}
            {!isAdmin && (
              <div className="space-y-3 mb-8 p-4 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                  Pré-requisitos
                </p>
                <PreRequisitItem 
                  label="Formação Orácula concluída" 
                  fulfilled={preRequisitos?.formacaoConcluida ?? false} 
                />
                <PreRequisitItem 
                  label="Termo Ético geral aceito" 
                  fulfilled={preRequisitos?.termoEticoAceito ?? false} 
                />
                <PreRequisitItem 
                  label="Supervisão final validada" 
                  fulfilled={preRequisitos?.supervisaoValidada ?? false} 
                />
              </div>
            )}

            {isAdmin && (
              <div className="mb-8 p-4 bg-gold/10 rounded-lg border border-gold/20">
                <p className="text-xs text-gold text-center">
                  Acesso administrativo — pré-requisitos ignorados
                </p>
              </div>
            )}

            {/* Botão */}
            <div className="text-center">
              {ritualIniciado && movimentoAtual ? (
                <Button
                  variant="mystical"
                  size="lg"
                  onClick={handleContinuarRitual}
                  className="px-8"
                >
                  <span className="mr-2">🜂</span>
                  Continuar Ritual
                </Button>
              ) : (
                <Button
                  variant="mystical"
                  size="lg"
                  onClick={handleIniciarRitual}
                  disabled={!podeIniciarRitual || isInicializando}
                  className={cn(
                    'px-8 transition-all',
                    !podeIniciarRitual && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {isInicializando ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : podeIniciarRitual ? (
                    <span className="mr-2">🜂</span>
                  ) : (
                    <Lock className="w-4 h-4 mr-2" />
                  )}
                  {podeIniciarRitual ? 'Entrar no Ritual' : 'Iniciar Ritual de Autorização'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
